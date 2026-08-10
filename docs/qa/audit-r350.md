# R350 零 AI 全站审计报告（覆盖 R345–R348 之后全站）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（Cloudflare Worker fdc9db11，deploy tip fbb07f3）
- 审计方式：严格 0 AI——未点击「开始猎取」「再来一轮」、未触发 refine 及任何 AI CTA；quick-check 仅做精确核验（首页描述框输入裸标签触发）；home 模板按钮只验证 `?tpl=` 预填未提交；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 审计前后 `days` dict 完全相等（深比较 True，见 `usage-r350-pre.json` / `usage-r350-post.json` 与 `findings-r350.json.usage_days_equal`），确认全程零 AI 调用。
- 脚本与产物：`audit_browser_r350.py`、`findings-r350.json`、`screenshots-r350/`、`lighthouse-r350/`、`dump_storage_r350.py` / `restore_storage_r350.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 1 | `/api/prices` 仍处 stale 回退（58/246 TLD 有实时价，fetchedAt ≈ 2026-08-08 05:36 UTC，约 44 小时前；`pricesLastOk: null`、`pricesLastFail` 持续刷新至 2026-08-10 01:56 UTC）——R338/R342/R346 已报的已知观察项，本轮复核仍未恢复，不算新发现 |
| P3 | 1 | usage 显示 08-09 `aiErrors.quota: 4`（DeepSeek 402 欠费的用户侧体现，充值前 AI 搜索对真实用户不可用）——已知观察项延续 |

## 1. 内容计数与 sitemap/footer/llms.txt 自洽 ✅

- sitemap `<loc>` 三次 `?cb=` cache-busting 采样均为 **778** = 8 核心页 + 246 tld + 248 guide + 276 vs，与任务口径（tld 246 / guide 248 / vs 276 / sitemap 778）完全一致，无重复 loc。
- sitemap 三类 slug 集合与 `scripts/content-counts.json` 逐一相等（set 比较 True）。
- Hub 页浏览器端去重链接计数：/tld **246**、/guide **248**、/vs **276**（复现步骤：打开各 hub，`new Set(main a[href^="/tld/"]…)` 去重计数，见 `findings-r350.json.*_hub_links`）。
- llms.txt：tld 246 / guide 248 / vs 276，slug 集合与 sitemap 完全一致。
- footer 三栏完整列出全部内容链接（浏览器端 footer 内 778 个链接），含 R347 新 TLD（auction/deals/coupons/discount/furniture/lighting）与 R348 新指南（electrician/landscaping/painting/jobboard/restaurantsupply/motorcycleparts）。
- robots.txt 正常（GPTBot/PerplexityBot/ClaudeBot allow + Sitemap 指向）。

## 2. R345–R348 新增内容抽查 ✅

各类抽 2 页 × zh/en 共 12 页（`newcontent` 断言见 `findings-r350.json` 与 curl 记录）：

- R347 新 TLD：`/tld/auction`、`/tld/lighting`——zh 200 + `?lang=en` 200，`<html lang>` 正确（zh-CN / en）、canonical 规范（zh 无参数 / en 带 `?lang=en`）、og 标签 11 处、JSON-LD BreadcrumbList+FAQPage 齐全，正文 SSR ≈122–127KB。
- R348 新指南：`/guide/electrician`、`/guide/motorcycleparts`——zh/en 均 200，JSON-LD BreadcrumbList+Article+FAQPage 齐全，正文 SSR ≈104–114KB。
- R345 新 /vs：`/vs/careers-vs-work`、`/vs/parts-vs-repair`——zh/en 均 200，JSON-LD BreadcrumbList+Article+FAQPage 齐全，正文 SSR ≈114–119KB。
- 12 页 title 全部唯一，description 均非空。截图 E1–E6。
- home 模板按钮：R348 六个新指南 slug 经 `?tpl=` 预填 textarea 正常（英文模板文案正确开头，见 `templates_prefill`），「**+238**」更多 chip 存在（与任务口径 chips +238 一致）；全程未提交。

## 3. /prices 与 TLD 指南价格精确一致抽查 ✅

- R347 六个新 TLD 页静态参考价与 `apps/web/src/types.ts` `tldPrice()` 及 /prices 页浏览器渲染行值逐一相等（`findings-r350.json.prices_new_tld_static.match = true`）：auction ¥78/¥204、deals ¥63/¥204、coupons ¥78/¥366、discount ¥63/¥204、furniture ¥88/¥700、lighting ¥41/¥143。
- href 精确匹配：/prices 行内 `href="/tld/<slug>?lang=…"` 六个 slug 全部存在（`prices_row_tld_hrefs` 全 true）；TLD 页价卡行内 `href="/prices?lang=…"` 存在；/prices 行内 `href="/?tld=<slug>"`「猎名」按钮存在。
- /prices 共 246 行 = 58 行实时价 + 188 行静态参考价（与 `/api/prices` stale 状态一致，见 P2）。

## 4. 口径核验（quick-check，零 AI）✅

- 精确核验单个随机裸标签（首页描述框输入触发）：「核验完成：共 9 个，9 个可注册」。
- 「查更多后缀」All：「**核验完成：共 247 个**，199 个可注册」= 246 + 1（com.cn），与任务口径 All 247 一致。截图 B1/B3。

## 5. Lighthouse（移动 + 桌面，hub + 代表页）✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 92/100/100/100 | 100/100/100/100 |
| /tld | 87/100/100/100 | 100/100/100/100 |
| /guide | 89/100/100/100 | 100/100/100/100 |
| /vs | 89/100/100/100 | 100/100/100/100 |
| /prices | 88/100/100/100 | 100/100/100/100 |
| /tld/auction | 99/100/100/100 | 100/100/100/100 |
| /guide/electrician | 91/100/100/100 | 100/100/100/100 |

移动 perf 全部 ≥87、桌面全 100；a11y/bp/seo 全 100。原始 JSON 见 `lighthouse-r350/`。

## 6. UX 抽查 ✅

- 375px：/（375）、/prices、/tld/auction、/vs/careers-vs-work、/guide/electrician `scrollWidth ≤ 375`，无横向滚动（截图 K1–K5）。
- light/dark：切换 rgb(11,12,14) ↔ rgb(250,250,249)，刷新后持久、可往返（截图 I1）。
- 404：顶级路径、/tld、/guide、/vs 未知 slug 均返回真实 HTTP 404 + 品牌 404 页（截图 G1）。
- /mcp 文档页 200，描述「the 246 popular TLDs we track」与口径同步；MCP `tld_prices` 工具返回 `tldCount: 246`、prices dict 246 键，未受 stale API 污染（截图 G3）。

## 7. storage / console ✅

- localStorage backup→审计操作→restore：逐键 round-trip 深比较 True（`storage-r350-backup.json` = `storage-r350-final.json`，键 lang/shortlist/theme）。
- console：全程仅 8 条资源报错，均来自主动访问的 404 测试页（5 条）与撤销后的 410 分享页（3 条），属预期行为；全部内容页 0 error。

## 8. 分享链路 ✅

- POST /api/share → 200，返回 id=`aclLjLOXDv` 与 revokeToken（已脱敏，未落库）。
- GET /s/:id → 内容正确渲染（两个测试域名均可见，截图 H1）。
- DELETE 带 token → 200；随后 GET /api/share/:id → **410**，响应体无残留 items 数据；/s/:id UI 显示已失效文案（截图 H2）。

## 已知观察项（非新发现）

1. **P2**：`/api/prices` `stale: true`、`tldCount: 58`、`fetchedAt = 1786167382002`（2026-08-08 05:36 UTC，审计时约 44 小时前）；`pricesLastOk: null` 且 `pricesLastFail` 持续刷新（最近 2026-08-10 01:56 UTC），Porkbun 上游拉取仍在失败。前端按设计回退静态参考价，无用户可见破损。R338 起已报，本轮照实记录。
2. **P3**：usage 08-09 `aiErrors.quota: 4`——DeepSeek 402 欠费的用户侧体现。

## 建议下一轮

1. （P2）Porkbun 价格拉取自 08-08 起持续失败且 `pricesLastOk` 为 null，建议查 worker cron 日志 / 上游限流，恢复 246 TLD 实时价。
2. （P3）DeepSeek 账户充值后回归验证 AI 搜索、refine 与「再来一轮」。
