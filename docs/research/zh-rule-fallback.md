# R489 · AI 不可用时中文寓意 → 拼音/混搭候选的规则降级路线：横评与设计论证

- 日期：2026-09-04
- 基线：`deploy/r192-r195` tip `8351a69`（含 R471–R477 quota fallback / 熔断）
- 方法：全程 0 AI 调用。用 esbuild 把 `apps/web/src/rule-fallback.ts` 与 `ai.ts` 打成纯函数包，离线跑 10 个典型中文寓意输入（`node scripts/bench-zh-rule-fallback.mjs --md --labels`），不触发生产或本地 `/api/ai-search`。
- 背景：DeepSeek 额度耗尽已持续多日，生产 `/api/ai-search` 实际走 R471 规则降级（`fallback reason=quota / quota-breaker`），真实用户现在体验到的"猎名"主路径 = 本文评估的规则引擎产出。

## 1. 现状：降级路线现在对中文输入做了什么

入口：`apps/web/src/worker.ts` 首轮 LLM 报 quota / rate-limit / upstream / network（或熔断键 `dh:llm-breaker:v1` 生效）→ `generateRuleCandidates(rawDescription, lang, guard, tried)` → 每条 `admitRuleCandidate`（与 LLM 候选完全相同的防线：label 合法性 / 品牌撞名 R180 / meaning 字符集 R179 / 幻影引用 R183·R246 / 元词 R183）→ 既有 RDAP/DNS 核验流水。

`apps/web/src/rule-fallback.ts`（R471）对中文输入的处理链：

1. **抽词**：每段连续汉字先整词剪掉 `ZH_STOP_WORDS`（平台/工具/智能/科技…），再按 **2 字滑窗** 取词；两字都必须在 R222 GB2312 拼音表（`pinyinReadingsOf`）里且 **只有一个读音**（`singleReading`），拼成全拼后过 `checkPinyinLabel`（R124 音节切分 + R142 语感风险）。命中即跳过下一字。
2. **根词上限 4**（拼音词与描述里的 ASCII 词交错）。
3. **枚举变体**：根词本身 → 短两词拼接 → `VARIANT_SUFFIXES`（app/hq/labs/hub，R247）× 根词 → `VARIANT_PREFIXES`（get/my/try/use）× 根词 → 长两词拼接；上限 24 条。
4. meaning 固定模板「规则生成：直接取描述中的「云端」拼音 yunduan，非 AI 寓意」，theme=`rule`，scores 只按长度/构成打分（brandability 恒 50）。

没有任何「寓意 → 品牌字」的语义映射、没有行业词 → 英文映射；中文输入里没有 ASCII 词时 **不可能** 产出拼音+英文候选。

## 2. 离线横评（改前，`8351a69`）

坏例口径（固定，改前改后同口径；见 `scripts/bench-zh-rule-fallback.mjs`）：
- `len>12`：label 超过 12 字符；`digit/hyphen`：含数字或连字符；
- `meta-root`：根词来自描述里的元词（「寓意」「风格」「科技感」…，它们描述"要什么"，不是品牌语义）；
- `fragment`：2 字滑窗切出的跨词碎片（人工标注：境电、慢生 等 11 个）；
- `4-syllable-pinyin`：两个双字词全拼直接拼接（≥4 音节纯拼音串，R124 上限边缘、可读性差）。
- 「泛前后缀」（get/my/try/use/app/hq/labs/hub）单列占比，**不计入坏例**（它们合法但对中文创业者的 .cn 品牌几乎无辨识度，是"填充"而非"坏"）。

