# DomainHunter 交接文档（handoff-context）

> 依 company-os 交接上下文制度维护（模板 `company-os/templates/handoff-context.md`）。换会话/换负责人时把本文档注入新会话即可接手。
> **最后更新：2026-09-06 10:15 UTC（R529，同步到 R524–R528 上线 version f648963f）**。上一次 2026-09-06 07:40（R523，version d8e5038b）。上一次系统性更新 2026-09-04（R490）。上一次系统性更新是 R250（2026-08-08），R466–R485 期间只做过局部小节追加（`git log -- docs/handoff-context.md`：e7bbfcb R481、a248e48 R482、79ecd0b R485）。
> 老板需操作的外部资源全部收口在 **`docs/owner-actions.md`**（单一事实源），本文档不再重复维护那份清单。

## 1. 项目目标

- **一句话**：「中文创业者的域名猎手」——中文自然语言寓意 → 拼音/中文/英文/混搭候选 → 实时 RDAP/WHOIS 核验 .cn/.com.cn/.com 等 → 到期时间/价格/批量 CSV/监控捡漏。英文通用场景不声称全面领先（R460/R464 竞品横评实证，见 `docs/research/`、`docs/competitor-*.md`）。
- **阶段**：已上线运营（hunt.zalize.com），短周期批次迭代（Rxxx 编号）；开源发布素材已备（`docs/launch/launch-checklist.md`）但**未发帖**，阻塞于 AI 上游额度（见 §8）。
- 免费、免登录、open-core（MIT）。

## 2. 代码与数据位置

- 仓库：`https://github.com/wookat/domainhunter`（默认分支 `main`；**生产部署线 = 集成分支 `deploy/r192-r195`**，所有新 PR 以它为 base）
- 本地路径（Devin 会话惯例）：`/home/ubuntu/repos/domainhunter`
- 关键子目录：
  - `packages/core` — 生成 + 核验引擎（纯 TS：`generateCandidates` / `checkDomains` / RDAP bootstrap）
  - `apps/web/src/worker.ts` — Hono Worker：**全部 API / MCP / SSR / cron 都在这一个文件**（~2,300 行）；辅助模块 `ai.ts`、`ai-transport.ts`、`rule-fallback.ts`、`pageviews.ts`、`growth-inject.ts`、`prices-fetch.ts`、`prices-cache.ts`、`whois.ts`
  - `apps/web/src/components|lib|content` — React 18 SPA、i18n（`lib/i18n.tsx`）、内容页数据（`content/tlds.ts`、`guides.ts`、`guides-cn-compliance.ts`、`compares.ts`、`compare-slugs.ts`）
  - `scripts/` — `content-counts.json`（内容计数事实源）+ `check-content-counts.mjs`、`verify-r*.mjs` 回归脚本
  - `docs/research/` 调研、`docs/qa/` + `docs/audits/` 审计报告、`docs/launch/` 发布清单、`docs/owner-actions.md` 老板待办
  - 测试 SKILL（零 AI 生产审计流程、存储备份/还原、踩坑集）：**`.agents/skills/testing-domainhunter/SKILL.md`**
- 数据：仅 Cloudflare KV（binding `CACHE`，namespace id 见 `apps/web/wrangler.jsonc`），无数据库；用户数据全在浏览器 localStorage/sessionStorage（见 §6.4）。无需备份（全部是缓存/计数/30–90 天 TTL 快照）。

## 3. 技术栈

Cloudflare Workers + Hono（API/MCP/SSR/cron）· React 18 + TypeScript + Vite + Tailwind（shadcn 风格）· pnpm monorepo · vitest · KV `CACHE` · 上游：DoH（cloudflare-dns）/ IANA RDAP / WHOIS:43（`cloudflare:sockets`）/ Porkbun 价格 API / OpenAI 兼容 LLM 网关（DeepSeek）/ IndexNow / 百度普通收录 API（可选）。

## 4. 部署与验收命令

- **本地验收（= 合并标准，公司规则不用 CI）**：`pnpm install` → `pnpm -r typecheck` → `pnpm --filter web test` → `pnpm --filter web build`；改内容页数据还要 `node scripts/check-content-counts.mjs`。R490 基线：typecheck 绿、10 文件 84 例测试绿、build 绿、计数脚本绿。
- **部署**：`cd apps/web && pnpm deploy`（= `vite build && wrangler deploy`）。只从集成分支 `deploy/r192-r195` 部署，**不要从可能落后的 main 直接 deploy**。部署后用 `?cb=<随机>` 穿透 CDN 回归。
- **集成分支模式**：并行子会话各开独立分支 PR（base `deploy/r192-r195`）→ 父会话合入集成分支 → 部署 → 生产回归 → PR 合回 main。
- 本地跑 Worker：`apps/web` 下 `pnpm build && npx wrangler dev --port 8787`（细节与坑见 SKILL）。
- Secrets 只走 `cd apps/web && npx wrangler secret put <NAME>`；`wrangler.jsonc` 只放公开 vars（当前仅 `REGISTRAR_AFFILIATE_JSON: "{}"`）。

## 5. 当前实时服务状态（2026-09-06 00:20 UTC 实查）

| 项 | 值 | 证据 |
|---|---|---|
| 线上地址 | https://hunt.zalize.com （自定义域）；Worker 直连 https://domainhunter.wookat520.workers.dev | 首页 200 |
| 生产 Worker version | **`f648963f-a54c-4898-81ab-01b79c3aee3a`**（deployed 2026-09-06T~09:58Z，含 R501–R528）；前一版 `25d23c2a` 08:59Z 含至 #492（R525/R528），`d8e5038b` 07:12Z 含至 R522。注：09:5x 另有一次 `4d91a81c` 部署与 25d23c2a 同树（merge 命令误判后重放，无内容差异） | `npx wrangler deployments list`（apps/web） |
| 对应代码 tip | `deploy/r192-r195` @ **83f1e4e**（#494 R526 集成合并提交，上一个集成 #492 = R525+R528）；零 AI 生产回归证据 https://github.com/wookat/domainhunter/pull/494#issuecomment-5558480170 （R524–R528 一次覆盖，报告 `docs/qa/r528-regression.md`）；上一轮 #486 评论 https://github.com/wookat/domainhunter/pull/486#issuecomment-5557768553 | R510 生产复验 https://github.com/wookat/domainhunter/pull/475#issuecomment-5553032616 ；R509 零 AI 回归 https://github.com/wookat/domainhunter/pull/471#issuecomment-5552746476 |
| 内容计数 | **TLD 408 / 行业指南 410 / 对比页 444 / sitemap 1,270 URL**（1,262 内容页 + 8 静态页） | `scripts/content-counts.json` 与 `curl sitemap.xml?cb=` 逐类 grep 一致 |
| cron 心跳 | `cronLast=2026-09-06T00:00:58Z`（每 6h） | `/api/usage` |
| 价格 | `pricesLastOk=2026-09-04T12:00Z`，`/api/prices` 351 个 TLD 有 Porkbun 报价，非 stale | `/api/prices` |
| IndexNow | 上次成功 2026-09-03T12:00Z；`indexnowPending` 仍 **1270**。09-06 00:00:58Z cron（R514 后首个）**真尝试了**（`indexnowLastAttempt == cronLast`，门已放行）但首批 100 URL 上游 **429**、`submitted 0`（`indexnowLastError.at == cronLast`）；R504 时本机直连 100 URL 曾 200，推断为整点瞬态限流。R515 同批 60s 退避重试于 **06:00:38Z cron 实测无效**：`indexnowLastResult={ok:false,status:429,retries:2,submitted:0}`（首发 + 2 次重试全 429）。06:06Z 独立探针 Worker（与生产同出口，已删）取证：5 URL → `api.indexnow.org`/`www.bing.com` 均 429 `TooManyRequests`，同分钟本机直连 100 URL → 200；`yandex.com` 202、`search.seznam.cz`/`searchadvisor.naver.com`/`indexnow.yep.com` 200 → **推断 Bing 侧按来源 IP 限流 Workers 共享出口**。**R517（#480）已 06:13Z 上线**：主端点 429 立刻按序改发 yandex→seznam→naver→yep 同批，全部 429 才退避，`indexnowLastResult.fallbackHosts` 记录实际落点。期望 12:00Z：`ok=true, fallbackHosts:["yandex.com"], retries=0`、`indexnowPending` 1270→970（**待核对**，见 §10 第 5 项） | `/api/usage.indexnowPending/indexnowLastAttempt/indexnowLastError/indexnowLastResult` |
| 百度推送 | 未配置（`baiduLast=null`）；但 `botsBy.baidu=6`（Baiduspider 已自发来访，R485 调研时为 0） | `/api/usage` |
| 验证 meta / analytics beacon | 首页 `<head>` 无 GSC/Bing/Baidu meta、无 cf-beacon | `curl -A Mozilla /` |
| 注册商返佣 | `/api/registrars` = `{"affiliate":{}}`（纯链接） | — |
| **AI 上游** | **不可用**：当日 `aiErrors={rate-limit:4,quota:3}`、`fallbacks={quota:2,quota-breaker:2}`，无成功主轮 | `/api/usage`；详见 §8 |
| 零 AI 功能实测 | `/api/search` 3 域名 NDJSON 正常（RDAP/WHOIS、expiresAt）；`/api/check refresh` 正常；MCP `tools/list` 3 工具、`check_domains`/`tld_prices`（dict 351）/`suggest_variants` 正常；分享 create→GET 200→DELETE→GET 410 正常（已清理）；`/api/monitor/list`、`/api/monitor/changes` 正常；全部 hub/内容/静态页 200，未知路径 404 | R490 核对，`/api/usage` 前后 `searches` 不变 |

