# ROUND-558 零 AI 全站审计（R548–R554 上线后，生产 7b7c18d1）

- 审计对象：生产 https://hunt.zalize.com ，Worker version `7b7c18d1-9a8c-41b2-a8cc-9708a35e088c` = 代码 `c85ca2c`（含 R501–R554，2026-09-06 ~17:31Z 部署）。本分支基于 `deploy/r192-r195` tip `a1f0851`，**只新增 `docs/audits/audit-r558.md`、`docs/audits/r558/`、`docs/audits/screenshots-r558/`**，无源码改动。
- 审计窗口：2026-09-06 17:40Z–18:11Z（UTC）。HTML 抓取全部带 Mozilla UA（`Mozilla/5.0 … r558-audit`，会计入 pageviews，见 §2.0）；无头矩阵用独立 Chromium context（locale zh-CN，不碰会话 Chrome 存储）；R548 交互专项用会话 Chrome（CDP）+ 录屏。
- **0 次生产 AI 调用（验证过）**：无头矩阵 60 次访问 `ai_search_requests` 全空（`r558/browser/visits.json`）；会话 Chrome 全程 API 日志 64 条请求中 `/api/ai-search` **0** 条（`r558/r548/r548-api-requests.json`）；`/api/usage?days=1` 前（17:37Z）后（18:11Z，最后一次生产写入 18:08:11Z 后 3 分 15 秒）对照 `searches 0→0`、`fast 0→0`、`refine 0→0`（`r558/usage/usage_before.json` / `usage_after.json`）。未使用任何 LLM key。
- 证据目录：`docs/audits/r558/`（`usage/` 前后快照 + storage 备份/还原、`http/` API/MCP/分享生命周期/404 壳、`headers/` 26 条路径响应头、`r549/` 888 页占位校验汇总、`browser/` 60 组合无头矩阵 JSON、`r548/` 会话 Chrome API/弹窗/console/清理日志与录屏标注、`lighthouse/`、`local/` 本地验收日志、`scripts/` 全部脚本）；截图 `docs/audits/screenshots-r558/`（103 张 = R548 专项 48 张 + 矩阵抽样 55 张；完整 288 张矩阵截图未入库以控体积）。录屏：`/home/ubuntu/screencasts/r558-r548-zero-ai/r558-r548-zero-ai-edited.mp4`（随汇报附件提交，未入库）。
- 标注约定：**验证过** = 本轮一手生产实查 / 脚本实测；**未验证** = 本轮没有取到一手证据；**推断** = 由证据推理但未直接观测。

## 0. 结论

