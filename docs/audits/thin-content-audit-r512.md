# R512 · 内容矩阵「薄内容 / 近重复 / 程序化低价值」风险审计

- 角色：SEO 研究员子会话（ROUND-512），只调研论证、不改代码，**0 次生产 AI 调用**（`/api/usage` 抓取前后 `searches/fast/refine` 均为 0，见 §4.0）。
- 基线：`deploy/r192-r195`（tip `8ae92d2`，生产 version `0ab38935`）；抓取时间 2026-09-05T15:25Z；生产 `https://hunt.zalize.com`。
- 数据：`docs/audits/r512/`（`pages.csv` 每页指标 ×2524 行、`summary.json`、`nearest-pairs.csv`、`template-sentences.json`、`manual-sample.json`、`fetch-meta.json`）。脚本：`scripts/seo-audit/thin-fetch.mjs`、`scripts/seo-audit/thin-analyze.mjs`（用法见 §8）。
- 标记约定：**[实测]** = 本轮生产 SSR HTML 全量测量；**[原文]** = 官方文档逐字引用（本轮已用 curl / Playwright 渲染后逐句核对存在）；**[代码事实]** = 读仓库源码；**[推断]** = 基于以上做的判断，未经搜索引擎侧数据验证；**[未验证]** = 需要 GSC / Bing Webmaster / 百度资源平台数据才能验证。

---

## 0. 结论（置顶）

| 页面类 | 页数（zh+en） | 薄内容 | 近重复（同类） | 程序化低价值 (scaled content abuse) | Doorway 式 | 综合 | 最值得先改？ |
|---|---|---|---|---|---|---|---|
| `/tld/*` | 408×2 | **低**（正文中位 978 zh 词 / 594 en 词） | **中**（掩码后最近邻 Jaccard 中位 0.262、P90 0.387、**无一页 >0.8**；但 80 个 ccTLD 页形成明显「填空模板」簇：中位 0.342、62.5% >0.3） | **中** | 低 | **中** | **是（第 1 优先，且只需改 80 个 ccTLD 页 + 结构性 FAQ 复读）** |
| `/vs/*` | 444×2 | 低（1184 / 722） | **低-中**（0.193 / P90 0.299 / 无 >0.8） | **中-低**（两侧 TLD 简介段 16.7% 逐字来自 `/tld` 页；ccTLD 组合 28.6%） | **低-中**（组合爆炸：444 组，判断段虽独有但差异化数据为 0 项） | **中-低** | 第 2（先做数据表，不必改文案） |
| `/guide/*` | 410×2 | 低（1711 / 1050） | **低**（0.064 / P90 0.094 / 无 >0.8） | 低 | 低 | **低** | 否（维持） |

核心判断（每条标注性质）：

1. **[实测] 1262 个内容页、2524 个 SSR 渲染，没有任何一页与同类最近邻的掩码后 5-gram Jaccard >0.8，也没有 >0.5。** 用户提出的「>0.8 页面比例」在三类页 × 两语言均为 **0%**。原始（不掩码）相似度更低。按 Google canonicalization 文档的判定口径（「primary content very similar」才会聚类），**不存在被聚类/去重为同一 canonical 的近重复风险**——这是[推断]，因为 Google 的聚类阈值未公开。
2. **[实测] 不是「薄内容」。** 去掉导航/footer/JSON-LD/链接 chip 后，正文中位 594–1711 词，唯一句子 32–54 句/页，每页 3 条 FAQ（6 个 `cn-*` 政策指南为 4 条），FAQ `<details>` 数与 JSON-LD FAQPage `mainEntity` 数 2524/2524 一致。最短页 `/tld/space` en 431 词也远非「内容空短」。
3. **[实测+人工] 真正的风险不是「页面之间抄」，而是「同一骨架填空」+「页内自我复读」：**
   - 三类页 25%–42% 的句子（掩码后）在 ≥20% 同类页里逐字出现（`templateSentShare` 中位：tld zh 0.421 / en 0.378，guide 0.326 / 0.240，vs 0.250 / 0.250）。但**逐条看这些句子几乎全是 H2 标题、FAQ 问句、CTA、价格标签和一条「如何注册」FAQ 答案**（`template-sentences.json`），不是正文。
   - **[实测] 页内复读**：`/tld` 页 FAQ 第 1 答 = 整段简介原文 + 第 3 答 = 命名建议 4 条拼接，导致 18% (zh) / 20% (en) 的句子在页内重复（`dupSentenceRatio`）；`/vs` 同为 19–20%；`/guide` 12–14%。
   - **[人工] 80 个 ccTLD `/tld` 页是同一句式模板填空**（「X 是 Y 的国家域名，由 Z 运营，注册量约 N……本地消费者对本土信号非常敏感……Google 也会把 .X 站点与 Y 地区相关联……资格上 .X 完全开放……库存比 .com 充裕得多……命名上品牌词直接上（brand.X）最主流……」）。事实槽位（注册局、注册量、价格、资格）是真的且页页不同，换掉 TLD 名后事实不成立，但**句子骨架 60%+ 可互换**。gTLD `/tld` 页与 `/vs` 判断段是「同一提纲、不同句子」，`/guide` 完全独立成文。
