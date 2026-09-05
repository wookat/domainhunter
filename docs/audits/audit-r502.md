# R502 零 AI 全站生产审计（覆盖 R485–R499 上线后）

- 生产：https://hunt.zalize.com （version `1c558753`，2026-09-04 23:10Z 部署；代码 `deploy/r192-r195` @ `0565741`）
- 审计时间：2026-09-04 23:31Z – 2026-09-05 00:05Z
- 上一次全站审计：[audit-r484.md](./audit-r484.md)（2026-09-04 早间，R478–R483 上线后）
- 方法：CDP 接管可见 Chrome（Playwright）真实走查 1280×900 与 375×900、浅色 + 深色、zh + en；curl/urllib 直打 HTTP；`scripts/seo-audit/lang-matrix.sh`、`scripts/seo-audit/fetch.mjs graph` + `analyze.mjs` 全量 1270 URL；Lighthouse 13.4.1（desktop/mobile）；axe-core 4.13.0（`wcag2a/2aa/21aa`，浅色 + 深色 ×9 页）
- **生产 AI 调用 0 次**：浏览器侧捕获 0 个 `/api/ai-search`；`/api/usage` 前后 `searches 19→19`、`fast 16→16`、`refine 3→3`、`llmProvider.primary 20→20`、`aiErrors`/`fallbacks` 无变化（§2.10）
- 证据：本目录 `screenshots-r502/`（20 张关键截图）、`r502/`（lang-matrix、SEO 图/BFS 报告、HTTP/axe/Lighthouse 结构化结果、浏览器逐页报告、usage 快照）；审计机原件 `~/r502/`（73 张截图、Lighthouse 12 份 html/json、`seo/graph.json`、`findings-browser.json`）与录屏 `~/screencasts/r502-browser/r502-browser-edited.mp4`（随汇报附件交付）
- **不修代码**：本轮只报不修。无 P0，无 P1。

## 0. 结论

