// SSR 页面语言解析与 canonical / hreflang 注入（R492 从 worker.ts 抽出为纯函数，便于单测）。
//
// URL 结构：zh = 裸路径（同时是 x-default），en = `?lang=en`（独立语言 URL）。
// 正文语言 = `?lang` > `Accept-Language`（裸路径在 `Accept-Language: en*` 下渲染英文正文，故 HTML 响应带
// `Vary: Accept-Language`，RFC 9110 §12.5.5）。canonical 只看 URL：裸路径恒自指裸路径，`?lang=en` 恒自指
// `?lang=en`——Googlebot 不带 Accept-Language（Google《Locale-adaptive pages》），抓到的裸路径永远是 zh 正文 +
// 自指 canonical；带 Accept-Language 的客户端（Lighthouse 等）也不会看到主 URL 把 canonical 让给 `?lang=en`。
// 论证见 docs/research/seo-lang-canonical.md。

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

/** SSR 语言上下文：`lang` = 正文/`<html lang>`/og:locale 用的语言；`canonicalLang` = canonical 指向哪个语言 URL（只看 `?lang`） */
export interface SsrLangCtx {
  readonly lang: SsrLang;
  readonly canonicalLang: SsrLang;
}

/** 正文语言：显式 `?lang=` 优先；无 query 时英文浏览器（Accept-Language 以 en 开头）为 en；其余 zh */
export function resolveLang(langQuery: string | undefined, acceptLanguage: string | undefined): SsrLang {
  if (langQuery === "en") return "en";
  if (langQuery !== undefined && langQuery !== "") return "zh";
  return (acceptLanguage ?? "").trim().toLowerCase().startsWith("en") ? "en" : "zh";
}

/** canonical 语言只由 URL 决定：`?lang=en` → en，其余（含 Accept-Language 协商出的英文正文）→ zh 裸路径 */
export function canonicalLangOf(langQuery: string | undefined): SsrLang {
  return langQuery === "en" ? "en" : "zh";
}

/** SSR 路由统一入口：一次解析出正文语言与 canonical 语言 */
export function resolveSsrLang(langQuery: string | undefined, acceptLanguage: string | undefined): SsrLangCtx {
  return { lang: resolveLang(langQuery, acceptLanguage), canonicalLang: canonicalLangOf(langQuery) };
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
 * 在 canonical 之后注入 hreflang 三元组；`ctx.canonicalLang === "en"`（即 URL 带 `?lang=en`）时把 canonical 改写为
 * `?lang=en` 自指，否则保留路由写好的裸路径 canonical。正文语言 `ctx.lang` 不影响 canonical。
 */
export function injectHreflang(html: string, path: string, ctx: SsrLangCtx): string {
  if (ctx.canonicalLang === "en") html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${enUrl(path)}" />`);
  return html.replace(/(<link rel="canonical"[^>]*\/>)/, `$1\n    ${hreflangTags(path)}`);
}
