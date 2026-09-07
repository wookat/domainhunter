# ROUND-575 零 AI 全站审计（R562–R571 上线后，生产 04ae07fe → b58acfbb → 3bc9c841）

- 审计对象：生产 https://hunt.zalize.com 。任务下达时 Worker version `04ae07fe-0629-4495-8c9f-ebee87cba10f` = 代码 `fbbad79`（含 R501–R571）。**审计进行中生产切换了两次**（见 §0.1 时间线）：R573 `b58acfbb`（合并 `57b7b17`，通知到达 12:52:38Z）、R574 `3bc9c841`（合并 `5a0033d`，12:55:10Z 后）。本分支基于 `deploy/r192-r195` tip `5a0033d`，**只新增 `docs/audits/audit-r575.md`、`docs/audits/r575/`、`docs/audits/screenshots-r575/`**，无源码改动。
- 审计窗口：2026-09-07 12:32Z–13:08Z（UTC）。HTML 抓取全部带 Mozilla UA；无头矩阵用独立 Chromium context（locale zh-CN，不碰会话 Chrome 存储）；R564/R565/R566 专项与 R574 复核用会话 Chrome（CDP）+ 录屏，测试前备份 localStorage/sessionStorage、测试后字节级还原（§2.0）。
- **0 次生产 AI 调用（验证过）**：无头矩阵 56 次访问（26 路由 × zh/en = 52 + extra 4）的 API 请求清单中 `/api/ai-search` 0 条（`r575/browser/visits.json`、`r575/browser_extra/visits.json`）；会话 Chrome 两轮专项的请求监听 `/api/ai-search` 0 条（`r575/ui/summary.json`、`r575/ui-r574/summary.json`）；curl 层脚本无任何 ai-search 请求（`r575/scripts/http_layer.sh`）；`/api/usage?days=1` 前（12:32:09Z）/ 后（12:53:05Z、13:07:55Z）`searches 0→0→0`、`fast 0→0→0`、`refine 0→0→0`（§2.0）。
- 生产调用预算：`POST /api/check` 全轮 **3 次**（curl 1 + 会话 Chrome 1 + R573 后冒烟 1；R574 复核 0）≤ 10；`POST /api/search` 11 次（curl 1、矩阵 `/?q=chaxiang` zh/en 2、专项 4、R574 复核 4）；MCP `check_domains` 1、`suggest_variants` 1；分享 create 2（curl 1 + UI 1，均已撤销）；webhook-test 真实投递 1（第 2 次被 429）。
- 证据目录：`docs/audits/r575/`（`usage/` 前后快照 + storage 备份/还原、`http/` API/MCP/分享生命周期/404/410 壳、`headers/` 26 条路径响应头 + Observatory 原始 JSON、`browser/`+`browser_extra/` 56 组合无头矩阵 JSON、`vsmeta/` R563 五页 meta/JSON-LD 价格核对、`ui/` 会话 Chrome R564/R565/R566 专项日志与 CSV、`ui-r574/` 3bc9c841 上 4 个 P3 复核日志、`post_r573/` b58acfbb 冒烟、`lighthouse/`、`local/` 本地验收日志、`scripts/`）；截图 `docs/audits/screenshots-r575/`（`matrix/` 84 张 zh 1280 浅 / 375 浅 / 375 深、`ui/` 86 张、`ui-r574/` 35 张）。录屏见 §2.9（附件）。
- 标注约定：**验证过** = 本轮一手生产实查 / 脚本实测；**未验证** = 本轮没有取到一手证据；**推断** = 由证据推理但未直接观测。

## 0. 结论