4. **[实测+代码事实] 一个被忽略的结构性问题：每个内容页 `<main>` 内含 408/410/444 个「其他 TLD 指南 / 其他行业命名指南 / 其他后缀对比」全量链接 chip**（`TLD_LIST.map(...)`，`apps/web/src/components/tld-page.tsx:119`；guide/compare 同构），使**可见正文里 47%–74% 的字是链接 chip**（tld en 中位 73.8%），每页 HTML 182–190 KB，且这 400+ 个链接在同类所有页上完全相同。这不构成 Google 定义下的 spam，但直接对应 Bing「Excessive low-value URLs, duplication, or crawl waste」与 Google「cookie-cutter … same or similar content replicated within the same site」的字面描述，并且稀释每页的主题信号——[推断]。
5. **[推断] 对照三家官方口径：**
   - Google *scaled content abuse* 的构成要件是「many pages … for the primary purpose of manipulating search rankings and not helping users」+「unoriginal content that provides little to no value」。本站页面有原创、有事实、有 FAQ、有价格，但 `/vs` 444 组的「判断段」全部是编辑推理、**0 项该组合独有的数据**（无真实价差表、无注册量、无到期分布），最接近 Helpful content 自评里「Does the content provide substantial value when compared to other pages in search results?」的否定面——所以 `/vs` 是「低价值」而非「重复」风险。
   - Bing 对「Large-scale content generated without oversight, quality control, or editorial review … may be excluded from indexing」的表述比 Google 更硬；本站内容是模板 + 人工编辑事实，不属于「without oversight」，但 Bing 无法从页面判断这一点——[未验证]。
   - 百度飓风 3.0 明确把「内容相似度高、甚至复用相同模板」列为站群/低质特征；本站单站、单模板、事实不同，属灰区。百度侧无任何索引数据（`baiduLast: null`）——[未验证]。
6. **[未验证] 任何「已被降权 / 已被聚类 / 索引率」的结论本轮都不能下**：无 GSC、无 Bing Webmaster、无百度资源平台数据；公开 `site:` 结果不是权威索引数（沿用 R488 的告诫）。本报告只回答「按官方口径，页面本身有多像会被打的东西」，不回答「有没有被打」。

**最小改法优先级（详见 §6）**：① `/tld` FAQ 答案去复读 + 80 个 ccTLD 页改写为事实驱动段落（含注册局政策原文链接、生产实测可注册率）；② 全量 400+ 链接 chip 改为「同组 ≤30 个 + hub 链接」；③ `/vs` 加「只有该组合才成立」的数据表（真实首年/续费价差、`/api/prices` 实时价、RDAP 到期分布）；④ `/guide` 不动。**不建议 noindex / 合并任何页**：没有一对页面达到近重复阈值，合并会丢掉真实事实差异。

---

## 1. 范围、约束与执行记录

- 输入：生产 `sitemap.xml` 1270 条 `<loc>`；按精确一段路径 `^/(tld|guide|vs)/[^/?#]+$` 选出 **631 个内容页**（408 tld + 410 guide + 444 vs；hub `/tld` `/guide` `/vs` 排除）。任务说明中的「404 guide / 1256 页」与实测 410 / 1262 差 6 页 = 6 个 `cn-*` 政策指南（`/guide/cn-icp-beian` 等，各 4 条 FAQ）。
- 每页抓 zh（裸路径）+ en（`?lang=en`）= **2524 请求，全部 HTTP 200，非 200 = 0**（`fetch-meta.json`）。并发固定 4（脚本内 clamp 1..4），UA `Mozilla/5.0 (compatible; DomainHunter-audit/1.0; +https://github.com/wookat/domainhunter) SiteAuditBot`（含 `SiteAuditBot` → worker 归 `botsBy.other`，不污染人类 pageviews）。
- 0 AI：未请求 `/api/ai-search`；`/api/usage?days=1` 抓取前 `searches 0 / fast 0 / refine 0 / botsBy.other 321`，抓取后 `searches 0 / fast 0 / refine 0 / botsBy.other 2862`（Δ +2541 ≈ 2524 抓取 + 少量校验请求）。
- 未改任何内容页、worker、workflow；未部署、未合并。原始 HTML（~465 MB）留在被 `.gitignore` 的 `scripts/seo-audit/out/r512/`，不入库。

## 2. 文献：官方原文摘录（全部本轮逐句核对存在于线上页面）

### 2.1 Google Search Central

**Spam policies** — <https://developers.google.com/search/docs/essentials/spam-policies> [原文]
- Scaled content abuse：> "Scaled content abuse is when many pages are generated for the primary purpose of manipulating search rankings and not helping users." > "This abusive practice is typically focused on creating large amounts of unoriginal content that provides little to no value to users, no matter how it's created."
- Thin affiliation：> "Thin affiliation is the practice of publishing content with product affiliate links where the product descriptions and reviews are copied directly from the original merchant without any original content or added value." > "These sites often appear to be cookie-cutter sites or templates with the same or similar content replicated within the same site or across multiple domains or languages."
- Doorway abuse：> "Doorway abuse is when sites or pages are created to rank for specific, similar search queries. They lead users to intermediate pages that are not as useful as the final destination." 例子：> "Creating substantially similar pages that are closer to search results than a clearly defined, browseable hierarchy."

**Creating helpful, reliable, people-first content** — <https://developers.google.com/search/docs/fundamentals/creating-helpful-content> [原文]
- > "Does the content provide original information, reporting, research, or analysis?"
- > "Does the content provide a substantial, complete, or comprehensive description of the topic?"
- > "Does the content provide substantial value when compared to other pages in search results?"
- > "Is the content mass-produced by or outsourced to a large number of creators, or spread across a large network of sites, so that individual pages or sites don't get as much attention or care?"
- > "Are you using extensive automation to produce content on many topics?"
- > "Does your content leave readers feeling like they need to search again to get better information from other sources?"
- > "Are you writing to a particular word count because you've heard or read that Google has a preferred word count? (No, we don't.)"
- > "After reading your content, will someone leave feeling they've learned enough about a topic to help achieve their goal?"

