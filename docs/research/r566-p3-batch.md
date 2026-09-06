# R566：R559 剩余 P3 批（/prices 精确后缀置顶 · /advanced 命名与 375 · 批量 x/N 进度 · CSV 数值价格列 · /shortlist 375 · aftermarket/premium 论证）

> 背景：`docs/audits/ux-walkthrough-r559.md` 留下 P3-1/2/3/4/6/7 六项。本文按 SOP-02 调研先行：每项先生产实查（**0 次 AI 调用**，只走 `/prices`、`/advanced` 批量粘贴 → `POST /api/search`、`/shortlist` 静态页与本地 storage），再给方案与验证方式。P3-6 只出论证与建议，**不实现**。
> 生产基线：`hunt.zalize.com` version f415f96f（= 代码 676f6fe）；本地基线 `deploy/r192-r195` @ 6352970。
> 复现脚本：`~/r566/prod_probe.py`、`prod_probe2.py`、`competitors.py`（Playwright 连本机 Chrome CDP；不入库），截图在 `docs/research/r566/`。
> 逐项标注：**[验证]** = 生产/脚本一手实测；**[文档]** = 官方文档/规范链接；**[推断]** = 未实测的推理。

## 0. 结论先行

| 项 | 生产现状（[验证]） | 方案 | 本轮 |
|---|---|---|---|
| P3-1 `/prices` 精确后缀 | 输入 `io` 共 14 行，`.io` 在第 **13** 行；`.ai` 7 行中第 7；`com` 4 行中第 3。输入 `cn` 只命中 `.cn`（1 行，故「已置顶」是巧合）；`com.cn` **0 行**——它不在 `TLD_LIST`（408 个）也不在 Porkbun 351 个实时报价里 | 排序前按「精确 = 查询」分层：精确命中固定第一，其余保留当前排序 | 实施 |
| P3-2 `/advanced` 命名 + 375 | h1「高级模式」，而首页分段器/页脚/`<title>` 都叫「批量核验」；375 下粘贴框顶部 y=752（视口 812），组合器 4 个输入在上方 | h1/副标题/页头链接改「批量核验」，粘贴卡片提到组合器之上，组合器降级为「组合生成（高级）」 | 实施 |
| P3-3 批量进度 | 26 个域名（脚本样本）核验 3.8s，期间只有 h2「可注册（n）/其余候选（m）」在长，按钮恒为「检索中…」，**无 x/N** | 请求已知 total（批量 = 域名数），流式 rows 长度即 done；加 `role="status"` 进度行 + 进度条 | 实施 |
| P3-4 CSV 价格列 | `first_year_price` 单元格为 `"首年 $11.08 ≈¥80"` / `"首年 ¥33"`（带引号字符串）；LibreOffice Calc 转 xlsx 后该列全部 `s`（文本）类型 | 新增 5 列 `price_first_year_cny, price_renew_cny, price_first_year_usd, price_renew_usd, price_source`，纯数字不加引号；旧列 **保留一版**（见 §4.3） | 实施 |
| P3-7 `/shortlist` 375 | 首张域名卡顶部 y=**555**（视口 812）；上方依次为 监控动态（y273）→ 跨设备同步（y335，高 168）；桌面 `<table>` 在 375 下 `hidden` | 375 下把「监控动态 / 我的分享 / 跨设备同步」三块移到清单之后；桌面顺序不变；用 matchMedia 决定 DOM 顺序（Tab 顺序 = 视觉顺序） | 实施 |
| P3-6 aftermarket/premium | 现有数据源（RDAP → DNS NS → WHOIS）对 premium 未注册域与普通可注册域**返回完全相同**（都是 404 / NXDOMAIN）；Porkbun 公开 `pricing/get` 只有 TLD 级价，无 premium；需鉴权的 `checkDomain` 才有 `premium: yes/no` | 不实现；建议见 §6 | 只论证 |

## 1. P3-1 `/prices` 精确后缀置顶

### 1.1 现状证据（[验证]，`~/r566/probes.jsonl` item=P3-1）

| 输入 | 命中行数 | 前 5 行 | 精确项位置 |
|---|---|---|---|
| `cn` | 1 | `.cn` | 1 |
| `com.cn` | 0 | — | 不存在 |
| `io` | 14 | `.auction .solutions .bio .vacations .vision` | **13** |
| `.ai` | 7 | `.hair .email .repair .domains .training` | **7**（截图 `r566/p3-1-prices-filter-dotai.png`） |
| `com` | 4 | `.company .community .com .computer` | 3 |

