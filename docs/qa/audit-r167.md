# R167 零 AI 全站生产审计 — hunt.zalize.com（2026-08-08）

纯线上走查，未部署、未改产品代码，**全程未触发任何 AI 猎名搜索**。

## AI 用量前后值（硬性约束验证）
- 基线（~/usage_baseline.json）：2026-08-08 `searches=2, fast=2, refine=0`
- 审计结束后 `GET /api/usage`：2026-08-08 `searches=2, fast=2, refine=0` — **零增量** ✅

## 功能走查结果（1280/1600px 桌面）
| 项目 | 结果 | 说明 |
|---|---|---|
| 首页三模式切换（AI naming / Exact check / Bulk check） | ✅ | AI 模式仅切换未提交；Bulk 指向 /advanced |
| quick-check（Exact check） | ✅ | `zestpanda` 8 后缀即时核验；taken 的 .com 显示 `expires 2027-02-25` |
| 54 后缀展开 | ✅ | 「Check 54 suffixes」→ All 54 / Available 53 / Taken 1 |
| 临期监控 CTA（Watch drop） | ✅ | `supabase.com`（expires 2026-09-24，<90 天）行内出现 Watch drop，点击后变 Watching 且加入 shortlist |
| 变体功能 | ✅ | 24 前后缀变体全部核验，17 available，标注 "no AI quota used" |
| /advanced 批量核验 | ✅ | 5 输入 →6 域名（.com+.cn 展开）3 avail/3 taken；导出 CSV 正常（domainhunter-bulk-20260808.csv） |
| /shortlist 收藏 | ✅ | 星标/CTA 收藏 2 条，头部徽章计数同步 |
| 分享链接创建/只读视图 | ✅ | 生成 /s/9hn0thaG4a；只读页 Copy 与 Export CSV 可用 |
| 分享链接管理（删除即失效） | ✅ | Delete→Confirm delete? 两段确认；删除后 `/api/share/:id` 返回 `{"error":"revoked"}`，/s/ 页显示 "doesn't exist or has expired" |
| shortlist 批量清空 | ✅ | Clear→Confirm clear?（3 秒超时回退）清空成功，徽章归 0 |
| /monitors 手动刷新 + 限频 | ✅ | 刷新后状态更新为 Taken + expires 2026-09-24；60s 内再点显示 "Refreshed just now — try again in 50s" |
| /prices 排序 | ✅ | 按 Renew/yr 升序生效（.top $4 → .cn $5 → …） |
| /prices stale 提示 | ⚠️ 见 P2-1 | 全表为 `≈` 静态参考价；stale 横幅未显示 |
| /why、/mcp | ✅ | 渲染正常，0 console error |
| /tld/com、/tld/ai | ✅ | 渲染正常 |
| /guide/saas、/guide/blog | ✅ | 渲染正常 |
| /vs/com-vs-io、/vs/io-vs-ai | ✅ | 渲染正常 |
| 语言切换 中↔英 | ✅ | 文案整体切换；分享页快照跟随创建语言 |
| 暗/亮色切换 | ✅ | 主题即时切换 |
| /?q=testword 预填 | ✅ | 输入框预填 testword |

## 响应式
- **375px**（CDP 移动仿真，DPR2）：首页(/?q)、/advanced、/shortlist、/monitors、/prices、/why、/mcp、/tld/com、/guide/saas、/vs/com-vs-io、分享页 共 11 页：`document.scrollWidth=375`，**无横向溢出**。/why 的对比表（min-w 560px）与 /mcp 的代码块超宽，但均位于 `overflow-x: auto` 容器内（容器内滚动，页面不溢出）——合规。
- **768 / 1280 抽查**（首页、/prices）：无溢出。
- 截图：`~/screenshots/r167/m375_*.png`（11 张）。

## a11y
- 键盘 Tab 走查首页与 quick-check 结果流：TLD chips、下拉、结果行按钮（Watch drop/star/register）均可达且 focus ring 可见 ✅
- axe-core 4.10.2 快扫（页面注入，CLI 因 ChromeDriver 151 vs Chrome 133 版本不匹配不可用）：
  - 首页：**0 violations**
  - /prices：**0 violations**

