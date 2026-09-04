# R328 零 AI 全站审计（覆盖 R323–R326 之后的全站）

- 日期：2026-08-09（UTC）
- 生产站：https://hunt.zalize.com（Worker version `2d58c466-ff7a-43c1-b429-14630b04757f`，deploy tip `92b4dc2`）
- 约束：严格 0 AI——全程未触发「开始猎取」「再来一轮」、refine、任何 AI CTA；quick-check 仅做精确核验；home 模板按钮仅验证预填未提交。`/api/usage` 前后 days dict 逐字节相等（`findings-r328.json` `usage_equal: true`，收尾再复核 `usage-r328-pre.json` / `usage-r328-post.json` days_equal: true）。未部署，未注册域名。
- 脚本与证据：`audit_browser_r328.py` / `audit_browser_r328b.py`、`findings-r328.json` / `findings-r328b.json`、`screenshots-r328/`、`lighthouse-r328/`、`storage-r328-backup.json` / `storage-r328-final.json`。

## 结论

**P0：0 · P1：0 · P2：0 · P3：2**。全站健康，无版本回退迹象。

## 1. 内容基线 — PASS

| 项 | 期望 | 实测 |
|---|---|---|
| sitemap `<loc>`（`?cb=` 缓存穿透 ×3 次采样） | 688 | 688 / 688 / 688 |
| sitemap 细分 | 8+216+218+246 | 8 核心页 + /tld 216 + /guide 218 + /vs 246 |
| /tld hub 去重链接（浏览器） | 216 | 216 |
| /guide hub | 218 | 218 |
| /vs hub | 246 | 246 |
| footer hub 链接（/tld//guide//vs 去重） | 216/218/246 | 216/218/246 |
| llms.txt 链接 | 216/218/246 | 216/218/246（含「216 TLDs」文案） |

## 2. R325 新 TLD / R326 新指南 / R323 新对比页抽查 — PASS

6 个新 TLD（vet/lawyer/legal/delivery/recipes/rent）：
- 中文（`/tld/:slug`）与英文（`?lang=en`）SSR 全文渲染（117–119 KB）、`FAQPage` JSON-LD、title/canonical/hreflang（zh-CN / en / x-default）正确。
- 页面静态参考价与 `types.ts` `TLD_PRICES` 及 /prices 行逐值一致：vet ¥241/241、lawyer ¥360/360、legal ¥41/412、delivery ¥37/360、recipes ¥48/449、rent ¥74/374（`prices_new_tld_static.match: true`）。

6 篇新指南（fruitshop/seafood/tailor/equestrian/archery/immigration）：中英文双语正文完整（107–110 KB SSR HTML）、FAQ、JSON-LD、标题语义正确。

R323 新对比页 /vs/credit-vs-finance：中英双语完整（110 KB）、FAQ、JSON-LD、title/canonical/og 正确。

## 3. /prices 与 quick-check — PASS

- 行数：中文 216、英文 216（`main a[href^="/?tld="]` 计数），与 /tld 计数一致。
- 默认按注册价升序排序正确；点「后缀」列头后按字母排序正确。
- 实时价 58 行（Porkbun live），CNY=round(USD×7.2) 全部吻合（0 mismatch）；其余 158 行为 ≈ 静态参考价（CNY 口径）。
- quick-check 单域名：`核验完成：共 9 个，9 个可注册`；「查更多后缀」All：**共 217 个**（216 TLD + com.cn），209 可注册（registered/unknown 细分随 RDAP 波动，仅硬断言总数 217 ✓）。

## 4. home 新 TEMPLATES（R326）— PASS

- 展开「+N」后 6 个新模板 chips 全部渲染：水果店 / 海鲜餐厅 / 服装定制 / 马术俱乐部 / 射箭馆 / 移民咨询。
- 点击 chip 仅预填 textarea（「一个水果店与生鲜果切品牌，寓意…」），未提交任何 AI 请求。
- `/?tpl=<slug>` 预填中英文均正确（6/6，中文与英文文案分别验证）。
- 375px 首页 `scrollWidth` 375，无溢出。