根因（代码 `apps/web/src/components/prices-page.tsx` L51-57）：`filter(r => r.tld.includes(q))` 之后直接按注册价升序排，精确项与子串项一视同仁。

`com.cn` 0 行的原因：`TLD_LIST`（`apps/web/src/content/tld-list.ts`）不含二级后缀；`GET /api/prices` 351 个实时价里 `"com.cn" in prices === false`。因此「`com.cn` 亦置顶」在现有数据集上**没有行可置顶**，本轮改为：精确匹配用通用规则（任何 `q === tld` 的行置顶），验证用 `co`（命中 `.co/.com/.cool/.codes/.coach/.coffee…`）与 `io/ai/com`；`com.cn` 输入仍走空态（`HubFilterEmpty`），并在本文记录「若未来把二级后缀加进 TLD_LIST，规则自动生效」。

### 1.2 方案

```ts
// 纯函数，便于 vitest：精确项恒在首位，其余保持传入顺序（价格/字母序 + 升降）
export function rankExactTld<T extends { tld: string }>(rows: T[], q: string): T[] {
  const exact = rows.filter((r) => r.tld === q);
  return exact.length ? [...exact, ...rows.filter((r) => r.tld !== q)] : rows;
}
```
在 `useMemo` 里排序（含 `desc` 反转）之后再调 `rankExactTld(list, q)`——这样「降序」也不会把精确项翻到最后。

### 1.3 验证方式
- vitest：`rankExactTld` 对 `io`（多子串）、`cn`（唯一命中）、`zz`（无命中）、`desc` 反转后的列表。
- 本地 Playwright（`~/r566/local_verify.py`）：`/prices` 输入 `cn` 首行 `.cn`；`io` 首行 `.io`；`co` 首行 `.co`；`com.cn` 显示空态。

## 2. P3-2 `/advanced` 命名与 375 布局

### 2.1 现状证据（[验证]）
- 命名断裂：`home.mode.bulk`=「批量核验」、`footer.advanced`=「批量核验」、`ADVANCED_META.zh.title`=「批量域名核验：粘贴名单一键实时查可注册」，但 `adv.title`/`header.advanced`=「高级模式」，SSR 骨架 `worker.ts` `ADVANCED_SSR` 同为「高级模式」。
- 375 光/暗截图 `r566/p3-2-advanced-375-{light,dark}.png`：`scrollWidth 375 = innerWidth`（无溢出）；`#advanced-bulk` 顶部 y=752、底部 874 > 视口 812 —— 首屏只见组合器 4 个输入 + 「开始检索」，粘贴框在第二屏。
- Tab 顺序（`probes.jsonl` item=P3-2 stage=tab）：页头 5 个 → roots → prefixes → suffixes → tlds → 粘贴框 → （两个按钮 disabled 被跳过）。

### 2.2 方案
- 文案（`i18n.tsx` zh/en 双份）：`adv.title`「批量核验」/「Bulk check」；`adv.subtitle`「粘贴现成名单一键实时核验可注册状态；也可用词根 × 前后缀 × TLD 组合生成后核验」；`header.advanced` 同步为「批量核验」/「Bulk check」；新增 `adv.comboTitle`「组合生成（高级）」、`adv.comboHint`。`adv.bulkHint` 中「按上方 TLD 展开」改为「按下方 TLD（当前 {tlds}）展开」，把当前 TLD 值直接写进提示，避免用户到第二屏找。
- 布局：粘贴卡片放到第一张；组合器卡片第二张，标题加 `adv.comboTitle`。375 下粘贴框顶部预计 y≈300。
- SSR 骨架：`worker.ts` `ADVANCED_SSR` 两份文案与 `adv.title/adv.subtitle` 逐字同源（文件内注释已如此要求）。**该文件不在本轮允许清单**，但公共规则 ⑩ 明确「worker 侧 SSR 文案两份都改」，且不改会造成水合时 h1 从「高级模式」跳成「批量核验」的可见闪变；本轮只改这 2 行常量，在 PR 里单列说明。

### 2.3 验证方式
- vitest：`i18n` 词典 zh/en 均含新 key；`ADVANCED_SSR` 文案 == 词典（读 `worker.ts` 源码字符串比对，守住同源）。
- 本地 Playwright 375 光/暗：`scrollWidth === innerWidth`；`#advanced-bulk` 顶部 < 812；Tab 顺序 页头 → 粘贴框 → 核验按钮（有输入时）→ 组合器输入。

