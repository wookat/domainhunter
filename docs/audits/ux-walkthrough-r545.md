# R545 · 中文创业者零 AI 全流程体验走查（3 persona × 375px/桌面）

- 日期：2026-09-06 13:29–13:57 UTC（生产 https://hunt.zalize.com ，Worker version `0358b278` = 代码 `5078d73`，基线分支 `deploy/r192-r195` tip `eb406a1`）
- 角色：用户体验官（ROUND-545），以「中文创业者」真实身份在生产走非 AI 路径；只出报告不改代码
- **录屏**：`/home/ubuntu/screencasts/r545-ux/r545-ux-edited.mp4`（18.0 MB，6 个 test_start / 17 条 assertion：11 passed · 5 failed · 1 untested；标注清单见 `docs/audits/r545/recording-annotations.json`）
- 截图：`docs/audits/screenshots-r545/`（104 张，编号 01–104；文件名 = `编号-persona-视口-页面-状态`）
- 观察原始日志：`docs/audits/r545/observations.md`（每步 期望/实际/耗时/困惑点/信任点，页面文案逐字引用）

## 0. P0/P1 摘要（先看这里）

| 级别 | 编号 | 问题 | 影响 persona | 证据 |
|---|---|---|---|---|
| P0 | — | **无**。未发现付款/数据丢失/阻断类问题；三 persona × 两视口全部走通主路径 | — | — |
| P1 | [P1-1](#p1-1) | 候选清单里**已注册（Taken）域名仍显示普通首年参考价 + 绿色「去注册 / Register」**，并计入「批量去注册 (N)」；点 Porkbun 落地页实际是 **Aftermarket $4,500 + transfer fee**（站内写 $28.12） | B（比价决策）、C（分享给合伙人后合伙人照单去买）、A | `35`、`36`、`52`、`53`、`07`、`17` |
| P1 | [P1-2](#p1-2) | `/vs/*` 对比页**同一页两套价格互相矛盾**：导语「站内参考价 .io 首年 259 元、续费 419 元，.ai 首年 499 元、续费 620 元」，下方实时表却是 ¥202/¥373、¥595/¥595；`com-vs-io`、`com-vs-cn` 导语同样写「.com 首年 69 元、续费 85 元」而实时表 ¥80/¥80（curl 复核 3 页均如此） | B（预算决策）、A | `30`、`46`、`47`；`docs/audits/r545/` 内 curl 文本摘录见 §10.2 |

零 AI：`/api/usage?days=1` 前后 `searches 0→0 / fast 0→0 / refine 0→0`；浏览器请求日志 `net.log` 中 `ai-search` 出现次数 = **0**（详见 §3）。storage 字节级还原：`sha256 61c02c9b…` 前后一致（§4）。

## 1. 结论（SOP-04）

1. **主路径可用**：三 persona 在桌面与 375px 均完成「输入名字 → 实时状态/到期日 → 星标 → 清单备注/排序/分享/同步码 → 监控与撤销 → CSV 导出 → 内容页 → 404 恢复」全流程，无 P0；375px 所有已测页面 `document.documentElement.scrollWidth ≤ 375`（无整页横向溢出），注册商菜单、分享/同步区块均在屏内。
2. **信任链最薄的一环是「价格语义」**（两条 P1 都在这里）：产品承诺「只给你能立刻注册的，附到期日与人民币参考价」，但清单/分享把已注册域名也配上普通首年价与「去注册」，对比页导语与实时表数字打架。对以比价为目的的出海 SaaS 创始人（B）和把清单转给合伙人的 C，这是会直接影响决策的可信度问题，不是像素问题。
3. **首屏理解与入口**基本达标：zh/en 首页 hero 一句话说清定位，「精确核验」tab 首屏可见（桌面 0 屏滚动，375 约半屏），并明确写「输入现成名字可即时核验、不消耗 AI 次数」。
4. **事实核验全部一致**：17 个「可注册/已注册」结论与注册局 RDAP/WHOIS 一致（含到期日到天）；3 个价格（.com/.io/.ai）与 `/api/prices`、Porkbun API 与 Porkbun 公开页三方一致。
5. 与 R540 相比无回归；R540 的 P3「回车触发两次 `/api/search`」本轮复现 4 次（§7 P3-1）。

## 2. 范围、方法与限制

### 2.1 Persona 脚本

| Persona | 身份 | 语言 | 路径 |
|---|---|---|---|
| A | 做茶叶电商，想要有寓意的拼音 .cn/.com | zh | 首页精确核验 `chaxiang` → chips → 查更多后缀 → 星标 .cn/.com → 再查 `mingqiancha`、`yeyecha` → 已注册 chip / 注册商菜单 → `/shortlist` → `/tld/cn` → `/guide` 搜「茶」→ `/guide/tea` |
| B | 出海 SaaS，比较 .com/.io/.ai 价格与注册商 | **en** | 首页 `?lang=en` 精确核验 `stackpilot` → `/prices` 筛 com/io/ai → `/vs` → `/vs/io-vs-ai` → `/tld/io` `/tld/ai` → 清单 Register 菜单 → Porkbun 落地页（只看不买）→ `/shortlist` 排序/导出/分享控件 |
| C | 手里 5 个候选名，批量核验、分享合伙人、监控 1 个被占用域名 | zh | 首页「批量核验」→ `/advanced` 粘贴 `lingxicha / yunqiji / shanhetea / mochamo / qingfengke` × `com,cn,net,io,ai` → 导出 CSV → 星标 3 → `/shortlist` 备注/排序/分享 `/s/:id`/同步码 → `/monitors` 加 `mochamo.com` → 撤销 → `/why` `/mcp` → 404 |

每个脚本桌面（1600×1200 Chrome 窗口最大化）与 375×812（CDP `Emulation.setDeviceMetricsOverride` + `setTouchEmulationEnabled` + `setEmitTouchEventsForMouse`，iPhone UA，DPR 2）各跑一遍，共 6 段。

### 2.2 工具与证据链

- 单一生产标签，后台 `keeper.py` 通过 CDP 记录该标签全部 `/api/*` 请求（`docs/audits/r545/net.log`，含 POST body 前 300 字节），并按 `ctl.json` 切换视口/`Accept-Language`。
- `probe.py` 每个首次进入的页面读 Performance API（TTFB/DCL/load/FCP、`scrollWidth`、`maxTouchPoints`、`<html lang>`）→ `probes.jsonl`。
- `shot.py` 每个断点抓视口截图；录屏用 `recording_start/annotate_recording/recording_stop`。
- HTML 抽取一律 `curl -A "Mozilla/5.0 …"`（`curl/8` UA 在本轮也返回 200，未触发 Cloudflare 拦截）。
- 脚本原文随证据一起归档在 `docs/audits/r545/*.py`。

### 2.3 限制（必须与结论一起读）

- **仿真 ≠ 真机**：`computer` 工具每次交互会把 CDP 触屏仿真重置（probe 出现 `touch=0`），13:38 起 keeper 每 1.5 s 重放触屏参数，其后大多数 375 probe 为 `touch=5`；布局/横溢结论有效，**软键盘、滚动手感、真实触控命中未验证**。
- keeper 在 13:36:43–13:37:44Z 重启，`net.log` 有约 1 分钟空窗；该窗内只做了 375 首页「查更多后缀」和滚动。零 AI 的**决定性证据是 `/api/usage` 计数器前后 0 增量**（覆盖全程），`net.log` 是辅助。
- SPA 站内跳转时 Performance navigation timing 仍是首个 document 的值，故 `A-desktop-shortlist`、`C-desktop-advanced` 等 probe 的 FCP 不是该路由自身耗时；LCP 探针全部为 null（未验证）。
- 「首个可注册结果出现秒数」是「`/api/search` 请求时间 → 含可注册 chip 的截图文件时间」的**上界**（含工具截图延迟），不是渲染耗时。
- 一次操作偏差：C-375 点击分享链接时 `target=_blank` 短暂打开了第二个 hunt 标签，立即关闭并在原标签用地址栏打开同 URL；截图 `89` 因此为桌面尺寸，正确的 375 分享页证据是 `90`。不涉及 AI 调用。
- 未做独立真人 10 秒理解测试；「10 秒看懂」为观察者判断。

## 3. 零 AI 证明

`GET https://hunt.zalize.com/api/usage?days=1`（`docs/audits/r545/usage-before.json` 13:27Z / `usage-after.json` 14:00Z，最后一次生产请求 13:56:24Z，间隔 > 60 s）：

| 字段 | before | after | Δ |
|---|---|---|---|
| searches | 0 | 0 | **0** |
| fast | 0 | 0 | **0** |
| refine | 0 | 0 | **0** |
| cspReports | 2 | 2 | 0 |
| pageviews.home / tld / guide / vs / prices / other | 64 / 218 / 121 / 215 / 30 / 101 | 70 / 221 / 123 / 218 / 31 / 111 | 本轮浏览 |
| pageviews.results | 10 | 13 | +3（本轮 `net.log` 49 次导航中**无** `/results`；增量来源未验证，可能是其他访客或 `/s/:id`、`/advanced` 归类，仅记录） |

浏览器侧（`docs/audits/r545/net.log`，keeper 记录）：`grep -c ai-search` = **0**；按端点计数：`/api/search` 19（精确核验 16，其中 2 次为「查更多后缀」+ 批量 2 + 监控前复查 1）、`/api/registrars` 42、`/api/prices` 29、`/api/stats` 10、`/api/monitor*` 7、`/api/share*` 4、`/api/sync` 3、`/api/click` 2。全程未点击「AI 猎名 / 开始寻找」、示例提示、refine、再来一轮。

## 4. storage 还原证明

- 备份：`docs/audits/r545/storage-before.json`（13:27Z）：`domainhunter:lang="en"`、`domainhunter:shortlist="[]"`、`domainhunter:theme="dark"`，sessionStorage 空。
- 走查后：`storage-after-walkthrough-redacted.json` 新增 `dh:myShares:v1`（2 个分享）、`domainhunter:monitor="[]"`、`domainhunter:sync:code`（已脱敏）、`lang="zh"`、`shortlist` 12 项。
- 还原（`restore_storage.py`，14:00Z）：`localStorage.clear()` 后逐键写回，`sessionStorage.clear()`；程序比对 `STORAGE_IDENTICAL`，JSON 序列化 89 字节 = 89 字节；文件级 `cmp storage-before.json storage-restored.json` 无差异，`sha256` 均为 `61c02c9bb341fc6f12dea8109df524fe3287096c826250372f657de2072dc081`（`storage-sha256.txt`）。
- 生产侧痕迹：`/api/monitor` 已 `enabled:false` 撤销（列表清空，截图 `70`、`96`）；两个分享快照 `/s/gSISSiQ0Df`、`/s/TeQM0fv62Q` 为公开只读快照（30 天有效），同步码推送的清单（90 天）无法从客户端删除——这是产品设计，非本轮可清理项，仅记录。

## 5. 问题清单（P0–P3）

> 每条：现象 → 复现 → 影响 persona → 证据 → 建议（只建议不改码）。「验证过/未验证/推断」逐项标注。

### P0

无。

### P1

<a id="p1-1"></a>**P1-1 已注册域名在清单/分享路径仍配「普通首年价 + 去注册」**（验证过）

- 现象：`/shortlist` 中 `chaxiang.com`（Taken · expires 2027-05-13）、`stackpilot.io`（Taken · 2029-02-02）、`stackpilot.ai`（Taken · 2027-07-31）三行右侧显示 `1st yr $11.08 / $28.12 / $82.7` 与绿色 `Register`，顶部「Register all (5)」把它们一并计入；点 `stackpilot.io` 的 Register → Porkbun `$28.12` → 新标签 `porkbun.com/checkout/search` 预填 `stackpilot.io`，实际标注 **Aftermarket $4,500 + transfer fee**。首页 chips 对已注册域名**不**显示价格（只有到期日），与清单不一致。
- 复现：首页精确核验 `stackpilot` → 星标已注册的 `.io` → 顶部候选清单 → 该行「Register」→ Porkbun。
- 影响：B（以站内价做预算，落地页价差 160 倍）、C（合伙人打开 `/s/:id` 或同步后照清单去买；分享页本身正确地只给可注册项 CTA，但清单不然）、A（`.cn` 已注册行同样有「去注册」，菜单阿里云/腾讯云/Dynadot 无价）。
- 证据：`35-B-desktop-shortlist-register-menu.png`、`36-B-desktop-porkbun-aftermarket.png`、`52/53`（375 同现象，外站为桌面宽）、`07-A-desktop-shortlist-cn-menu.png`、`17-A-375-shortlist-taken-register.png`；`net.log` 13:42:20.750Z `/api/click`。
- 建议（推断）：已注册行隐藏首年价或改写为「已注册 · 到期 YYYY-MM-DD · 可开监控」，CTA 改为「开监控 / 看 WHOIS」；「批量去注册 (N)」只计可注册项（与 `/s/:id` 分享页一致）；若保留外链，标注「二级市场价以注册商为准」。可参考 docs/competitor-teardown-r101.md #8：IDS 用 Available/Premium/Aftermarket/Taken 四态图例区分。

<a id="p1-2"></a>**P1-2 `/vs/*` 导语静态人民币价与同页实时表矛盾**（验证过，3 页）

- 现象：`/vs/io-vs-ai` 导语（zh/en 同）「站内参考价 .io 首年 259 元、续费 419 元，.ai 首年 499 元、续费 620 元」；同页「价格与 5 年持有成本」表：`.io $28.12 ¥202 / $51.8 ¥373`，`.ai $82.7 ¥595 / $82.7 ¥595`，表下注「Live prices from Porkbun (fetched 2026-09-06 06:00 UTC)」。curl（Mozilla UA）复核 `/vs/com-vs-io`、`/vs/com-vs-cn` 导语均写「.com 首年 69 元、续费 85 元」，而实时表 `.com $11.08 ¥80 / $11.08 ¥80`。
- 复现：打开任一上述 `/vs/` 页，对比第一段与价格表。
- 影响：B（不知道预算该信哪个：.ai 首年 ¥499 还是 ¥595）；A（.cn/.com 导语价 vs 表）。
- 证据：`30-B-desktop-vs-price-contradiction.png`、`29`、`46-B-375-vs-io-ai.png`、`47-B-375-vs-table.png`；curl 摘录：`docs/audits/r545/vs-price-contradiction.md`。
- 建议（推断）：导语中的价格改为模板变量与实时表同源，或改口径为「静态参考价（2026-0x 快照）」并显式说明；`faq.test.ts` 复读率守门下建议用「见下表」替代具体数字。**注意**：`.ai` 的「多数注册商两年起注，首笔至少一千元出头」这句是正确且有价值的（Porkbun 公开页原文「.AI Domains require a minimum term of 2 years for registration and renewals」），见 P2-2。

### P2

**P2-1 375px「查更多后缀」中已注册长域名 chip 截断**（验证过）
- 现象：`chaxiang.com.cn` 显示为 `chaxiang.com.…` 且「已注册」换行，`chaxiang.cc` 等带监控按钮的 chip 同样截断；整页 `scrollWidth=360 ≤ 375`，非横溢。
- 复现：375 首页精确核验 `chaxiang` → 「查更多后缀 +400」→ 滚到 `.com.cn`/`.cc`。
- 影响：A（中文创业者最关心的 `.com.cn` 恰在其中）。证据：`14-A-375-home-more.png`。
- 建议：chip 内域名允许两行或省略中间而非末尾（保留 TLD）；「已注册 + 到期日」在窄屏折为第二行。

**P2-2 `.ai` 两年起注未在 chip / `/tld/ai` 出现**（验证过：Porkbun 公开页；站内 `/tld/ai` curl 无「两年/2 年」字样）
- 现象：首页 chip `chaxiang.ai 可注册 $82.7`、批量 `首年 $82.7 ≈¥595`、`/tld/ai`「Register $82.7 · Renew $82.7」，均无最低年限提示；Porkbun 公开页写「.AI Domains require a minimum term of 2 years」，即首笔 ≥ $165.40。只有 `/vs/io-vs-ai` 导语提到。
- 影响：B（预算低估一倍）。证据：`02`、`33-B-desktop-tld-ai.png`、`49`、`docs/audits/r545/prices-compare.md`。
- 建议：TLD 事实源加「最低注册年限」字段，chip/清单/`/tld/ai` 显示「2 年起 · 首笔 ≈$165.4」。

**P2-3 实时价缺少并列的来源与时间**（验证过）
- 现象：首页 chip 只写 `$28.12`，无注册商名/更新时间/人民币；`/shortlist`、`/advanced` 写「首年 $28.12 ≈¥202」仍无来源；只有 `/prices`、`/tld/*`、`/vs/*` 写「Live prices from Porkbun (fetched …)」。首页对已注册域名不显示价格，对可注册显示美元，而产品定位文案说「附到期日与人民币参考价」。
- 影响：A/B/C 全部（信任点缺失，非报价错误）。证据：`02-A-desktop-home-chips.png`、`13`、`39`、`59`。
- 建议：chip hover/长按或结果区脚注统一一句「Porkbun 实时价 · 06:00 UTC 拉取 · ≈¥ 按 7.2」；首页对中文用户优先显示 ¥。

**P2-4 「批量核验」→「高级模式」命名断裂，粘贴区在词根组合器之下**（验证过）
- 现象：首页 tab「批量核验」与顶栏「高级模式」进入同一页 `/advanced`，页面标题「高级模式 · 词根 × 前后缀 × TLD 批量组合生成」，真正的「批量粘贴核验」在组合器下方；375 需滚一屏多才到粘贴框。TLD 为纯文本输入（`com,cn,net,io,ai`）而非可选 chips。
- 影响：C。证据：`54`、`55-C-desktop-advanced-empty.png`、`74`、`75-C-375-advanced-empty.png`。
- 建议：从「批量核验」进入时锚点定位到粘贴区或把粘贴区置顶；TLD 用 chips（与首页一致）。

**P2-5 批量核验无「已完成 N/25」进度**（验证过）
- 现象：按钮「核验 25 个域名」旁「已识别 25 个域名」是输入计数；结果流式增长（18→20 可注册）但没有完成进度/总耗时；结果为分组列表无表头（表头只在清单页）。
- 影响：C（不知道何时可以导出/分享）。证据：`57-C-desktop-advanced-running.png`、`58`、`59`、`77`。
- 建议：显示「已核验 x/25 · 用时 s」（对比 docs/competitor-teardown-r101.md #8：Lean Domain Search 用「N available in 0.554s」做社会证明）。

**P2-6（未独立复测）内容页右上「Shortlist」一次点击回首页，需再点一次才进清单**
- 现象：B 桌面从 `/tld/ai` 点右上「Shortlist」落到首页，再点一次才进 `/shortlist`（录屏观察一次，未复现）。证据：录屏 B desktop 段、`34-B-desktop-shortlist.png`。
- 建议：先复现；若属实，内容页头部清单按钮应直达 `/shortlist`。

### P3

- **P3-1 回车/自动核验触发两次 `/api/search`**（验证过，R540 已知）：`net.log` 13:33:20.727/21.311（chaxiang）、13:33:52.657/53.244（mingqiancha）、13:34:08.082/08.665（yeyecha）、13:39:53.624/54.210（stackpilot）各 2 次；375 端（13:36:15.289/15.881）同样。非 AI，成本为 RDAP/DNS 双查。
- **P3-2 375 顶栏清单只剩书签图标无文字**（验证过）：需猜测「书签 = 候选清单」；`12`、`13`、`38`。
- **P3-3 清单行「监控」开关视觉约 36×20 px**（截图判断，未测命中区）：旁边删除/去注册按钮约 44 px；`84`、`93`。
- **P3-4 `/prices` 子串筛选过宽**：筛 `io` 匹配 14 条（含 auction 等），筛 `ai` 7 条且目标在末尾，375 需下滚；`25`、`27`、`44`、`45`。
- **P3-5 `stackpilot.app` 375 端「Checking」≥16 s 未完成**（一次观察）：`39`、`40`（13:43:12 与 13:43:24 两张仍为 Checking）。
- **P3-6 备注失焦后第一次点排序未重排，第二次成功**（一次观察，未复现）：`60`、`61`、`63`。
- **P3-7 首页 chip 价格无 ¥，清单/批量有 ≈¥**（验证过）：对中文创业者的口径不一致；`02` vs `59`。
- **P3-8 `/tld/cn` 价格为「静态参考价：首年 ¥33 · 续费 ¥38/年 · 非实时报价」，无具名注册商/时间**（验证过）：`08`、`19`。
- **P3-9 `/mcp` 对非技术创业者门槛高**（验证过）：首段说清用途（「把它加进 Claude、Cursor 等支持 MCP 的 AI 工具后，AI 就能在对话里直接批量核验域名…」），但 JSON-RPC/`.mcp.json` 代码块在 375 需框内横滚；`72`、`98`、`99`。
- **P3-10 en 首页 hero 仍以「.cn / .com」「Chinese」为主诉求**（验证过）：「Name it in Chinese or English, hunt .cn / .com domains you can actually register」；出海 SaaS（B）要 .io/.ai 需要自己去查更多——这是定位取舍而非缺陷，记录供产品判断；`22`。

## 6. 亮点

- 首页精确核验 tab 首屏可见，且文案直接消除 AI 焦虑：「输入现成名字可即时核验、不消耗 AI 次数；描述寓意则交给 AI 帮你猎名。」（`01`、`02`）
- 已注册 chip 直接给到期日（`chaxiang.com 已注册 2027-05-13 到期`），与注册局一致到天（§10.1）。
- `/prices`、`/tld/*`、`/vs/*` 价格表把首年/续费并列并具名来源与拉取时间（「Live prices from Porkbun (fetched 2026-09-06 06:00 UTC)」），续费跳涨有 `↑` 提示（`24`–`27`）。
- 注册商菜单真正预填域名（Porkbun 落地页 `stackpilot.io`），Dynadot 标注「CNY · Alipay」，阿里云/腾讯云在列（`35`）。
- 清单本地保存、备注不随分享外发、分享页只给可注册项 CTA 并写「快照生成于 2026年9月6日 · 状态以实时核验为准」（`64`、`90`）。
- 监控撤销有 5 秒倒计时二次确认，撤销后列表清空；说明「每 6 小时自动复查…推送 webhook 通知」（`69`、`95`、`96`）。
- 批量核验 25 项流式出结果，CSV 真实下载（UTF-8 BOM，25 数据行 + 表头，20 available / 5 taken，两视口一致）。
- 375 全部已测页面无整页横溢；注册商菜单、分享/同步为页内区块而非模态，不被裁切（`18`、`52`、`91`、`92`）。
- 404 页有「回到首页」+ 4 个内容入口，375 实点可回首页（`73`、`100`、`101`）。
- `/guide` 搜「茶」得 6 篇；`/guide/tea` 具体到「双拼是王道：好读的双拼 + .cn 是国内最熟悉的品牌形态」「价格带自检：把名字分别放进礼盒柜台与便利店冰柜想一遍」（`10`、`11`）。

## 7. Persona 逐段摘要（完整逐步表见 `docs/audits/r545/observations.md`）

### A · 茶叶电商（zh）

| 视口 | 期望 vs 实际 | 耗时 | 困惑点 | 信任点 |
|---|---|---|---|---|
| 桌面 | 首屏找到非 AI 入口 ✔（0 屏滚动）；`chaxiang` 9 后缀 6 可注册，com/cn/net 已注册 ✔；查更多一次展开 +400 ✘（过多）；星标 0→2→3 ✔；长拼音无长度/寓意提示 ✘ | 首屏 FCP 196 ms；首个可注册 chip ≤ 6 s（请求 13:33:20.7 → 截图 13:33:26） | 已注册 chip 点击无反应；清单已注册行也有「去注册」；`.cn` 菜单三家无价 | 到期日；「本地保存 · 注册前建议重新核验可用性」 |
| 375 | 精确 tab 半屏可见 ✔；chips 单列超一屏；`.com.cn` chip 截断 ✘；书签图标进清单 ✔；菜单在屏内 ✔ | FCP 116 ms；`scrollWidth 360` | 书签无文字；星标反馈不明显（未验证新增） | `/tld/cn`「静态参考价…非实时报价」诚实标注 |

竞品对比（仅引用 docs/competitor-teardown-r101.md 已记录事实）：IDS「落地即可打字、逐字符即时结果」——本站精确核验也是即输即查，但落地未自动聚焦（r101 #1 同一结论）；IDS 一屏 27+ 结果的高密度 vs 本站 375 单列 chips + 400 后缀一次展开。

### B · 出海 SaaS（en）

| 视口 | 期望 vs 实际 | 耗时 | 困惑点 | 信任点 |
|---|---|---|---|---|
| 桌面 | `stackpilot` com/io/ai 全 Taken（到期日与 RDAP 一致）；`/prices` 三价可查 ✔ 但筛选过宽；`/vs/io-vs-ai` 导语与表矛盾 ✘；Register 菜单预填 ✔ 但 taken 行仍有普通价 ✘ | 首屏 FCP 140 ms；首个 Available chip ≤ 5 s | 同页两套价；Register all 计入 Taken | 「Live prices from Porkbun (fetched …)」；「Renewals cost more than registration — budget for it」 |
| 375 | 价格表换行不横溢 ✔；菜单在屏内 ✔；外站落地为桌面宽（仿真只约束 hunt 标签，未验证真机） | FCP 156 ms | `stackpilot.app` 长时间 Checking | 同桌面 |

竞品对比：Porkbun「双价并排（首年/续费）」本站已在 `/prices`、`/tld`、`/vs` 表中做到（r101 T11）；IDS「Available/Premium/Aftermarket/Taken 四态图例」是 P1-1 的直接参照——本站只有 可注册/已注册/未知 三态，没有 aftermarket/premium 语义。

### C · 5 个候选批量（zh）

| 视口 | 期望 vs 实际 | 耗时 | 困惑点 | 信任点 |
|---|---|---|---|---|
| 桌面 | 25 项 20 可注册/5 已注册 ✔；CSV 25 行 ✔；备注/排序/分享（30 天）/同步码（90 天）✔；监控加→确认→撤销 ✔；404 ✔ | 批量请求 13:47:30.4 → 全部 25 行 CSV 落盘 13:47:45.6（≤ 15.2 s 上界）；`/why` FCP 476 ms（本轮最慢首屏） | 「批量核验」≠「高级模式」；无完成进度；评分列全「—」 | 「不消耗 AI 次数 · 一次最多 200 个」；监控二次确认 |
| 375 | 同上全部 ✔；结果行隐藏价格只留域名/按钮；分享/同步区把清单推下一屏多 | 复查缓存命中 ≤ 2 s | 粘贴框在组合器下方；监控开关小 | 备注重进保留（`103`） |

竞品对比：query.domains「免费批量 WHOIS，一次贴几百行」（r101 #71）vs 本站 200 上限 + CSV + 星标 + 分享一体；Namecheap Beast Mode「前后缀/TLD 组合矩阵」（#87）对应本站「高级模式」上半区。

## 8. 首屏耗时表（Performance API，非 SPA 沿用值；完整见 `probes.jsonl`）

| 页面 | 视口 | TTFB | DCL | load | FCP |
|---|---|---|---|---|---|
| `/?lang=zh` | 桌面 | 69 | 172 | 194 | 196 |
| `/?lang=zh` | 375 | 3 | 69 | 91 | 116 |
| `/?lang=en` | 桌面 | 22 | 114 | 126 | 140 |
| `/?lang=en` | 375 | 4 | 130 | 157 | 156 |
| `/prices?lang=en` | 桌面 / 375 | 43 / 3 | 131 / 112 | 170 / 147 | 188 / 152 |
| `/vs/io-vs-ai?lang=en` | 桌面 / 375 | 114 / 5 | 196 / 138 | 238 / 153 | 264 / 144 |
| `/tld/cn?lang=zh` | 桌面 / 375 | 144 / 3 | 215 / 73 | 221 / 126 | 236 / 120 |
| `/guide/tea?lang=zh` | 桌面 / 375 | 37 / 9 | 152 / 178 | 152 / 196 | 188 / 220 |
| `/s/:id` | 桌面 / 375 | 27 / 24 | 170 / 203 | 171 / 204 | 200 / 236 |
| `/monitors?lang=zh` | 桌面 / 375 | 20 / 20 | 155 / 219 | 156 / 220 | 208 / 252 |
| `/why?lang=zh` | 桌面 / 375 | 199 / 5 | 432 / 215 | 433 / 230 | **476** / 228 |
| `/mcp?lang=zh` | 桌面 / 375 | 26 / 5 | 195 / 213 | 205 / 238 | 192 / 224 |
| 404 | 桌面 / 375 | 24 / 8 | 192 / 223 | 193 / 223 | 228 / 252 |

单位 ms；均 < 500 ms，首屏性能不是本轮问题。LCP 全部 null（未验证）。

## 9. 打分（1–5，附证据）

### 9.1 Nielsen 十原则

| # | 原则 | 分 | 证据 |
|---|---|---|---|
| 1 | 系统状态可见性 | 3 | 精确核验有「全部 9 / 可注册 6 / 已注册 3」计数 ✔（`02`）；批量无 N/25 进度 ✘（P2-5）；`stackpilot.app` 长时间 Checking（P3-5） |
| 2 | 系统与真实世界匹配 | 3 | 「可注册/已注册/到期」用词贴近 ✔；已注册却配「去注册 + 首年价」违背真实市场语义 ✘（P1-1）；「高级模式」偏技术（P2-4） |
| 3 | 用户控制与自由 | 4 | 监控撤销 5 s 二次确认（`69`、`95`）、清单删除/清空、404 回首页 ✔；分享/同步生成后无法从客户端撤回（记录） |
| 4 | 一致性与标准 | 2 | 同页价格两套（P1-2）、首页 $ vs 清单 ≈¥（P3-7）、首页已注册无价 vs 清单有价（P1-1）、「批量核验」vs「高级模式」（P2-4） |
| 5 | 防错 | 3 | 精确核验不消耗 AI 明示 ✔；「批量去注册 (N)」把已注册计入、外链到 aftermarket 无提示 ✘（P1-1）；`.ai` 两年起注未提示（P2-2） |
| 6 | 识别而非回忆 | 4 | 清单排序选项、TLD chips、404 内容入口均可见 ✔；375 清单只剩书签图标（P3-2）；`/advanced` TLD 需手填（P2-4） |
| 7 | 灵活与效率 | 4 | 回车即查、批量粘贴 200、CSV/TXT 导出、同步码免登录 ✔；`/prices` 筛选过宽（P3-4） |
| 8 | 美学与极简 | 4 | 暗色一致、chips 密度合理 ✔；一次展开 +400 后缀过长（A-3）；分享/同步区块把清单推下一屏（C-375） |
| 9 | 帮助用户识别/诊断/恢复错误 | 4 | 404 文案「你访问的链接不存在或已被移除，请检查网址是否正确」+ 回首页 ✔（`73`、`100`）；本轮未触发其他错误态（未验证网络失败/限流提示） |
| 10 | 帮助与文档 | 4 | `/guide` 410 篇可搜、`/tld/cn` 实名/备案说明、MCP 页写明「无需 API key、不自动注册」✔；`/mcp` 对非技术用户仍高门槛（P3-9） |

均分 3.5/5；拉低分数的集中在「一致性」与「防错」，即价格语义。

### 9.2 移动可用性（375×812 仿真）

| 项 | 分 | 证据 |
|---|---|---|
| 无横向溢出 | 5 | 全部 probe `scrollWidth ≤ 375`（`probes.jsonl`） |
| 关键入口可达 | 4 | 精确 tab 半屏可见、书签图标进清单、404 回首页均可点；`/advanced` 粘贴区需滚一屏多（P2-4） |
| 内容截断/可读 | 3 | `.com.cn` chip 截断（P2-1）；MCP 代码框需横滚（P3-9）；长文首段占满一屏（A-8、B-4） |
| 触控目标 | 3 | 删除/去注册/取消监控约 44 px ✔；清单监控开关约 36×20、chip 星图标小（P3-3；截图判断，未量命中区） |
| 浮层/菜单不越界 | 5 | 注册商菜单（`18`、`52`）、分享/同步（`90`–`92`）均在屏内 |
| 表单效率 | 3 | 批量粘贴一次填 5 行 ✔；TLD 手填、同步码 8 位输入框 ✔；真机软键盘未验证 |
| 结果密度 | 3 | chips 单列，9 个超一屏；结果行隐藏价格（C-375）省空间但少信息 |

均分 3.7/5。

## 10. 事实核验

### 10.1 可注册/已注册 × 注册局（`docs/audits/r545/rdap-verification.jsonl`，IANA bootstrap `data.iana.org/rdap/dns.json`；`.cn` 走 `whois.cnnic.cn:43`，`.io` 无 RDAP 走 `whois.nic.io:43`）

| 域名 | 站内结论（截图） | 注册局 | 到期日 站内 / 注册局 | 一致 |
|---|---|---|---|---|
| chaxiang.com | 已注册（`02`） | Verisign RDAP 200，registrar 22net | 2027-05-13 / 2027-05-13T18:26:54Z | ✔ |
| chaxiang.cn | 已注册（`02`） | CNNIC whois，阿里云 | 2026-12-11 / 2026-12-11 | ✔ |
| chaxiang.net | 已注册（`02`） | Verisign RDAP 200 | 2027-09-04 / 2027-09-04T18:36:19Z | ✔ |
| mingqiancha.com | 已注册（`04`） | Verisign RDAP 200，Alibaba Cloud | 2027-06-25 / 2027-06-25T07:08:21Z | ✔ |
| yeyecha.com | 已注册（`05`） | Verisign RDAP 200 | 2030-09-15 / 2030-09-15T10:37:03Z | ✔ |
| stackpilot.com | Taken（`23`） | Verisign RDAP 200，Name SRS AB | 2028-10-05 / 2028-10-05T06:11:00Z | ✔ |
| stackpilot.io | Taken（`23`） | whois.nic.io「Registrar URL hostinger」 | 2029-02-02 / whois 未返回到期字段（未验证到期日） | ✔（状态） |
| stackpilot.ai | Taken（`23`） | Identity Digital RDAP 200，GoDaddy | 2027-07-31 / 2027-07-31T22:44:26Z | ✔ |
| lingxicha.com / .ai / .io | 可注册（`59`） | RDAP 404 / RDAP 404 / whois「Domain not found.」 | — | ✔ |
| yunqiji.com / shanhetea.com | 可注册（`59`） | RDAP 404 / 404 | — | ✔ |
| yunqiji.cn | 已注册（`59`） | CNNIC whois，浙江贰贰 | 2026-12-12 / 2026-12-12 | ✔ |
| mochamo.com | 已注册（`59`、`68`） | Verisign RDAP 200，DNC Holdings | 2027-08-24 / 2027-08-24T04:00:00Z | ✔ |
| qingfengke.com / .net | 已注册（`59`） | Verisign RDAP 200 / 200 | 2027-07-07 / 2027-07-07T08:26:39Z；2032-09-23 / 2032-09-23T06:22:47Z | ✔ |

17/17 状态一致；11 个站内显示到期日且注册局返回到期字段的域名 11/11 一致到天（`stackpilot.io` whois 未返回到期字段）。

### 10.2 价格 × `/api/prices` × Porkbun（`docs/audits/r545/prices-compare.md`、`prices-api.json`）

| TLD | 站内页面显示 | `/api/prices`（fetchedAt 2026-09-06 06:00:49Z，USD，usdToCny 7.2，351 TLD） | Porkbun API `pricing/get` | Porkbun 公开页 `porkbun.com/tld/<tld>` 原文 | 一致 |
|---|---|---|---|---|---|
| .com | `/prices` $11.08 / $11.08；chip `$11.08` | 11.08 / 11.08 | 11.08 / 11.08 | 「$11.08 everyday low price」 | ✔ |
| .io | `/prices` $28.12 / $51.8；chip `$28.12` | 28.12 / 51.8 | 28.12 / 51.80 | 「$28.12 first year sale $51.80 regular registration / renewal / transfer」 | ✔（站内 28.12 是首年促销价，`/prices` 用 `↑` 提示续费更高） |
| .ai | `/prices` $82.7 / $82.7；chip `$82.7` | 82.7 / 82.7 | 82.70 / 82.70（transfer 165.09） | 「$82.70 everyday low price $82.70 renewal … .AI Domains require a minimum term of 2 years」 | ✔ 数字一致；**最低 2 年未在站内 chip/`/tld/ai` 体现**（P2-2） |

另：`.cn` 不在 `/api/prices`（`prices.cn = null`），站内以「≈$5 / ¥33 静态参考价」标注，属诚实口径（P3-8 只是缺具名来源）。

## 11. 未验证清单 / 建议下一步

未验证（本轮无法或未做）：
- 可注册 `.io/.ai` 的注册商落地价（`stackpilot.io/.ai` 均已注册，只验证了 taken → aftermarket 路径）；A 的注册商外链落地。
- 375 真机：软键盘、触控命中区、外站（Porkbun）移动布局（仿真只作用于 hunt 标签）。
- 跨设备同步码导入、分享 30 天/同步 90 天过期、监控 6 小时复查与 webhook、MCP 客户端接入。
- LCP、精确首结果渲染耗时、SSE 结束时刻；`pageviews.results +3` 的来源。
- P2-6、P3-5、P3-6 为单次观察，需复现。

建议下一步（只建议，不改码；按 P 级）：
1. P1-1/P1-2 合并为一轮「价格语义一致性」修复：清单/批量对已注册行隐藏普通价与 Register CTA、「批量去注册」只计可注册、`/vs/*` 导语价格与实时表同源或改为快照口径（`faq.test.ts` 复读率守门需同时通过）。
2. P2-2：TLD 事实源加最低注册年限，`.ai` 各处显示「2 年起」。
3. P2-1/P2-4/P2-5：375 chip 换行策略、`/advanced` 从「批量核验」进入锚点到粘贴区、批量进度 N/25。
4. 复现 P2-6（内容页 Shortlist 按钮）后决定是否修。
5. 下一轮 UX 走查建议用真机（或 Playwright 原生 `hasTouch` context）复测 §9.2 触控项。

## 12. 需注意

- 本报告零 AI 结论的决定性证据是 `/api/usage` 计数器（覆盖全程）；`net.log` 有 1 分钟 keeper 空窗，已如实标注。
- 生产残留：两个公开分享快照与一个同步码推送记录（服务端按 30/90 天过期），监控已撤销；浏览器 storage 已字节级还原。
- 归档的 `net.log`/`page-texts.txt`/`storage-after-walkthrough-redacted.json` 中同步码已脱敏为 `XXXXXXXX`；`probes.jsonl` 已去掉 localStorage 内容。
- 本 PR 只新增 `docs/audits/ux-walkthrough-r545.md`、`docs/audits/r545/`、`docs/audits/screenshots-r545/`，无源码改动；本地验收（`pnpm -r typecheck` / `pnpm --filter web test` 402 passed / `pnpm --filter web build` / `node scripts/check-content-counts.mjs`）在基线与加入文档后均通过（`docs/audits/r545/local-acceptance-baseline.log`）。

## 附录 · 证据文件索引（`docs/audits/r545/`）

| 文件 | 内容 |
|---|---|
| `observations.md` | 6 段逐步观察表（期望/实际/耗时/困惑/信任，页面文案逐字） |
| `net.log` | 该标签全部 `/api/*` 请求（时间戳、方法、URL、body 前 300 字节）+ 导航 + 视口切换 |
| `probes.jsonl` | 每页 Performance/几何/触控探针 |
| `page-texts.txt` | 各断点 DOM 文本抽取（用于逐字引用） |
| `usage-before.json` / `usage-after.json` | `/api/usage?days=1` 前后 |
| `storage-before.json` / `storage-restored.json` / `storage-sha256.txt` / `storage-after-walkthrough-redacted.json` | storage 备份、还原结果、哈希、走查后快照（脱敏） |
| `rdap-verification.jsonl` | 17 个域名注册局复核原始返回摘要 |
| `prices-compare.md` / `prices-api.json` | 价格三方对照与 `/api/prices` 原始返回 |
| `vs-price-contradiction.md` | 3 个 `/vs/*` 页导语静态价 vs 实时价 curl 摘录（P1-2） |
| `bulk-export-desktop.csv` / `bulk-export-375.csv` | 两视口真实下载的 CSV |
| `recording-annotations.json` | 录屏标注（test_start/assertion/setup） |
| `keeper.py` `probe.py` `shot.py` `rdap.py` `dump_storage.py` `restore_storage.py` | 本轮用到的全部脚本 |
| `local-acceptance-baseline.log` | 四条本地验收命令结果摘要 |