**Canonicalization / duplicate content** — <https://developers.google.com/search/docs/crawling-indexing/canonicalization> [原文]
- > "Canonicalization is the process of selecting the representative –canonical– URL of a piece of content."
- > "Some duplicate content on a site is normal and it's not a violation of Google's spam policies."
- > "If Google finds multiple pages that seem to be the same or the primary content very similar, it clusters them together."
- > "indicating a canonical preference is a hint, not a rule."

**AI-generated content** — <https://developers.google.com/search/docs/fundamentals/using-gen-ai-content> [原文]
- > "However, using generative AI tools or other similar tools to generate many pages without adding value for users may violate Google's spam policy on scaled content abuse."
- > "When creating content for the web, focus on accuracy, quality, and relevance, especially when automatically generating the content."

**SEO Starter Guide** — <https://developers.google.com/search/docs/fundamentals/seo-starter-guide> [原文]
- > "The length of the content alone doesn't matter for ranking purposes (there's no magical word count target, minimum or maximum, though you probably want to have at least one word)."

### 2.2 Bing Webmaster Guidelines — <https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a> [原文]（页面客户端渲染，用 Playwright `networkidle` 后取 `document.body.innerText` 核对）
- 重复内容：> "Publishing the same or substantially similar content across multiple URLs reduces confidence in selecting a preferred version. Address duplication at the source through proper URL management and structure. Canonical tags help signal preference but do not replace fixing underlying issues."
- 低价值 URL：> "Outputting excessive or low‑value URLs, such as duplicate content or URLs with numerous parameters"
- 规模化生成：> "Large‑scale content generated without oversight, quality control, or editorial review often lacks usefulness, accuracy, and originality, and may be excluded from indexing."
- 联盟/薄页：> "Sites that primarily redirect users to retailers without providing original value such as unique reviews, comparisons, or analysis may experience reduced visibility or removal." > "Thin, ad heavy, or affiliate-only URLs may lose ranking eligibility and grounding visibility."
- 抓取效率：> "Excessive low-value URLs, duplication, or crawl waste can:" … > "Delay indexing of important content"

### 2.3 百度搜索资源平台 [原文]（页面客户端渲染，Playwright 核对）

**《百度搜索优质内容指南》** — <https://ziyuan.baidu.com/college/articleinfo?id=2947>
- 适用范围：> "所有与百度搜索合作的内容生产者，包括但不限于智能小程序、百家号、H5站、PC站等。"
- > "对用户没有检索价值的页面，如色情、违法、作弊页面，低质页面（页面死链、空白、内容空短）等内容属于百度搜索算法严厉打击的低质作弊问题"
- > "百度搜索对优质内容的衡量其实很简单，会通过内容的'出身'、'颜值'、'内涵'和'口碑'来进行判断。"
- > "内容具有一定的专业深度，讲解透彻，深度聚焦，可以给用户全面的分析和阐述。"

**《百度搜索优质内容解读》** — <https://ziyuan.baidu.com/college/articleinfo?id=3137>
- > "涉及的领域不应该过杂，不应浪费精力去生产、堆砌不熟悉的内容"
- > "需要结合用户的场景给出实际具体明确的解决方案，不能给出笼统但没有真实落地价值的意见"
- > "能够努力深挖深层次的原因、逻辑，多角度、多覆盖地全面分析和阐述观点。"

**飓风算法 3.0 公告** — <https://ziyuan.baidu.com/wiki/2848>
- > "本次算法升级主要针对跨领域采集以及站群问题"
- > "站群中的站点/智能小程序大多质量低、资源稀缺性低、内容相似度高、甚至复用相同模板，难以满足搜索用户的需求。"
- > "内容质量及相关性低、对搜索用户价值低。"

**百度搜索算法大盘点（内容质量）** — <https://ziyuan.baidu.com/college/documentinfo?id=2797&page=2>
- 飓风 2.0：> "存在多段文章拼接的内容，文章逻辑性差，无法满足用户需求，阅读体验差。"
- 细雨：> "正文内容不完整，频繁穿插变形的受益方式。" > "正文中商品或者服务信息内容为乱采集、拼接而成、排版混乱、用户从页面中无法获得商品或者服务信息。"

**细雨算法 2.0 公告** — <https://ziyuan.baidu.com/wiki/2883>
- 针对 > "B2B领域低质内容"；示例 > "发布无法满足用户需求的空白页面，对用户完全无价值。" > "页面内容低质。如：页面中只有图片无有效信息，或信息提供不完善等情况。"

### 2.4 从原文抽出的可操作判定口径（[推断]，用于 §5 分级）

| 口径 | 来源 | 本站对应可测项 |
|---|---|---|
| 「primary content very similar」才聚类 | Google canonicalization | 掩码后正文最近邻 Jaccard（§4.2） |
| 「unoriginal … little to no value」 | Google scaled content abuse | 页内独有事实数、独有数据表数（§4.4 人工） |
| 「cookie-cutter … same or similar content replicated within the same site」 | Google thin affiliation | 模板句占比、全量链接 chip 占比（§4.1/4.3） |
| 「substantially similar pages … closer to search results than a browseable hierarchy」 | Google doorway | `/vs` 444 组合的差异化程度（§4.4） |
| 「excessive low-value URLs, duplication, crawl waste」 | Bing | 每页 400+ 同构链接、HTML 182–190 KB（§4.3） |
| 「内容相似度高、复用相同模板」/「多段拼接」 | 百度飓风 | ccTLD 填空簇、FAQ 复读（§4.2/4.4） |

