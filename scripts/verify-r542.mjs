#!/usr/bin/env node
/**
 * R542 取证脚本：/vs 444 条目「共用开场句」与 pickA/pickB 跨页复用扫描 + 4 页改写前后相似度对比。
 *
 *   node scripts/verify-r542.mjs scan                 # 开场句簇（en/zh verdict 前 60/80/100 规范化字符）+ pick 项复用（≥4 页）
 *   node scripts/verify-r542.mjs lcp                  # 两两规范化最长公共前缀分布 + 首句完全相同簇（定守门阈值）
 *   node scripts/verify-r542.mjs pairs [slug ...]     # 指定条目两两掩码 5-gram Jaccard（R512 thin-analyze 口径）+ proseWords
 *   node scripts/verify-r542.mjs pairs --git <rev> [slug ...]   # 对 <rev> 版本 compares.ts 做同样计算（改前基线）
 *
 * 纯本地、零网络、零 AI。
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "apps/web/src/content/compares.ts");
const CCTLD_SLUGS = ["uk-vs-com", "de-vs-com", "au-vs-com", "fr-vs-com"];

async function loadCompares(rev) {
  if (!rev) return (await import(pathToFileURL(SRC).href)).TLD_COMPARES;
  const src = execFileSync("git", ["-C", ROOT, "show", `${rev}:apps/web/src/content/compares.ts`], { encoding: "utf8", maxBuffer: 64 << 20 });
  const dir = mkdtempSync(join(tmpdir(), "r542-"));
  const f = join(dir, "compares.ts");
  writeFileSync(f, src);
  return (await import(pathToFileURL(f).href)).TLD_COMPARES;
}

/** 规范化：小写、去标点/空白；zh 直接按字符，en 亦按字符（只比较开头 N 字符，不分词） */
const norm = (s) => s.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "");

