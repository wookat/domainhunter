# R370 零 AI 全站审计报告（覆盖 R365–R368 之后全站）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（Cloudflare Worker 6601bfa4，deploy tip 49c8209）
- 审计方式：严格 0 AI——未点击「开始猎取」「再来一轮」、未触发 refine 及任何 AI CTA；quick-check 仅做精确核验（首页描述框输入裸标签触发）；行业模板按钮仅预填未提交；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 审计前后 `days` dict 完全相等（深比较 True，见 `usage-r370-pre.json` / `usage-r370-post.json` 与 `findings-r370.json.usage_days_equal`；post 采样于 Lighthouse 与 storage 还原之后，覆盖全审计过程），确认全程零 AI 调用。
- 脚本与产物：`audit_browser_r370.py`、`findings-r370.json`、`screenshots-r370/`、`lighthouse-r370/`、`dump_storage_r370.py` / `restore_storage_r370.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | ① usage 显示 08-09 `aiErrors.quota: 4`（DeepSeek 402 欠费的用户侧体现，与 R362/R366 相同历史记录，非本轮回归、本轮无新增）。② Lighthouse 移动 /tld hub perf 87（FCP/LCP，比 R366 的 88 低 1 分，属采样波动量级），其余页移动 perf ≥88、桌面全 99–100，无用户可见影响。 |

## 1. 内容计数与 sitemap/footer/llms.txt 自洽 ✅

- sitemap `<loc>` 三次 `?cb=` cache-busting 采样均为 **862** = 8 核心页 + 276 tld + 272 guide + 306 vs，与任务口径 862 及公式 `8+tld+guide+vs` 一致，无重复 loc（`sitemap_dup_locs: 0`）。
- sitemap 三类 slug 集合与 `scripts/content-counts.json`（tld 276 / guide 272 / vs 306）逐一相等（set 比较全 True）。
- Hub 页浏览器端去重链接计数：/tld **276**、/guide **272**、/vs **306**（截图 D-*）。
- llms.txt：tld 276 / guide 272 / vs 306，slug 集合与 sitemap 完全一致。
- footer 三栏去重链接计数：/tld/ 276、/guide/ 272、/vs/ 306，含 R367 新 TLD（clothing/cooking/gift/party/fishing/horse）与 R368 新指南（截图 D4）。
- robots.txt 正常（GPTBot 等 allow + Sitemap 指向）。
- 首页「+262」更多模板 chip 存在（与任务口径 chips +262 一致，截图 F1）。

## 2. R365/R367/R368 新增内容抽查 ✅

- R365 新 6 对比页（beer-vs-pub/pub-vs-bar/spa-vs-salon/food-vs-restaurant/attorney-vs-lawyer/dentist-vs-dental）zh + en 共 12 个 URL 全部 SSR 200（≈122–125KB），JSON-LD FAQPage 齐全。
- R367 新 6 TLD 页（clothing/cooking/gift/party/fishing/horse）zh + en 共 12 个 URL 全部 SSR 200（≈136–137KB），JSON-LD FAQPage 齐全。
- R368 新 6 指南（taproom/izakaya/dayspa/snacks/lawfirm/orthodontics）zh + en 共 12 个 URL 全部 SSR 200（≈117–119KB），JSON-LD FAQPage 齐全。
- zh/en 深抽查 12 页（taproom、lawfirm、clothing、party、beer-vs-pub、attorney-vs-lawyer × zh/en）：`<html lang>` zh-CN / en 正确、canonical 规范（zh 无参 / en 带 `?lang=en`）、og 标签 11 处、JSON-LD（guide/vs：BreadcrumbList+Article+FAQPage；tld：BreadcrumbList+FAQPage）齐全，zh/en 标题均为独立文案（截图 E1–E6）。

## 3. 价格一致性与 /api/prices ✅

- `/api/prices` **无 `stale` 标记**（`stale: null`）、`tldCount: 274`（= 276 − cn/so 两个 Porkbun 不报价 TLD，按设计）、`fetchedAt = 2026-08-10 07:47:20 UTC` 与 `pricesLastOk` 一致且晚于 `pricesLastFail`（04:50 UTC，历史失败）。
- /prices 合计 **276 行 = 274 实时价 + 2 静态参考价（cn、so）**——cn/so 静态回退属设计。
- R367 新 6 TLD 的 /prices 行内 ¥ 价 clothing 78/189、cooking 189/189、gift 119/119、party 33/41、fishing 189/189、horse 189/189，与 `types.ts` `tldPrice()` 静态参考价逐一相等；行内 `href="/tld/<slug>"` 六个 slug 精确存在（截图 C1）。
- 六个新 TLD 详情页价卡均渲染「**Porkbun 实时价** · 人民币按汇率 7.2 估算」（非静态回退），页面 $ 价与 `/api/prices` 逐值相等：clothing $10.81/$26.26、cooking $26.26/$26.26、gift $16.58/$16.58、party $4.61/$5.64、fishing $26.26/$26.26、horse $26.26/$26.26；行内含 `/prices` href（截图 C2）；对照 /tld/com 同样渲染实时价（截图 C3）。
- MCP `tld_prices`：`tldCount: 276`、prices dict 276 键（静态参考价补齐 cn/so）；/mcp 文档页「276 popular TLDs」口径同步（截图 G3）。

## 4. 口径核验（quick-check）✅

- 首页描述框输入裸标签 `qzxvkw9r370` 触发精确核验：正常完成（9 个变体，9 可注册），未触碰任何 AI CTA（截图 B1）。
- 「查更多后缀」All：**核验完成：共 277 个 = 276 + 1（com.cn），209 个可注册**，与任务口径 All 277 一致（截图 B3）。
- 行业模板 chip（电商品牌）点击仅预填描述框、未提交（截图 B4 可见描述框已填入电商品牌模板文案，字数 78/500）。

## 5. Lighthouse（移动 + 桌面，hub + 详情页）✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 90/100/100/100 | 100/100/100/100 |
| /tld | 87/100/100/100 | 99/100/100/100 |
| /guide | 88/100/100/100 | 100/100/100/100 |
| /vs | 89/100/100/100 | 100/100/100/100 |
| /tld/clothing | 88/100/100/100 | 100/100/100/100 |
| /guide/taproom | 91/100/100/100 | 100/100/100/100 |
| /vs/beer-vs-pub | 91/100/100/100 | 100/100/100/100 |

移动 perf 87–91（P3②：/tld hub 87，FCP/LCP，波动量级）；桌面 perf 99–100；a11y/bp/seo 全 100。原始 JSON 见 `lighthouse-r370/`。

## 6. UX 抽查 ✅

- 375px：/（scrollWidth 375）、/prices、/tld/clothing、/vs/beer-vs-pub、/guide/taproom（均 360）`scrollWidth ≤ 375`，无横向滚动（截图 K1–K5）。
- light/dark：切换 rgb(11,12,14) ↔ rgb(250,250,249)，刷新后持久、可往返（截图 I1）。
- 404：顶级路径、/tld、/guide、/vs 未知 slug 均返回真实 HTTP 404 + 品牌 404 页（截图 G1）。
- /why、/shortlist、/advanced 均 200 正常渲染（截图 G4–G6）；/mcp 文档页 200（截图 G3）。

## 7. storage / console ✅

- localStorage backup→审计操作→restore：逐键 round-trip 深比较 True（`storage-r370-backup.json` = `storage-r370-final.json`，键 lang/shortlist/theme，`STORAGE_IDENTICAL True`）。
- console：全程仅 8 条资源报错，均来自主动访问的 404 测试页（5 条）与撤销后的 410 分享页（3 条），属预期行为；全部内容页 0 error。

## 8. 分享链路 ✅

- 创建（POST /api/share，200，含 revokeToken）→ /s/:id 页面正确展示两个域名（截图 H1）→ DELETE 撤销 200 → GET /api/share/:id 返回 **410** 且响应体不含条目 → /s/:id UI 显示已失效文案（截图 H2）。

## 附：零 AI 佐证

- `usage_pre.days == usage_post.days`（深比较 True，post 采样覆盖 Lighthouse 及 storage 还原之后）；`byTld.ai` 计数无任何变化；本轮所有交互均走 quick-check / 静态页 / MCP / share API，0 AI 额度消耗。
