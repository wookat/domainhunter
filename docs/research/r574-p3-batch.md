# R574：R570/R571 生产回归记录的 4 个 P3 批（重新核验按钮文字 · /advanced 到期日待查 chip · 批量进度末帧 · /monitors 只读态 40px）

> 背景：`docs/qa/r570-regression.md`、`docs/qa/r571-regression.md` 留下 4 个 P3（`docs/handoff-context.md` §10「R570/R571 P3」）。本文按 SOP-02 调研先行：每项先生产实查（**0 次 AI 调用**：只走 `/?q=`、`/advanced` 粘贴 → `POST /api/search`、`/monitors` 与 sessionStorage/localStorage 快照，不请求 `/api/ai-search`），再查 git 历史判断「设计意图 vs 回归」，最后给方案 + 验证方式。
> 生产基线：`hunt.zalize.com` version `04ae07fe`（含 R501–R571）；本地基线 `deploy/r192-r195` @ `f985459`（相对生产只多 docs）。
> 复现脚本（Playwright 连本机 Chrome CDP，不入库）：`~/r574/prod_probe.py`（生产只读）、`~/r574/local_server.mjs` + `~/r574/local_probe.py`（本地 dist + 确定性 API mock 复测）、`~/r574/storage.py`（storage 备份/字节级还原）。截图随 PR 描述附上（规则⑨：本轮不新增 `docs/research/r574/` 截图目录）。
> 逐项标注：**[验证]** = 生产/脚本一手实测；**[源码]** = 行号可查的代码事实；**[推断]** = 未实测的推理。

## 0. 结论先行

| 项 | 生产现状（[验证]，version 04ae07fe） | 根因（[源码]） | 判定 | 方案 | 验证 |
|---|---|---|---|---|---|
| P3-1 已注册行「重新核验」仅图标 | 结果页 `/?cb=` 已注册行 1280：按钮 30×32、`span` 缺失（`labelSpan: no-span`），只有 aria-label/title；375：30×44 图标。首页 `/?q=google` chip 1280：31×28 图标，375：44×44 | `RecheckButton` 自带 `withLabel=true` + `<span class="hidden sm:inline">重新核验</span>`，但 R564 `fb1aa8b` 在 `DomainRow` taken 分支写死 `withLabel={false}`（同 commit unknown 分支没写 → unknown 行有文字） | **回归**（同一 commit 内 taken/unknown 不一致，commit 信息「taken 行 CTA 三处一致」未提图标化理由） | `DomainRow` taken 分支去掉 `withLabel={false}`：≥sm 图标+「重新核验」，<sm 仍图标 + aria-label/title、44px 触点 | 本地 1280：78×32 有文字；375：30×44 `display:none`；vitest 源码守门 |
| P3-2 `/advanced` DNS-only taken 行无「到期日待查」 | `nic.cn google.de google.ch google.co.jp google.jp` 5 行均 `Taken` 且无到期文本、无 `[data-expiry="unknown"]`；`google.com baidu.com` 本次 RDAP 有到期日故不复现 | 首页 quick-check（`home-page.tsx`）有 `expiresAt ? <ExpiryNote/> : <i data-expiry="unknown">到期日待查</i>` 分叉；`DomainRow` taken 分支只有 `{row.expiresAt && <ExpiryNote/>}`（R565 `cbfe34f` 只给首页 chip 加了 fallback） | **不一致**（同一语义两处渲染） | 抽出 `ExpiryUnknownChip`（复用 i18n `expiry.unknownChip/unknownChipTip`），`DomainRow` taken 分支缺 `expiresAt` 时渲染它；Results 与 `/advanced` 共用 `DomainRow` 一并修好 | 本地 `/advanced` 与结果页 nic.cn/google.de 行出现 chip + tooltip；google.com 行不出现 |
| P3-3 末帧「核验中 20/20」 | 20 域名批量，MutationObserver 逐帧：`Checking 20/20`（spinner, aria-valuenow=20, t=4197ms）→ `Done 20/20`（t=4459ms），中间 **262ms** 停在「核验中 20/20」 | `progress.done` 在收到 chunk 时 `setProgress` 更新；`running=false` 在 `finally`（流 `reader.read()` 返回 done 之后）另一次 render 更新；文案/图标由 `running` 判定 → 末条 chunk 到达与流结束之间必然多一帧 | **实现缺陷**（两份状态源） | `BulkProgress` 增加 `finished`：`advanceBulkProgress` 在 `done ≥ total` 的那次更新里直接置 `finished`；流结束 `finishBulkProgress` 只对未完成（未知 total / 断流）补位；进度区只读 `progress.finished` | 本地 zh/en 各 9 帧：`…18/20 → 已完成 20/20`，0 帧「核验中 N/N」；组合器路径 `已核验 6 个 → 已完成，共核验 6 个` |
| P3-4 `/monitors` 已配置只读态 36px | 1280 已配置态：发送测试/修改/清除 = **36**（`sm:h-9`）；同卡片编辑态 输入框/保存/发送测试/取消 = **40**（`sm:h-10`）；375 两态全 44 | R565 `cbfe34f` 定义 `BTN_SECONDARY … sm:h-9`，编辑态调用处却叠加 `cn(BTN_SECONDARY, "sm:h-10")`，只读态与清除按钮沿用 36 | **无设计 token 依据**（见 §4.2） | `BTN_SECONDARY` → `sm:h-10`（去掉调用处叠加），清除按钮 `sm:h-9 → sm:h-10`；移动 `h-11` 不动 | 本地 1280 只读态 3 按钮 40/40/40，编辑态 40×4；375 全 44；`monitor-webhook.test.ts` R571 守门仍过 + 新增守门 |

