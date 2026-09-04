import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PRICES_LAST_FAIL_KEY, PRICES_LAST_OK_KEY, type PricesKv } from "./prices-fetch";
import {
  loadPricesPayload,
  PRICES_RETRY_COOLDOWN_MS,
  PRICES_STALE_KEY,
  refreshPricesIfStale,
  type PricesCacheConfig,
} from "./prices-cache";

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

// 扩容场景：旧口径 2 个 TLD（com/net），R355 式扩容后 3 个（新增 camp）
const OLD_TLDS = ["com", "net"] as const;
const NEW_TLDS = ["com", "net", "camp"] as const;

const upstreamOk = () =>
  new Response(
    JSON.stringify({
      pricing: {
        com: { registration: "11.06", renewal: "12.98" },
        net: { registration: "12.5", renewal: "14.2" },
        camp: { registration: "12.3", renewal: "55.4" },
      },
    }),
    { status: 200 },
  );

const upstreamDown = () => new Response("bad gateway", { status: 502 });

function cfg(overrides?: Partial<PricesCacheConfig>): PricesCacheConfig {
  return {
    key: `prices:v2:${NEW_TLDS.length}`,
    tldList: NEW_TLDS,
    usdToCny: 7.2,
    timeoutMs: 1000,
    fetchDeps: { backoff: noBackoff },
    ...overrides,
  };
}

/** 旧口径成功快照写入旧版本 key + stale 兜底 key（模拟扩容前的生产状态） */
function seedOldSnapshot(kv: ReturnType<typeof memKv>, fetchedAt = 1000): void {
  const payload = JSON.stringify({
    prices: { com: { registration: 11.06, renewal: 12.98 }, net: { registration: 12.5, renewal: 14.2 } },
    currency: "USD",
    usdToCny: 7.2,
    fetchedAt,
    tldCount: 2,
  });
  kv.store.set(`prices:v2:${OLD_TLDS.length}`, payload);
  kv.store.set(PRICES_STALE_KEY, payload);
  kv.store.set(PRICES_LAST_OK_KEY, String(fetchedAt));
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadPricesPayload：TLD 扩容后", () => {
  it("新版本 key miss 时立即用完整列表拉取，新 TLD 获得实时价并写入当前版本 key", async () => {
    const kv = memKv();
    seedOldSnapshot(kv);
    const fetchFn = vi.fn(async () => upstreamOk());
    const c = cfg({ fetchDeps: { fetchFn, backoff: noBackoff }, now: () => 2000 });

    const payload = await loadPricesPayload(kv, c);
    expect(payload).not.toBeNull();
    const parsed = JSON.parse(payload!) as { prices: Record<string, unknown>; stale?: boolean; tldCount: number };
    expect(parsed.prices.camp).toEqual({ registration: 12.3, renewal: 55.4 });
    expect(parsed.stale).toBeUndefined();
    expect(parsed.tldCount).toBe(3);
    // 写入当前版本 key，且刷新 stale 兜底
    expect(kv.store.get(c.key)).toBe(payload);
    expect(JSON.parse(kv.store.get(PRICES_STALE_KEY)!)).toMatchObject({ tldCount: 3 });
  });

  it("拉取失败时迁移 stale 快照进当前版本 key（标 stale:true），作过渡回退", async () => {
    const kv = memKv();
    seedOldSnapshot(kv);
    const fetchFn = vi.fn(async () => upstreamDown());
    const c = cfg({ fetchDeps: { fetchFn, backoff: noBackoff }, now: () => 2000 });

    const payload = await loadPricesPayload(kv, c);
    expect(payload).not.toBeNull();
    const parsed = JSON.parse(payload!) as { prices: Record<string, unknown>; stale?: boolean };
    expect(parsed.stale).toBe(true);
    expect(parsed.prices.camp).toBeUndefined(); // 过渡期新 TLD 走前端静态参考价
    expect(kv.store.get(c.key)).toBe(payload); // 迁移进当前版本 key
    expect(kv.store.get(PRICES_LAST_FAIL_KEY)).toBe("2000");
  });

  it("迁移快照在失败冷却期内直接返回，不再逐请求重试上游", async () => {
    const kv = memKv();
    seedOldSnapshot(kv);
    const failFetch = vi.fn(async () => upstreamDown());
    let t = 2000;
    const c = cfg({ fetchDeps: { fetchFn: failFetch, backoff: noBackoff }, now: () => t });

    await loadPricesPayload(kv, c); // 首次 miss：重试耗尽后迁移，记 lastFail
    const attemptsAfterFirst = failFetch.mock.calls.length;
    t += 1000; // 仍在冷却期内
    const cached = await loadPricesPayload(kv, c);
    expect(JSON.parse(cached!)).toMatchObject({ stale: true });
    expect(failFetch.mock.calls.length).toBe(attemptsAfterFirst); // 未再触发上游

    // 冷却期过后重试，上游恢复 → 完整列表覆盖迁移快照，stale 标记消失
    t += PRICES_RETRY_COOLDOWN_MS + 1;
    const okFetch = vi.fn(async () => upstreamOk());
    const recovered = await loadPricesPayload(kv, cfg({ fetchDeps: { fetchFn: okFetch, backoff: noBackoff }, now: () => t }));
    const parsed = JSON.parse(recovered!) as { prices: Record<string, unknown>; stale?: boolean };
    expect(parsed.stale).toBeUndefined();
    expect(parsed.prices.camp).toEqual({ registration: 12.3, renewal: 55.4 });
  });

  it("上游恢复成功一次后，迁移快照被覆盖且后续命中非 stale 缓存", async () => {
    const kv = memKv();
    seedOldSnapshot(kv);
    const okFetch = vi.fn(async () => upstreamOk());
    const c = cfg({ fetchDeps: { fetchFn: okFetch, backoff: noBackoff }, now: () => 5000 });
    await loadPricesPayload(kv, c);
    const second = await loadPricesPayload(kv, c);
    expect(okFetch).toHaveBeenCalledTimes(1); // 第二次直接命中缓存
    expect(JSON.parse(second!)).toMatchObject({ tldCount: 3 });
  });
});

describe("refreshPricesIfStale", () => {
  it("缓存为迁移 stale 快照时视同过期，即使 fetchedAt 很新也强制重拉", async () => {
    const kv = memKv();
    seedOldSnapshot(kv, 1000);
    const failFetch = vi.fn(async () => upstreamDown());
    const c1 = cfg({ fetchDeps: { fetchFn: failFetch, backoff: noBackoff }, now: () => 2000 });
    await loadPricesPayload(kv, c1); // 迁移快照落入当前版本 key（fetchedAt=1000，仍在 12h 阈值内）

    const okFetch = vi.fn(async () => upstreamOk());
    const c2 = cfg({ fetchDeps: { fetchFn: okFetch, backoff: noBackoff }, now: () => 3000 });
    await refreshPricesIfStale(kv, c2);
    expect(okFetch).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(kv.store.get(c2.key)!) as { prices: Record<string, unknown>; stale?: boolean };
    expect(parsed.stale).toBeUndefined();
    expect(parsed.prices.camp).toBeDefined();
  });

  it("缓存新鲜且非 stale 时不重拉", async () => {
    const kv = memKv();
    const okFetch = vi.fn(async () => upstreamOk());
    const c = cfg({ fetchDeps: { fetchFn: okFetch, backoff: noBackoff }, now: () => 10_000 });
    await loadPricesPayload(kv, c);
    await refreshPricesIfStale(kv, c);
    expect(okFetch).toHaveBeenCalledTimes(1);
  });
});