## 3. 方法（可复现）

1. **正文抽取**：取 `<main>`；去 `<nav>/<header>/<footer>/<aside>`、`<script>/<style>/<svg>`、JSON-LD。`bodyWords` = 剩余可见文本；`proseWords` = 再去掉所有 `<a>…</a>`（把 400+ 链接 chip 和相关链接排除）。字数：每个 CJK 字 1 词 + 拉丁按空白 1 词。
2. **句子**：块级标签边界断行，再按 `。！？!?；;` 与英文句号+大写切分，去空白后 ≥4 字符计一句；`uniqueSentences` 去重；`dupSentenceRatio = 1 − unique/total`。
3. **FAQ**：`<main>` 内 `<details>` 数；与 JSON-LD `FAQPage.mainEntity` 数交叉校验。
4. **变量词掩码**：面包屑当前项（`.shop` / `动画工作室` / `.baby vs .store`）按空白与 ` vs ` 切出的各词 → `Ⓥ`；所有 `\.[a-z][a-z0-9-]+` TLD 形态 → `Ⓣ`；数字与货币金额 → `Ⓝ`。guide 页只掩码面包屑给出的行业名，行业近义词（如「动画公司」）不掩码，因此 guide 的掩码相似度是**保守值**（略低估）。
5. **相似度**：zh 字符 5-gram（去空白与标点），en 小写单词 5-gram；**同类同语言全量两两 Jaccard**（tld 83k 对、guide 84k 对、vs 98k 对 ×2 语言），每页取最近邻 `nnMasked`（掩码后）与 `nnRaw`（原文）；输出中位数 / P90 / max、`>0.8`、`>0.5`、`>0.3` 页面占比。
6. **模板占比**：`templateShare50` = 本页 shingle 中在同类 ≥50% 页出现的比例；`templateSentShare` = 本页句子（掩码后）在同类 ≥20% 页出现的比例。
7. **跨类复用**：`vsReuseFromTld` = `/vs/a-vs-b` 的句子（≥10 字符）逐字出现在 `/tld/a` 或 `/tld/b` 同语言页的比例。
8. **人工抽读**：seed 512 的确定性抽样（`manual-sample.json`），三类各 10 slug，zh 全文通读、en 抽 4 页对读。

## 4. 实测数据

### 4.0 抓取与配额自证

| 项 | 值 |
|---|---|
| sitemap `<loc>` | 1270 |
| 内容页 / 渲染数 / 请求数 | 631 / 1262 / 2524 |
| 非 200 | 0 |
| HTML 中位体积 | tld 182–183 KB · guide 184–187 KB · vs 190 KB |
| `/api/usage` 前 → 后 | searches 0→0 · fast 0→0 · refine 0→0 · botsBy.other 321→2862 · botsBy.ai 560→561 |

### 4.1 正文规模（每类 × 语言，中位 [P10–P90]）

| 类/语 | n | 正文词数 `proseWords` | 含链接 chip 全文 `bodyWords` | 链接 chip 占可见正文 | 唯一句 | 页内复读率 | FAQ |
|---|---|---|---|---|---|---|---|
| tld zh | 408 | **978** [850–1108]，min 706 (`/tld/gg`) | 2659 | **63.2%** | 37 | 18.2% | 3 |
| tld en | 408 | **594** [481–681]，min 431 (`/tld/space`) | 2265 | **73.8%** | 38 | 20.4% | 3 |
| guide zh | 410 | **1711** [1478–1975]，min 1294 | 3660 | 53.2% | 44 | 12.2% | 3（6 页 4） |
| guide en | 410 | **1050** [871–1195]，min 729 | 2004 | 47.6% | 45 | 14.0% | 3（6 页 4） |
| vs zh | 444 | **1184** [761–1430]，min 628 (`/vs/app-vs-dev`) | 2551 | 53.7% | 42 | 20.4% | 3 |
| vs en | 444 | **722** [469–855]，min 371 | 2081 | 65.3% | 42 | 19.2% | 3 |

FAQ `<details>` 与 JSON-LD `mainEntity` 数：2524/2524 一致。

### 4.2 同类相似度（掩码后 5-gram Jaccard）

| 类/语 | 最近邻 中位 | 最近邻 P90 | 最近邻 max（页对） | >0.8 | >0.5 | >0.3 | 全部页对 中位 / P90 | 原文最近邻 中位 |
|---|---|---|---|---|---|---|---|---|
| tld zh | 0.262 | 0.387 | 0.497 (`/tld/mx`↔`/tld/pl`) | **0%** | 0% | 29.2% | 0.183 / 0.209 | 0.182 |
| tld en | 0.203 | 0.293 | 0.443 (`/tld/berlin`↔`/tld/boston`) | **0%** | 0% | 9.8% | 0.149 / 0.169 | 0.130 |
| guide zh | 0.064 | 0.094 | 0.154 (`/guide/eggcarving`↔`/guide/pyrography`) | **0%** | 0% | 0% | 0.050 / 0.057 | 0.058 |
| guide en | 0.042 | 0.068 | 0.106 | **0%** | 0% | 0% | 0.031 / 0.036 | 0.035 |
| vs zh | 0.193 | 0.299 | 0.427 (`/vs/id-vs-sg`↔`/vs/ph-vs-sg`) | **0%** | 0% | 9.5% | 0.078 / 0.094 | 0.178 |
| vs en | 0.141 | 0.218 | 0.340 | **0%** | 0% | 2.3% | 0.058 / 0.072 | 0.136 |

