# R494 · AI 猎名质量审计 v5（生产站 · DeepSeek 主上游恢复后首次整体复审）

- 日期：2026-09-04 21:20–21:40Z（UTC）
- 对象：生产 https://hunt.zalize.com（分支 `deploy/r192-r195` tip `041a764`）
- 预算：授权 ≤6 次生产 `/api/ai-search`，**实际 6 次（4 fast 首搜 + 2 refine），未超**
- 上一版：`docs/qa/audit-r239.md`（v4，2026-08-08）；期间 R240–R490 共 250 轮改动未整体复审
- 证据目录：`docs/audits/r494/`（6 份原始 NDJSON 流、8 份 usage 快照、RDAP/WHOIS 原始响应、13 张截图）；录屏 `r494-ai-audit`（含 6 次完整搜索）留存于审计会话附件

> 标注约定：**[验证]** = 一手证据（NDJSON 原文 / usage 前后值 / 独立 RDAP·WHOIS）；**[推断]** = 由代码阅读或多条证据推出但未直接实测；**[未验证]** = 本轮未覆盖。

---

## 0. 结论（执行摘要）

1. **[验证] AI 主路径已恢复且稳定**：6/6 次调用 11 个 LLM 轮次全部 `guard.provider="primary"`，0 `fallback`、0 `error` 事件；usage `aiErrors`/`fallbacks` 前后完全相同（`{rate-limit:4, quota:3}` / `{quota:2, quota-breaker:2}`），R471 熔断、R474 failover、R476「AI 暂不可用」横幅均未误触发。
2. **[验证] R466 时延达标**：首候选 2.7–3.9s、首个可注册 4.1–6.5s（目标 <10s），6 次全部达标；整次流 16.6–29.3s。
3. **[验证] 可注册产出充足**：6 次全部 `reachedTarget=true`（target 10），可注册 14–24 个/次；无 R239 P3-4 的「5 轮打满仅 1 个」现象。独立 RDAP/WHOIS 复核 6 可注册 + 5 已注册 **11/11 一致**，已注册到期日取得。
4. **[验证] 历史修复保持**：点踩形态规避（R225）0 违规；EN word 路线非空（1 条 `anchor`）；元语言 0 条上线（guard 拦 3 条）；拼音抽检 12 条 11 条正确。
5. **新问题（无 P0）**：
   - **P1-1** zh `coined` 候选的中文寓意文案出现整段词语沙拉/胡话且全部上线（点踩 refine 轮 7 条 coined 中 5 条：`moggity`/`miafbab`/`gurgulu`/`voralini`/`hapany`；refine 首轮 `miaoround`）——zh 侧没有对应 EN `enMeaningIncoherent` 的连贯性防线。
   - **P2-1** R239 P2-1 复现：不声称「全拼」的拼音候选跳过引用校验，`zhongao`「忠」（单字寓意、拼写不匹配）上线。
   - **P2-2** EN 幻影词源穿透：`complainter` 声称 `commit + planner`（label 中无 commit），`citesPhantomWord` 未拦。
   - **P2-3** EN word 路线仅 1/12 条，且 `needsWordSupplement` 要求候选 ≥8 才补发，本次两轮各 7/5 条均不触发（R239 P1-1 的另一面：补发门槛使薄弱路线静默）。
   - P3：theme 标注不严（`zhangwubao` 纯拼音标 blend、`cuddlepup`/`fluffnest` 等复合词标 word）、声调描述错误 4 例、refine 首轮几乎全灭（3 条中 2 条泰文字符 charsetViolation）。

---

## 1. AI 预算核销表（/api/usage?days=1，均为 `days["2026-09-04"]` 字段，每次调用后等待 ≥60s 再读）

