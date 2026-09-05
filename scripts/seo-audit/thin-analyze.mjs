#!/usr/bin/env node
// R512 薄内容/近重复审计：分析 thin-fetch.mjs 抓回的生产 SSR HTML，纯 Node、无第三方依赖、不联网。
//
//   node scripts/seo-audit/thin-analyze.mjs [--in scripts/seo-audit/out/r512] [--out docs/audits/r512] [--seed 512]
//
// 指标定义（报告中引用）：
// 1. 正文抽取：取 <main>，去 <nav>/<header>/<footer>/<aside>、script/style/svg/JSON-LD；
//    body = 剩余可见文本；prose = 再去掉所有 <a>…</a>（"其他 TLD 指南 / 相关对比 / 站内导航"等链接 chip 不算正文）。
//    字数：CJK 每个汉字算 1 词 + 拉丁按空白分词算 1 词（lib.wordCount）。
// 2. 句子：块级标签处断句，再按 。！？!?；; 与换行切分，去空白后 ≥4 字符者计为一句；
//    uniqueSentences = 去重后的句数；dupSentenceRatio = 1 - unique/total（页内自我重复，如 FAQ 答案复用正文段）。
// 3. FAQ 条数：<main> 内 <details> 数量；同时读 JSON-LD FAQPage 的 mainEntity 数量做交叉校验。
// 4. 变量词掩码：把 (a) 面包屑当前项（.shop / 动画工作室 / .baby vs .store）及其 " vs "/空白切分出的各词、
//    (b) 所有 TLD 形态 token（\.[a-z][a-z0-9-]+，如 .com .store）、(c) 阿拉伯数字（价格/数量）、(d) 货币符号
//    统一替换为占位符，再做 shingle。这样 ".com vs .net" 与 ".io vs .ai" 若只是换词，会得到相同 shingle。
//    注意：guide 页只掩码面包屑给出的行业名，行业相关词（如"动画公司/动画厂牌"）不掩码 → guide 的掩码相似度是保守值（略低估模板占比）。
// 5. 相似度：zh 用字符 5-gram（去空白与标点），en 用小写单词 5-gram；同类同语言两两 Jaccard，
//    每页取最近邻 nnMasked（掩码后）与 nnRaw（不掩码）；输出中位数 / P90 / max 及 nn>0.8、nn>0.5 页面占比。
// 6. 模板占比：templateShare50 = 本页 shingle 中，在同类 ≥50% 页面里出现过的比例；templateSentShare = 本页句子中
//    （掩码后）在同类 ≥20% 页面中出现过的比例。两者都是"换掉变量词后仍与大量同类页共用的文字"的量化估计。
//
// 7. 跨类复用：vs 页 (a-vs-b) 的句子中，逐字出现在 /tld/a 或 /tld/b 同语言页里的比例 vsReuseFromTld（vs 两侧 TLD 简介段来源于 TLD 页）。
//
// 产出（--out 目录）：pages.csv（每页指标）、summary.json、nearest-pairs.csv（每类每语言 top 30 最近邻对）、
// template-sentences.json（每类每语言出现频率最高的模板句）、manual-sample.json（可复现的人工抽读 10 页/类）。

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { decodeEntities, jaccard, mean, median, rng, sample, stripInvisible, wordCount } from "./lib.mjs";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const inDir = opt("in", "scripts/seo-audit/out/r512");
const outDir = opt("out", "docs/audits/r512");
const seed = Number(opt("seed", 512));
const GROUPS = ["tld", "guide", "vs"];
const LANGS = ["zh", "en"];

