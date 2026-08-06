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

export async function whoisFallback(r: CheckResult): Promise<CheckResult> {
  const tld = r.domain.slice(r.domain.indexOf(".") + 1).toLowerCase();
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
