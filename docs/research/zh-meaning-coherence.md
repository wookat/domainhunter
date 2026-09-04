# zh 候选「寓意」词语沙拉的可观测特征与 fail-closed 防线论证（R496）

> 背景：R494 审计 P1-1（`docs/audits/ai-quality-audit-r494.md` §4.2 / §8）——zh 点踩 refine 轮（`docs/audits/r494/ai-search-04.ndjson`）7 条 coined 中 5 条寓意是整段胡话（moggity/miafbab/gurgulu/voralini/hapany），首轮 refine（`ai-search-03.ndjson`）出 `miaoround`。EN 侧有 `enMeaningIncoherent`（R196/R223/R246），zh 侧没有对应物，沙拉 100% 上线。
> 本文按 SOP-02 调研先行：取样 → 人工标注 → 特征统计 → 多方案 P/R 对比 → 选定方案与 fail-closed 边界。**全程 0 次 AI 调用**，全部数据来自仓库内留档。
> 复现：`node scripts/build-zh-meaning-labels.mjs && node scripts/research/zh-meaning-features.mjs`。

## 1. 取样与标注（[验证]）

标注集：`scripts/fixtures/zh-meaning-labels.json`（193 条，构建脚本 `scripts/build-zh-meaning-labels.mjs`，标注只在脚本里维护，重跑即复现）。

| 来源 | 条数 | 说明 |
|---|---|---|
| `docs/audits/r494/ai-search-01/02/03/04/06.ndjson`（#5 是 en 搜索，不含 zh 候选） | 125 | R494 生产留档全部 zh 候选：pinyin 77 / coined 26 / blend 12 / word 10 |
| `docs/qa/audit-r239.md` ref2 三个幻影 ASCII 坏例原文 | 3 | tibeirock/kinwalk/duanyou |
| `apps/web/src/ai.ts` R196 连贯性红线引用的 R195 生产碎片句 | 1 | 「带给幼想出格的好奇色彩」 |
| `scripts/verify-r196/r222/r238/r244/r245/r246.mjs` 中的 zh 样本原文 | 34 | 历次审计坏例 + 手写合法好例（拼音引用/幻影 ASCII/声调/元语言等防线用例） |
| `docs/qa/ai-audit-r218.md` 留档正常 pinyin 候选（经 `verify-r222.mjs` §D 回放句式） | 23 | 「X」双字全拼，寓意贴合 |
| `apps/web/src/ai.ts` MEANING_REDLINES_ZH few-shot 好例/坏例 | 4 | |
| `apps/web/src/rule-fallback.ts` ruleMeaning 模板句 | 3 | theme=rule，必须放行 |

早于 R494 的审计（R218/R239）**没有 NDJSON 留档**（`git log --all -- '*.ndjson'` 只有 r494/ 六个文件），只能取 Markdown 报告里逐字引用的原文，所以历史坏例只有 4 条。

人工逐条标注（三值）：

| tag | 条数 | 定义 |
|---|---|---|
| `salad` | 8 | 整段词语沙拉 / 不成句 / 比喻链断裂：R494 六条 + R239 `duanyou`「wrin 前缀强调直结声」 + R195「带给幼想出格的好奇色彩」 |
| `coherent` | 182 | 母语者一眼看懂的通顺寓意（允许平淡/牵强，但成句） |
| `borderline` | 3 | 个别短语拗口但整体能懂：`xiwo`（「喜是愿化作欢心的欢腾，窝是渺小的恰恰归宿」）、`tuanwan`（「团体贴宠物蜷缩依偎」）、`pilloway`（三段比喻堆叠但每句成句）。**不计入精确率/召回率分母**，单列观察 |

样本量说明（实事求是）：阳性只有 8 条（可结构化识别的 R494 六条 + 2 条短句沙拉），任何规则的召回率估计都是粗粒度的；阴性 182 条里与沙拉同分布（r494 coined/blend）的 31 条是误杀评估的关键子集。

## 2. 可观测特征统计（[验证]，`scripts/research/zh-meaning-features.mjs` 输出）

特征定义（全部只数汉字，ASCII/标点不计）：`cjk` 汉字总数；`nClauses` 按 `，。；！？：、` 切分的子句数；`maxClause` 最长子句汉字数；`tail` 末子句汉字数；`punctDensity` 标点数/汉字数；`imagery` 比喻引导词计数（像/仿佛/恰似/如同/宛如/好比/犹如/般，排除「一般」）；`narrative` 叙事词计数（正在/被/讲述/演绎/传奇）；`overlap` 与 description 非停用汉字的重叠字数；`longClauses` ≥16 字子句数。

