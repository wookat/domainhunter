# R226 · 零 AI 全站生产审计（R219–R225 之后全站状态）

- 日期：2026-08-08（UTC 14:45–15:45）
- 对象：https://hunt.zalize.com（deploy/r192-r195 部署线）
- 预算纪律：**0 次 AI/DeepSeek 调用**——全程未点击任何「开始猎名」类按钮；quick-check/批量核验均为 RDAP/DNS 通道
- 方法：真实浏览器全站走查 + curl SSR 抽查（带 ?cb= 防 CDN 缓存）+ Lighthouse CLI + MCP JSON-RPC 冒烟
- console 全程 **0 error**；测试后本地状态**全部还原**（shortlist 基线 3 条、monitors []、lang=zh、theme=dark 原样、shares 已撤销）——见 `screenshots-r226/final-state-restored.png`

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 1 | 未知顶层路径返回原生 404（无品牌 404 页） |
| P3 | 2 | 375px 下部分内联文字链接触点 <44px；中文过滤词未验证（环境限制） |

## 1. 全站走查（全部 passed，除 P2-1）

| 项 | 结果 | 备注 |
|---|---|---|
| 首页 quick-check（acme.com 即时核验） | ✅ | RDAP/DNS 非 AI 通道 |
| 变体建议 / 收藏星标 / 监控按钮 | ✅ | |
| recent 记录 | ✅（按设计） | `domainhunter:recent-searches` 仅在 AI 搜索 submit 时写入（home-page.tsx `submit()` → `addRecentSearch`）；quick-check 不写入属预期，零 AI 约束下无法触发写入 |
| 模板 chips = 98 | ✅ | DOM 计数 98 |
| /advanced 批量核验（4 域名）+ CSV 下载 | ✅ | `domainhunter-bulk-20260808.csv` 正常 |
| /shortlist 备注编辑 / 排序 / 分享管理 / CSV | ✅ | 分享创建→渲染→撤销→失效提示全链路正常 |
| /monitors 刷新 + 两步取消 | ✅ | 取消需二次确认，测后还原 [] |
| /prices 102 行 / 列排序 / 横幅态 | ✅ | DOM 行计数 102；缓存值横幅正常 |
| /why | ✅ | |
| /tld /guide /vs 三 hub 计数 102/98/126 | ✅ | 即时过滤有效（102→4、98→2、126→1） |
| 内容页抽样 ×6 | ✅ | /tld/academy、/tld/restaurant、/vs/blue-vs-red、/vs/pink-vs-me、/guide/saas、/guide/coffee 渲染完整，内链（blue-vs-red→/tld/blue）正常 |
| /s/无效id | ✅ | 「分享链接不存在或已过期」友好页 |
| /nonexistent-xyz 404 | ❌ **P2-1** | 原生空体 404，见下 |

## 2. share 链路 API（passed）

POST /api/share 创建（返回 id+revokeToken）→ GET 200 返回 items → DELETE 携 token 撤销 200 → GET 复读 **410 revoked** → /s/:id 页面呈现失效态。写后读回校验路径无异常。

## 3. 双语（passed）

- zh↔en 切换生效且刷新持久（localStorage lang），测后还原 zh。
- SSR 抽查（curl + ?cb=）：`/?lang=en` canonical 自指 `https://hunt.zalize.com/?lang=en`✅；`/prices?lang=en`、`/vs/blue-vs-red?lang=en` 同样 canonical 自指、title/description 英文完整✅；zh 版 canonical 无 lang 参数✅。
- JSON-LD 抽查：/tld/restaurant（BreadcrumbList+FAQPage）、/vs/pink-vs-me（BreadcrumbList+Article+FAQPage）、/guide（BreadcrumbList）——全部可解析、类型正确。

## 4. 响应式 375px（passed，1 项 P3）

- 首页、/prices、/shortlist、/tld/academy：scrollWidth=375，**无横向溢出**。
- 触点抽查：主按钮均 ≥44px；**P3-1**：部分内联文字链接偏小——/prices 表内 TLD 链接 ~80×20、shortlist 备注按钮 ~55×16、面包屑 ~62×18。

## 5. Lighthouse（perf / a11y / SEO）

| 页面 | 桌面 | 移动 |
|---|---|---|
| 首页 | 100 / 100 / 100 | 92 / 100 / 100 |
| /prices | 100 / 100 / 100 | 96 / 100 / 100 |
| /tld/academy | 100 / 100 / 100 | 99 / 100 / 100 |

## 6. MCP 三工具冒烟（passed）

- `tools/list`：三工具齐全，schema 完整。
- `check_domains`：google.com/example.org taken、随机长串 available；github.com 返回 `expiresAt: 2026-10-09` + `expiringSoon: true` ✅。
- `tld_prices`：**102 个 TLD 全覆盖**，44 个 approx:true 回退（cn/so/social/... 符合设计），Porkbun 实时价正常。
- `suggest_variants`（acme, com）：前后缀变体齐全、available 排前、含 firstYearPriceUSD ✅。

## 问题清单

### P2-1 未知顶层路径返回原生 404（无品牌页）
- 复现：浏览器访问 https://hunt.zalize.com/nonexistent-xyz → HTTP 404 空响应体（Chrome 原生错误页）。
- 截图：`screenshots-r226/404-raw.png`
- 分析：worker.ts 对**已知 SEO 路由的未知 slug** 有 `notFoundShell()`（应用壳 + 404 + noindex），但任意顶层未知路径落入 Workers assets 兜底，返回裸 404。建议加 catch-all 路由复用 `notFoundShell`。

### P3-1 375px 触点尺寸
- /prices 表内 TLD 链接 ~80×20、shortlist 备注按钮 ~55×16、面包屑 ~62×18，低于 44px 建议值（主按钮均达标）。

### P3-2 中文过滤词未验证（测试环境限制，非站点缺陷）
- computer-use 键盘无法输入中文，hub 过滤用 ASCII（"shop"/"saas"）验证通过；中文过滤词留待后续轮次验证。

## 观察（不计缺陷）

- recent 记录仅由 AI 搜索写入（按设计），零 AI 审计下无法覆盖该写入路径。
- github.com `expiringSoon: true` 展示了 90 天窗口逻辑正确触发。
