import { Hono } from "hono";
import { nanoid } from "nanoid";
import { generateCandidates, normalizeLabel, checkDomains, type CheckResult } from "@domainhunter/core";
import { whoisFallback } from "./whois";
import { AI_THEMES, classifyAiError, descriptionLooksEnglish, generateAiCandidates, generateUnderstanding, isLowYield, newGuardStats, type AiCandidate, type AiErrorKind, type AiTheme, type DislikedItem } from "./ai";
import { resolveFallbackUpstream, type LlmProvider } from "./ai-transport";
import { COMPARE_LIST, TLD_COMPARES } from "./content/compares";
import { GUIDE_LIST, INDUSTRY_GUIDES } from "./content/guides";
import { buildCompareFaq } from "./content/compare-faq";
import { buildGuideFaq } from "./content/guide-faq";
import { buildPricesFaq } from "./content/prices-faq";
import { buildTldFaq } from "./content/tld-faq";
import { compareContentBlocks, compareHubBlocks, guideContentBlocks, guideHubBlocks, homeHeroSkeleton, hubCrumbKicker, hubCrumbLabel, pricesTableSkeleton, tldContentBlocks, tldHubBlocks } from "./content/ssr-html";
import { HOME_FAQ, HOME_META } from "./content/home-copy";
import { buildGuideContent, buildTldContent, buildVsContent } from "./content/injected-build";
import type { InjectedContent } from "./content/injected";
import { HUB_META } from "./content/hubs";
import { TLD_GUIDES } from "./content/tlds";
import { TLD_LIST, USD_TO_CNY } from "./content/tld-list";
import { VARIANT_PREFIXES, VARIANT_SUFFIXES } from "./lib/variants";
import { isRegistrarId, parseAffiliateJson, type RegistrarId } from "./lib/registrars";
import { generateRuleCandidates, LLM_BREAKER_KEY, LLM_BREAKER_TTL_S, type FallbackReason } from "./rule-fallback";
import { tldPrice } from "./types";
import { putShareVerified, SHARE_WRITE_MAX_IDS } from "./share-write";
import { PRICES_LAST_FAIL_KEY, PRICES_LAST_OK_KEY, type PriceEntry } from "./prices-fetch";
import { loadPricesPayload, refreshPricesIfStale, type PricesCacheConfig } from "./prices-cache";
import { buildHeadInjection, injectIntoHead, isHtmlDocument, type GrowthVars } from "./growth-inject";
import { PageviewCounter, readDayPageviews, type DayPageviews } from "./pageviews";
import { INDEXNOW_ENDPOINT, submitIndexNow, summarizeIndexNow } from "./indexnow";

// LLM_API_BASE/LLM_MODEL：LLM 上游基地址与模型名。默认 DeepSeek 官方 + deepseek-chat；
// 生产可指向 OpenAI 兼容网关（R460：电信 AI 网关），本地 wrangler dev 亦可指向假上游验证错误路径（R264）
// LLM_FALLBACK_*（R474）：备用上游（任一 OpenAI 兼容端点），主上游额度耗尽/认证失败/5xx/网络失败时自动重发；
// LLM_FALLBACK_API_KEY 为 secret（wrangler secret put），未配置则 failover 休眠，行为与仅有主上游时完全一致
// GSC_VERIFICATION / BING_VERIFICATION / ANALYTICS_PROVIDER / ANALYTICS_TOKEN（R481）：站点验证 meta 与分析脚本，
// 全部可选；为空时 HTML 输出与未配置时字节一致（见 growth-inject.ts）
// REGISTRAR_AFFILIATE_JSON（R480）：公开的注册商返佣参数（wrangler.jsonc vars，非 secret），经 GET /api/registrars 下发前端；
// 形如 {"aliyun":{"query":{"userCode":"…"}},"namecheap":{"redirect":"https://namecheap.pxf.io/c/…?u={url}"}}，默认 "{}" = 纯搜索链接
type Bindings = GrowthVars & {
  ASSETS: Fetcher;
  DEEPSEEK_API_KEY: string;
  CACHE?: KVNamespace;
  LLM_API_BASE?: string;
  LLM_MODEL?: string;
  LLM_THINKING?: string;
  LLM_FALLBACK_API_KEY?: string;
  LLM_FALLBACK_API_BASE?: string;
  LLM_FALLBACK_MODEL?: string;
  LLM_FALLBACK_THINKING?: string;
  REGISTRAR_AFFILIATE_JSON?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// HTML 文档统一后处理（R481）：所有 text/html 响应（含 SSR 页面与 ASSETS 直出的 index.html）在此
// ① 注入验证 meta / 分析 beacon（vars 为空则不读 body，原响应原样透传）；② 服务端 pageviews/bots 计数。
// 计数器按 isolate 复用，合并窗口内多次请求为一次 KV 写；仅统计 GET + 2xx 的 HTML 文档（404 壳与 API 不计）。
let pageviewCounter: PageviewCounter | null = null;
app.use("*", async (c, next) => {
  await next();
  const res = c.res;
  if (c.req.method !== "GET" || !isHtmlDocument(res)) return;
  if (res.status >= 200 && res.status < 300 && c.env.CACHE) {
    pageviewCounter ??= new PageviewCounter(c.env.CACHE);
    c.executionCtx.waitUntil(pageviewCounter.record(new URL(c.req.url).pathname, c.req.header("user-agent")));
  }
  const snippet = buildHeadInjection(c.env);
  if (!snippet) return;
  const html = injectIntoHead(await res.text(), snippet);
  const headers = new Headers(res.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  c.res = new Response(html, { status: res.status, statusText: res.statusText, headers });
});

const RATE_LIMIT_PER_HOUR = 20;
const CACHE_TTL_TAKEN = 24 * 3600; // 已注册结果缓存 24h
const CACHE_TTL_AVAILABLE = 3600; // available 缓存 1h，防抢注误导
const SHARE_TTL = 30 * 24 * 3600; // 分享快照保留 30 天
const SYNC_TTL = 90 * 24 * 3600; // 同步码保留 90 天（每次推送刷新）
const MAX_SHARE_ITEMS = 100;
const SYNC_CODE_RE = /^[A-Z0-9]{8}$/;
const SYNC_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 去掉易混淆的 I/L/O/0/1
const MAX_RECHECK_DOMAINS = 100;
const STATS_KEY = "stats:checked";
const MONITOR_KEY = "monitor:domains";
const MONITOR_CHANGES_KEY = "monitor:changes";
const MAX_MONITOR_DOMAINS = 500; // 全局监控上限
const MAX_MONITOR_CHANGES = 100; // 变化记录保留条数
const MONITOR_RECHECK_COOLDOWN_S = 60; // 手动刷新限频：每 IP 60 秒一次
// 版本化缓存 key 掺 TLD 数量：指南扩容后旧缓存不再被当作全量数据；迁移/刷新逻辑见 prices-cache.ts
const PRICES_CACHE_CFG: PricesCacheConfig = {
  key: `prices:v2:${TLD_LIST.length}`,
  tldList: TLD_LIST,
  usdToCny: USD_TO_CNY,
  timeoutMs: 25_000, // Porkbun 拉取超时：上游全量报价实测 ~13s，10s 会必然超时导致实时价永远拉不到
};
const SITE_ORIGIN = "https://hunt.zalize.com";
const FAST_FIRST_ROUND_COUNT = 8; // fast 模式首轮候选数（更快首字节）
// R466：AI 搜索候选级核验队列并行度（每个候选 = tlds.length 个域名，每批内部再按 checkDomains 并发）；
// 与改动前整轮一次 checkDomains(concurrency=6) 的上游压力量级相当
const AI_CHECK_PARALLEL_CANDIDATES = 3;
/** R471：触发规则降级的首轮错误类别；unknown 不降级（语义不明，保留原 error 事件） */
const FALLBACK_ERROR_KINDS: ReadonlySet<AiErrorKind> = new Set<AiErrorKind>(["quota", "rate-limit", "upstream", "network"]);
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,62})(\.[a-z0-9]([a-z0-9-]{0,62}))+$/;

/** 累计核验计数（KV 非原子，允许少量误差） */
async function bumpStats(kv: KVNamespace | undefined, n: number): Promise<void> {
  if (!kv || n <= 0) return;
  try {
    const cur = Number((await kv.get(STATS_KEY)) ?? "0");
    await kv.put(STATS_KEY, String(cur + n));
  } catch { /* 计数失败不影响主流程 */ }
}