`/tld` zh 细分（[实测]，两字母 slug = ccTLD）：**ccTLD 80 页** 最近邻中位 **0.342**、P90 0.45、62.5% >0.3；**gTLD 328 页** 中位 0.256、P90 0.343、20.7% >0.3。Top-30 最近邻对（`nearest-pairs.csv`）tld zh 全是 ccTLD 或城市 TLD（mx/pl、ro/sk、nz/pt、ke/ng、ar/cl、berlin/boston、amsterdam/paris…）；vs zh 顶部同样是 ccTLD 组合（id-vs-sg / ph-vs-sg、de-vs-com / uk-vs-com / fr-vs-com）。

### 4.3 模板句与跨类复用

| 类/语 | `templateSentShare` 中位（句子在 ≥20% 同类页出现） | `templateShare50` 中位（shingle 在 ≥50% 同类页出现） | `vsReuseFromTld` 中位 / P90 / max |
|---|---|---|---|
| tld zh / en | 0.421 / 0.378 | 0.310 / 0.251 | – |
| guide zh / en | 0.326 / 0.240 | 0.093 / 0.060 | – |
| vs zh / en | 0.250 / 0.250 | 0.139 / 0.106 | 0.167 / 0.290 / 0.414 (`/vs/tw-vs-hk`)；ccTLD-vs-ccTLD 62 页中位 0.286 |

模板句清单（`template-sentences.json`）逐条性质 [实测]：
- tld zh 出现率 ≥98% 的 15 句 = H1 骨架、价格标签、4 个 H2、3 个 FAQ 问句、CTA 标题+2 句、链接区标题 ×3、以及 **1 条 FAQ 答案**（「在 DomainHunter 描述你的想法，AI 批量构思并通过 RDAP/DNS/WHOIS 实时核验 Ⓣ 可注册状态；可注册的名字直接跳转注册商……」——408/408 页相同，仅换 TLD）。
- guide zh ≥96% 的 14 句 = H2 ×5、FAQ 问句 ×3、CTA ×2、链接区标题 ×3、「推荐后缀：Ⓣ、Ⓣ、Ⓣ。」。
- vs zh ≥99% 的 9 句 = 价格标签、H2、FAQ 问句 ×2、CTA ×2、链接区标题 ×3。
- **没有任何正文段落句进入 ≥20% 阈值**——模板句几乎全是骨架而非正文。

### 4.4 人工抽读（三类各 10 页，seed 512；zh 通读，en 对读 `/tld/at` `/tld/pl` `/guide/beauty` `/vs/com-vs-net`）

列说明：正文词 zh/en；换掉 TLD/行业名后是否仍「成立」（成立 = 句子照样通顺且不产生假事实 → 模板；不成立 = 会变成假事实 → 该页独有）；模板句占比 = 人工估计的**骨架+可互换句**占全部句子比例（与 `templateSentShare` 对照）。

