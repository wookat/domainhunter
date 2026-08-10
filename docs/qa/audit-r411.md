# R411 零 AI 全站审计报告（覆盖 R400–R407 之后全站，重点 R407 性能重构回归面）

- 日期：2026-08-10（UTC）
- 生产站：https://hunt.zalize.com（deploy/r192-r195 tip 4dc4786，含 R400–R407 全部合入面）
- 审计方式：严格零 AI——全程未触碰任何 AI 路径（未点击 AI 猎名提交/示例/refine/再来一轮，未触发 402）；quick-check、批量核验、MCP、分享等均为非 AI 通道；未部署、未注册域名、未支付。
- 零 AI 佐证：`/api/usage` 前后 `days` 深比较完全相等（`usage_days_equal: true`，见 `findings-r411-browser.json`）。
- 测试前备份 localStorage/sessionStorage（`storage-r411-pre.json`），测试后逐字节还原并复核（`STORAGE_IDENTICAL`，`storage-r411-post.json`）。
- 脚本与产物：`audit_http_r411.py`（HTTP 侧含全量注入扫描）、`audit_browser_r411.py`（浏览器侧）、`findings-r411-http.json`、`findings-r411-browser.json`、`template-labels-local-r411.json` / `template-texts-local-r411.json`（本地基线）、`screenshots-r411/`、`lh-r411-*.json`、`dump_storage_r411.py` / `restore_storage_r411.py`。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 1 | Lighthouse 移动 perf 92–93（/ 92、/tld/london 93、/prices 93；桌面全 100、a11y/BP/SEO 全 100）。与 R399（90–99）同量级采样波动，无回归、无用户可见影响。 |

R407 重构（内容页数据随 HTML 注入 + 首页模板文案按需加载）回归面**全部通过**：全量 1022 个内容页注入完整、兜底路径渲染逐字一致、模板 326 项全量与源码逐字相等、水合一致、首页不再加载全量内容 chunk。

## 1. R407 回归面：`__DH_CONTENT__` 注入完整性（全量扫描）✅

- **全量 1022 页**（tld 330 + guide 326 + vs 366，zh）逐页抓取：`inject_sweep = {total: 1022, ok: 1022, bad: {}}`——每页均满足：HTTP 200、注入脚本存在、JSON 可解析、`kind`/`tld|slug` 与 URL 匹配、payload 结构完整（tld：guide.zh/en + relatedGuides + relatedCompares；guide：guideLinks >300；vs：cmp + sideGuides[2] + compareLinks >300）、SSR 骨架存在。
- **en 抽样 9 页**（各类型 first/middle/last，`?lang=en`）：注入全部 ok。
- 长尾 slug 覆盖：各类型按 `scripts/content-counts.json` 顺序含首个（com/saas/com-vs-cn）与最新（london/hearingaid/university-vs-education，即 R404/R405/R406 新页）。

## 2. R407 回归面：注入缺失兜底路径 ✅

- 用 Playwright route 拦截 document 响应、剥掉 `<script>window.__DH_CONTENT__=…</script>` 后加载（模拟异常缓存旧 HTML），三类型各 1 页（/tld/london、/guide/hearingaid、/vs/university-vs-education）：
  - 确认注入脚本被剥离（`ssr_script_stripped: true`）；
  - main.tsx 兜底动态加载 `injected-build` 重建 `window.__DH_CONTENT__`（kind 正确回填）；
  - **兜底渲染 main innerText 与正常加载逐字相等**（`text_equal: true`，8201/3145/7833 字符），截图 F-fallback-*。

## 3. R407 回归面：首页模板 chip / ?tpl= 全量核验 ✅

- 任务书写 332，实际以合入面为准：R405 合并后 `home-template-labels.ts` / `home-template-texts.ts` 均为 **326** 项（320+6），一一对应无缺漏（本地模块导出核验）。
- **全量 326 逐字比较**：动态 import 生产部署的 `home-template-texts-CPFvJbKD.js` chunk，与本地源码 TEMPLATE_TEXTS 逐 slug 深比较——`{missing: [], extra: [], content_diff: [], all_equal: true}`，zh/en 全部逐字一致（等价于全量 ?tpl= 语义核验，因 ?tpl= 预填即读取该表）。
- chips 数量：展开「+316」后 zh/en 均渲染 **326** 个模板 chip（截图 T1-chips-zh/en）。
- chip 点击预填抽样 7 个（R405 新增 6 个 woodworking/soapmaking/modelkit/framing/recordingstudio/hearingaid + saas）：textarea 值与 TEMPLATE_TEXTS 逐字相等（全 true，截图 T2）。
- `?tpl=` URL 预填抽样 3 slug × zh/en（saas/equipmentrental/hearingaid）：全部逐字相等（截图 T3）。
- 性能语义：首页加载后资源清单中**无 injected-build 全量 chunk**（`home_no_injected_build_chunk: true`）。

