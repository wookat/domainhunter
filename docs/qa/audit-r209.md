# R209 零 AI 全站生产审计 — hunt.zalize.com（2026-08-08）

纯线上走查，未部署、未改产品代码，**全程未触发任何 AI 猎名搜索**。上次全站审计为 R198，本轮覆盖 R199–R208 新增能力（TLD 78→84、行业指南 86、对比页 108、/advanced CSV expires_at、监控竞态修复、暗色 txt-2 对比度、Watching 徽标就地两步取消）。

## AI 用量前后值（硬性约束验证）
- 基线：2026-08-08 `searches=20, fast=14, refine=6`
- 审计结束后 `GET /api/usage`：2026-08-08 `searches=20, fast=14, refine=6` — **零增量** ✅（前后 JSON 字节级一致）

## 功能走查结果（桌面）
| 项目 | 结果 | 说明 |
|---|---|---|
| 首页 zh/en（86 行业 chips、三模式分段器） | ✅ | AI 模式仅切换未提交 |
| quick-check → All 84 后缀 | ✅ | 80 available / 4 unknown；星标正常 |
| Watching 徽标就地两步取消（R208） | ✅ | Watch drop → Watching → 两步确认取消 + 超时回退均验证 |
| 变体核验 | ✅ | 24/24 核验，标注 no AI quota used |
| /advanced 批量核验 + CSV | ✅ | CSV 含 `expires_at` 列，taken 行有值 |
| /shortlist 备注/排序/导出 | ✅ | 导出含 note + expires_at 列 |
| 分享创建/只读页/撤销 | ✅ | 撤销后 /api/share/:id 返回 HTTP 410 `{"error":"revoked"}` |
| /monitors 手动刷新 | ✅ | supabase.com 就地更新 Taken + expires 2026-09-24；容量 3/500 |
| /prices | ✅ | **恰 84 行**（原 78）；实时 Porkbun 价格；缓存价时显示 stale 横幅 |
| 内容页抽查 zh+en（16 URL） | ✅ | /tld/com、/tld/ai、/guide/saas、/guide/blog、/vs/com-vs-io、/vs/io-vs-ai、/why、/mcp 全 200，渲染正常 |
| MCP 冒烟（POST /mcp） | ✅ | check_domains（含 expiresAt/expiringSoon）、suggest_variants（6 变体含价）、tld_prices（真实价格，isError:false） |
| 亮色主题 | ✅ | 首页 + /prices 正常 |
| 暗色 txt-2 对比度（R207） | ✅ | 实测 7.51:1，> 4.5:1 AA |
| 键盘可用性 | ✅ | Tab 走查首页分段器等，focus ring 可见 |

## 上轮遗留问题复核
- **R167 P2-1（/api/prices 上游失效、stale 提示不可见）→ 已修复** ✅：`/api/prices` 现返回真实 Porkbun 价格；缓存价时 /prices 显示明确横幅「Prices are cached values (7h old) — live quotes temporarily unavailable」。MCP `tld_prices` 亦恢复正常。

## 响应式
- **375px**（CDP 移动仿真）：11 页全部 `document.scrollWidth=375`，**零横向溢出** ✅

## 性能（Lighthouse 13.4.1，headless）
| 页面 | Perf | A11y | SEO |
|---|---|---|---|
| 首页 zh mobile | 95 | 100 | 100 |
| 首页 zh desktop | 100 | 100 | 100 |
| 首页 en mobile | 92 | 100 | **92**（见 P3-1） |
| 首页 en desktop | 100 | 100 | **92** |
| /prices mobile | 99 | 100 | 100 |
| /tld/com mobile | 93 | 100 | 100 |

均达或超既往基线（首页 mobile Perf ~94–99、desktop a11y 100），唯一例外为 en SEO 92。

## console error 清单
- 全程 CDP 扫描：**0 条应用错误**；仅 1 条预期内的 410 网络日志（撤销分享验证时的刻意请求）。

## 问题清单（P0–P3）
**P0 / P1：无。P2：无。**

- **P3-1 英文页 canonical 指向中文 URL，Lighthouse SEO 92**
  - 现象：`/?lang=en`（及其他 `?lang=en` 页）`<link rel="canonical">` 指向 `https://hunt.zalize.com/`，Lighthouse 判为 invalid canonical，en 页 SEO 92（zh 为 100）。
  - 复现：`lighthouse "https://hunt.zalize.com/?lang=en" --only-categories=seo`
  - 建议：审视 canonical/hreflang 策略；若刻意去重可保留，但建议补 hreflang 对。
- **P3-2 /shortlist「Clear」两步确认难以命中**
  - 现象：点击 Clear 后「Confirm clear?」在二次点击注册前即回退（3 次尝试均失败，疑似重渲染吞掉点击）；逐行 Remove 正常。
  - 复现：/shortlist → Clear → 点击「Confirm clear?」。
  - 建议：排查确认态按钮在轮询/重渲染时是否被替换导致点击丢失。

## 测试残留清理
shortlist 清空、monitor 移除（容量回 2/500）、分享已撤销、localStorage 回基线 ✅

## 证据路径（审计机本地，未入库）
- 录屏：/home/ubuntu/screencasts/rec-f8b4518e-a135-46b5-9b9c-94970159bbfa/rec-f8b4518e-a135-46b5-9b9c-94970159bbfa-edited.mp4
- 截图：~/screenshots/ss_*.png；Lighthouse JSON：~/lh_r209/*.json
- console 扫描：~/console_sweep_r209.txt；MCP 响应：/tmp/mcp_{check,variants,prices}.json
- 用量：~/usage_baseline_r209.json / ~/usage_post_r209.json
