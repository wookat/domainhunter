# ROUND-537 零 AI 全站审计（R524–R533 上线后，含安全头 / CSP 数据判读）

- 审计对象：生产 https://hunt.zalize.com ，Worker version `d4f1336a` = 代码 `57d119c`（含 R530–R533，2026-09-06 11:10Z 部署）；本分支基于 `deploy/r192-r195` tip `e51dd5e`，**只含 `docs/`**，无源码改动。
- 审计窗口：2026-09-06 11:40Z–12:35Z（UTC）。所有生产请求带 UA `DomainHunterSeoAudit/1.0` 或本机 Playwright/Chrome；**`/api/ai-search` 请求 0 次**（§2.1）。
- 证据目录：`docs/audits/r537/`（接口 / 头 / 浏览器 DOM / Lighthouse / thin / 价格 / usage / 安全扫描 / 官方事实 / 脚本 / 本地验收日志）、`docs/audits/screenshots-r537/`（289 张，`agent-*` 94 张来自会话 Chrome 走查，其余为 Playwright 矩阵）。
- 录屏（本机，未入库）：`/home/ubuntu/screencasts/r537-production-zero-ai/r537-production-zero-ai-edited.mp4`。
- 标注约定：**验证过** = 本轮一手生产实查 / 脚本实测 / 官方页面原文；**未验证** = 本轮没有取到一手证据；**推断** = 由证据推理但未直接观测。

## 0. 结论

| 项 | 结论 |
|---|---|
| P0 / P1 / P2 | **无**（全部核心流程、SEO 结构、安全头、MCP、share 生命周期均验证通过） |
| P3（新发现，3 条） | ① en `/tld` hub 导语「Start with the**price overview**」缺空格，SSR 直出 `Start with the<a>price overview</a>`（§1 P3-1）；② `.de` 页「DENICdirect 首年 116 欧元、之后每年 58 欧元」与 DENIC FAQ 现行原文 **EUR 79.00 首年 / 79.00 每年** 不符（§1 P3-2）；③ 15 个 zh `/guide` FAQ 问句「XX品牌品牌怎么起名？」叠字（§1 P3-3） |
| 已知 P3（仍在） | 首页 AI textarea 与 `/advanced` 4 input + textarea、`/shortlist` 同步码 input **无 id/name/aria-label/关联 label**（R534 已知，R538 在修，§1 P3-4）；375px 部分控件可见盒 <44px（Back 36、Import 36、MCP Copy 32、`/prices` 排序 32、advanced input 40；FAQ `<summary>` 高 20px，§1 P3-5）；en `/vs` 链接占比 ≥23% **83 页**、>25% **3 页**（R535/R536 修前基线，§2.9）；hub `#hub-g-*` 落地 128px 设计值（§3） |
| R527 遗留对照 | P3-1 内容事实 3 处 → **关闭**（`.de` 不再自称最大、Admin-C 改为「无需 Admin-C」、`uy-vs-ar` 不再「同样完全开放」）；P3-2 `/tld` chip 价格漂移 → **关闭**（R528 chip 去价 + SSR 复用 KV 快照，SSR==DOM 逐字一致）；P3-3 shortlist 失效分享 URL → **关闭**；P3-4 hub 落地 128px → **仍在（设计值）**；安全响应头 → **关闭（R533），CSP 仍 Report-Only**；IndexNow 429 → **关闭**（12:00Z cron 后 `ok=true status=200 submitted=300 fallbackHosts=["yandex.com"] pending 1270→970`）；hub/`/prices` 原始 HTML >90 KB → **仍在（设计）**；详见 §3 |
| 安全头 / CSP | HTML 6 类 + 404/410 壳：HSTS / nosniff / Referrer-Policy / X-Frame-Options DENY / Permissions-Policy(8) / **CSP Report-Only**（每请求 nonce，`report-uri /api/csp-report`）全齐；`/api/*`、`/mcp`、sitemap/robots/llms、OG SVG：仅 nosniff + Referrer-Policy；**静态 `/assets/*.js|css`、`/favicon.svg`、`/fonts/*`、`/wx-share.png` 0 个安全头**（Workers Assets 直出，与 `docs/security-headers.md` 遗留一致）。真实浏览 58 次访问 **0 条** `securitypolicyviolation`、0 条 CSP console；`/api/usage` `cspReports=2` 全程不变，2 条样本均为 R534 合成（`evil.example` / `edge.example`），**无真实用户违规**。Observatory **B 75/100（11/12）**、securityheaders.com **A**（CSP 未 enforce）。**现在不可 enforce**：仅 1 天数据，§7 判据要求 ≥7 天观察且无首方拦截（§2.14） |
| 硬指标 | Lighthouse 52 次（26 页组合 × 桌面/移动）+ 404 snapshot 4 次：a11y / SEO **全 100**，BP 100（2 次 96 为 `inspector-issues`，§2.10），性能桌面 99–100、移动 89–98；console/pageerror/requestfailed **0**（预期 404/410 噪音 10 次单列）；375px 无横向溢出；内容页 HTML 最大 `/vs/io-vs-dev` 84,604 B <90 KB，三 hub + `/prices` 222–353 KB（设计，同 R527）；sitemap **1270 = 8 + 408 + 410 + 444** = content-counts；lang-matrix 36/36 行 html lang / canonical / hreflang / og:locale 自指一致（§2.3） |
| 价格 | `check-static-prices --live`：首年 >50% **0**，>30% **19 个**（与 R534 集合完全一致），续费 >50% 3 个（vip eu us）；`/vs` 选型卡 / R521 价格表 / `/prices` / `/tld` / `/api/prices` 6 个 TLD 数值逐字一致；SSR vs 水合可见价格文字 8 页 0 差异（§2.7） |
| 本地验收 | `pnpm -r typecheck` ✓ · `pnpm --filter web test` **34 文件 / 402 tests ✓** · `pnpm --filter web build` ✓ · `node scripts/check-content-counts.mjs` 408/410/444 ✓ · `node scripts/check-static-prices.mjs --live` ✓（`r537/local/*.log`；本分支无源码改动，结果 = 基线） |

