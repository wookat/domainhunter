import { describe, expect, it } from "vitest";
import { mergeCounts, normalizeDayUsage, readDayUsage, UsageCounter, usageCounterFor, usageKey, usageShardKey, type DayUsage, type UsageKv } from "./usage-counter";

function memKv(opts?: { failPuts?: number }): UsageKv & { store: Map<string, string>; puts: number; lists: number } {
  const store = new Map<string, string>();
  const kv = {
    store,
    puts: 0,
    lists: 0,
    async get<T>(key: string): Promise<T | null> {
      const v = store.get(key);
      return v ? (JSON.parse(v) as T) : null;
    },
    async put(key: string, value: string) {
      kv.puts++;
      if (opts?.failPuts && kv.puts <= opts.failPuts) throw new Error("kv down");
      store.set(key, value);
    },
    async list({ prefix }: { prefix: string }) {
      kv.lists++;
      return { keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true };
    },
  };
  return kv;
}

const T0 = Date.parse("2026-09-04T10:00:00Z");
const D = "2026-09-04";
const SHARD = "t1";
const readShard = (kv: { store: Map<string, string> }, shard = SHARD): DayUsage => JSON.parse(kv.store.get(usageShardKey(D, shard))!);
const immediate = async () => {};

describe("mergeCounts / normalizeDayUsage", () => {
  it("数字相加、嵌套 map 逐键相加、非数字与数组忽略", () => {
    const into = { searches: 1, byTld: { com: 1 }, outbound: { aliyun: 2 }, note: "x" };
    mergeCounts(into, { searches: 2, byTld: { com: 1, cn: 3 }, outbound: { namecheap: 1 }, fast: 1, junk: [1, 2], note: "y", bad: NaN });
    expect(into).toEqual({ searches: 3, byTld: { com: 2, cn: 3 }, outbound: { aliyun: 2, namecheap: 1 }, fast: 1, note: "x" });
  });

  it("残缺/非法 JSON 补齐必填结构；可选字段仅在存在时保留", () => {
    expect(normalizeDayUsage(null)).toEqual({ searches: 0, byTld: {}, fast: 0, refine: 0 });
    expect(normalizeDayUsage({ searches: 3 })).toEqual({ searches: 3, byTld: {}, fast: 0, refine: 0 });
    expect(normalizeDayUsage({ outbound: { aliyun: 1 }, byTld: { cn: 2 } } as Partial<DayUsage>)).toEqual({
      searches: 0,
      byTld: { cn: 2 },
      fast: 0,
      refine: 0,
      outbound: { aliyun: 1 },
    });
    expect(normalizeDayUsage([] as unknown as Partial<DayUsage>)).toEqual({ searches: 0, byTld: {}, fast: 0, refine: 0 });
  });
});

