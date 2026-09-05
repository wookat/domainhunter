/** 分享 / 同步快照条目的清洗与 SSR 文案（纯函数，便于单测） */

export const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,62})(\.[a-z0-9]([a-z0-9-]{0,62}))+$/;

/** 分享快照里保留的核验状态；旧快照没有该字段（undefined = 未记录，不等于可注册） */
export type ShareStatus = "available" | "taken" | "unknown";
const SHARE_STATUSES: readonly ShareStatus[] = ["available", "taken", "unknown"];

export interface ShareItem {
  domain: string;
  label: string;
  tld: string;
  meaning?: string;
  scores?: { length: number; readability: number; relevance: number; brandability: number };
  status?: ShareStatus;
}

export function sanitizeShareItem(raw: unknown): ShareItem | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const domain = typeof o.domain === "string" ? o.domain.trim().toLowerCase() : "";
  if (!DOMAIN_RE.test(domain) || domain.length > 253) return null;
  const dot = domain.indexOf(".");
  const item: ShareItem = { domain, label: domain.slice(0, dot), tld: domain.slice(dot + 1) };
  if (typeof o.meaning === "string" && o.meaning) item.meaning = o.meaning.slice(0, 300);
  const s = o.scores as Record<string, unknown> | undefined;
  if (s && typeof s === "object") {
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(Math.max(Math.round(v), 0), 100) : null);
    const length = num(s.length), readability = num(s.readability), relevance = num(s.relevance), brandability = num(s.brandability);
    if (length !== null && readability !== null && relevance !== null && brandability !== null) {
      item.scores = { length, readability, relevance, brandability };
    }
  }
  if (typeof o.status === "string" && (SHARE_STATUSES as readonly string[]).includes(o.status)) item.status = o.status as ShareStatus;
  return item;
}

/**
 * 分享页 <title>/og:title：只有当每条都带 status 且全部 available 时才说「可注册」，
 * 否则用中性的「候选域名」——旧快照无 status，不能把已注册域名也标成可注册。
 */
export function shareSsrTitle(items: readonly Pick<ShareItem, "status">[], lang: "zh" | "en"): string {
  const n = items.length;
  const allAvailable = n > 0 && items.every((it) => it.status === "available");
  if (allAvailable) return lang === "en" ? `${n} available domain candidates | DomainHunter` : `${n} 个可注册域名候选 | DomainHunter`;
  return lang === "en" ? `${n} domain candidates | DomainHunter` : `${n} 个候选域名 | DomainHunter`;
}
