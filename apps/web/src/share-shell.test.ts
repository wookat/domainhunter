import { describe, expect, it, vi } from "vitest";

// worker.ts 经 whois.ts 依赖 Workers 运行时专有模块；本测试只走 /s/:id SSR 路由，不会触达 socket
vi.mock("cloudflare:sockets", () => ({ connect: () => { throw new Error("not available in vitest"); } }));

import worker from "./worker";
import { shareGoneMeta, shareShellState } from "./share-items";

// 与 index.html 同结构的最小壳：SSR 路由只做正则替换，这里验证替换后的状态码 / robots / title / description
const SHELL = `<!doctype html><html><head>
    <title>DomainHunter — 首页长标题</title>
    <meta name="description" content="首页描述" />
    <link rel="canonical" href="https://hunt.zalize.com/" />
    <meta property="og:title" content="DomainHunter — 首页" />
    <meta property="og:description" content="首页描述" />
    <meta property="og:url" content="https://hunt.zalize.com/" />
    <meta property="og:image" content="https://hunt.zalize.com/og.png" />
    <meta name="twitter:title" content="DomainHunter — 首页" />
    <meta name="twitter:description" content="首页描述" />
  </head><body><div id="root"></div></body></html>`;

function fakeEnv(kv: Record<string, unknown>) {
  const store = new Map(Object.entries(kv).map(([k, v]) => [k, JSON.stringify(v)]));
  return {
    ASSETS: { fetch: async () => new Response(SHELL, { headers: { "content-type": "text/html; charset=utf-8" } }) },
    CACHE: {
      get: async (key: string, type?: string) => {
        const raw = store.get(key) ?? null;
        return raw !== null && type === "json" ? JSON.parse(raw) : raw;
      },
      put: async (key: string, value: string) => void store.set(key, value),
      delete: async (key: string) => void store.delete(key),
    },
    DEEPSEEK_API_KEY: "",
  };
}

const ctx = { waitUntil: () => {}, passThroughOnException: () => {} } as unknown as ExecutionContext;

async function shell(path: string, kv: Record<string, unknown>, headers: Record<string, string> = {}) {
  const res = await worker.fetch(new Request(`https://hunt.zalize.com${path}`, { headers }), fakeEnv(kv) as never, ctx);
  const html = await res.text();
  const pick = (re: RegExp) => html.match(re)?.[1] ?? null;
  return {
    status: res.status,
    html,
    title: pick(/<title>([\s\S]*?)<\/title>/),
    desc: pick(/<meta name="description" content="([^"]*)" \/>/),
    ogTitle: pick(/<meta property="og:title" content="([^"]*)" \/>/),
    robots: pick(/<meta name="robots" content="([^"]*)" \/>/),
    canonical: pick(/<link rel="canonical" href="([^"]*)" \/>/),
  };
}

const REVOKED = { revoked: true, revokedAt: 1_700_000_000_000 };
const LIVE = { items: [{ domain: "zalize.com", status: "available" }, { domain: "zalize.cn", status: "available" }], createdAt: 1_700_000_000_000 };

describe("shareShellState / shareGoneMeta", () => {
  it("撤销占位 → revoked(410)；缺失 / 非法 id / 空 items → notFound(404)；有 items → ready", () => {
    expect(shareShellState(true, REVOKED)).toBe("revoked");
    expect(shareShellState(true, null)).toBe("notFound");
    expect(shareShellState(false, LIVE)).toBe("notFound");
    expect(shareShellState(true, { items: [] })).toBe("notFound");
    expect(shareShellState(true, LIVE)).toBe("ready");
    expect(shareGoneMeta("revoked", "zh").status).toBe(410);
    expect(shareGoneMeta("notFound", "en").status).toBe(404);
  });
});

describe("GET /s/:id SSR 壳（R510）", () => {
  it("已撤销：HTTP 410 + noindex + 中性 zh title/描述，仍是 SPA 壳", async () => {
    const r = await shell("/s/abc123", { "share:abc123": REVOKED });
    expect(r.status).toBe(410);
    expect(r.robots).toBe("noindex");
    expect(r.title).toBe("分享已撤销 | DomainHunter");
    expect(r.ogTitle).toBe("分享已撤销 | DomainHunter");
    expect(r.desc).toBe("链接已失效：分享者已删除这份清单。");
    expect(r.canonical).toBe("https://hunt.zalize.com/s/abc123");
    expect(r.html).toContain('<div id="root"></div>');
    expect(r.html).not.toContain("首页长标题");
  });

  it("已撤销 + ?lang=en / Accept-Language en：英文中性文案", async () => {
    const q = await shell("/s/abc123?lang=en", { "share:abc123": REVOKED });
    expect(q.status).toBe(410);
    expect(q.title).toBe("This share has been revoked | DomainHunter");
    const h = await shell("/s/abc123", { "share:abc123": REVOKED }, { "accept-language": "en-US,en;q=0.9" });
    expect(h.status).toBe(410);
    expect(h.robots).toBe("noindex");
    expect(h.desc).toBe("This link is no longer active — the owner deleted this shortlist.");
  });

  it("不存在的 id：HTTP 404 + noindex + 中性 title（zh/en）", async () => {
    const zh = await shell("/s/nope-404", {});
    expect(zh.status).toBe(404);
    expect(zh.robots).toBe("noindex");
    expect(zh.title).toBe("分享不存在或已过期 | DomainHunter");
    expect(zh.desc).toBe("分享链接不存在或已过期（快照保留 30 天）。");
    const en = await shell("/s/nope-404?lang=en", {});
    expect(en.status).toBe(404);
    expect(en.title).toBe("Share not found or expired | DomainHunter");
  });

  it("非法 id（超长 / 非法字符）：同样 404 + noindex，不读 KV", async () => {
    const r = await shell(`/s/${"x".repeat(33)}`, {});
    expect(r.status).toBe(404);
    expect(r.robots).toBe("noindex");
    const bad = await shell("/s/a%24b", {});
    expect(bad.status).toBe(404);
  });

  it("有效快照：HTTP 200、无 noindex、title 按快照写「N 个可注册域名候选」（原有行为不变）", async () => {
    const r = await shell("/s/live1", { "share:live1": LIVE });
    expect(r.status).toBe(200);
    expect(r.robots).toBeNull();
    expect(r.title).toBe("2 个可注册域名候选 | DomainHunter");
    expect(r.desc).toContain("zalize.com、zalize.cn");
    expect(r.html).toContain('content="https://hunt.zalize.com/api/og/live1"');
  });
});
