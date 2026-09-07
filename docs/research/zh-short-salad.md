# zh coined 寓意「短句沙拉」：来源可核性形态学、三方案对比与推荐（R501）

> 背景：R496 的 `zhMeaningIncoherent`（`apps/web/src/ai.ts`，论证见 `docs/research/zh-meaning-coherence.md`）只覆盖「长从句 + 比喻/叙事词」形态。R499V 把生产复验里新出现的 3 条短句沙拉（maoga / tuoguo / zora）并入标注集后，260 条集上 R496 精确率 100%、误杀 0、召回 **6/11**（`node scripts/verify-r496.mjs`）。5 条 FN 全是 ≤40 汉字、无比喻链的「短句沙拉」。
> 老板规则：阈值/规则类判断不允许再堆线性规则当主判，应以模型 + 真实标签为主、规则只做 fail-closed 兜底。本文按 SOP-02 调研先行，**全程 0 次 AI 调用**，所有数字由 `node scripts/proto-r501.mjs` 在标注集上算出（`--items` 打印 260 条逐条特征表）。**不改 `apps/web/src/ai.ts` 生产路径**；论证结论是「哪个方案值得下一轮实现」，不是实现本身。
>
> 复现：`node scripts/build-zh-meaning-labels.mjs && node scripts/verify-r496.mjs && node scripts/proto-r501.mjs --items`。

## 0. 结论先行

1. **[验证] 5 条 R496 FN 里，只有 2 条（zora / youse）是「结构层」能拦的**——它们完全没有音节来源，纯联想。另外 2 条（maoga「毛」+ga、tuoguo「脱」+「果」）**来源全部可核、拼合恰好等于 label**，任何「来源可核性」规则都不可能拦——它们的问题是「拼出来的中文词无意义 / 联想与需求无关」，这是**语义**问题，只有模型能判。第 5 条 duanyou 生产今天已被 `zhCitesPhantomAscii` 拦（标注集里 R496 单测漏、生产链不漏）。
2. **[验证] 「来源可核性」硬规则（方案 A）全量上线不可接受**：A3 全量 TP 4 / FP 18 / FN 7，误杀 7.5%（对今日 guard 放行的 228 条 coherent 净增误杀 8 条 3.5%）。误杀的根因不是规则错，而是**自由文本 meaning 的来源解释本来就是可省略的**（「财务枢纽」caiwuhub 没解释 hub；lumora 只解释了 lum；haoming 一句话只写寓意）。从自由文本反推来源必然有解析噪声。
3. **[验证] 同一规则限定在 refine 轮 + 当前 guard 放行的子集上，净增误杀 0/66，净增拦截 2/4**（zora / youse）。但这只是因为 260 集里「来源写不全的 coherent」恰好都在首轮——是样本偶然性，不是 refine 轮的性质，**不能拿来当上线依据**（见 §3.1 泛化风险）。
4. **推荐：方案 C（结构化输出 + 规则核对）为主干，方案 B（LLM 语义二审）补语义层，A 只以 C 的校验器形态存在**。C 把「来源」从自由文本变成模型必填的结构字段 `sources:[{frag,from}]`，规则只核「frag 是否拼出 label、from 是否真能读出 frag」——不再从自由文本猜来源，解析噪声归零；结构层对 11 条 salad 的「诚实结构化输出」能拦 7 条（含 R496 已拦的 6 条中的 4 条 + zora/youse/duanyou），对 6 条手写好例 0 误拒。剩下 4 条结构完全合法的沙拉（miaoround / hapany / maoga / tuoguo）只能靠 B。
5. **[推断] B 的增量成本可忽略、时延不可忽略**：按 DeepSeek 官方价与官方 token 换算比，一次 21 条 refine 批次 ≈ 971 输入 + 324 输出 token ≈ **$0.0011/次**（1000 次 ≈ $1.09）；串行加在轮尾 **P50 ≈ +5.9s**（TTFT 中位 2.8s + 出字 3.1s，按 R494 六次实测流推算，未实测）。所以 B **只对 C 结构层放行且 theme ∈ {coined, blend, pinyin} 的 refine 轮候选**做，且对 B 自身故障 fail-open（不因二审不可用而把整轮清空），只对 `ok=0` 的明确判决 fail-closed。
6. **本轮不写生产代码**。下一轮（R502）实现清单与生产复验设计见 §5；复验需 **≥3 次授权 AI 调用**（1 次 zh 首轮 + 2 次 zh 点踩 refine），看 `guard.zhStructured*` / `guard.zhSecondPass*` 字段。

## 1. 形态学：260 条逐条特征表（[验证]）

### 1.1 特征定义（`scripts/proto-r501.mjs` §1 `analyze()`）

从**自由文本 meaning** 里解析「声称的音节来源」，再逐个核对：

| 特征 | 定义 |
|---|---|
| 来源（sources） | ①「」内 1–6 个汉字（排除「中文名」label 形态里的品牌译名与「法语的『好』」式释义引号）；② 未加引号但跟着「字音/的拼音/的声母/字首」的汉字（取最长可核后缀，去掉「取/与/加」等虚词）；③ 独立 ASCII 片段（≥2 字母；单字母只在被点名为「后缀/字首」时算）；④ 外语派生词（perfect→fect：整词非子串但首/尾 ≥3 字母段是子串）；⑤ 全拼恰等于 label 的隐式整名（yunji「云集之意」）；⑥「中文名」label 形态：整词全拼含 label、或前 k 字全拼是 label 前缀、或声母缩写（「掌上派」zsp）|
| 可核（verifiable） | 汉字来源：逐字全拼（含 ü→u/ue 变体）或首字母/首声母（zh/ch/sh）的任一拼接是 label 子串（**与 R497 `singleQuotesCoverLabel` 同法**，拼音表复用 `pinyinReadingsOf`）；ASCII 来源：是 label 子串或派生片段 |
| 拼合覆盖（coversLax / coversStrict） | 用全部可核片段从 0 走到 label 末尾的可达性（R497 同法）；允许相邻片段共享 1 字母（woof+fan→woofan）和 1 个单字母连接音（chew+a+boo）；strict 只认全拼不认首字母 |
| 字母占比（coverUnion） | 片段出现位置的并集 / label 长度（允许跳跃） |
| 品牌联想句（hasAssoc） | 存在一个分句：无 ASCII、无引号、不是纯读音评语（读/上口/好记/声调…），或带联想标记词（寓意/象征/意味/传达…） |
| 领域重叠（assocOverlap） | 联想句汉字 ∩ description 去停用字后的汉字数；仅对有 description 的 199 条（verify 脚本手写样本 description 为空）|
| 纯联想（pureAssoc） | 来源数 = 0 |
| 引号全单字（singleQuoteOnly） | 「」引用全是单字（「毛」「脱」「果」拆字型）|
| 今日 guard | 现有 `admitCandidate` 链按序模拟：metaLanguage → citesPhantomWord → zhCitesPhantomAscii → questionMark → zhMeaningIncoherent → pinyinMismatch（theme=pinyin）|

