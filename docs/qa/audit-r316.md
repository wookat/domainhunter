# R316 · 零 AI 全站生产审计（R311–R314 之后全站）

- 日期：2026-08-09（UTC 16:06–16:35）
- 对象：https://hunt.zalize.com（deploy/r192-r195 tip f649f1f，Worker 55b0fdf4）
- 预算纪律：**0 次 AI/DeepSeek 调用**——全程未触发 /api/ai-search、AI CTA、开始猎取/Start hunting、示例 prompt、refine/「再来一轮」任何入口；quick-check（精确核验 tab）/ bulk / MCP / share 全部走 RDAP/DNS/KV 非 AI 通道
- 方法：真实 Chrome（CDP/Playwright）全站走查 + curl SSR 抽查 + Lighthouse CLI（移动全量 + 桌面抽查）+ MCP JSON-RPC 直连 + 375px 视口仿真
- console 全程 **0 JS/应用级 error**（仅故意场景的 resource 日志：404 路由验证的 404、share 未知 id 的 404、撤销后的 410，均符合预期）
- 测试前备份 localStorage（3 个 key：lang/theme/shortlist），结束后逐键还原，re-dump 与备份 dict 相等 `STORAGE_IDENTICAL`

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | quick-check All 199 中 8 个 unknown chip（.icu/.lol/.fm/.best/.beauty/.help/.baby/.mom，RDAP/WHOIS 无解析类后缀，单 chip 重查机制正常、重查后仍 unknown，与 R297/R302/R310 同类目非回归）；/tld 移动 Lighthouse perf 两测均 89（R310 为 90，LCP 3.2s、TBT 0ms、CLS 0，内容 192→198 扩容后的边缘波动，观察项） |

## 硬约束核对：usage 零增量

- `usage-r316-pre.json`（16:07 UTC）与 `usage-r316-post.json`（16:31 UTC）经 JSON 解析后 **days 全表 dict 完全相等**（`DAYS_EQUAL: True`），全文件亦相等（`FULL_EQUAL: True`）。
- 两侧均为：`2026-08-09: searches 7, byTld {com:7,cn:7}, fast 6, refine 0, aiErrors {quota:4}`（与 R310 结束时完全一致，期间无任何会话消耗）。
- 整场审计大量 quick-check（含 All 199 全量）/ bulk / MCP / share 创建撤销 ×2 调用下 usage 全表不动，即 **0 次 AI 调用的直接硬证明**。

## 1. 当前内容口径（全 pass，与任务书 198/200/228、sitemap 634 完全一致）

| 面 | 任务书预期 | 实测 |
|---|---|---|
| /tld hub | 198 | 198（SSR「198 个后缀」h1 + 去重 198 个 /tld/ 链接；浏览器 DOM 同 198） `D-tld_hub_links.png` |
| /guide hub | 200 | 200（SSR「200 个行业」h1 + 去重 200 个 /guide/ 链接；DOM 同 200） `D-guide_hub_links.png` |
| /vs hub | 228 | 228（SSR「228 组」h1 + 去重 228 个 /vs/ 链接；DOM 同 228） `D-vs_hub_links.png` |
| llms.txt | 198/200/228 | 198/200/228（curl 计数） |
| sitemap.xml | 634 | 634 = 8 非内容页 + 198 tld + 200 guide + 228 vs，内部自洽 |
| quick-check All | 199 | 「共 199 个，191 个可注册」= 198 tld + com.cn；未知 8 `B3-quickcheck-all.png` |
| 首页行业 chips | 10+「+190」 | 10 个行业 chips + 「+190」（10+190=200 与 guide 口径一致） `A1-home-zh.png` |
| /prices | 198 行 | zh/en 均 198 行（DOM `main a[href^="/?tld="]`） `C1-prices-zh.png` / `C2-prices-en.png` |
| content-counts.json | 198/200/228 | 与线上完全一致 |

## 2. content guard（deploy tip f649f1f 本地，全 pass）

- `node scripts/check-content-counts.mjs`：TLD 198 ✓ / 行业指南 200 ✓ / 对比页 228 ✓「全部通过」。
- `node scripts/gen-hub-index.mjs --check`：hub-index-*.ts 与内容源一致（tld 198 / guide 200 / vs 228）。

## 3. 重点复核近期变更