零 AI 证据：生产 `GET /api/usage?days=1` 测试前后 `searches:0 / fast:0 / refine:0`（`~/r574/prod/usage-before.json`、`usage-after.json`）；探针拦截 `**/api/ai-search*` 命中 0 次；生产请求只有 `/api/search`、`/api/stats`、`/api/prices`、`/api/registrars`、`/api/monitor/list`。storage：测试前 dump 107 字节（`domainhunter:theme/shortlist/lang`），还原后 MD5 `a7dc95f83b222adf62e898af1340e6fe` 一致；`/api/monitor/list` 测试后 `entries:[]`（webhook 只写 localStorage，未创建监控）。

## 1. P3-1 已注册行「重新核验」仅图标

### 1.1 现状证据（[验证]）

| 路由 | 视口 | 按钮 rect | 文字 span | aria-label/title |
|---|---|---|---|---|
| `/?q=google` 首页快查 chip | 375 | 44×44 | 无（`no-span`） | 有 |
| `/?q=google` 首页快查 chip | 1280 | 31×28 | 无 | 有 |
| 结果页（sessionStorage `dh:lastSearch:v1` 快照 → `全部` 筛选）taken 行 | 375 | 30×44 | 无 | 有 |
| 结果页 taken 行 | 1280 | 30×32 | 无 | 有 |
| 结果页 unknown 行（对照） | 1280 | 有「重新核验」文字 | `inline` | 有 |

截图：`p3-1-home-q-google-{375,1280}.png`、`p3-1-results-{375,1280}.png`、`p3-1-results-row-nic-{375,1280}.png`。

### 1.2 git 历史（[源码]）

- `git log -S'withLabel={false}'` 只命中 1 个 commit：`fb1aa8b`（R564，2026-09-06，"fix(r564): ?q= 落地精确核验并滚到结果 + unknown 行原因/单行重新核验 + taken 行 CTA 三处一致 + 重试端点统一"）。该 commit **同时**新增了 `RecheckButton`（默认 `withLabel = true`，内置 `<span className="hidden sm:inline">`），在 `DomainRow` taken 分支传 `withLabel={false}`，在 unknown 分支不传，在 `home-page.tsx` 两处 chip 传 `withLabel={false}`。
- commit 信息、`docs/handoff-context.md`、R564 前后的 research/qa 文档均无「taken 行按钮图标化」的设计说明；R570 起回归脚本按文本找按钮误 FAIL，R571 才改用 selector/aria-label 断言（`.agents/skills/testing-domainhunter/SKILL.md` R570–R571 节）。
- **判定**：同一 commit 内 taken/unknown 行不一致 + 无设计记录 → 视为回归，而非设计意图。[推断] 当时目的可能是压缩 taken 行宽度给「开监控」CTA 让位，但 1280 下行右侧仍有 >400px 空白（截图 `p3-1-results-1280.png`），无此必要。

### 1.3 方案 → 验证