### 1.2 三类分布

| 特征 | salad (11) | borderline (8) | coherent (241) |
|---|---|---|---|
| F1 有可核来源 ≥1 | 8/11 (73%) | 7/8 (88%) | 232/241 (96%) |
| F1' 存在不可核来源 | 1/11 (9%) | 1/8 (13%) | 9/241 (4%) |
| F2 来源拼合覆盖 label（lax） | 7/11 (64%) | 7/8 (88%) | 226/241 (94%) |
| F2s 严格全拼覆盖 | 7/11 (64%) | 7/8 (88%) | 220/241 (91%) |
| F2u 字母占比 ≥0.8 | 7/11 (64%) | 7/8 (88%) | 226/241 (94%) |
| F3 有品牌联想句 | 10/11 (91%) | 8/8 (100%) | 235/241 (98%) |
| F4 联想句与 description 领域字重叠 ≥1（有 description 的条） | 6/11 (55%) | 6/8 (75%) | 163/241 (68%) |
| F4' 有 description 但重叠 = 0 | 3/11 (27%) | 2/8 (25%) | 12/241 (5%) |
| F5 无来源纯联想 | 2/11 (18%) | 1/8 (13%) | 4/241 (2%) |
| F6 引号全为单字 | 3/11 (27%) | 2/8 (25%) | 16/241 (7%) |
| F7 refine 轮 | 11/11 (100%) | 8/8 (100%) | 68/241 (28%) |
| F8 theme ∈ coined/blend | 9/11 (82%) | 5/8 (63%) | 78/241 (32%) |
| F9 今日 guard 链会拦 | 7/11 (64%) | 2/8 (25%) | 13/241 (5%) |

中位数：汉字数 salad 46 / borderline 29 / coherent 32；coverUnion 三类中位数都是 1.0；assocOverlap salad 1 / borderline 2 / coherent 3。

**读法**：
- 结构特征（F1/F2/F2u）在 salad 与 coherent 之间只差 20–30 个百分点，且 salad 里 7/11 的来源**完全可核并拼合覆盖 label**——沙拉的主体不是「来源造假」而是「来源真、句子假」。
- 唯一 salad 显著高于 coherent 的结构特征是 F5 纯联想（18% vs 2%）和 F4' 领域零重叠（27% vs 5%），但绝对数都很小（2 条 / 3 条），且 F4' 在 coherent 里有 12 条正常候选（lexin「省心与顺畅」对财税描述零重叠但完全成句）——**领域重叠不能做硬规则**。
- F7：11 条 salad 全部来自 refine 轮（点踩后「避开这些词根」的重生成压力下模型开始瞎编）；F9：今日生产已拦 7/11。

### 1.3 salad / borderline 逐条（19 条）

| tag | label | theme | 解析出的来源（✗=不可核） | 拼合覆盖 | 联想句 | 领域重叠 | 纯联想 | 今日 guard | 结构层能否拦 |
|---|---|---|---|---|---|---|---|---|---|
| salad | miaoround | blend | 喵 round | Y | Y | 0 | N | zhMeaningIncoherent | 否（来源合法）→ 只能 B |
| salad | moggity | coined | ty（moggy 不是子串） | N (0.29) | Y | 2 | N | zhMeaningIncoherent | 是（frag 不在 label）|
| salad | miafbab | coined | miaf bab | Y | Y | 1 | N | zhMeaningIncoherent | 是（miaf 不在拟声白名单）|
| salad | gurgulu | coined | gur gulu | Y | Y | 2 | N | zhMeaningIncoherent | 是（gur 不在拟声白名单）|
| salad | voralini | coined | vora lini | Y | Y | 1 | N | zhMeaningIncoherent | 是（lini 不在后缀白名单 + gist 叙事词）|
| salad | hapany | coined | ha pany | Y | Y | 0 | N | zhMeaningIncoherent | 否 → 只能 B |
| salad | **maoga** | blend | 毛 ga | Y | Y | 1 | N | — | **否** → 只能 B |
| salad | **tuoguo** | pinyin | 脱 果 | Y | Y | 0 | N | — | **否** → 只能 B |
| salad | **zora** | coined | — | N (0) | Y | 2 | **Y** | — | 是（无来源）|
| salad | duanyou | pinyin | 韫岩✗ wrin✗ | N (0.14) | N | – | N | zhCitesPhantomAscii | 是（韫岩 ≠ duanyou）|
| salad | **youse** | coined | — | N (0) | Y | – | **Y** | — | 是（无来源）|
| borderline | tuanwan | pinyin | 团玩 | Y | Y | 6 | N | — | 否 |
| borderline | pilloway | coined | pillo way | Y | Y | 3 | N | zhMeaningIncoherent | 否 |
| borderline | xiwo | pinyin | 喜窝 | Y | Y | 0 | N | zhMeaningIncoherent | 否 |
| borderline | ongo | coined | 翁✗ ong go | Y | Y | 4 | N | — | 是（翁=weng ≠ ong）|
| borderline | pingo | coined | pin go | Y | Y | 2 | N | — | 是（pin「快乐的相连」不可核）|
| borderline | lino | coined | — | N (0) | Y | 2 | Y | — | 是（无来源）|
| borderline | mouxiong | pinyin | 某熊 | Y | Y | 0 | N | — | 否 |
| borderline | xuanwa | blend | 选 哇 | Y | Y | 1 | N | — | 否 |

加粗 4 条 = 今日生产会放行的 salad。其中 zora / youse 结构层可拦，**maoga / tuoguo 结构层无解**。

260 条全量逐条表见附录 A（由 `--items` 生成）。

## 2. 方案对比（[验证] 数字 / [推断] 成本与时延）

分母口径：TP/FP/FN 只算 salad(11)/coherent(241)，borderline(8) 单列命中数。「净增」列 = 只看今日 guard 链放行的条（salad 4 / coherent 228），衡量**叠加到现有防线之后**新增的拦截与误杀，避免把 waofun/tibeirock 这类生产早已丢弃的条重复计成误杀。

### 2.1 方案 A：来源可核性硬规则（从自由文本反推）