| 特征 | salad（8）min/p25/med/p75/max | coherent（182） | borderline（3） |
|---|---|---|---|
| cjk 句长 | 11 / 13 / 48 / 52 / **73** | 1 / 15 / 29 / 36 / **47** | 43 / 43 / 53 / 53 / 53 |
| nClauses | 1 / 2 / 3 / 4 / 6 | 1 / 2 / 5 / 6 / 7 | 4 / 4 / 5 / 5 / 5 |
| **maxClause 最长子句** | 7 / 11 / 19 / **26 / 27** | 1 / 6 / 9 / 12 / **21** | 13 / 13 / 16 / 16 / 21 |
| tail 末子句 | 7 / 11 / 18 / 26 / 27 | 1 / 4 / 6 / 8 / 20 | 13 / 13 / 16 / 16 / 21 |
| punctDensity 标点密度 | 0 / .058 / .065 / .077 / .082 | 0 / .100 / .133 / .167 / 1 | .075 / .075 / .094 / .094 / .116 |
| sentences（。数） | 0 / 0 / 1 / 1 / 2 | 0 / 0 / 0 / 1 / 1 | 1 |
| imagery 比喻词 | 0 / 0 / 1 / 1 / 2 | 0 / 0 / 0 / 0 / 2 | 1 |
| narrative 叙事词 | 0 / 0 / 1 / 2 / 3 | 0 / 0 / 0 / 0 / 1 | 0 |
| overlap 与 description 重叠 | 0 / 0 / 1 / 1 / 4 | 0 / 0 / 2 / 4 / 12 | 0 / 0 / 5 / 5 / 7 |
| longClauses ≥16 字子句数 | 0 / 0 / 1 / 1 / **2** | 0 / 0 / 0 / 0 / **1** | 0 / 0 / 2 / 2 / 2 |

与沙拉同分布的 coherent 子集（r494 coined/blend，31 条）：cjk max 47、**maxClause max 21**、tail max 10、imagery max 2、longClauses max 1。

逐条沙拉（R494 六条）：

| label | cjk | maxClause | tail | imagery | narrative | 。数 | ≥16 子句 |
|---|---|---|---|---|---|---|---|
| miaoround | 73 | 17 | 11 | 1（恰似） | 0 | 2 | 2 |
| moggity | 48 | 26 | 26 | 2（像×2） | 1（正在） | 1 | 1 |
| miafbab | 49 | 19 | 18 | 1（般） | 0 | 1 | 2 |
| gurgulu | 46 | 26 | 26 | 0 | 2（演绎、被） | 1 | 1 |
| voralini | 61 | 25 | 25 | 2（像、仿佛） | 3（讲述、被、传奇） | 1 | 1 |
| hapany | 52 | 27 | 27 | 1（般） | 0 | 1 | 1 |

读数：
1. **沙拉的核心可观测形态是「长从句」**：末尾一段 25–27 字不带标点的叙事名词短语（「整体感觉像一个伯爵先生正在柜台后端出鲸吞鲜食的宠与敬」），或两段 ≥16 字的比喻从句堆叠（miaoround/miafbab）。coherent 182 条里最长子句 ≤21、≥16 字子句 ≤1。
2. 比喻/叙事词（像/仿佛/恰似/般/被/正在/演绎/讲述）在沙拉里 6/6 至少出现 1 次，coherent 里 p75 = 0；但单看比喻词数不能分（fluffnest 合法句也有 2 个「像/般」）。
3. 句长、标点密度、与 description 重叠度、单纯「仿佛/恰似」存在与否——分布有偏移但重叠严重，**都不能单独作主判**（见 §3 表）。
4. 两条历史短句沙拉（`duanyou` 13 字、`youse` 11 字）在所有结构特征上与正常短句无差异：**结构规则无法识别短句沙拉**，需要语义判断（`duanyou` 已被 `zhCitesPhantomAscii` 拦，`youse` 属 prompt 治理范围）。
5. 「生僻搭配」（鲸吞鲜食/一小凳/鲜物下口/睡袍般裹）是人眼判沙拉的主要依据，但没有可靠的离线词典能量化（GB2312 常用字表覆盖这些字；仓库内无词级语料），本轮不做为规则特征，只作为 prompt 禁令表述。

## 3. 候选规则 精确率/召回率（[验证]，分母 salad 8 + coherent 182）

| 方案 | TP | FP | FN | 精确率 | 召回率 | 误杀率 FP/182 | borderline 命中 |
|---|---|---|---|---|---|---|---|
| S1 句长 cjk ≥ 55 | 2 | 0 | 6 | 100% | 25% | 0.0% | 0/3 |
| S1b 句长 cjk ≥ 70 | 1 | 0 | 7 | 100% | 13% | 0.0% | 0/3 |
| S2 最长子句 ≥ 22 | 4 | 0 | 4 | 100% | 50% | 0.0% | 0/3 |
| S2b 最长子句 ≥ 20 | 4 | 2（kuaila, guzigroo） | 4 | 67% | 50% | 1.1% | 1/3 |
| S3 比喻词 ≥ 2 且 cjk ≥ 50 | 1 | 0 | 7 | 100% | 13% | 0.0% | 0/3 |
| S4 加权分 ≥ 3（子句长 2/1 分 + 比喻≥2 + 叙事≥1 + ≥16 子句≥2 + cjk≥70） | 3 | 0 | 5 | 100% | 38% | 0.0% | 0/3 |
| S4b 加权分 ≥ 2 | 6 | 1（fluffnest） | 2 | 86% | 75% | 0.5% | 1/3 |
| S5a 长从句：最长子句 ≥ 22 **或** ≥16 字子句 ≥ 2 | 6 | 0 | 2 | 100% | 75% | 0.0% | 2/3 |
| **S5（选定）** S5a **且** 比喻/叙事词 ≥ 1 | **6** | **0** | 2 | **100%** | **75%** | **0.0%** | 2/3 |