## 1. 问题清单

### P3-1 en `/tld` hub 导语缺空格「Start with theprice overview.」（新发现）

- 现象（验证过）：`r537/http/tld_hub_en.html` SSR 原文 `Start with the<a href="/prices?lang=en" class="tap-target inline-block text-brand hover:underline">price overview</a>.`；截图 `screenshots-r537/tld_en_1280_light.png`。
- 源码：`apps/web/src/components/tld-hub-page.tsx` 把 `meta.intro` 与 `<a>{meta.pricesLink}</a>` 直接相邻，en 文案 `intro` 以 `the` 结尾、`pricesLink` 为 `price overview`，中间没有空格（zh 用「。」收尾不受影响）。`/guide` `/vs` hub 未见同类（`r537/browser/hubs.json` counter_text）。
- 建议：en `intro` 末尾加空格或在组件里插 `{" "}`（1 行文案改动，本轮只记录）。

### P3-2 `.de` 页 DENICdirect 价格与 DENIC FAQ 现行原文不符（新发现，R525/R526 改写页）

- 站内（验证过，`r537/content/tld_de_zh.txt` / `tld_de_en.txt`、`screenshots-r537/tld_de_zh_1280_light.png`）：「同一份 FAQ 还公开了 DENICdirect 的直接注册价格：首年 116 欧元、之后每年 58 欧元」（zh/en 同句）。
- 官方（验证过，2026-09-06 抓取，`r537/facts/official_pages_batch.txt` 第 30–32 行）：https://www.denic.de/en/faq/faqs-for-denicdirect-customers/ 「The DENICdirect service charges **79.00 EUR** for domain administration for one year incl. domain registration. Thereafter, the administration fee is **EUR 79.00** per domain and year.」价格表 https://www.denic.de/en/price-list 同页引用。
- 判定：**事实过时/不符**（推断为引用了旧版 FAQ）。同页其余 5 条事实全部与官方一致（§2.11）。波及 `/tld/de` zh+en 2 个 HTML（`r537/thin/html` grep `116 欧元` 仅 `de.*.html`）；源 `apps/web/src/content/tlds.ts`。

### P3-3 zh `/guide` FAQ 问句叠字「品牌品牌」15 页（新发现）

- 现象（验证过，`node scripts/seo-audit/thin-fetch.mjs` 全站 HTML grep）：`autoparts beekeeping ecommerce furniture icecream kidswear kombucha lightingbrand pets skincare snacks souvenir tea toys wig` 15 个 zh guide 的第 1 条 FAQ 问句为「灯具照明品牌**品牌**怎么起名？」「冰淇淋品牌**品牌**怎么起名？」等（可见 `<summary>` 与 JSON-LD `name` 同句，守门「FAQ==JSON-LD」仍通过）。截图 `screenshots-r537/agent-pair-guide-tea-zh.png`（tea 页 FAQ）。
- 根因（推断）：`apps/web/src/content/guide-faq.ts` 问句模板 `${name}品牌怎么起名？` 与本身已含「品牌」的行业名拼接。
- 建议：模板拼接前去重「品牌」后缀（内容改动，需重跑 `faq.test.ts`）。

### P3-4 表单控件无 id/name/aria-label（已知，R534 记录，R538 在修）— 复核仍在

- 验证过（`r537/browser/form-controls.json`、`form-controls-detail.json`、`screenshots-r537/agent-h-elements-ai-textarea-no-id-name.png`）：
  - `/`：AI textarea `id='' name=''`，无 aria-label / labelledby，无关联 `<label>`（zh/en 同）；
  - `/advanced`：4 个 `input[type=text]` + 1 个 textarea 全部无 id/name/aria/label；
  - `/shortlist`：同步码 input 无 id/name/aria/label；
  - `/prices` `/tld` `/guide` `/vs` 搜索框：**有** aria-label，但 id/name 为空。
- Lighthouse a11y 仍 100（`label`/`aria-input-field-name` 审计未报），因 placeholder 被算作可访问名；但 placeholder 不是可靠标签（消失即无名），且缺 id/name 影响浏览器自动填充与密码管理器识别。分级 P3 不变。

### P3-5 375px 触点：部分可见盒 <44px（已知口径，本轮抽检）

- 验证过（`r537/browser/touch-targets-375.json`、`touch-targets-375-detail.json`、`screenshots-r537/agent-h-shortlist-back-36px.png`、`agent-h-elements-back-36px.png`）：
  - `/shortlist` Back 36px、Import 36px（无 `.tap-target` 伸展）；`/monitors` Back 36px；`/mcp` Copy 4 个 32px；`/prices` 排序按钮 3 个 32px；`/advanced` 4 个 input 40px；
  - 所有内容页 FAQ `<summary>` 可见高 20px（3 条/页），首页 FAQ 6 条 20px；
  - 首页 TLD chip / 热门后缀链接高 44 但宽 38–42px（`.tap-target::before` 只伸展高度）。
- 说明：`.tap-target::before` 伪元素（`apps/web/index.html` 内联 CSS）给内联链接 44px 命中高度，`/tld` `/guide` `/vs` hub 卡片链接 424–831 个中仅 10–60 个 <44（均为文内链接）。以上均为 WCAG 2.5.8 AA（24px）合规、Apple HIG 44pt 建议未达，维持 P3。

