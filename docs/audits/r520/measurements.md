# R520 实测：内容页底部链接 chip 收敛（同组 ≤30 + hub 链接）

R512 建议 #3 的落地取证。0 AI 调用（只 GET 内容页，UA 含 SiteAuditBot）。

## 修前（生产 hunt.zalize.com，2026-09-06 06:24 UTC，version 02404588）

```
node scripts/seo-audit/chip-measure.mjs /tld/com /guide/saas /vs/com-vs-cn --json docs/audits/r520/chip-measure-prod-before.json
```

| 页 | 语言 | HTML 字节 | 正文内 `<a>` 数 | 含链接词数 | 正文词数 | 链接占比 | 注入数据字节 |
|---|---|---|---|---|---|---|---|
| /tld/com | zh | 187,404 (183.0 KB) | 425 | 2539 | 840 | 66.9% | 4,832 |
| /tld/com | en | 187,853 (183.5 KB) | 425 | 2141 | 453 | 78.8% | 4,832 |
| /guide/saas | zh | 187,404 (183.0 KB) | 424 | 3396 | 1468 | 56.8% | 34,369 |
| /guide/saas | en | 189,394 (185.0 KB) | 424 | 1881 | 936 | 50.2% | 34,369 |
| /vs/com-vs-cn | zh | 188,294 (183.9 KB) | 458 | 2052 | 672 | 67.3% | 29,693 |
| /vs/com-vs-cn | en | 188,274 (183.9 KB) | 458 | 1739 | 372 | 78.6% | 29,693 |

底部「其他 …」全量块（zh 原始 HTML）：/tld/com 118,941 B / 408 `<a>`；/guide/saas 83,407 B / 410 `<a>`；/vs/com-vs-cn 96,160 B / 444 `<a>`。

## 修后（本地 `pnpm --filter web build` + `wrangler dev --port 8787`，commit f264857）

```
SEO_AUDIT_ORIGIN=http://127.0.0.1:8787 node scripts/seo-audit/chip-measure.mjs /tld/com /guide/saas /vs/com-vs-cn --json docs/audits/r520/chip-measure-local-after.json
```

| 页 | 语言 | HTML 字节 | 正文内 `<a>` 数 | 含链接词数 | 正文词数 | 链接占比 | 注入数据字节 |
|---|---|---|---|---|---|---|---|
| /tld/com | zh | 74,878 (73.1 KB) | 39 | 1000 | 840 | 16.0% | 4,832 |
| /tld/com | en | 74,860 (73.1 KB) | 39 | 598 | 453 | 24.2% | 4,832 |
| /guide/saas | zh | 80,720 (78.8 KB) | 32 | 1657 | 1468 | 11.4% | 7,297 |
| /guide/saas | en | 81,324 (79.4 KB) | 32 | 1040 | 936 | 10.0% | 7,297 |
| /vs/com-vs-cn | zh | 77,322 (75.5 KB) | 45 | 820 | 672 | 18.0% | 8,220 |
| /vs/com-vs-cn | en | 77,298 (75.5 KB) | 45 | 502 | 372 | 25.9% | 8,220 |

- HTML 全部 <90 KB（−58%～−60%）；链接占比 6 格中 5 格 <25%，/vs/com-vs-cn en 为 25.9%（en 下每个对比 chip「.com vs .cn」计 3 词、正文只有 372 词；zh 同页 18.0%）。
- 正文词数（proseWords）修前修后逐格相等：只删链接 chip，未动正文。

## 内链图（本地全量 1270 URL，`seo-graph-local.md`）

```
SEO_AUDIT_ORIGIN=http://127.0.0.1:8787 node scripts/seo-audit/fetch.mjs sample --seed 520 --per 15 --out ~/r520/seo-local
SEO_AUDIT_ORIGIN=http://127.0.0.1:8787 node scripts/seo-audit/fetch.mjs graph --out ~/r520/seo-local --concurrency 8
node scripts/seo-audit/analyze.mjs --out ~/r520/seo-local
```

| 指标 | R502（生产，修前） | R520（本地，修后） |
|---|---|---|
| 非 200 | 0 | 0 |
| BFS-B 从 / 可达 | 1270/1270 | 1270/1270 |
| 从 /+/tld+/guide+/vs 可达 | 1270/1270 | 1270/1270 |
| 孤岛 / 零入链页 | 0 / 0 | 0 / 0 |
| 全站内链总数 | 561,301 | 65,709 |
| 每页入链 min/中位/max | 410/416/1264 | 3/25/1264 |
| 内容页出链 min/中位/max | tld·guide·vs ≈ 426 | tld 33/50/58 · guide 27/55/55 · vs 20/50/55 |

| 组 | sitemap 页数 | 从 / 可达 | ≤3 跳可达 | 最大跳数 | 跳数分布 |
|---|---|---|---|---|---|
| core | 8 | 8 | 8 | 1 | 0跳×1 1跳×7 |
| tld | 408 | 408 | 408 | 2 | 1跳×8 2跳×400 |
| guide | 410 | 410 | 410 | 2 | 1跳×6 2跳×404 |
| vs | 444 | 444 | 444 | 2 | 1跳×4 2跳×440 |

入链最少（3）的页是只被 hub + 少数同组页指向的长尾对比页；全部经 hub 页 2 跳可达。