| # | 输入 | 根词 | 候选 | 拼音词 | 寓意短拼音 | 拼音+英文 | 英文 | 泛前后缀 | 坏例 | 坏例率 | 防线丢弃 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 茶叶电商，寓意清雅 | dianshang(电商) yuyi(寓意) qingya(清雅) | 24 | 5 | 0 | 0 | 0 | 19 | 10 | 42% | 0 |
| 2 | 宠物用品，活泼 | chongwu(宠物) | 9 | 1 | 0 | 0 | 0 | 8 | 0 | 0% | 0 |
| 3 | 独立开发者工具，极简 | kaifa(开发) jijian(极简) | 20 | 4 | 0 | 0 | 0 | 16 | 2 | 10% | 0 |
| 4 | 面向中小商家的云端记账工具 | yunduan(云端) jizhang(记账) | 20 | 4 | 0 | 0 | 0 | 16 | 2 | 10% | 0 |
| 5 | 母婴用品品牌，寓意温暖安心 | yuyi(寓意) anxin(安心) | 20 | 4 | 0 | 0 | 0 | 16 | 11 | 55% | 0 |
| 6 | 跨境电商，寓意远航 | jingdian(境电) yuyi(寓意) yuanhang(远航) | 24 | 7 | 0 | 0 | 0 | 17 | 18 | 75% | 0 |
| 7 | 智能家居，科技感，寓意光明 | yuyi(寓意) | 9 | 1 | 0 | 0 | 0 | 8 | 9 | 100% | 0 |
| 8 | 咖啡馆，文艺，慢生活 | wenyi(文艺) mansheng(慢生) | 20 | 4 | 0 | 0 | 0 | 16 | 11 | 55% | 0 |
| 9 | 少儿编程教育，寓意启蒙智慧 | biancheng(编程) yuyi(寓意) qimeng(启蒙) zhihui(智慧) | 24 | 9 | 0 | 0 | 0 | 15 | 12 | 50% | 1 |
| 10 | 健身工作室，活力向上 | gongzuo(工作) | 9 | 1 | 0 | 0 | 0 | 8 | 0 | 0% | 0 |
| 合计 | | | 179 | 40 | 0 | 0 | 0 | 139 (78%) | 75 | 42% | 1 |

典型产出（#7 智能家居，科技感，寓意光明）：`yuyi yuyiapp yuyihq yuyilabs yuyihub getyuyi myyuyi tryyuyi useyuyi` —— 9 条全部围绕元词「寓意」，行业词与寓意词一个都没抽到。

### 2.1 根因（逐条对照代码）

| 根因 | 证据（10 输入） | 代码位置 |
|---|---|---|
| A. 元词「寓意」被当根词 | 7/10 输入把 yuyi 当根词，直接产生 ≥ 55 条 meta-root 坏例；#7 100% 坏例 | `ZH_STOP_WORDS` 无「寓意」 |
| B. 多音字一刀切放弃 → 核心词大面积丢失 | 茶叶(叶 ye/xie)、独立(立 li/wei)、温暖(温 wen/yun·暖 nuan/xuan)、光明(明 ming/meng)、家居(家 jia/jie/gu)、健身(身 shen/juan)、活力/活泼(活 huo/guo)、咖啡(咖 ka/ga/jia)、母婴(母? 婴 ying — 用品「用」为停用字先切断)、少儿(少 shao 多音) —— **10 个输入里 8 个的行业词或寓意词因表内收录了文言/罕见读音而被整词放弃**；#2/#10 只剩 chongwu/gongzuo 各 1 个根词 | `singleReading` 要求 `readings.length === 1`；R222 表把 pinyin-data 补充读音追加在后（首读音是原 3500 常用字表读音） |
| C. 无词库的 2 字滑窗切出跨词碎片 | 跨境电商 → 境电(jingdian)、慢生活 → 慢生(mansheng)；两例共 20 条 fragment 坏例 | `extractPinyinRoots` 只有滑窗，无词边界 |
| D. 无语义映射 → 0 混搭、0 英文、0 双字短拼音 | 拼音+英文 0/179、英文 0/179、双字寓意组合 0/179；40 条拼音候选全部是 ≥4 字母×2 的双字词全拼或其 4 音节拼接 | 无寓意字 / 行业词表 |
| E. 泛前后缀填充 78% | 139/179 是 get/my/try/use/app/hq/labs/hub 变体，与描述语义无关；根词越少填充比例越高（#2/#7/#10 为 8/9） | `enumerateRuleDrafts` 顺序：根词 → 短拼接 → 8 个泛缀 × 根词 |

