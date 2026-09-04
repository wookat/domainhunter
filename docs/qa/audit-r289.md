# R289 · 零 AI 全站生产审计（R280–R286 之后全站，含 R287/R288）

- 日期：2026-08-09（UTC 08:45–10:00）
- 对象：https://hunt.zalize.com（deploy/r192-r195，Worker 04ee81dd）
- 预算纪律：**0 次 AI/DeepSeek 调用**——全程未触发 /api/ai-search、AI CTA、Start hunting、示例 prompt、refine 任何入口；quick-check / bulk / MCP 全部走 RDAP/DNS/WHOIS 非 AI 通道
- 方法：真实 Chrome（CDP）全站走查 + curl SSR 抽查 + Lighthouse CLI（桌面+移动，hub 三页移动各 3 次取中位）+ MCP JSON-RPC 直连三工具 + 375px 视口仿真
- console 全程 **0 JS/应用级 error**（唯一网络日志为故意验证 404/410 端点时的 resource 日志，符合预期）
- 测试前备份 localStorage/sessionStorage（3 个 local key），结束后**逐字节还原**（re-dump 与备份 diff 为空，含浏览器重启后二次核验 `STORAGE_IDENTICAL_AFTER_RESTART`）

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 3 | /prices 移动 perf 86（85–89 区间）；`.sh` unknown chip 重试后仍 unknown（RDAP 无解析类后缀，机制本身正常）；/vs 移动单次 best-practices 96（其余全 100，单次噪声） |

## 口径更正（相对任务书）

任务书预期 sitemap 526、llms.txt 168/158/192 基于 R286 时点；deploy/r192-r195 随后合入 **R287（guide 158→164）与 R288（cardLine 截断）**，故实测口径为：

| 面 | 任务书预期 | 实测（与 R287 后口径一致） |
|---|---|---|
| /tld hub | 168 | 168（SSR title「168 个后缀」+ 168 个 /tld/ 链接） `D1-tld-hub-168.png` |
| /guide hub | 158 | **164**（R287 +6：realtor/propertymgmt/apartment/construction/appliancerepair/equipmentrental） `D2-guide-hub-164.png` |
| /vs hub | 192 | 192 `D3-vs-hub-192.png` |
| llms.txt | 168/158/192 | 168/**164**/192（curl 计数） |
| sitemap.xml | 526 | **532** = 8 非内容页 + 168 + 164 + 192，内部自洽 |
| quick-check All | — | 「全部 169」= tld-list 168 + com.cn `B3-quickcheck-all-169.png` |

## 硬约束核对：usage 零增量

- `usage-r289-pre.json`（08:44 UTC）与 `usage-r289-post.json` 经 JSON 解析后 days 全表 **dict 完全相等**（`DAYS_EQUAL: True`），`cronLast`/`indexnowLast` 亦未变化。
- 两侧均为：`2026-08-09: searches 7, byTld {com:7,cn:7}, fast 6, refine 0, aiErrors {quota:4}`；08-06/07/08 三天无变化。
- 整场审计大量 quick-check（含 All 169 全量）/ bulk / MCP 调用下 usage 全表不动，即 **0 次 AI 调用的直接硬证明**。

## 1. R276 首页引导条三态（全 pass）

- 首访态：清除 `dh:onboardDismissed:v1` / `dh:lastSearch:v1` / `domainhunter:recent-searches` 后刷新，三步引导条正常展示。`A1-onboard-fresh-en.png`
- 关闭态：点关闭写入 `dh:onboardDismissed:v1=1`，刷新后保持隐藏。`A2-onboard-dismissed-reload.png`
- 老用户抑制态：仅有 recent-searches 时刷新，引导条不出现。`A3-onboard-olduser-suppressed.png`

## 2. R280/283 价格口径（全 pass）

- /prices 168 行，静态行 **CNY 直显**（无 CNY→USD→CNY 往返伪差）。`C1-prices.png`
- live 行抽查 3 行（top/online/com）：页面 CNY == `Math.round(USD × 7.2)`，USD 基准取自 MCP `tld_prices`（`mcp-prices.json`），逐一相符。

## 3. R282/284 hub 轻量架构（全 pass）

- 即时过滤：/tld "ai" → 42、/guide "saas" → 2、/vs "com" → 47，即时无卡顿。`D1b/D2b/D3b-*.png`
- zh/en 双语渲染正常（`D1c/D2c/D3c-*.png`），console 无 hydration mismatch。
- 每 hub 仅加载自身索引 chunk（network 观察 tld-hub-page / guide-hub-page / compare-hub-page 相互隔离）。

## 4. R285/286/287/288 新内容抽查（全 pass）

- `/tld/properties`、`/tld/construction`、`/vs/com-vs-travel`、`/vs/taxi-vs-city`、`/guide/realtor`、`/guide/apartment` zh/en 均正常渲染 h1 与正文。`E1/E4-*.png`
- R288 cardLine 截断：全量 164 条 guide oneLiner 中 zh 首分句最长恰为 42 字并以「…」优雅截断，卡片视觉整齐。`E7-guide-cards-clamp.png`

## 5. 常规全站回归（全 pass）

