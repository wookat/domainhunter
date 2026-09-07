# theme 归一调研（R499，修 R494 审计 P3-1 / 顺带 P3-2 声调描述）

日期：2026-09-04 · 分支基线 `deploy/r192-r195`（437eca8）· 数据：`docs/audits/r494/ai-search-0{1..6}.ndjson`（137 条 `proposed` 候选，0 次新增 AI 调用）
复现脚本：`node scripts/verify-r499.mjs --matrix`

标注约定：**[验证]** = 本文档随附脚本可离线复现；**[推断]** = 基于代码阅读/人工判断，未做生产实测。

## 1. 为什么要归一

theme 有两个下游消费者（[验证]，代码阅读）：

- R105 结果页按 theme 聚类 chips（`countThemes` → 前端 chips）；
- R224/R243 word 路线软配额：`needsWordSupplement` 以 `theme === "word"` 计数决定是否补发（`EN_WORD_QUOTA_MIN_CANDIDATES`），R498 沿用。

模型把 `cuddlepup` 这类合成词标成 `word`，会让 word 计数虚高 → 该补发时不补发；把 `zhangwubao` 标成 `blend`，会让拼音候选跳过 R124/R196 拼音防线（`checkPinyinLabel`/`pinyinQuoteMismatch` 只对 `theme === "pinyin"` 生效）。

## 2. 现有产品语义（不改变）

| 语境 | 定义来源 | pinyin | word | coined | blend |
| --- | --- | --- | --- | --- | --- |
| zh | `SYSTEM_PROMPT`（R105） | 中文拼音/缩写 | 现成英文单词（R250 补充：现代英文词典日常在用的常用词） | 英文合成词/造词 | 拼音+英文混合 |
| en | `EN_NAMING_HINT`（R128/R250） | — | ① 词典里存在的完整英文单词 | ③ 其余纯造词（词根改造、错拼变体） | ② 能拆成两个可辨认英文词段拼接 |

结论：**两词拼接在 zh 语境归 coined（合成词），在 en 语境归 blend**——这是现有 prompt 已经定义的语义，归一规则按语境分别执行，不引入新定义。R494 审计 §4.5 对 6 条 zh 坏例的判定也是「应为 coined」，与此一致。

`harborly`（harbor + -ly）：任务草案「单个词典词含 -ly/-ify/-er 派生 → word」与 `EN_NAMING_HINT` ③「词根改造 → coined」及 R250「word 仅限词典常用词」冲突。本轮**按现有 prompt 定义归 coined**（同一文件里同型的 `focusly` 模型自标 coined，审计未异议）。如父会话希望派生词计入 word 配额，改 `normalizeTheme` S1 一行即可。[推断：产品取舍]

## 3. 英文词表调查

### 3.1 仓库内现有资源 [验证]

| 文件 | 内容 | 能否作为词典 |
| --- | --- | --- |
| `apps/web/src/pinyin-table.ts` | GB2312 6765 字 → 去声调拼音（R222） | 可做 pinyin 判定，**不含声调** |
| `ai.ts` `PINYIN_SYLLABLES` / `segmentPinyin` / `checkPinyinLabel` | 合法音节表与切分 | 可做 pinyin 判定 |
| `ai.ts` `ZH_ASCII_ALLOWED_WORDS` | zh meaning 允许出现的 ~80 个英文词（R179 phantom 检测用） | 太小，不是候选词典 |
| `ai.ts` `WORD_TLD_SUFFIX_ALLOW` | R250 词尾撞 TLD 的真实词白名单 | 仅 20 词 |
| `rule-fallback-lexicon.ts` | 规则兜底候选词根 | 主题词根，不是词典 |
| `brand-blocklist.ts` | 品牌撞名黑名单 | 否 |

R127/R224 word 路线**没有**词表：word 与否完全由模型自标，R250 只做 TLD 内嵌降级。仓库无系统词表（`/usr/share/dict/words` 亦不存在）。

### 3.2 外部词表评估 [验证，仅在 /tmp 实验，未引入仓库]

| 词表 | 规模 | 对 137 条回放的判定能力 |
| --- | --- | --- |
| google-10000-english（20k 频率表） | 20,000 词，~150 KB | 137 个 label 中只命中 `anchor`；6 条坏例的 18 个构成词段只命中 12/18（`cuddle/pup/fluff/nibble/wag/munch` 缺失）→ **≤5k 精简表更差，无法支撑「两词拼接」判定** |
| dwyl/english-words `words_alpha` | 370,105 词，~3.7 MB | 命中 `anchor/wagtail/rowth/stewardly/sniffle`；**漏掉 `munchkin`**（审计判 word ✓），却把 `rowth/stewardly/sniffle` 判成词——按词典硬判会把 3 条模型标 coined 的候选改成 word（新增误改）；体积也超出 Worker 合理范围 |