- `apps/web/src/components/domain-row.tsx` taken 分支：`<RecheckButton … withLabel={false} />` → `<RecheckButton … />`。组件本身已是「≥sm 图标+文字 / <sm 图标」的响应式实现，无需新 i18n key（`row.recheck` / `row.rechecking` 已双语）。
- 首页 `home-page.tsx` 的两处 chip（`variant="chip" withLabel={false}`）**不在本轮允许改的文件范围**（规则⑨）：本轮只记录，见 §6 范围外待办。chip 在 375 已是 44×44、有 aria-label，可用性无问题。
- 验证：本地 1280 结果页/`/advanced` taken 行按钮 **78×32**、`span display: block`、文案「重新核验」；375 **30×44**、`span display: none`；aria-label/title 仍在；Tab 9（375）/11（1280）次可达且有 focus ring（截图 `p3-1-2-results-light-1280.png`）。vitest：`domain-row-recheck.test.ts` 新增守门断言 taken/unknown 行 HTML 含 `<span class="hidden sm:inline">重新核验</span>`（en `Re-check`）。

## 2. P3-2 `/advanced` DNS-only taken 行不显示「到期日待查」

### 2.1 现状证据（[验证]）

- `/advanced` 粘贴 `google.com baidu.com`：两行都有 `expires 2028-09-14` / `2027-10-11`，**不复现**（RDAP 正常返回到期日时无需 chip）。
- 粘贴 `nic.cn google.de google.ch google.co.jp google.jp`：5 行 `Taken`，rowText 只有 `— nic.cn Taken Monitor`，`[data-expiry="unknown"]` 0 个（截图 `p3-2-advanced-noexpiry-1280.png`、`p3-2-advanced-row-noexpiry-*.png`）。
- 首页 `/?q=` 快查 chip 对同类结果显示「到期日待查」并带 tooltip（R565 `cbfe34f`，`data-expiry="unknown"`）。

### 2.2 分叉（[源码]）

| 位置 | `expiresAt` 有 | `expiresAt` 无 |
|---|---|---|
| `home-page.tsx` quick-check chip | `<ExpiryNote/>` | `<i title={t("expiry.unknownChipTip")} data-expiry="unknown">{t("expiry.unknownChip")}</i>` |
| `domain-row.tsx` `DomainRow` taken 分支（Results + `/advanced` 共用） | `<ExpiryNote className="shrink truncate"/>` | **什么都不渲染** |

### 2.3 方案 → 验证

- `domain-row.tsx` 新增导出 `ExpiryUnknownChip({className})`（与首页 chip 相同 markup/i18n key/`data-expiry="unknown"`），`DomainRow` taken 分支改为 `row.expiresAt ? <ExpiryNote/> : <ExpiryUnknownChip className="min-w-0 shrink truncate whitespace-nowrap"/>`。`shrink truncate` 与 `ExpiryNote` 同口径：375 下该位置的到期文本本来就被压缩到 0 宽（生产 `p3-1-results-375.png` 里 google.com 的 `expires 2028-09-14` 同样不可见，属既有布局），chip 不改变 375 布局；≥sm 可见 50px。
- 不新增 i18n key（`expiry.unknownChip` / `expiry.unknownChipTip` zh/en 已存在）。`home-page.tsx` 改为复用 `ExpiryUnknownChip` 属范围外，见 §6。
- 验证：本地 `/advanced`（mock `/api/search` 对 `nic.cn/google.de` 返回 `status:taken` 无 `expiresAt`）与结果页：nic.cn/google.de 行 `unknownChip {text:"到期日待查", title:true, visibleW:50}`（1280）；google.com 行无 chip；375 无水平溢出（`scrollWidth 360 = clientWidth`）。vitest：taken 无 `expiresAt` → 含 `data-expiry="unknown"` + 「到期日待查」+ tooltip 文案；有 `expiresAt` → 不含；available/unknown → 不含；en「expiry pending」。

## 3. P3-3 批量进度末帧「核验中 20/20」

### 3.1 现状证据（[验证]，生产 20 域名批量，MutationObserver 记录 `[role=status]` 文案 / `aria-valuenow` / spinner）

```
… Checking 18/20 (now=18, spinner) t=4047ms
  Checking 19/20 (now=19, spinner) t=4129ms
  Checking 20/20 (now=20, spinner) t=4197ms   ← 末条 chunk 到达
  Done 20/20     (now=20, ✓)       t=4459ms   ← 流结束 finally
```

「核验中 20/20」帧持续 262ms（服务端写完最后一行到关闭流的间隔），肉眼可见。

