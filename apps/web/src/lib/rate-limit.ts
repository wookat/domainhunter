/**
 * 按 IP 的小时桶限频（KV 计数）。R573 起分两个独立桶：
 * - `ai`：POST /api/ai-search，按请求计，20 次/小时（唯一消耗 LLM 额度的入口）；
 * - `check`：POST /api/check + MCP check_domains / suggest_variants，按域名个数计权，200 个/小时。
 * key `rl:${bucket}:${ip}:${hourBucket}`；R573 之前的共用 key `rl:${ip}:${hour}` 靠 TTL 自然过期，不迁移。
 * KV 读改写非原子：多 isolate 并发只会漏计（放宽），不会误伤，限流场景可接受。
 */

export type RateLimitScope = "ai" | "check";

export const RATE_LIMIT_PER_HOUR: Record<RateLimitScope, number> = {
  ai: 20,
  check: 200,
};

export const HOUR_MS = 3600_000;
/** 略大于 1 小时，保证桶跨过整点边界后仍能被读到直至无人再访问 */
export const RATE_LIMIT_TTL_S = 3700;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; scope: RateLimitScope; limit: number; retryAfter: number };

export function hourBucket(now = Date.now()): number {
  return Math.floor(now / HOUR_MS);
}

export function rateLimitKey(scope: RateLimitScope, ip: string, now = Date.now()): string {
  return `rl:${scope}:${ip}:${hourBucket(now)}`;
}

/** 距下一个整点桶边界的秒数（≥1），用作 Retry-After */
export function retryAfterSeconds(now = Date.now()): number {
  return Math.max(1, Math.ceil(((hourBucket(now) + 1) * HOUR_MS - now) / 1000));
}

type RateLimitKv = Pick<KVNamespace, "get" | "put">;

/**
 * 尝试从桶里扣 `weight` 个名额：`n + weight > limit` 则拒绝且不计数；无 KV 绑定或 KV 出错时放行（与 R573 前一致）。
 */
export async function consumeRateLimit(
  kv: RateLimitKv | undefined,
  ip: string,
  scope: RateLimitScope,
  weight = 1,
  now = Date.now(),
): Promise<RateLimitResult> {
  if (!kv) return { ok: true };
  const limit = RATE_LIMIT_PER_HOUR[scope];
  const w = Math.max(1, Math.floor(weight));
  const key = rateLimitKey(scope, ip, now);
  try {
    const n = Number((await kv.get(key)) ?? "0");
    if (n + w > limit) return { ok: false, scope, limit, retryAfter: retryAfterSeconds(now) };
    await kv.put(key, String(n + w), { expirationTtl: RATE_LIMIT_TTL_S });
  } catch {
    return { ok: true };
  }
  return { ok: true };
}

/** check 桶 429 的用户可读文案（worker 侧；前端另有 i18n `unknown.reason.recheck-limited`） */
export function checkRateLimitMessage(lang: "zh" | "en", limit = RATE_LIMIT_PER_HOUR.check): string {
  return lang === "en"
    ? `Too many rechecks — up to ${limit} domains per hour, try again after the top of the hour`
    : `重新核验太频繁：每小时最多 ${limit} 个域名，下个整点再试`;
}

/** ai 桶 429 文案（沿用 R573 前措辞） */
export function aiRateLimitMessage(lang: "zh" | "en", limit = RATE_LIMIT_PER_HOUR.ai): string {
  return lang === "en"
    ? `You've been hunting hard today — AI hunts are capped at ${limit} per hour, come back in a bit`
    : `今天猎得有点勤快了：每小时最多 ${limit} 次 AI 猎名，休息一会儿再来吧`;
}