| 项 | 结果 |
|---|---|
| P0 / P1 | **无** |
| P2 | 2 条：**R488 IndexNow 增量推送首次以新代码运行（09-05 00:01Z）仍 429、`submitted 0`**，`indexnowLast` 停在 09-03 12:00Z（P2-2，运维项）；**R492 Accept-Language SSR 使裸 URL 在 en 客户端下 canonical 指向 `?lang=en`**，Lighthouse SEO 6/6 从 R484 的 100 降到 92（`canonical` 审计失败），对 Google 是否构成真实收录风险为推断（P2-1） |
| P3 | 4 条：`/mcp` 代码块可滚动不可聚焦（axe serious，既有未报）；分享页把所有条目标为「可注册」（含已注册域名，既有设计）；sitemap `<lastmod>` 仍是 2026-08-10 而 R483 六篇指南 09-04 新增（既有未报）；MCP `suggest_variants` 传带 TLD 的名字被静默去点而非报错（R484 报告中的「明确报错」复现不成立） |
| R484 遗留 | P1-1 浅色对比度 **关闭**（浅色 9 页 axe 0 违规）；P2-1 outbound 丢写 **未验证**（R487 已改分片，本轮未做并发点击）；P3-1 shortlist 空表头 **未验证**（空态无表格）；P3-2 Radix 伪阳性 **保留备查**；P3-3 无安全头 **保留**（6 个头仍全缺） |
| 零 AI | `/api/usage` 前后 AI 相关计数全部 0 增量；浏览器 0 `/api/ai-search`、0 `/api/click`、3 个非 AI `POST /api/search`（1 精确 + 2 批量） |
| 首页 | zh/en hero、精确核验（1 次 `/api/search`，9 chips 8 可注册 + .ai 未知）、行业模板 chip 只填不发、R491 footer 408/410/444 + 三个「浏览全部」+ /why /mcp /advanced /prices 全 PASS |
| `/advanced` | 3 域名批量：2 可注册 + 1 已注册（zalize.com 到期 2027-07-06）、CSV 控件在 |
| `/prices` | 408 条 Hunt 链接、后缀升/降序、`.cn` 筛选 1 行；无 stale 警告（`pricesLastOk` 2026-09-04T12:00Z） |
| 三 hub | `/tld` 408 / `/guide` 410 / `/vs` 444 卡片；分组锚点滚到 sticky nav 下方（section y≈128 / nav bottom 124）、筛选、回到顶部全 PASS |
| 三内容页 | `/tld/cn`、`/guide/cn-realname`（R483）、`/vs/com-vs-cn`：面包屑 R459（父级点击回 hub）、JSON-LD 2/3/3、相关链接、R491 站内导航 /why /mcp /advanced 全 PASS；zh/en 均渲染 |
| /why /mcp /monitors /shortlist | PASS（monitors 空态 + 全局占用 2/500；shortlist 空态） |
| 404 | `/no-such-page-r502`、`/tld/zzznotatld`、`/guide/zzz-none`、`/vs/zzz-vs-yyy` 全部真实 HTTP 404 + `noindex` + 品牌页；`/api/share/zzz` 404 |
| 分享 | `POST /api/share` 200 → `/s/2v_F9ouT_X` 渲染 3 条 + 注册商菜单 Esc 关闭 → `DELETE` 200 → `GET /api/share` **410** → UI「链接已失效」 |
| MCP | `initialize` 2025-03-26 / `tools/list` 恰 3 工具 / `check_domains` 4 域名 2 taken + 2 available（1.6s）/ `tld_prices` 408 条（57 approx）/ `suggest_variants` 6 条 available |
| R492 语言矩阵 | 9 路径 × 3 模式 27/27 符合预期（`r502/lang-matrix.md`） |
| R491 SSR 内链 | 首页原始 HTML `<a>` 站内 25；全量 1270 URL 抓取非 200 = 0；BFS-B 从 `/` 可达 **1270/1270**，孤岛 0，零入链页 0 |
| R495 | `/why?lang=zh` 切 EN → URL 立即 `?lang=en`，F5 仍 en；裸路径 `/tld/cn` 切 zh 后 F5 仍 zh |
| R486 微信 UA | `/`、`/tld/cn`、`/guide/cn-realname`、`/s/:id` MicroMessenger UA 均 200、SSR title/og 完整、正文含隐藏 `<img src="/wx-share.png">`；`/wx-share.png` 200 `image/png` 26,062 B |
| R485 | 未配置 `BAIDU_*`：HTML 无 `baidu-site-verification`、无 GSC/Bing meta、无 CF beacon；`baiduLast/baiduLastError = null` |
| Lighthouse ×6 | a11y **6/6 = 100**；性能 desktop 100/100/100、mobile 92/97/93；best-practices 6/6 = 100；**SEO 6/6 = 92**（P2-1） |
| axe ×18 | 浅色 9 页 + 深色 9 页：仅 `/mcp` 3 条 `scrollable-region-focusable`（P3-1），其余 0 违规；**浅色 `color-contrast` 0 条** |
| 375px | 12 条路由 × 浅/深 24/24 `scrollWidth = innerWidth = 375` |
| 键盘 | 首页 Logo → 高级模式 → 候选清单 → GitHub → 语言 → 主题 → 关闭引导 → AI/精确/批量 → textarea，全部可见焦点 |
| console | JS pageerror 0；资源错误 3 条 = 2 条故意 404 + 1 条撤销分享的 410（均为预期噪音） |
| 状态还原 | local/sessionStorage 还原后与 `storage-r502-pre.json`（空）字节级相等；测试分享 `2v_F9ouT_X` 已撤销 |
| `/api/usage` 观察 | 09-05 00:01Z cron 已跑：`indexnowLastError` 更新为 **00:01:25Z 429 submitted 0**、`indexnowLast` 仍 09-03 12:00Z（P2-2）；`pricesLastOk` 00:01:39Z 不 stale；`botsBy.baidu` 7；`baiduLast` null |

## 1. 问题清单

### P2-1 R492 Accept-Language SSR：en 客户端访问裸 URL 时 canonical 指向 `?lang=en`，Lighthouse SEO 100→92（新增，R492 起）

- 现象（验证过）：Lighthouse 13.4.1 6/6 次运行 SEO = 92，唯一失败审计 `canonical`：*Points to another `hreflang` location*。用 `-G` 导出 artifacts 确认：请求 `https://hunt.zalize.com/`（无 query），Chrome 默认 `Accept-Language: en-US` → worker 返回 en 版 HTML，`<link rel="canonical" href="https://hunt.zalize.com/?lang=en">`，而 hreflang 同时含 `zh → /` 与 `en → /?lang=en`。Lighthouse 规则：canonical ≠ 当前 URL 且两者都在 hreflang 集合 → 判为跨语言 canonical 错误
- 对照：R484 同样 4 页 ×2 Lighthouse SEO 全 1（当时 Lighthouse 12，且 R492 未上线，裸 URL 恒返 zh）。R492 后 `lang-matrix.sh` 27/27 与设计一致（`Accept-Language: en` → canonical `?lang=en`，`Vary: Accept-Language`），即这是 R492 的**设计后果**，不是实现 bug
- 风险评估（推断，未验证）：Googlebot 常规抓取不带 Accept-Language，会拿到 zh 版 + 自指 canonical，无影响；但 Google 文档说明其对「locale-adaptive pages」可能带不同 Accept-Language 抓取（geo-distributed crawling），此时裸 URL 的 canonical 指向 `?lang=en`，存在裸 URL 被并入 `?lang=en` 的可能。`Vary: Accept-Language` 已设置，是正确的缓解手段。是否真实发生只能靠 GSC「网页索引编制 → 重复网页，Google 选择的规范网页与用户指定的不同」观察
- 复现：`lighthouse https://hunt.zalize.com/ --only-audits=canonical -G` → `artifacts/artifacts.json` `LinkElements`；或 `curl -H 'Accept-Language: en' https://hunt.zalize.com/ | grep canonical`
- 证据：`r502/lighthouse-summary.json`（`seoFail: ["canonical"]` ×6）；`r502/lang-matrix.md`
- 建议（不在本轮范围）：三选一——(a) 裸 URL 在 en 协商时 canonical 仍自指 `/`（hreflang 已足够表达 en 版）；(b) en 协商时 302 到 `?lang=en` 而非直接 200 返 en 内容；(c) 保持现状，仅在 GSC 观察 2–4 周。由负责 SEO 的会话论证后定