## 6. 架构图谱

### 6.1 前端路由（`apps/web/src/App.tsx` 手写 pathname 匹配 + lazy chunk）

| 路由 | 组件 | 说明 |
|---|---|---|
| `/` | home-page（+ agent-page / results-page） | AI 猎名主流程 + 精确核验 tab（`?mode=exact`）；`?q=` 预填；R478 起 SSR hero 骨架 + 中文利基文案（`content/home-copy.ts`） |
| `/advanced` | advanced-page | 批量粘贴核验（≤200），CSV 导出 |
| `/shortlist` | shortlist-page | 收藏清单 + 分享/同步码；noindex |
| `/monitors` | monitors-page | 释放监控管理；noindex |
| `/prices` | prices-page | TLD 价格总览（Porkbun 实时 + ≈ 静态参考价） |
| `/why` | why-page | 定位页 |
| `/mcp` | mcp-page | MCP 文档（GET）；同路径 POST 是 MCP server |
| `/tld` `/guide` `/vs` | hub 页 | 分组 chips 锚点导航（R415）+ `input[type=search]` 筛选 |
| `/tld/:tld`（408） `/guide/:slug`（410，含 6 篇 `kind:"compliance"` .cn 合规指南 R483） `/vs/:slug`（444） | tld-page / guide-page / compare-page | 内容页；en 通过 `?lang=en` |
| `/s/:id` | share-page | 分享快照只读页（R510 起壳与 `/api/share/:id` 同状态：存活 200 / 撤销 410 / 不存在 404，后两者 noindex） |

SEO 页 worker 侧 SSR meta + hreflang + JSON-LD + 骨架 + CSS 内联；R486 起分享/首页 `<meta property="og:image">` 兜底 `/wx-share.png`（微信抓图）。

### 6.2 Worker API（`apps/web/src/worker.ts`）

- `POST /api/ai-search` — **唯一 AI 路径**。NDJSON 流（understanding/round/proposed/result/fallback/done）；限流每 IP 20 次/h（`rl:{ip}:{hour}`）。R466 主轮流式；R471 首轮失败走 `rule-fallback.ts` 规则降级 + KV 熔断 `dh:llm-breaker:v1`（quota 后 300s）；R472 rate-limit 30s 自动重试一次；R474 `ai-transport.ts` 可选备用上游（`LLM_FALLBACK_*` secret 缺失即休眠）；R476 `fallback.retryAfterS`。
- `POST /api/search`（词根×前后缀×TLD 或 `domains[]` ≤200，NDJSON）· `POST /api/check`（≤100，`refresh`）· `GET /api/prices` · `GET /api/stats` · `GET /api/usage?days=N`（≤45；字段见 §7.2）
- `GET /api/registrars`（R480，公开 var `REGISTRAR_AFFILIATE_JSON` 解析结果，`max-age=300`）· `POST /api/click {registrar,tld}` → 204 仅累加 `usage.outbound`
- `POST /api/monitor` · `POST /api/monitor/list` · `GET /api/monitor/changes` · `POST /api/monitor/recheck`（每 IP 60s；全局 500 名额）
- `POST /api/share` · `GET|DELETE /api/share/:id`（≤100 项，30d，revokeToken；revoked → 410）· `POST /api/sync` · `GET /api/sync/:code`（8 位，90d）
- `POST /mcp` — JSON-RPC 2.0 Streamable HTTP 无状态，协议 2025-03-26；工具 `check_domains`（≤50）、`tld_prices`（dict，approx 补齐）、`suggest_variants`
- `GET /sitemap.xml` `/llms.txt` `/robots.txt` `/api/og/*`（动态 SVG 1200×630）`/{INDEXNOW_KEY}.txt` · 兜底 `app.all("*")` → ASSETS
- 全局后置中间件 `growth-inject.ts`：仅对 2xx/4xx `text/html` GET 注入可选验证 meta / beacon（R481/R485）；`pageviews.ts` 对成功返回的 HTML 文档计数。

### 6.3 Cron（`0 */6 * * *`）

① `cron:last` 心跳 → ② `runMonitorSweep`（全量复查，变化写 `monitor:changes` + https webhook）→ ③ `pingIndexNow`（成功后 ≥23h 才再推；每次 cron ≤3×100 URL，成功批次即入 `indexnow:pushed`；仅 200/202 记成功；失败写 `indexnow:lastError`；`indexnow:lastAttempt` 5h 冷却——门槛刻意比 6h cron 周期短，避免毫秒抖动整轮跳过，R514）→ ④ `pushBaidu`（R485，仅 `BAIDU_PUSH_SITE` + secret `BAIDU_PUSH_TOKEN` 都在时运行；只推 `baidu:pushed` 中未成功的 URL，每轮 ≤ `BAIDU_PUSH_DAILY_MAX`，默认 2000）。

### 6.4 浏览器端存储（无账号）

localStorage：`domainhunter:shortlist`（+ `:checkedAt`、旧 `favorites` 迁移）、`domainhunter:monitor`、`domainhunter:monitor-webhook`、`domainhunter:recent-searches`、`domainhunter:theme`、`domainhunter:lang`、`dh:myShares:v1`、`dh:onboardDismissed:v1`、`dh:density:v1`、`dh:aiQuotaDown:v1`、`dh:chunkReloaded`；sessionStorage：`dh:lastSearch:v1`（结果页恢复快照，含 `SavedFallback.retryAt`）。生产测试若触碰，按 SKILL 的 backup/restore 流程还原。

