# R567 生产零 AI 回归报告 — R563 + R564

- 目标：https://hunt.zalize.com，Worker `151ecbf1`（deploy/r192-r195 @ `a4f3c6a`，本地 checkout 同 commit）
- 时间：2026-09-06 20:28–20:47 UTC；执行方式：会话 Chrome 133 via CDP :29229 + Playwright `page.on('request')` 全程计数；SSR 用 `curl -A Mozilla`；所有页面带 `?cb=`
- 硬约束结果：`/api/ai-search` 请求 **0**；未点「开始猎取」/示例 chip/再来一轮；`/api/check` 共 **3** 次（预算 ≤5）；usage `searches/fast/refine` **0→0**，`aiErrors`/`llmProvider` 字段当天不存在（=0）；storage 字节级还原（md5 `90ae6846b289259ce2e6d2f88b835097` 前后一致）；监控列表回到 `entries:[]`
- 分级：**P0 0 / P1 0 / P2 0 / P3 2（口径/备注类，见下）**；1 项断言未能在生产触发（reserved 行）→ 标「未验证」

## 结论表

| T | 内容 | 结论 | 级别 | 证据 |
|---|---|---|---|---|
| T1 | `/?q=chaxiang`、`/?q=chaxiang.com` desktop 1280：精确核验 tab `aria-pressed=true`；请求恰 1 次 `POST /api/search`，0 `ai-search`，0 `/api/check`；`[data-quick-check]` 结果区在视口内（top 16 / bottom 266 / innerHeight 1069，scrollY 729 = 已自动滚动） | 验证过 ✅ | — | `t1-desktop.json`，`docs/qa/screenshots-r567/t1-desktop.png`，results.log 20:32 |
| T2 | 同两 URL 375×740 CDP 模拟：tab / 1 次 search / 结果区在视口内（scrollY 833）；`documentElement.scrollWidth`=`clientWidth`=`body.scrollWidth`=375，文档不可横向滚动 | 验证过 ✅ | P3 备注 | `t1-375.json`，`docs/qa/screenshots-r567/t1-375.png`、`docs/qa/screenshots-r567/t2-375-landing.png`。脚本「任一元素 right>375」命中 1 个元素，为 TLD 筛选条内部 `overflow-x-auto` 滚动容器的子项（设计上可横滑），非文档溢出 → 脚本假阳性 |
| T3 | `/?q=茶叶电商，寓意清雅`：AI 猎名 tab 选中、无 quick-check 面板、`/api/search|ai-search|check` 请求 0（未点开始猎取） | 验证过 ✅ | — | `t3t4.json`，`docs/qa/screenshots-r567/t3-ai-landing.png` |
| T4 | `/?mode=exact`：精确 tab 选中、搜索类请求 0 | 验证过 ✅ | — | `t3t4.json`，`docs/qa/screenshots-r567/t4-mode-exact.png` |
| T5 | unknown 行：`chaxiang.ai` `data-unknown-reason="rate-limited"`，文案「注册局限流，稍后重试」；header EN → "Registry rate-limited — retry shortly"，切回 zh 复原；页面所有 `[data-unknown-reason]` ∈ 允许类别集合；DOM 中无原始 `http-429` | 验证过 ✅ | — | `t5t6.json`，`docs/qa/screenshots-r567/t5-reason-zh.png`、`docs/qa/screenshots-r567/t5-reason-en.png` |
| T5b | reserved unknown 行无重试按钮 | **未验证** | — | 本轮生产返回结果中未出现 `reserved` 行（chaxiang.* 全部 taken/available/rate-limited），断言为空集通过，不计为验证 |
| T6 | desktop 点 `[data-recheck="chaxiang.ai"]`：新增请求恰 1 条 `POST /api/check?refresh=1`，body `{"domains":["chaxiang.ai"],"refresh":true}`，响应 200 `application/x-ndjson`，0 `/api/search`；结果仍 rate-limited（上游 .ai 429，预期） | 验证过 ✅ | — | `t5t6.json`，`docs/qa/screenshots-r567/t6-after-recheck.png` |
| T7 | 375：所有 `[data-recheck]` 44×44；Tab 焦点到 `chaxiang.net` 重试按钮，Enter → 恰 1 条 `/api/check?refresh=1`（body chaxiang.net）200 NDJSON；taken chip 域名 `scrollWidth==clientWidth`、textContent 完整（无 `chax…`） | 验证过 ✅ | — | `t7.json`，`docs/qa/screenshots-r567/t7-375-after-enter-recheck.png` |
| T8 | 首页 `/?q=google` desktop+375：google.com 行「已注册 · 2028-09-14 到期 · ★ · 开监控 · 重新核验」，行 HTML 无「去注册」/ `$¥元` 价格；1 次 `/api/search` | 验证过 ✅ | — | `t8t11.json`，`docs/qa/screenshots-r567/t8-google-taken-row.png` |
| T9 | `/advanced` 粘贴 `google.com nic.cn chaxiang.ai r564zz68883.cn` → 「核验 4 个域名」：1 次 `POST /api/search`（body 4 域名），0 ai-search / 0 check；google.com taken+2028-09-14+★+开监控+重新核验、nic.cn taken 无到期+★+开监控+重新核验、chaxiang.ai `rate-limited`「注册局限流」+重新核验、随机 .cn 可注册（首年 ¥33 + 去注册，仅可注册行有价格） | 验证过 ✅ | — | `t9.json`、`t9-rows.json`，`docs/qa/screenshots-r567/t9-advanced-bulk.png`、`docs/qa/screenshots-r567/t9-advanced-rows-zoom.png`。首跑 3 条 FAIL 为脚本行选择器错误（advanced 行为 button 直接父 div），改选择器后同页复核 PASS |
| T10 | 结果页：写 `sessionStorage dh:lastSearch:v1`（taken google.com expiresAt / taken nic.cn / unknown chaxiang.ai detail=http-429 / available）→ `/?cb=` 恢复 → 点「全部 4」：taken 行同 T8 断言、nic.cn 无到期、chaxiang.ai `rate-limited` 类别+文案+重新核验；恢复过程 0 search/ai-search/check；再点 chaxiang.ai 重新核验 → 恰 1 条 `/api/check?refresh=1` 200 NDJSON，按钮「核验中…」后复原，仍 rate-limited | 验证过 ✅ | — | `t10.json`、`t10-fix.json`，`docs/qa/screenshots-r567/t10-results-all.png`、`docs/qa/screenshots-r567/t10-results-after-recheck.png`。nic.cn 首跑 FAIL 同为选择器向上爬过头，复核 PASS |
| T11 | 首页 google.com「开监控」→ `POST /api/monitor`，行变「监控中 ✓」、`/api/monitor/list` 含 google.com → 5s 内两步「确认取消？」→ list 不含、行回「开监控」、`localStorage domainhunter:monitor` 回 `[]`、list 回 `{"entries":[],"monitored":2,"limit":500}` | 验证过 ✅ | P3 备注 | `t8t11.json`，`docs/qa/screenshots-r567/t11-watching.png`、`t11-confirm-cancel.png`、`t11-after-cancel.png`。脚本第 1 条 FAIL 是断言时机（读取时 UI 已进入「确认取消？」倒计时态），后续断言证明添加/取消均成功。副作用：开监控 CTA 同时把 google.com 加入 `domainhunter:shortlist`（预期行为，还原时已回滚） |
| T12 | R563 `/vs/mx-vs-es`、`/vs/de-vs-com` × zh/en SSR：`<meta description>`、og:description、twitter:description、Article JSON-LD description、FAQPage 首答、可见首条 FAQ 6 处价格数字集合相同、非空，且 ⊆ 价格表单元格（en 为表格 USD 四舍五入：$35.57→$36、$41.23→$41、$3.x→$3；zh 精确匹配）；`<script>` 外 `{{` 0 | 验证过 ✅ | P3 口径 | `t12/summary.json`、`t12/verdict.log`、`t12/*.html`。**口径说明**：原始 SSR HTML 中 `{{price:…}}` 出现 12–24 次，全部位于内联 `window.__DH_CONTENT__` 水合数据脚本内（序列化的 compares 源内容，客户端渲染时再解析）；水合后 DOM 正文/meta/JSON-LD `{{` = 0（CDP 实测 3 页）。若「0 anywhere」按原始字节口径，则不满足；按可见/可抓取输出口径满足 |
| T13 | 随机 3 页 `kaufen-vs-shop`、`pl-vs-eu`、`sk-vs-cz` zh/en 同 T12 | 验证过 ✅ | — | `t12/verdict.log` 6/6 PASS |
| T14 | 二级后缀：`/vs/co-th-vs-com` 404（hub 无此页）；改用 `/vs/th-vs-vn` zh/en：meta 含「(.co.th 更便宜)」/"(.co.th is cheaper)"，co.th 无数字价，.th/.vn 数字与表格一致；`{{` 0 | 验证过 ✅ | — | `t12/verdict.log` rel=True，summary th-vs-vn meta 文本 |
| T15 | 所有访问页面 console error + pageerror（排除 404/410 资源）= 0：首页 ×8、/advanced、/results 恢复、/vs ×4、/mcp | 验证过 ✅ | — | 各 t*.json `console` 字段，results.log「0 JS error」 |
| T16 | Lighthouse 13.4.1（headless Chromium）`/` 与 `/vs/de-vs-com`：SEO 100 / Accessibility 100，无未通过 audit | 验证过 ✅ | — | `lh/home.json`、`lh/vs.json` |
| T17 | usage 前 20:28:44 → 后 20:44:29（距最后一次页面活动 ≥60s，no-cache）：`searches 0→0, fast 0→0, refine 0→0`，`aiErrors`/`llmProvider`/`fallbacks` 当天均不存在（0）；pageviews Δ home +8（T1×2、T2×2、T3、T4、T8、T10）、vs +13（curl 12 页 + Lighthouse 1）、other +1（/advanced）、bots +1（Lighthouse/curl UA）；outbound/cspReports 无变化 | 验证过 ✅ | — | `usage/before-202844.json`、`usage/after-204429.json`（第二次快照见文末） |
| T18 | storage 还原：`storage.py restore storage-pre.json` → 重 dump `storage-final.json` md5 与 pre 一致、`diff` 为空；sessionStorage `{}`→`{}`；`/api/monitor/list` = 测试前 | 验证过 ✅ | — | `storage-pre.json`、`storage-final.json`、`storage-pre-restore.json`（还原前差异：shortlist +google.com、session +dh:lastSearch:v1；第二次差异：lang zh→en，均已回滚） |

