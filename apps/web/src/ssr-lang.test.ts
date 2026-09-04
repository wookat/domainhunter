import { describe, expect, it } from "vitest";
import { enUrl, hreflangTags, injectHreflang, resolveLang, SITE_ORIGIN, withHtmlVary } from "./ssr-lang";

const shell = (canonical = `${SITE_ORIGIN}/`) =>
  `<html lang="zh-CN"><head><title>t</title>\n    <link rel="canonical" href="${canonical}" />\n    <meta name="x" /></head></html>`;

const canonicalOf = (html: string) => html.match(/<link rel="canonical" href="([^"]*)" \/>/)?.[1];
const alternates = (html: string) =>
  Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)].map((m) => [m[1], m[2]]));

describe("resolveLang", () => {
  it("?lang=en 优先于任何 Accept-Language", () => {
    expect(resolveLang("en", "zh-CN,zh;q=0.9")).toBe("en");
    expect(resolveLang("en", undefined)).toBe("en");
  });
  it("显式 ?lang=zh（或未知值）固定 zh，不看 Accept-Language", () => {
    expect(resolveLang("zh", "en-US,en;q=0.9")).toBe("zh");
    expect(resolveLang("fr", "en")).toBe("zh");
  });
  it("无 query 时按 Accept-Language 是否以 en 开头", () => {
    expect(resolveLang(undefined, "en-US,en;q=0.9,zh;q=0.8")).toBe("en");
    expect(resolveLang(undefined, "EN")).toBe("en");
    expect(resolveLang(undefined, "zh-CN,zh;q=0.9,en;q=0.8")).toBe("zh");
    expect(resolveLang(undefined, undefined)).toBe("zh");
    expect(resolveLang(undefined, "")).toBe("zh");
    expect(resolveLang("", "en")).toBe("en");
  });
});

describe("enUrl / hreflangTags", () => {
  it("裸路径拼 ?lang=en；已含 query 的路径用 & 连接", () => {
    expect(enUrl("/tld/cn")).toBe(`${SITE_ORIGIN}/tld/cn?lang=en`);
    expect(enUrl("/tld?sort=price")).toBe(`${SITE_ORIGIN}/tld?sort=price&lang=en`);
  });
  it("三元组：zh 与 x-default 指裸路径，en 指 ?lang=en", () => {
    const alt = alternates(hreflangTags("/guide/animation"));
    expect(alt).toEqual({
      zh: `${SITE_ORIGIN}/guide/animation`,
      en: `${SITE_ORIGIN}/guide/animation?lang=en`,
      "x-default": `${SITE_ORIGIN}/guide/animation`,
    });
  });
});

describe("injectHreflang", () => {
  it("zh：canonical 保持裸路径，并在其后注入完整 hreflang 三元组", () => {
    const out = injectHreflang(shell(`${SITE_ORIGIN}/tld/cn`), "/tld/cn", "zh");
    expect(canonicalOf(out)).toBe(`${SITE_ORIGIN}/tld/cn`);
    expect(alternates(out)).toEqual({
      zh: `${SITE_ORIGIN}/tld/cn`,
      en: `${SITE_ORIGIN}/tld/cn?lang=en`,
      "x-default": `${SITE_ORIGIN}/tld/cn`,
    });
    expect(out.indexOf('rel="canonical"')).toBeLessThan(out.indexOf('rel="alternate"'));
    expect(out.match(/rel="canonical"/g)).toHaveLength(1);
  });

  it("en：canonical 改写为 ?lang=en 自指（无论原 canonical 是什么），hreflang 与 zh 版完全一致", () => {
    const zh = injectHreflang(shell(`${SITE_ORIGIN}/tld/cn`), "/tld/cn", "zh");
    const en = injectHreflang(shell(`${SITE_ORIGIN}/tld/cn`), "/tld/cn", "en");
    expect(canonicalOf(en)).toBe(`${SITE_ORIGIN}/tld/cn?lang=en`);
    expect(alternates(en)).toEqual(alternates(zh));
    expect(canonicalOf(en)).toBe(alternates(en).en);
  });

  it("en：原 canonical 为首页占位（index.html 默认）时也被替换为当前 path 的 en 版", () => {
    const out = injectHreflang(shell(`${SITE_ORIGIN}/`), "/vs/com-vs-cn", "en");
    expect(canonicalOf(out)).toBe(`${SITE_ORIGIN}/vs/com-vs-cn?lang=en`);
  });

  it("含 query 的 path：en canonical / hreflang 用 & 拼接，不产生双 ?", () => {
    const out = injectHreflang(shell(), "/tld?sort=price", "en");
    expect(canonicalOf(out)).toBe(`${SITE_ORIGIN}/tld?sort=price&lang=en`);
    expect(alternates(out).en).toBe(`${SITE_ORIGIN}/tld?sort=price&lang=en`);
    expect(alternates(out).zh).toBe(`${SITE_ORIGIN}/tld?sort=price`);
    expect(out).not.toMatch(/href="[^"]*\?[^"]*\?[^"]*"/);
  });

  it("每个 path 的 en 版 canonical 必须等于自身 hreflang=en（R213 自指不回归）", () => {
    for (const p of ["/", "/mcp", "/advanced", "/prices", "/why", "/tld", "/guide", "/vs", "/tld/cn", "/guide/animation", "/vs/com-vs-cn"]) {
      const out = injectHreflang(shell(), p, "en");
      expect(canonicalOf(out)).toBe(alternates(out).en);
      expect(canonicalOf(out)).toBe(`${SITE_ORIGIN}${p}?lang=en`);
    }
  });

  it("无 canonical 的 HTML 原样返回", () => {
    const html = "<html><head></head></html>";
    expect(injectHreflang(html, "/x", "en")).toBe(html);
    expect(injectHreflang(html, "/x", "zh")).toBe(html);
  });
});

describe("withHtmlVary", () => {
  it("无 Vary 时新增 Accept-Language", () => {
    expect(withHtmlVary(new Headers({ "content-type": "text/html" })).get("vary")).toBe("Accept-Language");
  });
  it("并入既有 Vary 列表且不重复", () => {
    expect(withHtmlVary(new Headers({ vary: "Accept-Encoding" })).get("vary")).toBe("Accept-Encoding, Accept-Language");
    expect(withHtmlVary(new Headers({ vary: "accept-language" })).get("vary")).toBe("accept-language");
    expect(withHtmlVary(new Headers({ vary: "*" })).get("vary")).toBe("*");
  });
  it("就地修改并返回同一 Headers 对象", () => {
    const h = new Headers();
    expect(withHtmlVary(h)).toBe(h);
    expect(h.get("vary")).toBe("Accept-Language");
  });
});