## 7. 当前数据概况

### 7.1 KV key 清单（binding `CACHE`；R490 按代码 grep 核实）

| Key | 定义位置 | 用途 / TTL |
|---|---|---|
| `d:{domain}` | worker.ts | 单域核验缓存：taken 24h / available 1h；含可选 expiresAt |
| `rl:{ip}:{hourBucket}` · `rl:recheck:{ip}` | worker.ts | AI 限流（20/h）· 监控手动复查限频 60s |
| `stats:checked` | `STATS_KEY` | 累计核验计数（非原子） |
| `usage:{YYYY-MM-DD}:{shard}`（+ 兼容旧 `usage:{YYYY-MM-DD}`，只读不再写） | `usage-counter.ts`（共用 `sharded-counter.ts`） | 每日聚合：searches/byTld/fast/refine/aiErrors/fallbacks/llmProvider/outbound/outboundByTld，45d。R487 起每 isolate 只写自己的分片键（isolate 内 1s 合并再落盘），读侧 `readDayUsage` 深合并旧键 + 分片（嵌套 map 逐键相加）；新分片对读侧可见有 ≤60s 延迟，生产回归前后对比需等 ≥60s |
| `pv:{YYYY-MM-DD}:{shard}`（+ 兼容旧 `pv:{YYYY-MM-DD}`） | `pageviews.ts` `PV_KEY_PREFIX` | HTML 文档访问按路由类别 + bots/botsBy；R482 起每 isolate 单写者分片，`/api/usage` list 前缀求和；45d；新分片对读侧可见有 ≤60s 延迟；与 usage 共用 `sharded-counter.ts` |
| `monitor:domains` · `monitor:changes` | `MONITOR_KEY` / `MONITOR_CHANGES_KEY` | 全局监控 map（≤500）· 变化记录（保留 100） |
| `prices:v2:{TLD_LIST.length}` · `prices:latest` · `prices:lastOk` · `prices:lastFail` | worker.ts / `prices-cache.ts` / `prices-fetch.ts` | Porkbun 缓存 24h（key 掺 TLD 数，扩容自动失效）· stale 兜底 30d · 心跳 |
| `share:{id}` · `sync:{code}` | worker.ts | 分享快照 30d（撤销后写 `{revoked:true}` 同 TTL）· 同步码 90d |
| `cron:last` | worker.ts | cron 心跳 |
| `indexnow:last` · `indexnow:lastAttempt` · `indexnow:lastError` · `indexnow:lastResult` | `INDEXNOW_*_KEY` | 上次成功 / 上次尝试 / 失败详情 JSON / 最近一次真正发请求的结果 JSON（含 `retries` R515、`fallbackHosts` R517） |
| `baidu:last` · `baidu:lastAttempt` · `baidu:lastError` · `baidu:pushed` | `BAIDU_*_KEY` | 百度推送状态；**未配置 BAIDU_PUSH_* 时不会出现** |
| `dh:llm-breaker:v1` | `rule-fallback.ts` `LLM_BREAKER_KEY` | quota 熔断，300s |

### 7.2 `/api/usage` 字段速查

顶层：`days{date→…}`、`cronLast`、`indexnowLast`、`indexnowLastAttempt`（R514）、`indexnowLastError`（含 `retries`，R515）、`indexnowLastResult`（R515，每次真正发请求都写，成功失败均含 `retries`；R517 加 `fallbackHosts`，仅备用端点成功时有）、`pricesLastOk`、`pricesLastFail`、`baiduLast`、`baiduLastError`。每日项：`searches`、`byTld`、`fast`、`refine`、`aiErrors{quota|rate-limit|network|…}`、`fallbacks{quota|quota-breaker|…}`（R471）、`llmProvider{primary,fallback}`（R474，成功主轮才有）、`outbound`/`outboundByTld`（R480）、`pageviews{home,results,tld,guide,vs,prices,other}`、`bots`、`botsBy{google,bing,baidu,ai,other}`（R481/R482）、`cspReports`（R533，浏览器 CSP Report-Only 上报条数）。顶层另有 `cspSamples[]`（R533，前 20 条去重 `{directive, blockedUri, count, firstAt, lastAt}`，KV `csp:samples:v1`）。全部只计数，不存 IP/UA/输入。

### 7.3 内容计数

事实源 `scripts/content-counts.json`：tld 408 / guide 410 / vs 444；`node scripts/check-content-counts.mjs` 守门。生产 sitemap 1,270 条与之一致。**改内容页时必须同步**：§9「TLD 扩容同步清单」。

## 8. 外部阻塞（需老板的资源）

全部条目、操作步骤、填法、当前状态与验证方式见 **`docs/owner-actions.md`**。摘要：

- **LLM 主上游额度**（曾 P0，网关 429 `apikey_quota_exhausted`，2026-09-04 18:00Z 前仍在）：**2026-09-04 21:01Z 生产 1 次 zh 搜索成功**（`llmProvider.primary` 0→3，无新 aiErrors/fallbacks，3 轮 21 可注册）——老板充值已到账，仅 1 个样本，需继续观察 `aiErrors.quota` 是否再现。历史背景：代码侧已做完能做的（R471 规则降级 + 熔断、R472 重试 UX、R474 备用上游 failover、R476 横幅），产品核心 AI 路径仍不可用；需充值/提额或 `wrangler secret put DEEPSEEK_API_KEY`。可选：配 `LLM_FALLBACK_*` 备用上游。**未恢复前不发帖。**
- 增长：GSC（网域级 TXT 已存在 3 条，待后台确认）/ Bing / Cloudflare Web Analytics token / 百度站长验证串 + 推送 token —— 均未配置，站点行为与未配置时一致。
- 变现：注册商联盟 ID（Namecheap / 阿里云 / 腾讯云）—— 未配置，`/api/registrars` 为空。
- 开源发布：GitHub About（仍是旧定位）/ Topics / Private vulnerability reporting / Social preview。
- 微信：认证公众号 appId/appSecret + JS 安全域名（JS-SDK 未实现，等资源）。

## 9. 已知问题 / 坑与注意事项

