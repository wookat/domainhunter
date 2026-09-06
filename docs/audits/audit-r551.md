# ROUND-551 零 AI 全站审计（R535–R545 上线后，生产 07d85c8e）

- 审计对象：生产 https://hunt.zalize.com ，Worker version `07d85c8e-5b68-4d9d-a6c9-58ff2027c719` = 代码 `7b14d1f`（含 R501–R545，2026-09-06 ~14:50Z 部署）。本分支基于 `deploy/r192-r195` tip `126f73a`，**只新增 `docs/audits/audit-r551.md`、`docs/audits/r551/`、`docs/audits/screenshots-r551/`**，无源码改动。
- 审计窗口：2026-09-06 15:17Z–16:00Z（UTC）。HTML 抓取全部带 Mozilla UA（`Mozilla/5.0 … r551-audit`），浏览器用本机 Chrome for Testing + Playwright（无头，独立 context）与会话 Chrome（CDP，仅 securityheaders.com）。
- **0 次生产 AI 调用**：所有浏览器脚本均监听 `/api/ai-search` 请求（`visits.json` / `functional_regression.json` / `known_items*.json` / `zh_overflow_verify_375.json` 的 `ai_calls` 全部为空）；`/api/usage?days=1` 前后对照 `searches 0→0`、`fast 0→0`、`refine 0→0`，`aiErrors/fallbacks/llmProvider` 均 null（§2.0）。未使用任何 LLM key。
- 证据目录：`docs/audits/r551/`（`usage/` 前后快照与 storage 还原、`http/` lang-matrix / MCP / 410 壳、`headers/` 26 条路径响应头、`browser/` 64 组合矩阵 JSON、`lighthouse/`、`thin/` 全站 2524 页指标、`security/` Observatory / securityheaders / CSP CDP、`functional/` 功能回归 JSON + CSV、`scripts/` 全部脚本、`local/` 本地验收日志）；截图 `docs/audits/screenshots-r551/`（31 张，完整 265 张矩阵截图未入库以控体积）。
- 标注约定：**验证过** = 本轮一手生产实查 / 脚本实测；**未验证** = 本轮没有取到一手证据；**推断** = 由证据推理但未直接观测。

## 0. 结论