### 2.2 与 AI 路线的量化差距

仓库内没有独立的 R460/R464 文件（`rg -l "R460|R464" docs` 只命中 `handoff-context.md` 与 `r468-brand-card.md` 的引用）；可用的一手 AI 路线定量记录是 **`docs/qa/audit-r239.md`**（生产 `/api/ai-search` 269 条候选逐条人工质检，同一 deploy 线）：

| 维度 | AI 路线（R239 zh 首搜实测） | 规则路线（本文 10 输入离线） |
|---|---|---|
| 每次搜索候选 | zh1 31 条（2 轮）、zh2/zh3 75 条（5 轮） | 9–24 条（1 轮，降级后不再打第二轮） |
| 路线构成 | zh1：pinyin 15 / word 12 / coined 4（≥40% 拼音系配额达标）；zh2/zh3 100% pinyin | pinyin 22% / 泛前后缀 78%，blend·word 0 |
| 语义相关 | meaning 逐条解释寓意（「木舟」muzhou 稳载远行…） | meaning 只能说「直接取描述中的「寓意」拼音 yuyi」 |
| 双字短拼音 | 主产物（zh2/zh3 双字全拼 75/75） | 0（只有 ≥4 字母×2 的双字词全拼） |
| 已知坏例 | 拼音引用错配 3/269、幻影 ASCII 3、theme 误标；guard 总拦截 28.3% | meta-root/fragment/4 音节串 42%；guard 丢弃 1/179（规则模板本身不撞防线） |
| 可注册率 | zh1 12/31；zh2/zh3 仅 1/75（双字全拼 .com/.cn 存量枯竭，P3-4） | 未测（本文不做 RDAP；候选仍走既有核验） |

结论：差距不在「候选数」（24 条上限与 AI 单轮 24 对齐），而在 **语义命中率与构成**——AI 路线 ~100% 候选围绕行业/寓意，规则路线 78% 是与描述无关的泛缀填充、42% 是元词/碎片坏例，10 个输入里 8 个连核心行业词都没抽到。

## 3. 设计论证：只做证据支持的 3 条

约束：不引入 AI、不引入新依赖；所有拼音仍取自 R222 表 `pinyinReadingsOf`，纯拼音候选仍过 `checkPinyinLabel`，每条候选仍过 `admitRuleCandidate` 与既有 RDAP 核验；不改 `scripts/verify-r471.mjs` 任何断言（A1 云端/记账根词、A1c 长行放弃、A2 交错、A4e 根词前两位、A4g/h 泛缀仍在、A6b 混搭 meaning 原文等）。

### 改进 1 · 抽词修复：元词停用 + 首选读音表 + 词库优先切词（对应根因 A/B/C）

- 元词停用：`ZH_STOP_WORDS` 加入 寓意/意为/象征/代表/感觉/气质/调性/氛围 等；`ZH_STOP_CHARS` 加入「感」（科技感/高级感）。
- 首选读音：新增 **小而精的 `ZH_PREFERRED_READING`**（≈60 个创业描述高频多音字：叶 ye、立 li、温 wen、暖 nuan、明 ming、家 jia、居 ju、身 shen、活 huo、技 ji、能 neng、信 xin、达 da、少 shao、咖 ka、啡 fei、发 fa、乐 le…），**只允许选表内已有读音**（运行期校验 `pinyinReadingsOf(ch).includes(preferred)`，不一致即回退为放弃，fail-closed）；真多音字（长/行/重/乐(音乐)/得/地/的…）不进表 → 仍放弃，A1c 不变。
- 词库优先切词：先用 §3 改进 2 的行业/寓意词表做最长匹配（2–4 字），再对剩余段落 2 字滑窗，消除 境电/慢生 类碎片。
- 预期收益：meta-root + fragment 坏例（75 条中 ≥60 条）归零；#2/#7/#10 根词数从 1 提升到 ≥3。
- 验证：bench 前后表；`verify-r471` A1–A8 不变；新增单测覆盖 寓意 停用、叶/立/温 放行、长行 仍放弃、跨境电商 → 跨境+电商。