- **`usage:{date}` 非原子计数（P2，R487 已修）**：此前多 isolate 并发 get→merge→put 互相覆盖（R484 审计 4 次外链只入账 3 次；本地双 workerd 12 并发基线只入账 2）。R487 起全部计数字段按 isolate 分片写 `usage:{date}:<shard>`，读侧深合并，本地 12 并发精确 12；生产直证用 `N=12 node scripts/verify-r487-local.mjs https://hunt.zalize.com`（会写 12 次 aliyun/cn 点击，自动等 65s）。pv 已于 R482 修复；`stats:checked` 同类问题，允许误差。
- **IndexNow 429 / 跳过**：2026-09-04 18:00 全量推送被 api.indexnow.org 限流（R504 改 3×100/cron 已解）；09-05 18:00Z 又因冷却门 = cron 周期被 94 ms 之差跳过（R514 改 5h/23h 已解）；09-06 00:00:58Z 首批 100 URL 仍 429（R515 同批 60s 退避重试）；06:00:38Z R515 首发+2 重试仍全 429 → 探针证实 Workers 出口被 Bing 端点按 IP 限流而 yandex/seznam/naver/yep 正常（R517 换端点重发，**生产效果待 12:00Z cron 核对**）。判读：`indexnowLastAttempt` 不随 `cronLast` 前进 = 被门拦住；前进但 `lastError.at` 同步前进 = 尝试了但上游失败；`indexnowLastResult.retries>0` 且 `ok` = 靠重试拿到；`retries=2` 且 `!ok` = 重试仍 429；R517 后 `ok && fallbackHosts` = 主端点限流、备用引擎接收；`!ok && retries=2` = 全部端点 3 轮仍 429（需重新取证）。**本机 curl IndexNow 200 对生产无证明力。**
- **AI 上游额度**：见 §8；`classifyAiError` 按响应体关键词把额度型 429 归 `quota`（其余 429 仍 `rate-limit`）。恢复后需补做 R466 首结果时延实测（zh/en ≥1 次）。
- **TLD 扩容同步清单**（漏一处就不一致）：`content/tlds.ts` → `content/tld-list.ts`（`satisfies` 强校验）→ `home-page.tsx` `KNOWN_TLDS` → 首页 FAQ「支持哪些后缀」（worker.ts `HOME_FAQ` zh+en + i18n）→ /prices、sitemap、llms.txt 自动 → KV 价格 key 自动升版 → `scripts/content-counts.json`。
- **新增 /vs 页两处都要加**：`content/compares.ts` + `content/compare-slugs.ts`（footer 内链轻量清单）。
- **sitemap `<lastmod>` 是手写常量 `CONTENT_LASTMOD`**（worker.ts），增删内容页记得更新。
- **CDN 缓存**：HTML `max-age=600`，`/api/usage` `max-age=300`，`/api/registrars` `max-age=300`，sitemap/llms.txt `max-age=86400`——生产验证统一加 `?cb=<随机>`；`curl -A Mozilla` 访问 HTML 页本身会计入 `pageviews`。
- **注册入口单一数据源（R480）**：注册商只能从 `lib/registrars.ts`（`registrarsFor`/`primaryRegistrar`）取，外链只能走 `components/registrar-link.tsx`；**禁止**下标取 `REGISTRARS[i]` 或硬编码注册商 URL。未配置返佣时 href 与基线字节级一致（`lib/registrars.test.ts` 守门）。
- **Dashboard 改 vars 会被 `wrangler deploy` 覆盖**：公开 vars 一律写 `wrangler.jsonc`。
- **监控是全局 500 名额**，无账号；「我的监控」以客户端清单为准。早期测试遗留 `drawk.cn` 占名额，清理需直接改 KV。
- **AI 测试预算纪律**：测 AI 前后各拉一次 `/api/usage` 全表对账；日常回归只走零 AI 路径（quick check、`/api/check`、`/advanced`、MCP）。首页示例 prompt chips 会真实触发 AI，测试时只看不点（SKILL）。
- **核验通道**：DoH 预筛 → RDAP（IANA bootstrap 24h 缓存）→ WHOIS:43 兜底（com/net/cn/com.cn/io/cc/tv/co/me/xyz/sh/gg/so/us）；`.shop`/`.art` 走 DNS NXDOMAIN 判定；`sh/gg/so/us` 不在 RDAP bootstrap。expiresAt 哨兵（>当前+15 年）前端裁剪。
- **Porkbun 波动**：偶发超时，`prices:latest` stale 兜底 + /prices 静态参考价 notice；观察 `stale:true`。
- **内容页延迟挂载（R174）**与跳过大数据 chunk preload 是 LCP 关键，改路由/懒加载时别回退。
- `/guide` hub 标题「N 个行业」现含 6 篇非行业合规指南（R483 已知取舍）；`/tld/com.cn` 无独立路由，只互链 `/tld/cn` 与 `/vs/com-vs-cn`。
- 微信真机渲染/JS-SDK 行为未验证（R486 只做了 UA 模拟）。
- verify 脚本基线：`scripts/verify-r196/r222–r225/r238/r243–r246/r250/r264/r463/r465/r466/r473/r474/r489/r496–r499.mjs` 全绿（`verify-r497` 离线回放 R494 6 份 NDJSON 走完整准入链；`verify-r498`/`r499` 夹具已按集成后跨轮交互校准——R497 在主轮拦 complainter、R499 e2e 置 `wordSupplementBudget.remaining=0` 隔离补发）；zh 寓意标注集 `scripts/fixtures/zh-meaning-labels.json` 由 `scripts/build-zh-meaning-labels.mjs` 重建（标注只在该脚本维护）；`verify-pinyin.mjs`、`verify-meaning-paren.mjs` 历史遗留失效（用例已被 bundle 式脚本覆盖）。

## 10. 进行中 / 待办任务（按优先级）

1. **R487 usage 分片计数**：已部署（version 62107af5）并生产直证：12 并发 `/api/click` → outbound.aliyun 4→16 / cn 3→15 精确 +12；`searches`/`llmProvider` 嵌套 map 经分片合并正确（+1/+3）。已关闭。
1b. **R488 IndexNow 增量推送**：R488 代码 2026-09-04T20:48Z 才上线，18:00Z 那次 429 仍是旧代码全量推送；`indexnow:lastAttempt` 6h 冷却后首次以新代码推送在 09-05 00:00Z cron（`pushed` 快照为空 → 首轮仍是全量 1270 条，之后才是增量）。看 `/api/usage` 的 `indexnowLastError` 是否清除、`indexnowLast` 是否前进；未验证前不得称 429 已解决。R488 三个 P1 已由 R491/R492 实现并生产验证（见 §11）。
1c. **R489 中文规则降级**：生产未触达（AI 恰好恢复）；**R493 已用本地 wrangler + `.dev.vars` 无效 key 端到端实测 13 组中文输入**（`docs/audits/zh-fallback-e2e-r493.md`），并修了「云」「ai客服」0 候选、多音字 fail-closed 误伤（大海/告别/客服）、新能源/充电桩碎片化；`scripts/verify-r489.mjs` ALL PASS。生产降级路径仍无真实触达样本。
2. **R494 AI 质量审计 v5**（`docs/audits/ai-quality-audit-r494.md`，恰 6 次 AI）：6/6 主上游、首可注册 4.1–6.5s、RDAP/WHOIS 复核 11/11 一致。遗留 P1/P2/P3 已由 **R496–R499** 修复并于 2026-09-04 ~23:10Z 部署（version 1c558753），3 次调用端到端 24.5s / 44.5s / 26.6s 全部 200，生产复验用 3 次授权 AI（预算 4，留 1 未用；usage 逐次核销 searches 16→17→18→19、fast 14→15→15→16、refine 2→2→3→3、`llmProvider.primary` 14→16→18→20 = 每轮 +1，aiErrors 不变），留档 `docs/audits/r496-r499/`：
   - **R496 zh 寓意沙拉防线**（`zhMeaningIncoherent`，标注集 260 条：精确率 100%、误杀 0、召回 6/11）+ refine 轮 coined 格式约束（`ZH_COINED_MEANING_FORMAT`）。生产 2 次 zh（首搜 28 唯一候选 / 点踩 refine 39 唯一候选）**防线 0 命中**；人工逐条读：R494 型长从句沙拉 0 再现，但 refine 轮 1 仍有 **3 条短句沙拉**（maoga/tuoguo/zora，≤40 字、无比喻链，来源编造/语义不成立）+ 5 条 borderline，已标注进 fixture 作为已知 FN。**短句沙拉不在启发式能力范围，下一轮需取样论证（候选方向：音节来源必须是 label 子串/拼音 + 语义模型，而非再加线性规则）。**
   - **R497 拼音引用覆盖 / EN `X + Y:` 幻影词源 / zh 2 字母幻影 ASCII**：生产直证 `pinyinMismatch` 1+1、`phantomEtymology` 1+3（zh 两次），30/30 离线断言。
   - **R498 EN word 补发门槛**（候选 ≥3 且 word < max(2, ⌈15%⌉)，每次搜索预算 2 次）：生产 en 首搜 round 2 直证 `wordSupplement=true, wordSupplementReason="zero", supplementAttempts=1`，补发产出 garnish[word]（3 条被 meaningIncoherent 丢弃）。
   - **R499 theme 归一 + 声调描述剥离**：生产直证 `themeNormalized` 1（en round 2）；zh 两次 `toneClaimStripped` 0（zh 输出已不带声调句，prompt 禁令起效或样本未覆盖，二者不可区分）。
   - **R500 被丢弃候选直证（已部署 version e0ead604，1 次授权 AI，留档 `docs/audits/r500/`）**：R496–R499 观察到 en 首搜 `meaningIncoherent` 丢弃 22/36（R494：5/17），当时**推断**是「X + Y: …」缺尾句谓语被误杀但无直接证据。R500（PR #463）补了审计专用、默认关闭的样本通道——请求体 `debugDropped: true` 时 guard 事件附带 `droppedSamples[{reason,label,meaning≤160 码点,theme,supplement?}]`（每轮每 reason ≤5、总 ≤20，前端不发不渲染、不入 `dh:lastSearch:v1`、不写 KV，默认 `newGuardStats()` 序列化与基线逐字节相同，vitest `ai-dropped-samples.test.ts` 8 条）；离线论证 `docs/research/dropped-observability.md`、`scripts/replay-r500-en-incoherent.mjs`。**生产取样结果（验证）**：同 description 复跑，采到 7 条 `meaningIncoherent` 样本，逐条回放 + 人工读 **7/7 忠实解释、0 沙拉**，分三类：① word 路线 meaning 描述词义不复述 label → 片段检查必失败（4/7：bushtit/vireo/tessellate/chronicle，与 R498 补发直接冲突——补发专出 word 而 word 最易被片段检查误杀）；② 谓语词表词形缺口（2/7：changelogist「evoking」不匹配 `evokes?`、logsmith「forged/like」不在表）；③ 「X + Y:」缺谓语（1/7：riffolio）——原推断成立但**不是主因**。另 `metaLanguage` 4 样本中 reflint/clearbrew 疑似误杀（未回放定位）。**`EN_PREDICATE_RE` 仍未改**；R50x 按三类分别在标注集 + 7 条生产样本 + 历史存活候选上给 P/R 后再动规则（方案见 `docs/audits/r500/README.md` 末节）。