## 发现 / 备注（无 P0–P2）

1. **P3（口径）R563 `{{` 计数**：原始 SSR 字节中 `{{price:…}}` 仅存在于 `window.__DH_CONTENT__` 序列化脚本内（de-vs-com zh 12 次），非爬虫可读文本；meta/JSON-LD/可见 FAQ/水合 DOM 均 0。若要求原始 HTML 0 出现，需在服务端序列化前对 compares 内容做占位符替换（或从水合数据剔除 metaDescription 等已在 SSR 解析的字段）。
2. **P3（备注）375 溢出脚本假阳性**：TLD 筛选条是 `overflow-x-auto` 横向滚动容器，其子项 right>375 属设计，文档层 `scrollWidth/clientWidth/body.scrollWidth` 全为 375。后续审计脚本应排除 `overflow-x:auto|scroll` 祖先内的元素。
3. **未验证**：reserved unknown 行「无重试按钮」——生产数据本轮未出现 `detail=reserved` 行；`isRetryableUnknown` 逻辑仅有单测覆盖（本轮未跑）。
4. **观察**：desktop 下 `[data-recheck]` 按钮为 31×28（图标按钮），375 下 44×44 —— 符合「375 ≥44×44」要求，desktop 未做要求。
5. **观察**：`?lang=en` 访问会把 `domainhunter:lang` 持久化为 en，后续无参路径页面随之英文；审计时需在最后一次页面访问之后再做 storage 还原（本轮已按此处理）。

