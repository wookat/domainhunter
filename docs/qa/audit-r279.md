# R279 · 零 AI 全站生产审计（R271–R276 之后全站回归）

- 日期：2026-08-09（UTC 05:40–06:30）
- 对象：https://hunt.zalize.com（deploy/r192-r195，Worker version 2255f661）
- 预算纪律：**0 次 AI/DeepSeek 调用**——全程未触发 /api/ai-search、AI CTA、refine、one-more-round 任何入口；quick-check / bulk / MCP / 变体全部走 RDAP/DNS/WHOIS 非 AI 通道
- 方法：Playwright（CDP 直连真实 Chrome）全站走查 + curl SSR 抽查 + Lighthouse CLI（桌面+移动 × 5 页）+ MCP JSON-RPC 直连三工具 + 375px 视口仿真
- console 全程 **0 JS/应用级 error**（唯一网络日志为故意验证 404/410 端点时的 resource 日志，符合预期）
- 测试前备份 localStorage/sessionStorage（3 个 local key），结束后**逐字节还原**（re-dump 与备份 `diff` 为空，`STORAGE_IDENTICAL`）

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | /vs 移动 Lighthouse perf 85（上轮 87，LCP 3.7s）、/guide 移动 88，扩容后余量收窄；/tld 桌面 best-practices 96（单次 CSP inspector-issue，其余 9 份报告全 100） |

## 硬约束核对：usage 零增量

- 审计前 `usage-r279-pre.json`（05:42 UTC）与审计后 `usage-r279-post.json` 经 JSON 解析后 **dict 完全相等**（`DICT_EQUAL: True`；原始字节仅 days 键序不同，为 KV 序列化顺序差异，非数据变化）。
- 两侧均为：`2026-08-09: searches 7, byTld {com:7,cn:7}, fast 6, refine 0, aiErrors {quota:4}`；08-06/07/08 三天、`cronLast`、`indexnowLast` 均无变化。
- 整场审计大量 quick-check（含 All 157 后缀全量）/ bulk / MCP 调用下 usage 全表不动，即 **0 次 AI 调用的直接硬证明**。

## 1. R276 首页新用户引导条（三态全 pass）

- **首访态**：清除 `dh:onboardDismissed:v1` / `dh:lastSearch:v1` / `domainhunter:recent-searches` 后刷新，三步引导条（描述寓意→AI 构思+核验→只展示可注册）+ quick-check 免额度说明正常展示。`A1-onboard-fresh.png`
- **关闭态**：点关闭（aria-label「关闭引导」）即隐藏且写入 `dh:onboardDismissed:v1=1`，刷新后保持隐藏。`A2-onboard-dismissed.png`
- **老用户抑制态**：仅有 recent-searches（无 dismissed key）时刷新，引导条不出现。`A3-onboard-olduser-suppressed.png`

## 2. quick-check（全 pass）

- 单名 `zx9qk3vhu2ab`：默认 TLD chips 正常。`B1-quickcheck-single.png`
- 两级后缀 `baidu.com.cn`：直接核验为已注册，展示到期日 2029-02-15，另有同名其他后缀 chips（共 10）。`B2-quickcheck-baidu-com-cn.png`
- 注册局保留：`nic.com.cn` → 「注册局保留」chip，专属 tooltip，**无重试按钮**（符合设计）。`B3-reserved-nic-com-cn.png`
- **All 全量**：更多后缀展开后「全部 157」，与 tld-list 156 + com.cn 口径一致。`J1-quickcheck-all.png`
- **未知态兜底 + 单域重试**：All 全量后 6 个 unknown chip（.icu/.lol/.fm/.best 等）各带 44px 重试按钮，点击 `.icu` 重试仅该 chip 单独重查（`home.quickRetryTitle` title 正确）。`J2-unknown-retry.png`
- **监控添加**：quick-check taken chip 的「监控释放」CTA 一键加入（实测加入 baidu.ai），/monitors 出现记录、「立即刷新状态」正常、两步确认「确认取消？」后移除回到空态。`C1–C5`。测试产生的监控与 shortlist 项已全部清理。

## 3. 内容计数（全部与任务书一致）

| 面 | 预期 | 实测 |
|---|---|---|
| /tld hub | 156 | 156（SSR title「156 个后缀」+ 156 个 /tld/ 链接）`D2-tld-hub.png` |
| /guide hub | 152 | 152 `D2-guide-hub.png` |
| /vs hub | 180 | 180 `D2-vs-hub.png` |
| /prices | 156 | 156 个 /tld/ 链接 `D1-prices.png` |
| llms.txt | 156/152/180 | 156/152/180（curl 计数） |
| sitemap.xml | 496 | 496 `<url>`；非内容页 8 条（/、/prices、/why、/mcp、/advanced、三 hub）+ 156+152+180 |
| quick-check All | 157 | 「全部 157」 |

