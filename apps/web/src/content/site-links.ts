/**
 * 站内链接的纯数据与 href 助手（worker SSR 与客户端组件共用，无 DOM / React 依赖）。
 */
export type SiteLang = "zh" | "en";

/**
 * SSR 内链 zh 形式开关：true = zh 链接省略 `?lang=zh`（与 canonical 裸路径一致）；false = 保留 `?lang=zh`。
 * 现状下 worker 对裸路径按 Accept-Language 切语言，而客户端 loadLang 按 query → localStorage → navigator.language，
 * 去掉 `?lang=zh` 会让"英文浏览器但已切中文"的用户在整页跳转时先拿到英文 SSR 再被 React 翻成中文（语言闪变），
 * 故默认保持 false；待裸路径语言策略（canonical/Vary）定稿后再翻转。
 */
export const SSR_CANONICAL_ZH_LINKS = false;

/** 带语言参数的站内 href：`langHref("/why", "en")` → `/why?lang=en`；已有 query 时用 `&` 追加。 */
export function langHref(path: string, lang: SiteLang, canonicalZh: boolean = SSR_CANONICAL_ZH_LINKS): string {
  if (lang === "zh" && canonicalZh) return path;
  return `${path}${path.includes("?") ? "&" : "?"}lang=${lang}`;
}

export interface SiteLink {
  path: string;
  zh: string;
  en: string;
}

/** 站点核心页（首页 / 三个 hub / 价格 / why / mcp / advanced）；文案与 lib/i18n.tsx 词典逐字同源（key 见注释） */
export const SITE_LINKS: readonly SiteLink[] = [
  { path: "/", zh: "首页", en: "Home" }, // crumb.home
  { path: "/tld", zh: "TLD 指南", en: "TLD guides" }, // hub.allTld
  { path: "/guide", zh: "行业指南", en: "Industry guides" }, // hub.allGuide
  { path: "/vs", zh: "后缀对比", en: "TLD comparisons" }, // hub.allVs
  { path: "/prices", zh: "价格总览", en: "Price overview" }, // footer.prices
  { path: "/why", zh: "为什么选 DomainHunter", en: "Why DomainHunter" }, // footer.why
  { path: "/mcp", zh: "MCP 接入", en: "MCP server" }, // footer.mcp
  { path: "/advanced", zh: "批量核验", en: "Bulk check" }, // footer.advanced
];

export const SITE_LINKS_HEADING = { zh: "站内导航", en: "Site navigation" } as const; // siteLinks.heading

/** 首页 SSR 导航精选内容页：.cn 合规 6 篇 + 热门 TLD + 热门对比（slug 须存在于 GUIDE_LABELS / TLD_LIST / COMPARE_SLUGS） */
export const HOME_NAV_FEATURED = {
  guides: ["cn-realname", "cn-serverhold", "cn-icp-beian", "cn-dns-inland-vs-overseas", "cn-vs-comcn-registrar", "cn-expiry-redemption"],
  tlds: ["com", "cn", "net", "io", "ai", "app", "shop", "xyz"],
  compares: ["com-vs-cn", "com-vs-io", "com-vs-net", "io-vs-ai"],
} as const;
