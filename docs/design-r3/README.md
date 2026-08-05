# DomainHunter · R3 UI 原型设计稿

基于 `docs/research/design-study.md`（research/design-study 分支）新一轮调研的全新一版 UI 设计。**仅设计稿，不改 apps/ 代码**；老板审阅通过后再实现。

- `design-spec.md` — 完整设计规范：暗色默认 + 浅色可切的 token 体系、字体/间距/圆角/动效、shadcn/ui 组件映射、逐页交互说明、与 R2 差异
- `prototype/` — 静态 HTML 原型（Tailwind CDN + lucide，浏览器直接打开；右上角按钮切换暗/浅色）
  - `index.html` 索引
  - `01-landing.html` 着陆页（prompt-first + 复合输入框）【P0 #1 #2】
  - `02-generating.html` 生成中（双栏 + 步骤清单微日志 + 流式结果混合状态）【P0 #6 #10 #11】
  - `03-results.html` 结果页（Top Picks + 紧凑行默认/卡片可切 + 过滤 + 锁定再来一轮）【P0 #7 · P1 #8 #13 #21】
  - `04-shortlist.html` 候选清单（对比/导出/批量注册）【P1 #4】
  - `05-mobile.html` 移动端一屏一事三屏展示【P1 #23 #24】
  - 01–04 均响应式，375px 无横向滚动（Playwright 验证 scrollWidth ≤375）
- `screenshots/` — 每页桌面（1440px，暗色默认）与移动端（375px）截图；`*-mobile-viewport.png` 展示首屏与 sticky 栏