### R311 六新 TLD（ltd/biz/llc/fyi/promo/express，全 pass）
- 六页 zh 全部 200、h1「.X 域名注册指南」、JSON-LD（BreadcrumbList+FAQPage）齐全；/tld/ltd、/tld/express 的 `?lang=en` 变体 200 + 英文 h1 + canonical 带 lang（`ssr-r316.json`）。截图 `E1-tld-ltd-zh.png`、`E2-tld-express-en.png`。
- quick-check All 已含 6 个新 TLD（共 199）；MCP `tld_prices` prices 198 键且 ltd/biz/llc/fyi/promo/express 全在；/prices 198 行含新后缀。

### R312 六新 /vs（tennis-vs-club 等，全 pass）
- tennis-vs-club / soccer-vs-club / football-vs-team / health-vs-care / family-vs-life / surf-vs-travel zh 全部 200、h1 正常、JSON-LD 3 段（BreadcrumbList+Article+FAQPage）；`?lang=en` 变体抽查（tennis-vs-club、health-vs-care）200 + 英文 h1。截图 `E3-vs-tennis-club-zh.png`、`E4-vs-health-care-en.png`。

### R313 六新 /guide（companyreg/consulting/wholesale/trading/coupon/flashsale，全 pass）
- 六页 zh 全部 200、h1 正常、JSON-LD 3 段；`?lang=en` 变体抽查（companyreg、flashsale）200 + 英文 h1。截图 `E5-guide-companyreg-zh.png`、`E6-guide-flashsale-en.png`。

### R314 share 404/410 CTA 与相对时间（全 pass）
- 创建（POST /api/share 2 域名，200）→ `/s/:id` 快照正常渲染：域名行 + 「复制 2 个可注册/Copy 2 available」+「导出 CSV/Export CSV」+ 首年价 + **「Created today」**相对时间（`H1-share-live.png`）；zh 侧另建 1 份验证 **「创建于今天」**（`H4-share-live-zh.png`）。
- 未知 id `/s/nonexistent316`：API **404**，UI 呈现错误态 + **CTA「Create your own shortlist / 去创建自己的候选清单」+ 说明文案**（`H3-share-404-cta.png`）。
- DELETE + revokeToken 撤销 200 `{ok:true}` → `GET /api/share/:id` **410** + UI「链接已失效」+ 同款 CTA（`H2-share-revoked.png`）。两份测试 share 均已撤销，未留残留。

## 4. quick-check（精确核验 tab，全 pass）

- 单名随机串：「核验完成：共 9 个，9 个可注册」。`B1-quickcheck-single.png`
- 两级后缀 `baidu.com.cn`：「共 10 个，0 个可注册」（baidu.com.cn 已注册）。`B2-quickcheck-baidu-com-cn.png`
- All 全量：「共 199 个，191 个可注册」= 198 tld + com.cn；未知 8。`B3-quickcheck-all.png`
- unknown 单域重试：unknown chip 带「重新核验」按钮，点击仅该 chip 单独重查，重查后仍 unknown（RDAP 无解析类后缀，见 P3-1）。`B4-before-recheck.png` / `B4b-after-recheck.png`

## 5. /prices（198 行、静态价口径、排序、live 态，全 pass）

- zh/en 均 198 行；live 行 58、静态行（≈ 标注）140。
- live 行 CNY 口径：58 行 × 注册/续费 116 组价格对，全部满足 `¥ = Math.round(USD×7.2)`，0 组不符。
- 静态行口径：内容源直写 CNY、USD 反推加 ≈（如 `.click ≈$2 / ¥11`、`.ink ≈$2 / ¥15`），与 R310 口径一致。
- 排序：默认按注册价升序（全表验证 `prices_default_sorted_asc: true`）；点「后缀/TLD」表头切字典序（`prices_tld_sorted: true`）。`C3-prices-sort-tld.png`

## 6. MCP（JSON-RPC 直连，全 pass）

- `initialize`：protocolVersion 2025-03-26，serverInfo domainhunter 1.0.0。`mcp-r316-initialize.json`
- `tools/list`：check_domains / tld_prices / suggest_variants 三工具。`mcp-r316-tools-list.json`
- `tld_prices`：**tldCount=198**，prices 全量 198 键，R311 六新 TLD 全在。`mcp-r316-prices.json`
- `check_domains`：google.com taken（2028-09-14）、baidu.com.cn taken（2029-02-15）、随机名 available。`mcp-r316-check.json`

## 7. 全站路由 zh/en、light/dark、375px、404、bulk、空态（全 pass）