| # | 时间(Z) | 调用类型 | searches | fast | refine | llmProvider.primary | aiErrors | fallbacks | 核销 |
|---|---|---|---|---|---|---|---|---|---|
| 基线 | 21:19 | — | 10 | 10 | 0 | 3 | rate-limit 4 / quota 3 | quota 2 / quota-breaker 2 | `usage-00-baseline.json` |
| 1 | 21:20:21 | zh 寓意 fast | 11 | 11 | 0 | 5 (+2) | 不变 | 不变 | +1 search，2 轮 → primary +2 ✓ |
| 2 | 21:24:12 | zh 寓意 fast | 12 | 12 | 0 | 7 (+2) | 不变 | 不变 | 2 轮 ✓ |
| 3 | 21:26:36 | zh refine「更中文语感」 | 13 | 12 | 1 | 9 (+2) | 不变 | 不变 | refine +1，2 轮 ✓ |
| 4 | 21:30:10 | zh 点踩后 refine | 14 | 12 | 2 | 10 (+1) | 不变 | 不变 | refine +1，1 轮 ✓ |
| 5 | 21:33:13 | en fast | 15 | 13 | 2 | 12 (+2) | 不变 | 不变 | 2 轮 ✓ |
| 6 | 21:37:17 | zh 拼音风格 fast | 16 | 14 | 2 | 14 (+2) | 不变 | 不变 | 2 轮 ✓ |
| 合计 | | | **+6** | **+4** | **+2** | **+11（= 11 个 LLM 轮次）** | **+0** | **+0** | 精确相等 |

- `byTld`：com 10→16、cn 5→11（每次 +1/+1，与请求 `tlds:["com","cn"]` 一致）；io/dev 不变。
- `outbound` / `outboundByTld` 前后不变（`namecheap 1 / porkbun 3 / aliyun 16`）——**[未验证]** AI 路径是否应计入 outbound，本轮不做判断。
- 与 R487 分片延迟一致：每次读后值均在 ≥60s 后一次读到，未出现少计。

---

## 2. 六次调用总览

请求参数公共项：`tlds:["com","cn"]`, `target:10`, `lengthPref:""`；UI 真实操作（Chrome + 剪贴板粘贴中文），NDJSON 通过页内 fetch tee 单次抓取（无重复调用）。

| # | lang/模式 | description（摘） | 轮 | proposed | theme (pinyin/word/coined/blend) | result 事件 | 可注册 | 首候选 | 首可注册 | 总时延 | provider | 横幅 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | zh fast | 中小企业智能财税 SaaS，稳健省心可靠 | 2 | 7+21=28 | 16/0/7/5 | 56 | 15 | 2.7s | 6.1s | 26.7s | primary×2 | 无 |
| 2 | zh fast | 宠物用品跨境电商，猫狗零食玩具，温暖陪伴 | 2 | 5+17=22 | 6/3/9/4 | 44 | 16 | 3.9s | 6.5s | 26.9s | primary×2 | 无 |
| 3 | zh refine（更中文语感） | 同 #2 + 风格偏好；excludeLabels 21 | 2 | 1+22=23 | 12/7/3/1 | 46 | 24 | 3.3s | 4.1s | 22.5s | primary×2 | 无 |
| 4 | zh 点踩 refine | 同 #3 + 点踩 fluffnest/petnuzzle/pettreat | 1 | 21 | 12/0/7/2 | 42 | 20 | 3.6s | 5.1s | 22.6s | primary×1 | 无 |
| 5 | en fast | Minimal habit tracker for remote teams… | 2 | 7+5=12 | 0/1/4/7 | 24 | 14 | 3.9s | 4.7s | 16.6s | primary×2 | 无 |
| 6 | zh fast, style=中文拼音 | 新中式茶饮，国风奶茶花果茶，东方雅致 | 2 | 7+24=31 | 31/0/0/0 | 62 | 20 | 3.4s | 5.9s | 29.3s | primary×2 | 无 |