| 规则 | TP | FP | FN | 精确率 | 召回率 | 误杀率 | BL | 净增拦 FN | 净增误杀 | 净误杀率 |
|---|---|---|---|---|---|---|---|---|---|---|
| R496 zhMeaningIncoherent（基线） | 6 | 0 | 5 | 100% | 55% | 0.0% | 2/8 | 0/4 | 0/228 | 0.0% |
| 今日 guard 链全体 | 7 | 13 | 4 | 35% | 64% | 5.4% | 2/8 | — | — | — |
| A0 无来源纯联想 | 2 | 4 | 9 | 33% | 18% | 1.7% | 1/8 | 2/4 | 2/228 | 0.9% |
| A1 来源拼合不覆盖 label（lax，含无来源） | 4 | 15 | 7 | 21% | 36% | 6.2% | 1/8 | 2/4 | 6/228 | 2.6% |
| A1s 严格只认全拼 | 4 | 21 | 7 | 16% | 36% | 8.7% | 1/8 | 2/4 | 11/228 | 4.8% |
| A2 存在不可核来源 | 1 | 9 | 10 | 10% | 9% | 3.7% | 1/8 | 0/4 | 3/228 | 1.3% |
| **A3 = A0 ∪ A1 ∪ A2（全量）** | 4 | 18 | 7 | 18% | 36% | **7.5%** | 2/8 | 2/4 | 8/228 | 3.5% |
| A3 仅 refine 轮 | 4 | 2 | 7 | 67% | 36% | 0.8% | 2/8 | 2/4 | **0/228** | 0.0% |
| A3 仅 coined/blend | 3 | 12 | 8 | 20% | 27% | 5.0% | 2/8 | 2/4 | 7/228 | 3.1% |
| A3 仅 coined/blend 且 refine | 3 | 2 | 8 | 60% | 27% | 0.8% | 2/8 | 2/4 | 0/228 | 0.0% |
| S1 引号全为单字（pinyin/blend） | 3 | 16 | 8 | 16% | 27% | 6.6% | 1/8 | 2/4 | 15/228 | 6.6% |
| A4 无品牌联想句 | 1 | 6 | 10 | 14% | 9% | 2.5% | 0/8 | 0/4 | 5/228 | 2.2% |
| A5 联想句与领域字零重叠 | 3 | 12 | 8 | 20% | 27% | 5.0% | 2/8 | 1/4 | 11/228 | 4.8% |
| R496 ∪ A3 | 9 | 18 | 2 | 33% | 82% | 7.5% | 4/8 | 2/4 | 8/228 | 3.5% |
| R496 ∪ A3(coined/blend) ∪ S1 | 10 | 28 | 1 | 26% | 91% | 11.6% | 5/8 | 4/4 | 22/228 | 9.6% |

同规则只看 refine 子集（salad 11 / borderline 8 / coherent 68）：

| 规则 | TP | FP | FN | 精确率 | 召回率 | 误杀率 | BL | 净增拦 | 净增误杀 |
|---|---|---|---|---|---|---|---|---|---|
| A3 全量 | 4 | 2 | 7 | 67% | 36% | 2.9% | 2/8 | 2/4 | 0/66 |
| R496 ∪ A3 | 9 | 2 | 2 | 82% | 82% | 2.9% | 4/8 | 2/4 | 0/66 |
| R496 ∪ A3(coined/blend) ∪ S1 | 10 | 9 | 1 | 53% | 91% | 13.2% | 5/8 | 4/4 | 7/66 |

误杀清单（A3 净增 8 条，全是今日放行的 coherent）：caiwuhub / zhangdanhub / kuaijihub（「财务枢纽」caiwuhub，拼音加英文组合——**hub 没被单独解释**）、chapu（「读来干脆，如茶席铺陈」——茶/铺隐式来源，非连续）、lumora（只解释 lum）、haoming（一句话只写寓意）、scirio（rio 取自 curious 的「尾音」——非边缘派生）、muzhou（「先想到木船，定名木舟」——被否掉的备选被当来源）。

S1 净增误杀 15 条全是正常拆字拼音候选（maopals「毛」+pals、gougift…）——**拆字型本身不是沙拉信号**，tuoguo 的问题是「脱果」不成词，S1 抓不住这个语义。

**A 的 fail-closed 边界（若被采用）**：只在 `theme ∈ {coined, blend}` 且 refine 轮启用；表外字、无 ASCII 来源、派生不成立都算「不可核」→ 拒；仅 A0（纯联想）可考虑全量。

**A 的泛化风险（260 集之外）**：
1. 解析噪声是本质而非 bug：自由文本对来源的表述千变万化（「取自/源自/谐音/借/化用」），任何正则集合在新分布上都会漏解析→误判「不可核」→误杀。260 集里 8 条净增误杀里 5 条属这类。
2. 「A3 仅 refine 净误杀 0」不可外推：66 条 refine coherent 全部来自 R494/R496–R499 两个 pet 场景的 3 次 refine，都在 R497/R499 拼音引用治理之后生成、来源写得最完整；首轮里的 caiwuhub 型「一半拼音一半英文没解释」在任何一次 refine 里也可能出现。
3. 拼音表外字（`pinyinReadingsOf` 未收录）一律「不可核」→ 与 R222 保守拒绝同口径，但 coined 词的外语来源（拉丁/日语）没有任何表可核，只能靠 ASCII 边缘派生规则，「rio←curious」这种松派生会被拒。
4. 对 maoga/tuoguo 类**来源真、词无意义**的沙拉，A 的召回是结构性的 0——不管怎么调都不会提高。

### 2.2 方案 B：同请求内 LLM 语义二审（离线设计，**未调用**）

**判什么**：C 结构层放行后、`theme ∈ {coined, blend, pinyin}`、refine 轮的候选，批量让模型判「中文创业者 3 秒能否看懂：为什么这样拼、和需求有什么关系」。这正是 maoga/tuoguo/hapany/miaoround 四条结构合法沙拉唯一可被拦的层。

**Prompt（`scripts/proto-r501.mjs` §4 `B_SYSTEM` / `buildBUserPrompt`）**：

```
system：
你是中文创业者视角的域名寓意审核员。下面是若干候选域名及其寓意说明，请逐条判断：一个中文创业者看到 label 与寓意，能否在 3 秒内看懂「这个名字为什么这样拼、和需求有什么关系」。
只输出 JSON 数组，每项 {"label":"…","ok":0或1,"why":"≤8字"}：
- ok=0 的情形：音节来源与 label 对不上；来源拼出的中文词本身无意义或与需求无关（如「脱果」）；联想句与需求领域无关；句子主谓断裂读不通。
- ok=1 的情形：来源清楚、拼得出 label、联想一句话就能对上需求。
不解释，不补写寓意，不改 label。

user：
需求：<description>
候选：
- <label>｜<meaning>
…
```

