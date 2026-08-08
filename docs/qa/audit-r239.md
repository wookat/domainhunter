# R239 · AI 猎名质量审计 v4（生产站 · 首轮 guard 定量审计）

- 日期：2026-08-08（UTC 17:30–18:10）
- 对象：https://hunt.zalize.com `/api/ai-search`（deploy/r192-r195 版本 + R222–R225 v3 修复 + R238 guard 可观测性）
- 上一轮基线：R218 AI 猎名质量审计 v3（4 个 P2 已由 R222–R225 修复上线）
- 方法：CDP 连接生产站真实 UI，页面内 `fetch` tee 捕获完整 NDJSON 流（`res.body.tee()`），逐轮解析 R238 guard 元数据；全量 269 条候选逐条人工质检；RDAP 抽验；usage 前后核销
- 预算纪律：授权 8 次 AI 调用，实际执行 **7 次**（zh 首搜 ×3、en 首搜 ×2、refine ×2）

## 0. usage 预算证据（/api/usage，测试前后全量三日表）

| 日期 | 前 searches/fast/refine | 后 searches/fast/refine | byTld 前 | byTld 后 |
|---|---|---|---|---|
| 2026-08-08 | 32 / 22 / 10 | **39 / 27 / 12** | com32 cn15 io13 | **com39 cn22 io13** |
| 2026-08-07 | 16 / 12 / 4 | 不变 | com16 cn7 ai2 | 不变 |
| 2026-08-06 | 24 / 9 / 15 | 不变 | com24 cn18 ai2 | 不变 |

增量 = searches +7、fast +5、refine +2、com +7、cn +7、io +0 —— 与实际执行（5 次首搜全部 fast + 2 次 refine；7 次全部默认 com+cn 双 TLD）**逐项精确相等**。前抓取 17:22 UTC、后抓取 17:52 UTC（带 cache-buster）。

## 1. 七次调用总览

| # | 场景 | UI 语言 | 描述要点 | 轮数 | 候选 | theme 分布 | 可注册 |
|---|---|---|---|---|---|---|---|
| zh1 | zh 商业描述 | zh | 手工烘焙工作室·法式甜点·下午茶 | 2 | 31 | pinyin15 word12 coined4 | 12 ✓达标 |
| zh2 | zh 偏拼音 | zh | 双字全拼·知乎豆瓣气质·山水诗词社区 | 5 | 75 | pinyin75 | **1**（目标 10） |
| en1 | EN 场景 1 | en | privacy-first finance tracker | 2 | 26 | blend21 coined5 **word0** | 28 ✓ |
| en2 | EN 场景 2 | en | uptime/cron monitoring for solo devs | 2 | 16 | coined9 blend6 word1 | 18 ✓ |
| ref1 | EN 点踩 refine | en | 点踩 ledgerly/finchly（-ly 后缀 blend） | 1 | 8 | blend4 coined3 word1 | 10 ✓ |
| zh3 | zh 商业（供 ref2） | zh | 岩茶白茶订阅电商·山场气息 | 5 | 75 | pinyin75 | **1**（目标 10） |
| ref2 | ZH 点踩 refine | zh | 点踩 yanweng（岩 yan- 词根） | 4 | 38 | pinyin32 coined3 blend3 | 11 ✓ |

全程 **0 error 事件、0 空轮**；en2 观测到 `retries=1`（退避重试成功，主结果未受影响）。

## 2. guard 防线定量分析（R238 元数据，21 个 proposed 事件全部带 guard）

生成总量 375 条（269 保留 + 106 丢弃），**总拦截率 28.3%**。各防线：

| 防线 | 拦截数 | 占丢弃 | 备注 |
|---|---|---|---|
| meaningIncoherent | 35 | 33% | 全部在 EN 场景；refine/反思轮尤重（ref1 单轮 15/24=62%、en2 r2 14/28=50%） |
| charsetViolation | 24 | 23% | **全部集中在 zh2 round2 一轮**——整轮 24 条全灭（见 P2-2） |
| dislikedMorphology | 20 | 19% | ref2 19 + ref1 1，R225 防线正例（见 §4） |
| brandCollision | 13 | 12% | 分散各场景，无异常 |
| metaLanguage | 6 | 6% | zh3/en1 各 2–3 条 |
| pinyinMismatch | 5 | 5% | R222 防线正例：zh2/zh3/ref2 各有命中 |
| phantomEtymology | 3 | 3% | 全部在 en2 round1 |
| invalidLabel / emptyMeaning / questionMark / pinyinInvalid | 0 | — | 未触发 |