### 3.2 根因（[源码]，`advanced-page.tsx` @ f985459）

- 状态两份：`const [running, setRunning] = useState(false)` 与 `const [progress, setProgress] = useState<BulkProgress|null>`。
- L115–118：每个 NDJSON chunk → `setProgress(prev => ({…prev, done: prev.done + rs.length}))`；L125–127：`finally { setRunning(false) }` 在 `reader.read()` 返回 `done:true` 之后才执行。
- L217–218：`{running ? <Loader2/> : <Check/>} {bulkProgressLabel(progress, running, t)}` —— 文案/图标由 `running` 决定，`done === total` 时不会切换，必须等第二次 render。
- 这不是 `done < total` 判定的问题（`bulkProgressLabel` 根本不比较 done/total），而是「完成」这个事实由与进度无关的 `running` 表达。

### 3.3 方案 → 验证

- `BulkProgress` 增加 `finished: boolean` 作为进度区唯一完成源；纯函数：
  - `startBulkProgress(total?)` → `{done:0,total,finished:false}`；
  - `advanceBulkProgress(prev, received)` → `done += received; finished = total !== undefined && done >= total`（凑齐 total 的那次 `setProgress` 同一 render 直接完成）；
  - `finishBulkProgress(prev)`：流结束时对未完成进度（未知 total 的组合器路径、服务端提前断流）补置 `finished`；已完成的返回同一引用不触发多余 render。
- `finally` 里 `setProgress(finishBulkProgress); setRunning(false)`，并加 `abortRef.current === ac` 守卫：被新一轮 `run()` abort 的旧请求不再把新一轮的状态写成已完成（既有代码中旧请求的 `finally` 会晚于新请求的 `setRunning(true)` 执行，[推断] 目前因按钮在 running 期间 disabled 而未触发，守卫是防御性的）。
- 进度区只读 `progress.finished`：`{progress.finished ? <Check/> : <Loader2/>} {bulkProgressLabel(progress, !progress.finished, t)}`。`running` 继续只管按钮 disabled/文案。`bulkProgressLabel` 签名不变（参数收窄为 `Pick<BulkProgress,"done"|"total">`），R566 既有测试原样通过。
- 验证（本地 mock 服务端按 `[3,1,1,1,5,4,3,2]` 不均匀 chunk、每 chunk 120ms、末行后 150ms 再关流，刻意放大原缺陷窗口）：zh/en 各 9 帧 `核验中 0/20 → 3 → 4 → 5 → 6 → 11 → 15 → 18 → 已完成 20/20`，正则 `(核验中|Checking) (\d+)/\2$` 命中 **0 帧**，末帧 `aria-valuenow=20` 且无 spinner；组合器（未知 total）路径 `已核验 0/3/4/5/6 个 → 已完成，共核验 6 个`。vitest：进度序列/引用稳定/未知 total/源码守门（进度区不再出现 `{running ?`）。

## 4. P3-4 `/monitors` 已配置只读态 36px

### 4.1 现状证据（[验证]，webhook 只写 localStorage `domainhunter:monitor-webhook`，无监控条目 → 不触发服务端写入）

| 视口 | 状态 | 控件高度 |
|---|---|---|
| 1280 | 已配置只读 | 发送测试 36 · 修改 36 · 清除 36（`sm:h-9`） |
| 1280 | 编辑 | 输入框 40 · 保存 40 · 发送测试 40 · 取消 40（`sm:h-10`） |
| 375 | 两态 | 全部 44 |

截图：`p3-4-monitors-configured-{375,1280}.png`、`p3-4-monitors-edit-{375,1280}.png`。同一卡片点「修改」时按钮行 36→40 跳高 4px。

### 4.2 设计 token 核查（[源码]）