### P2-2 R488 IndexNow 增量推送首次以新代码运行仍 429（`submitted 0`），`indexnowLast` 已 36h 未前进（既有问题，R488 未解决）

- 现象（验证过）：审计前 `indexnowLastError = {at 2026-09-04T18:00:11Z, 429}`（旧代码全量）；等到 09-05 00:00Z cron 后 00:02:47Z 复读：`cronLast 00:01:25Z`、`indexnowLastError = {at 2026-09-05T00:01:25Z, status 429, message "Too many requests", submitted 0}`、`indexnowLast` 仍 `2026-09-03T12:00:34Z`。同一 cron 的 `pricesLastOk` 已前进到 00:01:39Z，说明 cron 本身正常，只有 IndexNow 一步失败
- 定性：handoff §10 1b 明确「未验证前不得称 429 已解决」——现已验证**未解决**。按 R488 设计，`pushed` 快照为空时首轮仍是全量 1270 条单请求，与 18:00Z 旧代码的形态相同，被 api.indexnow.org 同样限流；下次尝试在 6h 冷却后 06:00Z。若 06:00Z 仍 429，说明不是「首轮全量」的问题，而是该 key/host 被限流或 1270 条单批过大
- 影响：Bing/Yandex/Naver 等自 09-03 12:00Z 起未收到任何 URL 通知（sitemap 仍可被动抓取，Google 不用 IndexNow），R483 六篇新指南与 R491 改动未主动推送
- 复现：`curl 'https://hunt.zalize.com/api/usage?days=1&cb=1' | jq '.indexnowLast,.indexnowLastError'`
- 建议（不在本轮范围）：(a) 观察 06:00Z / 12:00Z 两次；(b) 若仍 429，把首轮全量改为分批（如 200/批、批间隔）或先把 `indexnow:pushed` 快照预置为当前 sitemap 使后续只推增量；(c) 手工用 key 提交 1 条 URL 验证 key 是否被 IndexNow 端拒绝（`400/403/422` 会有不同码，429 是纯限流）
- 证据：`r502/usage-r502-pre.json`、审计机 `~/r502/usage-r502-post3.json`（§2.10 表下方）

### P3-1 `/mcp` 代码块 `<pre class="overflow-x-auto">` 可滚动但不可键盘聚焦（axe `scrollable-region-focusable`，serious；既有，R484 未跑此页）

- 现象（验证过）：axe-core 4.13.0 浅色与深色各 3 条，目标 `.relative.mt-3:nth-child(13|14|16) > pre`（配置 JSON 代码块），其余 8 页 0 违规。R484 的 axe 只跑了 `/ /tld/cn /guide/saas /prices /shortlist`，故是**既有但首次报出**
- 根因文件（源码核对）：`apps/web/src/components/mcp-page.tsx:111` `<pre className="overflow-x-auto …">`，无 `tabIndex={0}`；该行自 R110（2026-08-07）未变
- 复现：`localStorage.setItem('domainhunter:theme','light')` → 打开 `/mcp?lang=zh` → 运行 axe（`~/r502/axe_light.py`）
- 建议：`<pre tabIndex={0} …>`（同 shadcn code block 惯例），不改样式
- 证据：`r502/axe-light-dark.json`、`screenshots-r502/F-mcp-1280.png`

### P3-2 分享快照页把全部条目标为「可注册」，含已注册域名（既有设计，非回归）