## 5. SEO — PASS

- 随机 6 内容页（/tld/rent、/tld/recipes、/guide/tailor、/guide/archery、/vs/credit-vs-finance、/vs/press-vs-news）：title、canonical、og:title、JSON-LD、`lang="zh-CN"` 全部正确。
- robots.txt：Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + Sitemap 指向正确。
- llms.txt 结构完整（核心页 + 三类内容全量链接，计数与 sitemap 自洽）。

## 6. Lighthouse（生产，headless）— PASS

| 页面 | 移动 perf | 桌面 perf | A11y | BP | SEO |
|---|---|---|---|---|---|
| / | 93 | 100 | 100 | 100 | 100 |
| /tld | 90 | 100 | 100 | 100 | 100 |
| /guide | 89 | 100 | 100 | 96* | 100 |
| /vs | 89 | 100 | 100 | 100 | 100 |
| /prices | 90 | 100 | 100 | 100 | 100 |

全部移动 perf ≥85，无 P2。*guide 移动 BP 96 为 `inspector-issues` 中 CSP 报告类 issue（asset JS 的 CSP 提示），见 P3。

## 7. UX — PASS

- 375px：/、/prices、/tld/vet、/vs、/guide/fruitshop `scrollWidth` 360–375，无横向溢出。
- light/dark：header 主题按钮（title「Toggle light/dark / 切换浅色/暗色」）切换 `html.light` 类 + `domainhunter:theme=light` 持久化，reload 后保持（bg `rgb(11,12,14)` ↔ `rgb(250,250,249)`），往返切换正常。
- 键盘可达性：Tab 顺序 logo → Advanced → Shortlist → 链接 → 语言 → 主题 → 引导关闭 → AI naming，焦点 outline 可见。
- 404：未知顶级路径（/nonexistent-r328）与未知 /tld slug 均真实 HTTP 404 + 品牌化页面。
- /mcp 文档页 GET 200，正常渲染；MCP JSON-RPC `tools/list` 返回 3 工具，`tld_prices` `tldCount=216`、prices 216 键。

## 8. storage / usage / console — PASS

- localStorage 备份（`domainhunter:lang`/`domainhunter:theme`/`domainhunter:shortlist`）→ 审计 → 恢复，逐键 diff `STORAGE_IDENTICAL`（审计中途 /prices?lang=en 采样把 lang 写为 en，收尾恢复为备份值 en——备份值本就是 en，最终 IDENTICAL）。
- `/api/usage` 前后 days dict 逐字节相等（审计期间 0 AI 调用；当日既有 `aiErrors.quota: 4` 为审计前 DeepSeek 402 残留计数，非本轮产生）。
- console：除对**故意访问**的 404/410 资源（/nonexistent-r328、已撤销 /s/:id）的 `Failed to load resource` 外，0 应用错误、0 pageerror。

## 9. 分享链路 — PASS

- POST /api/share → 200 + id + revokeToken（token 已 redact，不落盘）。
- /s/:id 渲染两条域名（innerText 复核 has_domain1/2: true）+ Copy/Export CSV。
- DELETE /api/share/:id（带 token）→ 200；随后 GET /api/share/:id → **410**；/s/:id 显示「已失效」品牌页；两次创建的分享（首轮 + b 轮）均已撤销，无残留。

## 发现清单

| 级别 | 发现 | 说明 |
|---|---|---|
| P3 | /guide 移动 Lighthouse BP 96：`inspector-issues` 报 asset JS 的 CSP（report-only 类）提示 | 其余四页 BP 100；非功能缺陷，若要 BP 满分可复核 CSP 头对 /assets/*.js 的覆盖 |
| P3 | 首轮脚本 `childElementCount===0` 选择器对分享页域名计 0（R324 已知同类） | 页面渲染正常，r328b 以 innerText 复核 has_domain=true；脚本选择器问题非应用缺陷 |
