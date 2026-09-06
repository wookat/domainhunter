# R546 零 AI 生产回归 — hunt.zalize.com（Worker 07d85c8e，deploy/r192-r195 @ 7b14d1f，bundle `index-2iV2dw8a.js` == 本地 dist）

- 日期：2026-09-06 14:43Z–15:04Z（UTC）
- 范围：R542（uk/de/au/fr-vs-com 英文判断段开头改写为注册局专属句）、R543（首页精确核验去重、/advanced & /shortlist & hub 筛选框 id/name/aria-label、/shortlist /monitors 按语言的 SSR 壳）、R544（375 px 44 px 触控目标）、R545 基线复现（P1-1 已注册域仍显示价格 + 去注册；P1-2 /vs 导语静态人民币价）+ 常规矩阵（分享生命周期、404、MCP、IndexNow、console sweep、Lighthouse）
- 硬约束：0 次 `/api/ai-search`；不注册不付款；storage 备份→还原字节一致；usage 前后 AI 计数 delta 0
- 录屏：`/home/ubuntu/screencasts/r546-prod-regression/r546-prod-regression-edited.mp4`
- 截图：`docs/qa/screenshots-r546/`；原始数据：`/home/ubuntu/r546/`

## 结论

**P0：无 · P1：2（R545 已知基线 P1-1 / P1-2，本轮按计划只复现、未修）· P2：无 · P3：3（见末节）。** T1–T13 全部执行完毕。测试过程中出现的 3 处测试侧偏差（T1 .io 切换不改变有效 TLD 集、T5 首轮 scrollWidth 读到 360、T7 首次 5 s 确认窗口过期）均已用修正方法复跑并确认非生产缺陷，详见各行备注。

## 零 AI / 副作用证明

| 计数（2026-09-06） | before 14:43Z | after 15:03Z | delta |
|---|---|---|---|
| searches | 0 | 0 | 0 |
| fast | 0 | 0 | 0 |
| refine | 0 | 0 | 0 |
| aiErrors | 缺失 | 缺失 | 0 |
| cspReports | 2 | 2 | 0（R534 合成值不变） |
| cspSamples（顶层） | 2 | 2 | 逐字相同 |
| pageviews 合计 | 796 | 885 | +89（home+12 results+2 tld+6 guide+5 vs+26 prices+11 other+27 = 本人浏览） |
| bots | 18465 | 19363 | +898（444×2 thin-fetch + curl + Lighthouse 10 次） |

- 浏览器 request hook（T1 三次脚本、T5 九路由、T11 十四页 sweep）：`/api/ai-search` **0 次**；浏览器发出的 `POST /api/csp-report` 0 次。
- 非 AI 生产写操作：`POST /api/search` 8 次（T1 去重测试 7 次：a/b/c/e_more 4 + 复跑 a 1 + 复跑 d 核验 1 + 重新核验 1；T6 `google` 精确核验 1 次）；`POST /api/share` 1 次（`IXAGr8oRx9`，已撤销 → 410）；MCP `tools/list` 1、`check_domains` 1、`suggest_variants` 1、`tld_prices` 1。
- IndexNow 只读字段前后逐字相同（T10）：`cronLast=indexnowLastAttempt=1788696014544`，`indexnowLastResult={"at":1788696014544,"ok":true,"status":200,"message":"OK","submitted":300,"retries":0,"fallbackHosts":["yandex.com"]}`，`indexnowPending=970`（18:00Z cron 尚未运行，符合计划「970 或 670」），`indexnowLast=1788436834369`，`pricesLastOk=1788674449394`。
- Storage：`local restore identical: True | session identical: True | byte-identical json: True`；还原时移除测试产生的 `dh:myShares:v1`；`domainhunter:lang` 因 `?lang=en` 访问漂移为 en → 经页头「中」按钮还原；theme 始终 dark；首页刷新复核 zh/dark/候选清单 3（`14_home_restored_zh_dark_3rows.png`）。

## 需求矩阵