### 观察项（不列级）

- **静态资源无安全头 + `max-age=0, must-revalidate`**（验证过，`r537/headers/asset_js.h`、`asset_css.h`、`font.h`、`favicon.h`）：带 hash 的 `/assets/index-*.js|css` 与 `/fonts/*.woff2` 返回 `cache-control: public, max-age=0, must-revalidate`、无 HSTS/nosniff。`docs/security-headers.md` 已记为 Workers Assets 直出的遗留；hash 资源可改 `immutable` 长缓存（性能项，不影响功能）。
- **`/api/share/:id` DELETE 对已撤销分享用错误 token 也返回 200**（验证过，`r537/http/http_layer.log` 「DELETE wrong-token again 200」）：源码 `worker.ts` L794 `if (snapshot.revoked) return c.json({ ok: true })` 先于 token 校验；幂等设计，不泄露数据，仅记录。
- **404 壳一次 `Accept: */*` 记录 1360 B 未复现**：`http_layer.log` L1288 首跑记 `*/* -> 404 text/html 1360`，但留存文件 `r537/http/nf_star.html`（4492 B）与 `nf_text_html_.html`（4500 B）除 og:url / nonce 外逐行相同；12:33Z 复测 `text/html | */* | application/json` 均 404 + 4493–4497 B。**推断**为首跑脚本中 `*/*` 未加引号被 shell 展开导致的采样伪差，非服务端行为；R532「任何 Accept 都返回壳」成立。
- **Lighthouse `inspector-issues` BP 96 两次**（验证过，`r537/lighthouse/failing-audit-details.json`：`vs_pizza-vs-com_en_mobile`、`why_zh_desktop`）：issueType「Content security policy」指向同源 JS/API；同时 `csp-xss` 为 informational「No CSP found in enforcement mode」，58 次真实浏览 0 违规事件，R527 在**无任何 CSP 头**时也出现过同类条目 → **推断**为 Lighthouse 探针假阳性，非生产违规。
- **`td-has-header` on `/why`**（验证过，4 次运行均出现，a11y 仍 100）：`/why` 对比表存在无 `<th>` 的 `<td>` 列；R527 已记录，仍在。
- **`forced-reflow-insight`**（验证过，hub 与 zh 内容页多次出现）：Lighthouse 12 新 insight，性能分未受影响（桌面 100）。
- **直接水合后 title 变化**（验证过，`r537/browser/ssr-vs-dom.json`）：`/advanced` `/why` 水合后 `document.title` 由 `i18n.tsx` 重设为短标题（zh SSR「批量域名核验：粘贴名单一键实时查可注册 | DomainHunter」→ 水合「高级模式 | DomainHunter」；`/why` 同类），同语言、同义不同串；非缺陷，SEO 以 SSR 为准。
- **`/shortlist` `/monitors` SSR 壳不随 `?lang=en` / `Accept-Language` 切换**（新发现，验证过，12:34Z `curl` + `ssr-vs-dom.json`）：两页 `?lang=en` 仍返回 `<html lang="zh-CN">` + 首页 zh 长 title（`worker.ts` L1278–1293 直接回 SPA 壳 + `noindex`），水合后 title 变为「Monitors | DomainHunter」/ 英文首页 title；`/advanced` 无此问题（`<html lang="en">` + en title）。noindex 个人页、无 SEO 影响，仅首屏 `lang` 与 title 短暂不一致；水合后 `<html lang>` 值本轮**未采集**。列观察项。
- **`/vs/*` 页「equally open / 同样完全开放」仍见于 9 组对比页**（8 组 ccTLD `dk-vs-se ge-vs-tr ke-vs-ng lt-vs-lv qa-vs-ae sk-vs-cz tr-vs-ae za-vs-ng` + `finance-vs-com`，`r537/thin/html` grep）：R527 点名的 `uy-vs-ar` 已改；其余 9 组的开放性本轮**未验证**（未逐一核注册局），仅记录供 R535/R536 顺带核。

## 2. 逐项证据

### 2.1 零 AI 与状态纪律

- `r537/browser/visits.json` 58 次访问 `ai_search_requests` 合计 **0**；`r537/browser/flows-requests.json`、`agent-network.jsonl`（会话 Chrome 走查全部请求）grep `ai-search` **0 条**。
- `/api/usage` 前后对账（`r537/usage/usage_before.json` 11:41Z → `usage_final.json` 12:26Z）：`days["2026-09-06"]` `searches 0 → 0`、`fast 0 → 0`、`refine 0 → 0`、`cspReports 2 → 2`；`pageviews` home 56 / tld 204 / guide 88 / vs 191 / prices 27 / other 90（含本轮访问，只记录）；`bots` 17445（含审计 UA）。
- 未点首页示例 prompt chips、AI「开始猎名」、refine、「再来一轮」（录屏 + `screenshots-r537/agent-a-home-*.png`）。
- 存储：`r537/usage/storage_backup.json`（`domainhunter:theme=dark`、`shortlist=[]`、`lang=en`）→ 审计后 `storage.py restore` 输出 `restored 3 local, 0 session keys` / `IDENTICAL`。

### 2.2 首页 / quick check / advanced / shortlist / monitor / share

会话 Chrome 走查录屏 + `screenshots-r537/agent-a-*`、`agent-b-*`、`agent-c-*`；接口层 `r537/http/http_layer.log`。