| 项 | 结论 |
|---|---|
| P0 / P1 | **无** |
| P2 | **无新立项**。`.com.cn` 在 `/api/prices`（351 TLD）与 `/prices` UI 均无价格行，「输入 `com.cn` 置顶」这一验收项**无法验证**（zh/en 均为空态）；`.cn` 置顶验证过。是否算缺陷取决于 `.com.cn` 是否在价格目录范围内——R570/R571 SKILL 已记录此现象，本轮**不立项、只记录**（§1 记录 A） |
| P3（新记录，2 条） | **P3-1** 375px 下 `/advanced` 与结果页 taken 行**不显示任何到期信息**（既无到期日期、也看不到 R574 新增的「到期日待查」chip：chip 在 DOM 中、文案/title 正确，但宽度被压成 0px），桌面正常。R574 研究文档已声明「375 该位置的到期文本本来就压缩到 0 宽，属既有布局」，故**非 R574 回归**，记为既有布局限制待决（§1 P3-1）；**P3-2** `/?q=chaxiang` 375px 首页快查面板 13 个图标按钮（收藏/开监控等）高 44 但宽 39–40px，「批量核验」入口 40×44——高度达标、宽度略低于 44（§1 P3-2） |
| R570/R571 4 个 P3 现状（3bc9c841 实测） | ① 已注册行「重新核验」纯图标 → **已关闭**（≥sm 图标+文字 78–85×28/32，375 纯图标 + aria-label，首页/`/advanced`/结果页 12 组合全过）；② `/advanced` DNS-only 行无「到期日待查」chip → **桌面已关闭**（`nic.cn`/`google.de` 出 chip 50/70×15，有日期的 `google.com`/`chaxiang.com` 无 chip），**375 不可见**（见 P3-1，属既有布局非本 P3 范围）；③ 批量末帧「核验中 20/20」→ **已关闭（就本轮观测）**：zh/en 两轮 MutationObserver + rAF 采样匹配 `核验中 20/20|Checking 20/20` = 0 次；但 19→20 分块边界未复现（20 行一次到达），该边界**未验证**；④ `/monitors` 已配置只读态 36px → **已关闭**（1280 发送测试/修改/清除 = 40/40/40，编辑态 4 控件 40，375 全 44，zh/en）。§3 |
| R564（`?q=` 落地） | 恰 1 次 `POST /api/search`、结果滚入视口（scrollY 796 / 1074，quick panel 在首屏）；`data-unknown-reason` 只出现 `rate-limited`，无原始 `http-429`；首页/`/advanced`/结果页 taken 行 = 到期日 · 开监控 · 重新核验，无价格/去注册；点 1 次重新核验 → 恰 1 次 `POST /api/check?refresh=1` body `{"domains":["chaxiang.com"],"refresh":true}`。R573 后 `/api/check` 走独立 `rl:check` 桶（按域名数 200/h），旧「与 AI 共用 20/h」口径作废；未压测 429（§2.3） |
| R565（通知方式卡片） | 三态 × zh/en × 375/1280 尺寸表齐全（04ae07fe：375 全 44，1280 未配置/编辑 40、已配置 36；3bc9c841 已配置 40）；`http://` 客户端拦截 400 级校验（服务端 `invalid_webhook` 400 由 curl 验证：http/ftp/乱串/缺失 4 例）；webhook.site 一次性接收端收到恰 1 条 `event:test` `source:domainhunter`；紧接第 2 次 429 `retryAfter 29` + `Retry-After: 29`，zh/en 限频文案；shortlist ↔ monitors webhook 同步；清理后 `POST /api/monitor/list` → `{"entries":[],"monitored":2,"limit":500}`（2 为审计前既有全局监控）（§2.4） |
| R566 | 导航「批量核验 / Bulk check」；`/advanced` 粘贴卡 top 165 < 组合生成 552；20 域名 1 次 `/api/search`，`aria-valuenow` 0,4,5,…,19,20 单调、`已完成 20/20`；CSV 20 行，`price_first_year_cny/price_renew_cny/price_first_year_usd/price_renew_usd` 48 个非空单元全为纯数字，`price_source` 列在，旧 `first_year_price` 列仍在；`/shortlist` 375 排序(273) → 域名卡(325/516/708) → 监控面板(912) → 分享面板；`.cn` 置顶随排序方向不变；`.com.cn` 见 P2 行（§2.5） |
| 全路由矩阵 | 26 路由 × zh/en = 52 次访问（+ `/vs/fr-vs-com`、`/vs/au-vs-com` 4 次 = 56）：console error 0、pageerror 0、requestfailed 0、非预期 4xx 0、浏览器 CSP 违规 0；SSR title == 水合 title、H1 一致；`<html lang>` zh-CN/en、canonical 自指、公开页 hreflang ×3（zh/en/x-default）、`og:locale` zh_CN/en_US、`/shortlist` `/monitors` 404/410/未知分享 `noindex`；可见文本/meta/JSON-LD 无 `{{`；FAQ JSON-LD 与可见 FAQ 28 组 / 96 条 Q/A 一致；375px `scrollWidth==clientWidth==375`、`scrollX_max 0`；键盘 52 组合 `no_focus_visible 0`、`zero_size_focused 0`（§2.1） |
| 非 AI API / MCP / 分享 | `/api/search` 3 域名 ndjson 200；`/api/prices` 200（351 TLD，USD，`usdToCny 7.2`，`.com` 11.08）；MCP initialize/tools/list/check_domains/tld_prices/suggest_variants 各 1 次 200；分享 create→GET 200→错 token 403→缺 token 400→DELETE 200→API/壳 410（zh/en `noindex`）→未知 404（§2.2） |
| usage 判读 | `indexnowPending` 前后均 **0**（已归零，非「每 cron −300」中途态）；`indexnowLastResult {ok:true,status:200,submitted:70}` 不变；`aiErrors`/`llmProvider`/`fallbacks` 字段**不存在**于当前响应（顶层键见 §2.0），无法按字段名判读——记为口径差异；`cspSamples` 2→2→3：新增 1 条 `script-src` / `blockedUri:"eval"` count 2（13:02:22Z–13:04:29Z），来源未确认（§2.0、§5） |
| Lighthouse 13.4.1 | 首页 92/100/100/100（m）100/100/100/100（d）；`/monitors` 89/100/100/66（m）99/100/100/66（d，SEO 只失 `is-crawlable`，即 `noindex` 私有页预期）；`/vs/de-vs-com` 96/100/100/100（m）100/100/100/100（d）；`/prices` 92/100/100/100（m）100/100/100/100（d）（§2.6） |
| 安全头 | HTML：HSTS 1y+includeSubDomains、nosniff、`Referrer-Policy strict-origin-when-cross-origin`、`X-Frame-Options DENY`、Permissions-Policy 8 项、CSP **仍 Report-Only**（nonce + `report-uri /api/csp-report`）；API/静态/MCP：nosniff + Referrer-Policy。Mozilla Observatory（API 实查 13:02:10Z）**B / 75**，11 过 1 失（失 = CSP 未强制）；securityheaders.com 从审计环境返回 403，**未取得评分**（§2.7） |
| 本地验收 | `pnpm -r typecheck` / `pnpm --filter web test`（55 文件 583 用例）/ `pnpm --filter web build` / `node scripts/check-content-counts.mjs`（TLD 408 / guide 410 / vs 444 / sitemap 1270）在 `f985459` 与 `5a0033d` 两个 tip 上均全绿（`r575/local/`）（§2.8） |

### 0.1 版本时间线与证据归属

| 时间（UTC） | 事件 | 本轮证据 |
|---|---|---|
| 12:32:09Z | usage 前快照、storage 备份（Chrome 会话存储为空 `{}`） | `usage/usage_before.json`、`usage/storage_backup.json` |
| 12:34:10–12:34:18Z | curl 层：sitemap/API/MCP/分享生命周期/webhook 校验/robots/llms | `http/`，**04ae07fe** |
| ~12:34–12:38:11Z（extra 12:47:17Z） | 无头矩阵 52 + 4 次访问（zh/en × 1280/375 × 浅/深） | `browser/`、`browser_extra/`，**04ae07fe** |
| 12:40:24–12:50:20Z | 会话 Chrome 专项 A–K（R564/R565/R566） | `ui/`，**04ae07fe** |
| 12:48:46–12:50:2xZ | Lighthouse 8 次 | `lighthouse/`，**04ae07fe** |
| 12:50:27Z | R573 部署 `b58acfbb`（通知 12:52:38Z） | `usage/r573_switch_notice.time` |
| 12:53:05Z | usage 后快照 #1；`b58acfbb` 冒烟：首页头、`/api/prices`、MCP tools/list、`/api/check` 1 域名 200 | `usage/usage_after.json`、`post_r573/` |
| 12:55:10Z | R574 部署 `3bc9c841` | — |
| 13:01:47–13:06:11Z | 会话 Chrome R574 复核（4 个 P3，加载的资源为新 chunk `index-FGNuJFLR.js`/`domain-row-DNLN-WBF.js`/`monitors-page-DNQoBewd.js`，旧版为 `index-BCbqmQ_d.js`） | `ui-r574/`，**3bc9c841** |
| 13:02:10Z | Mozilla Observatory 扫描 | `headers/observatory_scan.json`，**3bc9c841** |
| 13:07:19Z | storage 字节级还原 + 对照 | `usage/storage_restore2.txt`、`usage/storage_after_restore2.txt` |
| 13:07:55Z | usage 后快照 #2 | `usage/usage_after2.json` |

