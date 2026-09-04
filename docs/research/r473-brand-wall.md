# R473 品牌卡墙去重与撞色重排（对标 Namelix 卡墙）：设计论证与验收对照

> 角色：前端工程师 + UI 设计师。背景：R469 匿名竞品复评，R468 品牌卡把视觉主观分 4.0→4.3（Namelix 4.5），剩余差距全在**卡墙层面**而非单卡：P1-B 同名跨 TLD 重复卡、P2-A 相邻撞色、P2-B 紧凑行零品牌信号。本轮先读现状、出论证，再动手。基线 `origin/deploy/r192-r195`（含 R470 `cff4aa5`）。

## 1. 现状调查（读 `results-page.tsx` / `brand-card.tsx` / `domain-row.tsx`，基线 cff4aa5）

| 位置 | 基线行为 | 导致的问题（R469 复评原话） |
| --- | --- | --- |
| Top Picks | `sortRows(availableRows,"score").slice(0,3)`，逐**域名**取 3 张 | `pulseplan.com/.dev` 占 2 席；3 席 ≠ 3 个名字 |
| Grid | `visible.filter(status!=="taken")` 逐**域名**一张 `GridCard` | `daysync.com/.io/.dev` 三张同紫卡连排，一屏 15 张只有 ~5 种外观 |
| 外观 | `brandLook(label)`：FNV-1a(lower) → palette 下标 `h & 15`，同名同外观（硬约束） | 16 套配色下相邻同色概率 1/16/对；zh Top Picks 前两张 petwan/chongsi 实测同为 `#FFD200`（h&15 都是 0） |
| 紧凑行（R467 density=compact） | `compact` 分支不渲染 `BrandSwatch`（舒适行才有 28px swatch） | 一屏 30 行无任何品牌线索 |
| Namelix（`screenshots/namelix-results.png`） | 每卡一个名字、每卡不同色；卡下无 TLD 概念（Namelix 不核验多 TLD） | 我们有多 TLD 核验这一差异化信息，不能靠"删掉"对齐，要**折叠成胶囊** |

结论：单卡层面（R468）已收敛，本轮只动**布局层**——分组、选席、变体分配、行内色点；不改 `Row` 类型、AI/核验/SSE/后端。

## 2. 方案（已按此执行）

**A. 分组与选席**（`apps/web/src/lib/brand-wall.ts`，纯函数、零 React，verify 脚本直接 esbuild 打包）
- `groupByLabel(rows)`：按 label（大小写不敏感）分组，组顺序 = label 首次出现顺序，组内保持传入（评分）序，`rows[0]` 为默认操作对象。
- `pickTopGroups(sorted, 3)`：沿用现有评分排序，`groupByLabel(...).slice(0,3)` ⇒ 3 席 = 3 个不同 label，同名多 TLD 只占一席；不足 3 个不同名字时不补位。
- Grid：`groupByLabel(visible.filter(status!=="taken"))`，一名一卡；行视图不分组（逐域名一行，未动）。

**B. 撞色重排 = `brandLook(label, variant)`**（`apps/web/src/lib/brand-look.ts`，从 brand-card.tsx 抽出）
- `variant ∈ {0,1,2}`，palette 下标 = `(h + variant·5) & 15`：`variant 0` 与 R468 **完全一致**（verify A1 逐字节回归），三个变体两两不同色（stride 5 与 16 互质，A2）；layout/type/shape/case/split 只由 h 决定、不随 variant 变（A3）——「同名同外观」原则退化为「同名同版式同字形，色可轮换」。
- `assignBrandVariants([topLabels, gridLabels])`：布局顺序确定后**一次确定性遍历**，段内相邻才算相邻。规则：label 已分配则沿用（**先到者不改**）；否则在 0/1/2 中选与前一张、以及下一张（若已分配）都不同色、且与前 3 张撞色最少的最小 variant。前后不同色是硬约束：3 变体两两不同色，至多排除 2 个，必有解。
- **全页同外观的保证**：variant 以 label **首次出现位置**决定，Top Picks 段先于 Grid 段处理，结果存 `Map<lowerLabel, variant>`；Top Picks 卡、Grid 卡、行视图 swatch/色点/展开卡全部经 `variantOf(map,label)` 取同一个号 ⇒ 同名在任何位置渲染出的 `data-brand-look` 签名与 computed style 逐字节相等（verify C5 + UI ④）。
- 已知边界：两张**都已在 Top Picks 定色**的 label 在 Grid 中乱序相邻且恰好同色时无法再改（改任何一张都会破坏全页同外观）。verify D2 随机 1000 组 fixture（Grid 乱序）量化：0/17446 相邻对（Top Picks 相邻已互不同色，第 1/3 张靠 LOOKBACK 软约束也基本错开）。

