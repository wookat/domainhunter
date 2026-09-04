# R481 获客数据验证：GSC / Bing / IndexNow / 隐私友好分析

> 日期 2026-09-04（UTC）。目的：让团队能回答「内容矩阵（/tld、/guide、/vs、/prices）是否开始进流量」。
> 所有结论标注证据来源；「未能测得」按未能测得如实记录，不以推断代替。

## 1. 生产实查（一手证据）

### 1.1 sitemap 与页面可达性

- `https://hunt.zalize.com/sitemap.xml` 解析得 **1,264 个唯一 `<loc>`**（`curl | grep -o '<loc>' | wc -l`）。
- 随机抽样 20 个 URL 逐个 `curl -o /dev/null -w '%{http_code} %{content_type}'`：**20/20 = HTTP 200, `text/html; charset=utf-8`**。抽样覆盖 `/`、`/tld/*`、`/guide/*`、`/vs/*`、`/prices`；额外抽 `/vs/services-vs-agency` 亦 200。
- 结论：sitemap 无死链、无重定向链（无 301/302），URL 数量远低于 IndexNow 单批 10,000 上限（§4）。

### 1.2 `/api/usage?days=7`（`cb=` 随机参数穿透缓存）

| 字段 | 值 | 判断 |
|---|---|---|
| `cronLast` | `2026-09-04 12:00:11 UTC` | cron `0 */6 * * *` 正常（<6h） |
| `indexnowLast` | `2026-09-03 12:00:34 UTC` | 落后 24h 但符合代码内 ≥24h 间隔；**注意**：旧实现在请求前就写该键，所以它只证明「尝试过」，不证明「推送成功」（§4） |
| `days.2026-09-04` | `searches=9, byTld={com:9,cn:4,io:3,dev:3}, fast=9, refine=0, aiErrors={rate-limit:4,quota:3}, fallbacks={quota:2,quota-breaker:2}` | 现有聚合只有「搜索」漏斗，**没有任何页面访问量字段** → 无法回答内容页是否进流量 |

### 1.3 robots.txt

```
User-agent: *
Allow: /
# 另有 GPTBot / PerplexityBot / ClaudeBot 显式 Allow
Sitemap: https://hunt.zalize.com/sitemap.xml
```

无针对 Googlebot / bingbot 的 Disallow，wildcard 规则允许全部抓取。（生产 `curl https://hunt.zalize.com/robots.txt`；代码 `apps/web/src/worker.ts` `/robots.txt` 路由。）

### 1.4 `site:hunt.zalize.com` 收录信号（本会话唯一可得的收录信号）

| 引擎 | 查询 URL | 结果 | 截图 |
|---|---|---|---|
| Google | `https://www.google.com/search?q=site%3Ahunt.zalize.com&hl=en` | **被 reCAPTCHA「unusual traffic」拦截，未解出，未获得任何收录条数**（不能记为 0） | `screenshots/r481/google-site-search-blocked-2026-09-04.png` |
| Bing | `https://www.bing.com/search?q=site%3Ahunt.zalize.com` | 页面显示「About 58 results」，但首屏可见结果全是 Google/YouTube/知乎等**与本站无关的泛化兜底**，未出现任何 `hunt.zalize.com` URL；**58 不能视为本站收录数，有效收录证据 = 0 条可见** | `screenshots/r481/bing-site-search-2026-09-04.png` |
| DuckDuckGo（补充，非任务要求） | `https://duckduckgo.com/?q=site%3Ahunt.zalize.com` | 2 条本站结果 + 「No more results found」 | `screenshots/r481/ddg-site-search-2026-09-04.png` |
| Startpage（Google 结果代理，补充） | `https://www.startpage.com/do/search?q=site%3Ahunt.zalize.com` | 「there are no results for this search」；**非 Google 官方页面，不作为 Google 权威收录数** | `screenshots/r481/startpage-google-index-site-search-2026-09-04.png` |