PR 标题按任务要求保留 `version 04ae07fe`；本文对每项证据标注实际版本。

## 1. 问题清单

### P3-1 375px 下 taken 行无任何到期信息（到期日 / 「到期日待查」chip 均被压为 0 宽）——既有布局限制（3bc9c841 验证过）

- 现象：`/advanced` 与结果页（`sessionStorage dh:lastSearch:v1` 回放真实 4 域名响应 → 「全部」筛选）taken 行在 375px 下：DNS-only 的 `nic.cn`、`google.de` 有 `[data-expiry="unknown"]`、文案「到期日待查 / expiry pending」、title 正确，但 `getBoundingClientRect().width = 0`（zh/en 均 0×15），肉眼不可见、无法 hover；同一行有日期的 `google.com`（2028-09-14）、`chaxiang.com`（2027-05-13）的到期文本在 375 同样不可见（04ae07fe 时 `D-taken-375-zh.png` 已见同现象）。1280 下 chip 50×15（zh）/ 70×15（en）可见，有日期行无 chip、正确。
- 复现：`https://hunt.zalize.com/advanced?lang=zh` → 粘贴 `chaxiang.com nic.cn google.de google.com` → 核验 4 个域名 → 视口 375 → 查看 taken 行。
- 截图：`screenshots-r575/ui-r574/12-advanced-zh-1280.png`（桌面 chip 可见）、`12-advanced-en-375.png`（375 四行只剩 域名(截断)·Taken·铃铛·刷新·书签）、`12-results-replayed-zh-375.png`、`12-results-replayed-en-375-dark.png`；旧版 `screenshots-r575/ui/D-taken-375-zh.png`。
- 证据：`r575/ui-r574/12-advanced-{zh,en}-{1280,375}.json`、`12-results-replayed-*.json`、`2-real-four-response.json`、`assertion-matrix.json`。
- 判定：`domain-row.tsx` 给 `ExpiryNote`/`ExpiryUnknownChip` 的 `min-w-0 shrink truncate`，在 375 行内 4 个 44px 触点 + 状态 badge 后无剩余宽度（**推断**，未改代码验证）。`docs/research/r574-p3-batch.md` 已明示「375 下该位置的到期文本本来就被压缩到 0 宽，属既有布局，chip 不改变 375 布局」，故不算 R574 回归；但「375 用户看不到到期日/待查提示」与「三处 taken 行 CTA = 到期日 · 开监控 · 重新核验」的产品口径在移动端不成立，建议产品决定是否换行显示（§4）。

### P3-2 首页 375px 快查面板图标按钮宽 39–40px（高 44）——观察（04ae07fe 验证过）

- 现象：`/?q=chaxiang` 375 zh：可见交互元素 1340 个，`under44_any 14`，其中 13 个是「宽 <44、高 44」的控件（`收藏到候选清单` 39×44、`批量核验` 40×44 等），0 个高度 <44；`/` 同样只有 `批量核验` 40×44。详情页面包屑「首页」28×20 与 `/vs/*` 顶部 TLD 链接 32–43×28 的可见框虽小，但脚本测得点击热区高 `hitH 44`（padding/伪元素扩展），按热区口径达标，只作记录。
- 证据：`r575/browser/touch-targets-375.json`（字段 `under44_controls_w_only` / `under44_controls_h`）；截图 `screenshots-r575/matrix/q_chaxiang_zh_375_light.png`。
- 与既有记录关系：R551 P3「hub chip 36 / 相关链接 40 / 空态 CTA 40」在本轮**无变化**（`/tld` `/guide` 分类 chip 36 高、`/vs` hub chip 36 高、`/prices` 相关比较链接 40 高、`/shortlist` 与撤销/未知分享壳 CTA 40 高），不重复立项；本条只记录首页快查面板宽度这一之前未单列的项。R574 复核中首页 chip 的「重新核验」按钮 375 为 44×44。

### 记录 A `.com.cn` 无价格行（不立项，验证过现象 / 未验证验收项）

- `/api/prices`（351 TLD）无 `com.cn` 键（`cn` 也无 API 行，UI 走静态近似价 `≈$5 ¥33 / ≈$5 ¥38`，MCP `tld_prices` 408 项含 `cn {4.58/5.28, approx:true}`）；`/prices` 输入 `com.cn` zh/en 均空态。R566 验收项「`com.cn` 置顶且随排序不变」**无法验证**。`.cn` 置顶验证过；用 `com` 多行对抗（`.com` 在 `.company/.community/.computer` 前）验证过置顶比较器随名称/首年价升降不变。
- 证据：`r575/http/prices.json`、`r575/ui/E-prices.json`、`E-multi-match.json`；截图 `screenshots-r575/ui/E-1280-zh-com.cn.png`、`E-com-multi-match.png`。

### 记录 B 静态资源 `cache-control: public, max-age=0, must-revalidate`（含 hash 的 `/assets/*.js|css`）

- 与 R551/R558 相同，非本轮变化，未评级，仍为性能优化候选。证据 `r575/headers/matrix_pretty.txt`。

## 2. 证据

### 2.0 零 AI、usage 前后对照与 storage 还原（验证过，`r575/usage/`）