| 项 | 结论 |
|---|---|
| P0 | **无** |
| P1（新发现） | **1 条**：zh 内容页 375px **真实横向溢出**——`/tld/nz` bodyScrollWidth **625**、`/tld/sa` 569、`/vs/education-vs-academy` 511、`/vs/clinic-vs-care` 489 … 浏览器实测 28 页中 **16 页** 溢出（全部 zh；en 0），根因是正文中「、」连接、无空格的 TLD 序列不可换行（§1 P1-1）。R545/R546 的 375 硬指标只覆盖 9 个固定路由，未命中这批页 |
| P1（已知基线） | R545 P1-1（已注册域名入清单仍显示首年价 + 去注册）**仍存在**、R545 P1-2（`/vs/com-vs-io` zh 导语价 259/419/69/85 元 vs 实时表 $28.12/$51.8/$11.08）**仍存在**——生产 07d85c8e 未含 R548/R549，状态「修复中」（§3） |
| P2（新发现） | **无** |
| P3（新发现，3 条） | ① `/advanced` 与 `/why` 的 SSR `<title>` 与水合后 `document.title` 不同（`批量域名核验：粘贴名单一键实时查可注册` → `高级模式`；`为什么选 DomainHunter：中文创业者的域名猎手` → `为什么选 DomainHunter`），H1 一致（§1 P3-1）；② `/s/:id?lang=en` 三态 SSR 壳 `<html lang="zh-CN"` / `og:locale=zh_CN`，水合后才变 `en`（§1 P3-2）；③ `/why` Lighthouse `td-has-header` 未通过（BP 仍 100，仅 a11y 审计项）（§1 P3-3） |
| 已知 P2/P3 状态 | R545 P2-1 移动 chip 截断 **已关闭**（375px 409 行 0 截断）；P2-2 `.ai` 两年起注 **仍未披露**；P2-3 价格来源/时间戳 **部分关闭**（`/prices` 已写「Porkbun 实时价 / 7.2 汇率 / ≈ 静态参考」，但无抓取时间）；P2-4 `/advanced` 命名 **仍在**（title/H1「高级模式」，粘贴框首屏底部 752/812）；P2-5 批量无进度 **仍在**（全程只显示「已识别 12 个域名」）；P2-6 内容页 Shortlist 首击回首页 **仍在**（第 2 次点击才进 `/shortlist`）；P3-7 首页 chip 不显示人民币 **仍在**（设计一致性问题）；R546 P3（四页共用句、撤销后 SPA 英文 title）**修复中（R550）**，本轮未复现 in-flow 场景（§3） |
| 安全头 / CSP | HTML 8 类（含 404/410 壳）HSTS / nosniff / Referrer / XFO DENY / Permissions-Policy / **CSP Report-Only（nonce + report-uri）** 全齐；`/api/*`、`POST /mcp`、sitemap / robots / llms / OG SVG 与 **静态 `/assets/*.js|css`、favicon、字体、wx-share.png** 均有 nosniff + Referrer-Policy（R538 `_headers` 生效，验证过）。64 次真实浏览 **0 条** `securitypolicyviolation`；`cspReports=2` 全程不变，2 条样本均为 R534 合成（`evil.example` / `edge.example`），**真实用户违规 0**。Observatory **B 75/100（11/12，失败项 = CSP 未 enforce）**，securityheaders.com **A**。**仍不可 enforce**：真实观察天数 1 天（09-06），§7 判据要求 ≥7 天 → 最早 **2026-09-13** 复评（§2.2） |
| IndexNow / 百度 | 12:00:14Z cron：`ok=true status=200 submitted=300 retries=0 fallbackHosts=["yandex.com"]`，`indexnowPending=970`（= 1270 − 300，与代码逻辑一致）；窗口内无 18:00Z cron，「每 6h −300」**未验证**（需下轮看 18:00Z 后是否 670）；`indexnowLast` 停在 09-03 属设计（积压未清不写）；`baiduLast/baiduLastError=null`、`botsBy` **无 `baidu` 键**（今日 Baiduspider 0 次）（§2.3） |
| 内容矩阵 | sitemap **1270 = 8 + 408 + 410 + 444** = content-counts；全站 2524 HTML（tld/guide/vs × zh/en）全部 200；linkShare >25% **0 页**、≥23% **0 页**；vs/en 全站中位 **19.84% / prose 628** == R546 基线；40 页 vs/en 抽样中位 20.21% / prose 623；20 页 tld/en 抽样在 `thin/pages.csv`；FAQ==JSON-LD 不一致 **0**；R542 59 字开场句守门 444×2 **0 重复**（§2.4） |
| 功能回归（非 AI） | 去重 R543 口径 **全部符合**（自动核验 +1、重复核验 0、改名 +1、`.cn` 切换 +1、`.io` 切换 0、更多后缀 +1/401 TLD、重新核验 +1）；advanced 批量 4 域名 1 次 POST、CSV 表头含 `expires_at` 4 行；shortlist 星标 / 备注持久化 / 4 种排序 / 同步码推送+读回 3 条 / 分享创建 200→撤销 410 + noindex；monitors 添加→取消；MCP initialize / tools/list / 3 工具 + 未知工具 `-32602`；`/api/prices` `fetchedAt` == `pricesLastOk`（06:00:49Z，无 `stale`）；测试分享已 410、监控已清空、storage 字节级还原 `identical to backup: True`（§2.5） |
| 硬指标 | Lighthouse 12 次：a11y / SEO **全 100**，BP 100（`/mcp` 桌面、`/prices` 移动 96 = `inspector-issues`，见 §2.1.7）；移动 `/prices` zh/en **CLS 0 / 0**；64 组合 console / pageerror / requestfailed / 非预期 4xx **全 0**；lang-matrix 36/36 行自指一致；键盘 Tab 焦点可见 `no_focus_visible=0`、零尺寸焦点 0；触点：R544 修的 9 路由 ≥44 保持，但 `/tld` `/guide` `/vs` hub 分类 chip 可见盒 **36×36**、`/prices` 相关对比链接与 `/shortlist` 空态 CTA **40** |
| 本地验收 | `pnpm -r typecheck` ✓ · `pnpm --filter web test` **36 文件 / 410 tests ✓** · `pnpm --filter web build` ✓（5.76s） · `node scripts/check-content-counts.mjs` 408/410/444 ✓（`r551/local/*.log`；本分支无源码改动，结果 = 基线） |

## 1. 问题清单

### P1-1 zh 内容页 375px 真实横向溢出（新发现，16 页验证过）

