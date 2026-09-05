# EN word 路线补发门槛重定（R498，修 R494 审计 P2-3）

> 结论先行：把 `needsWordSupplement` 的「候选 ≥8 且 word=0」改为「候选 ≥3 且 word < max(2, ⌈候选×15%⌉)」，
> 保留 R243 单轮 ≤2 次补发，并新增**每次搜索跨轮共享的补发预算 2 次**。历史 8 轮 EN 数据模拟：
> 旧策略触发 3/8 轮、新策略触发 7/8 轮；每次搜索额外 LLM 调用上限由旧策略理论 10 次降为 2 次，
> 典型值由 0–2 次变为 1–2 次。全部用离线回放 + mock 验证，本轮 0 次生产 AI 调用。

标注约定：**[验证]** = 本轮亲手跑过 / 从一手数据读出；**[推断]** = 由代码或数据推导；**[未验证]** = 需生产复验。

## 1. 现状与门槛由来

### 1.1 代码事实 [验证]

`apps/web/src/ai.ts`（基线 `deploy/r192-r195` tip 437eca8）：

```ts
export const EN_WORD_QUOTA_MIN_CANDIDATES = 8;
export function needsWordSupplement(candidates: AiCandidate[]): boolean {
  return candidates.length >= EN_WORD_QUOTA_MIN_CANDIDATES && countThemes(candidates).word === 0;
}
// generateAiCandidates：
if ((opts.lang ?? "zh") === "en" && needsWordSupplement(out)) {
  guard.wordSupplement = true;
  for (attempt = 1..EN_WORD_SUPPLEMENT_MAX_ATTEMPTS /* 2 */) { … 补发 4 条 …; if (word > 0) break; }
}
```

- 判定对象 `out` 是**主轮经全部防线过滤后保留的候选**（R466 流式亦然），不是 LLM 原始产出。
- `worker.ts`：fast 模式首轮 `count = FAST_FIRST_ROUND_COUNT = 8`，其余轮 24；每轮 `newGuardStats()`，每次搜索最多 `MAX_ROUNDS = 5` 轮。
- zh 路线有独立的 `needsPinyinSupplement`（R463，门槛同为 ≥8），与 word 补发互不相干。

### 1.2 ≥8 门槛的历史原因 [验证：R224 源码注释 + PR #190 / R243 PR #212 描述]

R224 注释原文：「触发补发的最小候选数：整轮产出太少时（如流截断）word=0 属于正常波动，不补发」；
段首注释：「仅在配额失守时触发，正常路径 0 额外成本」。即两个目的：

1. **防小批次误触发**：R197 时代坏 JSON 截断恢复后可能只剩几条候选，word=0 不代表 LLM 忽视了路线；
2. **控制额外 LLM 调用**：补发是额外一次 `generateOnce`，希望只在「确定失守」时花钱。

R224 落地时 EN 只有非 fast 的 24 条/轮（fast 模式与 8 条首轮是 R466 之后的事），
「≥8」相对 24 条是 1/3 存活率兜底，合理。**[推断]** R466 引入 fast 首轮 8 条后，`≥8` 意味着首轮必须 0 丢弃才可能触发，
门槛事实上在 fast 首轮失效——R494 审计证实了这一点（下节）。

R243（PR #212）在 ≥8 场景下做了生产直证（补发 2 次、二次加硬、`supplementDropped` 独立计数），未触及门槛本身。

## 2. 历史 EN 数据：每轮候选数 / word 数分布

### 2.1 R494 一手数据 [验证：`docs/audits/r494/ai-search-05.ndjson` 逐行解析]

EN fast 首搜，描述 “Minimal habit tracker for remote teams … Prefer real English words or clean two-word combos.”（用户**明确要真实英文词**）：

| 轮 | 请求数 | 保留候选 | word | 其他 theme | 主轮丢弃 | guard.wordSupplement |
|---|---|---|---|---|---|---|
| R1 | 8 | **7** | **1**（anchor） | blend 4 / coined 2 | meaningIncoherent 1 | false |
| R2 | 24 | **5** | **0** | blend 3 / coined 2 | meaningIncoherent 4 | false |

两轮合计 12 条候选 / 1 条 word（8%）。R2 请求 24 条只保留 5 条 **[推断]** 说明 LLM 本身也只产出了少量候选（丢弃仅 4），
不是「流截断」。旧门槛下 R1 因 word=1 不触发、R2 因 5<8 不触发——**用户点名要英文词的任务，兜底机制两轮全部沉默**。

同批 zh 搜索（01–04、06）供参照：首轮保留 7 / 5 / 1 / 21 / 7 条，fast 首轮 <8 是常态（3/3 fast 首轮均 <8）。

### 2.2 历史审计报告数据 [验证：读报告原文；轮级拆分处为推断]