### 改进 2 · 寓意字 / 行业词小词表 → 双字短拼音 + 拼音·英文混搭（对应根因 D）

- **寓意字表 `ZH_BRAND_CHARS`**（≈70 字，中文创业命名高频寓意字：吉祥云智优达慧悦清雅安心暖明光星瑞鑫诚信美乐享趣悠简臻恒卓福喜聚源初新润泽航远启萌活力健康慢艺文净纯真善和顺兴旺盛华宏泰升跃飞翔拓创巧灵妙舒宁静蓝青金玉宝家亲），每字标注首选读音（同样运行期校验在表内）。描述里的寓意词命中其中的字（清雅 → 清/雅，温暖安心 → 暖/安/心，启蒙智慧 → 启/智/慧，光明 → 光/明）即成为「寓意字」；少量抽象词给近义寓意字（活泼 → 悦、向上 → 升、极简 → 简、科技感 → 智、文艺 → 艺），meaning 如实写「近义字」。
- **行业词表 `ZH_INDUSTRY`**（≈60 词）：行业词 → 核心字（茶叶 → 茶 cha、宠物 → 宠 chong、记账 → 账 zhang、云端 → 云 yun、家居 → 家 jia、健身 → 健 jian）+ 1–2 个短英文（tea / pet / ledger·book / cloud / home / fit / cafe / code / kid / shop / dev）。
- 生成（全部纯确定性）：
  - 双字短拼音：行业核心字 × 寓意字 双序（chaya / yacha、chongyue / yuechong、zhangzhi / huizhang…），4–8 字母、2 音节——这是 R239 记录里 AI 路线的主产物形态，也是中文品牌最常见命名形态；
  - 三音节：寓意字 + 行业双字词（qingchaye、huijizhang）；
  - 拼音+英文混搭：寓意字拼音 + 行业英文（qingtea、yuepet、huicode、zhicloud）与 英文 + 寓意字（teaqing…）。
  - 每条纯拼音组合过 `checkPinyinLabel`（切分合法、≤4 音节、R142 语感风险），并过一份保守的 **禁忌音节表**（cao/diao/bi/sha/sao/ri/si）——寓意字表本身不含这些音，禁忌表是对未来扩表与描述来源字的 fail-closed 兜底。
- meaning 模板沿用既有防线已核对的句式：「规则生成：由 「茶」拼音 cha + 「雅」拼音 ya 组成，非 AI 寓意」「…「悦」拼音 yue + 英文 pet 组成…」（不出现 混搭/组合词/造词 等 R183 元词；ASCII 片段都是 label 子串，R246 放行）。
- 预期收益：寓意短拼音 0 → ≥50 条、拼音+英文 0 → ≥30 条（10 输入合计）；每个输入至少 1 条语义相关的双字候选。
- 验证：bench 前后表；单测断言 茶叶电商，寓意清雅 → 含 chaya/qingcha、含 qingtea；防线 dropped 仍为 0（模板不撞防线）；`pinyinReadingsOf` 一致性单测（表内每个首选读音都在 R222 表中）。

### 改进 3 · 可读性打分 + 泛前后缀限额（对应根因 E）

- 枚举顺序改为：根词本身（A4e 不变）→ 双字短拼音/三音节/混搭按 **可读性分** 排序（长度 ≤ 8 加分、2 音节加分、`checkPinyinLabel.ambiguous` 扣分、risk 扣分）→ 短两词拼接（有语义候选时，两个双字词全拼直接拼接的 ≥ 4 音节串退到最后补位，拼音+ascii 拼接仍在前）→ 泛前后缀 **限额**（中文输入且已有语义候选时最多 8 条，后缀/前缀按位交替，保证 A4g/A4h/A4i 仍成立）→ 长拼接补位。语义候选自身上限 12 条（`RULE_FALLBACK_MAX_SEMANTIC`）。
- scores：brandability 不再恒 50——双字寓意组合 70、混搭 62、根词 60、泛缀 45；readability 叠加歧义/风险扣分。前端 Top Picks 已按 scores 排序，语义候选会排到前面。
- 预期收益：泛前后缀占比 78% → ≤30%；`4-syllable-pinyin` 坏例只在补位时出现。
- 验证：bench 前后表；`verify-r471` A4g/A4h/A4i（yunduanapp / getyunduan 仍在 24 条内）不变。

