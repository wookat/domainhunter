# 域名猎人 · 竞品调研报告（2026-08-05）

## 一句话结论
赛道有成熟竞品但没有「批量词根组合 × 中文拼音语境 × AI 起名 × 开源可自部署」的组合拳产品；开源标杆 tldx（CLI，1.9k star）没有 Web 端，Web 端标杆 instantdomainsearch 不开源且偏英文语境——两者之间存在明确空档。

## 竞品逐个看（均实测截图）

### 1. instantdomainsearch.com（Web 端标杆，闭源）
- 输入即时搜索（keystroke 级响应），一次展示 800+ TLD 可用性，Available/Premium/Aftermarket/Taken 四态分类
- 功能矩阵：Search / Extensions / Generator（前后缀组合生成器）/ Aftermarket（二手域名）/ Research（WHOIS）
- 还有 Bulk search、expired domains、reverse dictionary、**MCP 接口**（已经在做 AI Agent 入口）
- 变现：注册商联盟跳转（GoDaddy/Dynadot 返佣），自己也是 ICANN 认证注册商
- 弱点：无中文/拼音语境；批量词根组合能力弱（Generator 只做单词根前后缀）

### 2. leandomainsearch.com（Automattic 旗下，免费）
- 输入关键词 → 返回「词根+常见词」组合的可注册域名 + 实时价格，UI 极简
- 弱点：只做英文词表组合，单词根，无批量、无导出

### 3. namechk.com
- 域名 30 个 TLD + 90+ 社交平台用户名占用一次查完（差异点：品牌名全网占用检查）
- 弱点：有 reCAPTCHA、体验一般，页面被 hosting 联盟内容淹没

### 4. namelix.com（AI 起名）
- 自训 LLM 生成短品牌名 + 逐个查可用性，收藏后个性化推荐；与 brandmark.io（logo 生成）交叉导流
- 弱点：起名强但批量核验弱

### 5. 开源侧（GitHub）
- **tldx（brandonyoungdev/tldx，1.9k star，Go CLI）**：批量 RDAP+DNS+WHOIS、前后缀排列组合、正则、MCP、多格式输出——功能上就是我们 domain_hunter.py 的成熟版
- 其余项目均 <60 star，无维护的 Web 产品化开源方案
- 结论：**开源 CLI 已被 tldx 占位，但「开源 Web 产品」空白**

### 6. 国内竞品
- 阿里云/腾讯云/西部数码均有批量查询，但绑定自家注册商、无组合生成、无 AI 起名；west.cn 对海外 IP 直接封锁（实测 HTTP 445）

## 我们的差异化定位（如无异议将按此执行）
1. **中文/拼音语境优先**：中文意图 →（拼音/双拼/缩写/英译）多路词根展开 → 批量组合 → 核验，这是所有竞品都没有的
2. **AI 起名 + 批量核验一体**：LLM 生成候选直接进核验管道，出「可注册清单」而非「点子清单」
3. **open-core**：核心引擎开源（对标 tldx 但带 Web/API），官网提供在线服务（免费额度 + 批量/监控收费）
4. 官网先用 zalize.com 子域名（如 domainhunter.zalize.com / hunt.zalize.com），Cloudflare Workers 部署

## 截图索引
- instantdomainsearch 首页/搜索/Generator：ss_eb59d240 / ss_41c44179 / ss_ac822c8e
- namechk：ss_a9cda111；leandomainsearch 搜索结果：ss_a020138a；namelix：ss_a67e343f