- 现象（**验证过**，`r551/browser/zh_overflow_verify_375.json`、`overflow_segments_375.json`、截图 `screenshots-r551/followup_375_vs_clinic-vs-care_zh_verdict_overflow.png` / `…_dark.png`）：375×812、DPR 2、`?lang=zh`，`document.documentElement.clientWidth=375` 而 `document.body.scrollWidth`：

  | 页 | bodyScrollWidth | 页 | bodyScrollWidth |
  |---|---|---|---|
  | `/tld/nz` | **625** | `/vs/info-vs-net` | 439 |
  | `/tld/sa` | **569** | `/vs/repair-vs-services` | 437 |
  | `/vs/education-vs-academy` | **511** | `/vs/salon-vs-studio` | 416 |
  | `/vs/clinic-vs-care` | **489** | `/vs/art-vs-studio` | 416 |
  | `/vs/gifts-vs-shop` | 483 | `/vs/farm-vs-cafe` | 405 |
  | `/vs/tools-vs-app` | 444 | `/vs/wine-vs-bar` | 403 |
  | `/vs/apartments-vs-house` | 443 | `/vs/software-vs-app` | 398 |
  | `/vs/express-vs-store` | 386 | `/vs/technology-vs-tech` | 380 |

  同批实测保持 375 的对照页：`/tld/ke` `/tld/am` `/tld/lk` `/vs/com-vs-org` `/vs/travel-vs-tours` `/vs/kitchen-vs-restaurant` `/vs/menu-vs-restaurant` `/vs/flights-vs-travel` `/vs/bio-vs-me` `/vs/blog-vs-me` `/vs/health-vs-care` `/vs/community-vs-club`；`/vs/clinic-vs-care?lang=en`、`/tld/es` zh/en、`/vs/group-vs-agency` en 均 375（`overflow_verify_static_candidates.json`）。`innerWidth` 随之变大是 Playwright 无头下 viewport 被文档撑开的表现，判定依据是 `clientWidth=375 < bodyScrollWidth`，**不是** SKILL 所述 scrollWidth=360 滚动条假阳性。