## 性能（Lighthouse 13.4.1，headless、emulated mobile，perf 类目，各 2 次）
| 页面 | perf(run1/run2) | LCP | CLS | TBT |
|---|---|---|---|---|
| 首页 / | 86 / 85 | 3.0s / 3.0s | 0 / 0 | 290ms / 330ms |
| /prices | 94 / 94 | 2.5s / 2.6s | 0 / 0 | 120ms / 50ms |
| /tld/com | 76 / 77 | 4.3s / 4.1s | 0 / 0 | 120ms / 70ms |
| /guide/saas | 82 / 82 | 3.6s / 3.6s | 0 / 0 | 90ms / 100ms |

本轮两次结果稳定，无历史双峰现象。/tld/com LCP 4.1–4.3s 偏慢（见 P3-1）。原始 JSON：/tmp/lh_{home,prices,tld,guide}_{1,2}.json。

## console error 清单
- 桌面全站 14 页 CDP 扫描（Runtime.consoleAPICalled error/warning + exceptionThrown + Log error）：**0 条**（~/console_sweep_desktop.txt）
- 手工走查各页（首页、quick-check、变体、advanced、shortlist、分享页、monitors、prices）：0 条

## SEO / 结构
- sitemap.xml：**193 条 URL**（vs 78 + guide 56 + tld 54 + 首页/why/prices/mcp/advanced 5），与任务描述的 /vs 78、行业指南 56、TLD 54 一致 ✅
- llms.txt：含 193 条 hunt.zalize.com URL，与 sitemap 集合 diff **完全一致**（双向零差异）✅
- robots.txt：Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + Sitemap 声明 ✅
- canonical：首页、/tld/com、/guide/saas、/vs/com-vs-io、/prices 均为自身规范 URL ✅
- JSON-LD（抽 3 页，json.loads 校验均合法）：首页 FAQPage+WebSite(potentialAction)；/tld/com BreadcrumbList+FAQPage；/guide/saas BreadcrumbList+Article+FAQPage ✅

## MCP 冒烟（3 工具真实调用，POST /mcp）
- `check_domains(example.com, thisdomainshouldbefree-r167.com)` → taken / available ✅
- `suggest_variants(acme, [com], limit=6)` → 6 变体，getacmeapp.com available 含首年价 $9.58 ✅
- `tld_prices()` → **isError: "pricing upstream unavailable, try again later"** ⚠️ 与 P2-1 同源（/api/prices 上游失效）

## 问题清单（P0–P3）
**P0 / P1：无。**

- **P2-1 /prices 实时价格上游失效，stale 提示不可见**
  - 现象：`GET /api/prices` 返回 `{"prices":{},"stale":true,"fetchedAt":null}`，全表回退 `≈` 静态参考价；由于 `prices-page.tsx:72` 条件 `meta.stale && meta.fetchedAt !== null`，fetchedAt=null 时 stale 横幅不渲染，用户无从得知全表为静态参考价（仅每格 `≈` 符号暗示）。
  - 复现：curl https://hunt.zalize.com/api/prices；打开 /prices 观察无提示横幅。
  - 建议：排查 Porkbun 拉取失败原因（KV stale key 也已过期/为空）；fetchedAt=null 时也显示一条「当前展示静态参考价」提示。MCP `tld_prices` 同样受影响（直接 isError）。
- **P3-1 /tld/* Lighthouse 移动端 LCP 4.1–4.3s、perf 76–77**，低于其他页面，可关注首屏图文与字体加载。

## 证据路径（审计机本地，未入库）
- 录屏：/home/ubuntu/screencasts/rec-281717b2-7cf9-49db-81b5-b219db94d2b7/rec-281717b2-7cf9-49db-81b5-b219db94d2b7-edited.mp4
- 375px 截图：~/screenshots/r167/m375_*.png；走查截图：~/screenshots/ss_*.png
- console 扫描：~/console_sweep_desktop.txt；375 溢出扫描：~/mobile375_sweep.txt；Lighthouse：~/lighthouse_results.txt