设计要点：system 固定（可命中 DeepSeek 上下文缓存）；输出只有 label/ok/why 三字段，`why` ≤8 字用于 guard 观测聚合，不回显给用户；不让模型改写 meaning（避免二审变成二次生成）。

**Token 估算（[推断]，按 DeepSeek 官方换算比 1 汉字≈0.6 token / 1 英文字符≈0.3 token，`https://api-docs.deepseek.com/quick_start/token_usage`，官方也注明以实际 usage 为准）**，用真实 refine 批次 `docs/audits/r496-r499/ai-search-02-zh-refine.ndjson` round 2 的 21 条放行候选构造：

| 批大小 | 输入 token | 输出 token | 单次成本（未命中缓存） |
|---|---|---|---|
| 6 条 | 408 | 95 | $0.00039 |
| 12 条 | 635 | 187 | $0.00067 |
| 21 条（真实批） | 971（system 141 + user 830） | 324（每条 ≈15） | **$0.00109**（system 缓存命中 $0.00102） |

价格 [验证-抓取 2026-09-04]：`https://api-docs.deepseek.com/quick_start/pricing`，deepseek-chat：输入 $0.56/M（未命中缓存）、$0.07/M（命中）、输出 $1.68/M，页面注明价格可能调整。**每 1000 次 refine 轮 ≈ $1.09**。相对主轮（24 候选 × ~120 字符 JSON ≈ 3.5–4k 字符 ≈ 1.2–1.5k 输出 token ≈ $0.002–0.0025 + 长 system prompt 输入），B 增量约 **+30–50% 单轮成本**，绝对值可忽略。

**时延估算（[推断]，基于 R466 主轮流式的 R494 六次实测留档 `docs/audits/r494/ai-search-0{1..6}.ndjson` 的 `_ms` 时间戳，`proto-r501.mjs` §4 计算）**：

| 指标 | 值 | 备注 |
|---|---|---|
| 响应头 | 378–471 ms | 6 次 |
| 轮起 → 首候选（TTFT 代理） | 中位 **2773 ms**（1944–3825，n=11 轮） | 含模型先吐 understanding 的轮，偏大 |
| 放行候选 JSON 吞吐 | 中位 **≈296 字符/s**（n=10 轮） | 只算放行条，是真实出字速度的下界 |
| B 单批 21 条输出 | 911 字符 ≈ 3.1 s | JSON 数组 |
| **B 串行增量 P50** | **≈ +5.9 s** | 2.8 + 3.1；样本 6 次，不是统计意义的 P50 |

对照 R494 实测：首候选 2.7–3.9 s、首个可注册 4.1–6.5 s、整次流 16.6–29.3 s。B 若挂在**轮尾串行**，会把 refine 轮整轮结束推迟 ~6 s，且候选必须扣住不发（已上屏再撤是坏体验）→ 首候选从 ~3 s 变 ~9 s，**打穿「首结果 <10 s」目标的安全边际**。可选：

- B1 微批流水：每凑 6 条发一次 B（≈ +2.8 + 0.6 s，4 次调用/轮），候选按批放行 → 首候选 +3.4 s，后续批与主流重叠。调用数 ×4，成本仍 <$0.002/轮。
- B2 只审结构层放行的 coined/blend/pinyin，批更小（真实批 21 条里 theme=coined/blend/pinyin 且 C 放行的通常 8–14 条）→ 输出 ~500 字符，串行 ≈ +4.5 s。
- **推荐 B2 + 只在 refine 轮启用**（11/11 salad 全来自 refine；首轮不加时延）。

**观测（R238 guard 字段同法，聚合计数不留候选文本）**，加到 `GuardStats`：

```ts
/** R502：zh refine 轮语义二审（方案 B） */
zhSecondPass?: {
  calls: number;            // 本次搜索发起的二审调用数（B2 每 refine 轮 1 次）
  judged: number;           // 送审候选数
  rejected: number;         // ok=0 被拦数（同时计入 dropped.zhSecondPassRejected）
  unparsed: number;         // 返回不是合法 JSON / label 对不上而按 fail-open 放行的条数
  failed: number;           // 调用失败/超时次数（fail-open：整批放行并计数）
  ms: number;               // 二审总耗时
  provider?: LlmProvider;   // 与主轮同字段
  reasons?: Record<string, number>; // why 归一化后的前 5 类计数（如「来源对不上」「与需求无关」），不留 label
};
```
`GuardDropCounts` 加 `zhSecondPassRejected`。`docs/audits` 零 AI 对账脚本按 R238 路子读 KV `stats` 聚合即可。

**B 的 fail-closed 边界**：只对模型**明确** `ok=0` 拦；调用失败、超时（建议 8 s 硬上限）、JSON 不合法、label 对不上 → **fail-open 放行 + 计数**（否则 LLM 抖动会清空整轮 refine，比放过 1 条沙拉严重得多）。这与 R471 熔断（quota 后 300s）共用 breaker：breaker 打开时不发 B。

**B 的泛化风险**：① 模型判「3 秒能否看懂」本身没有真实标签校准——R502 上线前必须先用本标注集 19 条 salad/borderline + 抽 40 条 coherent 做一次**离线批判**（1 次 AI 调用）拿到 B 自身的 P/R，才能定是否上线；② 同一模型审自己的输出有一致性偏差（自恋效应），可用 `LLM_FALLBACK_*` 备用上游做二审降低相关性（R474 已有传输层）；③ 时延估算基于 6 次样本；④ refine 轮限流每 IP 20 次/h 不变，但 AI 上游额度按 token 计，B 使额度消耗 +30–50%。

### 2.3 方案 C：prompt 侧结构化 `sources` + 规则核对（推荐主干）

**改动面（R502 实现，本轮不改）**：`ZH_COINED_MEANING_FORMAT`（`apps/web/src/ai.ts` L943）要求 coined/blend/pinyin 候选除 `meaning` 外多输出：

```json
{ "label": "woofable", "theme": "coined",
  "sources": [{ "frag": "woof", "from": "拟声" }, { "frag": "able", "from": "able" }],
  "gist": "每只狗都值得好好对待",
  "meaning": "woof 是狗叫的拟声，able 取自 able，寓意每只狗都值得好好对待" }
```

`meaning` 仍是展示文案（或由 sources+gist 拼装，R502 决定）；`sources`/`gist` 只进 guard。**模型负责给结构，规则只负责核对结构**——把 A 从「自由文本反推」变成「对显式声明做核对」，解析噪声归零；同时 prompt 强迫模型为每个音节写来源，本身就是对「瞎编」的抑制（R497 结构化引用治理后拼音幻影已归零，是同一思路的先例）。

**校验器 `verifyStructured(label, {sources, gist})`（`scripts/proto-r501.mjs` §3，可直接移植）**，任一 reason 即拒（fail-closed）：

