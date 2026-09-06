/**
 * R520：三类内容页底部「其他 …」chip 行，React（SPA 水合）与 worker SSR 骨架逐字一致。
 * 用 renderToStaticMarkup 渲染真实组件（注入 window.__DH_CONTENT__ 走 readInjectedContent），
 * 与 ssr-html.ts 的对应 block 直接做字符串相等比较。
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { ComparePage } from "../components/compare-page";
import { GuidePage } from "../components/guide-page";
import { TldPage } from "../components/tld-page";
import { I18nProvider } from "../lib/i18n";
import { TLD_COMPARES } from "./compares";
import { INDUSTRY_GUIDES } from "./guides";
import { buildGuideContent, buildTldContent, buildVsContent } from "./injected-build";
import type { InjectedContent } from "./injected";
import { compareContentBlocks, guideContentBlocks, tldContentBlocks } from "./ssr-html";
import { TLD_GUIDES } from "./tlds";

type Lang = "zh" | "en";

const OTHERS_ROW = /<div class="mt-10"><h2 class="text-sm font-semibold text-txt1">[^<]*<\/h2><div class="mt-3 flex flex-wrap gap-2">(?:<a\b[^>]*>(?:(?!<\/a>).)*<\/a>)*<\/div><\/div>/gs;

const g = globalThis as unknown as { window?: unknown; localStorage?: unknown };
const saved = { window: g.window, localStorage: g.localStorage };
afterEach(() => {
  g.window = saved.window;
  g.localStorage = saved.localStorage;
});

function renderSpa(content: InjectedContent, lang: Lang, el: React.ReactElement): string {
  g.window = { __DH_CONTENT__: content, location: { search: `?lang=${lang}` } };
  g.localStorage = { getItem: () => null, setItem: () => undefined };
  return renderToStaticMarkup(createElement(I18nProvider, null, el));
}

const othersRow = (html: string, hubPrefix: string) => (html.match(OTHERS_ROW) ?? []).find((r) => r.includes(hubPrefix));

describe("「其他 …」chip 行 SSR ↔ SPA 逐字一致（R520）", () => {
  it.each(["zh", "en"] as const)("%s：/tld/com", (lang) => {
    const spa = renderSpa(buildTldContent("com")!, lang, createElement(TldPage, { tld: "com" }));
    const ssr = tldContentBlocks("com", TLD_GUIDES.com, lang).join("");
    const hub = `/tld?lang=${lang}#hub-g-`;
    expect(othersRow(spa, hub)).toBeDefined();
    expect(othersRow(spa, hub)).toBe(othersRow(ssr, hub));
  });

  it.each(["zh", "en"] as const)("%s：/guide/saas", (lang) => {
    const spa = renderSpa(buildGuideContent("saas")!, lang, createElement(GuidePage, { slug: "saas" }));
    const ssr = guideContentBlocks(INDUSTRY_GUIDES.saas, lang).join("");
    const hub = `/guide?lang=${lang}#hub-g-`;
    expect(othersRow(spa, hub)).toBeDefined();
    expect(othersRow(spa, hub)).toBe(othersRow(ssr, hub));
  });

  it.each(["zh", "en"] as const)("%s：/vs/com-vs-cn", (lang) => {
    const spa = renderSpa(buildVsContent("com-vs-cn")!, lang, createElement(ComparePage, { slug: "com-vs-cn" }));
    const ssr = compareContentBlocks(TLD_COMPARES["com-vs-cn"], lang).join("");
    const hub = `/vs?lang=${lang}#hub-g-`;
    expect(othersRow(spa, hub)).toBeDefined();
    expect(othersRow(spa, hub)).toBe(othersRow(ssr, hub));
  });
});