## 截图

- `/home/ubuntu/r564/prod/shots/t1-desktop.png`、`t1-375.png`、`t2-375-landing.png` — `?q=chaxiang` 精确落地（desktop/375）
- `/home/ubuntu/r564/prod/shots/t3-ai-landing.png`、`t4-mode-exact.png`
- `/home/ubuntu/r564/prod/shots/t5-reason-zh.png`、`t5-reason-en.png` — chaxiang.ai 限流原因双语
- `/home/ubuntu/r564/prod/shots/t6-after-recheck.png`、`t7-375-after-enter-recheck.png`
- `/home/ubuntu/r564/prod/shots/t8-google-taken-row.png` — 首页 taken 行
- `/home/ubuntu/r564/prod/shots/t9-advanced-bulk.png`，`docs/qa/screenshots-r567/t9-advanced-rows-zoom.png` — /advanced 批量核验四行
- `/home/ubuntu/r564/prod/shots/t10-results-all.png`、`t10-results-after-recheck.png` — 结果页「全部」+ 重试
- `/home/ubuntu/r564/prod/shots/t11-watching.png`、`t11-confirm-cancel.png`、`t11-after-cancel.png` — 开监控 / 两步取消

## 录屏

- `/home/ubuntu/screencasts/r567/r567-edited.mp4`（带 test/assert 标注）

## 原始数据

- 第二次 usage 快照 `usage/after2-204748.json`（覆盖快照 1 之后的 3 次 /vs 水合复核 + /mcp 收尾访问）：`searches/fast/refine` 仍 0→0，`aiErrors/llmProvider` 仍不存在；pageviews Δ vs +16（+3）、other +2（+1 /mcp）、home +8、bots +1 —— 全部可由本轮访问解释。
- `/home/ubuntu/r564/prod/`：`results.log`（全部 PASS/FAIL 时间线）、`t1-*.json t3t4.json t5t6.json t7.json t8t11.json t9.json t9-rows.json t10.json t10-fix.json`、`t12/`（SSR HTML + summary + verdict）、`lh/`、`usage/`、`storage-*.json`、脚本 `common.py storage.py t*_*.py t12-vsmeta.py`