- 精确查询（`POST /api/search`，非 AI）：`r537probe.com` available（`api_search_exact.txt`）；UI `google.com` taken / `r537-audit-probe-xk3.com` available（`agent-a-exact-google-taken.png`、`agent-a-exact-available-results.png`）。
- advanced 批量：6 个组合结果 + 星标 6 个（`agent-b-bulk-six-results.png`、`agent-b-bulk-starred-six.png`）；`POST /api/check` NDJSON 2 条 `method=rdap`（`api_check.ndjson`）。
- shortlist：星标进入 → 分享 → 撤销 → 清空后**不再显示失效分享 URL**（`agent-c-share-deleted-no-stale-url.png`；R527 P3-3 关闭）。
- monitor：创建 → 列表 enabled → 取消清空（`agent-c-monitor-enabled.png`、`agent-c-monitor-cleaned.png`）。
- share 生命周期（`http_layer.log` L1306–1325，`share_*.json`，`revokeToken` 已脱敏）：create 200 → `GET /api/share/:id` 200（2 items）→ 壳 200 title「2 个候选域名 / 2 domain candidates」→ `DELETE` 200 `{"ok":true}` → API **410** `{"error":"revoked"}` → 壳 **410** title「分享已撤销 / This share has been revoked」+ `noindex`（`share_shell_410*.html`；浏览器矩阵 `s_V_-LuRIDhc_*`、`agent-c-revoked-zh-1280.png`、`agent-c-own-share-revoked-en-375.png`）。
- 「注册」为下拉菜单，无自动注册/付款（`agent-c-register-menu-only.png`）。

### 2.3 sitemap / hreflang / canonical / 404·410 壳

- `r537/http/sitemap.xml`：`total 1270 unique 1270`，分布 `static 8 + tld 408 + guide 410 + vs 444`，`xhtml:link` 3810 = 1270×3，loc 中 `lang=en` 0；与 `scripts/content-counts.json` 一致（`http_layer.log` L1–1284）。
- `r537/http/lang-matrix.md`（`scripts/seo-audit/lang-matrix.sh https://hunt.zalize.com <cb>`，12:31Z）：9 路径 × 4 模式 = 36 行，`bare/al-zh → zh-CN canonical 自指`、`al-en → en canonical 无 ?lang`、`q-en → en canonical ?lang=en`，hreflang 三元组全部一致，`Vary: Accept-Language`。
- 404 壳（`nf_*.html`、`headers/nf_shell.h`）：`Accept: text/html | application/json | */* | image/png` 全部 **404 + text/html 双语壳**；`?lang=en` → `<html lang="en">` + 「Page not found | DomainHunter」；`/api/nope` 与 `/x.js`、`/nope-r537.png` 空体 404（`headers/api_nf.h`、`nope_png.h`，SKILL 预期）；`/s/unknown` 404「分享不存在或已过期」+ noindex（`s_unknown.html`）。
- 404 壳带完整安全头（含 CSP-RO），`nf_shell.h` / `s_nf.h`。

### 2.4 HTML 大小（`r537/http/html_sizes.txt`，未压缩）

内容页 24 样本 67–84,604 B（最大 `/vs/io-vs-dev`）均 <90 KB；`/guide` 222,156、`/tld` 238,328、`/prices` 280,716、`/vs` 352,851 B（与 R527 208–345 KB 同量级，全量卡片直出设计）。

### 2.5 浏览器矩阵（Playwright，`r537/browser/visits.json`、`layout-375.json`、`events-raw.json`）

- 29 路径 × zh/en = 58 次访问（含 `/`、`/advanced`、`/shortlist`、`/monitors`、三 hub、`/tld/{ar,cn,cz,de,jp,uk}`、`/guide/{lawfirm,nocode,robotics,saas}`、`/vs/{ai-vs-tech,com-vs-cn,io-vs-dev,me-vs-io,pizza-vs-com,uk-vs-com}`、`/prices` `/why` `/mcp`、404、share 200/404）；每路径 1280 浅色 + 375 浅/深色截图（`screenshots-r537/<route>_<lang>_<w>_<theme>.png`）。
- `console_real 0 / pageerror 0 / requestfailed 0 / responses4xx_real 0 / csp_violations 0`；预期噪音 10 次（404/410 目标页本身的状态码）。
- 375px 横向溢出 0（`layout-375.json` `scrollWidth<=375` 全真）。
- `/tld/de` `/tld/fr` `/tld/ca` `/tld/ar` 375px「更多 TLD」chip 无价格后缀（R528，`agent-e-more-tld-price-free.png`、`agent-e-price-free-*-375.png`）。

### 2.6 hub 过滤与 `#hub-g-*` 落地（`r537/browser/hubs.json`、`hub-anchor-landing.json`）

- 过滤：`/tld` `.cn` → 1/408；`/guide` `saas` → 2/410；`/vs` `com vs cn` → 1/444（zh/en 同，`screenshots-r537/hub_filter_*.png`、`agent-d-*-filter-*.png`）。
- 分组链接数：tld 22/24/28/28/63/24/127/14/78 = 408；guide、vs 合计 410/444。
- 落地 12 组（三 hub × zh/en × 1280/375，直接导航 + 站内 chip）：h2 顶 **127.6–128.4px**，sticky nav 底 109px（1280）/ 未遮挡，`scroll-margin-top: 128px`（`scroll-mt-32`）；截图 `hub_landing_*.png`、`agent-d-mobile-*-landing.png`。与 R527 P3-4 相同 → 仍在（设计值）。

### 2.7 SSR vs 水合 & 价格一致性

