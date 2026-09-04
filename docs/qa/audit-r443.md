# R443 零 AI 全站审计报告（重点 R432–R439 变更面：R435/R439 相关互链 / R427 hreflang 回归 / R423 /prices 过滤+回顶 / R415 hub 锚点）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（version bbc955b1，deploy/r192-r195 tip d006843，含 R432–R439）
- 审计方式：严格零 AI——全程未触碰任何 AI 路径（未点击 AI 猎名提交/示例/refine/再来一轮，未触发 402；切语言/切主题前先 DOM 定位再操作，避免误点首页示例 prompt）；quick-check、批量核验、MCP、分享均为非 AI 通道；未部署、未注册域名、未支付。
- 零 AI 佐证：`/api/usage` 前后 `days` 深比较完全相等（`usage_days_equal: true`，见 `findings-r443-browser.json`）。
- 测试前备份 localStorage/sessionStorage（`storage-r443-pre.json`），测试后逐字节还原并复核（`STORAGE_IDENTICAL`，`storage-r443-post.json`）。
- 脚本与产物：`audit_http_r443.py`（HTTP 侧：hreflang 三链抽样 + sitemap xhtml:link 全量核对 + R435/R439 相关互链 SSR 抽样 + 全量注入扫描）、`audit_browser_r443.py`（浏览器侧：相关互链 SSR/水合一致、/prices 过滤+回顶、hub 锚点回归）、`recheck_related_r443.py`（两页竞态复核）、`findings-r443-http.json`、`findings-r443-browser.json`、`findings-r443-related-recheck.json`、`screenshots-r443/`（43 张）、`lh-r443-*.json`、`dump_storage_r443.py` / `restore_storage_r443.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | ① Lighthouse 移动 perf 87–91（首页 87 / /tld/com 88 / /prices 91；桌面 99–100，a11y/BP/SEO 全 100），较 R431（90–96）略低，判定为采样波动+内容量增长（+54 页），持续观察；② 31 个 ccTLD/城市 TLD Porkbun 实时报价缺失（`/api/prices` 347/378），静态参考价兜底正常展示、MCP `tld_prices` 覆盖全量 378，无用户可见故障（R431 为 17 个缺失，本轮新增 TLD 多为 ccTLD 使缺失面扩大，等第二价源接入）。 |

R435/R439 相关互链、R427 hreflang、R423 /prices 过滤+回顶、R415 hub 锚点、内容口径、常规面**全部通过**。

## 1. R435/R439 变更面：相关互链模块（重点）✅

### SSR 侧（HTTP，30 面 = 各类型 first/mid/last/随机×2 × zh/en）
逐 section 断言（`related_r435_r439`，`related_all_pass: true`，失败集为空）：
- /tld：相关 TLD ≤6、相关后缀对比 ≤6、相关行业命名指南（guidesForTld 派生）；
- /guide：相关行业指南 ≤6、相关后缀对比 ≤4；
- /vs：相关对比 ≤6、相关行业命名指南 ≤4；
- 每个出现的 section：链接数 >0（无「标题存在但 0 链接」的空壳）、href 前缀正确（/tld//guide//vs/）、不自链。

### 水合一致（浏览器，6 页抽样：/tld/com /tld/ai /guide/saas /guide/coffee /vs/com-vs-cn /vs/io-vs-ai）
- SSR 与水合后 DOM 逐 section 链接集合（含顺序）完全一致；首测 /guide/coffee 与 /vs/com-vs-cn 两页因 domcontentloaded 时刻快照过早出现 null（采样竞态，非站点缺陷），以原始 SSR HTML 对照复核后 6 页 12 个 section **全部 equal**（`findings-r443-related-recheck.json` `all_equal: true`）。
- 无匹配隐藏：SSR 模板按「列表为空则整个 section 不渲染」实现（ssr-html.ts chipRow 条件渲染），抽样 30 面未见空壳 section，符合「无匹配隐藏」契约。截图 R1。

## 2. R427 回归面：hreflang 三链 + canonical ✅

### 页面侧（HTTP，20 个 URL × zh/en 共 40 面）
抽样集合：`/` `/tld` `/guide` `/vs` `/prices` `/why` `/advanced` `/mcp` + 各类型内容页 first/mid/last/随机（tld×4、guide×4、vs×4）。每面断言：
- `hreflang="zh"` = 裸路径、`hreflang="en"` = `?lang=en`、`x-default` = 裸路径，恰好 3 条；
- canonical：zh 版 = 裸路径自指、en 版 = `?lang=en` 自指；
- **40 面全部通过**（`hreflang_r427_all_pass: true`，失败集为空）。

### sitemap 侧（全量）
- 1174 个 `<url>` 共 3522 条 `xhtml:link`（每 url 恰 zh+en 两条）；
- 逐 url 校验 zh href=loc、en href=loc?lang=en：**bad_count = 0**。

## 3. R423 回归面：/prices 即时过滤 + 回到顶部 ✅

- 全量 378 行（`main a[href^="/?tld="]` 计数）；输入 `shop` 即时收敛到 2 行且均含 shop（截图 P2）；
- 无命中显示「没有匹配」空态（P3）；清空即时恢复 378 行；
- 回到顶部：滚超半屏出现 44×44 按钮，点击回顶（`at_top: true`）且回顶后消失（P4）；
- 键盘：过滤框可编程聚焦（`focused: true`）；
- 375px 下过滤即时生效（输 `com` → 4 行，截图 K10）。

## 4. R415 回归面：hub 锚点导航 ✅

- 三 hub 水合后 chips 数 = section 数且逐 id 一致（tld 9/9、guide 10/10、vs 352/352、tld-en 9/9），chip 为原生 `<a>` 可聚焦；
- 锚点点击：hash 更新、平滑滚动、标题不被 sticky chips 遮挡（三 hub 均 `nav_bottom 124 < h2_top 128`，`not_clipped: true`）；
- 回到顶部：三 hub 全过（出现 44×44 → 点击回顶 → 消失）；
- 过滤空组隐藏：/tld "berlin" 1=1、/guide "茶" 2=2、/vs "kaufen" 1=1，清空恢复 9/10/352，无命中时 nav 整体消失、sections 0。截图 A1–A4。

## 5. 内容口径 ✅（全部与任务口径一致）

| 口径 | 期望 | 实测 |
|---|---|---|
| sitemap `<loc>` | 1174 | 1174×3 次采样，0 重复（8 核心 + 378 + 374 + 414） |
| /tld hub 去重链接 | 378 | 378；三类 slug 集合与 `scripts/content-counts.json` 逐一相等 |
| /guide hub | 374 | 374 |
| /vs hub | 414 | 414 |
| 快查 All | 379 | 「核验完成：共 379 个，197 个可注册」（378 tld + com.cn；单标签 9 后「查更多后缀 +370」） |
| 首页 chips | +364 | 「+364」在位（截图 B0） |
| footer 三栏 | 378/374/414 | 378/374/414 |
| /llms.txt | 378/374/414 | 378/374/414，且与 sitemap 集合完全一致 |

## 6. 全站常规 ✅

- **注入完整性**：全量 1166 页（tld 378 + guide 374 + vs 414，zh）逐页扫描 `inject_sweep = {total: 1166, ok: 1166, bad: {}}`；en 抽样 9 页全 ok。
- **SSR meta 深抽 24 面**（各类型 first/last + 核心页，zh+en）：status 200 / `<html lang>` / canonical 自指 / og / hreflang×3 / JSON-LD 全部符合。
- **404**：`/nonexistent-r443` 与三类未知 slug 均真实 HTTP 404 品牌页。
- **MCP 三工具**：`tools/list` = check_domains / tld_prices / suggest_variants；check_domains 对未注册标签返回 available、google.com taken 且带 expiresAt（2028-09-14）；tld_prices tldCount=378、prices 378 键；suggest_variants 24 个变体。
- **分享链路**：创建 200（带 revokeToken）→ /s/:id 展示两域名 → DELETE 200 → 复取 410（console 中该 410 为预期语义，非缺陷）。
- **advanced 批量**：3 域名识别并核验完成。
- **键盘可达**：首页 Tab 焦点链 10 步全部可见命中（品牌/高级模式/候选清单/GitHub/EN/主题/关闭引导/三 tab）。
- **双主题**：light `rgb(250,250,249)` / dark `rgb(11,12,14)`，切换有效且已还原。
- **375px**：9 类页面 scrollWidth 全部 ≤375（360/375），无横向溢出。
- **/api/usage**：结构正常（days/byTld/fast/refine/aiErrors + cronLast/indexnowLast/pricesLastOk/pricesLastFail）；`pricesLastOk`（23:39Z）晚于 `pricesLastFail`，价格拉取当前健康。
- **console error**：除分享撤销后的预期 410 资源报错外为 0。

## 7. Lighthouse（桌面/移动 × 首页 / /prices / /tld/com）

| 页面 | 桌面 perf | 移动 perf | a11y | BP | SEO |
|---|---|---|---|---|---|
| / | 100 | 87 | 100 | 100 | 100 |
| /prices | 100 | 91 | 100 | 100 | 100 |
| /tld/com | 99 | 88 | 100 | 100 | 100 |

移动 perf 87–91 略低于 R431（90–96），与内容量增长（1120→1174 页、hub/chips 变大）及采样波动一致，记 P3 观察项；桌面 99–100。

## 8. 分级发现清单

- **P0 / P1 / P2：无。**
- **P3-1** Lighthouse 移动 perf 87–91（首页 87 最低，R431 同页 96）；桌面 99–100，非阻塞，建议下轮复采并关注首页移动 LCP。
- **P3-2** 31 个 ccTLD/城市 TLD Porkbun 实时报价缺失（`/api/prices` 347/378：ae/amsterdam/at/be/berlin/br/ch/cl/cn/cz/dk/es/fi/fr/gr/hk/hu/ie/it/jp/kr/no/paris/pl/pt/ro/se/sg/so/tr/vn）；页面静态参考价兜底与 MCP `tld_prices`（378）均正常，无用户可见故障。较 R431（17 个）扩大，系 R432–R439 新增 TLD 多为 ccTLD 所致，建议接第二价源时优先覆盖 ccTLD。