| 来源 | 轮次 | 候选 | word | 备注 |
|---|---|---|---|---|
| R218 `docs/qa/ai-audit-r218.md` | en1 首搜合计 | 18 | 6 | 达标 |
| R218 | en2 首搜合计 | 31 | 0 | 「word 路线归零」→ 催生 R224 |
| R239 `docs/qa/audit-r239.md` | en1 r2 | 20 | 0 | blend 19/20；补发触发但全灭（P1-1）|
| R239 | en2 r1 | 3 | 1 | 「仅 3/8 存活」，唯一 word = watchful |
| R239 | en2 r2 | ≈13 | 0 | 合计 16/1 减去 r1；补发触发但全灭 |
| R239 | ref1 | 8 | 1 | nundina 标 word（标注存疑）|
| R494 | en r1 / r2 | 7 / 5 | 1 / 0 | 本轮问题 |

观察 **[推断]**：
- 有 word 的轮次里 word 数几乎都是 1（R239 en2 r1、ref1、R494 r1），「非空」靠单条撑着，与软配额「各至少 2 个」差一半；
- 候选数 <8 的轮次（R239 en2 r1、R494 r1/r2）占 3/8，全部是需要补发却被门槛挡住的场景；
- R239 P1-1 记录的「补发触发但全灭」是 prompt/防线问题，R243 已修（二次加硬 + 补发轮放宽 meaning 谓语锤点），本轮不重做。

## 3. 新策略论证

### 3.1 触发条件

```
n = 保留候选数, w = word 数
n < 3                         → 不触发（解析/流截断级失败，与 R224 原意一致）
w == 0                        → 触发，reason = "zero"
w < max(2, ⌈n × 15%⌉)         → 触发，reason = "low"
```

- **最小候选数 3**：R494 zh 搜索 03 首轮仅 1 条（charsetViolation 拦 2）是典型「整轮失败」，此时补 word 没有意义；
  n≥3 已能说明 LLM 正常在产出，word 为 0/1 是路线偏科而非产出失败。取 3 而非更高，是因为 fast 首轮保留 5–7 条是常态（§2.1）。
- **下限 2**：对应 `EN_NAMING_HINT` 软配额「各至少 2 个」及父会话验收口径「最终 word ≥2」。
- **15% 比例**：候选多时按占比要求，24 条主轮要 4 条 word（16.7%），避免 24 条里 2 条 word 就算达标。
  与任务书示例「word ≤ max(1, ⌈n×15%⌉)」的差别：示例在 n≥7 时 word=2 也触发，但 2 已满足「各至少 2 个」，再补属于多花一次 LLM 调用换边际收益，
  本文采「w < max(2, ⌈15%⌉)」即 w=2 不触发（n≤13）。
- floor 速查：n=3–13 → 2；14–20 → 3；21–26 → 4；27–33 → 5。

### 3.2 成本控制：单轮上限 + 跨轮预算

- 单轮：沿用 R243 `EN_WORD_SUPPLEMENT_MAX_ATTEMPTS = 2`（首次补发**没有任何 word 并入**才二次加硬重试；有并入即停，不追 floor）。
  任务书示例「补发失败即不再重试」与 R243 的二次加硬冲突，而 R243 的重试有 R239 P1-1 的生产依据（全灭源于 meaning 短句式被拦，二次加硬针对性解决），故保留。
- 跨轮：新增 `WordSupplementBudget { remaining: 2 }`，worker 每次搜索新建一个传入各轮；每次补发 `generateOnce` 扣 1，耗尽后判定命中只记 guard 不再调用。
  未传预算（历史脚本 / 旧调用方式）退化为仅受单轮上限约束，行为与 R243 一致。
- 选 2 而非 1：允许「首轮补发全灭 → 二次加硬」这条 R243 路径完整走完；也允许 R1、R2 各补 1 次（R494 场景）。

### 3.3 可观测性（guard）

- 保留 `wordSupplement`（是否实际发起补发）/ `supplementAttempts`（本轮实际次数）/ `supplementDropped`；
- 新增 `wordSupplementReason?: "zero" | "low"`：判定命中即写（无论是否有预算），审计可看到路线薄弱频率；
- 新增 `wordSupplementSkipped?: "budget"`：命中但预算耗尽。
- 前端 `types.ts GuardMeta` 同步加可选字段；旧快照无字段不受影响。

### 3.4 防线不绕过

补发轮仍走 `generateOnce` 全部防线（brandCollision / meaningIncoherent / TLD 内嵌降级……），`mergeWordSupplement` 只收 theme=word 且未重复的 label；
`wordMetaphor` 谓语锤点放宽仍限补发轮（R243 既有）。vitest 用例「补发轮候选不绕过防线」以词语沙拉 + 品牌撞名两条补发候选验证均被拦且计入 `supplementDropped`。

### 3.5 zh 路线

判定入口 `(opts.lang ?? "zh") === "en"` 不变；`needsPinyinSupplement` 及其门槛未改动。vitest / verify-r463 / verify-r238 zh 场景均 PASS。

## 4. 历史数据模拟：新旧策略触发率与额外调用 [验证：`scripts/verify-r498.mjs` §3 输出]

