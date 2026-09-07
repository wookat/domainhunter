/**
 * R573：按 IP 的小时桶限频拆成 ai / check 两个独立桶；check 桶按域名个数计权；Retry-After 到下一整点。
 */
import { describe, expect, it } from "vitest";

import { aiRateLimitMessage, checkRateLimitMessage, consumeRateLimit, HOUR_MS, RATE_LIMIT_PER_HOUR, RATE_LIMIT_TTL_S, rateLimitKey, retryAfterSeconds } from "./rate-limit";

function fakeKv() {
  const store = new Map<string, string>();
  const puts: { key: string; value: string; ttl?: number }[] = [];
  return {
    store,
    puts,
    kv: {
      get: (async (key: string) => store.get(key) ?? null) as KVNamespace["get"],
      put: (async (key: string, value: string, opts?: { expirationTtl?: number }) => {
        store.set(key, value);
        puts.push({ key, value, ttl: opts?.expirationTtl });
      }) as KVNamespace["put"],
    },
  };
}

// 固定在某小时第 20 分钟：hourBucket = 500_000，距下一整点 40 分钟
const NOW = 500_000 * HOUR_MS + 20 * 60_000;

describe("rateLimitKey / retryAfterSeconds", () => {
  it("key 带 scope 前缀，与 R573 前的 rl:${ip}:${hour} 不同名（老 key 靠 TTL 自然过期）", () => {
    expect(rateLimitKey("ai", "1.2.3.4", NOW)).toBe("rl:ai:1.2.3.4:500000");
    expect(rateLimitKey("check", "1.2.3.4", NOW)).toBe("rl:check:1.2.3.4:500000");
    expect(rateLimitKey("check", "1.2.3.4", NOW)).not.toBe("rl:1.2.3.4:500000");
  });

  it("Retry-After = 距下一整点的秒数（向上取整，≥1）", () => {
    expect(retryAfterSeconds(NOW)).toBe(40 * 60);
    expect(retryAfterSeconds(NOW + 1500)).toBe(40 * 60 - 1);
    expect(retryAfterSeconds((500_001 * HOUR_MS) - 1)).toBe(1);
    expect(retryAfterSeconds(500_001 * HOUR_MS)).toBe(3600);
  });
});

describe("consumeRateLimit", () => {
  it("限额：ai 20/h、check 200/h；TTL 3700s 与 R573 前一致", () => {
    expect(RATE_LIMIT_PER_HOUR).toEqual({ ai: 20, check: 200 });
    expect(RATE_LIMIT_TTL_S).toBe(3700);
  });

  it("桶隔离：check 桶打满不影响 ai 桶，反之亦然", async () => {
    const { kv, store } = fakeKv();
    expect(await consumeRateLimit(kv, "ip", "check", 200, NOW)).toEqual({ ok: true });
    expect(store.get("rl:check:ip:500000")).toBe("200");
    expect(await consumeRateLimit(kv, "ip", "check", 1, NOW)).toMatchObject({ ok: false, scope: "check" });
    // ai 桶仍是空的
    expect(store.get("rl:ai:ip:500000")).toBeUndefined();
    for (let i = 0; i < 20; i++) expect(await consumeRateLimit(kv, "ip", "ai", 1, NOW)).toEqual({ ok: true });
    expect(store.get("rl:ai:ip:500000")).toBe("20");
    expect(await consumeRateLimit(kv, "ip", "ai", 1, NOW)).toMatchObject({ ok: false, scope: "ai", limit: 20 });
    // check 桶计数未被 ai 桶动过
    expect(store.get("rl:check:ip:500000")).toBe("200");
  });

  it("按域名数计权：一次 100 个域名扣 100；超限的整批拒绝且不扣（n + weight > limit）", async () => {
    const { kv, store, puts } = fakeKv();
    expect(await consumeRateLimit(kv, "ip", "check", 100, NOW)).toEqual({ ok: true });
    expect(store.get("rl:check:ip:500000")).toBe("100");
    expect(await consumeRateLimit(kv, "ip", "check", 100, NOW)).toEqual({ ok: true });
    expect(store.get("rl:check:ip:500000")).toBe("200");
    const denied = await consumeRateLimit(kv, "ip", "check", 1, NOW);
    expect(denied).toEqual({ ok: false, scope: "check", limit: 200, retryAfter: 40 * 60 });
    expect(store.get("rl:check:ip:500000")).toBe("200");
    expect(puts).toHaveLength(2);
    expect(puts.every((p) => p.ttl === RATE_LIMIT_TTL_S)).toBe(true);
  });

  it("边界：剩 5 个名额时 6 个域名的批次被拒、5 个放行；weight<1 按 1 计", async () => {
    const { kv, store } = fakeKv();
    await consumeRateLimit(kv, "ip", "check", 195, NOW);
    expect(await consumeRateLimit(kv, "ip", "check", 6, NOW)).toMatchObject({ ok: false });
    expect(await consumeRateLimit(kv, "ip", "check", 5, NOW)).toEqual({ ok: true });
    expect(store.get("rl:check:ip:500000")).toBe("200");
    const { kv: kv2, store: store2 } = fakeKv();
    await consumeRateLimit(kv2, "ip", "check", 0, NOW);
    expect(store2.get("rl:check:ip:500000")).toBe("1");
  });

  it("不同 IP / 不同小时各自独立", async () => {
    const { kv, store } = fakeKv();
    await consumeRateLimit(kv, "a", "check", 200, NOW);
    expect(await consumeRateLimit(kv, "b", "check", 1, NOW)).toEqual({ ok: true });
    expect(await consumeRateLimit(kv, "a", "check", 1, NOW + HOUR_MS)).toEqual({ ok: true });
    expect(store.get("rl:check:a:500001")).toBe("1");
  });

  it("fail-open：无 KV 绑定或 KV 抛错时放行（与 R573 前一致）", async () => {
    expect(await consumeRateLimit(undefined, "ip", "ai", 1, NOW)).toEqual({ ok: true });
    const broken = {
      get: (async () => { throw new Error("kv down"); }) as KVNamespace["get"],
      put: (async () => undefined) as KVNamespace["put"],
    };
    expect(await consumeRateLimit(broken, "ip", "check", 100, NOW)).toEqual({ ok: true });
  });
});

describe("429 文案", () => {
  it("check 桶双语文案含域名数上限；ai 桶保留 R573 前措辞", () => {
    expect(checkRateLimitMessage("zh")).toBe("重新核验太频繁：每小时最多 200 个域名，下个整点再试");
    expect(checkRateLimitMessage("en")).toContain("up to 200 domains per hour");
    expect(aiRateLimitMessage("zh")).toBe("今天猎得有点勤快了：每小时最多 20 次 AI 猎名，休息一会儿再来吧");
    expect(aiRateLimitMessage("en")).toBe("You've been hunting hard today — AI hunts are capped at 20 per hour, come back in a bit");
  });
});