| 快照 | UTC | 版本 | searches / fast / refine | pageviews（自然+审计流量） | bots | cspSamples | indexnowPending | indexnowLastResult |
|---|---|---|---|---|---|---|---|---|
| before | 12:32:09Z | 04ae07fe | 0 / 0 / 0 | home 13, results 2, prices 4, tld 5, other 40 | 998 | 2 | 0 | ok 200 submitted 70 |
| after #1 | 12:53:05Z | b58acfbb | 0 / 0 / 0 | home 40, results 8, prices 13, tld 23, guide 17, vs 48, other 83 | 1005 | 2 | 0 | 同上 |
| after #2 | 13:07:55Z | 3bc9c841 | 0 / 0 / 0 | home 48, results 8, prices 13, tld 23, guide 17, vs 48, other 92 | 1008 | 3 | 0 | 同上 |

- 响应顶层键：`days, cronLast, indexnowLast, indexnowLastAttempt, indexnowLastError, indexnowLastResult, indexnowPending, pricesLastOk, pricesLastFail, baiduLast, baiduLastError, cspSamples`；`days.2026-09-07` 内含 `pageviews/searches/fast/refine/bots`。任务清单中的 `aiErrors` / `llmProvider` / `fallbacks` **不在响应中**（未验证其增量，因无此字段）；`indexnowPending` 三次均 0，本轮观测不到「每 cron −300」的递减过程（已归零，**推断**为历史积压已清）。
- `cspSamples`：before/after#1 为 2 条历史样本（`script-src → https://evil.example/x.js`、`font-src → https://edge.example/f.woff2`，`evil.example`/`edge.example` 为合成测试样本特征，**推断**为 R551 期间人工上报）；after#2 新增 `{"directive":"script-src","blockedUri":"eval","count":2,"firstAt":13:02:22Z,"lastAt":13:04:29Z}`。该时段与本轮 R574 复核在 `/advanced` 上运行 MutationObserver/rAF 采样脚本重叠，且无头矩阵 56 次访问浏览器端 CSP 违规监听为 0——上报来源**未确认**（可能是审计侧 CDP 注入脚本的 `eval` 被 Report-Only CSP 采样，也可能是自然访客），不作为产品缺陷，见 §5。
- storage：备份时会话 Chrome `localStorage`/`sessionStorage` 均为空 `{}`；专项与 R574 复核后两次还原并 dump 对照：`restored; byte-identical: True` / `identical to backup: True`（`storage_restore.txt`、`storage_restore2.txt`、`storage_after_restore2.txt`）。
- 会话 Chrome 请求监听（Mozilla UA 由 Chrome 自带）：专项 `ai-search 0 / check 1 / search 4`（`ui/K-final-counts.json`、`ui/summary.json`）；R574 复核 `ai-search 0 / check 0 / search 4 / webhook-test 0 / share 0 / monitor-add 0`，未点击任何 AI/注册商/重新核验/发送测试控件（`ui-r574/summary.json`、`network.json`）。

### 2.1 全路由浏览器矩阵（验证过，04ae07fe，`r575/browser/`、`r575/browser_extra/`，脚本 `scripts/browser_matrix.py`、`browser_matrix_extra.py`）

- 路由 26：`/`、`/?q=chaxiang`、`/advanced`、`/shortlist`、`/monitors`、`/prices`、`/why`、`/mcp`、`/tld`、`/guide`、`/vs`、`/tld/{cn,de,ai}`、`/guide/{saas,ecommerce,legal}`、`/vs/{de-vs-com,mx-vs-es,com-vs-io,shop-vs-store,net-vs-org}`（R563 改占位 5 页取 de-vs-com、mx-vs-es，extra 再加 fr-vs-com、au-vs-com，共 4/5）、`/nope-r575-browser`（404 壳）、`/s/86mKLJRJmB`（存活分享，测后撤销）、`/s/u5QFymuLnu`（已撤销 410）、`/s/unknownr575`（404）。每路由 zh/en，各 1280 浅 + 375 浅 + 375 深三张截图，SSR HTML 用 Mozilla UA 单独抓取与水合 DOM 对比。
- 汇总（`visits.json` 52 条 + `browser_extra/visits.json` 4 条）：`console_real 0`、`pageerror 0`、`requestfailed 0`、非预期 4xx 0（404/410 壳自身状态码为预期）、CSP 违规 0、`ai_search 0`；`h1eq True` 全部；`pmiss 0`（可见文本/meta/JSON-LD 无 `{{`；SSR 原始 HTML 内 `window.__DH_CONTENT__` 水合数据可含 `{{price:...}}`，非可见文本亦非 JSON-LD，与 R563/R567 口径一致）。
- 头部矩阵（`head-meta.json`，26 路由 × zh/en = 52 条）：`html_lang` SSR==DOM 52/52（zh-CN / en）；SSR `title` == DOM title 52/52；canonical 自指且 SSR==DOM 52/52；20 个公开路由 hreflang 3 条（`zh` / `en` / `x-default`）SSR==DOM；`og:locale` zh_CN / en_US；`/shortlist`、`/monitors`、404 壳、410 壳、未知分享 `robots noindex`（SSR==DOM）且无 hreflang；存活分享 200 自指 canonical、无 robots、无 hreflang；JSON-LD 有无（FAQPage 等）SSR 与 DOM 一致 52/52（SSR 计嵌套类型数、DOM 计 `<script type=application/ld+json>` 块数，口径不同不比数值）。
- SSR==水合正文（`ssr-vs-dom.json`）：以 SSR 文本分块在水合 DOM 中的覆盖率计，内容页（tld/guide/vs 详情与 hub、`/why`、`/mcp`）0.90–1.0；应用壳页（`/` 0.36/0.5、`/prices` 0.02/0.08、`/advanced` `/shortlist` `/monitors` 0）低是因为 SSR 骨架被 React 交互 UI 替换（**推断**，与 R558 判读相同）；硬指标 title/H1 相等全部通过。
- 375 溢出（`layout-375.json`，52 组合 × 浅/深 = 104 条）：全部 `innerWidth = documentElement.scrollWidth = clientWidth = body.scrollWidth = 375`、`scrollX_max 0`；诊断记录到超出 375 的后代元素均在有意横向滚动容器内（`/why` 表、`/mcp` 代码块、hub chip 条——`/vs` hub chip 条约 30,500px 宽、VS 详情表），不构成页面级溢出。
- 触点（`touch-targets-375.json`）：见 §1 P3-2 与 R551 P3 状态。
- 键盘（`keyboard-tab.json`）：52 组合 Tab 遍历 `no_focus_visible 0`、`zero_size_focused 0`，首页 `tab_uniq 23`、404 壳 7。
- FAQ（`faq-ld-vs-visible.json`）：14 个含 FAQ 的路由 × zh/en = 28 组、共 96 条 JSON-LD Q/A，与可见 FAQ 文本逐条一致，0 不匹配。
- R563 五页 meta/JSON-LD 价格（`r575/vsmeta/vs_meta_price_check.json`、`summary.txt`，de-vs-com/mx-vs-es/fr-vs-com/au-vs-com × zh/en）：`brOut 0 brLD 0`（无 `{{`），meta description == og:description == 正文开场句 == FAQ JSON-LD == 可见 FAQ 的价格集合；zh 的「21 元 / 29 元」= 同页表格 USD `$2.9 / $4.07` × `usdToCny 7.2` 取整（`NOT_IN_TABLE []`）。R558 P2-1「静态编辑价与实时表矛盾」在这 4 页**已不存在**。
- 截图：`screenshots-r575/matrix/<route>_zh_{1280_light,375_light,375_dark}.png` 84 张（en 截图未入库以控制体积，JSON 证据含 en）。

