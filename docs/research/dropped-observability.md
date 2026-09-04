# 被丢弃候选的可观测性调研（R500）

日期：2026-09-04 · 分支基线 `deploy/r192-r195`（0565741）· 本轮 **0 次生产 AI 调用**，全部离线（mock fetch / esbuild 打包 `apps/web/src/ai.ts` 回放）。
复现脚本：`node scripts/replay-r500-en-incoherent.mjs`（论证表）、`pnpm --filter web exec vitest run src/ai-dropped-samples.test.ts`（通道行为）。

标注约定：**[验证]** = 有一手材料（PR 描述 / 代码 / 脚本可离线复现）；**[推断]** = 基于代码阅读或人工判断，未做生产实测。

## 1. 问题

R496–R499 生产复验（`docs/audits/r496-r499/ai-search-03-en.ndjson`）en 首搜 `meaningIncoherent` 丢弃 22/36，而 R494 en 为 5/17 [验证，NDJSON guard 计数]。父会话推断被丢弃者是「X + Y: …」缺尾句谓语的忠实候选（误杀），但 guard 只出计数不出内容，**无直接证据**。本文回答两个问题：

1. 当年为什么被丢弃候选的内容不出流？理由是安全/隐私还是 UI 噪音？
2. 如何在不破坏原始理由的前提下补一条**审计专用、默认关闭**的样本通道。

## 2. 历史理由（SOP-02 调研）

### 2.1 R238（PR #202，guard 可观测性）[验证]

PR 描述原文：

> **只计数，不含任何被丢弃候选的内容或用户数据；均为新增字段，旧前端/旧快照天然兼容。**

代码注释（`ai.ts` `GuardStats` 定义处）：

> 只计数、不含被丢弃候选的任何内容（label/meaning 一概不带），不含用户数据。

R238 的目标是「直证防线拦截了多少坏例、补发/重试是否触发」，即证明防线**有在工作**，不是为了诊断防线**是否误杀**。描述里把「不含内容」与「不含用户数据」并列、并强调「旧前端/旧快照天然兼容」，可读出三个动机：

| 动机 | 证据 | 判定 |
| --- | --- | --- |
| 内容最小化 / 不泄漏 LLM 原文（被拦下的正是「不该给用户看」的文本：沙拉、臆造词源、元语言） | PR 描述 + 代码注释都把 label/meaning 明确排除 | **[验证] 主要理由** |
| 不带用户数据（description 等）进元数据 | 描述原文「不含用户数据」 | [验证] |
| 响应体积 / 旧客户端兼容 | 「均为新增字段，旧前端/旧快照天然兼容」 | [验证] 次要理由 |
| UI 噪音 | 前端只渲染「本轮过滤 N 个低质候选」一行合计，从未读过具体内容 | [推断] 不是当初的决策理由，只是结果 |

没有任何材料提到「安全漏洞」或「合规」；理由是**内容最小化**（不把模型产出的坏文本再送回客户端），而非狭义安全。

### 2.2 R239 审计 → R245（PR #211）：第一次因「看不到内容」被迫推断 [验证]

`docs/qa/audit-r239.md` P2-2 原文：

> 推断（**guard 只计数不留内容，无法直接确认**）：偏拼音需求诱发模型在 meaning 里写带声调拼音 … → 合法内容被整轮误杀 … 建议 zh 白名单纳入 … **或 charsetViolation 时保留首个坏例样本入 guard**

R245 的取舍（PR #211 描述）：

> `GuardStats` 新增可选 `charsetSample` … 记录首个违规字符码点（如 `"U+CF54"`），**只留码点不留候选文本，避免内容泄漏**。

即：一年前遇到同样的「防线整轮误杀 vs 只能推断」时，选择了**最小披露**（一个码点）而不是样本文本，再次确认原始理由是「避免内容泄漏」。charsetViolation 只需一个码点就能定位规则问题；`meaningIncoherent` 是整句语义判断，一个码点级的替代物不存在——这就是本轮需要文本样本的原因。

### 2.3 R223 / R246（EN 沙拉防线）[验证]

