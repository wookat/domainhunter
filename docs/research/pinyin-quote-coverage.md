# 拼音「」引用对 label 的覆盖关系调研（R497，R494 审计 P2-1 / P2-2 / zh blend 2 字母 ASCII）

> 数据：`docs/audits/r494/ai-search-0{1..6}.ndjson` 全部 `proposed` 事件（离线回放，0 次生产 AI 调用）。
> 统计脚本逻辑已固化为 `scripts/verify-r497.mjs`（准入链回放）与 `apps/web/src/ai-guards-r497.test.ts`（单元正反例）。
> 标注：R494 §4.1 表（12 条拼音候选人工逐条核对，11 ✓ / 1 ✗）+ 本轮对 zh 非拼音候选、EN 候选的人工复核。

## 1. 样本分布

| 项 | 数 |
|---|---|
| 候选总数 | 137（zh 125 / en 12） |
| zh theme | pinyin 77 · coined 26 · blend 12 · word 10 |
| zh 含「」中文引用 | 89（pinyin 77 · blend 11 · coined 1） |
| zh 引用形态（pinyin 77） | 多字引用 73 · 单字+多字混合 3 · **仅单字 1（zhongao）** |

### 1.1 引用拼音串对 label 的覆盖（取每条候选覆盖最好的一个引用）

「fullCover」= 引用逐字全拼（含多音字/ü 变体）拼接恰等于 label；「partialCover」= 拼接是 label 子串但不等于 label；「zeroCover」= 引用没有任何读音出现在 label 里（通常引用的是中文寓意词而非拼音来源，如「财务枢纽」caiwuhub）。