describe("UsageCounter", () => {
  const manual = () => {
    let release: () => void = () => {};
    const gate = new Promise<void>((r) => (release = r));
    return { sleep: () => gate, release: () => release() };
  };

  it("同窗口内 search/outbound/aiError/llmProvider/fallback/shareWrite 合并为一次 KV 写，字段与旧 bump* 一致", async () => {
    const kv = memKv();
    const m = manual();
    const uc = new UsageCounter(kv, { now: () => T0, sleep: m.sleep, shardId: SHARD });
    const ps = [
      uc.search(["com", "cn"], true, false),
      uc.search(["cn"], false, true),
      uc.outbound("aliyun", "cn"),
      uc.outbound("namecheap", "other"),
      uc.aiError("quota"),
      uc.llmProvider("fallback"),
      uc.fallback("quota-breaker"),
      uc.shareWrite(2, true),
      uc.shareWrite(0, false),
    ];
    expect(ps[0]).toBe(ps[1]);
    expect(kv.puts).toBe(0);
    m.release();
    await Promise.all(ps);
    expect(kv.puts).toBe(1);
    expect(readShard(kv)).toEqual({
      searches: 2,
      byTld: { com: 1, cn: 2 },
      fast: 1,
      refine: 1,
      outbound: { aliyun: 1, namecheap: 1 },
      outboundByTld: { cn: 1, other: 1 },
      aiErrors: { quota: 1 },
      llmProvider: { fallback: 1 },
      fallbacks: { "quota-breaker": 1 },
      shareWriteRetry: 2,
      shareWriteFail: 1,
    });
    expect(uc.pendingSnapshot()).toEqual({});
  });

  it("与本分片已有当日值累加（含嵌套 map），不覆盖；不写旧键", async () => {
    const kv = memKv();
    kv.store.set(usageShardKey(D, SHARD), JSON.stringify({ searches: 5, byTld: { com: 5 }, fast: 1, refine: 0, outbound: { aliyun: 3 } }));
    const uc = new UsageCounter(kv, { now: () => T0, sleep: immediate, shardId: SHARD });
    await uc.search(["com"], false, false);
    await uc.outbound("aliyun", "com");
    expect(readShard(kv)).toEqual({ searches: 6, byTld: { com: 6 }, fast: 1, refine: 0, outbound: { aliyun: 4 }, outboundByTld: { com: 1 } });
    expect(kv.store.has(usageKey(D))).toBe(false);
  });

  it("12 个 isolate 并发各记 1 次 outbound + 1 次 search：读侧精确 +12（R484 漏计场景）", async () => {
    const kv = memKv();
    kv.store.set(usageKey(D), JSON.stringify({ searches: 100, byTld: { com: 100 }, fast: 0, refine: 0, outbound: { aliyun: 1 } }));
    const isolates = Array.from({ length: 12 }, (_, i) => new UsageCounter(kv, { now: () => T0, sleep: immediate, shardId: `iso${i}` }));
    await Promise.all(isolates.flatMap((uc) => [uc.outbound("aliyun", "cn"), uc.search(["cn"], true, false)]));
    expect(kv.store.size).toBe(13);
    const total = await readDayUsage(kv, D);
    expect(total).toEqual({
      searches: 112,
      byTld: { com: 100, cn: 12 },
      fast: 12,
      refine: 0,
      outbound: { aliyun: 13 },
      outboundByTld: { cn: 12 },
    });
  });

  it("同 isolate 内两个窗口的落盘串行执行，不自相覆盖", async () => {
    const kv = memKv();
    let getDelay = 0;
    const slowKv: UsageKv = {
      ...kv,
      async get<T>(key: string, type: "json") {
        await new Promise((r) => setTimeout(r, getDelay));
        return kv.get<T>(key, type);
      },
    };
    const gates: Array<() => void> = [];
    const sleep = () => new Promise<void>((r) => gates.push(r));
    const uc = new UsageCounter(slowKv, { now: () => T0, sleep, shardId: SHARD });
    const p1 = uc.outbound("aliyun", "cn");
    getDelay = 20;
    gates[0]!();
    await new Promise((r) => setTimeout(r, 5)); // 第一窗口已进入 flush（正在慢 get）
    const p2 = uc.outbound("aliyun", "cn");
    expect(p2).not.toBe(p1);
    gates[1]!();
    await Promise.all([p1, p2]);
    expect(readShard(kv).outbound).toEqual({ aliyun: 2 });
    expect(kv.puts).toBe(2);
  });

  it("KV 写失败时保留 pending，下一窗口重试不丢计数", async () => {
    const kv = memKv({ failPuts: 1 });
    const uc = new UsageCounter(kv, { now: () => T0, sleep: immediate, shardId: SHARD });
    await uc.outbound("aliyun", "cn");
    expect(kv.store.size).toBe(0);
    expect(uc.pendingSnapshot()[D]?.outbound).toEqual({ aliyun: 1 });
    await uc.search(["cn"], false, false);
    expect(readShard(kv)).toMatchObject({ searches: 1, outbound: { aliyun: 1 } });
    expect(uc.pendingSnapshot()).toEqual({});
  });

  it("跨 UTC 日界落到各自日键；TTL 45 天", async () => {
    const puts: Array<{ key: string; ttl?: number }> = [];
    const kv = memKv();
    const spy: UsageKv = {
      ...kv,
      async put(key, value, options) {
        puts.push({ key, ttl: options?.expirationTtl });
        return kv.put(key, value, options);
      },
    };
    let now = Date.parse("2026-09-04T23:59:59Z");
    const m = manual();
    const uc = new UsageCounter(spy, { now: () => now, sleep: m.sleep, shardId: SHARD });
    const a = uc.search(["com"], false, false);
    now = Date.parse("2026-09-05T00:00:01Z");
    const b = uc.search(["com"], false, false);
    m.release();
    await Promise.all([a, b]);
    expect(puts.map((p) => p.key).sort()).toEqual([usageShardKey("2026-09-04", SHARD), usageShardKey("2026-09-05", SHARD)]);
    for (const p of puts) expect(p.ttl).toBe(45 * 86400);
  });

  it("无 KV 绑定：所有方法立即完成且不抛；shareWrite(0,false) 不产生 pending", async () => {
    const uc = new UsageCounter(undefined);
    await expect(uc.search(["com"], false, false)).resolves.toBeUndefined();
    await expect(uc.outbound("aliyun", "cn")).resolves.toBeUndefined();
    const kv = memKv();
    const uc2 = new UsageCounter(kv, { now: () => T0, sleep: immediate, shardId: SHARD });
    await uc2.shareWrite(0, false);
    expect(kv.puts).toBe(0);
  });

  it("usageCounterFor 按 KV 绑定对象复用同一实例（= 每 isolate 一个分片）", () => {
    const kv1 = memKv();
    const kv2 = memKv();
    expect(usageCounterFor(kv1)).toBe(usageCounterFor(kv1));
    expect(usageCounterFor(kv1)).not.toBe(usageCounterFor(kv2));
    expect(usageCounterFor(kv1).shardId).not.toBe(usageCounterFor(kv2).shardId);
    expect(usageCounterFor(undefined).shardId).toBeTruthy();
  });
});