- `r537/browser/ssr-vs-dom-textcontent.json`（两侧都带 `?lang=`，去 `<script>/<style>` 后比可见价格 token）：`/tld/de` zh 11/11、en 14/14；`/tld/uk` en 14/14、zh 14/14；`/vs/uk-vs-com` en 14/14；`/vs/com-vs-cn` zh 11/11；`/tld/cn` zh 6/6；`/guide/saas` en 3/3 —— **0 差异**。首版脚本（`ssr-vs-dom.json`）把 JSON-LD/内嵌脚本里的价格也算进 SSR 侧造成「缺失」假阳性，已修正并保留原文件供比对。
- `r537/prices/price_parity.json`（com cn io dev uk de）：`/api/prices` `registration/renewal` == `/prices` 行 == `/tld/<x>` 首屏价格卡 == `/vs` 选型卡 == R521 价格表行（如 `.io` `$28.12 ¥202 / $51.8 ¥373` 五处一致；`.cn` 无实时价时五处均为「静态参考价 首年 ¥33 · 续费 ¥38/年 · 非实时报价」）。`/vs/uk-vs-com` 375px 表格横向滚动截图 `agent-e-uk-table-scrolled-right.png`、深色 `agent-e-uk-vs-com-table-375-dark.png`。
- `r537/prices/static_prices_live.txt` 与 `r537/local/local_static_prices.log`（`node scripts/check-static-prices.mjs --live`，快照 `fetchedAt=1788674449621 stale=false live=351`）：首年 >50% **0**；>30% **19** = `site cc ca vip club furniture co sh uk org dev eu us network works glass nz ph la`（与 R534 集合逐字相同）；续费 >50% `vip eu us`；静态有价实时缺价 58 个（cn com.cn jp fr … 回退静态）。

### 2.8 MCP 三工具（`r537/http/mcp_*.json`，JSON-RPC over `POST /mcp`）

`initialize` → `domainhunter 1.0.0` protocol `2025-03-26`；`tools/list` = `check_domains tld_prices suggest_variants`；`check_domains(google.com, baidu.cn, r537…)` taken/taken/available 含 expiresAt；`tld_prices` 408 条（`cn` 带 `approx:true`）；`suggest_variants` 6 条 `.io` 变体含 `firstYearPriceUSD 28.12`；未知工具 → `-32602 unknown tool`。响应头仅 nosniff + Referrer-Policy（`headers/mcp_post.h`）。会话 Chrome 走查 `agent-mcp.json`。

### 2.9 内容质量与链接占比（`node scripts/seo-audit/thin-fetch.mjs --out ~/r537/thin` 1262 页 × 2 语 = 2524 请求，非 200 = 0；`thin-analyze.mjs --seed 537` → `r537/thin/`）

- 复读率守门：`dupSentenceRatio` 中位 0；`faqDetails` 3/页、`ldMismatch 0`（`summary.json`）。
- 链接占比 `1 − proseWords/bodyWords`（`linkshare-dist.txt`、`vs-en-linkshare-ge23.csv`）：

| 类 | 语 | >25% | ≥23% |
|---|---|---|---|
| /tld | en | 0 | 0 |
| /tld | zh | 0 | 0 |
| /guide | en | 0 | 0 |
| /guide | zh | 0 | 0 |
| /vs | en | **3**（`page-vs-com` `fitness-vs-coach` `clinic-vs-care`） | **83** |
| /vs | zh | 0 | 1 |

  R527 时 en `/tld` >25% 370/408 → 现 **0**（R528 chip 去价生效）。en `/vs` 83 页 ≥23% 为 R535/R536 修前基线。
- 人工阅读（`r537/content/*.txt` 14 组 zh+en 原文；`screenshots-r537/agent-pair-*.png`）：
  - `/vs` 6 页：`com-vs-cn` `io-vs-dev` `uk-vs-com`（R530）`academy-vs-coach`（R530）`academy-vs-school`（R530）`agency-vs-co`（R530）—— 判断段各自围绕具体场景（英国市场信号、学院 vs 教练的受众、机构 vs `.co` 的价格阶梯），FAQ 三问不同句、无占位符/乱码；R530 4 页 linkShare 18.2–18.9%（`pages.csv`）。
  - `/tld` ccTLD 5 页：`de ca ar fr jp`（R525/R526 改写）—— 全部引用注册局具名文件（DENIC 2025 活动报告、CIRA CPR、NIC.ar 资费页、Afnic 命名政策 2026-07-06、JPRS 统计页），段落有具体数字与日期，非模板句；`.de` 一处价格过时（P3-2）。
  - `/guide` 3 页：`saas indiehacker tea` —— 行业段自然；`tea` zh FAQ 首问叠字（P3-3）。
- 模板句：`templateSentShare` 中位 tld 0.47/0.42、guide 0.36/0.28、vs 0.41/0.40（zh/en，`summary.json`），来自 FAQ 固定问法与价格句框架，与 R527 同量级，未见新增模板段。

### 2.10 Lighthouse（`r537/lighthouse/scores.json`、`failing-audit-details.json`、`lighthouse.log`；Lighthouse 12 headless Chrome，桌面 preset / 默认 mobile；顺序 性能/a11y/BP/SEO）

| 页 | 桌面 zh | 桌面 en | 移动 zh | 移动 en |
|---|---|---|---|---|
| `/` | 100/100/100/100 | 100/100/100/100 | 92/100/100/100 | 91/100/100/100 |
| `/advanced` | 99/100/100/100 | 99/100/100/100 | 89/100/100/100 | 89/100/100/100 |
| `/tld` | 100/100/100/100 | 100/100/100/100 | 90/100/100/100 | 92/100/100/100 |
| `/guide` | 100/100/100/100 | 100/100/100/100 | 91/100/100/100 | 93/100/100/100 |
| `/vs` | 100/100/100/100 | 100/100/100/100 | 92/100/100/100 | 91/100/100/100 |
| `/tld/de` | 100/100/100/100 | 100/100/100/100 | 90/100/100/100 | 91/100/100/100 |
| `/tld/uk` | 100/100/100/100 | 100/100/100/100 | 91/100/100/100 | 91/100/100/100 |
| `/guide/saas` | 100/100/100/100 | 100/100/100/100 | 97/100/100/100 | 97/100/100/100 |
| `/vs/com-vs-cn` | 100/100/100/100 | 100/100/100/100 | 97/100/100/100 | 95/100/100/100 |
| `/vs/pizza-vs-com` | 100/100/100/100 | 100/100/100/100 | 97/100/100/100 | 95/100/**96**/100 |
| `/prices` | 100/100/100/100 | 99/100/100/100 | 92/100/100/100 | 92/100/100/100 |
| `/why` | 100/100/**96**/100 | 100/100/100/100 | 98/100/100/100 | 98/100/100/100 |
| `/mcp` | 100/100/100/100 | 100/100/100/100 | 96/100/100/100 | 96/100/100/100 |
| 404 壳（snapshot） | —/100/100/100 | —/100/100/100 | —/100/100/100 | —/100/100/100 |