- **wordSupplement 触发率：2/2 EN 首搜均触发（100%），且两次补发后 word 仍为 0**（见 P1-1）。
- retries：1/21 轮（en2 r2），重试后正常出结果。
- EN 首搜 round1 拦截率异常高：en2 r1 仅 3/8 存活（phantomEtymology 3 + meaningIncoherent 2），首屏体验受损。

## 3. 全量候选人工质检（269 条逐条，与 guard 交叉验证）

### 3.1 拼音引用与 label 一致性（R222 复验）
- 防线正例：pinyinMismatch 共拦 5 条，流内无 R195 tangfang 型「声称全拼且错配」漏网。
- **漏网 3 条（均为「全拼」声明缺失 → 校验整体跳过，见 P2-1）**：
  - zh2 r3 `shuqi`「漱石」——石=shi（**表内常用字**），漱石=shushi ≠ shuqi，meaning 未含「全拼」二字 → `FULL_PINYIN_CLAIM_RE` 门槛未过，校验未运行；
  - ref2 r1 `pinen`「品芩」——芩=qin，品芩=pinqin ≠ pinen，同样无「全拼」声明；
  - ref2 r1 `duanyou`「韫岩」——引用词与 label 完全无关（韫岩≈yunyan），且 meaning 含「wrin 前缀强调直结声」类胡话。
- R218 P2-1（表外字击穿）未再出现——R222 扩表生效；但绕过路径转移到了「不声称全拼」。

### 3.2 臆造词源 / 元语言 / 胡话
- 「取自」幻影词源（R196 防线）：269 条中 0 违规，防线持续成立。
- **ZH refine 轮出现「引用幻影 ASCII 串」新形态（P2-4）**：ref2 r1 `tibeirock` meaning 称「tedeck 落音笃定」（label 无 tedeck）、`kinwalk` 称「kino 指尖溜过石板」（无 kino）、`duanyou` 称「wrin 前缀」（无 wrin）——三条均无 取自/源自/结合 句式，`citesPhantomWord` 的正则句式门未覆盖，全部上线。
- 元语言：0 条裸泄漏（R218 P3-1 的裸 "pinyin" 未再现）。

### 3.3 EN meaning 词语沙拉（R196 防线复验）
- 首搜（en1+en2，42 条）：硬沙拉 0 条，全部主谓完整。
- **refine 轮（ref1，8 条存活）：硬沙拉/胡话 3 条 + 边缘 1 条（~37% 硬），穿透原理与 R218 P2-2 同源但换了锤点（P2-3）**：
  - `ancryst`「first layer from an upstroke inclining—stem anchors data sharp, darning current quickly」——完全不成句；label 前缀 anc 命中实词 "anchors" 过 A 锤，"anchors" 兼作谓语过 B 锤；
  - `oparior`「From opairein, Greek for to open avenues—…a hidden way to lift hands over the table」——幻觉希腊词源 + 语义崩坏；前缀 opa 命中 "opairein"（幻觉词本身成了锤点）；
  - `lintow`「firm knot remains unbraided but reads readable rune」——后半崩坏；前缀 lin 命中 "linen"；
  - 边缘：`dawnwise`「wise keeps the mind **unlaunted**」——臆造英文词，无词典校验。
- guard 交叉验证：ref1 该轮 meaningIncoherent 已拦 15/24（防线在工作），漏网的恰是「label 3 字母前缀撞上 meaning 里任意实词」的路径——与 R218 的停用词穿透互为孪生。

### 3.4 theme 标注与占比
- zh 拼音系占比：zh1 48%（含 word 路线法语词，符合法式甜点语境）、zh2 100%、zh3 100%、ref2 84% —— ZH ≥40% 软配额全部达标 ✓。
- **EN word 路线 0/2 轮达标**：en1 全程 word=0（26 条），en2 仅 round1 1 条 word（watchful）；「四路线覆盖」在 blend/coined 上严重偏科（en1 r2 blend 19/20）。
- theme 标注硬规则执行不严（R218 P3-3 复现）：ref1 `nundina` 标 word（拉丁词 nundinae 变体，非英文词典词，应为 coined）；en2 `canaryio` label 内嵌 "io" 后缀造成 canaryio.com 观感怪异。
- 低质造型：en1 r1 `ledgeledger`（同词根叠拼）；ref2 r1 `duanyou`/`tibeirock`（引用与 label 脱节）。

