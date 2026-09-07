# R493：中文规则降级路线端到端质量审计（本地无效 key，0 生产 AI）

- 日期：2026-09-04（UTC）
- 基线：`deploy/r192-r195` @ `041a764`（R489 = `apps/web/src/rule-fallback.ts` + `rule-fallback-lexicon.ts`）
- 方法：本地 `wrangler dev`（:8787，本地 KV `CACHE`，`.dev.vars` 写 `DEEPSEEK_API_KEY=invalid-r493`，未提交），主上游 401 → `quota` → 5 分钟熔断 → 规则降级；**全程未请求生产 `/api/ai-search`**
- 证据目录（本机，未入库）：`~/r493/e2e-run1.log`、`e2e-run1b.log`（修前）、`e2e-after.log`（修后）、`e2e-run1b/*.ndjson`、`e2e-after/*.ndjson`（原始 SSE）、`bench-baseline.md` / `bench-after.md`、`usage-before.json` / `usage-after.json`
- 截图：`docs/audits/screenshots-r493/`；录屏：`~/screencasts/r493-local-ui/r493-local-ui-edited.mp4`

## 0. 结论（一句话）

规则降级路线**能用但偏「拼音词 + 泛前后缀」**：12 组真实中文创业者输入里 10 组产出 16–24 个候选、每组 8–21 个 label 至少一个后缀可注册；但修前 **「云」「ai客服」两组 0 候选**（P1），**「大/客/告/感」等高频字被多音字 fail-closed 误伤**导致「大海」「告别」「客服」整词丢失（P1），3 字行业词「新能源/充电桩」被 2 字滑窗切成「新能/源充/电桩」拼音碎片（P2）。三项均在本轮以 ≤50 行词表/退化修复并加断言；UI 横幅、双语、双主题、375px、键盘可达通过，发现「点踩在降级下仍可点但没有额外说明」（P3）与「375px 折叠横幅截断到 `24 个为…`，看不到『规则生成』」（P3）。

打分（「中文创业者拿到这批候选能不能用」，10 分制）：**修前 5 / 修后 6.5**。能拿到可注册的拼音域名（chaya / yunzhang / wenpet / xinghai…），但 1/3 是 `getxxx/xxxhq/xxxapp` 泛变体，4 音节全拼拼接与 ≥13 字符长拼音（chongdianzhuangapp）仍会出现在列表尾部；离「AI 挂了产品还能用」的底线是够的，离「好名字」还有距离。

## 1. 降级路径确认（验证过）

| 项 | 证据 |
|---|---|
| 本地绑定 | wrangler 启动输出 `env.CACHE KV Namespace local`、`env.DEEPSEEK_API_KEY "(hidden)"`；`wrangler.jsonc` 无 `LLM_FALLBACK_*` 备用上游 |
| 首次请求 | `POST /api/ai-search {"description":"云"}` → 上游 401 → SSE `{"type":"fallback","round":1,"reason":"quota","count":0,"retryAfterS":300}` → `done reachedTarget=false` |
| 后续请求 | 5 分钟内 `reason:"quota-breaker"`（未再打上游，符合 `LLM_BREAKER_TTL_S=300`） |
| 本地 usage | 全部跑完 `/api/usage?days=1`：`searches 24, fast 0, aiErrors {quota:2}, fallbacks {quota:2, quota-breaker:22}` |
| 限流 | 规则降级仍受 `RATE_LIMIT_PER_HOUR=20`（KV `rl:127.0.0.1:<hour>`）限制，第 21 次返回 429；审计用 `wrangler kv key delete --local` 重置本地计数（不动生产） |

## 2. curl 端到端：12 组输入（修前，基线 041a764）

三个 TLD（com / cn / com.cn），每组 1 轮。「可注册 label」= 至少一个后缀 `available`；`unknown` 为 RDAP 查询失败/超时，不计可注册。

