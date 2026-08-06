# DomainHunter R9 线上验收审计 — 原始发现（RAW FINDINGS）

- 对象：生产站 https://hunt.zalize.com （Cloudflare Workers，feat/r8 部署）
- 方式：真实浏览器全流程走查（全程录屏）+ Lighthouse CLI + 竞品实测。未改任何产品代码。
- AI 搜索消耗：**2 / 4**（主搜索 1 次 + 锁定重搜 1 次），未触发限流。
- 证据目录：`docs/audit-r9/`（32 张截图）、`docs/audit-r9/lighthouse/`（4 份 JSON+HTML）。

---

## 置顶结论

**未发现 P0/P1（功能坏死、报错、限流异常）。** 全部核心流程（AI 搜索、结果页、锁定重搜、清单、分享、同步、监控、TLD 页、高级模式、中英/主题切换、375px 移动端）在生产环境实测通过。以下为 P2/P3 问题清单。

## P2 问题

### P2-1 四维评分无可展开的解释交互
- 页面/步骤：结果页 → 点击行/卡片上的四维评分（长度/读感/寓意/品牌感）。
- 期望：验收项要求"四维评分（可展开解释？）"——点击评分应展开单项解释。
- 实际：行与卡片均展示四个分值与进度条，但点击行本体/分值无任何展开；DOM 中无对应可展开控件。名字寓意有一句话说明，但四个维度各自没有解释。
- 截图：`06-results-row-view-kbnav.png`
- 建议分级：P2（验收清单明确提到的交互缺失/不明确）。

### P2-2 结果页价格为"参考价"且中美元混排，与"Porkbun 实时价"预期不完全一致
- 页面/步骤：结果页任意候选 → 价格 tooltip 显示"参考价 首年 ¥29 · 续费 ¥39/年"（.cn），.com 显示"首年 $11.08"。
- 期望：验收要求"价格显示（Porkbun 实时价）"。
- 实际：.com/.io/.ai 等价格与 Porkbun 当日价一致（/tld/ai 页明确标注"Porkbun 实时价"，$82.7 属实时数值），但 .cn 显示人民币固定 ¥29/¥39 且标注"参考价"；同一列表同时出现 ¥ 与 $ 两种货币，无统一换算开关。
- 截图：`04-results-top.png`、`16-tld-ai-page.png`
- 建议分级：P2（信息不一致易误导；若 .cn 参考价为有意设计，建议在 UI 标注来源并统一货币展示）。

### P2-3 移动端触控目标偏小（Lighthouse a11y 命中）
- 页面/步骤：Lighthouse mobile（/ 与 /tld/ai）→ "Touch targets do not have sufficient size or spacing"。
- 实际命中元素：页脚 TLD 指南链接（`/tld/ai?lang=zh` 等 12 个 font-mono 小链接）。
- 期望：≥44px 触控目标。
- 截图/证据：`lighthouse/home-mobile.report.html`
- 建议分级：P2。

## P3 问题

### P3-1 切到 EN 后浏览器标签页标题仍为中文
- 步骤：着陆页点 EN → 页面文案全部切换为英文，但 `document.title` 仍是「DomainHunter — AI 域名猎手」。
- 截图：`18-landing-english.png`（看浏览器标签）
- 建议分级：P3。

### P3-2 Lighthouse 可访问性命中：按钮无可访问名称 + 对比度不足
- header 左上 logo 按钮（`<button class="flex items-center gap-2 font-bold ...">`）无 accessible name；着陆页 `text-txt2` 小字（信任位/说明行）在暗色下对比度不足。
- 证据：`lighthouse/home-mobile.report.json`（button-name、color-contrast）
- 建议分级：P3。

### P3-3 控制台报错 ERR_BLOCKED_BY_CLIENT（Best Practices 扣分）
- Lighthouse desktop BP 92：console 记录 `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT`（疑似 Cloudflare beacon 被拦截，环境相关，非功能问题）。
- 建议分级：P3（可忽略或对 beacon 加容错）。

### P3-4 移动端未见专门"底部栏"
- 375px 下结果/清单页操作按钮堆叠在页面顶部区，未见吸底操作栏（结果页有"已锁定/导出/再来一轮"吸底条，桌面存在，移动端未系统验证其遮挡情况）。
- 截图：`20/21/22-mobile-*.png`
- 建议分级：P3（体验建议）。

### 未发现项（验证通过，无问题）
错别字/中英混排残留：逐页（着陆/结果/清单/分享/tld/高级模式）未发现明显错别字或 EN 模式下的中文残留（除 P3-1 标题外）；结果页 AI 寓意文案本身是中文数据，属预期。

---

## 通过项记录（全部 Pass）

