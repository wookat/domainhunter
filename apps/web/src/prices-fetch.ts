/**
 * Porkbun 实时价拉取加固（R339）：
 * 1. 上游失败按退避（500ms/1500ms）重试，最多 3 次；
 * 2. 全部失败返回 null（调用方回退 stale 缓存，绝不覆盖旧数据）；
 * 3. 每次失败结构化 console.error（wrangler tail 可排查：阶段/状态码/重试次数）；
 * 4. 成功/失败分别记 prices:lastOk / prices:lastFail 时间戳（/api/usage 可观测）。
 */

export interface PricesKv {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface PriceEntry {
  registration: number;
  renewal: number;
  /** 静态参考价（无实时报价时回退，仅 MCP tld_prices 补齐时使用） */
  approx?: true;
}

interface PorkbunPricing {
  pricing?: Record<string, { registration?: string; renewal?: string }>;
}

export const PRICES_LAST_OK_KEY = "prices:lastOk";
export const PRICES_LAST_FAIL_KEY = "prices:lastFail";
export const PRICES_FETCH_ATTEMPTS = 3;
const BACKOFF_MS = [500, 1500];
const PORKBUN_PRICING_URL = "https://api.porkbun.com/api/json/v3/pricing/get";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export interface FetchPricesDeps {
  fetchFn?: typeof fetch;
  backoff?: (ms: number) => Promise<void>;
  timeoutMs?: number;
  now?: () => number;
}

function logFetchFailure(phase: string, attempt: number, detail: string, status?: number): void {
  console.error(
    JSON.stringify({
      event: "porkbun_prices_fetch_failed",
      phase,
      status: status ?? null,
      attempt,
      maxAttempts: PRICES_FETCH_ATTEMPTS,
      detail: detail.slice(0, 200),
    }),
  );
}

async function markTimestamp(kv: PricesKv | undefined, key: string, now: number): Promise<void> {
  if (!kv) return;
  try {
    await kv.put(key, String(now));
  } catch { /* 记时戳失败不影响主流程 */ }
}

/**
 * 带重试拉取 Porkbun 公开价格并按 tldList 过滤。
 * 成功返回价格表并记 lastOk；重试耗尽返回 null 并记 lastFail（调用方回退 stale 缓存）。
 */
export async function fetchPorkbunPrices(
  kv: PricesKv | undefined,
  tldList: readonly string[],
  timeoutMs: number,
  deps: FetchPricesDeps = {},
): Promise<Record<string, PriceEntry> | null> {
  const fetchFn = deps.fetchFn ?? fetch;
  const backoff = deps.backoff ?? sleep;
  const now = deps.now ?? Date.now;
  for (let attempt = 1; attempt <= PRICES_FETCH_ATTEMPTS; attempt++) {
    if (attempt > 1) await backoff(BACKOFF_MS[Math.min(attempt - 2, BACKOFF_MS.length - 1)]);
    let data: PorkbunPricing;
    try {
      const res = await fetchFn(PORKBUN_PRICING_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
        signal: AbortSignal.timeout(deps.timeoutMs ?? timeoutMs),
      });
      if (!res.ok) {
        logFetchFailure("http", attempt, `upstream returned ${res.status}`, res.status);
        continue;
      }
      data = (await res.json()) as PorkbunPricing;
    } catch (e) {
      logFetchFailure("fetch", attempt, e instanceof Error ? e.message : String(e));
      continue;
    }
    const prices: Record<string, PriceEntry> = {};
    for (const tld of tldList) {
      const p = data.pricing?.[tld];
      const registration = Number(p?.registration);
      const renewal = Number(p?.renewal);
      if (Number.isFinite(registration) && Number.isFinite(renewal)) prices[tld] = { registration, renewal };
    }
    if (Object.keys(prices).length === 0) {
      logFetchFailure("parse", attempt, "no usable price rows in upstream payload");
      continue;
    }
    await markTimestamp(kv, PRICES_LAST_OK_KEY, now());
    return prices;
  }
  await markTimestamp(kv, PRICES_LAST_FAIL_KEY, now());
  return null;
}
