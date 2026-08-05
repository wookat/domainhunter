import { Hono } from "hono";
import { generateCandidates, checkDomains } from "@domainhunter/core";
import { whoisFallback } from "./whois";
import { generateAiCandidates } from "./ai";

type Bindings = { ASSETS: Fetcher; DEEPSEEK_API_KEY: string };

const app = new Hono<{ Bindings: Bindings }>();

app.post("/api/ai-search", async (c) => {
  const body = await c.req.json<{
    description?: string;
    tlds?: string[];
    target?: number;
    excludeLabels?: string[];
  }>();
  const description = (body.description ?? "").trim();
  const tlds = (body.tlds ?? ["com", "cn"]).map((t) => t.trim().toLowerCase().replace(/^\./, "")).filter(Boolean);
  const target = Math.min(Math.max(body.target ?? 10, 3), 30);
  const MAX_ROUNDS = 5;
  if (!description) return c.json({ error: "description required" }, 400);
  if (description.length > 500) return c.json({ error: "description too long" }, 400);

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
          await checkDomains(domains, async (r) => {
            const label = r.domain.slice(0, r.domain.indexOf("."));
            if (r.status === "available") availableCount++;
            else if (r.status === "taken") takenThisRound.add(label);
            await emit({ ...r, round, meaning: meaningByLabel.get(label) });
          }, 6, fetch, whoisFallback);
          takenLabels.push(...takenThisRound);
        }
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
        await checkDomains(domains, async (r) => {
          await writer.write(encoder.encode(JSON.stringify(r) + "\n"));
        }, 6, fetch, whoisFallback);
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