| # | 需求 | 结果 | 证据 |
|---|---|---|---|
| T1(a) | 输入 `r546a…` 等 1.5 s 自动核验 1 次，回车后仍为 1 | PASS | `t1b_dedupe.json`：`after_1.5s_wait 1, after_enter 1`；body `{"roots":["r546a6hmg"],"tlds":["com","cn","io","ai","app","dev","co","net","me"]}` |
| T1(b) | 输入 `r546b…` 立即回车（<800 ms）→ 2 s 后恰 1 次 | PASS | `t1_dedupe.json` b.delta 1（计时器被显式核验 clearTimeout） |
| T1(c) | 改名 `r546c…` + 回车 → +1 | PASS | c.delta 1，roots 变为 `r546cvjuu` |
| T1(d) | 切换 TLD chip → +1（新 tld-set key） | PASS（备注） | 计划写 `.io`，但 `.io` 已在默认 extra 集合内，切换不改变有效 tlds → 0 次（`t1_dedupe.json` d.delta 0，测试假设问题）；改用 `.cn` 复跑 `t1c_dedupe.json`：关掉 `.cn` 仅切换 0 次、点核验 1 次、同 key 再点 1 次不重发（`0,1,1`），body 的 tlds 不含 cn |
| T1(e) | 「查更多后缀 +N」→ +1；「重新核验 <domain>」→ +1 | PASS | e_more delta 1（tlds 为 com.cn/org/xyz… 扩展集）；`重新核验 r546a6hmg.ai` delta 1 body `{"domains":["r546a6hmg.ai"]}`；`01_home_quickcheck_dedupe_chips.png` |
| T2 | /advanced 4 输入 + bulk、/shortlist 同步码、/prices /tld /guide /vs 筛选框 id/name/aria zh+en；/prices SSR 含 `<input id="prices-filter" name="q"` | PASS | `t2_attrs.json` 20/20：advanced-roots/prefixes/suffixes/tlds name 同名，aria 词根，多个用逗号分隔 / 前缀… / 后缀… / 顶级域（TLD），多个用逗号分隔，en Roots, comma-separated / … / Top-level domains (TLDs), comma-separated；`#advanced-bulk name=bulk` 粘贴要批量核验的名字或域名 / Paste names or domains to bulk check；`#shortlist-sync-code name=syncCode` 要导入的同步码 / Sync code to import；`#prices-filter #tld-filter #guide-filter #vs-filter` 均 `name=q`、aria == placeholder；`prices_ssr.html` 含 `<input id="prices-filter" name="q"` |
| T3 | /shortlist /monitors × {默认, ?lang=en, Accept-Language en, zh}：lang/title/noindex/裸 canonical | PASS | `shells_t3.txt` 8/8 HTTP 200：shortlist zh `lang="zh-CN"` + 首页中文 title，en `lang="en"` + 首页英文 title；monitors zh 「监控管理 \| DomainHunter」，en “Monitors \| DomainHunter”；全部 `noindex`，canonical `https://hunt.zalize.com/shortlist` / `/monitors`（无 lang）；浏览器 `/monitors?lang=en` 水合前后 tab title 均 “Monitors \| DomainHunter”（`02_monitors_en_title.png`） |
| T4 | uk/de/au/fr-vs-com en 首句含 Nominet / DENIC / auDA / AFNIC；无「As with every ccTLD-versus-.com call」；首 120 字两两不同；SSR==DOM；无 undefined/null/U+FFFD；thin audit | PASS（附 P3） | `t4_openers.json`：hasReg 4/4、oldOpener 0/4、bad 0、first120 两两不同；`ssr_vs_dom.json` 去空白后 4/4 相等（SSR 在价格表前截断）；`03_vs_uk_com_en_nominet_opener.png`；thin：en 444 页 linkShare 中位 **19.84%**，>25% **0**，≥23% **0**（max 22.98%），prose 中位 **628**（== R540）；zh 16.8% / 0 / 1013.5；四页 prose uk 767(737) de 796(759) au 748(726) fr 749(723) 均 ≥ R540（`vs_linkshare_summary.json`, `thin-out/pages.csv`）。P3：四页后段仍共用一句 “For a global audience, .com's recognition is irreplaceable — autocomplete reflex…” |
| T5 | 375×812 九路由：scrollWidth 375；/shortlist 返回/导入 ≥44、/monitors 返回 ≥44、/mcp Copy 命中区 ≥44、/prices 排序 ≥44、/advanced 4 输入 == 44、FAQ summary `::before` 44、首页 chips ≥44×44 不重叠且边缘 elementFromPoint 命中自身；桌面 1280 保持旧尺寸 | PASS（备注） | `t5_tap.json`：chips .com 48.81×44 / .cn .io .ai 44×44 / .app .dev 48.81×44，overlaps 0，左右边缘 6/6 命中自身；advanced 4 输入 294×44；shortlist 返回/导入/同步 44；monitors 返回 44；prices 排序 44；mcp Copy 命中区 48；FAQ summary 命中区 44；ai 0。备注：首轮 `document.documentElement.scrollWidth` 在 /advanced /prices /mcp /vs 读到 360，系纵向滚动条占宽（测量方法问题），复测 `clientWidth/innerWidth/body.scrollWidth` 均 375，无横向溢出。桌面 1280：.com chip 44.81×24、.cn/.io 37.61×24、排序按钮 32、advanced 输入 40（== R540）；`13_prices_desktop_1280_sort_32px.png`。Lighthouse mobile `/prices` ×3 CLS **0 / 0 / 0**（perf 93/91/93）。截图 `05_01`–`05_09`（zh dark ×7、`/tld/co` en、`/guide/tea` light） |
| T6 | R545 基线复现（不修） | PASS（基线 P1 ×2） | P1-1：精确核验 `google` → 全部 `google.*` 已注册；星标 `google.com` → /shortlist 4 行，该行「已注册」却仍显示「首年 $11.08 ≈¥80」+ 绿色「去注册」，且计入「批量去注册（4）」（`06_p1-1_…png`）；随后移除，清单回 3 行。P1-2：`/vs/com-vs-io?lang=zh` 导语「.io 首年 259 元、续费 419 元，.com 首年 69 元、续费 85 元」 vs 实时表 .com $11.08 ¥80/¥80、.io $28.12 ¥202 / $51.8 ¥373（`07_p1-2_…png`） |
| T7 | 分享创建/渲染/撤销/410/404；移除测试行 | PASS（附 P3） | `IXAGr8oRx9` shell 200 「3 个候选域名 \| DomainHunter」（petlovo.ai 无状态 → 中性标题）；API 200 3 items；浏览器 3 行（`08_`, `09_`）；删除→确认删除？ → 卡片消失（`10_`）；API 410；shell 410 + noindex + 「分享已撤销」；SPA 「链接已失效：分享者已删除这份清单」；`/s/nope-r546` API/shell 404 + noindex 「分享不存在或已过期」。P3：撤销后 SPA `document.title` 为英文 “This share has been revoked \| DomainHunter” 而 `<html lang>`=zh-CN、正文中文（`11_share_revoked_spa_en_title_zh_body.png`）。备注：首次「确认删除？」因截图往返超过 5 s 窗口过期，改为一批操作后成功 |
| T8 | `/r546-nope` 404 shell + UI | PASS | 404 +「页面不存在 \| DomainHunter」+ noindex（`shell_nf.html`）；UI 404/回到首页/4 个 hub chip（`12_404_zh_ui.png`） |
| T9 | MCP | PASS | `mcp_tools.json` tools = check_domains/tld_prices/suggest_variants；`check_domains ["r546zk.com"] → available`；`suggest_variants {name:"r546zk",tlds:["com"],limit:3}` 3 条；`tld_prices [co,cn]` 返回价格；全部 `isError:false` |
| T10 | IndexNow 只读逐字 | PASS | 见上，`usage_mid.json` / `usage_after.json` |
| T11 | console sweep 14 页 | PASS | `console_sweep.json`：real_err 0，csp_msgs 0，pageerror 0，requestfailed 0，ai 0，csp_post 0（仅 `/r546-nope` 1 条、`/s/nope-r546` 2 条预期 404 资源行） |
| T12 | Lighthouse 桌面 `/` `/advanced` `/vs/uk-vs-com?lang=en` `/tld/co` `/tld` `/guide/tea` + `/` mobile：a11y/SEO/BP 100 | PASS | `lh_run.log`：7/7 a11y 100 / SEO 100 / BP 100，非性能类 failing audits 0；perf 100/99/100/100/99/100/92；CLS 0–0.0003 |
| T13 | 还原 + usage | PASS | 见上 |