| 项 | 结论 |
|---|---|
| P0 | **无** |
| P1 | **无**（R553 P1「de-vs-com .de 定价句套 .com 占位」经 R554 修复后本轮生产复验通过：`/vs/de-vs-com` zh 开场句 `.de 首年约 $3、续费约 $4` 与同页表格 `.de $2.9 / $4.07` 同源，§2.2） |
| P2（新发现，1 条） | **P2-1** `/vs/*` 的 meta description → FAQ 第 1 题答案 → JSON-LD `FAQPage` 中仍含**静态编辑价**，与同页 R549 实时表格矛盾：`/vs/mx-vs-es` zh「.mx 首年约 $13 但续费约 $50/年」vs 同页正文/表格「首年 $35.57、续费 $41.23」（连高低关系都反了）；`/vs/de-vs-com` 等 6 页「.de 约 $8/年平续」vs 表 `$2.9 / $4.07`。启发式扫描 33 页 70 行，其中 **26 组 TLD-页偏差 ≥ $2**（`.mx`×3、`.id`×3、`.ph`、`.tw`、`.vegas`、`.nz`、`.eu`、`.au`×2、`.my`×2、`.de`×6、`.ca`、`.in`、`.tienda`、`.nl`×2），2 页人工核实为真（§1 P2-1）。R549 只改了正文占位，metaDescription 没有纳入 |
| P3（新发现，2 条） | **P3-1** `/advanced` 与 Results 的 taken 行无「开监控」、unknown 行无「重新核验」CTA（价格与去注册语义正确：不显示注册价、不出去注册），R548 的 CTA 只落在 `shortlist-page.tsx`（§1 P3-1）；**P3-2** 首页 quick-check unknown 行「重试」走 `POST /api/search`（单域名）而非 `/api/check?refresh=1`（shortlist 的重新核验用的是 refresh 端点），功能等价、口径不一（§1 P3-2） |
| R553 遗留 P3 ×4 复验 | ① 撤销分享 bare zh URL 水合后 `og:locale=en_US` **仍复现**（会话 Chrome；显式 `?lang=zh` 为 `zh_CN`；无头 zh-CN locale context 下 zh/en 均正确）→ 仍 P3；② uk/de/au/fr en 共用片段 **未验证**（本轮未做 n=8 词粒度扫描，仓库守门 `compare-verdict-shared.test.ts` 本地通过）；③ JetBrains Mono preload 告警 **本轮 0 次**（无头 60 次 `console_real=0`，会话 Chrome 10 条 console 无此告警）→ 建议关闭；④ `/monitors` 无直接添加表单 **仍如此**（设计如此，本轮从 shortlist 已注册行开监控走通）（§3） |
| R548 专项 | quick-check / shortlist / share / advanced / Results 五处：**非 available 行一律无注册价、无去注册**（验证过）；shortlist taken「—」+ 开监控、unknown「—」+ 重新核验、available 价格 + 去注册；批量去注册（N）N = available 数（2→2 标签，3→3 标签，弹 2/2/3 个注册商页）；Results 真实点击 + Enter：taken **0** 弹窗、available **1** 弹窗；分享页 taken/unknown「—」无 Register，「复制 N 个可注册」只计 available；监控 google.com 创建→取消走通（§2.3） |
| R549 专项 | 444 页 × zh/en = **888 页全部 200**；剥离 `<script>` 后可见 `{{` **0**（原始 HTML 中 8298 个 `{{` 全部在 `__DH_CONTENT__` 序列化数据里）；**4149 个占位**逐个按同页表格独立复算 **0 失败**（price 3808 / diff 121 / ratio 79 / pair 61 / jump 34 / sum 24 / costN 12 / costdiffN 10）；全部页面 `fetchedAt=1788674449621`（06:00:49Z）、`stale=false`；20 页人工读句主语与占位 TLD 一致（31 条启发式「前文提到另一 TLD」上下文人工抽读均为合理对比句，非 R553 类错误）（§2.2） |
| 路由矩阵 | 30 路由 × zh/en = 60 组合：正常路由 200、`/nope-r558-browser` 404、撤销分享 410、未知分享 404；console 真错误 / pageerror / requestfailed / 非预期 4xx / CSP violation / `/api/ai-search` **全 0**；SSR title == 水合 title 60/60；H1 一致（SSR 有 H1 的 52 组合全一致，`/shortlist` `/monitors` 404 壳 live 分享壳为无 SSR H1 的壳路由）；`<html lang>` / canonical / hreflang / og:locale / noindex 矩阵 60/60 自指一致；内容页 JSON-LD FAQ 问答 == 可见 FAQ **36/36 组合 0 不一致**；375px ×浅/深 120 组合 `scrollWidth==375` **120/120**；键盘 Tab 25 次焦点可见 60/60 `no_focus_visible=0`（§2.1） |
| Lighthouse | 桌面 4 页 P/A11y/BP/SEO **全 100**；移动 a11y/BP/SEO **全 100**，性能 `/` 92、`/vs/de-vs-com` 97、`/tld/de` 89、`/prices` 91（§2.5） |
| 安全头 | HTML 9 类（含 404/410 壳）HSTS / nosniff / Referrer / XFO DENY / Permissions-Policy / CSP **Report-Only**（nonce + report-uri）全齐；`/api/*`、`POST /mcp`、sitemap/robots/llms/OG、静态 `/assets/*`、favicon、字体、wx-share.png 均 nosniff + Referrer-Policy；60 次浏览 0 条 `securitypolicyviolation`；`cspReports=2` 前后不变，2 条样本为 R534 合成（`evil.example` / `edge.example`）→ 真实用户违规 0（§2.4） |
| 非 AI API / MCP / 分享 | `/api/search` 3 域名 ndjson（google.com taken rdap、r558-audit-probe-xk3.com available、baidu.cn taken whois）；`/api/check?refresh=1` 1.03s available；`/api/prices` 351 条实时价、`usdToCny 7.2`、无 `stale`；MCP initialize / tools/list 3 工具 / check_domains / tld_prices（408）/ suggest_variants（6 条）/ 未知工具 `-32602`；分享 create 200 → GET 200 → 壳 zh/en title → DELETE 200 → GET **410** + noindex；错 token（live）**403**、缺 token **400 token_required**（§2.4） |
| usage 判读 | `indexnowPending 970 → 670`（18:00:12Z cron −300，**R551「每 cron −300」未验证项本轮验证过**）、`indexnowLastResult ok=true 200 submitted=300 fallbackHosts=["yandex.com"]`；`pricesLastOk` 06:00:49Z == SSR `fetchedAt`；pageviews 增量 `vs +954`（含本轮 888 页 SSR 抓取 + 矩阵）、`bots +121`（含 r558 UA）（§2.0） |
| 本地验收 | `pnpm -r typecheck` ✓ · `pnpm --filter web test` **40 文件 / 450 tests ✓** · `pnpm --filter web build` ✓（6.59s） · `node scripts/check-content-counts.mjs` 408/410/444 ✓（`r558/local/*.log`；本分支无源码改动，结果 = 基线） |
| 存储还原 | 备份时 localStorage/sessionStorage 均为空（`storage_backup.json` = `{"local":{},"session":{}}`）；UI 专项后残留 `domainhunter:lang/theme/shortlist/monitor/dh:myShares` 等 6 键 → 清空还原，`restored; byte-identical: True` / `identical to backup: True`（`r558/usage/storage_*.txt`） |

## 1. 问题清单

### P2-1 `/vs/*` metaDescription / FAQ Q1 / JSON-LD 中的静态价与同页实时表格矛盾（新发现，2 页验证过 + 24 组启发式）

