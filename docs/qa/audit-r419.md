# R419 零 AI 全站审计报告（重点 R415 hub 锚点导航回归面，覆盖 R412–R415 合入后全站）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（deploy/r192-r195 tip 1e64389，含 R412 tld 336→342 / R413 guide 332→338 / R414 vs 372→378 / R415 hub 锚点导航）
- 审计方式：严格零 AI——全程未触碰任何 AI 路径（未点击 AI 猎名提交/示例/refine/再来一轮，未触发 402；切语言/切主题前先截图定位再点击，避免布局位移误点示例 prompt）；quick-check、批量核验、MCP、分享均为非 AI 通道；未部署、未注册域名、未支付。
- 零 AI 佐证：`/api/usage` 前后 `days` 深比较完全相等（`usage_days_equal: true`，见 `findings-r419-browser.json`）。
- 测试前备份 localStorage/sessionStorage（`storage-r419-pre.json`），测试后逐字节还原并复核（`STORAGE_IDENTICAL`，`storage-r419-post.json`）。
- 脚本与产物：`audit_http_r419.py`（HTTP 侧，含 R415 SSR 锚点一致性 + 全量注入扫描）、`audit_browser_r419.py`（浏览器侧，含 R415 水合侧回归）、`findings-r419-http.json`、`findings-r419-browser.json`、`screenshots-r419/`、`lh-r419-*.json`、`dump_storage_r419.py` / `restore_storage_r419.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | ① Lighthouse 移动 perf 91–96（历史区间内采样波动，桌面 99–100，a11y/BP/SEO 全 100）；② R412 新增城市 TLD（amsterdam/berlin/paris）Porkbun 实时报价缺失，与既有 cn/so 同类——静态参考价兜底与 MCP `tld_prices`（342）均正常，无用户可见故障。 |

R415 hub 锚点导航回归面**全部通过**（SSR + 水合双侧、三 hub × 双语、桌面 + 375px）；R411 报告的 P1（基线分支 gen-hub-index --check 必挂）已在当前基线修复（本地复跑 exit 0，`tld 342 / guide 338 / vs 378` 一致）。

## 1. R415 回归面：hub 锚点导航（重点）✅

### SSR 侧（HTTP，三 hub × zh/en 共 6 面）
- `nav[aria-label="分组导航"/"Group navigation"]` 均存在，`sticky top-14` 类在位；
- chips `href="#hub-g-*"` 集合与 `<section id="hub-g-*">` 集合**逐 id 顺序一致**（`chips_eq_sections: true`）；
- chips 计数与各组 h2 计数逐组相等，且总和 = 口径：/tld 9 组=342、/guide 10 组=338、/vs 319 组=378；
- 全部 section 带 `scroll-mt-32`（R415 修复 00eeae6 的偏移类，`scroll_mt_32_all: true`）。

### 水合侧（浏览器，三 hub，zh 全走查 + /tld en 抽查）
- 水合后 chips 数 = section 数且 id 一致（tld 9/9、guide 10/10、vs 319/319、tld-en 9/9），chip 为原生 `<a>` 可聚焦（`keyboard_hub_chip_focus.focused: true`）；
- **锚点点击**：中间组 chip 点击后平滑滚动、`location.hash` 更新为 `#hub-g-*`；标题不被 sticky chips 遮挡——三 hub 均 `nav_bottom 124 < h2_top 128`（`not_clipped: true`，scroll-mt-32 偏移足够，含 chips 横向滚动条情形）；**375px 下同样不遮挡**（`mobile_anchor_jump.not_clipped: true`，截图 K10）；
- **回到顶部**：滚超半屏后按钮出现（44×44 触点），点击回顶（`at_top: true`）且回顶后按钮消失（`hidden_after_top: true`），三 hub 全过（截图 A3-*）；
- **过滤空组隐藏**：/tld 输 "berlin" → chips 1 = sections 1；/guide 输 "茶" → 2 = 2；/vs 输 "kaufen" → 1 = 1（chips 与 section 同步隐藏，`equal: true`）；清空后完整恢复（9/10/319）；**无命中时整个 nav 消失**、sections 0（`no_match.nav_gone: true`，与 `items.length===0 → null` 语义一致）。截图 A1–A4。

## 2. 全站常规 ✅

