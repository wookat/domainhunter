# R218 · AI 猎名质量审计 v3（生产站）

- 日期：2026-08-08（UTC 13:35–13:47）
- 对象：https://hunt.zalize.com `/api/ai-search`（deploy/r192-r195 版本，含 R196 EN 词语沙拉过滤/中文幻影词源/拼音引用校验/EN 路线软配额、R197 refine 坏 JSON 截断恢复+重试）
- 上一轮基线：R195 AI 猎名质量审计 v2（EN round2 词语沙拉率 ~37%、拼音引用不一致、「取自」幻影词源等，修复记录见 PR #165/#166）
- 预算纪律：授权 6 次 AI 搜索，实际执行恰 6 次（zh×2、en×2、refine×2），无任何额外 AI 调用

## 0. usage 预算证据（/api/usage 三日表，测试前后全量）

| 日期 | 前 searches/fast/refine | 后 searches/fast/refine | byTld 前 | byTld 后 |
|---|---|---|---|---|
| 2026-08-08 | 20 / 14 / 6 | **26 / 18 / 8** | com20 cn8 io10 | **com26 cn11 io13** |
| 2026-08-07 | 16 / 12 / 4 | 16 / 12 / 4（不变） | com16 cn7 ai2 | 不变 |
| 2026-08-06 | 24 / 9 / 15 | 24 / 9 / 15（不变） | com24 cn18 ai2 | 不变 |

增量 = searches +6、fast +4、refine +2、com +6、cn +3、io +3 —— 与实际执行（4 次首搜 fast + 2 次 refine；3 次 zh 用 com+cn、3 次 en 用 com+io）**逐项精确相等**。前抓取 13:34 UTC、后抓取 13:47 UTC（带 cache-buster 绕开 max-age=300）。

## 1. 六次搜索总览

| # | 场景 | 描述 | 轮数 | 候选数 | theme 分布 | 可用/被注册 | error 事件 |
|---|---|---|---|---|---|---|---|
| zh1 | 中文通用寓意 | 手工茶饮品牌·东方美学·治愈慢生活 | 4 | 76 | pinyin64 blend7 coined5 | 12 / 139 | 0 |
| zh2 | 中文偏拼音 | 双字全拼·像知乎豆瓣·读书笔记应用 | 5 | 90 | pinyin82 coined8 | 6 / 174 | 0 |
| en1 | EN 场景 1 | calm habit tracker for indie makers | 2 | 18 | coined11 word6 blend1 | 10 / 26 | 0 |
| en2 | EN 场景 2 | API log → searchable timeline dev tool | 3 | 31 | coined15 blend16 **word0** | 18 / 44 | 0 |
| ref1 | EN 点踩 refine | 点踩 traxen/forgex（coined -x 后缀） | 1 | 23 | blend19 word2 coined2 | 22 / 24 | 0 |
| ref2 | ZH 点踩 refine | 点踩 moji/moxiang（墨 mo 词根） | 5 | 96 | pinyin96 | 3 / 189 | 0 |

## 2. 中文场景审计

### 2.1 元语言泄漏
334 条 zh 候选（zh1+zh2+ref2 = 76+90+96 后两者含 ref2）中 blend/coined/造词/混搭/「这是…」类元话术 **0 条**（R183 防线成立）。唯一漏网：zh1 yushan meaning「**pinyin 音调低缓悠长**」——裸英文词 "pinyin" 是路线分类元词，`META_LANGUAGE_RES` 只封了「拼音路线」中文形态，未封裸 `pinyin`（见 P3-1）。

### 2.2 臆造词源（「取自」幻影词，R195 P2-1 → R196 `citesPhantomWord`）
全量核对「取自/源自/来自/结合」句式：**0 条 X 不在 label、0 条 ASCII 来源词不含 X**。R196 防线正例：ref2 大量「X 取…、Y 取…」句式全部与 label 拼写吻合。**防线成立，较 R195 显著改善。**

### 2.3 拼音引用与 label 一致性（R195 P2-2 → R196 `pinyinQuoteMismatch`）
- 正面：zh2/ref2 共 178 条 pinyin 候选声称「全拼」的引用词逐字核对，**几乎全部拼写吻合**（对比 R195 的 tangfang「探方」/sanvei「山味」型错配，防线明显生效）。
- **漏网 2 条（均为拼音表覆盖缺口，见 P2-1）**：
  - zh1 `yuncu`：「云萃」yun cui 双字全拼——萃=cui，拼接 yuncui ≠ label yuncu，本应被 `pinyinQuoteMismatch` 拦截，但 **萃不在 3500 字表内 → 保守放行**；
  - zh1 `yechu`：「夜杼」——杼=zhù，label 是 chu，拼写错配；未声称「全拼」故不触发校验，且杼同样表外。
  - 抽验表覆盖：萃/杼/渥/岬/濡 均 NOT IN TABLE（藻/豫 在表）。
