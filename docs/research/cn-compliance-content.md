# R483 调研：中文创业者 .cn 合规与流程内容（实名认证 / ICP 备案 / 注册商 / 生命周期）

查阅日期：2026-09-04（所有链接均为当日实际抓取，摘录为原文要点，不做二次转述加工）。
定位：为「中文创业者的域名猎手」补齐拿到 .cn/.com.cn 之后的独有痛点内容——英文竞品无法复制、且能与现有 /tld/cn、/vs/com-vs-cn 形成互链的 SEO 与信任资产。

---

## A.1 官方规则逐条核实

标注体系：**已核实** = 一手官方文档原文可查；**注册商口径** = 阿里云/腾讯云/西部数码帮助中心口径（属官方帮助文档，但为各家执行口径，非注册局统一规则）；**未核实** = 未找到一手依据，文章中不得断言。

### 1. .cn 实名认证：是否必须、谁审核

| 事项 | 结论 | 依据 |
| --- | --- | --- |
| 所有存量与新注册域名均需实名 | 已核实（注册商引用工信部 2017 年要求） | 腾讯云《域名实名认证》：「根据工信部2017年全面域名实名认证的要求，所有存量域名以及新注册域名均需进行实名认证」 https://cloud.tencent.com/document/product/242/6707 |
| 注册商不得为未提供真实身份信息的域名提供解析 | 已核实 | 工信部《关于规范互联网信息服务使用域名的通知》 https://www.miit.gov.cn/jgsj/xgj/hlwgl/art/2020/art_f4e6b2b5bc6b400ea35b5d7294a960bd.html |
| 申请者需提交身份证明；自然人/组织需提交的信息项 | 已核实 | CNNIC《国家顶级域名注册实施细则》第十九、二十条 https://www.cnnic.cn/n4/2022/0817/c93-335.html ；CNNIC《中国域名注册常见问题及解答》「联系注册服务机构，提交域名注册信息」 https://www.cnnic.cn/n4/2022/0919/c90-10605.html |
| 实名审核由注册局（CNNIC）终审，注册商只做初审/转交 | 注册商口径 | 西部数码《域名多久实名成功》：「实名审核资料非注册商审核，是上级审核机构，如中国互联网信息中心等」 https://www.west.cn/docs/123301.html |

### 2. 实名认证材料

| 主体 | 材料 | 依据 |
| --- | --- | --- |
| 企业（中国内地） | 营业执照 / 组织机构代码证 / 统一社会信用代码证等 | 腾讯云《域名实名认证》 https://cloud.tencent.com/document/product/242/6707 ；阿里云《域名实名认证》 https://help.aliyun.com/zh/dws/user-guide/how-to-complete-domain-name-authentication |
| 个人（中国内地） | 居民身份证 | 腾讯云同上 |
| 港澳台居民 | 港澳居民来往内地通行证 / 台湾居民来往大陆通行证 / 港澳台居民居住证 | 腾讯云同上 |
| 外国人 | 护照 / 外国人永久居留身份证 | 腾讯云同上 |
| 通用要求 | 提交彩色电子件（原件扫描件/彩色复印件/拍照件），信息真实、准确、完整；域名持有者名称须与证件一致 | CNNIC FAQ 第 6 条 https://www.cnnic.cn/n4/2022/0919/c90-10605.html ；阿里云同上 |
| 新注册时须先关联已通过实名的信息模板 | 注册商口径 | 腾讯云同上 |

### 3. 审核时限

| 事项 | 时限 | 性质 | 依据 |
| --- | --- | --- | --- |
| 信息模板审核 | 一般 1–3 个工作日（腾讯云）；通常 1 个工作日、部分 3–5 个工作日（阿里云） | 注册商口径 | 腾讯云 https://cloud.tencent.com/document/product/242/6707 ；阿里云 https://help.aliyun.com/zh/dws/user-guide/how-to-complete-domain-name-authentication |
| 域名关联已审核模板 | 一般可立即完成，部分需 1 个工作日 | 注册商口径 | 腾讯云同上 |
| 注册商向 CNNIC 提交注册信息 | 收到申请后 1 个工作日内 | 已核实 | CNNIC FAQ 第 4 条 https://www.cnnic.cn/n4/2022/0919/c90-10605.html |
| 实名审核通过后解除 serverHold | 约 1 个工作日（阿里云）；状态刷新为 OK 一般 1–2 个工作日（腾讯云 54080）/ 48 小时内（腾讯云 6707） | 注册商口径 | 阿里云 serverHold 文档；腾讯云 54080 / 6707 |
| 实名信息变更同步到工信部系统 | 可能需 2–3 天 | 注册商口径 | 阿里云《备案域名 FAQ》 https://help.aliyun.com/zh/icp-filing/basic-icp-service/support/for-the-record-domain-faq |

