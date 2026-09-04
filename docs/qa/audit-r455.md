# R455 零 AI 全站审计报告（重点 R444–R451 变更面：R447 内容注入 / R451 modulepreload 收敛 / 首页 full 预载 / 白屏回归）

- 日期：2026-08-11（UTC）
- 生产站：https://hunt.zalize.com（version fcfa315f，deploy/r192-r195 tip 486494c，含 R444–R451）
- 审计方式：严格零 AI——全程未触碰任何 AI 路径（未点击 AI 猎名提交/示例/refine，未触发 DeepSeek 402）；quick-check、批量核验、MCP、shortlist/monitor 均为非 AI 通道；点击前均以 DOM/getBoundingClientRect 定位防误触；未部署、未注册域名、未支付。
- 零 AI 佐证：`/api/usage` 前后 `days` 深比较完全相等（`usage_days_equal: true`，见 `findings-r455-browser.json`）。
- 测试前备份 localStorage/sessionStorage（`storage-r455-pre.json`），测试后逐字节还原并复核（`STORAGE_IDENTICAL`，`storage-r455-post.json`）。
- 脚本与产物：`audit_http_r455.py`（HTTP 侧：1220 内容页全量扫描 + sitemap/llms + hreflang + JSON-LD + API/MCP）、`audit_browser_r455.py`（浏览器侧：chunk 审计、hub/prices/快查/主题/375px）、`recheck_ssr_r455.py`（SSR/水合一致复核）、`recheck_shortlist_r455.py` / `recheck_monitor_r455.py`（清单/监控流程）、`findings-r455-*.json`、`screenshots-r455/`（38 张）、`dump_storage_r455.py` / `restore_storage_r455.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 1 | 48 个 ccTLD/城市 TLD Porkbun 实时报价缺失（`/api/prices` 348/396，缺失 ae/at/be/br/ch/cn/fr/jp/kr/sg/berlin/paris 等），静态参考价兜底正常展示、MCP `tld_prices` 覆盖全量 396，无用户可见故障。较 R443（31 缺失/378 总量）缺失面随新增 ccTLD 扩大（+18 TLD 全为 ccTLD），属既定「静态兜底为设计内」范围，等第二价源接入。 |

R447+R451 性能重构回归面、内容全量 HTTP、hreflang/sitemap/llms、hub/prices/快查/chips/shortlist/monitor、375px 双主题、可观测**全部通过**。

## 1. R447+R451 性能重构回归面（重点）✅

### SSR 注入（HTTP，1220 页全量）
- `window.__DH_CONTENT__` 注入：/tld 396 + /guide 392 + /vs 432 = 1220 页 zh 全部 200 且注入 JSON 可解析、kind/slug 匹配（`content_sweep: total=1220, ok=1220, bad={}`）。
- en 抽样（?lang=en 各类型 first/mid/last）：全部 200 + 注入 OK + 入口 preload OK。

### modulepreload 收敛（R451）
- 内容页/hub/prices：SSR 仅注入 1 条 modulepreload，且为对应路由入口 chunk（tld-page-/guide-page-/compare-page-/prices-page-），无 home/domain-row/agent 前缀（`preload_entry_ok` 全量通过）。
- 首页 `/`：full 预载 10 条（含 home-page、domain-row chunk）→ `full_ok: true`。
- `/advanced`：full 预载 7 条 → `full_ok: true`。

### 内容页 0 禁用 chunk（onload + 空闲 6s）
- 浏览器实测 /tld/com、/guide/saas、/vs/com-vs-cn：onload 后再等 6s 空闲，`performance.getEntriesByType('resource')` 中实际加载的 JS 全部不含 home-page-/domain-row-/agent- 前缀（`chunk_audit_all_pass: true`）。

### SSR/水合一致性（6 页抽样，Accept-Language: zh 对齐）
- /tld/com /tld/ee /guide/saas /guide/jadecarving /vs/com-vs-cn /vs/kz-vs-tr：SSR h1 与水合后 h1 逐字相等，相关互链各 section 链接集合相等（`findings-r455-ssr-recheck.json`，`all_equal: true`）。
- 注：首轮浏览器审计出现「SSR 英文 vs 水合中文」差异，根因为测试环境浏览器 Accept-Language=en 触发 worker SSR 英文分支（worker.ts 语言检测按 accept-language），而水合按 localStorage `domainhunter:lang=zh`——为环境因素非产品缺陷；对齐语言后复核全部一致。

### 首页硬导航 / SPA 返回无白屏
- 硬导航 `/`：main 文本 666 字符、h1 存在，无白屏（C2）。
- 内容页 → 首页 SPA 返回（history.back）：pathname=/、main 683 字符、h1 存在（C3）。

## 2. 全量内容页 HTTP 审计 ✅

- 计数与 `scripts/content-counts.json` 完全一致：tld=396、guide=392、vs=432。
- canonical/hreflang 三链（zh/en/x-default）抽样：`hreflang_all_pass: true`。
- JSON-LD 抽样：各类型均含合法 JSON-LD 块。
- sitemap：1228 URL（396+392+432+8 core），无重复 loc，xhtml:link 3684 条全部合法（1228×3）。
- llms.txt：tld/guide/vs 计数与 sitemap 逐类相等。
- 404：未知 /tld//guide//vs/ 及随机路径均真实 404。

## 3. UI 审计（375px+桌面、双主题、0 AI）✅

- 三 hub：分组 chips 与 section 对齐（/tld 9/9、/guide 10/10、/vs 370/370）、锚点导航无 sticky 遮挡、过滤/无匹配/回顶（44×44）全部通过。
- /prices：396 行全量、过滤 shop→2 行、无匹配空态、清空恢复 396、排序生效、回顶 44×44 且回顶后隐藏。
- 快查：单个 9/9；All=397（「核验完成：共 397 个」）；chips 预填 `/?tld=shop` 生效（pressed=1、结果含 shop）。
- shortlist 流程：结果行「收藏到候选清单」→ localStorage `domainhunter:shortlist` 写入、候选清单面板显示该域名（S3/S4）。首轮脚本未找到按钮系选择器问题（按钮仅有 title 无 aria-label/text），复核通过。
- monitor 流程：已注册域名行「监控释放」→ `domainhunter:monitor` 写入 → /monitors 页显示「我的监控 1 个 / 全局名额 3/500」→ 取消监控后清空（S6/S7）。首轮 /monitors 无输入框为设计内（监控入口在结果行，不在页面表单）。
- 双主题截图差异明确（themes_distinct=true）；375px 视口下首页/hub/内容页/prices 无横向溢出；键盘导航正常；console 0 errors。

## 4. 生产可观测 ✅

- `/api/usage`：200，`days` 为对象且 day key 结构正常；`cronLast` 距今 152.7 min（< 6h 调度间隔，心跳正常）；`pricesLastOk` 16.1 min；`indexnowLast` 20.5 h。
- Porkbun 实时价：348/396，缺失 48 个（全为 ccTLD/城市 TLD，见 P3），静态参考价兜底展示正常。
- MCP：tools 列表为 check_domains/tld_prices/suggest_variants（无 AI 工具暴露）；`tld_prices` 覆盖 396/396。

## 审计范围外 / 未测

- Lighthouse 分数未采集（本轮重点为 R447/R451 功能回归，非性能分数基线）。
- AI 猎名端到端（按任务约束禁止触发）。
