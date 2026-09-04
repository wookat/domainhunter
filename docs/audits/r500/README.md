# R500 生产取样：`meaningIncoherent` 被丢弃候选直证（1 次授权 AI）

- 部署：`deploy/r192-r195` @ c8bae5f（合入 PR #463），生产 version `e0ead604-586f-47b8-aa6e-9a00dbb09abf`，2026-09-04 ~23:54Z
- 请求：`ai-search-01-en-debugDropped.ndjson` 首行 `_request`（= R496–R499 `ai-search-03-en` 同一 description，`fast:true`，`debugDropped:true`），HTTP 200，端到端 46.8s，`done.availableCount=31`
- usage 核销（`usage-00-baseline.json` → `usage-01-after.json`，间隔 ≥60s）：`searches` 19→20、`fast` 16→17、`refine` 3→3、`llmProvider.primary` 20→22、`aiErrors` 不变（rate-limit 4 / quota 3 为当日历史值）
- 通道行为：默认关闭字节级不变由 vitest 断言；本次开启后 round 1 / round 2 汇总 `proposed` 事件各带 `guard.droppedSamples`（6 + 7 条），补发轮样本带 `supplement:true`；round 2 `meaningIncoherent` 主轮 4 + 补发 3 = 7 > 每轮每 reason 上限 5，故只留 5 条（补发 2 条未采到）——上限行为与设计一致

## `meaningIncoherent` 样本逐条回放（`enMeaningIncoherent` 真实实现，本地 esbuild 打包）

`fragmentOk` = 强制补一个谓语后是否仍被拦（隔离片段检查）；`predicateOk` = `EN_PREDICATE_RE.test(meaning)`；`faithfulPairColon` = R497 同款 `X + Y:` 对且两词均为 label 子串。

| label | round | theme | 补发 | fragmentOk | predicateOk | faithfulPairColon | 人工判定 | 拦截原因 |
|---|---|---|---|---|---|---|---|---|
| bushtit | 1 | word | | ✗ | ✓ | ✗ | 忠实（真词，解释鸟名与「整理」联想） | 片段：word 路线 meaning 描述词义而不复述 label |
| riffolio | 1 | blend | | ✓ | ✗ | ✓ | 忠实（riff + folio 均为 label 子串） | 谓语：「X + Y:」句式无谓语词 |
| logsmith | 2 | blend | | ✓ | ✗ | ✗ | 忠实（logs + smith，「forged / like a blacksmith」） | 谓语：forged / like 不在 `EN_PREDICATE_RE` |
| vireo | 2 | word | | ✗ | ✓ | ✗ | 忠实（真词，鸟名） | 片段：同 bushtit |
| changelogist | 2 | coined | | ✓ | ✗ | ✗ | 忠实（changelog + -ist，「evoking」） | 谓语：`evokes?` 不匹配 **evoking** |
| tessellate | 2 | word | | ✗ | ✓ | ✗ | 忠实（真词，「fit shapes together without gaps」） | 片段：同 bushtit |
| chronicle | 2 | word | ✓ | ✗ | ✓ | ✗ | 忠实（真词，「factual written account」） | 片段：同 bushtit |

**读数（验证）**：本次取样到的 7 条 `meaningIncoherent` 丢弃样本，人工逐条读 **7/7 为忠实解释（0 条沙拉）**，即该防线在本样本上精确率 0/7。分三类：

1. **word 路线不复述 label（4/7）**：模型按「A real English word: …」解释词义时不重复 label 本身，片段检查（label 或 ≥4 字子串出现在 meaning 中）必然失败。R196 的 word 好例 `anvil` 之所以通过是因为 meaning 里写了「the blacksmith's anvil」。这一类与 R498 补发直接冲突——补发专为 word 路线，而 word 路线 meaning 最容易被片段检查误杀（本次补发 3 丢 3；R496–R499 补发 4 丢 3）。
2. **谓语词表覆盖缺口（2/7）**：`evoking`（词表只收 `evokes?`）、`forged`/`like a blacksmith`（不在词表）。
3. **「X + Y:」句式缺谓语（1/7）**：即 R496–R499 时的推断——成立但只占 1/7，**不是主因**。

**推断**：R496–R499 en 首搜 22/36 的高丢弃率主要由第 1、2 类构成，而非当时推断的第 3 类；`riffolio` 那类 `faithfulPairColon` 放行只能挽回一小部分。

## 其他 reason 的样本（顺带观察，未逐条回放）

- `metaLanguage` 4 条：gitloom「A portmanteau of git and loom …」、imumi「A coined diminutive …」、reflint「Refine with flint …」、clearbrew「Clear as understandable plus brew …」。前两条含 portmanteau/coined 元语言词属 R183 设计内；后两条 meaning 看不出元语言泄漏，**疑似 metaLanguage 误杀**（未回放定位命中词，待 R50x 一并核）。
- `phantomEtymology` 1 条：squashd「Squash + the 'd' of done」——R497 设计内（squash 是子串但 done 不是，且句式为 X + Y 幻影）。
- `brandCollision` 1 条（补发）：loom——设计内。

## 下一步（R50x，先论证再改）

- 不改 `EN_PREDICATE_RE` 单点，而是按上表三类分别论证：① word 路线的片段检查是否应改为「meaning 含 `real (English )?word` 类声明 + 词义谓语」即放行，或改为对 word 路线跳过片段检查（需用 r196/r223/r246 坏例集验证不放行沙拉）；② 谓语词表补齐词形（evok(?:e|es|ed|ing)、forg(?:e|es|ed|ing)、like a …）；③ `faithfulPairColon` 计为谓语（R500 离线已算：构造集精确率 43.5%→90.9%，代价「忠实前缀 + 沙拉后文」放行 4/5）。
- 每项都要在 `scripts/replay-r500-en-incoherent.mjs` 的标注集 + 本目录 7 条生产样本 + 历史 NDJSON 存活候选上给 P/R，再决定。
- 本目录样本 7 条仍是小样本；如需扩大再取 1–2 次 `debugDropped` 生产样本（每次 1 次 AI 预算）。