### 4. 未实名的后果：serverHold

| 事项 | 结论 | 性质 | 依据 |
| --- | --- | --- | --- |
| 未通过实名审核 → 注册局暂停解析（serverHold），网站无法访问 | 已核实（注册商官方文档一致） | 注册商口径 | 腾讯云 https://cloud.tencent.com/document/product/242/54080 ；阿里云 https://help.aliyun.com/zh/dws/support/how-to-unlock-a-domain-name-that-is-in-the-serverhold-or-clienthold-state |
| serverHold 四类原因：未实名 / 实名未通过 / 已通过但状态未刷新 / 域名滥用被注册局封禁 | 注册商口径 | 腾讯云 54080 |
| 触发时点：注册成功后 5 天注册信息审核期内未通过实名可能进入 serverHold | **单家注册商口径**（仅西部数码，腾讯云/阿里云文档未写天数） | 西部数码 https://gd.west.cn/faq/list.asp?Unid=463 |
| 解除时间：见第 3 节 | 注册商口径 | — |
| 未实名的域名不能赎回 | 注册商口径 | 阿里云《域名赎回》 https://www.alibabacloud.com/help/zh/dws/user-guide/redeem-a-domain-name |
| serverHold 是否会导致域名被删除 | **未核实**（西部数码称「不会被删除但无法正常使用」，属单家口径） | — | https://www.xjcncn.com/bangzhu/yuming/203.html 仅为代理商转述，不作依据 |

### 5. ICP 备案与域名的关系

| 事项 | 结论 | 性质 | 依据 |
| --- | --- | --- | --- |
| 域名本身不需要备案；用域名建网站（境内）才需网站备案 | 已核实 | CNNIC FAQ 第 9 条：「域名本身不需要备案。如您使用域名进行网站应用……需要进行网站备案。网站备案的工作不由我中心负责」 https://www.cnnic.cn/n4/2022/0919/c90-10605.html |
| 解析到中国内地服务器并开通 Web 服务 → 必须 ICP 备案；境外/香港服务器 → 无需 ICP 备案，但需公安联网备案 | 注册商口径（引用工信部规定） | 阿里云《不同场景备案 FAQ》 https://help.aliyun.com/zh/icp-filing/basic-icp-service/product-overview/faq-about-icp-filing-applications-in-different-scenarios |
| 备案前域名须已实名，且实名信息与备案主体一致 | 注册商口径 | 阿里云《准备与检查域名》 https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name |
| 域名持有者为个人、备案主体为公司：仅在法定代表人/股东/主要负责人等特殊情形、且部分省份允许 | 注册商口径 | 阿里云《备案域名 FAQ》 https://help.aliyun.com/zh/icp-filing/basic-icp-service/support/for-the-record-domain-faq |
| 注册商须为工信部批复机构、后缀须获工信部批复，否则不能备案 | 注册商口径 | 阿里云《准备与检查域名》同上 |
| 用于备案的域名距到期日一般需 ≥45 天（各省要求可能不同） | 注册商口径 | 阿里云《备案域名 FAQ》同上 |
| 主域名备案后子域名无需单独备案；接入其他服务商需办理接入备案 | 注册商口径 | 阿里云《备案域名 FAQ》同上 |
| 省通信管理局材料齐全 20 个工作日内完成备案 | 已核实 | 工信部《非经营性互联网信息服务备案管理办法》第十二条 https://www.miit.gov.cn/zwgk/zcwj/flfg/art/2017/art_43ec3819b2d04a31ad2c1c81c3f6100b.html |
| 接入商（ISP/云厂商）负责核验并代为提交备案；备案主体=网站责任主体 | 已核实（办法条文） | 同上 |
| 各省管局差异化规则（如个人备案能否用于经营网站） | **未核实**（各省不同，文章只提示「以所在省管局规则为准」） | — |

### 6. 境内解析 vs 境外解析

| 事项 | 结论 | 依据 |
| --- | --- | --- |
| 决定是否要备案的是**服务器/接入地**在境内，不是域名后缀；.cn 指向境外服务器不需要 ICP 备案 | 阿里云《不同场景备案 FAQ》同上（「服务器在中国香港或境外……无需 ICP 备案」） |
| 海外注册商同样提示「域名在中国境内解析须提交 ICP 备案号」 | Webnic .CN FAQ https://faq.webnic.cc/cn/kb/cn-domain/ |
| 境内 DNS 服务商是否强制要求备案后才能添加解析 | **未核实**（各家 DNS 产品策略不同） |