/** 每日聚合使用统计（仅聚合计数，不存任何用户输入/IP；KV 非原子，允许少量误差） */
interface DayUsage {
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

async function bumpUsage(kv: KVNamespace | undefined, tlds: string[], fast: boolean, refine: boolean): Promise<void> {
  if (!kv) return;
  try {
    const key = `usage:${new Date().toISOString().slice(0, 10)}`;
    const cur = (await kv.get<DayUsage>(key, "json")) ?? { searches: 0, byTld: {}, fast: 0, refine: 0 };
    cur.searches += 1;
    if (fast) cur.fast += 1;
    if (refine) cur.refine += 1;
    for (const t of tlds) cur.byTld[t] = (cur.byTld[t] ?? 0) + 1;
    await kv.put(key, JSON.stringify(cur), { expirationTtl: 45 * 24 * 3600 });
  } catch { /* 统计失败不影响主流程 */ }
}

/** 当日注册商外链点击 +1（R480，仅计数；KV 非原子，允许少量误差） */
async function bumpOutbound(kv: KVNamespace | undefined, registrar: RegistrarId, tld: string): Promise<void> {
  if (!kv) return;
  try {
    const key = `usage:${new Date().toISOString().slice(0, 10)}`;
    const cur = (await kv.get<DayUsage>(key, "json")) ?? { searches: 0, byTld: {}, fast: 0, refine: 0 };
    cur.outbound = { ...cur.outbound, [registrar]: (cur.outbound?.[registrar] ?? 0) + 1 };
    // 只按已知 TLD 分桶（含站内核验支持的 com.cn），其余归 other，避免 KV 记录被任意字符串撑大
    const tldKey = tld === "com.cn" || (TLD_LIST as readonly string[]).includes(tld) ? tld : "other";
    cur.outboundByTld = { ...cur.outboundByTld, [tldKey]: (cur.outboundByTld?.[tldKey] ?? 0) + 1 };
    await kv.put(key, JSON.stringify(cur), { expirationTtl: 45 * 24 * 3600 });
  } catch { /* 统计失败不影响主流程 */ }
}

/** 当日 AI 上游错误分类计数 +1（R264，仅计数；KV 非原子，允许少量误差） */
async function bumpAiError(kv: KVNamespace | undefined, kind: AiErrorKind): Promise<void> {
  if (!kv) return;
  try {
    const key = `usage:${new Date().toISOString().slice(0, 10)}`;
    const cur = (await kv.get<DayUsage>(key, "json")) ?? { searches: 0, byTld: {}, fast: 0, refine: 0 };
    cur.aiErrors = { ...cur.aiErrors, [kind]: (cur.aiErrors?.[kind] ?? 0) + 1 };
    await kv.put(key, JSON.stringify(cur), { expirationTtl: 45 * 24 * 3600 });
  } catch { /* 统计失败不影响主流程 */ }
}

/** 当日 LLM 主轮应答上游计数 +1（R474，仅计数；KV 非原子，允许少量误差） */
async function bumpLlmProvider(kv: KVNamespace | undefined, provider: LlmProvider): Promise<void> {
  if (!kv) return;
  try {
    const key = `usage:${new Date().toISOString().slice(0, 10)}`;
    const cur = (await kv.get<DayUsage>(key, "json")) ?? { searches: 0, byTld: {}, fast: 0, refine: 0 };
    cur.llmProvider = { ...cur.llmProvider, [provider]: (cur.llmProvider?.[provider] ?? 0) + 1 };
    await kv.put(key, JSON.stringify(cur), { expirationTtl: 45 * 24 * 3600 });
  } catch { /* 统计失败不影响主流程 */ }
}

/** 当日规则降级计数 +1（R471，仅计数；KV 非原子，允许少量误差） */
async function bumpFallback(kv: KVNamespace | undefined, reason: FallbackReason): Promise<void> {
  if (!kv) return;
  try {
    const key = `usage:${new Date().toISOString().slice(0, 10)}`;
    const cur = (await kv.get<DayUsage>(key, "json")) ?? { searches: 0, byTld: {}, fast: 0, refine: 0 };
    cur.fallbacks = { ...cur.fallbacks, [reason]: (cur.fallbacks?.[reason] ?? 0) + 1 };
    await kv.put(key, JSON.stringify(cur), { expirationTtl: 45 * 24 * 3600 });
  } catch { /* 统计失败不影响主流程 */ }
}

/** 熔断标记：值为到期时间戳（ms），KV TTL 之外再校验一次时间，避免 TTL 精度/时钟差导致多放行 */
async function llmBreakerUntil(kv: KVNamespace | undefined): Promise<number | null> {
  if (!kv) return null;
  try {
    const raw = await kv.get(LLM_BREAKER_KEY);
    const until = Number(raw);
    return raw && Number.isFinite(until) && until > Date.now() ? until : null;
  } catch {
    return null;
  }
}

async function tripLlmBreaker(kv: KVNamespace | undefined): Promise<void> {
  if (!kv) return;
  try {
    await kv.put(LLM_BREAKER_KEY, String(Date.now() + LLM_BREAKER_TTL_S * 1000), { expirationTtl: LLM_BREAKER_TTL_S });
  } catch { /* 熔断写失败退化为每请求各自撞上游（原行为） */ }
}

/** 分享写入重试/失败计数（R305，仅聚合数字；KV 非原子，允许少量误差） */
async function bumpShareWrite(kv: KVNamespace | undefined, retries: number, failed: boolean): Promise<void> {
  if (!kv || (retries <= 0 && !failed)) return;
  try {
    const key = `usage:${new Date().toISOString().slice(0, 10)}`;
    const cur = (await kv.get<DayUsage>(key, "json")) ?? { searches: 0, byTld: {}, fast: 0, refine: 0 };
    if (retries > 0) cur.shareWriteRetry = (cur.shareWriteRetry ?? 0) + retries;
    if (failed) cur.shareWriteFail = (cur.shareWriteFail ?? 0) + 1;
    await kv.put(key, JSON.stringify(cur), { expirationTtl: 45 * 24 * 3600 });
  } catch { /* 统计失败不影响主流程 */ }
}

/** 按 IP 简单限流（KV 计数，按小时桶）；无 KV 绑定时不限流 */
async function checkRateLimit(kv: KVNamespace | undefined, ip: string): Promise<boolean> {
  if (!kv) return true;
  const key = `rl:${ip}:${Math.floor(Date.now() / 3600_000)}`;
  try {
    const n = Number((await kv.get(key)) ?? "0");
    if (n >= RATE_LIMIT_PER_HOUR) return false;
    await kv.put(key, String(n + 1), { expirationTtl: 3700 });
  } catch {
    return true;
  }
  return true;
}

type CachedCheck = Pick<CheckResult, "domain" | "status" | "method" | "expiresAt">;

/** 带 KV 缓存的域名核验：命中直接回放，未命中走实时核验并回写 */
async function checkDomainsCached(
  kv: KVNamespace | undefined,
  domains: string[],
  onResult: (r: CheckResult & { cached?: boolean }) => Promise<void>,
  refresh = false,
  countStats = true,
): Promise<void> {
  let misses = domains;
  if (kv && !refresh) {
    misses = [];
    const hits = await Promise.all(
      domains.map(async (d) => {
        try {
          return await kv.get<CachedCheck>(`d:${d}`, "json");
        } catch {
          return null;
        }
      }),
    );
    for (let i = 0; i < domains.length; i++) {
      const hit = hits[i];
      if (hit && hit.status) await onResult({ ...hit, domain: domains[i], cached: true });
      else misses.push(domains[i]);
    }
  }
  if (misses.length === 0) return;
  await checkDomains(misses, async (r) => {
    if (kv && (r.status === "available" || r.status === "taken")) {
      const ttl = r.status === "available" ? CACHE_TTL_AVAILABLE : CACHE_TTL_TAKEN;
      try {
        const cached: CachedCheck = { domain: r.domain, status: r.status, method: r.method };
        if (r.expiresAt) cached.expiresAt = r.expiresAt;
        await kv.put(`d:${r.domain}`, JSON.stringify(cached), { expirationTtl: ttl });
      } catch { /* 缓存失败不影响主流程 */ }
    }
    await onResult(r);
  }, 6, fetch, whoisFallback);
  if (countStats) await bumpStats(kv, domains.length);
}

/** R466：有界并行队列——run() 立即返回，任务在最多 limit 个槽位内按入队顺序开始；drain() 等全部完成，首个失败原样抛出 */
function boundedQueue(limit: number) {
  let active = 0;
  const waiting: (() => void)[] = [];
  const inflight: Promise<void>[] = [];
  const run = (task: () => Promise<void>) => {
    const p = (async () => {
      if (active >= limit) await new Promise<void>((r) => waiting.push(r)); // 槽位由释放方直接移交，不再计数
      else active++;
      try {
        await task();
      } finally {
        const next = waiting.shift();
        if (next) next();
        else active--;
      }
    })();
    inflight.push(p);
    p.catch(() => undefined); // 失败留给 drain() 统一抛出，避免入队到 drain 之间被判为未处理拒绝
  };
  const drain = async () => {
    await Promise.all(inflight);
  };
  return { run, drain };
}

interface ShareItem {
  domain: string;
  label: string;
  tld: string;
  meaning?: string;
  scores?: { length: number; readability: number; relevance: number; brandability: number };
}

function sanitizeShareItem(raw: unknown): ShareItem | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const domain = typeof o.domain === "string" ? o.domain.trim().toLowerCase() : "";
  if (!DOMAIN_RE.test(domain) || domain.length > 253) return null;
  const dot = domain.indexOf(".");
  const item: ShareItem = { domain, label: domain.slice(0, dot), tld: domain.slice(dot + 1) };
  if (typeof o.meaning === "string" && o.meaning) item.meaning = o.meaning.slice(0, 300);
  const s = o.scores as Record<string, unknown> | undefined;
  if (s && typeof s === "object") {
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(Math.max(Math.round(v), 0), 100) : null);
    const length = num(s.length), readability = num(s.readability), relevance = num(s.relevance), brandability = num(s.brandability);
    if (length !== null && readability !== null && relevance !== null && brandability !== null) {
      item.scores = { length, readability, relevance, brandability };
    }
  }
  return item;
}

function genSyncCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let code = "";
  for (const b of bytes) code += SYNC_CODE_ALPHABET[b % SYNC_CODE_ALPHABET.length];
  return code;
}

app.post("/api/ai-search", async (c) => {
  const body = await c.req.json<{
    description?: string;
    tlds?: string[];
    target?: number;
    excludeLabels?: string[];
    disliked?: { label?: string; theme?: string }[];
    style?: string;
    lengthPref?: string;
    fast?: boolean;
    lang?: string;
  }>();
  const fast = body.fast === true;
  const lang: "zh" | "en" = body.lang === "en" ? "en" : "zh";
  let description = (body.description ?? "").trim().slice(0, 500);
  // R471：规则降级只从用户原始描述抽词（不含下方拼接的风格/长度偏好后缀）
  const rawDescription = description;
  const style = (body.style ?? "").trim().slice(0, 50);
  const lengthPref = (body.lengthPref ?? "").trim().slice(0, 50);
  // R465 补丁：语言判定必须基于拼接风格/长度偏好前的原始描述（后缀含中文会污染判定）
  const descLooksEnglish = descriptionLooksEnglish(description);
  if (style) description += `\n命名风格偏好：${style}`;
  if (lengthPref) description += `\n名字长度偏好：${lengthPref}`;
  const tlds = (body.tlds ?? ["com", "cn"]).map((t) => t.trim().toLowerCase().replace(/^\./, "")).filter(Boolean);
  const target = Math.min(Math.max(body.target ?? 10, 3), 30);
  const MAX_ROUNDS = 5;
  if (!(body.description ?? "").trim()) return c.json({ error: "description required" }, 400);
  if (description.length > 620) return c.json({ error: "description too long" }, 400);

  const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(c.env.CACHE, ip))) {
    const msg =
      lang === "en"
        ? `You've been hunting hard today — AI hunts are capped at ${RATE_LIMIT_PER_HOUR} per hour, come back in a bit`
        : `今天猎得有点勤快了：每小时最多 ${RATE_LIMIT_PER_HOUR} 次 AI 猎名，休息一会儿再来吧`;
    return c.json({ error: "rate_limited", message: msg }, 429);
  }

  c.executionCtx.waitUntil(bumpUsage(c.env.CACHE, tlds, fast, (body.excludeLabels ?? []).length > 0));

  const apiKey = c.env.DEEPSEEK_API_KEY;
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const emit = (obj: unknown) => writer.write(encoder.encode(JSON.stringify(obj) + "\n"));

  c.executionCtx.waitUntil(
    (async () => {
      const tried = new Set<string>((body.excludeLabels ?? []).map((l) => l.toLowerCase()));
      // R180：点踩候选（label + theme），refine 轮生成风格规避提示；旧 payload 无此字段，天然向后兼容
      const disliked: DislikedItem[] = (Array.isArray(body.disliked) ? body.disliked : [])
        .map((d) => {
          const label = String(d?.label ?? "").trim().toLowerCase();
          const theme = String(d?.theme ?? "").toLowerCase();
          return { label, theme: AI_THEMES.has(theme) ? (theme as AiTheme) : undefined };
        })
        .filter((d) => /^[a-z0-9-]{1,63}$/.test(d.label))
        .slice(0, 40);
      const takenLabels: string[] = [...tried];
      // 被注册主体的命名思路分布，供 refine 轮总结失败模式
      const takenThemes: Partial<Record<string, number>> = {};
      let availableCount = 0;
      // R247（R239 审计 P3-4）：多轮低产出检测——各轮可注册增量，连续低产出且 TLD 少时发一次性提示
      const roundGains: number[] = [];
      let prevAvailableCount = 0;
      let lowYieldHintSent = false;
      const llmBase = c.env.LLM_API_BASE || undefined;
      const llmModel = c.env.LLM_MODEL || undefined;
      const llmThinking = c.env.LLM_THINKING || undefined;
      // R474：备用上游（未配 LLM_FALLBACK_API_KEY 时为 undefined，请求层不启用 failover）
      const llmFallback = resolveFallbackUpstream({
        apiKey: c.env.LLM_FALLBACK_API_KEY,
        baseUrl: c.env.LLM_FALLBACK_API_BASE,
        model: c.env.LLM_FALLBACK_MODEL,
        thinking: c.env.LLM_FALLBACK_THINKING,
      });
      // R471：熔断期内（quota 耗尽后 5 分钟）不打任何上游——理解与候选两路都跳过，直接进规则降级
      const breakerUntil = await llmBreakerUntil(c.env.CACHE);
      const breakerHit = breakerUntil !== null;
      const understandingDone = breakerHit
        ? Promise.resolve()
        : generateUnderstanding(description, apiKey, lang, llmBase, llmModel, llmThinking, llmFallback)
            .then(async (u) => {
              if (u) await emit({ type: "understanding", ...u });
            })
            .catch(() => undefined);
      try {
        for (let round = 1; round <= MAX_ROUNDS && availableCount < target; round++) {
          await emit({ type: "round", round, availableCount, target, note: round === 1 ? "AI 正在构思名字…" : "可注册的还不够，AI 反思后继续想…" });
          // R238：防线统计元数据——按轮汇总各防线丢弃计数与补发/重试触发情况，
          // 随 proposed 事件返回（新增字段，旧前端忽略，不破坏现有结构）；只计数，不含被丢弃候选内容
          const guard = newGuardStats();
          // R466：首结果提速——LLM 流式返回，每解出一个通过防线的候选立即：跨轮去重 → 单项 proposed 事件
          // （items 只含该候选，不带 guard）→ 进入核验队列逐域名下发 result；流结束后再发一条 items 为空的
          // proposed 携带本轮 guard 汇总（前端对同轮多条 proposed 的 filtered 是累加语义，guard 只带一次即不重计）。
          // 事件结构与字段均未变，旧前端无需适配
          const meaningByLabel = new Map<string, string>();
          const themeByLabel = new Map<string, AiTheme | undefined>();
          const takenThisRound = new Set<string>();
          let checkedDomains = 0;
          const checks = boundedQueue(AI_CHECK_PARALLEL_CANDIDATES);
          const onCandidate = async (x: AiCandidate) => {
            if (tried.has(x.label)) return;
            tried.add(x.label);
            meaningByLabel.set(x.label, x.meaning);
            themeByLabel.set(x.label, x.theme);
            await emit({ type: "proposed", round, items: [x], tlds });
            const domains = tlds.map((t) => `${x.label}.${t}`);
            checkedDomains += domains.length;
            checks.run(() =>
              checkDomainsCached(
                c.env.CACHE,
                domains,
                async (r) => {
                  const label = r.domain.slice(0, r.domain.indexOf("."));
                  if (r.status === "available") availableCount++;
                  else if (r.status === "taken") takenThisRound.add(label);
                  await emit({ ...r, round, meaning: meaningByLabel.get(label), theme: themeByLabel.get(label) });
                },
                false,
                false,
              ),
            );
          };
          // R471：规则降级——熔断命中或首轮 LLM 失败（quota/rate-limit/upstream/network）时，用确定性规则候选走同一条
          // onCandidate 流水（proposed → RDAP 核验 → result），事件结构与成功路径一致；只多一条 fallback 事件供前端挂横幅。
          // 降级轮结束后不再继续反思轮（上游不可用）
          const runFallback = async (reason: FallbackReason) => {
            const rules = generateRuleCandidates(rawDescription, lang, guard, tried);
            // 配额类降级附带熔断剩余秒数，前端据此提示「约 N 分钟后可重试 AI」；其他原因不带
            const retryAfterS =
              reason === "quota-breaker" && breakerUntil !== null
                ? Math.max(1, Math.ceil((breakerUntil - Date.now()) / 1000))
                : reason === "quota"
                  ? LLM_BREAKER_TTL_S
                  : undefined;
            await emit({ type: "fallback", round, reason, count: rules.length, ...(retryAfterS !== undefined ? { retryAfterS } : {}) });
            for (const x of rules) await onCandidate(x);
          };
          let fellBack: FallbackReason | null = null;
          if (breakerHit) {
            await runFallback("quota-breaker");
            fellBack = "quota-breaker";
          } else {
            try {
              await generateAiCandidates(description, apiKey, {
                count: fast && round === 1 ? FAST_FIRST_ROUND_COUNT : 24,
                // 跨轮去重：把已核验过的全部名字和被注册模式一起反馈给 refine 轮
                feedback:
                  round === 1 && tried.size === 0
                    ? undefined
                    : { tried: [...tried], taken: takenLabels, takenThemes, disliked: disliked.length > 0 ? disliked : undefined },
                round,
                lang,
                guard,
                baseUrl: llmBase,
                model: llmModel,
                thinking: llmThinking,
                fallback: llmFallback,
                descLooksEnglish,
                onCandidate,
              });
            } catch (e) {
              // R264：上游错误分类透出（errorKind），前端按类别渲染文案与重试 CTA；
              // detail 只含既有错误短码（llm-http-402 等），不含 key 与上游响应体
              const errorKind = classifyAiError(e);
              await bumpAiError(c.env.CACHE, errorKind);
              // R471：quota 耗尽→写 5 分钟熔断（rate-limit 不写）；首轮失败→规则降级而非直接结束
              if (errorKind === "quota") await tripLlmBreaker(c.env.CACHE);
              if (round === 1 && FALLBACK_ERROR_KINDS.has(errorKind)) {
                await runFallback(errorKind);
                fellBack = errorKind;
              } else {
                await checks.drain().catch(() => undefined);
                await emit({ type: "error", round, errorKind, detail: String(e), guard });
                break;
              }
            }
          }
          // R474：本轮实际应答的 LLM 上游（primary/fallback）随汇总事件透出（新增尾部字段，旧前端忽略），并计入当日 usage
          await emit({ type: "proposed", round, items: [], tlds, guard, provider: guard.provider });
          if (guard.provider) await bumpLlmProvider(c.env.CACHE, guard.provider);
          await checks.drain();
          await bumpStats(c.env.CACHE, checkedDomains);
          if (fellBack) {
            // 核验排完后再计数：避开与 waitUntil(bumpUsage) 对同一 usage 键的读改写竞争（KV 非原子）
            await bumpFallback(c.env.CACHE, fellBack);
            break;
          }
          takenLabels.push(...takenThisRound);
          for (const label of takenThisRound) {
            const theme = themeByLabel.get(label);
            if (theme) takenThemes[theme] = (takenThemes[theme] ?? 0) + 1;
          }
          // R247：连续低产出提示——不自动改用户 TLD 选择，只提示一次（前端渲染双语文案）
          roundGains.push(availableCount - prevAvailableCount);
          prevAvailableCount = availableCount;
          if (!lowYieldHintSent && availableCount < target && isLowYield(roundGains, tlds.length)) {
            lowYieldHintSent = true;
            await emit({ type: "hint", kind: "lowYield", round });
          }
        }
        await understandingDone;
        await emit({ type: "done", availableCount, target, reachedTarget: availableCount >= target });
      } finally {
        await writer.close();
      }
    })(),
  );

  return new Response(readable, {
    headers: { "content-type": "application/x-ndjson; charset=utf-8" },
  });
});

