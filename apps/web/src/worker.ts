import { Hono } from "hono";
import { generateCandidates, checkDomains } from "@domainhunter/core";
import { generateAiCandidates } from "./ai";

type Bindings = { ASSETS: Fetcher; DEEPSEEK_API_KEY: string };

const app = new Hono<{ Bindings: Bindings }>();

app.post("/api/ai-search", async (c) => {
  const body = await c.req.json<{ description?: string; tlds?: string[] }>();
  const description = (body.description ?? "").trim();
  const tlds = (body.tlds ?? ["com", "cn"]).map((t) => t.trim().toLowerCase().replace(/^\./, "")).filter(Boolean);
  if (!description) return c.json({ error: "description required" }, 400);
  if (description.length > 500) return c.json({ error: "description too long" }, 400);

  let candidates;
  try {
    candidates = await generateAiCandidates(description, c.env.DEEPSEEK_API_KEY);
  } catch (e) {
    return c.json({ error: "ai-failed", detail: String(e) }, 502);
  }
  const meaningByLabel = new Map(candidates.map((x) => [x.label, x.meaning]));
  const domains = candidates.flatMap((x) => tlds.map((t) => `${x.label}.${t}`));

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  c.executionCtx.waitUntil(
    (async () => {
      try {
        await writer.write(
          encoder.encode(JSON.stringify({ type: "candidates", count: domains.length }) + "\n"),
        );
        await checkDomains(domains, async (r) => {
          const meaning = meaningByLabel.get(r.domain.slice(0, r.domain.indexOf(".")));
          await writer.write(encoder.encode(JSON.stringify({ ...r, meaning }) + "\n"));
        }, 6);
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
        }, 6);
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
