# DomainHunter 交接文档（handoff-context）

> 依 company-os 交接上下文制度维护。换会话/换负责人时把本文档注入新会话即可接手。最后更新：2026-08-08（R178，最新已合并批次 R169，进行中批次见文末）。

## 1. 项目一页纸

- **定位**：AI 域名猎手——用一句自然语言说出想要的寓意/风格，Agent 多轮（最多 5 轮）构思→RDAP/DNS/WHOIS 实时核验→跨轮去重反思再猎，**只给真正可注册的名字**。目标用户：中文创业者/独立开发者优先，双语（zh/en）。免费、免登录、open-core（MIT）。
- **生产 URL**：https://hunt.zalize.com （自定义域）；Worker 直连 https://domainhunter.wookat520.workers.dev
- **仓库**：wookat/domainhunter（pnpm monorepo）
  - `packages/core` — 生成 + 核验引擎（纯 TS，`generateCandidates` / `checkDomains` / RDAP bootstrap）
  - `apps/web` — Hono on Cloudflare Workers（`src/worker.ts`）+ React 18/Vite/Tailwind SPA
- **部署**：`pnpm deploy`（= `vite build && wrangler deploy`，在 `apps/web` 下执行；根目录 `pnpm deploy` 会 filter 到 web）。wrangler 配置见 `apps/web/wrangler.jsonc`（KV binding `CACHE`、ASSETS、cron `0 */6 * * *`）。
- **集成分支模式**：并行子会话各自开独立分支 PR；部署前把本批次所有分支合到一个集成分支 `deploy/<batch>`（基于最新 main + 本批全部 PR），从集成分支构建部署，**防止直接从旧 main 部署导致已上线功能回退**。部署后 PR 逐个合回 main（deploy 分支用完即删，远端可能看不到历史 deploy 分支）。
- **Worker secret**：`DEEPSEEK_API_KEY`（`wrangler secret`，AI 构思用 DeepSeek）。

## 2. 架构图谱

### 2.1 前端路由（SPA 客户端路由，`apps/web/src/App.tsx` 手写 pathname 匹配 + lazy chunk）

| 路由 | 页面组件（`src/components/`） | 说明 |
|---|---|---|
| `/` | home-page.tsx（+ agent-page / results-page） | AI 猎名主流程 + 即输即查（quick check）；`?q=` 预填搜索 |
| `/advanced` | advanced-page.tsx | 批量粘贴核验（≤200 个），CSV 导出 |
| `/shortlist` | shortlist-page.tsx | 收藏清单（本地）+ 分享/同步码；noindex |
| `/monitors` | monitors-page.tsx | 到期/释放监控管理；noindex |
| `/prices` | prices-page.tsx | TLD 价格总览（Porkbun 实时 + ≈ 静态参考价兜底） |
| `/why` | why-page.tsx | 产品定位页 |
| `/mcp` | mcp-page.tsx | MCP 接入文档页（GET）；同路径 POST 是 MCP server |
| `/tld/:tld` | tld-page.tsx | TLD 指南内容页（数据 `content/tlds.ts`，60 个） |
| `/guide/:slug` | guide-page.tsx | 行业命名指南（`content/guides.ts`，62 个含在途） |
| `/vs/:slug` | compare-page.tsx | TLD 对比页（`content/compares.ts`，84 个含在途） |
| `/s/:id` | share-page.tsx | 分享快照只读页（SSR 注入动态 og:image） |

SEO 页（/、/advanced、/mcp、/prices、/why、/tld、/guide、/vs）在 worker 侧做 SSR meta 替换 + hreflang（`?lang=zh|en`）+ JSON-LD（FAQPage/Article/Breadcrumb）+ 首屏 SSR 骨架（`injectSsrSkeleton`）+ CSS 内联 + modulepreload。

### 2.2 Worker API（`apps/web/src/worker.ts`，Hono）

- `POST /api/ai-search` — AI 猎名，NDJSON 流（understanding/round/proposed/结果/done 事件）；限流每 IP 20 次/小时（`rl:{ip}:{hour}`）。
- `POST /api/search` — 词根×前后缀×TLD 组合核验，NDJSON 流；也支持 `domains[]` 显式清单（≤200）。
- `POST /api/check` — 清单复查（≤100 个，`refresh=1`/`refresh:true` 穿透缓存），NDJSON。
- `GET /api/prices` — Porkbun 实时价（KV 24h 缓存，stale 兜底；彻底无数据回 200 + 空 prices）。
- `GET /api/stats` — 累计核验数（`stats:checked`）。
- `GET /api/usage?days=N` — 最近 N 天（≤45）聚合使用量 + `cronLast` / `indexnowLast` 心跳。
- `POST /api/monitor`、`POST /api/monitor/list`、`GET /api/monitor/changes`、`POST /api/monitor/recheck` — 监控增删/查询/变化记录/手动实时复查（复查限频每 IP 60s）。
- `POST /api/share`、`GET|DELETE /api/share/:id` — 清单分享快照（≤100 项，30 天 TTL，revokeToken 撤销）。
- `POST /api/sync`、`GET /api/sync/:code` — 免登录跨设备同步码（8 位 A-Z2-9 去混淆字母，90 天 TTL）。
- `POST /mcp` — MCP server（JSON-RPC 2.0，Streamable HTTP 无状态，协议版 2025-03-26）：工具 `check_domains`（≤50，含 expiresAt/expiringSoon，返回 structuredContent）、`tld_prices`（无实时报价的 TLD 用静态参考价补齐 approx:true）、`suggest_variants`（get/my/try/use + app/hq/labs/hub 变体，见 `lib/variants.ts`）。
- SEO/分享基础设施：`GET /sitemap.xml`、`/llms.txt`、`/robots.txt`、`/api/og/*`（home/advanced/mcp/prices/why/tld/:tld/guide/:slug/vs/:slug/:shareId 动态 SVG 1200×630）。
- 兜底 `app.all("*")` → ASSETS（静态资源/SPA 壳）。

