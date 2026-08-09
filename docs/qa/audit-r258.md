# R258 · 零 AI 全站生产审计（R243–R254 之后全站状态）

- 日期：2026-08-08（UTC 20:35–22:00）
- 对象：https://hunt.zalize.com（deploy/r192-r195，Worker version 1bf839b2，基线 commit 4a0c685）
- 预算纪律：**0 次 AI/DeepSeek 调用**——全程未触发任何 AI 搜索/反思/refine；Exact check / 变体 / Bulk check / MCP 均为 RDAP/DNS 非 AI 通道
- 方法：真实浏览器全站带注解录屏走查 + curl SSR 抽查 + CDP 设备仿真（375px）+ Lighthouse CLI + MCP JSON-RPC 冒烟
- console 全程 **0 JS/应用级 error**（仅故意访问的死路径/已撤销分享产生预期网络层 404/410 资源报错）
- 测试后本地状态**全部还原**至基线（shortlist 清空 badge 0、monitor 停止、分享撤销、webhook 清空），见 `screenshots-r258/shortlist-cleared.png`、`screenshots-r258/monitors-stopped-empty.png`

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 4 | /prices 缓存报价横幅态；`/s/:id` 页恒 200（410/404 语义在 API 层，符合设计）；显式 `?lang=` 参数覆盖语言偏好（符合设计）；/prices 移动 perf 89 接近 85 阈值 |

R242 遗留 P3 项状态：P3-3（usage 共享计数取证）本轮无干扰——前后 /api/usage **逐字段完全一致**，首次得到零增量硬证明；P3-1（6s 确认窗口）行为不变，仍为体验小瑕疵。

## 1. 首页 quick-check（passed，含 R251 回归）

- acme.com 精确核验 → RDAP 判定已注册（含到期日）。截图：`screenshots-r258/quickcheck-acme.png`
- 「免费查 24 个前后缀变体」→ **24/24 全部完成，无残留 checking**。截图：`screenshots-r258/quickcheck-variants.png`
- 更多后缀含 **acme.cn / acme.com.cn** 且均出结果（R251 新增集）。截图：`screenshots-r258/quickcheck-more-tlds-cn-comcn.png`
- **R251 回归重点**：对同一域名重复核验，无任何行卡「检测中」pending >20s。截图：`screenshots-r258/quickcheck-recheck-no-pending.png`
- 375px 仿真：check 按钮 44px、14 个按钮 ≥40px；scrollWidth=375 **无横向溢出**。截图：`screenshots-r258/mobile-375-home.png`
- 注：44px 触控目标仅移动断点生效（桌面同按钮 32px），量测在 375px 仿真下完成。

## 2. 内容面三 hub + SSR + 404（passed）

- /tld **132/132**、/guide **128/128**、/vs **156/156**，与 R252/R254 扩容后预期一致（R242 时为 120/110/144）。截图：`screenshots-r258/tld-hub-132.png`
- 即时过滤：/tld `coffee`、/vs `marketing` 英文词过滤生效。截图：`screenshots-r258/tld-hub-filter-coffee.png`、`screenshots-r258/vs-hub-filter-marketing.png`。中文过滤本轮因 IME 键入限制**未覆盖**（R242 已实测通过，无相关代码改动）。
- SSR/水合/canonical/OG 抽查：/tld/directory、/vs/marketing-vs-agency 的 zh/en 均正常。截图：`screenshots-r258/vs-marketing-agency-zh.png`、`vs-marketing-agency-en.png`
- 404：未知顶层路径与未知 slug（/tld、/guide、/vs）均 **HTTP 404 + noindex + 品牌 404 页**（zh/en）。截图：`screenshots-r258/404-branded-zh.png`

## 3. /prices（passed，1 项 P3 环境记录）

- **132 行**（132 个 /tld/ 链接）；「续费/年」排序生效；移动断点 44px 触点。截图：`screenshots-r258/prices-132-banner.png`、`prices-renew-sort.png`
- **P3-1**：本轮处于「缓存报价（15h 前）— 实时报价暂不可用」横幅态；审计中价格来源在 Porkbun live 与 static reference 间切换过一次（后端报价源波动）。横幅提示本身工作正常，属环境状态记录，非前端缺陷（同 R242 P3-2）。

## 4. /advanced 批量核验 + CSV（passed）

- 4 域批量（1 可注册 + 3 已注册）；CSV `domainhunter-bulk-20260808.csv` 含 **expires_at 列**且 taken 行有值。截图：`screenshots-r258/advanced-bulk-results.png`、`advanced-csv-downloaded.png`

