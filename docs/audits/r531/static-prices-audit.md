# R531 — 静态参考价刷新 + /vs 选型卡改用 KV 快照（0 AI）

基线 `deploy/r192-r195` @ 74fcda4（生产 version f648963f）。取证时间 2026-09-06 10:00Z。

## 1. 取证：生产 /api/prices vs TLD_PRICES

- 生产响应存档：[`api-prices-2026-09-06.json`](./api-prices-2026-09-06.json)（`GET https://hunt.zalize.com/api/prices`，HTTP 200，`tldCount=351`，`fetchedAt=1788674449621` = 2026-09-06 06:00:49Z，`usdToCny=7.2`，`stale` 非真）。
- 汇率：`apps/web/src/content/tld-list.ts` `USD_TO_CNY = 7.2`，`lib/currency.ts` `toUsd(cny) = round(cny/7.2)`、`toCny(usd) = round(usd*7.2)`。
- 口径与 R527 相同：`staticUsd = toUsd(first)`，`relDiff = (staticUsd − live.registration) / live.registration`。
- 基线（刷新前）复算结果（验证过，`scripts/check-static-prices.mjs` 同法的 Python 复算）：
  - 静态参考价 409 个，其中 351 个有实时价可比、58 个无实时价（cn com.cn so berlin paris amsterdam jp sg fr it es kr hk ch at be se pl dk fi no ie br pt cz tr ae vn gr ro hu cl th sk ua ar ng il sa eg ke pe kz za ma qa pk lk ee lt lv rs is ge uy lu md uz）。
  - **首年偏差 >50%：38 个**，与 [`docs/audits/r527/static-vs-live-prices.json`](../r527/static-vs-live-prices.json) 的 38 个集合**完全一致**（对称差 ∅）：
    `my tienda tires vin me theater college university nyc coupons vision accountants design auction shopping immo art vegas domains actor engineer de media deals games cloud discount camp mx am zone fun app surgery id tw au xyz`
  - 首年偏差 >30%：58 个（上面 38 个 + site cc ca vip club furniture co sh uk org dev eu us network works glass nz ph la；这 20 个不在本轮刷新范围，只记录）。
  - 续费偏差 >50%（首年未超标、本轮不动，只记录）：vip us eu。
- 刷新后（本 PR）：`node scripts/check-static-prices.mjs docs/audits/r531/api-prices-2026-09-06.json` → **首年 >50%：0 个**，>30%：19 个（上面 20 个去掉 cc→已 <50% 但仍 47%；site −49%），退出码 0；`--threshold=0.3` 退出码 1（门槛生效）。全量行见 [`static-vs-live-prices.json`](./static-vs-live-prices.json)。
- 注：R527/本脚本用「四舍五入后的 ≈$」比较（即页面实际展示值）；若改用未取整 `first/7.2`，基线 >50% 为 36 个（fun/xyz/au 退出、cc 进入）。以展示值为准。

## 2. 刷新的 38 个 TLD（¥ = round($ × 7.2)，first/renew 分别刷新）

| TLD | 旧 first/renew | Porkbun $ 首年/续费 | 新 first/renew |
|---|---|---|---|
| my | 220/220 | 2.37/26.06 | 17/188 |
| tienda | 360/360 | 5.66/47.89 | 41/345 |
| tires | 500/500 | 8.24/72.61 | 59/523 |
| vin | 345/345 | 6.69/47.89 | 48/345 |
| me | 120/150 | 2.73/17.27 | 20/124 |
| theater | 396/430 | 10.81/52.01 | 78/374 |
| college | 375/375 | 10.3/52.01 | 74/374 |
| university | 360/360 | 10.81/49.95 | 78/360 |
| nyc | 190/190 | 5.66/26.26 | 41/189 |
| coupons | 78/366 | 2.57/43.77 | 19/315 |
| vision | 160/160 | 5.66/36.56 | 41/263 |
| accountants | 612/648 | 23.17/93.2 | 167/671 |
| design | 280/380 | 10.81/46.86 | 78/337 |
| auction | 78/204 | 3.09/29.35 | 22/211 |
| shopping | 210/210 | 8.24/24.2 | 59/174 |
| immo | 205/205 | 8.24/28.32 | 59/204 |
| art | 90/110 | 3.6/21.11 | 26/152 |
| vegas | 380/380 | 15.96/43.39 | 115/312 |
| domains | 250/250 | 10.81/34.5 | 78/248 |
| actor | 255/255 | 10.81/35.53 | 78/256 |
| engineer | 202/216 | 9.78/31.41 | 70/226 |
| de | 58/58 | 2.9/4.07 | 21/29 |
| media | 90/280 | 4.63/36.56 | 33/263 |
| deals | 63/204 | 3.6/31.41 | 26/226 |
| games | 130/170 | 8.24/27.29 | 59/196 |
| cloud | 60/160 | 3.88/21.11 | 28/152 |
| discount | 63/204 | 4.63/24.2 | 33/174 |
| camp | 88/398 | 6.69/49.95 | 48/360 |
| mx | 90/360 | 35.57/41.23 | 256/297 |
| am | 430/430 | 36.35/36.35 | 262/262 |
| zone | 25/240 | 8.24/31.41 | 59/226 |
| fun | 10/150 | 2.57/31.41 | 19/226 |
| app | 99/118 | 8.75/14.93 | 63/107 |
| surgery | 500/500 | 43.77/43.77 | 315/315 |
| id | 60/220 | 18.33/18.33 | 132/132 |
| tw | 200/200 | 17.99/17.99 | 130/130 |
| au | 85/85 | 7.91/7.91 | 57/57 |
| xyz | 8/79 | 2.04/14.21 | 15/102 |

