# R504 IndexNow 429 修复 —— 证据留档

## 生产事实（修复前，2026-09-05 实查 `/api/usage?days=2`）

```text
cronLast          2026-09-05T00:01:25.192Z   （00:00Z cron 已运行）
indexnowLast      2026-09-03T12:00:34.369Z   （最近一次成功已 36h+）
indexnowLastError {"status":429,"message":"Too many requests","submitted":0}
```

## 外部接口实测（本机直连 `https://api.indexnow.org/indexnow`，同一 host/key/keyLocation）

| 请求 | 结果 |
|---|---|
| POST 1 URL | HTTP 200 |
| POST 100 URL | HTTP 200 |
| POST 1270 URL（生产同规模，一次性） | HTTP 429 |
| GET key file `https://hunt.zalize.com/<key>.txt` | HTTP 200 |
| GET `https://www.bing.com/indexnow?url=…&key=…` | HTTP 200 |

结论（推断，基于以上直测）：429 由单次大批量触发，不是 key 缺失/不匹配。R488 已改为增量推送，但生产
快照 `indexnow:pushed` 因从未成功写入而始终为空，导致每次仍是 1270 全量 → 一直 429 → 快照永远为空（自锁）。

## 修复

- 实际批大小 `INDEXNOW_BATCH_SIZE = 100`（协议上限 10000 保留为常量）；每次 cron 最多 `INDEXNOW_RUN_MAX_BATCHES = 3` 批；首个失败批次即停
- 成功批次立即并入 `indexnow:pushed` 快照（`acceptedUrls` + `mergePushed`），失败/未发批次不计
- 全站覆盖完成才写 `indexnow:last`；积压期间由 `indexnow:lastAttempt` 的 6h retry gate 继续推进
- `/api/usage` 新增 `indexnowPending`（尚未成功推送的 URL 数），可直接观测积压消化
- 新增 Worker var `INDEXNOW_ENDPOINT`（仅本地 mock 用；生产不配置 = 官方端点）

## 本地端到端（wrangler dev `--test-scheduled` + 本地 mock，0 生产请求、0 AI）

mock 规则：`urlList.length > 100 → 429`（复刻实测规律）；`mock-indexnow-429.mjs` 额外让首个请求 429。

| 运行 | mock 响应 | `indexnowPending` | `indexnowLast` | `indexnowLastError` |
|---|---|---:|---|---|
| 初始 | — | 1270 | null | null |
| cron #1 | 100/200 ×3 | 970 | null | null |
| cron #1 后 3s 内再触发 ×2 | 无请求（6h gate） | 970 | null | null |
| 清 lastAttempt → cron #2 | 200 ×3 | 670 | null | null |
| cron #3 | 200 ×3 | 370 | null | null |
| cron #4 | 200 ×3 | 70 | null | null |
| 切 mock429 → cron #5 | 70 URL → **429** | **70（不变）** | null | `{status:429,submitted:0}` |
| cron #6 | 70 URL → 200 | **0** | 写入 | **清除** |

单测：`apps/web/src/indexnow.test.ts` 新增 R504 用例（1270 URL 每次 ≤3×100、第 2 批 429 即停、失败批不入快照、
lastmod 变化丢弃旧快照、下线 URL 剔除、5 次运行推完 1270）。

## 生产验证（部署后待做）

部署后等 06:00Z cron，查 `/api/usage?days=2`：期望 `indexnowLastError` 为 null、`indexnowPending` 1270→970；
之后每 6h 递减 300，约 5 次 cron（~30h）后 `indexnowPending=0` 且 `indexnowLast` 更新。
