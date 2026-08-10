# R431 零 AI 全站审计报告（重点 R420–R427 变更面：R427 hreflang / R423 /prices 过滤+回顶 / R415 hub 锚点回归）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（version 5b37b6ea，deploy/r192-r195 tip 5d3806c，含 R420–R427）
- 审计方式：严格零 AI——全程未触碰任何 AI 路径（未点击 AI 猎名提交/示例/refine/再来一轮，未触发 402；切语言/切主题前先 DOM 定位再操作，避免误点首页示例 prompt）；quick-check、批量核验、MCP、分享均为非 AI 通道；未部署、未注册域名、未支付。
- 零 AI 佐证：`/api/usage` 前后 `days` 深比较完全相等（`usage_days_equal: true`，见 `findings-r431-browser.json`）。
- 测试前备份 localStorage/sessionStorage（`storage-r431-pre.json`），测试后逐字节还原并复核（`STORAGE_IDENTICAL`，`storage-r431-post.json`）。
- 脚本与产物：`audit_http_r431.py`（HTTP 侧，含 R427 hreflang 三链抽样 + sitemap xhtml:link 全量核对 + 全量注入扫描）、`audit_browser_r431.py`（浏览器侧，含 R423 /prices 过滤+回顶、R415 hub 锚点回归）、`findings-r431-http.json`、`findings-r431-browser.json`、`screenshots-r431/`、`lh-r431-*.json`、`dump_storage_r431.py` / `restore_storage_r431.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | ① Lighthouse 移动 perf 90–96（/prices 90 / /tld/com 93 / 首页 96，历史区间内采样波动；桌面全 100，a11y/BP/SEO 全 100）；② 17 个 ccTLD/城市 TLD（cn/so/hk/jp/kr/sg + amsterdam/berlin/paris + at/be/ch/es/fr/it/pl/se）Porkbun 实时报价缺失——`/api/prices` 343/360，静态参考价兜底正常展示，MCP `tld_prices` 覆盖全量 360，无用户可见故障（与 R419 报告的同类现象一致）。 |

R427 hreflang、R423 /prices 过滤+回顶、R415 hub 锚点、内容口径、常规面**全部通过**。

## 1. R427 回归面：hreflang 三链 + canonical（重点）✅

### 页面侧（HTTP，20 个 URL × zh/en 共 40 面）
抽样集合：`/` `/tld` `/guide` `/vs` `/prices` `/why` `/advanced` `/mcp` + 各类型内容页 first/mid/last/随机（tld×4、guide×4、vs×4）。每面断言：
- `hreflang="zh"` = 裸路径、`hreflang="en"` = `?lang=en`、`x-default` = 裸路径，恰好 3 条；
- canonical：zh 版 = 裸路径自指、en 版 = `?lang=en` 自指；
- **40 面全部通过**（`hreflang_r427_all_pass: true`，失败集为空）。

### sitemap 侧（全量而非抽样）
- 1120 个 `<url>` 共 3360 条 `xhtml:link`（每 url 恰 zh+en 两条，x-default 不进 sitemap 符合规范可选项）；
- 逐 url 校验 zh href=loc、en href=loc?lang=en：**bad_count = 0**。

## 2. R423 回归面：/prices 即时过滤 + 回到顶部 ✅

- 全量 360 行（`main a[href^="/?tld="]` 计数）；输入 `shop` 即时收敛到 2 行且均含 shop（无需回车，截图 P2）；
- 无命中输入显示「没有匹配」空态（P3）；清空即时恢复 360 行；
- 回到顶部：滚超半屏出现 44×44 按钮，点击回顶（`at_top: true`）且回顶后消失（P4）；
- 键盘：过滤框可编程聚焦（`keyboard_prices_filter_focus.focused: true`）；
- 375px 下过滤同样即时生效（输 `com` → 4 行，截图 K10）。

## 3. R415 回归面：hub 锚点导航 ✅

- 三 hub 水合后 chips 数 = section 数且逐 id 一致（tld 9/9、guide 10/10、vs 336/336、tld-en 9/9），chip 为原生 `<a>` 可聚焦；
- 锚点点击：hash 更新、平滑滚动、标题不被 sticky chips 遮挡（三 hub 均 `nav_bottom 124 < h2_top 128`，`not_clipped: true`）；
- 回到顶部：三 hub 全过（出现 44×44 → 点击回顶 → 消失）；
- 过滤空组隐藏：/tld "berlin" 1=1、/guide "茶" 2=2、/vs "kaufen" 1=1，清空恢复 9/10/336，无命中时 nav 整体消失、sections 0。截图 A1–A4。

## 4. 内容口径 ✅（全部与任务口径一致）

| 口径 | 期望 | 实测 |
|---|---|---|
| sitemap `<loc>` | 1120 | 1120×3 次采样，0 重复（8 核心 + 360 + 356 + 396） |
| /tld hub 去重链接 | 360 | 360；三类 slug 集合与 `scripts/content-counts.json` 逐一相等 |
| /guide hub | 356 | 356 |
| /vs hub | 396 | 396 |
| 快查 All | 361 | 「核验完成：共 361 个，200 个可注册」（360 tld + com.cn；单标签 9 后「查更多后缀 +352」） |
| 首页 chips | +346 | 「+346」在位（截图 B0） |
| footer 三栏 | 360/356/396 | 360/356/396 |
| /llms.txt | 360/356/396 | 360/356/396，且与 sitemap 集合完全一致 |

## 5. 全站常规 ✅

- **注入完整性**：全量 1112 页（tld 360 + guide 356 + vs 396，zh）逐页扫描 `inject_sweep = {total: 1112, ok: 1112, bad: {}}`；en 抽样 9 页全 ok。
- **SSR meta 深抽 24 面**（各类型 first/last + 核心页，zh+en）：status 200 / `<html lang>` zh-CN/en / canonical 自指 / og / hreflang×3 / JSON-LD 全部符合。
- **404**：`/nonexistent-r431` 与三类未知 slug 均真实 HTTP 404 品牌页。
- **MCP 三工具**：`tools/list` = check_domains / tld_prices / suggest_variants；check_domains 对未注册标签返回 available、google.com taken 且带 expiresAt；tld_prices tldCount=360、prices 360 键；suggest_variants 24 个变体。
- **分享链路**：创建 200（带 revokeToken）→ /s/:id 展示两域名 → DELETE 200 → 复取 410（console 中该 410 为预期语义，非缺陷）。
- **advanced 批量**：3 域名识别并核验完成。
- **键盘可达**：首页 Tab 焦点链 10 步全部可见命中（品牌/高级模式/候选清单/GitHub/EN/主题/关闭引导/三 tab）。
- **双主题**：light `rgb(250,250,249)` / dark `rgb(11,12,14)`，切换有效且已还原。
- **375px**：9 类页面 scrollWidth 全部 ≤375（360/375），无横向溢出。
- **/api/usage**：结构正常（days/byTld/fast/refine/aiErrors + cron/indexnow/prices 时间戳）；`pricesLastOk` 晚于 `pricesLastFail`，价格拉取当前健康。
- **console error**：除分享撤销后的预期 410 资源报错外为 0。

## 6. Lighthouse（桌面/移动 × 首页 / /prices / /tld/com）

| 页面 | 桌面 perf | 移动 perf | a11y | BP | SEO |
|---|---|---|---|---|---|
| / | 100 | 96 | 100 | 100 | 100 |
| /prices | 100 | 90 | 100 | 100 | 100 |
| /tld/com | 100 | 93 | 100 | 100 | 100 |

移动 perf 90–96 与既往审计（R419：91–96）同区间，判定为采样波动，记 P3 观察项。

## 7. 分级发现清单

- **P0 / P1 / P2：无。**
- **P3-1** Lighthouse 移动 perf 90–96（/prices 90 最低）；桌面全 100，非阻塞，持续观察。
- **P3-2** 17 个 ccTLD/城市 TLD Porkbun 实时报价缺失（`/api/prices` 343/360：amsterdam/at/be/berlin/ch/cn/es/fr/hk/it/jp/kr/paris/pl/se/sg/so）；页面静态参考价兜底与 MCP `tld_prices`（360）均正常，无用户可见故障。既往 R419 已记录同类（当时 cn/so/城市 TLD），本轮枚举出全量清单供后续接第二价源时参考。
