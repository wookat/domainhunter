import { describe, expect, it, vi } from "vitest";

// worker.ts 经 whois.ts 依赖 Workers 运行时专有模块；本测试只走 404 壳路由，不会触达 socket
vi.mock("cloudflare:sockets", () => ({ connect: () => { throw new Error("not available in vitest"); } }));

import worker from "./worker";
import { NOT_FOUND_META, notFoundTitle } from "./content/not-found-copy";

// 与 index.html 同结构的最小壳：404 壳只做正则替换，这里验证状态码 / robots / title / og / canonical / <html lang>
const SHELL = `<!doctype html><html lang="zh-CN"><head>
    <title>DomainHunter — 首页长标题</title>
    <meta name="description" content="首页描述" />
    <link rel="canonical" href="https://hunt.zalize.com/" />
    <meta property="og:title" content="DomainHunter — 首页" />
    <meta property="og:description" content="首页描述" />
    <meta property="og:url" content="https://hunt.zalize.com/" />
    <meta property="og:image" content="https://hunt.zalize.com/og.png" />
    <meta property="og:locale" content="zh_CN" />
    <meta name="twitter:title" content="DomainHunter — 首页" />
    <meta name="twitter:description" content="首页描述" />
  </head><body><div id="root"></div></body></html>`;

/** 模拟 ASSETS：只有 `/` 有 index.html，其余路径与生产一致回空 body 的 404 */
const fakeEnv = {
  ASSETS: {
    fetch: async (req: Request) =>
      new URL(req.url).pathname === "/"
        ? new Response(SHELL, { headers: { "content-type": "text/html; charset=utf-8" } })
        : new Response(null, { status: 404 }),
  },
  DEEPSEEK_API_KEY: "",
};

const ctx = { waitUntil: () => {}, passThroughOnException: () => {} } as unknown as ExecutionContext;

async function get(path: string, headers: Record<string, string> = {}) {
  const res = await worker.fetch(new Request(`https://hunt.zalize.com${path}`, { headers }), fakeEnv as never, ctx);
  const html = await res.text();
  const pick = (re: RegExp) => html.match(re)?.[1] ?? null;
  return {
    status: res.status,
    contentType: res.headers.get("content-type"),
    cacheControl: res.headers.get("cache-control"),
    vary: res.headers.get("vary"),
    html,
    title: pick(/<title>([\s\S]*?)<\/title>/),
    desc: pick(/<meta name="description" content="([^"]*)" \/>/),
    ogTitle: pick(/<meta property="og:title" content="([^"]*)" \/>/),
    ogDesc: pick(/<meta property="og:description" content="([^"]*)" \/>/),
    ogUrl: pick(/<meta property="og:url" content="([^"]*)" \/>/),
    twitterTitle: pick(/<meta name="twitter:title" content="([^"]*)" \/>/),
    robots: pick(/<meta name="robots" content="([^"]*)" \/>/),
    canonical: pick(/<link rel="canonical" href="([^"]*)" \/>/),
    htmlLang: pick(/<html lang="([^"]*)"/),
  };
}

