# R297 · 零 AI 全站生产审计（R290–R296 之后全站）

- 日期：2026-08-09（UTC 10:50–11:30）
- 对象：https://hunt.zalize.com（deploy/r192-r195，Worker dcf4ce74）
- 预算纪律：**0 次 AI/DeepSeek 调用**（DeepSeek 402 欠费中）——全程未触发 /api/ai-search、AI CTA、Start hunting、示例 prompt、refine/「再来一轮」任何入口；quick-check / bulk / MCP 全部走 RDAP/DNS/WHOIS 非 AI 通道
- 方法：真实 Chrome（CDP/Playwright）全站走查 + curl SSR 抽查 + Lighthouse CLI（桌面+移动，5 页面各 3 次取中位）+ MCP JSON-RPC 直连三工具 + 375px 视口仿真
- console 全程 **0 JS/应用级 error**（唯一网络日志为故意验证 404 路由时的 resource 日志，符合预期）
- 测试前备份 localStorage/sessionStorage（3 个 local key），结束后**逐字节还原**（re-dump 与备份 diff 为空 `STORAGE_IDENTICAL`；?lang=en 走查后已回切，`domainhunter:lang` 终值与备份一致为 en）

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 3 | `.fm` unknown chip 重试后仍 unknown（RDAP 无解析类后缀，机制正常）；quick-check All 175 中 6 个 unknown（同类无解析后缀）；deploy 分支 #260/#261 两个 merge commit 上 content-guard 曾红（下一提交 059a4d3 注册 slug 后恢复绿，属提交顺序问题非内容回滚） |

## 硬约束核对：usage 零增量

- `usage-r297-pre.json`（10:49 UTC）与 `usage-r297-post.json`（11:25 UTC）经 JSON 解析后 days 全表 **dict 完全相等**（`DAYS_EQUAL: True`），`cronLast`/`indexnowLast` 亦未变化。
- 两侧均为：`2026-08-09: searches 7, byTld {com:7,cn:7}, fast 6, refine 0, aiErrors {quota:4}`；08-06/07/08 三天无变化。
- 整场审计大量 quick-check（含 All 175 全量）/ bulk / MCP 调用下 usage 全表不动，即 **0 次 AI 调用的直接硬证明**。

## 1. 当前内容口径（全 pass，与任务书完全一致）

| 面 | 任务书预期 | 实测 |
|---|---|---|
| /tld hub | 174 | 174（SSR「174 个后缀」+ 174 个 /tld/ 链接） `D1-tld-hub-en.png` |
| /guide hub | 176 | 176（SSR「176 个行业」+ 176 个 /guide/ 链接） `D2-guide-hub-en.png` |
| /vs hub | 204 | 204（SSR「204 组」+ 204 个 /vs/ 链接） `D3-vs-hub-en.png` |
| footer | 174/176/204 | 去重后 174/176/204（DOM 实测） |
| llms.txt | 174/176/204 | 174/176/204（curl 计数） |
| sitemap.xml | 562 | 562 = 8 非内容页 + 174 + 176 + 204，内部自洽 |
| quick-check All | 175 | 「All 175」（10 基础 + Check 166 more TLDs） `B3-quickcheck-all-175.png` |
| 首页行业 chips | 10+「+166」 | 10 个行业 chips + 「+166」（10+166=176 与 guide 口径一致） `A1-home-chips-10-plus166.png` |
| /prices | 174 行 | 174 行（DOM 实测 174 个 TLD 链接行） `C1-prices-174.png` |

- /prices 静态行 CNY 直显抽查：`.click ≈$2 / ¥11`——若 CNY 由 USD 换算应为 round(2×7.2)=14，实显 ¥11 与内容源直写 CNY 一致，**无 CNY→USD→CNY 往返伪差**；live 行抽查 `.top $1.63→¥12`、`.online $1.96→¥14 / $28.84→¥208` 均等于 `Math.round(USD×7.2)`，USD 基准与 MCP `tld_prices`（tldCount=174）逐一相符。

## 2. 新护栏（R294，全 pass）

- 本地 clone（059a4d3）`node scripts/check-content-counts.mjs`：TLD 174 ✓ / 指南 176 ✓ / 对比 204 ✓「全部通过」；`node scripts/gen-hub-index.mjs --check` 亦一致。
- content-guard.yml 在最近 PR（r298 分支 pull_request run 31309546382）**绿勾 success**；deploy 分支 head 059a4d3 push run 亦 success。
- 注：#260/#261 两个 merge commit 的 push run 曾 failure——r295/r296 slug 当时尚未注册进 content-counts.json，随后 059a4d3 同步提交注册后恢复绿。护栏按设计拦截了「计数与事实源不一致」状态，属提交顺序问题，非内容回滚（见 P3-3）。

## 3. 全站路由 zh/en、light/dark、375px（全 pass）