- S5 的 2 条 FN 就是两条短句沙拉（§2 读数 4），R494 六条 **6/6 命中**。
- S5 与 S5a 在本标注集上等价，加「比喻/叙事词 ≥ 1」是为了给误杀留第二道安全边界：长而平实的说明句（如 kuaila「名字本身就带着零食递到宠物嘴边的雀跃语气」20 字、guzigroo 21 字）即便再长几字也不会被拦，因为没有比喻/叙事词。
- 加权分方案（S4/S4b）没有比 S5 更好：阈值 3 漏 3 条，阈值 2 误杀 fluffnest。规则越复杂越像对 8 条阳性过拟合，故不选。

## 4. 选定方案与 fail-closed 边界

`zhMeaningIncoherent(label, meaning, ctx)`（`apps/web/src/ai.ts`）：

```
theme === "rule" → false（规则降级模板句不判）
clauses = meaning 按 ，。；！？：、,;!?: 切分后各段的汉字数
longClause = max(clauses) ≥ 22 || count(clauses ≥ 16) ≥ 2
marker     = /像|仿佛|恰似|如同|宛如|好比|犹如|(?<!一)般|正在|被|讲述|演绎|传奇/ 命中 ≥ 1
return longClause && marker
```

fail-closed 边界（宁漏拦不误杀）：
- 只数汉字：label/英文片段/标点不计入长度，避免 blend 路线因引用英文词被误判。
- 双条件并联：必须「长从句 + 比喻/叙事词」同时成立。标注集 182 条 coherent 误杀 0（含与沙拉同分布的 31 条 r494 coined/blend、23 条 R218 留档、34 条历史防线好例、3 条规则模板句）。按 rule-of-three，0/182 对应误杀率 95% 上界 ≈1.6%，满足 <3% 目标；但要说明**近阈样本存在**（coherent 最长子句 21 vs 阈值 22；fluffnest 有 2 个比喻词但最长子句 19），生产分布若整体变长（如未来 prompt 放宽字数），需重跑标注集复核阈值。
- 命中即走既有 `dropped.zhMeaningIncoherent` 记账（R238 观测字段），内容不进任何事件；前端「本轮过滤 N 个」按 `Object.values(guard.dropped)` 求和自动计入，无需 i18n 改动。
- 不区分首搜/refine 轮：沙拉只在 refine 轮出现，但规则是结构性的，首搜同形态同样该拦；也不区分 pinyin/coined/blend/word（borderline 的 `xiwo`/`pilloway` 是 pinyin/coined 各一，命中 2/3，可接受——它们本身就是 refine 轮的低质产出）。

与公司规则的关系：「规则/阈值类判断不允许用简陋线性规则当主判，规则只做 fail-closed 兜底」——本方案严格定位为**兜底**：主判是 §5 的 prompt 治本（模型自己按结构写短句），S5 只拦漏网的最坏形态；已知漏网面（短句沙拉、无比喻词的长句沙拉）在 §2 读数 4 如实列出。

## 5. 治本：refine/点踩轮 zh prompt 输出约束（[实现，未生产验证]）

`buildRefineHint()`（refine 轮、点踩轮均走此处）追加 zh coined/blend 路线输出约束：
- 寓意 ≤40 字；只允许「音节来源 + 一句品牌联想」两段结构；每个分句 ≤15 字；禁止连环比喻（一条寓意最多一个「像/仿佛/般」）、禁止编故事（不写人物、情节、场景叙事）。
- few-shot 2 条好例（结构示范）+ 引用 R494 坏例形态作反例。
- 不动候选数配额（`count` 仍为 24 / target 逻辑不变），不改温度。

## 6. 验证状态

- [验证] 标注集回放：`node scripts/verify-r496.mjs` 输出 P/R、误杀清单（0 条）、R494 六条全拦；历史脚本 `verify-r196/r222/r223/r238/r243/r244/r245/r246/r247/r250` 全 PASS（EN 防线无回归）；`pnpm -r typecheck` / `pnpm --filter web test` / `pnpm --filter web build` 全绿。见 PR 描述。
- [未验证] 生产效果：本轮 0 次生产 AI 调用。建议父会话用 ≤2 次生产 AI 复验：① zh 点踩 refine 复现 R494 #4 的 description + 点踩 fluffnest/petnuzzle/pettreat，看 `proposed.guard.dropped.zhMeaningIncoherent` 与存活 coined 的寓意长度/结构；② 可选一次 zh 首搜确认误杀计数为 0。
- [未验证 / 后续可选] 用 LLM 自评（second pass「这句中文通顺吗」）作为主判替代规则：会多一次上游调用与时延，本轮不做；若 prompt 治本后 refine 轮仍出短句沙拉再评估。