| # | 输入 | fallback | 候选 | 拼音词 | 寓意短拼音 | 拼音+英文 | 英文 | 泛前后缀 | 核验 | available/taken/unknown | 可注册 label | 坏例（bench 口径） | guard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 茶叶电商，寓意清雅 | quota | 24 | 4 | 4 | 8 | 0 | 8 | 72 | 31/38/3 | 16 | 1 chayedianshang | 0 |
| 2 | 宠物殡葬，温暖告别 | quota-breaker | 24 | 4 | 6 | 6 | 0 | 8 | 72 | 38/30/4 | 18 | 1 chongwubinzang；**「告别」整词丢失** | 0 |
| 3 | 做一个帮独立开发者卖课的网站，名字要有成长的意思 | quota-breaker | 24 | 6 | 6 | 4 | 0 | 8 | 72 | 51/16/5 | 21 | 6（mengduli/shengduli/mengmaike/shengmaike/dulimaike 4 音节；shengkaifazhe 长） | 0 |
| 4 | 新能源充电桩运营，希望名字有快和稳的感觉 | quota-breaker | 24 | 4 | 12 | 0 | 0 | 8 | 72 | 36/31/5 | 15 | 2 长 + **根词全是碎片 xinneng/yuanchong/dianzhuang**；「稳」未成寓意字 | 0 |
| 5 | 云 | quota-breaker | **0** | – | – | – | – | – | 0 | – | 0 | **空结果** | 0 |
| 6 | 星辰大海 | quota-breaker | 9 | 1 | 0 | 0 | 0 | 8 | 27 | 19/8/0 | 8 | 0，但 **「大海」丢失，8/9 是泛前后缀** | 0 |
| 7 | 想要一个AI客服SaaS的名字，2B，寓意高效 | quota-breaker | 16 | 1 | 0 | 6 | 1 | 8 | 48 | 28/18/2 | 13 | 0，但 **「客服」丢失**，只剩 gaoxiao/saas | 0 |
| 8 | 母婴用品品牌，寓意温暖安心 | quota-breaker | 24 | 4 | 11 | 1 | 0 | 8 | 72 | 26/45/1 | 10 | 1 muyingwennuan | 0 |
| 9 | 独立开发者工具，极简 | quota-breaker | 21 | 9 | 2 | 2 | 0 | 8 | 63 | 45/13/5 | 18 | 4（dulijijian/jijianduli 4 音节；kaifazhejijian/jijiankaifazhe 长） | 0 |
| 10 | 咖啡馆，文艺，慢生活 | quota-breaker | 24 | 4 | 4 | 8 | 0 | 8 | 72 | 37/31/4 | 17 | 1 kafeiguanwenyi | 0 |
| 11 | 面向中小商家的云端记账工具 | quota-breaker | 24 | 4 | 2 | 10 | 0 | 8 | 72 | 30/25/17 | 16 | 2 yunduanjizhang/jizhangyunduan | 0 |
| 12 | 健身工作室，活力向上 | quota-breaker | 24 | 4 | 8 | 4 | 0 | 8 | 72 | 22/42/8 | 10 | 3（xiangshangapp/getxiangshang 长；jianshenhuoli） | 0 |
| 13 | ai客服（补充） | quota-breaker | **0** | – | – | – | – | – | 0 | – | 0 | **空结果** | 0 |

合计（12 组）：候选 238，拼音词 45（19%）/ 寓意短拼音 55（23%）/ 拼音+英文 49（21%）/ 英文 1 / 泛前后缀 88（**37%**）；坏例 21（9%）；guard 全部 0 丢弃（`dropped` 各项均 0）。

候选清单（修前，按端点返回顺序）：

