import { describe, expect, it } from "vitest";

import { TLD_COMPARES } from "./compares";
import { INDUSTRY_GUIDES } from "./guides";
import { HOME_NAV_FEATURED, SITE_LINKS } from "./site-links";
import { TLD_GUIDES } from "./tlds";
import { compareContentBlocks, guideContentBlocks, homeHeroSkeleton, homeNavHtml, siteLinksHtml, tldContentBlocks } from "./ssr-html";

/** 抽取 HTML 内所有 <a href> 的 href（与 scripts/seo-audit/lib.mjs internalLinks 的正则一致） */
const hrefs = (html: string) => [...html.matchAll(/<a\b[^>]*\bhref="([^"#]*)"/g)].map((m) => m[1]);
const stripLang = (h: string) => h.replace(/[?&]lang=(zh|en)$/, "");

const SHELL = '<!doctype html><html><body><div id="root"></div></body></html>';

describe("homeNavHtml", () => {
  it.each(["zh", "en"] as const)("%s：≥10 个站内链接，覆盖 7 个核心页 + 精选内容页，全部带对应 lang 参数", (lang) => {
    const html = homeNavHtml(lang);
    const links = hrefs(html).filter((h) => h.startsWith("/"));
    expect(links.length).toBeGreaterThanOrEqual(10);
    for (const h of links) expect(h, h).toMatch(new RegExp(`[?&]lang=${lang}$`));
    const bare = new Set(links.map(stripLang));
    for (const p of ["/tld", "/guide", "/vs", "/prices", "/why", "/mcp", "/advanced"]) expect(bare.has(p), p).toBe(true);
    for (const s of HOME_NAV_FEATURED.guides) expect(bare.has(`/guide/${s}`), s).toBe(true);
    for (const t of HOME_NAV_FEATURED.tlds) expect(bare.has(`/tld/${t}`), t).toBe(true);
    for (const c of HOME_NAV_FEATURED.compares) expect(bare.has(`/vs/${c}`), c).toBe(true);
    expect(new Set(links).size).toBe(links.length);
  });

  it("zh/en 文案不同且不含未转义的尖括号", () => {
    const zh = homeNavHtml("zh");
    const en = homeNavHtml("en");
    expect(zh).toContain("TLD 注册指南");
    expect(en).toContain("TLD registration guides");
    expect(zh).toContain("批量核验");
    expect(en).toContain("Bulk check");
    expect(zh.startsWith("<footer ")).toBe(true);
    expect(zh.endsWith("</footer>")).toBe(true);
  });
});

describe("homeHeroSkeleton", () => {
  it("把 hero + 页脚导航注入 #root，页脚位于 min-h-screen 容器之后（首屏与改前一致）", () => {
    const html = homeHeroSkeleton(SHELL, "zh");
    expect(html).toContain('<div id="root"><div class="flex min-h-screen flex-col">');
    expect(html).toMatch(/<\/main><\/div><footer /);
    expect(html).toMatch(/<\/footer><\/div>/);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(hrefs(html).filter((h) => h.startsWith("/")).length).toBeGreaterThanOrEqual(10);
  });
});

describe("siteLinksHtml", () => {
  it.each(["zh", "en"] as const)("%s：nav 内含全部 SITE_LINKS 路径", (lang) => {
    const html = siteLinksHtml(lang);
    expect(html.startsWith("<nav aria-label=")).toBe(true);
    const bare = hrefs(html).map(stripLang);
    expect(bare).toEqual(SITE_LINKS.map((l) => l.path));
    for (const l of SITE_LINKS) expect(html).toContain(`>${l[lang]}</a>`);
  });

  it("三类内容页 blocks 末尾都追加了站内导航（/why /mcp /advanced 获得入链）", () => {
    for (const blocks of [
      tldContentBlocks("com", TLD_GUIDES.com, "zh"),
      guideContentBlocks(INDUSTRY_GUIDES["cn-realname"], "en"),
      compareContentBlocks(TLD_COMPARES["com-vs-cn"], "zh"),
    ]) {
      const last = blocks[blocks.length - 1];
      expect(last.startsWith("<nav aria-label=")).toBe(true);
      const bare = hrefs(last).map(stripLang);
      for (const p of ["/why", "/mcp", "/advanced"]) expect(bare).toContain(p);
    }
  });
});
