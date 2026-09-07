import { describe, expect, it } from "vitest";

import { COMPARE_LIST } from "./content/compares";
import { GUIDE_LIST, INDUSTRY_GUIDES } from "./content/guides";
import { TLD_LIST } from "./content/tld-list";
import { sitemapLastmod } from "./sitemap-lastmod";

const FALLBACK = "2026-08-10";
const R483_CN_GUIDES = ["cn-realname", "cn-serverhold", "cn-icp-beian", "cn-dns-inland-vs-overseas", "cn-vs-comcn-registrar", "cn-expiry-redemption"];

describe("sitemapLastmod：内容页 lastmod 反映各条目真实更新日期", () => {
  it("R483 六篇 .cn 合规指南 = 2026-09-04", () => {
    for (const slug of R483_CN_GUIDES) {
      expect(INDUSTRY_GUIDES[slug]?.updatedAt, slug).toBe("2026-09-04");
      expect(sitemapLastmod(`/guide/${slug}`, FALLBACK), slug).toBe("2026-09-04");
    }
  });

  it("其余 guide / tld / vs / 静态页沿用全站 fallback，不会全部变成新日期", () => {
    const others = GUIDE_LIST.filter((s) => !R483_CN_GUIDES.includes(s));
    expect(others.length).toBeGreaterThan(100);
    for (const slug of others) expect(sitemapLastmod(`/guide/${slug}`, FALLBACK), slug).toBe(FALLBACK);
    for (const t of TLD_LIST) expect(sitemapLastmod(`/tld/${t}`, FALLBACK)).toBe(FALLBACK);
    for (const s of COMPARE_LIST) expect(sitemapLastmod(`/vs/${s}`, FALLBACK)).toBe(FALLBACK);
    for (const p of ["/", "/prices", "/why", "/mcp", "/advanced", "/tld", "/guide", "/vs"]) expect(sitemapLastmod(p, FALLBACK)).toBe(FALLBACK);
  });

  it("所有 updatedAt 都是合法 YYYY-MM-DD 且不早于全站 fallback", () => {
    for (const slug of GUIDE_LIST) {
      const u = INDUSTRY_GUIDES[slug].updatedAt;
      if (u === undefined) continue;
      expect(u, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(u >= FALLBACK, slug).toBe(true);
    }
  });

  it("未知 slug / 非法日期回落到 fallback", () => {
    expect(sitemapLastmod("/guide/nope", FALLBACK)).toBe(FALLBACK);
  });
});