- 现象（**验证过**，`r558/r549/html/` 原始 SSR 未入库，抓取脚本 `scripts/fetch_vs.py` 可复现；汇总表 `r558/r549/faq_price_mismatches_filtered.md`）：
  - `https://hunt.zalize.com/vs/mx-vs-es`（zh）`<meta name="description">`：「.mx 是墨西哥国家域名、任何人可注册，**首年约 $13 但续费约 $50/年**；.es …」；同一句作为 FAQ 第 1 题「.mx 和 .es 怎么选？」答案首句进入可见 FAQ 与 JSON-LD `FAQPage`。同页正文（R549 占位渲染）与价格表：「按 2026 年 9 月 6 日的 /api/prices 实时报价为**首年 $35.57、续费 $41.23**，属于本站收录 ccTLD 里偏高的一档，且续费略高于首年」。同一页内两处价格连「首年便宜/续费贵」的方向都相反。
  - `https://hunt.zalize.com/vs/de-vs-com`（zh/en）description / FAQ Q1：「.de … 注册约 **$8/年平续**」；同页表格 `.de $2.9 / $4.07`、开场句（R554 后）「首年约 $3、续费约 $4」。同一 `.de` 句还复用在 `/vs/at-vs-de`、`ch-vs-de`、`de-vs-eu`、`it-vs-de`、`nl-vs-de`。
- 范围（**启发式，未逐页人工核实**）：对 888 页 FAQ Q1 答案中的 `$N` 与同页表格该 TLD first/renew 比对，允许 ±1 与「平续」写法 → 33 页 70 行命中；剔除 9 组「表 first 为促销价、renew == FAQ 价」的可接受项后，**26 组 TLD-页偏差 ≥ $2**（明细见 §0 与 `faq_price_mismatches_filtered.md`，最大偏差 `.mx` 22.57、`.id` 11.67、`.ph`/`.tw` 10.01）。其余 `sk-vs-cz` 等页 FAQ 价与表格一致或在 ±1 内。
- 根因（**推断**，源码 `apps/web/src/content/compare-faq.ts` `buildCompareFaq` → `firstSentence(loc.metaDescription)`）：R549 只把 `compares.ts` 正文/verdict 中的价格换成 `{{price:…}}` 占位，`metaDescription` 仍是静态字符串，而 FAQ Q1 答案直接取 metaDescription 首句，因此 meta、FAQ、JSON-LD 三处同时暴露旧价。`compare-price-placeholders.test.ts` 的「无硬编码零售价」守门未覆盖 metaDescription。
- 影响：SEO 摘要与结构化数据对外显示的价格与页面正文不一致；无功能影响。定 P2（内容准确性 + 对外元数据），非 P1（用户可见主正文与表格已一致）。
- 建议下一步：① metaDescription 里的价格改为 `{{price:…}}` 占位（SSR 侧 `ssr-html.ts` 已能渲染占位）或删去绝对价；② `compare-price-placeholders.test.ts` 增加 metaDescription 无 `$\d` 硬编码的守门；③ 优先修 26 组偏差 ≥ $2 的页。

### P3-1 `/advanced` 与 Results 的 taken / unknown 行缺「开监控 / 重新核验」CTA（新发现，验证过）

- 现象（**验证过**，截图 `screenshots-r558/r548-advanced-desktop-light.png`、`r548-advanced-unknown-dark.png`、`r548-results-unknown-real-status.png`、`r548-results-taken-before-enter.png`；录屏 D/E 段）：
  - `/advanced` 粘贴 `google.com baidu.cn r558qa7k3x.com r558qa7k3x.cn r558qa7k3x.net` 一次 `POST /api/search` 返回 2 taken + 3 available；taken 行显示「已注册」、**无注册价、无去注册**（符合 R548），但只有星标/复制按钮，**没有「开监控」**；自然出现的 unknown（`r558qa7k3x.ai`）显示「未知」、无价、**没有「重新核验」**。Results（首页结果列表，用真实 `/api/search` 行回灌 `dh:lastSearch:v1`）同样：taken/unknown 行无价、无去注册、无监控/重核 CTA。行首的「—」是评分列占位，不是价格列。
  - 对照 `/shortlist`：taken「—」+ **开监控**、unknown「—」+ **重新核验**（截图 `r548-shortlist-unknown-rechecked-dark.png`）。
- 源码对照（**验证过**）：`grep -rl "重新核验" apps/web/src/components` 只有 `shortlist-page.tsx`、`monitors-page.tsx`；`i18n.tsx` `shortlist.monitorCta`。即 R548 的 CTA 只实现在候选清单；advanced/Results 仅落实「不显示价、不出去注册、Enter 不弹」。
- 影响：advanced/Results 里看到已注册域名，要先星标进候选清单再开监控（多一步）；unknown 行要重新提交整批或去候选清单重核。任务书把「五处 CTA 语义」列为 R548 专项预期，故记为**范围缺口** P3，非回归。`/advanced` 没有「批量去注册」按钮为设计如此（批量按钮只在 shortlist）。

### P3-2 首页 quick-check unknown「重试」端点与 shortlist 不一致（新发现，验证过）

