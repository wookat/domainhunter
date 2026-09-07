# R519：/tld /vs /guide FAQ 去复读（R512 建议 #1）

口径：`scripts/seo-audit/thin-analyze.mjs` 的 dupSentenceRatio = 1 − 唯一句 / 总句（`<main>` 去 nav/header/footer/aside、去 `<a>`、按块与句末标点切句、≥4 个非标点字符）。
复算脚本：`scripts/seo-audit/dup-ratio.mjs`（单页/多页，`--json` 留证，`SEO_AUDIT_ORIGIN` 切本地）。0 次 AI 调用。

## 修前（生产 hunt.zalize.com，2026-09-06，version 02404588）

```bash
node scripts/seo-audit/dup-ratio.mjs --json docs/audits/r519/dup-before-prod.json /tld/com /tld/at /vs/com-vs-cn /guide/saas
```

| 页 | zh 总/唯一 → 复读 | en 总/唯一 → 复读 | 复读来源 |
|---|---|---|---|
| /tld/com | 37/33 → 10.8% | 42/35 → 16.7% | FAQ 第 1 答 = intro 原文 + bestFor 拼接；第 3 答 = 4 条 namingTips 拼接 |
| /tld/at | 48/38 → 20.8% | 45/36 → 20.0% | 同上 |
| /vs/com-vs-cn | 40/36 → 10.0% | 42/37 → 11.9% | FAQ 第 1 答 = verdict 原文；第 2/3 答 = pickA/pickB 拼接 |
| /guide/saas | 59/53 → 10.2% | 58/51 → 12.1% | FAQ 第 1 答 = intro + namingIdeas 拼接；第 3 答 = pitfalls 拼接（同一来源，一并处理） |

与 R512 `docs/audits/r512/pages.csv` 数字一致。

## 修后（本地 `wrangler dev --port 8787`，同口径）

```bash
pnpm --filter web build && (cd apps/web && npx wrangler dev --port 8787)
SEO_AUDIT_ORIGIN=http://127.0.0.1:8787 node scripts/seo-audit/dup-ratio.mjs --json docs/audits/r519/dup-after-local.json /tld/com /tld/at /vs/com-vs-cn /guide/saas
```

| 页 | zh | en | FAQ details / JSON-LD 条目 |
|---|---|---|---|
| /tld/com | 32/32 → 0.0% | 35/35 → 0.0% | 3 / 3，FAQPage 合法 |
| /tld/at | 37/37 → 0.0% | 35/35 → 0.0% | 3 / 3 |
| /vs/com-vs-cn | 34/34 → 0.0% | 36/36 → 0.0% | 3 / 3 |
| /guide/saas | 54/54 → 0.0% | 52/52 → 0.0% | 3 / 3 |

全站离线复算（`apps/web/src/content/faq.test.ts`，SSR blocks 口径，2524 页 × zh/en）：最大 2.9%，中位数 0%；残余重复为内容数据本身（两侧静态参考价相同、pickA/pickB 同句），非 FAQ。

## 修法（只改生成处，内容数据不动）

- `content/faq.ts`：`FaqItem { q, a, link?: { hash, label } }`；`a` 纯文本进 JSON-LD，`label` 片段在可见渲染时变成 `<a href="#hash">`。`faqJsonld()` 统一产出 FAQPage（worker 三处共用）。
- `/tld`：第 1 答 = metaDescription 第一句 + 「典型场景：前 2 个 bestFor 等」；第 3 答 = 第 1 条命名建议单句 + 「其余 3 条见本页「命名建议」」→ `#naming`。
- `/vs`：第 1 答 = metaDescription 第一句 + 指向「怎么选」`#verdict`；第 2/3 答 = 该侧首选场景单句 + 指向「适合选 .x 的情况」`#pick-x`。
- `/guide`：第 1 答 = 第 1 条思路单句 → `#ideas`；第 3 答 = 第 1 个误区单句 → `#pitfalls`；第 2 答（推荐后缀）与显式 faq（合规指南）不变。
- 锚点 id 同时加在 React 组件与 `ssr-html.ts`（class 加 `scroll-mt-20` 避开 sticky 顶栏），`faq.test.ts` 断言 id 真实存在且唯一。

## 未验证

搜索引擎侧（Google/Bing 对复读率变化的收录/排名反应）无法本地验证，只报结构指标：复读率、FAQ 条目数、FAQPage JSON-LD 合法性、可见文本 = JSON-LD 文本。
