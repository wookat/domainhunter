# R358 零 AI 全站审计报告（覆盖 R353–R356 之后全站）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（Cloudflare Worker 4f29e048，deploy tip 421b316）
- 审计方式：严格 0 AI——未点击「开始猎取」「再来一轮」、未触发 refine 及任何 AI CTA；quick-check 仅做精确核验（首页描述框输入裸标签触发）；home 模板按钮只验证预填未提交；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 审计前后 `days` dict 完全相等（深比较 True，见 `usage-r358-pre.json` / `usage-r358-post.json` 与 `findings-r358.json.usage_days_equal`），确认全程零 AI 调用。
- 脚本与产物：`audit_browser_r358.py`、`findings-r358.json`、`screenshots-r358/`、`lighthouse-r358/`、`dump_storage_r358.py` / `restore_storage_r358.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | ① `/api/prices` 实时价已首次成功（`pricesLastOk` 非 null，fetchedAt = 2026-08-10 03:26 UTC），250/258 TLD 有实时价并正常渲染「Porkbun 实时价」；但响应仍标 `stale: true`——03:26 快照按当时 252 口径落盘，R355 扩容至 258 后版本化 key 失效走 stale 兜底，且其后重拉失败（`pricesLastFail` 刷新至 04:37 UTC）。R355 新 6 TLD 暂以 ≈ 静态参考价回退，前端无破损。 ② usage 显示 08-09 `aiErrors.quota: 4`（DeepSeek 402 欠费的用户侧体现，充值前 AI 搜索对真实用户不可用） |

## 1. 内容计数与 sitemap/footer/llms.txt 自洽 ✅

- sitemap `<loc>` 三次 `?cb=` 采样均为 **814** = 8 核心页 + 258 tld + 260 guide + 288 vs，与口径公式 `8+tld+guide+vs` 一致，无重复 loc（`sitemap_dup_locs: 0`）。
- sitemap 三类 slug 集合与 `scripts/content-counts.json` 逐一相等（set 比较全 True）。
- Hub 页浏览器端去重链接计数：/tld **258**、/guide **260**、/vs **288**。
- llms.txt：tld 258 / guide 260 / vs 288，slug 集合与 sitemap 完全一致。
- footer 三栏去重链接计数：/tld/ 258、/guide/ 260、/vs/ 288，含 R353 新 /vs、R355 新 TLD（camp/camera/diamonds/theater/accountants/engineer）与 R356 新指南（dollarstore/thriftstore/officesupplies/medicalsupplies/buildingmaterials/franchise）。
- robots.txt 正常（GPTBot 等 allow + Sitemap 指向）。

## 2. R353–R356 新增内容抽查 ✅

各类抽 2 页 × zh/en 共 12 页，全部 200：

- R353 新 /vs（business-vs-company、supplies-vs-supply）：`<html lang>` zh-CN / en 正确、canonical 规范（zh 无参 / en 带 `?lang=en`）、og 标签 11 处、JSON-LD BreadcrumbList+Article+FAQPage 齐全，正文 SSR ≈121–123KB。
- R355 新 TLD（engineer、camp）：JSON-LD BreadcrumbList+FAQPage 齐全，SSR ≈130–131KB，title/canonical/OG 规范。
- R356 新指南（dollarstore、franchise）：JSON-LD BreadcrumbList+Article+FAQPage 齐全，SSR ≈114–117KB，title/canonical/OG 规范。
- home 模板按钮：R356 六个新指南 slug 经 `?tpl=` 预填 textarea 正常（英文模板文案正确开头），「+250」更多 chip 存在（与任务口径 chips +250 一致）；全程未提交。

## 3. /prices 与 TLD 指南价格精确一致 ✅（含 .engineer / .engineering 前缀区分）

- R355 六个新 TLD 的 /prices 行静态参考价（¥ 首年/续费）与 `types.ts` `tldPrice()` 逐一相等：camp 88/398、camera 94/374、diamonds 360/374、theater 396/430、accountants 612/648、engineer 202/216；并核验 **engineering 48/374 与 engineer 202/216 各自独立成行、互不串扰**（`prices_new_tld_static.match = true`）。
- /prices 行内 `href="/tld/<slug>"` 七个 slug（含 engineering）精确存在；六个新 TLD 页价卡「静态参考价：首年 ¥X · 续费 ¥Y/年」与 types.ts 逐一相等且行内含 `/prices` href；对照组 /tld/engineering（在实时快照内）价卡渲染「Porkbun 实时价」而非静态参考价，进一步佐证两后缀互不串扰（`tld_pricecards.got` 六个新 TLD 全部匹配；dict 内 engineering 因走实时价无静态行，故聚合 `match` 字段为 False，属预期）。
- /prices 合计 258 行 = **250 实时价 + 8 静态参考价**（实时价已恢复，见第 4 节）。

## 4. Porkbun 实时价状态（附 P3 观察项）✅

- `/api/usage`：`pricesLastOk = 1786332384596`（2026-08-10 03:26 UTC，**非 null，实时价首次成功已确认**）；`pricesLastFail` 刷新至 04:37 UTC；`cronLast`、`indexnowLast` 均存在。
- `/api/prices`：`tldCount: 250`、`fetchedAt = 2026-08-10 03:26 UTC`、`stale: true`。stale 原因：03:26 成功快照按当时 252 TLD 口径写入版本化 key（`prices:v2:<n>` 掺 TLD 数），R355 扩容 252→258 后该 key 失效，回退不带版本的 stale 兜底 key（250 个实时价，无 R355 新 6 TLD）；随后重拉持续失败。属设计内回退，无用户可见破损。
- **实时价渲染核验**：/tld/com、/tld/io、/tld/shop 价卡渲染「Porkbun 实时价 · 人民币按汇率 7.2 估算」（英文 "Live Porkbun pricing"）正常（截图 C3）；/prices 250 行显示不带 ≈ 的实时价。R355 新 6 TLD 因不在快照内，价卡按设计回退 ≈ 静态参考价，且静态参考价与指南页同值（第 3 节）。**P3 观察项**：待下次 Porkbun 拉取成功后新 TLD 将自动获得实时价。
- MCP `tld_prices`：`tldCount: 258`、prices dict 258 键；/mcp 文档页描述「the 258 popular TLDs we track」同步。

## 5. 口径核验（quick-check）✅

- 首页描述框输入裸标签 `qzxvkw9r358` 触发精确核验：正常完成（9 个变体，9 可注册），未触碰任何 AI CTA。
- 「查更多后缀」All：**核验完成：共 259 个 = 258 + 1（com.cn），209 个可注册**，与任务口径 All 259 一致。

## 6. Lighthouse（移动 + 桌面，hub + 代表页）✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 92/100/100/100 | 100/100/100/100 |
| /tld | 99/100/100/100 | 100/100/100/100 |
| /guide | 89/100/100/100 | 100/100/100/100 |
| /vs | 89/100/100/100 | 100/100/100/100 |
| /prices | 99/100/100/100 | 100/100/100/100 |
| /tld/engineer | 91/100/100/100 | 100/100/100/100 |
| /guide/dollarstore | 91/100/100/100 | 100/100/100/100 |

移动 perf 全部 ≥89、桌面全 100；a11y/bp/seo 全 100。原始 JSON 见 `lighthouse-r358/`。

## 7. UX 抽查 ✅

- 375px：/（375）、/prices（360）、/tld/engineer（360）、/vs/business-vs-company（360）、/guide/dollarstore（360）`scrollWidth ≤ 375`，无横向滚动（截图 K1–K5）。
- light/dark：切换 rgb(11,12,14) ↔ rgb(250,250,249)，刷新后持久、可往返。
- 404：顶级路径、/tld、/guide、/vs 未知 slug 均返回真实 HTTP 404 + 品牌 404 页。
- MCP 文档页 200，工具说明与 258 口径一致。

## 8. storage / console ✅

- localStorage backup→审计操作→restore：逐键 round-trip 深比较 True（`storage-r358-backup.json` = `storage-r358-final.json`，键 lang/shortlist/theme，`STORAGE_IDENTICAL True`）。
- console：全程仅 8 条资源报错，均来自主动访问的 404 测试页（5 条）与撤销后的 410 分享页（3 条），属预期行为；全部内容页 0 error。

## 9. 分享链路 ✅

- POST /api/share → 200，返回 id=`znzSfEx-wp` 与 revokeToken（已脱敏，未落库）。
- GET /s/:id → 内容正确渲染（两个测试域名均可见，截图 H1）。
- DELETE 带 token → 200；随后 GET /api/share/:id → **410**，响应体无残留 items 数据；/s/:id UI 显示已失效文案（截图 H2）。

## 复现步骤

1. `python3 docs/qa/dump_storage_r358.py storage-r358-backup.json`（CDP 连接会话浏览器备份 localStorage）。
2. `python3 docs/qa/audit_browser_r358.py findings-r358.json`（全部断言与截图，含 usage 前后快照）。
3. Lighthouse：`npx lighthouse <url> [--preset=desktop] --chrome-flags="--headless=new --no-sandbox" --output=json`，7 页 × 2 形态。
4. `python3 docs/qa/restore_storage_r358.py storage-r358-backup.json` 恢复并复核 `STORAGE_IDENTICAL`。
