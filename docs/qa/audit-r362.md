# R362 零 AI 全站审计报告（覆盖 R357–R360 之后全站）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（Cloudflare Worker a719b51b，deploy tip 0bc9e0e）
- 审计方式：严格 0 AI——未点击「开始猎取」「再来一轮」、未触发 refine 及任何 AI CTA；quick-check 仅做精确核验（首页描述框输入裸标签触发）；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 审计前后 `days` dict 完全相等（深比较 True，见 `usage-r362-pre.json` / `usage-r362-post.json` 与 `findings-r362.json.usage_days_equal`），确认全程零 AI 调用。
- 脚本与产物：`audit_browser_r362.py`、`findings-r362.json`、`screenshots-r362/`、`lighthouse-r362/`、`dump_storage_r362.py` / `restore_storage_r362.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | ① usage 显示 08-09 `aiErrors.quota: 4`（DeepSeek 402 欠费的用户侧体现，充值前 AI 搜索对真实用户不可用，与任务口径一致，非本轮回归）。② Lighthouse 桌面 best-practices 两页 96 分：`valid-source-maps`（生产未发 source map，属常规取舍）与 `inspector-issues`（CSP report-only 类告警），无用户可见影响。 |

## 1. 内容计数与 sitemap/footer/llms.txt 自洽 ✅

- sitemap `<loc>` 三次 `?cb=` cache-busting 采样均为 **826** = 8 核心页 + 264 tld + 260 guide + 294 vs，与任务口径 826 及公式 `8+tld+guide+vs` 一致，无重复 loc（`sitemap_dup_locs: 0`）。
- sitemap 三类 slug 集合与 `scripts/content-counts.json`（tld 264 / guide 260 / vs 294）逐一相等（set 比较全 True）。
- Hub 页浏览器端去重链接计数：/tld **264**、/guide **260**、/vs **294**。
- llms.txt：tld 264 / guide 260 / vs 294，slug 集合与 sitemap 完全一致。
- footer 三栏去重链接计数：/tld/ 264、/guide/ 260、/vs/ 294，含 R360 新 TLD（villas/cruises/voyage/limo/tickets/flowers）与 R357 新对比页。
- robots.txt 正常（GPTBot 等 allow + Sitemap 指向）。
- 首页「+250」更多模板 chip 存在（与任务口径 chips +250 一致）。

## 2. R357–R360 新增内容抽查 ✅

- R357 新 6 对比页（camp-vs-courses、camera-vs-photography、diamonds-vs-jewelry、theater-vs-show、accountants-vs-tax、engineer-vs-engineering）全部 200，SSR 均 ≈122–123KB，JSON-LD FAQPage 齐全。
- R360 新 6 TLD 页（villas/cruises/voyage/limo/tickets/flowers）全部 200，SSR ≈132KB，JSON-LD FAQPage 齐全。
- zh/en 深抽查 8 页（camp-vs-courses、engineer-vs-engineering、villas、tickets × zh/en）：`<html lang>` zh-CN / en 正确、canonical 规范（zh 无参 / en 带 `?lang=en`）、og 标签 11 处、JSON-LD（vs：BreadcrumbList+Article+FAQPage；tld：BreadcrumbList+FAQPage）齐全，标题文案正确（截图 E1–E4）。

## 3. SEO 抽查 ✅

- 上节 8 页 canonical 均精确指向自身 URL；og_count=11；FAQPage JSON-LD 全部存在；en 页 title 为英文独立文案（非机翻占位）。

## 4. 价格一致性与 /api/prices 实时价（R359 修复复核）✅

- **R359 修复已验证生效**：`/api/prices` 响应 **无 `stale` 标记**（`stale: null`）、`tldCount: 262`、`fetchedAt = 2026-08-10 05:18:03 UTC` 且与 `pricesLastOk`（05:18:03）一致；`pricesLastFail`（04:50 UTC）早于 LastOk，属修复前的历史失败。快照已按 264 口径重拉成功。
- /prices 合计 **264 行 = 262 实时价 + 2 静态参考价（cn、so）**——cn/so 静态回退属设计（Porkbun 不报价）。
- R360 新 6 TLD 已在实时快照内：/prices 行内 ¥ 价 villas 78/345、cruises 59/323、voyage 41/337、limo 78/315、tickets 2599/2599、flowers 745/745，与 `types.ts` `tldPrice()` 静态参考价逐一相等（实时价与静态参考价同源核对通过）；行内 `href="/tld/<slug>"` 六个 slug 精确存在。
- 六个新 TLD 页价卡均渲染「**Porkbun 实时价** · 人民币按汇率 7.2 估算」（非 ≈ 静态回退），且行内含 `/prices` href（截图 C2）；对照 /tld/com 同样渲染实时价（截图 C3）。
- MCP `tld_prices`：`tldCount: 264`、prices dict 264 键（静态参考价补齐 cn/so）；/mcp 文档页描述「the 264 popular TLDs we track」同步。

## 5. 口径核验（quick-check）✅

- 首页描述框输入裸标签 `qzxvkw9r362` 触发精确核验：正常完成（9 个变体，9 可注册），未触碰任何 AI CTA（截图 B1）。
- 「查更多后缀」All：**核验完成：共 265 个 = 264 + 1（com.cn），209 个可注册**，与任务口径 All 265 一致（截图 B3）。

## 6. Lighthouse（移动 + 桌面，hub + 代表页）✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 94/100/100/100 | 100/100/96/100 |
| /tld | 89/100/100/100 | 100/100/100/100 |
| /guide | 89/100/100/100 | 100/100/100/100 |
| /vs | 89/100/100/100 | 100/100/100/100 |
| /prices | 88/100/100/100 | 99/100/100/100 |
| /tld/villas | 91/100/100/100 | 100/100/100/100 |
| /vs/camp-vs-courses | 91/100/100/100 | 100/100/96/100 |

移动 perf 全部 ≥88、桌面 perf ≥99；a11y/seo 全 100。桌面 bp 两页 96（P3②：valid-source-maps + inspector-issues/CSP，均无用户可见影响）。原始 JSON 见 `lighthouse-r362/`。

## 7. UX 抽查 ✅

- 375px：/（scrollWidth 375）、/prices、/tld/villas、/vs/camp-vs-courses、/guide/franchise（均 360）`scrollWidth ≤ 375`，无横向滚动（截图 K1–K5）。
- light/dark：切换 rgb(11,12,14) ↔ rgb(250,250,249)，刷新后持久、可往返。
- 404：顶级路径、/tld、/guide、/vs 未知 slug 均返回真实 HTTP 404 + 品牌 404 页（截图 G1）。
- /mcp 文档页 200，工具说明与 264 口径一致（截图 G3）。

## 8. storage / console ✅

- localStorage backup→审计操作→restore：逐键 round-trip 深比较 True（`storage-r362-backup.json` = `storage-r362-final.json`，键 lang/shortlist/theme，`STORAGE_IDENTICAL True`）。
- console：全程仅 8 条资源报错，均来自主动访问的 404 测试页（5 条）与撤销后的 410 分享页（3 条），属预期行为；全部内容页 0 error。

## 9. 分享链路 ✅

- 创建（POST /api/share，200，含 revokeToken）→ /s/:id 页面正确展示两个域名（截图 H1）→ DELETE 撤销 200 → GET /api/share/:id 返回 **410** 且响应体不含条目 → /s/:id UI 显示已失效文案（截图 H2）。

## 附：零 AI 佐证

- `usage_pre.days == usage_post.days`（深比较 True）；`byTld.ai` 计数无任何变化；本轮所有交互均走 quick-check / 静态页 / MCP / share API，0 AI 额度消耗。