**C. TLD 胶囊**（`apps/web/src/components/brand-wall.tsx`，新文件；`results-page.tsx` 只删本地 `TopPickCard/GridCard` 并接线，避开 R472 并行改的错误态/恢复条/chips 区域）
- Top Picks 卡下 `RegisterPills`：`.com ✓ .io ✓`，每个胶囊包在既有 `RegisterMenu domain={r.domain}` 里 ⇒ 注册链路（Porkbun/Namecheap/…）与行视图完全同一份逻辑；外层 `h-11`（44px）命中区，内层 32px 视觉胶囊，`aria-label="去注册 {domain}"`。
- Grid 卡 `SelectPills`：`.com ✓ $11.08`，价格用既有 `usePrices()/priceShort()`（首年价，与行视图同字段）；`aria-pressed` 标当前选中，默认第一个 TLD；点击切换后卡片 `data-domain-primary`、锁定/收藏/复制/去注册的 title 与目标域名全部随之变（UI 验证「点 .io 后锁定 title = 锁定… · daysync.io」）。单 TLD 组同样渲染一枚胶囊（承载价格信息，保持卡结构一致）。
- 移动端胶囊 `flex-wrap`，3 枚放不下自动折行（375 无溢出）。

**D. 紧凑行色点** `BrandDot`（`brand-card.tsx`）：12px 圆、`background = palette.bg`（渐变取渐变首色 `brandBackground` 同源）、`aria-hidden`、`data-brand-dot`；只在 `compact` 分支渲染，行高仍 `h-[26px]`；舒适行不变（继续 28px `BrandSwatch`，只是多传 variant）。

**E. i18n**：`brand.tlds / brand.tldCount / brand.tldRegister / brand.tldSelect / brand.tldSelected` zh/en 各 5 条。

**F. 不动的部分**：AI/核验/后端/SSE 零改动；`Row` 类型未变；行视图逐域名一行未变。

## 3. 验收对照表

| 要求 | 结果 | 证据 |
| --- | --- | --- |
| Top Picks 3 席 = 3 个不同 label，同名多 TLD 只占一席 | ✅ | verify B4/B5；UI ②：fixture petwan.com/.io 92-94 分 → Top Picks = petwan, chongsi, tailwag（`r473-top-picks-zh.png`） |
| Top Picks 卡下 TLD 胶囊可点、沿用 row 注册逻辑、44px 触点 | ✅ | `RegisterMenu` 复用；UI 胶囊高度 44（桌面/375 均为 44）；`brand.tldRegister` aria-label |
| Grid 按 label 分组、一名一卡、胶囊列全部 TLD + 首年价 | ✅ | verify B1–B3；UI ①：18 行 → 14 卡，0 重复；daysync 胶囊 `.com $11.08 / .io $28.12 / .dev $8.75`（wrangler dev 拉到 Porkbun 实时价） |
| 收藏/锁定作用于明确域名，默认首 TLD，胶囊可切换 | ✅ | UI「胶囊切换」：默认 `daysync.com`（aria-pressed），点 .io 后 primary/锁定 title 变为 `daysync.io` |
| Row 视图不分组 | ✅ | 紧凑/舒适行仍 `visible.map`，UI 行数 18 = 可注册域名数 |
| 相邻撞色重排：布局层确定性一次遍历 | ✅ | `assignBrandVariants` 单遍；verify C1（R469 场景 petwan/chongsi/tailwag variant 0 同为 palette 0）→ C2/C3 重排后相邻不同色；UI ③：Top Picks palette `0,5,10`，Grid `0,5,10,2,7,5,10,3,8,13,15,4,0,8`，无相邻相等；筛选「全部」后 15 卡仍无相邻相等 |
| `brandLook` 可选 `variant` 0/1/2，同 label 内确定性轮换 | ✅ | verify A1–A4（variant 0 = R468、三变体互不同色、仅换色、大小写不敏感） |
| 同名在 Top Picks 与 Grid 同一外观 + 说明保证方式 | ✅ | §2-B「首次出现位置定 variant + 全页 Map 复用」；verify C4/C5；UI ④：3 个 Top Picks label 的 `data-brand-look` / 背景 / 文字 computed color 与 Grid 同名卡逐字节相等 |
| 紧凑行 12px 圆点、品牌主色、aria-hidden、行高 26 | ✅ | UI ⑤：18/18 行有 `[data-brand-dot]`，12×12，`aria-hidden="true"`，行高集合 `{26}`，色点 rgb = 同名 Grid 卡背景（`r473-rows-compact-zh.png`）；舒适行 diff 仅多传 variant |
| 双语 i18n | ✅ | zh/en 各 5 个 `brand.tld*` key；UI 在 zh/light 与 en/dark 各跑一遍全部 PASS |
| 暗/亮主题对比度 ≥ 4.5 | ✅ | 配色自带 fg/bg，不依赖主题；verify E1 16 组（含渐变两端）min 4.70:1；`r473-grid-en-dark.png` |
| 375px 无溢出 | ✅ | UI：`scrollWidth 375 ≤ 375`，越界元素 `[]`（zh/en 两轮）；胶囊 375 下仍 44px；`r473-375-top-zh.png`、`r473-compare-375.png` |
| 不动 AI/核验/后端/SSE | ✅ | diff 仅 `brand-card.tsx`、`domain-row.tsx`、`results-page.tsx`（仅 Top Picks/Grid/Row 渲染段）、`i18n.tsx` + 新增 `brand-look.ts`、`brand-wall.ts`、`brand-wall.tsx` + scripts/docs |
| 新增 JS ≤ 6KB gzip | ✅ **+1.45KB gzip JS**（+1.57KB 含 CSS） | 基线 cff4aa5 worktree vs 本分支 vite build：results-page 6.29→7.46、domain-row 37.31→37.48、index 99.52→99.63、CSS 8.31→8.39；全部 assets 合计 433.82→435.39 kB gzip |
| 0 次真实 AI 调用 | ✅ | 恢复态走 `sessionStorage dh:lastSearch:v1`（`values.style/lengthPref=""`），未点任何 AI CTA；`/api/usage.days` 前后 `{} → {}` |
| 本地全绿 | ✅ | `verify-r466 / r465 / r463 / r264 / r238` ALL PASS，`verify-r473` ALL PASS（23 项），`pnpm -r typecheck`、`pnpm --filter web build` 通过 |
| wrangler dev + Playwright 序列化卡外观 ①–⑤ | ✅ | `docs/qa/r473-ui-verify.mjs`（CDP 连会话 Chrome，17 项断言，zh/light + en/dark 两轮 ALL PASS） |
| 与 Namelix 卡墙并排截图（桌面 + 375） | ✅ | `screenshots/r473-compare-desktop.png`、`r473-compare-375.png` |
| 不启用 Actions / 不提交密钥 / 不改测试 | ✅ | — |