3. **AI 长期可靠性**：R494 一次 6 次窗口全走 primary，不等于长期稳定；继续看 `aiErrors.quota` 是否再现。
4. **发帖**（Show HN 等，`docs/launch/launch-checklist.md`）：老板决策，前提 §8 P0 解决。
5. 观察项：**IndexNow 生产仍未成功推送过一批**——09-05 18:00Z 被门跳过（R514 已解）；09-06 00:00:58Z 真尝试但 429（R515 同批重试）；06:00:38Z R515 首发+2 重试仍全 429（`indexnowLastResult{ok:false,429,retries:2}`）→ 探针证实是 Bing 端点对 Workers 出口 IP 限流，非时点/批量（R517 #480 换端点已上线 version 02404588）；**12:00Z cron 是 R517 首次生效**。核对口径：`indexnowLastResult.ok=true` 且 `fallbackHosts=["yandex.com"]`（或其它备用 host）、`retries` 应为 0、`indexnowLastError` 清空、`indexnowPending` 1270→~970、`indexnowLast` 仅在全量覆盖后才前进（分批期间保持 09-03 不动是预期，不是故障）；若 12:00Z 仍 `!ok && retries=2`（四个备用端点也 429），下一步先用探针重新取证再定策略，不要再加等待；Baiduspider 来访是否持续（`botsBy.baidu`）；`stale:true` 频率。
5b. **R512 内容矩阵薄内容审计**：建议 ①②③ 已由 R519–R522 落地；④ 14 个 `/vs` 短页补写（R524）与 ⑤ 67 个 ccTLD `/tld` 页注册局事实改写（R525 27 页 + R526 40 页）也已上线（version f648963f）；en `/tld` 链接占比 >25% 页 370→**0**（中位 28.2%→15.3%，R528 chip 去价为主因）。剩余：vs/en 链接占比 >25% 仍 52 页（66→52）、`/guide` 暂不动。原结论：（`docs/audits/thin-content-audit-r512.md`，1262 页 zh/en 全抓取、同类页掩码 5-gram Jaccard 无 >0.5 对；不建议 noindex/合并）：建议顺序 ① `/tld` 去 FAQ/正文重复 + 80 个 ccTLD 页补注册局政策事实 ② 全站「全部页 chips」（占正文 47%–74%）缩为相关集 + hub 链接 ③ `/vs` 补组合专属数据（价差/到期分布） ④ `/guide` 暂不动。**未授权前不改内容页。**
5c. **R511 零 AI 全站审计**（`docs/audits/audit-r511.md`，PR #474）：P0/P1/P2 无；3 个 P3 即 R510 所修（已上线复验通过）；R502 遗留 P2-1/P3-1~4 全部关闭；Lighthouse 8/8 SEO=100、a11y=100；R507 canonical 矩阵 20/20；sitemap 1270=1264+6。观察项：~~`indexnow:lastAttempt` 未透出 `/api/usage`~~（R514 已透出）；R484 安全头观察不变。
6. ~~候选：新增 Dynadot/Spaceship 注册商（联盟 30%/25%）~~ → R503 已调研并落地：**只加 Dynadot**（售 .cn/.com.cn、中文站、人民币/支付宝），Spaceship 不售 .cn 不加；Namecheap 实测不售 .cn 已从 .cn 菜单隐藏（`docs/research/registrar-affiliate.md` §4，老板待办第 9 项申请 Ambassador）；`/guide` hub 标题分组文案。

## 11. R231–R500 变化速览（详情看各轮 PR / `docs/research`）