- 现象（**验证过**，`r558/r548/r548-api-requests.json`）：首页精确核验 `r558qa7k3x.ai` 自然返回 unknown，点「重试」发 `POST /api/search {"domains":["r558qa7k3x.ai"]}`（单域名，不带 refresh）；shortlist「重新核验」发 `POST /api/check?refresh=1 {"domains":["r558qa7k3x.ai"],"refresh":true}`。两者都只重查该 1 个域名（不重查全批），但首页重试可能命中 60s 缓存而拿到同一 unknown。功能等价，口径不一，P3。

## 2. 证据

### 2.0 零 AI 与 usage 前后对照（验证过）

| 字段 | 前 17:37Z | 后 18:11Z | 判读 |
|---|---|---|---|
| `searches / fast / refine` | 0 / 0 / 0 | 0 / 0 / 0 | **AI 0 增量**；`aiErrors/fallbacks/llmProvider` 两次均无该键 |
| `cspReports` / `cspSamples` | 2 / R534 合成 2 条 | 2 / 同 | 真实违规 0 |
| `outbound` | porkbun 38 | porkbun 44、aliyun 4 | 本轮 8 次 `/api/click`（shortlist 批量 2+2+3 + Results Enter 1 = aliyun 4 + porkbun 4）；porkbun 多出的 2 次非本轮（**推断**：其他访客） |
| `pageviews` | vs 1312 / tld 316 / guide 150 / home 136 / prices 57 / results 27 / other 225 | vs 2266 / tld 351 / guide 171 / home 158 / prices 67 / results 40 / other 280 | 含本轮 888 页 SSR 抓取（自定义 UA）+ 60 组合矩阵 + UI 专项；**报告标注：本轮抓取计入 pageviews** |
| `bots` / `botsBy` | 22007 / other 21683 ai 324 | 22128 / other 21800 ai 328 | r558 UA 计入 `other` |
| `indexnowPending` | 970 | **670** | 18:00:12Z cron −300，`indexnowLastResult ok=true 200 submitted=300 retries=0 fallbackHosts=["yandex.com"]`；`indexnowLast` 仍 09-03（积压未清不写，设计如此） |
| `pricesLastOk` | 1788674449394（06:00:49Z） | 同 | == 888 页 SSR `fetchedAt=1788674449621`，`/api/prices` 无 `stale` |
| `baiduLast/baiduLastError` | null | null | `botsBy` 无 `baidu` 键 |

文件：`r558/usage/usage_before.json`、`usage_after.json`（cache-busted `&cb=`，响应 `date: 18:11:26 GMT`）、`prices_before.json`。

### 2.1 全路由浏览器矩阵（验证过，`r558/browser/`，脚本 `scripts/browser_matrix.py`）

- 路由 30 条：`/ /advanced /shortlist /monitors /prices /why /mcp /tld /guide /vs`、`/tld/cn|de|ai`、`/guide/saas|ecommerce|legal`、`/vs/de-vs-com win-vs-vip fr-vs-com com-vs-cn com-vs-io com-vs-ai shop-vs-store com-vs-xyz net-vs-org shop-vs-com`、`/nope-r558-browser`、`/s/t__dp64jCc`（本轮创建 live）、`/s/zrL8NzekeU`（本轮撤销 410）、`/s/unknownr558`（404）。占位覆盖（按各页 `__DH_CONTENT__` 实际占位统计）：`de-vs-com` / `fr-vs-com` / `com-vs-cn` / `win-vs-vip` price、`com-vs-io` price/ratio/costdiff10、`com-vs-ai` price/cost10/costdiff10、`shop-vs-store` price/diff/costdiff10、`com-vs-xyz` price/diff/jump、`net-vs-org` pair、`shop-vs-com` price/diff/ratio/sum → 8 类占位各 ≥1 页命中（888 页全量校验见 §2.2）。
- `visits.json`（60 行）：`console_real 0`、`pageerror 0`、`requestfailed 0`、`responses4xx_real 0`、`csp_violations 0`、`ai_search_requests 0`；`console_expected_noise 10` / `responses4xx_expected_noise 10` = 404/410 壳自身状态码产生的「Failed to load resource」（预期）。
- `ssr-vs-dom.json`：title 60/60 相等；H1：52 组合 SSR==DOM，`/shortlist` `/monitors` `/nope-*` `/s/t__dp64jCc` 为无 SSR H1 的壳（水合后出 H1，与 R551 判读一致）；SSR 40 字块在 DOM 命中率内容页 0.94–0.98（差额为折叠 FAQ / 表格重排），`/advanced` 0（表单壳，预期）。`braces.dom_text` 60/60 = 0。SSR 价格与 DOM 价格差异全部可解释：`/tld/de $2.90/$4.07` 为 SSR 骨架保留两位小数而水合表渲染 `$2.9`；`/vs/de-vs-com $8`、`/vs/fr-vs-com $10/$9` 来自 meta description / 折叠 FAQ（即 P2-1）；`/prices` DOM 多出的 `$1.34…` 为客户端排序后可见行；live 分享 DOM 多出 `$11.08 ≈¥80` 为水合后价格。
- `head-meta.json`：zh `<html lang="zh-CN">` / en `lang="en"` 60/60；内容页 canonical 自指（en 带 `?lang=en`）、hreflang 3 条（zh/en/x-default）、`og:locale zh_CN/en_US`、JSON-LD 3–12 块；`/shortlist` `/monitors` 404 壳 / 410 / 未知分享 `noindex` 且无 hreflang；live 分享无 noindex、无 hreflang、canonical 自指。SSR 与水合值 60/60 一致（无头 zh-CN context 下撤销分享 zh `og:locale` 水合亦为 `zh_CN`，与会话 Chrome 复现的 R553 P3-1 环境相关，见 §3）。
- `faq-ld-vs-visible.json`：36 组合（有 FAQ 的内容页）JSON-LD Question/Answer 与可见 `<summary>`/答案 **0 缺失、0 多出**。
- `layout-375.json`：375×812 × 浅/深 = 120 组合 `documentElement.scrollWidth == 375` **120/120**，`bodyScrollWidth` 无 >375。
- `keyboard-tab.json`：每组合 Tab 25 次，焦点元素全部可见且有焦点样式（`no_focus_visible 0`、零尺寸 0）。
- `touch-targets-375.json`：R544 修复的控件 ≥44 保持；仍 <44 的与 R551 相同（`/tld` `/guide` `/vs` hub 分类 chip 36、`/prices` 相关对比链接 40、`/shortlist` 空态 CTA 40、分享壳「去创建自己的候选清单」40）→ R551 已记 P3，本轮**无变化**。
- 截图：`screenshots-r558/<route>_<lang>_<375|1280>_<light|dark>.png` 抽样 55 张（每条关键路由 zh 375 浅/深 + en 375 深）。