| 校验 | 说明 |
|---|---|
| `no_sources` | sources 为空（zora / youse / lino 型纯联想） |
| `frag_not_in_label` / `frag_out_of_order` / `frags_do_not_cover_label` | 每个 frag 必须是 label 子串、按序、拼接 === label（允许相邻重叠 ≤1 字母）|
| `frag_not_pinyin_of_from` / `from_char_unknown` | from 为汉字词：frag 必须是逐字全拼或首字母/首声母的一种拼接（R497 `singleQuotesCoverLabel` 同法）；表外字保守拒（R222 同口径）|
| `frag_not_edge_of_from` | from 为 ASCII/外语词：frag 必须是整词或首/尾 ≥2 字母段（perfect→fect ✓、curious→rio ✗）|
| `onomatopoeia_not_whitelisted` / `affix_not_whitelisted` | from 为「拟声/后缀」类自由标签：frag 必须在小白名单内（woof/meow/ga/gulu… ; ly/ty/able/ino…），表外不认——模型想用表外拟声就得换候选 |
| `gist_len` / `gist_multi_clause` / `gist_has_ascii` | gist 4–20 汉字、单分句、无 ASCII |
| `gist_metaphor_chain` / `gist_narrative` | 比喻词 >1 个（与 prompt「整条最多一个像/仿佛/般」一致，1 个放行）；含 正在/被/讲述/演绎/传奇 |

**标注集上的结果（[验证]，对 19 条 salad/borderline 手写「诚实结构化输出」——即模型如实交代 meaning 原文所述来源时应输出的结构；来源不存在就留空）**：

| 类 | 结构层拦 | 放行（需 B） |
|---|---|---|
| salad 11 | **7**：moggity（moggy 非子串）、miafbab（miaf 表外拟声）、gurgulu（gur 表外拟声）、voralini（lini 表外后缀 + gist「传奇」）、zora（无来源）、duanyou（韫岩≠duanyou）、youse（无来源） | **4**：miaoround、hapany、maoga、tuoguo |
| borderline 8 | 3：ongo（翁=weng≠ong）、pingo（pin「快乐的相连」不可核）、lino（无来源） | 5：tuanwan、pilloway、xiwo、mouxiong、xuanwa |
| 好例 6（prompt 两条 few-shot woofable/mochacat + aipet/yunmu/purrfect/crousti） | 0 误拒 | 6/6 通过 |

对今日生产放行的 4 条 salad：结构层新拦 zora / youse（2/4），maoga / tuoguo 交给 B。coherent 侧无法在 260 集上直接算 C 的误杀（没有历史结构化输出），只能给出**结构性论证**：C 只拒「模型自己声明的来源核不出来」的条，与 R497 拼音引用核对同性质。同性质防线的实际误杀可参照：260 集里 `pinyinMismatch` 命中 5 条 tag=coherent（zhongao「忠」。/ yuncu / tangfang / shuqi / pinen），其中 4 条是 verify 脚本手写的「引用词拼音与 label 不符」坏例（句子通顺但来源造假，本就该拦），1 条 zhongao 是 R494 生产留档里 meaning 只剩「忠」。的截断条——**来源核对拦的是来源造假，不是句子读感**，与 salad 标签正交。真实误杀率必须由 R502 生产复验测出（§5.3）。

**C 的 fail-closed 边界**：`lang=zh` 且 `theme ∈ {coined, blend, pinyin}`（word 路线走 R246 `citesPhantomWord`，rule 路线免检）；模型没给 `sources` 字段 → 拒（否则 prompt 约束形同虚设）；白名单表外拟声/后缀 → 拒；表外汉字 → 拒。首轮与 refine 轮都启用（结构核对零时延零成本）。

**C 的泛化风险**：① 模型遵循结构化输出的稳定性——现有候选已是 JSON 对象，增加一个数组字段 [推断] 风险低，但遵循率未验证，需生产复验看 `zhStructuredMissing` 计数；② 白名单必然不全（新拟声 hmm/purrr/zzz…）→ 会误拒合法造词，但模型可换候选，属「宁缺勿滥」方向的可接受误杀，需靠 `zhStructuredRejected.reasons` 观测补表；③ 模型可能为了通过核对而编一个能拼出 frag 的汉字（「ga」←「嘎」）——结构合法但语义空洞，这正是 B 要兜的；④ 输出 token 增加：每候选 +~40 token（sources+gist），24 条 ≈ +1k 输出 token ≈ +$0.0017/轮，主轮流式首候选时延基本不变（首候选的 JSON 变长 ~40%，TTFT 不变、首条完整落地 +0.1–0.2 s）。

### 2.4 汇总

| | A 来源可核硬规则（自由文本） | B LLM 语义二审 | C 结构化 + 规则核对 |
|---|---|---|---|
| 260 集召回（11 salad） | 4/11（全量）；对今日放行 4 条新拦 2 | 未测（需 1 次 AI 离线批判） | 结构层 7/11；对今日放行 4 条新拦 2，余 2 交 B |
| 260 集误杀 | 18/241 = 7.5%（净增 8/228）；refine 子集净增 0/66（样本偶然） | 未测 | 手写好例 0/6；coherent 侧无法离线算，需生产复验 |
| 能否拦 maoga/tuoguo | **否（结构性）** | 是（唯一途径） | 否，交 B |
| 增量成本/时延 | 0 | ≈$0.0011/refine 轮；P50 +4.5–5.9 s（串行）| ≈+$0.0017/轮；时延 ≈0 |
| 主判 vs 兜底 | 规则当主判 ✗（违反老板规则） | 模型主判 ✓ | 模型给结构、规则兜底 ✓ |
| 推荐 | 不单独上线；以 C 校验器形态存在 | R502 先离线批判定 P/R，再上线 B2 | **R502 实现** |

## 3. 推荐与 fail-closed 边界

**推荐：C 为主干（R502 实现 + 复验），B2 为语义层（R502 先做 1 次离线批判校准，达标后 R503 上线），A 不单独上线。**

理由：① 5 条 FN 的构成决定了上限——结构层最多再拦 2 条，剩 2 条必须模型判；② C 是把「模型给结构、规则核对」的 R497 成功范式推广到 coined/blend 音节来源，老板规则要求的「模型主判 + 规则 fail-closed 兜底」正是这个形态；③ A 独立上线的 7.5% 误杀不可接受，而它的误杀根因（自由文本解析噪声）在 C 里被结构消灭；④ B 成本可忽略，但时延与「没有标签校准」两个风险要求先离线校准再上线，并限定 refine 轮 + fail-open on failure。

fail-closed 边界总表：