- **R231–R250**：内容页扩到 120/116/150；显式 404；触控 ≥44px；guard 可观测（R238）；审计 R239/R242；防线修复 R243–R246；R250 prompt 微调。
- **R2xx–R4xx 内容线**：内容页持续扩容至 408/404/444（R301–R455 各轮审计见 `docs/qa/audit-r*.md`）；hub 分组锚点导航（R415）。
- **R460–R470**：竞品横评定位（R460/R464）；LLM 走 OpenAI 兼容网关（R460/R461）；R463 Space 两步确认；R465 en 拼音路线丢弃；**R466 主轮流式 + 候选级核验流水**；R468 品牌卡（`brand-card.tsx`）；R469 匿名竞品复评；R470 额度型 429 归 quota。
- **R471–R477 AI 不可用韧性线**：规则降级 + KV 熔断（R471）；错误 UX + 375 折叠（R472）；品牌卡墙去重（R473）；备用上游 failover（R474）；R475 回归 → R476 修 2 P1（`dh:aiQuotaDown:v1` 误清、375 横幅高度）；R477 品牌卡对比度 ≥4.5:1。
- **R478**：首页中文利基定位文案 + SSR hero 骨架（`content/home-copy.ts`）。
- **R479**：开源发布准备——README 中英重写、CONTRIBUTING/SECURITY/CODE_OF_CONDUCT/Issue 模板、`docs/launch/launch-checklist.md`。
- **R480**：注册商单一数据源 `lib/registrars.ts` + 公开 var `REGISTRAR_AFFILIATE_JSON` + `/api/registrars` + `/api/click` 外链计数；联盟调研 `docs/research/registrar-affiliate.md`。
- **R481**：可配置 GSC/Bing 验证 meta + Cloudflare Web Analytics beacon（`growth-inject.ts`）、服务端 pageviews/bots 日聚合（`pageviews.ts`）、IndexNow 状态校验；调研 `docs/research/growth-analytics.md`。
- **R482**：pageview 计数按 isolate 分片写 KV，读侧求和（消除多 isolate 互相覆盖）。
- **R483**：6 篇双语 .cn 合规指南（`guides-cn-compliance.ts`，guide 404→410）；调研 `docs/research/cn-compliance-content.md`。
- **R484**：零 AI 全站审计 `docs/audits/audit-r484.md`；浅色主题对比度 AA 修复（PR #448）。
- **R485**：百度站长接入——`BAIDU_VERIFICATION` meta + 可选普通收录 API 推送 cron；调研 `docs/research/baidu-seo.md`。
- **R486**：微信分享/打开体验——`/wx-share.png` 缩略图 + SSR 标题、剪贴板回退 `lib/clipboard.ts`、聊天友好复制格式；调研 `docs/research/wechat-share.md`。
- **R487–R490**：usage 分片计数（`usage-counter.ts`/`sharded-counter.ts`）；SEO 技术审计 `docs/audits/seo-tech-audit-r488.md` + IndexNow 增量推送；中文规则降级质量（`rule-fallback.ts`/`rule-fallback-lexicon.ts`，`docs/research/zh-rule-fallback.md`）；老板待办归一 `docs/owner-actions.md`。
- **R491**（PR #456）：首页 SSR skeleton footer 注入站内导航（`content/site-links.ts` `siteLinksHtml`/React `SiteLinks`）、内容页 footer 加 /why /mcp /advanced、/why 与 /advanced SSR skeleton（`content/why-copy.ts`）。生产实测：首页 SSR `<a>` 0→25，BFS 从 / 可达 1/1270→1270/1270，零入链页 0。保留 `SSR_CANONICAL_ZH_LINKS=false`（`?lang=zh` 内链是否去参数留待后续）。
- **R492**（PR #455）：`ssr-lang.ts` `resolveLang`/`injectHreflang`/`withHtmlVary`——canonical 跟最终解析语言（`Accept-Language: en` 裸路径 → canonical `?lang=en`），HTML 响应加 `Vary: Accept-Language`（API/静态资源不加）；`scripts/seo-audit/lang-matrix.sh`。
- **R493**（PR #457）：见 §10 1c。
- **R494**（PR #458）：见 §10 2。
- **R500**：被丢弃候选样本通道（已部署 e0ead604，生产取样 7/7 忠实见 `docs/audits/r500/`）（`DroppedSample`/`recordDroppedSample`/`newGuardStats({debugDropped})`，worker 解析 `body.debugDropped === true`），`docs/research/dropped-observability.md`（R238「只计数不含内容」的原始理由 = 内容最小化 + 不带用户数据 + 兼容旧客户端，非 UI 噪音），`scripts/replay-r500-en-incoherent.mjs`（现规则 vs 假设规则的 P/R 表）。
- **R496–R499**（PR #459–#462，集成解 `ai.ts` 冲突：R496 先判沙拉再 R499 归一 theme）：`zhMeaningIncoherent` + `ZH_COINED_MEANING_FORMAT`（`docs/research/zh-meaning-coherence.md`）；`singleQuotesCoverLabel`/`EN_PAIR_COLON_RE`/`ZH_ASCII_SHORT_RE`（`docs/research/pinyin-quote-coverage.md`）；`needsWordSupplement`/`newWordSupplementBudget`（`docs/research/en-word-supplement.md`）；`normalizeTheme`/声调剥离（`docs/research/theme-normalization.md`）。guard 新字段 `zhMeaningIncoherent`、`wordSupplementReason`、`wordSupplementSkipped`、`themeNormalized`、`toneClaimStripped`。生产复验见 §10 2。
- **R507**（裁决 R502 P2-1）：canonical 只看 URL、不再跟 Accept-Language 走——`ssr-lang.ts` 新增 `resolveSsrLang()→{lang, canonicalLang}` / `canonicalLangOf()`，`injectHreflang(html, path, ctx)` 按 `ctx.canonicalLang` 决定 canonical；正文协商与 `Vary: Accept-Language` 保留。裸 URL + `Accept-Language: en` 的 Lighthouse SEO 92→100（本地 host-resolver 映射实测）。sitemap 不列 `?lang=en` `<loc>`。论证 `docs/research/seo-lang-canonical.md`；`lang-matrix.sh` 扩为 4 模式。
- **R506**（PR #471，R502 P3 ×4 + com.cn 参考价）：`/mcp` `<pre>` `tabIndex={0}` + focus-visible ring；分享快照条目可选 `status`（`share-items.ts`），`/s/:id` 有 status 才显示 可注册/已注册/未知 徽章、taken 划线且不给去注册，旧快照（无 status）中性文案「候选列表」+ 琥珀提示；`sitemapLastmod(path, fallback)` + `IndustryGuide.updatedAt`（六篇 .cn 指南 2026-09-04，其余 `CONTENT_LASTMOD`）；MCP `suggest_variants` 带点输入 → `isError:true` 双语提示（`mcp-args.ts`）；`TLD_PRICES` 新增 `com.cn: 33/38`。
- **R508**（PR #470，R500 遗留）：`enMeaningIncoherent(label, meaning, {wordMetaphor, theme})` 三类误杀修法——theme=word 自称 real/dictionary word 放开片段检查、`EN_PREDICATE_RE` 扩词形族（evoke/echo/hint at/nods to/reminiscent…，**不加** like a/the 与 forge*）、`X + Y:` 子句含谓语才放行；`containsMetaLanguage` 的 blend 改 `enBlendIsRouteWord`（语音学名词/动词用法不算元词）。评估集 `scripts/fixtures/en-meaning-labels.json`（`build-en-meaning-labels.mjs` 复现），`scripts/verify-r508.mjs` ALL PASS；生产+夹具 P 63.2%→92.3%、沙拉召回 12/12 不变、忠实误杀 7/58→1/58。**生产 AI 复验未做**（DeepSeek 不可用）。
- **R509**：`TLD_PRICES.cn` 29/39 → 33/38（与 com.cn 同源：腾讯云 33/38 vs 阿里云 38/42 取低，2026-09-05 抓取，注释含 URL）。生产：/prices ¥33/¥38、/tld/cn 价格卡、MCP `tld_prices` cn 4.58/5.28 approx。
- **R510**（R509 生产回归的 3 个 P3，0 AI）：`prices-page.tsx` 续费列 `flex-wrap` + 金额/「续费↑」徽标 `whitespace-nowrap`（375px 徽标 23×64 竖排 → 24px 单行，行高 94→69 与 `.cv-row contain-intrinsic-size` 一致，Lighthouse mobile CLS 0）；`/s/:id` SSR 壳按 `shareShellState()` 分流——撤销（KV 留 `{revoked:true}`）→ **410**、不存在/过期/非法 id → **404**（沿 R230 品牌 404），两者加 `noindex` + `shareGoneMeta()` 中性双语 title/描述（`share-items.ts`），SPA 撤销/不存在 UI 不变，`share-shell.test.ts` 用假 ASSETS/KV 直接跑 worker；`hub-filter.tsx hubMatch()` 不带点的查询额外按「去点 + 词边界」比对（`com vs cn`/`com-vs-cn`/`comcn` 命中 `.com vs .cn`，`io vs ai` 不误中 `.studio vs .ai`），带点查询仍按原文（`.com` 不扩大到 com.cn），`hub-filter.test.ts` 覆盖 /vs /tld /guide。
- **R511**（PR #474，纯文档）：零 AI 全站审计报告 + 证据 `docs/audits/r511/`、截图 `docs/audits/screenshots-r511/`；结论见 §10 5c。
- **R512**（PR #473，纯文档 + 可复用脚本）：`scripts/seo-audit/thin-fetch.mjs`（zh/en 全站抓取，`SEO_AUDIT_UA`）/ `thin-analyze.mjs`（掩码 5-gram Jaccard、模板句、链接 chips 占比）→ `docs/audits/r512/{summary.json,pages.csv,nearest-pairs.csv,template-sentences.json,manual-sample.json}`；报告 `docs/audits/thin-content-audit-r512.md`；结论见 §10 5b。
- **R514**（PR #477，0 AI）：`worker.ts` IndexNow/百度推送冷却门 `*_RETRY_MS` 6h→**5h**、日间隔 `*_INTERVAL_MS` 24h→**23h**——门槛与 cron 周期相等时，cron 触发的毫秒级抖动（生产实测 94 ms）会让整轮被判「未到期」跳过；`/api/usage` 新增 `indexnowLastAttempt`。本地 `wrangler dev --test-scheduled` + mock 端点三种种子（−6h+3s 推 / −5h+3s 拦 / −5h−3s 推）验证见 #477 描述；**生产 09-06 00:00:58Z 核对：门已放行（`indexnowLastAttempt == cronLast`）但上游 429 → R515**。
- **R515**（PR #478，0 AI）：`indexnow.ts` `submitIndexNow` 新增 `retry429{backoffMs,maxRetries,sleep?}`——同批 429 等 60s 重发，最多 2 次（`INDEXNOW_429_BACKOFF_MS/INDEXNOW_429_MAX_RETRIES`），非 429 失败不重试，`stopOnFail` 语义不变，`IndexNowBatchResult.retries`、`countRetries()`；`worker.ts` 新 KV `indexnow:lastResult`（每次真正发请求都写 `{at,ok,status,message,submitted,retries}`）+ `/api/usage.indexnowLastResult`，`indexnowLastError` 加 `retries`。依据：00:00:58Z 生产 `indexnowLastAttempt==cronLast` 且 `lastError{429,submitted:0}` 同时刻 → 不是门 skip 而是真发了且上游 429（整点高峰 + Worker 共享出口是推断，非提供方确认）；最坏 3×2×60s=6 min < cron 15 min wall-time 上限。本地 `--test-scheduled` + mock（首请求 429 其后 200）：00:10:26.899Z 429 → 00:11:26.947Z 同批重发 200 → 后两批 200，pending 1270→970，`lastResult {ok,200,300,retries:1}`，见 #478 描述。**生产 06:00:38Z 核对：首发+2 重试仍全 429 → R517。**
- **R517**（PR #480，0 AI）：`indexnow.ts` `INDEXNOW_FALLBACK_ENDPOINTS=[yandex, seznam, naver, yep]`、`submitIndexNow` 新增 `fallbackEndpoints`——主端点 429 立刻按序改发同批到备用参与端点（IndexNow FAQ：提交任一参与引擎即共享全部），非 429（成功/403/网络错）就地定案，全部 429 才进入 60s 退避；`IndexNowBatchResult.endpoint`、`fallbackHosts()`；`worker.ts` `indexnow:lastResult.fallbackHosts`，var `INDEXNOW_FALLBACK_ENDPOINTS`（逗号分隔覆盖；只配 `INDEXNOW_ENDPOINT` 的本地 mock 自动不带备用端点；`""` 生产显式关闭）。依据：06:00Z 生产 R515 `retries=2 !ok`；06:06Z 探针 Worker 5 URL → api.indexnow.org/bing 429 而本机同分钟 200、yandex 202/seznam/naver/yep 200（Bing 侧按来源 IP 限流 Workers 共享出口是**证据支持的推断**，非提供方确认）。267 测试全绿（新增 6 例锁定 fallback/非 429 不换/未配置=R515 行为）；本地 mock（主恒 429、备 202）：6 hits 交替、0 sleep、pending 1270→970、`fallbackHosts:["127.0.0.1:9998"]`。**生产效果待 12:00Z cron。**
- **R519–R522**（集成 PR #486 = #483 + #484 + #482 + #485，全部 0 AI，version d8e5038b）：
  - R519 `content/tld-faq.ts`/`compare-faq.ts`/`guide-faq.ts` FAQ 第 1 答改「适合谁」摘要、第 3 答改单句 + 页内锚点（`TLD_NAMING_ANCHOR`=#naming、`COMPARE_VERDICT_ANCHOR`=#verdict、`comparePickAnchor(tld)`=#pick-<tld>、`GUIDE_IDEAS_ANCHOR`/`GUIDE_PITFALLS_ANCHOR`），`components/faq-answer.tsx` + `ssr-html.ts faqAnswerHtml` 两端逐字同构；`faq.test.ts` 守门：SSR 可见文本 == FAQPage JSON-LD、2524 页复读率 <5%（口径同 `scripts/seo-audit/dup-ratio.mjs`/`thin-analyze.mjs`，**三处改一处必须同步**）。生产 R512 样本页复读率 10–21% → 0%。
  - R520 `content/group-chips.ts`（`tldGroupChips`/`guideGroupChips`/`compareGroupChips`、`VIEW_ALL_LABEL`、`viewAllHref`）：底部 chip 由全量改为同组 ≤30（`/vs` 取两侧 TLD 组并集去重、上限 **24**——30 时 en 链接占比 25.9% 超 25% 目标）+「查看全部 N 个 →」指向 hub `#hub-g-<group>`（N 由计数常量派生）；hub 页带 hash 落地时挂载后滚到分组；无组归属 fallback 组 `more`（如 /tld/at，主题性弱，已知）。删除注入数据 `compareLinks`（-2.3 KB/页）。本地内链图 1270/1270 可达、≤2 跳、0 孤岛（`docs/audits/r520/`）。
  - R521 `content/compare-prices.ts`（`ComparePriceSnapshot`/`buildComparePriceView`/`snapshotFromPayload`，5 年成本 = 首年 + 4×续费，差额 = A − B 正数前者更贵）+ `components/compare-price-table.tsx` + `ssr-html.ts` 同构表格：worker SSR 读与 `/api/prices` 同一份 KV 快照注入 `__DH_CONTENT__.prices`，客户端优先用注入快照（逐字一致），无实时价走 `TLD_PRICES` 静态参考价 + 「参考价」徽标，两侧都缺价不渲染表只给说明。`caption` + `th scope`，375px 容器内横向滚动。
  - R522 `content/compares.ts` 最短 30 个 `/vs` 页 zh/en 补写组合专属判断段（zh 最小词数 628→1184、en 371→725，`nnMasked` 全部下降，R512 模板句命中 0；事实核对表 22 行 IANA/ICANN/GOV.UK；工信部站点 VM 不可达 → `.cn`/`.top` 相关事实标「未验证」并删 8 处无法一手核实说法）。**剩余 14 页 zh 707–755 词未处理**（候选 R524）。
  - 集成期修复：`guide-page.tsx` 合并后丢失 `cn` import；复读率/正文口径（`thin-analyze.mjs`、`dup-ratio.mjs`、`faq.test.ts`）排除 `<table>`——R521 表格数值单元格（同价两行、差额 `≈$0 ¥0`×3）被当句子计入使 37 个 `/vs` 页误报 5–12%，表格属结构化数据非正文。
  - 已知指标变动：R519 删复读句后 `/tld/com` en 正文 453→335 词、链接占比 24.2%→**30.5%**（>25% 目标）——根因 en `/tld` 页正文薄，修法是内容补写（R512 建议的 ccTLD 注册局政策事实），不是继续删链接。
  - 生产回归（零 AI，见 #486 评论）：P0/P1/P2 无；P3 ×2：`/tld/*` chip 价格文字 SSR 静态参考价 → `/api/prices` 加载后实时价（R520 之前即如此，`staticPriceShort` 设计使然，slug/href 一致）；/tld/at 落 fallback 组。