### 3.5 品牌撞名
`isBrandCollision` 拦 13 条；存活候选中未见知名品牌同名/近名。边缘观察：zh3 `wuyishan`（地理标志名，商标注册风险自负）、zh1 `brioche`/`caramel`（通用词品牌性弱），记观察项。

## 4. 点踩 refine（R225 v3 修复复验——本轮重点）

- **EN（ref1）**：点踩 ledgerly/finchly（-ly 后缀）后，guard `dislikedMorphology=1`（prompt 级规避已挡住大部分，硬过滤兜底再拦 1），产出 8 条中 **0 条 -ly 后缀** ✓（R218 P2-4 的 gleanix 型违规未再现）。
- **ZH（ref2）**：点踩 yanweng（岩 yan- 词根）后，3 轮 refine `dislikedMorphology` 共拦 **19 条**（7+7+5——模型仍在大量产 yan- 词根，全被硬过滤兜底吃掉），产出 38 条中 **0 条 yan- 前缀词根** ✓。
- 结论：**R225 双层修复成立**；但模型 prompt 级规避依从性仍差（19/57≈33% 的 refine 产出撞点踩形态、靠后处理兜底），token 效率有损耗，记 P3 观察。
- 跨轮去重：ref1 vs en1、ref2 vs zh3 逐一比对 **0 重复** ✓。

## 5. RDAP 可注册真实性抽验（6/6 通过）

对流内标记 available 的候选跨场景抽 6 个，rdap.org 跟随重定向核验（404=未注册）：

| 域名 | 来源 | RDAP | | 域名 | 来源 | RDAP |
|---|---|---|---|---|---|---|
| ledgeledger.com | en1 | 404 ✓ | | yanweng.cn | zh3 | 404 ✓ |
| closettax.com | en1 | 404 ✓ | | songcun.cn | zh2 | 404 ✓ |
| sucrabond.com | zh1 | 404 ✓ | | crousti.cn | zh1 | 404 ✓ |

## 6. zh UI「本轮过滤 N 个低质候选」文案实拍（R218 遗留补拍）

zh2 第 1 轮实拍「构思 14 个候选 · **本轮过滤 1 个低质候选**」、zh3 第 1 轮实拍「构思 8 个候选 · **本轮过滤 4 个低质候选**」（截图见 `docs/qa/screenshots-r239/`），文案渲染正确，数字与流内 guard `droppedTotal` 一致 ✓。

## 7. 发现分级（P0–P3）

无 P0。