结论（实事求是）：**目前拿不到 Google 权威收录数；Bing 可见有效收录 0；DDG 2 条。** 这正是要接 GSC / Bing Webmaster 的原因——`site:` 不是可靠指标，两家后台的「覆盖率/索引页数」才是。

### 1.5 DNS / Cloudflare 现状（Cloudflare API 实查，未打印任何 token）

- `zalize.com` 是 Cloudflare zone（Free plan，status active）；`hunt.zalize.com` 解析到 Cloudflare anycast（`104.21.15.239` / `172.67.208.162`），即 **Cloudflare 代理开启**。
- zone 根域已存在 **3 条 `google-site-verification` TXT**（历史其他产品验证遗留）→ Google 域名级资产（Domain property）很可能已验证；`hunt.zalize.com` 可直接作为该资产下的子域看数据，无需再验证（Google 文档：Domain property 覆盖所有子域，见 §3.1）。**待老板在 GSC 后台确认**。
- 生产响应**没有 CSP 头/meta**（`curl -I` 与 `apps/web/index.html` 均无）→ 注入 beacon 无需改 CSP；若未来加 CSP 须放行 `static.cloudflareinsights.com`（script-src）与 `cloudflareinsights.com`（connect-src），见官方 SPA 文档手动嵌入一节。

## 2. 分析工具选型

评分维度按任务要求：免费 / 无 cookie 免 consent / SPA 路由变化支持 / 能否在 Workers 服务端计数。每项 0–2 分。