| 层 | 拦（fail-closed） | 放（fail-open） |
|---|---|---|
| C 结构核对 | sources 缺失/为空；frag 拼不出 label；from 读不出 frag；表外汉字；表外拟声/后缀；gist 超长/多句/比喻链/叙事词 | rule 路线；word 路线（走 R246）；en 场景 |
| B 语义二审 | 模型明确 `ok=0` | 调用失败/超时/JSON 不合法/label 对不上/breaker 打开 → 放行 + 计数 |
| R496 | 不变 | 不变 |

## 4. 260 集之外的泛化风险（汇总）

1. **标签少**：salad 11 条、今日放行的 salad 只有 4 条，所有召回数字都是粗粒度；本文任何「2/4」都不能读成 50%。
2. **场景窄**：refine 轮样本只来自 2 个 pet 场景 3 次 refine；财税 SaaS 场景没有 refine 留档。C/B 在 SaaS 类 coined（fiscore/kuaijihub）上的表现未知——R502 复验必须含 1 次 SaaS 场景 refine。
3. **诚实结构化输出是假设**：§2.3 的 7/11 是「模型如实交代来源」下的结构层结果；真实模型可能为通过核对编一个可拼的来源（结构合法、语义空洞）→ 结构层召回会低于 7/11，缺口由 B 补。反之模型也可能因为被要求写结构而不再瞎编（R497 先例），召回高于预期。两个方向只能生产复验。
4. **白名单漂移**：拟声/后缀表外即拒，新场景（母婴/游戏）的拟声词会被拒，需靠 reasons 计数迭代补表，属可接受的宁缺勿滥。
5. **B 无标签校准**：见 §2.2；上线前必须离线批判。
6. **时延样本 6 次**：P50 估算不是统计量；R502 复验要实测 B 的 TTFT 与总耗时并写进 audit。

## 5. 下一轮（R502）实现清单与生产复验设计

### 5.1 实现清单（C，`apps/web/src/ai.ts`）

- [ ] `ZH_COINED_MEANING_FORMAT` + pinyin 路线格式文案：coined/blend/pinyin 候选必须输出 `sources:[{frag,from}]` 与 `gist`（≤20 字单句）；few-shot 给 woofable / 「木舟」muzhou 两例的结构化版本。
- [ ] `AiCandidate` 加可选 `sources?: {frag: string; from: string}[]`、`gist?: string`（只进 guard，不入 KV 结果、不下发前端）。
- [ ] 移植 `verifyStructured`（原型 `scripts/proto-r501.mjs` §3）到 `ai.ts`，接在 `zhMeaningIncoherent` 之后；白名单 `ZH_ONOMATOPOEIA_ALLOWED` / `ZH_AFFIX_ALLOWED` 独立常量。
- [ ] `GuardDropCounts` 加 `zhStructuredMissing`（字段缺失）、`zhStructuredRejected`；`GuardStats` 加 `zhStructuredReasons?: Record<string, number>`（reason 前缀聚合，不留 label）。
- [ ] 补 `scripts/verify-r502.mjs`：19 条诚实结构化输出 + 6 好例 + 白名单边界 + 字段缺失即拒；`scripts/verify-r496.mjs` 保持全绿（R496 不变）。
- [ ] 流式解析：`sources` 数组在候选 JSON 内部，确认 R466 增量解析器对嵌套数组的截断处理（候选级 `emptyMeaning` 同法丢弃半截候选）。
- [ ] `pnpm -r typecheck` / `pnpm --filter web test` / `pnpm --filter web build` 全绿。

### 5.2 实现清单（B2，R502 只做离线校准，R503 视结果上线）

- [ ] R502：用本标注集 19 条 salad/borderline + 随机 40 条 coherent（固定种子）构造 1 次 B 请求（**1 次授权 AI 调用**，父会话执行），记 B 自身 P/R/误杀；`why` 分布落 `docs/audits/r502/`。达标线（建议）：19 条里 salad 召回 ≥ 8/11、coherent 误杀 ≤ 1/40。
- [ ] R503（若达标）：`ai.ts` 增 `zhSecondPass()`：refine 轮、C 放行、theme ∈ {coined,blend,pinyin}，一批一次；8 s 超时；breaker 共用；`GuardStats.zhSecondPass` 字段（§2.2）；前端无感（候选在二审后统一放行）。

### 5.3 生产复验设计（父会话统一做，本轮 0 次）

| 次 | 场景 | 目的 | 看什么 |
|---|---|---|---|
| 1 | zh 首轮，pet 描述（复用 R496–R499 的 description） | 结构字段遵循率、首轮误杀 | `guard.dropped.zhStructuredMissing` 应为 0；`zhStructuredRejected` 与 `zhStructuredReasons`；对被拒条人工判是否真沙拉；首候选时延对比 R494（2.7–3.9 s）|
| 2 | zh 点踩 refine，pet（点踩 3 个 coined，复现 R494 #04 压力） | 短句沙拉召回 | 放行候选逐条人工标注并入 `build-zh-meaning-labels.mjs`（R502 段）；`zhStructuredRejected` 命中原因分布 |
| 3 | zh 点踩 refine，财税 SaaS | 泛化到非 pet 场景 | 同上 + caiwuhub 型「拼音+英文」的 sources 是否被模型完整声明 |
| (4) | 若 R503 上线 B2：同 2 再跑 1 次 | B 的时延与判决 | `zhSecondPass.{calls,judged,rejected,failed,ms}`；整轮结束时间 vs R494 |

**≥3 次授权 AI 调用**（R503 +1）。零 AI 对账：`docs/audits/*.ndjson` 留档 + `scripts/build-zh-meaning-labels.mjs` 追加 R502 段重建标注集 → `node scripts/verify-r496.mjs` 与 `node scripts/proto-r501.mjs` 数字更新写回本文 §1/§2。

## 6. 验证声明

- [验证] §1 全部分布、§1.3 逐条、§2.1 全部 P/R/误杀、§2.3 结构层 7/11 与好例 6/6：`node scripts/proto-r501.mjs --items` 输出，确定性、0 AI。
- [验证] R496 基线 6/11、误杀 0：`node scripts/verify-r496.mjs`。
- [验证] DeepSeek 价格与 token 换算比：官方页面 2026-09-04 抓取（价格页注明可能调整）。
- [推断] B 的 token 数、成本、P50 增量：换算比估算 + 6 次留档推算，未实测。
- [未验证] B 自身的召回/误杀；C 在真实模型输出上的字段遵循率与误杀率——都需 R502 生产复验。
- 本轮未改 `apps/web/src/ai.ts`；`pnpm -r typecheck` / `pnpm --filter web test` / `pnpm --filter web build` 全绿见 PR。

