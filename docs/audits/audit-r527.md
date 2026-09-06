# R527 零 AI 全站审计（R514–R522 上线后）

- 审计对象：生产 <https://hunt.zalize.com>，Worker `version d8e5038b`（2026-09-06 07:12Z 部署，含 R519–R522），仓库基线 `deploy/r192-r195` @ `b7f1bd7`
- 审计窗口：2026-09-06 07:42Z–08:20Z；浏览器半场由测试代理执行（真实 Chrome for Testing 137，1280/375，浅/深，zh/en），shell 半场本机 curl / Playwright 无头 / Lighthouse 12
- 零 AI：`/api/ai-search` 请求 **0 次**（浏览器 request hook 计数 0：`r527/ai-search-request-count.json`；无头脚本 `aiSearchRequests: 0`：`r527/ssr-vs-hydrated.log`），`/api/usage` 当日 `searches/fast/refine` **0→0**（§2.11）
- 证据目录：`docs/audits/r527/`（接口/DOM/脚本输出）、`docs/audits/screenshots-r527/`（246 张，PNG 已 256 色量化）；录屏（本机，未入库）：`/home/ubuntu/screencasts/r527-browser/r527-browser-edited.mp4`
- 本分支只新增 `docs/audits/**`，无源码/测试/workflow 改动

## 0. 结论

| 项 | 结论 |
|---|---|
| P0 / P1 / P2 | **无** |
| P3（新发现，4 条） | ① 内容事实 3 处与注册局一手来源不符（`.de`「全球最大 ccTLD」存疑、`.de` Admin-C 表述过时、`.ar`「完全开放」过度简化，共波及 17+14+2 个 HTML，§1 P3-1）；② `/tld/*` chip SSR 静态参考价与实时价偏差 >50% 的 TLD 有 38/351（最大 `.my` ≈$31 vs $2.37），**CLS 影响为 0**，但 SEO 可见价与实时价不一致（§1 P3-2）；③ shortlist 源页在分享被撤销 + 清单清空后仍显示已失效的「Share link (valid 30 days)」URL（§1 P3-3）；④ hub `#hub-g-*` 落地标题顶 127.75–128.25px（`scroll-mt-32` 设计值，超出任务给的 60–120px 口径但标题完整可见）（§1 P3-4） |
| 已知 P3（仍在） | en `/tld` 链接占比 >25% 的页 **370/408**（中位 28.2%，R512 时 100%/73.8%）；根因是「更多 TLD 指南」31 个带价格后缀 chip（§2.9），建议**去掉 chip 价格后缀**而非补正文（模拟：仅此一步 >25% 归零） |
| R511 遗留 | P3-1 `/prices` 375px 徽标竖排 **关闭**；P3-2 撤销分享壳 200+首页 title **关闭**（现 410 + 「分享已撤销」title + noindex）；P3-3 `/vs` 过滤需带点 **关闭**（`com vs cn` 1/444）；`/api/usage` 缺 `indexnowLastAttempt` **关闭**；安全响应头 **仍在**；IndexNow 429 **仍在 / R517 效果未验证**（§3） |
| R519–R522 回归 | 全部通过：FAQ 可见文本 == JSON-LD（38 页 ×3 条，`ldMismatch 0`，全站 2524 页复读率守门通过）；FAQ 锚点落点 79.6–80.3px；chip 同组 ≤30/≤24 且 SSR/水合 href 全等；`/vs` 价格表 SSR == 水合、数值 == `/api/prices`；R522 判断段无乱码/两两不同（§2.5–2.8） |
| 硬指标 | Lighthouse 12 页 ×2：a11y/SEO 全 100，BP 100（1 次 96 见 §2.10），性能桌面 99–100、移动 89–97；CLS 全部 ≤0.005；console/pageerror/requestfailed **0**（预期 404/410 资源 12 次单列）；375px 无横向溢出（104 组合）；内容页 HTML 67–88 KB <90 KB，**三 hub + `/prices` 原始 HTML 208–345 KB 超 90 KB**（Brotli 后 18–39 KB，§2.4 观察项）；sitemap 1270 = 8 + 408 + 410 + 444 = content-counts；hreflang/canonical 矩阵全部自指（§2.3） |
| 本地验收 | `pnpm -r typecheck` ✓ · `pnpm --filter web test` 30 文件 / 343 tests ✓ · `pnpm --filter web build` ✓ · `node scripts/check-content-counts.mjs` 408/410/444 ✓（本分支无源码改动，验收结果 = 基线） |