## P3 清单

1. **R542 四页仍共用一句后段模板句**：`/vs/{uk,de,au,fr}-vs-com?lang=en` 开头句已各自注册局专属（Nominet / DENIC / auDA / AFNIC，本轮要求通过），但判断段中段仍逐字共用 “For a global audience, .com's recognition is irreplaceable — autocomplete reflex…”。计划原则「抽样判断段不应逐字共用模板句」严格看仍未完全满足。
2. **撤销分享 SPA 标题语言与正文不一致**：`/s/IXAGr8oRx9`（410）浏览器渲染后 `document.title` = “This share has been revoked | DomainHunter”，而 `<html lang>`=zh-CN、正文「链接已失效…」为中文。SSR 壳标题为中文「分享已撤销 | DomainHunter」，水合后被 `share-page.tsx` 侧改写为英文。仅影响撤销/失效页 tab 标题。
3. **T1(d) 计划文字与实现差异**：切换 `.io` 不改变精确核验的有效 TLD 集（`.io` 已在默认 extra 集合内），因此不会（也不应）触发新请求；计划中「toggle .io → +1」应改为切换默认已选的 chip（如 `.cn`）。非缺陷，建议更新测试计划。

## 已知基线（R545，未修）

- **P1-1**：/shortlist 中已注册域名仍显示常规首年价与绿色「去注册」，并计入「批量去注册（N）」。
- **P1-2**：`/vs/*` 中文导语的静态人民币价格（如 .com 69/85 元）与下方实时价格表（¥80/¥80）矛盾。