- 茶叶电商，寓意清雅：chaye dianshang qingya chaya yacha chaqing qingcha chatea teacha yatea teaya yashop shopya yamall mallya chayeapp dianshangapp qingyaapp getchaye getdianshang getqingya chayehq dianshanghq chayedianshang
- 宠物殡葬，温暖告别：chongwu binzang wennuan wenpet petwen chongwen wenchong nuanpet petnuan chongnuan nuanchong chongpet petchong wenchongwu wenbinzang chongwuapp binzangapp wennuanapp getchongwu getbinzang getwennuan chongwuhq binzanghq chongwubinzang
- 做一个帮独立开发者卖课的网站，名字要有成长的意思：duli kaifazhe maike mengdev devmeng shengdev devsheng mengduli shengduli mengmaike shengmaike mengkaifazhe shengkaifazhe duliapp kaifazheapp maikeapp getduli getkaifazhe getmaike dulihq kaifazhehq dulikaifazhe dulimaike kaifazheduli
- 新能源充电桩运营，希望名字有快和稳的感觉：xinneng yuanchong dianzhuang yunying xinyuan yuanxin xinkuai kuaixin yuankuai kuaiyuan xinyunying yuanxinneng yuanyunying kuaixinneng kuaiyunying xinyuanchong xinnengapp yuanchongapp dianzhuangapp yunyingapp getxinneng getyuanchong getdianzhuang getyunying
- 云：（无）
- 星辰大海：xingchen xingchenapp xingchenhq xingchenlabs xingchenhub getxingchen myxingchen tryxingchen usexingchen
- 想要一个AI客服SaaS的名字，2B，寓意高效：gaoxiao saas susaas saassu jiesaas saasjie gaoxiaosaas saasgaoxiao gaoxiaoapp saasapp getgaoxiao getsaas gaoxiaohq saashq mygaoxiao mysaas
- 母婴用品品牌，寓意温暖安心：muying wennuan anxin anying yingwen wenying yingxin xinying wenan anwen wenxin xinwen nuanan annuan anbaby muyingapp wennuanapp anxinapp getmuying getwennuan getanxin muyinghq wennuanhq muyingwennuan
- 独立开发者工具，极简：duli kaifazhe jijian jiandev devjian jianduli jiankaifazhe duliapp kaifazheapp jijianapp getduli getkaifazhe getjijian dulihq kaifazhehq dulikaifazhe dulijijian kaifazheduli kaifazhejijian jijianduli jijiankaifazhe
- 咖啡馆，文艺，慢生活：kafeiguan wenyi shenghuo wenman manwen yiman manyi yicafe cafeyi yilife lifeyi wencafe cafewen mancafe cafeman kafeiguanapp wenyiapp shenghuoapp getkafeiguan getwenyi getshenghuo kafeiguanhq wenyihq kafeiguanwenyi
- 面向中小商家的云端记账工具：yunduan jizhang yunzhang zhangyun yunbook bookyun yuncloud cloudyun yunledger ledgeryun zhangbook bookzhang zhangcloud cloudzhang yunduanapp jizhangapp getyunduan getjizhang yunduanhq jizhanghq myyunduan myjizhang yunduanjizhang jizhangyunduan
- 健身工作室，活力向上：jianshen huoli xiangshang jianli lijian jianyue yuejian liyue yueli lifit fitli yuefit fityue lisheng shengli jianshenapp huoliapp xiangshangapp getjianshen gethuoli getxiangshang jianshenhq huolihq jianshenhuoli

### 坏例清单（人工 + bench 口径）

| 类型 | 例 | 说明 |
|---|---|---|
| 空结果 | 「云」「ai客服」→ 0 候选 | 单字寓意只进 `brands`、无根词 → `enumerateSemanticDrafts` 无对可组；「ai」是英文停用词、「客」多音字 fail-closed → 无根词 |
| 拼音错配/碎片 | xinneng / yuanchong / dianzhuang / xinyuanchong / yuanxinneng | 「新能源」「充电桩」不在词表 → 2 字滑窗切成 新能 / 源充 / 电桩，`yuanchong` 读的是「源充」两个不相邻语义的字 |
| 整词丢失 | 大海 / 告别 / 客服 / 平台(泛词，应丢) | 大(da/dai/tai) 客(ke/qia) 告(gao/ju) 在 R222 表里多读音、无首选读音 → `charReading` 返回 null → 整词放弃 |
| 4 音节全拼 | chayedianshang chongwubinzang muyingwennuan jianshenhuoli dulimaike mengduli | 排序在末位，但仍占 1–6 个名额 |
| 长拼音 ≥13 | kaifazhejijian jijiankaifazhe xiangshangapp getxiangshang shengkaifazhe | 泛前后缀叠在 3 字词全拼上 |
| 词缀堆砌 | 星辰大海 9 个里 8 个是 xingchen + get/my/try/use/app/hq/labs/hub | 只有 1 个根词时旧路线不限额（R471 行为） |
| 寓意近义可疑 | 成长 → 萌（mengdev / mengduli） | 「萌」更偏可爱而非成长；升 更贴近 |
| 与寓意无关 | 「快和稳」只出 快，稳 不在寓意字表 | 用户明确要的寓意字没进候选 |

## 3. 与离线 bench 对照（验证过）

`~/r493/compare.mjs`：对同一输入直接调 `generateRuleCandidates(desc,"zh",guard)` 与端点 `proposed` 事件的 label 序列逐项比对——**13/13 组 label 集合与顺序完全一致**（含两组 0 候选）。差异来源仅剩：

1. **RDAP/WHOIS 核验层**：端点在每个 label 后追加 `tlds.length` 条 `available/taken/unknown` 事件；`unknown`（cn RDAP 超时/限速）首查 0–24%，缓存后复查降到 ~5%，会让 UI「可注册」数在两次搜索间抖动。
2. **`tried`/exclude**：首轮 `tried` 为空，与离线一致；refine/第二轮会传入已试 label（本轮未能触发第二轮——降级下「再来一轮」被禁用，见 §4）。
3. **guard**：两边同为 `admitRuleCandidate`，12 组全部 0 丢弃；修后 `星辰大海`/`ai客服` 各 1 个 `brandCollision`（dahai / kechat），离线与端点一致。
4. **限流 & 熔断**：端点还有 20 次/小时 IP 限流与 5 分钟 quota 熔断，离线没有；不影响候选内容，只影响能不能跑。
5. **bench 口径**：bench 的「坏例」只看长度/数字/元词/人工碎片表/4 音节，不检测「整词丢失」与「单字 0 候选」——修前 bench 10 组坏例率 8% 掩盖了本轮发现的 P1。