## 1. 问题清单

### P3-1 内容事实 3 处与注册局一手来源不符（新发现，R522 事实纪律范围）

完整核对表（8 条，含 URL + 抓取日期 + 官方原句）：`r527/fact-check.md`。

| 站内说法 | 官方一手证据 | 判定 | 波及 |
|---|---|---|---|
| `.de` 是「全球最大的 ccTLD / world's largest ccTLD」 | DENIC 2026-06-30 新闻稿：1800 万，自称「leading global position」；CNNIC 第 55 次报告：`.cn` 2082 万（2024-12） | **存疑**——按两家注册局数字 `.cn` > `.de`；DENIC 未自称「最大」 | `/tld/de` + 8 个 `/vs/*de*`（含 `ie-vs-uk` zh）共 17 个 HTML；源 `apps/web/src/content/tlds.ts`、`compares.ts`、`hub-index-tld.ts` |
| `.de`「DENIC 要求提供德国境内的行政联系地址（Admin-C/送达地址）」 | DENIC Terms §3(4)：非德国注册人**仅在 DENIC 提出要求时**两周内指定德国境内送达代理人；现行 Terms/Guidelines 全文无 "Admin-C" | **过时表述** | `/tld/de` + 6 个 `/vs/*de*` zh+en 共 14 个 HTML |
| `.ar`「同样完全开放 / equally open」（与 `.uy` 并列） | NIC Argentina「No residentes」：非居民需公证/海牙认证 + 翻译文件邮件人工验证、税号信息 | **过度简化** | `/vs/uy-vs-ar` zh+en（meta、FAQ 第 1 答、JSON-LD 同句） |

验证通过的 4 条：`.at` 任何人可注册（nic.at FAQ）、`.jp` 需日本邮政地址（JPRS）、`.hk` 二级开放海外（HKIRC）、`.cn` 2082 万（CNNIC）。`.com` 批发价 $10.26（Verisign RRA 附表，2024-09-01 起）站内未断言，作参考。
分级理由：不影响功能与 SEO 结构，但 R522 明确要求「只写能一手核实的事实」；属内容修订（仅改 `content/*.ts` 文案，`faq.test.ts` 守门需重跑）。

### P3-2 `/tld/*` chip 价格文字水合漂移：CLS = 0，但 SSR 静态价与实时价偏差大（已知 P3，本轮量化）

- 漂移面（验证过，`r527/ssr-vs-hydrated.json`）：5 个 `/tld` 页 zh+en 各 16–36 个 chip 文字在水合后改变（`首年 ¥79` → `首年 $12.52 ≈¥90`），**href/slug 两侧全等**；`/guide/*` 推荐 TLD 卡 2–3 处同类漂移；`/vs/*` 与三 hub 0 漂移。
- CLS 量化（验证过，`r527/lighthouse-summary.txt` + 本机 `lighthouse/*.json` `layout-shifts`）：`/tld/com`、`/tld/cn`、`/tld/at?lang=en` 桌面 CLS 0.000（仅 header 0.0003），移动 0.000 / 0.000 / **0.005**；唯一 >0 的 0.0046 来自 `/tld/com` 移动 `main > p.mt-6`（首屏价格卡换实时文案后正文段下移），**chip 区未产生任何 layout-shift 记录**。阈值 0.1，余量 20×。
- 准确性量化（验证过，`r527/static-vs-live-prices.json`）：351 个有实时价的 TLD 中，SSR 静态参考价与实时首年价相对偏差 >50% 的 **38 个**，>100% 的 26 个（`.my` ≈$31 vs $2.37、`.tienda` $50 vs $5.66、`.me` $17 vs $2.73）；中位偏差 5%。
- 结论：**为 CLS 不值得修**（0.005，无 chip 位移）；**为 SSR 价格准确性值得修**——爬虫看到的是静态参考价，38 个 TLD 与站内实时价差 >50%。R521 已为 `/vs` 表格实现「SSR 直出 KV 价格快照 + 客户端复用注入快照」，`/tld` chip / 价格卡复用同一机制即可同时消除漂移与偏差（组件改动，本轮只记录）。

