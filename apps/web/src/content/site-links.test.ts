import { describe, expect, it } from "vitest";

import { COMPARE_SLUGS } from "./compare-slugs";
import { GUIDE_LABELS } from "./guide-labels";
import { HOME_NAV_FEATURED, SITE_LINKS, SSR_CANONICAL_ZH_LINKS, langHref } from "./site-links";
import { TLD_LIST } from "./tld-list";

describe("langHref", () => {
  it("en 始终带 ?lang=en；已有 query 用 & 追加", () => {
    expect(langHref("/why", "en")).toBe("/why?lang=en");
    expect(langHref("/?mode=exact", "en")).toBe("/?mode=exact&lang=en");
  });

  it("zh 默认保留 ?lang=zh（SSR_CANONICAL_ZH_LINKS=false，与生产现状一致）", () => {
    expect(SSR_CANONICAL_ZH_LINKS).toBe(false);
    expect(langHref("/why", "zh")).toBe("/why?lang=zh");
    expect(langHref("/", "zh")).toBe("/?lang=zh");
  });

  it("canonicalZh=true 时 zh 省略 lang 参数、en 不受影响", () => {
    expect(langHref("/why", "zh", true)).toBe("/why");
    expect(langHref("/?mode=exact", "zh", true)).toBe("/?mode=exact");
    expect(langHref("/why", "en", true)).toBe("/why?lang=en");
  });
});

describe("SITE_LINKS / HOME_NAV_FEATURED", () => {
  it("核心页覆盖首页、三个 hub、价格与三个孤岛页", () => {
    expect(SITE_LINKS.map((l) => l.path)).toEqual(["/", "/tld", "/guide", "/vs", "/prices", "/why", "/mcp", "/advanced"]);
    for (const l of SITE_LINKS) {
      expect(l.zh.length).toBeGreaterThan(0);
      expect(l.en.length).toBeGreaterThan(0);
    }
  });

  it("精选内容页 slug 全部存在于对应数据集（否则会产出 404 内链）", () => {
    const guideSlugs = new Set(GUIDE_LABELS.map((g) => g.slug));
    for (const s of HOME_NAV_FEATURED.guides) expect(guideSlugs.has(s), s).toBe(true);
    const tlds = new Set<string>(TLD_LIST);
    for (const t of HOME_NAV_FEATURED.tlds) expect(tlds.has(t), t).toBe(true);
    const compares = new Set<string>(COMPARE_SLUGS);
    for (const c of HOME_NAV_FEATURED.compares) expect(compares.has(c), c).toBe(true);
    expect(HOME_NAV_FEATURED.guides.filter((s) => s.startsWith("cn-"))).toHaveLength(6);
  });
});