/* ---- R512 thin-analyze.mjs 的 masker / shinglesFor / jaccard（同口径） ---- */
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function masker(label) {
  const words = label
    .split(/\s+vs\s+|\s+/i)
    .map((w) => w.replace(/^\./, ""))
    .filter((w) => w.length >= 2);
  const labelRe = words.length ? new RegExp(words.map(escRe).sort((a, b) => b.length - a.length).join("|"), "gi") : null;
  return (text) =>
    text
      .replace(/\.[a-z][a-z0-9-]+/gi, " Ⓣ ")
      .replace(labelRe ?? /$^/, " Ⓥ ")
      .replace(/[¥$€£]\s*[\d.,]+|\d[\d.,]*/g, " Ⓝ ")
      .replace(/\s+/g, " ")
      .trim();
}
function shinglesFor(text, lang, k = 5) {
  const set = new Set();
  if (lang === "zh") {
    const s = text.replace(/[\s\p{P}]/gu, "");
    for (let i = 0; i + k <= s.length; i++) set.add(s.slice(i, i + k));
  } else {
    const w = text.toLowerCase().replace(/[^\p{L}\p{N}Ⓣ Ⓥ Ⓝ']+/gu, " ").split(/\s+/).filter(Boolean);
    for (let i = 0; i + k <= w.length; i++) set.add(w.slice(i, i + k).join(" "));
  }
  return set;
}
function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}
const words = (s) => s.split(/\s+/).filter(Boolean).length;

function scan(compares) {
  const entries = Object.values(compares);
  console.log(`# /vs 条目数：${entries.length}\n`);
  for (const lang of ["en", "zh"]) {
    for (const n of [60, 80, 100]) {
      const groups = new Map();
      for (const c of entries) {
        const key = norm(c[lang].verdict).slice(0, n);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(c.slug);
      }
      const clusters = [...groups.entries()].filter(([, v]) => v.length >= 2).sort((a, b) => b[1].length - a[1].length);
      console.log(`## ${lang}.verdict 前 ${n} 规范化字符：共用簇 ${clusters.length} 个`);
      for (const [key, slugs] of clusters) {
        const sample = compares[slugs[0]][lang].verdict.slice(0, 110);
        console.log(`- ×${slugs.length} [${slugs.join(", ")}]\n  原文开头：「${sample}…」\n  key：${key.slice(0, 80)}`);
      }
      console.log();
    }
  }
  for (const lang of ["en", "zh"]) {
    const freq = new Map();
    for (const c of entries) {
      for (const side of ["pickA", "pickB"]) {
        for (const item of new Set(c[lang][side])) {
          const k = item.trim();
          if (!freq.has(k)) freq.set(k, new Set());
          freq.get(k).add(c.slug);
        }
      }
    }
    const reused = [...freq.entries()].filter(([, s]) => s.size >= 4).sort((a, b) => b[1].size - a[1].size);
    console.log(`## ${lang} pickA/pickB 完全相同列表项跨页复用 ≥4 次：${reused.length} 项`);
    for (const [item, slugs] of reused) console.log(`- ×${slugs.size} 「${item}」：${[...slugs].join(", ")}`);
    console.log();
  }
}

/** 两两最长公共前缀（规范化字符）分布 + 首句分组：决定守门阈值能抓住本簇又不误伤 */
function lcpScan(compares, top = 12) {
  const entries = Object.values(compares);
  for (const lang of ["en", "zh"]) {
    const ns = entries.map((c) => ({ slug: c.slug, n: norm(c[lang].verdict) }));
    const rows = [];
    for (let i = 0; i < ns.length; i++)
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i].n, b = ns[j].n;
        let k = 0;
        const lim = Math.min(a.length, b.length);
        while (k < lim && a[k] === b[k]) k++;
        rows.push([k, ns[i].slug, ns[j].slug]);
      }
    rows.sort((x, y) => y[0] - x[0]);
    console.log(`## ${lang}.verdict 两两规范化最长公共前缀（LCP）Top ${top}（共 ${rows.length} 对）`);
    for (const [k, a, b] of rows.slice(0, top)) console.log(`- LCP ${k}：${a} ↔ ${b}`);
    const hist = new Map();
    for (const [k] of rows) {
      const bucket = k >= 40 ? "≥40" : k >= 30 ? "30–39" : k >= 20 ? "20–29" : k >= 10 ? "10–19" : "<10";
      hist.set(bucket, (hist.get(bucket) ?? 0) + 1);
    }
    console.log(`  分布：${[...hist.entries()].map(([b, n]) => `${b}: ${n}`).join(" · ")}\n`);
    const first = new Map();
    for (const c of entries) {
      const s = c[lang].verdict.split(/(?<=[。！？!?])|(?<=\.)\s+(?=[A-Z"“])/)[0];
      const key = norm(s);
      if (!first.has(key)) first.set(key, []);
      first.get(key).push(c.slug);
    }
    const dup = [...first.entries()].filter(([, v]) => v.length >= 2);
    console.log(`## ${lang}.verdict 首句（规范化）完全相同的簇：${dup.length} 个`);
    for (const [k, v] of dup) console.log(`- ×${v.length} [${v.join(", ")}]：${k.slice(0, 80)}`);
    console.log();
  }
}

function pairs(compares, slugs) {
  const rows = slugs.map((slug) => {
    const c = compares[slug];
    if (!c) throw new Error(`unknown slug ${slug}`);
    const label = `.${c.a} vs .${c.b}`;
    const mask = masker(label);
    return { slug, en: c.en.verdict, sh: shinglesFor(mask(c.en.verdict), "en"), shRaw: shinglesFor(c.en.verdict, "en") };
  });
  console.log("| slug | en.verdict words | en 开头（前 90 字） |\n|---|---|---|");
  for (const r of rows) console.log(`| ${r.slug} | ${words(r.en)} | ${r.en.slice(0, 90).replace(/\|/g, "\\|")}… |`);
  console.log("\n| pair | Jaccard masked 5-gram | Jaccard raw 5-gram |\n|---|---|---|");
  let maxM = 0;
  for (let i = 0; i < rows.length; i++)
    for (let j = i + 1; j < rows.length; j++) {
      const m = jaccard(rows[i].sh, rows[j].sh);
      const r = jaccard(rows[i].shRaw, rows[j].shRaw);
      maxM = Math.max(maxM, m);
      console.log(`| ${rows[i].slug} ↔ ${rows[j].slug} | ${m.toFixed(4)} | ${r.toFixed(4)} |`);
    }
  console.log(`\nmax masked Jaccard = ${maxM.toFixed(4)}`);
}

const [cmd, ...rest] = process.argv.slice(2);
let rev;
const gi = rest.indexOf("--git");
if (gi >= 0) {
  rev = rest[gi + 1];
  rest.splice(gi, 2);
}
const compares = await loadCompares(rev);
if (cmd === "scan") scan(compares);
else if (cmd === "lcp") lcpScan(compares);
else if (cmd === "pairs") pairs(compares, rest.length ? rest : CCTLD_SLUGS);
else {
  console.error("usage: verify-r542.mjs scan | lcp | pairs [--git rev] [slug...]");
  process.exit(2);
}