| 页 | 正文词 zh/en | 最近邻 (zh) | `templateSentShare` zh/en | 人工判定 | 独有事实举例（换名即假） |
|---|---|---|---|---|---|
| `/tld/at` | 1066/647 | 0.415 `/tld/pt` | 0.395/0.278 | **ccTLD 填空模板**：简介段 ~60% 句式与 pt/uy/mx/pl 同（「X 是 Y 的国家域名，由 Z 运营……本地消费者对本土信号非常敏感……Google 也会把 .X 站点与 Y 地区相关联……资格上 .X 完全开放……库存比 .com 充裕得多……命名上品牌词直接上」）；剩余 40% 为该页独有 | nic.at、150 万注册、$14 平续、DACH 辐射、meet.at 类 domain hack |
| `/tld/band` | 908/549 | 0.221 | 0.444/0.417 | 不成立；骨架句（H2/FAQ 问/CTA/价格）≈40%，正文独立 | Identity Digital、$16/$25、乐队名商标风险、the.band 已注册 |
| `/tld/florist` | 946/579 | 0.262 `/tld/plumbing` | 0.429/0.368 | 不成立；gTLD 共用「注册局为 X，首年约 $、续费约 $ / 库存极好：… 早被占光 / 注意三点：一是…二是…三是… / 命名上「A + .X」适合…」**提纲式**结构，句子内容不同 | $8/$26、与 .garden/.boutique 分工 |
| `/tld/forum` | 906/597 | 0.237 `/tld/study` | 0.429/0.368 | 同上 | Fegistry、$2/$31、早年定价数百美元、与 .community/.chat 分工 |
| `/tld/hair` | 936/563 | 0.380 `/tld/makeup` | 0.444/0.385 | 不成立，但与 `.makeup/.skin`（同为 XYZ 美妆系）提纲高度同构 | 欧莱雅发起、XYZ 运营、$2/$13 |
| `/tld/mortgage` | 976/591 | 0.279 | 0.429/0.350 | 不成立 | NMLS 牌照、与 .loans/.estate/.credit 分工 |
| `/tld/us` | 798/447 | 0.215 | 0.469/0.424 | 不成立（简介段最短，骨架占比因此最高） | Nexus 申报、注册局禁 WHOIS 隐私 |
| `/tld/uy` | 1256/777 | 0.356 `/tld/pe` | 0.385/0.351 | **ccTLD 填空模板**（同 at），但事实密度高 | SeCIU、6 万注册、dLocal/PedidosYa、2012 年开放直注、$53 平续 |
| `/tld/website` | 968/621 | 0.220 | 0.417/0.368 | 不成立 | Radix、与 .site 同门、$2/$21 十倍续费 |
| `/tld/works` | 862/523 | 0.225 | 0.421/0.417 | 不成立 | 双关语义、Identity Digital |
| `/guide/beauty` | 1419/855 | 0.054 | 0.326/0.188 | **不成立**；除 H2/FAQ 问/CTA 外无可互换句 | Glossier/The Ordinary/Fenty/Drunk Elephant/花西子 拆解 |
| `/guide/dayspa` | 1478/902 | 0.069 | 0.333/0.245 | 不成立 | 悦榕/Chuan Spa/ESPA/Bliss |
| `/guide/fanclub` | 1393/924 | 0.075 | 0.333/0.293 | 不成立 | Weverse/Fandom/ARMY/LOFTER |
| `/guide/hotpot` | 1964/1144 | 0.059 | 0.333/0.176 | 不成立 | 海底捞/巴奴/楠火锅/怂火锅/小龙坎 |
| `/guide/marketing` | 1739/1019 | 0.053 | 0.311/0.261 | 不成立 | Ogilvy/Wpromote/无忧传媒/VaynerMedia |
| `/guide/music` | 1489/869 | 0.051 | 0.318/0.191 | 不成立 | Bandcamp/Warp/Grimes/88rising |
| `/guide/nutcarving` | 1738/1240 | 0.126 `/guide/insidepainting` | 0.357/0.167 | 不成立；「传统手工艺」子簇（核雕/内画/蛋雕/烙画）提纲相近，是 guide 里最相似的一簇，仍远低于 0.3 | — |
| `/guide/papermaking` | 1688/1154 | 0.100 | 0.375/0.240 | 不成立 | — |
| `/guide/pottery` | 1933/1170 | 0.065 | 0.311/0.214 | 不成立 | Heath/乐天陶社/East Fork/Ghost Wares/半窑 |
| `/guide/realestate` | 1316/729 | 0.062 | 0.318/0.293 | 不成立 | Zillow/贝壳/Compass/Opendoor |
| `/vs/app-vs-site` | 1068/652 | 0.189 | 0.263/0.278 | 判断段不成立（HSTS 预载 vs 白纸）；两侧简介段 20% 逐字取自 `/tld/app` `/tld/site` | HSTS、价格结构 |
| `/vs/capital-vs-fund` | 1060/683 | 0.212 | 0.237/0.243 | 判断段不成立 | 机构 vs 单只基金，$6/$57 vs $9/$57 |
| `/vs/com-vs-net` | 638/377 | 0.200 | 0.313/0.235 | 判断段仅 3 句，**最薄的 vs 类型**（早期页）；不成立但信息量低 | — |
| `/vs/email-vs-cloud` | 910/505 | 0.162 | 0.250/0.257 | 判断段不成立 | 宽窄语义、客户实例子域 |
| `/vs/fyi-vs-info` | 1144/683 | 0.156 | 0.250/0.250 | 判断段不成立 | .fyi $6 平续 vs .info 首年低续费高、2001 首批 |
| `/vs/io-vs-co` | 726/424 | 0.281 `/vs/com-vs-io` | 0.294/0.229 | 判断段短；与 `com-vs-io` 共用 .io 侧简介 | t.co、github.io |
| `/vs/kz-vs-tr` | 1196/752 | 0.213 | 0.237/0.225 | 判断段不成立；两侧简介 **33%** 逐字来自 `/tld/kz` `/tld/tr` | 解析服务器须在哈国境内、TRABİS 2023 开放 |
| `/vs/marketing-vs-agency` | 1063/648 | 0.266 | 0.250/0.256 | 判断段不成立 | 九字母长度、$6/$33 vs $/24 |
| `/vs/paris-vs-london` | 1473/879 | 0.198 | 0.225/0.184 | 判断段不成立 | Ville de Paris 持有、London & Partners、$49 vs $14/$28 |
| `/vs/supply-vs-express` | 1298/799 | 0.177 | 0.250/0.238 | 判断段不成立 | 单数/复数后缀、一口价 vs 首年钓鱼 |

人工小结 [人工]：
- **`/tld`**：抽到的 10 页中 2 页（at、uy）为 ccTLD 填空模板；把这一判断外推到全部 80 个两字母 ccTLD 页有实测支撑（§4.2 ccTLD 子集最近邻中位 0.342 vs gTLD 0.256）。gTLD 页是「同一提纲、不同句子」，换名不成立。**每页 FAQ 第 1 答 = 简介段原文复制、第 3 答 = 命名建议 4 条拼接**，是页内复读率 18–20% 的全部来源。
- **`/guide`**：10/10 换名不成立；模板句 = 骨架，正文完全独立成文，有真实品牌案例拆解。
- **`/vs`**：10/10 判断段换名不成立，但 (a) 两侧「简介 + 适合情况」段 11–33% 逐字复用 `/tld` 页；(b) **没有一页有该组合独有的数据**（价差表、注册量、到期分布），差异化全靠编辑文字；(c) `com-vs-net` 类早期页判断段仅 3 句；(d) FAQ 结构与 `/tld` 同：第 1 答 = 判断段原文复制，第 2/3 答 = 两侧「适合情况」4 条拼接（`/vs/kz-vs-tr` 逐字核对），是 vs 页内复读率 19–20% 的来源。