### P3-3 shortlist 源页在分享撤销后仍显示已失效的分享 URL（新发现）

- 现象（验证过，`r527/shortlist.json`、`r527/monitor.json`、`r527/share-lifecycle.json`）：创建分享 → `DELETE /api/share/:id` 200 → 移除最后一个候选后，已打开的 shortlist 页仍显示「Share link (valid 30 days): https://hunt.zalize.com/s/J7kIie8is3」；该 URL 已 410（`r527/share-lifecycle.json` `revoked_status 410`）。无数据泄露，仅状态过期。
- 建议：撤销成功后清除本地分享记录/隐藏 URL（组件改动）。

### P3-4 hub `#hub-g-*` 落地偏移 128px（设计值，超出任务口径）

- 现象（验证过，`r527/hub-anchor-landing.json`）：8 组落地（`/tld#hub-g-general|more`、`/guide#hub-g-*`、`/vs` 分组，zh/en）标题顶 127.75–128.25px，sticky 导航底 124px，标题完整可见。
- 源码：`tld-hub-page.tsx` / `guide-hub-page.tsx` 分组 `scroll-mt-32`（=128px）；内容页 FAQ 锚点 `scroll-mt-20` 落点 79.6–80.3px（`r527/faq-anchor-offsets.json`，12/12 通过）。
- 判定：实现与设计一致，与任务「~80px」口径不同；是否统一为 `scroll-mt-20` 由产品决定。

### 观察项（不列级）

- **三 hub + `/prices` 原始 HTML 超 90 KB**（验证过，`r527/html-size.md`、`html-size-compressed.txt`）：`/vs` 352,752 B、`/prices` 280,617 B、`/tld` 238,194 B、`/guide` 222,057 B；Brotli 传输 24.8 / 18.2 / 38.6 / 33.3 KB。内容页 67.6–87.6 KB（最大 `/vs/hk-vs-sg`）。R511/R523 的 <90 KB 结论只对内容页成立；hub 全量 408/410/444 卡片直出是设计选择，非回归。
- **404 壳 title 为首页 title**（验证过，`r527/error-shells.json`、`r527/shells/404.h`）：`/nonexistent-r527`、`/tld/notatld` 均 404 + `noindex`，但 `<title>` 是首页标题；`/s/doesnotexist` 有专属「分享不存在或已过期」title。SEO 无影响（noindex），一致性小项。
- **分享页水合后 title 未复现**：测试代理在 SPA 内从 shortlist 跳到分享页时 `document.title` 记录为首页标题（`r527/share-lifecycle.json` `active_title`）；本机直接导航 zh/en 两次 SSR title == 水合 title（`r527/share-title-hydration.json`），**推断**为 SPA 路由切换后 title 未更新，未进一步验证。
- **Lighthouse `inspector-issues` 单次 BP 96**（验证过，`lighthouse/tld_cn-desktop.json`）：`/tld/cn` 桌面一次报 "Content security policy" 类 DevTools issue，涉及 16 个同源 JS/API；生产响应无任何 CSP 头（`r527/headers-tld-cn.txt`），其余 23 次运行未复现，**推断**为 Lighthouse 12 注入探针触发的假阳性。
- **安全响应头**（验证过，`r527/headers-home.txt`、`headers-tld-cn.txt`）：仍无 HSTS/CSP/X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy（R484 P3-3 保留）。
- **share DELETE 一次 400 为测试脚本问题**：`r527/share-lifecycle-api.txt` 第一条 `(token) -> token_required 400` 是 shell 变量为空导致（stdin 已被消费），随后同 token 200；非服务端缺陷。