- **R533**（0 AI，未部署；关 R484 P3-3）：`security-headers.ts` + `worker.ts` HTML 后处理中间件——HTML 文档加 HSTS（1 年 + includeSubDomains，不 preload）/ nosniff / Referrer-Policy strict-origin-when-cross-origin / XFO DENY / Permissions-Policy / **CSP Report-Only**（script-src 'self' + per-request nonce，`addScriptNonce()` 给全部可执行 `<script>` 打 nonce；style-src 保留 'unsafe-inline'），非 HTML 响应只加 nosniff + Referrer-Policy；`POST /api/csp-report` 计数进 `usage.cspReports` + 20 条去重样本；`/api/usage` 透出。证据表与 enforce 判据见 `docs/security-headers.md`。已知：静态资源不经 worker（`run_worker_first: ["/"]`），要加头需 `public/_headers`；`/api/*` `/mcp` 本来就没有 CORS 头；Chrome `report-to` 本地未见投递故只用 `report-uri`。
- **R524–R528**（0 AI，version f648963f；集成 PR #492 = #490 + #491，#494 = #493；R524 #489、R527 #488 直接合并）：
  - R524 `content/compares.ts` 剩余 14 个 `/vs` 短页 zh/en 补写组合专属判断段（verdict + pick），.vip/.ai 措辞改为可一手核实的事实。
  - R525 `content/tlds.ts` 27 个 ccTLD（pl mx nz pt se fi at dk ch be jp kr tw no ie sg hk fr br uk de au ca it nl es eu）改写为注册局事实驱动段落（官方 URL + 抓取日期）；修正 .de 两处旧说法（含 6 个 .de `/vs` 页、`hub-index-tld.ts`）。
  - R526 `content/tlds.ts` 40 个 ccTLD（cz tr ae id vn ph gr ro hu cl my th sk ua ar ng il sa eg ke pe kz za ma qa pk lk ee lt lv rs is ge uy lu la md am mn uz）同类改写；`/vs/uy-vs-ar` .ar 资格改为「非居民可注册但需公证/认证文件人工验证」（nic.ar）。子会话报告 nnMasked 中位 zh 0.388→0.162、en 0.269→0.130；模板句正文命中 0（R512 tld 模板句全是组件级骨架，不在正文）。
  - R527 `docs/audits/audit-r527.md` + `docs/audits/r527/`：零 AI 全站审计（R514–R522 后），P0/P1/P2 无；量化 `/tld` chip 价格水合漂移 CLS 0–0.005（不值得为 CLS 修）但 SSR 静态价与实时价偏差 >50% 的 TLD 38/351；en `/tld` 链接占比 >25% 370/408 根因是「更多 TLD 指南」chip 带价格后缀。
  - R528 `content/price-text.ts`（`priceShort/priceFull` 抽出供 worker/客户端共用）、`ssr-html.ts`/`worker.ts`：`/tld` `/guide` 首屏价格卡 + 「相关 TLD」chip SSR 复用 R521 KV 价格快照（`peekPricesPayload`→`snapshotFromPayload`，同一快照注入客户端 `pickPrices` 初始化）→ SSR == 水合、SSR 价 == `/api/prices`；无快照回落静态参考价并保留「参考」标识。「更多 TLD 指南」chip 去价格后缀（slug/href 816/816 不变）。`shortlist-page.tsx` `visibleShareUrl`：撤销分享/候选清空后不再残留失效 URL。
  - 生产回归（零 AI，#494 评论）：10 条 `/tld` `/guide` 路由 SSR==DOM 0 漂移；tld/en 链接占比中位 28.2%→15.3%、>25% 370→0；tld/zh 12→0；nnMasked>0.8 全 0；分享撤销/清空生命周期 410+noindex；Lighthouse SEO/a11y 100、CLS ≤0.0003；console 0。P3：品牌 404 壳沿用首页 title；vs/en 链接占比 >25% 仍 52 页。
