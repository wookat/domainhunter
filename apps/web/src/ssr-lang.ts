// SSR 页面语言解析与 canonical / hreflang 注入（R492 从 worker.ts 抽出为纯函数，便于单测）。
//
// URL 结构：zh = 裸路径（同时是 x-default），en = `?lang=en`（独立语言 URL）。
// 裸路径在 `Accept-Language: en*` 下会渲染英文正文，此时 canonical 必须跟正文语言走（Google《规范化》：
// "specify a canonical page in the same language"），否则 canonical 会指向 hreflang 标为 zh 的 URL。
// 因为正文随 Accept-Language 变化，HTML 响应还必须带 `Vary: Accept-Language`（RFC 9110 §12.5.5）。

export type SsrLang = "zh" | "en";

export const SITE_ORIGIN = "https://hunt.zalize.com";

/** 所有随 Accept-Language 变化的 HTML 响应统一带的 Vary 值 */
export const HTML_VARY = "Accept-Language";

/** 就地给响应头加 `Vary: Accept-Language`（已含或为 `*` 则不动；否则并入既有 Vary 列表），返回同一对象 */
export function withHtmlVary(h: Headers): Headers {
  const existing = h.get("vary") ?? "";
  const items = existing.split(",").map((s) => s.trim()).filter(Boolean);
  if (items.some((s) => s === "*" || s.toLowerCase() === HTML_VARY.toLowerCase())) return h;
  h.set("vary", [...items, HTML_VARY].join(", "));
  return h;
}

/** 显式 `?lang=` 优先；无 query 时英文浏览器（Accept-Language 以 en 开头）为 en；其余 zh */
export function resolveLang(langQuery: string | undefined, acceptLanguage: string | undefined): SsrLang {
  if (langQuery === "en") return "en";
  if (langQuery !== undefined && langQuery !== "") return "zh";
  return (acceptLanguage ?? "").trim().toLowerCase().startsWith("en") ? "en" : "zh";
}

/** en 版 URL：裸路径拼 `?lang=en`（path 已带 query 时用 & 连接） */
export function enUrl(path: string): string {
  return `${SITE_ORIGIN}${path}${path.includes("?") ? "&" : "?"}lang=en`;
}

/** hreflang alternate 标签：zh / en / x-default（zh 为默认，URL 与 canonical 规则一致：zh/x-default 指裸路径，en 指 ?lang=en） */
export function hreflangTags(path: string): string {
  const base = `${SITE_ORIGIN}${path}`;
  return [
    `<link rel="alternate" hreflang="zh" href="${base}" />`,
    `<link rel="alternate" hreflang="en" href="${enUrl(path)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${base}" />`,
  ].join("\n    ");
}

/**
 * 在 canonical 之后注入 hreflang 三元组；正文为 en 时把 canonical 改写为 `?lang=en` 自指。
 * `lang` 必须是页面最终渲染的语言（含 Accept-Language 解析结果），而不是仅看 `?lang` query。
 */
export function injectHreflang(html: string, path: string, lang: SsrLang): string {
  if (lang === "en") html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${enUrl(path)}" />`);
  return html.replace(/(<link rel="canonical"[^>]*\/>)/, `$1\n    ${hreflangTags(path)}`);
}