| # | 项目 | 结果 | 证据 |
|---|------|------|------|
| 1 | 着陆页文案/模板 chips/三步说明/信任位/页脚 TLD 链接 | ✅ | 01、02 |
| 2 | AI 搜索 #1「AI 写作助手 SaaS 工具」：agent 时间线、逐轮进度、流式插入 | ✅ 2 轮 64 核验 35 可注册 25s | 03、04 |
| 3 | Top Picks + 四维评分展示 | ✅（展开解释见 P2-1） | 04 |
| 4 | 行/卡片视图切换 | ✅ | 05、06 |
| 5 | 键盘导航 ↑↓（行高亮）+ 快捷键提示 | ✅ | 06 |
| 6 | 已注册折叠区（"AI 真的筛过它们"，29→54 个） | ✅ | 07 |
| 7 | 导出 CSV（结果页，35 行含表头字段 8 列） | ✅ | 08 |
| 8 | 导出 TXT（清单页，2 域名） | ✅ | 32 |
| 9 | 加入候选清单（header 徽标 0→2） | ✅ | 06 |
| 10 | 锁定 scribo.cn + 围绕锁定再来一轮（AI #2）：第 3 轮 +17 新可注册，锁定项保留 Top1，底栏显示"已锁定 1 个" | ✅ | 09 |
| 11 | 清单页对比表（四维+参考价+监控列） | ✅ | 10 |
| 12 | 重新核验（时间戳更新，监控动态 +1） | ✅ | 11 |
| 13 | 监控开关（每 6 小时自动复查提示） | ✅ | 11 |
| 14 | 分享链接生成（30 天有效） | ✅ | 12 |
| 15 | 分享页只读 + CTA「我也要猎名」+ OG meta（含动态 `/api/og/<id>` 图） | ✅ curl 验证 og: 标签齐全 | 14 |
| 16 | 同步码生成（90 天）+ 隐身窗口导入「已导入 2 个新域名」 | ✅ | 13、15 |
| 17 | /tld/ai 指南页：Porkbun 实时价 $82.7、内容、内链 12 TLD、?lang 对齐 | ✅ | 16 |
| 18 | 高级模式 词根×前后缀×TLD：16 组合、3 可注册、13 已注册划线 | ✅ 不耗 AI 次数 | 17 |
| 19 | 中英切换全站无残留（见 P3-1）；暗/浅主题切换 | ✅ | 18、19 |
| 20 | 375px：着陆/清单/分享页 scrollWidth=375 无横向溢出，卡片化布局 | ✅ | 20、21、22 |

关键截图：