| theme | fullCover | partialCover | zeroCover | noQuote |
|---|---|---|---|---|
| pinyin (77) | 75 | 1 (**zhongao**) | 1 (zhian「智安」，读 zhi'an，切分即全覆盖，见 §1.2) | 0 |
| blend (12) | 1 | 5 | 5 | 1 |
| coined (26) | 0 | 1 (guzigroo「咕吱」) | 0 | 25 |
| word (10) | 0 | 0 | 0 | 10 |

### 1.2 「不声称全拼且引用只覆盖 label 一部分」的逐条判定

| label | theme | 引用 | 剩余音节 | 剩余音节来源 | 判定 |
|---|---|---|---|---|---|
| **zhongao** | pinyin | 「忠」zhong | `ao` | **无**（meaning 全文「「忠」。」） | **非法（唯一 zhongao 型）** |
| zhian | pinyin | 「智安」 | — | 全拼 zhi+an 恰等于 label（统计脚本把 zhi'an 的 `an` 算作子串命中，属统计口径问题，guard 判 fullCover） | 合法 |
| finmo | blend | 「模」mo | `fin` | meaning 明写 `fin 明指财务` | 合法（英文第二来源） |
| maopals | blend | 「猫」mao | `pals` | `pals 朋友` | 合法 |
| gougift | blend | 「狗」gou | `gift` | `gift 礼物` | 合法 |
| tuanpaw | blend | 「团」tuan | `paw` | `paw 是猫咪狗狗的肉爪` | 合法 |
| miaoround | blend | 「喵」miao | `round` | `「round」是团圆…` | 合法 |
| jujubee | blend | 「橘橘蜜」 | `bee` | `bee 是嗡嗡陪伴` | 合法（引用是寓意词，juju+bee 均点名） |
| guzigroo | coined | 「咕吱」guzi | `groo` | `groo 是呜呜呻吟的喉音` | 合法 |
| caiwuhub / zhangdanhub / kuaijihub | blend | 「财务枢纽」等 | `hub` | `拼音加英文组合` | 合法（引用是寓意词，拼音部分全覆盖） |

**结论**：partial/zero-cover 共 13 条，其中合法 12 条（全部有英文/拟声第二来源且在 meaning 中点名），zhongao 型「无任何来源解释剩余音节」1 条。合法的 12 条全部 theme≠pinyin（blend/coined）。

### 1.3 R494 P2-1 根因更正

R494 报告写的是「未出现『全拼』→ 走宽松分支放过」。**实测不成立**：`QUOTED_CJK_RE` 最少匹配 2 个汉字，`「忠」` 根本没进入 `pinyinQuoteMismatch`，函数因 `judged === 0` 直接返回 false——是**单字引用整体跳检**，与「全拼」声明无关。R239 P2-1 同路径复现的真正原因即此。规则设计据此调整为「补上单字引用的覆盖切分」，而不是改宽松分支（宽松分支的首字母组合语义 R244 已有正反例护栏，不动）。

## 2. 规则设计

### 2.1 P2-1 `pinyinQuoteMismatch`（theme=pinyin 才调用，计数 `pinyinMismatch`）

保留原两个分支不变：多字引用 → 「全拼」声明严格 / 未声称宽松（全拼或首字母/首声母逐字组合等于 label）；任一多字引用命中即放行，全部不中即拒绝。

**新增分支**（仅在 meaning 没有任何多字引用、但有 ≥1 个单字引用时生效）：

```
pieces = ∪ 每个单字引用的读音贡献（全拼各读音 + ü 变体；未声称「全拼」时再加首字母/首声母）
       ∪ meaning 中独立 ASCII 片段（长度 ≥2、是 label 真子串；不紧邻带变音符号的字母，避免 xīng → x/ng）
mismatch = 不能用 pieces 从左到右完整切分 label（片段可重用，叠字「咕」→ gugu 可切）
```

- fail-closed 只发生在「剩余音节无任何来源」：zhongao 的 pieces={zhong,z,zh}，`ao` 切不出 → 拒绝。
- 第二来源被点名即放行：`「云」+ hub` → yunhub（R244 历史正例）pieces={yun,y,hub}。注意 theme=pinyin 的候选本来就要求 label 为纯拼音（`pinyinInvalid`），所以「拼音+英文」型实际只在 blend 路径出现、不经过本 guard；单字规则对 blend/coined 无影响（theme 门控）。
- 表外字（GB2312 外）不提供 pieces，与多字引用的保守拒绝语义一致。

### 2.2 P2-2 `citesPhantomWord`（计数 `phantomEtymology`）

- 句式覆盖：原 `EN_LEADING_PAIR_RE`（句首 `X + Y`）扩为 `[+×]`；新增 `EN_PAIR_COLON_RE = /\b(X)\s*[+×]\s*(Y)\s*[:：]/g` 覆盖句中/句首 `X + Y:` / `X+Y:` / `X × Y：`。**冒号收尾才算构词声明**，普通句子里的 `a + b` 不判（避免误杀）。
- `pairMismatch` 的「两词都只有片段命中」分支从「保守放行」改为**可切分校验** `partialPairSegmentable`：label 必须能切成「头词前缀（≥3 字母）+ 尾词的前缀或后缀（≥2 字母）」，两片段可共享字母，两种词序都试。
  - complainter ← commit + planner：头前缀只能是 `com`，剩余 `plainter` 不是 planner 的前缀/后缀 → 拒绝。
  - serenquil ← serene + tranquil（seren+quil）、serenell ← serenity + bell（seren+ell）→ 放行。
- R246 既有「一词整词命中 + 另一词与剩余片段互为前缀」（plan→planner 型词干截断）分支原样保留：habitplan ← habit + planner、verbloom ← verb + bloom 放行。

### 2.3 zh blend 2 字母 ASCII `zhCitesPhantomAscii`（计数 `phantomEtymology`）

原 `[a-z]{3,}` 不动；新增 `ZH_ASCII_SHORT_RE = /(?<![a-z0-9\u00c0-\u024f])[a-z]{2}(?![a-z0-9\u00c0-\u024f])/g`：

- 只取**独立** 2 字母 token（两侧不紧邻字母/变音字母/数字）——`xiǎo yuè chá` 里的 `xi`/`yu`/`ch`、`3d` 的 `d` 不会被当作引用；
- 是 label 子串即放行（`ai`/`yu`/`le`/`qi` 等真实存在的短串不受影响）；
- 白名单排除常见缩略词/虚词（ai vr ui ux pc tv hr it io ip id os … of or in to is an at by on up …）——这些在 zh meaning 中是点题不是引用；
- 仍要求任一侧紧邻 CJK 文字/标点（纯英文句不判）。

## 3. 标注样本上的精确率 / 召回率与误杀清单

### 3.1 P2-1（pinyin theme，77 条；标注：R494 §4.1 人工核对 11 ✓ + zhongao ✗，其余 65 条 R494 §4.1 注「#6 全部 31 条逐条核对均正确」及本轮复核无异常）

| | 判 mismatch | 判通过 |
|---|---|---|
| 真·非法（1） | **1（zhongao）** | 0 |
| 真·合法（76） | **0** | 76 |

精确率 1/1 = 100%，召回率 1/1 = 100%；**误杀清单：空**。历史护栏 `scripts/verify-r244.mjs`（全拼严格/宽松/多引用任一命中/yunhub 单字引用放行/表外字）与 `verify-r222.mjs` 全 PASS。

### 3.2 P2-2（EN 12 条 + 全部 zh 候选的 `citesPhantomWord` 独立判定）

| | 判 phantom | 判通过 |
|---|---|---|
| 真·非法（1：complainter） | **1** | 0 |
| 真·合法（EN 11 + zh 125） | **0** | 136 |

误杀清单：空。EN 11 条上线候选（calmroot / trustloop / serenell / focusly / anchor / harborly / quietloop / tranquilix / serenusly / firmhabit / stillvigil）全部通过准入。`verify-r196 / r246` 全 PASS。

### 3.3 2 字母 ASCII（zh 125 条）

zh meaning 中处于 CJK 语境的独立 2 字母 token 共 33 个，其中 14 个是带变音符号拼音（`xiǎo yuè chá` 等）里被截出的 `ng`/`sh`/`ch`/`xi`/`yu`/`ji`/`hu`/`zh`，新正则因变音字母紧邻不视为 token；余 19 个独立 token：`qi le an mo he ly ly wo up le ai le wu le qi ni lu ty ha`——**19 个中 18 个是 label 子串，仅 `wo`（waofun）不在 label 中**，白名单在本样本上没有独立作用（`ai`/`up` 同时也是 label 子串），它是对生产 meaning 常见点题词（AI/VR/of…）的预防。

| | 判 phantom | 判通过 |
|---|---|---|
| 真·非法（1：waofun） | **1** | 0 |
| 真·合法（124） | **0** | 124 |

误杀清单：空。

### 3.4 准入链回放总表（`scripts/verify-r497.mjs`，30 项全 PASS）

- 3 坏例：zhongao → `pinyinMismatch`；complainter / waofun → `phantomEtymology` ✓
- §4.1 11 条正确拼音候选：0 条被 `pinyinMismatch`/`phantomEtymology` 丢弃 ✓
- 11 条上线 EN 候选（除 complainter）：全部 admitted ✓
- 其余 123 条 zh 候选：0 条被两字段新拦 ✓
- `GuardDropCounts` 无新增字段 ✓

## 4. 已知边界 / 未验证

- 单字规则的宽松模式允许首字母作为 piece，理论上可能让「引用 n 个单字 + 恰好只用首字母」的短 label 通过（与 R244 多字引用宽松分支同等宽松度，非本轮新增风险）。
- 样本仅 6 份 NDJSON（137 条），未覆盖 R239 v4 的原始候选（该轮 fixture 不在本分支）；历史 verify 脚本中的正反例作为补充回归。
- 2 字母白名单为人工枚举；若生产 meaning 出现白名单外的合法 2 字母缩略词（如产品名缩写）且不在 label 中，会被判 phantom——建议父会话生产复验时（≤1 次 AI）关注 zh blend/coined 的 `phantomEtymology` 增量是否 >0，并核对被拦条目的 meaning。
- harborly（blend 实为 word+-ly，R494 P3）不在本轮范围，留 R499 theme 归一处理。
