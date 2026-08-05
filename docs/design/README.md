# DomainHunter · R2 UI 原型设计稿

- `design-spec.md` — 设计规范（配色 token、字体、间距/圆角/阴影、状态色、shadcn/ui 组件映射）
- `prototype/` — 静态 HTML 原型（Tailwind CDN + lucide CDN，直接浏览器打开即可）
  - `index.html` 索引页
  - `01-home.html` 首页（描述输入 + TLD 胶囊 + 风格 Select）
  - `02-agent-progress.html` Agent 检索进行中（需求理解确认、分轮时间线、名字+寓意先出、原位状态翻转）
  - `03-results.html` 结果列表（可注册优先、评分环 + 四维分、注册商下拉、复制/收藏/导出、再来一批）
  - 移动端布局为同一页面响应式（移动端优先），375px 宽无横向滚动（已用脚本验证 scrollWidth=375）
- `screenshots/` — 每页桌面（1280px）与移动端（375px）截图；`*-mobile-viewport.png` 展示移动端底部固定操作栏