- 时延定义：从 `fetch` 发出到首个 `proposed`/首个 `status:"available"` result/流结束（`done`）；响应头 378–471ms。
- 「无横幅」= 结果页 DOM 中无「暂不可用」/`unavailable` 文本（每次 375px 检查时同时断言）。
- 375px：6/6 次 `documentElement.scrollWidth === 375 && innerWidth === 375`，无水平溢出（截图 `r494/shot-0N-m375.jpg`）；桌面截图 `r494/shot-0N-desktop.jpg`。
- 可注册按 TLD：`.cn` 74 / `.com` 35 / unknown 1（`zhangping.cn` whois `detail:"reserved"`）；已注册 `.com` 102 / `.cn` 62。**[验证]** `.com` 双字全拼几乎全被占（#1 R1 三条双拼 `qishu/lexin/zhian` 两 TLD 全 taken），可注册主要来自 `.cn` 与三字拼音/blend。

---

## 3. guard 防线定量（R238 字段，11/11 轮 proposed 事件均带 guard）

| 防线 | #1 | #2 | #3 | #4 | #5 | #6 | 合计 |
|---|---|---|---|---|---|---|---|
| pinyinMismatch | 1 | 3 | 0 | 2 | 0 | 1 | 7 |
| pinyinInvalid | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| phantomEtymology | 2 | 3 | 1 | 0 | 0 | 0 | 6 |
| metaLanguage | 0 | 3 | 0 | 0 | 0 | 0 | 3 |
| charsetViolation | 0 | 0 | 2（样本 `U+0E15` 泰文） | 0 | 0 | 0 | 2 |
| meaningIncoherent（仅 en） | — | — | — | — | 1+4=5 | — | 5 |
| invalidLabel/brandCollision/emptyMeaning/questionMark/dislikedMorphology/enPinyinRoute | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| wordSupplement / pinyinSupplement / retries | false/—/0 | false/—/0 | false/—/0 | false/—/0 | **false**/—/0 | false/—/0 | 未触发 |

- **[验证]** R239 P3-1 的可观测性建议已落地一半：`charsetSample` 有值（#3 R1 `U+0E15`），`supplementDropped` 字段存在（本轮全 0，因未触发补发）。
- **[验证]** 拦截 24 条 / 上线 137 条（拦截率 ≈15%，分母为「上线+拦截」161）；但 zh 侧 meaning 内容质量问题（§4.2）不在任何防线覆盖内，「拦得少」≠「上线的都干净」。

---

## 4. 全量候选人工质检（137 条逐条读过，重点条目引 NDJSON 原文）

### 4.1 拼音正确性抽检（R222/R244 标准：「」引用词 → label 拼音逐字对应、分词无歧义），抽 12 条

| # | label | 引用 | 判定 | 备注 |
|---|---|---|---|---|
| 1 | qishu | 启数 | ✓ | |
| 1 | lexin | 乐薪 | ✓ | 声调描述「一升一平」错（乐 lè 4 声） |
| 1 | hezhang | 合账 | ✓ | |
| 1 | zsp | 掌上派（声母缩写） | ✓ | 声母缩写路线正确 |
| 1 | zhangwubao | 账务宝 | ✓ | 纯拼音却标 `blend` 且自称「全拼加英文」（P3-1） |
| 2 | **zhongao** | **忠** | **✗** | meaning 全文仅「忠」。忠=zhong，label 多出 `ao`；未声称「全拼」→ `pinyinQuoteMismatch` 跳检（P2-1，R239 P2-1 复现） |
| 2 | goubei | 狗贝 | ✓ | |
| 2 | maoxiong | 毛熊 | ✓ | |
| 3 | chonglexin | 宠乐心 | ✓ | |
| 4 | miaowan | 妙丸 | ✓ | |
| 4 | nuanpa | 暖趴 | ✓ | 声调描述「暖第二声、趴第一声」错（暖 nuǎn 3 声） |
| 6 | xiaoyuecha | 小月茶 | ✓ | #6 全部 31 条逐条核对均正确 |

结论：**11/12 拼写正确**；`zhongao` 为唯一硬错，走的正是 R239 P2-1 记录的「不声称全拼」绕过路径。声调/平仄描述错误 4 处（lexin、zhangping「先升后平」、nuanpa、huazhi「一升一平」）——不影响 label，但对中文创业者是可见的专业性瑕疵（P3-2）。

