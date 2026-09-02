# R468 品牌预览观感对标 Namelix：设计论证与验收对照

> 角色：前端工程师 + UI 设计师。背景：R464 匿名竞品对标视觉主观分 Namelix 4.5 > 我们 4.0，差距来自「每个候选名以品牌卡呈现」。本轮先调研、出论证，再动手。

## 1. 一手调研（2026-09-02，匿名 Playwright 实跑 namelix.com）

| 项目 | Namelix 实测 | 我们 R467 现状（R102 引入的 `BrandMark`） |
| --- | --- | --- |
| 卡片 | `.logo-inner` 260×195（4:3），无圆角/阴影，密排网格；移动端两列 | 仅 Top Picks 3 张 + Grid 视图，`h-20` 条带（≈300×80） |
| 配色 | 每卡独立整色底：#FFD200 黄、纸白、#251D33 深紫、#F92E40 玫红、#EF4D38 珊瑚、石灰、藏青、墨黑…（logo 为服务端渲染 SVG） | 6 套固定 135° 双色渐变，全部白字 |
| 字形 | 名字气质驱动：粗黑体大写 / 细衬线 / 手写体 / 双色拆词（Ghost**Writer**、Written**IQ**）/ 大小字堆叠 | 3 种：大写宽字距 / serif 首字大写 / mono 小写 |
| 状态语义 | 右上角绿色 ✓ 表示可注册 | 无 |
| 密度/入口 | 结果页即卡片墙 | 默认「紧凑行视图」无任何品牌线索，需手动切 Grid |
| 资源 | 服务端 SVG + Google Fonts | 纯前端、零请求 |

截图：`screenshots/r468-namelix-results.png`（1440）、`namelix-mobile.png`（375）；实测数据 `/home/ubuntu/r468/namelix-cards.json`（会话内）。

**结论**：差距不在「有没有预览」，而在 (a) 配色与字形的多样性和气质贴合度，(b) 卡片比例/尺寸，(c) 可注册语义，(d) 紧凑行视图完全没有品牌线索。

## 2. 方案与取舍（如无异议按此执行 — 已执行）

**A. 纯前端确定性品牌卡 `BrandCard`**（`apps/web/src/components/brand-card.tsx`）
- FNV-1a(name) 派生 5 个维度：16 套配色（含 4 套渐变，色相取自 Namelix 实测 + 现代 SaaS 常见调）× 4 种版式（wordmark / monogram 首字母 mark / duotone 双色拆词 / stacked 两行堆叠）× 4 种字形（Inter 黑体 / 系统衬线 / JetBrains Mono / 宽字距大写）× 3 种 mark 形状（圆/方/超椭圆）× 3 种大小写。同名永远同一外观。
- 拆词位按音节边界启发式（cast|loom、pen|fold、lu|mora），不是硬切中点。
- 字号按名字长度 × 字形 em 宽反推，长名不截断；`contain-inline-size` 防止大字撑开父级（375 无横向溢出的关键）。
- 只用已自托管 Inter / JetBrains Mono + 系统衬线栈；零外部字体、零 API。
- 所有配色 fg/bg 对比 ≥ 4.5:1、accent/bg ≥ 3:1（大字号），与页面主题无关，暗色/亮色均达标（`contrast.mjs` 实测，珊瑚底从 #EF4D38 调到 #C2410C、薄荷 accent 调到 #047857 后全过）。
- 右上角绿 ✓ 仅在 `row.status === "available"` 时渲染，不给 taken/unknown 冒充可注册。

**B. 入口与布局决策**（任务允许「hover 弹出」或「Top Picks 卡片化」二选一，本轮做「三层递进」而非弹层）：
1. **Top Picks**（默认可见）：3 张 `lg` 卡，4:3（移动端 2:1 省高度）—— 首屏即有 Namelix 式观感。
2. **Grid 视图**：每张候选卡顶部品牌卡 4:3，与 Namelix 卡片墙同构；视图切换按钮加 `aria-pressed`，移动端触点 44px。
3. **紧凑行视图**：桌面每行加 28px `BrandSwatch`（同哈希配色 + 首字母，44px 触点按钮），点击就地展开「品牌卡 + 寓意 + 评分」面板（复用原评分展开态，不新增弹层/portal，零额外 JS）；移动端行宽预算不够（会把 12 字符域名截断），swatch 隐藏，改由「查看评分依据」展开同一面板。
   - 不做 hover 弹层的理由：触屏无 hover；弹层要 portal/定位/焦点管理，增量 JS 与可访问性成本都高于收益；就地展开还保留了键盘 ↑↓ 选中流。

**C. 不动的部分**：AI/核验/后端/SSE 事件结构零改动；`Row` 类型未变；旧 `BrandMark` 删除，调用点替换。

## 3. 验收对照表

| 要求 | 结果 | 证据 |
| --- | --- | --- |
| 确定性（同名同外观） | ✅ | 刷新前后 15 张卡 computed style 签名逐一相等（`ui.py` `deterministic: True 15`） |
| 多配色 / 首字母 mark + wordmark / 圆角 / 渐变 / 衬线+非衬线 | ✅ | 16 配色（4 渐变）× 4 版式 × 4 字形 × 3 形状，见 `r468-compare-desktop.png` |
| 无外部字体 / 无外部 API | ✅ | `performance.getEntries` 非本源资源 = `[]`（8 个场景全部） |
| 入口与布局（说明理由） | ✅ | 上文 §2-B 三层递进 |
| 移动端 375 无横向溢出 | ✅ | rows / rows-expanded / grid / light-en 四场景 `scrollWidth ≤ clientWidth` |
| 44px 触点 | ✅（新增控件） | swatch 按钮 44×44（sm+），视图切换 44×44（<sm）；Top Picks 内 32px 图标按钮为既有控件未动 |
| 暗色/亮色对比度 | ✅ | 卡片配色自带前景色，不依赖主题；`r468-light-en.png` |
| 双语 i18n | ✅ | `brand.preview` / `brand.previewTitle` / `brand.disclaimer`，`results.viewGrid` 改为「品牌卡视图 / Brand card view」 |
| 不动 AI/核验/后端/SSE | ✅ | diff 仅 `brand-card.tsx`（新）、`domain-row.tsx`、`results-page.tsx`、`i18n.tsx` + docs |
| bundle 增量 ≤ 15KB gzip | ✅ **+1.9KB gzip** | domain-row chunk 34.93→36.85KB，results-page 5.96→5.67KB，index 99.14→99.26KB，CSS 8.07→8.24KB（基线 vs 本分支 vite build 输出，JS 合计 +1.75KB gzip） |
| 本地全绿 | ✅ | `verify-r465` / `verify-r463` / `verify-r238` ALL PASS，`typecheck`、`build` 通过 |
| wrangler dev 恢复态渲染、桌面+375 并排截图 | ✅ | `r468-compare-desktop.png`、`r468-compare-375.png`、`r468-rows-expanded.png`、`r468-375-rows-expanded.png` |
| 不启用 Actions / 不提交密钥 / 不改测试 | ✅ | — |

## 4. 已知限制 / 下一步

- 衬线字形走系统栈：macOS/iOS 为 Georgia/Songti，Linux 截图机为 DejaVu Serif，观感因平台而异（Namelix 用 Google Fonts，我们主动不引外部字体）。
- 移动端行视图无 swatch（行宽预算），品牌观感靠 Top Picks + Grid；若后续要在行内也给线索，可考虑把评分徽章与 swatch 合并。
- 未做真实用户主观评分复测；建议下一轮 R464 同口径匿名盲评（Namelix vs 我们）复核 4.5 vs 4.0 差距是否收敛。
