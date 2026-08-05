# DomainHunter · R2 UI 设计规范（design-spec）

> 约束：React + Tailwind CSS + shadcn/ui + lucide-react；所有样式均可用 shadcn 默认主题变量表达，移动端优先（375px 无横向滚动）。

## 1. 设计语言总览

- 基调：**浅色 shadcn 语言**（zinc 中性 + emerald 品牌绿），克制留白、卡片化信息、语义状态色。
- 现代感来源：① 结果卡片（域名等宽字 + 评分环 + 状态徽章）② Agent 分轮进度时间线 ③ 原位「检测中 → 可注册/已注册」翻转 ④ 徽章过滤条。
- 竞品对齐：DotFind 的评分卡片流、instantdomainsearch 的四态徽章过滤与注册商下拉、namelix 的风格筛选。

## 2. 颜色 Token（shadcn CSS 变量，HSL）

| Token | 值 | 用途 |
|---|---|---|
| `--background` | `0 0% 100%` | 页面背景 |
| `--foreground` | `240 10% 3.9%` | 主文字（zinc-950） |
| `--card` | `0 0% 100%` | 卡片背景 |
| `--muted` | `240 4.8% 95.9%` | 弱底（zinc-100） |
| `--muted-foreground` | `240 3.8% 46.1%` | 次要文字（zinc-500） |
| `--border` | `240 5.9% 90%` | 边框（zinc-200） |
| `--primary` | `160 84% 39%` | 品牌绿 emerald-600 `#059669` |
| `--primary-foreground` | `0 0% 100%` | 主按钮文字 |
| `--ring` | `160 84% 39%` | 焦点环 |
| `--radius` | `0.75rem` | 基准圆角 |

### 状态色（语义，不复用品牌绿以外的 primary）

| 状态 | 色 | Tailwind | 用法 |
|---|---|---|---|
| 可注册 available | emerald | `emerald-600` 文字 / `emerald-50` 底 / `emerald-200` 边 | Badge + 卡片左侧 2px 描边高亮 |
| 已注册 taken | rose | `rose-600` / `rose-50` / `rose-200` | Badge；卡片整体降透明度 60% |
| 检测中 checking | amber | `amber-600` / `amber-50` / `amber-200` | Badge + `animate-pulse` 圆点 |
| 未知 unknown | slate | `zinc-500` / `zinc-100` / `zinc-200` | Badge |

评分色阶：≥85 `emerald-600`；70–84 `lime-600`；55–69 `amber-600`；<55 `zinc-400`。

## 3. 字体

- 正文/UI：`Inter, "PingFang SC", "Noto Sans SC", system-ui, sans-serif`
- 域名/代码：`"JetBrains Mono", ui-monospace, monospace`（域名一律等宽，视觉锚点）
- 字号阶梯：12 / 14（正文）/ 16 / 18 / 24 / 30 / 36（H1，移动端 30）；行高 1.5，标题 1.2
- 字重：域名 600；标题 700；正文 400；徽章 500

## 4. 间距 / 圆角 / 阴影

- 间距：4px 基（Tailwind 标尺）；卡片内边距 16（移动）/ 20（桌面）；区块间 24–32；页面左右留白 16（移动）/ 24+
- 容器：内容最大宽 `max-w-3xl`（表单页）/ `max-w-5xl`（结果页），居中
- 圆角：按钮/输入框 `rounded-lg`(8)；卡片 `rounded-xl`(12)；徽章/胶囊 `rounded-full`
- 阴影：卡片 `shadow-sm`，hover `shadow-md` + `border-emerald-300` 过渡 150ms；不使用重投影
- 动效：状态翻转 150ms ease；checking 圆点 `animate-pulse`；轮次进度条宽度过渡 500ms

## 5. 组件 → shadcn/ui 映射

| 设计元素 | shadcn/ui 组件 |
|---|---|
| 描述输入 | `Textarea` |
| TLD 选择胶囊 | `ToggleGroup`（multiple）或 `Badge` + 受控态 |
| 风格筛选 | `Select`（极客/商务/文艺/拼音） |
| 主按钮/次按钮/图标按钮 | `Button`（default / outline / ghost / icon） |
| 状态徽章、过滤徽章 | `Badge`（variant 自定义语义色） |
| 结果卡片 | `Card` |
| 评分环 | 自绘 SVG（stroke-dasharray），或 `Progress` 降级 |
| 分轮进度 | `Progress` + 自定义时间线（div+border） |
| 需求理解确认条 | `Alert` + `Button` (ghost, 编辑) |
| 注册商跳转 | `DropdownMenu`（阿里云/腾讯云/Namecheap/Cloudflare） |
| 复制/收藏/导出 | `Button`(icon, ghost) + `Tooltip`；导出 `DropdownMenu`（CSV/TXT） |
| 只看可注册开关 | `Switch` |
| 移动端底部操作 | 固定底栏 `div` + `Button`（shadcn 无 AppBar，用布局实现） |
| 骨架占位 | `Skeleton` |

lucide 图标：`Sparkles`（AI）、`Search`、`Copy`、`Star`、`Download`、`RefreshCw`（再来一批）、`ExternalLink`、`Check`、`X`、`Loader2`（spin）、`Filter`、`ChevronDown`、`Pencil`。

## 6. 页面结构要点

1. **首页**：居中 hero（H1 + 副标题）→ 描述 Textarea（示例 placeholder + 快捷示例 chips）→ TLD 多选胶囊 + 风格 Select → 大主按钮「AI 帮我找」；顶部简洁导航（Logo + GitHub + 高级模式）。
2. **Agent 进行中**：顶部固定「需求理解」Alert（AI 复述 + 编辑）；分轮时间线（第 N 轮 · 构思 → 核验 → 反思）；结果卡片先以名字+寓意 + `checking` 徽章出现，核验完成原位翻转为 available/taken；底部统计条（已找到 X 个可注册 / 目标 10）。
3. **结果列表**：徽章过滤条（全部/可注册/已注册/未知 + 只看可注册 Switch）+ 排序（评分）；可注册优先分组置顶；卡片含评分环、寓意、维度小条（长度/读感/寓意/品牌感）、注册商 Dropdown、复制/收藏；顶部操作区：导出、再来一批。
4. **移动端（375px）**：单列卡片；TLD 胶囊横向 wrap；过滤条横向滚动（仅该条内部滚动）；底部固定操作栏（再来一批 + 导出）；触控目标 ≥44px。
