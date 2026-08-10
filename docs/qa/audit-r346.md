# R346 零 AI 全站审计报告（覆盖 R341–R344 后全站）

- 日期：2026-08-10（UTC）
- 生产：https://hunt.zalize.com（Worker ed460703，deploy tip `d5bc93c`）
- 约束：严格 0 AI（DeepSeek 402 欠费）。全程未触碰「开始猎取 / 再来一轮 / refine」及任何 AI CTA；quick-check 仅做精确核验；模板按钮只验证预填未提交。
- 零 AI 证明：`/api/usage` 审计前后 `days` 字典逐键相等（parsed JSON equality ✅）。

## 结论

| 级别 | 数量 |
|---|---|
| P0 | 0 |
| P1 | 0 |
| P2 | 1（已知观察项：Porkbun 实时价 stale） |
| P3 | 1（两页 desktop Best Practices 96） |

## 1. 内容计数与 sitemap 自洽 ✅

- sitemap.xml：760 条 = 8 静态（/、/why、/prices、/mcp、/advanced、/tld、/guide、/vs）+ tld 240 + guide 242 + vs 270 ✅（口径 8+240+242+270=760）
- hub 页详情链接数：/tld 240、/guide 242、/vs 270 ✅
- `scripts/content-counts.json`：tld 240 / guide 242 / vs 270 ✅
- llms.txt：tld 241（含 hub）/ guide 243（含 hub）/ vs 271（含 hub），与 sitemap 一致 ✅
- footer：含全部入口，R341 新增 6 条 vs（hair-vs-salon / skin-vs-beauty / makeup-vs-boutique / homes-vs-house / boats-vs-travel / autos-vs-repair）均已出现 ✅
- quick-check：默认 9 后缀，「+232」展开后「All 241」✅（截图 `screenshots-r346/quickcheck-all241.png`）
- 首页行业模板 chips：默认 10 个 + 「+232」展开（242 模板）✅，点击「机器人公司」仅预填描述、URL 不变、未提交 ✅（`template-prefill.png`）

## 2. R341/R343/R344 新页抽查 ✅

抽样：/tld/careers、/tld/management、/tld/parts；/guide/robotics、/guide/pizza、/guide/sauna；/vs/hair-vs-salon、/vs/autos-vs-repair、/vs/homes-vs-house（各 zh+en）。

- zh/en 双语内容完整（en 页中文字符仅剩导航级 ~69 个，正文全英文）✅
- FAQ：18/18 页均含 FAQPage JSON-LD ✅
- 价格一致性：行内价格与 `/prices` 静态参考价（types.ts TLD_PRICES，汇率 7.2、Math.round 口径）逐项核对，chips「首年 ¥X」与 tooltip「首年 ¥X · 续费 ¥Y/年 · 非实时报价」全部同值，0 不一致 ✅
  - 例：.careers $16（¥115）/ 续费 $57（¥412）；.management ¥59/¥152；.parts ¥63/¥241
- 行内 /prices href 精确匹配（`/prices?lang=zh|en`）✅

## 3. R339 可观测字段与 /prices stale（P2，已知观察项）

- `/api/usage` 含 `pricesLastOk` / `pricesLastFail` ✅：pricesLastOk=null，pricesLastFail=1786322278958（2026-08-10 00:37 UTC）
- `/api/prices`：`stale:true`，fetchedAt=1786167382002（2026-08-08 05:36 UTC），live 快照仅 58 条
- MCP `tld_prices`：tldCount 240 = liveCount 58 + staticCount 182，带 `staleNote`，静态补齐逻辑符合 R339 设计 ✅
- **P2-1（已知）**：Porkbun 实时价持续拉取失败（402 欠费期间），live 快照已 stale ~2 天。页面已按设计回退静态参考价并标注「非实时报价」，用户侧无错误。复现：`GET /api/prices` 看 `stale`；`GET /api/usage` 看 `pricesLastOk/pricesLastFail`。建议：Porkbun 恢复后核对 pricesLastOk 回填。

## 4. SEO / 404 / MCP ✅

- 抽样页 canonical 无误（zh 无参数，en 为 `?lang=en` 自指），hreflang zh-CN/en/x-default 三条齐全，og:title/description/url/image（`/api/og/...` svg）齐全 ✅
- JSON-LD：tld 页 BreadcrumbList+FAQPage；guide/vs 页 BreadcrumbList+Article+FAQPage ✅
- 404：`/tld/notexist`、`/no-such-page` 均真实 HTTP 404，品牌化 404 页（标题「页面不存在 | DomainHunter」，含四个入口）✅（`404-page.png`）
- MCP 文档页 `/mcp` 200 ✅；`POST /mcp` JSON-RPC：initialize/ping/tools/list 正常，3 个工具（check_domains / tld_prices / suggest_variants）✅

## 5. Lighthouse（分数）

| 页面 | 移动 P/A/BP/SEO | 桌面 P/A/BP/SEO |
|---|---|---|
| / | 90/100/100/100 | 100/100/100/100 |
| /tld | 87/100/100/100 | 100/100/100/100 |
| /guide | 89/100/100/100 | 100/100/96/100 |
| /vs | 99/100/100/100 | 100/100/100/100 |
| /tld/careers | 91/100/100/100 | 100/100/100/100 |
| /guide/robotics | 91/100/100/100 | 100/100/100/100 |
| /vs/hair-vs-salon | 91/100/100/100 | 100/100/100/100 |
| /prices | 87/100/100/100 | 99/100/96/100 |

- 全部页面 CLS = 0（R345 修复保持）✅
- **P3-1**：/guide 与 /prices 桌面 Best Practices 96（非 100），其余全绿。影响极小，可下轮顺手看一眼审计细项。

## 6. UI / storage / 分享 ✅

- 375px：/、/tld/careers、/guide/robotics、/vs/hair-vs-salon、/prices、/mcp 横向溢出 0px ✅（`*-375.png`）
- light/dark：默认 dark，`light` class 切换正常，两主题截图正常（`home-dark.png` / `home-light.png` / `tld-careers-light.png`）
- console：全部走查页面 0 error（404 页仅资源本身的 404 记录，非应用错误）✅
- storage：备份全部 localStorage → 操作（quick-check 后收藏 zorafyx.com 入候选清单，`domainhunter:shortlist` 正确写入）→ 逐字节还原并 re-dump 校验相等 ✅（`shortlist-op.png`）
- 分享：POST /api/share 创建（id `NVs***`，token 脱敏不记录）→ GET /api/share/:id 200、/s/:id 200 → DELETE 带 token 撤销 `{"ok":true}` → 再 GET 410 `{"error":"revoked"}`，响应不含 revokeToken ✅
- quick-check 精确核验：裸标签输入触发「直接核验 zorafyx.*」，默认 9 后缀出结果，展开 All 241 全量核验正常 ✅（`quickcheck-results.png`）

## 附件

截图目录：`docs/qa/screenshots-r346/`（16 张）。Lighthouse 全量 JSON 未入库（仅记分数）。
