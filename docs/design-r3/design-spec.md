# DomainHunter · R3 UI 设计规范（design-spec）

> 依据：`docs/research/design-study.md`（14 站标杆调研）P0 建议 #1 #2 #6 #7 #10 #11 #18 全部落实，P1 建议 #4 #8 #13 #21 #23 纳入。
> 实现约束：React + Tailwind CSS + shadcn/ui + lucide-react；暗色默认 + 浅色可切（同一 token 体系）；域名一律等宽字体；移动端 375px 无横向滚动。
> 原型：`prototype/`（Tailwind CDN 静态 HTML，右上角按钮可实时切换暗/浅色）；截图：`screenshots/`。

## 1. 设计语言总览

- 基调：**暗色默认**（linear/raycast/v0 的 AI 工具事实标准），灰阶层次法（页面→卡片→悬浮层逐级 +4~6% 亮度，1px 白 8% 边框），单一强调色纪律（猎手绿仅用于可注册状态、主 CTA、进度）。
- 渐变光晕全站仅着陆页 hero 一处（`--glow`）。
- 域名 = 等宽字体（JetBrains Mono）+ TLD 弱化色，是所有页面的视觉锚点。
- kbd 快捷键元素（Space 再来一轮、↑↓/C/S/⏎ 键盘导航）传达效率工具气质。

## 2. 颜色 Token（CSS 变量，见 `prototype/_tokens.css`，映射 shadcn CSS 变量）

### 暗色（默认，`:root`）

| Token | 值 | shadcn 对应 | 用途 |
|---|---|---|---|
| `--bg-0` | `#0B0C0E` | `--background` | 页面背景 |
| `--bg-1` | `#131519` | `--card` | 卡片 |
| `--bg-2` | `#1A1D23` | `--popover` / 输入框 | 悬浮层、复合输入框 |
| `--bg-3` | `#22262E` | `--muted` | hover 态、骨架、条形图底 |
| `--line` | `rgba(255,255,255,0.08)` | `--border` | 边框 |
| `--line-strong` | `rgba(255,255,255,0.14)` | — | 输入框/强调边框 |
| `--txt-0` | `#EDEFF2` | `--foreground` | 主文字 |
| `--txt-1` | `#9AA1AB` | `--muted-foreground` | 次要文字 |
| `--txt-2` | `#5C636D` | — | 弱文字/占位 |
| `--brand` | `#4ADE80` | `--primary` | 主 CTA、可注册、进度 |
| `--brand-ink` | `#052E16` | `--primary-foreground` | 绿底文字 |
| `--brand-dim` | `rgba(74,222,128,0.12)` | — | 绿色弱底（徽章/选中 chip） |
| `--brand-line` | `rgba(74,222,128,0.28)` | — | 绿色边框（锁定/Top Pick 卡） |
| `--amber` | `#FBBF24` | — | 核验中/未知 |
| `--taken` | `#6B7280` | — | 已注册（灰，非红） |
| `--gold` | `#F5C044` | — | 90+ 评分徽章 |
| `--glow` | 顶部径向渐变绿 14% | — | 仅 hero 一处 |

### 浅色（`.light` 类反转，同一 token 名）

`--bg-0 #FAFAF9`、`--bg-1 #FFFFFF`、`--bg-2 #F4F4F5`、`--line rgba(0,0,0,.08)`、`--txt-0 #18181B`、`--brand #059669`（提高对比度）、其余语义同名反转（完整值见 `_tokens.css`）。实现上映射为 shadcn 的 `.light`/`:root` 双主题 CSS 变量，`darkMode: 'class'`，默认 `<html class="dark">`。

### 状态语义

| 状态 | 色 | 呈现 |
|---|---|---|
| 可注册 available | `--brand` 绿 | 实心状态点 + 绿字徽章/按钮 |
| 已注册 taken | `--taken` 灰 | 域名划线 + 灰徽章 + 行整体 50% 透明度，短暂展示后收进折叠区 |
| 核验中 checking | `--amber` 琥珀 | 呼吸动画状态点 + 「RDAP 核验中…」 |
| 未知 unknown | `--amber` 琥珀 | 徽章 |

### 评分色阶（P1#21）

| 分数 | 徽章 |
|---|---|
| ≥90 | 金 `--gold` / `--gold-dim` 底 |
| 80–89 | 绿 `--brand` / `--brand-dim` 底 |
| 70–79 | 绿（同上，权重次之） |
| <70 | 灰 `--bg-3` 底 + `--txt-1` 字 |

四维分（长度/读感/寓意/品牌感）用 4px 高条形微图（`--bg-3` 底 + `--brand` 填充）+ tabular-nums 数字，替代 R2 的四个数字格。

