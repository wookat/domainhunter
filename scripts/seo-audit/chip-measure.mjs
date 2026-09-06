#!/usr/bin/env node
// R520：内容页「链接 chip 重量」单页度量（0 AI；只 GET 内容页，不触碰 /api/ai-search）。
//
//   node scripts/seo-audit/chip-measure.mjs /tld/com /guide/saas /vs/com-vs-cn [--lang zh,en] [--json out.json]
//   SEO_AUDIT_ORIGIN=http://127.0.0.1:8787 node scripts/seo-audit/chip-measure.mjs /tld/com …   → 对本地 wrangler dev 跑同一套度量
//
// 指标定义（与 R512 thin-analyze.mjs §4.1 同源，可直接对照）：
//   bytes        = 响应 HTML 字节数（UTF-8）
//   bodyWords    = <main> 去 header/nav/footer/aside、script/style/svg 后的可见词数（含链接文字）
//   proseWords   = 再去掉所有 <a>…</a> 后的词数（正文）
//   linkShare    = 1 − proseWords / bodyWords（「链接 chip 占可见正文」）
//   bodyLinks    = 同一范围内 <a href> 数（含相关/同组/站内导航等所有链接 chip）
//   injectedBytes= <script>window.__DH_CONTENT__=…</script> 的字节数（随页注入的数据体积）
// UA 见 lib.mjs：含 SiteAuditBot，被生产按 botsBy.other 计数，不进人类 pageviews。

import { writeFile } from "node:fs/promises";
import { SITE_ORIGIN, extractText, fetchText, internalLinks, pct, stripInvisible, wordCount } from "./lib.mjs";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const langs = opt("lang", "zh,en").split(",");
const jsonOut = opt("json", "");
const paths = args.filter((a, i) => a.startsWith("/") && !(i > 0 && args[i - 1].startsWith("--")));
if (!paths.length) {
  console.error("usage: chip-measure.mjs /tld/com [/guide/saas …] [--lang zh,en] [--json out.json]");
  process.exit(2);
}

/** 与 lib.extractText 同范围（<main> 去 header/nav/footer/aside）内的 <a href> 列表 */
function bodyLinkList(html) {
  let h = stripInvisible(html);
  const main = h.match(/<main\b[\s\S]*?<\/main>/i);
  h = main ? main[0] : (h.match(/<body\b[\s\S]*?<\/body>/i)?.[0] ?? h);
  h = h.replace(/<(header|nav|footer|aside)\b[\s\S]*?<\/\1>/gi, " ");
  return internalLinks(h);
}

const rows = [];
for (const p of paths) {
  for (const lang of langs) {
    const url = `${SITE_ORIGIN}${p}${lang === "en" ? (p.includes("?") ? "&" : "?") + "lang=en" : ""}`;
    const r = await fetchText(url);
    if (r.status !== 200) {
      rows.push({ path: p, lang, url, status: r.status });
      continue;
    }
    const { mainText, proseText } = extractText(r.text);
    const body = wordCount(mainText).words;
    const prose = wordCount(proseText).words;
    const injected = r.text.match(/<script>window\.__DH_CONTENT__=[\s\S]*?<\/script>/)?.[0] ?? "";
    rows.push({
      path: p,
      lang,
      url,
      status: r.status,
      bytes: Buffer.byteLength(r.text),
      bodyWords: body,
      proseWords: prose,
      linkShare: body ? 1 - prose / body : 0,
      bodyLinks: bodyLinkList(r.text).length,
      injectedBytes: Buffer.byteLength(injected),
    });
  }
}

console.log(`origin ${SITE_ORIGIN} · ${new Date().toISOString()}`);
console.log("| 页 | 语言 | HTML 字节 | 正文内 <a> 数 | 含链接词数 | 正文词数 | 链接占比 | 注入数据字节 |");
console.log("|---|---|---|---|---|---|---|---|");
for (const r of rows) {
  if (r.status !== 200) {
    console.log(`| ${r.path} | ${r.lang} | HTTP ${r.status} | | | | | |`);
    continue;
  }
  console.log(`| ${r.path} | ${r.lang} | ${r.bytes.toLocaleString("en-US")} (${(r.bytes / 1024).toFixed(1)} KB) | ${r.bodyLinks} | ${r.bodyWords} | ${r.proseWords} | ${pct(r.linkShare)} | ${r.injectedBytes.toLocaleString("en-US")} |`);
}
if (jsonOut) await writeFile(jsonOut, JSON.stringify({ origin: SITE_ORIGIN, measuredAt: new Date().toISOString(), rows }, null, 2));