### 4.2 幻影词源 / 元语言 / 词语沙拉

- **元语言**：0 条上线 **[验证]**；#2 R2 拦 3 条 `metaLanguage`。
- **幻影词源（zh）**：guard 拦 6 条；上线者中 `waofun`（#2 R1，blend）meaning「wo 为犬吠声」而 label 为 `wao`（对应「汪」应为 wang）——blend 路线不做拼音校验、`zhCitesPhantomAscii` 对 2 字母串未判 **[推断]**。
- **幻影词源（en）**：`complainter`（#5 R1，blend）原文：
  > `"meaning":"commit + planner: a tool that turns intentions into enduring habits; starts with a quiet 'co', ends with a built-in '-er' role, reads naturally"`
  label 中不存在 `commit`（仅 `com`），且 `complainter` 读感即 complain-er（负面）。`citesPhantomWord` 未拦（P2-2）。`harborly` 标 blend 实为 word+-ly（R239 ledgerly 型）。
- **词语沙拉（zh，本轮最突出）**：EN 侧 `enMeaningIncoherent` 拦 5 条、上线 12 条读感均连贯 ✓；**zh 侧无对应防线**，以下整段上线 **[验证]**（`ai-search-04.ndjson` / `ai-search-03.ndjson` 原文）：
  - `miaoround`（#3 R1）：「…舌尖轻弹本就是抚摸毛茸茸脑袋的音节，音韵换成圆弧第二段路，恰似一条狗习惯绕圈卧眠的终局干脆，记一句儿闻一声无畏亲呢。」
  - `moggity`（#4）：「…整体感觉像一个伯爵先生正在柜台后端出鲸吞鲜食的宠与敬。」
  - `voralini`（#4）：「…仿佛讲述一条头衔被咬掉一小凳专挑鲜物下口的吃客传奇。」
  - `hapany`（#4）：「…两者睡袍般裹在一起正是一个愿意并肩也要鲜肴的半路结盟者。」
  - `gurgulu`（#4）：「gulu 是易拉罐烂滚的拟声字…」；`miafbab`：「视觉上有两段触角般的隆起」。
  - `peiqiu`「胚球」（#4，pinyin）寓意牵强但拼写正确。
  分布：#4（点踩 refine，1 轮 21 条）coined 7 条中 **5 条硬沙拉**，pinyin 12 条中 0 条；#1/#2/#6 首搜 0 条硬沙拉。**[推断]** 与 R239 P2-3 同源：refine 轮（长 prompt + exclude 21 + 点踩规避）使模型在 coined 路线上「凑字」，而 zh 没有 EN 那套连贯性锤点。

### 4.3 点踩 refine 遵从（R225）

- 请求原文（`ai-search-04.ndjson` `_request`）：`disliked:[{label:"fluffnest",theme:"word"},{label:"petnuzzle",theme:"coined"},{label:"pettreat",theme:"word"}]`，description 追加「我不喜欢这些名字及其风格：fluffnest, petnuzzle, pettreat。请避开类似的词根、构词方式与气质。」
- 产出 21 条：含 `pet`/`nest`/`treat`/`nuzzle`/`fluff` 词根 **0 条**；英文复合双词（`snackpaw` 型）**0 条**；`dislikedMorphology` 硬过滤计数 0 → **prompt 级规避即已生效** **[验证]**（R239 P3-2「靠硬过滤兜底」未再现）。
- 副作用：规避后模型把 coined 路线滑向无意义拟声词（§4.2 沙拉），即「遵从了形态、丢了质量」。

### 4.4 EN word 路线（R224/R243）