- R223（284bf51）：`enMeaningIncoherent` 词源锚点排除英文停用词 label 片段，修 R218 P2-2 **穿透**用例 `besowith`（refine 轮实测放行的沙拉）。`scripts/verify-r223.mjs` 夹具：坏例 5（besowith/monthat/velfrom/stovery/theora，全部来自生产穿透或同型造例），好例 5（R218 ref1 正常输出 + R196 好例）。
- R246（d011e0e）：前缀锤点收紧（公共前缀 ≥4，恰为 3 需引号/语言名语境），修 R239 ref1 **穿透**坏例 `ancryst/oparior/lintow`。`scripts/verify-r246.mjs` 夹具：坏例 3，好例 6。
- R196（`scripts/verify-r196.mjs`）：坏例 2（allur/privar），好例 5。

**关键不对称**：三代 EN 沙拉防线的全部坏例夹具都来自「**放行了的**坏候选」（用户/审计能在结果里看见），而「**被拦下的好候选**」从来不可见，因此规则演化只有「收紧」方向的证据，从未有过「误杀」方向的一手样本。R496–R499 的 22/36 是第一次从计数上怀疑误杀，但受 R238 设计所限仍只能推断。这正是本轮要补的洞。

### 2.4 结论

「不泄漏被丢弃内容」的原始理由 = **内容最小化 / 不泄漏 LLM 坏文本 + 不带用户数据 + 兼容旧客户端** [验证]；不是 UI 噪音（UI 从未消费过内容）[推断]。这个理由对**默认路径**依然成立，因此新通道必须：默认关闭且默认字节不变、显式 opt-in、限额、不落任何存储。

## 3. 通道设计（R500 实现）

### 3.1 方案选择

| 方案 | 优点 | 缺点 | 取舍 |
| --- | --- | --- | --- |
| A. 请求体 `debugDropped: true`（**选用**） | 与现有 `fast`/`lang` 同一解析路径，`=== true` 严格判定；`.ndjson` 审计的 `_request` 行天然记录开关；前端从不发送即默认关 | 任何拿到 URL 的人都能开 | 见 3.3 |
| B. 请求头 `X-DH-Debug` | 与业务字段隔离 | 审计 NDJSON 不记录请求头，取证时开关不可见；curl 多一个参数，父会话操作面更大 | 不选 |
| C. 仅 `fast:false` 才允许 | 减少来源 | 生产问题恰恰出在 `fast:true` 首搜（ai-search-03-en 的 `_request`），限制后取不到同型样本 | 不选 |
| D. 环境变量总开关 + A | 生产可整体关闭 | 需要额外部署一次 wrangler 变量；本轮不部署，先不加 | 留作 R50x 可选 |

### 3.2 数据面 [验证：vitest 8 条 + typecheck]

```ts
// ai.ts
export interface DroppedSample { reason: keyof GuardDropCounts; label: string; meaning: string; theme: string; supplement?: true }
export const DROPPED_SAMPLE_PER_REASON = 5;   // 每轮每 reason ≤5
export const DROPPED_SAMPLE_TOTAL = 20;       // 每轮 ≤20
export const DROPPED_SAMPLE_MEANING_MAX = 160; // 按码点截断，超出加 "…"
newGuardStats({ debugDropped?: boolean })      // 仅 === true 时初始化 droppedSamples: []
recordDroppedSample(guard, sample)             // 未初始化则 no-op
// worker.ts
const debugDropped = body.debugDropped === true;
const guard = newGuardStats({ debugDropped });  // 随既有 proposed/error 事件的 guard 字段出流
```

采样点 = `admitCandidate` 的唯一拒绝出口 `reject(reason, meaning)`（覆盖 invalidLabel…enPinyinRoute 全部 reason）+ `generateOnce` 的 dislikedMorphology 硬过滤；补发轮样本带 `supplement: true`。样本 `label` 用归一后的 label；`meaning` 在 invalidLabel/brandCollision/emptyMeaning 三个早期出口用模型原文，其余出口用 `cleanMeaning`（+ zh 声调剥离）后的文本——即**防线实际判定的输入**，审计可直接对该文本重放 `enMeaningIncoherent`；`theme` 用模型自标 theme（归一前，`themeNormalized` 计数不受影响）。

### 3.3 默认关闭证明 [验证]