app.post("/api/search", async (c) => {
  const body = await c.req.json<{
    roots?: string[];
    prefixes?: string[];
    suffixes?: string[];
    tlds?: string[];
    domains?: string[];
  }>();
  const roots = body.roots ?? [];
  const tlds = body.tlds ?? ["com"];
  // 批量粘贴模式：直接给完整域名清单（去重 + 校验，上限 200）
  const explicit = [
    ...new Set(
      (Array.isArray(body.domains) ? body.domains : [])
        .filter((d): d is string => typeof d === "string")
        .map((d) => d.trim().toLowerCase())
        .filter((d) => DOMAIN_RE.test(d) && d.length <= 253),
    ),
  ].slice(0, 200);
  if (roots.length === 0 && explicit.length === 0) return c.json({ error: "roots required" }, 400);

  const domains =
    explicit.length > 0
      ? explicit
      : generateCandidates({
          roots,
          prefixes: body.prefixes,
          suffixes: body.suffixes,
          tlds,
          maxCandidates: 200,
        });

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  c.executionCtx.waitUntil(
    (async () => {
      try {
        await checkDomainsCached(c.env.CACHE, domains, async (r) => {
          await writer.write(encoder.encode(JSON.stringify(r) + "\n"));
        });
      } finally {
        await writer.close();
      }
    })(),
  );

  return new Response(readable, {
    headers: { "content-type": "application/x-ndjson; charset=utf-8" },
  });
});

interface MonitorEntry {
  domain: string;
  status: string;
  lastChecked: number;
  webhook?: string;
  expiresAt?: string;
}

// 通知 webhook：仅接受 https URL，长度受限
function sanitizeWebhook(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const url = raw.trim();
  if (url === "" || url.length > 500) return null;
  try {
    if (new URL(url).protocol !== "https:") return null;
  } catch {
    return null;
  }
  return url;
}

interface MonitorChange {
  domain: string;
  from: string;
  to: string;
  at: number;
}

async function loadMonitorMap(kv: KVNamespace): Promise<Record<string, MonitorEntry>> {
  try {
    return (await kv.get<Record<string, MonitorEntry>>(MONITOR_KEY, "json")) ?? {};
  } catch {
    return {};
  }
}

// 监控开关：把域名加入/移出 KV 监控集合（全局上限 500）
app.post("/api/monitor", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "monitor_unavailable" }, 503);
  const body = await c.req.json<{ domain?: string; enabled?: boolean; status?: string; webhook?: string }>().catch(() => null);
  const domain = typeof body?.domain === "string" ? body.domain.trim().toLowerCase() : "";
  if (!DOMAIN_RE.test(domain) || domain.length > 253) return c.json({ error: "invalid_domain" }, 400);
  const enabled = body?.enabled !== false;
  const map = await loadMonitorMap(kv);
  if (enabled) {
    if (!map[domain] && Object.keys(map).length >= MAX_MONITOR_DOMAINS) {
      return c.json({ error: "monitor_full" }, 429);
    }
    const status = typeof body?.status === "string" && ["available", "taken", "unknown"].includes(body.status) ? body.status : "unknown";
    const entry = map[domain] ?? { domain, status, lastChecked: 0 };
    if (body && "webhook" in body) {
      const webhook = sanitizeWebhook(body.webhook);
      if (webhook) entry.webhook = webhook;
      else delete entry.webhook;
    }
    map[domain] = entry;
  } else {
    delete map[domain];
  }
  await kv.put(MONITOR_KEY, JSON.stringify(map));
  return c.json({ ok: true, enabled, monitored: Object.keys(map).length });
});

// 监控清单：按客户端本地清单批量查服务端监控条目（监控集合是单 key 全局 map，无账号体系，「我的监控」以客户端本地清单为准）
app.post("/api/monitor/list", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "monitor_unavailable" }, 503);
  const body = await c.req.json<{ domains?: unknown[] }>().catch(() => null);
  const raw = Array.isArray(body?.domains) ? body.domains : [];
  if (raw.length > MAX_MONITOR_DOMAINS) return c.json({ error: "too_many_domains" }, 400);
  const domains = [
    ...new Set(
      raw
        .filter((d): d is string => typeof d === "string")
        .map((d) => d.trim().toLowerCase())
        .filter((d) => DOMAIN_RE.test(d) && d.length <= 253),
    ),
  ];
  const map = await loadMonitorMap(kv);
  const entries = domains
    .filter((d) => map[d])
    .map((d) => ({ domain: d, status: map[d].status, lastChecked: map[d].lastChecked, ...(map[d].expiresAt ? { expiresAt: map[d].expiresAt } : {}) }));
  return c.json({ entries, monitored: Object.keys(map).length, limit: MAX_MONITOR_DOMAINS });
});

// 监控动态：最近的状态变化记录（前端按本地清单过滤）
app.get("/api/monitor/changes", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "monitor_unavailable" }, 503);
  let changes: MonitorChange[] = [];
  try {
    changes = (await kv.get<MonitorChange[]>(MONITOR_CHANGES_KEY, "json")) ?? [];
  } catch { /* 读失败返回空列表 */ }
  return c.json({ changes });
});

/** 监控核验共用逻辑：实时复查指定域名，更新 KV 条目（含 expiresAt），状态变化写入 monitor:changes 并推送 webhook */
async function recheckMonitorDomains(kv: KVNamespace, map: Record<string, MonitorEntry>, domains: string[]): Promise<void> {
  if (domains.length === 0) return;
  const now = Date.now();
  const newChanges: MonitorChange[] = [];
  const notifications: { webhook: string; change: MonitorChange }[] = [];
  // 缓存穿透（refresh=true）：监控复查必须拿实时状态
  await checkDomainsCached(kv, domains, async (r) => {
    const entry = map[r.domain];
    if (!entry) return;
    if (r.status !== "unknown" && entry.status !== "unknown" && r.status !== entry.status) {
      const change = { domain: r.domain, from: entry.status, to: r.status, at: now };
      newChanges.push(change);
      if (entry.webhook) notifications.push({ webhook: entry.webhook, change });
    }
    if (r.status !== "unknown") entry.status = r.status;
    if (r.status === "taken" && r.expiresAt) entry.expiresAt = r.expiresAt;
    else if (r.status === "available") delete entry.expiresAt;
    entry.lastChecked = now;
  }, true);
  await kv.put(MONITOR_KEY, JSON.stringify(map));
  if (newChanges.length > 0) {
    let prev: MonitorChange[] = [];
    try {
      prev = (await kv.get<MonitorChange[]>(MONITOR_CHANGES_KEY, "json")) ?? [];
    } catch { /* 旧记录读失败则只保留本次 */ }
    await kv.put(MONITOR_CHANGES_KEY, JSON.stringify([...newChanges, ...prev].slice(0, MAX_MONITOR_CHANGES)));
  }
  await Promise.allSettled(notifications.slice(0, 50).map(({ webhook, change }) => sendWebhookNotification(webhook, change)));
}

/** Cron：批量复查监控集合，状态变化写入 monitor:changes */
async function runMonitorSweep(env: Bindings): Promise<void> {
  const kv = env.CACHE;
  if (!kv) return;
  const map = await loadMonitorMap(kv);
  await recheckMonitorDomains(kv, map, Object.keys(map));
}