- 404 页用 `lighthouse --mode snapshot`（`lh_snapshot_404.mjs`，HTTP 404 时 navigation 模式不出分）。
- 非 100 的审计：`inspector-issues`（2 次，见观察项）、`td-has-header`（`/why`）、`forced-reflow-insight`（多次，insight 不扣分）。a11y 明细中 `label` / `aria-input-field-name` 未报（placeholder 计为名），故 P3-4 由 DOM 检查而非 Lighthouse 得出。

### 2.11 官方事实复核（6 条 + 1，`r537/facts/*.txt` 为 2026-09-06 抓取原文）

| 站内说法 | 官方一手证据 | 判定 |
|---|---|---|
| `.de` 2025 年末 17,663,886 个，境外 2,167,487（12.3%） | https://www.denic.de/en/2025-activity-report/ | **一致** |
| `.de` IANA 委派 1986-11-05 | https://www.iana.org/domains/root/db/de.html | **一致** |
| `.de` DENICdirect 首年 116 € / 之后 58 €/年 | https://www.denic.de/en/faq/faqs-for-denicdirect-customers/ 「79.00 EUR … Thereafter EUR 79.00 per domain and year」 | **不符**（P3-2） |
| `.ca` 需加拿大存在，普通居民 = 12 个月内居住 >183 天 | https://www.cira.ca/en/resources/documents/domains/canadian-presence-requirements-registrants/ 、https://www.cira.ca/en/legal-policy-and-compliance/canadian-presence-requirements/ | **一致** |
| `.ar` 直接 name.ar ARS 25,500，`.com.ar/.net.ar` ARS 8,500，年付 | https://nic.ar/es/dominios/aranceles | **一致** |
| `.fr` 资格：EU 成员国 / 冰岛 / 列支敦士登 / 挪威 / 瑞士 自然人或法人（命名政策 2026-07-06 第 90 条） | https://www.afnic.fr/wp-media/uploads/2026/07/afnic-naming-policy-2026-07-06.pdf （`facts/afnic-naming-policy-2026-07-06.txt`） | **一致** |
| `.jp` 2026-08-01 总量 1,879,925（通用 1,293,314 含日文 79,307；属性型 501,583） | https://jprs.co.jp/en/stat/ | **一致** |
| `.uk` 页对本地存在**不作断言**（「neither anyone can register nor a UK address is required」） | https://nominet.uk/wp-content/uploads/2025/03/UK-rules-of-registration.pdf 、https://registrars.nominet.uk/uk-namespace/gdpr-changes/ 未列本地存在条件 | **一致**（审慎表述） |

R527 P3-1 三处：`.de`「全球最大」→ 现文「does not claim the number-one spot … lists .de below .cn」；Admin-C → 「无需 Admin-C；仅在 DENIC 要求时两周内指定送达代表（§3(4)）」；`uy-vs-ar`「同样完全开放」→ 全站 grep 已无。全部**关闭**。

### 2.12 安全响应头矩阵（`r537/security/headers-matrix.tsv`、`r537/headers/*.h`，`curl -I` 26 路径，11:42Z）

| 类别（样本） | HSTS | nosniff | Referrer-Policy | XFO | Permissions-Policy | CSP-RO | CSP |
|---|---|---|---|---|---|---|---|
| HTML：`/` `/?lang=en` `/tld/cn` `/vs/com-vs-cn` `/guide/saas` `/shortlist` `/mcp`(GET) | `max-age=31536000; includeSubDomains` | ✓ | `strict-origin-when-cross-origin` | `DENY` | ✓（8 项） | ✓ nonce + `report-uri /api/csp-report` | – |
| 404 壳 `/does-not-exist` · 410/404 `/s/*` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `/api/usage` `/api/prices` `/api/stats` `/api/registrars` `/api/nope`(404) | – | ✓ | ✓ | – | – | – | – |
| `POST /mcp` | – | ✓ | ✓ | – | – | – | – |
| `/sitemap.xml` `/robots.txt` `/llms.txt` `/api/og/tld/cn`(SVG) | – | ✓ | ✓ | – | – | – | – |
| `/assets/index-*.js` `/assets/index-*.css` `/favicon.svg` `/fonts/inter-latin-var.woff2` `/wx-share.png` | – | – | – | – | – | – | – |
| `/nope-r537.png`（Worker 404） | – | ✓ | ✓ | – | – | – | – |

CSP-RO 原文（`headers/home.h`）：`default-src 'self'; script-src 'self' 'nonce-…'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; report-uri /api/csp-report`。与 `docs/security-headers.md` 设计一致；静态资源零头为已知遗留。

### 2.13 外部扫描（`r537/security/observatory_scan.json`、`observatory_analyze.json`；截图 `screenshots-r537/observatory.png`、`securityheaders.png`、`securityheaders_full.png`）