### 不做（证据不足或超范围）

- 不做声调歧义检测（表无声调，R222 表设计如此；`checkPinyinLabel.ambiguous` 已覆盖切分歧义）。
- 不做 en 输入的规则改动（R465 en 场景丢拼音路线，本轮 10 个输入全是中文）。
- 不接 `packages/core/generateCandidates`（它是 TLD 笛卡尔积生成器，没有语义层；降级候选的语义在 `apps/web/src/rule-fallback.ts`，本轮在原位改，worker 接线不变）。
- 不改 AI 路线 prompt / 防线 / theme 白名单。

## 4. 验证方式

1. `node scripts/bench-zh-rule-fallback.mjs --md --labels`：同口径改前改后表（§5）。
2. 新增 `node scripts/verify-r489.mjs`：新规则单测（停用元词 / 首选读音 fail-closed / 词库切词 / 双字短拼音 / 混搭 / 禁忌音节 / 泛缀限额 / meaning 过防线 / 表一致性）。
3. 既有 `node scripts/verify-r471.mjs` 全部断言不改、全绿（含 worker 降级事件流）。
4. `pnpm -r typecheck`、`pnpm --filter web test`、`pnpm --filter web build` 全绿。
5. 生产效果需父会话部署后以 ≤2 次授权 AI/降级搜索验证（本会话 0 AI 调用，不部署）。

## 5. 改后对比（同口径，`node scripts/bench-zh-rule-fallback.mjs --md --labels`）

实现落在 `apps/web/src/rule-fallback.ts`（`analyzeZh` / `enumerateSemanticDrafts` / 排序与限额）与新文件 `apps/web/src/rule-fallback-lexicon.ts`（首选读音 63 字 / 寓意字 96 字 / 近义寓意词 24 / 行业词 113 / 禁忌音节 7）；worker 接线与 AI 路线未动。与 §3 的小偏差：泛缀限额定为 8（不是 6，为保证 2 根词时前缀/后缀各至少 2 条在 24 条内）；「活」「品」不入寓意字表（从「生活」「用品」溢出会变噪声）；极简 → 简（净 jing 与 静/京 同音，与 dev/duli 组合不自然）。

### 5.1 合计

| 指标 | 改前（8351a69） | 改后 | 变化 |
|---|---:|---:|---|
| 候选总数 | 179 | 237 | +32%（#2/#7/#10 从 9 条填满到 24） |
| 拼音词候选 | 40 | 45 | 根词本身 + 少量 4 音节拼接补位 |
| 寓意双字短拼音（含三音节） | 0 | 51 | 新增路线 |
| 拼音+英文混搭 | 0 | 61 | 新增路线 |
| 英文/ASCII | 0 | 0 | 不变（中文描述无 ascii 词） |
| 泛前后缀 | 139（78%） | 80（34%） | 每输入定额 8 |
| 坏例（len>12 / 元词 / 碎片 / 4 音节串） | 75（42%） | 18（8%） | 剩余全是补位的 4 音节拼接与 kaifazhe/xiangshang 长根词变体 |
| 元词根（yuyi）/ 跨词碎片（境电/慢生…） | 7 输入 / 5 输入 | 0 / 0 | 归零 |
| 防线丢弃 | 1 | 0 | 新模板不撞防线 |

### 5.2 逐输入