- 现象（验证过）：`POST /api/share` 只接受 `{domain,label,tld,meaning?,scores?}`（`worker.ts` `ShareItem` 无 status 字段），任意域名都能入快照；`/s/2v_F9ouT_X` 显示「复制 3 个可注册」并为每行渲染「去注册」，其中 `zalize.com` 在同一轮 `/advanced` 批量核验为**已注册**（到期 2027-07-06）。页头有「状态以实时核验为准」小字
- 定性：分享页设计前提是「来自猎名结果的可注册候选」，服务端不复核；正常用户路径只会分享已核验可注册的域名，故仅在 API 直调或域名状态在分享后变化时出现误导。既有行为（R484 也是同一 API）
- 复现：`curl -X POST /api/share -d '{"items":[{"domain":"zalize.com"}]}'` → 打开返回的 url
- 建议：文案「复制 N 个域名」+ 更醒目的「注册前请重新核验」；或打开时后台 `POST /api/search` 复核并标灰已注册项（成本：每次打开 1 次非 AI 核验）
- 证据：`screenshots-r502/H-share-light-1280.png`、`B-advanced-all-three-statuses-1280.png`

### P3-3 sitemap `<lastmod>` 全部为 `2026-08-10`，R483 六篇 .cn 合规指南（09-04 新增）也标 08-10（既有，R484 未报）

- 现象（验证过）：`/sitemap.xml` 1270 条 `<lastmod>2026-08-10</lastmod>`；`git log -S cn-realname` 显示 `bcab476 2026-09-04 R483: add 6 bilingual .cn compliance & process guides`，但 `apps/web/src/worker.ts:1980` `CONTENT_LASTMOD = "2026-08-10"` 未同步（handoff §9 已提醒「增删内容页记得更新」）
- 影响：搜索引擎看不到新页「更新」信号；R488 增量 IndexNow 按 URL 集合差异推送，不依赖 lastmod，故新 URL 仍会被推
- 建议：R483 类内容 PR 的检查清单加一条「改 `CONTENT_LASTMOD`」，或改为从内容数据的最大日期派生
- 证据：`r502/findings-http.json` `C_nonhtml["/sitemap.xml"].lastmod_sample`

### P3-4 MCP `suggest_variants` 传 `name:"zalize.com"` 不报错，静默变成 `zalizecom` 前后缀变体（既有；R484 报告称「明确报错」不成立）

- 现象（验证过）：`tools/call suggest_variants {name:"zalize.com"}` → `isError:false`，返回 `zalizecomhq.com / getzalizecomapp.com / zalizecomapp.com …`。R484 §2 写「传带 TLD 的名字 → 明确报错 `invalid name: pass a bare label…`」，本轮复现不成立
- 根因文件（源码核对）：`worker.ts:1032` `normalizeLabel()`（`packages/core/src/generate.ts:11`，`replace(/[^a-z0-9-]/g,"")`）先把 `.` 删掉，`name.length < 2` 的报错分支只对空/单字符触发；`normalizeLabel` 自 M0 未变，R484 的说法应为笔误或用了单字符输入
- 影响：AI 客户端把整域名当 name 传入时得到语义错误但「看似成功」的结果
- 建议：在 `normalizeLabel` 前检查 `args.name` 含 `.` 时报 `invalid name`（tool description 已写 bare label）
- 证据：`r502/findings-http.json` `E_mcp.suggest_variants_invalid`

### 观察项（不列级）

- `/s/:id` SSR 同时输出两个 `og:image`（`/api/og/:id` + 模板兜底 `/og.png`，前者在先），微信/主流抓取器取第一个，功能正常；如需洁净可去掉分享页的第二个
- 分享撤销后 `DELETE /api/share/:id` 对任意 token 都返回 `{ok:true}`（代码 `if (snapshot.revoked) return ok` 在 token 校验之前，幂等设计），不泄露信息
- 首页 footer 无 Cloudflare Web Analytics 隐私说明且 `script[data-cf-beacon]` = 0：与 `growth-inject.ts` 未配置 `ANALYTICS_*` 时的预期一致（R484 同样「无 CF beacon」），不是缺陷；是否应配置属产品决策
- `/why`、`/mcp` SSR 原始 HTML 内链 0（`r502/seo-graph-report.md` 逐页表）：R491 只给这两页加了 SSR H1，导航靠水合；不影响 BFS（首页 → hub → 全量可达）
- 全站 SSR 内链 99.7% 带 `?lang=zh|en`：R491 保留 `SSR_CANONICAL_ZH_LINKS=false` 的已知决策（handoff §11），BFS-A（严格裸路径）1/1270 是该决策的直接后果，逻辑图 BFS-B 1270/1270
- 精确核验 `.ai` 返回「未知」（RDAP/WHOIS 未给出结论），是暴露的不确定态而非错误，未重试

## 2. 逐项证据

### 2.1 零 AI 与状态纪律

