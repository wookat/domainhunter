import { connect } from "cloudflare:sockets";
import type { CheckResult } from "@domainhunter/core";

const WHOIS_SERVERS: Record<string, { host: string; notFound: RegExp; found: RegExp }> = {
  com: { host: "whois.verisign-grs.com", notFound: /No match for/i, found: /Domain Name:/i },
  net: { host: "whois.verisign-grs.com", notFound: /No match for/i, found: /Domain Name:/i },
  cn: { host: "whois.cnnic.cn", notFound: /no matching record/i, found: /Registrant|Registration Time/i },
  "com.cn": { host: "whois.cnnic.cn", notFound: /no matching record/i, found: /Registrant|Registration Time/i },
  io: { host: "whois.nic.io", notFound: /NOT FOUND|No Object Found/i, found: /Domain Name:/i },
  cc: { host: "ccwhois.verisign-grs.com", notFound: /No match for/i, found: /Domain Name:/i },
  tv: { host: "tvwhois.verisign-grs.com", notFound: /No match for/i, found: /Domain Name:/i },
  co: { host: "whois.registry.co", notFound: /DOMAIN NOT FOUND|does not exist/i, found: /Domain Name:/i },
  me: { host: "whois.nic.me", notFound: /Domain not found/i, found: /Domain Name:/i },
  xyz: { host: "whois.nic.xyz", notFound: /DOMAIN NOT FOUND|does not exist/i, found: /Domain Name:/i },
  // 以下四个后缀不在 IANA RDAP bootstrap 中，WHOIS 是唯一权威通道
  sh: { host: "whois.nic.sh", notFound: /NOT FOUND|No Object Found/i, found: /Domain Name:/i },
  gg: { host: "whois.gg", notFound: /NOT FOUND|Domain not found/i, found: /Domain:|Domain Name:/i },
  so: { host: "whois.nic.so", notFound: /Domain not found|NOT FOUND|No Object Found/i, found: /Domain Name:/i },
  us: { host: "whois.nic.us", notFound: /No Data Found|Domain not found|NOT FOUND/i, found: /Domain Name:/i },
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

// WHOIS 到期字段写法各家不一：Registry Expiry Date / Expiration Date / Expiry Date / Expiration Time / paid-till 等
const EXPIRY_RE = /^[ \t]*(?:paid-till|(?:registry |registrar registration )?(?:expiry|expiration|expire)(?: date| time|s? on)?)[ \t]*:[ \t]*(.+)$/im;

/** 从 WHOIS 文本宽松解析到期时间，解析不出返回 undefined（不报错） */
export function parseWhoisExpiry(text: string): string | undefined {
  const m = EXPIRY_RE.exec(text);
  if (!m) return undefined;
  const ts = Date.parse(m[1].trim());
  if (!Number.isFinite(ts)) return undefined;
  return new Date(ts).toISOString();
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
    if (cfg.found.test(text)) {
      const expiresAt = parseWhoisExpiry(text);
      return { domain: r.domain, status: "taken", method: "whois", ...(expiresAt ? { expiresAt } : {}) };
    }
    // 注册局保留域：found/notFound 都没匹配且文本明确表示保留/不可注册（如 cnnic 对 nic.* 返回「can not be registered online」），细化文案
    if (/\breserv(?:ed|ation)\b|can\s?not be registered/i.test(text)) return { domain: r.domain, status: "unknown", method: "whois", detail: "reserved" };
    return { domain: r.domain, status: "unknown", method: "whois", detail: "unparsed" };
  } catch (e) {
    return { domain: r.domain, status: "unknown", method: "whois", detail: String(e) };
  }
}