- 溢出元素（**验证过**，`overflow_segments_375.json` 用 Range 逐字定位）：都是正文 `<p class="mt-6 … text-[15px]">`（TLD 页）/ `<p class="mt-2.5 … text-[15px]">`（VS 页 verdict 段）里的一段文字，例如 `/tld/nz`「.co.nz、.org.nz、.net.nz、.geek.nz、.gen.nz、.kiwi.nz、.maori.nz、.school.nz、.ac.nz」右边界 625px；`/vs/clinic-vs-care`「.dental、.dentist、.doctor、.healthcare、.hospital、.vet、.vision」右边界 489px；`/tld/sa`「.sa、.com.sa、.net.sa、.gov.sa、…、.pub.sa」569px。价格表 `<table>`（395px）虽宽于容器，但父级 `overflow-x-auto` 已包住，不是文档级溢出来源（`followup1.json` / `followup2.json`）。
- 根因（**推断**，依据 [UAX #14](https://www.unicode.org/reports/tr14/) LB13「× IS」：`.` 属 IS 类，前面无论是 `、`(CL) 还是字母都不允许在它之前断行；en 版用「, 」有空格所以能换行）：zh 正文用「、」把多个以 `.` 开头的 TLD 直接相连、中间无空格，整段成为一个不可断行单元。源文本在 `apps/web/src/content/tlds.ts`（如 nz 条目 L11207）与 `apps/web/src/content/compares.ts`（如 clinic-vs-care L2940）的硬编码中文段落；正文 `<p>` 没有 `break-words`/`overflow-wrap:anywhere`。
- 范围（静态扫描 **验证过**，`overflow_static_runs.json`，脚本 `scripts/overflow_static_runs.py`）：2524 个 HTML 中，zh 含 ≥3 个 TLD「、」相连序列的页 **462**，en **0**；按 15px 字号估算宽度 ≥375 的 15 页与浏览器实测 16 页高度吻合（估算 345–375 的边界页各有 1–2 页误差，实测为准）。`/guide` 无此类序列。
- 影响：手机上整页可横向滚动，右侧内容被推出屏幕；R545/R546「375 无溢出」硬指标只查了 9 个固定路由（首页 / advanced / prices / mcp / 3 hub / `tld/co` / `guide/tea`），所以未命中。**是否 R525/R526（ccTLD 改写）或 R535/R536（边缘集）引入：未验证**（本轮没有对比旧版本 HTML）。
- 建议（只记录，本轮不改）：优先级 **P1**。方案 A：内容页正文容器加 `break-words`（`overflow-wrap: anywhere`），一处 CSS 覆盖全部 462 页且不改文案；方案 B：内容侧把「、」改为「、 」或在 `.` 前插 `<wbr>`/U+200B（需重跑 faq/verdict 测试）。建议 A 先上，再在 `browser_matrix` 的 375 集合中加入 `/tld/nz` `/tld/sa` `/vs/clinic-vs-care` 作为守门样本。

### P3-1 `/advanced` `/why` SSR title 与水合后 title 不同（新发现）

- 现象（**验证过**，`r551/browser/ssr-vs-dom.json`）：`/advanced` zh SSR `<title>` =「批量域名核验：粘贴名单一键实时查可注册 | DomainHunter」，水合后 `document.title` =「高级模式 | DomainHunter」；en「Bulk domain check: paste a list, verify …」→「Advanced mode | DomainHunter」。`/why` zh「为什么选 DomainHunter：中文创业者的域名猎手 | DomainHunter」→「为什么选 DomainHunter | DomainHunter」；en「Why DomainHunter: a domain hunter for Ch…」→「Why DomainHunter | DomainHunter」。两页 H1 SSR==DOM。其余 60 组合 title 相等。
- 影响：搜索引擎抓 SSR 长标题、用户 tab 上看到短标题，不一致但无功能影响；`/advanced` SSR 正文 40 字块覆盖率 zh 0%/en 40%（SSR 壳与水合表单文案不同，`ssr_chunk_coverage`），属设计（表单页）。
- 建议：让水合侧 `setTitle` 复用 SSR 的 SEO title，或 SSR 改用 UI title（1 处 i18n 对齐）。

### P3-2 `/s/:id?lang=en` SSR 壳 `<html lang>` / `og:locale` 为 zh（新发现）

- 现象（**验证过**，`r551/browser/head-meta.json`）：live `/s/l9147-gKoY?lang=en`、revoked `/s/Ma2Um35IHr?lang=en`、unknown `/s/unknownr551?lang=en` 三态 SSR `html_lang=zh-CN`，水合后 `dom_lang=en`；SSR `<title>` 已是英文（「1 available domain candidates」「This share has been revoked」「Share not found or expired」）。其余 61 组合 SSR==DOM lang。三态均 `noindex`（SSR 与 DOM 一致），故 SEO 影响为 0；社交分享抓 `og:locale=zh_CN` 与英文 title 不一致。
- 建议：share 路由的 SSR 壳按 `?lang=` / Accept-Language 输出 `lang` 与 `og:locale`（与内容页同逻辑）。

### P3-3 `/why` Lighthouse `td-has-header` 未通过（新发现）

- 现象（**验证过**，`r551/lighthouse/summary.json` `desktop_why.json` failing=`td-has-header`，a11y 分仍 100）：`/why` 对比表存在没有关联表头的 `<td>`（Lighthouse 12.8.2 判定）。其它 11 次 Lighthouse 无此项。
- 建议：给 `/why` 表加 `<th scope>` 或 `headers` 属性；仅 a11y 语义项。

## 2. 逐项证据

### 2.0 零 AI 与 storage 纪律

- `r551/usage/usage_before.json`（15:17Z）→ `usage_after.json`（15:45Z）→ `usage_after2.json`（15:58Z，补测 P1-1 状态后）：`2026-09-06` 日 `searches=0 fast=0 refine=0`，`aiErrors/fallbacks/llmProvider` 缺省（null），`outbound.porkbun` 2→30 为本轮精确核验 / 批量核验的注册商查询（非 AI）。**验证过**。
- storage：会话 Chrome `localStorage/sessionStorage` 于 15:18Z 备份（`storage_backup.json`，有效空态），矩阵中 `?lang=en` 会写 `domainhunter:lang`，结束前先恢复语言再逐键比对，`storage_restore_check.txt` = `identical to backup: True`。功能回归、已知项、溢出脚本全部使用独立无头 context，不触碰会话 Chrome。**验证过**。

### 2.1 全路由矩阵（64 组合，`r551/browser/`，脚本 `scripts/browser_matrix.py`）

路由集：`/` `/advanced` `/shortlist` `/monitors` `/prices` `/mcp` `/why` `/tld` `/guide` `/vs`；TLD 详情 `cn de jp uk ar cz ke`（R525/R526 ccTLD 改写页）；`/guide/saas /nocode /lawfirm`；VS 详情 `uk/de/au/fr-vs-com`（R542 四页）、`golf-vs-travel` `page-vs-com` `clinic-vs-care` `uy-vs-ar`（R535/R536 边缘集）；`/s/` live / revoked / unknown；`/nope-r551-browser` 404 壳。每路由 zh/en × 375 与 1280 × 浅/深色截图（265 张，入库 31 张）。

1. **HTTP lang 矩阵**（`r551/http/lang-matrix.md`，`scripts/seo-audit/lang-matrix.sh`）：36 行（12 路径 × bare / Accept-Language en / `?lang=en`），`html lang` / canonical（裸路径） / hreflang zh+en+x-default / `og:locale` / `Vary: Accept-Language` 全部自指一致，0 不一致。**验证过**。
2. **noindex**：`/shortlist` `/monitors` 404 壳、`/s/` revoked / unknown = `noindex`（SSR==DOM）；live share、内容页、hub 无 noindex（`head-meta.json`）。**验证过**。
3. **SSR == 水合**（`ssr-vs-dom.json`，SSR 正文按 40 字归一化块在 DOM 中查找）：内容页 27 组合覆盖率 0.90–0.98（SSR 在价格表前截断属设计）、可见价格文字 SSR ⊆ DOM（`ssr_prices_missing_in_dom` 1–2 为 SSR 保留的 `≈` 静态参考文案，DOM 显示实时价，与 R528 设计一致）；H1 SSR==DOM 56/56 有 SSR H1 的组合（`/shortlist` `/monitors` 404 壳、live share 8 组合 SSR 无 H1，属壳页设计）；title 不等 4 组合 → P3-1。壳页（`/shortlist` `/monitors` 404 share）SSR 只含骨架，覆盖率 0 属设计。**验证过**。
4. **FAQ JSON-LD == 可见**（`faq-ld-vs-visible.json`）：40 组合 126 条 FAQ，`ld_q_missing_in_dom` / `ld_a_missing_in_dom` / `summary_not_in_ld` 全 0。**验证过**。
5. **console / 网络**（`visits.json`）：64 组合 `console_real=0`、`pageerror=0`、`requestfailed=0`、非预期 4xx `0`、`securitypolicyviolation=0`、`/api/ai-search=0`；预期噪音（404 壳、410/404 share API）单列。**验证过**。
6. **375px 溢出**（`layout-375.json`）：矩阵 32 个 375 组合中仅 `/vs/clinic-vs-care` zh 溢出（489），其余 31 组合 `clientWidth=bodyScrollWidth=375`；扩展抽样见 P1-1。**验证过**。
7. **Lighthouse 12.8.2**（`lighthouse/summary.json`，SKILL 命令）：桌面 10 页 a11y/SEO 100，BP 100 ×9、`/mcp` 96（`inspector-issues`）；移动 `/prices` zh perf 93 / BP 96（`inspector-issues`）/ **CLS 0**，`/prices?lang=en` perf 92 / **CLS 0** / LCP 3159ms。`inspector-issues` 复核（`security/csp_issues_cdp.json`、`csp_issues_repeat.json`，CDP `Audits.issueAdded`）：`/mcp` `/prices` `/` 单独重跑 0 issue；`/vs/uk-vs-com` 出现 18 条 `ContentSecurityPolicyIssue isReportOnly=true`，其响应头里应用 CSP-RO 之后**多了一段** `script-src 'unsafe-inline' 'unsafe-eval'; connect-src 'none'; report-uri https://csp-reporting.cloudflare.com/cdn-cgi/script_monitor/report…`——这是 Cloudflare 边缘（Page Shield / script monitor）间歇注入的 Report-Only 策略，不是站内 CSP；应用自身 CSP-RO 未产生任何违规（`csp_report_requests=[]`、`/api/usage cspReports` 不变）。判定 Lighthouse BP 96 为 **边缘侧噪音（验证过其来源 header，Cloudflare 侧配置未验证）**。
8. **触点**（`touch-targets-375.json`，`scripts/followup1.py` 截图）：R544 修复的 9 路由控件 ≥44 保持（首页 chip、advanced 4 输入、shortlist 返回/导入/同步、monitors 返回、prices 排序、mcp Copy、FAQ summary）；仍 <44 的可点元素：`/tld` `/guide` `/vs` hub 分类 chip **36×36**（截图 `followup_375_tld_hub_chips_36px.png`、`followup_375_vs_hub_chips_36px.png`）、`/prices` 底部相关对比链接 **40**（`followup_375_prices_related_vs_40px.png`）、`/shortlist` 空态「开始猎取」**40**（`followup_375_shortlist_empty_cta_40px.png`）、share 壳「去创建自己的候选清单」40、首页「高级模式」宽 40（高 44）；面包屑「首页」28×20 与 VS 页 `.uk`/`.com` 徽标链接为行内文字链接（WCAG 2.5.8 行内例外）。**验证过**；建议 P3：hub chip / 相关链接 / 空态 CTA 复用 `.tap-target::before` 44px 命中区。
9. **键盘可达**（`keyboard-tab.json`，每组合 Tab×25）：`no_focus_visible=0`、`zero_size_focused=0`；内容页 25 次 Tab 全部落在可见控件；壳页 / 短页（advanced、shortlist、monitors、why、mcp、404、share）7–12 个控件后回到 BODY 属正常循环。**验证过**。

### 2.2 安全头与 CSP（`r551/headers/`、`r551/security/`，脚本 `scripts/headers_matrix.sh`）

| 类别 | 路径样本 | HSTS | nosniff | Referrer | XFO | Permissions | CSP-RO |
|---|---|---|---|---|---|---|---|
| HTML（含 404/410 壳） | `/` `/?lang=en` `/tld/cn` `/guide/saas` `/vs/com-vs-cn` `/mcp` `/shortlist` `/nope` `/s/nope` | ✓ | ✓ | ✓ | DENY | ✓ | ✓ nonce + `report-uri /api/csp-report` |
| API / MCP / 文本 | `/api/prices` `/api/usage` `/api/stats` `/api/registrars` `/api/nope`(404) `POST /mcp` `/sitemap.xml` `/robots.txt` `/llms.txt` OG SVG | – | ✓ | ✓ | – | – | – |
| 静态（Assets 层） | `/assets/index-*.js` `/assets/index-*.css` `/favicon.svg` `/fonts/inter-latin-var.woff2` `/wx-share.png` `/nope.png`(404) | – | ✓ | ✓ | – | – | – |

- 与 `docs/security-headers.md` §1/§1.1 设计一致（HSTS 按 host 由 HTML 学到即可；R538 `_headers` 对静态生效，**R537 记录的「静态 0 个安全头」已关闭**）。**验证过**。
- CSP-RO 数据：`cspReports=2`（15:17Z / 15:45Z / 15:58Z 三次相同），`cspSamples` 仅 `script-src https://evil.example/x.js` 与 `font-src https://edge.example/f.woff2`（R534 合成，`firstAt=lastAt=11:15Z`），**真实样本 0**；64 次浏览 + Lighthouse 12 次无 `securitypolicyviolation`。
- 外部评分：Mozilla Observatory **B 75/100，11/12 通过**（`observatory_scan.json`，15:24:58Z；失败项 = CSP 仅 Report-Only）；securityheaders.com **A**（`securityheaders_com.txt`，15:25:27Z，Missing = `Content-Security-Policy`）。**验证过**。
- enforce 判据（`docs/security-headers.md` §7「生产观察 ≥7 天」）：CSP-RO 09-06 11:10Z（R533 上线）起观察，真实数据 **<1 天**，样本 0 条真实违规 → **不满足**；剩余 ≥6 天，建议 **2026-09-13** 后按同一脚本复评（若仍只有合成样本或仅扩展注入 → 可 enforce）。**推断**（结论基于判据文本与当前数据）。

### 2.3 IndexNow / 百度只读时间线（`r551/usage/usage_*.json`）

- `cronLast = indexnowLastAttempt = 2026-09-06T12:00:14.544Z`；`indexnowLastResult = {ok:true, status:200, message:"OK", submitted:300, retries:0, fallbackHosts:["yandex.com"]}`；`indexnowLastError=null`；`indexnowPending=970`。**验证过**。
- 与代码对照（`apps/web/src/worker.ts` `pingIndexNow` / `indexNowDelta`）：`pending = sitemap 1270 − 已推快照 300 = 970` 一致；`indexnowLast` 仍为 09-03 是因为「积压未清不写 indexnow:last」（代码注释），非故障。`fallbackHosts=["yandex.com"]` 表示主端点 429 后成功批次落在 yandex；`retries=0` 表示同批未重试（**推断**：主端点首次 429 即切备用端点）。
- 时间线预期「每 6h −300：970→670→370→70→0」：本窗口（15:17–16:00Z）内无 cron 触发，三次读数均 970，**未验证**；下一个观测点 18:00Z 后 `indexnowPending` 应为 670。
- 百度：`baiduLast=null`、`baiduLastError=null`（未配置 BAIDU_PUSH_*，代码分支不运行）；`botsBy={other:21654, ai:298}`，**无 `baidu` 键** → 今日 Baiduspider 来访 0。**验证过**。未触发任何 cron / IndexNow / 百度请求。

### 2.4 内容矩阵健康（`r551/thin/`，`scripts/seo-audit/thin-fetch.mjs` + `thin-analyze.mjs` + `scripts/thin_summary.py`）

- sitemap（`http/lang-matrix.md` 同源抓取）：1270 URL = 8 静态 + 408 tld + 410 guide + 444 vs，3810 `xhtml:link` alternate、1270 en hreflang；`scripts/content-counts.json` 408/410/444 一致。**验证过**。
- 全站抓取：tld 408×2 + guide 410×2 + vs 444×2 = 2524 HTML 全部 200（`thin/fetch-meta.json`）。**验证过**。
- 指标（`r551-thin-summary.json`；全站中位）：

  | 语料 | linkShare 中位 / p90 / max | >25% | ≥23% | prose 中位 | nnMasked 中位 | FAQ≠LD |
  |---|---|---|---|---|---|---|
  | tld/zh | 12.33% / 14.62% / 17.99% | 0 | 0 | 665 | 0.266 | 0 |
  | tld/en | 15.30% / 18.40% / 22.70% | 0 | 0 | 412 | 0.205 | 0 |
  | guide/zh | 18.36% / 20.35% / 21.74% | 0 | 0 | 1186.5 | 0.0785 | 0 |
  | guide/en | 16.83% / 18.80% / 21.22% | 0 | 0 | 728.5 | 0.064 | 0 |
  | vs/zh | 16.80% / 19.14% / 20.73% | 0 | 0 | 1013.5 | 0.229 | 0 |
  | vs/en | 19.84% / 22.21% / 22.98% | 0 | 0 | 628 | 0.173 | 0 |

  与基线：vs/en 中位 19.84% / max 22.98% / prose 628 **== R546**；vs/zh 16.8% / 1013.5 **== R546**；tld/zh prose 665 / nnMasked 0.266 **== R537**。随机抽样（seed 551）40 页 vs/en：linkShare 中位 20.21%、p90 22.60%、max 22.87%、prose 中位 623、nnMasked 中位 0.181、`gt25=0`；20 页 tld/en 见 `thin/pages.csv`。**验证过**。
- R542 守门有效性（`scripts/followup4.py` → 精确 verdict 段 `p.mt-2.5.text-[15px]` 首 59 字归一化）：444 页 × zh/en **0 组重复前缀**；`uk/de/au/fr-vs-com` en 首句分别含 Nominet / DENIC / auDA / AFNIC；四页后段共用句 “For a global audience, .com's recognition is irreplaceable…” 仍在（R546 P3，R550 修复中）。**验证过**。

### 2.5 功能回归（非 AI，`r551/functional/`，脚本 `scripts/functional_regression.py` + `functional_note.py`，截图 `screenshots-r551/01_`–`06_`）

| 步骤 | 结果 | 证据 |
|---|---|---|
| 精确核验 `r551zeroaiaudit` 输入 800ms 自动核验 | POST +1（9 TLD） | `functional_regression.json` step 1 |
| 不改内容再点核验 | +0 | step 2 |
| 改名 `…x` | +1 | step 3 |
| `.cn` 关闭 + 核验 | +1（body 无 cn） | step 4 |
| `.io` 切换 + 核验 | +0（chip `aria-pressed` false→true，但有效 TLD 集本已含 `io`，集合未变不重发） | step 5，与 R546 T1「.io 切换不改变有效 TLD 集」口径一致 |
| 查更多后缀 +401 | +1，body 401 TLD | step 6 |
| 未知行「重新核验 x.ai」 | +1 单域名 | step 7 |
| 星标 → 移除 | 34 个星标按钮，移除后剩 1 | step 8 |
| `/advanced` 粘贴 4 域名 | 1 次 POST `{"domains":[…4]}` | step 9，`02_advanced_bulk.png` |
| CSV 导出 | `domainhunter-bulk-20260906.csv`，表头 `…,first_year_price,expires_at`，4 行 | `functional/domainhunter-bulk.csv` |
| shortlist 3 条 / 备注 | 「加备注」→ 输入 → 刷新后仍在；share snapshot 字段 `["domain","label","status","tld"]` **不含 note** | `functional_note.json`，`06_shortlist_note.png` |
| 排序 首年价 / 到期日 / 域名 / 添加时间 | 4 种顺序各不相同且稳定 | step 13 |
| 同步码推送 + 读回 | `POST /api/sync` → 8 位码（已脱敏 `48******`）→ GET 200 3 items | step 14，`03_shortlist_share_sync.png` |
| 分享创建 → 撤销 | `LXK6AoZcVW` 页/API 200，SSR「3 个可注册域名候选」→ DELETE → 页/API **410** + noindex「分享已撤销」 | step 15–16，`http/share_shell_410.html` |
| monitors 添加 → 取消 | POST enabled:true → 列表含该域名（monitored 3）→ enabled:false → 列表空（monitored 2） | step 17–18，`04_` `05_` |
| MCP | `initialize` / `tools/list`（3 工具）/ `check_domains` / `tld_prices`（`tldCount 408 = live 351 + static 57`）/ `suggest_variants` / 未知工具 `-32602 unknown tool: nope` | `http/mcp_*.json` |
| `/api/prices` 新鲜度 | `tldCount=351 currency=USD usdToCny=7.2 fetchedAt=1788674449621`（06:00:49.6Z）== `pricesLastOk` 06:00:49.4Z 同一次抓取；`stale` 字段不存在；`pricesLastFail` 08-11（历史） | `usage/prices_before.json` / `prices_after.json` |
| 清理 | 分享 410（`l9147-gKoY` 与 `LXK6AoZcVW` 均已撤销）、监控列表空、会话 Chrome storage 字节级还原；**同步码 `sync:<code>` 无删除端点（90 天 TTL 自然过期），只含 3 个测试域名** | `functional_regression.json.cleanup`、`usage/storage_restore_check.txt` |

全部 **验证过**；`ai_calls=[]`、`console_errors=[]`。`/api/prices` 的 351 与 MCP `tld_prices` 的 408 是接口口径差（后者补 57 条 `approx:true` 静态参考价），非数据不一致。

## 3. 已知项核对（只标状态）

| 项 | 本轮状态 | 证据 / 说明 |
|---|---|---|
| R545 P1-1 已注册域名入清单仍显示首年价 + 去注册 | **仍存在**（生产未含 R548）→ 修复中 | `functional/p1_1_check.json`：精确核验 `google` → 星标 `google.com`（已注册，2028-09-14 到期）→ `/shortlist` 行显示「首年 $11.08 ≈¥80」+「去注册」，「批量去注册（1）」；`screenshots-r551/11_p1-1_shortlist_google.png`。**验证过** |
| R545 P1-2 `/vs/com-vs-io` zh 导语价与实时表不一致 | **仍存在**（生产未含 R549）→ 修复中 | SSR HTML：「站内参考价 .io 首年 259 元、续费 419 元，.com 首年 69 元、续费 85 元」vs 表 `.com $11.08 ¥80`、`.io $28.12 ¥202 / $51.8 ¥373`。**验证过** |
| R546 P3-a 四页共用句 | **仍存在** → R550 修复中 | §2.4。**验证过** |
| R546 P3-b 撤销后 SPA title 英文 | **未验证**（本轮撤销后未读 in-flow `document.title`；全新加载 revoked 页 SSR/DOM title 一致「分享已撤销」） | `ssr-vs-dom.json` |
| R545 P2-1 移动 chip 截断 | **已关闭** | `known_items2.json`：375px 首页「查更多后缀 +400」后 409 行 `rows_clipped=[]`，页面 375 无溢出；`09_known_home_375_comcn_chip.png`。**验证过** |
| R545 P2-2 `.ai` 两年起注未披露 | **仍存在**，建议 P2 | `known_items.json`：`/tld/ai` zh/en 正文与价格行「注册 $82.7≈¥595 / 续费 $82.7≈¥595」均无「两年 / 2-year」字样。**验证过**（是否两年起注本身以注册局规则为准，本轮未查官方页，**未验证**） |
| R545 P2-3 价格来源 / 时间戳 | **部分关闭**，建议 P3 | `/prices` 导语已写「live Porkbun prices first, ≈ static reference」「Live prices from Porkbun; CNY estimated at 7.2」，但无「更新于 …」时间（`/api/prices.fetchedAt` 可用）。**验证过** |
| R545 P2-4 `/advanced` 命名 / 入口位置 | **仍存在**，建议 P3 | title/H1「高级模式」（SSR title 却是「批量域名核验…」，见 P3-1）；375px 粘贴框顶部 y=752（视口 812）需滚动。**验证过** |
| R545 P2-5 批量核验无进度反馈 | **仍存在**，建议 P2 | 12 域名批量核验中途与结束文案均只有「已识别 12 个域名」，无 n/12 或进度条。**验证过** |
| R545 P2-6 内容页 Shortlist 首击回首页 | **仍存在**，建议 P3 | `known_items2.json`：`/tld/cn` 点「候选清单」→ 0.8s / 3.8s 后 URL 仍 `/`，第 2 次点击才 `/shortlist`；源码 `App.tsx` 内容路由传 `onShortlistClick={() => window.location.assign("/")}`。**验证过** |
| R545 P3-7 首页 chip 不显示人民币 | **仍存在**，建议 P3 | 首页结果行无 `¥`（`p3_7_home_has_yen=false`），`/advanced` `/shortlist` 显示 `≈¥`。**验证过** |
| R537 静态资源 0 安全头 | **已关闭（R538）** | §2.2 |
| R537 IndexNow 429 | **已关闭** | §2.3（12:00Z 200 / 300 条，`retries=0`） |

## 4. 复现命令（均零 AI）

```bash
# usage 前后对照
curl -s -A "Mozilla/5.0 r551-audit" "https://hunt.zalize.com/api/usage?days=1"
# lang 矩阵 / 头矩阵
bash scripts/seo-audit/lang-matrix.sh            # → docs/audits/r551/http/lang-matrix.md
bash docs/audits/r551/scripts/headers_matrix.sh  # → docs/audits/r551/headers/*.h
# 浏览器矩阵（64 组合）与 375 溢出复核
python3 docs/audits/r551/scripts/browser_matrix.py
python3 docs/audits/r551/scripts/overflow_verify.py "/tld/nz|zh" "/tld/sa|zh" "/vs/clinic-vs-care|zh" "/vs/clinic-vs-care|en"
python3 docs/audits/r551/scripts/overflow_static_runs.py   # 静态扫描 thin-fetch 产物
# 内容矩阵
node scripts/seo-audit/thin-fetch.mjs && node scripts/seo-audit/thin-analyze.mjs && python3 docs/audits/r551/scripts/thin_summary.py
# 功能回归 / 已知项
python3 docs/audits/r551/scripts/functional_regression.py && python3 docs/audits/r551/scripts/functional_note.py
python3 docs/audits/r551/scripts/known_items.py && python3 docs/audits/r551/scripts/known_items2.py && python3 docs/audits/r551/scripts/p1_1_check.py
```

## 5. 下一步建议（本轮只记录，不改代码）

1. **P1-1 375 溢出**：新开修复轮，内容页正文容器加 `break-words`（或内容侧在 TLD 序列间加可断点），并把 `/tld/nz` `/tld/sa` `/vs/clinic-vs-care` zh 加入 375 守门路由；修后用 `overflow_verify.py` 复测 16 页 `bodyScrollWidth=375`。
2. R548 / R549 / R550 部署后按 §3 表逐项复核 P1-1 / P1-2 / R546 P3。
3. 2026-09-13 起复评 CSP enforce 条件（§2.2）；18:00Z 后核对 `indexnowPending=670`（§2.3）。
4. P3-1 / P3-2 / P3-3 与 hub chip 36px 触点可合并进一轮小修。