- 主要路由 /、/prices、/tld、/guide、/vs、/why、/advanced 及全部新内容页 zh/en 200、h1 正常（`ssr-r316.json` 全表）。
- /shortlist、/monitors 空态正常渲染。`F2-shortlist.png` / `F3-monitors.png`
- light/dark：header 切 light 后 body bg `rgb(250,250,249)`、刷新持久、切回 dark `rgb(11,12,14)`。`I1-light-mode.png`
- 375px：/ `scrollWidth=375`、/prices、/tld、/vs/tennis-vs-club、/guide/companyreg 均 `360 ≤ 375` 无横向溢出。`K1–K5-375-*.png`
- SPA 404：未知顶层路径与未知 /tld、/guide、/vs slug 均 **HTTP 404 + 品牌 404 页**（注意：无 `Accept: text/html` 头的裸 curl 会得到空 body 404，浏览器/正常 UA+Accept 下为品牌页，非问题）。`G1/G2-404-*.png`
- /advanced bulk（非 AI）：google.com Taken + 随机名可注册，流式返回正常。`F5-advanced-bulk.png`
- PWA：`/site.webmanifest` 200（name/short_name/theme_color/icons 齐全）；robots.txt Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + sitemap 指向正确。

## 8. SEO（全 pass）

- canonical：/、/prices、三 hub、/why 及全部新内容页自指正确；`?lang=en` 变体 canonical 带 lang 参数、`og:locale en_US`、`<html lang="en">`（zh 侧 zh_CN）；hreflang zh-CN/en/x-default 三元组齐全（`ssr-r316.json`）。
- JSON-LD：首页 2 段（WebSite+FAQPage）；guide/vs 内容页 3 段（BreadcrumbList+Article+FAQPage）；/tld/:slug 2 段；/prices 2 段（BreadcrumbList+FAQPage），均可解析。

## 9. Lighthouse（移动全量 + 桌面抽查）

| 页面 | 移动 perf / a11y / BP / SEO | 桌面 |
|---|---|---|
| 首页 | **92**（复测 93）/ 100 / 96*（复测 100）/ 100 | 100 / 100 / 100 / 100 |
| /tld hub | **89**（复测 89，见 P3-2）/ 100 / 100 / 100 | — |
| /guide hub | **90** / 100 / 100 / 100 | — |
| /vs hub | **90** / 100 / 100 / 100 | — |
| /prices | **90** / 100 / 100 / 100 | 99 / 100 / 96*（复测 100）/ 100 |

- *best-practices 96 均由 inspector-issues（CSP report 噪声）触发，复测均 100，与 R302/R310 同类单次波动。
- 移动 perf 89–93 与 R310（90–92）同区间；/tld 89 见 P3-2。报告存档：`lighthouse-r316/`。

## 问题清单

### P3-1 quick-check All 199 中 8 个 unknown chip，重查后仍 unknown
- .icu/.lol/.fm/.best/.beauty/.help/.baby/.mom，RDAP/WHOIS 无解析或超时类后缀，与 R297（6 个）/R302/R310（8 个）完全同一名单；Recheck 机制本身正常（仅该 chip 单独重查），非本轮回归引入。

### P3-2 /tld hub 移动 perf 两测均 89（R310 为 90）
- LCP 3.2s / FCP 2.6s / TBT 0ms / CLS 0；内容 192→198 扩容后 hub 列表增长的边缘波动，桌面/其余页面均 ≥90，暂列观察项，不构成回归门槛。

## 附：取证文件

- `usage-r316-pre.json` / `usage-r316-post.json`（days dict 相等 `DAYS_EQUAL: True`、`FULL_EQUAL: True`）
- `storage-r316-backup.json` / `storage-r316-final.json`（逐键还原后 dict 相等 `STORAGE_IDENTICAL`）
- `ssr-r316.json`（全站 SSR canonical/hreflang/og:locale/JSON-LD/h1 抽查全表 + hub 链接计数 + 404 状态）
- `mcp-r316-initialize.json` / `mcp-r316-tools-list.json` / `mcp-r316-prices.json` / `mcp-r316-check.json`
- `findings-r316.json` / `findings-r316b.json`（浏览器走查断言全表：prices 排序/live CNY 口径/share 链路/主题/375px 等）
- `screenshots-r316/`（34 份截图）
- `lighthouse-r316/`（10 份 Lighthouse JSON）
- `ssr_check_r316.py` / `audit_browser_r316.py` / `audit_browser_r316b.py` / `dump_storage_r316.py` / `restore_storage_r316.py`（审计辅助脚本）
