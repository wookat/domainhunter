import { describe, expect, it, vi } from "vitest";

// worker.ts 经 whois.ts 依赖 Workers 运行时专有模块；本测试只走 /shortlist /monitors 壳路由，不会触达 socket
vi.mock("cloudflare:sockets", () => ({ connect: () => { throw new Error("not available in vitest"); } }));

import worker from "./worker";
import { HOME_META } from "./content/home-copy";

// 与 index.html 同结构的最小壳：两页只做正则替换，这里验证 <html lang> / og:locale / title / robots / canonical
const SHELL = `<!doctype html><html lang="zh-CN"><head>
    <title>${HOME_META.zh.title}</title>
    <meta name="description" content="首页描述" />
    <link rel="canonical" href="https://hunt.zalize.com/" />
    <meta property="og:title" content="DomainHunter — 首页" />
    <meta property="og:locale" content="zh_CN" />
  </head><body><div id="root"></div></body></html>`;

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
    vary: res.headers.get("vary"),
    html,
    title: pick(/<title>([\s\S]*?)<\/title>/),
    robots: pick(/<meta name="robots" content="([^"]*)" \/>/),
    canonical: pick(/<link rel="canonical" href="([^"]*)" \/>/),
    htmlLang: pick(/<html lang="([^"]*)"/),
    ogLocale: pick(/<meta property="og:locale" content="([^"]*)"/),
  };
}

const HTML = { accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" };

// 两页 × zh/en：title 与 SPA 水合后 document.title 同源（i18n.tsx：/shortlist ∈ HOME_TITLE_PATHS → meta.title；/monitors → `${monitors.title} | DomainHunter`）
const CASES = [
  { path: "/shortlist", lang: "zh", title: HOME_META.zh.title, htmlLang: "zh-CN", ogLocale: "zh_CN" },
  { path: "/shortlist", lang: "en", title: HOME_META.en.title, htmlLang: "en", ogLocale: "en_US" },
  { path: "/monitors", lang: "zh", title: "监控管理 | DomainHunter", htmlLang: "zh-CN", ogLocale: "zh_CN" },
  { path: "/monitors", lang: "en", title: "Monitors | DomainHunter", htmlLang: "en", ogLocale: "en_US" },
] as const;

describe("/shortlist /monitors SPA 壳（R543）：<html lang> 与 title 随 ?lang / Accept-Language，noindex 与裸路径 canonical 不变", () => {
  it.each(CASES)("$path?lang=$lang → <html lang=$htmlLang> + 「$title」", async (tc) => {
    const r = await get(`${tc.path}?lang=${tc.lang}`, HTML);
    expect(r.status).toBe(200);
    expect(r.htmlLang).toBe(tc.htmlLang);
    expect(r.ogLocale).toBe(tc.ogLocale);
    expect(r.title).toBe(tc.title);
    expect(r.robots).toBe("noindex");
    expect(r.canonical).toBe(`https://hunt.zalize.com${tc.path}`);
    expect(r.html).not.toContain('hreflang="');
    expect(r.html).toContain('<div id="root"></div>');
  });

  it.each(["/shortlist", "/monitors"] as const)("%s 无 ?lang：Accept-Language en-US → en；zh-CN / 无头 → zh；?lang=zh 覆盖 Accept-Language", async (path) => {
    const en = await get(path, { ...HTML, "accept-language": "en-US,en;q=0.9" });
    expect(en.htmlLang).toBe("en");
    expect(en.title).toBe(path === "/monitors" ? "Monitors | DomainHunter" : HOME_META.en.title);
    expect(en.vary).toBe("Accept-Language");
    expect(en.canonical).toBe(`https://hunt.zalize.com${path}`);

    const zh = await get(path, { ...HTML, "accept-language": "zh-CN,zh;q=0.9" });
    expect(zh.htmlLang).toBe("zh-CN");
    expect(zh.title).toBe(path === "/monitors" ? "监控管理 | DomainHunter" : HOME_META.zh.title);

    const bare = await get(path, HTML);
    expect(bare.htmlLang).toBe("zh-CN");
    expect(bare.robots).toBe("noindex");

    const forced = await get(`${path}?lang=zh`, { ...HTML, "accept-language": "en-US,en;q=0.9" });
    expect(forced.htmlLang).toBe("zh-CN");
    expect(forced.ogLocale).toBe("zh_CN");
  });
});
