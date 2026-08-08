export type DomainStatus = "available" | "taken" | "unknown";

export interface CheckResult {
  domain: string;
  status: DomainStatus;
  method: "dns" | "rdap" | "whois" | "none";
  detail?: string;
  /** 到期时间（ISO 字符串），仅 taken 且注册数据可解析时提供 */
  expiresAt?: string;
  /** 注册时间（ISO 字符串），仅 taken 且注册数据可解析时提供 */
  registeredAt?: string;
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

interface RdapEvent {
  eventAction?: string;
  eventDate?: string;
}

/** 从 RDAP 响应的 events 数组提取到期/注册时间（无法解析则返回空对象） */
export function extractRdapDates(data: unknown): { expiresAt?: string; registeredAt?: string } {
  const out: { expiresAt?: string; registeredAt?: string } = {};
  if (typeof data !== "object" || data === null) return out;
  const events = (data as { events?: unknown }).events;
  if (!Array.isArray(events)) return out;
  for (const ev of events as RdapEvent[]) {
    if (typeof ev?.eventAction !== "string" || typeof ev?.eventDate !== "string") continue;
    const ts = Date.parse(ev.eventDate);
    if (!Number.isFinite(ts)) continue;
    const iso = new Date(ts).toISOString();
    if (ev.eventAction === "expiration") out.expiresAt = iso;
    else if (ev.eventAction === "registration") out.registeredAt = iso;
  }
  return out;
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
  // 瞬时失败（网络错误 / 超时 / 429 / 5xx）重试，退避时间尊重 Retry-After（封顶 4s）并加抖动，避免偶发「未知」。
  // 每次请求带 3s 超时：部分注册局（如 Verisign）限流时会拖住连接几十秒不回包，不如快速重试/转 WHOIS 兜底
  const MAX_ATTEMPTS = 3;
  const ATTEMPT_TIMEOUT_MS = 3000;
  let delayMs = 700 + Math.random() * 500;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, delayMs));
    try {
      const res = await fetchFn(url, { headers: { accept: "application/rdap+json" }, signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS) });
      if (res.status === 404) return { domain, status: "available", method: "rdap" };
      if (res.ok) {
        let dates: { expiresAt?: string; registeredAt?: string } = {};
        try {
          dates = extractRdapDates(await res.json());
        } catch { /* 响应体解析失败不影响状态判定 */ }
        return { domain, status: "taken", method: "rdap", ...dates };
      }
      if (attempt < MAX_ATTEMPTS - 1 && (res.status === 429 || res.status >= 500)) {
        const ra = Number(res.headers.get("retry-after"));
        delayMs = Math.min(Number.isFinite(ra) && ra > 0 ? ra * 1000 : delayMs * 2, 4000);
        continue;
      }
      return { domain, status: "unknown", method: "rdap", detail: `http-${res.status}` };
    } catch (e) {
      if (attempt < MAX_ATTEMPTS - 1) continue;
      return { domain, status: "unknown", method: "rdap", detail: String(e) };
    }
  }
  return { domain, status: "unknown", method: "rdap", detail: "retry-exhausted" };
}

export async function checkDomain(domain: string, fetchFn: typeof fetch = fetch): Promise<CheckResult> {
  const hasNs = await dnsHasNs(domain, fetchFn);
  if (hasNs === true) {
    // DNS 已确认被占，再查一次 RDAP 拿到期/注册时间；RDAP 不可用时仍按 DNS 结果返回
    const r = await rdapCheck(domain, fetchFn);
    if (r.status === "taken") return r;
    return { domain, status: "taken", method: "dns" };
  }
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