结论：**词表路线在本样本上既不够（精简表）又不准（全量表），且不确定性正是任务要求「保留模型标注」的场景**。因此本轮不引入英文词表（bundle +0 B 词表），改用「模型自证」证据。

### 3.3 采用的证据源：模型自己的 meaning [验证]

R179 红线要求「声称的词源拆解必须与 label 拼写逐字吻合」，所以 meaning 里出现的英文词段就是模型对 label 构成的自述：

- `cuddlepup`：「cuddle 是拥抱，pup 是小狗，…」→ label 可被 meaning 引用词段 `cuddle`+`pup` 无缝拼出 → 模型自己承认是合成词；
- `zhangwubao`：「账务宝」逐字全拼 = `zhang`+`wu`+`bao` = label → 模型自己承认是纯拼音；
- `harborly`：「harbor … plus a -ly suffix」→ 词干被引用 + 派生后缀，拆不出两个词段。

不引用/不拆解的候选（如 `sunflower` 只说 "a bright name"）→ 无证据 → 保留模型标注。

## 4. 归一规则（`normalizeTheme`，`apps/web/src/ai.ts`）

| 规则 | 条件 | 结果 |
| --- | --- | --- |
| Z1 | zh，模型标注 ≠ pinyin，`checkPinyinLabel(label).ok`，且某「」引用词逐字全拼 == label（复用 `quotedWordMatchesLabel` 严格模式） | pinyin |
| Z2 | zh，模型标 word，`citedSplit(label, meaning, 2)` 能用 meaning 引用词段无缝拼出 label（≥2 段） | 含「」引用词拼音段 → blend；否则 coined |
| E1 | en，模型标 word，`citedSplit(label, meaning, 3)` ≥2 段且无派生后缀段 | blend |
| 例外 | label ∈ `WORD_LEXICALIZED_COMPOUNDS`（munchkin/wagtail/sunflower… 40 个已词汇化真实复合词） | 保留 word |
| S1 | 模型标 blend，label = 被引用词干（≥3 字母）+ 派生后缀（-ly/-ify/-ily/-ix/-ora/-io/-ish）且拆不出两词段；zh 且含「」引用词时不动 | coined |
| 其余 | 含数字/连字符 label、rule 候选、meaning 未拆解、en 描述场景（`enPinyinDrop`）下的 Z1 | 保留模型标注 |

执行位置：`admitCandidate` 内，先于 pinyin 合法性校验（归一到 pinyin 的候选同样过 R124/R196 防线），R250 `wordThemeEmbedsTld` 降级在其后照常执行。计数 `guard.themeNormalized`（GuardStats 新字段，含补发轮）。

### 4.1 边界案例

| 案例 | 处理 | 理由 |
| --- | --- | --- |
| 拼音+英文混搭 `caiwuhub`「财务」+hub、`maopals`「猫」+pals | 保留 blend（引用词全拼 ≠ label，Z1 不触发；Z2 只作用于 word 标注） | 模型标注正确 |
| zh 标 word 但拆出「」拼音段（假设 `maopals` 标 word） | → blend | zh 语境 blend 定义 |
| 含数字 `pet2go` | 不归一 | 规则只处理 `^[a-z]+$` |
| `pan` 既是拼音又是英文词 | 引「盘」→ pinyin；英文解释未引「」→ 保留 word | 以模型引用的中文词为证据，不做词典猜测；本样本 77 条 pinyin 无一在英文词典中 |
| 派生 `focusly`（模型标 coined）/`harborly`（标 blend） | coined / → coined | 见 §2 |
| 词汇化复合词 `munchkin`「munch+kin」、`wagtail`「wag+tail」 | 保留 word | 真实词典词（审计判 munchkin ✓）；词表判不出（`words_alpha` 无 munchkin），用白名单兜底 |
| `sniffle`/`rowth`/`stewardly` 模型标 coined | 不动 | 无高置信证据（Z 规则不改 coined 标注） |
| R250 `canaryio` 标 word | `normalizeTheme` 不动，`wordThemeEmbedsTld` 仍降级为 coined | 行为不变，`verify-r250.mjs` PASS |
| en 描述场景（R465 `enPinyinDrop`） | Z1 关闭 | 避免把候选归一到即将被 `enPinyinRoute` 丢弃的路线 |

## 5. 混淆矩阵（137 条回放）[验证]

