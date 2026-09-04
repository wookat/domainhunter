# R472 AI 错误恢复路径 UX + 375px 首屏折叠：设计论证与验收对照

> 角色：前端工程师 + UI 设计师。背景：R469 匿名竞品复评 P1-A（429 两种语义同一套「重试本轮」CTA）与 P1-C（375 结果页首屏被横幅/chips 吃掉 ~60%，Top Picks 第一张卡在首屏之下）。先读代码、量基线，再动手。

## 1. 现状调查（一手证据）

### 1.1 错误态代码路径（`apps/web/src/App.tsx`，不在 results-page.tsx）

| 路径 | 触发 | `errorKind` | 现状 CTA |
| --- | --- | --- | --- |
| SSE `error` 事件（`handleEvent`） | 上游 LLM 非 2xx / 坏 JSON / 网络 | `quota` / `rate-limit` / `upstream` / `network` / `unknown`（worker `classifyAiError`，R470 把 429+`quota` 响应体归 quota） | quota：隐藏重试，展示 5 个降级链接（R267）；其余：文案不同，但都是同一颗「重试本轮」，rate-limit 没有任何「等多久」的信息 |
| HTTP 非 2xx（`!res.ok`） | worker 自身每 IP 20 次/小时限流（429）、400、5xx | **null**（`httpErrorSpec` 不带 kind） | 一律「重试本轮」 |
| fetch 抛错 | 断网 / 中断 | null | 「重试本轮」 |

- quota 文案「请稍后再试，无需重试」自相矛盾；降级入口是 5 个等权小链接（精确核验/批量核验/后缀指南/命名指南/后缀对比），375 下折 3 行。
- 「维护者已收到通知」**并不成立**：worker 只把 `aiErrors[kind]` 计入 `usage:{date}`（`bumpAiError`），可经 `/api/usage` 查看，没有任何推送。文案必须忠实：写「故障已记录」，不写「已收到通知」。
- 错误横幅、恢复条、理解条是 header 与 `<main>` 之间三个独立兄弟块，各自 `mx-auto mt-4 max-w-6xl px-4`。

### 1.2 两步确认护栏（R463/R465）与「重试」的关系

- R463：results-page Space 键两步确认；R465：恢复态（`restoredGuard`）「再来一轮」按钮两步确认。二者守的都是**用户从 0 发起一轮**的入口（`triggerMore` / keydown）。
- 既有「重试本轮」按钮直接调 `run(last.v, last.opts)`，不经过 `triggerMore`；`lastRunRef` 只在 `run()` 内赋值，而 `run()` 一开始就 `setRestoredGuard(false)`。即：只要存在可重试的 `lastRunRef`，本会话必然已经真实发起过一轮、护栏已被用户显式动作解除。**自动重试复用这条路径，语义上是「已发起过一轮后的续接」，不构成绕过。**

### 1.3 375×667 基线几何（Playwright `getBoundingClientRect`，恢复态 fixture，`docs/qa/r472/measure.js`）

| 视口 | 恢复条 | 理解条（含 4 chips） | h1 | Top Picks 标题 | 第一张卡 top | 第一个域名 bottom | 域名在首屏 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 375 zh | 73–117 | 117–322（205px） | 346–402 | 527–547 | **559** | 819 | ✗ |
| 375 en | 73–145 | 145–371（226px） | 395–451 | 605–625 | **637** | 896 | ✗ |
| 1440 zh | 73–117 | 117–181 | 205–233 | 282–302 | 314 | 659 | ✓ |
| 1440 en | 73–117 | 117–197 | 221–249 | 346–366 | 378 | 723 | ✓ |

与 R469 报告（y≈603–812）一致。375 下 header(73)+恢复条(44)+理解条(205) = 322px ≈ 首屏 48%，再加标题/统计/操作行到 559。卡内「域名字符串 bottom − 卡 top」≈ 260px，因此**卡 top 必须 ≤ 407 才能让域名进首屏**，任务目标 ≤ 420 不够，本轮内部目标 ≤ 400。

## 2. 方案（如无异议按此执行 — 已执行）

### 2.1 错误态分流（App.tsx + i18n）