- /why、/shortlist（空态）、/monitors（空态）正常渲染。`F0/F1/F2-*.png`
- /advanced bulk：google.com taken（2028-09-14）+ 随机名 available，流式返回正常。`F3-advanced-bulk.png`
- SPA 404：未知顶层路径与未知 /tld slug 均 **HTTP 404 + 品牌 404 页**。`G1/G2-*.png`
- 分享链路：POST /api/share 创建 → /s/:id 快照渲染 → revoke → `GET /api/share/:id` 410 + UI「链接已失效」→ 未知 id API 404。测试分享已撤销清理。`H1/H2-*.png`、`share-*.json`。（注：/s/:id 的 HTML 恒为 200 SPA 壳，410/404 语义在 API 层，设计如此。）
- 双语与明暗主题切换刷新持久。`I1-light-en-persist.png`
- 375px：/、/prices、/tld、/vs/com-vs-travel scrollWidth=375 无横向溢出；header 按钮 44px 触点达标。`K-375-*.png`、`mobile-375-results.json`
- /monitors 全局配额显示 2/500（该 2 条监控非本次审计产生，本审计未留任何监控/shortlist/分享）。

## 6. quick-check（全 pass）

- 单名随机串默认 TLD chips 正常。`B1-quickcheck-single.png`
- 两级后缀 `baidu.com.cn`：直接核验已注册，到期日 2029-02-15。`B2-quickcheck-baidu-com-cn.png`
- All 全量：「全部 169」，与 tld-list 168 + com.cn 口径一致。`B3-quickcheck-all-169.png`
- unknown 单域重试：点重试仅该 chip 单独 Checking→重查。`B4/B4b-*.png`（`.sh` 重试后仍 unknown，属 RDAP 无解析类后缀，见 P3-2）

## 7. MCP 三工具（JSON-RPC 直连，全 pass）

- GET /mcp 文档页正常渲染。`G3-mcp-page.png`
- `tools/list` 返回三工具 schema。`mcp-tools-list.json`
- `tld_prices`：**tldCount=168**，prices 全量。`mcp-prices.json`
- `check_domains`：google.com taken（expiresAt 2028-09-14）、baidu.com.cn taken（2029-02-15）、随机名 available。`mcp-check-domains.json`
- `suggest_variants`：acme/com limit 8 → 恰 8 变体。`mcp-suggest-variants.json`

## 8. SEO（全 pass）

- canonical：/、/prices、/why、/tld/ai、/tld/properties、/guide/saas、/guide/realtor、/vs/com-vs-cn 自指正确；`?lang=en` 变体 canonical 带 lang 参数、`og:locale en_US`、`<html lang="en">`（zh 侧 zh_CN）。
- JSON-LD：首页 WebSite+SearchAction+FAQPage；guide/vs 内容页 BreadcrumbList+Article+FAQPage；/tld/:slug BreadcrumbList+FAQPage；/prices BreadcrumbList+FAQPage，均可解析。
- sitemap.xml 532 条与站点结构一致；robots.txt Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + sitemap 指向正确；OG 各页正常。

## 9. Lighthouse（perf / a11y / best-practices / SEO）

| 页面 | 桌面 | 移动（hub 三页为 3 次中位） |
|---|---|---|
| 首页 | 100 / 100 / 100 / 100 | 90 / 100 / 100 / 100 |
| /prices | 99 / 100 / 100 / 100 | **86** / 100 / 100 / 100 |
| /tld hub | 100 / 100 / 100 / 100 | 90 / 100 / 100 / 100（89/90/90） |
| /guide hub | 100 / 100 / 100 / 100 | 90 / 100 / 100 / 100（90/90/90） |
| /vs hub | 100 / 100 / 100 / 100 | 92 / 100 / 100* / 100（91/92/92） |

\* /vs 移动第 3 次 best-practices 96（单次），其余全 100。报告存档：`lighthouse-r289/`（16 份 report.json）。较 R279 的 /vs 移动 85、/guide 移动 88，本轮 hub 移动 perf 回升至 90–92（R282/284 轻量化生效）。

## 问题清单

### P3-1 /prices 移动 perf 86
- 168 行价格大表 SSR，FCP/LCP 成本随行数上升；桌面 99。建议后续考虑首屏截断或行虚拟化，避免继续扩容后跌破 85。

### P3-2 `.sh` unknown chip 重试后仍 unknown
- 重试机制本身正常（仅该 chip 单独重查）；`.sh` 属 RDAP 无解析类后缀，为既有已知类目，非本轮回归引入。

### P3-3 /vs 移动单次 best-practices 96
- 16 份报告中仅 1 份被记录 CSP 类 inspector-issue，其余全 100，判断为单次噪声（与 R279 P3-2 同类）。

## 附：取证文件

- `usage-r289-pre.json` / `usage-r289-post.json`（days dict 相等）
- `storage-r289-backup.json` / `storage-r289-final.json` / `storage-r289-final2.json`（逐字节一致）
- `screenshots-r289/`（36 份截图 + MCP/share JSON 取证）
- `lighthouse-r289/`（16 份 Lighthouse JSON）
