# DomainHunter R9 全面验收审计计划（线上 https://hunt.zalize.com）

产出物：docs/audit-r9/ 下截图（编号命名）、lighthouse/ 下 4 份报告、RAW-FINDINGS.md（P0-P3 分级问题清单）、录屏。

硬约束：AI 搜索全程 ≤4 次（预算：主搜索 1 次 + 锁定重搜 1 次，保留 2 次备用）。不改产品代码。全程录屏（浏览器部分）。

## 1. 桌面全站走查（录屏）
1.1 着陆页：截图，检查文案/行业模板 chips/三步说明/信任位/页脚（含 /tld 链接）。Pass: 各区块渲染完整、无乱码/混排。
1.2 AI 搜索 #1（"AI 写作助手 SaaS 工具"）：观察 agent 时间线/进度、流式结果逐条出现。Pass: 有进度反馈，结果流式渲染，无报错。
1.3 结果页逐项：Top Picks 区、四维评分（点击是否可展开解释）、行/卡片视图切换、键盘导航（↑↓/Enter）、已注册折叠区展开、价格显示（应为 Porkbun 实时价而非静态表）、导出 CSV/TXT（验证下载内容）、加入候选清单。每项截图，Pass/Fail 记录。
1.4 锁定 + 重新搜索（AI 搜索 #2）：锁定 1-2 个结果后重搜，Pass: 锁定项保留、新结果补充。
1.5 候选清单页：对比表、重新核验按钮、分享链接生成 → 打开分享页验证只读 + CTA + OG meta（view-source 或 curl 查 og: 标签）、同步码生成与导入（新建隐身/清 localStorage 验证导入）、监控开关。
1.6 /tld/ai + 页脚另 1-2 个 /tld 页：内容质量、内链、语言与当前 UI 语言对齐（?lang= 参数）。
1.7 高级模式：词根×前后缀组合搜索（不消耗 AI 次数），Pass: 生成组合并核验。
1.8 中英切换：切 EN 后全站（着陆/结果/清单/tld 页）无中文残留；切回。暗/浅主题切换正常。

## 2. 移动端 375px（DevTools emulation）
着陆 → 已有结果页 → 清单 → 分享页。检查：无横向溢出（document.scrollingElement.scrollWidth ≤ 375）、触控目标 ≥44px 体感、底部栏存在且不遮挡。截图各页。

## 3. 视觉与文案
逐页记录字号/间距/对齐/配色不一致、错别字、中英混排残留，编入问题清单。

## 4. Lighthouse（CLI，非录屏）
npx lighthouse 对 / 和 /tld/ai 各跑 desktop+mobile 共 4 份，JSON+HTML 存 docs/audit-r9/lighthouse/。记录四项分数、TTFB、主要建议；curl -sI + 下载 JS 记录首屏 bundle gzip 大小。

## 5. 竞品终验（录屏）
dotfind.ai 与 instantdomainsearch.com：各一次搜索，观察结果呈现/收藏/导出/价格/移动端（375px），各 3-5 张截图。对照 COMPETITIVE-GAP.md 14 个维度记录证据。

## 报告
RAW-FINDINGS.md：P0/P1 置顶；每问题含页面/步骤、期望 vs 实际、截图文件名、建议分级。
