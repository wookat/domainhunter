/**
 * R550：/vs 判断段跨页共用连续片段守门（R542 只守开场句前 59 字；R546 T4 发现四个 ccTLD-vs-com 页
 * 在判断段中段仍逐字共用「For a global audience, .com's recognition is irreplaceable…」16 词）。
 *
 * 口径：apps/web/src/content/verdict-shared-spans.ts（en ≥12 词 / zh ≥24 字连续片段），
 * 与 scripts/seo-audit/vs-shared-ngrams.mjs 同源，可用该脚本离线复算、列出全部片段。
 *
 * 基线（R550 改前，444 页两两）：en 717 spans / 581 pairs / 304 slugs；zh 1488 spans / 1276 pairs / 384 slugs——
 * 既有命中绝大多数是同一后缀在多个 /vs 页里的注册局描述句（如 .de「run by DENIC with 18 million…」、
 * Identity Digital / Binky Moon 定价句），本轮范围只改四页 en，故「任意两页 0 共享」在全站层面不可达；
 * 守门分两层：① 本 P3 的四页 en 两两严格 0；② 全站 pair 数只许下降（棘轮上限 = 改后实测值）。
 * 任何新增跨页共用片段会推高 pair 数并使 ② 失败；若是有意为之，需同时收窄别处重复再调整上限。
 *
 * 口径按用户/爬虫实际看到的文本：R549 起 verdict 含 `{{price:…}}` 占位，须先经 renderPriceText
 * 以参考价（无实时快照）渲染再分词，否则不同 TLD 的价格句会因占位符同形而被误判为共用片段。
 *
 * R556 阈值论证（R553 P3-3：四页在 n=8 仍有 3 个 8–10 词片段，而守门 EN_N=12 为 0）。同口径实测（改前）：
 *   四页 en：n=8 → 3 spans（[10] au↔de「get trust far beyond any new gtld google also geo-associates」，
 *   [8] au↔fr「by verisign global registry services in reston virginia」，[8] de↔uk「as the default signal of a local business」）；
 *   n=9/10 → 1（同一个 10 词）；n≥11 → 0。
 *   全站 444 页 en：n=8 2065 pairs / n=9 1596 / n=10 1113 / n=11 710 / n=12 566（zh n=24 1274）。
 * 结论：全站 n=10 基线远非 0（命中绝大多数是同一后缀在多个 /vs 页的注册局事实句），全站棘轮保持 EN_N=12 / ZH_N=24；
 * 四页严格层改为 n=8（FOUR_EN_N，审计口径），改写后实测 n≥7 均 0（n=6 剩 5 个 6 词通用短语，如「trust far beyond any new gtld」）。
 */
import { describe, expect, it } from "vitest";

import { type ComparePriceSnapshot, renderPriceText } from "./compare-prices";
import { TLD_COMPARES } from "./compares";
import { pairKeys, sharedSpans, tokenizeEn, tokenizeZh, type SharedSpan, type TokenPage } from "./verdict-shared-spans";

const EN_N = 12;
const ZH_N = 24;
/** 四页严格层：R553 审计的词粒度（R550 时为 12） */
const FOUR_EN_N = 8;

/** R556 改后实测（R550 改前 en 581 / zh 1276，R550 改后 575 / 1276）；只能往下调 */
const MAX_PAIRS = { en: 566, zh: 1274 } as const;

const R550_SLUGS = ["uk-vs-com", "de-vs-com", "au-vs-com", "fr-vs-com"] as const;

const REF_SNAPSHOT: ComparePriceSnapshot = { live: {}, fetchedAt: null, stale: true };
const rendered = (c: { zh: { verdict: string }; en: { verdict: string } }, lang: "zh" | "en") =>
  renderPriceText(c[lang].verdict, lang, REF_SNAPSHOT);

const pagesOf = (lang: "zh" | "en", slugs?: readonly string[]): TokenPage[] =>
  Object.values(TLD_COMPARES)
    .filter((c) => !slugs || slugs.includes(c.slug))
    .map((c) => ({ slug: c.slug, tokens: (lang === "en" ? tokenizeEn : tokenizeZh)(rendered(c, lang)) }));

const fmt = (spans: readonly SharedSpan[]) => spans.map((s) => `[${s.len}] ${s.a} ↔ ${s.b}: "${s.span}"`);

describe("/vs verdict 跨页共用连续片段守门", () => {
  it(`en: ${R550_SLUGS.join(" / ")} 四页两两不共享 ≥${FOUR_EN_N} 词连续片段`, () => {
    for (const slug of R550_SLUGS) expect(TLD_COMPARES[slug]?.slug).toBe(slug);
    expect(fmt(sharedSpans(pagesOf("en", R550_SLUGS), FOUR_EN_N, " "))).toEqual([]);
  });

  it("en: 四页 verdict 不再含 R553 的 3 个 8–10 词共用片段（每个片段至多出现在一页）", () => {
    for (const re of [
      /get trust far beyond any new gtld;? google also geo-associates/i,
      /by verisign global registry services in reston,? virginia/i,
      /as the default signal of a local business/i,
    ]) {
      const hits = R550_SLUGS.filter((slug) => re.test(rendered(TLD_COMPARES[slug], "en")));
      expect(hits.length, `${re} 仍出现在：${hits.join(", ")}`).toBeLessThanOrEqual(1);
    }
  });

  it("en: 四页 verdict 不再含 R512 模板句「For a global audience, .com's recognition is irreplaceable」", () => {
    for (const slug of R550_SLUGS) expect(rendered(TLD_COMPARES[slug], "en")).not.toMatch(/for a global audience, \.com's recognition is irreplaceable/i);
  });

  for (const [lang, n, joiner] of [
    ["en", EN_N, " "],
    ["zh", ZH_N, ""],
  ] as const) {
    it(`${lang}: 全站任意两页共享 ≥${n} ${lang === "en" ? "词" : "字"}片段的 pair 数 ≤ ${MAX_PAIRS[lang]}（棘轮，只降不升）`, () => {
      const spans = sharedSpans(pagesOf(lang), n, joiner);
      const pairs = pairKeys(spans);
      expect(pairs.size, `新增跨页共用片段。最长的 20 条：\n${fmt(spans.slice(0, 20)).join("\n")}`).toBeLessThanOrEqual(MAX_PAIRS[lang]);
    });
  }
});