- Mozilla Observatory（https://developer.mozilla.org/en-US/observatory/analyze?host=hunt.zalize.com ，scan 119323701，11:43:31Z）：**B · 75/100 · 11/12 通过**；唯一失败 `content-security-policy`（−25，「reporting implemented only」）；`referrer-policy` +5、`x-frame-options` +5；COOP/COEP/CORP/SRI 未实现但不扣分。
- securityheaders.com（11:44:11Z，`securityheaders.png`）：**A**；Missing Headers 仅 `Content-Security-Policy`（Report-Only 不计）。
- 两者与本轮 curl 矩阵一致：缺分项只有 CSP enforce。

### 2.14 CSP Report-Only 数据判读

- 真实浏览：58 次 Playwright 访问注入 `securitypolicyviolation` 监听 + console 捕获 → **0 条**（`r537/browser/visits.json` `csp_violations`、`events-raw.json`）；会话 Chrome 走查 console 亦无 CSP 行。
- `/api/usage` `cspReports`：11:41Z = 2 → 12:26Z = **2**（无增量，本轮未触发任何违规）；`cspSamples` 2 条 = `script-src https://evil.example/x.js`（firstAt 1788693304250）+ `font-src https://edge.example/f.woff2`（1788693304754），与 `docs/qa/r534-regression.md` 记录的 R534 合成样本时间/内容一致 → **来源 = R534 回归脚本，非真实用户**。任务描述中提到的「script-src-elem/inline 与 img-src example.com」两条本轮**未观测到**（KV 中现存即上述 2 条）。
- `security-headers.ts` 归一化（`parseCspReports` 支持 Reporting API 数组与 legacy `csp-report`，blockedUri 只留 origin+path，样本上限 20）→ 现存样本可信、无截断。
- 对照 `docs/security-headers.md §7` enforce 判据：需 ≥7 天生产观察、无首方 blockedUri、样本去重后可解释。**现状**：R533 上线不足 1 天；样本 2 条均为合成；真实浏览 0 违规。**结论：现在不可 enforce（数据不足），还缺 ≥7 天真实流量的 `cspSamples` 观察；若届时仍无首方 URI，可先 enforce 与 RO 等价策略。**风险点（推断）：`style-src 'unsafe-inline'` 保留，enforce 对样式无影响；`font-src 'self'` 与 `/fonts/*` 同源满足。

### 2.15 IndexNow / cron（只读 `/api/usage`）

| 时刻 | cronLast | indexnowLastResult | pending |
|---|---|---|---|
| 11:41Z `usage_before.json` | 1788674438989（06:00Z） | `ok:false status:429 retries:2 submitted:0` | 1270 |
| 12:26Z `usage_final.json` | 1788696014544（12:00Z） | **`ok:true status:200 message:"OK" submitted:300 retries:0 fallbackHosts:["yandex.com"]`** | **970** |

R517 备用端点在 12:00Z cron **已生效**（验证过）：与预期「ok=true、fallbackHosts 非空、pending 1270→970」完全一致。R502/R511/R527 IndexNow 429 遗留 → **关闭**。`pricesLastOk 1788674449394`（快照新鲜）、`baiduLast null`（未配置，只记录）。

## 3. R527 遗留 / R530–R533 回归观察项逐条对照

| 项 | R527 状态 | R537 结论 | 证据 |
|---|---|---|---|
| R527 P3-1 `.de`「全球最大 ccTLD」 | 新发现 | **关闭**（现文明确 `.cn` > `.de`） | `r537/content/tld_de_en.txt`；§2.11 |
| R527 P3-1 `.de` Admin-C 表述 | 新发现 | **关闭**（「无需 Admin-C」+ §3(4) 原意） | 同上 |
| R527 P3-1 `uy-vs-ar`「同样完全开放」 | 新发现 | **关闭**（全站 grep 无） | `r537/thin/html` |
| R527 P3-2 `/tld` chip 价格 SSR→实时漂移，38 TLD >50% | 已知 | **关闭**：chip 去价（R528），SSR 复用 KV 快照，SSR==DOM 0 差异；静态参考价 >50% **0**、>30% 19（R531） | §2.7 |
| R527 P3-3 shortlist 失效分享 URL | 新发现 | **关闭** | `agent-c-share-deleted-no-stale-url.png` |
| R527 P3-4 hub 落地 128px | 设计值 | **仍在**（127.6–128.4px） | §2.6 |
| R527 已知 en `/tld` 链接占比 >25% 370/408 | 仍在 | **关闭**（0/408）；转移为 en `/vs` ≥23% 83 页（R535/R536 在修） | §2.9 |
| R484 P3-3 安全响应头 | 仍在 | **关闭**（R533 全套）；**新遗留**：CSP Report-Only、静态资源无头 | §2.12–2.14 |
| R502/R511 IndexNow 429 / R517 换端点效果 | 未验证 | **关闭**（12:00Z `ok=true` fallback yandex，pending 970） | §2.15 |
| R527 观察 hub + `/prices` HTML >90 KB | 设计 | **仍在**（222–353 KB） | §2.4 |
| R527 观察 404 壳 title = 首页 title | 观察 | **关闭**（R532：「页面不存在 / Page not found」专属 title） | `r537/http/nf_*.html` |
| R527 观察 Lighthouse `inspector-issues` 假阳性 | 推断 | **仍在（2 次 / 52）**，推断不变 | §1 观察项 |
| R527 观察 `td-has-header` `/why` | 观察 | **仍在** | §2.10 |
| R534 已知 首页 AI textarea 无 id/name | R538 在修 | **仍在**，并扩展到 advanced / shortlist 控件 | §1 P3-4 |
| R534 记录 首年 >30% 19 个集合 | — | **一致**（逐字同集合） | §2.7 |
| R532 双语 404 壳任何 Accept | 新功能 | **通过**（4 种 Accept 全 text/html 壳） | §2.3 |
| R533 `/api/csp-report` + cspSamples | 新功能 | **通过**（2 条合成样本入库、真实 0 违规） | §2.14 |