## 3. 字体

- 正文/UI：`Inter, "PingFang SC", "Noto Sans SC", system-ui, sans-serif`
- 域名/分数/价格/日志：`"JetBrains Mono", ui-monospace, monospace`；数字一律 `font-variant-numeric: tabular-nums`
- Display 标题：字重 800，`tracking -0.03em`（linear 式收紧），桌面 52px / 移动 26–30px
- 字号阶梯：10（微标签）/ 11 / 12 / 13 / 14 / 15（行内域名）/ 20 / 24（卡片域名）/ 52（H1）
- 域名字重 600–700；TLD 部分用 `--txt-2` 弱化

## 4. 间距 / 圆角 / 阴影 / 动效

- 间距：8px 网格；行高 48px（紧凑行）/ 44px（移动触控最低）；卡片内边距 16–20
- 圆角：按钮/输入 8px（`rounded-lg`）、卡片 12px（`.card`）、复合输入框 16px、徽章胶囊 full、手机框 28px
- 阴影：仅复合输入框与手机框一档 `0 24px 48px -24px rgba(0,0,0,.5)`；卡片靠 1px 边框分层，不用投影
- 动效：结果行入场 `fadeUp 300ms`（流式 stagger 60ms）；核验状态点 `breathe 1.6s`；spinner `spin 1s`；全部遵守 `prefers-reduced-motion`
- 顶栏/底栏：`backdrop-blur(12px)` + 85–92% 透明度背景

## 5. 组件 → shadcn/ui 映射

| 设计元素 | shadcn/ui 组件 |
|---|---|
| 复合输入框 | `Textarea`（无边框）+ 底部工具条 div；整体一个带边框容器 |
| TLD 多选 chips | `ToggleGroup type="multiple"`（收进输入框工具条） |
| 风格/长度迷你下拉 | `DropdownMenu` 或 `Select`（触发器为小号 outline Button） |
| 示例模板 chips | `Button variant="outline" size="sm" rounded-full`，onClick 填充+自动开跑 |
| 主题切换 | `Button variant="outline" size="icon"` + `next-themes` 式 class 切换 |
| 步骤清单 | 自定义时间线（div + 左侧连线）+ `Check`/`Loader2`/`Circle` 图标三态 |
| 微日志 | `<pre>` 式滚动容器（mono 11px，最多显示 3 行，auto-scroll） |
| 紧凑行 | div 行（h-12）+ `divide-y`；选中态 `inset 2px 0 0 var(--brand)` |
| 视图切换（行/卡） | `ToggleGroup type="single"`（rows-3 / layout-grid 图标） |
| 评分徽章 | `Badge` 自定义色阶（§2） |
| 四维条形微图 | 自绘 div 条（或 `Progress` 4px 高变体） |
| Top Picks 大卡 | `Card`；第一名加 `--brand-line` 边框 |
| 锁定 | `Toggle`（lock 图标；激活态绿边框绿字），tooltip「再来一轮时围绕它找」 |
| 过滤条 | `Tabs`/`ToggleGroup`（状态计数、TLD 计数）+ `DropdownMenu`（排序） |
| 已占用折叠区 | `Collapsible`（划线 mono 文本 wrap） |
| 候选清单对比表 | `Table`（桌面）；移动降级为 `Card` 列表 |
| 注册商价格下拉 | `DropdownMenu`（2–3 家注册商首年/续费价对比） |
| 底部 sticky 操作栏 | 固定 div + blur（shadcn 无 AppBar） |
| 移动参数抽屉 | `Sheet`（bottom）或 `details`（原型用 details 表意） |
| 骨架行 | `Skeleton` |
| 快捷键提示 | `<kbd>`（`_tokens.css` 已给样式） |

lucide 图标：`crosshair`(logo)、`sparkles`、`bookmark`/`bookmark-check`、`lock`、`copy`、`download`、`rotate-cw`、`trophy`、`brain`、`list-checks`、`loader-2`、`check`、`circle`、`pencil`、`sliders-horizontal`、`rows-3`、`layout-grid`、`arrow-down-wide-narrow`、`shield-check`、`zap`、`sun-moon`、`external-link`、`trash-2`、`square`、`history`、`wand-2`、`ruler`、`chevron-down`。

## 6. 页面与交互说明