## 4. 与 Namelix 对照（卡墙层面）

| 维度 | Namelix | R468 | R473 |
| --- | --- | --- | --- |
| 一名一卡 | ✅ | ❌ 一域名一卡（同名 3 TLD 三张） | ✅ 分组 + TLD 胶囊 |
| 相邻不同色 | ✅（人工/服务端） | ❌ 1/16 概率撞，实测 Top Picks 首两张撞 | ✅ 布局层确定性变体，段内相邻 0 撞（两张都已定色的边界 <1%） |
| Top 席位多样性 | n/a | ❌ 同名占 2 席 | ✅ 3 席 3 名 |
| 多 TLD 信息 | ❌ 无 | 三张卡冗余表达 | ✅ 胶囊 + 各自首年价 + 可切换操作对象 |
| 行视图品牌线索 | n/a（无行视图） | 舒适行 swatch，紧凑行无 | ✅ 紧凑行 12px 色点 |
| 一屏外观种类（fixture 15 卡） | 每卡不同 | ~5 种 | 15 卡 14 种 palette 序列（`0,5,10,2,7,5,10,3,8,13,15,4,0,8,11`，仅非相邻重复） |

## 5. 已知限制 / 下一步

- 变体只换色不换版式：同色不相邻但隔一张仍可能同色（LOOKBACK=3 只做软约束）。要进一步接近 Namelix「每卡不同」可扩到 4 变体或让 variant 也轮换版式，但会稀释「同名同外观」的可识别性，本轮不做。
- 两张都在 Top Picks 定色的 label 在 Grid 里被用户重排（按长度/字母序）后相邻同色时无法再改（保同外观优先），fixture 量化 0/17446；若线上观察到，可考虑 Grid 排序变化时把 Top Picks 段也纳入重排（代价：Top Picks 卡会随 Grid 排序换色）。
- 单 TLD 组的 Grid 胶囊是「已选中」态的信息胶囊（承载价格），点击无操作；若体验走查认为多余，可在 `SelectPills` 对 `rows.length === 1` 渲染为非按钮。
- 未做真实用户主观评分复测；建议下一轮按 R469 同口径匿名盲评复核 4.3 → ? 是否收敛到 4.5。
