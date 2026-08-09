# R324 零 AI 全站审计（覆盖 R319–R322 之后的全站）

- 日期：2026-08-09（UTC）
- 生产站：https://hunt.zalize.com（Worker version `0eba29bd-95d2-449d-bd89-1f44b507f8df`，deploy tip `cf27eaa`）
- 约束：严格 0 AI——全程未触发「开始猎取」「再来一轮」、refine、任何 AI CTA；quick-check 仅做精确核验。`/api/usage` 前后逐字节相等（见 `findings-r324.json` 中 `usage_pre`/`usage_post`，`usage_equal: true`）。未部署，未注册域名。
- 脚本与证据：`audit_browser_r324.py` / `audit_browser_r324b.py`、`findings-r324.json` / `findings-r324b.json`、`screenshots-r324/`、`lighthouse-r324/`、`storage-r324-backup.json` / `storage-r324-final.json`。

## 结论

**P0：0 · P1：0 · P2：0 · P3：2**。全站健康，无版本回退迹象。

## 1. 内容基线 — PASS

| 项 | 期望 | 实测 |
|---|---|---|
| sitemap `<loc>`（`?cb=` 缓存穿透 ×4 次采样） | 670 | 670 / 670 / 670 / 670 |
| sitemap 细分 | 8+210+212+240 | 8 核心页 + /tld 210 + /guide 212 + /vs 240 |
| /tld hub 去重链接（SSR + 浏览器） | 210 | 210 |
| /guide hub | 212 | 212 |
| /vs hub | 240 | 240 |
| footer hub 链接（/tld//guide//vs） | 210/212/240 | 210/212/240 |
| llms.txt 链接数 | 210/212/240 | 210/212/240 |
| hub 标题计数 | — | 「210 个后缀」「212 个行业」「240 组 TLD」均正确 |

## 2. R321 新 TLD / R322 新指南抽查 — PASS

6 个新 TLD（credit/loans/investments/holdings/mortgage/computer）：
- 中文（`/tld/:slug`）与英文（`?lang=en`）均 SSR 全文渲染、FAQ `<details>` 展开、`FAQPage` JSON-LD 存在、title/canonical/hreflang 正确。
- `/en/tld/:slug` 路径 404 属预期（英文经 `?lang=en`，hreflang 亦如此声明）。
- 页面静态参考价与 `types.ts` `TLD_PRICES` 及 /prices 行逐值一致：credit ¥48/597、loans ¥78/671、investments ¥59/745、holdings ¥374/374、mortgage ¥59/360、computer ¥130/226。

6 篇新指南（shortvideo/audiobook/postproduction/animation/documentary/newsmedia）：中英文双语正文完整（106–110 KB SSR HTML）、JSON-LD 存在、标题语义正确。

## 3. /prices 与 quick-check — PASS

- 行数：中文 210、英文 210（`main a[href^="/?tld="]` 计数）。
- 默认按注册价升序排序正确；点「后缀」列头后按字母排序正确。
- 实时价 58 行（Porkbun live），CNY=round(USD×7.2) 全部吻合（0 mismatch）；其余 152 行为 ≈ 静态参考价（CNY 口径）。
- quick-check 单域名：`核验完成：共 9 个，9 个可注册`；「查更多后缀」All：**共 211 个**（210 TLD + com.cn），200 可注册（registered/unknown 细分随 RDAP 波动，仅硬断言总数 211 ✓）。

## 4. SEO — PASS

- 随机 6 内容页（/tld/audio、/tld/gold、/guide/vending、/guide/animation、/vs/press-vs-news、/vs/audio-vs-fm）：title、canonical、og:title、JSON-LD、`lang="zh-CN"` 全部正确。
- robots.txt：Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + Sitemap 指向正确。
- llms.txt 结构完整（核心页 + 三类内容全量链接）。

## 5. Lighthouse（生产，headless）— PASS

| 页面 | 移动 perf | 桌面 perf | A11y | BP | SEO |
|---|---|---|---|---|---|
| / | 93 | 100 | 100 | 100 | 100 |
| /tld | 89 | 100 | 100 | 100 | 100 |
| /guide | 90 | 100 | 100 | 100 | 100 |
| /vs | 89 | 100 | 100 | 100 | 100 |
| /prices | 91 | 100 | 100 | 100 | 100 |

全部移动 perf ≥85，无 P2。

## 6. UX — PASS

- 375px：/、/prices、/tld/credit、/vs、/guide/shortvideo `scrollWidth` 360–375，无横向溢出。
- light/dark：header「Toggle light/dark」切换 `html.light` 类 + `domainhunter:theme` 持久化，reload 后保持，往返切换正常。
- 键盘可达性：Tab 顺序 logo → Advanced → Shortlist → 链接 → 语言 → 主题 → 引导关闭 → AI naming，焦点 outline 可见。
- 404：未知顶级路径与未知 /tld slug 均真实 HTTP 404 + 品牌化页面。
- /mcp 文档页 GET 200，正常渲染；MCP JSON-RPC `tools/list` 返回 3 工具，`tld_prices` `tldCount=210`、prices 210 键。

## 7. storage / usage / console — PASS

- localStorage 备份（`domainhunter:theme`/`shortlist`/`lang`）→ 审计 → 恢复，逐键 diff `STORAGE_IDENTICAL`。
- `/api/usage` 前后 days dict 逐字节相等（审计期间 0 AI 调用；当日既有 `aiErrors.quota: 4` 为审计前 DeepSeek 402 残留计数，非本轮产生）。
- console：除对**故意访问**的 404/410 资源（/nonexistent-r324、已撤销 /s/:id）的 `Failed to load resource` 外，0 应用错误、0 pageerror。

## 8. 分享链路 — PASS

- POST /api/share → 200 + id + revokeToken（token 已 redact，不落盘）。
- /s/:id 渲染两条域名 + Copy/Export CSV + 价格；
- DELETE /api/share/:id（带 token）→ 200；随后 GET /api/share/:id → **410**；/s/:id 显示「已失效」品牌页；两次创建的分享均已撤销，无残留。

## 发现清单

| 级别 | 发现 | 说明 |
|---|---|---|
| P3 | 首个分享页 DOM 中域名文本分散在多层元素，`childElementCount===0` 选择器计不到 | 仅审计脚本选择器问题，页面渲染正常（r324b 以 innerText 复核 PASS） |
| P3 | 故意访问的 404/410 资源在 console 产生 `Failed to load resource` 噪音 | 浏览器固有行为，非应用缺陷 |