| # | 输入 | 根词（改后） | 候选 前→后 | 寓意短拼音 | 拼音+英文 | 泛缀 前→后 | 坏例率 前→后 |
|---|---|---|---|---:|---:|---|---|
| 1 | 茶叶电商，寓意清雅 | chaye dianshang qingya | 24→24 | 4 | 8 | 19→8 | 42%→4% |
| 2 | 宠物用品，活泼 | chongwu huopo | 9→24 | 6 | 6 | 8→8 | 0%→13% |
| 3 | 独立开发者工具，极简 | duli kaifazhe jijian | 20→21 | 2 | 2 | 16→8 | 10%→19% |
| 4 | 面向中小商家的云端记账工具 | yunduan jizhang | 20→24 | 2 | 10 | 16→8 | 10%→8% |
| 5 | 母婴用品品牌，寓意温暖安心 | muying wennuan anxin | 20→24 | 11 | 1 | 16→8 | 55%→4% |
| 6 | 跨境电商，寓意远航 | kuajing dianshang yuanhang | 24→24 | 0 | 12 | 17→8 | 75%→4% |
| 7 | 智能家居，科技感，寓意光明 | jiaju guangming | 9→24 | 10 | 2 | 8→8 | 100%→8% |
| 8 | 咖啡馆，文艺，慢生活 | kafeiguan wenyi shenghuo | 20→24 | 4 | 8 | 16→8 | 55%→4% |
| 9 | 少儿编程教育，寓意启蒙智慧 | shaoer biancheng jiaoyu qimeng | 24→24 | 4 | 8 | 15→8 | 50%→0% |
| 10 | 健身工作室，活力向上 | jianshen huoli xiangshang | 9→24 | 8 | 4 | 8→8 | 0%→13% |

#2/#10 坏例率上升是口径效应：改前它们只有 9 条（一个根词 + 8 泛缀，泛缀不计坏例）；改后 24 条中的 3 条坏例是末位补位的 4 音节拼接（chongwuhuopo）与长根词泛缀（xiangshangapp）。

### 5.3 代表性输出（改后）

```text
茶叶电商，寓意清雅   → chaye dianshang qingya | chaya yacha chaqing qingcha | chatea teacha yatea teaya yashop shopya yamall mallya | chayeapp …
智能家居，科技感，寓意光明 → jiaju guangming | zhijia jiazhi zhiming mingzhi jiaming mingjia zhiguang guangzhi jiaguang guangjia | zhihome homezhi | jiajuapp …
宠物用品，活泼       → chongwu huopo | yuepet petyue chongyue yuechong lingpet petling chongling lingchong chongpet petchong | chonghuopo yuechongwu | chongwuapp …
面向中小商家的云端记账工具 → yunduan jizhang | yunzhang zhangyun | yunbook bookyun yuncloud cloudyun yunledger ledgeryun zhangbook bookzhang zhangcloud cloudzhang | yunduanapp … yunduanjizhang
```

改前第二行是 `yuyi yuyiapp yuyihq yuyilabs yuyihub getyuyi myyuyi tryyuyi useyuyi`。

### 5.4 验证结果（2026-09-04，本机）

- `node scripts/verify-r489.mjs` ALL PASS（45 断言）；`node scripts/verify-r471.mjs` ALL PASS（断言未改）。
- `pnpm -r typecheck` / `pnpm --filter web test`（84 用例）/ `pnpm --filter web build` 全绿。
- 本会话 0 次 AI 调用，未触发生产/本地 `/api/ai-search`，未部署。生产降级效果需父会话部署后以 ≤2 次授权 AI/降级搜索验证。

### 5.5 已知局限

- 寓意字 × 寓意字组合可能撞无关同音词（母婴输入里 xinwen/yingwen），无法不引入词典判别，当前只降权排在行业字组合与混搭之后。
- 词表覆盖面就是上限：未命中行业/寓意词的描述仍走 R471 旧路线（根词 + 不限额泛缀，E4 断言锁定）。后续可由生产 `/api/usage` 降级样本经人工标注后扩表。
- 未做 RDAP 可注册率对比（本轮 0 网络）；双字短拼音 .com/.cn 存量枯竭（R239 P3-4）同样适用于本路线，混搭与三音节候选是对应的补位。