### 7. .cn 与 .com.cn

| 事项 | 结论 | 依据 |
| --- | --- | --- |
| 工信部域名体系：.CN 下 COM 类别定义为「工、商、金融等企业」 | 工信部《中国互联网络域名体系》 https://domain.miit.gov.cn/chinayu.jsp |
| CNNIC 细则第十八条：自然人、法人和非法人组织均可申请注册国家顶级域名（未对 .com.cn 单列限制） | https://www.cnnic.cn/n4/2022/0817/c93-335.html |
| 注册商实际是否接受个人注册 .com.cn | **未核实**（未逐家确认；文章表述为「以注册商下单页提示为准」） |
| 两者生命周期、实名规则一致（同属 CNNIC 国内域名） | 腾讯云《域名续费相关》把 .cn/com.cn/net.cn/.中国 归为同一「国内域名」规则 https://www.tencentcloud.com/zh/document/product/242/42863 |

### 8. 国内注册商 vs 海外注册商买 .cn

| 事项 | 结论 | 依据 |
| --- | --- | --- |
| 最终用户须通过 CNNIC 认证的注册服务机构办理注册/变更/转移/续费 | CNNIC https://www.cnnic.cn/n4/2022/0916/c174-10601.html |
| 海外注册商（Webnic）口径：中国地址持有人只能通过中国国内注册商申请；海外注册需 7 天内提交护照/公司注册文件，否则删除退费 | Webnic .CN FAQ https://faq.webnic.cc/cn/kb/cn-domain/ （单家海外注册商口径，文章标注为「以该注册商为例」） |
| 转移注册商：转出方验证后 3 个工作日内发转移密码；距到期不足 15 日不得转移 | CNNIC 细则第三十一、三十三条 https://www.cnnic.cn/n4/2022/0817/c93-335.html |
| 阿里云 vs 腾讯云 vs 西部数码价格/流程差异 | **未核实**（价格随促销变动，站内 /prices 与 /tld/cn 已有实时价，文章不写具体价格） |

### 9. 企业 vs 个人注册 .cn

| 事项 | 结论 | 依据 |
| --- | --- | --- |
| 自然人可注册 .cn（现行细则第十八条） | CNNIC 细则 https://www.cnnic.cn/n4/2022/0817/c93-335.html |
| 个人与企业实名材料不同（见第 2 节） | 腾讯云 6707 |
| 域名实名主体决定谁能作为备案主体（个人域名→个人备案；公司备案需公司持有域名，特殊情形除外） | 阿里云《备案域名 FAQ》同上 |
| 注册信息变更须在 30 日内办理 | CNNIC 细则第二十五条 |
| 域名过户（转让）由注册商建立规则并公示，需验证双方身份；注册商收到转让材料后 3 个工作日内审核 | CNNIC FAQ「如何转让（过户）」 https://www.cnnic.cn/n4/2022/0919/c90-10605.html |

### 10. 到期、续费宽限、赎回、删除

| 事项 | 结论 | 性质 | 依据 |
| --- | --- | --- | --- |
| 注册年限最长 10 年 | 已核实 | CNNIC 细则第十六条；CNNIC FAQ |
| 到期后自动进入 30 日续费确认期，未续费则注销 | 已核实 | CNNIC 细则第五十一条 https://www.cnnic.cn/n4/2022/0817/c93-335.html |
| 注册商执行：30 天续费宽限期（原价续费） | 注册商口径 | 阿里云《域名赎回》 https://www.alibabacloud.com/help/zh/dws/user-guide/redeem-a-domain-name ；腾讯云 https://www.tencentcloud.com/zh/document/product/242/42863 |
| 赎回期：.cn 约 14 天（阿里云）/ 约 15 天（腾讯云、Webnic），费用=赎回手续费+1 年续费，仅能续 1 年 | 注册商口径（各家略有差异，文章写「约两周」并注明以控制台为准） | 同上；Webnic FAQ |
| .cn 过赎回期后无等待删除期，「随时删除」/直接开放注册（约到期后 45 天） | 注册商口径 | 阿里云同上（「随时删除」）；Webnic（「到期日期的大约45天后对公众重新注册」） |
| 续费后解析恢复：腾讯云解析 72 小时内 | 注册商口径 | 腾讯云 42863 |
| 具体赎回费金额 | **未核实**（各注册商价格页实时变动，不写数字） | — |

---

## A.2 需求证据：搜索首屏结果

