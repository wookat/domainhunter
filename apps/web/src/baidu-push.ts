// 百度普通收录 API 推送（官方：https://ziyuan.baidu.com/college/courseinfo?id=267&page=2 ）
// - POST http://data.zz.baidu.com/urls?site=<站长平台验证的站点>&token=<准入密钥>
//   接口仅提供 http（实测 https 证书为 baidu.com、与主机名不匹配），token 走 query 明文是官方设计
// - 请求体 text/plain，每行一个 URL；单次最多 2000 条，超出按批切分
// - 仅 HTTP 200 为成功，body {remain, success, not_same_site?, not_valid?}；
//   400 = site error / empty content / over quota 等，401 = token 错，404 = 接口地址错，500 = 偶发可重试
// - 每日配额按站点动态分配（官方不给固定数），重复推送旧 URL 会浪费配额并可能被降配额/收回权限，
//   因此配额策略（见 pickPending）：只推「尚未成功推送过」的 URL，按 sitemap 优先级顺序取前 N 条。
// 只做纯函数与 fetch 封装，KV 状态记录由 worker 的 pushBaidu 负责。

export const BAIDU_PUSH_ENDPOINT = "http://data.zz.baidu.com/urls";
export const BAIDU_PUSH_BATCH_MAX = 2000;

/** 站长平台里站点显示形态：`www.example.com` 或 `https://www.example.com`，只允许 URL 安全字符 */
const SITE_RE = /^(https?:\/\/)?[A-Za-z0-9.-]+(:\d{1,5})?$/;
/** 准入密钥：官方示例为 16 位字母数字，放宽到 8–128 位 */
const TOKEN_RE = /^[A-Za-z0-9_-]{8,128}$/;

export interface BaiduPushConfig {
  site: string;
  token: string;
  /** 每次运行最多推送条数（默认 2000 = 单次接口上限） */
  dailyMax: number;
  /** 接口地址；默认官方，仅本地 wrangler dev 用 BAIDU_PUSH_ENDPOINT 指向 mock 上游验证请求体 */
  endpoint: string;
}

export interface BaiduPushVars {
  BAIDU_PUSH_SITE?: string;
  BAIDU_PUSH_TOKEN?: string;
  BAIDU_PUSH_DAILY_MAX?: string;
  BAIDU_PUSH_ENDPOINT?: string;
}

