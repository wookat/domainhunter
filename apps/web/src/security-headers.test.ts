import { describe, expect, it, vi } from "vitest";

vi.mock("cloudflare:sockets", () => ({ connect: () => { throw new Error("not available in vitest"); } }));

import worker from "./worker";
import {
  addScriptNonce,
  buildCspReportOnly,
  CSP_SAMPLES_KEY,
  CSP_SAMPLES_MAX,
  generateNonce,
  mergeCspSamples,
  parseCspReports,
  recordCspSamples,
  type CspSample,
} from "./security-headers";
import { readDayUsage } from "./usage-counter";

// 与 index.html 同结构的最小壳：含主题脚本 / 重载脚本（无 nonce）、模块入口、内联 @font-face
const SHELL = `<!doctype html><html><head>
    <title>DomainHunter</title>
    <style>@font-face{font-family:'Inter';src:url(/fonts/inter.woff2)}</style>
    <script>try{localStorage.getItem("domainhunter:theme")}catch(e){}</script>
    <script type="module" crossorigin src="/assets/index-abc.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-abc.css">
  </head><body><div id="root"></div></body></html>`;

function fakeEnv(kv: Record<string, unknown> = {}, extra: Record<string, string> = {}) {
  const store = new Map(Object.entries(kv).map(([k, v]) => [k, JSON.stringify(v)]));
  return {
    env: {
      ASSETS: {
        fetch: async (req: Request) => {
          const p = new URL(req.url).pathname;
          if (p === "/" || p === "/index.html") return new Response(SHELL, { headers: { "content-type": "text/html; charset=utf-8" } });
          if (p === "/assets/index-abc.css") return new Response("body{margin:0}", { headers: { "content-type": "text/css" } });
          if (p === "/assets/index-abc.js") return new Response("console.log(1)", { headers: { "content-type": "text/javascript" } });
          if (p === "/favicon.svg") return new Response("<svg/>", { headers: { "content-type": "image/svg+xml" } });
          return new Response("not found", { status: 404, headers: { "content-type": "text/plain" } });
        },
      },
      CACHE: {
        get: async (key: string, type?: string) => {
          const raw = store.get(key) ?? null;
          return raw !== null && type === "json" ? JSON.parse(raw) : raw;
        },
        put: async (key: string, value: string) => void store.set(key, value),
        delete: async (key: string) => void store.delete(key),
        list: async ({ prefix }: { prefix: string }) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }),
      },
      DEEPSEEK_API_KEY: "",
      ...extra,
    },
    store,
  };
}

function ctx() {
  const pending: Promise<unknown>[] = [];
  return {
    ctx: { waitUntil: (p: Promise<unknown>) => void pending.push(p), passThroughOnException: () => {} } as unknown as ExecutionContext,
    settle: () => Promise.allSettled(pending),
  };
}

const UA = { "user-agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/128 Safari/537.36" };

async function get(path: string, env = fakeEnv().env, init: RequestInit = {}) {
  const { ctx: ec } = ctx();
  return worker.fetch(new Request(`https://hunt.zalize.com${path}`, { headers: UA, ...init }), env as never, ec);
}

const HTML_HEADERS = ["strict-transport-security", "x-content-type-options", "referrer-policy", "x-frame-options", "permissions-policy", "content-security-policy-report-only"] as const;