## 4. 浏览器 UI 走查（Chrome，localhost:8787，录屏 + 12 张截图）

| 场景 | 结果 | 证据 |
|---|---|---|
| zh / 浅色 / 桌面：茶叶电商，寓意清雅 | **通过**。24 个规则候选、48 次核验（UI 默认 2 TLD）、18 可注册；横幅 `role="status"`：「AI 暂不可用（配额已满，熔断中），以下 24 个名字为规则生成（描述关键词组合，已逐个后缀核验），非 AI 寓意；可稍后重试 AI。预计约 2 分钟后可重试 AI。」倒计时随时间变化；每张卡 meaning 明示「规则生成：…非 AI 寓意」 | `screenshots-r493/01-zh-light-tea-fallback.png` |
| refine / 再来一轮 / 重试 AI | **通过**：4 个 refine chip 与「再来一轮」禁用，底部提示「AI 配额受限，暂无法再来一轮，请稍后再来」；「重试 AI」按钮在 quota/quota-breaker 下不出现（符合 R476） | `02-dislike-enabled-quota-blocked.png` |
| 点踩 | **可点但无降级说明（P3）**：点击变红、tooltip「已标记不喜欢，下一轮将避开（再点取消）」，而「下一轮」此时被禁用 | 同上 |
| 云（修后代码热更新后截图） | 9 个候选（yun + 8 泛变体），1 可注册 yunhq.cn；**修前 0 候选状态只有 curl 证据（§2 #5），UI 空态未截图** | `03-yun-postfix.png` |
| 星辰大海 / 卖课长句 | 15 / 24 个候选，13 / 35 可注册，横幅正确 | `04-stars-ocean-postfix.png`、`05-indie-course-growth.png` |
| EN 界面 | 横幅英文「AI is temporarily unavailable (quota exhausted, circuit open). The 24 names below are rule-based combinations… AI should be retryable in about 4 min.」，meaning `Rule-based: formed from "mall" + pinyin "ya"; not an AI-written meaning.` | `06-en-light-tea.png` |
| 深色主题 | 横幅/候选/评分可读 | `07-en-dark-tea.png` |
| 375px | 无横向溢出（clientWidth=scrollWidth=360）；折叠横幅 `<summary>` 显示「AI 暂不可用（配额已满，熔断中）· 24 个为…」，**「规则生成」四字被截断（P3）**，展开后完整；另「AI 理解 · 茶叶电商，寓意清雅」chip 在降级下仍写「AI 理解」（P3，文案） | `09-mobile-summary-focus-closed.png`、`10-mobile-summary-expanded.png` |
| 键盘 | 输入框 → 搜索按钮 → 结果区横幅 summary（Enter 展开/收起）→ 候选 锁定/复制/收藏/注册菜单 均可 Tab 到且有可见焦点；未激活注册 | `08-keyboard-search-focus.png`、`11-mobile-candidate-lock-focus.png`、`12-mobile-register-focus-not-activated.png` |
| 控制台 | 采样读取 CDP Log/Runtime 无报错（非全程监听，**不算穷尽**） | – |

## 5. P0–P3 与处置

