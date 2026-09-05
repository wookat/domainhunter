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

/** `/s/:id` SSR 壳的三种状态：有效快照 / 已撤销（KV 留 `{revoked:true}` 占位）/ 不存在或已过期（含非法 id） */
export type ShareShellState = "ready" | "revoked" | "notFound";

export function shareShellState(idValid: boolean, snapshot: { revoked?: boolean; items?: unknown } | null | undefined): ShareShellState {
  if (!idValid || !snapshot) return "notFound";
  if (snapshot.revoked) return "revoked";
  return Array.isArray(snapshot.items) && snapshot.items.length > 0 ? "ready" : "notFound";
}

const SHARE_GONE_META = {
  revoked: {
    status: 410,
    zh: { title: "分享已撤销 | DomainHunter", desc: "链接已失效：分享者已删除这份清单。" },
    en: { title: "This share has been revoked | DomainHunter", desc: "This link is no longer active — the owner deleted this shortlist." },
  },
  notFound: {
    status: 404,
    zh: { title: "分享不存在或已过期 | DomainHunter", desc: "分享链接不存在或已过期（快照保留 30 天）。" },
    en: { title: "Share not found or expired | DomainHunter", desc: "This share link doesn't exist or has expired (snapshots last 30 days)." },
  },
} as const;

/**
 * 撤销 / 不存在的分享壳：与 `GET /api/share/:id` 同状态码（410 / 404）+ noindex，
 * title/描述用中性文案而不是首页长标题，避免爬虫把失效链接当成首页副本收录。
 */
export function shareGoneMeta(state: Exclude<ShareShellState, "ready">, lang: "zh" | "en"): { status: 410 | 404; title: string; desc: string } {
  const m = SHARE_GONE_META[state];
  return { status: m.status, ...m[lang] };
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