| AI 搜索流式（左） | 结果页 Top Picks（右） |
|---|---|
| ![streaming](https://app.devin.ai/attachments/f130deab-eb24-4721-8fb3-a3c85d5f1c98/03-ai-search-streaming.png) | ![results](https://app.devin.ai/attachments/3ba71e90-52d7-4453-87e4-d5ed6e06f3b9/04-results-top.png) |

| 锁定重搜后（锁定保留） | 候选清单页 |
|---|---|
| ![lock-rerun](https://app.devin.ai/attachments/b27bebd7-393f-4749-a5e0-ae2fa66ae5c5/09-lock-rerun-round3.png) | ![shortlist](https://app.devin.ai/attachments/46c27a6a-acd5-49fe-bf44-65212c328b74/10-shortlist-page.png) |

| 分享页（只读+CTA） | 隐身窗口同步码导入成功 |
|---|---|
| ![share](https://app.devin.ai/attachments/23672809-2109-4cab-993d-fd1f5003061f/14-share-page-readonly.png) | ![sync](https://app.devin.ai/attachments/96720e68-7030-4566-8abb-a4722ff24f5c/15-sync-import-incognito.png) |

| /tld/ai 指南页 | 高级模式组合核验 |
|---|---|
| ![tld](https://app.devin.ai/attachments/75afd9fd-53c2-4f21-a1bf-84ac77fc06fc/16-tld-ai-page.png) | ![adv](https://app.devin.ai/attachments/92761f35-2a5a-496e-b942-edb2200fc27e/17-advanced-mode.png) |

| EN 切换 | 浅色主题 |
|---|---|
| ![en](https://app.devin.ai/attachments/731795ce-d508-4dec-93de-d3bde319b59b/18-landing-english.png) | ![light](https://app.devin.ai/attachments/90303067-da7a-4f83-aaec-bd2c8a869eed/19-landing-light-theme.png) |

| 移动端 375 着陆 | 移动端 375 清单 | 移动端 375 分享页 |
|---|---|---|
| ![m1](https://app.devin.ai/attachments/2c110c92-9c16-4787-9bea-dcaa819fffe2/20-mobile-landing-375.png) | ![m2](https://app.devin.ai/attachments/ae93e218-7c35-4498-9e55-6490983ad53b/21-mobile-shortlist-375.png) | ![m3](https://app.devin.ai/attachments/72304323-3e03-48fe-9175-46b08dc62ba5/22-mobile-share-375.png) |

---

## Lighthouse（CLI，4 份，报告在 docs/audit-r9/lighthouse/）

| 页面 | 模式 | Perf | A11y | BP | SEO | TTFB | FCP | LCP | CLS |
|---|---|---|---|---|---|---|---|---|---|
| / | desktop | **100** | 95 | 92 | 100 | 34ms | 0.6s | 0.6s | 0 |
| / | mobile | **85** | 84 | 96 | 100 | 31ms | 3.2s | 3.5s | 0 |
| /tld/ai | desktop | **99** | 95 | 96 | 100 | 20ms | 0.8s | 0.8s | 0.013 |
| /tld/ai | mobile | **87** | 88 | 96 | 100 | 18ms | 3.2s | 3.2s | 0.017 |

- 主要建议：Reduce unused JavaScript（约 61 KiB）；a11y 三项见 P2-3/P3-2。
- 首屏 JS bundle：单文件 `/assets/index-DKeTtb1L.js` = **134 KB gzip（418 KB raw）**。
- 首页 TTFB（外部 curl 实测）≈ 0.145s；Lighthouse 本机 20–34ms。

---

## 竞品终验（对照 COMPETITIVE-GAP.md）

### dotfind.ai（截图 23–27）
- 搜索：/app 表单（描述+关键词+tone+TLD 多选），一次生成 100 名并行 DNS 核验，进度条 90/100 流式；结果 23/100 可注册。
- 呈现：等宽字体列表、B/C 字母评分（brandability 综合分数），**无价格**、无逐名寓意解释；Available/Taken/Saved 过滤 + 排序。
- 收藏：♡ 即入本地 shortlist 浮层，永久保存需注册（"Sign in to save"），可 Email me。
- 特色：Recheck、Share results permalink、Watch（掉落邮件提醒）、$39 Brand Kit 上卖、免费 2 次/天（匿名）。
- 移动 375px：单列布局正常。
- 对比 DomainHunter：DH 有实时价格、四维评分+中文寓意、免登录同步码、监控开关、TLD 指南、双语；DotFind 有 brand kit、email watch、结果 permalink（DH 分享链接等价）。搜索速度相近（~30s vs DH 16–25s）。

### instantdomainsearch.com（截图 28–31）
- 搜索：输入即出（as-you-type，无提交），800+ TLD 即刻列出，速度体验最优。
- 呈现：三列网格、taken/available 圆点、premium/aftermarket 价格（writely.net $2,988、writely.co $1,988 等）；无 AI 语义、无评分解释。
- 收藏：书签图标即存（header 徽标 +1），无需登录。
- 价格：注册链接跳 GoDaddy 联盟；aftermarket 报价直接内联。
- 移动 375px：单列正常，触控友好。
- 对比 DomainHunter：IDS 胜在即时性与 TLD 覆盖广度、aftermarket 报价；无 AI 构思/评分/寓意/清单对比/同步/监控，产品定位不同。

| DotFind 结果页 | IDS 结果页 |
|---|---|
| ![dotfind](https://app.devin.ai/attachments/d321be73-31d6-47dc-b046-1ddfdde5ec7d/25-dotfind-results.png) | ![ids](https://app.devin.ai/attachments/628f3d76-dbd8-49e3-bf0f-7abd5227fb38/29-ids-results.png) |

| DotFind 收藏/浮层 | IDS 收藏/价格 |
|---|---|
| ![dotfind-fav](https://app.devin.ai/attachments/4b96b4a7-7150-47fe-8c55-49c9a0ac9795/26-dotfind-favorite-shortlist.png) | ![ids-fav](https://app.devin.ai/attachments/f6b9723f-7b62-4537-b117-27b67e94d9b9/30-ids-favorite.png) |

| DotFind 移动端 | IDS 移动端 |
|---|---|
| ![dotfind-m](https://app.devin.ai/attachments/d135f7bf-23e0-4582-b88f-33b18041b404/27-dotfind-mobile-375.png) | ![ids-m](https://app.devin.ai/attachments/a57ab24a-341d-4122-a20d-aeac458b2cab/31-ids-mobile-375.png) |

维度速记（供终判）：AI 构思/寓意解释 DH 领先两者；实时核验三者均有（IDS 最快）；价格显示 DH>DotFind（无价），IDS 含 aftermarket 报价领先；收藏/清单 DH（免登录+同步+监控）> IDS（书签）> DotFind（需登录持久化）；分享 DH（只读页+OG）≈ DotFind（permalink）> IDS；移动端三者均无横向溢出；国际化 DH 独有双语；开源 DH 独有。

---

## 附：全部截图 URL 索引

01 https://app.devin.ai/attachments/733c513b-f010-436b-a4c7-fac2a7881ee5/01-landing-desktop-top.png
02 https://app.devin.ai/attachments/12d5b418-0f28-4737-b3bf-9a7f3442a87f/02-landing-desktop-footer.png
03 https://app.devin.ai/attachments/f130deab-eb24-4721-8fb3-a3c85d5f1c98/03-ai-search-streaming.png
04 https://app.devin.ai/attachments/3ba71e90-52d7-4453-87e4-d5ed6e06f3b9/04-results-top.png
05 https://app.devin.ai/attachments/4814a9e5-0cd0-4034-a08b-ea5b3e46a2e2/05-results-card-view.png
06 https://app.devin.ai/attachments/d9ab7be1-a165-4885-b189-4c18dc3cb740/06-results-row-view-kbnav.png
07 https://app.devin.ai/attachments/11cfea8b-beea-47aa-8eb9-8e3ab7b3e7bd/07-results-taken-expanded.png
08 https://app.devin.ai/attachments/de2cb040-8ec3-44a4-ab7a-2d2a7fb00a9c/08-export-csv-downloaded.png
09 https://app.devin.ai/attachments/b27bebd7-393f-4749-a5e0-ae2fa66ae5c5/09-lock-rerun-round3.png
10 https://app.devin.ai/attachments/46c27a6a-acd5-49fe-bf44-65212c328b74/10-shortlist-page.png
11 https://app.devin.ai/attachments/ca029c22-c0a5-4b78-bcde-5b3daa21cbfa/11-shortlist-recheck-monitor.png
12 https://app.devin.ai/attachments/32c39dd0-f38b-4dbd-a507-59427c6c4b10/12-share-link-generated.png
13 https://app.devin.ai/attachments/d21f5a00-31ca-4da2-9a19-5819fcb2379b/13-sync-code-generated.png
14 https://app.devin.ai/attachments/23672809-2109-4cab-993d-fd1f5003061f/14-share-page-readonly.png
15 https://app.devin.ai/attachments/96720e68-7030-4566-8abb-a4722ff24f5c/15-sync-import-incognito.png
16 https://app.devin.ai/attachments/75afd9fd-53c2-4f21-a1bf-84ac77fc06fc/16-tld-ai-page.png
17 https://app.devin.ai/attachments/92761f35-2a5a-496e-b942-edb2200fc27e/17-advanced-mode.png
18 https://app.devin.ai/attachments/731795ce-d508-4dec-93de-d3bde319b59b/18-landing-english.png
19 https://app.devin.ai/attachments/90303067-da7a-4f83-aaec-bd2c8a869eed/19-landing-light-theme.png
20 https://app.devin.ai/attachments/2c110c92-9c16-4787-9bea-dcaa819fffe2/20-mobile-landing-375.png
21 https://app.devin.ai/attachments/ae93e218-7c35-4498-9e55-6490983ad53b/21-mobile-shortlist-375.png
22 https://app.devin.ai/attachments/72304323-3e03-48fe-9175-46b08dc62ba5/22-mobile-share-375.png
23 https://app.devin.ai/attachments/52fad42d-aebc-4533-8b54-b63c263fae8e/23-dotfind-landing.png
24 https://app.devin.ai/attachments/3c15c022-a35c-4eff-8b23-d82b56b90253/24-dotfind-app-form.png
25 https://app.devin.ai/attachments/d321be73-31d6-47dc-b046-1ddfdde5ec7d/25-dotfind-results.png
26 https://app.devin.ai/attachments/4b96b4a7-7150-47fe-8c55-49c9a0ac9795/26-dotfind-favorite-shortlist.png
27 https://app.devin.ai/attachments/d135f7bf-23e0-4582-b88f-33b18041b404/27-dotfind-mobile-375.png
28 https://app.devin.ai/attachments/01f260b2-7492-48eb-9f04-da99d8075429/28-ids-landing.png
29 https://app.devin.ai/attachments/628f3d76-dbd8-49e3-bf0f-7abd5227fb38/29-ids-results.png
30 https://app.devin.ai/attachments/f6b9723f-7b62-4537-b117-27b67e94d9b9/30-ids-favorite.png
31 https://app.devin.ai/attachments/a57ab24a-341d-4122-a20d-aeac458b2cab/31-ids-mobile-375.png
32 https://app.devin.ai/attachments/1c04c7d4-9c24-4b5e-a949-47cce7efe5b6/32-shortlist-txt-export.png