## 2. 逐项证据

### 2.1 零 AI 与状态纪律

- 浏览器：`r527/ai-search-request-count.json` = 0；`r527/browser-requests.json` 1292 次请求无 `/api/ai-search`；未点击首页示例 prompt chips（`r527/browser-test-plan.md`、`home.json`）
- 无头脚本：`ssr-vs-hydrated.py` 对 `**/api/ai-search*` route.abort 并计数 → 0（`r527/ssr-vs-hydrated.log` 末行）
- 存储：`r527/storage-backup.json` → 交互 → 还原 → `storage-restore-diff.json` 空 diff、`storage-restore-stability.json` 稍后再比稳定；`browser-audit-summary.json` `storage_equal: true`
- 未注册域名、未付款、未创建监控（`r527/monitor.json` `created: 0`，仅验证 http:// webhook 被拒）

### 2.2 首页 / quick check / advanced / shortlist / monitor / share（`screenshots-r527/01_*`–`20_*`，`r527/quick-check.json` 等）

- 首页 zh/en × 1280/375 × 浅/深：导航/页脚/语言与主题切换/键盘焦点（`r527/keyboard.json`）通过
- Exact check（不耗 AI）：`zalize-r527-test.*` 9/9 available（`quick-check.json`）
- `/advanced` 批量粘贴 6 个：5 可注册 + `google.com` 已注册（2028-09-14 到期），CSV 按钮存在，375px `scrollWidth 375`（`advanced-bulk.json`）
- shortlist 添加/移除通过（`shortlist.json`）；monitor 非 https webhook 提示「Please enter a URL starting with https://」（`monitor.json`）
- share 浏览器链：create 200 → GET 200（SSR title「1 available domain candidates」）→ DELETE 200 → GET **410** + 「This share has been revoked」+ noindex（`share-lifecycle.json`）
- share API 链（curl，`r527/share-lifecycle-api.txt`）：POST 200 → GET 200 → 错 token 403 / 无 token 400 → 正确 token 200 `{ok:true}` → GET `/api/share/:id` **410** `{"error":"revoked"}` → `/s/:id` **410** + `<title>分享已撤销</title>` + noindex → 再 DELETE 幂等 200；`/s/doesnotexist-r527` 404 + noindex，`/s/bad!id` 404

### 2.3 sitemap / hreflang / canonical / 404·410 壳

- `r527/sitemap-r527.xml`：1270 `<loc>` = 8 静态 + 408 tld + 410 guide + 444 vs；`node scripts/check-content-counts.mjs` 408/410/444 一致
- `r527/lang-matrix.txt`（`scripts/seo-audit/lang-matrix.sh`）：每 URL bare / Accept-Language en / zh / `?lang=en` 四态 → canonical 全部自指，hreflang zh/en/x-default 三元组一致，`vary: Accept-Language`，`cache-control: public, max-age=600`
- 404/410 壳：`r527/error-shells.json`、`r527/shells/`（`404.h`、`tld404.html`、`s-404.html`、`s-live.html`、`s-revoked.html`）

### 2.4 HTML 大小（`r527/html-size.md`、`html-size-compressed.txt`）

| 页 | 原始 | Brotli |
|---|---|---|
| `/` | 14.5 KB | – |
| `/tld/com` `/tld/cn` `/tld/at` `/tld/de` zh/en | 67.6–73.8 KB | – |
| `/vs/hk-vs-sg`（抽样最大内容页） | 87.6 KB | – |
| `/prices` | **274.0 KB** | 18.2 KB |
| `/tld` | **232.6 KB** | 38.6 KB |
| `/guide` | **216.9 KB** | 33.3 KB |
| `/vs` | **344.5 KB** | 24.8 KB |

