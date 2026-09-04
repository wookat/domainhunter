#!/usr/bin/env node
// R488：从生产 sitemap 抽样并抓取 SSR HTML（0 AI；只打静态内容页/sitemap，不触碰 /api/ai-search）。
//
//   node scripts/seo-audit/fetch.mjs sample [--seed 488] [--per 15] [--out scripts/seo-audit/out]
//     → out/sample.json + out/html/<id>.zh.html / <id>.en.html（zh=裸路径，en=?lang=en）
//   node scripts/seo-audit/fetch.mjs graph [--out ...] [--concurrency 6]
//     → out/graph.json：sitemap 全部 URL（裸路径）的 HTTP 状态 + 站内链接列表（用于 BFS 孤岛分析）
//
// UA 见 lib.mjs：含 SiteAuditBot，被生产按 botsBy.other 计数，不进人类 pageviews。

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_ORIGIN, fetchText, internalLinks, mapLimit, rng, sample, sitemapLocs } from "./lib.mjs";

const args = process.argv.slice(2);
const mode = args[0];
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const out = opt("out", "scripts/seo-audit/out");
const seed = Number(opt("seed", 488));
const per = Number(opt("per", 15));
const concurrency = Number(opt("concurrency", 6));

const CORE = ["/", "/prices", "/why", "/mcp", "/tld", "/guide", "/vs"];
const idOf = (p) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/[^a-z0-9.-]+/gi, "_"));

async function loadSitemap() {
  const sm = await fetchText(`${SITE_ORIGIN}/sitemap.xml`);
  if (sm.status !== 200) throw new Error(`sitemap ${sm.status}`);
  const paths = sitemapLocs(sm.text).map((u) => u.replace(SITE_ORIGIN, "") || "/");
  return { xml: sm.text, paths };
}

if (mode === "sample") {
  await mkdir(join(out, "html"), { recursive: true });
  const { xml, paths } = await loadSitemap();
  const rand = rng(seed);
  const groups = {
    tld: paths.filter((p) => /^\/tld\/[^/]+$/.test(p)),
    guide: paths.filter((p) => /^\/guide\/[^/]+$/.test(p)),
    vs: paths.filter((p) => /^\/vs\/[^/]+$/.test(p)),
  };
  const picked = { core: CORE, tld: sample(groups.tld, per, rand), guide: sample(groups.guide, per, rand), vs: sample(groups.vs, per, rand) };
  const all = Object.entries(picked).flatMap(([g, ps]) => ps.map((p) => ({ group: g, path: p, id: idOf(p) })));
  console.log(`sitemap: ${paths.length} URLs (tld ${groups.tld.length}, guide ${groups.guide.length}, vs ${groups.vs.length}); sampling ${all.length} pages × 2 langs, seed=${seed}`);
  const results = await mapLimit(all, concurrency, async (item) => {
    const rec = { ...item, zh: {}, en: {} };
    for (const lang of ["zh", "en"]) {
      const url = `${SITE_ORIGIN}${item.path}${lang === "en" ? (item.path.includes("?") ? "&" : "?") + "lang=en" : ""}`;
      const r = await fetchText(url);
      rec[lang] = { url, status: r.status, bytes: Buffer.byteLength(r.text), cacheControl: r.headers["cache-control"] ?? null, vary: r.headers["vary"] ?? null };
      await writeFile(join(out, "html", `${item.id}.${lang}.html`), r.text);
    }
    process.stdout.write(`${item.group.padEnd(6)} ${item.path.padEnd(40)} zh=${rec.zh.status} en=${rec.en.status}\n`);
    return rec;
  });
  await writeFile(join(out, "sitemap.xml"), xml);
  await writeFile(join(out, "sample.json"), JSON.stringify({ fetchedAt: new Date().toISOString(), seed, per, sitemapCount: paths.length, groupCounts: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length])), pages: results }, null, 2));
  console.log(`wrote ${out}/sample.json`);
} else if (mode === "graph") {
  await mkdir(out, { recursive: true });
  const { paths } = await loadSitemap();
  console.log(`fetching ${paths.length} sitemap URLs (bare path, no JS) for link graph …`);
  let done = 0;
  const nodes = await mapLimit(paths, concurrency, async (p) => {
    const r = await fetchText(`${SITE_ORIGIN}${p}`);
    done++;
    if (done % 100 === 0) process.stdout.write(`  ${done}/${paths.length}\n`);
    return { path: p, status: r.status, links: r.status === 200 ? internalLinks(r.text) : [] };
  });
  await writeFile(join(out, "graph.json"), JSON.stringify({ fetchedAt: new Date().toISOString(), sitemapCount: paths.length, nodes }));
  console.log(`wrote ${out}/graph.json`);
} else {
  console.error("usage: fetch.mjs sample|graph [--seed N] [--per N] [--out DIR] [--concurrency N]");
  process.exit(2);
}
