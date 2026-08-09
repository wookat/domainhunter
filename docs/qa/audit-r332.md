# R332 零 AI 全站审计（覆盖 R327–R330 之后的全站）

- 日期：2026-08-09（UTC）
- 生产站：https://hunt.zalize.com（Worker version `42b2aae6-2ae7-46ea-b067-069bb6a2823b`，deploy tip `26a663d`）
- 约束：严格 0 AI——全程未触发「开始猎取」「再来一轮」、refine、任何 AI CTA；quick-check 仅做精确核验；home 模板按钮仅验证预填未提交。`/api/usage` 前后 days dict 逐字节相等（`findings-r332.json` `usage_equal: true`，`usage-r332-pre.json` / `usage-r332-post.json` days_equal: true）。未部署，未注册域名，未支付。
- 脚本与证据：`audit_browser_r332.py` / `audit_browser_r332b.py`、`findings-r332.json` / `findings-r332b.json`、`screenshots-r332/`、`lighthouse-r332/`、`storage-r332-backup.json` / `storage-r332-final.json`。

## 结论

**P0：0 · P1：0 · P2：0 · P3：2**。全站健康，无版本回退迹象。

## 1. 内容基线 — PASS

| 项 | 期望 | 实测 |
|---|---|---|
| sitemap `<loc>`（`?cb=` 缓存穿透 ×3 次采样） | 706 | 706 / 706 / 706 |
| sitemap 细分 | 8+222+224+252 | 8 核心页 + /tld 222(+hub) + /guide 224(+hub) + /vs 252(+hub)，与公式自洽 |
| /tld hub 去重链接（浏览器） | 222 | 222 |
| /guide hub | 224 | 224 |
| /vs hub | 252 | 252 |
| footer hub 链接（/tld//guide//vs 去重） | 222/224/252 | 222/224/252 |
| llms.txt 链接 | 222/224/252 | 222/224/252（含「222 TLDs」文案） |
| `scripts/content-counts.json` | 222/224/252 | 一致 |

## 2. R329 新 TLD / R330 新指南 / R327 新对比页抽查 — PASS

6 个新 TLD（church/jewelry/cleaning/plumbing/catering/florist）：
- 中文（`/tld/:slug`）与英文（`?lang=en`）SSR 全文渲染（119–121 KB）、`FAQPage` JSON-LD、title/canonical/hreflang（zh-CN / en / x-default）正确。
- 页面静态参考价与 `types.ts` `TLD_PRICES` 及 /prices 行逐值一致：church ¥48/337、jewelry ¥78/374、cleaning ¥434/434、plumbing ¥59/419、catering ¥226/226、florist ¥59/189（`prices_new_tld_static.match: true`）。

6 篇新指南（deli/winery/sushi/icecream/hostel/bowling）：中英文双语正文完整（108–111 KB SSR HTML）、FAQ、Article+FAQPage JSON-LD、标题语义正确。

R327 6 组新对比页（lawyer-vs-legal / vet-vs-pet / delivery-vs-express / recipes-vs-menu / rent-vs-rentals / legal-vs-law）：中英双语完整（112–114 KB）、FAQ、JSON-LD、title/canonical/og 正确。

## 3. /prices 与 quick-check — PASS

- 行数：中文 222、英文 222（`main a[href^="/?tld="]` 计数），与 /tld 计数一致。
- 默认按注册价升序排序正确；点「后缀」列头后按字母排序正确。
- 实时价 58 行（Porkbun live），CNY=round(USD×7.2) 全部吻合（0 mismatch）；其余 164 行为 ≈ 静态参考价（CNY 口径）。
- quick-check 单域名：`核验完成：共 9 个，9 个可注册`；「查更多后缀」All：**共 223 个**（222 TLD + com.cn），209 可注册（registered/unknown 细分随 RDAP 波动，仅硬断言总数 223 ✓）。

## 4. home 新 TEMPLATES（R330）— PASS

