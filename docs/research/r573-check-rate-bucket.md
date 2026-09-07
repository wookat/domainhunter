# R573 调研：`/api/check` 与 MCP `check_domains` 拆出独立限频桶

来源：`docs/qa/r567-regression.md`「已知风险」/ `docs/handoff-context.md` §10 5d「R564 遗留」：R564 起首页/结果页/`/advanced` 的「重新核验」与 unknown 重试都打 `POST /api/check?refresh=1`，而该端点与 `POST /api/ai-search` 共用同一个 `rl:{ip}:{hour}` 20 次/小时 IP 桶——用户点几次重新核验就把 AI 猎名 429 掉，且 429 文案「每小时最多 20 次」与用户实际动作对不上。本轮 **0 次生产 AI 调用**：全部复现/验证在本地 `wrangler dev`（无 LLM key）与 vitest 完成，生产只做过 2 次只读 `GET /api/usage?days=1`。

每条结论标注 **[验证过]**（本机实测/代码实读）、**[未验证]**、**[推断]**。

## 1. 现状（改前，基线 `deploy/r192-r195` tip `f985459`）[验证过]

`git show f985459:apps/web/src/worker.ts`：

| 行 | 内容 |
|---|---|
| L105 | `const RATE_LIMIT_PER_HOUR = 20;` |
| L113 | `const MAX_RECHECK_DOMAINS = 100;`（`/api/check` 单次最多 100 个域名） |
| L172–L183 | `checkRateLimit(kv, ip)`：key `` `rl:${ip}:${Math.floor(Date.now()/3600_000)}` ``，`kv.get` → `n >= 20` 拒绝 → `kv.put(n+1, {expirationTtl: 3700})`；无 KV / KV 抛错放行（fail-open） |
| L294 | `POST /api/ai-search` 调用，429 体 `{error:"rate_limited", message}`（zh/en 两版「每小时最多 20 次 AI 猎名」），**无 `Retry-After`、无 scope** |
| L931 | `POST /api/check` 调用，429 体只有 zh 文案「请求太频繁：每小时最多 20 次」，**按请求计**（1 个域名和 100 个域名同价） |
| L1097 | MCP `check_domains` 调用，文本 `rate limited: max 20 requests per hour` |
| L1129 | MCP `suggest_variants` 调用，同上 |

四处共用**同一个 key、同一个计数器**。`suggest_variants` 只做 `generateCandidates` 规则组合 + `checkDomainsCached`，**不调用 LLM**（L1113 起的 `suggest_variants` 分支内无 `generateAiCandidates` / `generateUnderstanding` / `DEEPSEEK_API_KEY` 引用）。

前端侧（R564，未改）：`apps/web/src/lib/check-client.ts` L98 `!res.ok → throw new RecheckHttpError(status)`；L36 `recheckFailureDetail` 把 `status === 429` 写成行 detail `recheck-429`；L44 `unknownReason("recheck-429") === "recheck-limited"`；`i18n.tsx` L129/L688 已有 zh「重新核验太频繁，这一小时已达上限」/ en "Too many rechecks — hourly limit reached"；`domain-row.tsx` 只渲染 `t(unknownReasonKey(detail))`，**不读响应体**——因此 worker 侧新增 `scope` 字段不会泄漏 raw 文案到 UI，前端无需改动（`check-client.test.ts` L102–L107 既有守门仍通过）。

## 2. 本地复现共桶（改前代码，`wrangler dev` 端口 8787，无 LLM key）[验证过]

脚本 `/home/ubuntu/r573/repro.sh`（不入库；每轮迭代除主请求外还多发 1 次探测请求读头，故第 11 轮即第 21 个请求）。摘录（2026-09-07T12:32Z）：

```
#01–#10 /api/check?refresh=1 -> 200（共 20 个请求）
#11 /api/check -> 429 {"error":"rate_limited","message":"请求太频繁：每小时最多 20 次，休息一会儿再来吧"}
POST /api/ai-search -> HTTP/1.1 429 {"error":"rate_limited","message":"今天猎得有点勤快了：每小时最多 20 次 AI 猎名，休息一会儿再来吧"}
MCP check_domains -> {"isError":true,"text":"rate limited: max 20 requests per hour, try again later"}
```

