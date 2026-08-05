import { Hono } from "hono";
import { generateCandidates, checkDomains, type CheckResult } from "@domainhunter/core";
import { whoisFallback } from "./whois";
import { generateAiCandidates, generateUnderstanding } from "./ai";

type Bindings = { ASSETS: Fetcher; DEEPSEEK_API_KEY: string; CACHE?: KVNamespace };

const app = new Hono<{ Bindings: Bindings }>();

const RATE_LIMIT_PER_HOUR = 20;
const CACHE_TTL_TAKEN = 24 * 3600; // 已注册结果缓存 24h
const CACHE_TTL_AVAILABLE = 3600; // available 缓存 1h，防抢注误导

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
): Promise<void> {
  let misses = domains;
  if (kv) {
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

app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
