// IndexNow 推送（协议：https://www.indexnow.org/documentation ）
// - 单次 POST 最多 10000 个 URL，超出按批切分
// - 200 = 已提交；202 = 已接收、key 校验待定（首次/换 key 常见）；400/403/422/429 = 失败（各含义见文档）
// 只做纯函数与 fetch 封装，KV 状态记录由 worker 的 pingIndexNow 负责。

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_BATCH_MAX = 10000;
// 协议上限 10000/批，但本站实测（2026-09-05）：1270 URL 一批 → 429 Too many requests（potential spam），
// 100 URL 一批 → 200，1 URL → 200。故实际按 100/批、每次 cron 最多 3 批推送，遇失败批立即停止，
// 已成功批次的 URL 计入 pushed 快照，剩余积压由下次 cron（6h 重试门）继续，避免全量批次反复 429 卡死增量。
export const INDEXNOW_BATCH_SIZE = 100;
export const INDEXNOW_RUN_MAX_BATCHES = 3;

export interface IndexNowBatchResult {
  status: number;
  ok: boolean;
  submitted: number;
}

export const INDEXNOW_STATUS_TEXT: Record<number, string> = {
  200: "OK",
  202: "Accepted (key validation pending)",
  400: "Bad request (invalid format)",
  403: "Forbidden (key not valid / key file mismatch)",
  422: "Unprocessable (URLs don't belong to host or key mismatch)",
  429: "Too many requests",
};

export function chunkUrls(urls: string[], size = INDEXNOW_BATCH_MAX): string[][] {
  const out: string[][] = [];
  for (let i = 0; i < urls.length; i += size) out.push(urls.slice(i, i + size));
  return out;
}

export interface IndexNowSubmitOptions {
  host: string;
  key: string;
  keyLocation: string;
  urls: string[];
  fetchImpl?: typeof fetch;
  endpoint?: string;
  /** 每批 URL 数（默认协议上限）；maxBatches 限制单次调用最多发几批，其余留作积压 */
  batchSize?: number;
  maxBatches?: number;
  /** 首个失败批次后不再继续发送（默认 false 保持旧行为） */
  stopOnFail?: boolean;
}

/** 按批提交；每批的 HTTP 状态单独返回，网络异常记为 status 0 */
export async function submitIndexNow(opts: IndexNowSubmitOptions): Promise<IndexNowBatchResult[]> {
  const doFetch = opts.fetchImpl ?? fetch;
  const endpoint = opts.endpoint ?? INDEXNOW_ENDPOINT;
  const results: IndexNowBatchResult[] = [];
  const batches = chunkUrls(opts.urls, opts.batchSize ?? INDEXNOW_BATCH_MAX).slice(0, opts.maxBatches ?? Infinity);
  for (const batch of batches) {
    try {
      const res = await doFetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: opts.host, key: opts.key, keyLocation: opts.keyLocation, urlList: batch }),
      });
      results.push({ status: res.status, ok: res.status === 200 || res.status === 202, submitted: batch.length });
    } catch {
      results.push({ status: 0, ok: false, submitted: batch.length });
    }
    if (opts.stopOnFail && !results[results.length - 1].ok) break;
  }
  return results;
}

/** 与 submitIndexNow 相同切批后，返回本次成功批次覆盖的 URL（results 与批次一一对应） */
export function acceptedUrls(urls: string[], results: IndexNowBatchResult[], batchSize: number): string[] {
  const batches = chunkUrls(urls, batchSize);
  const out: string[] = [];
  results.forEach((r, i) => {
    if (r.ok && batches[i]) out.push(...batches[i]);
  });
  return out;
}

/** 上次成功推送的快照：lastmod 变了视为全站内容更新（全量重推），否则只推尚未推送过的新 URL */
export interface IndexNowPushed {
  lastmod: string;
  urls: string[];
}

export function indexNowDelta(prev: IndexNowPushed | null, urls: string[], lastmod: string): string[] {
  if (!prev || prev.lastmod !== lastmod) return urls;
  const seen = new Set(prev.urls);
  return urls.filter((u) => !seen.has(u));
}

/** 把本次成功推送的 URL 并入快照；lastmod 变化时丢弃旧快照（旧 URL 需全量重推）；已不在 sitemap 的 URL 剔除 */
export function mergePushed(prev: IndexNowPushed | null, accepted: string[], all: string[], lastmod: string): IndexNowPushed {
  const keep = prev && prev.lastmod === lastmod ? prev.urls : [];
  const allSet = new Set(all);
  const urls = Array.from(new Set([...keep, ...accepted])).filter((u) => allSet.has(u));
  return { lastmod, urls };
}

export function summarizeIndexNow(results: IndexNowBatchResult[]): { ok: boolean; status: number; message: string; submitted: number } {
  const failed = results.find((r) => !r.ok);
  const submitted = results.reduce((n, r) => n + (r.ok ? r.submitted : 0), 0);
  if (!failed) {
    const status = results.some((r) => r.status === 202) ? 202 : 200;
    return { ok: true, status, message: INDEXNOW_STATUS_TEXT[status], submitted };
  }
  const message = failed.status === 0 ? "Network error" : (INDEXNOW_STATUS_TEXT[failed.status] ?? `HTTP ${failed.status}`);
  return { ok: false, status: failed.status, message, submitted };
}