## 5. 论证：分级与证据链

### 5.1 `/tld/*`（综合 **中**）
- 薄内容 **低** [实测]：978/594 词，35–40 唯一句，3 FAQ，事实密度高（注册局、注册量、价格、资格、分工）。
- 近重复 **中** [实测+人工]：无一页 >0.5；但 80 个 ccTLD 页是同一句式模板，最近邻中位 0.342，10 对最相似页对全部为 ccTLD/城市 TLD。按 Google「primary content very similar」口径**未达聚类程度**（[推断]），按百度飓风「复用相同模板」字面口径**命中**（[推断]，单站非站群）。
- 程序化低价值 **中** [推断]：内容有原创事实 → 不符合「unoriginal … little to no value」；但 FAQ 复读、CTA 与「如何注册」答案 408 页相同、正文 63–74% 是链接 chip，构成 Helpful content 自评「Are you using extensive automation to produce content on many topics?」的正面答案。
- Doorway **低** [推断]：每个 TLD 一页、有独立事实、有 hub 层级，不属「closer to search results than a browseable hierarchy」。
- Thin affiliation **低-中** [推断]：页面含注册商跳转（`/?tld=` → 结果页再跳注册商），但描述非「copied directly from the original merchant」；不过 Bing 的「Sites that primarily redirect users to retailers without providing original value such as unique reviews, comparisons, or analysis」需要页面上有可见的 original analysis——目前 ccTLD 页的 analysis 是模板句。

### 5.2 `/vs/*`（综合 **中-低**）
- 薄内容 低 [实测]；近重复 低-中 [实测]（最近邻中位 0.193，无 >0.5；ccTLD 组合顶部 0.427）。
- 程序化低价值 **中-低** [实测+推断]：判断段独有，但零数据差异化；两侧简介 16.7%（ccTLD 组 28.6%）逐字复用 `/tld`。对照 Google「substantial value when compared to other pages in search results」——`.com vs .net` 这种查询 SERP 上已有大量同类文章，本页 3 句判断 + 复用简介，价值增量小。
- Doorway **低-中** [推断]：444 组合来自 TLD 两两配对，是「rank for specific, similar search queries」的典型形态；缓解因素是每页判断段确为编辑撰写、非机械拼接。

### 5.3 `/guide/*`（综合 **低**）
- 全部指标最低（最近邻中位 0.064 / P90 0.094、`templateShare50` 0.093），10/10 人工换名不成立，有品牌案例拆解。唯一共性问题是 410 个链接 chip 与 FAQ 骨架。**不建议投入**。

### 5.4 三家口径下的整体位置 [推断]
- Google：**不构成 scaled content abuse**（有原创、有事实、非「manipulating rankings」为主目的），**不构成 doorway**；但 `/tld` ccTLD 簇与 `/vs` 的价值增量属于 Helpful content 自评的弱项。
- Bing：**主要暴露在 crawl efficiency 而非 spam**——每页 400+ 同构链接、182–190 KB HTML、1270 URL 全部 `indexnowPending`（`/api/usage` 显示 IndexNow 429 `Too many requests`，见 §7）。
- 百度：**灰区**——单站单模板、事实不同；无任何百度侧数据（`baiduLast: null`）。

## 6. 最小改法建议（均为建议，本轮未实施；成本按单会话工作量估）

| # | 建议 | 针对 | 预期收益 | 成本 | 依据性质 |
|---|---|---|---|---|---|
| 1 | **`/tld` FAQ 去复读**：第 1 答改为 2–3 句「适合谁」摘要（不再粘贴整段简介），第 3 答改为 1 句总结 + 指向命名建议锚点；`/vs` 同理 | 408+444 页 ×2 语 | 页内复读率 18–20% → <5%；FAQ JSON-LD 与可见文本一致性不变 | 低（改 `ssr-html.ts`/页面组件的 FAQ 生成逻辑一处，内容数据不动；0.5 会话） | [实测] 复读来源已定位 |
| 2 | **80 个 ccTLD `/tld` 页改写为事实驱动**：每页加「注册局政策原文」段（注册资格/本地存在要求/隐私政策，链接注册局官网）+「生产实测可注册率」（对该 TLD 跑 N=200 常见词根的 RDAP/DNS 检查，写死数字+日期）；删掉「本地消费者对本土信号非常敏感……」类可互换句 | 80 页 ×2 语 | ccTLD 簇最近邻从 0.34 → 预计 <0.25（与 gTLD 齐平），且每页多出 2 段不可互换事实，直接回应 Google「original information/research」与百度「专业深度」 | 中（文案 80×2 段 + 一个离线 RDAP 抽样脚本；可 5–10 并行子会话 1 会话完成；RDAP 抽样需限速） | [实测] 簇已定位；收益幅度为 [推断] |
| 3 | **全量链接 chip 收敛**：「其他 TLD 指南 / 其他行业命名指南 / 其他后缀对比」从全量 408/410/444 改为「同组（`tld-groups.ts`/`guide-groups.ts` 已有分组；`/vs` 可复用两侧 TLD 所属组）≤30 个 + 『查看全部 408 个 →』hub 链接」 | 全部 1262 渲染 | 可见正文中链接占比 47–74% → 预计 <25%；HTML 182–190 KB → 预计 <90 KB；Bing crawl efficiency 直接改善；hub 可达性由 hub 页与 sitemap 保证 | 低-中（3 个组件各一处 + R488/R502 内链图审计需复跑确认无孤岛；0.5–1 会话） | [实测+代码事实] 现状；收益为 [推断]。**注意**：此改动会改变 R502 内链图，需复跑 `scripts/seo-audit/` 图审计 |
| 4 | **`/vs` 加「只有该组合才成立」的数据表**：首年价/续费价/5 年总持有成本差（来自 `/api/prices` 实时 + 静态兜底，标注 `fetchedAt`）、两侧注册量（内容数据已有）、可选：两侧 N=100 常见词根可注册率对比（离线预计算，写入内容数据） | 444 页 ×2 语 | 每页新增 1 张不可互换数据表，`vsReuseFromTld` 权重被稀释；回应 Google「substantial value when compared to other pages」与百度「实际具体明确的解决方案」 | 中（表格组件 + 数据生成脚本；价格部分数据已在，1 会话；可注册率部分需限速 RDAP，另 1 会话） | [推断] |
| 5 | **`/vs` 早期短页补写**：`proseWords` 低于 P10 的页（zh <761 词，约 44 页；最短 `app-vs-dev` 628、`store-vs-online` 629、`com-vs-net` 638，判断段仅 3 句）补至与中位齐平 | ~44 页 ×2 语 | 消除「最薄一档 vs 页」 | 低-中（文案） | [实测] 已定位 |
| 6 | **不做**：noindex / 合并任何页 | — | 无页对达到近重复阈值（max 0.497）；合并会丢事实差异；noindex 会砍掉有独有事实的页 | — | [实测] |
| 7 | **不做**：为凑字数扩写 `/guide` 或任何页 | — | Google 明示无字数目标；guide 已是最优类 | — | [原文] |