### 2.5 R519 FAQ（`r527/faq-samples.md` 13 页 ×zh/en 原文、`r527/ssr-vs-hydrated.json`、`r527/faq-anchor-offsets.json`）

- 抽 6 `/vs`（com-vs-cn、de-vs-com、at-vs-de、io-vs-ai、jp-vs-cn、uy-vs-ar；另 hk-vs-sg）、4 `/tld`（com、cn、at、de）、3 `/guide`（saas、ecommerce、fintech；另 ai）：每页 3 条 FAQ，第 1 答为「怎么选 / 适合谁」摘要（`/vs`：一句对比 + 「完整结论见本页『怎么选』」；`/tld`：适合谁；`/guide`：第一条命名策略），第 3 答单句 + 锚点（`#verdict`/`#pick-*`/`#naming`/`#pitfalls`/`#ideas`），人工通读自然、无复读；`/guide/cn-realname` 为 4 条显式 FAQ 无第 3 答锚点（设计例外，`r527/compliance-faq-exception.json`）
- 可见 `<details>` 文本 == FAQPage JSON-LD（锚点保留文字后逐字相等）：38 页 ×2 语言全部 `faqVisibleEqualsLd: true`、`ssrFaqEqualsHyd: true`；全站 thin 统计 `faqDetails.ldMismatch 0`
- 锚点落点：12 次点击 79.625–80.25px（`pass_offset` 12/12），截图 `screenshots-r527/faq_landed_*.png`

### 2.6 R520 chip 同组收敛与 hub 落地（`r527/group-chips-verified.json`、`hub-filters.json`、`hub-anchor-landing.json`）

- `/tld/com` 21、`/tld/cn` 30、`/tld/at`（fallback `more` 组）30、`/tld/de` 30；`/guide/*` ≤30；`/vs/*` 24——全部 `same_group: true`，「查看全部 N 个 →」指向 `/tld#hub-g-general|more`、`/guide#hub-g-*`、`/vs#…`，N = 408/410/444
- hub 过滤：`/tld` `.cn` 1/408、`/guide` `saas` 2/410、`/vs` `com vs cn`（不带点）1/444（R511 P3-3 关闭）
- SSR vs 水合（`ssr-vs-hydrated.json`，40 页样本）：chip 数与 href 序列**全部相等**（含三 hub 409/410/444 条）；文字漂移只出现在带价格的 `/tld` chip 与 `/guide` 推荐 TLD 卡（§1 P3-2）

### 2.7 R521 `/vs` 价格表（`r527/vs-price-tables.json`、`vs-horizontal-scroll.json`、`api-prices.json`）

- 8 张表（4 页 ×zh/en）：`caption` + 4 列 `th scope=col` + 3 行 `th scope=row`；375px 表格容器内滚动、`document.scrollWidth 375`
- 数值 == `/api/prices`（351 TLD 快照）：com 11.08/11.08、de 2.90/4.07、io 28.12/51.80、ai 82.70/82.70 等逐值一致；`.cn`/`.qa`/`.ae` 等无实时价者正确标「参考价」；SSR 表 == 水合表（`ssrTablesEqualHyd` 16/16）

### 2.8 R522 判断段

- 6 个 `/vs` 页判断段组合专属、两两不同、无乱码（`screenshots-r527/matrix_vs_*.png`、生产 SSR 原文本机留存 `/home/ubuntu/r527/thin/html/vs/*.html`（未入库）、`r527/faq-samples.md`）；事实核对见 §1 P3-1 与 `r527/fact-check.md`（8 条：4 通过、1 存疑、1 过时、1 过度简化、1 参考）