- #5 共 12 条：word 1（`anchor`——真实英文词 ✓）、blend 7（`calmroot`/`trustloop`/`quietloop`/`firmhabit`/`stillvigil` 为清爽双词，符合 description「clean two-word combos」）、coined 4。
- **[验证]** 两轮均 `wordSupplement:false`；**[推断]**（代码 `ai.ts` `needsWordSupplement`：`candidates.length >= 8 && word === 0`）R1 7 条 / R2 5 条均 <8，即便 word=0 也不会补发。本次 word=1 非空 ✓，但「非空」是靠单条 `anchor` 达成，路线薄弱（P2-3）。

### 4.5 theme 标注

- `zhangwubao` 账务宝 → 纯拼音标 `blend`；`caiwuhub/zhangdanhub/kuaijihub` 拼音+hub 标 blend ✓。
- #3 R2 `cuddlepup/fluffnest/barkbite/furbuddy/nibblenest/pawlab` 标 `word`（均非词典词，应为 coined）；`munchkin` ✓。
- #5 `harborly` 标 blend（实为 word+ly）；`focusly` 标 coined。R239 P3-3 复现（P3-1）。

### 4.6 中文创业者视角的寓意贴合

- #1 财税：R2 16 条双字拼音（账水/财顺/税衡/记帐/云帐/税计/账平/财算/账守/税稳…）**寓意贴合、可读、看得懂** ✓，但 `.com`/`.cn` 双拼几乎全 taken，最终可注册以 `xxxhub.cn`、`fiscore.cn`、`ledgurable.cn` 为主——**对「短、好读、有品牌感」的 zh 需求，实际可拿到的多为英文/混搭**（产品层观察，非缺陷）。
- #6 拼音风格：31/31 拼音、寓意（小月茶/清婉茶/山外茶/云雾春/清竹吟…）与「东方雅致、自在悠然」高度贴合，可注册 20 个（含 `xiaoyuecha.com`、`qingwancha.com`、`shanwaicha.com`）——**本轮最佳样本** ✓。多为三字全拼（9–12 字母），「好读好记」尚可，「短」不满足。
- #2/#3 宠物：`goubei/gouzai/maoxiong`、`maoxiangni/chongyoulu/aichongjia` 一眼看懂 ✓；`zhongao`「忠」、`chongsheng`「咬文嚼字创新」质量差。

---

## 5. 独立可注册性复核（RDAP / WHOIS，与应用结果对照）

| 域名 | 应用结果(method) | 独立方法 | 独立结果 | 到期日（独立） | 一致 |
|---|---|---|---|---|---|
| xiaoyuecha.com | available (rdap) | rdap.org → rdap.verisign.com | HTTP 404 未注册 | — | ✓ |
| qingwancha.com | available (rdap) | 同上 | HTTP 404 | — | ✓ |
| shanwaicha.com | available (rdap) | 同上 | HTTP 404 | — | ✓ |
| firmhabit.com | available (rdap) | 同上 | HTTP 404 | — | ✓ |
| xiaoyuecha.cn | available (whois) | `whois -h whois.cnnic.cn` | `No matching record.` | — | ✓ |
| calmroot.cn | available (whois) | 同上 | `No matching record.` | — | ✓ |
| lexin.com | taken (rdap) | rdap.verisign.com | HTTP 200 active | 2030-03-19 | ✓ |
| miaowan.com | taken (rdap) | rdap.verisign.com | HTTP 200 | 2027-06-18 | ✓ |
| yujian.com | taken (rdap) | rdap.verisign.com | HTTP 200 active | 2026-11-29 | ✓ |
| miaowan.cn | taken (whois) | whois.cnnic.cn | 已注册（珠海海逸国际旅行社） | 2029-07-07 | ✓ |
| chayi.cn | taken (whois) | whois.cnnic.cn | 已注册（上海茶易科技） | 2027-03-30 | ✓ |

- **11/11（6 可注册 + 5 已注册）一致** **[验证]**；原始响应见 `r494/rdap-*.json`、`r494/whois-*.txt`。
- 应用侧「到期日」未在结果卡展示，本表到期日全部来自独立查询。
- `zhangping.cn` 应用返回 `status:"unknown", detail:"reserved"`（CNNIC 保留字），UI 归入未知，未误判为可注册 ✓。