- **R495**：`main.tsx routeModule()` 对 /why /advanced /mcp 也等 chunk 就绪再挂载（R491 skeleton 在慢网下曾闪空 ~0.6s，节流帧捕获 3/3 复现→修后 0/3）；`i18n.tsx` 切换语言时同步 URL 显式 `?lang=`（否则 F5 回退到 URL 语言）。

## 12. 资源与凭证索引（只写名称，不写值）

- Worker secrets：`DEEPSEEK_API_KEY`（主上游，**额度耗尽中**）；可选 `LLM_API_BASE` / `LLM_MODEL` / `LLM_THINKING`；可选 `LLM_FALLBACK_API_KEY` / `LLM_FALLBACK_API_BASE` / `LLM_FALLBACK_MODEL` / `LLM_FALLBACK_THINKING`（未配置=休眠）；可选 `BAIDU_PUSH_TOKEN`（未配置）。
- 公开 vars（`wrangler.jsonc`）：`REGISTRAR_AFFILIATE_JSON`（当前 `"{}"`）；可选未配置：`GSC_VERIFICATION`、`BING_VERIFICATION`、`BAIDU_VERIFICATION`、`BAIDU_PUSH_SITE`、`BAIDU_PUSH_DAILY_MAX`、`ANALYTICS_PROVIDER`、`ANALYTICS_TOKEN`；仅本地：`BAIDU_PUSH_ENDPOINT`。
- 公开常量：`INDEXNOW_KEY`（worker.ts + `public/{key}.txt`，按协议公开）。
- 外部账号（老板持有）：Cloudflare（Workers/KV/DNS zone `zalize.com`）、GitHub `wookat`、LLM 网关、（待开）Namecheap Impact/CJ、阿里云云大使、腾讯云云推官、百度站长、微信公众号 —— 状态见 `docs/owner-actions.md`。
- 配额：AI 限流 20 次/h/IP（代码）；百度 API 默认 2000/日（可收紧）；IndexNow 无公开配额但会 429。

## 13. 新会话接手 checklist

1. `git clone` → `git checkout deploy/r192-r195` → `pnpm install` → `pnpm -r typecheck` 确认基线绿。
2. 读本文档 + `README.md` + `.agents/skills/testing-domainhunter/SKILL.md` + `apps/web/src/worker.ts`。
3. 用内置 git 工具看在途 PR / 最新 Rxxx 编号（新工作顺延编号；PR base = `deploy/r192-r195`）。
4. 生产健康：`curl -s 'https://hunt.zalize.com/api/usage?days=2&cb=<随机>'`（`cronLast` <6h、`aiErrors`/`fallbacks` 看 AI 是否恢复、`indexnowLastError`）、`/api/prices`（`stale`）、首页 200。
5. 涉及 AI 的测试前后拉 `/api/usage` 全表对账；日常回归 0 AI。
6. 改内容页对照 §9 同步清单 + `node scripts/check-content-counts.mjs`。
7. 需要老板资源 → 只改 `docs/owner-actions.md`，不要再在研究文档里另起清单。
8. 完成后按 SOP-04 汇报（结论/证据链接/下一步/需注意），并更新本文档 §5/§8/§9/§10。