## 5. /shortlist + /monitors（passed）

- 备注保存回显、排序、CSV 含 note/expiry 列。截图：`screenshots-r258/shortlist-note-monitor.png`
- webhook 配置 UI：非 https 拒绝、https 保存成功、可清空。截图：`screenshots-r258/webhook-invalid-http.png`、`webhook-saved-https.png`、`webhook-cleared.png`
- /monitors「立即刷新」填充最后检查时间与到期日（github.com → 2026-10-09）。截图：`screenshots-r258/monitors-refreshed.png`
- 停止监控两步确认：「Confirm?」6s 倒计时超时自动复原 → 再次两步确认后列表清空（3/500→2/500）。截图：`screenshots-r258/monitors-stopped-empty.png`

## 6. 分享链路（passed，1 项 P3 设计说明）

- 创建 /s/kbwpCEWvIv → 快照页渲染 → 两步删除 → 页面显示品牌「链接已失效」页；`GET /api/share/:id` 撤销后 **410**、未知 id **404**。截图：`screenshots-r258/share-snapshot.png`、`share-revoked-page.png`、`share-deleted-list.png`
- **P3-2**：`/s/:id` HTML 页本身恒为 HTTP 200（SPA 壳，失效态由客户端渲染）；410/404 语义在 API 层，符合 worker.ts 设计，记录以免未来审计误判。

## 7. MCP（passed）

- GET /mcp 文档页 200；POST 三工具：`check_domains` 返回 **expiresAt + expiringSoon**、`tld_prices` **132 个 TLD 全覆盖**、`suggest_variants` 含 firstYearPriceUSD。

## 8. SEO/发现面（passed）

- sitemap.xml **424 URL**（132 tld + 128 guide + 156 vs + 8 核心页，双语在 alternate）；robots.txt 引用 sitemap；/llms.txt、favicon、manifest 均 200。

## 9. 双语 + 主题 + 键盘（passed，1 项 P3 设计说明）

- zh↔en 切换后刷新持久（localStorage）；暗色主题刷新持久；Tab 焦点环可见、Enter 激活。
- **P3-3**：URL 带显式 `?lang=en` 参数时刷新按参数回退（参数优先于偏好），符合设计。

## 10. Lighthouse（perf / a11y / SEO）

| 页面 | 桌面 | 移动 |
|---|---|---|
| 首页 | 100 / 100 / 100 | 92 / 100 / 100 |
| /tld/directory | 100 / 100 / 100 | 90 / 100 / 100 |
| /prices | 100 / 100 / 100 | **89** / 100 / 100 |

- **P3-4**：/prices 移动 perf 89，高于 85 阈值但为三页最低，记录为观察项（行数 120→132 增长后仍达标）。

## 硬约束核对

- **0 AI 调用（本轮首次获得硬证明）**：审计前后完整读取 /api/usage，**逐字段完全一致**——2026-08-08 searches 44 / fast 31 / refine 13，三天数据、cronLast、indexnowLast 均无任何变化。共享计数器本轮恰无自然流量噪声，AI 字段 0 增量直接得证（基线与结束快照存档于审计会话）。
- **console 0 error**：全程无 JS 运行时/应用级 error。
- **状态还原**：shortlist 清空、monitor 停止、分享撤销（410）、webhook 清空，localStorage == 基线。

## 问题清单

### P3-1 /prices 缓存报价态（环境记录）
- 实时 Porkbun 报价 15h 未更新，横幅提示正常；审计中价格来源切换过一次，建议关注报价源稳定性。

### P3-2 `/s/:id` 页面恒 200，410/404 语义在 API 层
- 符合 SPA 设计；任务书「撤销 410 / 不存在 404」在 `GET /api/share/:id` 上成立，页面层为品牌失效页。

### P3-3 显式 `?lang=` 参数覆盖语言偏好
- 符合设计（分享链接语言一致性），记录以免误判为持久化 bug。

### P3-4 /prices 移动 perf 89
- 接近 85 阈值，为三页最低；后续行数继续扩容时建议复测。

## 观察（不计缺陷）

- 内容面自 R242 扩容：TLD 120→132、guide 110→128、vs 144→156、sitemap 388→424，均与任务书预期一致。
- R251 quick-check 重复核验回归修复验证通过；.cn/.com.cn 已入更多后缀集。
- R242 P3-3（usage 取证噪声）本轮未复现——前后快照完全一致。
