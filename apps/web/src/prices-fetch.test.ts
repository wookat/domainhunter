import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPorkbunPrices, PRICES_FETCH_ATTEMPTS, PRICES_LAST_FAIL_KEY, PRICES_LAST_OK_KEY, type PricesKv } from "./prices-fetch";

function memKv(): PricesKv & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
  };
}

const noBackoff = async () => {};
const TLDS = ["com", "net"];

const okResponse = () =>
  new Response(JSON.stringify({ pricing: { com: { registration: "11.06", renewal: "12.98" }, net: { registration: "12.5", renewal: "14.2" } } }), { status: 200 });

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("fetchPorkbunPrices", () => {
  it("首次成功：返回价格表并记 lastOk", async () => {
    const kv = memKv();
    const fetchFn = vi.fn(async () => okResponse());
    const prices = await fetchPorkbunPrices(kv, TLDS, 1000, { fetchFn, backoff: noBackoff, now: () => 42 });
    expect(prices).toEqual({ com: { registration: 11.06, renewal: 12.98 }, net: { registration: 12.5, renewal: 14.2 } });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(kv.store.get(PRICES_LAST_OK_KEY)).toBe("42");
    expect(kv.store.has(PRICES_LAST_FAIL_KEY)).toBe(false);
  });

  it("前两次失败后第三次成功：重试并记 lastOk", async () => {
    const kv = memKv();
    let calls = 0;
    const fetchFn = vi.fn(async () => {
      calls++;
      if (calls === 1) throw new Error("network down");
      if (calls === 2) return new Response("bad gateway", { status: 502 });
      return okResponse();
    });
    const backoffs: number[] = [];
    const prices = await fetchPorkbunPrices(kv, TLDS, 1000, {
      fetchFn,
      backoff: async (ms) => {
        backoffs.push(ms);
      },
      now: () => 99,
    });
    expect(prices).not.toBeNull();
    expect(fetchFn).toHaveBeenCalledTimes(3);
    expect(backoffs).toEqual([500, 1500]);
    expect(kv.store.get(PRICES_LAST_OK_KEY)).toBe("99");
    expect(kv.store.has(PRICES_LAST_FAIL_KEY)).toBe(false);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it("重试耗尽：返回 null（调用方保留旧缓存）并记 lastFail + 结构化日志", async () => {
    const kv = memKv();
    kv.store.set("prices:latest", "old-payload");
    const fetchFn = vi.fn(async () => new Response("upstream error", { status: 503 }));
    const prices = await fetchPorkbunPrices(kv, TLDS, 1000, { fetchFn, backoff: noBackoff, now: () => 7 });
    expect(prices).toBeNull();
    expect(fetchFn).toHaveBeenCalledTimes(PRICES_FETCH_ATTEMPTS);
    expect(kv.store.get(PRICES_LAST_FAIL_KEY)).toBe("7");
    expect(kv.store.has(PRICES_LAST_OK_KEY)).toBe(false);
    // 旧 stale 缓存未被覆盖
    expect(kv.store.get("prices:latest")).toBe("old-payload");
    const logged = JSON.parse((console.error as ReturnType<typeof vi.fn>).mock.calls[0][0] as string) as Record<string, unknown>;
    expect(logged.event).toBe("porkbun_prices_fetch_failed");
    expect(logged.phase).toBe("http");
    expect(logged.status).toBe(503);
    expect(logged.attempt).toBe(1);
  });

  it("上游 200 但无可用价格行：按失败重试", async () => {
    const kv = memKv();
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ pricing: {} }), { status: 200 }));
    const prices = await fetchPorkbunPrices(kv, TLDS, 1000, { fetchFn, backoff: noBackoff, now: () => 1 });
    expect(prices).toBeNull();
    expect(fetchFn).toHaveBeenCalledTimes(PRICES_FETCH_ATTEMPTS);
    expect(kv.store.get(PRICES_LAST_FAIL_KEY)).toBe("1");
  });

  it("无 KV 时不抛错", async () => {
    const fetchFn = vi.fn(async () => okResponse());
    const prices = await fetchPorkbunPrices(undefined, TLDS, 1000, { fetchFn, backoff: noBackoff });
    expect(prices).not.toBeNull();
  });
});