```
errorKind
├─ quota      → 文案「AI 配额已用尽，故障已记录，维护者会处理；可先用精确核验 / 批量核验」
│               主按钮 [精确核验 → /?mode=exact] [批量核验 → /advanced]（44px 触点）
│               次级链接（后缀指南/命名指南/后缀对比）仅 ≥sm 显示，375 不占行
│               不渲染「重试本轮」；已有候选时结果不清空（既有行为，more 轮失败 rows 保留）
├─ rate-limit → 首次：「AI 服务暂时限流，{n}s 后自动重试一次」+ [取消自动重试]
│               30s 倒计时到 0 → run(last.v, last.opts)（与手动重试同一函数）
│               取消 / 第二次仍 rate-limit → 退回 [重试本轮]
│               标签页在后台（document.hidden）时到点不发起，等回到前台再发（不在后台白烧配额）
│               新一轮 run() 开始、离开结果页、卸载 → 清定时器
└─ network / upstream / unknown / HTTP 非 2xx（含 worker 自身 20 次/小时 429）→ 手动 [重试本轮]（不变）
```

- worker 自身的每小时限流走 HTTP 429（`errorKind` 为 null），其语义是**小时桶**，30s 倒计时会误导，所以只对 SSE `errorKind === "rate-limit"`（上游瞬时 429）启用倒计时。
- 自动重试只做一次：`autoRetriedRef` 在成功发起自动重试时置 true，用户手动发起任意新一轮（`run()` 非 retry 调用）时归零。
- 无障碍：可见倒计时每秒更新但 `aria-hidden`；旁边一个 `sr-only` `aria-live="polite" aria-atomic` 节点文本按 `ceil(n/10)*10` 取整（30→20→10），每 10s 才变化一次，不逐秒打断读屏。
- 与 R471 fallback 横幅并存：错误横幅与后续横幅都渲染在 header 下同一个 `<div class="mx-auto w-full max-w-6xl px-4 md:px-6">` 竖向 stack 里（`space-y-3`），R471 只需在其中追加一个兄弟节点即可；错误横幅用 `destructive` 色系，fallback 建议用 `brand-line/warning` 色系区分语义，两者互不遮挡。本轮不实现 fallback 横幅。

### 2.2 375 首屏折叠（仅 `<768px`，桌面 DOM/样式不动）

- 新组件 `ContextSummary`（`components/context-summary.tsx`）：`md:hidden` 的单行摘要按钮
  `已恢复 · <理解 core 前 12 字> ▾`（非恢复态为 `AI 理解 · <core 前 12 字> ▾`），`min-h-[44px]`、`aria-expanded`、`aria-controls`。
  展开区：恢复条动作（开始新搜索 / 关闭）、理解全文（core/风格/场景）、4 个微调 chips（44px 触点、quota/running 置灰逻辑复用）。
- 既有 `resumedNotice` 块与 `UnderstandingBar` 加 `hidden md:block`，桌面逐像素不变（用 CSS 断点而非 JS 判宽，无水合抖动、无 resize 监听）。
- results-page 标题右侧的操作组（导出 CSV / 再来一轮）在 `<sm` 隐藏（`hidden sm:flex`）：375 下它与底部 sticky 栏是同两颗按钮的重复，去掉后首屏再省 ≈57px；统计行补一颗紧凑「复制搜索链接」（`sm:hidden`）保住该功能。
- chips 选择「折叠进摘要行」而非「移到列表下方」：微调是围绕「AI 理解」的再猎动作，与理解文案同源同处，用户读到理解才会想微调；列表下方在长列表时不可见，且底栏已有「再来一轮」承担「看完再来」的动作。
- 预期几何：header 73 + 摘要行 ≈48 → main 从 ≈137 起，h1(56) + 统计(≈70) + 操作行(≈57) + 标题(20+12) → 卡 top ≈ 375（zh）/ ≈ 390（en），域名 bottom ≈ 635 / 650 < 667。

### 2.3 不动的部分

AI/核验/worker/SSE 事件结构零改动；`Row`/`SavedSearch` 不变；results-page.tsx 的两步确认逻辑不变；verify 脚本不改。

## 3. 验收对照表