### 方法与局限（如实记录）
- 本机为数据中心出口 IP（140.232.64.5）。**百度**：10 个查询仅第 1 个返回真实 SERP，其余 9 个全部跳「百度安全验证」滑块；**Google**：全部跳 reCAPTCHA「异常流量」页。依公司规则不绕过人机验证，故未拿到完整百度/Google 首屏。
- 替代取证：(a) 百度成功的 1 条真实首屏；(b) 服务端搜索 API（web_search，索引来源为通用网页索引）对同 10 个查询的前 10 结果——用于判断「谁在回答这些问题」，不等价于百度/Google 排名；(c) 必应中国版结果因查询被截断（同一结果集重复出现）判定无效，已弃用。
- 原始数据：`/home/ubuntu/serp/baidu.json`、`/home/ubuntu/serp/websearch.json`（未入库；父会话如需可在真实住宅网络复跑 `serp.mjs`）。

### 查询清单与首屏来源

| # | 查询 | 首屏来源（按出现顺序） | 独立工具站？ |
| --- | --- | --- | --- |
| 1 | cn域名实名认证要多久 | **百度真实首屏**：西部数码、时代互联、腾讯云、阿里云开发者社区、新网、阿里云帮助中心、移动云、西部数码（8 条全是注册商/云厂商） | 无 |
| 2 | cn域名实名认证需要什么材料 | 阿里云国际站帮助、腾讯云文档 | 无 |
| 3 | 域名serverhold是什么意思 | 阿里云帮助、腾讯云文档、爱名网 22.cn、新手站长博客 | 无 |
| 4 | 域名备案和实名认证的区别 | 华为云主题页、腾讯云开发者社区 | 无 |
| 5 | 域名不备案能用吗 香港服务器 | 恒创科技（IDC 商）、酷番云知识库 | 无 |
| 6 | com.cn和cn哪个好 | 金米网（域名交易平台资讯，2026-08 发文） | 无 |
| 7 | 个人可以注册cn域名吗 | CNNIC 细则、CNNIC FAQ | 无 |
| 8 | cn域名过期多久可以重新注册 | CNNIC 细则、CNNIC FAQ、腾讯云开发者社区 | 无 |
| 9 | cn域名赎回期多少天 | 阿里云国际站帮助、腾讯云国际站文档、酷番云知识库 | 无 |
| 10 | 国外注册商可以注册cn域名吗 | Webnic FAQ、CNNIC FAQ、CNNIC 注册商页、酷番云知识库 | 无 |

### 结论：内容缺口与切入角度
1. **首屏被注册商/云厂商帮助中心垄断**：内容目的是「在我这里怎么操作」，各家时限口径不一（1 天 / 1–3 工作日 / 3–5 工作日），用户需要一个横向汇总。
2. **没有独立工具站**在回答这些问题（10/10 查询）。排名靠前的第三方是 IDC 商资讯、知识库农场（酷番云）、域名交易平台（金米网），无一提供「查询是否可注册 → 注册前合规须知」的闭环。
3. **官方原文难读**：CNNIC 细则与工信部办法在结果中出现，但用户需要的是条文→场景翻译（例：细则第五十一条「30 日续费确认期」对应注册商控制台的「续费宽限期」）。
4. 切入角度：**「查→注册→合规」一站式**——每篇文章以「先用精确核验查 xxx.cn 是否可注册」为 CTA，内容严格标注官方依据与「注册商口径」，横向对齐阿里云/腾讯云/西部数码时限差异，并与 /tld/cn、/vs/com-vs-cn 互链。英文竞品（Namelix/Instant Domain Search 等）没有任何一篇覆盖此主题。

---

## A.3 设计论证：放在哪

### 现状证据
- `/guide/:slug`（`apps/web/src/content/guides.ts`，404 条）由 `IndustryGuide { slug, keywords?, tlds[], zh, en }` 驱动；`GUIDE_LIST = Object.keys(INDUSTRY_GUIDES)` 同时喂给：sitemap（`worker.ts` `sitemapPaths`）、`/llms.txt`、SSR 路由 `/guide/:slug`（面包屑/Article/FAQPage JSON-LD + `guideContentBlocks`）、hub 索引（`scripts/gen-hub-index.mjs` → `hub-index-guide.ts`）、页脚（`guide-labels.ts` 手工列表）、计数护栏（`scripts/check-content-counts.mjs` ↔ `scripts/content-counts.json`）、分组（`guide-groups.ts` `GUIDE_CATEGORY_DEFS`，未列入的落到「更多行业」）。
- FAQ 由 `buildGuideFaq(guide, lang)` 程序化生成 3 问，SPA `<details>` 与 worker FAQPage JSON-LD 共用同一函数。
- CTA 固定 `/?tpl=<slug>` 预填 AI 模板；`/?mode=exact` 已存在（R472）可直接落到「精确核验」tab，不触发 AI。