---

## 6. 韧性对照（AI 正常态下不应触发的机制）

| 机制 | 期望 | 观察 | 判定 |
|---|---|---|---|
| R471 首轮失败规则降级 + KV 熔断 | 不触发 | 0 `fallback` 事件；usage `fallbacks` 不变 | ✓ [验证] |
| R472 rate-limit 30s 重试 | 不触发 | `retries=0` ×11 轮；`aiErrors.rate-limit` 4→4 | ✓ [验证] |
| R474 备用上游 failover | 不触发 | `guard.provider="primary"` ×11；`llmProvider` 仅 primary 增长，无 fallback 键 | ✓ [验证] |
| R476「AI 暂不可用」横幅 | 不显示 | 6/6 结果页 DOM 无「暂不可用」/`unavailable` | ✓ [验证] |
| R487 usage 分片读侧延迟 | ≤60s 收敛 | 每次 ≥60s 后一次读齐 | ✓ [验证] |
| 限流 20 次/h/IP | 6 次不触发 | 6/6 HTTP 200 | ✓ |

---

## 7. 与 R239 v4 逐项对照（历史缺陷是否再现）

| R239 编号 | 内容 | R494 观察 | 结论 |
|---|---|---|---|
| P1-1 | EN word 补发 2/2 失效、word=0 | word=1（anchor），补发因候选 <8 未触发 | **部分改善**：非空但薄弱；补发门槛成新盲区（本轮 P2-3） |
| P2-1 | 「不声称全拼」绕过拼音校验 | `zhongao`「忠」上线，同一绕过路径 | **复现**（本轮 P2-1） |
| P2-2 | zh 整轮 charsetViolation 全灭（声调字符） | #3 R1 拦 2 条，样本 `U+0E15`（泰文，非声调符号）；其余 0 | **未再现**；`charsetSample` 可观测性已加 ✓ |
| P2-3 | EN refine 轮胡话 37% | EN 首搜 0 条胡话上线，拦 5 条；EN refine 本轮未测 | **首搜通过**；refine [未验证] |
| P2-4 | zh 幻影 ASCII 引用 | guard 拦 6 条 phantomEtymology；上线 `waofun`「wo」1 例边缘 | **基本成立**，边缘 1 例 |
| P3-1 | guard 可观测性盲区 | `charsetSample`/`supplementDropped` 已有 | **已修** ✓ |
| P3-2 | 点踩依从靠硬过滤 | 硬过滤 0 拦，prompt 级即遵从 | **已修** ✓ |
| P3-3 | theme 标注不严 | 6+ 条 word/blend 误标 | **复现**（本轮 P3-1） |
| P3-4 | zh 偏拼音 5 轮仅 1 可注册 | #6 拼音风格 2 轮 20 可注册 | **未再现** ✓（.cn 与三字拼音撑起） |
| — | EN 词语沙拉（首搜） | 0% | 保持 ✓ |
| — | 元语言 | 0 条 | 保持 ✓ |
| — | RDAP 真实性 | 10/10 | 保持 ✓ |
| — | usage 核销 | 精确相等 | 保持 ✓ |
| 新 | zh coined 寓意沙拉 | refine 轮 5/7 硬沙拉 | **新问题 P1-1** |

---

## 8. 发现分级（P0–P3）

无 P0。

