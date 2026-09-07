/**
 * R565：POST /api/monitor/webhook-test —— 向用户填的 https 地址真实 POST 一条 event=test 通知（与掉落通知同字段），
 * 回传对方 HTTP 状态；每 IP 30 秒限频；不写 monitor:domains；不回传对方响应体。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("cloudflare:sockets", () => ({ connect: () => { throw new Error("not available in vitest"); } }));

import worker from "./worker";

function fakeEnv(seed: Record<string, unknown> = {}) {
  const store = new Map(Object.entries(seed).map(([k, v]) => [k, JSON.stringify(v)]));
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
      },
      DEEPSEEK_API_KEY: "",
    },
  };
}

const ctx = { waitUntil: () => {}, passThroughOnException: () => {} } as unknown as ExecutionContext;

async function post(env: unknown, body: unknown, ip = "203.0.113.7") {
  const res = await worker.fetch(
    new Request("https://hunt.zalize.com/api/monitor/webhook-test", {
      method: "POST",
      headers: { "content-type": "application/json", "cf-connecting-ip": ip },
      body: JSON.stringify(body),
    }),
    env as never,
    ctx,
  );
  return { status: res.status, headers: res.headers, json: (await res.json()) as Record<string, unknown> };
}

const HOOK = "https://hook.example/incoming/abcd1234";
const outbound: { url: string; init?: RequestInit }[] = [];
let upstream: () => Response | Promise<Response> = () => new Response("ok", { status: 200 });
const realFetch = globalThis.fetch;

beforeEach(() => {
  outbound.length = 0;
  upstream = () => new Response("ok", { status: 200 });
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    outbound.push({ url: String(url), init });
    return upstream();
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("POST /api/monitor/webhook-test", () => {
  it("合法 https 地址 → 真实 POST test payload，回传 delivered/status；不写 monitor:domains", async () => {
    const { env, store } = fakeEnv();
    const r = await post(env, { webhook: HOOK });
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ ok: true, delivered: true, status: 200 });
    expect(outbound).toHaveLength(1);
    expect(outbound[0]?.url).toBe(HOOK);
    expect(outbound[0]?.init?.method).toBe("POST");
    const payload = JSON.parse(String(outbound[0]?.init?.body)) as Record<string, unknown>;
    expect(payload).toMatchObject({ source: "domainhunter", event: "test", msg_type: "text", msgtype: "text", url: "https://hunt.zalize.com" });
    // 与真实掉落通知同字段集，接收端只需按 event 分流
    expect(Object.keys(payload).sort()).toEqual(["at", "content", "domain", "event", "from", "msg_type", "msgtype", "source", "text", "to", "url"]);
    expect(typeof payload.text).toBe("string");
    expect((payload.content as { text: string }).text).toBe(payload.text);
    expect(store.has("monitor:domains")).toBe(false);
  });

  it("对方非 2xx → 200 delivered:false 带状态码，不透传对方响应体", async () => {
    upstream = () => new Response("secret body", { status: 403 });
    const { env } = fakeEnv();
    const r = await post(env, { webhook: HOOK });
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ ok: true, delivered: false, status: 403 });
    expect(JSON.stringify(r.json)).not.toContain("secret body");
  });

  it("对方超时/网络错误 → 502 unreachable", async () => {
    upstream = () => { throw new DOMException("timeout", "TimeoutError"); };
    const { env } = fakeEnv();
    expect(await post(env, { webhook: HOOK })).toMatchObject({ status: 502, json: { ok: false, error: "unreachable" } });
  });

  it("校验与 /api/monitor 一致：http / 超 500 字符 / 缺失 → 400 invalid_webhook，且不出网", async () => {
    const { env } = fakeEnv();
    expect(await post(env, { webhook: "http://hook.example/x" })).toMatchObject({ status: 400, json: { ok: false, error: "invalid_webhook" } });
    expect(await post(env, { webhook: `https://hook.example/${"a".repeat(500)}` })).toMatchObject({ status: 400, json: { ok: false, error: "invalid_webhook" } });
    expect(await post(env, {})).toMatchObject({ status: 400, json: { ok: false, error: "invalid_webhook" } });
    expect(outbound).toHaveLength(0);
  });

  it("每 IP 30 秒限频：第二次 429 + Retry-After；不同 IP 不受影响；冷却期过后放行", async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-09-06T20:00:00Z"));
      const { env } = fakeEnv();
      expect((await post(env, { webhook: HOOK })).status).toBe(200);
      const second = await post(env, { webhook: HOOK });
      expect(second.status).toBe(429);
      expect(second.json).toMatchObject({ ok: false, error: "rate_limited" });
      expect(Number(second.headers.get("Retry-After"))).toBeGreaterThan(0);
      expect(Number(second.headers.get("Retry-After"))).toBeLessThanOrEqual(30);
      expect((await post(env, { webhook: HOOK }, "198.51.100.9")).status).toBe(200);
      vi.setSystemTime(new Date("2026-09-06T20:00:31Z"));
      expect((await post(env, { webhook: HOOK })).status).toBe(200);
      expect(outbound).toHaveLength(3);
    } finally {
      vi.useRealTimers();
    }
  });

  it("无 KV 绑定 → 503 monitor_unavailable", async () => {
    const r = await post({ ASSETS: { fetch: async () => new Response("", { status: 404 }) }, DEEPSEEK_API_KEY: "" }, { webhook: HOOK });
    expect(r).toMatchObject({ status: 503, json: { ok: false, error: "monitor_unavailable" } });
  });
});
