# R386 零 AI 全站审计报告（覆盖 R381–R384 之后全站）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（Cloudflare Worker 28d01186，deploy tip 719689e）
- 审计方式：严格 0 AI——未点击「开始猎取」「再来一轮」、未触发 refine 及任何 AI CTA；quick-check 仅做精确核验（首页描述框输入裸标签触发）；行业模板按钮仅预填未提交；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 审计前后 `days` 全表 dict 完全相等（深比较 True，见 `usage-r386-pre.json` / `usage-r386-post.json`；post 采样于 Lighthouse 与 storage 还原之后，覆盖全审计过程），确认全程零 AI 调用。
- 脚本与产物：`audit_browser_r386.py`、`findings-r386.json`、`screenshots-r386/`、`lighthouse-r386/`、`dump_storage_r386.py` / `restore_storage_r386.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | ① usage 显示 08-09 `aiErrors.quota: 4`（DeepSeek 402 欠费的用户侧体现，与 R362–R382 相同历史记录，非本轮回归、本轮无新增；08-10 无任何 usage 记录）。② Lighthouse 移动 hub 页 perf 88（/tld、/guide、/vs，FCP/LCP，与 R378/R382 的 86–88 同量级采样波动），其余页移动 perf 89–91、桌面 perf 全 100，无用户可见影响。 |

## 1. 内容计数与 sitemap/footer/llms.txt 自洽 ✅

- sitemap `<loc>` 三次 `?cb=` cache-busting 采样均为 **934** = 8 核心页 + 300 tld + 296 guide + 330 vs，与任务口径 934 及公式 `8+tld+guide+vs` 一致（R385 未集成，按 934 口径），无重复 loc（`sitemap_dup_locs: 0`）。
- sitemap 三类 slug 集合与 `scripts/content-counts.json`（tld 300 / guide 296 / vs 330）逐一相等（set 比较全 True）。
- Hub 页浏览器端去重链接计数：/tld **300**、/guide **296**、/vs **330**（截图 D-*）。
- llms.txt：tld 300 / guide 296 / vs 330，slug 集合与 sitemap 完全一致。
- footer 三栏去重链接计数：/tld/ 300、/guide/ 296、/vs/ 330，含 R383 新 TLD（wang/day/meme/quest/kids/foundation）与 R384 新指南（截图 D4）。
- robots.txt 正常（GPTBot 等 allow + Sitemap 指向）。
- 首页「+286」更多模板 chip 存在（与任务口径 chips +286 一致，截图 F1）。

## 2. R381/R383/R384 新增内容抽查 ✅

- R381 新 6 对比页（basketball-vs-team/rugby-vs-football/cricket-vs-club/fish-vs-fishing/fan-vs-club/win-vs-bet）zh + en 共 12 个 URL 全部 SSR 200（≈130–131KB），JSON-LD FAQPage 齐全。
- R383 新 6 TLD 页（wang/day/meme/quest/kids/foundation）zh + en 共 12 个 URL 全部 SSR 200（≈143–145KB），JSON-LD FAQPage 齐全。
- R384 新 6 指南（basketball/rugby/cricket/aquascaping/fanclub/giveaway）zh + en 共 12 个 URL 全部 SSR 200（≈121–124KB），JSON-LD FAQPage 齐全。
- zh/en 深抽查 12 页（aquascaping、giveaway、wang、quest、basketball-vs-team、win-vs-bet × zh/en）：`<html lang>` zh-CN / en 正确、canonical 规范（zh 无参 / en 带 `?lang=en`）、og 标签 11 处、JSON-LD（guide/vs：BreadcrumbList+Article+FAQPage；tld：BreadcrumbList+FAQPage）齐全，zh/en 标题均为独立文案（截图 E1–E6）。

## 3. 价格一致性与 /api/prices ✅

- `/api/prices` **无 `stale` 标记**（`stale: null`）、`tldCount: 298`（= 300 − cn/so 两个 Porkbun 不报价 TLD，按设计）、prices dict 298 键。
- /prices 合计 **300 行 = 298 实时价 + 2 静态参考价（cn、so）**——cn/so 静态回退属设计（截图 C1）。
- R383 新 6 TLD 的 /prices 行内 ¥ 价 wang 30/44、day 78/78、meme 78/78、quest 11/93、kids 41/137、foundation 43/163，与 `types.ts` `tldPrice()` 静态参考价逐一相等；行内 `href="/tld/<slug>"` 六个 slug 精确存在。
- 六个新 TLD 详情页价卡均渲染「**Porkbun 实时价** · 人民币按汇率 7.2 估算」（非静态回退），页面 $ 价与 `/api/prices` 一致：wang $4.12/$6.05、day $10.81/$10.81、meme $10.81/$10.81、quest $1.54/$12.98、kids $5.66/$19.05、foundation $5.99/$22.66；行内含 `/prices` href（截图 C2）；对照 /tld/com 同样渲染实时价（截图 C3）。
- MCP `tld_prices`：`tldCount: 300`、prices dict 300 键（静态参考价补齐 cn/so）；/mcp 文档页「300 个」口径同步（截图 G3）。

## 4. 口径核验（quick-check）✅

- 首页描述框输入裸标签 `qzxvkw9r386` 触发精确核验：正常完成（9 个变体，9 可注册），未触碰任何 AI CTA（截图 B1）。
- 「查更多后缀」All：**核验完成：共 301 个 = 300 + 1（com.cn），200 个可注册**，与任务口径 All 301 一致（截图 B3）。
- 行业模板 chip（E-commerce brand）点击仅预填描述框、未提交（截图 B4；首轮脚本同步读值为空系 React 渲染竞态，真实点击复测预填正常，文案完整写入描述框）。

## 5. Lighthouse（移动 + 桌面，hub + 详情页）✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 91/100/100/100 | 100/100/100/100 |
| /tld | 88/100/100/100 | 100/100/100/100 |
| /guide | 88/100/100/100 | 100/100/100/100 |
| /vs | 88/100/100/100 | 100/100/100/100 |
| /tld/wang | 90/100/100/100 | 100/100/100/100 |
| /guide/aquascaping | 89/100/100/100 | 100/100/100/100 |
| /vs/win-vs-bet | 89/100/100/100 | 100/100/100/100 |

移动 perf 88–91（P3②：三个 hub 页 88，FCP/LCP，与 R378/R382 的 86–88 同量级）；桌面 perf 全 100；a11y/bp/seo 全 100。原始 JSON 见 `lighthouse-r386/`。

## 6. UX 抽查 ✅

- 375px：/（scrollWidth 375）、/prices、/tld/wang、/vs/win-vs-bet、/guide/aquascaping（均 360）`scrollWidth ≤ 375`，无横向滚动（截图 K1–K5）。
- light/dark：切换 rgb(11,12,14) ↔ rgb(250,250,249)，刷新后持久、可往返（截图 I1）。
- 404：顶级路径、/tld、/guide、/vs 未知 slug 均返回真实 HTTP 404 + 品牌 404 页（截图 G1）。
- /why、/shortlist、/advanced 均 200 正常渲染（截图 G4–G6）；/mcp 文档页 200（截图 G3）。

## 7. storage / console ✅

- localStorage backup→审计操作→restore：逐键 round-trip 深比较 True（`storage-r386-backup.json` = `storage-r386-final.json`，键 lang/shortlist/theme，`STORAGE_ROUNDTRIP_EQUAL True`）。
- console：全程仅 8 条资源报错，均来自主动访问的 404 测试页（5 条）与撤销后的 410 分享页（3 条），属预期行为；全部内容页 0 error。

## 8. 分享链路 ✅

- 创建（POST /api/share，200，含 revokeToken）→ /s/:id 页面正确展示两个域名（截图 H1）→ DELETE 撤销 200 → GET /api/share/:id 返回 **410** 且响应体不含条目 → /s/:id UI 显示已失效文案（截图 H2）。

## 附：零 AI 佐证

- `usage-r386-pre.json` 与 `usage-r386-post.json` 的 `days` 全表 dict 深比较 **True**（post 采样于 Lighthouse 全部跑完、storage 还原之后）。
- 08-09 历史 `aiErrors.quota: 4` 为既有记录（P3①），08-10 当日无任何 usage 记录、无任何新增 AI 计数。