- ref2 `cuandian`「攒点」：攒多音字 zan/cuan，防线按任一读音放行——符合设计。

### 2.4 拼音路线占比与生僻字
- zh1 pinyin+blend 71/76（93%）、zh2 82/90（91%）、ref2 96/96 —— ZH 软配额（≥40%）大幅超额，符合中文场景定位。
- 生僻字：ref2 `cencun`「岑存」的岑在 `RARE_CJK_BLACKLIST` 内（只扣 readability 不丢弃，符合设计）；zh1 出现 杼/渥/岬（「夜杼」「色渥」「岬然」）**既不在生僻字黑名单也不在拼音表**，普通人无法由拼音反推（见 P3-2）。
- 语义小瑕疵：zh1 `yaolan` meaning 写作「摇蓝」（应为摇篮）；ref2 `zazhi`「杂志」为现成通用词，品牌性弱。

## 3. 英文场景审计

### 3.1 词语沙拉率 vs R195 基线（round2 ~37%）
- **首搜（en1+en2，49 条，含 round2/3 反思轮 41 条）：硬沙拉 0 条**，全部候选 meaning 主谓完整可读。R196 降温+连贯性红线+`enMeaningIncoherent` 在首搜路径**全面成立**。
- **refine 轮（ref1，23 条）：硬沙拉 1 条 + 边缘 3 条（~4% 硬 / ~17% 含边缘）**，对比 R195 基线 37% 大幅改善但未清零：
  - 硬沙拉：`besowith`「be so with suggests being exactly where they need it already carried and that reading brought whole on first try; two strides like a firm led gesture…」——完全不成句。**穿透原理**：`enMeaningIncoherent` 条件 A 被 label 子串 "with"（besoWITH 的 4 字母片段，恰是英文常用词）命中、条件 B 被谓语 "suggests" 命中，两锤点全过（见 P2-2）。
  - 边缘：`waveformy`（"the so shape runs like an electrical reading across a visible one full range"）、`grainway`（"set intotravelable order… functions slowly yet truly"）、`pebblecore`（"like the broken parts no longer split"）后半句语义崩坏。
  - 另见 ref1 大量黏词排版（"walksdown"、"logyou"、"practiceplus"、"plus view,solid"），P3 级观感问题。

### 3.2 theme 路线分布（R196 P2-4 软配额）
- en1：word6 / coined11 / blend1 —— word 达标，**blend 仅 1（配额要求各≥2）**；
- en2：**word 0** / blend16 / coined15 —— word+blend ≥30% 达标，但 **word 路线归零**（任务关注点「word 路线是否稳定非 0」：**不稳定**，2 次首搜 1 次为 0，见 P2-3）；
- ref1：word2 / blend19 / coined2 —— 各路线达标。
- theme 标注准确性抽查：en1 `tessiture` 标 word（实为意大利语词变体，应为 coined）；zh2 round3 `leaflet` 标 coined（实为现成英文单词，应为 word），标注硬规则执行不严（P3-3）。

### 3.3 品牌撞名
`isBrandCollision` 未见知名品牌同名/近名漏网；边缘案例：zh2 `leaflet`（与开源地图库 Leaflet 同名）、en2 `crypton`（与 Crypton Future Media 同名）——均非黑名单级知名消费品牌，风险低，记 P3-4 观察项。

## 4. 点踩 refine（R197 回归 + R180 规避）

- **R197 回归（坏 JSON 截断恢复）**：两次 refine 均**非空**（ref1 23 候选/1 轮、ref2 96 候选/5 轮），全程 **0 error 事件、0 空轮**，`parseCandidateArray` 修复路径无回归。
- **跨轮去重**：ref1 vs en2（31 excludeLabels）、ref2 vs zh2（90 excludeLabels）逐一比对，**重复 0 条**。
- **disliked 风格规避（R180，prompt 级）**：**两次都有违规**——
  - ref1 点踩 traxen/forgex（-x 后缀 coined），仍产出 `gleanix`（同款 -x 后缀造词）；
  - ref2 点踩 moji/moxiang（墨 mo 词根），round2 仍产出 `moyu`「墨雨」、`moxu`「墨叙」（同词根同气质）。
  - prompt 明文「严禁输出使用相同词根或相同构词模式的名字」，无后处理兜底（见 P2-4）。

## 5. RDAP 可注册真实性抽查（6/6 通过）

对流内标记 available 的候选跨场景抽 6 个，经 rdap.org 跟随重定向核验（404 = 未注册）：

