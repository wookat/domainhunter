# R563 调研：/vs meta description / FAQ 第 1 答 / FAQPage JSON-LD 的静态价

来源：R558 零 AI 审计 P2-1（`docs/audits/audit-r558.md` §1）。R549 把 `/vs` 正文（verdict / pickA / pickB）的 165 处人民币价改成了 `{{price:…}}` 占位并与同页价格表同用一份 `/api/prices` KV 快照，但 `metaDescription` 没有纳入，而它同时是四处输出的来源：

```
compares.ts metaDescription
  ├─ worker.ts  <meta name="description"> / og:description / twitter:description
  ├─ worker.ts  Article JSON-LD description
  └─ compare-faq.ts firstSentence(metaDescription) → FAQ 第 1 答
        ├─ compare-page.tsx / ssr-html.ts 可见 FAQ
        └─ worker.ts faqJsonld() → FAQPage JSON-LD
```

## 1. 现状实测（改前，2026-09-06，生产 `/api/prices` 351 条实时价、`fetchedAt=1788674449621`）

- 444 条对比 × zh/en：**85 页 zh + 85 页 en = 170 条** metaDescription 含绝对价（`$N`、`$N-M`、`$N/年`），其余 274 条只有相对表述，没有 `元`/`¥` 形态。
- 185 行「TLD-页」价格与实时价逐条比对：**33 行偏差 ≥ $2**（含 R558 人工核实的 `.mx` 13/50 vs 35.57/41.23、`.de` 8 vs 2.90/4.07），102 行该 TLD 无实时价（只能对静态参考价）。
- 6 条涉及二级后缀（`.co.th` `.com.ua` `.com.ng`×3 `.co.ke` `.co.il` `.co.za`）：价格表与占位系统只按顶级 TLD 建模，无二级后缀价。
- 长度：zh 61–148 字（p50 86）；**en 134–387 字（p50 194，395/444 页 >160）** —— 改前就已如此，与本轮无关。

## 2. Google 官方文档（2026-09 读取）

- [Control your snippets in search results](https://developers.google.com/search/docs/appearance/snippet)：*There's no limit on how long a meta description can be, but the snippet is truncated in Google Search results as needed, typically to fit the device width.* Google 有时会用 meta description 替代正文生成摘要（当它比正文更准确时）→ meta 与正文价格矛盾会直接暴露在 SERP。
- [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)：结构化数据须 *accurately represent page content*、*complete and up-to-date*，*Don't mark up content that is not visible to readers of the page*；「内容与结构化数据不一致 / 误导」是不显示富结果的明示原因 → FAQPage 的答案必须与可见 FAQ 逐字一致，且不能是过期价。
- [FAQPage](https://developers.google.com/search/docs/appearance/structured-data/faqpage)：2023-08 起 FAQ 富结果只对 *well-known, authoritative government and health websites* 展示 → 本站 FAQPage 不会出富结果，但仍受上面的通用政策约束（不做无谓 markup 的同时保持一致即可，本轮不移除）。

## 3. 决策：占位（R549 同一套）而不是删价 / 相对表述

| 方案 | 取舍 |
|---|---|
| A 改相对表述、删绝对价 | 最稳，但 SERP 摘要失去「首年/续费多少」这一用户最关心的信息；且 R549 已把同页正文改成实时价，meta 删价反而信息量倒退 |
| **B 复用 R549 占位 + 同一份快照渲染（采用）** | 四处输出同源同值；KV 无数据时回退静态参考价加 `≈`；渲染器/守门测试/口径全部现成，无第二套系统 |
| C 只改 FAQ 不改 meta | meta 仍与正文矛盾，Google 可能用 meta 出摘要 → 不成立 |

二级后缀：不能把 `.co.th` 套 `.th` 占位（首版脚本就是这么错的），也没有二级价数据源 → 二级后缀一律改为**相对表述**（「.co.th 更便宜」/「.co.th is cheaper」），顶级直注价用占位；`.il` 的 `.co.il` 删价、直注价用 `il` 占位（静态参考 180 元 ≈ $25 即原文直注价）；`.za` 静态参考价 60 元 ≈ $8 就是原文 `.co.za` 价，故 `.co.za` 一处直接用 `za` 占位。

## 4. 实现

- `compares.ts`：170 条 metaDescription 静态价 → `首年 {{price:x:first:cny}}、续费 {{price:x:renew:cny}}/年` / `{{price:x:first:usd}} to register and {{price:x:renew:usd}}/yr to renew`（10 处二级后缀改相对表述；`it-vs-de` `at-vs-de` zh 删 9/4 个字以守 160）。
- `compare-faq.ts`：新增 `compareMetaDescription(cmp, lang, snapshot)`；`buildCompareFaq` 第 3 参 `snapshot` 改为必填，第 1 答取渲染后 meta 的首句。
- `worker.ts /vs/:slug`：KV 快照提前到 meta 之前读取，meta / og / twitter / Article description / FAQPage JSON-LD / SSR 正文 / 注入客户端 **七处同一份快照**。
- `compare-page.tsx` / `ssr-html.ts`：FAQ 用同页 snapshot 渲染（水合 == SSR == JSON-LD）。

## 5. 守门（`compare-price-placeholders.test.ts`，24→31 用例）

1. `metaDescription` 纳入 R549 四项：无硬编码零售价；占位可解析、只引本页两侧且两侧有静态参考价；KV 无数据渲染无 `{{`、不产生新「—」。
2. 170 条带占位（防止回退到写死价）。
3. R558 两实证页 `mx-vs-es` / `de-vs-com` 渲染后 meta 数字 == `priceRow` 单元格；FAQ 第 1 答首句 == 渲染后 meta 首句；SSR 可见 FAQ 含该答案；FAQPage JSON-LD 文本 == FAQ 答案。
4. 长度：zh 全部 ≤160（NO_DATA `≈` 形态为最长）；en 守「不超过改前包络 430」（改前 395 页已 >160，另开批次收缩，不属本轮）。

## 6. 未验证 / 遗留

- 生产 `/vs/*` 888 页 meta / JSON-LD 与表格同源须在部署后零 AI 回归中抓 HTML 复算（本轮本地 487 tests 绿，未上生产）。
- en metaDescription 395 页 >160 字：历史遗留，建议下轮以 ≤160 为目标批量改写（Google 无硬限但会截断，截断处正好可能吃掉价格）。
- 二级后缀价（`.co.th` 等）无数据源，若将来价格表支持二级后缀再改回占位。
