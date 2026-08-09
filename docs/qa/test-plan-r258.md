# R258 零 AI 全站生产审计 · 测试计划

对象：https://hunt.zalize.com（Worker 1bf839b2，deploy/r192-r195 @ 4a0c685）。
硬约束：全程 0 次 AI 调用（不点任何「Start hunting/开始猎名」/refine 按钮；仅用 quick-check / bulk / variants / MCP 非 AI 通道）。
基线：/home/ubuntu/usage-baseline-r258.json（2026-08-08 searches:44 fast:31 refine:13）。结束后读完整 /api/usage → /home/ubuntu/usage-after-r258.json，断言 fast/refine 无本会话增量（自然流量噪声按 R242 惯例说明 + 全程网络面板无 /api/search 请求佐证）。
截图目录：~/repos/domainhunter/docs/qa/screenshots-r258/。录屏带 annotate。发现按 P0/P1/P2/P3 分级。

## 1. 首页 quick-check（含 R251 回归重点）
- 输入 acme → Exact check：acme.com 判定「已注册」+ 到期日显示。PASS: 状态非 pending，含 expiry。
- 变体：点「免费查变体」→ 全部变体核验完成（无残留 checking）。
- 更多后缀集合须含 .cn 与 .com.cn（R251，home-page.tsx quick TLD set）。PASS: 列表出现 acme.cn / acme.com.cn 且得出结果。
- **R251 回归**：对同一名字连续第二次点击核验 → 所有行在合理时间内脱离「检测中」；无任何行永久 pending。FAIL 判据：任一行 >20s 仍 checking。
- 触控目标：quick-check 结果行链接有效点击区 ≥44px（DevTools 量测或 .tap-target）。
- 375px 窄屏（CDP 仿真）：首页无横向溢出（scrollWidth ≤ 屏宽附近）。

## 2. 内容面（hub 计数为 R252/R253/R254 新值）
- /tld 显示 **132/132**；即时过滤（如 coffee）计数缩小且正确。/guide **128/128**；/vs **156/156**；各做一次 zh 或 en 过滤。
- 抽查 ≥2 页（如 /tld/directory 新增页、/guide 新增页、/vs/marketing-vs-systems 类新页）：curl SSR 有正文、canonical 指向自身、og:title 存在；浏览器水合正常；zh/en 双语切换内容变化。
- 404：/nonexistent-xyz 与 /tld/notatld、/guide/nope、/vs/foo-vs-bar → HTTP 404 + noindex meta + 品牌 404 页（zh/en）。

## 3. /prices
- **132 行**（/tld/ 链接计数 132）；点「续费/年」列头排序生效（首行为最低续费）。
- 横幅状态记录（实时 or 缓存报价）。表内链接有效触点 ≥44px。

## 4. /advanced + /shortlist + /monitors
- /advanced 批量核验 4 域（google.com / example.org / 随机长串.com / github.com）→ 1 available + 3 taken；导出 CSV **含 expires_at 列** 且 taken 行有值。
- /shortlist：星标 1-2 个域 → 备注保存回显、排序、CSV 导出（含备注）、**webhook 配置 UI（在 /shortlist 页）**：填非 https → 提示「请填写 https:// 开头」；填 https://example.com/hook → 「已保存」。测试后清空 webhook。
- /monitors：给 1 个 taken 域开监控 → 列表出现；「立即刷新状态」填充最后检查时间/到期日；停止为两步确认（倒计时，超时复原）→ 确认后列表清空。

## 5. 分享链接
- shortlist 创建分享 → 打开 /s/xxx 快照页渲染；撤销 → 页面失效 + API 复读 **HTTP 410**；随机不存在 /s/zzz → 404。

## 6. MCP
- GET /mcp：文档页渲染（三工具说明）。
- POST JSON-RPC：tools/list 三工具；check_domains（github.com 返回 expiresAt，expiringSoon 布尔正确 ≤90 天窗口）；tld_prices（**132 TLD**）；suggest_variants（acme/com，含 firstYearPriceUSD）。

## 7. SEO/发现面
- sitemap.xml **424 个 <loc>**；robots.txt 引 sitemap；/llms.txt 200；favicon、site.webmanifest 200。

## 8. Lighthouse（npx lighthouse，桌面+移动）
- 首页、/tld/directory（内容页）、/prices。记录 perf/a11y/SEO 三分。FAIL 阈值：任一 a11y/SEO <95 或 perf 桌面 <90 / 移动 <85 记为发现。

## 9. 横切
- zh↔en 切换 + 刷新持久；暗/亮主题切换；Tab 焦点环可见 + Enter 激活；console 全程 0 JS error（预期的 404/410 网络资源报错除外）。
- 收尾清理：shortlist 清空、monitor 停止、分享撤销、webhook 清空、localStorage 回基线；读 /api/usage 存 usage-after-r258.json 并对比。
