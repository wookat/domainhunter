# DomainHunter 交接文档（handoff-context）

> 依 company-os 交接上下文制度维护（模板 `company-os/templates/handoff-context.md`）。换会话/换负责人时把本文档注入新会话即可接手。
> **最后更新：2026-09-04（R490，同步到 R486 现状）**。上一次系统性更新是 R250（2026-08-08），R466–R485 期间只做过局部小节追加（`git log -- docs/handoff-context.md`：e7bbfcb R481、a248e48 R482、79ecd0b R485）。
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

## 5. 当前实时服务状态（2026-09-05 14:10 UTC 实查）

| 项 | 值 | 证据 |
|---|---|---|
| 线上地址 | https://hunt.zalize.com （自定义域）；Worker 直连 https://domainhunter.wookat520.workers.dev | 首页 200 |
| 生产 Worker version | `0eff3305-6108-41a6-83e2-3ab28dade321`（deployed 2026-09-05T13:56Z，含 R501–R504） | `npx wrangler versions list`（apps/web） |
| 对应代码 tip | `deploy/r192-r195` @ **0c3caf3**（#467 R504 合并提交；#464/#465/#466 已先合并） | R503 Dynadot 出现在 /shortlist .cn 菜单、`/api/usage.indexnowPending=1270` 生产实查；R505 回归证据 https://github.com/wookat/domainhunter/pull/464#issuecomment-5552368944 |
| 内容计数 | **TLD 408 / 行业指南 410 / 对比页 444 / sitemap 1,270 URL**（1,262 内容页 + 8 静态页） | `scripts/content-counts.json` 与 `curl sitemap.xml?cb=` 逐类 grep 一致 |
| cron 心跳 | `cronLast=2026-09-04T18:00:11Z`（每 6h） | `/api/usage` |
| 价格 | `pricesLastOk=2026-09-04T12:00Z`，`/api/prices` 351 个 TLD 有 Porkbun 报价，非 stale | `/api/prices` |
| IndexNow | 上次成功 2026-09-03T12:00Z；R488 增量代码 09-05 00:00Z 仍 429/submitted 0（快照为空→全量 1270 自锁，R502 P2-2）；**R504 分批修复 13:56Z 上线**，`indexnowPending=1270`，首个新代码 cron 09-05 18:00Z：期望 lastError 清空、pending→970，之后每 6h −300，~30h 归 0 | `/api/usage.indexnowPending/indexnowLastError` |
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
| `/s/:id` | share-page | 分享快照只读页（壳永远 200，语义在 `/api/share/:id`） |

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

① `cron:last` 心跳 → ② `runMonitorSweep`（全量复查，变化写 `monitor:changes` + https webhook）→ ③ `pingIndexNow`（≥24h；10,000/批；仅 200/202 记成功；失败写 `indexnow:lastError`，6h 冷却）→ ④ `pushBaidu`（R485，仅 `BAIDU_PUSH_SITE` + secret `BAIDU_PUSH_TOKEN` 都在时运行；只推 `baidu:pushed` 中未成功的 URL，每轮 ≤ `BAIDU_PUSH_DAILY_MAX`，默认 2000）。

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
| `indexnow:last` · `indexnow:lastAttempt` · `indexnow:lastError` | `INDEXNOW_*_KEY` | 上次成功 / 上次尝试 / 失败详情 JSON |
| `baidu:last` · `baidu:lastAttempt` · `baidu:lastError` · `baidu:pushed` | `BAIDU_*_KEY` | 百度推送状态；**未配置 BAIDU_PUSH_* 时不会出现** |
| `dh:llm-breaker:v1` | `rule-fallback.ts` `LLM_BREAKER_KEY` | quota 熔断，300s |

### 7.2 `/api/usage` 字段速查

顶层：`days{date→…}`、`cronLast`、`indexnowLast`、`indexnowLastError`、`pricesLastOk`、`pricesLastFail`、`baiduLast`、`baiduLastError`。每日项：`searches`、`byTld`、`fast`、`refine`、`aiErrors{quota|rate-limit|network|…}`、`fallbacks{quota|quota-breaker|…}`（R471）、`llmProvider{primary,fallback}`（R474，成功主轮才有）、`outbound`/`outboundByTld`（R480）、`pageviews{home,results,tld,guide,vs,prices,other}`、`bots`、`botsBy{google,bing,baidu,ai,other}`（R481/R482）。全部只计数，不存 IP/UA/输入。

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
- **IndexNow 429**：2026-09-04 18:00 推送被 api.indexnow.org 限流（`indexnowLastError.status=429`），代码按 6h 冷却重试；若连续多日 `indexnowLast` 不前进再查（可能需降低批量或频率）。
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
5. 观察项：IndexNow 429 是否持续；Baiduspider 来访是否持续（`botsBy.baidu`）；`stale:true` 频率。
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
