#!/usr/bin/env node
// R488：对 fetch.mjs 抓到的样本做度量，输出 out/report.json + out/report.md（表格可直接贴进 docs/audits）。
//   node scripts/seo-audit/analyze.mjs [--out scripts/seo-audit/out]
// 度量项：正文可见字数（去导航/页脚/内链 chip）、页间 5-shingle Jaccard 相似度、title/description/H1 唯一性与长度、
// canonical/hreflang 一致性、站内链接数量与 lang 参数占比、JSON-LD 类型；若存在 graph.json 则做 BFS 孤岛分析。

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SITE_ORIGIN, extractText, internalLinks, jaccard, mean, median, meta, pct, shingles, stripLang, wordCount } from "./lib.mjs";

const args = process.argv.slice(2);
const out = args.includes("--out") ? args[args.indexOf("--out") + 1] : "scripts/seo-audit/out";
const sample = JSON.parse(await readFile(join(out, "sample.json"), "utf8"));

const rows = [];
for (const p of sample.pages) {
  for (const lang of ["zh", "en"]) {
    const html = await readFile(join(out, "html", `${p.id}.${lang}.html`), "utf8");
    const m = meta(html);
    const { mainText, proseText } = extractText(html);
    const links = internalLinks(html);
    const expectedCanonical = `${SITE_ORIGIN}${p.path}${lang === "en" ? "?lang=en" : ""}`;
    const hl = Object.fromEntries(m.hreflang.map((x) => [x.lang, x.href]));
    rows.push({
      group: p.group,
      path: p.path,
      lang,
      status: p[lang].status,
      bytes: p[lang].bytes,
      vary: p[lang].vary,
      ...m,
      h1Count: m.h1.length,
      h1: m.h1.join(" | "),
      titleLen: m.title.length,
      descLen: m.description.length,
      main: wordCount(mainText),
      prose: wordCount(proseText),
      proseText,
      canonicalOk: m.canonical === expectedCanonical,
      hreflangOk: hl.zh === `${SITE_ORIGIN}${p.path}` && hl.en === `${SITE_ORIGIN}${p.path}?lang=en` && hl["x-default"] === `${SITE_ORIGIN}${p.path}`,
      hreflangCount: m.hreflang.length,
      links: links.length,
      linksUnique: new Set(links).size,
      linksWithLang: links.filter((l) => /[?&]lang=/.test(l)).length,
      linksBareContent: links.filter((l) => !/[?&]lang=/.test(l) && /^\/(tld|guide|vs|prices|why|mcp)(\/|$)/.test(l)).length,
    });
  }
}

// —— 相似度：每组（tld/guide/vs）内、同语言、两两 5-shingle Jaccard；额外算"模板骨架占比"= 出现在 ≥50% 页面的 shingle 占本页 shingle 的比例
const sim = {};
for (const group of ["tld", "guide", "vs"]) {
  for (const lang of ["zh", "en"]) {
    const rs = rows.filter((r) => r.group === group && r.lang === lang);
    const sets = rs.map((r) => shingles(r.proseText));
    const pair = [];
    for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) pair.push({ a: rs[i].path, b: rs[j].path, j: jaccard(sets[i], sets[j]) });
    const freq = new Map();
    for (const s of sets) for (const x of s) freq.set(x, (freq.get(x) ?? 0) + 1);
    const boiler = sets.map((s) => {
      let n = 0;
      for (const x of s) if ((freq.get(x) ?? 0) >= Math.ceil(sets.length / 2)) n++;
      return s.size ? n / s.size : 0;
    });
    pair.sort((a, b) => b.j - a.j);
    sim[`${group}.${lang}`] = { pairs: pair.length, mean: mean(pair.map((x) => x.j)), median: median(pair.map((x) => x.j)), max: pair[0], min: pair[pair.length - 1], boilerplateShare: mean(boiler), top3: pair.slice(0, 3) };
  }
}

// —— 唯一性
const uniq = {};
for (const lang of ["zh", "en"]) {
  const rs = rows.filter((r) => r.lang === lang);
  const dup = (key) => {
    const c = new Map();
    for (const r of rs) c.set(r[key], (c.get(r[key]) ?? 0) + 1);
    return [...c.entries()].filter(([, n]) => n > 1).map(([v, n]) => ({ value: v, n }));
  };
  uniq[lang] = {
    pages: rs.length,
    dupTitles: dup("title"),
    dupDescriptions: dup("description"),
    dupH1: dup("h1"),
    titleLen: { min: Math.min(...rs.map((r) => r.titleLen)), median: median(rs.map((r) => r.titleLen)), max: Math.max(...rs.map((r) => r.titleLen)) },
    descLen: { min: Math.min(...rs.map((r) => r.descLen)), median: median(rs.map((r) => r.descLen)), max: Math.max(...rs.map((r) => r.descLen)) },
    h1NotOne: rs.filter((r) => r.h1Count !== 1).map((r) => ({ path: r.path, h1Count: r.h1Count })),
    canonicalBad: rs.filter((r) => !r.canonicalOk).map((r) => ({ path: r.path, canonical: r.canonical })),
    hreflangBad: rs.filter((r) => !r.hreflangOk).map((r) => ({ path: r.path, hreflang: r.hreflang })),
    robots: [...new Set(rs.map((r) => r.robots || "(none)"))],
    vary: [...new Set(rs.map((r) => r.vary || "(none)"))],
  };
}