### 2.3 KV（binding `CACHE`）key 约定

| Key | 用途 / TTL |
|---|---|
| `d:{domain}` | 单域核验缓存：taken 24h / available 1h（防抢注误导）；含可选 expiresAt |
| `rl:{ip}:{hourBucket}` | AI/check 限流计数，~1h |
| `rl:recheck:{ip}` | 监控手动复查限频（60s） |
| `stats:checked` | 累计核验计数（非原子，允许误差） |
| `usage:{YYYY-MM-DD}` | 每日聚合使用量（仅计数，无输入/IP），45 天 |
| `monitor:domains` | 监控集合单 key 全局 map（上限 500） |
| `monitor:changes` | 状态变化记录（保留 100 条） |
| `prices:v2:{N}` | Porkbun 价格缓存 24h；**key 掺 TLD_LIST.length**，扩容后旧缓存自动失效 |
| `prices:latest` | 不带版本的 stale 兜底（30 天，每次成功拉取刷新） |
| `share:{id}` / `sync:{code}` | 分享快照 30 天 / 同步码 90 天 |
| `cron:last` / `indexnow:last` | cron 心跳 / IndexNow 上次推送时间 |

### 2.4 Cron（`triggers.crons: ["0 */6 * * *"]`，worker `scheduled`）

每 6 小时：① 写 `cron:last` 心跳；② `runMonitorSweep`（全量监控域实时复查，状态变化写 `monitor:changes` + webhook 推送）；③ `pingIndexNow`（≥24h 间隔向 api.indexnow.org 推送 sitemap 全部 URL，key 文件 `/{INDEXNOW_KEY}.txt`）。

## 3. 关键约定与踩坑

- **TLD 扩容同步清单**（新增 TLD 指南时须全部同步，漏一处就不一致）：
  1. `content/tlds.ts`（TLD_GUIDES 指南全文）
  2. `content/tld-list.ts`（TLD_LIST，有 `satisfies Record<Tld, TldGuide>` 编译期强校验）
  3. `components/home-page.tsx` 的 `KNOWN_TLDS`（即输即查识别，含非追踪 TLD，是超集）
  4. 首页 FAQ「支持哪些后缀」文案（worker.ts `HOME_FAQ` zh+en 两份 + i18n 词典对应文案）
  5. /prices 页（TLD_LIST 驱动，自动）、sitemap/llms.txt（自动）、页脚 TLD 内链
  6. KV 价格 key 自动升版（`prices:v2:{N}`），无需手动清
- **对比页 footer 内链读独立的 `content/compare-slugs.ts`**（轻量清单，避免 compares.ts 全文进主 bundle）——新增 /vs/ 页时**两处都要加**。
- **llms.txt / sitemap.xml 有 CDN 24h 缓存**（`cache-control: max-age=86400`），发布后立刻 curl 验证要加 `?cb=<随机数>` 穿透。生产回归测试统一用 `?cb=` 防缓存假象。
- **AI 测试预算纪律**：DeepSeek 按量计费，测试 AI 搜索前后各拉一次 `/api/usage` 全表，确认消耗可解释；日常回归尽量走不消耗 AI 的路径（quick check、/api/check、/advanced、MCP check_domains）。
- **监控是全局 500 名额**（`monitor:domains` 单 key map，无账号体系），「我的监控」以客户端 localStorage 清单为准、服务端只按清单查。手动 recheck 限频每 IP 60s。
- **expiresAt 可选 + 哨兵裁剪**：核验结果的 expiresAt 是可选字段；部分注册局返回 9999 年等哨兵值，前端 `lib/utils.ts` 裁剪 **> 当前时间 +15 年** 的不展示（R171）。
- **内容页延迟挂载**（R174）：/tld 等内容页 defer mount 到路由 chunk ready，且跳过巨型数据 chunk 的 modulepreload，降低 LCP。
- 部署永远走集成分支 `deploy/<batch>`，不要从可能落后的 main 直接 deploy。
- `.shop`/`.art` 无可用 WHOIS/RDAP 通道，走 DNS NXDOMAIN 兜底判定（`whois.ts` `DNS_NXDOMAIN_TLDS`）；`sh/gg/so/us` 不在 IANA RDAP bootstrap，WHOIS 是唯一权威通道。

