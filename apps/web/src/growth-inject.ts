// 增长相关的 HTML <head> 注入（R481）：搜索引擎站点验证 meta + 可配置分析脚本。
// 全部由 wrangler vars 驱动，默认空 → 不产生任何注入（HTML 字节一致）。
// 值经白名单校验后才拼进 HTML，防止通过环境变量注入任意属性/脚本。

export interface GrowthVars {
  GSC_VERIFICATION?: string;
  BING_VERIFICATION?: string;
  BAIDU_VERIFICATION?: string;
  ANALYTICS_PROVIDER?: string;
  ANALYTICS_TOKEN?: string;
}

/** Google/Bing/百度 验证值：base64url/hex 风格的短 token（百度形如 codeva-xxxxxxxx，含连字符） */
const VERIFICATION_TOKEN_RE = /^[A-Za-z0-9_-]{8,128}$/;
/** Cloudflare Web Analytics site token：32 位 hex */
const CF_BEACON_TOKEN_RE = /^[a-f0-9]{32}$/i;

export const ANALYTICS_PROVIDERS = ["cloudflare"] as const;
export type AnalyticsProvider = (typeof ANALYTICS_PROVIDERS)[number];

const clean = (v: string | undefined) => (v ?? "").trim();

export function resolveAnalytics(vars: GrowthVars): { provider: AnalyticsProvider; token: string } | null {
  const provider = clean(vars.ANALYTICS_PROVIDER).toLowerCase();
  const token = clean(vars.ANALYTICS_TOKEN);
  if (provider !== "cloudflare" || !CF_BEACON_TOKEN_RE.test(token)) return null;
  return { provider, token: token.toLowerCase() };
}

/**
 * 官方手动嵌入片段（https://developers.cloudflare.com/web-analytics/get-started/ ）：
 * type="module" + data-cf-beacon JSON；SPA 路由追踪默认开启（不传 spa:false）。
 */
export function cloudflareBeaconTag(token: string): string {
  const cfg = JSON.stringify({ token });
  return `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${cfg}'></script>`;
}

/** 生成待注入 </head> 前的片段；无任何有效配置返回空串 */
export function buildHeadInjection(vars: GrowthVars): string {
  const parts: string[] = [];
  const gsc = clean(vars.GSC_VERIFICATION);
  if (VERIFICATION_TOKEN_RE.test(gsc)) parts.push(`<meta name="google-site-verification" content="${gsc}" />`);
  const bing = clean(vars.BING_VERIFICATION);
  if (VERIFICATION_TOKEN_RE.test(bing)) parts.push(`<meta name="msvalidate.01" content="${bing}" />`);
  const baidu = clean(vars.BAIDU_VERIFICATION);
  if (VERIFICATION_TOKEN_RE.test(baidu)) parts.push(`<meta name="baidu-site-verification" content="${baidu}" />`);
  const analytics = resolveAnalytics(vars);
  if (analytics) parts.push(cloudflareBeaconTag(analytics.token));
  return parts.join("");
}

/** 把片段插到第一个 </head> 之前；无 </head> 或片段为空则原样返回（字节一致） */
export function injectIntoHead(html: string, snippet: string): string {
  if (!snippet) return html;
  const idx = html.indexOf("</head>");
  if (idx < 0) return html;
  return html.slice(0, idx) + snippet + html.slice(idx);
}

export function isHtmlDocument(res: Response): boolean {
  return (res.headers.get("content-type") ?? "").toLowerCase().includes("text/html");
}
