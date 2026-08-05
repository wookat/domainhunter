# DomainHunter · 产品规格（SPEC v0.1）

## 定位
批量域名猎手：把「一个中文/英文想法」变成「一份可注册域名清单」。
差异化 = 中文/拼音语境词根展开 × 批量组合生成 × RDAP/DNS 双通道核验 × open-core。

## 竞品结论（见 competitor-report.md）
- Web 标杆 instantdomainsearch.com（闭源，英文语境，注册商返佣）
- 开源标杆 tldx（Go CLI 1.9k star，无 Web）
- 空档：开源 Web 产品 + 中文语境 + AI 起名批量核验一体

## 用户与场景
1. 独立开发者/创业者：给新产品找短 .com/.cn
2. 域名投资人：批量词根 × TLD 扫描
3. 公司内部（老板）：「体制内找岗位 .com/.cn」这类即时需求

## 功能范围
### M0 骨架（本轮交付）
- core：候选生成（roots × prefix/suffix × TLD）+ RDAP 核验（IANA bootstrap）+ DNS 预筛（DoH）
- web：单页在线批量查询（输入词根/后缀/TLD → 实时流式返回 可注册/已注册/未知）
- 部署 hunt.zalize.com（Cloudflare Workers）

### M1
- 中文输入 → 拼音/双拼/首字母缩写/英译 多路词根展开
- AI 起名（LLM 生成候选直接入核验管道）
- 导出 CSV / available.txt；注册商跳线（联盟变现位）

### M2
- 账号 + 免费额度/付费批量；域名掉落监控（saved search + 定时回查 + 邮件）
- 开源 CLI（对标 tldx）+ MCP server

## 架构
- monorepo（pnpm）：`packages/core`（纯 TS，无运行时依赖，Node/Workers 通用）+ `apps/web`（Hono on Cloudflare Workers，静态资源 assets 绑定，Vite+React+Tailwind 前端）
- 核验策略：DoH（NS 存在 → 已注册，快速预筛）→ RDAP（404=free，200=taken）→ 未知留给 WHOIS（M1，服务端队列）
- API：`POST /api/check {domains[]}` 流式 NDJSON；`POST /api/generate {roots,prefixes,suffixes,tlds}`
- 限流：IP 每分钟 N 域名（Workers KV），付费放开（M2）

## 开源策略（open-core）
- 开源：core 引擎 + CLI + web UI（MIT）
- 不开源：付费/配额/监控调度等服务端商业模块

## 验收标准（M0）
- 在线页输入 roots=tizhi, suffixes=job,jobs, tlds=com,cn → 30 秒内返回全部状态
- RDAP 结果与 whois 抽查一致率 ≥95%
- 移动端可用（响应式）
