/**
 * R557：POST /api/monitor/add —— 提交即核验一次（非 AI），taken/unknown 写入 monitor:domains，available 不写；
 * 服务端二次校验、全局上限、webhook 与 KV 结构和现有 /api/monitor 一致。
 */
import { describe, expect, it, vi } from "vitest";
import type { CheckResult } from "@domainhunter/core";

vi.mock("cloudflare:sockets", () => ({ connect: () => { throw new Error("not available in vitest"); } }));

// 用可编程的核验结果替代真实 RDAP/WHOIS：测试不出网
const checkPlan = new Map<string, Partial<CheckResult> | Error>();
vi.mock("@domainhunter/core", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@domainhunter/core")>();
  return {
    ...mod,
    checkDomains: async (domains: string[], onResult: (r: CheckResult) => void | Promise<void>) => {
      for (const domain of domains) {
        const plan = checkPlan.get(domain);
        if (plan instanceof Error) throw plan;
        await onResult({ domain, status: "unknown", method: "rdap", ...plan } as CheckResult);
      }
    },
  };
});

import worker from "./worker";

const MONITOR_KEY = "monitor:domains";

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

async function post(env: unknown, body: unknown) {
  const res = await worker.fetch(
    new Request("https://hunt.zalize.com/api/monitor/add", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }),
    env as never,
    ctx,
  );
  return { status: res.status, json: (await res.json()) as Record<string, unknown> & { entry?: Record<string, unknown> } };
}

const monitorMap = (store: Map<string, string>) => JSON.parse(store.get(MONITOR_KEY) ?? "{}") as Record<string, { status: string; expiresAt?: string; webhook?: string }>;

describe("POST /api/monitor/add", () => {
  it("taken + 到期日 → 200 added，写入 monitor:domains 并回传 expiresAt / 名额", async () => {
    checkPlan.set("google.com", { status: "taken", expiresAt: "2028-09-14T04:00:00Z" });
    const { env, store } = fakeEnv();
    const r = await post(env, { domain: " Google.COM ", webhook: "https://hook.example/x" });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, added: true, monitored: 1, limit: 500 });
    expect(r.json.entry).toMatchObject({ domain: "google.com", status: "taken", expiresAt: "2028-09-14T04:00:00Z" });
    expect(monitorMap(store)["google.com"]).toMatchObject({ status: "taken", expiresAt: "2028-09-14T04:00:00Z", webhook: "https://hook.example/x" });
  });

  it("available → 200 added:false，不写入 monitor:domains", async () => {
    checkPlan.set("zqxwv7k3test.com", { status: "available" });
    const { env, store } = fakeEnv();
    const r = await post(env, { domain: "zqxwv7k3test.com" });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, added: false, monitored: 0 });
    expect(r.json.entry).toMatchObject({ domain: "zqxwv7k3test.com", status: "available" });
    expect(store.has(MONITOR_KEY)).toBe(false);
  });

  it("unknown（注册局暂不可达）→ 仍加入监控，status=unknown，等下一轮 cron 复查", async () => {
    checkPlan.set("foo.io", { status: "unknown" });
    const { env, store } = fakeEnv();
    const r = await post(env, { domain: "foo.io" });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, added: true });
    expect(monitorMap(store)["foo.io"].status).toBe("unknown");
  });

  it("服务端二次校验：非法语法 400 invalid_domain；TLD 不在 TLD_LIST 400 unsupported_tld；空体 400", async () => {
    const { env } = fakeEnv();
    expect(await post(env, { domain: "-bad.com" })).toMatchObject({ status: 400, json: { ok: false, error: "invalid_domain" } });
    expect(await post(env, { domain: "foo.com.cn" })).toMatchObject({ status: 400, json: { ok: false, error: "unsupported_tld", tld: "com.cn" } });
    expect(await post(env, {})).toMatchObject({ status: 400, json: { ok: false, error: "invalid_domain" } });
  });

  it("全局上限：已满且为新域名 → 429 monitor_full；已在服务端集合内的域名不占新名额可重核验", async () => {
    const full: Record<string, unknown> = {};
    for (let i = 0; i < 500; i++) full[`d${i}.com`] = { domain: `d${i}.com`, status: "taken", lastChecked: 1 };
    checkPlan.set("new.com", { status: "taken" });
    checkPlan.set("d7.com", { status: "taken", expiresAt: "2027-01-01T00:00:00Z" });
    const { env, store } = fakeEnv({ [MONITOR_KEY]: full });
    expect(await post(env, { domain: "new.com" })).toMatchObject({ status: 429, json: { ok: false, error: "monitor_full", monitored: 500, limit: 500 } });
    const r = await post(env, { domain: "d7.com" });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, added: true, monitored: 500 });
    expect(monitorMap(store)["d7.com"].expiresAt).toBe("2027-01-01T00:00:00Z");
  });

  it("核验抛错 → 502 check_failed，不写入", async () => {
    checkPlan.set("boom.com", new Error("rdap down"));
    const { env, store } = fakeEnv();
    expect(await post(env, { domain: "boom.com" })).toMatchObject({ status: 502, json: { ok: false, error: "check_failed" } });
    expect(store.has(MONITOR_KEY)).toBe(false);
  });

  it("webhook 只接受 https：http 被丢弃，不带 webhook 字段时保留原有 webhook", async () => {
    checkPlan.set("hook.dev", { status: "taken" });
    const { env, store } = fakeEnv({ [MONITOR_KEY]: { "hook.dev": { domain: "hook.dev", status: "taken", lastChecked: 1, webhook: "https://old.example/h" } } });
    await post(env, { domain: "hook.dev" });
    expect(monitorMap(store)["hook.dev"].webhook).toBe("https://old.example/h");
    await post(env, { domain: "hook.dev", webhook: "http://insecure.example/h" });
    expect(monitorMap(store)["hook.dev"].webhook).toBeUndefined();
  });

  it("KV 未绑定 → 503 monitor_unavailable", async () => {
    const r = await worker.fetch(
      new Request("https://hunt.zalize.com/api/monitor/add", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ domain: "a.com" }) }),
      { ASSETS: { fetch: async () => new Response("", { status: 404 }) }, DEEPSEEK_API_KEY: "" } as never,
      ctx,
    );
    expect(r.status).toBe(503);
    expect(await r.json()).toMatchObject({ ok: false, error: "monitor_unavailable" });
  });
});