// 手动刷新：对本地清单中的监控域立即执行一次真实核验（复用 cron sweep 逻辑），限频每 IP 60 秒一次
app.post("/api/monitor/recheck", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "monitor_unavailable" }, 503);
  const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rlKey = `rl:recheck:${ip}`;
  try {
    const last = Number((await kv.get(rlKey)) ?? "0");
    if (last > 0) {
      const retryAfter = Math.max(1, Math.ceil((last + MONITOR_RECHECK_COOLDOWN_S * 1000 - Date.now()) / 1000));
      return c.json({ error: "rate_limited", retryAfter }, 429, { "Retry-After": String(retryAfter) });
    }
    await kv.put(rlKey, String(Date.now()), { expirationTtl: MONITOR_RECHECK_COOLDOWN_S });
  } catch { /* 限流读写失败不阻塞刷新 */ }
  const body = await c.req.json<{ domains?: unknown[] }>().catch(() => null);
  const raw = Array.isArray(body?.domains) ? body.domains : [];
  if (raw.length > MAX_MONITOR_DOMAINS) return c.json({ error: "too_many_domains" }, 400);
  const domains = [
    ...new Set(
      raw
        .filter((d): d is string => typeof d === "string")
        .map((d) => d.trim().toLowerCase())
        .filter((d) => DOMAIN_RE.test(d) && d.length <= 253),
    ),
  ];
  const map = await loadMonitorMap(kv);
  const targets = domains.filter((d) => map[d]);
  await recheckMonitorDomains(kv, map, targets);
  const entries = targets.map((d) => ({ domain: d, status: map[d].status, lastChecked: map[d].lastChecked, ...(map[d].expiresAt ? { expiresAt: map[d].expiresAt } : {}) }));
  return c.json({ entries, monitored: Object.keys(map).length, limit: MAX_MONITOR_DOMAINS });
});

/** 状态变化时向用户自备的 webhook 推送一条 JSON 通知（钉钉/飞书/Slack/自建均可） */
async function sendWebhookNotification(webhook: string, change: MonitorChange): Promise<void> {
  const event = change.to === "available" ? "dropped" : "regained";
  const text =
    event === "dropped"
      ? `🎉 DomainHunter: ${change.domain} 已释放，现在可以注册了！ / is now available to register!`
      : `DomainHunter: ${change.domain} 已被注册 / has been registered (${change.from} → ${change.to})`;
  const body = JSON.stringify({
    source: "domainhunter",
    event,
    domain: change.domain,
    from: change.from,
    to: change.to,
    at: change.at,
    // Slack/自建服务：text 字符串
    text,
    // 飞书机器人：msg_type + content.text
    msg_type: "text",
    content: { text },
    // 企业微信机器人：msgtype + markdown/text 需 text 为对象，此处仅提供通用字段
    msgtype: "text",
    url: `https://hunt.zalize.com`,
  });
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // 通知失败不影响监控主流程
  }
}

// 候选清单分享：存快照到 KV，返回可访问的只读链接
app.post("/api/share", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "share_unavailable" }, 503);
  const body = await c.req.json<{ items?: unknown[] }>().catch(() => null);
  const rawItems = Array.isArray(body?.items) ? body.items : [];
  if (rawItems.length === 0) return c.json({ error: "items required" }, 400);
  if (rawItems.length > MAX_SHARE_ITEMS) return c.json({ error: "too many items" }, 400);
  const items = rawItems.map(sanitizeShareItem).filter((x): x is ShareItem => x !== null);
  if (items.length === 0) return c.json({ error: "items invalid" }, 400);
  // revoke token 仅返回给创建者，用于后续撤销；不随 GET 暴露
  const revokeToken = nanoid(24);
  const payload = JSON.stringify({ items, createdAt: Date.now(), revokeToken });
  // KV put 偶发静默丢失：写后读回校验 + 退避重试 + 换 id 重写（详见 share-write.ts）
  const result = await putShareVerified(kv, () => nanoid(10), () => payload, SHARE_TTL);
  c.executionCtx.waitUntil(bumpShareWrite(kv, result.retries, !result.ok));
  if (!result.ok) {
    // 结构化失败日志（wrangler tail 排查用）：总尝试次数、用过的 id 数、KV 抛错消息摘要
    console.error(
      "share_write_failed",
      JSON.stringify({ attempts: result.retries, ids: SHARE_WRITE_MAX_IDS, kvErrors: result.errors }),
    );
    return c.json({ error: "share_write_failed" }, 503);
  }
  const origin = new URL(c.req.url).origin;
  return c.json({ id: result.id, url: `${origin}/s/${result.id}`, revokeToken });
});

interface ShareSnapshotStored {
  items?: ShareItem[];
  createdAt?: number;
  revokeToken?: string;
  revoked?: boolean;
}

app.get("/api/share/:id", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "share_unavailable" }, 503);
  const id = c.req.param("id");
  if (!/^[\w-]{1,32}$/.test(id)) return c.json({ error: "not_found" }, 404);
  const snapshot = await kv.get<ShareSnapshotStored>(`share:${id}`, "json");
  if (!snapshot) return c.json({ error: "not_found" }, 404);
  if (snapshot.revoked) return c.json({ error: "revoked" }, 410);
  return c.json({ items: snapshot.items ?? [], createdAt: snapshot.createdAt ?? 0 });
});

// 撤销分享：必须携带创建时下发的 revoke token；旧分享无 token 不可远程撤销
app.delete("/api/share/:id", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "share_unavailable" }, 503);
  const id = c.req.param("id");
  if (!/^[\w-]{1,32}$/.test(id)) return c.json({ error: "not_found" }, 404);
  const body = await c.req.json<{ token?: string }>().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  if (!token) return c.json({ error: "token_required" }, 400);
  const snapshot = await kv.get<ShareSnapshotStored>(`share:${id}`, "json");
  if (!snapshot) return c.json({ error: "not_found" }, 404);
  if (snapshot.revoked) return c.json({ ok: true });
  if (!snapshot.revokeToken) return c.json({ error: "not_revocable" }, 403);
  if (snapshot.revokeToken !== token) return c.json({ error: "forbidden" }, 403);
  // 保留占位标记而非直接删除，让 /s/:id 呈现「链接已失效」而非裸 404
  await kv.put(`share:${id}`, JSON.stringify({ revoked: true, revokedAt: Date.now() }), { expirationTtl: SHARE_TTL });
  return c.json({ ok: true });
});

// 清单跨设备同步（免登录）：生成/更新同步码（PUT 语义，同码覆盖），TTL 90 天
app.post("/api/sync", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "sync_unavailable" }, 503);
  const body = await c.req.json<{ items?: unknown[]; code?: string }>().catch(() => null);
  const rawItems = Array.isArray(body?.items) ? body.items : [];
  if (rawItems.length === 0) return c.json({ error: "items required" }, 400);
  if (rawItems.length > MAX_SHARE_ITEMS) return c.json({ error: "too many items" }, 400);
  const items = rawItems.map(sanitizeShareItem).filter((x): x is ShareItem => x !== null);
  if (items.length === 0) return c.json({ error: "items invalid" }, 400);
  let code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
  if (code && !SYNC_CODE_RE.test(code)) return c.json({ error: "invalid_code" }, 400);
  if (!code) code = genSyncCode();
  await kv.put(`sync:${code}`, JSON.stringify({ items, updatedAt: Date.now() }), { expirationTtl: SYNC_TTL });
  return c.json({ code });
});

app.get("/api/sync/:code", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "sync_unavailable" }, 503);
  const code = c.req.param("code").trim().toUpperCase();
  if (!SYNC_CODE_RE.test(code)) return c.json({ error: "not_found" }, 404);
  const snapshot = await kv.get(`sync:${code}`, "text");
  if (!snapshot) return c.json({ error: "not_found" }, 404);
  return new Response(snapshot, { headers: { "content-type": "application/json; charset=utf-8" } });
});

// 清单复查：指定域名重新核验（refresh=1 穿透缓存），NDJSON 流式返回
app.post("/api/check", async (c) => {
  const body = await c.req.json<{ domains?: string[]; refresh?: boolean }>().catch(() => null);
  const domains = [...new Set((body?.domains ?? []).map((d) => String(d).trim().toLowerCase()).filter((d) => DOMAIN_RE.test(d)))].slice(0, MAX_RECHECK_DOMAINS);
  if (domains.length === 0) return c.json({ error: "domains required" }, 400);
  const refresh = body?.refresh === true || c.req.query("refresh") === "1";

  const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(c.env.CACHE, ip))) {
    return c.json({ error: "rate_limited", message: `请求太频繁：每小时最多 ${RATE_LIMIT_PER_HOUR} 次，休息一会儿再来吧` }, 429);
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  c.executionCtx.waitUntil(
    (async () => {
      try {
        await checkDomainsCached(c.env.CACHE, domains, async (r) => {
          await writer.write(encoder.encode(JSON.stringify(r) + "\n"));
        }, refresh);
      } finally {
        await writer.close();
      }
    })(),
  );
  return new Response(readable, { headers: { "content-type": "application/x-ndjson; charset=utf-8" } });
});

app.get("/api/prices", async (c) => {
  const payload = await loadPricesPayload(c.env.CACHE, PRICES_CACHE_CFG);
  // 彻底无数据也返回 200 + 空 prices（前端全部走 ≈ 静态参考价），不再 502
  if (!payload) {
    return new Response(JSON.stringify({ prices: {}, currency: "USD", usdToCny: USD_TO_CNY, fetchedAt: null, stale: true }), {
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  }
  return new Response(payload, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=600" } });
});

/* ---------- MCP server（Streamable HTTP，无状态） ---------- */

const MCP_PROTOCOL_VERSION = "2025-03-26";

/** taken 域到期预警窗口：≤ 90 天视为 expiringSoon */
const EXPIRING_SOON_MS = 90 * 24 * 3600 * 1000;

const MCP_TOOLS = [
  {
    name: "check_domains",
    description:
      "Check real-time registration availability for up to 50 exact domains (e.g. acme.com). Returns status per domain: available / taken / unknown. Taken domains also include expiresAt (registration expiry, ISO 8601, omitted when unknown) and expiringSoon (true when expiring within 90 days — worth watching for a drop-catch). Uses live RDAP/WHOIS/DNS checks with short-lived caching.",
    inputSchema: {
      type: "object",
      properties: {
        domains: { type: "array", items: { type: "string" }, description: "Full domain names like acme.com (max 50)" },
      },
      required: ["domains"],
    },
    outputSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              domain: { type: "string" },
              status: { type: "string", enum: ["available", "taken", "unknown"] },
              expiresAt: { type: "string", description: "Registration expiry (ISO 8601); only for taken domains when known" },
              expiringSoon: { type: "boolean", description: "true when the taken domain expires within 90 days" },
            },
            required: ["domain", "status"],
          },
        },
      },
      required: ["results"],
    },
  },
  {
    name: "tld_prices",
    description:
      "Get first-year registration and renewal prices (USD, from Porkbun public pricing) for the popular TLDs DomainHunter tracks. TLDs without a live quote (e.g. cn/so) fall back to a static reference price marked approx:true. Useful to flag renewal traps (renewal much higher than first year).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "suggest_variants",
    description:
      "Given a name whose exact domain is taken, generate prefix/suffix variants (get/my/try/use + name, name + app/hq/labs/hub — the same rules as the site's variant check) and bulk-check their live availability. Returns [{domain, status, firstYearPriceUSD?}] with available domains first. No AI calls involved.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Base name (bare label without TLD), e.g. acme" },
        tlds: { type: "array", items: { type: "string" }, description: `TLDs to check, each must be one of the ${TLD_LIST.length} tracked TLDs (default [\"com\"])` },
        limit: { type: "number", description: "Max variants to check (default 24, cap 48)" },
      },
      required: ["name"],
    },
  },
] as const;

function mcpResult(id: unknown, result: unknown): Response {
  return Response.json({ jsonrpc: "2.0", id, result });
}

function mcpError(id: unknown, code: number, message: string): Response {
  return Response.json({ jsonrpc: "2.0", id, error: { code, message } });
}

function mcpText(id: unknown, text: string, isError = false): Response {
  return mcpResult(id, { content: [{ type: "text", text }], isError });
}

/** 声明了 outputSchema 的工具必须同时返回 structuredContent（严格 MCP 客户端如 python SDK 会校验） */
function mcpStructured(id: unknown, structured: Record<string, unknown>): Response {
  return mcpResult(id, { content: [{ type: "text", text: JSON.stringify(structured) }], structuredContent: structured, isError: false });
}