## 3. P3-3 批量核验 `x/N` 进度

### 3.1 现状证据（[验证]，`probes.jsonl` item=P3-3）
样本 26 个域名（8 裸名 × com,cn + 10 带后缀；`foo.bar.cn`、`hunt.zalize.com` 三级名被 `FULL_RE` 接受但只算 1 个，故 28 → 26）。0.5s 采样：

| t | h2 | 按钮 | 行数 |
|---|---|---|---|
| 0.0 | — | 检索中… | 0 |
| 1.2 | 可注册（2）/ 其余候选（6） | 检索中… | 8 |
| 2.3 | 可注册（8）/ 其余候选（13） | 检索中… | 21 |
| 3.3 | 可注册（12）/ 其余候选（14） | 检索中… | 26 |
| 3.8 | 同上 | 核验 26 个域名 | 26 |

全程无「x/26」，完成后也无「已完成」提示（截图 `r566/p3-3-batch-progress-t4.png`、`p3-3-batch-done.png`）。

### 3.2 方案
- `advanced-page.tsx`：`run()` 接收已知 `total`（批量 = `payload.domains.length`；组合器路径 total 由服务端展开、前端未知 → 只显示已核验数）。新增 `progress: { done, total? } | null` state；每个 chunk 解析出 rows 后 `done += rs.length`；结束（含错误/中止）保留最终值。
- UI：卡片之下、结果之上一行 `role="status" aria-live="polite"`：运行中「核验中 12/26」，结束「已完成 26/26」（无 total 时「已核验 12」）；附 `role="progressbar"` 细条（`aria-valuenow/max`）。
- 纯函数 `bulkProgressLabel(done, total, running, t)` 供 vitest。

### 3.3 验证方式
- vitest：`bulkProgressLabel` 四态（运行中有/无 total、完成有/无 total）zh/en。
- 本地 Playwright：mock `/api/search` 分 4 个 chunk 流式返回 28 行（每 chunk 间隔 300ms），采样断言出现 `x/28` 且最终「已完成 28/28」。

## 4. P3-4 CSV 数值价格列

### 4.1 现状证据
- **[验证]** 生产导出 `r566/prod-bulk-export-before.csv`（批量 26 行）第 10 列 `first_year_price`：`"首年 $11.08 ≈¥80"`（实时价）、`"首年 ¥33"`（静态参考价）；taken/unknown 行为空。
- **[验证]** LibreOffice Calc 7 headless `soffice --convert-to xlsx` 后用 openpyxl 读单元格类型：`first_year_price` 5 个 available 行全部 `data_type === 's'`（文本）；对照样本里纯数字列 `80`、`11.08`、`202` 全部 `'n'`（数值），`"$82.7"` 仍是 `'s'`。（headless 默认字符集把 UTF-8 中文读成乱码，与本议题无关；生产文件带 BOM。）
- **[文档]** RFC 4180 §2：字段可用双引号包裹，规范**不定义任何类型**——数值/文本完全由消费端推断（https://www.rfc-editor.org/rfc/rfc4180 ）。
- **[文档]** Excel「导入或导出文本 (.txt 或 .csv) 文件」：打开 .csv 时按「常规」格式推断列类型，形如数字的转数字，其余当文本；混入货币符号/汉字的值不会成为可求和的数值（https://support.microsoft.com/en-us/office/import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba ）。
- **[文档]** Apple Numbers「导入 Excel 或文本文件」：CSV 按分隔符切列后由 Numbers 推断单元格格式（https://support.apple.com/guide/numbers/import-an-excel-or-text-file-tan1c76b3d6c/mac ）。
- **[文档]** WPS 表格 CSV 打开教程（https://www.wps.com/academy/how-to-convert-csv-to-excel-in-wps-office-quick-tutorials-1864012/ ）。
- **[推断]** Excel/Numbers/WPS 本机未实测（本机只有 LibreOffice）；三者对「纯数字、无引号、无千分位」单元格识别为数值的行为与 LibreOffice 一致是业界共识，但本文只把 LibreOffice 结果算作实测。

### 4.2 列结构