## 4. 数据与外部依赖

- **DeepSeek**：`DEEPSEEK_API_KEY`（Worker secret），仅 `/api/ai-search`（构思 + understanding）用；其余全部零 AI。
- **Porkbun 价格**：`https://api.porkbun.com/api/json/v3/pricing/get`（公开、免 key），10s 超时；失败回退 `prices:latest` stale（响应带 `stale:true`）；无报价 TLD（cn/so 等）前端/MCP 用静态参考价（`types.ts` `tldPrice`，`USD_TO_CNY=7.2` 估算汇率）。
- **核验通道**（`packages/core/src/check.ts` + `apps/web/src/whois.ts`）：DoH（cloudflare-dns.com）预筛 → RDAP（IANA bootstrap `data.iana.org/rdap/dns.json`，缓存 24h）→ WHOIS 43 端口 fallback（`cloudflare:sockets`，服务器清单见 `WHOIS_SERVERS`：com/net/cn/io/cc/tv/co/me/xyz/sh/gg/so/us）。taken 但 RDAP 无到期时再查 WHOIS 补 expiresAt（R160）。
- **localStorage keys**（前端本地数据，无账号）：
  - `dh:lastSearch:v1`（上次搜索快照）、`dh:myShares:v1`（我发出的分享）、`dh:chunkReloaded`（chunk 加载失败自愈标记）
  - `domainhunter:shortlist`（+ 旧 `domainhunter:favorites` 迁移、`domainhunter:shortlist:checkedAt`）
  - `domainhunter:monitor`、`domainhunter:monitor-webhook`
  - `domainhunter:recent-searches`、`domainhunter:theme`、`domainhunter:lang`
- **IndexNow key**：worker.ts 内 `INDEXNOW_KEY`（按协议公开）+ `public/{key}.txt`。

## 5. 已知问题 / 观察项

- **Porkbun 上游波动**：偶发超时/挂，已有 stale 兜底 + /prices 全静态参考价 notice（R170）；观察 `stale:true` 出现频率。
- **drawk.cn 历史监控名额**：早期测试遗留在全局 `monitor:domains` 里占名额，清理需直接改 KV（无管理界面）。
- **LCP**：R150 做内容页 SSR 骨架后 /tld LCP 曾持平未改善，R174 用延迟挂载 + 跳过数据 chunk preload 修复；后续改动注意别回退。
- **旧 KV 核验缓存无 expiresAt**：R160 之前写入的 `d:{domain}` 无 expiresAt 字段，靠 TTL（≤24h）自然过期自愈，无需迁移。
- sitemap `<lastmod>` 是手写常量 `CONTENT_LASTMOD`（worker.ts），增删内容页记得更新。

## 6. 进行中与工作惯例

- **批次迭代**：短周期批次 Rxxx 编号（commit/PR 标题带 `(rNNN)`）。惯常一批 = 多个并行子会话，各自独立分支 + PR → 集成分支 `deploy/<batch>` 构建部署 → 生产真实回归（`?cb=` 防缓存）→ PR 合回 main。
- **四道把关**（company-os）：qa-engineer 测试 → user-experience-officer 体验走查 → 内部交叉测试 → 合规与安全审计，全过才交付。
- **截至本文档提交时的在途 PR**（已开发未合 main，部分可能已通过 deploy 分支上线）：
  - #146 perf(r174) /tld LCP、#145 feat(r172) 行业指南 56→62、#144 feat(r173) 对比页 78→84、#143 fix(r171) 哨兵到期日裁剪、#142 fix(r170) /prices 全静态参考价 notice、#141 docs(r167) 零 AI 生产审计报告。

## 7. 新会话接手 checklist

1. `git clone` 后 `pnpm install`，`pnpm typecheck` 确认基线绿。
2. 读本文档 + `README.md` + `apps/web/src/worker.ts`（全部 API/SEO 逻辑都在这一个文件）。
3. `gh pr list` 看在途 PR / 批次进度，确认当前最新 Rxxx 编号（新工作顺延编号）。
4. 核对生产健康：`curl 'https://hunt.zalize.com/api/usage?days=2&cb=<rand>'`（看 cronLast 心跳是否 <6h）、`/api/prices`（是否 stale）、首页 200。
5. 改动 TLD/内容页时对照 §3 同步清单逐项检查。
6. 涉及 AI 的测试前后拉 `/api/usage` 全表对账。
7. 部署：从最新 main + 本批 PR 建 `deploy/<batch>` 集成分支 → `pnpm deploy` → 生产 `?cb=` 回归 → 合 PR。
8. 完成后按 SOP-04 汇报（结论/证据链接/下一步/需注意），并更新本文档的「在途」「已知问题」小节。