### 2.2 R549 专项：444 页 × zh/en 占位校验（验证过，`r558/r549/`，脚本 `scripts/fetch_vs.py` + `scripts/verify_vs_prices.py`）

- 抓取：sitemap 444 个 `/vs/*` × `?lang=zh|en` = **888 页全部 200**（Mozilla UA，计入 pageviews）。
- `{{`：原始 HTML 共 8298 个 `{{`，**全部位于 `<script>` 内的 `window.__DH_CONTENT__` 序列化数据**；剥离 `<script>` 后 SSR 可见正文 `{{` **0/888**；JSON-LD 中 `{{` 0。
- 独立复算（`verify_summary.json`）：从每页 `__DH_CONTENT__` 取源模板中的 4149 个占位，用**同页价格表**（`ComparePriceSnapshot`，`fetchedAt=1788674449621` 888/888、`stale=false` 888/888）按 R549 公式独立渲染并与 SSR 正文逐句比对：`price` 3808、`diff` 121、`ratio` 79、`pair` 61、`jump` 34、`sum` 24、`costN` 12、`costdiffN` 10 → **失败 0**（`verify_failures.json` 为空）；公式：diff=|a−b|、ratio=USD 比、jump=renew/first、costN=first+(N−1)·renew、costdiffN=|costN(a)−costN(b)|、USD 取整、静态回落带 ≈、缺价「—」。
- 主语抽读 20 页（`manual_sample_20.txt`：de-vs-com、win-vs-vip、fr-vs-com、com-vs-cn、homes-vs-house、engineer-vs-engineering、net-vs-org、au-vs-com、menu-vs-cafe、social-vs-com、apartments-vs-house、com-vs-io、kz-vs-tr、com-vs-xyz、shop-vs-com、shop-vs-store、io-vs-ai、limo-vs-taxi、hospital-vs-clinic、online-vs-site；渲染后句子在 `rendered_sentences/`，仅汇总入库）：
  - `/vs/de-vs-com` zh：「.de … 首年约 $3、续费约 $4」= 表 `.de $2.9/$4.07`（**R554 修复生产复验通过**；R553 P1 关闭）；en 同。
  - `/vs/win-vs-vip` zh 两侧 `.vip` vs `.win` 主语正确；`/vs/fr-vs-com` `.fr` 用静态 ≈ 参考价（表无 .fr 实时价）；`/vs/com-vs-xyz` `.xyz` 占位用 .xyz 值、`.com` 用 .com 值；`/vs/shop-vs-com`「.shop 首年更便宜、续费更贵」与表一致；`/vs/shop-vs-store`「.store 续费更高」正确；`/vs/io-vs-ai`「.ai 续费更贵、.io 便宜 diff」正确；`/vs/limo-vs-taxi`「.taxi 首年便宜但续费贵」正确；`/vs/hospital-vs-clinic`「.clinic 续费略高于 .hospital」正确；`/vs/online-vs-site` diff 渲染为 $0（两侧续费相等，事实如此）。20 页 **0 处主语与占位 TLD 不一致**。
  - `subject_flags.tsv` 31 条「占位前最近提到的是另一侧 TLD」启发式上下文（如 academy-vs-coach「注册约 {{price:coach:first}} 与 .academy 相当，但续费约 {{price:coach:renew}}」）人工抽读均为合理的对比句，**非缺陷**。
- 附带发现：metaDescription/FAQ Q1 静态价 → **P2-1**（§1）。

### 2.3 R548 专项：五处 taken / unknown / available 语义（验证过，会话 Chrome + 录屏 + API 日志 `r558/r548/`）

