/**
 * 分享快照 KV 写入加固（R305）：
 * KV put 偶发静默丢失（同 colo 立即读也取不到）。策略：
 * 1. 写后读回校验，失败按退避（150ms/400ms）重试同一 key，最多 3 次；
 * 2. 同一 id 三次仍失败则换新 id 重写（怀疑 key 级瞬时故障），再来一轮；
 * 3. 全部失败向调用方返回失败，绝不返回一个实际不存在的链接。
 */

export interface ShareKv {
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  get(key: string): Promise<string | null>;
}

export interface ShareWriteResult {
  ok: boolean;
  /** 最终生效的分享 id（可能与首个 id 不同——换 id 重写时） */
  id: string;
  /** 读回校验失败后追加的 put 次数（首次 put 不计） */
  retries: number;
  /** 是否发生过换 id 重写 */
  idRotated: boolean;
}

export const SHARE_WRITE_ATTEMPTS_PER_ID = 3;
export const SHARE_WRITE_MAX_IDS = 2;
const BACKOFF_MS = [150, 400];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function putShareVerified(
  kv: ShareKv,
  newId: () => string,
  payloadFor: (id: string) => string,
  ttl: number,
  backoff: (ms: number) => Promise<void> = sleep,
): Promise<ShareWriteResult> {
  let retries = 0;
  let id = newId();
  for (let round = 0; round < SHARE_WRITE_MAX_IDS; round++) {
    if (round > 0) id = newId();
    const key = `share:${id}`;
    const payload = payloadFor(id);
    for (let attempt = 0; attempt < SHARE_WRITE_ATTEMPTS_PER_ID; attempt++) {
      if (retries > 0) await backoff(BACKOFF_MS[Math.min(retries - 1, BACKOFF_MS.length - 1)]);
      try {
        await kv.put(key, payload, { expirationTtl: ttl });
        if ((await kv.get(key)) !== null) {
          return { ok: true, id, retries, idRotated: round > 0 };
        }
      } catch { /* put/get 抛错与读回失败同样处理：计入重试 */ }
      retries++;
    }
  }
  return { ok: false, id, retries, idRotated: true };
}
