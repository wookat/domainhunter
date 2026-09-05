// 每日聚合使用统计（仅聚合计数，不存任何用户输入/IP）。
// R487：所有计数器（searches/fast/refine/byTld/aiErrors/fallbacks/shareWrite*/llmProvider/outbound*）改走
// 按 isolate 分片的 usage:YYYY-MM-DD:<shard> 键（见 sharded-counter.ts），/api/usage 读时与旧键 usage:YYYY-MM-DD 深合并求和。
// 此前对同一 usage 日键的非原子读改写在多 isolate 并发下互相覆盖（R484 审计：4 次 /api/outbound 只入账 3 次）。

import type { AiErrorKind } from "./ai";
import type { LlmProvider } from "./ai-transport";
import type { RegistrarId } from "./lib/registrars";
import type { FallbackReason } from "./rule-fallback";
import { dayKey, dayShardKey, dayShardPrefix, readShardedDay, ShardedDayCounter, type DayCodec, type ShardKv, type ShardedCounterOptions } from "./sharded-counter";

export interface DayUsage {
  searches: number;
  byTld: Record<string, number>;
  fast: number;
  refine: number;
  /** 当日 AI 上游错误分类计数（R264，仅数字；旧数据无此字段） */
  aiErrors?: Partial<Record<AiErrorKind, number>>;
  /** 当日规则降级次数（R471，按 fallback 事件 reason 计；quota-breaker = 熔断期内直接降级，未打上游） */
  fallbacks?: Partial<Record<FallbackReason, number>>;
  /** 分享写入读回校验失败后的重试次数（R305，生产观测；旧数据无此字段） */
  shareWriteRetry?: number;
  /** 分享写入最终失败（含换 id 重写仍失败）次数（R305） */
  shareWriteFail?: number;
  /** 当日 AI 主轮实际应答的 LLM 上游计数（R474：主/备；仅数字；旧数据无此字段） */
  llmProvider?: Partial<Record<LlmProvider, number>>;
  /** 当日注册商外链点击数，按注册商 id 聚合（R480；不含域名/IP；旧数据无此字段） */
  outbound?: Partial<Record<RegistrarId, number>>;
  /** 当日注册商外链点击数，按 TLD 聚合（仅 TLD_LIST 内的后缀，其余记 other） */
  outboundByTld?: Record<string, number>;
}

export const USAGE_KEY_PREFIX = "usage:";
export const usageKey = (date: string) => dayKey(USAGE_KEY_PREFIX, date);
export const usageShardPrefix = (date: string) => dayShardPrefix(USAGE_KEY_PREFIX, date);
export const usageShardKey = (date: string, shard: string) => dayShardKey(USAGE_KEY_PREFIX, date, shard);
export const emptyDayUsage = (): DayUsage => ({ searches: 0, byTld: {}, fast: 0, refine: 0 });

type Counts = Record<string, unknown>;
const isPlainObject = (v: unknown): v is Counts => typeof v === "object" && v !== null && !Array.isArray(v);
const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/** 深合并：数字相加，嵌套 map 逐键相加，其他类型忽略；就地修改 into */
export function mergeCounts(into: Counts, from: Counts): Counts {
  for (const [k, v] of Object.entries(from)) {
    if (typeof v === "number") {
      if (Number.isFinite(v)) into[k] = num(into[k]) + v;
    } else if (isPlainObject(v)) {
      const cur = into[k];
      into[k] = mergeCounts(isPlainObject(cur) ? cur : {}, v);
    }
  }
  return into;
}

/** 读回的 JSON 可能缺字段（旧版本/手工写入），补齐必填结构；可选字段仅在存在时保留 */
export function normalizeDayUsage(raw: Partial<DayUsage> | null | undefined): DayUsage {
  const base = emptyDayUsage();
  if (!raw || !isPlainObject(raw)) return base;
  return mergeCounts(base as unknown as Counts, raw as unknown as Counts) as unknown as DayUsage;
}