const HTML = { accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" };
const ANY = { accept: "*/*" };
const PAGE_PATHS = ["/does-not-exist", "/tld/does-not-exist", "/vs/x-vs-y", "/guide/none"];

describe("404 壳（R532）：4 类未知路径 × 2 种 Accept", () => {
  it.each(PAGE_PATHS)("%s + Accept: text/html → 404 + noindex + 「页面不存在 | DomainHunter」+ og/twitter 同步 + 无 canonical", async (path) => {
    const r = await get(path, HTML);
    expect(r.status).toBe(404);
    expect(r.contentType).toContain("text/html");
    expect(r.cacheControl).toBe("public, max-age=600");
    expect(r.vary).toBe("Accept-Language");
    expect(r.robots).toBe("noindex");
    expect(r.title).toBe("页面不存在 | DomainHunter");
    expect(r.title).toBe(notFoundTitle("zh"));
    expect(r.ogTitle).toBe(r.title);
    expect(r.twitterTitle).toBe(r.title);
    expect(r.desc).toBe(NOT_FOUND_META.zh.desc);
    expect(r.ogDesc).toBe(NOT_FOUND_META.zh.desc);
    expect(r.ogUrl).toBe(`https://hunt.zalize.com${path}`);
    expect(r.canonical).toBeNull();
    expect(r.htmlLang).toBe("zh-CN");
    expect(r.html).toContain('<div id="root"></div>');
    expect(r.html).not.toContain("首页长标题");
  });

  it.each(PAGE_PATHS)("%s + Accept: */*（curl 默认 / 监控）→ 同一 404 壳而非空 body", async (path) => {
    const r = await get(path, ANY);
    expect(r.status).toBe(404);
    expect(r.contentType).toContain("text/html");
    expect(r.cacheControl).toBe("public, max-age=600");
    expect(r.robots).toBe("noindex");
    expect(r.title).toBe("页面不存在 | DomainHunter");
    expect(r.html.length).toBeGreaterThan(200);
  });

  it("无 Accept 头也回 404 壳", async () => {
    const r = await get("/does-not-exist");
    expect(r.status).toBe(404);
    expect(r.title).toBe("页面不存在 | DomainHunter");
  });
});

describe("404 壳语言：?lang=en / Accept-Language: en → 「Page not found | DomainHunter」+ <html lang=en>", () => {
  it.each(PAGE_PATHS)("%s?lang=en", async (path) => {
    const r = await get(`${path}?lang=en`, HTML);
    expect(r.status).toBe(404);
    expect(r.title).toBe("Page not found | DomainHunter");
    expect(r.title).toBe(notFoundTitle("en"));
    expect(r.ogTitle).toBe(r.title);
    expect(r.desc).toBe(NOT_FOUND_META.en.desc);
    expect(r.htmlLang).toBe("en");
    expect(r.html).toContain('<meta property="og:locale" content="en_US"');
    expect(r.ogUrl).toBe(`https://hunt.zalize.com${path}`);
  });

  it("Accept-Language: en-US（无 ?lang）→ en；?lang=zh 覆盖 Accept-Language", async () => {
    const en = await get("/does-not-exist", { ...HTML, "accept-language": "en-US,en;q=0.9" });
    expect(en.status).toBe(404);
    expect(en.title).toBe("Page not found | DomainHunter");
    expect(en.robots).toBe("noindex");
    const zh = await get("/does-not-exist?lang=zh", { ...ANY, "accept-language": "en-US,en;q=0.9" });
    expect(zh.title).toBe("页面不存在 | DomainHunter");
    expect(zh.htmlLang).toBe("zh-CN");
  });
});

describe("404 壳不改变 /api/* 与静态资源路径的 404 行为", () => {
  it.each(["/api/does-not-exist", "/assets/nope.js", "/nope.png", "/does-not-exist.txt"])("%s + Accept: */* → 原样透传 ASSETS 的空 404", async (path) => {
    const r = await get(path, ANY);
    expect(r.status).toBe(404);
    expect(r.html).toBe("");
    expect(r.contentType).toBeNull();
    expect(r.robots).toBeNull();
  });

  it.each(["/api/does-not-exist", "/nope.png"])("%s + Accept: text/html → 仍回 404 壳（与改前一致）", async (path) => {
    const r = await get(path, HTML);
    expect(r.status).toBe(404);
    expect(r.title).toBe("页面不存在 | DomainHunter");
  });

  it("非 GET（POST 未知路径）保持原样空 404", async () => {
    const res = await worker.fetch(new Request("https://hunt.zalize.com/does-not-exist", { method: "POST", headers: HTML }), fakeEnv as never, ctx);
    expect(res.status).toBe(404);
    expect(await res.text()).toBe("");
  });
});