| 列 | 类型 | 取值 |
|---|---|---|
| `price_first_year_cny` | 整数 | 实时价：`toCny(registration)`（汇率 7.2 四舍五入，与页面一致）；静态价：`tldPrice(tld).first` |
| `price_renew_cny` | 整数 | 实时价 `toCny(renewal)`；静态价 `tldPrice(tld).renew` |
| `price_first_year_usd` | 小数（≤2 位） | 实时价 `registration`；静态价 **留空**（静态表只有人民币，页面上的 `≈$` 是换算值，导出不再造数） |
| `price_renew_usd` | 小数 | 实时价 `renewal`；静态价留空 |
| `price_source` | 枚举文本 | `porkbun_live` / `static_reference` / 空 |

规则：数值单元格不加引号、不加货币符号、不加千分位；仅 `status === "available"` 行输出价格（与现状一致，taken/unknown 行 5 列全空，`price_source` 也空）。

### 4.3 旧列 `first_year_price` 是否保留
**保留一版**（R566 → 下一个大版本再删）：
1. 已有用户把导出的 CSV 拿去微信群/表格里看，旧列是「人能读」的带币种标签，删掉会让不懂列名的人丢信息；
2. `docs/handoff-context.md` 与 `results-export.test.ts` 之外没有任何机器消费方（grep 仓库内 `first_year_price` 只有 `results-export.ts` 与 R559 审计留档），保留成本为 0；
3. 列顺序：旧列位置不动（第 10 列），新 5 列追加在 `brandability`/`first_year_price` 之后、`expires_at`/`note` 之前，避免既有按列号取值的脚本错位。
下一轮删除条件：`docs/handoff-context.md` 记一条「R566 起 first_year_price 为兼容列，R6xx 删除」。

### 4.4 验证方式
- vitest（新增 `csv.test.ts` / 扩 `results-export.test.ts`）：实时价行 → `80,80,11.08,11.08,porkbun_live`；静态价行 → `33,38,,,static_reference`（`tldPrice("cn")` = first 33 · renew 38）；taken 行 5 列全空；header 顺序；含引号 meaning 仍 RFC 4180 转义。
- 本地 Playwright 导出 → `node` 用最小 RFC 4180 解析器逐行断言 5 列匹配 `/^\d+(\.\d+)?$/` 或空。

## 5. P3-7 `/shortlist` 375 域名表位置

### 5.1 现状证据（[验证]，`probes.jsonl` item=P3-7）
种子 3 条候选（storage 已备份、测后字节级还原 `STORAGE_IDENTICAL`）。375×812：

| 区块 | 顶部 y |
|---|---|
| h1 + 5 个操作按钮 | 81 |
| 本地保存提示 / 尚未复查过 | 205 / 245 |
| 监控动态 | 273 |
| 跨设备同步（免登录） | 335（高 168） |
| 排序条 | 503 |
| 第 1 张域名卡 `chaxiangji.cn` | **555** |

截图 `r566/p3-7-shortlist-375-{light,dark}.png`；`scrollWidth 375`（无溢出）。Tab 顺序：页头 → 5 个操作按钮 → 监控动态 → 同步到其他设备 → 同步码输入 → 排序按钮（与 DOM 一致）。

### 5.2 方案
`shortlist-page.tsx` 内新增 `useIsDesktop()`（`matchMedia("(min-width: 768px)")`，与 `lib/density.ts` 同一断点、同一写法）；把「监控动态 / 我的分享链接 / 跨设备同步」三块抽成 `secondaryPanels`，桌面照旧渲染在清单之前，窄屏渲染在清单之后（`items.length === 0` 时仍在空态之前，因为「导入同步码」是空清单的主要来路）。用 DOM 顺序而非 CSS `order`，保证 Tab 顺序 = 视觉顺序（WCAG 2.4.3）。

### 5.3 验证方式
- vitest（`renderToStaticMarkup`，无 window → 走窄屏分支）：有候选时首张域名卡 HTML 位置在「跨设备同步」之前；空清单时同步块仍在空态之前。
- 本地 Playwright 375 光/暗：第 1 张域名卡顶部 < 400；`scrollWidth === innerWidth`；Tab 顺序 页头 → 操作按钮 → 排序 → 卡片 → …→ 同步。

## 6. P3-6 aftermarket / premium 语义（只论证，不实现）

