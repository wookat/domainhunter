export type DomainStatus = "available" | "taken" | "unknown";

export interface CheckResult {
  domain: string;
  status: DomainStatus;
  method: "dns" | "rdap" | "whois" | "none";
  detail?: string;
}

const IANA_BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";
const DOH_URL = "https://cloudflare-dns.com/dns-query";

interface RdapBootstrap {
  services: [string[], string[]][];
}

let bootstrapCache: { map: Map<string, string>; fetchedAt: number } | null = null;
const BOOTSTRAP_TTL_MS = 24 * 60 * 60 * 1000;

export async function getRdapBase(tld: string, fetchFn: typeof fetch = fetch): Promise<string | null> {
  const now = Date.now();
  if (!bootstrapCache || now - bootstrapCache.fetchedAt > BOOTSTRAP_TTL_MS) {
    const res = await fetchFn(IANA_BOOTSTRAP_URL);
    if (!res.ok) return null;
    const data = (await res.json()) as RdapBootstrap;
    const map = new Map<string, string>();
    for (const [tlds, urls] of data.services) {
      const url = urls.find((u) => u.startsWith("https://")) ?? urls[0];
      for (const t of tlds) map.set(t.toLowerCase(), url);
    }
    bootstrapCache = { map, fetchedAt: now };
  }
  return bootstrapCache.map.get(tld.toLowerCase()) ?? null;
}

export function tldOf(domain: string): string {
  return domain.slice(domain.indexOf(".") + 1);
}

/** DNS pre-screen: if NS records exist the domain is definitely taken. */
export async function dnsHasNs(domain: string, fetchFn: typeof fetch = fetch): Promise<boolean | null> {
  try {
    const res = await fetchFn(`${DOH_URL}?name=${encodeURIComponent(domain)}&type=NS`, {
      headers: { accept: "application/dns-json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { Status: number; Answer?: unknown[] };
    if (data.Status === 0 && data.Answer && data.Answer.length > 0) return true;
    return false;
  } catch {
    return null;
  }
}

export async function rdapCheck(domain: string, fetchFn: typeof fetch = fetch): Promise<CheckResult> {
  const base = await getRdapBase(tldOf(domain), fetchFn);
  if (!base) return { domain, status: "unknown", method: "none", detail: "no-rdap-server" };
  const url = `${base.replace(/\/$/, "")}/domain/${encodeURIComponent(domain)}`;
  // 瞬时失败（网络错误 / 429 / 5xx）重试一次，避免偶发「未知」
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 600));
    try {
      const res = await fetchFn(url, { headers: { accept: "application/rdap+json" } });
      if (res.status === 404) return { domain, status: "available", method: "rdap" };
      if (res.ok) return { domain, status: "taken", method: "rdap" };
      if (attempt === 0 && (res.status === 429 || res.status >= 500)) continue;
      return { domain, status: "unknown", method: "rdap", detail: `http-${res.status}` };
    } catch (e) {
      if (attempt === 0) continue;
      return { domain, status: "unknown", method: "rdap", detail: String(e) };
    }
  }
  return { domain, status: "unknown", method: "rdap", detail: "retry-exhausted" };
}

export async function checkDomain(domain: string, fetchFn: typeof fetch = fetch): Promise<CheckResult> {
  const hasNs = await dnsHasNs(domain, fetchFn);
  if (hasNs === true) return { domain, status: "taken", method: "dns" };
  return rdapCheck(domain, fetchFn);
}

export async function checkDomains(
  domains: string[],
  onResult: (r: CheckResult) => void | Promise<void>,
  concurrency = 8,
  fetchFn: typeof fetch = fetch,
  fallback?: (r: CheckResult) => Promise<CheckResult>,
): Promise<void> {
  let i = 0;
  const worker = async () => {
    while (i < domains.length) {
      const domain = domains[i++];
      let r = await checkDomain(domain, fetchFn);
      if (r.status === "unknown" && fallback) r = await fallback(r);
      await onResult(r);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, domains.length) }, worker));
}
