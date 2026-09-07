# R549 /vs 正文价格扫描（after）

- 扫描对象：`apps/web/src/content/compares.ts` 444 页 × zh/en 的 verdict + pickA/pickB；句子切分口径同 faq.test.ts。
- 实时价：/api/prices 快照 fetchedAt=2026-09-06T06:00:49.621Z（351 TLD，USD×7.2）。
- 分类：abs=绝对零售价（会漂移）；ratio=依赖价格比值/差额的相对表述（会漂移）；fact=批发价/拍卖/两年起注等政策事实金额（保留）。

## 总览

| 类别 | 句数 | 页数 | zh 句 | en 句 | verdict 句 | pick 句 |
|---|---:|---:|---:|---:|---:|---:|
| abs | 0 | 0 | 0 | 0 | 0 | 0 |
| ratio | 0 | 0 | 0 | 0 | 0 | 0 |
| fact | 10 | 8 | 0 | 10 | 10 | 0 |

abs 数字总数 0，其中可归属到两侧 TLD_PRICES 首年/续费 0，未归属 0。

## abs 涉及 TLD（可归属数字）

| TLD | 数字个数 | 静态首年/续费 | 实时首年/续费（¥） |
|---|---:|---|---|

## abs 数字 vs 实时价偏差分布（正文数字 − 实时 ¥）/ 实时 ¥

| 偏差区间 | 数字个数 |
|---|---:|
| |rel| ≤ 5% | 0 |
| 5% < |rel| ≤ 15% | 0 |
| 15% < |rel| ≤ 30% | 0 |
| |rel| > 30% | 0 |
| 无实时价 | 0 |

| TLD | 项 | 正文数字 | 静态参考价 | 实时 ¥ | 偏差 | 出现次数 |
|---|---|---:|---:|---:|---:|---:|

## 正文数字 vs TLD_PRICES 静态参考价

可归属数字全部等于当前 TLD_PRICES（归属规则即相等）；**未归属**数字 0 个如下（= 手写时的旧参考价或第三方数字，已与 TLD_PRICES 不同步）：


## 占位符（方案 B）

- 总数 4145；按类型：price=3804，ratio=79，costdiff=10，diff=121，cost=12，pair=61，jump=34，sum=24
- 不合法/越界 0

## abs 句清单（0）


## ratio 句清单（不含绝对价、只含比值/差额，0）


## fact 句清单（保留，10）

- **com-vs-cn** en verdict：It is also among the cheapest mainstream options — the price table below lists {{price:cn:first:cny}} first year / {{price:cn:renew:cny}} renewal, well below .com's {{price:com:first:cny}} / {{price:com:renew:cny}}. .com is Verisign's suffix, wholesale $10.26 a year since September 2024, and the one users worldwide autocomplete by reflex; for overseas markets its recognition is irreplaceable.
- **com-vs-net** en verdict：Both suffixes are operated by Verisign, both date to 1985, and their wholesale prices have flipped: per ICANN's published fee schedules, .com costs registrars $10.26 per year (since September 2024) while .net costs registrars $10.91 (since February 2024) — the old "net is cheaper" instinct is out of date, and the price table below reflects it (.com {{price:com:first:cny}} / {{price:com:renew:cny}}, .net {{price:net:first:cny}} / {{price:net:renew:cny}}).
- **io-vs-ai** en verdict：Both are small-territory country codes that the tech world repurposed, and both now ride the Identity Digital platform: .io belongs to the British Indian Ocean Territory, delegated in 1997 to Internet Computer Bureau; .ai belongs to Anguilla and migrated wholesale to Identity Digital in January 2025 with more than 600,000 names. .ai sits one price tier higher: the price table below lists .io at {{price:io:first:cny}} first year / {{price:io:renew:cny}} renewal and .ai at {{price:ai:first:cny}} / {{price:ai:renew:cny}}, and most registrars require a two-year minimum on .ai, so the first bill is at least ¥1,000; both renew far above .com, with .ai costing about {{diff:io:ai:renew:cny}} more a year.
- **com-vs-ai** en verdict：If AI is the product's core value, the two letters of .ai are the shortest possible pitch; otherwise .com remains the default answer. .ai is Anguilla's country code, served on the Identity Digital platform since January 2025 with more than 600,000 registrations, and domain revenue has become a major source of government income — a suffix that rewrote a nation's budget. .com is Verisign's, wholesale $10.26 a year since September 2024, and the one users worldwide autocomplete.
- **com-vs-ai** en verdict：Do the math: the price table below lists .ai at {{price:ai:first:cny}} first year / {{price:ai:renew:cny}} renewal, with most registrars requiring a two-year minimum, so the first bill is at least ¥1,000; .com is {{price:com:first:cny}} / {{price:com:renew:cny}}.
- **net-vs-org** en verdict：At wholesale, .net currently costs $10.91 a year and Verisign's contract allows increases of up to 10% per year; .org lost its price cap in the 2019 ICANN renewal (over 3,200 public comments objected), so neither has a hard ceiling anymore.
- **shop-vs-store** en verdict：The meanings almost overlap; the origins don't. .shop is operated by Japan's GMO Registry, which won the suffix at an ICANN auction in January 2016 for $41,501,000 against rivals including Amazon and Google — the second-highest ICANN auction price ever, behind only .web's $135 million six months later. .store is a Radix suffix, in the root since 2016, run on the low-intro-price playbook.
- **shop-vs-store** en verdict：Both opened in 2016: .shop was won by Japan's GMO at ICANN auction for US$41.5 million and GMO markets it heavily in Japan; .store is run by Radix and positioned as the flagship-store suffix.
- **shop-vs-com** en verdict：The classic e-commerce trade-off: a suffix everyone recognizes versus a suffix that writes "shop" into the domain. .com is Verisign's, wholesale $10.26 a year since September 2024, listed in the price table below at {{price:com:first:cny}} first year / {{price:com:renew:cny}} renewal — stable renewals and the most liquid resale market, but short good brand words are essentially extinct and buying a decent one often runs five figures or more. .shop is operated by Japan's GMO Registry, which won it at ICANN auction in 2016 for $41,501,000; the price table below lists {{price:shop:first:cny}} / {{price:shop:renew:cny}} — nearly free up front, yet about {{ratio:shop:com:renew}} .com's renewal, the line item most often overlooked.
- **com-vs-app** en verdict：Whether the product itself is an app decides this one. .app is operated by Google's Charleston Road Registry, entered the root in 2015 and opened in 2018, and the entire zone sits on the browser HSTS preload list — a name.app without HTTPS simply won't load, so the registry holds the security floor for you; users see name.app and know it is an application, making download landing pages, web apps and utility tools zero-explanation. .com is Verisign's, wholesale $10.26 a year since September 2024, the suffix users autocomplete and the most liquid resale market — company sites, multi-product brands, content and commerce all fit.
