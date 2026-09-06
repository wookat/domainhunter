/**
 * 语言相关的文档级元信息（`<html lang>` / `<meta property="og:locale">`）的唯一取值表。
 *
 * worker SSR 壳按 `?lang` + Accept-Language 写这两项（worker.ts setHtmlLang）；SPA 水合后按自己解析出的语言
 * （?lang → localStorage → navigator.language）重写。两侧不一致时（如英文浏览器 + 存储语言 zh）SPA 必须把两项
 * 一起改，否则 og:locale 会留在 SSR 语言而 `<html lang>` / title 已切换（R553 P3-1）。
 * 无 DOM 依赖：接收最小 Document 形状，便于 Node 环境单测。
 */
import type { Lang } from "./i18n";

export const HTML_LANG: Readonly<Record<Lang, string>> = { zh: "zh-CN", en: "en" };
export const OG_LOCALE: Readonly<Record<Lang, string>> = { zh: "zh_CN", en: "en_US" };

export const OG_LOCALE_SELECTOR = 'meta[property="og:locale"]';

export interface LangMetaDocument {
  documentElement: { lang: string };
  querySelector(selectors: string): { setAttribute(name: string, value: string): void } | null;
}

/** 把 `<html lang>` 与 og:locale 一起切到 `lang`；壳里没有 og:locale 标签时只改 `<html lang>`（不自行插入） */
export function applyLangMeta(doc: LangMetaDocument, lang: Lang): void {
  doc.documentElement.lang = HTML_LANG[lang];
  doc.querySelector(OG_LOCALE_SELECTOR)?.setAttribute("content", OG_LOCALE[lang]);
}
