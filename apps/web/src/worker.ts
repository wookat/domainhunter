import { Hono } from "hono";
import { nanoid } from "nanoid";
import { generateCandidates, checkDomains, type CheckResult } from "@domainhunter/core";
import { whoisFallback } from "./whois";
import { generateAiCandidates, generateUnderstanding } from "./ai";
import { COMPARE_LIST, TLD_COMPARES } from "./content/compares";
import { GUIDE_LIST, INDUSTRY_GUIDES } from "./content/guides";
import { buildCompareFaq } from "./content/compare-faq";
import { buildGuideFaq } from "./content/guide-faq";
import { buildPricesFaq } from "./content/prices-faq";
import { buildTldFaq } from "./content/tld-faq";
import { TLD_GUIDES } from "./content/tlds";
import { TLD_LIST, USD_TO_CNY } from "./content/tld-list";

type Bindings = { ASSETS: Fetcher; DEEPSEEK_API_KEY: string; CACHE?: KVNamespace };

const app = new Hono<{ Bindings: Bindings }>();

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
const PRICES_KEY = `prices:v2:${TLD_LIST.length}`; // key 掺 TLD 数量：指南扩容后旧缓存自动失效
const PRICES_TTL = 24 * 3600; // Porkbun 价格缓存 24h
const SITE_ORIGIN = "https://hunt.zalize.com";
const FAST_FIRST_ROUND_COUNT = 8; // fast 模式首轮候选数（更快首字节）
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

type CachedCheck = Pick<CheckResult, "domain" | "status" | "method">;