证据来源：`screenshots/r472-*.png`、`screenshots/r472-{base,after}-geometry.json`（Playwright `getBoundingClientRect`）、`screenshots/r472-error-checks.json`（70 项自动断言，Playwright 路由拦截 `/api/ai-search` 返回构造 NDJSON `error` 事件 + `page.clock` 虚拟时钟推进 30s）。所有浏览器证据在本地 `wrangler dev --port 8787` 上采集，**真实 AI 调用 0 次**（所有 `/api/ai-search` 请求被 route 拦截，计数见 `aiCalls`/`intercepted`）。

| # | 需求 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1a | quota：不显示「重试本轮」 | ✓ 无重试按钮、无取消按钮 | `quota no retry button` zh/en；`r472-quota-375-{zh,en}.png` |
| 1a | quota 文案 | ✓「AI 配额已用尽，故障已记录、维护者会处理；可先用精确核验 / 批量核验」（**改为「故障已记录」**——worker 只计数不推送，见 §1.1，文案必须忠实） | `quota wording` zh/en |
| 1a | quota 给 /advanced 与首页快查入口按钮 | ✓ `[精确核验 → /?mode=exact]` `[批量核验 → /advanced]`，均 44px 高 | `quota CTA links (44px)` quick=44 bulk=44 |
| 1a | 已有候选时只在顶部横幅提示、不清空结果 | ✓ Top Picks 与卡片仍在，底栏「再来一轮」置灰 | `quota keeps results`、`quota bottom more disabled` |
| 1b | rate-limit：30s 倒计时 + 自动重试一次 | ✓ 首次出现 29–30s 倒计时；虚拟时钟推进 30s 后 `/api/ai-search` 请求数 1→2，且仅一次 | `rate-limit shows 30s countdown`、`auto retry fired exactly once at 30s` ×4 视口/语言 |
| 1b | 可取消，「取消自动重试」 | ✓ 倒计时期间只有取消按钮、无重试按钮；点取消后退回「重试本轮」，之后 40s 内 0 次自动请求 | `cancel button present`、`cancel → manual retry button`、`cancel → no auto retry` |
| 1b | 第二次仍 rate-limit → 手动重试 | ✓ 文案「AI 服务仍被限流，请稍等片刻后手动重试」+「重试本轮」，无取消按钮，再推进 40s 无第三次请求 | `second rate-limit falls back to manual retry`、`no further auto retry`；`r472-ratelimit-manual-375-zh.png` |
| 1b | 不绕过 R463/R465 护栏 | ✓ 自动重试只在 `lastRunRef` 存在时调度，而 `lastRunRef` 仅由已发起的 `run()` 写入（§1.2）；测试中恢复态首点「再来一轮」仍需二次确认才发起 | `fireMore()` 走两步确认；verify-r463/r465 全绿 |
| 1c | network/upstream/unknown 手动重试 | ✓ 逻辑未改（仅 `rate-limit`/`quota` 分支新增）；HTTP 非 2xx（worker 小时限流）无 `errorKind`，不进倒计时 | App.tsx `handleEvent` / `httpErrorSpec` |
| 1d | 与 R471 fallback 横幅并存 | ✓（说明）横幅 stack 容器 `space-y-3`，见 §2.1 | App.tsx |
| 2 | <768 恢复条+理解条合并为「已恢复 · 前 12 字 ▾」 | ✓ 摘要行 46px，zh 取 12 字、en 取 36 字符 + CSS truncate；点开展开全文/恢复动作/chips | `r472-after-375-zh.png`、`r472-summary-expanded-375-{zh,en}.png` |
| 2 | chips 折叠进摘要行 | ✓ 4 个 chips 在展开区内，44px 高，idle 可点 | `4 refine chips ≥44px in panel`、`refine chips enabled when idle` |
| 2 | 375×667 第一张卡 top ≤ 420 | ✓ **zh 333 / en 333**（基线 559 / 637） | `r472-after-geometry.json` |
| 2 | 第一个可注册域名进入首屏 | ✓ `lumora.com` bottom 592 < 667，且在底部 sticky 栏（top 610）之上 | `firstDomainInViewport=true`、`firstDomainAboveBottomBar=true` |
| 2 | 桌面 ≥768 逐像素不回归 | ✓ ImageMagick `compare -metric AE` base vs after：1440 zh **0** 像素差、en **0** 像素差 | `r472-{base,after}-desktop-{zh,en}.png` |
| 3 | 双语 i18n | ✓ 新增 13 组 zh/en key（`summary.*`、`error.ai.quota*`、`error.ai.rateLimit*`、`error.ai.autoRetry*`），`I18nKey` 类型约束两表同步 | typecheck 全绿 |
| 3 | 倒计时 aria-live=polite、每 10s 才更新 | ✓ 可见倒计时逐秒 `aria-hidden`；`sr-only aria-live` 文本 0–9s 内不变（「约 30 秒后自动重试」），10s 后变「约 20 秒」 | `aria-live unchanged within 10s`、`aria-live steps to 20 after 10s` |
| 3 | 折叠按钮 aria-expanded、44px 触点 | ✓ `aria-expanded` false→true，`aria-controls` 指向 `hidden` 面板，按钮高 44 | `summary toggle 44px`、`summary aria-expanded=*`、`panel hidden when collapsed` |
| 硬 | 0 真实 AI 调用 | ✓ 所有浏览器测试均 route 拦截；verify 脚本用内置 mock | `aiCalls=0`、`intercepted=1` |
| 硬 | verify-r466/465/463/264/238 + typecheck + build | ✓ 全部 ALL PASS / Done / built | 本地实跑（§4） |
| 硬 | 不启用 Actions / 不提交密钥 / 不改测试 | ✓ 无 `.github` 改动、无 `.dev.vars`、`scripts/verify-*` 未改 | `git diff --stat` |

