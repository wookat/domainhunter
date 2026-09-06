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
 */
import { describe, expect, it } from "vitest";

import { TLD_COMPARES } from "./compares";
import { pairKeys, sharedSpans, tokenizeEn, tokenizeZh, type SharedSpan, type TokenPage } from "./verdict-shared-spans";

const EN_N = 12;
const ZH_N = 24;

/** R550 改后实测（改前 en 581 / zh 1276）；只能往下调 */
const MAX_PAIRS = { en: 575, zh: 1276 } as const;

const R550_SLUGS = ["uk-vs-com", "de-vs-com", "au-vs-com", "fr-vs-com"] as const;

const pagesOf = (lang: "zh" | "en", slugs?: readonly string[]): TokenPage[] =>
  Object.values(TLD_COMPARES)
    .filter((c) => !slugs || slugs.includes(c.slug))
    .map((c) => ({ slug: c.slug, tokens: (lang === "en" ? tokenizeEn : tokenizeZh)(c[lang].verdict) }));

const fmt = (spans: readonly SharedSpan[]) => spans.map((s) => `[${s.len}] ${s.a} ↔ ${s.b}: "${s.span}"`);

describe("/vs verdict 跨页共用连续片段守门", () => {
  it(`en: ${R550_SLUGS.join(" / ")} 四页两两不共享 ≥${EN_N} 词连续片段`, () => {
    for (const slug of R550_SLUGS) expect(TLD_COMPARES[slug]?.slug).toBe(slug);
    expect(fmt(sharedSpans(pagesOf("en", R550_SLUGS), EN_N, " "))).toEqual([]);
  });

  it("en: 四页 verdict 不再含 R512 模板句「For a global audience, .com's recognition is irreplaceable」", () => {
    for (const slug of R550_SLUGS) expect(TLD_COMPARES[slug].en.verdict).not.toMatch(/for a global audience, \.com's recognition is irreplaceable/i);
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
