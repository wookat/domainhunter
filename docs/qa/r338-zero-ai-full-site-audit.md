# R338 零 AI 全站审计报告（覆盖 R331–R336 之后全站）

- 日期：2026-08-09（UTC）
- 生产站：https://hunt.zalize.com（Cloudflare Worker，deploy tip 5a42693）
- 审计方式：严格 0 AI——未点击「开始猎取」「再来一轮」、未触发 refine 及任何 AI CTA；quick-check 仅做代码级核验；home 模板按钮只验证预填未提交；未部署、未注册域名、未支付。
- 佐证：`/api/usage` 审计前后 `days` dict 完全相等（逐字节比较 True），确认全程零 AI 调用。

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 1 | `/api/prices` 处于 stale 回退（仅 58/228 个 TLD 有实时价，Porkbun 上游拉取失败） |
| P3 | 2 | /prices 移动端 Lighthouse best-practices 96（缺 source map + DevTools issues）；usage 显示 08-09 有 4 次 aiErrors.quota（DeepSeek 402 的用户侧体现） |

## 1. 内容基线 ✅

- sitemap `<loc>` 三次 `?cb=` 采样均为 **730** = 8 核心页 + 229(/tld hub+228) + 231(/guide hub+230) + 265(/vs hub+264)，与公式一致，无版本回退。
- Hub 页实际计数：/tld「228 个后缀」、/guide「230 个行业」、/vs「264 组」，与仓库源（tld-list 228、guides 231 处 slug 含 hub、compares 265 处含 hub）一致。
- llms.txt：tld 228 / guide 230 / vs 264 条链接，去重后与 sitemap 完全自洽。
- robots.txt 正常（GPTBot/PerplexityBot/ClaudeBot allow + Sitemap 指向）。

## 2. R331/R333/R334/R335 新页面抽查 ✅

- R333 新 TLD（courses/degree/mba/study/forum/review）：zh 200、`?lang=en` 200（`<html lang="en">` 正确；注：`/en/tld/*` 路径形式不存在，本站英文路由为 `?lang=en`，非缺陷）；正文完整（约 122KB SSR）、FAQPage JSON-LD 各 1。
- R334 新指南（tea/hotspring/trampoline/funeral/securityguard/ipagency）：zh/en 均 200，FAQ + JSON-LD 完整，约 110KB SSR。
- R331/R335 新对比页（degree-vs-education / mba-vs-school / study-vs-courses / forum-vs-community / review-vs-reviews）：zh/en 均 200，FAQ + JSON-LD 完整。
- 价格同源核验：tld 页与 /prices 页静态参考价同出 `tldPrice()` 单一数据源（ssr-html.ts staticPriceFull/Short），抽查 .courses「首年约 $2（约 ¥11）」两处一致。

## 3. R336 回归（guide 搜索别名） ✅

- /guide 搜「寿司」→ 命中日料餐厅（Sushi & Japanese dining）1 卡；「大模型」→ AI 产品；「旅游」→ 旅游指南。别名即时过滤生效。
- 别名不进 SSR：/guide 首屏 HTML 中「寿司」出现 0 次（仅存在于 guides.ts `keywords` 字段，源码注释明确「仅参与过滤匹配，不渲染」）。✅

## 4. /prices 与 quick-check 口径 ✅（附 P2）

- /prices SSR 行数 228（去重 tld 链接 228），与 tld 计数一致。
- quick-check 覆盖集合：默认 8（com/io/ai/app/dev/co/net/me）∪ QUICK_MORE_TLDS（含 cn + com.cn + 220）= **229 = 228 + 1（com.cn）**，与「All = tld+1」口径一致。
- **P2**：`/api/prices` 返回 `stale: true`、`tldCount: 58`（fetchedAt ≈ 2026-08-04），即 Porkbun 上游连续拉取失败、回退 30 天 stale key。缺失的 170 个 TLD 前端按设计回退静态参考价，用户可见但非实时。建议下轮检查 worker→Porkbun 连通性 / cron 拉取日志。

## 5. SEO 抽查 ✅

随机 6 页（/tld/mba、/tld/cn、/guide/funeral、/guide/tea、/vs/forum-vs-community、/vs/review-vs-reviews）：title 唯一且含品牌后缀、canonical 均为不带参数的规范 URL、og:title/og:image 齐全（各 6 处 og 标签）、JSON-LD（FAQPage+Breadcrumb）、`<html lang>` 随语言正确切换。robots/sitemap/llms.txt 见第 1 节。

## 6. Lighthouse（移动 + 桌面，各 5 页） ✅

| 页面 | 移动 perf/a11y/bp/seo | 桌面 perf/a11y/bp/seo |
|---|---|---|
| / | 94/100/100/100 | 100/100/100/100 |
| /tld | 89/100/100/100 | 100/100/100/100 |
| /guide | 89/100/100/100 | 100/100/100/100 |
| /vs | 89/100/100/100 | 100/100/100/100 |
| /prices | 89/100/**96**/100 | 100/100/100/100 |

移动 perf 全部 ≥85，无 P2。P3：/prices 移动 best-practices 96（valid-source-maps 缺失 + inspector-issues），不影响用户。

## 7. UX 抽查 ✅

- 375px：/、/guide、/prices、/tld/mba 均无横向滚动。
- 双主题：SunMoon 切换 `<html class="light">` ↔ dark 正常往返，light 底色 rgb(250,250,249)、dark rgb(11,12,14)。
- 键盘可达性：Tab 顺序 Logo → Advanced → Shortlist → 语言切换 → 主题 → Dismiss guide → 模板按钮，顺序合理、焦点可见。
- 404：不存在路径返回 HTTP 404 + 完整 404 页（含返回首页与 4 个 hub 导流链接）。
- MCP 文档页：`tld_prices` 描述取 `TLD_LIST.length` = **228** 口径正确（页面无 58 字样，未受 stale API 污染）。
- home 模板按钮：点击「SaaS tool」chip 后 textarea 预填 260 字模板文案，未提交任何搜索。✅

## 8. storage / usage / console ✅

- localStorage backup→clear→restore 逐键一致（`domainhunter:lang` / `domainhunter:shortlist` / `domainhunter:theme`，round-trip 深比较 True）。
- `/api/usage` 审计前后 `days` dict 相等（见结论总览佐证）。
- console：所有内容页 0 error；唯一一条 404 资源报错来自主动访问的 404 测试页本身（预期行为）。
- P3（信息项）：usage 记录 2026-08-09 `aiErrors: {quota: 4}`——真实用户已撞上 DeepSeek 402 欠费，充值前 AI 搜索对用户不可用。

## 9. 分享链路 ✅

- POST /api/share（1 条测试数据）→ 200，返回 id=`8ery8B77uB` 与 revokeToken（已 redact）。
- GET /api/share/:id → 200，items 内容正确；GET /s/:id → 200。
- DELETE 无 token → 400 token_required；DELETE 带 token → 200 ok。
- 撤销后 GET → **410 revoked**，无残留可读数据（KV 仅存 revoked 占位）。✅

## 建议下一轮

1. （P2）排查 Porkbun 价格拉取失败原因（cron 日志 / 上游限流），恢复 228 TLD 实时价。
2. （P3）DeepSeek 账户充值后回归验证 AI 搜索与 refine。
3. （P3）如追求满分可为 /prices bundle 补 source map。
