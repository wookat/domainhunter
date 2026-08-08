# R242 · 零 AI 全站生产审计（R231–R238 之后全站状态）

- 日期：2026-08-08（UTC 17:20–18:30）
- 对象：https://hunt.zalize.com（deploy/r192-r195 部署线）
- 预算纪律：**0 次 AI/DeepSeek 调用**——全程未点击任何「Start hunting/开始猎名」或 refine 按钮；Exact check / Bulk check / 变体建议均为 RDAP/DNS 通道
- 方法：真实浏览器全站带注解录屏走查 + curl SSR 抽查（带 ?cb= 防缓存）+ CDP 设备仿真（375px）+ Lighthouse CLI + MCP JSON-RPC 冒烟
- console 全程 **0 JS/应用级 error**（仅 5 条预期网络层 404/410 资源报错，来自故意访问的死路径与已撤销分享；warning 0）
- 测试后本地状态**全部还原**至基线 `{theme:dark, shortlist:[], lang:en}`（monitor 取消、share 撤销 410、临时键删除），见 `screenshots-r242/final-restored-shortlist-empty.png`

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 3 | 两步确认窗口仅 6s；/prices 处于缓存报价态（横幅正常）；usage 全站计数无会话隔离，干扰审计取证 |

R226 遗留项全部关闭：P2-1 品牌 404 已上线（未知顶层路径与未知 slug 均品牌页 + HTTP 404 + noindex）；P3-1 触点已由 `.tap-target` 伪元素修复（有效触点 ≥44px）；P3-2 中文 hub 过滤本轮首次实测通过。

## 1. SPA 品牌 404（R231–238 新功能，passed）

- `/nonexistent-xyz`、`/tld/notatld`、`/guide/nope`、`/vs/foo-vs-bar` 均渲染品牌 404 页（导航 + 返回首页按钮），zh/en 双语（`404 / 页面不存在` ↔ `404 / Page not found`）。
- curl（浏览器式 UA/Accept）：HTTP **404** + text/html + `<meta name="robots" content="noindex" />`。
- 截图：`screenshots-r242/404-nonexistent-zh.png`

## 2. 三 hub 计数 + 中文过滤（passed，中文过滤首次实测）

- /tld **120/120**：英文 `coffee` → 2/120（.cafe/.coffee）；中文「咖啡」→ 2/120。
- /guide **110/110**：中文「咖啡」→ 1/110（咖啡茶饮）。
- /vs **144/144**：`io vs` → 8/144。
- 截图：`screenshots-r242/tld-hub-zh-filter-kafei.png`

## 3. 首页 Exact check + 变体 + 星标（passed）

- acme.com → RDAP 判定已注册（含到期日）；「免费查 24 个前后缀变体」→ 24/24 核验完成、16 个可注册（$11.08 起）；星标 getacmelabs.com → 候选清单徽标 +1。
- 截图：`screenshots-r242/quickcheck-variants.png`

## 4. /monitors（passed，1 项 P3 观察）

- 从 Exact check 给 acme.me 开监控 → /monitors 列表出现；「立即刷新状态」填充最后检查时间与到期日；取消为两步确认（倒计时，超时自动复原），二次点击后列表清空、localStorage monitor=[]。
- **P3-1**：确认窗口 CONFIRM_TIMEOUT_MS=6000，倒计时从 5 显示，动作稍慢即复原。

## 5. /shortlist 全链路（passed）

- 备注保存回显、按域名排序、CSV（domainhunter-shortlist-20260808.csv，2 行 + 备注列）；分享创建 /s/D96QYYAMrh → 快照页渲染 → 两步删除 → 页面「链接已失效」、API 复读 **410 revoked**。
- 截图：`screenshots-r242/share-revoked-invalid.png`

## 6. /advanced 批量核验（passed）

- google.com / example.org / qzxvbnmasdkjh123.com / github.com → 1 可注册 + 3 已注册（github.com 到期 2026-10-09，expiringSoon 窗口逻辑正确）；CSV 与 UI 一致。