- 浏览器请求捕获（`findings-browser.json` `requests`）：`/api/ai-search` 0、`/api/click` 0、`POST /api/search` 3（精确 1 + 批量 2，第 2 次批量仅为完整截图重跑）
- 示例 prompt chips / 再来一轮 / 开始猎取 / AI 精炼均只看不点；行业模板「茶叶品牌」点击后仅填充 textarea（`A-template-filled-1280.png`）
- storage：测前 dump `storage-r502-pre.json` = `{"local":{},"session":{}}`；测中产生 `domainhunter:lang / theme / shortlist=[]`；测后清空并 dump → `cmp` 相等（34 字节 = 34 字节）
- `/api/usage` 见 §2.10

### 2.2 首页（1280 浅色 zh / 深色 en）

- SSR `<h1>` 与水合一致：zh「用中文说出寓意，猎到真正可注册的 .cn / .com 好域名」、en「Name it in Chinese or English, hunt .cn / .com domains you can actually register」（`A-home-zh-light-1280.png`、`A-home-en-dark-1280.png`）
- 精确核验 tab：输入 `zalizetest123` 自动核验，恰 1 次 `POST /api/search`（roots + 9 TLD），9 个状态 chip：8 可注册 + `.ai` 未知（`A-exact-status-grid-1280.png`）
- R491 footer（水合后）：`/tld/` 408、`/guide/` 410、`/vs/` 444、「浏览全部」3、/why /mcp /advanced /prices 均在；真实点击 `/mcp?lang=zh` 到达
- SSR 原始 HTML：`<a>` 26（站内 25 + GitHub 1）——8 tld + 6 guide（恰为 R483 六篇 .cn 指南）+ 4 vs + 三 hub + /prices /why /mcp /advanced；与 R491 PR 声称的 25 一致

### 2.3 `/advanced`、`/prices`

- 批量：`zalizeqa1.com` 可注册、`zalizeqa2.cn` 可注册、`zalize.com` 已注册（到期 2027-07-06）；每次 1 个 `POST /api/search`；CSV 导出按钮在（未下载）（`B-advanced-all-three-statuses-1280.png`）
- `/prices`：408 个 `a[href^="/?tld="]`；后缀升序 abogado/academy/accountants…、降序 zone/za/yoga…；`.cn` 筛选 1 行（`C-prices-filter-cn-1280.png`）；无「价格暂不可用/stale」提示；`/api/prices` `stale:null`、`fetchedAt` 2026-09-04T12:00:26Z、351 条（`tld_prices` MCP 合并静态后 408 条，57 条 `approx`）

### 2.4 三 hub 与 R459 面包屑

- `/tld` 408 / `/guide` 410 / `/vs` 444 卡片；分组锚点点击后 section 顶 y=127.75–128.25，sticky nav bottom=124（不被遮挡）；筛选 `.cn` → tld 1 / guide 4 / vs（`.com vs .cn`）1；回到顶部 scrollY=0（`D-guide-anchor-1280.png`、`D-tld-filter-1280.png`）
- 内容页面包屑：首页 → TLD 指南 → .cn / 首页 → 行业指南 → .cn 实名认证 / 首页 → 后缀对比 → .com vs .cn；父级点击分别到 `/tld?lang=zh`、`/guide?lang=zh`、`/vs?lang=zh`

### 2.5 三内容页（含 R483 `/guide/cn-realname`）

- `/tld/cn`：H1、JSON-LD 2（BreadcrumbList + FAQPage）、相关链接、站内导航 /why /mcp /advanced（`E-tld-cn-site-links-1280.png`）
- `/guide/cn-realname`：H1「.cn 域名实名认证全流程：材料、时限与审核」、JSON-LD 3（BreadcrumbList + Article + FAQPage）、en 版渲染（`E-guide-cn-realname-zh-1280.png`）
- `/vs/com-vs-cn`：H1、JSON-LD 3、en 版渲染
- 三页均无语义 `<footer>`（SKILL 已说明），底部导航区存在，不算缺陷

### 2.6 /why /mcp /monitors /shortlist / 404 / 分享

- `/why`、`/mcp` 信息页渲染（`F-mcp-1280.png`）；`/monitors` 空态「还没有监控任何域名」+ 全局 2/500；`/shortlist` 空态「还没有候选」+ 导入/同步区（未做任何变更操作）
- 404：`/no-such-page-r502`、`/tld/zzznotatld`（浏览器 `page.goto` status 404 + 品牌 404 页，`G-no-such-page-r502-1280.png`）；HTTP 层再加 `/guide/zzz-none`、`/vs/zzz-vs-yyy` 均 404 + `noindex` + `cache-control: public, max-age=600`；`/s/zzz-unknown` 外壳 200（设计如此，语义在 API：`/api/share/zzzunknown` 404）
- 分享：`POST /api/share` 3 条 → 200 `{id:"2v_F9ouT_X"}`；`/s/2v_F9ouT_X` 1280/375 × 浅/深 4 张，注册商菜单（Porkbun $11.08 / Namecheap / Cloudflare / 阿里云 / 腾讯云）打开、Esc 关闭、未点任何外链；`DELETE` 200 → `GET /api/share/2v_F9ouT_X` **410 `{"error":"revoked"}`** → 浏览器刷新显示「链接已失效：分享者已删除这份清单」，旧行不再渲染（`H-share-light-1280.png` → `H-share-revoked-1280.png`）

