// 按日分片的 KV 计数器（R482 pv 方案泛化，R487 起 usage:* 共用）。
// KV 非原子：多个 isolate 对同一键做 get→改→put 会互相覆盖（生产实测 3 页只入账 2 页、4 次外链只入账 3 次），
// 且同键写入限 1 次/秒（https://developers.cloudflare.com/kv/platform/limits/ ）。
// 因此每个 isolate 只写自己的分片键 <prefix><date>:<shard>（单写者，无竞争），同 isolate 内 flushDelayMs 窗口
// 合并后一次读改写（同键写入间隔 ≥ 窗口），读侧 list 前缀求和并兼容分片前的旧日键 <prefix><date>。

export interface ShardKv {
  get<T = unknown>(key: string, type: "json"): Promise<T | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  list?(options: { prefix: string; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
}

/** 某类日计数的结构约定：空值、读回补齐、逐字段累加 */
export interface DayCodec<T> {
  keyPrefix: string;
  empty(): T;
  normalize(raw: Partial<T> | null | undefined): T;
  /** 把 from 累加进 into（就地修改并返回 into） */
  merge(into: T, from: T): T;
}

export const dayKey = (prefix: string, date: string) => `${prefix}${date}`;
export const dayShardPrefix = (prefix: string, date: string) => `${prefix}${date}:`;
export const dayShardKey = (prefix: string, date: string, shard: string) => `${dayShardPrefix(prefix, date)}${shard}`;
export const newShardId = () => Math.random().toString(36).slice(2, 10) || "0";
export const isoDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** 读侧汇总：旧日键 + 全部分片键求和；任一读失败按空处理（下界近似，不抛）；分页超过 maxPages 记 warn */
export async function readShardedDay<T>(kv: ShardKv, codec: DayCodec<T>, date: string, maxPages = 5): Promise<T | null> {
  const legacy = await kv.get<T>(dayKey(codec.keyPrefix, date), "json").catch(() => null);
  const shardKeys: string[] = [];
  if (kv.list) {
    let cursor: string | undefined;
    let complete = false;
    for (let page = 0; page < maxPages; page++) {
      const res = await kv.list({ prefix: dayShardPrefix(codec.keyPrefix, date), cursor }).catch(() => null);
      if (!res) {
        complete = true;
        break;
      }
      for (const k of res.keys) shardKeys.push(k.name);
      if (res.list_complete || !res.cursor) {
        complete = true;
        break;
      }
      cursor = res.cursor;
    }
    if (!complete) console.warn(`[sharded-counter] ${dayShardPrefix(codec.keyPrefix, date)} exceeded ${maxPages} list pages; total is a lower bound`);
  }
  if (!legacy && shardKeys.length === 0) return null;
  const shards = await Promise.all(shardKeys.map((k) => kv.get<T>(k, "json").catch(() => null)));
  const total = codec.normalize(legacy);
  for (const s of shards) if (s) codec.merge(total, codec.normalize(s));
  return total;
}

export interface ShardedCounterOptions {
  /** 合并窗口；Workers 的 waitUntil 上限 30s */
  flushDelayMs?: number;
  /** 日键保留秒数，默认 45 天 */
  ttlSeconds?: number;
  /** 分片 id，默认每个 counter 实例（= isolate）随机一个 */
  shardId?: string;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class ShardedDayCounter<T> {
  private pending = new Map<string, T>();
  /** 已排程、尚未开始落盘的窗口；窗口结束即清空，之后到来的计数进入下一个窗口 */
  private waiting: Promise<void> | null = null;
  /** 落盘串行链：同一分片键的读改写不重叠（同 isolate 内也不自相竞争） */
  private flushing: Promise<void> = Promise.resolve();
  private readonly flushDelayMs: number;
  private readonly ttlSeconds: number;
  readonly shardId: string;
  private readonly now: () => number;
  private readonly sleep: (ms: number) => Promise<void>;
  /** 累计成功落盘次数（测试/诊断用） */
  flushes = 0;

  constructor(
    private readonly kv: ShardKv | undefined,
    private readonly codec: DayCodec<T>,
    opts: ShardedCounterOptions = {},
  ) {
    this.flushDelayMs = opts.flushDelayMs ?? 5000;
    this.ttlSeconds = opts.ttlSeconds ?? 45 * 86400;
    this.shardId = opts.shardId ?? newShardId();
    this.now = opts.now ?? Date.now;
    this.sleep = opts.sleep ?? defaultSleep;
  }

  /** 对「当日」计数做一次就地修改；返回应交给 waitUntil 的落盘 Promise（无 KV 时立即 resolve） */
  add(mutate: (day: T) => void): Promise<void> {
    if (!this.kv) return Promise.resolve();
    const date = isoDate(this.now());
    const day = this.pending.get(date) ?? this.codec.empty();
    mutate(day);
    this.pending.set(date, day);
    if (!this.waiting) {
      this.waiting = this.sleep(this.flushDelayMs).then(() => {
        this.waiting = null;
        const run = this.flushing.then(() => this.flush());
        this.flushing = run;
        return run;
      });
    }
    return this.waiting;
  }

  /** 立即把 pending 合并写入本分片键；失败的日键回滚到 pending，等下一窗口重试 */
  async flush(): Promise<void> {
    if (!this.kv) return;
    const batch = this.pending;
    this.pending = new Map();
    for (const [date, delta] of batch) {
      try {
        const key = dayShardKey(this.codec.keyPrefix, date, this.shardId);
        const cur = this.codec.normalize(await this.kv.get<T>(key, "json"));
        await this.kv.put(key, JSON.stringify(this.codec.merge(cur, delta)), { expirationTtl: this.ttlSeconds });
        this.flushes += 1;
      } catch {
        const back = this.pending.get(date);
        this.pending.set(date, back ? this.codec.merge(back, delta) : delta);
      }
    }
  }

  /** 测试/诊断：当前未落盘的快照 */
  pendingSnapshot(): Record<string, T> {
    return Object.fromEntries(this.pending);
  }
}
