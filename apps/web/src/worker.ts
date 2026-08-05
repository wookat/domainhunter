import { Hono } from "hono";
import { generateCandidates, checkDomains } from "@domainhunter/core";

type Bindings = { ASSETS: Fetcher };

const app = new Hono<{ Bindings: Bindings }>();

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
