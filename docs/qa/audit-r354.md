# R354 零 AI 全站审计报告（覆盖 R349–R352 之后全站）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（Cloudflare Worker 426e85c5，deploy tip 287c35d）
- 审计方式：严格 0 AI——未点击「开始猎取」「再来一轮」、未触发 refine 及任何 AI CTA；quick-check 仅做精确核验（首页描述框输入裸标签触发）；home 模板按钮只验证预填未提交；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 审计前后 `days` dict 完全相等（深比较 True，见 `usage-r354-pre.json` / `usage-r354-post.json` 与 `findings-r354.json.usage_days_equal`），确认全程零 AI 调用。
- 脚本与产物：`audit_browser_r354.py`、`findings-r354.json`、`screenshots-r354/`、`lighthouse-r354/`、`dump_storage_r354.py` / `restore_storage_r354.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 1 | `/api/prices` 仍处 stale 回退（58/252 TLD 有实时价，fetchedAt = 2026-08-08 05:36 UTC，约 45.5 小时前；`pricesLastOk: null`、`pricesLastFail` 持续刷新至 2026-08-10 03:03 UTC）——R338 起已报的已知观察项，本轮复核仍未恢复，不算新发现 |
| P3 | 1 | usage 显示 08-09 `aiErrors.quota: 4`（DeepSeek 402 欠费的用户侧体现，充值前 AI 搜索对真实用户不可用） |

## 1. 内容计数与 sitemap/footer/llms.txt 自洽 ✅

- sitemap `<loc>` 三次 `?cb=` 采样均为 **796** = 8 核心页 + 252 tld + 254 guide + 282 vs，与口径公式 `8+tld+guide+vs` 一致，无重复 loc（`sitemap_dup_locs: 0`）。
- sitemap 三类 slug 集合与 `scripts/content-counts.json` 逐一相等（set 比较全 True）。
- Hub 页浏览器端去重链接计数：/tld **252**、/guide **254**、/vs **282**。
- llms.txt：tld 252 / guide 254 / vs 282，slug 集合与 sitemap 完全一致。
- footer 三栏去重链接计数：/tld/ 252、/guide/ 254、/vs/ 282，含 R351 新 TLD（business/limited/associates/cheap/bargains/supplies）与 R352 新指南（auction/antiques/lightingbrand/outlet/watches/sneakers）。
- robots.txt 正常（GPTBot 等 allow + Sitemap 指向）。

## 2. R349–R352 新增内容抽查 ✅

各类抽 2 页 × zh/en 共 12 页，全部 200：

- R349 新 /vs（auction-vs-market、lighting-vs-solar）：`<html lang>` zh-CN / en 正确、canonical 规范（zh 无参 / en 带 `?lang=en`）、og 标签 11 处、JSON-LD BreadcrumbList+Article+FAQPage 齐全，正文 SSR ≈120–121KB。
- R351 新 TLD（business、supplies）：JSON-LD BreadcrumbList+FAQPage 齐全，SSR ≈128–130KB，title/canonical/OG 规范。
- R352 新指南（auction、sneakers）：JSON-LD BreadcrumbList+Article+FAQPage 齐全，SSR ≈113–116KB，title/canonical/OG 规范。
- home 模板按钮：R352 六个新指南 slug 经 `?tpl=` 预填 textarea 正常（英文模板文案正确开头），「+244」更多 chip 存在（与任务口径 chips +244 一致）；全程未提交。

## 3. /prices 与 TLD 指南价格精确一致 ✅

- R351 六个新 TLD 的 /prices 行静态参考价（¥ 首年/续费）与 `types.ts` `tldPrice()` 逐一相等：business 19/115、limited 59/211、associates 85/226、cheap 41/211、bargains 85/174、supplies 145/145（`prices_new_tld_static.match = true`）。
- /prices 行内 `href="/tld/<slug>"` 六个 slug 精确存在；六个 TLD 页价卡「静态参考价：首年 ¥X · 续费 ¥Y/年」与 types.ts 逐一相等且行内含 `/prices` href（`tld_pricecards.match = true`）。
- /prices 合计 252 行 = 58 实时价 + 194 静态参考价。

## 4. R339 可观测字段与 /prices stale 状态（附 P2 观察项）

- `/api/usage` 键存在断言：`pricesLastOk` ✅（值为 null）、`pricesLastFail` ✅（1786330990835 ≈ 2026-08-10 03:03 UTC）、`cronLast`、`indexnowLast` 均存在。
- **P2（已知观察项延续）**：`/api/prices` `stale: true`、`tldCount: 58`、`fetchedAt = 1786167382002`（2026-08-08 05:36 UTC，审计时约 45.5 小时前）。`pricesLastOk: null` 且 `pricesLastFail` 持续刷新，Porkbun 上游拉取仍在失败；前端按设计回退静态参考价，无用户可见破损。
- MCP `tld_prices`：`tldCount: 252`、prices dict 252 键；/mcp 文档页描述「the 252 popular TLDs we track」同步。

## 5. 口径核验（quick-check）✅

- 首页描述框输入裸标签 `qzxvkw9r354` 触发精确核验：正常完成（9 个变体，9 可注册），未触碰任何 AI CTA。
- 「查更多后缀」All：**核验完成：共 253 个 = 252 + 1（com.cn），209 个可注册**，与任务口径 All 253 一致。

## 6. Lighthouse（移动 + 桌面，hub + 代表页）✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 94/100/100/100 | 100/100/100/100 |
| /tld | 88/100/100/100 | 100/100/100/100 |
| /guide | 88/100/100/100 | 100/100/100/100 |
| /vs | 89/100/100/100 | 100/100/100/100 |
| /prices | 88/100/100/100 | 99/100/100/100 |
| /tld/business | 91/100/100/100 | 100/100/100/100 |
| /guide/auction | 89/100/100/100 | 100/100/100/100 |

移动 perf 全部 ≥88、桌面 ≥99；a11y/bp/seo 全 100。原始 JSON 见 `lighthouse-r354/`。

## 7. UX 抽查 ✅

- 375px：/（375）、/prices、/tld/business、/vs/auction-vs-market、/guide/sneakers `scrollWidth ≤ 375`，无横向滚动（截图 K1–K5）。
- light/dark：切换 rgb(11,12,14) ↔ rgb(250,250,249)，刷新后持久、可往返。
- 404：顶级路径、/tld、/guide、/vs 未知 slug 均返回真实 HTTP 404 + 品牌 404 页。
- MCP 文档页 200，工具说明与 252 口径一致。

## 8. storage / console ✅

- localStorage backup→审计操作→restore：逐键 round-trip 深比较 True（`storage-r354-backup.json` = `storage-r354-final.json`，键 lang/shortlist/theme）。
- console：全程仅 8 条资源报错，均来自主动访问的 404 测试页（5 条）与撤销后的 410 分享页（3 条），属预期行为；全部内容页 0 error。

## 9. 分享链路 ✅

- POST /api/share → 200，返回 id=`0wzG9LuJ37` 与 revokeToken（已脱敏，未落库）。
- GET /s/:id → 内容正确渲染（两个测试域名均可见，截图 H1）。
- DELETE 带 token → 200；随后 GET /api/share/:id → **410**，响应体无残留 items 数据；/s/:id UI 显示已失效文案（截图 H2）。

## 复现步骤

1. `python3 docs/qa/dump_storage_r354.py storage-r354-backup.json`（CDP 连接会话浏览器备份 localStorage）。
2. `python3 docs/qa/audit_browser_r354.py findings-r354.json`（全部断言与截图，含 usage 前后快照）。
3. Lighthouse：`npx lighthouse <url> [--preset=desktop] --chrome-flags="--headless=new --no-sandbox" --output=json`，7 页 × 2 形态。
4. `python3 docs/qa/restore_storage_r354.py storage-r354-backup.json` 恢复并复核 `STORAGE_IDENTICAL`。