## 4. 需求逐条对照表

| 任务项 | 覆盖 | 证据 |
|---|---|---|
| 1 首页/quick/advanced/shortlist/monitor/share(create→GET→DELETE→410)/MCP 三工具/hub 三页(过滤+落地)/tld·guide·vs ≥4 页(ccTLD ≥3、R530 en ≥3)/prices/why/mcp/404·410 | ✓ 6 tld（5 ccTLD 改写）/4 guide/6 vs（4 R530） | §2.2 2.3 2.5 2.6 2.8 |
| 1 zh/en × 桌面/375 × 浅/深 | ✓ 58 访问 × 3 截图 | `screenshots-r537/*` |
| 1 SSR==水合价格逐字（含 /vs 选型卡、R521 表） | ✓ 8 页 0 差异 + 6 TLD 五处一致 | §2.7 |
| 1 Lighthouse ≥8 页桌面+移动，404 snapshot | ✓ 13 页 × zh/en × 2 + 4 snapshot | §2.10 |
| 1 console/pageerror/requestfailed 0 | ✓ | §2.5 |
| 1 HTML <90 KB | ✓ 内容页；hub/prices 超（设计） | §2.4 |
| 1 sitemap 1270 = content-counts；lang-matrix | ✓ | §2.3 |
| 2 安全头矩阵 curl -I 全类别 | ✓ 26 路径 | §2.12 |
| 2 Playwright ≥10 页 CSP 违规收集 | ✓ 58 访问 0 违规 | §2.14 |
| 2 `/api/usage` cspReports/cspSamples 判读 | ✓ 2 条 = R534 合成 | §2.14 |
| 2 §7 enforce 判据结论 | ✓ 不可 enforce，缺 ≥7 天数据 | §2.14 |
| 2 Observatory + securityheaders 截图记分 | ✓ B 75 / A | §2.13 |
| 3 6 /vs + 5 /tld + 3 /guide 人工读；6 条事实官网复核 | ✓ 14 组原文；8 条事实（7 一致 1 不符） | §2.9 2.11 |
| 3 thin-analyze 全站 >25% / ≥23% 分布 | ✓ | §2.9 |
| 4 check-static-prices --live；>50% 0、>30% 集合；6 TLD 五处一致 | ✓ | §2.7 |
| 5 首页 textarea 复核；axe/Lighthouse a11y 表单命名；375 触点 | ✓ | §1 P3-4 P3-5、§2.10 |
| 6 IndexNow/cron 判读 | ✓ 12:00Z 后 ok=true fallback yandex pending 970 | §2.15 |
| 7 存储备份/还原、usage 前后对账、不点 prompt chips | ✓ | §2.1 |
| 8 报告 + 证据目录 + 录屏路径 | ✓ 本文件、`r537/`、`screenshots-r537/`、录屏路径见文首 | — |

## 5. 下一步（建议，按性价比排序；均为内容/组件改动，本轮未做）

1. en `/tld` hub `intro` 补空格（P3-1，1 行）。
2. `.de` 页 DENICdirect 价格改为 79 €/79 €（P3-2，`tlds.ts` zh+en 两句，重跑 `faq.test.ts`）。
3. `guide-faq.ts` 问句模板去重「品牌」（P3-3，15 页）。
4. R538 表单控件 id/name/aria-label 顺带覆盖 `/advanced` 5 个与 `/shortlist` 同步码 input（P3-4）。
5. CSP：保持 Report-Only 至 ≥2026-09-13，再读 `cspSamples`；若仍无首方 URI 则 enforce（§2.14）。静态资源头/`immutable` 缓存视 Workers Assets 能力排期。
6. R535/R536 收口后重跑 `thin-analyze --seed 537` 与本轮 `r537/thin/linkshare-dist.txt` 对比。

## 6. 需注意 / 未覆盖

- 本轮 **0 次** `/api/ai-search`、未用任何 LLM key；AI 相关功能（refine、再来一轮、示例 chips）**未验证**（按任务约束不测）。
- `/api/usage` `pageviews`、`bots` 增量含本轮审计流量，仅记录不判读。
- `cspReports` 无增量，本轮**未**自行触发违规；任务提到的「script-src-elem/inline 与 img-src example.com」样本在 KV 中**未观测到**，现存 2 条为 `evil.example`/`edge.example`。
- Lighthouse 性能分（移动 89–98）受 headless 环境与网络影响，只作相对参考；`inspector-issues` CSP 条目判为假阳性属**推断**（依据：RO 模式 + 浏览器 0 事件 + R527 无 CSP 头时亦出现）。
- 9 组 `/vs` 对比页的「equally open」表述**未验证**（观察项）。
- 静态价格比对使用 12:00Z 前后的同一份 `/api/prices` 快照（`fetchedAt=1788674449621`），与 R534 集合一致；跨日复跑可能变化。
- 会话 Chrome 走查中创建的 share `V_-LuRIDhc` 已 DELETE（410），monitor 与 shortlist 已清空，浏览器存储已还原到备份（`IDENTICAL`）；本地库无残留状态。
- 证据文件已脱敏：`share_create.json` 与 `http_layer.log` 的 `revokeToken` 替换为 `<redacted>`；无 API key / cookie。
- 本 PR 只含 `docs/`，未改产品代码、测试与 `.github/workflows`；本地四命令 + `check-static-prices --live` 全绿（`r537/local/`）。