### 2.9 链接占比复算（`r527/link-share-tld-en.md`、`link-share-tld-en-over25.json`、`link-decompose-tld.md`、`link-share-sim.txt`、`thin/`）

- thin-fetch 1262 页 ×2 语言 = 2524 请求全 200（`r527/thin-fetch.log`）；thin-analyze 同类掩码相似度 >0.8 为 0；复读率 0
- `linkShare = 1 − proseWords/bodyWords`：

| 组 | 中位 | P90 | max | >25% |
|---|---|---|---|---|
| tld/zh | 20.8% | 22.8% | 27.3% | 12 (2.9%) |
| **tld/en** | **28.2%** | 31.2% | 36.4% (`/tld/vip`) | **370 (90.7%)** |
| guide/zh · en | 18.2% · 16.8% | – | 21.5% · 21.2% | 0 · 0 |
| vs/zh · en | 18.7% · 21.8% | – | 25.8% · 30.7% | 3 · 66 |
| R512 tld/en（R520 前） | 73.8% | 77.8% | 79.5% | 408 (100%) |

- 分布（en /tld）：≤20% 9 · 20–25% 29 · **25–30% 289 · 30–35% 76 · 35–40% 5**；`/tld/com` en 30.3%（PR #486 记 30.5%，口径差异）
- 根因分解（`link-decompose-tld.md`，逐区块统计）：`/tld/vip` en 188 链接词中「More TLD guides」31 chip = **125 词**（每 chip `.club 1st yr ≈$6` 4 词，价格后缀占 3 词）、「Related TLDs」6 chip = 24 词、其余 39 词；正文 prose 仅 337 词
- 模拟（`link-share-sim.txt`，408 页）：A 仅去掉 More 区 chip 价格后缀 → **>25% 归零，中位 14.5%**；C 只把 More 区上限 30→20 → 仍 66 页；D 每页补正文 +100/+150/+200 词 → 86/23/4 页
- 建议：**优先去掉「更多 TLD 指南」chip 的价格后缀**（`.club` 一词即可，价格在目标页首屏有），一步解决且同时消除 §1 P3-2 的漂移面；补正文（R512 建议的注册局事实）作为独立内容工作推进，不以链接占比为目标。zh 侧 12 页 >25% 同因，同解。

### 2.10 Lighthouse 12（`r527/lighthouse-summary.txt`、`lighthouse.log`；桌面 preset / 默认 mobile，headless Chrome for Testing 137）

| 页 | 桌面 perf/a11y/bp/seo · CLS | 移动 perf/a11y/bp/seo · CLS · LCP |
|---|---|---|
| `/` zh | 100/100/100/100 · 0.000 | 94/100/100/100 · 0.000 · 2.6 s |
| `/?lang=en` | 100/100/100/100 · 0.000 | 90/100/100/100 · 0.000 · 3.0 s |
| `/tld/com` | 100/100/100/100 · 0.000 | 96/100/100/100 · **0.005** · 2.5 s |
| `/tld/at?lang=en` | 100/100/100/100 · 0.000 | 97/100/100/100 · 0.000 · 2.4 s |
| `/tld/cn` | 100/100/**96**/100 · 0.000 | 97/100/100/100 · 0.000 · 2.3 s |
| `/guide/saas` | 100/100/100/100 · 0.000 | 97/100/100/100 · 0.000 · 2.3 s |
| `/vs/com-vs-cn` | 100/100/100/100 · 0.000 | 97/100/100/100 · 0.000 · 2.4 s |
| `/vs/at-vs-de?lang=en` | 100/100/100/100 · 0.000 | 96/100/100/100 · 0.000 · 2.5 s |
| `/prices` | 100/100/100/100 · 0.000 | 91/100/100/100 · 0.000 · 3.4 s |
| `/tld` | 100/100/100/100 · 0.000 | 93/100/100/100 · 0.000 · 3.2 s |
| `/advanced` | 99/100/100/100 · 0.000 | 89/100/100/100 · 0.000 · 3.4 s |
| `/mcp?lang=en` | 100/100/100/100 · 0.000 | 95/100/100/100 · 0.000 · 2.7 s |