| 级别 | 编号 | 发现 | 证据 | 指向（仅供后续设计论证，本轮不改码） |
|---|---|---|---|---|
| P1 | P1-1 | **zh coined 候选寓意文案整段沙拉且 100% 上线**：#4 点踩 refine 7 条 coined 中 5 条（moggity/miafbab/gurgulu/voralini/hapany），#3 refine R1 `miaoround`。中文创业者看到的是不可理解的「品牌故事」，直接损害「一眼看懂」定位 | `r494/ai-search-04.ndjson` round1 proposed；`ai-search-03.ndjson` round1 | zh 侧无 `enMeaningIncoherent` 对应物；可观察项：zh coined 寓意的句长/生僻搭配/与 description 词汇重叠度。应先按 SOP-02 取样论证再定规则 |
| P2 | P2-1 | 拼音引用校验「不声称全拼」绕过复现：`zhongao` meaning 仅「忠」 | `ai-search-02.ndjson` round1 | `ai.ts pinyinQuoteMismatch` / `FULL_PINYIN_CLAIM_RE`（R239 同建议） |
| P2 | P2-2 | EN 幻影词源穿透：`complainter` 称 `commit + planner`，label 无 commit | `ai-search-05.ndjson` round1 | `ai.ts citesPhantomWord` 对 `X + Y:` 句式的覆盖 |
| P2 | P2-3 | EN word 路线薄弱且补发门槛（≥8 条）使其静默：12 条仅 1 word；两轮候选 7/5 条不触发补发 | `ai-search-05.ndjson` guard `wordSupplement:false` ×2；`ai.ts needsWordSupplement` | 观察项：fast 首轮候选数常 <8 时补发永不触发 |
| P3 | P3-1 | theme 标注不严复现：`zhangwubao` 纯拼音标 blend；`cuddlepup/fluffnest/barkbite/furbuddy/nibblenest/pawlab` 标 word；`harborly` 标 blend | #1 R2、#3 R2、#5 R1 | few-shot 观察项 |
| P3 | P3-2 | 声调/平仄描述错误 4 例（lexin/zhangping/nuanpa/huazhi） | #1、#4、#6 | 可考虑不让模型描述声调，或用 R244 表校验 |
| P3 | P3-3 | refine 首轮产出近乎全灭：#3 R1 仅 3 条解析、2 条泰文字符被拦、1 条沙拉上线 | `ai-search-03.ndjson` round1 guard `charsetSample:"U+0E15"` | 长 prompt（description+偏好+21 exclude）下模型输出退化的观察项 |
| P3 | P3-4 | `waofun` blend 声称「wo 为犬吠声」，label 为 wao；blend 路线不做拼音片段校验 | `ai-search-02.ndjson` round1 | 边缘 |

---

## 9. 本轮未覆盖 / 未验证

- **EN refine / EN 点踩 refine**（R239 P2-3 主场景）——预算全部用于 zh 侧 + 1 次 en 首搜。
- **「更多结果」(more) 非 fast 路径的深轮次**（MAX_ROUNDS 打满行为）——本轮 6 次均 ≤2 轮即达标。
- **`.com.cn` TLD**：UI 自定义 TLD 输入一次未生效（未再试，避免额外调用），6 次均只测 `com`+`cn`。
- **暗色主题截图**：仅亮色主题；375px 只做溢出与横幅断言。
- **fallback 上游 / 熔断路径**：AI 正常，不可能也不应触发；R489 规则降级本轮无样本。
- **outbound 计数语义**、**pageviews/bots 字段**：未分析。
- **上线候选的品牌撞名**：`brandCollision` 全 0，但未人工核对（`anchor` 为通用词，`jujubee` 与英文 jujube 近似）。
- 时延数值为单次单点（Cloudflare 边缘 → DeepSeek），非统计分布。

---

## 10. 证据清单（`docs/audits/r494/`）

- `ai-search-01..06.ndjson`：生产 NDJSON 原文（首行 `_request` 为请求体与时序元数据，每行 `_ms` 为相对 fetch 的毫秒）
- `usage-00-baseline.json`、`usage-01..06-after.json`：/api/usage?days=1 完整响应
- `rdap-*.json`、`whois-*.txt`：独立复核原始响应
- `shot-01..06-desktop.jpg`、`shot-01..06-m375.jpg`、`shot-04-disliked-state.jpg`：结果页桌面 / 375px / 点踩选择态
- 录屏 `r494-ai-audit`：附于审计会话，含 6 次完整搜索与逐次断言
- 生产存储：`localStorage` 3 键 / `sessionStorage` 0 键，测试前后逐字节相同（未产生分享/监控/收藏残留）