app.post("/mcp", async (c) => {
  const body = (await c.req.json().catch(() => null)) as { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> } | null;
  if (!body || body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return mcpError(null, -32600, "invalid JSON-RPC 2.0 request");
  }
  const { id, method, params } = body;
  // 通知（无 id）：直接 202 确认
  if (id === undefined || id === null) return new Response(null, { status: 202 });

  if (method === "initialize") {
    return mcpResult(id, {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: "domainhunter", version: "1.0.0" },
      instructions:
        "DomainHunter MCP: check exact-domain availability in bulk (check_domains), fetch live TLD registration/renewal prices (tld_prices), and suggest+check prefix/suffix variants when a name is taken (suggest_variants). For AI-powered name hunting from a meaning description, use https://hunt.zalize.com directly.",
    });
  }
  if (method === "ping") return mcpResult(id, {});
  if (method === "tools/list") return mcpResult(id, { tools: MCP_TOOLS });
  if (method !== "tools/call") return mcpError(id, -32601, `method not found: ${method}`);

  const toolName = String(params?.name ?? "");
  const args = (params?.arguments ?? {}) as Record<string, unknown>;

  if (toolName === "tld_prices") {
    const payload = await loadPricesPayload(c.env.CACHE, PRICES_CACHE_CFG);
    if (!payload) return mcpText(id, "pricing upstream unavailable, try again later", true);
    // Porkbun 无报价的后缀（如 cn/so）用静态参考价补齐，带 approx 标记，保证覆盖全部追踪后缀
    const parsed = JSON.parse(payload) as { prices: Record<string, PriceEntry>; stale?: boolean } & Record<string, unknown>;
    const liveCount = Object.keys(parsed.prices).length;
    for (const tld of TLD_LIST) {
      if (parsed.prices[tld]) continue;
      const ref = tldPrice(tld);
      if (ref) parsed.prices[tld] = { registration: Math.round((ref.first / USD_TO_CNY) * 100) / 100, renewal: Math.round((ref.renew / USD_TO_CNY) * 100) / 100, approx: true };
    }
    // 元数据与实际返回条目对齐：tldCount = 补齐后总条数；liveCount/staticCount 区分实时价与静态参考价；stale 仅指 live 部分来自兜底快照
    const total = Object.keys(parsed.prices).length;
    parsed.tldCount = total;
    parsed.liveCount = liveCount;
    parsed.staticCount = total - liveCount;
    if (parsed.stale) parsed.staleNote = "live prices come from the last cached upstream snapshot; entries marked approx:true are static reference prices";
    return mcpText(id, JSON.stringify(parsed));
  }

  if (toolName === "check_domains") {
    const domains = [
      ...new Set(
        (Array.isArray(args.domains) ? args.domains : [])
          .filter((d): d is string => typeof d === "string")
          .map((d) => d.trim().toLowerCase())
          .filter((d) => DOMAIN_RE.test(d) && d.length <= 253),
      ),
    ].slice(0, 50);
    if (domains.length === 0) return mcpText(id, "no valid domains given: pass full domain names like acme.com", true);
    const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!(await checkRateLimit(c.env.CACHE, ip))) {
      return mcpText(id, `rate limited: max ${RATE_LIMIT_PER_HOUR} requests per hour, try again later`, true);
    }
    const results: { domain: string; status: string; expiresAt?: string; expiringSoon?: boolean }[] = [];
    await checkDomainsCached(c.env.CACHE, domains, async (r) => {
      const item: { domain: string; status: string; expiresAt?: string; expiringSoon?: boolean } = { domain: r.domain, status: r.status };
      if (r.status === "taken" && r.expiresAt) {
        item.expiresAt = r.expiresAt;
        const ts = Date.parse(r.expiresAt);
        if (Number.isFinite(ts)) item.expiringSoon = ts - Date.now() <= EXPIRING_SOON_MS;
      }
      results.push(item);
    });
    return mcpStructured(id, { results });
  }

  if (toolName === "suggest_variants") {
    const name = normalizeLabel(String(args.name ?? ""));
    if (!name || name.length < 2) return mcpText(id, "invalid name: pass a bare label of 2+ chars like acme (no TLD)", true);
    const rawTlds = Array.isArray(args.tlds) && args.tlds.length > 0 ? args.tlds : ["com"];
    const tlds: string[] = [];
    for (const raw of rawTlds) {
      const t = String(raw).trim().toLowerCase().replace(/^\./, "");
      if (!(TLD_LIST as readonly string[]).includes(t)) {
        return mcpText(id, `invalid tld: "${t}" — must be one of: ${TLD_LIST.join(", ")}`, true);
      }
      if (!tlds.includes(t)) tlds.push(t);
    }
    const rawLimit = Number(args.limit ?? 24);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.floor(rawLimit), 1), 48) : 24;
    const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!(await checkRateLimit(c.env.CACHE, ip))) {
      return mcpText(id, `rate limited: max ${RATE_LIMIT_PER_HOUR} requests per hour, try again later`, true);
    }
    // 与首页「变体核验」同一套规则：前后缀组合，去掉裸 root（调用方通常已核验过）
    const bare = new Set(tlds.map((t) => `${name}.${t}`));
    const domains = generateCandidates({ roots: [name], prefixes: VARIANT_PREFIXES, suffixes: VARIANT_SUFFIXES, tlds, maxCandidates: 200 })
      .filter((d) => !bare.has(d))
      .slice(0, limit);
    if (domains.length === 0) return mcpText(id, "no variants could be generated for this name", true);
    // 首年注册价（美元）：实时价优先，静态参考价兜底（与 tld_prices 同口径）
    const priceByTld: Record<string, number> = {};
    try {
      const payload = await loadPricesPayload(c.env.CACHE, PRICES_CACHE_CFG);
      if (payload) {
        const parsed = JSON.parse(payload) as { prices: Record<string, PriceEntry> };
        for (const t of tlds) if (parsed.prices[t]) priceByTld[t] = parsed.prices[t].registration;
      }
    } catch { /* 查价失败不影响核验结果 */ }
    for (const t of tlds) {
      if (priceByTld[t] !== undefined) continue;
      const ref = tldPrice(t);
      if (ref) priceByTld[t] = Math.round((ref.first / USD_TO_CNY) * 100) / 100;
    }
    const results: { domain: string; status: string; firstYearPriceUSD?: number }[] = [];
    await checkDomainsCached(c.env.CACHE, domains, async (r) => {
      const item: { domain: string; status: string; firstYearPriceUSD?: number } = { domain: r.domain, status: r.status };
      if (r.status === "available") {
        const price = priceByTld[r.domain.slice(r.domain.indexOf(".") + 1)];
        if (price !== undefined) item.firstYearPriceUSD = price;
      }
      results.push(item);
    });
    const rank = (s: string) => (s === "available" ? 0 : s === "taken" ? 1 : 2);
    results.sort((a, b) => rank(a.status) - rank(b.status));
    return mcpText(id, JSON.stringify({ results }));
  }

  return mcpError(id, -32602, `unknown tool: ${toolName}`);
});

// GET /mcp：MCP 客户端的 SSE 请求（Accept: text/event-stream）仍回 405（无状态不支持长连接）；浏览器访问返回双语接入文档页
// 文案与 mcp-page.tsx 的 COPY[lang].title/intro 逐字同源（骨架/水合一致，无跳变）
const MCP_META = {
  zh: {
    title: "把域名核验接进你的 AI 助手",
    desc: "DomainHunter 提供免费、无需鉴权的 MCP（Model Context Protocol）server。把它加进 Claude、Cursor 等支持 MCP 的 AI 工具后，AI 就能在对话里直接批量核验域名是否可注册、查询各后缀的实时注册/续费价。",
  },
  en: {
    title: "Plug domain checking into your AI assistant",
    desc: "DomainHunter ships a free, no-auth MCP (Model Context Protocol) server. Add it to Claude, Cursor or any MCP-capable AI tool and your assistant can bulk-check domain availability and look up live TLD prices right inside the conversation.",
  },
};

app.get("/mcp", async (c) => {
  if ((c.req.header("accept") ?? "").includes("text/event-stream")) {
    return new Response("method not allowed: POST JSON-RPC 2.0 (MCP Streamable HTTP, stateless)", { status: 405, headers: { allow: "POST" } });
  }
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
  const loc = MCP_META[lang];
  const title = escapeHtml(`${loc.title} | DomainHunter`);
  const desc = escapeHtml(loc.desc);
  let html = await res.text();
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}/mcp" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE_ORIGIN}/mcp" />`)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${SITE_ORIGIN}/api/og/mcp?lang=${lang}" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
    );
  html = injectHreflang(html, "/mcp", c.req.query("lang") === "en").replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, "/mcp", lang)}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/mcp-page.tsx");
  html = await inlineStylesheet(html, c.env.ASSETS, c.req.url);
  html = injectSsrSkeleton(html, "MCP Server", loc.title, [ssrIntroBlock(loc.desc)]);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 信任数据：累计核验域名数
app.get("/api/stats", async (c) => {
  let totalChecked = 0;
  try {
    totalChecked = Number((await c.env.CACHE?.get(STATS_KEY)) ?? "0");
  } catch { /* KV 不可用时返回 0 */ }
  return c.json({ totalChecked }, 200, { "cache-control": "public, max-age=60" });
});

// R480：注册商公开返佣配置（wrangler var REGISTRAR_AFFILIATE_JSON；非法/缺省 → {}，前端即纯搜索链接）
app.get("/api/registrars", (c) => {
  const affiliate = parseAffiliateJson(c.env.REGISTRAR_AFFILIATE_JSON);
  // 5 分钟浏览器缓存：改 wrangler var 重新部署后返佣开关最多滞后 5 分钟，同时避免每次导航都打 Worker
  return c.json({ affiliate }, 200, { "cache-control": "public, max-age=300" });
});

const CLICK_TLD_RE = /^[a-z0-9-]{1,24}(\.[a-z0-9-]{1,24})?$/;

// R480：注册商外链点击计数。请求体 {registrar, tld}；只接受已知注册商 id 与形如 com / com.cn 的 TLD；
// 不记录域名、IP 或任何个人信息，仅按日聚合到 usage:YYYY-MM-DD.outbound / outboundByTld
app.post("/api/click", async (c) => {
  let body: { registrar?: unknown; tld?: unknown } | null = null;
  try {
    body = (await c.req.json()) as { registrar?: unknown; tld?: unknown };
  } catch {
    return c.json({ error: "invalid json" }, 400);
  }
  const registrar = body?.registrar;
  const tld = typeof body?.tld === "string" ? body.tld.toLowerCase().replace(/^\./, "") : "";
  if (!isRegistrarId(registrar) || !CLICK_TLD_RE.test(tld)) return c.json({ error: "invalid click" }, 400);
  c.executionCtx.waitUntil(bumpOutbound(c.env.CACHE, registrar, tld));
  return c.body(null, 204, { "cache-control": "no-store" });
});

// 运营数据：最近 N 天的聚合使用量（仅计数，无任何用户输入/IP）
app.get("/api/usage", async (c) => {
  const days = Math.min(Math.max(Number(c.req.query("days") ?? "14"), 1), 45);
  const kv = c.env.CACHE;
  const out: Record<string, DayUsage & Partial<DayPageviews>> = {};
  if (kv) {
    const dates = Array.from({ length: days }, (_, i) => new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10));
    await Promise.all(
      dates.map(async (d) => {
        // usage:*（搜索漏斗）与 pv:*（HTML 文档计数，R481；按 isolate 分片、读时求和，R482）分键存储、此处合并输出
        const [u, pv] = await Promise.all([
          kv.get<DayUsage>(`usage:${d}`, "json").catch(() => null),
          readDayPageviews(kv, d),
        ]);
        if (u || pv) out[d] = { ...(u ?? { searches: 0, byTld: {}, fast: 0, refine: 0 }), ...(pv ?? {}) };
      }),
    );
  }
  let cronLast: number | null = null;
  let indexnowLast: number | null = null;
  let indexnowLastError: IndexNowError | null = null;
  let pricesLastOk: number | null = null;
  let pricesLastFail: number | null = null;
  try {
    const [cl, il, ie, po, pf] = await Promise.all([
      kv?.get("cron:last"),
      kv?.get(INDEXNOW_LAST_KEY),
      kv?.get<IndexNowError>(INDEXNOW_LAST_ERROR_KEY, "json"),
      kv?.get(PRICES_LAST_OK_KEY),
      kv?.get(PRICES_LAST_FAIL_KEY),
    ]);
    cronLast = cl ? Number(cl) : null;
    indexnowLast = il ? Number(il) : null;
    indexnowLastError = ie ?? null;
    pricesLastOk = po ? Number(po) : null;
    pricesLastFail = pf ? Number(pf) : null;
  } catch { /* 读失败返回 null */ }
  return c.json({ days: out, cronLast, indexnowLast, indexnowLastError, pricesLastOk, pricesLastFail }, 200, { "cache-control": "public, max-age=300" });
});

// SPA 分享页路由：回 index.html + SSR 注入动态 og:image（SVG 不被支持的平台回退到紧随其后的静态 og.png）
app.get("/s/:id", async (c) => {
  const id = c.req.param("id");
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  if (!/^[\w-]{1,32}$/.test(id)) return res;
  let html = await res.text();
  const pageUrl = `${SITE_ORIGIN}/s/${id}`;
  html = html
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${pageUrl}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${pageUrl}" />`)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${SITE_ORIGIN}/api/og/${id}" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
    );
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
});