移动性能最低 `/advanced` 89（LCP 3.36 s，TBT 2 ms）与 `/prices` 91（LCP 3.36 s），均为首屏字体/JS 下载受移动 4G 节流影响，非本轮改动引入（R511 同量级）。

### 2.11 `/api/usage` 前后对账（`r527/usage-r527-pre.json` 07:42:35Z → `usage-after.json` 08:09:02Z，间隔 26 min ≥60 s）

| 字段（2026-09-06） | 前 | 后 | Δ |
|---|---|---|---|
| `searches` / `fast` / `refine` | 0 / 0 / 0 | 0 / 0 / 0 | **0**（零 AI） |
| `pageviews` home/results/tld/guide/vs/prices/other | 6/–/28/15/72/4/– | 14/2/50/31/88/10/16 | +8/+2/+22/+16/+16/+6/+16（测试代理真实 Chrome 计入；无头/Lighthouse/curl UA 计入 bots） |
| `bots` / `botsBy.other` / `.ai` | 3656 / 3506 / 150 | 7449 / 7294 / 155 | +3793（thin-fetch 2524 + Lighthouse 24 + 无头 40 + curl，量级吻合） |
| `cronLast` / `indexnowLastAttempt` | 06:00:38Z / 06:00:38Z | 同 | 门已放行（两者相等） |
| `indexnowLast` | 2026-09-03T12:00:34Z | 同 | 上次成功仍是 09-03 |
| `indexnowLastResult` | `{ok:false,status:429,retries:2,submitted:0}` | 同 | R515 重试无效；**R517（06:13Z 上线）首个 cron 12:00Z 在审计窗口之后，效果未验证** |
| `indexnowPending` | 1270 | 1270 | – |

### 2.12 MCP 三工具（`r527/mcp-*.json`，JSON-RPC over `POST /mcp`）

- `initialize` ✓、`tools/list` 3 工具 ✓
- `check_domains` ✓（RDAP/DNS 实查，不耗 AI）、`suggest_variants` ✓（纯规则）、`tld_prices` 408 条 ✓；未知工具返回 error（`mcp-unknown-tool.json`）

### 2.13 375px / 深色 / console（`r527/layout-375.json`、`route-matrix.json`、`browser-console.json`、`browser-requests.json`）

- 26 路由 ×zh/en = 52 组页面态、375px 观察 106 次 / 104 组合，`mobile_overflow: []`
- console error 0、pageerror 0、requestfailed 0；预期 404/410 资源事件 12 次单列（`expected_error_events`）
- `/prices` 375px 「续费↑ / renews↑」徽标 `nowrap` 36.8×24 / 52.3×24（`prices-renewal-badge.json`，R511 P3-1 关闭）

## 3. R511 遗留 / R523 回归观察项逐条对照