### 2.2 非 AI API / MCP / 分享生命周期（验证过，04ae07fe，`r575/http/`，脚本 `scripts/http_layer.sh`，日志 `http_layer.log`）

- `POST /api/search` `["google.com","r575-audit-probe-qz7.com","baidu.cn"]` → 200 `application/x-ndjson`：`google.com taken rdap expires 2028-09-14 cached`、`r575-audit-probe-qz7.com available rdap`、`baidu.cn taken whois expires 2029-03-17`（`search3.ndjson`）。
- `POST /api/check?refresh=1` 1 域名 → 200 `{"domain":"r575-audit-probe-qz7.com","status":"available","method":"rdap"}`（预算第 1 次）。
- `GET /api/prices` → 200 `tldCount 351, currency USD, usdToCny 7.2, .com 11.08/11.08`，`cn`/`com.cn` 无行（`prices.json`）。
- MCP（`mcp_*.json`）：`initialize` → `server domainhunter 1.0.0 protocol 2025-03-26`；`tools/list` → `check_domains, tld_prices, suggest_variants`；`check_domains` 3 域名与 `/api/search` 一致；`tld_prices` → 408 项（含静态近似价，与 `/api/prices` 351 为不同口径）；`suggest_variants` → `r575audit{hq,app,labs}.{io,com}` 等 available + `firstYearPriceUSD`。
- 分享（`share_*.json/html`，token 已打码为 `REDACTED`）：create 200 → `GET /api/share/u5QFymuLnu` 200 → zh 壳 `lang=zh-CN` `og:locale zh_CN` 「3 个候选域名」/ en 壳 `lang=en` `en_US` 「3 domain candidates」→ 错 token DELETE 403 `forbidden` → 无 token 400 `token_required` → 仍 200 → 正确 token DELETE 200 → API 410 `revoked` → zh/en 壳 410 `noindex` 「分享已撤销 / This share has been revoked」→ `/api/share/unknownr575` 404。UI 侧另一次分享 `EZFiuxnOaK` 创建→UI 撤销→410（`ui/F-share-revoked.json`）。
- webhook-test 校验：`http://`、`ftp://`、乱串、缺失 → 均 400 `{"ok":false,"error":"invalid_webhook"}`（无投递）。
- `POST /api/monitor/list` → `{"entries":[],"monitored":2,"limit":500}`；`/api/monitor/changes` → `{"changes":[]}`；`/api/stats` `totalChecked 34278`；`/api/registrars` `{"affiliate":{}}`；robots（GPTBot/PerplexityBot/ClaudeBot Allow）、`llms.txt` 134 KB、sitemap 1270 URL（唯一 1270、alternate 3810）。
- b58acfbb 冒烟（`r575/post_r573/`，12:53Z）：首页 200 头一致、`/api/prices` 200 351 TLD、MCP tools/list 同 3 工具、`/api/check` 1 域名 200 cached。R573 `checkRateLimited` 的 429 体 `{error:"rate_limited",scope,limit,retryAfter,message}` + `Retry-After` 仅由代码 diff（`c1cc213`）读取确认，**未在生产触发**（不构造 200 域名压测）。

### 2.3 R564 专项（验证过，04ae07fe，`r575/ui/A-*.json`、`B-*.json`、`C-*.json`；3bc9c841 复核 `r575/ui-r574/1-*.json`）

- 落地：`https://hunt.zalize.com/?q=chaxiang` 首次导航 API 序列 = GET stats/prices/registrars + **恰 1** `POST /api/search` body `{"roots":["chaxiang"],"tlds":["com","cn","io","ai","app","dev","co","net","me"]}`，0 ai-search/check；桌面 `scrollY 796`、quick panel top 15.7px、首个重新核验 chip top 113.7px；375 原生 `innerWidth=clientWidth=scrollWidth=375`、`scrollY 1074`、chip top 178.4px。9 个结果 3 taken 6 available（`chaxiang.ai` 本轮 available，不可当 unknown 夹具）。
- unknown 枚举：首页 0 个 unknown 行；`/advanced` 20 域名批量出现 2 个 unknown（`r575-zz-probe-a8.ai`、`r575-zz-probe-b4.info`）`data-unknown-reason` 集合 = `{"rate-limited"}`，无 `http-429`；其余枚举分支**未验证**（未遇到）。
- taken 行 CTA 一致：首页快查 `chaxiang.com/.cn/.net`（到期 2027-05-13 / 2026-12-11 / 2027-09-04）、`/advanced` 桌面 5 个 taken（google.com/baidu.cn/example.org/github.com/wikipedia.org）均 = 到期日 · 开监控 · 重新核验，**无价格、无去注册**；结果页 3bc9c841 回放真实 4 行同样成立。
- 重新核验：点 `chaxiang.com` 1 次 → 12:41:43.785Z **恰 1** `POST /api/check?refresh=1` body `{"domains":["chaxiang.com"],"refresh":true}` 200 ndjson，无伴随 `/api/search`（`C-recheck.json`、`responses.json`；截图 `ui/C-recheck-zh.png`）。
- 图标/文字（3bc9c841）：见 §3 ①。
- 截图：`ui/A-1280-zh-light.png`、`A-1280-en.png`、`A-true375-{zh,en}.png`、`D-taken-1280-{zh,en}.png`、`D-taken-375-zh.png`。

