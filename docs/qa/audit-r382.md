# R382 零 AI 全站审计报告（覆盖 R377–R380 之后全站）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（Cloudflare Worker e802de05，deploy tip 094f02a）
- 审计方式：严格 0 AI——未点击「开始猎取」「再来一轮」、未触发 refine 及任何 AI CTA；quick-check 仅做精确核验（首页描述框输入裸标签触发）；行业模板按钮仅预填未提交；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 审计前后 `days` dict 完全相等（深比较 True，见 `usage-r382-pre.json` / `usage-r382-post.json`；post 采样于 Lighthouse 与 storage 还原之后，覆盖全审计过程），确认全程零 AI 调用。
- 脚本与产物：`audit_browser_r382.py`、`findings-r382.json`、`screenshots-r382/`、`lighthouse-r382/`、`dump_storage_r382.py` / `restore_storage_r382.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | ① usage 显示 08-09 `aiErrors.quota: 4`（DeepSeek 402 欠费的用户侧体现，与 R362/R366/R370/R374/R378 相同历史记录，非本轮回归、本轮无新增；08-10 无 aiErrors）。② Lighthouse 移动 /tld hub perf 86（FCP/LCP，与 R370/R374/R378 的 87 同量级采样波动），其余页移动 perf 88–90、桌面 perf 全 100，无用户可见影响。 |

## 1. 内容计数与 sitemap/footer/llms.txt 自洽 ✅

- sitemap `<loc>` 三次 `?cb=` cache-busting 采样均为 **916** = 8 核心页 + 294 tld + 290 guide + 324 vs，与任务口径 916 及公式 `8+tld+guide+vs` 一致（R381 未集成，按 916 口径），无重复 loc（`sitemap_dup_locs: 0`）。
- sitemap 三类 slug 集合与 `scripts/content-counts.json`（tld 294 / guide 290 / vs 324）逐一相等（set 比较全 True）。
- Hub 页浏览器端去重链接计数：/tld **294**、/guide **290**、/vs **324**（截图 D-*）。
- llms.txt：tld 294 / guide 290 / vs 324，slug 集合与 sitemap 完全一致。
- footer 三栏去重链接计数：/tld/ 294、/guide/ 290、/vs/ 324，含 R379 新 TLD（basketball/rugby/cricket/fish/fan/win）与 R380 新指南（截图 D4）。
- robots.txt 正常（GPTBot 等 allow + Sitemap 指向）。
- 首页「+280」更多模板 chip 存在（与任务口径 chips +280 一致，截图 F1）。

## 2. R377/R379/R380 新增内容抽查 ✅

- R377 新 6 对比页（casino-vs-bet/bet-vs-poker/poker-vs-games/vodka-vs-wine/futbol-vs-soccer/moda-vs-fashion）zh + en 共 12 个 URL 全部 SSR 200（≈129–131KB），JSON-LD FAQPage 齐全。
- R379 新 6 TLD 页（basketball/rugby/cricket/fish/fan/win）zh + en 共 12 个 URL 全部 SSR 200（≈141–142KB），JSON-LD FAQPage 齐全。
- R380 新 6 指南（craftvodka/esportsnews/sportsodds/tabletopclub/futsal/fashionbuyer）zh + en 共 12 个 URL 全部 SSR 200（≈120–124KB），JSON-LD FAQPage 齐全。
- zh/en 深抽查 12 页（craftvodka、futsal、basketball、win、casino-vs-bet、moda-vs-fashion × zh/en）：`<html lang>` zh-CN / en 正确、canonical 规范（zh 无参 / en 带 `?lang=en`）、og 标签 11 处、JSON-LD（guide/vs：BreadcrumbList+Article+FAQPage；tld：BreadcrumbList+FAQPage）齐全，zh/en 标题均为独立文案（截图 E1–E6）。

## 3. 价格一致性与 /api/prices ✅

- `/api/prices` **无 `stale` 标记**（`stale: null`）、`tldCount: 292`（= 294 − cn/so 两个 Porkbun 不报价 TLD，按设计）、prices dict 292 键。
- /prices 合计 **294 行 = 292 实时价 + 2 静态参考价（cn、so）**——cn/so 静态回退属设计（截图 C1）。
- R379 新 6 TLD 的 /prices 行内 ¥ 价 basketball 302/309、rugby 302/309、cricket 152/152、fish 59/256、fan 48/315、win 33/41，与 `types.ts` `tldPrice()` 静态参考价逐一相等；行内 `href="/tld/<slug>"` 六个 slug 精确存在。
- 六个新 TLD 详情页价卡均渲染「**Porkbun 实时价** · 人民币按汇率 7.2 估算」（非静态回退），页面 $ 价与 `/api/prices` 一致：basketball $41.88/$42.88、rugby $41.98/$42.98、cricket $21.09/$21.09、fish $8.24/$35.53、fan $6.69/$43.77、win $4.61/$5.64；行内含 `/prices` href（截图 C2）；对照 /tld/com 同样渲染实时价（截图 C3）。
- MCP `tld_prices`：`tldCount: 294`、prices dict 294 键（静态参考价补齐 cn/so）；/mcp 文档页「294 个」口径同步（截图 G3）。

## 4. 口径核验（quick-check）✅

- 首页描述框输入裸标签 `qzxvkw9r382` 触发精确核验：正常完成（9 个变体，9 可注册），未触碰任何 AI CTA（截图 B1）。
- 「查更多后缀」All：**核验完成：共 295 个 = 294 + 1（com.cn），200 个可注册**，与任务口径 All 295 一致（截图 B3）。
- 行业模板 chip（电商品牌）点击仅预填描述框、未提交（截图 B4；首轮脚本同步读值为空系 React 渲染竞态，真实点击复测预填正常，文案完整写入描述框）。

## 5. Lighthouse（移动 + 桌面，hub + 详情页）✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 89/100/100/100 | 100/100/100/100 |
| /tld | 86/100/100/100 | 100/100/100/100 |
| /guide | 88/100/100/100 | 100/100/100/100 |
| /vs | 88/100/100/100 | 100/100/100/100 |
| /tld/basketball | 90/100/100/100 | 100/100/100/100 |
| /guide/craftvodka | 90/100/100/100 | 100/100/100/100 |
| /vs/casino-vs-bet | 90/100/100/100 | 100/100/100/100 |

移动 perf 86–90（P3②：/tld hub 86，FCP/LCP，与 R370/R374/R378 的 87 同量级）；桌面 perf 全 100；a11y/bp/seo 全 100。原始 JSON 见 `lighthouse-r382/`。

## 6. UX 抽查 ✅

- 375px：/（scrollWidth 375）、/prices、/tld/basketball、/vs/casino-vs-bet、/guide/craftvodka（均 360）`scrollWidth ≤ 375`，无横向滚动（截图 K1–K5）。
- light/dark：切换 rgb(11,12,14) ↔ rgb(250,250,249)，刷新后持久、可往返（截图 I1）。
- 404：顶级路径、/tld、/guide、/vs 未知 slug 均返回真实 HTTP 404 + 品牌 404 页（截图 G1）。
- /why、/shortlist、/advanced 均 200 正常渲染（截图 G4–G6）；/mcp 文档页 200（截图 G3）。

## 7. storage / console ✅

- localStorage backup→审计操作→restore：逐键 round-trip 深比较 True（`storage-r382-backup.json` = `storage-r382-final.json`，键 lang/shortlist/theme，`STORAGE_IDENTICAL True`）。
- console：全程仅 8 条资源报错，均来自主动访问的 404 测试页（5 条）与撤销后的 410 分享页（3 条），属预期行为；全部内容页 0 error。

## 8. 分享链路 ✅

- 创建（POST /api/share，200，含 revokeToken）→ /s/:id 页面正确展示两个域名（截图 H1）→ DELETE 撤销 200 → GET /api/share/:id 返回 **410** 且响应体不含条目 → /s/:id UI 显示已失效文案（截图 H2）。

## 附：零 AI 佐证

- `usage-r382-pre.json` 与 `usage-r382-post.json` 的 `days` 全表 dict 深比较 **True**（post 采样于 Lighthouse 全部跑完、storage 还原之后）。
- 08-09 历史 `aiErrors.quota: 4` 为既有记录（P3①），08-10 当日无 aiErrors、无任何新增 AI 计数。