### 2.7 MCP 三工具（`r502/findings-http.json` `E_mcp`）

- `initialize` → `protocolVersion 2025-03-26`、server `domainhunter 1.0.0`、instructions 明示 AI 猎名请走网站（无 AI 工具）
- `tools/list` → 恰 `check_domains / tld_prices / suggest_variants`
- `check_domains` 4 域名 1632ms：`zalize.com` taken（2027-07-06）、`zalize.cn` taken（2027-08-03）、`zalizeqa502x.com/.cn` available
- `tld_prices` 97ms：`tldCount 408`、`liveCount/staticCount` 字段在、`.cn 4.03/5.42 approx`、`.com 11.08/11.08`
- `suggest_variants {name:"zalize", tlds:[com,cn], limit:6}` 1797ms：6 条 available（zalizehq/zalizeapp/zalizelabs × .cn/.com，含 `firstYearPriceUSD`）；带 TLD 输入见 P3-4

### 2.8 R492 语言矩阵 / R491 SSR 内链与 BFS

- `bash scripts/seo-audit/lang-matrix.sh https://hunt.zalize.com`（`r502/lang-matrix.md`）：9 路径（`/ /tld/cn /guide/animation /vs/com-vs-cn /prices /why /mcp /advanced /tld`）× bare / `Accept-Language: en` / `?lang=en` 全部 200；bare → `zh-CN` + 裸 canonical；另两种 → `en` + `?lang=en` canonical；27/27 `Vary: Accept-Language`，hreflang zh/en/x-default 三元组完整
- `node scripts/seo-audit/fetch.mjs graph --out ~/r502/seo --concurrency 8` + `analyze.mjs`（`r502/seo-graph-report.md`）：1270 URL 非 200 = 0；首页原始 `<a>` 站内 **25**；全站内链 561,301（99.7% 带 `?lang=`）；BFS-B 从 `/` 可达 **1270/1270**，从 /+/tld+/guide+/vs 可达 1270/1270，孤岛 0，零入链页 0；每页入链 min/中位/max 410/416/1264
- 同批 16 页 ×2 语言取样：title/description/H1 重复 0 组、H1≠1 的页 0、canonical/hreflang 不符 0

### 2.9 R495 / R486 / R485 / 非 HTML 响应

- R495：`/why?lang=zh` 点 EN → URL 立即变 `/why?lang=en` + en H1，F5 后仍 en（`I-why-reload-en-1280.png`）；裸 `/tld/cn`（偏好 en）切 zh → URL 保持裸、F5 仍 zh（`domainhunter:lang=zh`）
- R486 MicroMessenger UA：`/`、`/tld/cn`、`/guide/cn-realname`、`/s/2v_F9ouT_X` 均 200，SSR `<title>`/`og:title`/`og:description`/`twitter:card summary_large_image` 完整；四页正文均含隐藏 `<img src="/wx-share.png" width=300 height=300>`（微信抓图兜底，普通 UA 同样输出）；`/wx-share.png` 200 `image/png` 26,062 B；`/s/:id` 分享页 og:description 列出 3 个域名 +「注册前请重新核验」
- R485：生产 `/` HTML 无 `baidu-site-verification`、无 `google-site-verification`、无 `msvalidate.01`、无 CF beacon；`baiduLast/baiduLastError = null`（未配置推送）；`botsBy.baidu = 7`（Baiduspider 自发来访，R484 时 6）
- 非 HTML 响应无 `Vary`（R492 要求）：`/api/usage`、`/api/registrars`、`/sitemap.xml`、`/llms.txt`、`/robots.txt` 5/5 `vary: null`
- `/sitemap.xml` 1270 URL（tld 408 / guide 410 / vs 444 / core 8）0 重复、3810 条 `xhtml:link`；`/llms.txt` 408/410/444 链接；`robots.txt` Sitemap 指向正确、GPTBot/PerplexityBot/ClaudeBot 明示、Disallow 0
- 安全响应头（R484 P3-3）：`content-security-policy / x-content-type-options / referrer-policy / x-frame-options / strict-transport-security / permissions-policy` 6/6 仍缺