export function mergeDayUsage(into: DayUsage, from: DayUsage): DayUsage {
  return mergeCounts(into as unknown as Counts, from as unknown as Counts) as unknown as DayUsage;
}

export const USAGE_CODEC: DayCodec<DayUsage> = {
  keyPrefix: USAGE_KEY_PREFIX,
  empty: emptyDayUsage,
  normalize: normalizeDayUsage,
  merge: mergeDayUsage,
};

/** 读侧汇总：旧日键 usage:{date} + 全部分片 usage:{date}:* 深合并；无任何键返回 null */
export const readDayUsage = (kv: ShardKv, date: string, maxPages = 5): Promise<DayUsage | null> => readShardedDay(kv, USAGE_CODEC, date, maxPages);

export type UsageKv = ShardKv;

/**
 * 每 isolate 一个实例：所有 bump 先合并进内存，flushDelayMs 后一次写本分片键。
 * 默认窗口 1s（usage 事件低频，主要为满足 KV 同键 ≤1 写/秒，而非像 pv 那样吸收爬虫洪峰）。
 */
export class UsageCounter extends ShardedDayCounter<DayUsage> {
  constructor(kv: ShardKv | undefined, opts: ShardedCounterOptions = {}) {
    super(kv, USAGE_CODEC, { flushDelayMs: 1000, ...opts });
  }

  /** 一次 AI 猎名请求 */
  search(tlds: readonly string[], fast: boolean, refine: boolean): Promise<void> {
    return this.add((d) => {
      d.searches += 1;
      if (fast) d.fast += 1;
      if (refine) d.refine += 1;
      for (const t of tlds) d.byTld[t] = (d.byTld[t] ?? 0) + 1;
    });
  }

  /** 注册商外链点击；tldKey 由调用方分桶（TLD_LIST/com.cn 之外归 other） */
  outbound(registrar: RegistrarId, tldKey: string): Promise<void> {
    return this.add((d) => {
      d.outbound = { ...d.outbound, [registrar]: (d.outbound?.[registrar] ?? 0) + 1 };
      d.outboundByTld = { ...d.outboundByTld, [tldKey]: (d.outboundByTld?.[tldKey] ?? 0) + 1 };
    });
  }

  aiError(kind: AiErrorKind): Promise<void> {
    return this.add((d) => {
      d.aiErrors = { ...d.aiErrors, [kind]: (d.aiErrors?.[kind] ?? 0) + 1 };
    });
  }

  llmProvider(provider: LlmProvider): Promise<void> {
    return this.add((d) => {
      d.llmProvider = { ...d.llmProvider, [provider]: (d.llmProvider?.[provider] ?? 0) + 1 };
    });
  }

  fallback(reason: FallbackReason): Promise<void> {
    return this.add((d) => {
      d.fallbacks = { ...d.fallbacks, [reason]: (d.fallbacks?.[reason] ?? 0) + 1 };
    });
  }

  shareWrite(retries: number, failed: boolean): Promise<void> {
    if (retries <= 0 && !failed) return Promise.resolve();
    return this.add((d) => {
      if (retries > 0) d.shareWriteRetry = (d.shareWriteRetry ?? 0) + retries;
      if (failed) d.shareWriteFail = (d.shareWriteFail ?? 0) + 1;
    });
  }
}

const counters = new WeakMap<object, UsageCounter>();

/** 按 KV 绑定对象复用计数器：workerd 中 env.CACHE 在同一 isolate 的所有请求间是同一对象（wrangler dev 实测），即每 isolate 一个分片 */
export function usageCounterFor(kv: (ShardKv & object) | undefined): UsageCounter {
  if (!kv) return new UsageCounter(undefined);
  let c = counters.get(kv);
  if (!c) {
    c = new UsageCounter(kv);
    counters.set(kv, c);
  }
  return c;
}