const p = (xs, q) => {
  if (!xs.length) return 0;
  const s = xs.slice().sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * (s.length - 1) + 0.5))];
};
const r3 = (x) => Math.round(x * 1000) / 1000;
const stripTags = (h) => decodeEntities(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

function extract(html) {
  let h = stripInvisible(html);
  const main = h.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? "";
  const label = stripTags(main.match(/aria-current="page"[^>]*>([\s\S]*?)<\/li>/)?.[1] ?? "");
  const h1 = stripTags(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  h = main.replace(/<(header|nav|footer|aside)\b[\s\S]*?<\/\1>/gi, " ");
  const faqDetails = (h.match(/<details\b/gi) ?? []).length;
  const bodyText = stripTags(h);
  const proseHtml = h.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " ");
  const proseText = stripTags(proseHtml);
  // 块级边界 → 换行，用于断句
  const blocky = proseHtml.replace(/<\/(p|li|h[1-6]|summary|details|div|section|td|th|tr|dt|dd|blockquote)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n");
  const lines = decodeEntities(blocky.replace(/<[^>]+>/g, " "))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const sentences = lines
    .flatMap((l) => l.split(/(?<=[。！？!?；;])\s*|(?<=\.)\s+(?=[A-Z"“])/))
    .map((s) => s.trim())
    .filter((s) => s.replace(/[\s\p{P}]/gu, "").length >= 4);
  let faqLd = 0;
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      const nodes = Array.isArray(j["@graph"]) ? j["@graph"] : [j];
      for (const n of nodes) if (n["@type"] === "FAQPage" && Array.isArray(n.mainEntity)) faqLd += n.mainEntity.length;
    } catch {}
  }
  return { label, h1, faqDetails, faqLd, bodyText, proseText, sentences };
}

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

const fetchMeta = JSON.parse(await readFile(join(inDir, "fetch.json"), "utf8"));
const pages = [];
for (const group of GROUPS) {
  const files = (await readdir(join(inDir, "html", group))).filter((f) => f.endsWith(".html")).sort();
  for (const f of files) {
    const [slug, lang] = [f.replace(/\.(zh|en)\.html$/, ""), f.match(/\.(zh|en)\.html$/)[1]];
    const html = await readFile(join(inDir, "html", group, f), "utf8");
    const ex = extract(html);
    const mask = masker(ex.label);
    const masked = mask(ex.proseText);
    const uniq = new Set(ex.sentences.map((s) => s.replace(/\s+/g, " ")));
    pages.push({
      group,
      lang,
      slug,
      path: `/${group}/${slug}`,
      label: ex.label,
      h1: ex.h1,
      bodyWords: wordCount(ex.bodyText).words,
      proseWords: wordCount(ex.proseText).words,
      proseChars: ex.proseText.replace(/\s/g, "").length,
      sentences: ex.sentences.length,
      uniqueSentences: uniq.size,
      dupSentenceRatio: ex.sentences.length ? r3(1 - uniq.size / ex.sentences.length) : 0,
      faqDetails: ex.faqDetails,
      faqLd: ex.faqLd,
      _sentences: uniq,
      _maskedSentences: [...new Set(ex.sentences.map((s) => mask(s)))],
      _shRaw: shinglesFor(ex.proseText, lang),
      _shMasked: shinglesFor(masked, lang),
    });
  }
}
console.log(`loaded ${pages.length} page renders from ${inDir}`);

const summary = { generatedAt: new Date().toISOString(), fetchedAt: fetchMeta.fetchedAt, origin: fetchMeta.origin, sitemapCount: fetchMeta.sitemapCount, seed, groups: {} };
const nearestRows = [];
const templateSentences = {};
for (const group of GROUPS) {
  summary.groups[group] = {};
  for (const lang of LANGS) {
    const ps = pages.filter((x) => x.group === group && x.lang === lang);
    const n = ps.length;
    // 全量两两 Jaccard（掩码 / 原文），取最近邻
    const nnM = new Array(n).fill(0), nnR = new Array(n).fill(0), nnIdx = new Array(n).fill(-1);
    const pairs = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const m = jaccard(ps[i]._shMasked, ps[j]._shMasked);
        const r = jaccard(ps[i]._shRaw, ps[j]._shRaw);
        if (m > nnM[i]) (nnM[i] = m), (nnIdx[i] = j);
        if (m > nnM[j]) (nnM[j] = m), (nnIdx[j] = i);
        if (r > nnR[i]) nnR[i] = r;
        if (r > nnR[j]) nnR[j] = r;
        pairs.push([m, r, i, j]);
      }
    }
    // shingle 文档频率 → 模板占比
    const df = new Map();
    for (const x of ps) for (const s of x._shMasked) df.set(s, (df.get(s) ?? 0) + 1);
    const sdf = new Map();
    for (const x of ps) for (const s of x._maskedSentences) sdf.set(s, (sdf.get(s) ?? 0) + 1);
    ps.forEach((x, i) => {
      x.nnMasked = r3(nnM[i]);
      x.nnRaw = r3(nnR[i]);
      x.nnPath = nnIdx[i] >= 0 ? ps[nnIdx[i]].path : "";
      let c50 = 0, c10 = 0;
      for (const s of x._shMasked) {
        const d = df.get(s);
        if (d >= n * 0.5) c50++;
        if (d >= n * 0.1) c10++;
      }
      x.templateShare50 = x._shMasked.size ? r3(c50 / x._shMasked.size) : 0;
      x.templateShare10 = x._shMasked.size ? r3(c10 / x._shMasked.size) : 0;
      const ts = x._maskedSentences.filter((s) => sdf.get(s) >= n * 0.2).length;
      x.templateSentShare = x._maskedSentences.length ? r3(ts / x._maskedSentences.length) : 0;
    });
    const allPairM = pairs.map((q) => q[0]);
    const pick = (k) => ps.map((x) => x[k]);
    summary.groups[group][lang] = {
      pages: n,
      bodyWords: { median: median(pick("bodyWords")), p10: p(pick("bodyWords"), 0.1), p90: p(pick("bodyWords"), 0.9), min: Math.min(...pick("bodyWords")) },
      proseWords: { median: median(pick("proseWords")), p10: p(pick("proseWords"), 0.1), p90: p(pick("proseWords"), 0.9), min: Math.min(...pick("proseWords")) },
      uniqueSentences: { median: median(pick("uniqueSentences")), p10: p(pick("uniqueSentences"), 0.1), p90: p(pick("uniqueSentences"), 0.9) },
      dupSentenceRatio: { median: r3(median(pick("dupSentenceRatio"))), mean: r3(mean(pick("dupSentenceRatio"))) },
      faqDetails: { median: median(pick("faqDetails")), min: Math.min(...pick("faqDetails")), max: Math.max(...pick("faqDetails")), ldMismatch: ps.filter((x) => x.faqDetails !== x.faqLd).length },
      nnMasked: { median: r3(median(nnM)), p90: r3(p(nnM, 0.9)), max: r3(Math.max(...nnM)), gt08: r3(nnM.filter((v) => v > 0.8).length / n), gt05: r3(nnM.filter((v) => v > 0.5).length / n), gt03: r3(nnM.filter((v) => v > 0.3).length / n) },
      nnRaw: { median: r3(median(nnR)), p90: r3(p(nnR, 0.9)), max: r3(Math.max(...nnR)), gt08: r3(nnR.filter((v) => v > 0.8).length / n), gt05: r3(nnR.filter((v) => v > 0.5).length / n) },
      allPairsMasked: { median: r3(median(allPairM)), p90: r3(p(allPairM, 0.9)), mean: r3(mean(allPairM)) },
      templateShare50: { median: r3(median(pick("templateShare50"))), p90: r3(p(pick("templateShare50"), 0.9)) },
      templateShare10: { median: r3(median(pick("templateShare10"))), p90: r3(p(pick("templateShare10"), 0.9)) },
      templateSentShare: { median: r3(median(pick("templateSentShare"))), p90: r3(p(pick("templateSentShare"), 0.9)), mean: r3(mean(pick("templateSentShare"))) },
    };
    pairs.sort((a, b) => b[0] - a[0]);
    for (const [m, r, i, j] of pairs.slice(0, 30)) nearestRows.push([group, lang, ps[i].path, ps[j].path, r3(m), r3(r)]);
    templateSentences[`${group}.${lang}`] = [...sdf.entries()]
      .filter(([, d]) => d >= n * 0.2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([s, d]) => ({ sentence: s, pages: d, share: r3(d / n) }));
    console.log(`${group}/${lang}: n=${n} prose med=${summary.groups[group][lang].proseWords.median} nnMasked med=${summary.groups[group][lang].nnMasked.median} p90=${summary.groups[group][lang].nnMasked.p90} >0.8=${summary.groups[group][lang].nnMasked.gt08} tplSent=${summary.groups[group][lang].templateSentShare.median}`);
  }
}

// 跨类复用：vs 页句子在两侧 TLD 页中的逐字命中率
const tldIndex = new Map(pages.filter((x) => x.group === "tld").map((x) => [`${x.slug}.${x.lang}`, x._sentences]));
for (const x of pages) {
  if (x.group !== "vs") continue;
  const [a, b] = x.slug.split("-vs-");
  const pool = new Set([...(tldIndex.get(`${a}.${x.lang}`) ?? []), ...(tldIndex.get(`${b}.${x.lang}`) ?? [])]);
  const sents = [...x._sentences].filter((s) => s.replace(/[\s\p{P}]/gu, "").length >= 10);
  x.vsReuseFromTld = sents.length ? r3(sents.filter((s) => pool.has(s)).length / sents.length) : 0;
}
for (const lang of LANGS) {
  const v = pages.filter((x) => x.group === "vs" && x.lang === lang).map((x) => x.vsReuseFromTld);
  summary.groups.vs[lang].vsReuseFromTld = { median: r3(median(v)), p90: r3(p(v, 0.9)), max: r3(Math.max(...v)), mean: r3(mean(v)) };
}

// 人工抽读样本（可复现）：每类 10 个 slug，zh/en 同 slug
const rand = rng(seed);
summary.manualSample = Object.fromEntries(GROUPS.map((g) => [g, sample([...new Set(pages.filter((x) => x.group === g).map((x) => x.slug))], 10, rand)]));

await mkdir(outDir, { recursive: true });
const cols = ["group", "lang", "path", "label", "bodyWords", "proseWords", "proseChars", "sentences", "uniqueSentences", "dupSentenceRatio", "faqDetails", "faqLd", "nnMasked", "nnRaw", "nnPath", "templateShare50", "templateShare10", "templateSentShare", "vsReuseFromTld"];
const csv = (rows) => rows.map((r) => r.map((v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))).join(",")).join("\n") + "\n";
await writeFile(join(outDir, "pages.csv"), csv([cols, ...pages.map((x) => cols.map((c) => x[c] ?? ""))]));
await writeFile(join(outDir, "nearest-pairs.csv"), csv([["group", "lang", "pathA", "pathB", "jaccardMasked", "jaccardRaw"], ...nearestRows]));
await writeFile(join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
await writeFile(join(outDir, "template-sentences.json"), JSON.stringify(templateSentences, null, 2));
await writeFile(join(outDir, "manual-sample.json"), JSON.stringify(summary.manualSample, null, 2));
await writeFile(
  join(outDir, "fetch-meta.json"),
  JSON.stringify({ fetchedAt: fetchMeta.fetchedAt, origin: fetchMeta.origin, sitemapCount: fetchMeta.sitemapCount, concurrency: fetchMeta.concurrency, pages: fetchMeta.pages.length, requests: fetchMeta.pages.length * 2, non200: fetchMeta.pages.flatMap((r) => LANGS.filter((l) => r[l].status && r[l].status !== 200)).length }, null, 2),
);
console.log(`wrote ${outDir}/{pages.csv,nearest-pairs.csv,summary.json,template-sentences.json,manual-sample.json,fetch-meta.json}`);