### 2.10 `/api/usage` 前后对照（`?days=2&cb=…` 绕缓存）

| 字段 | 前（23:34Z） | 后（23:53Z，末次 `/api/search` 后 >60s） | 判定 |
|---|---|---|---|
| `searches` | 19 | 19 | 0 增量 |
| `fast` / `refine` | 16 / 3 | 16 / 3 | 0 增量 |
| `llmProvider.primary` | 20 | 20 | 0 增量 |
| `aiErrors` / `fallbacks` | rate-limit 4, quota 3 / quota 2, quota-breaker 2 | 同 | 无变化 |
| `outbound*` | aliyun 16 / porkbun 3 / namecheap 1 | 同 | 0 点击 |
| `pageviews.home/tld/guide/vs/prices/results/other` | 223/60/51/24/28/14/117 | 231/66/58/27/32/20/125 | 本轮浏览器访问 + 他人流量 |
| `bots` / `botsBy.other` | 4225 / 4124 | 5574 / 5470 | +1349 ≈ 本轮 1270 URL 图抓取 + Lighthouse + curl（非浏览器 UA 计入 bots） |
| `botsBy.baidu` | 7 | 7 | — |
| `indexnowLast` | 2026-09-03T12:00:34Z | 同 | 未前进 |
| `indexnowLastError` | `{at: 2026-09-04T18:00:11Z, status 429, submitted 0}` | 同 | 旧代码全量推送的 429 仍挂着 |
| `pricesLastOk` / `pricesLastFail` | 2026-09-04T12:00:26Z / 2026-08-11T18:01:33Z | 同 | 不 stale |
| `baiduLast` / `baiduLastError` | null / null | 同 | 未配置 |

- 注：`/api/search` 不计入 `searches`（`worker.ts` 仅 `/api/ai-search` 路径调用 `usage.search()`，源码核对），故 3 次非 AI 核验不影响该字段；`searches` 是 AI 猎名计数
- R488 首次新代码 IndexNow 推送在 2026-09-05 00:00Z cron：见下方「00:0xZ 复读」

**00:02Z 复读（`usage-r502-post3.json`，cron 已跑）**：`cronLast` 2026-09-05T00:01:25Z、`pricesLastOk` 00:01:39Z（价格刷新正常）；`indexnowLast` **仍是 2026-09-03T12:00:34Z**，`indexnowLastError = {at: 2026-09-05T00:01:25Z, status 429, "Too many requests", submitted 0}`——**R488 新代码首次推送（按 handoff §10 1b，`pushed` 快照为空故仍是全量 1270 条）同样被 api.indexnow.org 429**，下次尝试在 6h 冷却后 06:00Z。见 P2-2。

**23:59Z 附加读数（`usage-r502-post2.json`）**：`searches 19→20`、`fast 16→17`、`llmProvider.primary 20→22`（`refine` 不变），发生在 23:53Z 之后。本会话所有客户端在该时段只运行了 axe 脚本（`~/r502/axe_light.py`，仅 `page.goto` 9 条静态路由 + 设 `domainhunter:theme` + reload，源码 `grep ai-search` = 0）与 curl；浏览器全程请求捕获（82 条）中 `/api/ai-search` 0。1 次搜索 + 2 次 LLM 调用的形态与 R498 词补发一致，归因为**外部流量（真实用户或父会话生产复验）——推断**。本轮零 AI 结论以 23:34Z→23:53Z 的 0 增量 + 浏览器 0 `/api/ai-search` 为证据。

### 2.11 Lighthouse 13.4.1（生产，默认深色主题，headless Chrome 137）

| 页面 | 桌面 P/A/BP/SEO | 移动 P/A/BP/SEO | 移动 FCP / LCP / TBT / CLS |
|---|---|---|---|
| `/` | 100 / **100** / 100 / 92 | 92 / **100** / 100 / 92 | 2.4s / 2.9s / 50ms / 0 |
| `/guide/cn-realname` | 100 / **100** / 100 / 92 | 97 / **100** / 100 / 92 | 1.8s / 2.4s / 0 / 0 |
| `/prices` | 100 / **100** / 100 / 92 | 93 / **100** / 100 / 92 | 1.8s / 3.0s / 40ms / 0 |

- a11y 6/6 = 100（硬指标达成）；SEO 6/6 = 92 唯一失败项 `canonical`（P2-1）；性能与 R484 同量级（R484 移动 0.94–0.98）
- 原件：`~/r502/lh/*.report.{html,json}`；摘要 `r502/lighthouse-summary.json`

### 2.12 axe-core 4.13.0（浅色 + 深色，1280，`/ /tld/cn /guide/cn-realname /prices /why /mcp /advanced /tld /shortlist`）