## 4. R407 回归面：水合一致性 ✅

- 6 页（各类型 first + last）：水合后 `document.title` 与 SSR title 一致、h1 与标题一致、main 渲染非空（3145–8373 字符）、`window.__DH_CONTENT__` 存在（截图 E-hydration-*）。
- console：全站遍历 0 个应用 JS 错误（仅 /s/:id 撤销后 410 的资源加载状态 noise，为预期 HTTP 语义）。

## 5. 全站常规 ✅

- **sitemap/计数自洽**：`<loc>` 三次 `?cb=` 采样均 **1030** = 8 核心 + 330 tld + 326 guide + 366 vs，0 重复；三类 slug 集合与 `scripts/content-counts.json` 逐一相等；llms.txt 330/326/366 且与 sitemap 集合完全一致；hub 页去重链接 330/326/366；footer 三栏 330/326/366；robots.txt 正常（Sitemap + GPTBot allow）。
- **SSR meta 深抽 22 URL**（各类型 first/last + R404/405/406 新页 + 核心页，zh+en）：status/`<html lang>`/canonical（zh 无参、en `?lang=en` 自指）/og/hreflang/JSON-LD（tld：Breadcrumb+FAQ；guide/vs：Breadcrumb+Article+FAQ）全部符合，0 异常。
- **404**：`/nonexistent-r411`、三类未知 slug 均真实 HTTP 404 品牌页。
- **quick-check**：裸标签 `qzxvkw9r411x689` 9 变体全部完成（截图 B1）；「查更多后缀 +322」All：**核验完成：共 331 个 = 330 + 1（com.cn），200 个可注册**，pending 0（截图 B2）——R404 新 TLD 批次自动覆盖，口径正确；同输入重复核验不卡 pending（截图 B3）。
- **/prices**：表 **330 行**；`/api/prices` `stale: null`、`tldCount: 328`（= 330 − cn/so 两个 Porkbun 不报价 TLD，按设计）；MCP `tld_prices` tldCount 330（静态参考价补齐）。
- **MCP 三工具**：tools/list = check_domains / tld_prices / suggest_variants；check_domains（随机新标签 available；google.com taken，expiresAt 2028-09-14）；suggest_variants(name) 返回 24 变体。
- **shortlist/monitors/advanced/why/mcp**：全部 HTTP 200 正常渲染（截图 G3–G7）。
- **/advanced 批量核验**：粘贴 3 域名 → 识别 3、可注册 2（含首年价 $28.12/$11.08）、google.com 已注册显示 2028-09-14 到期（截图 G8；脚本 done 文案选择器未匹配 /advanced 的完成态文案导致 findings 里 `advanced_bulk: null`，以截图为准，功能正常）。
- **分享链路**：`POST /api/share` 200 + revokeToken → `/s/:id` 双域名正常展示（截图 H1）→ DELETE 200 → 再读 **410**，语义正确。
- **375px**：9 页 scrollWidth 全部 ≤375（375/360，截图 K1–K9），无横向溢出。
- **键盘可用性**：首页 Tab 焦点链前 10 个元素全部可见可聚焦（品牌→高级模式→候选清单→GitHub 链接→EN→主题→关闭引导→三个模式 tab），顺序合理（截图 K0）。

## 6. AI 降级 UX（仅静态检查，未触发 402）✅

- 源码层：`error.ai.quota` / `rateLimit` / `upstream` / `network` / 兜底 5 类错误 key zh/en 双语齐全（i18n.tsx）；R400 已改为存 errorKey 实时重译（App.tsx 以 `error.key` + `t()` 渲染，修复 R399 P3-①）；quota 时 `markAiQuotaDown()` 置 sessionStorage `dh:aiQuotaDown:v1`；fallback 引导 5 入口（精确核验/批量核验/tld/guide/vs hub）齐全；quota 类不展示重试 CTA。
- 线上静态面：无 sessionStorage 标记时首页**不**显示 amber 横幅（`ai_banner_absent_by_default: true`）。

## 7. Lighthouse（桌面 + 移动）

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 92/100/100/100 | 100/100/100/100 |
| /tld/london | 93/100/100/100 | 100/100/100/100 |
| /prices | 93/100/100/100 | 100/100/100/100 |

- 桌面全 100；a11y/BP/SEO 全 100；移动 perf 92–93 与 R399（90–99）同量级 → P3-①，无回归（R407 重构后内容页移动 perf 由历史 90 升至 93）。

## P0/P1/P2/P3 明细

- **P3-① Lighthouse 移动 perf 92–93**：/ 92、/tld/london 93、/prices 93。历史区间 89–99 内的常规采样波动，桌面全 100，无用户可见影响。复现：`npx lighthouse https://hunt.zalize.com/ --chrome-flags="--headless=new --no-sandbox" --only-categories=performance`。

无 P0/P1/P2。R407 重构未引入任何回归。
