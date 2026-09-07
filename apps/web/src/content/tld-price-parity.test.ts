/**
 * R528：/tld 首屏价格卡 + 「相关 TLD」chip、/guide 「推荐 TLD」卡 —— worker SSR 与 React 首次渲染共用同一份
 * KV 价格快照（snapshotFromPayload，与 /api/prices 同源），两端逐字一致；无快照时两端一致回落静态参考价（保留「参考」标识）。
 * 「更多 TLD 指南」chip 两端都只渲染后缀名，不带价格后缀，且 chip 数 / href 序列与去后缀前一致。
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { ComparePage } from "../components/compare-page";
import { GuidePage } from "../components/guide-page";
import { TldPage } from "../components/tld-page";
import { I18nProvider } from "../lib/i18n";
import { snapshotFromPayload } from "./compare-prices";
import { TLD_COMPARES } from "./compares";
import { GROUP_CHIP_MAX, VIEW_ALL_LABEL, tldGroupChips } from "./group-chips";
import { INDUSTRY_GUIDES } from "./guides";
import { buildGuideContent, buildTldContent, buildVsContent, guidePriceTlds, tldPriceTlds } from "./injected-build";
import type { InjectedContent } from "./injected";
import { priceFull, priceShort } from "./price-text";
import { compareContentBlocks, guideContentBlocks, tldContentBlocks } from "./ssr-html";
import { relatedTlds } from "./tld-groups";
import { TLD_GUIDES } from "./tlds";

type Lang = "zh" | "en";

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

/** 模拟 /api/prices KV 载荷：.my 实时价（静态参考价 R531 后为 ¥17/¥188），.com 正常，.cn 无实时价，.us 为 .cn 的相关 TLD */
const PAYLOAD = JSON.stringify({
  prices: { my: { registration: 2.37, renewal: 26.06 }, com: { registration: 11.08, renewal: 11.08 }, us: { registration: 24.5, renewal: 24.5 } },
  fetchedAt: 1_760_000_000_000,
  stale: false,
});