建议执行顺序：1 → 3 → 2 → 4 → 5（1、3 是纯结构改动、收益面最广、成本最低；2、4 需要新数据）。**如无异议，父会话可按此顺序派单；本子会话不动代码。**

## 7. 需注意 / 局限 / 未验证

- **[未验证] 搜索引擎侧结果**：无 GSC、Bing Webmaster、百度资源平台数据，本报告不下任何「已被降权/聚类/索引率」结论。建议接入 GSC 后复跑本脚本并把 `pages.csv` 与 GSC「Crawled – currently not indexed」「Duplicate, Google chose different canonical」逐 URL 对表。
- **[实测·顺带] IndexNow 429**：`/api/usage` 显示 `indexnowLastError {status:429, message:"Too many requests", submitted:0}`、`indexnowPending:1270`、`indexnowLast` 停在 1788436834369（2026-09-03T12:00Z，距 `cronLast` 2026-09-05T12:00Z 已 48h 未成功推送）。不在本轮范围，但与 Bing 收录直接相关，建议单独开一轮排查。
- 相似度阈值 0.8/0.5/0.3 是本轮分析口径，不是任何搜索引擎公开阈值；5-gram Jaccard 对「同提纲不同句子」不敏感，因此 gTLD `/tld` 页与 `/vs` 判断段的「提纲同构」在数字上体现为 0.2–0.3 而非更高——人工抽读（§4.4）是对此的补充。
- guide 掩码只掩面包屑行业名，未掩行业近义词 → guide 相似度略低估（方向保守，不影响「guide 最低」结论）。
- en 人工抽读只对读 4 页；en 数值指标为全量。
- 原始 HTML 不入库；复跑 `thin-fetch.mjs` 会重新抓生产（2524 请求，≈20 s，4 并发）。生产 HTML 有 `max-age=600` 缓存，重复抓取对源站压力极小。

## 8. 复现

```bash
# 1) 抓取（4 并发、UA 含 DomainHunter-audit + SiteAuditBot、不请求 /api/ai-search；默认写 scripts/seo-audit/out/r512/）
node scripts/seo-audit/thin-fetch.mjs --concurrency 4          # 加 --force 覆盖已有 HTML；--groups tld,vs 或 --limit N 做冒烟
# 2) 分析（纯本地，~25 s；默认读 out/r512、写 docs/audits/r512/）
node scripts/seo-audit/thin-analyze.mjs                         # --in/--out/--seed 可覆盖；seed 决定人工抽读样本
```

产出文件：

| 文件 | 内容 |
|---|---|
| `docs/audits/r512/pages.csv` | 2524 行：group, lang, path, label, bodyWords, proseWords, proseChars, sentences, uniqueSentences, dupSentenceRatio, faqDetails, faqLd, nnMasked, nnRaw, nnPath, templateShare50, templateShare10, templateSentShare, vsReuseFromTld |
| `docs/audits/r512/summary.json` | 每类每语言分布（中位/P10/P90/max/>0.8/>0.5/>0.3）、抓取元数据、抽样 slug |
| `docs/audits/r512/nearest-pairs.csv` | 每类每语言 top-30 最近邻页对（掩码/原文 Jaccard） |
| `docs/audits/r512/template-sentences.json` | 每类每语言出现率 ≥20% 的模板句（掩码后）与出现页数 |
| `docs/audits/r512/manual-sample.json` | 人工抽读的 30 个 slug |
| `docs/audits/r512/fetch-meta.json` | 抓取时间、sitemap 数、请求数、非 200 数 |

相关：`docs/audits/seo-tech-audit-r488.md`（15 页/类抽样的前序相似度结论——本轮全量结果与其「TLD 页模板结构更重」方向一致，但 R488 未掩码、未全量、无 P90）。