/** 带 KV 缓存的域名核验：命中直接回放，未命中走实时核验并回写 */
async function checkDomainsCached(
  kv: KVNamespace | undefined,
  domains: string[],
  onResult: (r: CheckResult & { cached?: boolean }) => Promise<void>,
  refresh = false,
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
        await kv.put(`d:${r.domain}`, JSON.stringify({ domain: r.domain, status: r.status, method: r.method }), { expirationTtl: ttl });
      } catch { /* 缓存失败不影响主流程 */ }
    }
    await onResult(r);
  }, 6, fetch, whoisFallback);
  await bumpStats(kv, domains.length);
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
    style?: string;
    lengthPref?: string;
    fast?: boolean;
    lang?: string;
  }>();
  const fast = body.fast === true;
  const lang: "zh" | "en" = body.lang === "en" ? "en" : "zh";
  let description = (body.description ?? "").trim().slice(0, 500);
  const style = (body.style ?? "").trim().slice(0, 50);
  const lengthPref = (body.lengthPref ?? "").trim().slice(0, 50);
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
      const takenLabels: string[] = [...tried];
      let availableCount = 0;
      const understandingDone = generateUnderstanding(description, apiKey, lang)
        .then(async (u) => {
          if (u) await emit({ type: "understanding", ...u });
        })
        .catch(() => undefined);
      try {
        for (let round = 1; round <= MAX_ROUNDS && availableCount < target; round++) {
          await emit({ type: "round", round, availableCount, target, note: round === 1 ? "AI 正在构思名字…" : "可注册的还不够，AI 反思后继续想…" });
          let candidates;
          try {
            candidates = await generateAiCandidates(description, apiKey, {
              count: fast && round === 1 ? FAST_FIRST_ROUND_COUNT : 24,
              excludeTaken: round === 1 && takenLabels.length === 0 ? undefined : takenLabels,
              round,
              lang,
            });
          } catch (e) {
            await emit({ type: "error", round, detail: String(e) });
            break;
          }
          const fresh = candidates.filter((x) => !tried.has(x.label));
          fresh.forEach((x) => tried.add(x.label));
          const meaningByLabel = new Map(fresh.map((x) => [x.label, x.meaning]));
          const themeByLabel = new Map(fresh.map((x) => [x.label, x.theme]));
          const domains = fresh.flatMap((x) => tlds.map((t) => `${x.label}.${t}`));
          await emit({ type: "proposed", round, items: fresh, tlds });
          const takenThisRound = new Set<string>();
          await checkDomainsCached(c.env.CACHE, domains, async (r) => {
            const label = r.domain.slice(0, r.domain.indexOf("."));
            if (r.status === "available") availableCount++;
            else if (r.status === "taken") takenThisRound.add(label);
            await emit({ ...r, round, meaning: meaningByLabel.get(label), theme: themeByLabel.get(label) });
          });
          takenLabels.push(...takenThisRound);
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

/** Cron：批量复查监控集合，状态变化写入 monitor:changes */
async function runMonitorSweep(env: Bindings): Promise<void> {
  const kv = env.CACHE;
  if (!kv) return;
  const map = await loadMonitorMap(kv);
  const domains = Object.keys(map);
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
  const id = nanoid(10);
  await kv.put(`share:${id}`, JSON.stringify({ items, createdAt: Date.now() }), { expirationTtl: SHARE_TTL });
  const origin = new URL(c.req.url).origin;
  return c.json({ id, url: `${origin}/s/${id}` });
});

app.get("/api/share/:id", async (c) => {
  const kv = c.env.CACHE;
  if (!kv) return c.json({ error: "share_unavailable" }, 503);
  const id = c.req.param("id");
  if (!/^[\w-]{1,32}$/.test(id)) return c.json({ error: "not_found" }, 404);
  const snapshot = await kv.get(`share:${id}`, "text");
  if (!snapshot) return c.json({ error: "not_found" }, 404);
  return new Response(snapshot, { headers: { "content-type": "application/json; charset=utf-8" } });
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

interface PorkbunPricing {
  pricing?: Record<string, { registration?: string; renewal?: string }>;
}

interface PriceEntry {
  registration: number;
  renewal: number;
}

/** 实时价格：Porkbun 公开价格 API（美元），KV 缓存 24h */
app.get("/api/prices", async (c) => {
  const kv = c.env.CACHE;
  if (kv) {
    try {
      const cached = await kv.get(PRICES_KEY, "text");
      if (cached) return new Response(cached, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=600" } });
    } catch { /* 缓存读取失败则实时拉取 */ }
  }
  let data: PorkbunPricing;
  try {
    const res = await fetch("https://api.porkbun.com/api/json/v3/pricing/get", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    if (!res.ok) return c.json({ error: "upstream_error" }, 502);
    data = (await res.json()) as PorkbunPricing;
  } catch {
    return c.json({ error: "upstream_error" }, 502);
  }
  const prices: Record<string, PriceEntry> = {};
  for (const tld of TLD_LIST) {
    const p = data.pricing?.[tld];
    const registration = Number(p?.registration);
    const renewal = Number(p?.renewal);
    if (Number.isFinite(registration) && Number.isFinite(renewal)) prices[tld] = { registration, renewal };
  }
  if (Object.keys(prices).length === 0) return c.json({ error: "upstream_error" }, 502);
  const payload = JSON.stringify({ prices, currency: "USD", usdToCny: USD_TO_CNY, fetchedAt: Date.now() });
  if (kv) {
    try {
      await kv.put(PRICES_KEY, payload, { expirationTtl: PRICES_TTL });
    } catch { /* 缓存写入失败不影响返回 */ }
  }
  return new Response(payload, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 信任数据：累计核验域名数
app.get("/api/stats", async (c) => {
  let totalChecked = 0;
  try {
    totalChecked = Number((await c.env.CACHE?.get(STATS_KEY)) ?? "0");
  } catch { /* KV 不可用时返回 0 */ }
  return c.json({ totalChecked }, 200, { "cache-control": "public, max-age=60" });
});

// 运营数据：最近 N 天的聚合使用量（仅计数，无任何用户输入/IP）
app.get("/api/usage", async (c) => {
  const days = Math.min(Math.max(Number(c.req.query("days") ?? "14"), 1), 45);
  const kv = c.env.CACHE;
  const out: Record<string, DayUsage> = {};
  if (kv) {
    const dates = Array.from({ length: days }, (_, i) => new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10));
    await Promise.all(
      dates.map(async (d) => {
        try {
          const u = await kv.get<DayUsage>(`usage:${d}`, "json");
          if (u) out[d] = u;
        } catch { /* 单天读失败忽略 */ }
      }),
    );
  }
  let cronLast: number | null = null;
  let indexnowLast: number | null = null;
  try {
    const [cl, il] = await Promise.all([kv?.get("cron:last"), kv?.get("indexnow:last")]);
    cronLast = cl ? Number(cl) : null;
    indexnowLast = il ? Number(il) : null;
  } catch { /* 读失败返回 null */ }
  return c.json({ days: out, cronLast, indexnowLast }, 200, { "cache-control": "public, max-age=300" });
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

// 动态分享图：清单前 3 个域名 + 数量，品牌绿主题（SVG，1200×630）
// 价格总览页分享图（须注册在 /api/og/:id 之前，否则被其当作分享 id）
app.get("/api/og/prices", (c) => {
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  return new Response(pageOgSvg(lang === "en" ? "Pricing" : "域名价格", PRICES_META[lang].title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

// 产品定位页分享图（须在 /api/og/:id 之前注册）
app.get("/api/og/why", (c) => {
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  const title = lang === "en" ? "The good names are taken? Hunt differently." : "好域名都被占了？换个找法";
  return new Response(pageOgSvg(lang === "en" ? "Why us" : "产品定位", title, lang), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
});

// 首页分享图（静态 og.png 为中文，英文首页用动态 SVG，平台不支持 SVG 时回退 og.png；须在 /api/og/:id 之前注册）
app.get("/api/og/home", (c) => {
  const lang = c.req.query("lang") === "en" ? "en" : "zh";
  const title = lang === "en" ? "Describe the meaning — hunt truly available domains" : "说出寓意，猎取真正可注册的好域名";
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

/** hreflang alternate 标签：zh-CN / en / x-default，用 ?lang= 区分语言版本 */
function hreflangTags(path: string): string {
  const base = `${SITE_ORIGIN}${path}`;
  return [
    `<link rel="alternate" hreflang="zh-CN" href="${base}?lang=zh" />`,
    `<link rel="alternate" hreflang="en" href="${base}?lang=en" />`,
    `<link rel="alternate" hreflang="x-default" href="${base}" />`,
  ].join("\n    ");
}

const injectHreflang = (html: string, path: string) =>
  html.replace(/(<link rel="canonical"[^>]*\/>)/, `$1\n    ${hreflangTags(path)}`);

/** Vite manifest（构建产物 hashed 文件名映射），模块级缓存 */
type ViteManifestChunk = { file: string; imports?: string[] };
let viteManifest: Record<string, ViteManifestChunk> | null = null;

/** SEO 页 SSR 注入懒加载路由 chunk 的 modulepreload，让页面 JS 与主 bundle 并行下载（降低内容 LCP） */
async function injectModulepreload(html: string, assets: Fetcher, origin: string, entry: string): Promise<string> {
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
    if (files.length === 0) return html;
    const links = files.map((f) => `<link rel="modulepreload" href="/${f}" />`).join("\n    ");
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
// 首页 FAQPage 结构化数据（与首页 FAQ 区块内容一致，供搜索引擎富摘要；英文文案与 i18n 词典逐字一致）
const HOME_FAQ = {
  zh: [
    { q: "DomainHunter 是什么？", a: "用一句自然语言描述你想要的域名寓意与风格，AI 多轮构思候选并实时核验，直接给出一批真正可注册的好名字。" },
    { q: "核验结果准确吗？", a: "每个域名经 DNS + RDAP + WHOIS 三级核验，可注册状态来自注册局权威数据；注册前建议在注册商页面再确认一次。" },
    { q: "使用收费吗？", a: "完全免费。AI 搜索有每小时次数限制；即输即查、更多后缀与前后缀变体核验不限量、不消耗 AI 次数。" },
    { q: "会自动帮我注册域名吗？", a: "不会。我们只提供核验结果与注册商跳转链接（如 Porkbun），注册和付费在注册商完成。" },
    { q: "支持哪些后缀？", a: "AI 搜索支持任意 TLD；即输即查默认覆盖 com/cn/io/ai/app/dev/co/net/me，点「查更多后缀」再覆盖 org/xyz/info/cc/tv/tech/online/store/site/top/shop/cloud/pro/vip/club/link/live/space/fun/art/design/studio。" },
    { q: "我的搜索会被保存吗？", a: "不保存输入内容和 IP，只记录匿名的聚合次数统计；收藏清单保存在你自己的浏览器本地。" },
  ],
  en: [
    { q: "What is DomainHunter?", a: "Describe the meaning and style you want in one sentence — AI brainstorms candidates over multiple rounds, verifies each one live, and hands you a batch of genuinely registrable names." },
    { q: "How accurate are the availability checks?", a: "Every domain goes through DNS + RDAP + WHOIS checks against authoritative registry data. We still recommend a final confirmation on the registrar's page before buying." },
    { q: "Is it free?", a: "Completely free. AI search has an hourly rate limit; instant checks, extra-TLD checks, and prefix/suffix variants are unlimited and never use AI quota." },
    { q: "Will it register domains for me automatically?", a: "No. We only provide verification results and registrar links (e.g. Porkbun) — registration and payment happen at the registrar." },
    { q: "Which TLDs are supported?", a: "AI search supports any TLD. Instant check covers com/cn/io/ai/app/dev/co/net/me by default, plus org/xyz/info/cc/tv/tech/online/store/site/top/shop/cloud/pro/vip/club/link/live/space/fun/art/design/studio via the “more TLDs” button." },
    { q: "Do you store my searches?", a: "We never store your input or IP — only anonymous aggregate counters. Your shortlist lives in your own browser's local storage." },
  ],
} as const;

const homeFaqJsonld = (lang: "zh" | "en") =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ[lang].map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  });

/** BreadcrumbList 结构化数据：首页 → 当前页，供搜索结果面包屑展示 */
const breadcrumbJsonld = (name: string, path: string, lang: "zh" | "en") =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "首页", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name, item: `${SITE_ORIGIN}${path}` },
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

// 首页英文 SSR meta（与 i18n 词典 meta.title 一致）
const HOME_META_EN = {
  title: "DomainHunter — AI Domain Hunter | Describe the meaning, hunt truly available names",
  desc: "Describe your idea in one sentence — an AI agent brainstorms names, verifies availability live via RDAP+DNS, then reflects and hunts again until there are enough names you can register right now. Free, open source, no login.",
  ogTitle: "DomainHunter — AI Domain Hunter",
  ogDesc: "Describe the meaning — an AI agent reflects over multiple rounds and verifies live. Only truly registrable domains.",
};

app.get("/", async (c) => {
  const res = await c.env.ASSETS.fetch(c.req.raw);
  const lang = c.req.query("lang") === "en" || (!c.req.query("lang") && (c.req.header("accept-language") ?? "").toLowerCase().startsWith("en")) ? "en" : "zh";
  let html = await res.text();
  if (lang === "en") {
    const m = HOME_META_EN;
    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(m.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(m.desc)}" />`)
      .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(m.ogTitle)}" />`)
      .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(m.ogDesc)}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(m.ogTitle)}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(m.ogDesc)}" />`)
      .replace(
        /<meta property="og:image" content="[^"]*" \/>/,
        `<meta property="og:image" content="${SITE_ORIGIN}/api/og/home?lang=en" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />`,
      );
  }
  html = injectHreflang(html, "/").replace("</head>", `<script type="application/ld+json">${homeFaqJsonld(lang)}</script><script type="application/ld+json">${WEBSITE_JSONLD}</script></head>`);
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
  html = injectHreflang(html, `/tld/${tld}`).replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, `/tld/${tld}`, lang)}</script><script type="application/ld+json">${tldFaqJsonld}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/tld-page.tsx");
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
  html = injectHreflang(html, `/guide/${slug}`).replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, `/guide/${slug}`, lang)}</script><script type="application/ld+json">${articleJsonld(loc.title, loc.metaDescription, `/guide/${slug}`, lang, `/api/og/guide/${slug}?lang=${lang}`)}</script><script type="application/ld+json">${guideFaqJsonld}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/guide-page.tsx");
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
  html = injectHreflang(html, `/vs/${slug}`).replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, `/vs/${slug}`, lang)}</script><script type="application/ld+json">${articleJsonld(loc.title, loc.metaDescription, `/vs/${slug}`, lang, `/api/og/vs/${slug}?lang=${lang}`)}</script><script type="application/ld+json">${cmpFaqJsonld}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/compare-page.tsx");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 价格总览页（SPA 路由 + SSR meta）
const PRICES_META = {
  zh: {
    title: "域名后缀价格总览：30 个主流 TLD 注册与续费对比",
    desc: "汇总 com/cn/io/ai 等 30 个主流后缀的注册与续费价（Porkbun 实时价），避开首年便宜续费贵的坑，并用 AI 直接猎取可注册的好名字。",
  },
  en: {
    title: "TLD Price Overview: Registration vs Renewal for 30 Popular Suffixes",
    desc: "Compare registration and renewal prices (live from Porkbun) for 30 popular TLDs like com/cn/io/ai, avoid renewal traps, and hunt registrable names with AI.",
  },
};

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
  html = injectHreflang(html, "/prices").replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, "/prices", lang)}</script><script type="application/ld+json">${pricesFaqJsonld}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/prices-page.tsx");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 产品定位页（SPA 路由 + SSR meta）
const WHY_META = {
  zh: {
    title: "为什么选 DomainHunter：好域名都被占了，换个找法",
    desc: "传统域名查询只显示相似名，AI 起名工具不核验可注册。DomainHunter 用 Agent 多轮反思：理解寓意→构思→实时核验→反思再猎，直到凑够真正可注册的好名字。免费开源。",
  },
  en: {
    title: "Why DomainHunter: all the good names are taken — hunt differently",
    desc: "Classic domain search only shows look-alikes; AI name generators never verify availability. DomainHunter runs an agent loop — understand the meaning, brainstorm, verify live, reflect and hunt again — until there are enough truly registrable names. Free and open source.",
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
  html = injectHreflang(html, "/why").replace(
    "</head>",
    `<script type="application/ld+json">${breadcrumbJsonld(loc.title, "/why", lang)}</script></head>`,
  );
  html = setHtmlLang(html, lang);
  html = await injectModulepreload(html, c.env.ASSETS, c.req.url, "src/components/why-page.tsx");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" } });
});

// 内容最后更新日期（sitemap <lastmod>）：每次内容页增减/改写时更新
const CONTENT_LASTMOD = "2026-08-07";

const sitemapPaths = () => ["/", "/prices", "/why", ...TLD_LIST.map((t) => `/tld/${t}`), ...GUIDE_LIST.map((s) => `/guide/${s}`), ...COMPARE_LIST.map((s) => `/vs/${s}`)];

app.get("/sitemap.xml", (c) => {
  const paths = sitemapPaths();
  const alt = (p: string) =>
    [
      `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_ORIGIN}${p}?lang=zh" />`,
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
    line("/prices", "Domain price overview: registration vs renewal for 30 TLDs, live prices"),
    line("/why", "Why DomainHunter: agent loop that reflects over rounds and only surfaces registrable names"),
    "",
    "## TLD guides",
    ...TLD_LIST.map((t) => line(`/tld/${t}`, TLD_GUIDES[t].en.title)),
    "",
    "## Industry naming guides",
    ...GUIDE_LIST.map((s) => line(`/guide/${s}`, INDUSTRY_GUIDES[s].en.title)),
    "",
    "## TLD comparisons",
    ...COMPARE_LIST.map((s) => line(`/vs/${s}`, TLD_COMPARES[s].en.title)),
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

app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

// IndexNow：向 Bing/Yandex 等搜索引擎主动推送全站 URL（key 按协议公开，对应 /<key>.txt 静态文件）
const INDEXNOW_KEY = "024aa6c6f88245bbacdac2f60a94e333";
const INDEXNOW_INTERVAL_MS = 24 * 3600 * 1000;

async function pingIndexNow(env: Bindings): Promise<void> {
  if (!env.CACHE) return;
  const last = await env.CACHE.get("indexnow:last");
  if (last && Date.now() - Number(last) < INDEXNOW_INTERVAL_MS) return;
  await env.CACHE.put("indexnow:last", String(Date.now()));
  const host = SITE_ORIGIN.replace(/^https?:\/\//, "");
  await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
      urlList: sitemapPaths().map((p) => `${SITE_ORIGIN}${p}`),
    }),
  });
}

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledController, env: Bindings, ctx: ExecutionContext) {
    // 心跳：记录每次 cron 实际执行时间，便于观察调度是否生效
    ctx.waitUntil(env.CACHE?.put("cron:last", String(Date.now())) ?? Promise.resolve());
    ctx.waitUntil(runMonitorSweep(env));
    ctx.waitUntil(pingIndexNow(env));
  },
};