### 6.1 现有数据源能否区分 premium（[验证]）
| 数据源 | premium 未注册域 `insurance.xyz`（Porkbun 标价 $10,917/yr Premium） | 普通可注册 `qwzx7k3zz.xyz` | 结论 |
|---|---|---|---|
| RDAP（`rdap.org` bootstrap → CentralNic） | HTTP **404** `objectClassName:"error"` | HTTP **404** 同样响应 | **无法区分** |
| RDAP `insurance.blog` | 404 "Domain not found" | — | 同上 |
| DNS NS（1.1.1.1 DoH） | `Status: 3`（NXDOMAIN） | NXDOMAIN | **无法区分** |
| WHOIS | 未实测（`packages/core/check.ts` 为 RDAP 兜底）；**[推断]** 注册局 WHOIS 对未注册名统一返回 "No match"，无价格字段 | | 无法区分 |
| Porkbun `POST /pricing/get`（公开、无鉴权；生产 `/api/prices` 唯一价源） | 返回 907 个 TLD 的 `registration/renewal/transfer/coupons/specialType`；`specialType` 只有 `handshake`（273 个）；**没有域名级字段** | | 只有 TLD 级基准价，**无 premium** |
| Porkbun `POST /domain/checkDomain/{domain}`（需 API key） | OpenAPI 3.19 `CheckDomainResponse.response.premium: "yes"\|"no"`、`price`、`regularPrice`、`firstYearPromo`、`additional.renewal.price`；限流默认 **1 次 / 10 秒 / 账号**（https://porkbun.com/api/json/v3/spec ） | | **能区分**，但限流与鉴权决定它只能做「单域名按需查」不能做批量 |
| Porkbun 注册 API 文档 | "Premium domains cannot be registered via API" | | 即便识别出 premium，也无法走 API 注册 |

RDAP 规范（RFC 9083 https://datatracker.ietf.org/doc/html/rfc9083 ）本身无价格/premium 对象，`status` 值集合里也没有 premium 语义——这是协议层面的空白，不是某个注册局的实现问题。

### 6.2 竞品标注（[验证]，截图 `r566/p3-6-*.png`）
| 竞品 | 标注方式 |
|---|---|
| Namecheap（https://www.namecheap.com/domains/registration/results/?domain=insurance.com ） | 行内紫色 `PREMIUM` 徽标 + 一次性价「$5,000.00」+ 小字「Renews at $260.00/yr」；分「Domains / Auctions / Premium」三个 Tab；说明文案「high value Premium inventory through our registry and aftermarket partners」 |
| Porkbun（https://porkbun.com/checkout/search?q=insurance.com ） | 行内红色 `Premium` 徽标 + 「$10917.11 / year · Premium renews at $10917.11」；aftermarket 另用灰色 `Aftermarket` 徽标 + 「$625,000 + transfer fee」；已注册名显示「Inquire」 |
| Instant Domain Search（https://instantdomainsearch.com/ 搜 `insurance`） | 结果筛选器分三档计数「Available 3 · Premium 11 · Aftermarket」 |

共同点：① premium 与 aftermarket 是**两种语义**（注册局定价 vs 二手转售），三家都分开标；② 都把「首年一次性价」和「续费价」并列，因为 premium 的续费可能与首年一样高（Porkbun）也可能骤降（Namecheap $5,000 → $260/yr）。

### 6.3 建议（[推断]）
1. **不要用现有 RDAP/DNS 链路做 premium 判断**——证据表明它们对 premium 与普通可注册名零差异；任何基于「短域名/字典词」的本地规则都是拍脑袋（老板规则：规则只做兜底，不做主判）。
2. **可行路径 = Porkbun `checkDomain`**：只对用户点击「去注册」/加入候选清单的**单个** available 域名做一次带鉴权查询（KV 缓存 24h），拿到 `premium/price/regularPrice/additional.renewal.price` 后展示 `Premium · 首年 $X · 续费 $Y` 徽标；超限流（10s/次）时静默降级为现在的 TLD 基准价并标「未核 premium」。批量场景（/advanced 26 个、结果页 30 个）**不做**，会撞限流。
3. **UI 语义与文案**：状态枚举 `available` 之下加可选 `pricing: "standard" | "premium" | "unknown"`，不新增 Status；徽标学 Namecheap/Porkbun 放在价格旁而非状态旁；aftermarket（已注册转售）本轮不碰——现有数据源连「是否挂售」都拿不到，且 Porkbun 明说 API 不能注册 premium，二手更不能。
4. **前置条件**：需要 Porkbun API key（secret）与 Worker 侧 fetch 白名单；`docs/handoff-context.md` 记为待办，先估 KV 写量与限流账（每天 available 点击量 × 1 次），再决定是否立项。
5. 若要更便宜的信号：Porkbun 网页版搜索页对 premium 有徽标，但抓网页属于爬取而非 API，不建议。