- hub 即时过滤（R271 轻量索引）：/tld 输入 "ai" → 39 条、/guide "saas" → 2 条、/vs "com" → 46 条，即时无卡顿。`D3-*-filter.png`

## 4. 常规全站回归（全 pass）

- 抽样内容页 /tld/ai、/guide/saas、/vs/com-vs-cn、/why 均正常渲染 h1 与正文。`E-*.png`
- /advanced bulk：google.com + 随机名核验流式返回正常。`F1-advanced-bulk.png`
- /shortlist 正常渲染（空态）。`L1-shortlist.png`
- SPA 404：未知顶层路径与未知 /tld slug 均 **HTTP 404 + 品牌 404 页**。`G1-404.png`
- 分享链路：POST /api/share 创建 → /s/:id 快照渲染 → revoke token 撤销 200 → GET 410、未知 id 404 → 撤销页「链接已失效」。`H1-share-page.png`、`H2-share-revoked.png`。测试分享已撤销清理。
- 双语：EN 切换刷新持久（`domainhunter:lang=en`）`I1-en-home.png`；明暗主题切换刷新持久 `I2/I3`。
- 375px：/、/prices、/tld、/vs/com-vs-cn scrollWidth ≤ 视口，无横向溢出。`K-375-*.png`

## 5. MCP 三工具（JSON-RPC 直连，全 pass）

- `tools/list` 正常返回三工具 schema。
- `tld_prices`：**tldCount=156、liveCount=58、staticCount=98**、prices 156 条、`stale:true` + `staleNote` 语义清晰（R272 元数据已消除 R270 的 P3 歧义）。取证 `mcp-prices.json`
- `check_domains`：google.com taken（expiresAt 2028-09-14、expiringSoon:false）、baidu.com.cn taken（2029-02-15）、随机名 available。`mcp-check.json`
- `suggest_variants`：acme/com limit 8 → 8 变体，available 排前且带 firstYearPriceUSD。`mcp-var.json`

## 6. SEO（全 pass）

- canonical：/、/prices、/why、/tld/ai、/guide/saas、/vs/com-vs-cn 自指正确；`?lang=en` 变体 canonical 带 lang 参数、`og:locale en_US`、`<html lang="en">`（zh 侧 zh_CN）。
- JSON-LD：首页 WebSite+FAQPage；内容页 BreadcrumbList+Article+FAQPage；/tld/:slug BreadcrumbList+FAQPage；/prices BreadcrumbList+FAQPage，均可解析。
- robots.txt：Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + sitemap 指向正确。
- OG：og:title/og:locale 各页正常。

## 7. Lighthouse（perf / a11y / best-practices / SEO）

| 页面 | 桌面 | 移动 |
|---|---|---|
| 首页 | 100 / 100 / 100 / 100 | 92 / 100 / 100 / 100 |
| /prices | 100 / 100 / 100 / 100 | 89 / 100 / 100 / 100 |
| /tld hub | 100 / 100 / **96** / 100 | 100 / 100 / 100 / 100 |
| /guide hub | 100 / 100 / 100 / 100 | **88** / 100 / 100 / 100 |
| /vs hub | 99 / 100 / 100 / 100 | **85** / 100 / 100 / 100 |

报告存档：`lighthouse-r279/`（10 份 report.json）。

## 问题清单

### P3-1 /vs 移动 perf 85（上轮 87）、/guide 移动 88
- /vs 180 条扩容后 FCP 2.6s / LCP 3.7s / SI 2.6s（TBT 0、CLS 0），较 R275 时 87 再降 2 分；/guide 152 条 88。纯静态 SSR 列表页，主因是 HTML 体量与首屏渲染成本。建议下轮扩容前做 hub 列表分段懒渲染或首屏截断+「展开全部」，避免跌破 85。

### P3-2 /tld 桌面 best-practices 96（单次 CSP inspector-issue）
- 仅 /tld 桌面一份报告被 DevTools Issues 面板记录 CSP 类 issue（涉及 assets/*.js），其余 9 份（含 /tld 移动）best-practices 全 100，判断为 CSP report-only 或单次噪声。建议复核 CSP 头对 assets 脚本的允许清单；不影响功能。

## 附：取证文件

- `usage-r279-pre.json` / `usage-r279-post.json`（dict 相等）
- `screenshots-r279/`（36 份截图 + 3 份 MCP JSON 取证）
- `lighthouse-r279/`（10 份 Lighthouse JSON）