describe("readDayUsage", () => {
  it("旧日键 + 全部分片深合并求和；其他日期不混入", async () => {
    const kv = memKv();
    kv.store.set(usageKey(D), JSON.stringify({ searches: 5, byTld: { com: 5 }, fast: 1, refine: 0, aiErrors: { quota: 1 }, outbound: { aliyun: 2 } }));
    kv.store.set(usageShardKey(D, "a"), JSON.stringify({ searches: 1, byTld: { cn: 1 }, fast: 0, refine: 1, outbound: { aliyun: 1, namecheap: 1 }, outboundByTld: { cn: 2 } }));
    kv.store.set(usageShardKey(D, "b"), JSON.stringify({ searches: 2, byTld: { com: 1, cn: 1 }, aiErrors: { network: 2 }, llmProvider: { primary: 2 } }));
    kv.store.set(usageShardKey("2026-09-05", "a"), JSON.stringify({ searches: 99, byTld: {}, fast: 0, refine: 0 }));
    expect(await readDayUsage(kv, D)).toEqual({
      searches: 8,
      byTld: { com: 6, cn: 2 },
      fast: 1,
      refine: 1,
      aiErrors: { quota: 1, network: 2 },
      outbound: { aliyun: 3, namecheap: 1 },
      outboundByTld: { cn: 2 },
      llmProvider: { primary: 2 },
    });
  });

  it("无任何键返回 null；仅旧键时补齐后原样返回；KV 不支持 list 时退化为旧键", async () => {
    const kv = memKv();
    expect(await readDayUsage(kv, D)).toBeNull();
    kv.store.set(usageKey(D), JSON.stringify({ searches: 5, byTld: { com: 5 }, fast: 0, refine: 0 }));
    expect(await readDayUsage(kv, D)).toEqual({ searches: 5, byTld: { com: 5 }, fast: 0, refine: 0 });
    const noList: UsageKv = { get: kv.get, put: kv.put };
    kv.store.set(usageShardKey(D, "a"), JSON.stringify({ searches: 1, byTld: {}, fast: 0, refine: 0 }));
    expect((await readDayUsage(noList, D))?.searches).toBe(5);
    expect((await readDayUsage(kv, D))?.searches).toBe(6);
  });

  it("list 分页跟随 cursor 直到 list_complete；超过 maxPages 记 warn 并返回下界", async () => {
    const kv = memKv();
    for (let i = 0; i < 5; i++) kv.store.set(usageShardKey(D, `s${i}`), JSON.stringify({ searches: 1, byTld: {}, fast: 0, refine: 0 }));
    const all = [...kv.store.keys()];
    let calls = 0;
    const paged: UsageKv = {
      get: kv.get,
      put: kv.put,
      async list({ cursor }) {
        calls++;
        const start = cursor ? Number(cursor) : 0;
        const keys = all.slice(start, start + 2).map((name) => ({ name }));
        const next = start + 2;
        return next >= all.length ? { keys, list_complete: true } : { keys, list_complete: false, cursor: String(next) };
      },
    };
    expect((await readDayUsage(paged, D))?.searches).toBe(5);
    expect(calls).toBe(3);

    const warns: string[] = [];
    const origWarn = console.warn;
    console.warn = (msg: string) => warns.push(msg);
    try {
      calls = 0;
      expect((await readDayUsage(paged, D, 2))?.searches).toBe(4);
      expect(calls).toBe(2);
      expect(warns).toHaveLength(1);
      expect(warns[0]).toContain("usage:2026-09-04:");
    } finally {
      console.warn = origWarn;
    }
  });

  it("单个分片读失败按空处理，其余照常求和", async () => {
    const kv = memKv();
    kv.store.set(usageShardKey(D, "ok"), JSON.stringify({ searches: 2, byTld: {}, fast: 0, refine: 0 }));
    kv.store.set(usageShardKey(D, "bad"), JSON.stringify({ searches: 7, byTld: {}, fast: 0, refine: 0 }));
    const flaky: UsageKv = {
      ...kv,
      async get<T>(key: string, type: "json") {
        if (key.endsWith(":bad")) throw new Error("boom");
        return kv.get<T>(key, type);
      },
    };
    expect((await readDayUsage(flaky, D))?.searches).toBe(2);
  });
});