- **sitemap/计数自洽**：`<loc>` 三次 `?cb=` 采样均 **1066** = 8 核心 + 342 tld + 338 guide + 378 vs，0 重复；三类 slug 集合与 `scripts/content-counts.json` 逐一相等；llms.txt 342/338/378 且与 sitemap 集合完全一致；hub 页去重链接 342/338/378；footer 三栏 342/338/378；robots.txt 正常（Sitemap + GPTBot allow）。**全部与任务口径一致**。
- **内容页注入完整性**：全量 1058 页（tld 342 + guide 338 + vs 378，zh）逐页扫描 `inject_sweep = {total: 1058, ok: 1058, bad: {}}`；en 抽样 9 页（各类型 first/middle/last）全 ok。
- **SSR meta 深抽 26 面**（各类型 first/last + R412/413/414 新页 tienda/teaware/abogado-vs-lawyer + 核心页，zh+en）：status 200 / `<html lang>`（zh-CN/en）/ canonical（zh 无参、en `?lang=en` 自指）/ og / hreflang×3 / JSON-LD（tld：Breadcrumb+FAQ；guide/vs：Breadcrumb+Article+FAQ）全部符合，0 异常。
- **404**：`/nonexistent-r419`、三类未知 slug 均真实 HTTP 404 品牌页。
- **quick-check**：裸标签 9 变体全部完成（截图 B1）；「查更多后缀 +334」All：**核验完成：共 343 个 = 342 + 1（com.cn），200 个可注册**，pending 0（截图 B2）——与任务口径 343 一致，R412 新 TLD 批次自动覆盖；同输入重复核验不卡 pending（截图 B3）。
- **/prices**：表 **342 行**（口径一致）；`/api/prices` `stale: null`、`tldCount: 337`（= 342 − cn/so/amsterdam/berlin/paris 五个 Porkbun 不报价 TLD，见 P3-②）；MCP `tld_prices` tldCount **342**（静态参考价补齐）。
- **MCP 三工具**：tools/list = check_domains / tld_prices / suggest_variants；check_domains（随机新标签 available；google.com taken，expiresAt 2028-09-14）；suggest_variants 返回 24 变体。
- **shortlist/monitors/advanced/why/mcp**：全部 HTTP 200 正常渲染（截图 G3–G7）。
- **/advanced 批量核验**：粘贴 3 域名 → 识别 3、可注册 2（.io 显示首年价 $28.12 + Register）、google.com Taken（expires 2028-09-14）（截图 G8）。
- **分享链路**：`POST /api/share` 200 + revokeToken → `/s/:id` 双域名正常展示（截图 H1）→ DELETE 200 → 再读 **410**，语义正确。
- **375px**：9 页（含三 hub）scrollWidth 全部 ≤375（375/360，截图 K1–K9），锚点 nav 横向滚动无溢出。
- **键盘可用性**：首页 Tab 焦点链前 10 个元素全部可见可聚焦（品牌→高级模式→候选清单→GitHub→EN→主题→关闭引导→三个模式 tab），顺序合理（截图 K0）；hub 锚点 chip 可聚焦。
- **双主题**：light（bg `rgb(250,250,249)`）/ dark(`rgb(11,12,14)`) 切换正常、界面无破版（截图 J-theme-*），测试后还原原主题。
- **console**：全程仅 1 条预期 noise（分享撤销后 `/api/share/:id` 410 的资源加载状态），0 应用 JS 错误。
- **AI 降级静态面**：无 sessionStorage 标记时首页不显示 amber 横幅（`ai_banner_absent_by_default: true`，未触发 402）。

## 3. R411 遗留 P1 复核 ✅

- R411 P1-①（基线分支 `gen-hub-index --check` 必挂）：在当前基线 1e64389 上本地复跑 `node scripts/gen-hub-index.mjs --check` → **exit 0**（`hub-index-*.ts 与内容源一致（tld 342 / guide 338 / vs 378）`），已修复，CI 门槛恢复。

## 4. Lighthouse

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 96/100/100/100 | 100/100/100/100 |
| /tld/com | 92/100/100/100 | 99/100/100/100 |
| /tld（hub，含锚点 nav） | 91/100/100/100 | — |

- a11y/BP/SEO 全 100；移动 perf 91–96 与 R411（92–93）同量级采样波动 → P3-①；R415 的 sticky nav 未引入 CLS/a11y 退化（/tld hub a11y 100）。

## P0/P1/P2/P3 明细

- **P3-① Lighthouse 移动 perf 91–96**：/ 96、/tld/com 92、/tld 91。历史区间 89–99 内常规波动，桌面 99–100，无用户可见影响。复现：`npx lighthouse https://hunt.zalize.com/tld --chrome-flags="--headless=new --no-sandbox"`。
- **P3-② R412 新城市 TLD 无 Porkbun 实时报价**：`/api/prices` `prices` 缺 amsterdam/berlin/paris（加既有 cn/so 共 5 个，tldCount 337/342）。TLD 详情页正确回落静态参考价（「静态参考价：首年 ¥280/¥300 · 非实时报价」），/prices 表仍 342 行、MCP `tld_prices` 342 全量，属上游注册商不报价的已知形态，无需修复；如希望 `/api/prices` 口径齐 342 可评估静态价并入接口（非必要）。

无 P0/P1/P2。R415 hub 锚点导航（锚点/回顶/过滤空组隐藏/SSR-水合一致性/移动端偏移）全绿；本轮未做代码修改，PR 仅含审计报告与脚本产物。