// 候选清单页：客户端路由，直链/刷新时回 SPA 壳（个人数据页，noindex）
app.get("/shortlist", async (c) => {
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  let html = await res.text();
  html = html
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}/shortlist" />`)
    .replace("</head>", '<meta name="robots" content="noindex" /></head>');
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
});

// 监控管理页：客户端路由，直链/刷新时回 SPA 壳（个人数据页，noindex）
app.get("/monitors", async (c) => {
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  let html = await res.text();
  html = html
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}/monitors" />`)
    .replace("</head>", '<meta name="robots" content="noindex" /></head>');
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
});

// 高级模式（批量粘贴核验）：客户端路由，直链/刷新时回 SPA 壳 + SSR meta
const ADVANCED_META = {
  zh: {
    title: "批量域名核验：粘贴名单一键实时查可注册",
    desc: "把现成域名名单（裸名/完整域名/带链接混排，最多 200 个）粘进来，一键流式核验可注册状态（RDAP+DNS 实时），免登录免费。",
  },
  en: {
    title: "Bulk domain check: paste a list, verify availability live",
    desc: "Paste up to 200 names (bare names, full domains or URLs mixed) and stream live availability checks (RDAP+DNS). Free, no login.",
  },
};

app.get("/advanced", async (c) => {
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
  const loc = ADVANCED_META[lang];
  const title = escapeHtml(`${loc.title} | DomainHunter`);
  const desc = escapeHtml(loc.desc);
  let html = await res.text();
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}/advanced" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE_ORIGIN}/advanced" />`)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${SITE_ORIGIN}/api/og/advanced?lang=${lang}" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
    );
  html = injectHreflang(html, "/advanced", c.req.query("lang") === "en");
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/advanced-page.tsx", "full");
  html = await inlineStylesheet(html, c.env.ASSETS, c.req.url);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 动态分享图：清单前 3 个域名 + 数量，品牌绿主题（SVG，1200×630）
// 价格总览页分享图（须注册在 /api/og/:id 之前，否则被其当作分享 id）
app.get("/api/og/prices", (c) => {
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  return new Response(pageOgSvg(lang === "en" ? "Pricing" : "域名价格", PRICES_META[lang].title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

// MCP 接入页分享图（须在 /api/og/:id 之前注册）
app.get("/api/og/mcp", (c) => {
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  const title = lang === "en" ? "Domain checks inside your AI tools" : "把域名核验接进你的 AI 助手";
  return new Response(pageOgSvg("MCP Server", title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

// 高级模式（批量核验）分享图（须在 /api/og/:id 之前注册）
app.get("/api/og/advanced", (c) => {
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  const title = lang === "en" ? "Paste a list, verify availability live" : "粘贴名单，一键实时查可注册";
  return new Response(pageOgSvg(lang === "en" ? "Bulk check" : "批量核验", title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

// 内容枢纽 hub 页分享图（/tld /guide /vs 索引页；路径多一级，不会被 /api/og/:id 误匹配）
app.get("/api/og/hub/:kind", (c) => {
  const kind = c.req.param("kind") as "tld" | "guide" | "vs";
  if (!(kind in HUB_META)) return c.notFound();
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  const meta = HUB_META[kind][lang];
  return new Response(pageOgSvg(meta.kicker, meta.title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

// 产品定位页分享图（须在 /api/og/:id 之前注册）
app.get("/api/og/why", (c) => {
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  const title = lang === "en" ? "A domain hunter for Chinese founders" : "中文创业者的域名猎手";
  return new Response(pageOgSvg(lang === "en" ? "Why us" : "产品定位", title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

// 首页分享图（静态 og.png 为中文，英文首页用动态 SVG，平台不支持 SVG 时回退 og.png；须在 /api/og/:id 之前注册）
app.get("/api/og/home", (c) => {
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  const title = lang === "en" ? "Bilingual naming, verified .cn / .com availability" : "用中文说寓意，猎到真正可注册的 .cn / .com 好域名";
  return new Response(pageOgSvg("DomainHunter", title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

app.get("/api/og/:id", async (c) => {
  const kv = c.env.CACHE;
  const id = c.req.param("id");
  if (!kv || !/^[\w-]{1,32}$/.test(id)) return c.notFound();
  const snapshot = await kv.get<{ items: ShareItem[] }>(`share:${id}`, "json");
  if (!snapshot || !Array.isArray(snapshot.items) || snapshot.items.length === 0) return c.notFound();
  const items = snapshot.items.slice(0, 3);
  const total = snapshot.items.length;
  const rows = items
    .map((it, i) => {
      const y = 268 + i * 84;
      return `
    <g>
      <rect x="80" y="${y - 46}" width="1040" height="66" rx="14" fill="#12261b" stroke="#1f4630" stroke-width="1.5"/>
      <text x="112" y="${y}" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="34" font-weight="700" fill="#e8f5ee">${escapeHtml(it.label)}<tspan fill="#69a884">.${escapeHtml(it.tld)}</tspan></text>
      <circle cx="1064" cy="${y - 12}" r="7" fill="#3ecf8e"/>
    </g>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b1610"/>
  <circle cx="1050" cy="-60" r="420" fill="#3ecf8e" opacity="0.08"/>
  <circle cx="90" cy="660" r="320" fill="#3ecf8e" opacity="0.06"/>
  <text x="80" y="110" font-family="'Inter',system-ui,sans-serif" font-size="30" font-weight="800" fill="#3ecf8e">DomainHunter</text>
  <text x="80" y="178" font-family="'Inter',system-ui,sans-serif" font-size="46" font-weight="800" fill="#f2faf6">候选域名清单 · ${total} 个</text>
  ${rows}
  <text x="80" y="570" font-family="'Inter',system-ui,sans-serif" font-size="26" fill="#69a884">AI 批量构思 · RDAP+DNS 实时核验 · hunt.zalize.com</text>
</svg>`;
  return new Response(svg, {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
});

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 标题按宽度折行（中文按 2 单位/字、英文按词），最多两行，超出加省略号 */
function wrapTitle(s: string, maxUnits: number): string[] {
  const width = (t: string) => [...t].reduce((n, ch) => n + (ch.charCodeAt(0) > 0x2e7f ? 2 : 1), 0);
  if (width(s) <= maxUnits) return [s];
  const words = /\s/.test(s.trim()) ? s.split(/\s+/) : [...s];
  const sep = /\s/.test(s.trim()) ? " " : "";
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? cur + sep + w : w;
    if (width(next) > maxUnits && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length === 2) break;
    } else cur = next;
  }
  if (lines.length < 2 && cur) lines.push(cur);
  if (lines.length === 2 && width(lines[1]) > maxUnits) {
    let t = lines[1];
    while (width(t) > maxUnits - 1) t = [...t].slice(0, -1).join("");
    lines[1] = t + "…";
  }
  return lines.slice(0, 2);
}

/** SEO 页动态分享图：kicker 徽章 + 折行标题，品牌绿主题（SVG，1200×630） */
function pageOgSvg(kicker: string, title: string, lang: "zh" | "en"): string {
  const lines = wrapTitle(title, 38);
  const rows = lines
    .map((line, i) => `<text x="80" y="${330 + i * 76}" font-family="'Inter',system-ui,sans-serif" font-size="52" font-weight="800" fill="#f2faf6">${escapeHtml(line)}</text>`)
    .join("\n  ");
  const tagline = lang === "en" ? "AI naming · live RDAP+DNS checks · hunt.zalize.com" : "AI 批量构思 · RDAP+DNS 实时核验 · hunt.zalize.com";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b1610"/>
  <circle cx="1050" cy="-60" r="420" fill="#3ecf8e" opacity="0.08"/>
  <circle cx="90" cy="660" r="320" fill="#3ecf8e" opacity="0.06"/>
  <text x="80" y="110" font-family="'Inter',system-ui,sans-serif" font-size="30" font-weight="800" fill="#3ecf8e">DomainHunter</text>
  <g>
    <rect x="80" y="170" width="${64 + [...kicker].reduce((n, ch) => n + (ch.charCodeAt(0) > 0x2e7f ? 34 : 20), 0)}" height="58" rx="14" fill="#12261b" stroke="#1f4630" stroke-width="1.5"/>
    <text x="112" y="209" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="32" font-weight="700" fill="#3ecf8e">${escapeHtml(kicker)}</text>
  </g>
  ${rows}
  <text x="80" y="570" font-family="'Inter',system-ui,sans-serif" font-size="26" fill="#69a884">${tagline}</text>
</svg>`;
}

/** hreflang alternate 标签：zh / en / x-default（zh 为默认，URL 与 canonical 规则一致：zh/x-default 指裸路径，en 指 ?lang=en） */
function hreflangTags(path: string): string {
  const base = `${SITE_ORIGIN}${path}`;
  return [
    `<link rel="alternate" hreflang="zh" href="${base}" />`,
    `<link rel="alternate" hreflang="en" href="${base}?lang=en" />`,
    `<link rel="alternate" hreflang="x-default" href="${base}" />`,
  ].join("\n    ");
}

const injectHreflang = (html: string, path: string, explicitEn = false) => {
  // 显式 ?lang=en 访问时 canonical 自指英文版，与 hreflang alternate 一致（仅认 query，不认 Accept-Language）
  if (explicitEn) html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}${path}?lang=en" />`);
  return html.replace(/(<link rel="canonical"[^>]*\/>)/, `$1\n    ${hreflangTags(path)}`);
};

/** 内容页数据随 HTML 注入（window.__DH_CONTENT__）：客户端不再下载全量内容 chunk（见 content/injected.ts） */
function injectContentData(html: string, payload: InjectedContent | null): string {
  if (!payload) return html;
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return html.replace("</head>", `<script>window.__DH_CONTENT__=${json}</script></head>`);
}

/** SEO 页 SSR 首屏骨架：把 kicker/标题/首段直接渲染进 #root，LCP 文本不再等 JS 水合（React 挂载后整体替换） */
function injectSsrSkeleton(html: string, kicker: string, title: string, blocks: string[], kickerHtml?: string, mainWidth = "max-w-3xl"): string {
  const skeleton = [
    `<div class="flex min-h-screen flex-col">`,
    `<header class="sticky top-0 z-20 border-b border-line bg-bg0/85"><div class="mx-auto flex h-14 max-w-7xl items-center px-4 md:px-6"><span class="flex items-center gap-2 font-bold tracking-tight"><span class="grid h-7 w-7 place-items-center rounded-lg border border-brand-line bg-brand-dim"></span><span class="max-[430px]:hidden">DomainHunter</span></span></div></header>`,
    `<main class="mx-auto w-full ${mainWidth} flex-1 px-4 pb-16 pt-10 md:px-6">`,
    kickerHtml ?? `<p class="font-mono text-sm text-brand">${escapeHtml(kicker)}</p>`,
    `<h1 class="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">${escapeHtml(title)}</h1>`,
    ...blocks,
    `</main></div>`,
  ].join("");
  return html.replace('<div id="root"></div>', `<div id="root">${skeleton}</div>`);
}

const ssrIntroBlock = (intro: string) => `<p class="mt-6 text-[15px] leading-relaxed text-txt1">${escapeHtml(intro)}</p>`;

/** 主样式表内容（hashed 文件名 → CSS 文本），模块级缓存 */
const inlineCssCache = new Map<string, string>();

/** 把唯一的 render-blocking 样式表内联进 HTML：省掉一次关键路径请求（CSS 在 <style> 里首绘前即生效，无 FOUC） */
async function inlineStylesheet(html: string, assets: Fetcher, origin: string): Promise<string> {
  const m = html.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/);
  if (!m) return html;
  const href = m[1];
  let css = inlineCssCache.get(href);
  if (css === undefined) {
    try {
      const res = await assets.fetch(new Request(new URL(href, origin)));
      if (!res.ok) return html;
      css = await res.text();
      inlineCssCache.set(href, css);
    } catch {
      return html;
    }
  }
  return html.replace(m[0], `<style>${css}</style>`);
}

