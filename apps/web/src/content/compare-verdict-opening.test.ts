/**
 * R542：/vs 判断段开场句去模板化守门。
 * 任意两个 /vs 条目同语言 verdict 的前 N 个规范化字符（小写、去空白/标点/符号）不得相同。
 * N 取 59 而非计划的 80：R540 发现的 ccTLD-vs-.com 四页（uk/de/au/fr-vs-com）en 开场句
 * 规范化后两两 LCP 为 59–63，80 抓不住；语料中最近的非模板对（kaufen-vs-shop ↔ tienda-vs-shop）
 * LCP 为 55，59 是能抓住本簇且不误伤的最大值（见 docs/audits/r542/lcp-before.md）。
 */
import { describe, expect, it } from "vitest";

import { TLD_COMPARES } from "./compares";

const OPENING_PREFIX_CHARS = 59;

const normalize = (s: string) => s.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "");

describe("/vs verdict 开场句不得跨页共用", () => {
  for (const lang of ["zh", "en"] as const) {
    it(`${lang}: 任意两页 verdict 前 ${OPENING_PREFIX_CHARS} 个规范化字符不同`, () => {
      const byPrefix = new Map<string, string[]>();
      for (const c of Object.values(TLD_COMPARES)) {
        const key = normalize(c[lang].verdict).slice(0, OPENING_PREFIX_CHARS);
        byPrefix.set(key, [...(byPrefix.get(key) ?? []), c.slug]);
      }
      const shared = [...byPrefix.entries()].filter(([, slugs]) => slugs.length >= 2);
      expect(shared.map(([prefix, slugs]) => `${slugs.join(", ")} → "${prefix}"`)).toEqual([]);
    });
  }
});
