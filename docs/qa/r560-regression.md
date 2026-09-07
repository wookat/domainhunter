# R560 生产零 AI 回归（hunt.zalize.com · Worker f415f96f-516d-4827-876c-85beebe7d3db = 676f6fe）

- 执行时间：2026-09-06 18:58–19:15 UTC；执行方式：会话 Chrome 133（CDP :29229，navigator.language=en-US，localStorage lang=zh）+ Playwright/curl；另用全新 headless Chromium 137 / 133 profile 做 T3 对照。
- 零 AI 约束：全程 `page.on('request')` 计数 `/api/ai-search` = 0（browser-regress.log、t3/*.json、t8/net.log、t1/hydration.log 均记录 `ai: 0`）；未点击「开始猎取」。
- 范围：仅增量 R556（f1d20d4, 6809021）+ R557（77cd3d1）+ 冒烟；上一版由 R558/R559 覆盖。
- 标注：**验证过** = 生产上实际执行并有原始证据；**推断** = 由旁证推导；**未验证** = 未做。分级 P0 阻断 / P1 严重 / P2 一般 / P3 轻微或环境。
- 原始数据：`/home/ubuntu/r560/`；截图：`docs/qa/screenshots-r560/`；录屏（51s）：`/home/ubuntu/r560/r560-recording-51s.mp4`（= `/home/ubuntu/screencasts/r560/r560-edited.mp4`）。

## 结论总览

| 项 | 结论 |
|---|---|
| R556-① 分享页 og:locale 三态 zh/en，SSR==水合 | ✅ 12/12 SSR + 7/7 水合一致；R558 bare-zh 问题**未复现** |
| R556-② 字体 preload 告警 | ✅ 全新 profile 12 路由×3 访 0 告警、0 error；会话 Chrome 本轮 0 告警（18:26 上一段 24/24 有告警，判定为旧缓存/LCPP 残留，P3 推断） |
| R556-③ 四页 en 正文 | ✅ SSR==水合 4/4；n=8 共享片段 0；DENIC/YouGov 有；⚠️ **verdict 口径下 au(530)/fr(555) < 600 词**（整页 prose 均 >900） |
| R557 /monitors 直接添加 | ✅ 端点 + UI zh/en + 键盘 + 375px + 清理全部通过；1 条 UX 备注（Tab 顺序含清空 ×） |
| 冒烟 | ✅ 8/8 200 且 title 一致；/api/prices 非 stale；MCP 3 工具；404 壳；IndexNow pending 670 |
| 收尾 | ✅ storage 字节级 EQUAL；usage searches/fast/refine 0→0；分享/监控全部清理 |

## 明细

| T | 内容 | 结论 | 级别 | 标注 | 证据 |
|---|---|---|---|---|---|
| T1 | `/s/:id` ready(nbIUPn6bui 自建)/revoked(IXAGr8oRx9 410)/notFound(r560nf…) × zh/en SSR：`html lang` / `og:locale` / `<title>` 同源，revoked/notFound 带 noindex | ✅ 12/12：zh→zh-CN/zh_CN/中文 title；en→en/en_US/英文 title；`?lang=` 与 Accept-Language 两种入口一致 | – | 验证过 | `r560/t1/ssr-summary.log`, `t1/*.html`, `t1/create.json` |
| T2 | R558 复现：bare URL（无 ?lang，navigator en-US，storage zh）打开三态 + `?lang=en/zh`，水合后 lang/og/title 与 SSR 比对 | ✅ 7/7 一致；bare zh revoked/live/notFound 水合后 og=**zh_CN**（R558 记录的 en_US 未复现） | – | 验证过 | `t1/hydration.log`, `t1/hydration.json`, `screenshots-r560/t2-share-bare-zh-revoked-hydrated.png`, 录屏 0:40– |
| T3a | 全新 headless Chromium 137 profile：12 路由 zh × 首访/二访/三访，统计 jetbrains preload 告警与 console error | ✅ 36/36 告警 0、error 0；`link[rel=preload][href*=jetbrains][crossorigin]` 均存在 | – | 验证过 | `t3/fresh-zh.log`, `t3/fresh-zh.json` |
| T3b | 同 Chrome 133（与会话 Chrome 同版本）全新 profile 4 路由×3 访；会话 Chrome 4 路由 ×（正常 / Network.clearBrowserCache 后） | ✅ 12/12 与 8/8 均 0 告警 | – | 验证过 | `t3/fresh133-zh.log`, `t3/session-chrome.log` |
| T3c | 上一段（18:26–18:28，同一会话 Chrome）曾 24/24 页面出现该告警 | ⚠️ 本轮同浏览器已 0；归因为部署切换后仍命中旧 HTML 缓存（max-age 600）/LCPP 学习态残留，无法回溯确证 | P3 | 推断 | `r560/browser-regress.log`（grep preload = 48 行） |
| T4 | uk/de/au/fr-vs-com en `#verdict` SSR 文本 == 水合 textContent（?cb= 重跑） | ✅ 4/4（忽略标签边界空白后完全相等；首轮"1 词差"为提取器在 `</h2>` 处补空格所致） | – | 验证过 | `t5/t4-ssr-vs-hydrated.log` |
| T5 | 四页 verdict 两两 n=8 词共享片段 | ✅ 6 对均 0 个 ≥8 词共享片段；n=6 残留 5 处通用短语（如 "trust far beyond any new gtld"），仅信息 | – | 验证过 | `t5/report.json`, `t5/summary.log`, `t5-ngram.py` |
| T6 | 每页 prose ≥600 词；de 含 DENIC/YouGov | ⚠️ **verdict 口径**：uk 607 / de 646 / **au 530 / fr 555**（两页 <600）；**整页 prose（main 去 table/nav/链接）**：1030 / 1076 / 960 / 990 均 ≥600。DENIC + YouGov 句完整（71% / 14% / 三分之二）。**负责人裁定**：R546 基线（`docs/qa/r546-regression.md` T4）用的是整页 prose 口径（uk 767 / de 796 / au 748 / fr 749），本轮 1030 / 1076 / 960 / 990 全部高于基线，「verdict 段 ≥600」为本轮任务书的口径假设而非基线 → **PASS**，不留 P2 | — | 验证过 | `t5/report.json`, `t5/de-vs-com.en.html` |
| T7 | `POST /api/monitor/add` curl 矩阵 | ✅ 空/`foo`/`a b.com`/`https://`/非 JSON→400 invalid_domain；`x.notatld`→400 unsupported_tld tld=notatld；`foo.com.cn`→400 unsupported_tld tld=com.cn；`https://www.GOOGLE.com/search?q=1`→200 added:true taken expiresAt 2028-09-14（归一 google.com，monitored 2→3）；`r560qa1805215054.com`→200 added:false available（不入监控）；清理后 list entries=[] monitored=2 | – | 验证过 | `t7/summary.log`, `t7/*.json`, `t7-monitor-add.sh` |
| T8 | UI zh /monitors：空提交、`foo`、`a b.com`、`https://google.com/`、`GOOGLE.COM` 重复、随机可注册 | ✅ 空→「请输入域名」(role=alert，红框)；foo / a b.com→「域名格式不对…」aria-invalid=true aria-describedby 指向反馈；google→列表立即出现 `google.com 已注册 2028-09-14 到期`，提示「已加入监控：google.com（已注册，2028-09-14 到期）」，全局名额 2→3；GOOGLE.COM→「google.com 已在你的监控清单里」列表仍 1 行；r560qa7731905.com→「现在就可以注册，不需要监控——直接去注册吧」+「去注册 · Porkbun」链接，列表无该行（符合 docs/research/monitors-add-form.md：可注册即拒绝并导流） | – | 验证过 | `screenshots-r560/t8-*.png`, 录屏 0:00–0:20, `t8/net.log` |
| T9 | UI en：label / 按钮 / 错误文案 | ✅ "Add a domain to monitor" / "Check & monitor" / "That doesn't look like a domain — enter a full name like example.com (letters, digits, hyphens)" / 可注册提示 "…is available right now — no need to monitor it, just register it" + "Register · Porkbun" | – | 验证过 | `screenshots-r560/t9-foo-invalid-en.png`, 录屏 0:20– |
| T10 | 键盘：Tab 可达、Enter 提交 | ✅ Enter 提交触发 `/api/monitor/add`（example.org→Now monitoring example.org (taken, expires 2027-08-30)）；Tab 顺序：输入框有文字时 Tab→「清空输入 ×」→ 再 Tab→提交按钮；输入框为空时 Tab 直达提交。备注：× 按钮出现在 Tab 序中属可访问设计，但与「Tab 一步到提交」预期不同 | P3（UX 备注） | 验证过 | `screenshots-r560/t10-*.png`, 录屏 |
| T11 | 375px 浅/深色（CDP Emulation, mobile, dpr2）：无横向溢出、触点 ≥44 | ✅ dark：clientWidth=innerWidth=body.scrollWidth=docScrollWidth=375；light：innerWidth 375、clientWidth=body.scrollWidth=docScrollWidth=360（15px 经典垂直滚动条，非横向溢出）；两主题均无元素 right>375；输入框 44px、按钮 44px（宽 309/294） | – | 验证过 | `t11/report.json`, `t11/run.log`, `screenshots-r560/t11-monitors-375-{dark,light,side-by-side}.png` |
| T12 | 清理：UI「取消监控→确认取消？(5s)」两步移除 example.org、google.com | ✅ 名额 4→3→2/500，空态文案恢复；`POST /api/monitor/list` entries=[] monitored=2；localStorage `domainhunter:monitor`=`[]` | – | 验证过 | `t8/monitor-list-after.txt`, `t8/storage-monitor-after.txt`, `screenshots-r560/t12-*.png` |
| T13 | `/ /shortlist /prices /vs/com-vs-cn` × zh/en：200 + SSR title == 水合 document.title | ✅ 8/8 200；title 8/8 相等（`/vs/com-vs-cn?lang=en` SSR 为 `&amp;` 实体、DOM 为 `&`，html.unescape 后相等）；console error 0 | – | 验证过 | `t13/hydrated-titles.log`, `t13/ssr_*.html`, `t13-smoke.sh` |
| T14 | `/api/prices` 200 且 stale!=true；MCP tools/list；`/nope-r560` 404 壳 | ✅ prices 200，无 stale 字段，fetchedAt=1788674449621，351 项；MCP 200 → check_domains / tld_prices / suggest_variants；404 zh「页面不存在 \| DomainHunter」/ en「Page not found \| DomainHunter」+ noindex | – | 验证过 | `t13/prices.json`, `t13/mcp-tools.json`, `t13/404-*.html` |
| T15 | IndexNow 只读 | ✅ indexnowPending=670（≤670）；indexnowLastResult `{ok:true,status:200,submitted:300,retries:0,fallbackHosts:[yandex.com]}`；indexnowLastError=null | – | 验证过 | `t13/usage.json`, `usage/after-191330.json` |
| T16 | storage 还原 | ✅ 7 个 localStorage 键与 `storage-pre.json` 字节级 EQUAL（lang=zh、theme=dark、monitor=[]…）；sessionStorage 前后均 {} | – | 验证过 | `storage-final-diff.log`, `storage-pre.json`, `storage-final.json` |
| T17 | usage 前后（before 18:58:51 → after 19:13:30，间隔 >60s，no-cache） | ✅ searches 0→0、fast 0→0、refine 0→0；非 AI 增量：pageviews home +8 / prices +8 / results(=/s 分享页) +10 / vs +16 / other +16（本轮页面加载所致），bots +32（含本轮 curl UA "Mozilla/5.0 r560" 被计为 other） | – | 验证过 | `usage/diff.log`, `usage/before-185851.json`, `usage/after-191330.json` |
| 清理 | 分享 nbIUPn6bui DELETE（token）→ `/api/share` 与 `/s/` 均 410；监控 google.com / example.org 已取消；随机域名从未入监控 | ✅ | – | 验证过 | `t1/delete-nbIUPn6bui.json`, `t8/monitor-list-after.txt` |

## 需要关注的点

1. ~~**P2 · T6 词数口径**~~ → 已裁定 PASS：R546 基线为整页 prose 口径（748/749），本轮 960/990 高于基线；verdict 段 ≥600 非既有基线。
2. **P3 · T3c**：本轮任何浏览器均无 jetbrains preload 告警，修复在生产有效；18:26 会话 Chrome 出现的 24/24 告警不可回溯复现，归因为旧 HTML 缓存/LCPP 残留属推断。
3. **P3 · T10 UX**：输入框非空时 Tab 先到「清空输入 ×」再到提交按钮（两次 Tab）；如期望一步到提交，可将 × 设为 `tabindex=-1`（可访问性权衡，仅备注）。
4. 脚本层假阳性（非生产问题，已在原始日志标注）：`api-regress.log` 3 条 FAIL 为旧断言/`/api/search` body 契约错误；T13 `&amp;`；T4 标签边界空白。

## 未验证

- R546 词数基线的原始口径（见上）。
- `/api/monitor/add` 的 `unknown` 状态分支（需 RDAP 超时才会触发，生产不易构造）。