### 方案对比

| 方案 | 改动面 | sitemap / llms / hub / footer / 计数 / SSR / 面包屑 | 评价 |
| --- | --- | --- | --- |
| **A. 复用 /guide + 新分类「合规与流程」**（选定） | `guides.ts` 加 6 条 + 类型加可选字段；`guide-groups.ts` 加 1 组；`guide-labels.ts` 加 6 行；`guide-page.tsx`/`ssr-html.ts` 按 `kind` 分支渲染；`guide-faq.ts` 优先取显式 FAQ；`content-counts.json` +6；`gen-hub-index` 重跑 | 全部**自动同步**（都吃 `GUIDE_LIST`）；面包屑仍是 首页 › 行业指南 › 文章；hub 自动多出一个分组 chip | 最小改动；缺点是 hub 标题「N 个行业怎么起名」把 6 篇非行业文也计入（可接受，hub 简介补一句说明） |
| B. 新建 `/cn/:slug` 栏目 | 新路由、新 hub、新 SSR 块、新 OG、hreflang、sitemap/llms 各加一段、计数脚本加第四段、面包屑 `HUB_CRUMB` 加 key、App.tsx 路由、NotFound 规则、skill 文档 | 全部要手工加 | 6 篇内容不值得一个栏目；与 R482 内容矩阵的三段结构（tld/guide/vs）割裂 |
| C. 新建 `/faq` | 同 B 且 FAQ 页面与 /guide FAQ 语义重叠 | 同 B | 不选 |

### 选定方案 A 的具体设计
- 数据：`IndustryGuide` 增 `kind?: "compliance"`；`IndustryGuideLocale` 增可选 `sections?: { heading; paragraphs; bullets? }[]`、`faq?: { q; a }[]`、`sources?: { label; url }[]`、`cta?: { title; desc; button; href }`。命名类 6 字段保持必填（合规篇 `namingIdeas: []`、`cases: []`），任何既有代码路径（hub 索引、llms、sitemap、footer）零改动。
- 渲染：`kind === "compliance"` 时，SPA 与 SSR 同步：intro → sections（h2+段落+要点）→ 相关后缀（`tlds`，仍链 /tld/cn）→ 相关对比（自动命中 /vs/com-vs-cn）→ 注意事项（复用 pitfalls）→ FAQ（显式 `faq`）→ 官方依据（新块，外链 `rel="noopener noreferrer"`）→ CTA（`/?mode=exact`，「先查 xxx.cn 是否可注册」）→ 同组互链（分类「合规与流程」的其余 5 篇）→ 全部指南 chips。
- FAQ JSON-LD：`buildGuideFaq` 首行 `if (loc.faq) return loc.faq;`，worker 端 FAQPage JSON-LD 无需改动。
- /tld/com.cn 不存在（`com.cn` 仅在首页 `KNOWN_MULTI_TLDS` 做多级后缀核验），文章内**不链** /tld/com.cn，改链 /vs/com-vs-cn 与 /tld/cn。
- 验证方式：`pnpm -r typecheck`、`pnpm --filter web test`、`pnpm --filter web build`、`node scripts/check-content-counts.mjs`、`node scripts/gen-hub-index.mjs --check`；`wrangler dev` 后 `curl /guide/<slug>` 断言正文关键词 + 3 段 JSON-LD（BreadcrumbList/Article/FAQPage）；`curl /sitemap.xml | grep -c /guide/` = 410；`/llms.txt` 含 6 条；hub 页出现「合规与流程」分组；截图桌面/375 × 浅/深。

### 6 篇选题（slug → 标题）
1. `cn-realname` — .cn 域名实名认证全流程：材料、时限与审核
2. `cn-serverhold` — 域名 serverHold 是什么：为什么被暂停解析、怎么解除
3. `cn-icp-beian` — ICP 备案与域名实名认证的区别：备案主体、接入商与时限
4. `cn-dns-inland-vs-overseas` — .cn 解析到境内还是境外：备案边界与选择
5. `cn-vs-comcn-registrar` — .cn 还是 .com.cn、国内还是海外注册商：企业与个人怎么选
6. `cn-expiry-redemption` — .cn 域名到期、续费宽限期与赎回期规则

如无异议按此执行（Company OS：提议即默认方案）。