- `newGuardStats()` / `newGuardStats({})` / `{debugDropped:false}` / `{debugDropped:"true"}` 序列化结果与基线 0565741 的 `newGuardStats()` **逐字节相同**（vitest 内嵌基线 JSON 字面量，字段顺序/数量一致）；`"droppedSamples" in guard === false`。
- 默认 guard 走完带丢弃的整轮生成后 `JSON.stringify(guard)` 不含 `droppedSamples`；`recordDroppedSample` 在未开启时 no-op。
- 前端 `App.tsx` 不含字符串 `debugDropped`（永不发送）；`lib/persist.ts` 不含 `guard`（`SavedSearch` 只存 UI 状态，`dh:lastSearch:v1` 快照结构上不可能含 `droppedSamples`；vitest 端到端 `saveSearch` 后 localStorage 断言）。
- KV：`worker.ts` 中所有 `kv.put` 调用（统计计数 / 熔断 / 限流 / RDAP 缓存 / 监控 / 分享 / 同步 / IndexNow / 百度）均不写 guard；guard 只在 `emit()` 进 NDJSON 流 [验证，代码阅读 `rg "kv.put" worker.ts`]。

### 3.4 是否需要限制来源

结论：**本轮不加 `fast:false` 或请求头门槛** [推断，理由如下]：

1. 披露物是 LLM 对用户自己的 description 产出的文本，接收方就是发出该 description 的同一请求方——不涉及跨用户数据；R238 担心的「不该给用户看的坏文本」在显式 opt-in 下变成「审计者要看的证据」。
2. 已有限流（`/api/ai-search` 每 IP 小时配额 + LLM 熔断）同样约束开启 debug 的请求，不增加 LLM 调用量，只增加响应体 ≤20×(160+label+theme) ≈ 4 KB。
3. 生产问题出在 `fast:true` 首搜，`fast:false` 门槛会让父会话取不到同型样本。
4. 前端不渲染、不落快照、不写 KV，开关只在请求体中且严格 `=== true`，误开成本为零。

若后续要长期保留而非一次性取样，建议 R50x 加 wrangler 变量 `AI_DEBUG_DROPPED=0/1` 总开关（方案 D），可在不发版的情况下关闭。

## 4. 离线论证：现规则 vs「忠实 X + Y: 对计为谓语」

脚本：`node scripts/replay-r500-en-incoherent.mjs`。数据集：

- **fixtures**：`scripts/verify-r196/r223/r246.mjs` 全部 EN 标注用例 26 条（坏 10 / 好 16），逐条原样回放；`verify-r498.mjs` 无 `enMeaningIncoherent` 标注（其候选 meaning 全为占位 `"m"`，测的是 word 补发门槛），无可回放项 [验证]。
- **survivors**：`docs/audits/r494/ai-search-05.ndjson` + `docs/audits/r496-r499/ai-search-03-en.ndjson` 全部 24 条 en `proposed` 候选（生产放行 = 标注为好例）。
- **constructed-faithful**：人工构造 14 条「X + Y: …」缺尾句谓语的忠实 meaning（X、Y 均为 label 子串，且描述与两词一致），标注为好例。
- **constructed-salad+pair**：人工构造 5 条「沙拉 + 忠实 X + Y: 前缀」，标注为坏例（用来测假设规则的代价）。
- **constructed-phantom-pair**：3 条 X/Y 不是 label 子串的对（不计入 P/R，只看更前面的 `citesPhantomWord` 是否已拦）。

假设规则（**仅在脚本里模拟，`EN_PREDICATE_RE` 未改**）：`hypo = current && !faithfulPairColon(label, meaning)`，其中 `faithfulPairColon` = `EN_PAIR_COLON_RE` 命中且两词均为 label 子串。

### 4.1 汇总（正类 = incoherent/拦截）

| set | rule | TP | FP | FN | TN | precision | recall |
|---|---|---|---|---|---|---|---|
| fixtures only (r196+r223+r246) | current | 10 | 0 | 0 | 16 | 100.0% | 100.0% |
| fixtures only (r196+r223+r246) | hypothetical | 10 | 0 | 0 | 16 | 100.0% | 100.0% |
| fixtures + NDJSON survivors | current | 10 | 0 | 0 | 40 | 100.0% | 100.0% |
| fixtures + NDJSON survivors | hypothetical | 10 | 0 | 0 | 40 | 100.0% | 100.0% |
| fixtures + survivors + constructed-faithful | current | 10 | **13** | 0 | 41 | **43.5%** | 100.0% |
| fixtures + survivors + constructed-faithful | hypothetical | 10 | 1 | 0 | 53 | 90.9% | 100.0% |
| all labeled (incl. constructed-salad+pair) | current | 15 | 13 | 0 | 41 | 53.6% | 100.0% |
| all labeled (incl. constructed-salad+pair) | hypothetical | 11 | 1 | **4** | 53 | 91.7% | **73.3%** |