describe("security-headers 纯函数", () => {
  it("generateNonce：16 字节 base64，每次不同", () => {
    const a = generateNonce();
    const b = generateNonce();
    expect(a).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(a).not.toBe(b);
  });

  it("buildCspReportOnly：基线指令 + nonce；配置分析 beacon 时追加两个 Cloudflare 源", () => {
    const base = buildCspReportOnly("N0nce", false);
    expect(base).toContain("default-src 'self'");
    expect(base).toContain("script-src 'self' 'nonce-N0nce'");
    expect(base).toContain("style-src 'self' 'unsafe-inline'");
    expect(base).toContain("img-src 'self' data:");
    expect(base).toContain("font-src 'self'");
    expect(base).toContain("connect-src 'self'");
    expect(base).toContain("object-src 'none'");
    expect(base).toContain("frame-ancestors 'none'");
    expect(base).toContain("base-uri 'self'");
    expect(base).toContain("form-action 'self'");
    expect(base).toContain("report-uri /api/csp-report");
    expect(base).not.toContain("report-to"); // Chrome 有 report-to 会忽略 report-uri 且延迟投递，本轮只用 report-uri
    expect(base).not.toContain("cloudflareinsights");
    // style-src 不带 nonce（否则 CSP3 浏览器忽略 'unsafe-inline'，运行时 style 属性会被拦）
    expect(base).not.toMatch(/style-src[^;]*nonce/);
    const withBeacon = buildCspReportOnly("N0nce", true);
    expect(withBeacon).toContain("script-src 'self' 'nonce-N0nce' https://static.cloudflareinsights.com");
    expect(withBeacon).toContain("connect-src 'self' https://cloudflareinsights.com");
  });

  it("addScriptNonce：内联/外链/模块脚本都加 nonce，ld+json 数据块与已带 nonce 的跳过", () => {
    const html = `<script>a()</script><script type="module" src="/x.js"></script><script type="application/ld+json">{"@context":"x"}</script><script nonce="keep">b()</script><SCRIPT>c()</SCRIPT>`;
    const out = addScriptNonce(html, "abc");
    expect(out).toBe(
      `<script nonce="abc">a()</script><script nonce="abc" type="module" src="/x.js"></script><script type="application/ld+json">{"@context":"x"}</script><script nonce="keep">b()</script><script nonce="abc">c()</SCRIPT>`,
    );
  });

  it("parseCspReports：兼容 report-uri（csp-report）与 Reporting API（reports+json）两种格式，只留 directive + 去 query 的 blocked-uri", () => {
    const legacy = parseCspReports({
      "csp-report": {
        "document-uri": "https://hunt.zalize.com/tld/cn?x=1",
        "violated-directive": "script-src-elem",
        "effective-directive": "script-src-elem",
        "blocked-uri": "https://evil.example/a.js?token=SECRET#frag",
        "original-policy": "…",
        "source-file": "https://hunt.zalize.com/",
      },
    });
    expect(legacy).toEqual([{ directive: "script-src-elem", blockedUri: "https://evil.example/a.js" }]);
    const modern = parseCspReports([
      { type: "csp-violation", age: 1, url: "https://hunt.zalize.com/", user_agent: "UA", body: { effectiveDirective: "style-src-attr", blockedURL: "inline", disposition: "report" } },
      { type: "deprecation", body: {} },
      { type: "csp-violation", body: { blockedURL: "eval" } }, // 无 directive → 丢弃
    ]);
    expect(modern).toEqual([{ directive: "style-src-attr", blockedUri: "inline" }]);
    expect(parseCspReports(null)).toEqual([]);
    expect(parseCspReports("x")).toEqual([]);
    expect(parseCspReports({ "csp-report": { "violated-directive": "img-src", "blocked-uri": "x".repeat(500) } })[0].blockedUri).toHaveLength(200);
  });

  it("mergeCspSamples：同 directive+blockedUri 去重累加，超过 20 条丢弃", () => {
    const one = { directive: "script-src-elem", blockedUri: "inline" };
    const r1 = mergeCspSamples([], [one, one], 1000);
    expect(r1.changed).toBe(true);
    expect(r1.samples).toEqual([{ ...one, count: 2, firstAt: 1000, lastAt: 1000 }]);
    const full: CspSample[] = Array.from({ length: CSP_SAMPLES_MAX }, (_, i) => ({ directive: "img-src", blockedUri: `https://x/${i}`, count: 1, firstAt: 1, lastAt: 1 }));
    const r2 = mergeCspSamples(full, [{ directive: "img-src", blockedUri: "https://x/new" }], 2000);
    expect(r2.changed).toBe(false);
    expect(r2.samples).toHaveLength(CSP_SAMPLES_MAX);
    const r3 = mergeCspSamples(full, [{ directive: "img-src", blockedUri: "https://x/3" }], 3000);
    expect(r3.samples[3]).toMatchObject({ count: 2, lastAt: 3000 });
  });

  it("recordCspSamples：KV 中无样本时写入；空输入不写", async () => {
    const { env, store } = fakeEnv();
    await recordCspSamples(env.CACHE, [], 1);
    expect(store.has(CSP_SAMPLES_KEY)).toBe(false);
    await recordCspSamples(env.CACHE, [{ directive: "font-src", blockedUri: "https://fonts.example/a.woff2" }], 1);
    expect(JSON.parse(store.get(CSP_SAMPLES_KEY)!)).toEqual([{ directive: "font-src", blockedUri: "https://fonts.example/a.woff2", count: 1, firstAt: 1, lastAt: 1 }]);
  });
});