/** Vite manifest（构建产物 hashed 文件名映射），模块级缓存 */
type ViteManifestChunk = { file: string; imports?: string[] };
let viteManifest: Record<string, ViteManifestChunk> | null = null;

/** 资产字节大小（file → bytes），模块级缓存 */
const assetSizeCache = new Map<string, number>();

async function assetSize(file: string, assets: Fetcher, origin: string): Promise<number> {
  const cached = assetSizeCache.get(file);
  if (cached !== undefined) return cached;
  try {
    const res = await assets.fetch(new Request(new URL(`/${file}`, origin)));
    const size = res.ok ? (await res.arrayBuffer()).byteLength : 0;
    assetSizeCache.set(file, size);
    return size;
  } catch {
    return 0;
  }
}

/** 超过该体积的共享数据 chunk（如全量 TLD/行业指南文案）不做 modulepreload：
 *  正文已全文 SSR，这些数据只在水合时才需要；提前抢占带宽会显著推迟移动端 LCP。 */
const MODULEPRELOAD_MAX_BYTES = 110_000;

/** SSR 注入懒加载路由 chunk 的 modulepreload，让页面 JS 与主 bundle 并行下载。
 *  depth="entry"（内容页默认）只预载路由入口 chunk：正文已全文 SSR，水合非关键路径，
 *  预载整棵 import 树（十几个小 chunk）会在移动端与 HTML/字体抢带宽、推迟 FCP/LCP；
 *  depth="full"（首页/advanced 等应用页）预载整棵树，首次渲染依赖这些 chunk。 */
async function injectModulepreload(html: string, assets: Fetcher, origin: string, entry: string, depth: "entry" | "full" = "entry"): Promise<string> {
  try {
    if (!viteManifest) {
      const res = await assets.fetch(new Request(new URL("/manifest.json", origin)));
      if (!res.ok) return html;
      viteManifest = (await res.json()) as Record<string, ViteManifestChunk>;
    }
    const files: string[] = [];
    const walk = (key: string) => {
      const chunk = viteManifest?.[key];
      if (!chunk || key === "index.html" || files.includes(chunk.file)) return;
      files.push(chunk.file);
      for (const dep of chunk.imports ?? []) walk(dep);
    };
    walk(entry);
    const candidates = depth === "entry" ? files.slice(0, 1) : files;
    const sizes = await Promise.all(candidates.map((f) => assetSize(f, assets, origin)));
    const preloadable = candidates.filter((_, i) => sizes[i] <= MODULEPRELOAD_MAX_BYTES);
    if (preloadable.length === 0) return html;
    const links = preloadable.map((f) => `<link rel="modulepreload" href="/${f}" />`).join("\n    ");
    return html.replace("</head>", `${links}\n  </head>`);
  } catch {
    return html;
  }
}

/** SSR 按解析出的语言设置 <html lang> 与 og:locale（SPA 水合后会再同步，这里保证首屏/爬虫看到的语言正确） */
const setHtmlLang = (html: string, lang: "zh" | "en"): string =>
  lang === "en"
    ? html
        .replace(/<html lang="[^"]*"/, '<html lang="en"')
        .replace(/<meta property="og:locale" content="[^"]*"/, '<meta property="og:locale" content="en_US"')
    : html;

/** 未知 slug 的 SEO 路由：返回应用壳 + 404 状态 + noindex，避免软 404 被收录 */
async function notFoundShell(res: Response): Promise<Response> {
  const html = (await res.text()).replace("</head>", `<meta name="robots" content="noindex" /></head>`);
  return new Response(html, { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
}

// 着陆页：SSR 注入 hreflang alternate
// 首页 FAQPage 结构化数据：与首页 FAQ 区块同源（content/home-copy.ts），供搜索引擎富摘要

const homeFaqJsonld = (lang: "zh" | "en") =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ[lang].map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  });

/** BreadcrumbList 结构化数据：首页 →（可选 hub）→ 当前页，供搜索结果面包屑展示 */
const breadcrumbJsonld = (name: string, path: string, lang: "zh" | "en", hub?: { name: string; path: string }) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "首页", item: SITE_ORIGIN },
      ...(hub ? [{ "@type": "ListItem", position: 2, name: hub.name, item: `${SITE_ORIGIN}${hub.path}` }] : []),
      { "@type": "ListItem", position: hub ? 3 : 2, name, item: `${SITE_ORIGIN}${path}` },
    ],
  });

/** Article 结构化数据：指南/对比类内容页的富摘要资格（headline/description/inLanguage/image） */
const articleJsonld = (title: string, description: string, path: string, lang: "zh" | "en", image: string) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: lang === "en" ? "en" : "zh-CN",
    image: `${SITE_ORIGIN}${image}`,
    mainEntityOfPage: `${SITE_ORIGIN}${path}`,
    author: { "@type": "Organization", name: "DomainHunter", url: SITE_ORIGIN },
    publisher: {
      "@type": "Organization",
      name: "DomainHunter",
      url: SITE_ORIGIN,
      logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/logo.png`, width: 512, height: 512 },
    },
  });

// 首页 WebSite + SearchAction 结构化数据：/?q= 可直接预填搜索，符合 sitelinks searchbox 语义
const WEBSITE_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DomainHunter",
  url: SITE_ORIGIN,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_ORIGIN}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

// SEO 页动态分享图：/api/og/tld/:tld 与 /api/og/guide/:slug（lang 参数控制语言）
app.get("/api/og/tld/:tld", (c) => {
  const tld = c.req.param("tld").toLowerCase();
  const guide = TLD_GUIDES[tld];
  if (!guide) return c.notFound();
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  return new Response(pageOgSvg(`.${tld}`, guide[lang].title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

app.get("/api/og/guide/:slug", (c) => {
  const slug = c.req.param("slug").toLowerCase();
  const guide = INDUSTRY_GUIDES[slug];
  if (!guide) return c.notFound();
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  return new Response(pageOgSvg(guide[lang].label, guide[lang].title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

app.get("/api/og/vs/:slug", (c) => {
  const slug = c.req.param("slug").toLowerCase();
  const cmp = TLD_COMPARES[slug];
  if (!cmp) return c.notFound();
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  return new Response(pageOgSvg(`.${cmp.a} vs .${cmp.b}`, cmp[lang].title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});


app.get("/", async (c) => {
  const res = await c.env.ASSETS.fetch(c.req.raw);
  const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
  let html = await res.text();
  const m = HOME_META[lang];
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(m.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(m.desc)}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(m.ogTitle)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(m.ogDesc)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(m.ogTitle)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(m.ogDesc)}" />`);
  if (lang === "en") {
    html = html.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${SITE_ORIGIN}/api/og/home?lang=en" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
    );
  }
  html = homeHeroSkeleton(html, lang);
  html = injectHreflang(html, "/", c.req.query("lang") === "en").replace("</head>", `<script type="application/ld+json">${homeFaqJsonld(lang)}</script><script type="application/ld+json">${WEBSITE_JSONLD}</script></head>`);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/home-page.tsx", "full");
  html = setHtmlLang(html, lang);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// TLD 指南页（SPA 路由 + SSR meta）：回 index.html 并按 TLD 与语言替换 title/description
app.get("/tld/:tld", async (c) => {
  const tld = c.req.param("tld").toLowerCase();
  const guide = TLD_GUIDES[tld];
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  if (!guide) return notFoundShell(res);
  const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
  const loc = guide[lang];
  const title = escapeHtml(`${loc.title} | DomainHunter`);
  const desc = escapeHtml(loc.metaDescription);
  let html = await res.text();
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}/tld/${tld}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE_ORIGIN}/tld/${tld}" />`)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${SITE_ORIGIN}/api/og/tld/${tld}?lang=${lang}" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
    );
  const tldFaqJsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: buildTldFaq(tld, loc, lang).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
  html = injectHreflang(html, `/tld/${tld}`, c.req.query("lang") === "en").replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, `/tld/${tld}`, lang, { name: hubCrumbLabel("tld", lang), path: "/tld" })}</script><script type="application/ld+json">${tldFaqJsonld}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/tld-page.tsx");
  html = await inlineStylesheet(html, c.env.ASSETS, c.req.url);
  html = injectContentData(html, buildTldContent(tld));
  html = injectSsrSkeleton(html, `.${tld}`, loc.title, tldContentBlocks(tld, guide, lang), hubCrumbKicker("tld", `.${tld}`, lang));
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 行业命名指南页（SPA 路由 + SSR meta）：回 index.html 并按行业与语言替换 title/description
app.get("/guide/:slug", async (c) => {
  const slug = c.req.param("slug").toLowerCase();
  const guide = INDUSTRY_GUIDES[slug];
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  if (!guide) return notFoundShell(res);
  const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
  const loc = guide[lang];
  const title = escapeHtml(`${loc.title} | DomainHunter`);
  const desc = escapeHtml(loc.metaDescription);
  let html = await res.text();
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}/guide/${slug}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE_ORIGIN}/guide/${slug}" />`)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${SITE_ORIGIN}/api/og/guide/${slug}?lang=${lang}" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
    );
  const guideFaqJsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: buildGuideFaq(guide, lang).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
  html = injectHreflang(html, `/guide/${slug}`, c.req.query("lang") === "en").replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, `/guide/${slug}`, lang, { name: hubCrumbLabel("guide", lang), path: "/guide" })}</script><script type="application/ld+json">${articleJsonld(loc.title, loc.metaDescription, `/guide/${slug}`, lang, `/api/og/guide/${slug}?lang=${lang}`)}</script><script type="application/ld+json">${guideFaqJsonld}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/guide-page.tsx");
  html = await inlineStylesheet(html, c.env.ASSETS, c.req.url);
  html = injectContentData(html, buildGuideContent(slug));
  html = injectSsrSkeleton(html, guide[lang].label, loc.title, guideContentBlocks(guide, lang), hubCrumbKicker("guide", guide[lang].label, lang));
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// TLD 对比页（SPA 路由 + SSR meta）：回 index.html 并按对比对与语言替换 title/description
app.get("/vs/:slug", async (c) => {
  const slug = c.req.param("slug").toLowerCase();
  const cmp = TLD_COMPARES[slug];
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  if (!cmp) return notFoundShell(res);
  const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
  const loc = cmp[lang];
  const title = escapeHtml(`${loc.title} | DomainHunter`);
  const desc = escapeHtml(loc.metaDescription);
  let html = await res.text();
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}/vs/${slug}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE_ORIGIN}/vs/${slug}" />`)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${SITE_ORIGIN}/api/og/vs/${slug}?lang=${lang}" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
    );
  const cmpFaqJsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: buildCompareFaq(cmp, lang).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
  html = injectHreflang(html, `/vs/${slug}`, c.req.query("lang") === "en").replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, `/vs/${slug}`, lang, { name: hubCrumbLabel("vs", lang), path: "/vs" })}</script><script type="application/ld+json">${articleJsonld(loc.title, loc.metaDescription, `/vs/${slug}`, lang, `/api/og/vs/${slug}?lang=${lang}`)}</script><script type="application/ld+json">${cmpFaqJsonld}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/compare-page.tsx");
  html = await inlineStylesheet(html, c.env.ASSETS, c.req.url);
  html = injectContentData(html, buildVsContent(slug));
  html = injectSsrSkeleton(html, `.${cmp.a} vs .${cmp.b}`, loc.title, compareContentBlocks(cmp, lang), hubCrumbKicker("vs", `.${cmp.a} vs .${cmp.b}`, lang), "max-w-4xl");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 内容枢纽 hub 页（/tld /guide /vs 索引，SPA 路由 + SSR meta + 全文骨架）
const HUB_ENTRIES = {
  tld: { entry: "src/components/tld-hub-page.tsx", blocks: tldHubBlocks },
  guide: { entry: "src/components/guide-hub-page.tsx", blocks: guideHubBlocks },
  vs: { entry: "src/components/compare-hub-page.tsx", blocks: compareHubBlocks },
} as const;