const PRICE_CARD = /<div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-bg1 px-5 py-4">.*?<\/div>/s;
/** 首屏价格卡（去掉 lucide 图标 svg：React 版多一个 aria-hidden 属性，与价格无关） */
const priceCard = (html: string) => html.match(PRICE_CARD)?.[0].replace(/<svg\b[\s\S]*?<\/svg>/, "");
const CHIP_ROW = /<div class="(?:mt-6|mt-10)"><h2 class="text-sm font-semibold text-txt1">([^<]*)<\/h2><div class="mt-3 flex flex-wrap gap-2">((?:<a\b[^>]*>(?:(?!<\/a>).)*<\/a>)*)<\/div><\/div>/gs;
const chipRows = (html: string) => Object.fromEntries([...html.matchAll(CHIP_ROW)].map((m) => [m[1], m[2]]));
const hrefs = (html: string) => [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]);
const chipTexts = (html: string) => [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((m) => m[1].replace(/<[^>]+>/g, ""));

const HEAD = { zh: { others: "其他 TLD 指南", related: "相关 TLD" }, en: { others: "More TLD guides", related: "Related TLDs" } };

describe("/tld 价格：SSR ↔ SPA 共用 KV 快照逐字一致（R528）", () => {
  it.each([
    ["zh", "my"],
    ["en", "my"],
    ["zh", "com"],
    ["en", "cn"],
  ] as const)("%s：/tld/%s 首屏价格卡 + 相关 TLD chip 行两端相等，且价格取自快照", (lang, tld) => {
    const snap = snapshotFromPayload(PAYLOAD, tldPriceTlds(tld));
    const spa = renderSpa(buildTldContent(tld, snap)!, lang, createElement(TldPage, { tld }));
    const ssr = tldContentBlocks(tld, TLD_GUIDES[tld], lang, snap).join("");
    expect(priceCard(spa)).toBeDefined();
    expect(priceCard(spa)).toBe(priceCard(ssr));
    const spaRows = chipRows(spa);
    const ssrRows = chipRows(ssr);
    expect(spaRows[HEAD[lang].related]).toBeDefined();
    expect(spaRows[HEAD[lang].related]).toBe(ssrRows[HEAD[lang].related]);
    const live = snap.live[tld];
    if (live) {
      expect(ssr).toContain(`<b class="tnum font-mono">$${live.registration}</b>`);
      expect(ssr).toContain(`<b class="tnum font-mono">$${live.renewal}</b>`);
      expect(ssr).not.toContain(lang === "en" ? "Static reference" : "静态参考价");
    } else {
      // 快照里没有该 TLD 的实时价：回落静态参考价并保留「参考」标识
      expect(ssr).toContain(priceFull(tld, lang, null)!);
    }
  });

  it("相关 TLD chip：快照有价的用实时价、无价的回落静态参考价（同一 priceShort）", () => {
    const snap = snapshotFromPayload(PAYLOAD, tldPriceTlds("cn"));
    const related = relatedTlds("cn");
    expect(related).toContain("us");
    const ssr = tldContentBlocks("cn", TLD_GUIDES.cn, "en", snap).join("");
    const row = chipRows(ssr)[HEAD.en.related];
    expect(chipTexts(row)).toEqual(related.map((t) => `.${t}${priceShort(t, "en", snap.live) ?? ""}`));
    expect(row).toContain("1st yr $24.5"); // .us 实时价
    expect(row).toContain("1st yr ≈$"); // 其余无实时价 → 静态参考
  });

  it.each(["zh", "en"] as const)("%s：无快照（KV 为空）时 SSR 与 SPA 一致回落静态参考价", (lang) => {
    const empty = snapshotFromPayload(null, tldPriceTlds("my"));
    expect(empty.fetchedAt).toBeNull();
    const spa = renderSpa(buildTldContent("my", empty)!, lang, createElement(TldPage, { tld: "my" }));
    const ssr = tldContentBlocks("my", TLD_GUIDES.my, lang).join("");
    expect(priceCard(spa)).toBe(priceCard(ssr));
    expect(ssr).toContain(lang === "en" ? "Static reference: ≈$2 (¥17) 1st yr" : "静态参考价：首年 ¥17");
  });

  it.each(["zh", "en"] as const)("%s：/guide/saas 推荐 TLD 卡两端相等且取自快照", (lang) => {
    const guide = INDUSTRY_GUIDES.saas;
    const snap = snapshotFromPayload(PAYLOAD, guidePriceTlds(guide));
    expect(Object.keys(snap.live).length).toBeGreaterThan(0);
    const spa = renderSpa(buildGuideContent("saas", snap)!, lang, createElement(GuidePage, { slug: "saas" }));
    const ssr = guideContentBlocks(guide, lang, snap).join("");
    const grid = /<div class="mt-3 grid gap-2 sm:grid-cols-3">.*?<\/div>/s;
    expect(spa.match(grid)?.[0]).toBeDefined();
    expect(spa.match(grid)?.[0]).toBe(ssr.match(grid)?.[0]);
    for (const [tld, p] of Object.entries(snap.live)) expect(ssr).toContain(priceShort(tld, lang, { [tld]: p })!);
  });
});

/** /vs 两侧选型卡的价格行（<p class="tnum mt-1 text-xs text-txt2">） */
const PICK_PRICE_ROW = /<p class="tnum mt-1 text-xs text-txt2">([^<]*)<\/p>/g;
const pickPriceRows = (html: string) => [...html.matchAll(PICK_PRICE_ROW)].map((m) => m[1]);

describe("/vs 选型卡价格：SSR ↔ SPA 共用 KV 快照逐字一致（R531）", () => {
  const VS_PAYLOAD = JSON.stringify({
    prices: { io: { registration: 28.12, renewal: 51.8 }, dev: { registration: 8.75, renewal: 12.87 }, com: { registration: 11.08, renewal: 11.08 } },
    fetchedAt: 1_760_000_000_000,
    stale: false,
  });

  it.each([
    ["zh", "io-vs-dev"],
    ["en", "io-vs-dev"],
    ["zh", "com-vs-cn"],
    ["en", "com-vs-cn"],
  ] as const)("%s：/vs/%s 两侧卡价格行两端相等，快照有价用实时价、无价回落静态参考价", (lang, slug) => {
    const cmp = TLD_COMPARES[slug];
    const snap = snapshotFromPayload(VS_PAYLOAD, [cmp.a, cmp.b]);
    const spa = renderSpa(buildVsContent(slug, snap)!, lang, createElement(ComparePage, { slug }));
    const ssr = compareContentBlocks(cmp, lang, snap).join("");
    const rows = pickPriceRows(ssr);
    expect(rows).toHaveLength(2);
    expect(pickPriceRows(spa)).toEqual(rows);
    for (const [i, tld] of [cmp.a, cmp.b].entries()) {
      expect(rows[i]).toBe(priceFull(tld, lang, snap.live));
      const live = snap.live[tld];
      if (live) {
        expect(rows[i]).toContain(`$${live.registration}`);
        expect(rows[i]).not.toContain(lang === "en" ? "Static reference" : "静态参考价");
      } else {
        expect(rows[i]).toBe(priceFull(tld, lang, null));
        expect(rows[i]).toContain(lang === "en" ? "Static reference" : "静态参考价");
      }
    }
  });

  it.each(["zh", "en"] as const)("%s：无快照（KV 为空）时 SSR 与 SPA 一致回落静态参考价", (lang) => {
    const cmp = TLD_COMPARES["io-vs-dev"];
    const empty = snapshotFromPayload(null, [cmp.a, cmp.b]);
    const spa = renderSpa(buildVsContent("io-vs-dev", empty)!, lang, createElement(ComparePage, { slug: "io-vs-dev" }));
    const ssr = compareContentBlocks(cmp, lang).join("");
    const rows = pickPriceRows(ssr);
    expect(rows).toEqual([priceFull("io", lang, null), priceFull("dev", lang, null)]);
    expect(pickPriceRows(spa)).toEqual(rows);
  });
});

describe("「更多 TLD 指南」chip 去价格后缀（R528）", () => {
  it.each([
    ["zh", "com"],
    ["en", "com"],
    ["en", "vip"],
    ["zh", "my"],
  ] as const)("%s：/tld/%s 两端 chip 只含后缀名，chip 数 ≤上限 + 查看全部，href 序列与 tldGroupChips 一致", (lang, tld) => {
    const snap = snapshotFromPayload(PAYLOAD, tldPriceTlds(tld));
    const spa = renderSpa(buildTldContent(tld, snap)!, lang, createElement(TldPage, { tld }));
    const ssr = tldContentBlocks(tld, TLD_GUIDES[tld], lang, snap).join("");
    const spaRow = chipRows(spa)[HEAD[lang].others];
    const ssrRow = chipRows(ssr)[HEAD[lang].others];
    expect(spaRow).toBeDefined();
    expect(spaRow).toBe(ssrRow);
    const expected = tldGroupChips(tld);
    const texts = chipTexts(ssrRow);
    expect(texts.slice(0, -1)).toEqual(expected.chips.map((c) => `.${c}`));
    expect(texts.at(-1)).toBe(VIEW_ALL_LABEL.tld[lang]);
    expect(expected.chips.length).toBeLessThanOrEqual(GROUP_CHIP_MAX);
    expect(hrefs(ssrRow).slice(0, -1)).toEqual(expected.chips.map((c) => `/tld/${c}?lang=${lang}`));
    expect(ssrRow).not.toMatch(/1st yr|首年/);
  });
}, { concurrent: false });
