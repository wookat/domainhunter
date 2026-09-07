/**
 * R573：/api/check、MCP check_domains / suggest_variants 走 check 桶（按域名个数 200/h），
 * /api/ai-search 走 ai 桶（20/h）；两桶 KV key 与计数互不影响；429 响应体带 scope + Retry-After。
 * 测试不出网：核验与 LLM 全部 mock。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CheckResult } from "@domainhunter/core";

vi.mock("cloudflare:sockets", () => ({ connect: () => { throw new Error("not available in vitest"); } }));

vi.mock("@domainhunter/core", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@domainhunter/core")>();
  return {
    ...mod,
    checkDomains: async (domains: string[], onResult: (r: CheckResult) => void | Promise<void>) => {
      for (const domain of domains) await onResult({ domain, status: "taken", method: "rdap" } as CheckResult);
    },
  };
});

// LLM 两路都不出网：理解返回空、候选生成直接抛「无 key」→ 走规则降级（离线）
vi.mock("./ai", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./ai")>();
  return {
    ...mod,
    generateUnderstanding: async () => null,
    generateAiCandidates: async () => { throw new Error("no api key (vitest)"); },
  };
});

import worker from "./worker";
import { TLD_LIST } from "./content/tld-list";

function fakeEnv() {
  const store = new Map<string, string>();
  return {
    store,
    env: {
      ASSETS: { fetch: async () => new Response("", { status: 404 }) },
      CACHE: {
        get: async (key: string, type?: string) => {
          const raw = store.get(key) ?? null;
          return raw !== null && type === "json" ? JSON.parse(raw) : raw;
        },
        put: async (key: string, value: string) => void store.set(key, value),
        delete: async (key: string) => void store.delete(key),
        list: async () => ({ keys: [], list_complete: true, cacheStatus: null }),
      },
      DEEPSEEK_API_KEY: "",
    },
  };
}

const ctx = { waitUntil: () => {}, passThroughOnException: () => {} } as unknown as ExecutionContext;
const IP = "203.0.113.9";
const HOUR_MS = 3600_000;
// 固定在某小时第 20 分钟：距下一整点 2400s
const NOW = 500_000 * HOUR_MS + 20 * 60_000;
const hour = String(Math.floor(NOW / HOUR_MS));

beforeEach(() => {
  vi.useFakeTimers({ now: NOW, toFake: ["Date"] });
  vi.stubGlobal("fetch", async () => new Response("offline (vitest)", { status: 503 }));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function postJson(env: unknown, path: string, body: unknown, headers: Record<string, string> = {}) {
  return worker.fetch(
    new Request(`https://hunt.zalize.com${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", "cf-connecting-ip": IP, ...headers },
      body: JSON.stringify(body),
    }),
    env as never,
    ctx,
  );
}

const domainsOf = (n: number, prefix = "r573") => Array.from({ length: n }, (_, i) => `${prefix}-${i}.com`);

async function drain(res: Response) {
  await res.text();
}

const mcpCall = (name: string, args: unknown) => ({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } });

describe("R573 /api/check 独立 check 桶", () => {
  it("按域名个数计权写入 rl:check:${ip}:${hour}，不碰 rl:ai / 老 key", async () => {
    const { env, store } = fakeEnv();
    const res = await postJson(env, "/api/check?refresh=1", { domains: domainsOf(100) });
    expect(res.status).toBe(200);
    await drain(res);
    expect(store.get(`rl:check:${IP}:${hour}`)).toBe("100");
    expect(store.get(`rl:ai:${IP}:${hour}`)).toBeUndefined();
    expect(store.get(`rl:${IP}:${hour}`)).toBeUndefined();
    // 重复域名去重后计权：3 个名字重复成 6 个只扣 3
    const res2 = await postJson(env, "/api/check", { domains: [...domainsOf(3, "dup"), ...domainsOf(3, "dup")] });
    expect(res2.status).toBe(200);
    await drain(res2);
    expect(store.get(`rl:check:${IP}:${hour}`)).toBe("103");
  });

  it("超过 200 域名/h → 429：{error, scope:'check', limit, retryAfter} + 双语 message + Retry-After 到整点", async () => {
    const { env, store } = fakeEnv();
    for (let i = 0; i < 2; i++) await drain(await postJson(env, "/api/check", { domains: domainsOf(100, `b${i}`) }));
    expect(store.get(`rl:check:${IP}:${hour}`)).toBe("200");

    const zh = await postJson(env, "/api/check", { domains: ["example.com"] }, { "accept-language": "zh-CN" });
    expect(zh.status).toBe(429);
    expect(zh.headers.get("Retry-After")).toBe("2400");
    const zhBody = (await zh.json()) as Record<string, unknown>;
    expect(zhBody).toEqual({
      error: "rate_limited",
      scope: "check",
      limit: 200,
      retryAfter: 2400,
      message: "重新核验太频繁：每小时最多 200 个域名，下个整点再试",
    });
    // 被拒的请求不扣名额
    expect(store.get(`rl:check:${IP}:${hour}`)).toBe("200");

    const en = await postJson(env, "/api/check?lang=en", { domains: ["example.com"] });
    expect(en.status).toBe(429);
    const enBody = (await en.json()) as { scope: string; message: string };
    expect(enBody.scope).toBe("check");
    expect(enBody.message).toContain("up to 200 domains per hour");
    expect(enBody.message).not.toMatch(/AI/);
  });

  it("桶隔离：check 桶打满后 /api/ai-search 仍进入正常流式路径（非 429/rate_limited）", async () => {
    const { env, store } = fakeEnv();
    for (let i = 0; i < 2; i++) await drain(await postJson(env, "/api/check", { domains: domainsOf(100, `c${i}`) }));
    expect((await postJson(env, "/api/check", { domains: ["example.com"] })).status).toBe(429);

    const ai = await postJson(env, "/api/ai-search", { description: "极简咖啡品牌", tlds: ["com"], target: 3 });
    expect(ai.status).toBe(200);
    const text = await ai.text();
    expect(text).not.toContain('"rate_limited"');
    expect(store.get(`rl:ai:${IP}:${hour}`)).toBe("1");
    expect(store.get(`rl:check:${IP}:${hour}`)).toBe("200");
  });

  it("反向隔离：ai 桶 20 次打满 → ai-search 429（scope:'ai'，文案不变），/api/check 不受影响", async () => {
    const { env, store } = fakeEnv();
    store.set(`rl:ai:${IP}:${hour}`, "20");
    const ai = await postJson(env, "/api/ai-search", { description: "极简咖啡品牌", tlds: ["com"], lang: "zh" });
    expect(ai.status).toBe(429);
    expect(ai.headers.get("Retry-After")).toBe("2400");
    expect(await ai.json()).toEqual({
      error: "rate_limited",
      scope: "ai",
      limit: 20,
      retryAfter: 2400,
      message: "今天猎得有点勤快了：每小时最多 20 次 AI 猎名，休息一会儿再来吧",
    });
    const check = await postJson(env, "/api/check", { domains: ["example.com"] });
    expect(check.status).toBe(200);
    await drain(check);
    expect(store.get(`rl:check:${IP}:${hour}`)).toBe("1");
  });

  it("老共用 key rl:${ip}:${hour} 已计满 20 也不影响任一新桶（自然过期，不迁移）", async () => {
    const { env, store } = fakeEnv();
    store.set(`rl:${IP}:${hour}`, "20");
    const check = await postJson(env, "/api/check", { domains: ["example.com"] });
    expect(check.status).toBe(200);
    await drain(check);
    const ai = await postJson(env, "/api/ai-search", { description: "极简咖啡品牌", tlds: ["com"], target: 3 });
    expect(ai.status).toBe(200);
    await ai.text();
    expect(store.get(`rl:${IP}:${hour}`)).toBe("20");
  });
});

describe("R573 MCP check_domains / suggest_variants 走 check 桶", () => {
  it("check_domains 按接受的域名数计权，与 /api/check 共用 rl:check 桶", async () => {
    const { env, store } = fakeEnv();
    const res = await postJson(env, "/mcp", mcpCall("check_domains", { domains: domainsOf(10, "mcp") }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { result: { isError?: boolean } };
    expect(body.result.isError).not.toBe(true);
    expect(store.get(`rl:check:${IP}:${hour}`)).toBe("10");
    expect(store.get(`rl:ai:${IP}:${hour}`)).toBeUndefined();

    store.set(`rl:check:${IP}:${hour}`, "195");
    const denied = await postJson(env, "/mcp", mcpCall("check_domains", { domains: domainsOf(6, "deny") }));
    const dj = (await denied.json()) as { result: { isError?: boolean; content: { text: string }[] } };
    expect(dj.result.isError).toBe(true);
    expect(dj.result.content[0].text).toContain("rate limited (check)");
    expect(dj.result.content[0].text).toContain("200 domains per hour");
    expect(dj.result.content[0].text).toContain("retry in 2400s");
    expect(store.get(`rl:check:${IP}:${hour}`)).toBe("195");
  });

  it("suggest_variants 不调 LLM → 归 check 桶，按实际核验的变体数计权", async () => {
    const { env, store } = fakeEnv();
    // 预置价格缓存，跳过 Porkbun 拉取重试（与限频无关）
    store.set(`prices:v2:${TLD_LIST.length}`, JSON.stringify({ prices: { com: { registration: 10, renewal: 12 } }, tldCount: 1, fetchedAt: NOW }));
    const res = await postJson(env, "/mcp", mcpCall("suggest_variants", { name: "zalize", tlds: ["com"], limit: 8 }));
    const body = (await res.json()) as { result: { isError?: boolean } };
    expect(body.result.isError).not.toBe(true);
    expect(store.get(`rl:check:${IP}:${hour}`)).toBe("8");
    expect(store.get(`rl:ai:${IP}:${hour}`)).toBeUndefined();

    store.set(`rl:check:${IP}:${hour}`, "200");
    const denied = await postJson(env, "/mcp", mcpCall("suggest_variants", { name: "zalize", tlds: ["com"], limit: 1 }));
    const dj = (await denied.json()) as { result: { isError?: boolean; content: { text: string }[] } };
    expect(dj.result.isError).toBe(true);
    expect(dj.result.content[0].text).toContain("rate limited (check)");
  });
});