- 展开「+N」后 6 个新模板 chips 全部渲染：卤味熟食 / 精品酒庄 / 日料餐厅 / 冰淇淋品牌 / 青年旅舍 / 保龄球馆。
- 点击 chip 仅预填 textarea（「一个卤味熟食品牌，寓意…」），未提交任何 AI 请求。
- `/?tpl=<slug>` 预填中英文均正确（6/6，中文与英文文案分别验证）。
- 375px 首页（模板全展开）`scrollWidth` 375，无溢出。

## 5. SEO — PASS

- 抽查 6 内容页（/tld/church、/tld/plumbing、/guide/winery、/guide/hostel、/vs/lawyer-vs-legal、/vs/rent-vs-rentals）：title、canonical、og:title、BreadcrumbList(+Article)+FAQPage JSON-LD、`lang="zh-CN"`、hreflang 三元组全部正确。
- robots.txt：Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + Sitemap 指向正确。
- llms.txt 结构完整（核心页 + 三类内容全量链接，计数与 sitemap 自洽）。

## 6. Lighthouse（生产，headless）— PASS

| 页面 | 移动 perf | 桌面 perf | A11y | BP | SEO |
|---|---|---|---|---|---|
| / | 91 | 100 | 100 | 100 | 100 |
| /tld | 89 | 100 | 100 | 100 | 100 |
| /guide | 89 | 100 | 100 | 100 | 100 |
| /vs | 90 | 100 | 100 | 100 | 100 |
| /prices | 89 | 99 | 100 | 100 | 100 |

全部移动 perf ≥85，无 P2。R328 遗留的 /guide 移动 BP 96（CSP inspector-issue）已消失，本轮 BP 全 100。

## 7. UX — PASS

- 375px：/、/prices、/tld/church、/vs、/guide/deli `scrollWidth` 360–375，无横向溢出。
- light/dark：主题按钮切换 bg `rgb(11,12,14)` ↔ `rgb(250,250,249)`，reload 后保持，往返切换正常。
- 键盘可达性：Tab 顺序 logo → Advanced → Shortlist → 链接 → 语言 → 主题 → 引导关闭 → AI naming，焦点 outline 可见。
- 404：未知顶级路径（/nonexistent-r332）与未知 /tld slug 均真实 HTTP 404 + 品牌化页面。
- /mcp 文档页 GET 200，正常渲染；MCP JSON-RPC `tld_prices` `tldCount=222`、prices 222 键。

## 8. storage / usage / console — PASS

- localStorage 备份（`domainhunter:lang`/`domainhunter:theme`/`domainhunter:shortlist`）→ 审计 → 恢复，逐键 diff `STORAGE_IDENTICAL`（审计中途 lang 被写为 zh，收尾恢复为备份值 en）。
- `/api/usage` 前后 days dict 逐字节相等（审计期间 0 AI 调用；当日既有 `aiErrors.quota: 4` 为审计前 DeepSeek 402 残留计数，非本轮产生）。
- console：除对**故意访问**的 404/410 资源（/nonexistent-r332、已撤销 /s/:id）的 `Failed to load resource` 外，0 应用错误、0 pageerror。

## 9. 分享链路 — PASS

- POST /api/share → 200 + id + revokeToken（token 已 redact，不落盘）。
- /s/:id `innerText` 含两条域名（d1/d2: true）。
- DELETE /api/share/:id（带 token）→ 200；随后 GET /api/share/:id → **410**；/s/:id 显示「已失效」品牌页；无残留分享。

## 发现清单

| 级别 | 发现 | 说明 |
|---|---|---|
| P3 | 首页 footer 不展示数字计数文案（`footer_count_text` 为空），计数仅在 hub 页 title/正文出现 | 非缺陷：footer hub 链接去重计数 222/224/252 正确；若希望 footer 显示「222 个后缀」类文案可作后续增强 |
| P3 | 模板 chips 正则匹配到既有「甜品冰淇淋」chip（与新「冰淇淋品牌」并存） | 两个 chip 语义不同（甜品站 vs 冰淇淋品牌），均正常渲染预填，仅记录避免后续审计误判重复 |
