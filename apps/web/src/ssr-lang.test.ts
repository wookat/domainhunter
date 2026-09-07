import { describe, expect, it } from "vitest";
import { canonicalLangOf, enUrl, hreflangTags, injectHreflang, resolveLang, resolveSsrLang, SITE_ORIGIN, withHtmlVary, type SsrLangCtx } from "./ssr-lang";

const ZH: SsrLangCtx = { lang: "zh", canonicalLang: "zh" };
const EN: SsrLangCtx = { lang: "en", canonicalLang: "en" };

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

describe("resolveSsrLang / canonicalLangOf", () => {
  it("canonical 语言只看 ?lang，不看 Accept-Language", () => {
    expect(canonicalLangOf("en")).toBe("en");
    expect(canonicalLangOf(undefined)).toBe("zh");
    expect(canonicalLangOf("")).toBe("zh");
    expect(canonicalLangOf("zh")).toBe("zh");
  });
  it("四种请求方式：正文语言与 canonical 语言分开", () => {
    expect(resolveSsrLang(undefined, undefined)).toEqual(ZH);
    expect(resolveSsrLang(undefined, "zh-CN,zh;q=0.9")).toEqual(ZH);
    expect(resolveSsrLang(undefined, "en-US,en;q=0.9")).toEqual({ lang: "en", canonicalLang: "zh" });
    expect(resolveSsrLang("en", "zh-CN")).toEqual(EN);
    expect(resolveSsrLang("en", undefined)).toEqual(EN);
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
    const out = injectHreflang(shell(`${SITE_ORIGIN}/tld/cn`), "/tld/cn", ZH);
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
    const zh = injectHreflang(shell(`${SITE_ORIGIN}/tld/cn`), "/tld/cn", ZH);
    const en = injectHreflang(shell(`${SITE_ORIGIN}/tld/cn`), "/tld/cn", EN);
    expect(canonicalOf(en)).toBe(`${SITE_ORIGIN}/tld/cn?lang=en`);
    expect(alternates(en)).toEqual(alternates(zh));
    expect(canonicalOf(en)).toBe(alternates(en).en);
  });

  it("en：原 canonical 为首页占位（index.html 默认）时也被替换为当前 path 的 en 版", () => {
    const out = injectHreflang(shell(`${SITE_ORIGIN}/`), "/vs/com-vs-cn", EN);
    expect(canonicalOf(out)).toBe(`${SITE_ORIGIN}/vs/com-vs-cn?lang=en`);
  });

  it("含 query 的 path：en canonical / hreflang 用 & 拼接，不产生双 ?", () => {
    const out = injectHreflang(shell(), "/tld?sort=price", EN);
    expect(canonicalOf(out)).toBe(`${SITE_ORIGIN}/tld?sort=price&lang=en`);
    expect(alternates(out).en).toBe(`${SITE_ORIGIN}/tld?sort=price&lang=en`);
    expect(alternates(out).zh).toBe(`${SITE_ORIGIN}/tld?sort=price`);
    expect(out).not.toMatch(/href="[^"]*\?[^"]*\?[^"]*"/);
  });

  it("每个 path 的 en 版 canonical 必须等于自身 hreflang=en（R213 自指不回归）", () => {
    for (const p of ["/", "/mcp", "/advanced", "/prices", "/why", "/tld", "/guide", "/vs", "/tld/cn", "/guide/animation", "/vs/com-vs-cn"]) {
      const out = injectHreflang(shell(), p, EN);
      expect(canonicalOf(out)).toBe(alternates(out).en);
      expect(canonicalOf(out)).toBe(`${SITE_ORIGIN}${p}?lang=en`);
    }
  });

  it("无 canonical 的 HTML 原样返回", () => {
    const html = "<html><head></head></html>";
    expect(injectHreflang(html, "/x", EN)).toBe(html);
    expect(injectHreflang(html, "/x", ZH)).toBe(html);
  });
});