describe("worker 响应头中间件（R533）", () => {
  it("HTML 文档（首页 / SSR 内容页 / 404 壳 / 分享页 410）带全套安全头，且 Vary: Accept-Language 保留", async () => {
    for (const [path, status] of [["/", 200], ["/tld/cn", 200], ["/this/does/not/exist", 404], ["/s/abc123", 410]] as const) {
      const res = await get(path, fakeEnv({ "share:abc123": { revoked: true, revokedAt: 1 } }).env, { headers: { ...UA, accept: "text/html" } });
      expect(res.status, path).toBe(status);
      expect(res.headers.get("content-type"), path).toContain("text/html");
      for (const h of HTML_HEADERS) expect(res.headers.get(h), `${path} ${h}`).toBeTruthy();
      expect(res.headers.get("strict-transport-security")).toBe("max-age=31536000; includeSubDomains");
      expect(res.headers.get("x-content-type-options")).toBe("nosniff");
      expect(res.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
      expect(res.headers.get("x-frame-options")).toBe("DENY");
      expect(res.headers.get("permissions-policy")).toContain("camera=()");
      expect(res.headers.get("permissions-policy")).toContain("payment=()");
      expect(res.headers.get("content-security-policy")).toBeNull(); // 本轮只 Report-Only
      expect(res.headers.get("reporting-endpoints")).toBeNull();
      expect(res.headers.get("vary")).toContain("Accept-Language");
    }
  });

  it("HTML：CSP nonce 每请求不同，且 HTML 内全部可执行 <script>（含 worker 注入的 __DH_CONTENT__）都带同一 nonce，ld+json 不带", async () => {
    const nonceOf = (res: Response) => res.headers.get("content-security-policy-report-only")!.match(/'nonce-([^']+)'/)![1];
    const a = await get("/tld/cn");
    const b = await get("/tld/cn");
    const na = nonceOf(a);
    const nb = nonceOf(b);
    expect(na).not.toBe(nb);
    const html = await a.text();
    const scripts = [...html.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
    expect(scripts.length).toBeGreaterThanOrEqual(3);
    for (const attrs of scripts) {
      if (/application\/ld\+json/.test(attrs)) expect(attrs).not.toContain("nonce=");
      else expect(attrs).toContain(`nonce="${na}"`);
    }
    expect(html).toContain(`<script nonce="${na}">window.__DH_CONTENT__=`);
    expect(html).not.toContain(nb);
  });

  it("配置 ANALYTICS_PROVIDER=cloudflare 时：beacon 标签带 nonce，CSP 追加 cloudflareinsights 源", async () => {
    const res = await get("/", fakeEnv({}, { ANALYTICS_PROVIDER: "cloudflare", ANALYTICS_TOKEN: "0123456789abcdef0123456789abcdef" }).env);
    const csp = res.headers.get("content-security-policy-report-only")!;
    expect(csp).toContain("https://static.cloudflareinsights.com");
    expect(csp).toContain("connect-src 'self' https://cloudflareinsights.com");
    const nonce = csp.match(/'nonce-([^']+)'/)![1];
    expect(await res.text()).toContain(`<script nonce="${nonce}" type="module" src="https://static.cloudflareinsights.com/beacon.min.js"`);
  });

  it("/api/* 与 POST /mcp：只加 nosniff + Referrer-Policy，无 HSTS/CSP/XFO，原 cache-control 不变", async () => {
    const usage = await get("/api/usage");
    expect(usage.status).toBe(200);
    expect(usage.headers.get("x-content-type-options")).toBe("nosniff");
    expect(usage.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(usage.headers.get("cache-control")).toBe("public, max-age=300");
    for (const h of ["strict-transport-security", "x-frame-options", "permissions-policy", "content-security-policy-report-only"]) expect(usage.headers.get(h), h).toBeNull();

    const mcp = await get("/mcp", undefined, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }) });
    expect(mcp.status).toBe(200);
    expect(mcp.headers.get("content-type")).toContain("application/json");
    expect(mcp.headers.get("x-content-type-options")).toBe("nosniff");
    expect(mcp.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(mcp.headers.get("content-security-policy-report-only")).toBeNull();
    expect(mcp.headers.get("x-frame-options")).toBeNull();
  });

  it("sitemap / robots / llms.txt / OG SVG / ASSETS 静态资源：同为基线两头，content-type 原样", async () => {
    for (const [path, ct] of [["/sitemap.xml", "xml"], ["/robots.txt", "text/plain"], ["/llms.txt", "text/plain"], ["/api/og/tld/cn", "image/svg+xml"], ["/favicon.svg", "image/svg+xml"], ["/assets/index-abc.js", "javascript"]] as const) {
      const res = await get(path);
      expect(res.status, path).toBe(200);
      expect(res.headers.get("content-type"), path).toContain(ct);
      expect(res.headers.get("x-content-type-options"), path).toBe("nosniff");
      expect(res.headers.get("referrer-policy"), path).toBe("strict-origin-when-cross-origin");
      expect(res.headers.get("content-security-policy-report-only"), path).toBeNull();
    }
  });
});

