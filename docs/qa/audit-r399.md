# R399 零 AI 全站审计报告（覆盖 R387–R395 之后全站）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（deploy/r192-r195 tip 3b56bc8，含 R391/R392/R393/R394/R395）
- 审计方式：严格零 AI——除按任务授权**故意触发 1 次 402** 复验 R394 降级 UX 外，未触碰任何 AI 路径（未点击 refine/再来一轮/行业模板提交）；quick-check 仅精确核验；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 前后对比（`usage-r399-pre.json` / `usage-r399-post.json`）：除 2026-08-10 当日因该 1 次故意 402 产生 `aiErrors.quota 2→3`（同一次调用同步计入 `searches/byTld/fast +1`，为服务端对同一 AI 请求的常规计数）外，**其余全部日期数据深比较完全相等**；402 复验之前阶段（quick-check/内容页/MCP/分享等全部非 AI 测试）usage `days` 深比较 True（`usage_days_equal_phase1: true`），确认非 AI 路径零消耗。
- 测试前备份 localStorage/sessionStorage（`storage-r399-pre.json`），测试后逐字节还原并复核（`LOCAL_EQUAL True`，sessionStorage 清空还原，`storage-r399-post.json`）。
- 脚本与产物：`audit_browser_r399.py`、`findings-r399.json`、`findings-r399-402.json`、`screenshots-r399/`、`lh-r399-*.json`、`dump_storage_r399.py` / `restore_storage_r399.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | ① AI 402 错误条文案在错误发生后切换语言（中→EN）不重译，仍显示中文「AI 服务暂不可用（配额已满）…」，而旁边 fallback 引导「While AI is down, these still work:」已切英文（截图 J2）——错误消息为触发时快照，语言切换时未随 i18n 重渲染，影响极小。② Lighthouse 移动 /tld/buzz perf 90、首页 93（历史同量级采样波动），其余移动 99、桌面 99–100，无用户可见影响。 |

## 1. 首页 quick-check ✅

- 裸标签 `qzxvkw9r399` 精确核验：9 个变体全部完成（截图 B1）。
- 「查更多后缀 +304」All：**核验完成：共 313 个 = 312 + 1（com.cn），200 个可注册**，pending 计数 0（截图 B2）——R395 派生 QUICK_MORE_TLDS 后新 TLD 批次自动覆盖，口径 All 313 正确。
- 重复核验（新开页面同一输入再跑一次）：正常完成、不卡 pending（截图 B3）。
- cn / com.cn 行：`qzxvkw9r399.cn 可注册 ≈$4`、`qzxvkw9r399.com.cn 可注册`，均正常出结果。
- 375px 首页 scrollWidth 375，无横向溢出（截图 K1）。

## 2. 内容计数与 sitemap/footer/llms.txt 自洽 ✅

- sitemap `<loc>` 三次 `?cb=` 采样均为 **976** = 8 核心页 + 312 tld + 308 guide + 348 vs，无重复 loc；三类 slug 集合与 `scripts/content-counts.json` 逐一相等（set 比较全 True）。
- Hub 页去重链接计数：/tld **312**、/guide **308**、/vs **348**；footer 三栏 312/308/348；llms.txt 312/308/348 且 slug 集合与 sitemap 完全一致。
- /prices 表 **312 行**（`main a[href^="/?tld="]` 计数，截图 C1）；`/api/prices` `stale: null`、`tldCount: 310`（= 312 − cn/so 两个 Porkbun 不报价 TLD，按设计）；MCP `tld_prices` `tldCount: 312`（静态参考价补齐）。
- robots.txt 正常（Sitemap + GPTBot allow）。

## 3. 新页抽查（R391/R392/R393 各 1 + 全量状态探测）✅

- 全量：R391 新 6 TLD（asia/buzz/fans/place/report/town）、R392 新 6 指南（gymnastics/cheerleading/squash/lacrosse/judo/bjj）、R393 新 6 对比（bond-vs-finance/sbs-vs-xyz/cyou-vs-fun/monster-vs-games/pics-vs-photos/mobi-vs-app），zh + en 共 36 个 URL 全部 SSR 200，JSON-LD FAQPage 齐全。
- 深抽 3 页（/tld/buzz、/guide/lacrosse、/vs/pics-vs-photos，zh+en 共 6 URL）：`<html lang>` zh-CN/en 正确、canonical 规范（zh 无参 / en 带 `?lang=en`）、og 11 处、JSON-LD（tld：BreadcrumbList+FAQPage；guide/vs：BreadcrumbList+Article+FAQPage）齐全；SSR 内链集合齐（tld 页含 312 tld 内链、guide 页含 308 guide 内链、vs 页含 348 vs 内链）。
- 水合一致：3 页浏览器端 `document.title` 与 SSR `<title>` 一致、h1 与标题一致、main 渲染非空（3144–7789 字符），无水合破碎（截图 E-*）。

## 4. 工具页 / 分享 / 404 / MCP ✅

- /shortlist、/monitors、/advanced、/why、/mcp 全部 HTTP 200 并正常渲染（截图 G4–G7、G3）。
- /advanced 批量粘贴 3 个域名（bulk.com/bulk.io/google.com）：识别 3 个、核验完成——2 可注册（含首年价 $11.08/$28.12），google.com 已注册且显示 2028-09-14 到期（截图 G8）。
- 分享链接：`POST /api/share` 200 + revokeToken → `/s/:id` 页面双域名正常展示（截图 H1）→ `DELETE` 200 → 再读 **410**，语义正确。
- 404：`/nonexistent-r399`、`/tld|/guide|/vs` 未知 slug 均返回真实 HTTP 404 品牌页（截图 G1）。
- MCP 三工具（JSON-RPC POST /mcp）：`tools/list` = check_domains / tld_prices / suggest_variants；`check_domains`（qzxvkw9r399mcp.com available；google.com taken，expiresAt 2028-09-14）；`tld_prices` tldCount 312 / 312 键；`suggest_variants`（name=qzxvkw9r399）返回 24 个变体含实时可注册状态与首年价。

## 5. R394 AI 402 降级 UX 复验（1 次故意 402，已核销）✅

- 错误条双语：zh「AI 服务暂不可用（配额已满），请稍后再试，无需重试」（截图 J1）；fallback 引导切 EN 正常「While AI is down, these still work:」（截图 J2；错误条本体不重译见 P3-①）。
- 5 个 fallback 入口齐全：精确核验 / 批量核验 / 后缀指南 / 命名指南 / 后缀对比（截图 J1）。
- 无 retry 按钮（`retry_button: false`）；底部「AI 配额受限，暂无法再来一轮」同步降级提示。
- 首页 amber banner：sessionStorage `dh:aiQuotaDown:v1` 触发后置位；**同一标签页**回首页显示 amber 横幅「AI 猎名暂不可用（配额已满），精确核验与批量核验不受影响」（截图 J3）；**新标签页**不显示横幅（sessionStorage 按标签页隔离，截图 J4）——行为符合设计。
- usage 核销：仅 2026-08-10 `aiErrors.quota +1`（2→3，同一次调用附带 searches/byTld/fast +1），其余日期零变化。

## 6. Lighthouse（桌面 + 移动）✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 93/100/100/100 | 100/100/100/100 |
| /tld/buzz | 90/100/100/100 | 100/100/100/100 |
| /prices | 99/100/100/100 | 99/100/100/100 |

- a11y/SEO 全 100，桌面 perf 与历史（桌面曾 100）无回归；移动 perf 90–99 与 R386（89–91）同量级。

## 7. console 与 375px ✅

- console：全站遍历 0 个应用错误；仅 404/410 页面的资源加载状态 noise（`Failed to load resource … 404/410`，为预期 HTTP 状态本身，非 JS 错误）。
- 375px scrollWidth：/ 375、/prices 360、/tld/buzz 360、/vs/pics-vs-photos 360、/guide/lacrosse 360、/shortlist 375、/advanced 360、/why 360、/mcp 360——全部 ≤375，无横向溢出（截图 K1–K9）。