## 7. /prices（passed，1 项 P3 环境记录）

- **120 行**（120 个 /tld/ 链接）；「续费/年」列头排序生效（.top 4.63 → .cn ≈5 → .vip 5.15 升序）。
- **P3-2**：本轮处于「价格为缓存值（12 小时前），实时报价暂不可用」横幅态——横幅提示本身工作正常，属环境状态记录，非前端缺陷。

## 8. 双语 + 主题 + 键盘（passed）

- 亮/暗主题切换生效；zh↔en 切换后 F5 持久（localStorage）；Tab 焦点环可见（header 按钮、正文链接），Enter 激活焦点链接跳转 /prices。

## 9. 响应式 375px + 触点（passed，R226 P3-1 已修复验证）

- CDP 设备仿真 375×740：/prices、/shortlist、/tld/academy scrollWidth=360，**无横向溢出**。
- `.tap-target` 伪元素：/prices 表内 TLD 链接原始高 20px → 有效触点 **74×44**；/tld/academy 面包屑 84×44；/shortlist 移动布局备注按钮原生 44px。
- 截图：`screenshots-r242/375-prices.png`

## 10. Lighthouse（perf / a11y / SEO）

| 页面 | 桌面 | 移动 |
|---|---|---|
| 首页 | 100 / 100 / 100 | 92 / 100 / 100 |
| /prices | 100 / 100 / 100 | 91 / 100 / 100 |
| /tld/academy | 100 / 100 / 100 | 99 / 100 / 100 |

## 11. MCP 三工具冒烟（passed）

- `tools/list`：三工具齐全、schema 完整。
- `check_domains`：google.com/example.org=taken、随机长串=available。
- `tld_prices`：**120 个 TLD 全覆盖**（com 11.08/11.08 等）。
- `suggest_variants`（acme, com）：变体含 firstYearPriceUSD、available 排前。

## 硬约束核对

- **0 AI 调用**：录屏全程未点击任何 AI 搜索/refine 按钮；代码核对 worker.ts 中 `bumpUsage` 仅在 AI /api/search 端点调用，本次使用的 exact/bulk/variants/MCP 通道均不计数。
- **usage 增量说明（⚠️）**：基线 2026-08-08 searches 32 / fast 22 / refine 10 → 结束 39 / 27 / 12。usage 为全站共享计数器，生产站有真实访客流量；结合代码（仅 AI search 计数）与录屏（未点 AI 按钮），增量来自其他访客的自然流量，但计数器本身无法单独证明本会话 0 增量 → 见 P3-3 取证建议。
- **console 0 error**：全程仅 5 条预期网络层 `Failed to load resource`（4×404 故意访问的 404 路径、1×410 已撤销分享），无任何 JS 运行时/应用级 error，warning 0。
- **状态还原**：shortlist 清空、monitor 取消、share 撤销（410）、localStorage == 基线。

## 问题清单

### P3-1 两步确认窗口偏短
- monitors/分享删除的确认窗口 6 秒且倒计时从 5 显示，动作稍慢即自动复原；体验小瑕疵，非缺陷。

### P3-2 /prices 处于缓存报价态
- 本轮实时 Porkbun 报价不可用，展示 12 小时前缓存值；横幅提示工作正常，属环境状态记录。

### P3-3 usage 计数无会话隔离，干扰「0 AI 增量」审计取证
- 第三方自然流量会混入全站计数器；建议未来零 AI 审计改用网络抓包/DevTools 网络面板证明本会话无 /api/search 请求，而非依赖共享计数器差值。

## 观察（不计缺陷）

- R226 P2-1（原生 404）、P3-1（触点 <44px）、P3-2（中文过滤未验证）本轮全部验证关闭。
- hub/价格数据自 R226 起扩容：TLD 102→120、guide 98→110、vs 126→144，与任务书预期计数一致。