| 项 | R511/R523 状态 | R527 | 证据 |
|---|---|---|---|
| R511 P3-1 `/prices` 375px 徽标竖排 | 既有，R510 在修 | **关闭** | `r527/prices-renewal-badge.json`、`screenshots-r527/prices_xyz_*_375.png` |
| R511 P3-2 撤销分享 `/s/:id` 200 + 首页 title | 既有，R510 在修 | **关闭**（410 + 专属 title + noindex） | `r527/share-lifecycle-api.txt`、`shells/s-revoked.html` |
| R511 P3-3 `/vs` 过滤需带点 | 既有 | **关闭**（`com vs cn` 1/444） | `r527/hub-filters.json`、`screenshots-r527/hub_filter_vs_*.png` |
| R511 观察 `/api/usage` 无 `indexnowLastAttempt` | 建议加 | **关闭**（R514 已加，且 `indexnowLastResult` R515） | `r527/usage-after.json` |
| R502 P2-2 / R511 IndexNow 429 | 未关闭 | **仍在**；R517 换端点效果**未验证**（首个 cron 12:00Z） | §2.11 |
| R484 P3-3 安全响应头 | 保留 | **仍在** | `r527/headers-home.txt`、`headers-tld-cn.txt` |
| R511 观察 `/prices` 无 Dynadot 列 / `tld_prices` 无 `com.cn` | 设计边界 | **仍在**（未变） | `r527/mcp-tld-prices.json` 408 条 |
| R523 P3 `/tld` chip 价格文字 SSR 静态→实时 | 既有设计 | **仍在，本轮量化**：CLS 0.005、38 TLD 偏差 >50% → 为准确性值得修 | §1 P3-2 |
| R523 观察 `/tld/at` fallback `more` 组主题弱 | 已知 | **仍在**（30 chip 同组 `more`，主题性弱） | `r527/group-chips-verified.json` |
| PR #486 记 `/tld/com` en 链接占比 30.5% | 已知 | **仍在**：30.3%，全 en `/tld` 370/408 >25% | §2.9 |

## 4. 下一步（建议，按性价比排序；均为组件/内容改动，本轮未做）

1. **内容修订（R522 纪律）**：`content/tlds.ts` + `compares.ts` + `hub-index-tld.ts` 改 `.de`「全球最大」→「欧洲最大 / 1800 万（DENIC 2026-06）」、删 Admin-C 表述改为「仅在 DENIC 要求时两周内指定德国境内送达代理人」、`.ar` 改「非居民可注册但需公证/认证文件人工验证」；引用 `r527/fact-check.md` 的 URL；跑 `faq.test.ts` 守门。
2. **去掉「更多 TLD 指南」chip 价格后缀**（或 SSR/客户端都不渲染价格）：一步让 en `/tld` >25% 归零、同时消除 chip 水合漂移面；`Related TLDs` 6 个可保留价格。
3. **`/tld` 价格卡 / 剩余带价 chip 复用 R521 的 SSR KV 价格快照**：消除 38 个 TLD 的静态/实时偏差；`staticPriceFull/Short` 仅作 KV 缺失兜底。
4. shortlist 撤销分享后清理本地分享 URL；404 壳专属 title；hub `scroll-mt-32` 是否统一为 `-20` 由产品定。
5. 12:00Z 后读 `/api/usage` 核对 R517：期望 `indexnowLastResult.ok=true, fallbackHosts:["yandex.com"]`、`indexnowPending` 1270→970。
6. 安全响应头（R484 P3-3）仍待排期。

## 5. 需注意 / 未覆盖

- 本轮**未跑 axe**；a11y 只有 Lighthouse 100 + 键盘焦点抽查。
- 事实核对只覆盖 8 条（4 通过 / 3 有问题 / 1 参考），未逐页核对全部 444 个 `/vs` 判断段；`.de` 17 处、Admin-C 14 处是同一模板句复用，改源一次即全清。
- 工信部相关 `.cn` 实名/备案表述**未复核**（站点不可达），沿用 R512。
- DENIC 何时取消 Admin-C 的年份**未验证**，报告只引现行条款。
- 分享页水合 title 问题**未复现**（直接导航一致），SPA 内跳转路径未单独验证。
- 「链接占比」口径：thin-analyze 官方值 370/408；`link-share-sim.txt` 用简化分词复算基线为 359/408，模拟结论以相对变化为准。
- 录屏与 Lighthouse 原始 JSON、官方来源 HTML/PDF 留本机（`/home/ubuntu/screencasts/r527-browser/`、`/home/ubuntu/r527/lighthouse/`、`/home/ubuntu/r527/facts/`），未入库。
- 测试代理创建的分享 `J7kIie8is3`、shell 链 `3kFCT2dNo6`、title 复现 `Dbl4uT4zJ6` 均已撤销（410）；未留下 monitor、未注册域名、未付款。