| 处 | taken | unknown | available | 证据 |
|---|---|---|---|---|
| 首页 quick-check `/?mode=exact` | google.com / google.cn「已注册」无价、无去注册、可星标 | r558qa7k3x.ai「未知」无价，仅「重试」（→ `POST /api/search` 单域名，P3-2） | r558qa7k3x.com `$11.08 ≈¥80`、.cn `¥33` + 去注册 | `r548-home-google-chips-dark.png`、`r548-home-unknown-retry-light.png`、`r548-home-available-desktop-light/dark.png` |
| `/shortlist` | 参考价「—」+ **开监控**（→ `/monitors` 已监控链接 `r548-shortlist-google-monitoring.png`） | 参考价「—」+ **重新核验**（`POST /api/check?refresh=1 {"domains":["r558qa7k3x.ai"],"refresh":true}` 只查 1 个） | 价格 + 去注册；`.com` 菜单 Porkbun/Namecheap/Dynadot/Cloudflare/阿里云/腾讯云，`.cn` 阿里云/腾讯云/Dynadot；Enter 开菜单、↓ 移到 Dynadot | `r548-shortlist-desktop-light/dark.png`、`r548-shortlist-unknown-rechecked-dark.png`、`r548-shortlist-com-keyboard-focus-light.png`、`r548-shortlist-cn-menu-light.png` |
| 批量去注册（shortlist） | 不计 | 不计 | 「批量去注册（2）」两次各弹 2 个注册商页；加第 3 个 available 后「批量去注册（3）」弹 3 个 | `r548-shortlist-bulk-three-desktop-dark.png`、`r548-popups.json`（8 弹窗全部关闭，未进入注册流程） |
| 分享页 `/s/zRTK4rCk4o`（1 taken + 2 available）、`/s/lKHjpUxO6d`（+ unknown） | 「—」无 Register | 「—」无 Register、无重试（只读页，合理） | 价格 + Register；「复制 2 个可注册」/「复制 3 个可注册」；title「3 个候选域名 | DomainHunter」/「5 个候选域名」 | `r548-share-zh/en-desktop/375-light/dark.png`、`r548-share-all-three-statuses-dark.png` |
| `/advanced` 5 域名一次 `POST /api/search` | 「已注册」无价、无去注册，**无开监控（P3-1）** | 「未知」无价，**无重新核验（P3-1）** | `首年 $11.08 ≈¥80` / `首年 ¥33` / `首年 $12.52 ≈¥90` + 去注册；无批量按钮（设计如此） | `r548-advanced-desktop-light/dark.png`、`r548-advanced-375-light/dark.png`、`r548-advanced-unknown-dark.png` |
| Results（首页结果列表，`dh:lastSearch:v1` 回灌自真实 `/api/search` 行，`r548-results-real-response-fixture.json`） | 真实点击 + Enter → **0** 注册商弹窗 | 「未知」无价、无重核 CTA | Enter → **1** 弹窗（Porkbun） | `r548-results-taken-before-enter.png`、`r548-results-taken-enter-zero.png`、`r548-results-available-enter-one.png`、`r548-results-unknown-real-status.png` |
| `/monitors` | shortlist 已注册行「开监控」→ `POST /api/monitor {enabled:true,status:"taken"}`，「我的监控 1 个」，全局 monitored 2→3；取消 → `enabled:false`，列表空、全局回 2 | — | — | `r548-monitors-before-empty.png`、`r548-monitors-google-added.png`、`r548-monitors-after-empty.png` |

- 375px：shortlist 卡片布局浅/深无横向溢出；隐藏滚动条（CDP `Emulation.setScrollbarsHidden`）后 `innerWidth/clientWidth/bodyScrollWidth/scrollWidth` 全 375（`r548-shortlist-exact375-light/dark.png`、`r548-shortlist-unknown375-*.png`、`r548-share-*-375-*.png`、`r548-advanced-375-*.png`）。
- 会话 Chrome API 日志 `r548-api-requests.json`：64 条（63 条本站 + 1 条 Porkbun 像素）：`/api/prices 16`、`/api/registrars 18`、`/api/click 8`、`/api/search 5`、`/api/check?refresh=1 1`、`/api/share` POST 2 / GET 6 / DELETE 2、`/api/monitor/list 2`、`/api/monitor 2`、`/api/stats 1`、**`/api/ai-search 0`**。
- console（`r548-console.json` 10 条）：6 条 410 资源错误（撤销分享壳预期）、3 条 Porkbun 站内日志、1 条 Meta Pixel 货币格式 warning（注册商站）；**0 pageerror、0 JetBrains preload 告警**。
- 生产写入与清理（`r548-cleanup.json`）：分享 `zRTK4rCk4o` 18:03:50Z 创建 → 18:04:25Z 撤销（410）；`lKHjpUxO6d` 18:07:20Z → 18:07:31Z 撤销（410）；监控 google.com 18:08:02Z 开 → 18:08:11Z 关；候选清单 5 行逐行删除为空（`r548-shortlist-cleaned-empty.png`）；Results fixture 键清除、测试标签关闭；语言经 UI 切回 zh；最后 storage 字节级还原（§0）。
- 未验证：候选清单里缺 `status` 字段的旧条目（legacy 数据）在 R548 下的显示——未构造伪造条目。
- 录屏：`/home/ubuntu/screencasts/r558-r548-zero-ai/r558-r548-zero-ai-edited.mp4`（标注 `r558/r548/r558-r548-zero-ai-annotations.json`）。

