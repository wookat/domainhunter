/**
 * /api/prices KV 缓存层（R359）：
 * 版本化 key（掺 TLD 数）保证扩容后旧缓存不再被当作全量数据；但扩容瞬间新 key
 * 冷启动，若上游恰好持续失败，站点会长期停留在 stale 兜底（旧口径快照，
 * 新增 TLD 全部回退静态参考价）。本模块保证：
 * 1. 新版本 key miss 时立即用当前完整 TLD 列表拉取并写入当前版本 key；
 * 2. 拉取失败则把 stale 快照迁移进当前版本 key（标 stale:true，短 TTL），
 *    过渡期可用；后续请求在失败冷却期内直接返回迁移快照，冷却到期即重试；
 * 3. cron 刷新把 stale 标记视同过期，不受 fetchedAt 新旧影响；
 * 4. 一旦拉取成功，完整列表实时价覆盖迁移快照，stale 标记消失。
 * 不改动 R339 的 fetchPorkbunPrices 重试与 lastOk/lastFail 观测逻辑。
 */

import { fetchPorkbunPrices, PRICES_LAST_FAIL_KEY, PRICES_LAST_OK_KEY, type FetchPricesDeps, type PricesKv } from "./prices-fetch";

export const PRICES_TTL = 24 * 3600; // Porkbun 价格缓存 24h
export const PRICES_STALE_KEY = "prices:latest"; // 不带版本的 stale 兜底 key：升版冷缓存 + 上游不可达时回退
export const PRICES_STALE_TTL = 30 * 24 * 3600; // stale 兜底保留 30 天（每次成功拉取刷新）
export const PRICES_MIGRATED_TTL = 24 * 3600; // 迁移快照 TTL：刷新持续失败时也随兜底一同老化
export const PRICES_RETRY_COOLDOWN_MS = 5 * 60 * 1000; // 上游连续失败后的重试冷却：期间直接返回迁移快照
export const PRICES_STALE_REFRESH_MS = 12 * 3600 * 1000; // cron 内主动重拉阈值：缓存超 12h 视为过久

export interface PricesCacheConfig {
  /** 当前版本化缓存 key（掺 TLD 数量） */
  key: string;
  /** 当前完整 TLD 列表（拉取按此过滤） */
  tldList: readonly string[];
  usdToCny: number;
  timeoutMs: number;
  now?: () => number;
  fetchDeps?: FetchPricesDeps;
}

/** 上游失败/超时时回退不带版本的 stale key，响应标注 stale:true（TLD 数可少于当前，缺的走前端静态参考价） */
export async function loadStalePayload(kv: PricesKv | undefined): Promise<string | null> {
  if (!kv) return null;
  try {
    const stale = await kv.get(PRICES_STALE_KEY);
    if (!stale) return null;
    const parsed = JSON.parse(stale) as Record<string, unknown>;
    return JSON.stringify({ ...parsed, stale: true });
  } catch {
    return null;
  }
}

/** 上游最近一次结果为失败且仍在冷却期内（避免每个请求都同步重试上游） */
async function inFailureCooldown(kv: PricesKv, now: number): Promise<boolean> {
  try {
    const [ok, fail] = await Promise.all([kv.get(PRICES_LAST_OK_KEY), kv.get(PRICES_LAST_FAIL_KEY)]);
    const failAt = fail ? Number(fail) : Number.NaN;
    if (!Number.isFinite(failAt)) return false;
    const okAt = ok ? Number(ok) : Number.NaN;
    if (Number.isFinite(okAt) && okAt >= failAt) return false;
    return now - failAt < PRICES_RETRY_COOLDOWN_MS;
  } catch {
    return false;
  }
}

/**
 * 实时价格负载（JSON 字符串）：Porkbun 公开价格 API（美元），KV 缓存 24h。
 * 版本 key miss（含扩容后冷启动）时立即拉取；拉取失败时把 stale 快照迁移进
 * 当前版本 key 作过渡，标 stale:true 等待下次成功拉取覆盖。
 */
export async function loadPricesPayload(kv: PricesKv | undefined, cfg: PricesCacheConfig, opts?: { forceRefresh?: boolean }): Promise<string | null> {
  const now = cfg.now ?? Date.now;
  let migrated: string | null = null;
  if (kv && !opts?.forceRefresh) {
    try {
      const cached = await kv.get(cfg.key);
      if (cached) {
        let stale = false;
        try {
          stale = (JSON.parse(cached) as { stale?: boolean }).stale === true;
        } catch { /* 解析失败按非 stale 处理 */ }
        if (!stale) return cached;
        if (await inFailureCooldown(kv, now())) return cached;
        migrated = cached;
      }
    } catch { /* 缓存读取失败则实时拉取 */ }
  }
  const prices = await fetchPorkbunPrices(kv, cfg.tldList, cfg.timeoutMs, { ...cfg.fetchDeps, now });
  if (!prices) {
    if (migrated) return migrated;
    const stalePayload = await loadStalePayload(kv);
    if (stalePayload && kv) {
      try {
        await kv.put(cfg.key, stalePayload, { expirationTtl: PRICES_MIGRATED_TTL });
      } catch { /* 迁移写入失败不影响返回 */ }
    }
    return stalePayload;
  }
  const payload = JSON.stringify({ prices, currency: "USD", usdToCny: cfg.usdToCny, fetchedAt: now(), tldCount: Object.keys(prices).length });
  if (kv) {
    try {
      await kv.put(cfg.key, payload, { expirationTtl: PRICES_TTL });
      await kv.put(PRICES_STALE_KEY, payload, { expirationTtl: PRICES_STALE_TTL });
    } catch { /* 缓存写入失败不影响返回 */ }
  }
  return payload;
}

/** cron 周期内价格缓存超过阈值（含缓存缺失、stale 迁移快照）时主动重拉一次，避免长期 stale */
export async function refreshPricesIfStale(kv: PricesKv | undefined, cfg: PricesCacheConfig): Promise<void> {
  if (!kv) return;
  const now = cfg.now ?? Date.now;
  try {
    const cached = await kv.get(cfg.key);
    if (cached) {
      const { fetchedAt, stale } = JSON.parse(cached) as { fetchedAt?: number; stale?: boolean };
      if (stale !== true && typeof fetchedAt === "number" && now() - fetchedAt < PRICES_STALE_REFRESH_MS) return;
    }
    await loadPricesPayload(kv, cfg, { forceRefresh: true });
  } catch { /* 重拉失败等下个 cron 周期 */ }
}