## 附录 A：260 条逐条特征表（`node scripts/proto-r501.mjs --items`）

字段：来源数 / 可核 / 不可核 = 解析出的来源声明计数；拼合覆盖 = coversLax；严格覆盖 = coversStrict；字母占比 = coverUnion；领域重叠 = assocOverlap（`-` 为无 description）；今日 guard = 现有链首个命中防线。

<details>
<summary>展开 260 行</summary>

| tag | label | theme | refine | 来源数 | 可核 | 不可核 | 拼合覆盖 | 严格覆盖 | 字母占比 | 联想句 | 领域重叠 | 纯联想 | 引号全单字 | 今日 guard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| coherent | qishu | pinyin | N | 5 | 5 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | lexin | pinyin | N | 5 | 5 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| coherent | zhian | pinyin | N | 3 | 3 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | rowth | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | steadyfin | coined | N | 4 | 4 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | finmo | blend | N | 3 | 3 | 0 | Y | Y | 1 | Y | 4 | N | Y | - |
| coherent | hezhang | pinyin | N | 5 | 5 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | zhangshui | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| coherent | caishun | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | shuiheng | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | jizhang | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | yunzhang | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| coherent | shuiji | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | zhangping | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | caisuan | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | zhangshou | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| coherent | shuiwen | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | zsp | pinyin | N | 1 | 1 | 0 | Y | N | 1 | Y | 1 | N | N | - |
| coherent | caiwuhub | blend | N | 1 | 1 | 0 | N | N | 0.63 | Y | 2 | N | N | - |
| coherent | zhangdanhub | blend | N | 1 | 1 | 0 | N | N | 0.73 | Y | 0 | N | N | - |
| coherent | suanshu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | kuaijihub | blend | N | 1 | 1 | 0 | N | N | 0.78 | Y | 1 | N | N | - |
| coherent | zhangwubao | blend | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | fiscore | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | taxnil | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | stewardly | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | ledgurable | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | taxly | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | zhongao | pinyin | N | 1 | 1 | 0 | N | N | 0.71 | N | 0 | N | Y | pinyinMismatch |
| coherent | chongsheng | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | mixgrow | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 7 | N | N | - |
| coherent | waofun | blend | N | 3 | 1 | 2 | N | N | 0.67 | Y | 5 | N | N | phantomEtymology(zhCitesPhantomAscii) |
| coherent | petbao | blend | N | 3 | 3 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | petnuzzle | coined | N | 3 | 3 | 0 | Y | Y | 1 | Y | 7 | N | N | - |
| coherent | maopals | blend | N | 3 | 3 | 0 | Y | Y | 1 | Y | 2 | N | Y | - |
| coherent | chompup | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | wagtail | word | N | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | goubei | pinyin | N | 4 | 4 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | petmunch | coined | N | 3 | 3 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | snackpaw | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | tailwag | word | N | 2 | 2 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| coherent | gouzai | pinyin | N | 4 | 4 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | maoxiong | pinyin | N | 4 | 4 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | treatpup | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | pawfect | coined | N | 3 | 3 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | gougift | blend | N | 3 | 3 | 0 | Y | Y | 1 | Y | 2 | N | Y | - |
| coherent | sniffle | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | maoyumi | pinyin | N | 4 | 4 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | pettreat | word | N | 2 | 2 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | furrybit | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| salad | miaoround | blend | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 0 | N | Y | zhMeaningIncoherent |
| coherent | zhongmao | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | maogoubao | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | aichongjia | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | chonglexin | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | maowuwan | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | zuoyoumao | pinyin | Y | 5 | 5 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | gouchongle | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | maogouqi | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | peibanquan | pinyin | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 6 | N | N | - |
| coherent | maoxiangni | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | chongyoulu | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | goubeizhu | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | pawlab | word | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | tailora | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | woofable | coined | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | chewtopia | coined | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | munchkin | word | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | cuddlepup | word | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | fluffnest | word | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | barkbite | word | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | furbuddy | word | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | nibblenest | word | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | miaowan | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | tuanpaw | blend | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 6 | N | Y | - |
| coherent | kakawo | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | jujubee | blend | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | peiqiu | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| borderline | tuanwan | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 6 | N | N | - |
| coherent | airouding | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | guaguawo | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | woyao | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| borderline | pilloway | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | zhMeaningIncoherent |
| coherent | nuanpa | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | kuaila | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | caomeiwo | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| salad | moggity | coined | Y | 1 | 1 | 0 | N | N | 0.29 | Y | 2 | N | N | zhMeaningIncoherent |
| coherent | guzigroo | coined | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| salad | miafbab | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | N | zhMeaningIncoherent |
| salad | gurgulu | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | zhMeaningIncoherent |
| coherent | nenba | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| borderline | xiwo | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 0 | N | N | zhMeaningIncoherent |
| salad | voralini | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | N | zhMeaningIncoherent |
| salad | hapany | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 0 | N | N | zhMeaningIncoherent |
| coherent | huazhi | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 8 | N | N | - |
| coherent | qingshan | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | muxiang | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 7 | N | N | - |
| coherent | xiaoyuecha | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | lanxiang | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | yujian | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | qingwancha | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | shanshui | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | chayi | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | jingcha | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | xiangyin | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | qiuhe | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | yucha | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 6 | N | N | - |
| coherent | shancha | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | huagu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | muxi | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | yunjian | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | qinghe | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | zhixiang | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | hemu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | yechun | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | shanwaicha | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | yuexiacha | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | linyuqing | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | muxiuyuan | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | qingzhuyin | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | yuncuixin | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | yuejunshan | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | shancuixiang | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | yunwuchun | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | qingmuxia | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | warmwoof | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | treatpal | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | pawwoo | coined | N | 3 | 3 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | chongsheng | pinyin | N | 3 | 3 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | miaowoo | coined | N | 3 | 3 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | niwan | pinyin | N | 3 | 3 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | petmom | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 6 | N | N | - |
| coherent | zhuaye | pinyin | N | 3 | 3 | 0 | Y | Y | 1 | Y | 4 | N | Y | - |
| coherent | mianwo | pinyin | N | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | xiaowancan | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | kuaihuo | pinyin | N | 3 | 3 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | rougan | pinyin | N | 3 | 3 | 0 | Y | Y | 1 | Y | 6 | N | N | - |
| coherent | chongle | pinyin | N | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | maofeiyu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | gougoule | pinyin | N | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | munchkin | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | sniffeat | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | chewaboo | coined | N | 2 | 2 | 0 | Y | Y | 0.88 | Y | 4 | N | N | - |
| coherent | petnosh | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | furrybon | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | wigglepaw | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | nibblesnack | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | glowpaw | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | zoobee | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | pawlett | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | chompkin | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | purrloom | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| coherent | barkbun | coined | N | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | N | - |
| coherent | aipet | blend | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| borderline | ongo | coined | Y | 3 | 2 | 1 | Y | Y | 1 | Y | 4 | N | Y | - |
| coherent | cuddl | coined | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| coherent | maoziyo | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 2 | N | Y | - |
| borderline | pingo | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | maofei | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 0 | N | Y | - |
| coherent | ziniao | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 2 | N | Y | - |
| coherent | gouling | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | Y | - |
| coherent | mofeel | blend | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 4 | N | Y | - |
| coherent | nobbly | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | quanshen | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | Y | - |
| salad | maoga | blend | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | Y | - |
| borderline | lino | coined | Y | 0 | 0 | 0 | N | N | 0 | Y | 2 | Y | N | - |
| salad | tuoguo | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 0 | N | Y | - |
| coherent | rexba | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| borderline | mouxiong | pinyin | Y | 1 | 1 | 0 | Y | Y | 1 | Y | 0 | N | N | - |
| borderline | xuanwa | blend | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 1 | N | Y | - |
| salad | zora | coined | Y | 0 | 0 | 0 | N | N | 0 | Y | 2 | Y | N | - |
| coherent | xunhuan | pinyin | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | tuantuan | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | weini | pinyin | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | tokipet | blend | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | zhuazhua | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | mengchong | pinyin | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | snackle | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | woofan | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | qinzi | pinyin | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | bibei | pinyin | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | treatsy | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 5 | N | N | - |
| coherent | huanwan | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | maomao | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | wowo | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | chibei | pinyin | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | sniffle | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | mimi | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | kuaile | pinyin | Y | 3 | 3 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | zengzeng | pinyin | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 3 | N | N | - |
| coherent | chewy | coined | Y | 2 | 2 | 0 | Y | Y | 1 | Y | 4 | N | N | - |
| coherent | haowan | pinyin | Y | 4 | 4 | 0 | Y | Y | 1 | Y | 2 | N | N | - |
| coherent | tibeirock | coined | Y | 1 | 0 | 1 | N | N | 0 | Y | - | N | N | phantomEtymology(zhCitesPhantomAscii) |
| coherent | kinwalk | coined | Y | 1 | 1 | 0 | N | N | 0.43 | Y | - | N | N | phantomEtymology(zhCitesPhantomAscii) |
| salad | duanyou | pinyin | Y | 2 | 0 | 2 | N | N | 0.14 | N | - | N | N | phantomEtymology(zhCitesPhantomAscii) |
| salad | youse | coined | Y | 0 | 0 | 0 | N | N | 0 | Y | - | Y | N | - |
| coherent | shuqi | pinyin | N | 1 | 0 | 1 | N | N | 0.6 | Y | - | N | N | pinyinMismatch |
| coherent | pinen | pinyin | N | 1 | 0 | 1 | N | N | 0.6 | Y | - | N | N | pinyinMismatch |
| coherent | yunmu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | ym | pinyin | N | 1 | 1 | 0 | Y | N | 1 | N | - | N | N | - |
| coherent | ymu | pinyin | N | 2 | 2 | 0 | Y | N | 1 | N | - | N | N | - |
| coherent | yunm | pinyin | N | 2 | 2 | 0 | Y | Y | 1 | N | - | N | N | - |
| coherent | zhh | pinyin | N | 3 | 3 | 0 | Y | N | 1 | N | - | N | N | - |
| coherent | yunhub | pinyin | N | 2 | 2 | 0 | Y | Y | 1 | Y | - | N | Y | - |
| coherent | muzhou | pinyin | N | 2 | 1 | 1 | Y | Y | 1 | N | - | N | N | - |
| coherent | muzhou | blend | N | 4 | 4 | 0 | Y | Y | 1 | Y | - | N | Y | - |
| coherent | plangrow | blend | N | 2 | 2 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | chapu | blend | N | 0 | 0 | 0 | N | N | 0 | Y | - | Y | N | - |
| coherent | shanquan | blend | N | 3 | 3 | 0 | Y | Y | 1 | Y | - | N | Y | - |
| coherent | scirio | blend | N | 3 | 2 | 1 | Y | Y | 1 | Y | - | N | N | - |
| coherent | lumora | blend | N | 3 | 2 | 1 | N | N | 0.5 | Y | - | N | N | - |
| coherent | crousti | blend | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | brioche | blend | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | yunji | blend | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | kuaidao | blend | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | yanxi | blend | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | yancha | blend | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | shanhe | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | botu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | wenbu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | lvyu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | yuncu | pinyin | N | 1 | 1 | 0 | Y | N | 0.8 | Y | - | N | N | pinyinMismatch |
| coherent | ycui | pinyin | N | 2 | 2 | 0 | Y | N | 1 | Y | - | N | N | - |
| coherent | tangfang | pinyin | N | 1 | 0 | 1 | Y | Y | 0.88 | Y | - | N | N | pinyinMismatch |
| coherent | muzhou | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | breza | pinyin | N | 1 | 0 | 1 | N | N | 0 | Y | - | N | N | phantomEtymology(citesPhantomWord) |
| coherent | haoming | coined | N | 0 | 0 | 0 | N | N | 0 | Y | - | Y | N | - |
| coherent | plangrow | coined | N | 2 | 2 | 0 | Y | Y | 0.88 | Y | - | N | N | phantomEtymology(citesPhantomWord) |
| coherent | hunhe | coined | N | 0 | 0 | 0 | N | N | 0 | Y | - | Y | N | metaLanguage |
| coherent | yiwen | coined | N | 0 | 0 | 0 | N | N | 0 | Y | - | Y | N | questionMark |
| coherent | moyu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | moxu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | cencun | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | zazhi | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | yaolan | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | zhizhou | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | heyue | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | xinghe | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | muzhou | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | chali | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | shuyou | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | biji | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | yuedu | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | jingxin | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | manshenghuo | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | chayuan | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | heshan | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | yunqi | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | susheng | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | wenzhai | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | shuzhai | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | moxiang | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | chaxi | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | muzhou | pinyin | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | muyuan | pinyin | N | 5 | 5 | 0 | Y | Y | 1 | Y | - | N | Y | - |
| coherent | murory | pinyin | N | 2 | 2 | 0 | Y | Y | 1 | Y | - | N | N | questionMark |
| coherent | muyuan | pinyin | N | 3 | 3 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | yunduan | rule | N | 1 | 1 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | yunduanhub | rule | N | 3 | 3 | 0 | Y | Y | 1 | Y | - | N | N | - |
| coherent | zhiyue | rule | N | 5 | 5 | 0 | Y | Y | 1 | Y | - | N | N | - |

</details>