### 2.4 R565 专项（验证过，04ae07fe，`r575/ui/G-*.json`、`H-*.json`、`I-*.json`、`J-*.json`、`K-*.json`；3bc9c841 复核 `ui-r574/4-*.json`）

| 态 | 375 原生（高） | 1280（高，04ae07fe） | 1280（高，3bc9c841） |
|---|---|---|---|
| 未配置：输入 / 保存 / 发送测试 | 44 / 44 / 44 | 40 / 40 / 40 | （未复测，R574 未改） |
| 已配置：发送测试 / 修改 / 清除 | 44 / 44 / 44 | **36 / 36 / 36** | **40 / 40 / 40** |
| 编辑：输入 / 保存 / 发送测试 / 取消 | 44 ×4 | 40 ×4 | 40 ×4 |
| 状态 badge（非交互） | 20.5 | 20.5 | — |

- zh/en 各 12 组合（`G-size-table.json`，截图 `ui/G-{1280,true375}-{zh,en}-{unconfigured,configured,editing}.png`、深色 `G-true375-en-configured-dark.png`）；英文 badge 文案为 `Not configured / Configured`，中文 `未配置 / 已配置`；375 输入框宽 309px。
- HTTPS 校验：UI 填 `http://example.com/hook` 保存 → 内联提示「地址必须以 https:// 开头 / URL must start with https://」，0 次网络请求，发送测试禁用（`H-validation.json`，截图 `H-invalid-375-{zh,en}.png`）；服务端 400 `invalid_webhook` 由 §2.2 curl 4 例验证。
- 投递与限频（`I-webhook-test.json`、`webhook_received.json`，接收端 UUID 已打码）：保存 webhook.site 一次性 HTTPS 接收端 → 发送测试 #1 200 `{"ok":true,"delivered":true,"status":200}`，UI「已发送，对方返回 HTTP 200……（event: test）」，接收端**恰 1 条**请求，body 含 `"event":"test"`、`"source":"domainhunter"` → 立即 #2 429 `{"ok":false,"error":"rate_limited","retryAfter":29}` + `Retry-After: 29`，zh「发送测试太频繁，29 秒后可再试」/ en「Too many test sends — try again in 29s」（截图 `I-first-success-zh.png`、`I-second-rate-limited-{zh,en}.png`）。
- 同步（`J-sync-*.json`）：shortlist 打开 `chaxiang.com` 监控 → `/monitors` 出现该个人条目、全局 2→3/500、接收端与 shortlist 折叠面板一致；`/monitors` 清除 webhook → shortlist 输入框空、显示通用设置提示；移除监控 → 个人列表空、全局 2/500（截图 `J-*.png`）。
- 清理（`K-*.json`、`ui-r574/cleanup*.json`）：UI 未配置 + 输入空 + 无监控域名，local monitor `[]`、share history `[]`；`POST /api/monitor/list`（Mozilla UA）→ `{"entries":[],"monitored":2,"limit":500}`（清理后即刻与最终各 1 次，R574 复核后再 1 次）。任务写的 `GET /api/monitor/list` 实为 404（接口只支持 POST），非清理失败。webhook.site 接收端 token 文件未入库；入库 JSON 中 URL 已截断为前 8 位 + `…`。

### 2.5 R566 专项（验证过，04ae07fe，`r575/ui/D-*.json`、`E-*.json`、`F-*.json`、`advanced.csv`）

- 导航：首页入口文案「批量核验 / Bulk check」；`/advanced` 页头显示「返回 / Back」。
- 顺序：`/advanced` 粘贴卡 top 165px < 组合生成器 552px（`D-order.json`）。
- 批量：`#advanced-bulk` 粘贴 20 域名 → 「已识别 20 个域名」→ 点「核验 20 个域名」1 次 → **恰 1** `POST /api/search`（20 域名 body），`role=progressbar` `aria-valuenow` 序列 `0,4,5,6,9,10,12,14,15,16,17,18,19,20` 非递减，`role=status` 终态「已完成 20/20」（`D-progress.json`）。04ae07fe 上观测到 1 帧「核验中 20/20」约 169ms 后变「已完成 20/20」（= R570 P3 ③ 旧现象）；3bc9c841 见 §3 ③。结果 13 available / 5 taken / 2 unknown。补充一轮 CDP 200B/s 限速批量取运行中截图 zh/en × 375/1280（`D-progress-*-slow-network.png`，显示 0/20）。
- CSV（`D-csv-validation.json`，`advanced.csv` 20 数据行）：表头含 `price_first_year_cny, price_renew_cny, price_first_year_usd, price_renew_usd, price_source`，旧列 `first_year_price` 仍在；48 个非空 `price_*` 数值单元全部匹配 `^\d+(\.\d+)?$`，无货币符号/≈。
- `/prices`：`.cn` 在 TLD 名 / 首年价 升降各 2 次点击后始终第一行（`E-prices.json`）；`.com` 多行对抗置顶验证过；`.com.cn` 空态（§1 记录 A）；375 原生宽 375、移动隐藏 CNY 列。
- `/shortlist` 375（`F-375-order.json`、`F-share-order.json`）：排序控件 top 273 → 域名卡 325 / 516.5 / 708 → 监控面板 912.5 → 同步/分享面板 973.5+；建 1 个真实分享后（含分享历史面板）顺序仍为 卡片 → 监控 → 分享（DOM index 43 / 211–269 / 300 / 306）；浅/深 × 375/1280 截图 `F-*.png`；分享 `EZFiuxnOaK` UI 撤销 → 410。

