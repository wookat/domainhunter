# R342 零 AI 全站审计报告（覆盖 R337–R340 之后全站）

- 日期：2026-08-09（UTC）
- 生产站：https://hunt.zalize.com（Cloudflare Worker 2418e784，deploy tip f9b4d92）
- 审计方式：严格 0 AI——未点击「开始猎取」「再来一轮」、未触发 refine 及任何 AI CTA；quick-check 仅做精确核验；home 模板按钮只验证预填未提交；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 审计前后 `days` dict 完全相等（深比较 True，见 `usage-r342-pre.json` / `usage-r342-post.json` 与 `findings-r342.json.usage_days_equal`），确认全程零 AI 调用。
- 脚本与产物：`audit_browser_r342.py`、`findings-r342.json`、`screenshots-r342/`、`lighthouse-r342/`、`dump_storage_r342.py` / `restore_storage_r342.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 1 | `/api/prices` 仍处 stale 回退（58/234 TLD 有实时价，fetchedAt ≈ 2026-08-08 05:36 UTC，约 42 小时前；`pricesLastOk: null`、`pricesLastFail` 持续刷新）——R338 已报的已知观察项，本轮复核仍未恢复 |
| P3 | 1 | usage 显示 08-09 `aiErrors.quota: 4`（DeepSeek 402 欠费的用户侧体现，充值前 AI 搜索对真实用户不可用） |

## 1. 内容计数与 sitemap/footer/llms.txt 自洽 ✅

- sitemap `<loc>` 三次 `?cb=` 采样均为 **742** = 8 核心页（含 3 个 hub）+ 234 tld + 236 guide + 264 vs，与口径公式 `8+tld+guide+vs` 一致，无重复 loc。
- sitemap 三类 slug 集合与 `scripts/content-counts.json` 逐一相等（set 比较 True）。
- Hub 页浏览器端去重链接计数：/tld **234**、/guide **236**、/vs **264**。
- llms.txt：tld 234 / guide 236 / vs 264，slug 集合与 sitemap 完全一致。
- footer 三栏完整列出全部 tld/guide/vs 链接，含 R337 新 TLD（…`.hair .skin .makeup .homes .boats .autos` 收尾）与 R340 新指南（Wig brands / Skincare brands / Makeup artists / Home staging / Yacht charters / Auto parts brands）。
- robots.txt 正常（GPTBot/PerplexityBot/ClaudeBot allow + Sitemap 指向）。
- 复核时 R341 未合并生效，实际口径即任务口径（tld 234 / guide 236 / vs 264 / sitemap 742）。

## 2. R337 新 TLD 与 R340 新指南抽查 ✅

- R337 新 TLD（hair/skin/makeup/homes/boats/autos）：zh 200 + `?lang=en` 200，`<html lang>` 正确（zh-CN / en）、canonical 规范、og 标签 11 处、JSON-LD BreadcrumbList+FAQPage 齐全，正文 SSR ≈118–124KB。
- R340 新指南（wig/skincare/makeupartist/homestaging/yachtcharter/autoparts）：zh/en 均 200，JSON-LD BreadcrumbList+Article+FAQPage 齐全，正文 SSR ≈102–113KB。
- 价格同源核验：6 个新 TLD 页静态参考价（首年 ¥11 · 续费 ¥93/年）与 `types.ts` `tldPrice()` 及 /prices 页浏览器渲染行值逐一相等（`findings-r342.json.prices_new_tld_static.match = true`）；tld 页价卡行内 `href="/prices?lang=…"`、/prices 行内 `href="/?tld=<slug>"` 精确存在。
- home 模板按钮：6 个新指南 slug 经 `?tpl=` 预填 textarea 正常（英文模板文案正确开头），「+226」更多 chip 存在；全程未提交。

## 3. R339 可观测字段与 /prices stale 状态 ✅（附 P2 观察项）

- `/api/usage` 键存在断言：`pricesLastOk` ✅（值为 null）、`pricesLastFail` ✅（1786319070107 ≈ 2026-08-09 23:44 UTC）、`cronLast`、`indexnowLast` 均存在。
- **P2（已知观察项延续）**：`/api/prices` `stale: true`、`tldCount: 58`、`fetchedAt = 1786167382002`（2026-08-08 05:36 UTC，审计时约 42 小时前）。/prices 页 58 行实时价 + 176 行静态参考价（合计 234 行）。`pricesLastOk: null` 且 `pricesLastFail` 持续刷新，说明 Porkbun 上游拉取仍在失败。前端按设计回退静态参考价，无用户可见破损。
- MCP `tld_prices`：`tldCount: 234`、prices dict 234 键，口径正确未受 stale API 污染；/mcp 文档页描述「the 234 popular TLDs we track」同步。

## 4. 口径核验（quick-check）✅

- quick-check 精确核验单个随机域名：正常完成（9 个变体，9 可注册）。
- 「查更多后缀」All：**核验完成：共 235 个 = 234 + 1（com.cn）**，与任务口径 All 235 一致。

## 5. SEO 抽查 ✅

24 个新内容页（第 2 节全部）+ 核心页：title 唯一、canonical 均为规范 URL（zh 无参数 / en 带 `?lang=en`）、og 标签齐全、JSON-LD 类型正确、`<html lang>` 随语言切换。sitemap/robots/llms.txt 见第 1 节。

## 6. Lighthouse（移动 + 桌面，hub + 代表页）✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 92/100/100/100 | 100/100/100/100 |
| /tld | 87/100/100/100 | 100/100/100/100 |
| /guide | 90/100/100/100 | 100/100/100/100 |
| /vs | 91/100/100/100 | 100/100/100/100 |
| /prices | 86/100/100/100 | 100/100/100/100 |
| /tld/hair | 88/100/100/100 | 100/100/100/100 |
| /guide/wig | 91/100/100/100 | 100/100/100/100 |

移动 perf 全部 ≥85、桌面全 100；a11y/bp/seo 全 100（R338 的 /prices bp 96 已恢复 100）。原始 JSON 见 `lighthouse-r342/`。

## 7. UX 抽查 ✅

- 375px：/（375）、/prices、/tld/hair、/vs、/guide/wig `scrollWidth ≤ 375`，无横向滚动。
- light/dark：切换 rgb(11,12,14) ↔ rgb(250,250,249)，刷新后持久、可往返。
- 404：顶级路径、/tld、/guide、/vs 未知 slug 均返回真实 HTTP 404 + 品牌 404 页。
- MCP 文档页 200，工具说明与 234 口径一致。

## 8. storage / console ✅

- localStorage backup→审计操作→restore：逐键 round-trip 深比较 True（`storage-r342-backup.json` = `storage-r342-final.json`，键 lang/shortlist/theme）。
- console：全程仅 3 类资源报错，均来自主动访问的 404 测试页与撤销后的 410 分享页（预期行为），内容页 0 error。

## 9. 分享链路 ✅

- POST /api/share → 200，返回 id=`dpKQG33T6i` 与 revokeToken（已脱敏，未落库）。
- GET /s/:id → 内容正确渲染（两个测试域名均可见）。
- DELETE 带 token → 200；随后 GET /api/share/:id → **410**，响应体无残留 items 数据；/s/:id UI 显示已失效文案。

## 建议下一轮

1. （P2）Porkbun 价格拉取自 08-08 起持续失败且 `pricesLastOk` 为 null，建议查 worker cron 日志 / 上游限流，恢复 234 TLD 实时价。
2. （P3）DeepSeek 账户充值后回归验证 AI 搜索、refine 与「再来一轮」。