### ① 着陆页（01-landing.html）— P0#1 #2
- 单焦点结构：徽章 → H1 → 一句副标题 → **复合输入框** → 示例 chips → 信任锚点一行小字。特性卖点不再占三张卡。
- 复合输入框 = textarea(3 行) + 底部工具条：TLD 多选 chips（选中=绿底）、风格/长度迷你下拉、⌘Enter 提示、框内右下「开始猎取」主按钮。
- 示例 chips 点击 = 填充并自动开跑（P1#3）。
- 顶栏常驻「候选清单(N)」入口（P1#4 落点）。
- 信任锚点：「已实时核验 128,940 个域名 · 流式返回 · 开源 MIT」（P1#5）。

### ② 生成中（02-generating.html）— P0#6 #10 #11
- 桌面双栏：左 320px 固定（sticky）= AI 需求理解卡（可编辑）+ TLD/风格/长度参数（改动即重跑按钮）+ **Agent 过程步骤清单**；右 = 实时结果流。
- 步骤清单：第 N 轮 → 构思/RDAP+DNS 核验/评分 三子步骤，三态图标（✓ 完成 / spinner 进行 / ○ 待定），进行中步骤下挂 **mono 微日志**（「✓ briefkit.ai — available」「→ 正在核验 digestly.com…」）。
- 流式结果：核验通过立即以紧凑行插入（fadeUp 入场）→ 其下：被占用行（划线灰、50% 透明，短暂展示后收进折叠区）→ 核验中行（琥珀呼吸点）→ 骨架行 ×3。
- 顶栏实时计数：「第 2 轮进行中 · 已核验 31 · 可注册 7」。
- 第 1 轮结果保留在下方（P1#14 轮次历史，不覆盖）。
- 移动端：左栏折叠为顶部 `details` 抽屉，结果单列。

### ③ 结果页（03-results.html）— P0#7 + P1#8 #13 #21
- 摘要行：「猎到 12 个可注册」+ 过程数据（3 轮/核验 48/用时 52s）+ 导出 + 「再来一轮 (Space)」。
- **Top Picks**：评分前 3 大卡（完整寓意 + 四维条形 + 注册商价格按钮）；第一名绿边框。
- 过滤工具条：状态 chips（可注册 12/全部 48/已注册 36）、TLD chips（计数）、排序、键盘快捷键提示、**行/卡视图切换（默认行）**。
- 紧凑行：48px 高 = 评分徽章 + 等宽域名 + 状态点 + 寓意截断 + 价格 + hover 快捷操作（锁定/复制/收藏）+ 去注册；一屏 12–16 行。
- 键盘导航：↑↓ 选中（左侧 2px 绿指示条）、C 复制、S 收藏、Enter 注册。
- 已占用 36 个收进 `Collapsible` 折叠区（核验数字有体感）。
- 底部 sticky：已锁定 N 个（列出域名）+ 导出 + 「围绕锁定项再来一轮」。

### ④ 候选清单（04-shortlist.html）— P1#4
- 顶栏清单入口高亮为当前页；副标题注明「本地保存（localStorage，跨会话）· 注册前重新核验」。
- 桌面 = 对比表：域名+寓意 / 综合徽章 / 四维条形并排 / 状态 / 首年+续费双价（porkbun 式透明）/ 复制/删除/去注册。
- 失效行（收藏后被人注册）：划线 + 「找相似」让 AI 补位。
- 操作：导出 CSV/TXT、批量去注册。
- 移动 = 卡片列表；页面附空态设计说明。

### ⑤ 移动端（05-mobile.html）— P1#23 #24
- 一屏一事三屏（375px 手机框并排展示）：输入屏（全屏输入框+工具条参数）/ 过程屏（步骤清单+微日志+已流入结果）/ 结果屏（Top Pick 大卡+单列紧凑行+底部 sticky「清单/导出/再来一轮」栏）。
- 触控目标 ≥44px；行内小图标操作改为整行左滑/长按；所有页面 375px 无横向滚动（01–04 亦响应式）。

## 7. 与 R2 的差异摘要

| 维度 | R2 | R3 |
|---|---|---|
| 主题 | 浅色 only | **暗色默认** + 浅色可切（同 token） |
| 着陆 | 表单区 + 三特性卡 | prompt-first 单焦点 + 复合输入框 |
| 生成页 | 三段跳转、无流式 | 双栏一屏闭环 + 步骤清单微日志 + 流式先到先显示 |
| 结果密度 | 双列大卡 4–6/屏 | 紧凑行 12–16/屏（默认）+ 卡片可切 + Top Picks |
| 评分 | 环形 + 四数字格 | 色阶徽章 + 条形微图 |
| 收藏 | 无落点 | 候选清单页（对比/导出/批量注册/失效重核验） |
| 交互 | 再来一批 | 锁定 + 围绕锁定再来一轮 + 键盘导航 + 轮次历史 |