行 = 模型自标，列 = 归一后：

| 模型 \ 归一 | pinyin | word | coined | blend | 小计 |
| --- | ---: | ---: | ---: | ---: | ---: |
| pinyin | 77 | 0 | 0 | 0 | 77 |
| word | 0 | 3 | 8 | 0 | 11 |
| coined | 0 | 0 | 30 | 0 | 30 |
| blend | 1 | 0 | 1 | 17 | 19 |

- 变更 10/137 = **7.3%**；非 pinyin 候选中 10/60 = 16.7%；word 标注错标率 8/11 = **72.7%**（zh word 10 条里 8 条是合成词）。
- 变更清单（逐条人工核对）：`zhangwubao` blend→pinyin；`cuddlepup/fluffnest/barkbite/furbuddy/nibblenest/pawlab/tailwag/pettreat` word→coined；`harborly` blend→coined。前 8 条（除 tailwag/pettreat）即 R494 P3-1 列出的 8 条；`tailwag/pettreat` 与 6 条 zh 坏例同型（非词典词、meaning 自述两词相拼），审计表格未逐条点名但属同一缺陷。
- 未改动的争议项：`munchkin/wagtail` 保留 word（白名单）；`sniffle` 标 coined 实为词典词，无证据不动。
- 归一后 word 计数：#3 R2 从 7 → 1（munchkin）——[推断] 若当时已有归一，该轮 word=1 仍 >0，不触发 R224 补发；但 R498 之后的 word 配额判断会基于真实值。

## 6. 声调/平仄描述（P3-2）

- **数据能力 [验证]**：`pinyin-table.ts` 是去声调表，`PINYIN_SYLLABLES` 亦无声调；R245 白名单只是允许 meaning 出现 āáǎà 等字符，不含字→调映射。仓库**无法校验**声调正误 → 按任务 b 项走「整句删除描述子句」分支。
- **样本 [验证]**：125 条 zh 候选中 52 条含声调/平仄描述（41.6%）；其中审计 §4.1 已证实 4 条错误（lexin 4+1 被写成「一升一平」、zhangping 4+2「先升后平」、nuanpa 3+1「第二声接第一声」、huazhi 1+1「一升一平」），其余 48 条未逐条校验（无声调数据；[推断] 模型声调判断整体不可靠，删除比保留更安全）。
- **处理**：`stripToneClaims`——按 `，；。、` 切子句，含 `TONE_CLAIM_RE`（声调|平仄|第X声|阴平|阳平|上声|去声|先升后平|一升一平|从仄到平|平仄相间|抑扬…）且不含「」引用词的子句整句删除，收口标点（不留开头/连续/句末悬空逗号，补回句号），若删空则原样保留。计数 `guard.toneClaimStripped`。
- **prompt**：`MEANING_REDLINES_ZH` 增加「禁止描述声调/平仄」红线 + 正/反例；`ZH_PINYIN_HINT` 与 `SYSTEM_PROMPT` 的拼音 few-shot 去掉「声调平缓/声调上扬/双拼声调节奏」，改说声母韵母搭配与联想。
- **副作用 [验证]**：52 条剥离后全部通过「无残留声调词、无悬空标点、「」引用词未丢」三项检查；e2e 中 lexin/nuanpa 候选保留。已知局限：声调描述与「」引用词同一子句时不删（样本中 0 例）。

## 7. 体积影响 [验证]

esbuild `--bundle --minify`（`external: cloudflare:*, node:*`）：

| 入口 | 基线 437eca8 | 本轮 | Δ |
| --- | ---: | ---: | ---: |
| `apps/web/src/ai.ts` | 142,134 B（gzip 56,261） | 146,238 B（gzip 57,828） | **+4,104 B（gzip +1,567）** |
| `apps/web/src/worker.ts` | 10,408,206 B（gzip 2,670,801） | 10,412,236 B（gzip 2,672,312） | +4,030 B（gzip +1,511） |

未引入任何词表，新增全部是规则代码 + 40 词白名单。前端 `pnpm --filter web build` 产物（客户端 chunk）零变化。

## 8. 生产复验建议

本轮 0 生产 AI 调用。父会话搭 R496/R497 的复验顺带核对（不额外花 AI）：

1. `guard.themeNormalized` / `guard.toneClaimStripped` 出现在流末尾 `proposed`（items 为空）事件的 `guard` 字段中，且 `toneClaimStripped` 应随新 prompt 明显低于回放 41.6%；
2. 抽查 zh 结果的 `theme=word` chips 是否仍混入两词合成词；
3. 抽查 zh meaning 是否还有「声调/平仄/第X声」字样。