| 域名 | 来源 | 流内判定 | RDAP |
|---|---|---|---|
| heyuetea.com | zh1 | available(rdap) | 404 未注册 ✓ |
| nouritea.com | zh1 | available(rdap) | 404 未注册 ✓ |
| lognomic.com | en2 | available(rdap) | 404 未注册 ✓ |
| quiesc.com | en1 | available(rdap) | 404 未注册 ✓ |
| besowith.com | ref1 | available(rdap) | 404 未注册 ✓ |
| ordyr.io | en2 | available(whois) | 404 未注册 ✓ |

## 6. 发现分级（P0–P3）

无 P0/P1。

| 级别 | 编号 | 发现 | 指向防线 |
|---|---|---|---|
| P2 | P2-1 | 拼音引用校验被表外常用字击穿：`yuncu`「云萃」声称全拼但 萃(cui) 表外 → 保守放行，实际拼写错配上线。萃/杼/渥/岬/濡 等命名高频雅字不在 3500 表 | `ai.ts pinyinQuoteMismatch` / `pinyin-table.ts` 覆盖面；建议表外字≥1 且其余字拼接已偏离 label 前缀时降 relevance 或收紧 |
| P2 | P2-2 | refine 轮 EN 硬沙拉未清零（1/23 硬 + 3 边缘）：`besowith` 靠 label 子串恰为常用英文词（with）+ 谓语词（suggests）双双穿透 `enMeaningIncoherent` | `ai.ts enMeaningIncoherent` 条件 A：label 片段若本身是高频英文停用词（with/read/line 等）不应算词源锤点 |
| P2 | P2-3 | EN word 路线不稳定为 0：en2 整轮 word=0（en1 blend=1 也低于「各≥2」）——软配额 prompt 约束在部分需求语境下失效 | `ai.ts EN_NAMING_HINT` 路线配额（prompt 级，无后处理）；如需保证可加 word 路线兜底注入 |
| P2 | P2-4 | disliked 风格规避失效案例：点踩 mo 词根后仍出 moyu/moxu，点踩 -x 后缀后仍出 gleanix | `ai.ts buildRefineHint` disliked 段（prompt 级）；可加后处理：disliked 词根/后缀模式命中直接丢弃 |
| P3 | P3-1 | 元语言漏网：meaning 出现裸英文词 "pinyin"（yushan） | `ai.ts META_LANGUAGE_RES` 增加 `\bpinyin\b`（需避开「」内引用） |
| P3 | P3-2 | 生僻字黑名单覆盖缺口：杼/渥/岬 未收录（且拼音表外），普通人无法反推 | `ai.ts RARE_CJK_BLACKLIST`；可与拼音表联动：表外字视同生僻扣分 |
| P3 | P3-3 | theme 标注硬规则执行不严：tessiture 标 word、leaflet 标 coined | `ai.ts` theme 标注 few-shot / 后处理无校验 |
| P3 | P3-4 | 边缘撞名观察项：leaflet（开源库）、crypton（Crypton Future Media）；另 ref1 黏词排版（walksdown/logyou 等） | `brand-blocklist.ts` 观察项；排版属模型输出噪声 |

## 7. 与 R195 基线逐项对比结论

| 审计项 | R195 v2 | R218 v3 | 结论 |
|---|---|---|---|
| EN 词语沙拉率（反思轮） | round2 ~37% | 首搜 0%；refine 轮 ~4% 硬（1/23） | **大幅改善，refine 轮未清零**（P2-2） |
| ZH 元语言泄漏 | 有 | 0/334（1 条裸 "pinyin" P3） | **成立** |
| 「取自」幻影词源 | 有（P2-1） | 0 违规 | **防线成立** |
| 拼音引用与 label 一致性 | tangfang/sanvei 型错配 | 主体成立；表外字击穿 1 例（yuncu） | **基本成立，覆盖缺口**（P2-1） |
| EN 路线软配额 | 整轮全 coined | word+blend≥30% 达标；word 路线 1/2 轮为 0 | **部分生效**（P2-3） |
| refine 非空（R197） | 坏 JSON 整轮 0 结果 | 2/2 非空、0 error | **回归通过** |
| 跨轮去重 | — | 0 重复 | **通过** |
| disliked 规避（R180） | — | 2/2 有违规案例 | **失效案例**（P2-4） |
| 可注册真实性 | — | RDAP 抽查 6/6 未注册 | **通过** |
| usage 预算 | — | 增量恰 +6/+4/+2，逐项相等 | **通过** |

原始 NDJSON 与 usage 快照留存于审计会话（zh1/zh2/en1/en2/ref1/ref2.ndjson、usage-before/after.json、rdap-check.txt）。
