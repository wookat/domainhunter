import { Hono } from "hono";
import { nanoid } from "nanoid";
import { generateCandidates, checkDomains, type CheckResult } from "@domainhunter/core";
import { whoisFallback } from "./whois";
import { generateAiCandidates, generateUnderstanding } from "./ai";

type Bindings = { ASSETS: Fetcher; DEEPSEEK_API_KEY: string; CACHE?: KVNamespace };

const app = new Hono<{ Bindings: Bindings }>();

const RATE_LIMIT_PER_HOUR = 20;
const CACHE_TTL_TAKEN = 24 * 3600; // 已注册结果缓存 24h
const CACHE_TTL_AVAILABLE = 3600; // available 缓存 1h，防抢注误导
const SHARE_TTL = 30 * 24 * 3600; // 分享快照保留 30 天
const MAX_SHARE_ITEMS = 100;
const MAX_RECHECK_DOMAINS = 100;
const STATS_KEY = "stats:checked";
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,62})(\.[a-z0-9]([a-z0-9-]{0,62}))+$/;

/** 累计核验计数（KV 非原子，允许少量误差） */
async function bumpStats(kv: KVNamespace | undefined, n: number): Promise<void> {
  if (!kv || n <= 0) return;
  try {
    const cur = Number((await kv.get(STATS_KEY)) ?? "0");
    await kv.put(STATS_KEY, String(cur + n));
  } catch { /* 计数失败不影响主流程 */ }
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

app.post("/api/ai-search", async (c) => {
  const body = await c.req.json<{
    description?: string;
    tlds?: string[];
    target?: number;
    excludeLabels?: string[];
    style?: string;
    lengthPref?: string;
  }>();
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
    return c.json({ error: "rate_limited", message: `今天猎得有点勤快了：每小时最多 ${RATE_LIMIT_PER_HOUR} 次 AI 猎名，休息一会儿再来吧` }, 429);
  }

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
      const understandingDone = generateUnderstanding(description, apiKey)
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
              count: 24,
              excludeTaken: round === 1 && takenLabels.length === 0 ? undefined : takenLabels,
              round,
            });
          } catch (e) {
            await emit({ type: "error", round, detail: String(e) });
            break;
          }
          const fresh = candidates.filter((x) => !tried.has(x.label));
          fresh.forEach((x) => tried.add(x.label));
          const meaningByLabel = new Map(fresh.map((x) => [x.label, x.meaning]));
          const domains = fresh.flatMap((x) => tlds.map((t) => `${x.label}.${t}`));
          await emit({ type: "proposed", round, items: fresh, tlds });
          const takenThisRound = new Set<string>();
          await checkDomainsCached(c.env.CACHE, domains, async (r) => {
            const label = r.domain.slice(0, r.domain.indexOf("."));
            if (r.status === "available") availableCount++;
            else if (r.status === "taken") takenThisRound.add(label);
            await emit({ ...r, round, meaning: meaningByLabel.get(label) });
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
  }>();
  const roots = body.roots ?? [];
  const tlds = body.tlds ?? ["com"];
  if (roots.length === 0) return c.json({ error: "roots required" }, 400);

  const domains = generateCandidates({
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

// 信任数据：累计核验域名数
app.get("/api/stats", async (c) => {
  let totalChecked = 0;
  try {
    totalChecked = Number((await c.env.CACHE?.get(STATS_KEY)) ?? "0");
  } catch { /* KV 不可用时返回 0 */ }
  return c.json({ totalChecked }, 200, { "cache-control": "public, max-age=60" });
});

// SPA 分享页路由：回 index.html，前端按 pathname 渲染只读清单
app.get("/s/:id", (c) => c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw)));

app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