### 2.6 Lighthouse 13.4.1（验证过，04ae07fe，`r575/lighthouse/summary.json`、`run.log`，脚本 `scripts/lighthouse.sh`，12:48:46–12:50:2xZ）

| 页 | mobile P/A/BP/SEO | desktop P/A/BP/SEO | 失败审计 |
|---|---|---|---|
| `/` | 92 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | — |
| `/monitors` | 89 / 100 / 100 / 66 | 99 / 100 / 100 / 66 | SEO `is-crawlable`（`noindex` 私有页，预期） |
| `/vs/de-vs-com` | 96 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | — |
| `/prices` | 92 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | — |

a11y / BP 失败项 0、runWarnings 0。完整 LHR JSON 未入库（每份约 1 MB），可由脚本复跑。

### 2.7 安全头矩阵与外部评分（验证过，`r575/headers/`，脚本 `scripts/headers_matrix.sh`）

- 26 条路径（`matrix_pretty.txt`，04ae07fe）：HTML（`/` zh/en、`/tld/cn`、`/vs/com-vs-cn?lang=en`、`/guide/saas`、`/monitors`、`/shortlist`、`/mcp`、404 壳、`/s/` 410、`/s/` 404）全部 `strict-transport-security: max-age=31536000; includeSubDomains`、`x-content-type-options: nosniff`、`referrer-policy: strict-origin-when-cross-origin`、`x-frame-options: DENY`、Permissions-Policy 8 项、`content-security-policy-report-only`（nonce 1 个、`report-uri /api/csp-report`）、**无强制 CSP**；`vary: Accept-Language`；内容页 `cache-control public, max-age=600`，`/monitors` `/shortlist` `/s/` 404 无缓存头。`/api/*`（usage 300s、prices 600s、stats 60s、registrars 300s）、`POST /mcp`、sitemap/robots/llms（86400）、OG SVG、`/assets/*.js|css`、favicon、字体、`wx-share.png`：nosniff + Referrer-Policy；静态 `max-age=0, must-revalidate`（记录 B）。
- Mozilla Observatory（`observatory_scan.json`、`observatory_analyze.json`，API 直查，13:02:10Z，3bc9c841）：**grade B，score 75**，`tests_passed 11 / tests_failed 1`（CSP 仅 Report-Only）；上一次历史扫描 2026-09-06 11:43Z 同为 B/75，无变化。
- securityheaders.com：从审计环境请求返回 HTTP 403，**未取得评分**（未验证）。
- 浏览器端：56 次矩阵访问 CSP 违规监听 0；`/api/usage.cspSamples` 判读见 §2.0/§5。

### 2.8 本地验收（验证过，`r575/local/`）

- `f985459`（任务下达 tip）：`f985459-typecheck.log`、`f985459-test.log`、`f985459-build.log`、`f985459-content-counts.log` 全部 exit 0。
- `5a0033d`（当前 tip，含 R573/R574）：`typecheck.log` exit 0；`test.log` exit 0（55 文件 583 用例，含 `faq.test.ts`、`compare-verdict-opening.test.ts`、`compare-verdict-shared.test.ts`、`compare-price-placeholders.test.ts`）；`build.log` exit 0；`content-counts.log` TLD 408 / guide 410 / vs 444 / sitemap 1270 exit 0。
- 本轮只新增 docs，未改源码或测试。

### 2.9 录屏与截图

- 专项 A–K（04ae07fe）：`r575-ui-full-annotated.mp4`（完整）、`r575-ui-edited.mp4`（精简）——PR 附件 / 会话附件。
- R574 复核（3bc9c841）：`r574-full-annotated.mp4`、`r575-r574-followup-edited.mp4`——同上。
- 截图 `screenshots-r575/`：`matrix/` 84 张（zh 1280 浅 / 375 浅 / 375 深）、`ui/` 86 张（A–K）、`ui-r574/` 35 张（1-home / 12-advanced / 12-results-replayed / 3-progress / 4-configured / 4-editing × zh/en × 1280/375 + 深色）。会话 Chrome 截图中的 webhook 输入框为审计侧打码，非产品显示。

## 3. R570/R571 记录的 4 个 P3 现状（3bc9c841 实测，`r575/ui-r574/`）

| # | R570/R571 记录 | 04ae07fe 本轮取证 | 3bc9c841 复核 | 状态 |
|---|---|---|---|---|
| ① | 已注册行「重新核验」桌面纯图标 31×28 | 首页 chip / `/advanced` taken 行仍纯图标（`ui/C-*.json`、`D-taken-1280-zh.png`） | 首页 chip 79×28（zh）/ 85×28（en）、`/advanced` 与结果页 DomainRow 78×32 / 84×32，`<span class="hidden sm:inline">` 1280 `display:block` 文案「重新核验 / Re-check」，375 `display:none` 44×44 / 30×44 纯图标，aria-label「重新核验 chaxiang.com（穿透缓存直查注册局，不调用 AI）」保留；12 组合全过（`1-home-*.json`、`12-advanced-*.json`、`12-results-replayed-*.json`；截图 `ui-r574/1-home-{zh,en}-{1280,375}.png`） | **已关闭**（可重试 unknown 行分支未遇到，**未验证**） |
| ② | `/advanced` DNS-only taken 行无「到期日待查」chip | 20 域名批量 5 个 taken 均有日期，未遇 DNS-only 行（未验证） | `nic.cn`/`google.de`（`method:dns`、无 `expiresAt`）在 `/advanced` 与结果页出 `[data-expiry="unknown"]`「到期日待查 / expiry pending」+ title，1280 宽 50/70px；`google.com`/`chaxiang.com` 有日期无 chip（`2-real-four-response.json`、`12-*.json`；截图 `12-advanced-zh-1280.png`、`12-results-replayed-en-1280.png`） | **桌面已关闭**；375 chip 0 宽不可见 → §1 P3-1（既有布局） |
| ③ | 批量末尾 1 帧「核验中 20/20」 | 复现：`核验中 20/20` → 169ms → `已完成 20/20`（`ui/D-progress.json`） | zh（13:02:51–13:03:07Z）与 en（13:04:16–13:04:33Z）两轮，MutationObserver（`aria-valuenow`/characterData/childList）+ rAF 采样：`核验中 0/20 → 已完成 20/20`、`Checking 0/20 → Done 20/20`，首个 now=20 帧即 `finished` 无 spinner，匹配 `核验中 20\/20|Checking 20\/20` **0 次**（`3-progress-{zh,en}-frames.json`；截图 `3-progress-*-{running,completed}.png`） | **已关闭（就观测到的轨迹）**；因 20 行一次到达，19→20 分块边界**未验证** |
| ④ | `/monitors` 已配置只读态 发送测试/修改/清除 36px | 1280 已配置 36/36/36，编辑 40×4，375 全 44（`ui/G-size-table.json`） | 1280 已配置 40/40/40、编辑 40×4；375 已配置 44×3、编辑 44×4；zh/en 各 2 态 × 2 宽 8 组合，computed height == rect height；en 清除按钮文案 `Remove`（`4-{configured,editing}-*.json`；截图 `4-configured-zh-1280.png`、`4-editing-en-375.png`） | **已关闭** |

