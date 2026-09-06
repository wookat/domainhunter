# R549 验证记录：/vs 正文价格与实时价格表同源

对应 R545 体验走查 P1-2（`docs/audits/r545/vs-price-contradiction.md`）。方案 B：正文价改占位符，SSR 与客户端用与价格表同一份 `ComparePriceSnapshot` 插值。

## 扫描（scripts/verify-r549.mjs）

| | before（126f73a） | after |
|---|---|---|
| 绝对零售价句 / 页 | 739 句 / 408 页（zh 89、en 650；verdict 688、pick 51） | 0 / 0 |
| 依赖比值/差额的相对表述句 / 页 | 127 句 / 97 页 | 0 / 0 |
| 政策/批发/拍卖事实金额（保留） | 5 句 | 10 句（原被归入 abs 句的同句事实，现单列） |
| 占位符 | 0 | 4140（price 3804、diff 121、ratio 79、pair 61、jump 34、sum 24、cost 12、costdiff 5；不合法 0） |

明细见 `scan-before.md` / `scan-after.md`。before 里可归属到 TLD_PRICES 的 547 个数字中，与实时价偏差 ≤5% 292、5–15% 94、15–30% 57、>30% 9、无实时价 95；另有 1590 个数字无法归属到当前 TLD_PRICES（手写时的旧参考价/USD 原价/派生数），全部随时间漂移；.com 正文写 69/85，实时 80/80；.io 正文 259/419，实时 202/373。

## 本地验收命令（全绿）

- `pnpm -r typecheck` ✓
- `pnpm --filter web test` ✓ 37 文件 / 428 用例（含新增 `compare-price-placeholders.test.ts` 18 用例；faq.test 复读率、compare-verdict-opening 开场唯一性照常通过）
- `pnpm --filter web build` ✓
- `node scripts/check-content-counts.mjs` ✓ 408 / 410 / 444

## 本地 wrangler dev（fresh build，:8787）SSR 抽样

抓取 `/vs/com-vs-io`、`/vs/io-vs-ai`、`/vs/com-vs-cn` × zh / `?lang=en`，Mozilla UA。可见 HTML 中无残留 `{{…}}`；正文数字与同页价格表数字来自同一快照：

- com-vs-io zh：「.io 首年 202 元、续费 373 元，.com 首年 80 元、续费 80 元，也就是 .io 的续费约为 .com 的 4.7 倍」——表同为 ¥202/¥373、¥80/¥80（基线 126f73a 同页为「259 元/419 元、69 元/85 元、五倍」）。
- io-vs-ai zh：「.io 首年 202 元、续费 373 元，.ai 首年 595 元、续费 595 元，且 .ai 多数注册商两年起注，首笔至少一千元出头」——政策事实保留。
- com-vs-cn zh：「首年 ≈33 元、续费 ≈38 元，明显低于 .com（首年 80 元、续费 80 元）」——.cn 无实时价，回落 TLD_PRICES 并带 ≈（参考价语义）。

## SEO（scripts/seo-audit/thin-fetch.mjs + thin-analyze.mjs，--groups vs，本地 base :8788 vs after :8787）

| 指标 | base | after | R540/R546 基线 |
|---|---|---|---|
| en linkShare 中位 | 20.12% | 19.83% | 19.84%（R540） |
| en >25% 页数 | 0 | 0 | 0 |
| en prose 词数中位 | 622.5 | 627.5 | 628 |
| zh linkShare 中位 | 17.22% | 16.80% | 16.8%（R546） |
| zh prose 中位 | 1006.5 | 1012.5 | 1013.5 |

无任何页 prose 下降 >10%（占位符渲染后词数与原文基本相同，`≈` 与「约」只增不减）。原始数据 `vs-linkshare-local.json`。

## 0 生产 AI 调用

`GET https://hunt.zalize.com/api/usage?days=1`（2026-09-06）：searches 0→0、fast 0→0、refine 0→0（测试前后间隔 >60s）。全程只请求了生产 `/api/prices` 与 `/api/usage`。

## 未处理 / 记录

- `metaDescription` 字段约 85 处仍含 ¥/$ 绝对价（任务范围为 verdict/pickA/pickB）；meta 由 worker 直接输出，可在后续轮次用同一 `renderPriceText` 处理。
- `docs/handoff-context.md` 未更新（不在本轮允许改动范围）。