- 仓库没有独立设计 token 文件；尺寸约定散落在 `ui/button.tsx`（`size.default = h-9` 36px、`sm = h-8`、`lg = h-12`、`icon = h-9 w-9`）与 `ui/input.tsx`（`h-10` 40px）。
- 站内惯例（`grep sm:h-9|sm:h-10 src/components/*.tsx`）：与 `Input` 同行的控件一律 `sm:h-10`（`/monitors` 直接添加表单 R557、通知卡片编辑态 R565、`/advanced` 输入 R566）；独立动作按钮 `sm:h-9`（`/monitors`「立即刷新状态」、监控行「取消」）。
- R565 `cbfe34f` 引入 `BTN_SECONDARY … sm:h-9`，但**同一 commit** 编辑态两处调用 `cn(BTN_SECONDARY, "sm:h-10")` 覆盖为 40 —— 说明作者已判定该卡片按钮应与输入框等高，只是只读态漏改；R565 无 research 文档，commit 信息未提 36。R571 报告写的「`sm:h-9` 既有设计」是 QA 事后对代码现状的描述，非设计依据。
- **判定**：36 无 token/文档依据；只读态与编辑态在同一位置切换，等高才不跳动 → 采纳任务方案 `sm:h-10`。「立即刷新状态」/监控行「取消」不在通知卡片内、不参与切换，保持 36 不动。

### 4.3 方案 → 验证

- `BTN_SECONDARY` 尾部 `sm:h-9 → sm:h-10`，编辑态两处 `cn(BTN_SECONDARY, "sm:h-10")` 退回 `BTN_SECONDARY`；只读态「清除」按钮 `sm:h-9 → sm:h-10`。移动 `h-11` 不变。
- 验证：本地 1280 只读态 40/40/40，编辑态 40×4；375 两态全 44；Tab 7（375）/8（1280）次到「修改」，Enter 进入编辑态；无水平溢出。vitest：`monitor-webhook.test.ts` 既有 R571 输入框守门原样通过；新增守门：`BTN_SECONDARY` 含 `h-11`+`sm:h-10` 不含 `sm:h-9`、无 `cn(BTN_SECONDARY, "sm:h-10")` 叠加、清除按钮 `sm:h-10`、整个 `NotifyCard` 源码段无 `sm:h-9`。

## 5. 验证矩阵（本地，dist 构建 + `~/r574/local_server.mjs` 确定性 mock，0 网络 0 AI）

| 项 | 375 浅/深 | 1280 浅/深 | 键盘 | 溢出 |
|---|---|---|---|---|
| P3-1 结果页 taken 行按钮 | 30×44 图标（span `none`），aria/title ✓ | 78×32 图标+「重新核验」（span `block`） | Tab ×9 / ×11 到达，focus ring 可见 | `sw 360 = cw 360`（经典滚动条 15px，非溢出）/ 1265 |
| P3-2 `/advanced` + 结果页 chip | chip 存在（既有 shrink 布局下 0 宽，与 ExpiryNote 同） | 「到期日待查」50px + tooltip | — | 同上 |
| P3-3 20 域名 | — | zh/en 9 帧无「核验中 N/N」，末帧 ✓ 20/20；组合器路径正确 | — | — |
| P3-4 `/monitors` | 只读 44×3 · 编辑 44×4 | 只读 40×3 · 编辑 40×4 | Tab ×7 / ×8 到「修改」 | 无 |

本地验收命令：`pnpm -r typecheck` ✓ · `pnpm --filter web test` ✓（53 文件 / 567 用例全绿，含本轮新增 12 条）· `pnpm --filter web build` ✓ · `node scripts/check-content-counts.mjs` ✓。

## 6. 范围外待办（本轮只记录，不改）

1. `apps/web/src/components/home-page.tsx` 两处首页 quick-check chip `<RecheckButton variant="chip" withLabel={false} …>`：若要首页 ≥sm 也显示「重新核验」文字，去掉 `withLabel={false}`（1 行 ×2）；同文件的 `expiresAt` fallback `<i data-expiry="unknown">` 可改为复用本轮导出的 `ExpiryUnknownChip`，消灭最后一处重复 markup。
2. `advanced-page.tsx` 既有的「旧请求 `finally` 晚于新请求 `setRunning(true)`」竞态：本轮只在 `finally` 加了 `abortRef.current === ac` 守卫；`running` 本身是否也应改为按请求实例判定，留待有复现场景再议（当前按钮 disabled 使其不可触发）。
3. `.agents/skills/testing-domainhunter/SKILL.md` R570–R571 节写着「read-only 修改/清除 are 36px (`sm:h-9`, by design)」，本 PR 合并后应改为 40px（skill 文件不在本轮范围）。
4. 375 下 `DomainRow` taken 行的到期文本/待查 chip 被 `shrink` 压到 0 宽（既有行为，生产 google.com `expires 2028-09-14` 同样不可见）：如需 375 也可见，需重排 taken 行（域名 `min-w-16 truncate` 与 CTA 争宽），属 UX 决策，另立 P3。