/** 从 vars/secrets 解析配置；site/token 任一缺失或非法返回 null（调用方据此完全跳过推送） */
export function resolveBaiduPush(vars: BaiduPushVars): BaiduPushConfig | null {
  const site = (vars.BAIDU_PUSH_SITE ?? "").trim();
  const token = (vars.BAIDU_PUSH_TOKEN ?? "").trim();
  if (!SITE_RE.test(site) || !TOKEN_RE.test(token)) return null;
  const rawMax = Number((vars.BAIDU_PUSH_DAILY_MAX ?? "").trim());
  const dailyMax = Number.isInteger(rawMax) && rawMax > 0 ? Math.min(rawMax, BAIDU_PUSH_BATCH_MAX) : BAIDU_PUSH_BATCH_MAX;
  const rawEndpoint = (vars.BAIDU_PUSH_ENDPOINT ?? "").trim();
  const endpoint = /^https?:\/\/[^\s?#]+$/.test(rawEndpoint) ? rawEndpoint : BAIDU_PUSH_ENDPOINT;
  return { site, token, dailyMax, endpoint };
}

export function buildBaiduPushUrl(cfg: Pick<BaiduPushConfig, "site" | "token">, endpoint = BAIDU_PUSH_ENDPOINT): string {
  const u = new URL(endpoint);
  u.searchParams.set("site", cfg.site);
  u.searchParams.set("token", cfg.token);
  return u.toString();
}

export function chunkBaiduUrls(urls: string[], size = BAIDU_PUSH_BATCH_MAX): string[][] {
  const out: string[][] = [];
  for (let i = 0; i < urls.length; i += size) out.push(urls.slice(i, i + size));
  return out;
}

/**
 * 配额策略：从全站 URL 清单（已按重要性排序）里剔除已成功推送过的，取前 max 条。
 * 新增内容页会自然排到「未推送」集合里下一轮推出；不会重复推旧 URL。
 */
export function pickPending(allUrls: string[], pushed: ReadonlySet<string>, max: number): string[] {
  const out: string[] = [];
  for (const u of allUrls) {
    if (out.length >= max) break;
    if (!pushed.has(u)) out.push(u);
  }
  return out;
}

export interface BaiduPushResponse {
  remain?: number;
  success?: number;
  not_same_site?: string[];
  not_valid?: string[];
  error?: number;
  message?: string;
}

export interface BaiduPushBatchResult {
  status: number;
  ok: boolean;
  submitted: number;
  /** 本批被百度计为成功的 URL（success 条数扣除 not_same_site/not_valid 后按顺序截取） */
  accepted: string[];
  remain: number | null;
  message: string;
}

export const BAIDU_STATUS_TEXT: Record<number, string> = {
  200: "OK",
  400: "Bad request (site error / empty content / over quota / >2000 urls)",
  401: "token is not valid",
  404: "not found (endpoint)",
  500: "internal error, please try later",
};

/** 从 200 响应里确定被接受的 URL：不在 not_same_site/not_valid 中，且总数不超过 success */
export function acceptedUrls(batch: string[], body: BaiduPushResponse): string[] {
  const rejected = new Set([...(body.not_same_site ?? []), ...(body.not_valid ?? [])]);
  const kept = batch.filter((u) => !rejected.has(u));
  const n = typeof body.success === "number" ? Math.max(0, Math.min(body.success, kept.length)) : kept.length;
  return kept.slice(0, n);
}

export interface BaiduSubmitOptions {
  cfg: BaiduPushConfig;
  urls: string[];
  fetchImpl?: typeof fetch;
}

/** 按批提交；仅 200 成功；网络异常记为 status 0；某批失败即停止后续批次（多为配额/鉴权问题，继续只会浪费） */
export async function submitBaidu(opts: BaiduSubmitOptions): Promise<BaiduPushBatchResult[]> {
  const doFetch = opts.fetchImpl ?? fetch;
  const url = buildBaiduPushUrl(opts.cfg, opts.cfg.endpoint);
  const results: BaiduPushBatchResult[] = [];
  for (const batch of chunkBaiduUrls(opts.urls)) {
    let res: Response;
    try {
      res = await doFetch(url, { method: "POST", headers: { "content-type": "text/plain" }, body: batch.join("\n") });
    } catch {
      results.push({ status: 0, ok: false, submitted: batch.length, accepted: [], remain: null, message: "Network error" });
      break;
    }
    let body: BaiduPushResponse = {};
    try {
      body = (await res.json()) as BaiduPushResponse;
    } catch { /* 非 JSON 响应按空对象处理 */ }
    const remain = typeof body.remain === "number" ? body.remain : null;
    if (res.status === 200) {
      results.push({ status: 200, ok: true, submitted: batch.length, accepted: acceptedUrls(batch, body), remain, message: "OK" });
      if (remain === 0) break;
      continue;
    }
    const message = body.message ? `${BAIDU_STATUS_TEXT[res.status] ?? `HTTP ${res.status}`}: ${body.message}` : (BAIDU_STATUS_TEXT[res.status] ?? `HTTP ${res.status}`);
    results.push({ status: res.status, ok: false, submitted: batch.length, accepted: [], remain, message });
    break;
  }
  return results;
}

export function summarizeBaidu(results: BaiduPushBatchResult[]): { ok: boolean; status: number; message: string; submitted: number; accepted: string[]; remain: number | null } {
  const failed = results.find((r) => !r.ok);
  const accepted = results.flatMap((r) => r.accepted);
  const submitted = results.reduce((n, r) => n + (r.ok ? r.submitted : 0), 0);
  const last = results[results.length - 1];
  const remain = last?.remain ?? null;
  if (!failed) return { ok: true, status: 200, message: "OK", submitted, accepted, remain };
  return { ok: false, status: failed.status, message: failed.message, submitted, accepted, remain };
}