### 2.4 非 AI API / MCP / 分享 / 安全头（验证过，`r558/http/`、`r558/headers/`）

- sitemap **1270 = 8 静态 + 408 tld + 410 guide + 444 vs** == `content-counts.json`；alternate 3810 条、`loc` 无 `lang=en`。
- 404 壳：`Accept: text/html|application/json|image/png` 均 404 `text/html`；`/api/nope` 404 空体；`/s/invalid!!` `/s/unknown` 404「分享不存在或已过期」+ noindex。
- `/api/search`（`api_search_3.ndjson`）：google.com taken rdap `expiresAt 2028-09-14`、r558-audit-probe-xk3.com available、baidu.cn taken whois `2029-03-17`，0.07s（cached）；`/api/check?refresh=1` 1.03s available rdap。
- `/api/prices`：`currency USD`、`usdToCny 7.2`、`tldCount 351`、无 `stale`；`/api/stats {"totalChecked":33825}`；`/api/registrars {"affiliate":{}}`；`/api/monitor/list {"entries":[],"monitored":2,"limit":500}`（UI 专项前）、`/api/monitor/changes {"changes":[]}`。
- MCP（`mcp_*.json`）：initialize `domainhunter 1.0.0` 协议 `2025-03-26`；tools/list `check_domains / tld_prices / suggest_variants`；check_domains 3 域名结果与 `/api/search` 一致；tld_prices 408 条（`com 11.08/11.08`、`cn 4.58/5.28 approx`）；suggest_variants 6 条含 `firstYearPriceUSD`；未知工具 `{"code":-32602,"message":"unknown tool: nope"}`。
- 分享生命周期（`share_*.json`）：create 200（id `zrL8NzekeU`，revokeToken 已在入库文件中脱敏）→ GET 200 2 items → 壳 zh「2 个候选域名 | DomainHunter」/ en「2 domain candidates」→ DELETE 200 → GET **410 `{"error":"revoked"}`** → 壳 410「分享已撤销」+ noindex / en「This share has been revoked」。补测（`browser/live_share.json`，无头矩阵内新建 `t__dp64jCc`）：live 时错 token DELETE **403**、缺 token **400 `token_required`**、正确 token 200 → 410。注：`http_layer.log` 末行「DELETE wrong-token again 200」是对**已撤销**分享再发错 token 的结果（幂等返回），不是 live 状态下的行为。
- 安全头（`headers/matrix.tsv` 26 行）：HTML（首页 zh/en、`/tld/cn`、`/vs/com-vs-cn?lang=en`、`/guide/saas`、`/shortlist`、`/mcp`、404 壳、`/s/` 404）全部 HSTS `max-age=31536000; includeSubDomains`、`nosniff`、`Referrer-Policy strict-origin-when-cross-origin`、`X-Frame-Options DENY`、Permissions-Policy 8 项、CSP **Report-Only** `default-src 'self'; script-src 'self' 'nonce-…'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; report-uri /api/csp-report`；`cache-control` 内容页 `public, max-age=600`、`/shortlist` 与 `/s/` 404 无缓存。`/api/*`、`POST /mcp`、sitemap/robots/llms（86400）、OG SVG、静态 `/assets/*.js|css`、favicon、字体、`wx-share.png`：`nosniff` + Referrer-Policy（`_headers` 生效）。静态资源 `cache-control: public, max-age=0, must-revalidate`（带 hash 的 `/assets/*` 亦如此）——与 R551 相同，非本轮变化，**未评级**（可作性能优化候选）。CSP 仍 Report-Only：真实观察天数不足（R551 判据 ≥7 天，最早 2026-09-13 复评）。

### 2.5 Lighthouse 13.4.1（验证过，`r558/lighthouse/summary.json`，脚本 `scripts/lighthouse_batch.sh`）

| 页 | 桌面 P/A11y/BP/SEO | 移动 P/A11y/BP/SEO | 移动 LCP / CLS / TBT |
|---|---|---|---|
| `/` | 100/100/100/100 | 92/100/100/100 | 2.9s / 0 / 30ms |
| `/vs/de-vs-com` | 100/100/100/100 | 97/100/100/100 | 2.3s / 0 / 20ms |
| `/tld/de` | 100/100/100/100 | 89/100/100/100 | 3.3s / 0 / 0ms |
| `/prices` | 100/100/100/100 | 91/100/100/100 | 3.3s / 0 / 100ms |

a11y / SEO / BP 审计项 **0 失败**（`fails` 全空；R551 的 `/mcp` `inspector-issues`、`/why` `td-has-header` 本轮未在抽样页出现，`/why` 未在本轮 Lighthouse 抽样内 → **未验证**）。

### 2.6 本地验收（验证过，`r558/local/*.log`）

`pnpm -r typecheck` exit 0 · `pnpm --filter web test` Test Files 40 passed / Tests **450 passed** · `pnpm --filter web build` ✓ built in 6.59s · `node scripts/check-content-counts.mjs` TLD 408 / 行业指南 410 / 对比页 444 全部通过。本分支只增 docs，结果 = `a1f0851` 基线。

## 3. 既有问题状态