| 级别 | 编号 | 发现 | 指向 |
|---|---|---|---|
| P1 | P1-1 | **EN word 配额补发（R224）2/2 全数失效**：两次 EN 首搜 round2 均 `wordSupplement=true` 触发补发，但补发后整轮 word 仍为 0（en1 全程 word=0）。补发候选与主轮共用同一 guard 过滤链（EN meaning 红线/连贯性），word 隐喻词 meaning 天然短句式易被拦，且补发仅 1 次、无结果校验，失败静默 | `ai.ts generateAiCandidates` R224 段 / `mergeWordSupplement`；建议补发结果为 0 时二次重试或放宽补发轮 meaning 锤点，并在 guard 里区分补发轮丢弃计数 |
| P2 | P2-1 | 拼音引用校验被「不声称全拼」绕过：shuqi「漱石」（石为表内字、拼写错配）、pinen「品芩」、duanyou「韫岩」3 条上线。R222 修了表外字击穿，但 `FULL_PINYIN_CLAIM_RE` 门槛让不写「全拼」二字的候选整体跳检 | `ai.ts pinyinQuoteMismatch`；建议 theme=pinyin 且「」引用词存在时即校验（把「全拼」声明从必要条件改为加严条件） |
| P2 | P2-2 | zh2 round2 **整轮 24 条全灭于 charsetViolation**，5 轮仅猎得 1 个可注册。推断（guard 只计数不留内容，无法直接确认）：偏拼音需求诱发模型在 meaning 里写带声调拼音（shān 型 Latin Extended-A 字符），而 `ZH_MEANING_ALLOWED_RE` 白名单不含 \u0100-\u017f → 合法内容被整轮误杀 | `ai.ts ZH_MEANING_ALLOWED_RE`；建议 zh 白名单纳入 Latin Extended-A + \u01cd-\u01dc（拼音声调字符），或 charsetViolation 时保留首个坏例样本入 guard |
| P2 | P2-3 | EN refine 轮胡话未清零（3/8 硬 + 1 边缘）：`enMeaningIncoherent` 的「label 3 字母前缀命中任意实词」锤点被 anchors（ancryst）、opairein（oparior，幻觉词自证）、linen（lintow）击穿；臆造英文词（unlaunted）无词典校验 | `ai.ts enMeaningIncoherent` 前缀匹配段；建议前缀锤点要求命中词与 label 的公共前缀 ≥4，或对 coined 候选要求锤点必须是「From/roots」句式内的词 |
| P2 | P2-4 | ZH refine 轮「幻影 ASCII 引用」新形态：tedeck（tibeirock）、kino（kinwalk）、wrin（duanyou）——meaning 引用 label 中不存在的 ASCII 串但不带 取自/源自 句式，`citesPhantomWord` 正则门未覆盖，3 条全部上线 | `ai.ts citesPhantomWord / ZH_SOURCE_CITE_RE`；建议 zh meaning 中出现的独立 ASCII 词（非 label、非白名单语言词）直接判臆造 |
| P3 | P3-1 | guard 无法区分主轮与补发轮丢弃、charsetViolation 不留样本——本轮两处关键定性（P1-1、P2-2 成因）只能推断。可观测性可加：补发轮独立计数 + 每防线首个坏例截断样本 | `ai.ts GuardStats` / `worker.ts` proposed 事件 |
| P3 | P3-2 | refine 轮模型点踩依从性差：ref2 三轮 33% 产出撞点踩形态全靠 R225 硬过滤兜底，token 有效率损耗 | `ai.ts buildRefineHint`（prompt 级）观察项 |
| P3 | P3-3 | theme 标注不严复现：nundina（拉丁词）标 word；canaryio 内嵌 io 后缀；ledgeledger 叠词低质 | `ai.ts` theme few-shot 观察项 |
| P3 | P3-4 | zh 偏拼音场景产品结果差：zh2/zh3 均 5 轮打满仅 1 个可注册（双字全拼 .com/.cn 存量枯竭），38–48 秒等待换 1 个结果，建议偏拼音需求下自动扩 TLD 或提前提示 | `worker.ts MAX_ROUNDS` / 产品层观察项 |

## 8. 与 R218 v3 基线逐项对比

| 审计项 | R218 v3 | R239 v4 | 结论 |
|---|---|---|---|
| 拼音引用一致性（R222 修复） | 表外字击穿 1 例 | 表外字 0；「不声称全拼」绕过 3 例 | **修复生效，绕过路径转移**（P2-1） |
| EN word 配额（R224 修复） | word 1/2 轮为 0 | 补发触发 2/2 但 word 仍 0/2 轮达标 | **修复未达目标**（P1-1） |
| disliked 形态规避（R225 修复） | 2/2 违规（moyu/gleanix） | 2/2 零违规，硬过滤拦 20 条 | **修复成立** ✓ |
| EN 词语沙拉 | 首搜 0%、refine ~4% 硬 | 首搜 0%、refine ~37% 硬（存活基数小） | **refine 轮劣化，锤点换形态穿透**（P2-3） |
| 「取自」幻影词源 | 0 违规 | 0 违规；zh 幻影 ASCII 引用新形态 3 例 | **原防线成立，新形态**（P2-4） |
| 元语言泄漏 | 1 条裸 pinyin（P3） | 0 条 | **成立** ✓ |
| refine 非空 / 跨轮去重 | 通过 | 通过（0 error、0 重复、retries=1 自愈） | **通过** ✓ |
| RDAP 真实性 | 6/6 | 6/6 | **通过** ✓ |
| usage 预算核销 | 精确相等 | 精确相等（+7/+5/+2） | **通过** ✓ |
| guard 可观测性（R238 新） | — | 21/21 轮均带 guard；两处盲区（P3-1） | **首轮定量审计可用** ✓ |

原始 NDJSON（zh1/zh2/zh3/en1/en2/ref1/ref2.ndjson）、usage 快照、rdap-check.txt 与全量候选清单留存于审计会话。
