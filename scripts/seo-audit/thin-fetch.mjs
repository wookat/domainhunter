#!/usr/bin/env node
// R512 薄内容/近重复审计：全量抓取 /tld /guide /vs 三类内容页的生产 SSR HTML（zh=裸路径，en=?lang=en）。
// 0 AI：只 GET sitemap 与内容页，不触碰 /api/ai-search。串行或 ≤4 并发（默认 4），UA 标明 DomainHunter-audit
//（含 SiteAuditBot → worker pageviews.ts 归为 botsBy.other，不污染人类 pageviews）。
//
//   node scripts/seo-audit/thin-fetch.mjs [--out scripts/seo-audit/out/r512] [--concurrency 4] [--groups tld,guide,vs] [--limit N]
//     → out/html/<group>/<slug>.<lang>.html + out/fetch.json（每页状态/字节/耗时）
//   SEO_AUDIT_ORIGIN=http://127.0.0.1:8787 node scripts/seo-audit/thin-fetch.mjs --out /tmp/r512-local
//     → 对本地 wrangler dev 跑同一套抓取（sitemap <loc> 仍为生产 origin，自动映射）
//
// 已抓过的文件默认跳过（断点续跑）；--force 重新抓。

import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

process.env.SEO_AUDIT_UA ??= "Mozilla/5.0 (compatible; DomainHunter-audit/1.0; +https://github.com/wookat/domainhunter) SiteAuditBot";
const { PROD_ORIGIN, SITE_ORIGIN, fetchText, mapLimit, sitemapLocs } = await import("./lib.mjs");

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const out = opt("out", "scripts/seo-audit/out/r512");
const concurrency = Math.min(4, Math.max(1, Number(opt("concurrency", 4))));
const groups = opt("groups", "tld,guide,vs").split(",");
const limit = Number(opt("limit", 0));
const force = args.includes("--force");
const FETCH_ORIGIN = (process.env.SEO_AUDIT_ORIGIN ?? SITE_ORIGIN).replace(/\/$/, "");

const sm = await fetchText(`${FETCH_ORIGIN}/sitemap.xml`);
if (sm.status !== 200) throw new Error(`sitemap ${sm.status}`);
const paths = sitemapLocs(sm.text).map((u) => u.replace(PROD_ORIGIN, "").replace(SITE_ORIGIN, "") || "/");
const pages = [];
for (const g of groups) {
  const re = new RegExp(`^/${g}/([^/?#]+)$`);
  let ps = paths.filter((p) => re.test(p));
  if (limit) ps = ps.slice(0, limit);
  for (const p of ps) pages.push({ group: g, path: p, slug: p.match(re)[1] });
}
console.log(`sitemap ${paths.length} URLs → ${pages.length} content pages (${groups.map((g) => `${g} ${pages.filter((p) => p.group === g).length}`).join(", ")}) × zh/en, concurrency ${concurrency}`);
for (const g of groups) await mkdir(join(out, "html", g), { recursive: true });

const exists = async (f) => !!(await stat(f).catch(() => null));
let done = 0;
let fetched = 0;
const t0 = Date.now();
const results = await mapLimit(pages, concurrency, async (pg) => {
  const rec = { ...pg, zh: {}, en: {} };
  for (const lang of ["zh", "en"]) {
    const file = join(out, "html", pg.group, `${pg.slug}.${lang}.html`);
    if (!force && (await exists(file))) {
      rec[lang] = { skipped: true };
      continue;
    }
    const url = `${FETCH_ORIGIN}${pg.path}${lang === "en" ? "?lang=en" : ""}`;
    const t = Date.now();
    const r = await fetchText(url);
    rec[lang] = { url, status: r.status, bytes: Buffer.byteLength(r.text), ms: Date.now() - t, vary: r.headers["vary"] ?? null };
    if (r.status === 200) await writeFile(file, r.text);
    else console.error(`  ! ${url} → ${r.status} ${r.error ?? ""}`);
    fetched++;
  }
  done++;
  if (done % 50 === 0) process.stdout.write(`  ${done}/${pages.length} pages (${fetched} requests, ${((Date.now() - t0) / 1000).toFixed(0)}s)\n`);
  return rec;
});
await writeFile(join(out, "fetch.json"), JSON.stringify({ fetchedAt: new Date().toISOString(), origin: FETCH_ORIGIN, sitemapCount: paths.length, concurrency, pages: results }, null, 2));
const bad = results.flatMap((r) => ["zh", "en"].filter((l) => r[l].status && r[l].status !== 200).map((l) => `${r.path} ${l} ${r[l].status}`));
console.log(`done: ${done} pages, ${fetched} requests, non-200: ${bad.length}${bad.length ? "\n  " + bad.join("\n  ") : ""}; wrote ${out}/fetch.json`);