| 维度 | Cloudflare Web Analytics | Umami Cloud | Plausible |
|---|---|---|---|
| 免费 | **2** — 免费；代理站点无数量限制（[limits](https://developers.cloudflare.com/web-analytics/limits/)） | **1** — Hobby $0/月，10 万事件/月（[pricing](https://umami.is/pricing)） | **0** — 30 天试用后 $9/月起（1 万 PV 档，[plausible.io/#pricing](https://plausible.io/#pricing)） |
| 无 cookie / 免 consent | **2** — 不用 cookie、不指纹、不存 IP（[Web Analytics overview](https://developers.cloudflare.com/web-analytics/)） | **2** — 无 cookie、GDPR 合规（[umami.is](https://umami.is/)） | **2** — 无 cookie、无持久标识（[data policy](https://plausible.io/data-policy)） |
| SPA 路由变化 | **2** — 默认自动：Soft Navigations API / Navigation API `navigate` / History `pushState`+`popstate`，无需 `spa:false` 之外的配置（[SPA 文档](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/)） | **2** — 默认监听 History pushState（[tracker config](https://umami.is/docs/tracker-configuration)） | **2** — 自动监听 pushState 路由（[script docs](https://plausible.io/docs/script-extensions)） |
| Workers 服务端计数 | **0** — 只有浏览器 beacon；无服务端 SDK（同上文档） | **1** — 有 `POST /api/send` 事件 API，可从 Worker 调用但要传 UA/IP 归因（[API](https://umami.is/docs/api/sending-stats)） | **1** — `POST /api/event` 需 `User-Agent`+`X-Forwarded-For`（[events API](https://plausible.io/docs/events-api)） |
| 合计 | **6** | 6 | 5 |

推荐：**Cloudflare Web Analytics（beacon）+ Worker 内自建第一方 pageviews 聚合**（两者互补，而非二选一）：

1. 站点已在 Cloudflare 代理下，beacon 零成本、零 cookie、无需 consent 弹窗，Dashboard 自带 Core Web Vitals，且服务端不需要任何 token 以外的配置；SPA 路由由官方文档背书自动上报。
2. 三家的「服务端计数」都要把 UA/IP 转发给第三方才能去重归因，与任务「不记录 IP/UA 原文」冲突；因此漏斗计数（home/results/tld/guide/vs/prices/other + bots）在 Worker 内用 KV 日聚合自建（§5），只存计数。
3. Umami 与 Plausible 若未来需要更细事件（自定义 goal），可用 `ANALYTICS_PROVIDER` 扩展；本轮只实现 `cloudflare`，其他值不注入（fail-closed）。

## 3. GSC / Bing Webmaster 验证方式

### 3.1 Google Search Console（[官方：Verify your site ownership](https://support.google.com/webmasters/answer/9008080)）

| 方式 | 适用资产 | 本站落地 |
|---|---|---|
| HTML `<meta name="google-site-verification" content="…">` | URL-prefix 资产 | Worker var `GSC_VERIFICATION`（本 PR） |
| HTML 文件 | URL-prefix | 可放 `apps/web/public/`，未做 |
| Google Analytics / Tag Manager | URL-prefix | 不用（引入 cookie） |
| **DNS TXT** `google-site-verification=…` | **Domain property（必须）**，覆盖所有子域/协议 | Cloudflare DNS 一条 TXT；根域已有 3 条同类记录 |

### 3.2 Bing Webmaster Tools（[官方：Add & verify site](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)）

| 方式 | 说明 |
|---|---|
| XML 文件 `BingSiteAuth.xml` | 放站点根 |
| HTML `<meta name="msvalidate.01" content="…">` | Worker var `BING_VERIFICATION`（本 PR） |
| **DNS CNAME**（不是 TXT） | `<code>.hunt.zalize.com CNAME verify.bing.com` |
| 从已验证的 GSC 导入 | 最省事：GSC 验证后在 Bing 一键导入，免再验证 |

### 3.3 Cloudflare DNS 下的推荐

- **Google：用 DNS TXT 建 Domain property**（一次验证覆盖 `zalize.com` 全部子域与 http/https），根域已有 3 条 TXT 说明流程已走通过；`GSC_VERIFICATION` meta 作为 URL-prefix 资产的无 DNS 兜底。
- **Bing：优先「从 GSC 导入」**；否则 DNS CNAME（Bing 文档化的 DNS 方式）；`BING_VERIFICATION` meta 为兜底。
- 注意 Cloudflare 代理不影响 DNS 验证记录（TXT/CNAME 验证记录本身为 DNS-only）。

## 4. IndexNow 校验（`apps/web/src/worker.ts` `pingIndexNow` + 新 `indexnow.ts`）

| 检查项 | 结果 |
|---|---|
| key 文件路由 | `https://hunt.zalize.com/024aa6c6f88245bbacdac2f60a94e333.txt` → HTTP 200 `text/plain`，body 即 key；由 `apps/web/public/` 静态直出（IndexNow 协议要求 key 公开，[spec](https://www.indexnow.org/documentation)） |
| 单批上限 | 官方 POST 上限 **10,000 URL/次**（同上）；sitemap 当前 1,264 → 单批。新实现 `chunkUrls(urls, 10000)` 拆批，未来扩容不越界 |
| 直连实测 | 向 `api.indexnow.org/indexnow` 提交 1 个 URL 得 **HTTP 202**（Accepted，validation pending，官方状态表见 spec「Response format」） |
| **原实现 bug ①** | 请求**之前**就写 `indexnow:last`，且**不读响应状态、不 catch 网络异常** → 任何失败（403 key 不匹配 / 422 / 429 / 网络）都会被当成功，并抑制随后 24h 重试；`/api/usage` 的 `indexnowLast` 因此只表示「尝试过」 |
| 修复 | 200/202 才写 `indexnow:last` 并清 `indexnow:lastError`；其他状态/异常写 `indexnow:lastError = {at,status,message,submitted}`，`indexnow:lastAttempt` 6h 冷却避免每次 cron 重发；`/api/usage` 新增 `indexnowLastError`。错误日志仅含状态/消息/条数，**不含 key** |
| 单测 | `indexnow.test.ts`：拆批、202 成功、429/403/500 失败、网络异常 `status:0` |

## 5. 实现摘要（PR 内容对照）

| 需求 | 实现 | 验证 |
|---|---|---|
| B1 验证 meta 可配置、仅 HTML | `growth-inject.ts` + `worker.ts` 全局后置中间件：`content-type: text/html` 的 GET 响应才处理；vars 空 → 不读 body 原样透传 | `growth-inject.test.ts`；本地字节级对比（§6） |
| B2 分析脚本可配置 | `ANALYTICS_PROVIDER=cloudflare` + 32 位 hex token → 官方 `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":…}'>`；SPA 路由自动追踪（§2 官方文档）；无 CSP 无需改；页脚双语隐私一句话 `footer.analyticsNotice` 仅在 DOM 存在 beacon 时渲染 | 单测 + 本地 dev |
| B3 服务端漏斗计数 | `pageviews.ts`：`classifyPath` → home/results(`/results`,`/s/:id`)/tld/guide/vs/prices/other；`detectBot` → google/bing/baidu/ai/other，命中只计 `bots`；isolate 内 5s 合并一次 KV 写 `pv:{date}`（45 天）；不存 IP/UA；`/api/usage` 合并输出 | `pageviews.test.ts` 11 例；本地 dev 实测 §6 |
| B4 IndexNow | §4 | `indexnow.test.ts` |

计数口径说明：① 只统计到达 Worker 的请求——HTML 带 `Cache-Control: public, max-age=600`，10 分钟内重复访问由浏览器缓存应答，不计（测试代理实测：普通回车导航不计、硬刷新计）；② KV 多 PoP 读改写非原子；③ 页脚（含隐私一句话）只在 home/results 模式渲染，`/tld`、`/vs`、`/prices`、`/why` 本就没有页脚。因此 `pv:*` 是**趋势/下界**指标，精确 UV/PV 以 Cloudflare Web Analytics 为准。

KV 写量评估：Cloudflare KV 免费额度 1,000 写/天（[limits](https://developers.cloudflare.com/kv/platform/limits/)）；本账号已是付费 KV（GraphQL 实查 domainhunter 命名空间 9-01/9-03 各 27 写、9-02 1,097 写）。5s 合并窗口下 pageview 写量 ≤ 每 isolate 每 5s 一次，正常流量下每日数百次量级；KV 多 PoP 读改写非原子，`pv:*` 是**近似下界**计数，用于趋势判断而非精确审计。

## 6. 本地验证记录（2026-09-04，`wrangler dev`，零 AI 调用）

三个 dev 实例：base `8a03a35`（:8791）、新代码无 vars（:8792）、新代码带 vars（:8793，测试值 `GSC_VERIFICATION=TESTgsc_…`、`BING_VERIFICATION=ABCDEF…`、`ANALYTICS_PROVIDER=cloudflare`、`ANALYTICS_TOKEN=0123…cdef`）。脚本：`docs/research/screenshots/r481/compare.sh`。

| 路径 | 状态 | base == 新代码(无 vars) | 新代码(无 vars) == 带 vars 去掉注入片段 | 带 vars 注入 |
|---|---|---|---|---|
| `/` `/tld/com` `/tld` `/vs/com-vs-cn` `/prices` `/why` `/mcp` `/advanced` `/shortlist` `/s/abc123` | 200 | **SAME**（归一化构建 hash 与内联 tailwind CSS 后逐字节相同；CSS 差异仅新增页脚类名） | **SAME**（逐字节） | 1 组 meta×2 + beacon |
| `/guide/ai-startup`（不存在 slug）`/no-such-page` | 404 | SAME | SAME | 注入（404 壳也是 HTML；不计 pageview） |
| `/api/usage` `/sitemap.xml` `/robots.txt` `/llms.txt` `/{key}.txt` `/manifest.webmanifest` | — | — | **md5 相同，0 命中 `cloudflareinsights|site-verification`** | 无 |

计数实测：Chrome UA 访问 `/`×3、`/tld/com`、`/prices`，Googlebot UA 访 `/tld/cn`，bingbot 访 `/`，GPTBot 访 `/why`，curl 默认 UA 若干 → 7s 后 `/api/usage?days=1` 返回 `pageviews:{home:5,results:2,tld:5,vs:2,prices:3,other:8}, bots:5, botsBy:{other:2,google:1,bing:1,ai:1}`（含 compare.sh 的请求；curl 默认 UA 归 `other` bot；`/api/*`、`/sitemap.xml` 不计）。带 vars 实例响应头保持 `Content-Type: text/html; charset=utf-8` / `Cache-Control: public, max-age=600`，无残留 `content-length`。

`pnpm -r typecheck` / `pnpm --filter web test`（7 文件 47 例）/ `pnpm --filter web build` 全绿。

测试子代理（浏览器实测，零 AI）：无 vars 5 页零注入、有 vars 5 页 meta×2 + beacon×1；页脚隐私句 zh/en × 深浅主题 × 桌面/375px 无溢出（scrollWidth 360 ≤ 375）、不可聚焦不改 Tab 序；`/api/usage`、sitemap、robots 未被改写；浏览器加载 `/`、`/tld/cn`、`/prices` 各 +1，Googlebot UA 访 `/tld/io` → `bots`/`botsBy.google` +1 且 `pageviews.tld` 不变；404 壳不计；`/advanced`、`/shortlist`、`/monitors`、`/mcp`、404 页回归正常。截图见 `screenshots/r481/local-*.png` 与 PR 评论。

## 7. 需老板操作（一次性，缺口不阻塞：未配置时站点行为与现状完全一致）

1. **Google Search Console**（https://search.google.com/search-console）：
   - 若 `zalize.com` Domain property 已存在（根域已有 3 条 google-site-verification TXT）→ 直接在该资产下看 `hunt.zalize.com` 数据，**无需任何操作**；
   - 否则「添加资产 → 网域 → zalize.com」，把给出的 TXT 记录加到 Cloudflare DNS（zalize.com zone，Type TXT，Name `@`）；
   - 备选：「网址前缀 → https://hunt.zalize.com → HTML 标记」，复制 `content="…"` 的值填 Worker var `GSC_VERIFICATION`。
   - 验证后提交 sitemap `https://hunt.zalize.com/sitemap.xml`。
2. **Bing Webmaster Tools**（https://www.bing.com/webmasters）：优先「Import from Google Search Console」；否则添加 `https://hunt.zalize.com`，选 meta tag，把 `msvalidate.01` 的 content 值填 Worker var `BING_VERIFICATION`（或 DNS CNAME）。IndexNow 提交记录在 Bing Webmaster「IndexNow」页可见，可核对 §4。
3. **Cloudflare Web Analytics**：Dashboard → Analytics & Logs → Web Analytics → Add a site → `hunt.zalize.com` → 选择「手动安装 JS snippet」（**不要**开自动注入，避免与 Worker 注入重复上报），复制 snippet 中 `"token":"…"`（32 位 hex）→ Worker vars `ANALYTICS_PROVIDER=cloudflare`、`ANALYTICS_TOKEN=<token>`。
4. **填 vars 的位置**：`apps/web/wrangler.jsonc` 增加 `"vars": { "GSC_VERIFICATION": "...", "BING_VERIFICATION": "...", "ANALYTICS_PROVIDER": "cloudflare", "ANALYTICS_TOKEN": "..." }` 后由父会话部署；或 Cloudflare Dashboard → Workers → domainhunter → Settings → Variables（注意 Dashboard 设置会在下次 `wrangler deploy` 时被 wrangler.jsonc 覆盖，二者选一）。这些值按协议本就公开在 HTML 中，不属于 secret，可提交仓库。
5. 部署后核对：`curl -s https://hunt.zalize.com/ | grep -c 'google-site-verification\|msvalidate.01\|data-cf-beacon'` 应为 3；`/api/usage?days=2` 出现 `pageviews`/`bots` 字段；次日 `indexnowLast` 更新且 `indexnowLastError` 为 null。