| 轮次 | 候选 | word | 旧门槛 | 新门槛 |
|---|---|---|---|---|
| R218 en1（首搜合计） | 18 | 6 | — | — |
| R218 en2（首搜合计） | 31 | 0 | 触发 | zero |
| R239 en1 r2 | 20 | 0 | 触发 | zero |
| R239 en2 r1 | 3 | 1 | — | low |
| R239 en2 r2 | 13 | 0 | 触发 | zero |
| R239 ref1 | 8 | 1 | — | low |
| R494 en r1 | 7 | 1 | — | low |
| R494 en r2 | 5 | 0 | — | zero |
| **触发轮数** | | | **3/8（38%）** | **7/8（88%）** |

### 4.1 额外 LLM 调用估算（每次搜索）

| | 旧策略 | 新策略 |
|---|---|---|
| 触发条件 | n≥8 且 w=0 | n≥3 且 w<max(2,⌈15%n⌉) |
| 单轮补发上限 | 2 | 2（不变） |
| 每次搜索上限 | 5 轮 × 2 = **10**（理论） | **2**（预算封顶） |
| R494 EN 场景实际 | 0 | 2（R1 low 1 次 + R2 zero 1 次）|
| R239 en1 场景 | 2（r2 全灭重试） | 2（r2 全灭重试；后续轮命中则 skipped）|
| R239 en2 场景 | 2（r2） | 2（r1 low 1 次 + r2 zero 1 次）|
| 补发请求体量 | 4 条候选 / 次 | 4 条候选 / 次（不变）|

**[推断]** EN 搜索占比与每日 EN 搜索量本轮未查（usage 数据在 KV，需生产读取），按 R494 usage 快照 EN 仅 1/6，
新策略对整体 LLM 调用量的增量 ≈ EN 搜索数 × ≤2 次 × 4 条候选，量级远小于主轮 24 条 × 多轮。

### 4.2 收益

- R494 场景（用户明确要英文词）：从 0 次补发 → 2 次补发，mock 回放最终 word 由 1 → ≥3（`verify-r498.mjs` §2）；
- 历史 3 轮「word=1 撑非空」的轮次全部纳入补发；
- 生产实际收益（补发存活率）**[未验证]**：R243 后再无 EN 生产直证，需父会话复验（§6）。

### 4.3 风险

- **[推断]** 每次搜索 EN 额外调用由「多为 0」变为「多为 1–2」，是有意为之的成本换质量；预算 2 是硬上限。
- 低质任务描述下 LLM 可能依旧产不出合格 word（R239 P1-1 形态），此时消耗 2 次预算无收益——guard 可观测，后续可据数据调预算。
- theme 标注不严（R239：nundina 标 word）会让判定「假达标」，属既有问题，不在本轮范围。

## 5. 验证清单 [验证]

- `apps/web/src/ai-word-supplement.test.ts`（vitest，21 用例）：floor 计算；5/0 → zero、7/1 → low、12/1 → low、12/3 不触发、12/2 不触发、<3 不触发；
  low 措辞；mock 端到端触发/不触发/全灭重试/防线不绕过/zh 不受影响；跨轮预算（已补发过一次 → 第二轮仍可补 1 次 → 第三轮 skipped=budget；单轮重试消耗预算；未命中不消耗）。
- `scripts/verify-r498.mjs`：ai-search-05.ndjson 两轮回放，旧谓词两轮不触发、新谓词 R1 low / R2 zero，mock 端到端 guard.wordSupplement:true、最终 word ≥2、总补发 = 2；历史 8 轮对照表。
- 历史脚本：verify-r196/r222/r223/r224/r225/r238/r243/r244/r245/r246/r247/r250/r264/r463/r465/r466/r471/r473/r474/r489 全 PASS。
  其中 **verify-r224 两条断言与 verify-r243 场景 4 的输入按新门槛更新**（8 条含 1 word → 8 条含 2 word；`EN_WORD_QUOTA_MIN_CANDIDATES` → `EN_WORD_SUPPLEMENT_MIN_CANDIDATES`），
  它们编码的正是本轮要改的旧语义，非掩盖问题，改动处有 R498 注释。
- 基线即失败、与本轮无关的脚本：verify-r267（需 wrangler dev 起本地服务，沙箱内起不来）、verify-meaning-paren / verify-pinyin（脚本自身 import 路径已失效，基线同样报错）。
- `pnpm -r typecheck` / `pnpm --filter web test` / `pnpm --filter web build` 全绿。

## 6. 生产复验建议 [未验证，交父会话]

≤1 次 EN 生产 AI 搜索（fast，描述可复用 R494 的 habit tracker 文案），期望：
- 至少一轮 `guard.wordSupplement:true` 且 `wordSupplementReason` 为 `low` 或 `zero`；
- `supplementAttempts` 合计 ≤2；
- 最终 proposed 候选中 theme=word ≥2；
- zh 搜索 guard 无 `wordSupplementReason` 字段。
若补发触发但 word 仍 <2，看 `supplementDropped` 定位是防线拦截（回到 R243 方向）还是 LLM 未产出 word（prompt 方向）。