// —— 图 / BFS
let graph = null;
if (existsSync(join(out, "graph.json"))) {
  const g = JSON.parse(await readFile(join(out, "graph.json"), "utf8"));
  const sitemap = new Set(g.nodes.map((n) => n.path));
  const adjRaw = new Map(g.nodes.map((n) => [n.path, n.links]));
  // 逻辑图：把 ?lang=zh|en 去掉后落到 sitemap 裸路径
  const adjLogical = new Map(g.nodes.map((n) => [n.path, [...new Set(n.links.map(stripLang).map((l) => l.split("?")[0]).filter((l) => sitemap.has(l)))]]));
  const bfs = (adj, starts) => {
    const seen = new Set(starts.filter((s) => adj.has(s)));
    const q = [...seen];
    while (q.length) {
      const cur = q.shift();
      for (const nx of adj.get(cur) ?? []) if (!seen.has(nx)) { seen.add(nx); q.push(nx); }
    }
    return seen;
  };
  // 原始图（不改写 href）：只有 href 精确等于 sitemap 裸路径才算命中
  const adjRawExact = new Map(g.nodes.map((n) => [n.path, [...new Set(n.links.filter((l) => sitemap.has(l)))]]));
  const inboundLogical = new Map([...sitemap].map((p) => [p, 0]));
  for (const [, ls] of adjLogical) for (const l of ls) inboundLogical.set(l, inboundLogical.get(l) + 1);
  const fromHomeExact = bfs(adjRawExact, ["/"]);
  const fromHomeLogical = bfs(adjLogical, ["/"]);
  const fromHubsLogical = bfs(adjLogical, ["/", "/tld", "/guide", "/vs"]);
  const totalLinks = g.nodes.reduce((n, x) => n + x.links.length, 0);
  const langLinks = g.nodes.reduce((n, x) => n + x.links.filter((l) => /[?&]lang=/.test(l)).length, 0);
  graph = {
    fetchedAt: g.fetchedAt,
    sitemapCount: g.sitemapCount,
    non200: g.nodes.filter((n) => n.status !== 200).map((n) => ({ path: n.path, status: n.status })),
    homeRawLinks: adjRaw.get("/")?.length ?? 0,
    totalLinks,
    langLinks,
    langLinkShare: totalLinks ? langLinks / totalLinks : 0,
    reachableFromHomeExact: fromHomeExact.size,
    reachableFromHomeLogical: fromHomeLogical.size,
    reachableFromHubsLogical: fromHubsLogical.size,
    unreachableFromHubsLogical: [...sitemap].filter((p) => !fromHubsLogical.has(p)),
    zeroInboundLogical: [...inboundLogical].filter(([, n]) => n === 0).map(([p]) => p),
    inboundStats: { median: median([...inboundLogical.values()]), min: Math.min(...inboundLogical.values()), max: Math.max(...inboundLogical.values()) },
    outLinksPerPage: { median: median(g.nodes.map((n) => n.links.length)), min: Math.min(...g.nodes.map((n) => n.links.length)), max: Math.max(...g.nodes.map((n) => n.links.length)) },
  };
}

const report = { generatedAt: new Date().toISOString(), sample: { fetchedAt: sample.fetchedAt, seed: sample.seed, per: sample.per, sitemapCount: sample.sitemapCount, groupCounts: sample.groupCounts }, uniq, sim, graph, rows: rows.map(({ proseText, hreflang, h2Count, ...r }) => r) };
await writeFile(join(out, "report.json"), JSON.stringify(report, null, 2));