R570 另两条口径类 P3（`Retry-After` 与 UI 倒计时差 2s；`/advanced` DNS-only chip 已并入 ②）本轮未重测倒计时差（非缺陷口径）。R558 P3-1（`/advanced`/结果页 taken/unknown 行缺开监控/重新核验）与 P3-2（首页 unknown 重试端点）：本轮三处 taken 行均有开监控 + 重新核验（已关闭）；首页 unknown 行未遇到（未验证）。R553 P3「撤销分享 bare zh URL 水合后 `og:locale`」：本轮无头 zh-CN context 下 zh/en 410 壳 `og:locale` 正确（`head-meta.json`），会话 Chrome bare URL 场景未重测（未验证）。

## 4. 下一步建议

1. **P3-1 产品决策**：375 下 taken 行是否需要显示到期日 / 「到期日待查」（例如把到期信息换到第二行，或在 375 只保留 铃铛+刷新 两个触点腾出宽度）。若决定不显示，请在 SKILL / 验收口径里写明「375 到期信息不在行内」，避免后续轮次反复记录。
2. **记录 A `.com.cn`**：确认 `.com.cn` 是否应在价格目录（静态近似价或实时源），若应在则补数据并让 `/prices` 精确匹配可置顶；否则从 R566 验收清单移除该项。
3. **③ 边界补测**：在本地/预览用 mock 分块响应（19 行到达后延迟关闭流）验证 `progress.finished` 单一状态源下不会出现 `核验中 20/20`，并把它固化为 vitest 断言（现有 `bulkProgressLabel` 测试只覆盖静态标签）。
4. **usage 字段口径**：任务清单中的 `aiErrors / llmProvider / fallbacks` 不在 `/api/usage` 响应，请在 `docs/handoff-context.md §7.2` 明确当前字段集，或在 worker 补齐这些计数（本轮未改）。
5. **CSP**：Observatory 唯一失分项仍是 CSP Report-Only；`cspSamples` 新增的 `eval` 样本需先排除审计侧注入脚本（下一轮审计前先抓一次 `cspSamples` 基线、审计时不在页面上下文注入含 `eval`/`new Function` 的脚本，再判断是否自然流量）。R551 判据「≥7 天真实观察」最早 2026-09-13 可复评是否切强制。
6. **P3-2 / R551 触点**：如需彻底 ≥44×44，首页快查面板图标按钮 `min-w-[44px]`、hub 分类 chip 36→44 可一并处理（低优先级）。
7. **SKILL 补充**（本轮范围外，附建议稿 `r575/ui/skill-suggestion/SKILL.md`、`r575/ui-r574/skill-suggestion/SKILL.md`）：`/api/monitor/list` 仅 POST；375 触点测量用原生 CDP `setDeviceMetricsOverride` 而非桌面窄窗（后者带 15px 经典滚动条使 `clientWidth 360`）；`chaxiang.ai` 不可作为 unknown 夹具；R574 后 `[data-expiry="unknown"]` 在 375 宽度为 0 需按可见性而非 DOM 存在判定。

## 5. 需注意

- **版本漂移**：矩阵 / curl / Lighthouse / 专项 A–K 的证据在 04ae07fe 上采集；R573 只改 worker 限频（前端零改动），对上述证据无影响（**推断**，依据 PR #534 diff 与 b58acfbb 冒烟头/价格/MCP 一致）；R574 改动的 4 处均在 3bc9c841 上单独复核。PR 标题按要求保留 `version 04ae07fe`。
- **未验证清单**：`.com.cn` 置顶；可重试 unknown 行的「重新核验」文字/图标；19→20 分块边界；服务端 `/api/check` 429 体；securityheaders.com 评分；`aiErrors/llmProvider/fallbacks` 增量（字段不存在）；R553 bare zh URL `og:locale`；en 矩阵截图未入库（JSON 有）。
- **`cspSamples` 新增 `eval` 样本**来源未确认，不作缺陷；但若下一轮基线仍在增长且排除了审计脚本，需查页面是否有 `eval`/`Function` 依赖（Report-Only 切强制前必须清零）。
- **usage pageviews/bots 增量**含本轮 Mozilla UA 抓取与 56 次无头访问，不能用于自然流量分析；`searches/fast/refine` 三项 0 增量是零 AI 的服务端证据。
- **清理状态**：分享 `u5QFymuLnu`、`EZFiuxnOaK` 均 410；矩阵用存活分享 `86mKLJRJmB` 测后撤销（`browser/live_share.json`）；个人监控与 webhook 已清空，全局 `monitored 2` 为审计前既有；会话 Chrome 存储字节级还原为空备份；webhook.site 接收端 token 未入库，入库 URL 已打码；分享 revoke token 已替换为 `REDACTED`。
- **本轮生产写入**：`/api/check` 3 次、`/api/search` 11 次、MCP check/suggest 各 1 次、分享 create/delete 各 2 次、webhook-test 2 次（1 次投递）、监控 add/remove 1 对；均已回收，无遗留状态。
