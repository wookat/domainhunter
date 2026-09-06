#!/usr/bin/env node
// R550：/vs 判断段（compares.ts verdict）跨页共用连续片段扫描。0 AI：只读源码常量。
//
//   node scripts/seo-audit/vs-shared-ngrams.mjs                 # en ≥12 词 + zh ≥24 字，全部 444 页两两
//   node scripts/seo-audit/vs-shared-ngrams.mjs --en 12 --zh 24 --slugs uk-vs-com,de-vs-com,au-vs-com,fr-vs-com
//   node scripts/seo-audit/vs-shared-ngrams.mjs --json /tmp/out.json
//
// 口径（tokenize / span 归并）来自 apps/web/src/content/verdict-shared-spans.ts，
// 与守门测试 apps/web/src/content/compare-verdict-shared.test.ts 完全同源。
// 输出：每对页面共享的「最长连续片段」，按长度倒序。

import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const EN_N = Number(opt("en", 12));
const ZH_N = Number(opt("zh", 24));
const onlySlugs = opt("slugs") ? new Set(opt("slugs").split(",")) : null;
const jsonOut = opt("json");
const field = opt("field", "verdict");

const { TLD_COMPARES } = await import(pathToFileURL(resolve("apps/web/src/content/compares.ts")).href);
const { tokenizeEn, tokenizeZh, sharedSpans } = await import(pathToFileURL(resolve("apps/web/src/content/verdict-shared-spans.ts")).href);

const entries = Object.values(TLD_COMPARES).filter((c) => !onlySlugs || onlySlugs.has(c.slug));
const report = {};
for (const [lang, n, tok, joiner] of [
  ["en", EN_N, tokenizeEn, " "],
  ["zh", ZH_N, tokenizeZh, ""],
]) {
  const pages = entries.map((c) => ({ slug: c.slug, tokens: tok(c[lang][field]) }));
  const spans = sharedSpans(pages, n, joiner);
  const pairs = new Set(spans.map((s) => `${s.a}|${s.b}`));
  const slugs = new Set(spans.flatMap((s) => [s.a, s.b]));
  report[lang] = { n, pages: pages.length, spans: spans.length, pairs: pairs.size, slugs: slugs.size, list: spans };
  console.log(`\n== ${lang}.${field}: N=${n} ${lang === "en" ? "words" : "chars"} · pages=${pages.length} · shared spans=${spans.length} · pairs=${pairs.size} · slugs involved=${slugs.size}`);
  for (const s of spans) console.log(`  [${s.len}] ${s.a} ↔ ${s.b}: "${s.span}"`);
}
if (jsonOut) await writeFile(jsonOut, JSON.stringify(report, null, 2));
