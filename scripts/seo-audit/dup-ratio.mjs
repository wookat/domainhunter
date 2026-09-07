#!/usr/bin/env node
// R519 页内复读率单页复算：对指定内容页（zh 裸路径 + en ?lang=en）用 thin-analyze.mjs 完全相同的口径
// （<main> 去 nav/header/footer/aside/script/svg，去 <a>…</a>，块级断句 + 。！？!?；; 与 ". X" 切句，≥4 字符计一句，
//   dupSentenceRatio = 1 - unique/total）算 dupSentenceRatio，并列出被复读的句子。0 AI：只 GET 页面。
//
//   node scripts/seo-audit/dup-ratio.mjs /tld/com /tld/at /vs/com-vs-cn /guide/saas            # 生产
//   SEO_AUDIT_ORIGIN=http://127.0.0.1:8787 node scripts/seo-audit/dup-ratio.mjs /tld/com ...    # 本地 wrangler dev
//   --json <file>  另存每页明细（句子/重复句/FAQ 条数）；--quiet 不打印重复句
//
// 默认页面集 = R519 任务指定的 4 页。

import { writeFile } from "node:fs/promises";
import { SITE_ORIGIN, decodeEntities, fetchText, stripInvisible } from "./lib.mjs";

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const jsonOut = opt("json");
const quiet = args.includes("--quiet");
const paths = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--json");
const PAGES = paths.length ? paths : ["/tld/com", "/tld/at", "/vs/com-vs-cn", "/guide/saas"];
const LANGS = ["zh", "en"];

const stripTags = (h) => decodeEntities(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** 与 scripts/seo-audit/thin-analyze.mjs extract() 同步；改一处必须同步另一处 */
export function extractSentences(html) {
  let h = stripInvisible(html);
  const main = h.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? "";
  h = main.replace(/<(header|nav|footer|aside)\b[\s\S]*?<\/\1>/gi, " ");
  const faqDetails = (h.match(/<details\b/gi) ?? []).length;
  const proseHtml = h.replace(/<table\b[\s\S]*?<\/table>/gi, " ").replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " ");
  const blocky = proseHtml.replace(/<\/(p|li|h[1-6]|summary|details|div|section|td|th|tr|dt|dd|blockquote)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n");
  const lines = decodeEntities(blocky.replace(/<[^>]+>/g, " "))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const sentences = lines
    .flatMap((l) => l.split(/(?<=[。！？!?；;])\s*|(?<=\.)\s+(?=[A-Z"“])/))
    .map((s) => s.trim())
    .filter((s) => s.replace(/[\s\p{P}]/gu, "").length >= 4)
    .map((s) => s.replace(/\s+/g, " "));
  let faqLd = 0;
  let faqLdValid = true;
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      const nodes = Array.isArray(j["@graph"]) ? j["@graph"] : [j];
      for (const n of nodes) if (n["@type"] === "FAQPage" && Array.isArray(n.mainEntity)) faqLd += n.mainEntity.length;
    } catch {
      faqLdValid = false;
    }
  }
  return { sentences, faqDetails, faqLd, faqLdValid, proseText: stripTags(proseHtml) };
}

export function dupStats(sentences) {
  const seen = new Map();
  for (const s of sentences) seen.set(s, (seen.get(s) ?? 0) + 1);
  const dups = [...seen.entries()].filter(([, n]) => n > 1).map(([s, n]) => ({ s, n }));
  const total = sentences.length;
  const unique = seen.size;
  return { total, unique, dupSentenceRatio: total ? Math.round((1 - unique / total) * 1000) / 1000 : 0, dups };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = [];
  const detail = [];
  for (const path of PAGES) {
    for (const lang of LANGS) {
      const url = `${SITE_ORIGIN}${path}${lang === "en" ? "?lang=en" : ""}`;
      const r = await fetchText(url);
      if (r.status !== 200) {
        rows.push({ path, lang, status: r.status });
        continue;
      }
      const ex = extractSentences(r.text);
      const st = dupStats(ex.sentences);
      rows.push({ path, lang, status: 200, total: st.total, unique: st.unique, dup: `${(st.dupSentenceRatio * 100).toFixed(1)}%`, faqDetails: ex.faqDetails, faqLd: ex.faqLd, faqLdValid: ex.faqLdValid });
      detail.push({ url, ...st, faqDetails: ex.faqDetails, faqLd: ex.faqLd, faqLdValid: ex.faqLdValid, sentences: ex.sentences });
      if (!quiet && st.dups.length) {
        console.log(`\n# ${url}  dup ${(st.dupSentenceRatio * 100).toFixed(1)}% (${st.total - st.unique}/${st.total})`);
        for (const d of st.dups) console.log(`  ×${d.n}  ${d.s.length > 110 ? d.s.slice(0, 110) + "…" : d.s}`);
      }
    }
  }
  console.log(`\norigin ${SITE_ORIGIN}`);
  console.table(rows);
  if (jsonOut) await writeFile(jsonOut, JSON.stringify({ origin: SITE_ORIGIN, at: new Date().toISOString(), rows, detail }, null, 2));
}