describe("POST /api/csp-report（R533）", () => {
  it("两种上报格式都计入当日 usage.cspReports 并写去重样本；/api/usage 透出 cspSamples；不存 UA/IP/页面 URL", async () => {
    const { env, store } = fakeEnv();
    const { ctx: ec, settle } = ctx();
    const post = (body: string, type: string) =>
      worker.fetch(new Request("https://hunt.zalize.com/api/csp-report", { method: "POST", headers: { "content-type": type, "user-agent": "SecretUA/1.0" }, body }), env as never, ec);
    const legacy = await post(JSON.stringify({ "csp-report": { "violated-directive": "script-src-elem", "blocked-uri": "https://evil.example/a.js?k=v", "document-uri": "https://hunt.zalize.com/secret-page" } }), "application/csp-report");
    expect(legacy.status).toBe(204);
    expect(legacy.headers.get("cache-control")).toBe("no-store");
    const modern = await post(
      JSON.stringify([
        { type: "csp-violation", user_agent: "SecretUA/1.0", body: { effectiveDirective: "script-src-elem", blockedURL: "https://evil.example/a.js" } },
        { type: "csp-violation", body: { effectiveDirective: "style-src-attr", blockedURL: "inline" } },
      ]),
      "application/reports+json",
    );
    expect(modern.status).toBe(204);
    expect((await post("not json", "application/csp-report")).status).toBe(204);
    expect((await post("{}", "application/json")).status).toBe(204);
    await settle();
    await new Promise((r) => setTimeout(r, 1200)); // usage 计数器 1s 合并窗口

    const today = new Date().toISOString().slice(0, 10);
    const day = await readDayUsage(env.CACHE, today);
    expect(day?.cspReports).toBe(3);
    const samples = JSON.parse(store.get(CSP_SAMPLES_KEY)!) as CspSample[];
    expect(samples).toHaveLength(2);
    expect(samples[0]).toMatchObject({ directive: "script-src-elem", blockedUri: "https://evil.example/a.js", count: 2 });
    expect(samples[1]).toMatchObject({ directive: "style-src-attr", blockedUri: "inline", count: 1 });
    const dump = JSON.stringify([...store.entries()]);
    expect(dump).not.toContain("SecretUA");
    expect(dump).not.toContain("secret-page");
    expect(dump).not.toContain("k=v");

    const usage = await get("/api/usage", env);
    const json = (await usage.json()) as { days: Record<string, { cspReports?: number }>; cspSamples: CspSample[] };
    expect(json.days[today]?.cspReports).toBe(3);
    expect(json.cspSamples).toHaveLength(2);
  });

  it("超过 16KB 的上报直接 413 丢弃，不写 KV", async () => {
    const { env, store } = fakeEnv();
    const { ctx: ec, settle } = ctx();
    const body = JSON.stringify({ "csp-report": { "violated-directive": "img-src", "blocked-uri": "x".repeat(17 * 1024) } });
    const res = await worker.fetch(new Request("https://hunt.zalize.com/api/csp-report", { method: "POST", headers: { "content-type": "application/csp-report" }, body }), env as never, ec);
    expect(res.status).toBe(413);
    await settle();
    expect(store.has(CSP_SAMPLES_KEY)).toBe(false);
  });
});