## 证据文件

- 截图（`docs/qa/screenshots-r546/`）：`01_home_quickcheck_dedupe_chips.png`, `02_monitors_en_title.png`, `03_vs_uk_com_en_nominet_opener.png`, `05_01_375_home_zh_dark.png`, `05_02_375_advanced_zh_dark.png`, `05_03_375_shortlist_zh_dark.png`, `05_04_375_monitors_zh_dark.png`, `05_05_375_prices_zh_dark.png`, `05_06_375_mcp_zh_dark.png`, `05_07_375_tld_co_en_dark.png`, `05_08_375_guide_tea_zh_light.png`, `05_09_375_vs_app-vs-io_zh_dark.png`, `06_p1-1_shortlist_taken_google_price_register.png`, `07_p1-2_vs_com_io_zh_static_intro_vs_live_table.png`, `08_shortlist_share_created.png`, `09_share_live_page.png`, `10_shortlist_share_revoked_card_gone.png`, `11_share_revoked_spa_en_title_zh_body.png`, `12_404_zh_ui.png`, `13_prices_desktop_1280_sort_32px.png`, `14_home_restored_zh_dark_3rows.png`
- 数据（`/home/ubuntu/r546/`）：`usage_before.json`, `usage_mid.json`, `usage_after.json`, `api_prices_before.json`, `storage_before.json`, `storage_after.json`, `t1_dedupe.json`, `t1b_dedupe.json`, `t1c_dedupe.json`, `t2_attrs.json`, `prices_ssr.html`, `shells_t3.txt`, `shell_{shortlist,monitors}_{default,lang-en,al-en,al-zh}.html`, `t4_openers.json`, `ssr_vs_dom.json`, `vs_{uk,de,au,fr}_com_en.html`, `vs_com_io_zh.html`, `vs_linkshare_summary.json`, `thin-out/{summary.json,pages.csv}`, `t5_tap.json`, `shell_live.html`, `shell_revoked.html`, `shell_nf.html`, `api_share_live.json`, `nf.html`, `mcp_{tools,check,variants,prices}.json`, `console_sweep.json`, `lh_{home,advanced,vs_uk_com,tld_co,tld,guide_tea,home_mobile,prices_mobile_1,prices_mobile_2,prices_mobile_3}.json`, `lh_run.log`, `test_plan.md`
- 脚本：`t1_dedupe.py`, `t1b_dedupe.py`, `t1c_dedupe.py`, `t2_attrs.py`, `ssr_vs_dom.py`, `t5_tap.py`, `m375.py`, `console_sweep.py`, `dump_storage.py`, `restore_storage.py`, `lh_run.sh`