- 浅色 9 页：`color-contrast` **0**（R484 P1-1 修复 PR #448 生产生效）；仅 `/mcp` 3 条 `scrollable-region-focusable`（P3-1）
- 深色 9 页：同上，仅 `/mcp` 3 条
- 脚本 `~/r502/axe_light.py`（CDP 接管可见 Chrome，设置 `domainhunter:theme` 后 reload 注入 axe），结束后清空 storage

### 2.13 375px / 键盘 / console

- 375×900（CDP `Emulation.setDeviceMetricsOverride`，隐藏滚动条后测）：`/ /tld/cn /guide/cn-realname /vs/com-vs-cn /prices /why /mcp /advanced /monitors /shortlist /s/:id /tld` × 浅/深 = 24/24 `scrollWidth 375 = innerWidth 375`；分享页注册商菜单 375 下 right=342 < 375（`H-share-menu-dark-375.png`、`J-home-zh-light-375.png`、`J-home-zh-dark-375.png`、`J-prices-zh-light-375.png`）
- 键盘：Shift-Tab 回 Logo 后 Tab 顺序 高级模式 → 候选清单 → GitHub → 语言 → 主题 → 关闭引导 → AI 猎名 → 精确核验 → 批量核验 → textarea，头部/模式按钮可见 outline，textarea 以聚焦边框 + 光标示意（`K-mode-exact-focus-1280.png`）；未按 Enter/Space
- console：全程 `pageerror` 0；`console.error` 3 条全为资源加载：2 条故意 404 页的 404、1 条撤销分享后 `/api/share/:id` 的 410（预期）。排除这 3 条后 0 error

## 3. R484 遗留项逐条对照

| R484 项 | 本轮结论 | 依据 |
|---|---|---|
| P1-1 浅色品牌绿对比度 3.2–3.8:1 | **关闭** | PR #448 已在生产；浅色 9 页 axe `color-contrast` 0（§2.12）；README「≥4.5:1」承诺在生产浅色成立 |
| P2-1 `/api/click` outbound 计数丢写 | **未验证**（代码层面已由 R487 分片计数替代，handoff §11） | 本轮零外链点击（`outbound` 前后不变），未做并发点击复验；建议父会话或下一轮用 4 次 sendBeacon 复测 |
| P3-1 `/shortlist` 空 `<th>` | **未验证** | 本轮 shortlist 为空态无表格；`shortlist-page.tsx` 该行未见修改记录（`git log` 无相关提交），推断仍在 |
| P3-2 Radix 菜单打开时 axe 伪阳性 | **保留备查** | 本轮 axe 均在菜单关闭态运行，未触发；性质不变 |
| P3-3 无安全响应头 | **保留** | 6 个头 6/6 仍缺（§2.9） |
| R484 §3「/why /vs /monitors /advanced 浅色未跑 axe」 | **补齐** | `/why /advanced` 浅色 0 违规；`/vs/*` `/monitors` 仍未跑 axe（375 与视觉已覆盖） |
| R484 §3「微信真机未验证」 | **仍未验证** | 本轮同样只做 UA 模拟 |

## 4. 未覆盖 / 需注意

- 未验证：AI 猎名全链路（按规则 0 AI，由父会话复验）、注册商外链与 `/api/click`（0 点击）、CSV 下载内容、monitors 增删与 webhook、shortlist 变更/同步、`/vs/*` 与 `/monitors` 浅色 axe、微信真机
- Lighthouse 与 R484 版本不同（12 → 13.4.1），SEO 92 的 `canonical` 规则在 12 中已存在，分数变化的直接原因是 R492 行为而非工具升级（R484 时裸 URL 恒返 zh + 自指 canonical）；性能分数含网络噪声，只记录不设门
- `bots` 增量 ≈1349 主要是本轮 1270 URL 全量抓取（`fetch.mjs graph`），会体现在 09-04 的 `botsBy.other` 中，读数时请扣除
- 本轮所有 HTTP 探测均带 `?cb=` 或走 POST，未污染 CDN 缓存的正常 key；`/api/usage` 读数用 `cb` 绕过 `max-age=300`
- 分享 `2v_F9ouT_X` 已撤销（410），revoke token 未写入任何入库文件

## 5. 本地验收（本分支仅新增文档与截图，无源码改动）

- `pnpm -r typecheck` ✓（core + web）
- `pnpm --filter web test` ✓ 18 文件 / 189 用例全过
- `pnpm --filter web build` ✓（5.4s，仅既有 chunk 体积提示）
- `node scripts/check-content-counts.mjs` ✓ 408/410/444 与事实源一致
- 变更范围：`docs/audits/audit-r502.md`、`docs/audits/r502/`（9 个证据文件）、`docs/audits/screenshots-r502/`（20 张）；`git status` 无源码改动