| 项 | 状态 | 依据 |
|---|---|---|
| R553 P1（de-vs-com .de 定价句套 .com 占位） | **已关闭**（R554） | §2.2 生产 zh/en 开场句 $3/$4 == 表 $2.9/$4.07 |
| R553 P3-1 撤销分享 bare zh `og:locale=en_US` | **仍存在** | 会话 Chrome（浏览器 UI locale en-US）打开 `/s/zRTK4rCk4o` 水合后 `en_US`，`?lang=zh` 为 `zh_CN`（`r548-share-revoked-zh-bare.png`）；无头 zh-CN context 下 zh/en 均正确（`head-meta.json`）→ **推断**：水合语言判定优先取 `navigator.language` 而非 SSR 壳/localStorage |
| R553 P3-2 uk/de/au/fr en 共用片段（n=8） | **未验证** | 本轮未扫描；仓库守门 n=12 本地通过 |
| R553 P3-3 JetBrains Mono preload 告警 | **本轮 0 次** | 无头 60 组合 `console_real 0`；会话 Chrome 10 条 console 无此告警 → 建议关闭（**推断**为 R550–R554 期间字体预加载改动所致，未查提交） |
| R553 P3-4 `/monitors` 无添加表单 | **仍如此（设计）** | 本轮从 shortlist 已注册行开监控走通 |
| R551 P3（`/advanced` `/why` SSR title ≠ 水合 title） | **已关闭** | `ssr-vs-dom.json` 60/60 title 相等 |
| R551 P3（`/s/:id?lang=en` SSR 壳 zh） | **已关闭** | `head-meta.json` `/s/*` en 三态 SSR `lang=en` / `en_US` |
| R551 P1（zh 内容页 375 溢出 16 页） | 本轮 30 路由 120 组合 **0 溢出**；R551 具名的 `/tld/nz` `/tld/sa` `/vs/education-vs-academy` `/vs/clinic-vs-care` 本轮**未抽到 → 未验证** | `layout-375.json` |
| R551 P3 触点 <44（hub chip 36 / 相关链接 40 / 空态 CTA 40） | **无变化** | `touch-targets-375.json` |
| R545 P2-2 `.ai` 两年起注未披露、P2-4 `/advanced` 命名、P2-5 批量无进度、P2-6 内容页 Shortlist 首击回首页、P3-7 首页 chip 不显示人民币 | **未验证**（本轮不在范围） | — |

## 4. 下一步建议

1. **P2-1**：`compares.ts` 444 页 metaDescription 中的绝对价改 `{{price:…}}` 占位或删去；`compare-price-placeholders.test.ts` 加 metaDescription 守门；优先 26 组偏差 ≥ $2（`.mx` `.id` `.ph` `.tw` `.vegas` `.nz` `.eu` `.au` `.my` `.de` `.ca` `.in` `.tienda` `.nl`）。改后须仍过 `faq.test.ts`（FAQ==JSON-LD）。
2. **P3-1**：`DomainRow`（advanced/Results 紧凑行）taken 加「开监控」、unknown 加「重新核验」，复用 `shortlist-page.tsx` 的 `monitorCta/recheck` 文案与 `/api/check?refresh=1` 单域名重核；**P3-2** 首页重试统一到 `/api/check?refresh=1`。
3. R553 P3-1：分享壳水合语言优先级改为 URL `?lang` > localStorage > SSR 壳 `<html lang>` > `navigator.language`（需先在 `share-page.tsx` / `i18n.tsx` 定位判定顺序，**未验证**）。
4. 关闭 R553 P3-3（preload 告警本轮 0 次）；R551 P1 具名 4 页与 uk/de/au/fr 共用片段留待下轮抽样。
5. CSP enforce 复评不早于 2026-09-13（真实观察 ≥7 天）。

## 5. 需注意

- 本轮 888 页 SSR 抓取 + 60 组合矩阵 + UI 专项全部计入生产 pageviews（`vs +954`、`bots +121` 含 r558 UA），读今日报表请剔除。
- 生产写入全部已回滚：2 个 http 层分享（`zrL8NzekeU` 撤销 410、`t__dp64jCc` 撤销 200→410）、2 个 UI 分享（`zRTK4rCk4o`、`lKHjpUxO6d` 均 410）、监控 google.com 已关（全局 monitored 回 2）、候选清单空、storage 字节级还原。`/api/click` 计数 +8（outbound porkbun +4 / aliyun +4）为真实注册商页打开后立即关闭，未进入任何注册/付款流程。
- 入库的 `http/share_create.json`、`browser/live_share.json`、`http/http_layer.log` 中 `revokeToken` 已替换为 `REDACTED`（分享均已撤销）。
- `r558/r549/html/`（75MB 原始 SSR）与完整 288 张矩阵截图、Lighthouse 8 份完整 JSON、录屏 mp4 未入库；脚本可复现。
- P2-1 的 26 组「偏差 ≥ $2」列表来自启发式（FAQ Q1 `$N` vs 同页表格），只有 `mx-vs-es` 与 `de-vs-com` 两页人工逐字核实；其余修复前请逐页确认（部分 ccTLD 表价可能为促销价，metaDescription 写的是常规价，改占位即可消除歧义）。