- 主要路由 /、/prices、/tld、/guide、/vs、/why、/shortlist（空态）、/monitors（空态）、/advanced 及内容页 /tld/ai、/tld/energy（R296 新增行业相关 TLD）、/guide/hvac（R296 新增）、/vs/energy-vs-solar（R295 新增）zh/en 全部 HTTP 200、h1 正常渲染（zh 首页「说出寓意，猎到真正可注册的好域名」/en 对应文案）。`F0–F5`、`D1–D3`、`E1–E3` 截图。
- light/dark：切 light 后 body bg `rgb(250,250,249)`、切回 dark `rgb(11,12,14)`，刷新持久。`I1-light-en.png`
- 375px：/、/prices、/tld、/vs/energy-vs-solar `scrollWidth ≤ 375`（实测 360）无横向溢出；header 触点 44px 达标。`K1–K4-375-*.png`
- SPA 404：未知顶层路径与未知 /tld slug 均 **HTTP 404 + 品牌 404 页**。`G1/G2-404-*.png`
- 分享链路：POST /api/share 创建（2 域名）→ /s/:id 快照渲染（`H1-share-live.png`）→ DELETE revokeToken 撤销 `{ok:true}` → `GET /api/share/:id` **410 revoked** + UI「This link is no longer active」（`H2-share-revoked.png`）→ 未知 id API 404。revoke token 未落任何仓库文件（用后即删）。
- /advanced bulk：google.com taken（expires 2028-09-14）+ 随机名 available，流式返回正常。`F5-advanced-bulk.png`

## 4. quick-check（全 pass）

- 单名随机串：10 chips 全 Available（含 `.sh` 本轮直接 Available，R289 的 P3 类目未复现）。`B1-quickcheck-single.png`
- 两级后缀 `baidu.com.cn`：直接核验已注册，到期日 2029-02-15（另带出 baidu.com 2028-10-11）。`B2-quickcheck-baidu-com-cn.png`
- All 全量：「All 175」= tld-list 174 + com.cn，Available 169 / Unknown 6。`B3-quickcheck-all-175.png`
- unknown 单域重试：`.fm` unknown chip 带 `Recheck` 按钮，点击仅该 chip 单独重查（重查后仍 unknown，RDAP 无解析类后缀，见 P3-1）。`B4/B4b-*.png`

## 5. MCP 三工具（JSON-RPC 直连，全 pass）

- `tools/list` 返回三工具 schema。`mcp-tools-list.json`
- `tld_prices`：**tldCount=174**，prices 全量 174 键。`mcp-prices.json`
- `check_domains`：google.com taken（2028-09-14）、baidu.com.cn taken（2029-02-15）、随机名 available。`mcp-check-domains.json`
- `suggest_variants`：acme/com limit 8 → 恰 8 个 results（含实时可用性与首年价）。`mcp-suggest-variants.json`

## 6. SEO（全 pass）

- canonical：/、/prices、/why、/tld/ai、/tld/energy、/guide/saas、/guide/hvac、/vs/com-vs-cn、/vs/energy-vs-solar 自指正确；`?lang=en` 变体 canonical 带 lang 参数、`og:locale en_US`、`<html lang="en">`（zh 侧 zh_CN）；hreflang zh-CN/en/x-default 三元组齐全。
- JSON-LD：首页 WebSite+SearchAction+FAQPage；guide/vs 内容页 BreadcrumbList+Article+FAQPage；/tld/:slug BreadcrumbList+FAQPage；/prices BreadcrumbList+FAQPage，均可解析。
- sitemap.xml 562 条与站点结构一致；robots.txt Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + sitemap 指向正确；OG 各页正常。

## 7. Lighthouse（perf / a11y / best-practices / SEO，各 3 次取中位）

| 页面 | 桌面（中位） | 移动（中位，3 次原始值） |
|---|---|---|
| 首页 | 100 / 100 / 100 / 100 | **92** / 100 / 100 / 100（94/92/90） |
| /prices | 100 / 100 / 100 / 100 | **90** / 100 / 100 / 100（90/91/90） |
| /tld hub | 100 / 100 / 100 / 100 | **90** / 100 / 100 / 100（90/90/90） |
| /guide hub | 100 / 100 / 100 / 100 | **90** / 100 / 100 / 100（91/90/90） |
| /vs hub | 100 / 100 / 100 / 100 | **91** / 100 / 100 / 100（91/90/92） |

- 桌面 5 页全 100×4；移动 a11y/bp/seo 全 100，无单次波动。报告存档：`lighthouse-r297/`（30 份 report.json）。
- 较 R289：/prices 移动 perf 86→90（脱离 P3 区间），/vs 移动 best-practices 无 96 单次噪声复现；内容扩容至 174/176/204 后 hub 移动 perf 稳定 90–92 未回落。

## 问题清单

### P3-1 `.fm` unknown chip 重试后仍 unknown
- Recheck 机制本身正常（仅该 chip 单独重查）；`.fm` 属 RDAP 无解析类后缀，为既有已知类目，非本轮回归引入。R289 的 `.sh` 本轮已直接 Available。

### P3-2 quick-check All 175 中 6 个 unknown
- 与 P3-1 同类（RDAP/WHOIS 无解析或超时后缀），Available 169 / Unknown 6，机制与提示文案（"possibly a registry-reserved domain, a timeout, or an unresponsive WHOIS"）正常。

### P3-3 deploy 分支 #260/#261 merge commit 上 content-guard 曾红
- r295/r296 内容先合、content-counts.json 注册后补（059a4d3），两个 merge commit 的 push run 短暂 failure，head 已绿。建议后续扩容 PR 内同步更新 content-counts.json，避免 deploy 分支出现红色区间。

## 附：取证文件

- `usage-r297-pre.json` / `usage-r297-post.json`（days dict 相等，cronLast/indexnowLast 不变）
- `storage-r297-backup.json` / `storage-r297-final.json`（逐字节一致 `STORAGE_IDENTICAL`）
- `screenshots-r297/`（33 份截图 + MCP/share JSON 取证，share revoke token 未入库）
- `lighthouse-r297/`（30 份 Lighthouse JSON）