改后用 `wrangler kv key get --local` 读到老 key `rl:127.0.0.1:496884 = 20`，即上面 20 次 `/api/check` 写满的正是 AI 猎名读的那个计数器。结论：**本地无 LLM key 也能走到限流判断**（限流判断 L294 在读 `DEEPSEEK_API_KEY` 的 L307 之前），不必退回单元测试证明。

> 注（本地环境事实）：`wrangler dev`/miniflare 会给每个请求注入 `cf-connecting-ip: 127.0.0.1`，`x-forwarded-for` 不生效（worker 先读 `cf-connecting-ip`）。要模拟不同 IP 须直接传 `cf-connecting-ip` 头（§6.2 验证时用了 `10.7.7.7`、`10.9.9.9`）。生产由 Cloudflare 边缘注入真实 IP，不受影响。[验证过：`x-forwarded-for: 10.9.9.9` 仍 429、`cf-connecting-ip: 10.9.9.9` 200 且新出现 key `rl:check:10.9.9.9:496884 = 1`]

## 3. 方案：两个独立桶，check 桶按域名个数计权

新文件 `apps/web/src/lib/rate-limit.ts`：

```ts
consumeRateLimit(kv, ip, scope: "ai" | "check", weight = 1, now = Date.now())
  → { ok: true } | { ok: false, scope, limit, retryAfter }
key = `rl:${scope}:${ip}:${hourBucket}`      // hourBucket = floor(now / 3600_000)
拒绝条件 n + weight > limit（拒绝时不计数）；TTL 3700s；无 KV / KV 抛错放行（与改前一致）
retryAfter = ceil(((hourBucket+1)*3600_000 - now)/1000)，≥1   // 到下一整点桶边界
```

| 桶 | key | 上限 | 调用方 | 计权 |
|---|---|---|---|---|
| `ai` | `rl:ai:{ip}:{hour}` | 20/h（不变） | `POST /api/ai-search`（唯一消耗 LLM 额度的入口） | 每请求 1 |
| `check` | `rl:check:{ip}:{hour}` | **200 域名/h** | `POST /api/check`、MCP `check_domains`、MCP `suggest_variants` | 每请求 = 去重/过滤后**实际核验的域名数** |

理由：
- **按域名数而非按请求数**：`/api/check` 单次 ≤ `MAX_RECHECK_DOMAINS=100`，MCP `check_domains` ≤ 50，`suggest_variants` ≤ 48。按请求计时「1 个域名」和「100 个域名」同价，既拦不住批量刷（20 次 × 100 = 2000 域名/h），又误伤单点重试（20 次点击就没了）。按域名计 200/h：单点重新核验可点 200 次，批量最多 2 批 100。**[推断]** 200 是否恰当无生产数据支撑（生产 `/api/check` 无按 IP 的调用量统计），取 2 × MAX_RECHECK_DOMAINS 作为起点，后续可按 `usage` 调。
- **`suggest_variants` 归 check 桶**：它不调 LLM（§1），成本与 `check_domains` 同质（RDAP/WHOIS 上游），归 check 桶并按生成的变体数计权（计权在 `generateCandidates` 之后、核验之前，`limit` 参数决定实际域名数）。
- **`Retry-After` 到整点**：桶按整点小时切，重试早于整点必然仍 429；两桶 429 都带 `Retry-After` 头与 `retryAfter` 字段。
- **429 响应体**：check 桶 `{error:"rate_limited", scope:"check", limit:200, retryAfter, message}`，message 按 `?lang=` / `Accept-Language`（`resolveLang`）出 zh「重新核验太频繁：每小时最多 200 个域名，下个整点再试」/ en "Too many rechecks — up to 200 domains per hour, try again after the top of the hour"；ai 桶结构同形（`scope:"ai"`），message 沿用改前两版措辞。MCP 两工具返回 `isError:true` 文本 `rate limited (check): max 200 domains per hour, retry in Ns`。
- **拒绝时不计数**（`n + weight > limit` 直接返回）：被拒的批次不会把桶推过上限，也避免「拒绝一次就更接近下次拒绝」。