const serveHub = (kind: "tld" | "guide" | "vs") =>
  async (c: { env: Bindings; req: { raw: Request; url: string; query: (k: string) => string | undefined; header: (k: string) => string | undefined } }) => {
    const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
    const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
    const meta = HUB_META[kind][lang];
    const title = escapeHtml(`${meta.title} | DomainHunter`);
    const desc = escapeHtml(meta.desc);
    const path = `/${kind}`;
    let html = await res.text();
    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`)
      .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
      .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
      .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}${path}" />`)
      .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE_ORIGIN}${path}" />`)
      .replace(
        /<meta property="og:image" content="[^"]*" \/>/,
        `<meta property="og:image" content="${SITE_ORIGIN}/api/og/hub/${kind}?lang=${lang}" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
      );
    html = injectHreflang(html, path, c.req.query("lang") === "en").replace(
      "</head>",
      `<script type="application/ld+json">${breadcrumbJsonld(meta.title, path, lang)}</script></head>`,
    );
    html = setHtmlLang(html, lang);
    html = await injectModulepreload(html, c.env.ASSETS, c.req.url, HUB_ENTRIES[kind].entry);
    html = await inlineStylesheet(html, c.env.ASSETS, c.req.url);
    html = injectSsrSkeleton(html, meta.kicker, meta.title, HUB_ENTRIES[kind].blocks(lang), undefined, "max-w-4xl");
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
  };

app.get("/tld", serveHub("tld"));
app.get("/guide", serveHub("guide"));
app.get("/vs", serveHub("vs"));

// 价格总览页（SPA 路由 + SSR meta）
// kicker/intro 与 i18n 词典 prices.kicker / prices.intro 逐字同源（骨架/水合一致，无跳变）
const PRICES_META = {
  zh: {
    title: `域名后缀价格总览：${TLD_LIST.length} 个主流 TLD 注册与续费对比`,
    desc: `汇总 com/cn/io/ai 等 ${TLD_LIST.length} 个主流后缀的注册与续费价（Porkbun 实时价），避开首年便宜续费贵的坑，并用 AI 直接猎取可注册的好名字。`,
    kicker: "域名价格",
    intro: `首年便宜不等于长期便宜——很多后缀续费是首年价的几倍。这里汇总 ${TLD_LIST.length} 个主流后缀的注册与续费价（Porkbun 实时价优先，无报价时显示 ≈ 静态参考价），点列头可排序，点后缀可看详细指南。`,
  },
  en: {
    title: `TLD Price Overview: Registration vs Renewal for ${TLD_LIST.length} Popular Suffixes`,
    desc: "Compare registration and renewal prices (live from Porkbun) for popular TLDs like com/cn/io/ai, avoid renewal traps, and hunt registrable names with AI.",
    kicker: "Domain Pricing",
    intro: `A cheap first year doesn't mean cheap forever — many suffixes renew at several times the promo price. This table compares registration and renewal for ${TLD_LIST.length} popular TLDs (live Porkbun prices first, ≈ static reference when unavailable). Click headers to sort, click a suffix for its full guide.`,
  },
};

// prices-page.tsx 里 lucide Tag 图标的等价 SVG（与 lucide-react v1.27 tag 图标同 path），骨架里保持 kicker 布局一致
const PRICES_KICKER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag h-4 w-4"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>';

app.get("/prices", async (c) => {
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
  const loc = PRICES_META[lang];
  const title = escapeHtml(`${loc.title} | DomainHunter`);
  const desc = escapeHtml(loc.desc);
  let html = await res.text();
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}/prices" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE_ORIGIN}/prices" />`)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${SITE_ORIGIN}/api/og/prices?lang=${lang}" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
    );
  const pricesFaqJsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: buildPricesFaq(lang).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
  html = injectHreflang(html, "/prices", c.req.query("lang") === "en").replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, "/prices", lang)}</script><script type="application/ld+json">${pricesFaqJsonld}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/prices-page.tsx");
  html = await inlineStylesheet(html, c.env.ASSETS, c.req.url);
  html = injectSsrSkeleton(
    html,
    loc.kicker,
    loc.title,
    [`<p class="mt-3 text-[15px] leading-relaxed text-txt1">${escapeHtml(loc.intro)}</p>`, pricesTableSkeleton(lang)],
    `<p class="flex items-center gap-1.5 font-mono text-sm text-brand">${PRICES_KICKER_SVG}${escapeHtml(loc.kicker)}</p>`,
  );
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 产品定位页（SPA 路由 + SSR meta）
const WHY_META = {
  zh: {
    title: "为什么选 DomainHunter：中文创业者的域名猎手",
    desc: `面向中文创业者、独立开发者与出海团队：用中文说寓意，AI 沿拼音/英文/混搭四路线构思，${TLD_LIST.length} TLD 实时核验（.cn / .com.cn 直查 CNNIC），附到期日与价格，支持批量核验、CSV 导出与到期监控。英文通用起名不是我们的主场，对比表如实标出。免费开源。`,
  },
  en: {
    title: "Why DomainHunter: a domain hunter for Chinese founders",
    desc: `Built for Chinese founders, indie developers and teams going global: describe the meaning in Chinese, AI brainstorms pinyin, English and blend candidates along four routes, verified live across ${TLD_LIST.length} TLDs (.cn / .com.cn against CNNIC), with expiry dates, prices, bulk checks, CSV export and expiry monitoring. Generic English naming isn't our home turf — the comparison table says so. Free and open source.`,
  },
};

app.get("/why", async (c) => {
  const res = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
  const loc = WHY_META[lang];
  const title = escapeHtml(`${loc.title} | DomainHunter`);
  const desc = escapeHtml(loc.desc);
  let html = await res.text();
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_ORIGIN}/why" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE_ORIGIN}/why" />`)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${SITE_ORIGIN}/api/og/why?lang=${lang}" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
    );
  html = injectHreflang(html, "/why", c.req.query("lang") === "en").replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, "/why", lang)}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/why-page.tsx");
  html = await inlineStylesheet(html, c.env.ASSETS, c.req.url);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 内容最后更新日期（sitemap <lastmod>）：每次内容页增减/改写时更新
const CONTENT_LASTMOD = "2026-08-10";

const sitemapPaths = () => ["/", "/prices", "/why", "/mcp", "/advanced", "/tld", "/guide", "/vs", ...TLD_LIST.map((t) => `/tld/${t}`), ...GUIDE_LIST.map((s) => `/guide/${s}`), ...COMPARE_LIST.map((s) => `/vs/${s}`)];

app.get("/sitemap.xml", (c) => {
  const paths = sitemapPaths();
  const alt = (p: string) =>
    [
      `    <xhtml:link rel="alternate" hreflang="zh" href="${SITE_ORIGIN}${p}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_ORIGIN}${p}?lang=en" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${p}" />`,
    ].join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${paths
    .map((p) => `  <url>\n    <loc>${SITE_ORIGIN}${p}</loc>\n    <lastmod>${CONTENT_LASTMOD}</lastmod>\n${alt(p)}\n  </url>`)
    .join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=86400" } });
});

// llms.txt：面向 AI 搜索/回答引擎（ChatGPT、Perplexity 等）的站点导览（https://llmstxt.org 约定）
app.get("/llms.txt", (c) => {
  const line = (p: string, title: string) => `- [${title}](${SITE_ORIGIN}${p})`;
  const body = [
    "# DomainHunter",
    "",
    "> Free, open-source AI domain name hunter: describe your idea in natural language, the AI agent brainstorms names in rounds, verifies availability live via RDAP/DNS/WHOIS, and only surfaces domains you can actually register. Bilingual (English/Chinese), no login required.",
    "",
    "## Core pages",
    line("/", "AI domain search (homepage, instant availability quick-check included)"),
    line("/prices", `Domain price overview: registration vs renewal for ${TLD_LIST.length} TLDs, live prices`),
    line("/why", "Why DomainHunter: a domain hunter for Chinese founders — Chinese meaning in, pinyin/English/blend candidates verified live for .cn / .com, with expiry dates and prices"),
    line("/advanced", "Bulk domain check: paste up to 200 names and stream live availability"),
    "",
    "## TLD guides",
    line("/tld", HUB_META.tld.en.title),
    ...TLD_LIST.map((t) => line(`/tld/${t}`, TLD_GUIDES[t].en.title)),
    "",
    "## Industry naming guides",
    line("/guide", HUB_META.guide.en.title),
    ...GUIDE_LIST.map((s) => line(`/guide/${s}`, INDUSTRY_GUIDES[s].en.title)),
    "",
    "## TLD comparisons",
    line("/vs", HUB_META.vs.en.title),
    ...COMPARE_LIST.map((s) => line(`/vs/${s}`, TLD_COMPARES[s].en.title)),
    "",
    "## API (MCP)",
    line("/mcp", "MCP server docs: plug domain checking into Claude/Cursor (check_domains + tld_prices + suggest_variants)"),
    `- Stateless MCP server at ${SITE_ORIGIN}/mcp (POST, JSON-RPC 2.0, Streamable HTTP). Tools: check_domains (bulk availability for up to 50 exact domains; taken domains include expiresAt in ISO 8601 and expiringSoon when expiring within 90 days), tld_prices (live registration/renewal prices in USD) and suggest_variants (prefix/suffix variants with live availability when a name is taken). No auth required.`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" } });
});

app.get("/robots.txt", (c) =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      "",
      "# AI crawlers welcome \u2014 curated site guide at /llms.txt",
      "User-agent: GPTBot",
      "Allow: /",
      "",
      "User-agent: PerplexityBot",
      "Allow: /",
      "",
      "User-agent: ClaudeBot",
      "Allow: /",
      "",
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
      "",
    ].join("\n"),
    {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" },
  }));

app.all("*", async (c) => {
  const res = await c.env.ASSETS.fetch(c.req.raw);
  if (res.status !== 404) return res;
  // 未知顶层路径：GET 页面请求返回品牌 404 壳（noindex），其余保持原样
  const accept = c.req.header("accept") ?? "";
  if (c.req.method !== "GET" || !accept.includes("text/html")) return res;
  const shell = await c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw));
  return notFoundShell(shell);
});

// IndexNow：向 Bing/Yandex 等搜索引擎主动推送全站 URL（key 按协议公开，对应 public/<key>.txt 静态文件）
// 状态键：indexnow:last = 最近一次成功（200/202）时间；indexnow:lastAttempt = 最近一次尝试时间（成功失败都写，
// 用作 6h 冷却防止失败后每次 cron 都重发）；indexnow:lastError = 最近一次失败详情（成功后清除）。
// 分批/状态码语义见 indexnow.ts；sitemap 当前 ~1.3k URL，远低于单次 10000 上限。
const INDEXNOW_KEY = "024aa6c6f88245bbacdac2f60a94e333";
const INDEXNOW_INTERVAL_MS = 24 * 3600 * 1000;
const INDEXNOW_RETRY_MS = 6 * 3600 * 1000;
const INDEXNOW_LAST_KEY = "indexnow:last";
const INDEXNOW_LAST_ATTEMPT_KEY = "indexnow:lastAttempt";
const INDEXNOW_LAST_ERROR_KEY = "indexnow:lastError";
interface IndexNowError {
  at: number;
  status: number;
  message: string;
  submitted: number;
}

async function pingIndexNow(env: Bindings): Promise<void> {
  if (!env.CACHE) return;
  const kv = env.CACHE;
  const now = Date.now();
  const [last, lastAttempt] = await Promise.all([kv.get(INDEXNOW_LAST_KEY), kv.get(INDEXNOW_LAST_ATTEMPT_KEY)]);
  if (last && now - Number(last) < INDEXNOW_INTERVAL_MS) return;
  if (lastAttempt && now - Number(lastAttempt) < INDEXNOW_RETRY_MS) return;
  await kv.put(INDEXNOW_LAST_ATTEMPT_KEY, String(now));
  const host = SITE_ORIGIN.replace(/^https?:\/\//, "");
  const results = await submitIndexNow({
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
    urls: sitemapPaths().map((p) => `${SITE_ORIGIN}${p}`),
    endpoint: INDEXNOW_ENDPOINT,
  });
  const summary = summarizeIndexNow(results);
  if (summary.ok) {
    await Promise.all([kv.put(INDEXNOW_LAST_KEY, String(now)), kv.delete(INDEXNOW_LAST_ERROR_KEY)]);
    return;
  }
  const err: IndexNowError = { at: now, status: summary.status, message: summary.message, submitted: summary.submitted };
  console.error("indexnow failed", JSON.stringify(err));
  await kv.put(INDEXNOW_LAST_ERROR_KEY, JSON.stringify(err));
}

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledController, env: Bindings, ctx: ExecutionContext) {
    // 心跳：记录每次 cron 实际执行时间，便于观察调度是否生效
    ctx.waitUntil(env.CACHE?.put("cron:last", String(Date.now())) ?? Promise.resolve());
    ctx.waitUntil(runMonitorSweep(env));
    ctx.waitUntil(pingIndexNow(env));
    ctx.waitUntil(refreshPricesIfStale(env.CACHE, PRICES_CACHE_CFG));
  },
};