// R507：四种请求方式 × 六类 SSR 页（首页 / TLD / 指南 / 对比 / 价格 / why）的 canonical 与 hreflang。
// 裸 URL 不论 Accept-Language 恒自指裸 URL；?lang=en 恒自指 ?lang=en；三元组四种方式字节一致（Lighthouse canonical 审计：
// 请求 URL 与 canonical 同在 hreflang 集合且不等 → 0 分，即 R502 P2-1 的 92）。
describe("R507 四种请求方式 × 页面类型", () => {
  const PAGES = ["/", "/tld/cn", "/guide/saas", "/vs/com-vs-cn", "/prices", "/why"] as const;
  const MODES: ReadonlyArray<{ name: string; langQuery: string | undefined; al: string | undefined; requestUrl: (p: string) => string; bodyLang: "zh" | "en" }> = [
    { name: "(a) 无 Accept-Language", langQuery: undefined, al: undefined, requestUrl: (p) => `${SITE_ORIGIN}${p}`, bodyLang: "zh" },
    { name: "(b) Accept-Language: en-US,en", langQuery: undefined, al: "en-US,en;q=0.9", requestUrl: (p) => `${SITE_ORIGIN}${p}`, bodyLang: "en" },
    { name: "(c) Accept-Language: zh-CN", langQuery: undefined, al: "zh-CN,zh;q=0.9", requestUrl: (p) => `${SITE_ORIGIN}${p}`, bodyLang: "zh" },
    { name: "(d) ?lang=en", langQuery: "en", al: "zh-CN", requestUrl: (p) => `${SITE_ORIGIN}${p}?lang=en`, bodyLang: "en" },
  ];
  // 路由写入的裸路径 canonical（与 worker 中各 SSR 路由一致）
  const render = (p: string, m: (typeof MODES)[number]) => {
    const sl = resolveSsrLang(m.langQuery, m.al);
    return { sl, html: injectHreflang(shell(`${SITE_ORIGIN}${p}`), p, sl) };
  };

  for (const m of MODES) {
    it(`${m.name}：canonical 等于请求 URL 自身，正文语言 = ${m.bodyLang}`, () => {
      for (const p of PAGES) {
        const { sl, html } = render(p, m);
        expect(sl.lang).toBe(m.bodyLang);
        expect(canonicalOf(html)).toBe(m.requestUrl(p));
        expect(html.match(/rel="canonical"/g)).toHaveLength(1);
        expect(html).not.toMatch(/href="[^"]*\?[^"]*\?[^"]*"/);
      }
    });
  }

  it("(b) 英文浏览器打开裸 URL：正文 en，但 canonical 仍是裸 URL，不再指向 ?lang=en（R502 P2-1）", () => {
    for (const p of PAGES) {
      const { sl, html } = render(p, MODES[1]);
      expect(sl).toEqual({ lang: "en", canonicalLang: "zh" });
      expect(canonicalOf(html)).toBe(`${SITE_ORIGIN}${p}`);
      expect(canonicalOf(html)).toBe(alternates(html).zh);
      expect(canonicalOf(html)).toBe(alternates(html)["x-default"]);
      expect(canonicalOf(html)).not.toBe(alternates(html).en);
    }
  });

  it("hreflang 三元组在四种请求方式下字节一致，且每页都包含自己（Google：each version must list itself）", () => {
    for (const p of PAGES) {
      const alts = MODES.map((m) => alternates(render(p, m).html));
      for (const a of alts) expect(a).toEqual(alts[0]);
      expect(alts[0]).toEqual({ zh: `${SITE_ORIGIN}${p}`, en: `${SITE_ORIGIN}${p}?lang=en`, "x-default": `${SITE_ORIGIN}${p}` });
      for (const m of MODES) expect(Object.values(alternates(render(p, m).html))).toContain(m.requestUrl(p));
    }
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