## 4. KV 最终一致性 / 多 isolate 读改写漏计 [验证过：官方文档；结论为推断]

`kv.get` → `kv.put(n+w)` 不是原子操作。Cloudflare KV 官方（[How KV works](https://developers.cloudflare.com/kv/concepts/how-kv-works/)）：写入是最终一致的，其他位置读到新值最长 60s；同 key 并发写以最后写入为准（last-write-wins）。R482/R487 pageview/usage 计数因此改成每 isolate 单写者分片再读时求和（`docs/research/growth-analytics.md` §B3、`docs/handoff-context.md` §7 `pv:`/`usage:` 行）。

限流场景**不**照搬分片：漏计只会让计数**偏小**（同 IP 两个 isolate 各读到 n=199、各写 200，实际用了 201），即**只放宽、不误伤**——用户不会被错误地 429；漏计幅度受并发度限制（同一 IP 同一秒并发发批量核验才会漏）。R573 前的 20/h 桶同样是这个语义，本轮未引入新风险。分片方案会让读侧多一次 `list`，对每次核验请求都加延迟，不划算。**[推断]** 生产中同 IP 并发批量核验极少（前端 `RecheckButton` 每次 1 个域名、`/advanced` 一次一批）。

## 5. 兼容与迁移 [验证过]

- 老 key `rl:{ip}:{hour}` TTL 3700s，新代码不读不写，自然过期；**不迁移**。部署瞬间的效果：当小时内已消耗的老计数归零（用户短暂多得一小时额度），可接受。
- 本地实测新旧 key 并存互不影响：`wrangler kv key list --local --prefix rl:` 同时看到 `rl:127.0.0.1:496884 = 20`（老）、`rl:ai:127.0.0.1:496884 = 20`、`rl:check:127.0.0.1:496884 = 200`；vitest 亦覆盖「老 key 已计满 20 不影响任一新桶」。
- 前端零改动（§1）；MCP 工具描述 / `llms.txt` 未提及限频数字，无需改文案。
- `docs/handoff-context.md` §6 L76「限流每 IP 20 次/h（`rl:{ip}:{hour}`）」与 §7 L100 `rl:{ip}:{hourBucket}` 行现已过时——本轮授权范围只有 §10 一行，**只记录不改**，留给下一次 handoff 整理。

## 6. 验证方式与结果

### 6.1 vitest（新增 16 例，既有 555 例不动）[验证过]

- `apps/web/src/lib/rate-limit.test.ts`（9 例）：key 命名与老 key 不同名；`retryAfterSeconds` 在固定时刻 = 2400s、整点前 1ms = 1s、整点 = 3600s；桶隔离（check 200 满 → ai 仍可用 20 次，反向亦然）；按域名数计权（100+100=200，第 201 个拒绝且不写 KV、TTL 3700）；边界（剩 5 拒 6 放 5；weight<1 按 1）；不同 IP/小时独立；fail-open；双语文案。
- `apps/web/src/rate-limit-route.test.ts`（7 例，`worker.fetch` 级，mock `checkDomains` / `./ai` / `fetch` 不出网，`vi.useFakeTimers` 固定时刻）：`/api/check` 100 域名写 `rl:check:{ip}:{hour}=100`、不碰 `rl:ai`/老 key、重复域名去重后计权；打满后 429 体精确等于 `{error, scope:"check", limit:200, retryAfter:2400, message(zh)}` + `Retry-After: 2400`、`?lang=en` 出英文、被拒不扣；check 满后 `/api/ai-search` 200 且流内无 `rate_limited`、`rl:ai=1`；ai 满后 429 `scope:"ai"` 文案不变、`/api/check` 仍 200；老 key=20 不影响；MCP `check_domains` 按接受域名数计权 + 195+6 拒绝文本；MCP `suggest_variants` `limit:8` 写 8、满后拒绝。
- 四条验收命令全绿：`pnpm -r typecheck` ✓；`pnpm --filter web test` **55 files / 571 tests passed**；`pnpm --filter web build` ✓（7.19s）；`node scripts/check-content-counts.mjs` 全部通过（TLD 408 / 指南 410 / 对比 444）。

### 6.2 `wrangler dev` 端到端（改后代码，2026-09-07T12:40Z，`/home/ubuntu/r573/verify.sh`，不入库）[验证过]

```
1. /api/check 100 domains                 200（weight 100）
2. /api/check same 100 domains            200（weight 100 → 桶 200）
3. /api/check 1 domain                    429  Retry-After: 1158
   {"error":"rate_limited","scope":"check","limit":200,"retryAfter":1158,"message":"重新核验太频繁：每小时最多 200 个域名，下个整点再试"}
3b. ?lang=en                              429  "...Too many rechecks — up to 200 domains per hour, try again after the top of the hour"
4. MCP check_domains                      isError "rate limited (check): max 200 domains per hour, retry in 1158s"
5. MCP suggest_variants                   isError 同上
6. /api/ai-search（无 key）                200  流首行 {"type":"round",...} → {"type":"fallback","reason":"quota",...} → 规则候选 proposed
   ——check 桶已满时 AI 猎名不再 429，进入正常流式路径（本地无 key 走 R471 规则降级，非 rate_limited）
   再打 19 次 ai-search 全 200；第 21 次 429 {"scope":"ai","limit":20,"retryAfter":1152,"message":"今天猎得有点勤快了：每小时最多 20 次 AI 猎名，休息一会儿再来吧"}，lang=en 出英文
```
`retryAfter 1158s` 自 12:40:42Z 起算 = 13:00:00Z，即下一整点。[验证过]

反向隔离（新 IP `cf-connecting-ip: 10.7.7.7`，12:41Z）：20 次 `/api/ai-search` 200 → 第 21 次 429 `scope:"ai"` `Retry-After: 1101` → 同 IP `/api/check example.com` **200**（`{"domain":"example.com","status":"taken",...}`）。

KV 终态（`wrangler kv key get --local`）：`rl:127.0.0.1:496884=20`（老，改前复现遗留）、`rl:ai:127.0.0.1:496884=20`、`rl:check:127.0.0.1:496884=200`、`rl:check:10.9.9.9:496884=1`。

> verify.sh 末段「IP2」用 `x-forwarded-for` 模拟第二个 IP，在本地被 miniflare 的 `cf-connecting-ip` 覆盖（§2 注），该段输出无效，已用 `cf-connecting-ip` 头重跑（上一段）。如实记录。

### 6.3 生产 [验证过：只读]

- 未请求 `hunt.zalize.com/api/ai-search`、未点「开始猎取」、未用任何 LLM key。
- `GET https://hunt.zalize.com/api/usage?days=1` 前（12:43Z）/ 后（12:50Z）对照：`2026-09-07 searches 0→0 / fast 0→0 / refine 0→0`，0 增量。
- 生产未部署本改动（任务要求不部署）；**生产行为「未验证」**，以上全部为本地 wrangler + vitest。

## 7. 未做 / 记录待办

- `docs/handoff-context.md` §6 L76、§7 L100 的 `rl:{ip}:{hour}` 描述过时（§5）。
- 200 域名/h 阈值无生产数据支撑（§3 推断）；可在 `/api/usage` 加 `rateLimited.{ai,check}` 计数后再调——不在本轮范围。
- 前端对 check 429 只显示「重新核验太频繁，这一小时已达上限」，未显示 `retryAfter` 倒计时（i18n 已有文案，未改前端，属 R564 既有 UX）。
- `MonitorRecheck` 的 `rl:recheck:{ip}` 60s 冷却是另一套（`monitor` 路由），不在本轮范围，未动。