| 级别 | 问题 | 处置 |
|---|---|---|
| P0 | 无 | – |
| P1-a | 单字/极短寓意输入（云）0 候选，UI 只剩横幅 + 空列表 | **本轮修**：`generateRuleCandidates` 无整词根词时退化为 `cores/brands` 作根词（+3 行）→ 云 9 候选 |
| P1-b | 高频字 大/客/告/感/平/台/机/白/红… 被 R222 多读音 fail-closed 误伤，「大海」「告别」「客服」整词丢失（`~/r493/readings.mjs` 抽样 161 个常用创业词 `extractPinyinRoots` 失败 58 个） | **本轮修**：`ZH_PREFERRED_READING` +46 字（日常读音唯一），B1 断言保证每个读音都在 R222 表内；修后失败 18/161，其余多为有意停用的泛词（网站/平台/服务/品牌/数据/希望/感觉）与真多音字（成长/长久） |
| P2-a | 3 字行业词 新能源/充电桩/客服 不在词表 → 滑窗碎片 xinneng/yuanchong/dianzhuang | **本轮修**：`ZH_INDUSTRY` +新能源/充电桩/客服；bench FRAGMENTS +新能/源充/电桩 |
| P2-b | 用户点名的寓意字（稳、海、天、阳、森、晨、山）不在寓意字表 | **本轮修**：`ZH_BRAND_CHARS` +7 字 |
| P2-c | 长根词（xinnengyuan 11 / chongdianzhuang 15 字符）叠泛前后缀 → chongdianzhuangapp 18 字符；bench len>12 坏例 8/24 | **报告，交父会话**：建议 ≥10 字符根词只参与语义组合、不做泛前后缀/拼接（会改 R471 「不限额」行为，需重新定 E4 断言） |
| P2-d | 4 音节全拼拼接（chayedianshang…）仍占尾部 1–6 名额；只 1 根词时 8/9 是泛变体 | **报告**：可把 4 音节拼接改为仅在候选 < 12 时补位 |
| P2-e | RDAP `unknown` 首查最高 17/72（cn），UI 可注册数抖动 | **报告**：与 R489 无关，属核验层 |
| P3 | 点踩在降级下可点但无「本轮无法再来一轮」说明；375px 折叠横幅截断「规则生成」；「AI 理解」chip 在降级下文案不实；成长→萌 近义可疑；降级路线仍消耗 20 次/小时 AI 限流 | **报告** |

## 6. 修复后回归（验证过）

- 代码：`rule-fallback-lexicon.ts`（+46 首选读音、+7 寓意字、+3 行业词）、`rule-fallback.ts`（无根词退化，+3 行）、`scripts/verify-r489.mjs`（+F1–F4 共 6 条断言，51 PASS）、`scripts/bench-zh-rule-fallback.mjs`（`--input` 参数；INPUTS +6 组 R493 输入；FRAGMENTS +3）
- 原 10 组 bench 逐行数字与修前**完全一致**（237 候选 / 坏例 18 / 泛前后缀 34%），无回归；新增 6 组：云 9、星辰大海 15、宠物殡葬 24（坏例 0）、新能源 24（坏例 8，全部 len>12，见 P2-c）、卖课长句 24（坏例 6，4 音节）、AI客服SaaS 24（坏例 0）
- 修后端点复测（`~/r493/e2e-after.log`）：

| 输入 | 修前 | 修后 | 可注册 label |
|---|---|---|---|
| 云 | 0 | 9（yun yunapp yunhq yunlabs yunhub getyun myyun tryyun useyun） | 4 |
| 星辰大海 | 9（1 根词 + 8 泛变体） | 15（xingchen **xinghai haixing xingdahai haixingchen** dahaiapp mydahai…） | 10 |
| 宠物殡葬，温暖告别 | 24，无 告别 | 24，+gaobie/gaobieapp/getgaobie | 17 |
| 新能源充电桩运营，快和稳 | 24，根词全碎片 | 24，根词 xinnengyuan/chongdianzhuang/yunying，+kuaiev/wenev/chongwen/kuaiwen/chongev | 16 |
| ai客服 | 0 | 10（kefu chatke + 8 泛变体） | 7 |
| 卖课长句 | 24 | 24（不变） | 21 |

- 验收：`pnpm -r typecheck` ✔、`pnpm --filter web test` 101/101 ✔、`pnpm --filter web build` ✔、`node scripts/verify-r489.mjs` ALL PASS（51）

## 7. 生产 0 AI 对账

`GET https://hunt.zalize.com/api/usage?days=1`（带随机参数防缓存）：

| 字段 | 审计前 | 审计后 |
|---|---|---|
| searches | 10 | 16 |
| fast | 10 | 14 |
| refine | 0 | 2 |
| aiErrors | rate-limit 4 / quota 3 | rate-limit 4 / quota 3（不变） |
| fallbacks | quota 2 / quota-breaker 2 | 不变 |

**本会话未触发生产 AI**（验证过：所有脚本/测试代理只指向 `localhost:8787`，`~/r493` 下无任何 `zalize` 字样，测试代理确认未打开生产站）。但窗口内生产 `searches +6 / fast +4 / refine +2`——**来源未验证**（同时段其他会话或真实用户），aiErrors/fallbacks 不变说明这 6 次走的是正常 AI 路线。父会话若需归因，请核对同时段其他子会话。

## 8. 未验证 / 局限

- 修前「云」的 UI 空态只有 curl 证据，未截图（修复热更新先于 UI 走查）
- 第二轮 / refine 在降级下不可用，`tried` 排除集对规则候选的影响只有 verify E3 单测证据
- 控制台错误为采样读取，非全程监听
- 生产环境是否真的会命中修后词表（R489 在生产尚未被真实降级触达）仍未验证