// —— Markdown
const md = [];
md.push(`# R488 SEO 取样度量（自动生成 ${report.generatedAt}）`, "");
md.push(`- 抓取时间 ${sample.fetchedAt}，seed=${sample.seed}，sitemap ${sample.sitemapCount} URL（tld ${sample.groupCounts.tld} / guide ${sample.groupCounts.guide} / vs ${sample.groupCounts.vs}），每组随机 ${sample.per} 页 + core 7 页，每页 zh（裸路径）与 en（?lang=en）各抓一次。`, "");
md.push("## 正文字数（去 header/nav/footer/script；prose = 再去掉所有 <a> 链接文本）", "");
md.push("| 组 | 语言 | n | main 词数 中位 (min–max) | prose 词数 中位 (min–max) | prose 字符 中位 | 内链数 中位 | 内链带 ?lang 占比 |", "|---|---|---|---|---|---|---|---|");
for (const group of ["core", "tld", "guide", "vs"]) for (const lang of ["zh", "en"]) {
  const rs = rows.filter((r) => r.group === group && r.lang === lang);
  const f = (k, sub) => `${median(rs.map((r) => r[k][sub]))} (${Math.min(...rs.map((r) => r[k][sub]))}–${Math.max(...rs.map((r) => r[k][sub]))})`;
  const links = rs.reduce((n, r) => n + r.links, 0);
  md.push(`| ${group} | ${lang} | ${rs.length} | ${f("main", "words")} | ${f("prose", "words")} | ${median(rs.map((r) => r.prose.chars))} | ${median(rs.map((r) => r.links))} | ${pct(links ? rs.reduce((n, r) => n + r.linksWithLang, 0) / links : 0)} |`);
}
md.push("", "## 页间正文相似度（组内两两，prose 文本 5-字符 shingle Jaccard）", "");
md.push("| 组.语言 | 对数 | 均值 | 中位 | 最大 (哪两页) | 最小 | 模板骨架占比* |", "|---|---|---|---|---|---|---|");
for (const [k, v] of Object.entries(sim)) md.push(`| ${k} | ${v.pairs} | ${pct(v.mean)} | ${pct(v.median)} | ${pct(v.max.j)} (${v.max.a} ↔ ${v.max.b}) | ${pct(v.min.j)} | ${pct(v.boilerplateShare)} |`);
md.push("", "\\* 模板骨架占比 = 出现在组内 ≥50% 页面的 shingle 在本页 shingle 中的比例（组内均值），越高说明共享套话越多。", "");
md.push("## title / description / H1 / canonical / hreflang", "");
for (const lang of ["zh", "en"]) {
  const u = uniq[lang];
  md.push(`- **${lang}**（${u.pages} 页）：title 重复 ${u.dupTitles.length} 组，description 重复 ${u.dupDescriptions.length} 组，H1 重复 ${u.dupH1.length} 组；title 长度 ${u.titleLen.min}/${u.titleLen.median}/${u.titleLen.max}（min/中位/max 字符），description ${u.descLen.min}/${u.descLen.median}/${u.descLen.max}；H1≠1 的页：${u.h1NotOne.length ? u.h1NotOne.map((x) => `${x.path}(${x.h1Count})`).join(", ") : "无"}；canonical 不符预期：${u.canonicalBad.length ? u.canonicalBad.map((x) => `${x.path}→${x.canonical}`).join(", ") : "0"}；hreflang 三元组不完整/不一致：${u.hreflangBad.length}；robots meta：${u.robots.join(", ")}；Vary 响应头：${u.vary.join(", ")}。`);
  for (const d of [...u.dupTitles, ...u.dupDescriptions, ...u.dupH1]) md.push(`  - 重复值（×${d.n}）：${d.value.slice(0, 120)}`);
}
md.push("", "## 逐页明细", "");
md.push("| 页 | 语言 | title(len) | desc len | H1 | prose 词 | 内链 | JSON-LD | canonical✓ | hreflang✓ |", "|---|---|---|---|---|---|---|---|---|---|");
for (const r of rows) md.push(`| ${r.path} | ${r.lang} | ${r.title.slice(0, 60)} (${r.titleLen}) | ${r.descLen} | ${r.h1.slice(0, 40)} | ${r.prose.words} | ${r.links} | ${r.jsonld.join("+") || "-"} | ${r.canonicalOk ? "✓" : "✗ " + r.canonical} | ${r.hreflangOk ? "✓" : "✗"} |`);
if (graph) {
  md.push("", "## 内链图 / BFS 孤岛（sitemap 全量 " + graph.sitemapCount + " URL，裸路径、无 JS 渲染）", "");
  md.push(`- 抓取 ${graph.fetchedAt}；非 200：${graph.non200.length ? JSON.stringify(graph.non200) : "0"}`);
  md.push(`- 首页原始 HTML 内的 <a> 站内链接数：**${graph.homeRawLinks}**`);
  md.push(`- 全站内链总数 ${graph.totalLinks}，其中 href 带 ?lang= 的 ${graph.langLinks}（${pct(graph.langLinkShare)}）`);
  md.push(`- BFS-A（严格：href 必须精确等于 sitemap 裸路径）从 / 出发可达：**${graph.reachableFromHomeExact}/${graph.sitemapCount}**`);
  md.push(`- BFS-B（逻辑：去掉 ?lang 参数后落到裸路径）从 / 出发可达：**${graph.reachableFromHomeLogical}/${graph.sitemapCount}**；从 /+/tld+/guide+/vs 出发可达：**${graph.reachableFromHubsLogical}/${graph.sitemapCount}**`);
  md.push(`- BFS-B 下不可达（孤岛）：${graph.unreachableFromHubsLogical.length ? graph.unreachableFromHubsLogical.join(", ") : "无"}；入链为 0 的页：${graph.zeroInboundLogical.length ? graph.zeroInboundLogical.join(", ") : "无"}`);
  md.push(`- 每页入链（逻辑图）min/中位/max：${graph.inboundStats.min}/${graph.inboundStats.median}/${graph.inboundStats.max}；每页出链 min/中位/max：${graph.outLinksPerPage.min}/${graph.outLinksPerPage.median}/${graph.outLinksPerPage.max}`);
}
await writeFile(join(out, "report.md"), md.join("\n") + "\n");
console.log(md.join("\n"));