## 7. 本轮 0 AI 与 storage 证明
- `GET /api/usage?days=1` 测前/测后：`{"searches":0,"fast":0,"refine":0}` → 同值（`~/r566/usage-pre.json`、`usage-post.json`）。
- 浏览器请求清单（`probes.jsonl` item=net）：`/api/prices`、`/api/registrars`、`/api/search`；`ai-search` 命中 **0**。
- storage：`storage-before.json` sha256 `61c02c9b…`；`restore_storage.py` → `STORAGE_IDENTICAL`，local/session 均与备份完全一致。
- 未生成任何分享/同步/监控，无需撤销。

## 8. 范围外发现（只记录）
- `apps/web/src/worker.ts` `ADVANCED_SSR` 需与新 `adv.title/subtitle` 同源（本轮按规则 ⑩ 改了这 2 行常量，见 §2.2）。
- `TLD_LIST` 无二级后缀（`com.cn/net.cn/org.cn`），`/prices` 对 `com.cn` 永远空态；若产品要覆盖国内常用二级后缀需另开一轮（含 `tldPrice` 静态价与 `TLD_GUIDES` 编译期约束）。
- `/advanced` 的 `FULL_RE` 接受 `foo.bar.cn`、`hunt.zalize.com` 这类三级名并整条送去核验（RDAP 会按注册域回答），「已识别 N 个」会让用户以为是 N 个可注册候选。
- 组合器路径（roots × affixes × TLD）total 由服务端展开，前端只能显示「已核验 x」；若要 `x/N` 需 `/api/search` 首行回传 total（worker 改动，范围外）。

## 9. 改后本地验证（[验证]，PR #530 分支，`wrangler dev :8787`，0 生产/AI 请求；产物 `r566/after/`）

| 项 | 结果 | 证据 |
|---|---|---|
| P3-1 `/prices` | 4 个精确查询（`io` 14 行、`com` 4、`.ai` 7、`cn` 1）× 3 列 × 升/降 = 24 组，精确行均在首位且其余保持排序；`com.cn` 0/408 空态 | `after/price-sort-assertions.json`、`after/prices-io.png`、`prices-cn.png`、`prices-com-cn-empty.png` |
| P3-2 `/advanced` | 375×812 粘贴框 y=282–404 首屏可见（改前 y=752）；h1/导航 zh「批量核验」en「Bulk check」；Tab 可达粘贴框与「核验 28 个域名」 | `after/advanced-375-{light,dark}.png`、`header-bulk-{zh,en}.png`、`mobile-metrics.json` |
| P3-3 进度 | 28 个唯一带后缀域名 → 「已识别 28 个域名」→ 流式「核验中 x/28」（中间帧 18/28）→「已完成 28/28」，progressbar `aria-valuenow=28 max=28`；组合器 `lingxi × com`：「已核验 0 个」→「已完成，共核验 1 个」，无分母 | `after/bulk-progress-{mid,done}.png`、`generator-progress-done-detail.png` |
| P3-4 CSV | 批量（28 行）与候选清单（4 行）两份下载均通过 node RFC 4180 解析：4 个数值列全部匹配 `^(\d+(\.\d+)?)?$` 且未加引号；taken/unknown 五列全空；旧列仍为带引号标签；实时价 `porkbun_live` 17 / 静态 `static_reference` 6，静态行 USD 空 | `after/csv-node-parse.txt`、`parse-csv.mjs`、`bulk-export-after.csv` |
| P3-7 `/shortlist` | 375：排序条 + 域名卡先于监控/我的分享/同步；Tab 顺序：4 个排序键 → 卡片去注册（Enter 弹注册商菜单）→ `#shortlist-sync-code`；桌面仍面板在前；空清单同步块在空态之前 | `after/shortlist-375-{light,dark}.png`、`shortlist-375-empty-sync-first.png`、`shortlist-desktop-panels-first.png` |
| 溢出 | `/advanced` `/shortlist` × 浅/深：`documentElement.scrollWidth=body.scrollWidth=innerWidth=375`（隐藏经典滚动条后测；未隐藏时 Chrome 桌面模拟报 360/375，是滚动条占宽而非内容溢出） | `after/mobile-metrics.json` |
| 清理 | 本地测试分享已撤销（GET → 410）；本地 local/sessionStorage 字节级还原 | 测试记录 |

未验证：读屏软件实际播报（只验了 `role=status aria-live=polite` 语义）；候选清单手机卡片本无「复制」按钮，故「卡片复制键可达」不适用。
