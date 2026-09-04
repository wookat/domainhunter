// IndexNow 推送（协议：https://www.indexnow.org/documentation ）
// - 单次 POST 最多 10000 个 URL，超出按批切分
// - 200 = 已提交；202 = 已接收、key 校验待定（首次/换 key 常见）；400/403/422/429 = 失败（各含义见文档）
// 只做纯函数与 fetch 封装，KV 状态记录由 worker 的 pingIndexNow 负责。

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_BATCH_MAX = 10000;

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
}

/** 按批提交；每批的 HTTP 状态单独返回，网络异常记为 status 0 */
export async function submitIndexNow(opts: IndexNowSubmitOptions): Promise<IndexNowBatchResult[]> {
  const doFetch = opts.fetchImpl ?? fetch;
  const endpoint = opts.endpoint ?? INDEXNOW_ENDPOINT;
  const results: IndexNowBatchResult[] = [];
  for (const batch of chunkUrls(opts.urls)) {
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
  }
  return results;
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