## 3. tldPrice() / TLD_PRICES 调用点清单（有快照时是否仍显示静态价）

| 调用点 | 用途 | 有快照 / 实时价时 | 说明 |
|---|---|---|---|
| `content/price-text.ts` `priceShort`/`priceFull` | 所有价格文案的共用实现 | 否（实时价优先，仅该 TLD 缺价时回退静态，带「静态参考价/Static reference」） | /tld 价格卡、相关 TLD chip、/guide 推荐卡、/vs 选型卡都经这里 |
| `content/compare-prices.ts` `priceRow` | /vs 价格表（SSR + 客户端） | 否（快照有价用实时，缺价回退静态并标 ≈） | R520 起已用快照 |
| `content/ssr-html.ts` `compareContentBlocks` 选型卡 | /vs 两侧「.tld + 价格行」 | **基线：是（`staticPriceFull` 始终静态）→ 本 PR：否**（改 `priceFull(tld, lang, prices.live)`） | 本 PR 修复点 |
| `components/compare-page.tsx` 选型卡 | 同上客户端 | **基线：用客户端 `/api/prices` 拉取结果（首帧无 → 静态，拉到后重渲染 ≠ SSR）→ 本 PR：`pickPrices(content.prices, fetched)`，与 SSR 同源** | 本 PR 修复点 |
| `content/ssr-html.ts` `pricesTableSkeleton` | /prices SSR 骨架的行序 | **是**（骨架只有静态价可用，按静态首年升序排；水合后按实时价重排） | 静态价越接近实时，水合前后行序抖动越小；只记录 |
| `components/prices-page.tsx` `buildRows` | /prices 参考列 | 否（有实时价的 TLD 用实时；58 个无实时价 TLD 显示 `≈$` 静态参考并标注） | 截图 2 的「参考」行即这些 TLD |
| `components/home-page.tsx` `ChipPrice` | 首页快速核验 chip | 否（`usePrices()` 有值即实时；仅缺价 TLD 显示 ≈$） | 首帧 `/api/prices` 未返回时短暂显示静态 |
| `components/brand-wall.tsx` `pricePill` | 结果页胶囊 | 否（同上） | 同上 |
| `components/results-page.tsx` `priceOf` | 结果排序键 | 否（实时优先；缺价用 `first/7.2`） | 排序用，不展示 |
| `components/shortlist-page.tsx` `sortPriceUsd` | 收藏排序键 | 否（实时优先） | 排序用，不展示 |
| `worker.ts` MCP `tld_prices` | MCP 工具输出 | 否（仅 Porkbun 无报价的 TLD 用静态补齐，`approx:true`） | cn/so 等 |
| `worker.ts` MCP `check_domain` `firstYearPriceUSD` | MCP 工具输出 | 否（实时优先，缺价回退静态） | 同上 |
| `types.ts` `staticPriceTlds()` | 本 PR 新增，仅供 `scripts/check-static-prices.mjs` 枚举 | n/a | 不进页面 |

结论：有快照时，页面上**唯一**始终显示静态价的位置就是 /vs 选型卡（基线 ②），本 PR 已改为快照同源；其余调用点均为「缺实时价才回退」。

## 4. 本地验证（验证过）

- 四条验收命令全绿：`pnpm -r typecheck`（exit 0）、`pnpm --filter web test`（32 files / 367 tests 通过）、`pnpm --filter web build`（✓ built）、`node scripts/check-content-counts.mjs`（408/410/444 全部通过）。
- `/vs` 选型卡 SSR == 水合 DOM == /api/prices：本地 `wrangler dev --port 8787`（本地可拉到 Porkbun 实时价，先 GET /api/prices 预热 KV），脚本 `ssr-vs-hydrated-vs.mjs`（curl 等价 fetch 取 SSR `<p class="tnum mt-1 text-xs text-txt2">`，Chrome CDP 取水合后同选择器 textContent，再按 /api/prices 用 priceFull 文案公式推算期望值）。
  - R531 分支 8/8 通过（`ssr-vs-hydrated-vs-r531.json`）：uy-vs-ar / io-vs-dev / com-vs-cn 各 zh+en，另加 com-vs-xyz zh、com-vs-me en（两侧含刷新过的促销价 TLD）。uy/ar/cn 无实时价 → 两侧均为「静态参考价 / Static reference」回退且逐字一致。
  - 基线 74fcda4（worktree 构建，`wrangler dev --port 8788`）复现缺陷（`ssr-vs-hydrated-vs-baseline-74fcda4.json`）：io-vs-dev zh 与 com-vs-cn en 均 SSR=静态价、DOM=实时价（SSR≠水合）。
- 截图：`vs-io-vs-dev-zh-pick-cards.png`（/vs 选型卡 zh，Porkbun 实时价行）、`prices-en-reference-column.png`（/prices en，Register/Renew 列：`.cn` 行 `≈$5 ¥33 / ≈$5 ¥38` 为静态参考，相邻 `.discount` 为刷新后实时价 ¥33/¥174）。

未验证：生产环境本身未部署本 PR，生产 /vs 选型卡仍为基线行为（SSR 静态价）。
