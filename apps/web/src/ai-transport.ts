// LLM 请求层（R474）：ai.ts 两处 chat.completions 调用（候选生成 / understanding）共用的统一出口，
// 负责拼请求体、超时、非 2xx 脱敏日志，以及主上游不可用时按备用上游配置重发同一请求（failover）。
// 未配置备用上游（fallback 为 undefined）时行为与仅有主上游完全一致。

// LLM 上游基地址：默认 DeepSeek 官方；本地 wrangler dev 可用 LLM_API_BASE 指向假上游
// 验证错误路径（R264），生产不设此变量时行为与既往完全一致
export const DEFAULT_LLM_API_BASE = "https://api.deepseek.com";
// LLM 模型名：默认 DeepSeek 官方 deepseek-chat；经 OpenAI 兼容网关时用 LLM_MODEL 指定网关侧模型名
export const DEFAULT_LLM_MODEL = "deepseek-chat";

// R461：部分网关侧模型（如 deepseek-v4-flash）默认开启思考链，单次调用可达 50s+ 导致超时；
// 设 LLM_THINKING=disabled 时请求体携带 thinking:{type:"disabled"} 关闭思考链（实测 50s→2s）
export function thinkingBodyExtra(thinking?: string): { thinking?: { type: "disabled" } } {
  return thinking === "disabled" ? { thinking: { type: "disabled" } } : {};
}

// 上游非 2xx 时记录状态码 / Retry-After / 响应体前 300 字（不含请求头与密钥），便于在 wrangler tail 中区分账号级限流、网关错误与瞬时 429
export async function logLlmHttpError(stage: string, res: Response): Promise<string> {
  let body = "";
  try {
    body = (await res.text()).slice(0, 300).replace(/\s+/g, " ");
  } catch {
    body = "<unreadable>";
  }
  console.warn(`llm-upstream ${stage} status=${res.status} retry-after=${res.headers.get("retry-after") ?? "-"} body=${body}`);
  return body;
}

// 部分 OpenAI 兼容网关用 429 承载账号/密钥额度耗尽（如 code=apikey_quota_exhausted），与瞬时限流语义不同，需让 UI 提示“配额已满”而非“稍等重试”
const QUOTA_BODY_RE = /quota|insufficient_quota|billing|balance|限额|余额/i;

export function llmHttpErrorMessage(status: number, body: string): string {
  return status === 429 && QUOTA_BODY_RE.test(body) ? `llm-http-${status} quota-exhausted` : `llm-http-${status}`;
}

export type LlmProvider = "primary" | "fallback";

/** 一组 OpenAI 兼容上游配置；baseUrl/model 缺省回落 DeepSeek 官方默认值 */
export interface LlmUpstream {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  thinking?: string;
}

export interface LlmChatMessage {
  role: "system" | "user";
  content: string;
}

export interface LlmChatRequest {
  /** 日志阶段名（candidates / understanding） */
  stage: string;
  messages: LlmChatMessage[];
  temperature: number;
  maxTokens: number;
  stream?: boolean;
  /** 单次尝试超时（主/备各自独立计时）；不传则不设超时 */
  timeoutMs?: number;
}

export interface LlmChatResult {
  res: Response;
  provider: LlmProvider;
}

/** 由 Worker 绑定拼出备用上游；LLM_FALLBACK_API_KEY 为空即不启用 failover */
export function resolveFallbackUpstream(env: { apiKey?: string; baseUrl?: string; model?: string; thinking?: string }): LlmUpstream | undefined {
  if (!env.apiKey) return undefined;
  return { apiKey: env.apiKey, baseUrl: env.baseUrl || undefined, model: env.model || undefined, thinking: env.thinking || undefined };
}

/** 主上游此类失败才切备用：认证/账务/配额（401/402/403）、429 且响应体表明额度耗尽、5xx。
 *  429 瞬时限流（非 quota 体）不切——避免双倍打上游，交给上层既有退避重试；其他 4xx 属请求本身问题，换上游无意义 */
export function shouldFailover(status: number, body: string): boolean {
  if (status === 401 || status === 402 || status === 403) return true;
  if (status === 429) return QUOTA_BODY_RE.test(body);
  return status >= 500;
}

function buildBody(upstream: LlmUpstream, req: LlmChatRequest): string {
  return JSON.stringify({
    model: upstream.model ?? DEFAULT_LLM_MODEL,
    messages: req.messages,
    temperature: req.temperature,
    max_tokens: req.maxTokens,
    ...(req.stream ? { stream: true } : {}),
    ...thinkingBodyExtra(upstream.thinking),
  });
}

function attemptFetch(upstream: LlmUpstream, req: LlmChatRequest): Promise<Response> {
  return fetch(`${upstream.baseUrl ?? DEFAULT_LLM_API_BASE}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${upstream.apiKey}` },
    ...(req.timeoutMs ? { signal: AbortSignal.timeout(req.timeoutMs) } : {}),
    body: buildBody(upstream, req),
  });
}

type AttemptFailure = { kind: "http"; status: number; body: string } | { kind: "network"; error: unknown };

function failureLabel(f: AttemptFailure): string {
  return f.kind === "http" ? String(f.status) : `net:${f.error instanceof Error ? f.error.name : "unknown"}`;
}

function failureError(f: AttemptFailure): unknown {
  return f.kind === "http" ? new Error(llmHttpErrorMessage(f.status, f.body)) : f.error;
}

/** 单次尝试：2xx 返回 Response；非 2xx 记脱敏日志并返回失败描述；fetch 抛错（网络/超时）也归为失败描述 */
async function tryUpstream(upstream: LlmUpstream, req: LlmChatRequest): Promise<{ res: Response } | { failure: AttemptFailure }> {
  let res: Response;
  try {
    res = await attemptFetch(upstream, req);
  } catch (error) {
    return { failure: { kind: "network", error } };
  }
  if (res.ok) return { res };
  const body = await logLlmHttpError(req.stage, res);
  return { failure: { kind: "http", status: res.status, body } };
}

/** 统一 LLM chat.completions 请求：主上游成功即返回；符合 shouldFailover 条件（或网络失败）且配置了备用上游时用备用配置重发同一请求。
 *  两次都失败时抛「最后一次失败」对应的错误（备用的 llm-http-NNN / 网络错误），并在 console.warn 里同时记录主/备两次状态（不含 Authorization 与响应体）。
 *  fetch 成功后的流读取失败不在本层处理（可能已向下游交出候选，沿用调用方语义） */
export async function llmChatFetch(primary: LlmUpstream, fallback: LlmUpstream | undefined, req: LlmChatRequest): Promise<LlmChatResult> {
  const first = await tryUpstream(primary, req);
  if ("res" in first) return { res: first.res, provider: "primary" };
  const f = first.failure;
  const eligible = f.kind === "network" || shouldFailover(f.status, f.body);
  if (!fallback || !eligible) throw failureError(f);
  const second = await tryUpstream(fallback, req);
  const secondLabel = "res" in second ? `ok:${second.res.status}` : failureLabel(second.failure);
  console.warn(`llm-failover ${req.stage} primary=${failureLabel(f)} fallback=${secondLabel}`);
  if ("res" in second) return { res: second.res, provider: "fallback" };
  throw failureError(second.failure);
}