## 4. 验收结果

### 4.1 几何前后对比（375×667，恢复态 fixture）

| 视口 | 第一张卡 top（前 → 后） | 第一个域名 bottom（前 → 后） | 域名在首屏 | 底栏 top | 横向溢出 |
| --- | --- | --- | --- | --- | --- |
| 375 zh | 559 → **333** | 819 → **592** | ✗ → ✓ | 610 | 无（scrollWidth 375） |
| 375 en | 637 → **333** | 896 → **592** | ✗ → ✓ | 610 | 无（scrollWidth 375） |
| 1440 zh | 314 → 314 | 659 → 659 | ✓ | — | 0 像素差 |
| 1440 en | 378 → 378 | 723 → 723 | ✓ | — | 0 像素差 |

首屏（header 57 + 摘要行 46 + h1 + 统计 + Top Picks 标题）= 333，比任务目标 420 余 87px，比 §1.3 推出的硬阈值 407 余 74px；zh/en 相同是因为 en 摘要行也只占一行（36 字符截断 + truncate），h1 两行同高。

### 4.2 本地验证（2026-09-04，本机实跑）

```
node scripts/verify-r466.mjs   ALL PASS
node scripts/verify-r465.mjs   ALL PASS
node scripts/verify-r463.mjs   ALL PASS
node scripts/verify-r264.mjs   All checks passed
node scripts/verify-r238.mjs   ALL PASS
pnpm -r typecheck              apps/web typecheck: Done（core 无 typecheck 脚本，同基线）
pnpm --filter web build        ✓ built
node docs/qa/r472/errors.js        70/70 checks passed（→ screenshots/r472-error-checks.json）
node docs/qa/r472/measure.js after 4 视口 aiCalls=0（→ screenshots/r472-after-geometry.json）
```

### 4.3 未验证 / 边界（如实）

- 未在真实 DeepSeek 401/429 上验证（硬性 0 调用）；错误态全部由 route 拦截返回的 NDJSON `error` 事件驱动，事件结构与 worker `emit({type:"error", errorKind,...})` 一致。
- 倒计时 30s 用 Playwright 虚拟时钟推进，未做实时 30s 等待；实时路径的 `setTimeout(1000)` 链与虚拟时钟下的一致。
- `document.hidden` 时到点不发起、回前台再发：逻辑存在，未做自动化断言（headless 下难以真实切换 visibility）。
- 仓库无 `lint` 脚本与 eslint 配置（`pnpm --filter web lint` → `ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT`），与基线一致，以 typecheck + build 为准。
- 未部署生产；生产回归待合并后按 SOP-03 走。