### 4.2 读数

1. **现规则对历史夹具 + 生产存活候选零误判**（fixtures+survivors 26+24 条 P=R=100%）——假设规则在这 50 条上也不改变任何判定，即改规则**不会让任何已知坏例穿透、也不会拦任何已知好例** [验证]。
2. **现规则对 14 条构造的忠实「X + Y: …」缺尾句 meaning 判 13 条 incoherent**（唯一放行的 calmroot 是因为描述里恰好有 "from"）[验证]。这与父会话「存活 12 条 blend 的谓语命中多数只靠尾句」的观察一致：24 条 survivors 中 13 条的 `EN_PREDICATE_RE` 命中只出现在 `;`/`—` 之后的尾句 [验证]。→ **若生产被丢弃候选确为此句式，现规则的误杀机制在离线上是成立的**；但被丢弃候选本身是什么，仍未验证 [推断待证]。
3. **假设规则的代价**：把「忠实 X + Y: 对」当谓语，会放行「前缀忠实 + 后文沙拉」的构造坏例 4/5（recall 100% → 73.3%）。这类样本目前**没有生产实例**（三代夹具的沙拉坏例都没有 X + Y: 前缀），是理论风险，需要生产样本判断出现概率 [推断]。
4. **上游防线**：X/Y 非 label 子串的臆造对 3 条中 2 条已被 `citesPhantomWord` 在 `enMeaningIncoherent` 之前拦下（`logfixe` 因 "fix + log" 的 fix、log 都是子串而漏到本层）；假设规则限定两词均为 label 子串，与 R497 已验证的忠实判定同源，不引入新的臆造放行面 [验证]。

### 4.3 对 R50x 的建议（不在本轮执行）

- 拿到 ≥1 次生产 `droppedSamples` 后，先统计 `meaningIncoherent` 样本中「`EN_PAIR_COLON_RE` 命中且两词为 label 子串」的占比；若 ≥ 半数，误杀假设成立，再考虑把 `faithfulPairColon` 作为谓语的**补充**（不是替代）；同时应要求冒号后至少 N 个词与 X/Y 或 label 相关，以压回 4.1 表中 4 条 salad+pair 的放行。
- 若占比很低，说明丢弃主因不是句式，转向检查 R499 theme 归一/其它防线与 R496–R499 提示词变化的交互。

## 5. 给父会话的「1 次生产 AI 取样」请求体

复用 `docs/audits/r496-r499/ai-search-03-en.ndjson` 第一行 `_request`，只加 `debugDropped: true`（本子会话**未**发出该请求）：

```json
{
  "description": "A developer tool that turns messy git history into clean, reviewable release notes. Should feel trustworthy, fast, and a little playful. Short, brandable, easy to say.",
  "tlds": ["com", "dev", "io"],
  "style": "",
  "lengthPref": "",
  "lang": "en",
  "target": 10,
  "excludeLabels": [],
  "disliked": [],
  "fast": true,
  "debugDropped": true
}
```

期待：`proposed`（items 为空的汇总条）与 `error` 事件的 `guard.droppedSamples` 出现 ≤20 条样本，其中 `reason:"meaningIncoherent"` ≤5 条/轮；把 NDJSON 存到 `docs/audits/r50x/`，用 `scripts/replay-r500-en-incoherent.mjs` 的 `faithfulPairColon` 对样本逐条打标。

## 6. 本轮验证 / 未验证清单

- [验证] `pnpm -r typecheck`、`pnpm --filter web test`（19 files / 197 tests，含新增 8 条）、`pnpm --filter web build` 全绿。
- [验证] `node scripts/verify-r196/r223/r238/r243/r246/r496/r497/r498/r499.mjs` 全 PASS（R238/R243 的 guard 序列化/计数语义未变）。
- [验证] `node scripts/replay-r500-en-incoherent.mjs` 输出 §4 表格，可复现。
- [未验证] 生产 `/api/ai-search` 带 `debugDropped:true` 的真实响应（本轮 0 生产 AI 调用，留给父会话）。
- [推断] 被丢弃的 22/36 是缺尾句谓语的忠实「X + Y: …」候选——离线机制成立，但生产实证缺失，**因此本轮未改 `EN_PREDICATE_RE`**。
