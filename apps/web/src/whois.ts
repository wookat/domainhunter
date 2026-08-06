import { connect } from "cloudflare:sockets";
import type { CheckResult } from "@domainhunter/core";

const WHOIS_SERVERS: Record<string, { host: string; notFound: RegExp; found: RegExp }> = {
  cn: { host: "whois.cnnic.cn", notFound: /no matching record/i, found: /Registrant|Registration Time/i },
  io: { host: "whois.nic.io", notFound: /NOT FOUND|No Object Found/i, found: /Domain Name:/i },
  cc: { host: "ccwhois.verisign-grs.com", notFound: /No match for/i, found: /Domain Name:/i },
  tv: { host: "tvwhois.verisign-grs.com", notFound: /No match for/i, found: /Domain Name:/i },
  co: { host: "whois.registry.co", notFound: /DOMAIN NOT FOUND|does not exist/i, found: /Domain Name:/i },
  me: { host: "whois.nic.me", notFound: /Domain not found/i, found: /Domain Name:/i },
  xyz: { host: "whois.nic.xyz", notFound: /DOMAIN NOT FOUND|does not exist/i, found: /Domain Name:/i },
};

/**
 * .shop 注册局（GMO）已退役 WHOIS，其 RDAP 又对 Workers 出口 IP 返回 Cloudflare 挑战页（403），
 * 两条正路都不通。兜底改用 DNS NXDOMAIN 判定：域名不在 TLD 权威区（RCODE=3）即视为可注册，
 * 已注册但未挂 NS 的极少数情况会漏判，保持「未知」不误报。
 */
const DNS_NXDOMAIN_TLDS = new Set(["shop", "art"]);

async function dnsNxdomainFallback(r: CheckResult): Promise<CheckResult> {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(r.domain)}&type=NS`,
      { headers: { accept: "application/dns-json" } },
    );
    if (!res.ok) return r;
    const data = (await res.json()) as { Status: number; Answer?: unknown[] };
    if (data.Status === 3) return { domain: r.domain, status: "available", method: "dns", detail: "nxdomain" };
    if (data.Status === 0 && data.Answer && data.Answer.length > 0)
      return { domain: r.domain, status: "taken", method: "dns" };
    return r;
  } catch {
    return r;
  }
}

export async function whoisFallback(r: CheckResult): Promise<CheckResult> {
  const tld = r.domain.slice(r.domain.indexOf(".") + 1).toLowerCase();
  if (DNS_NXDOMAIN_TLDS.has(tld)) return dnsNxdomainFallback(r);
  const cfg = WHOIS_SERVERS[tld];
  if (!cfg) return r;
  try {
    const socket = connect({ hostname: cfg.host, port: 43 });
    const writer = socket.writable.getWriter();
    await writer.write(new TextEncoder().encode(r.domain + "\r\n"));
    writer.releaseLock();
    const reader = socket.readable.getReader();
    const decoder = new TextDecoder();
    let text = "";
    const deadline = Date.now() + 8000;
    while (Date.now() < deadline) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      if (text.length > 20000) break;
    }
    try { await socket.close(); } catch { /* already closed */ }
    if (cfg.notFound.test(text)) return { domain: r.domain, status: "available", method: "whois" };
    if (cfg.found.test(text)) return { domain: r.domain, status: "taken", method: "whois" };
    return { domain: r.domain, status: "unknown", method: "whois", detail: "unparsed" };
  } catch (e) {
    return { domain: r.domain, status: "unknown", method: "whois", detail: String(e) };
  }
}
