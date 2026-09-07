# R486 · 微信生态内的分享与打开体验（一手证据）

> 目标：中文创业者把「找到的域名候选」发给合伙人/群，最常见路径是微信，而不是 Twitter/Slack。本轮用 MicroMessenger UA 实查生产 5 页、查微信官方文档、实测复制 API、对照万网/西部数码，给出「无公众号时能做到的最好」并落地最小改动。
>
> 证据分级：**[生产实查]** 本轮在 hunt.zalize.com 实跑；**[官方文档]** 微信/MDN；**[二手]** 社区文章/反编译，只作旁证；**[推断]** 未直接验证。
>
> 全程零 AI：只访问静态页、`/s/:id`、`/api/share`（POST/DELETE），未触发 `/api/ai-search`。

## 0. 结论速览

| 问题 | 现状（改前） | 证据 | 本轮处理 |
| --- | --- | --- | --- |
| 微信内渲染/字体/主题/宽度 | 与 Chrome **完全一致**：5 页 × 3 UA × 2 主题，`scrollWidth=375`、字体栈同为 `Inter, Inter Fallback, PingFang SC…`、深浅色由 `domainhunter:theme` 显式控制 | [生产实查] §1 | 不改 |
| 分享卡片缩略图 | 全站 `document.images.length = 0` → 微信默认抓图（页面首张 ≥300×300 可见 img）无从抓取，卡片无图 | [生产实查] §1.3 + [二手] §2.2 | ✅ body 首位放 0×0 容器裁切的 300×300 不透明 PNG（`/wx-share.png`） |
| 分享卡片标题/摘要 | `/s/:id` SSR 不改 `<title>`/description，卡片标题=首页长标题「DomainHunter — 中文创业者的域名猎手 \| 用中文说寓意…」，与「清单」无关 | [生产实查] §1.3 | ✅ worker 读 KV，SSR 写「N 个可注册域名候选 \| DomainHunter」+ 前 3 个域名摘要（zh/en） |
| 自定义卡片（JS-SDK） | 需公众号 appId + 服务端签名 + JS 安全域名 | [官方文档] §2.1 | ❌ **需老板资源：认证公众号**，本轮不做 |
| 复制是否可用 | 全部 6 处直接 `navigator.clipboard.writeText`，不等结果就显示「已复制」；微信 WebView 有 `NotAllowedError` 实测报告 | [代码] + [二手] §3 | ✅ 统一 `copyText()`：clipboard → `execCommand('copy')` 回退；失败显示「复制失败，请长按选择」 |
| 复制文本格式 | 只有裸域名，一行一个 | [代码] §3.3 | ✅ 改为「域名 · 可注册 · 首年 ¥29」一行一个，双语 |
| 注册商外链 `_blank` | 官方只记录 **POST 表单** `_blank` 丢数据的案例；我们是 GET 锚点，无一手证据证明失效 | [官方文档] §1.5 | 不改，写入「未验证」 |
| 系统深色跟随 | 站点默认 dark、仅显式切换 light，不读 `prefers-color-scheme`；微信官方建议 `color-scheme`/媒体查询 | [代码] + [官方文档] §1.4 | 不改（非本轮范围，记为后续项） |

## 1. 微信内置浏览器打开 [生产实查]

### 1.1 方法

- 工具：Chromium 137（playwright-core），viewport 375×812，DPR 2，`isMobile`，locale zh-CN；每次请求带 `?cb=<ts>` 绕缓存。脚本：`/home/ubuntu/r486/probe.mjs`（会话机器）。
- UA 三组（来源 [user-agents.net · WeChat App](https://user-agents.net/applications/wechat-app)，Android / iOS 子页 2024–2025 采集）：
  - Android：`Mozilla/5.0 (Linux; Android 13; V2148A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160117 MMWEBSDK/20240404 MMWEBID/8833 MicroMessenger/8.0.49.2600(0x28003137) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64`
  - iOS：`Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.59(0x18003b2e) NetType/WIFI Language/zh_CN`
  - 对照 Chrome Android：`Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36`
- 页面：`/`、`/s/WwQGe3k9eW`（本轮 `POST /api/share` 建的测试分享，3 个安全域名，测完已 `DELETE` 撤销，`GET` 返回 410）、`/shortlist`（注入 2 条合成 shortlist）、`/prices`、`/guide/saas`。
- 主题：`colorScheme` dark/light 各一遍；light 时同时写 `domainhunter:theme=light`（站点不读系统色，见 §1.4）。
- 局限：Chromium + UA 串 ≠ 真机微信 X5/WKWebView 内核。能证明的是 **worker/前端没有按 UA 分流**、CSS/字体栈在 Blink 下一致；不能证明真机微信的字体渲染与 JSBridge 行为。

### 1.2 结果（30 组全部一致）

`shots/report.json` 关键字段（每页 × 3 UA × 2 主题）：

| 字段 | 值 |
| --- | --- |
| `scrollWidth` | 375（无横向溢出） |
| `bodyFont` | `Inter, "Inter Fallback", "PingFang SC", …`（微信 UA 与 Chrome 相同） |
| `bodyBg` dark / light | `rgb(11,12,14)` / `rgb(250,250,249)` |
| `htmlClass` dark / light | `""` / `"light"` |
| `imgCount` | **0**（5 页全部） |
| `a[target=_blank]` | 静态 DOM 每页 1 个（页脚 GitHub 链接）；「去注册」是下拉菜单，展开后每个注册商项为 `RegistrarAnchor`（`target=_blank rel=noopener/sponsored`，见 `registrar-link.tsx`） |
| `<meta name=color-scheme>` | 无 |
| `safe-area-inset` in CSS | 无 |
| `navigator.clipboard` | 存在（Chromium 下；真机微信见 §3） |

截图（改前）：

- 首页 ×6：[montage-home.png](screenshots/r486/montage-home.png)
- `/s/:id` ×6：[montage-share.png](screenshots/r486/montage-share.png)
- `/shortlist` ×6：[montage-shortlist.png](screenshots/r486/montage-shortlist.png)
- `/prices` ×6：[montage-prices.png](screenshots/r486/montage-prices.png)
- `/guide/saas` ×6：[montage-guide.png](screenshots/r486/montage-guide.png)
- 单图：[wxAndroid-dark-home.png](screenshots/r486/wxAndroid-dark-home.png)、[wxIos-dark-share.png](screenshots/r486/wxIos-dark-share.png)、[wxIos-light-share.png](screenshots/r486/wxIos-light-share.png)、[wxIos-light-shortlist.png](screenshots/r486/wxIos-light-shortlist.png)

### 1.3 对分享卡片的直接含义

- `<title>` 在 `/s/:id` 上仍是首页长标题（SSR 只替换 `og:url`/canonical/`og:image`），微信卡片标题会显示「DomainHunter — 中文创业者的域名猎手 | 用中文说寓意，猎到真正可注册的 .cn / .com 好域名」而非「候选清单」。
- `og:*` 微信默认抓取**不读**（见 §2.2），只看 `<title>` 与页面 `<img>`；全站 0 个 `<img>`（Logo 是内联 SVG）→ 卡片无缩略图。

### 1.4 深浅主题跟随 [代码 + 官方文档]

- 代码：`apps/web/index.html` 只在 `localStorage["domainhunter:theme"]==="light"` 时加 `.light`；默认 dark，不读 `prefers-color-scheme`。
- 微信官方 [H5 深色模式适配](https://developers.weixin.qq.com/doc/service/guide/h5/darkmode.html)：iOS 7.0.12 / Android 7.0.13 起微信支持深色模式，推荐 `<meta name="color-scheme" content="light dark">` + `@media (prefers-color-scheme: dark)`。
- 影响：微信里首次打开一律 dark；系统浅色用户会看到深色页，但**不会破坏可读性**（双主题对比度已达标）。属于产品取舍，非本轮范围，记为后续项。

### 1.5 外链 `target=_blank` 在微信 [官方文档 + 推断]

- 微信官方 [iOS 网页开发适配指南](https://developers.weixin.qq.com/doc/service/guide/h5/adapt_ios)：iOS 微信 WKWebView 行为接近 Safari；文档明确记录的问题是 **`<form target="_blank" method="post">` 提交后新窗口丢 POST 数据，建议改 `_self`**。
- 未找到官方文档说明 GET 锚点 `_blank` 会被拦截。社区经验（[二手]）为：微信内 `window.open` 常被忽略、`_blank` 锚点通常在同一 WebView 打开。
- 本仓库注册商链接是 GET `<a target=_blank rel=noopener>`；键盘 Enter / `/shortlist`「批量去注册」走 `openRegistrar()` → `window.open(href,"_blank")`（多域名连开多窗，在任何移动 WebView 里都可能被弹窗拦截，微信内风险更高，**未验证**）。**无一手证据证明失效**，按「没证据不做」原则本轮不改。若真机复测发现问题，改法很小：`RegistrarAnchor` 在 `/MicroMessenger/i.test(navigator.userAgent)` 时去掉 `target`。

## 2. 分享卡片：标题 / 摘要 / 缩略图

### 2.1 JS-SDK 自定义卡片 [官方文档]

- [微信 JS-SDK 说明文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)（服务号版：[jssdk.html](https://developers.weixin.qq.com/doc/service/guide/h5/jssdk.html)）：
  - 自定义「分享给朋友」`wx.updateAppMessageShareData({title, desc, link, imgUrl})`、「分享到朋友圈」`wx.updateTimelineShareData({title, link, imgUrl})`，**微信 6.7.2 / JS-SDK 1.4.0 起**；旧接口 `onMenuShareAppMessage` 已废弃。
  - 调用前必须 `wx.config({appId, timestamp, nonceStr, signature, jsApiList})`；`signature` 由服务端用 `jsapi_ticket`（由 `access_token` 换取）+ 当前 URL 计算；
  - `link` 域名必须与公众号后台配置的 **JS 接口安全域名**一致，需要**已认证的服务号/订阅号**并在后台绑定域名（域名根目录放校验文件）。
- 对我们意味着：需要 (a) 认证公众号 appId/appSecret；(b) worker 端加 `/api/wx/sign` 用 KV 缓存 `access_token`/`jsapi_ticket`（各 7200s）；(c) 前端 MicroMessenger UA 下加载 `//res.wx.qq.com/open/js/jweixin-1.6.0.js` 并 `wx.config`。(b)(c) 工程量小（约 80 行），**卡点只在 (a)**。
- **需老板资源：微信公众号（认证），并在公众号后台把 `hunt.zalize.com` 配为 JS 接口安全域名。**

### 2.2 无 JS-SDK 时微信默认抓取 [二手 + 生产实查]

- 微信**没有**公开文档描述默认卡片规则。多篇社区文章一致（[SegmentFault · 微信自定义分享链接信息](https://segmentfault.com/a/1190000012860070)，[代码先锋网](https://www.codeleading.com/article/16794063006/)）：
  - 标题 = `<title>`；摘要 = 链接 URL（无 JS-SDK 时不可控）；
  - 缩略图 = 页面中**第一张 ≥300×300、`display` 不为 `none` 的 `<img>`**；`img` 自身 `display:none` 会被跳过，但可用外层容器裁切/隐藏；建议放 body 最前、正方形；
  - 抓不到合格图片时显示链接默认图标。
- 与生产事实叠加：我们 `imgCount=0`、`<title>` 通用 → 卡片是「首页长标题 + URL + 默认图标」。这是**推断**（未真机截卡片），但两条前提均为一手事实。
- 「无公众号时能做到的最好」= 保证 `<title>` 表达清单内容 + 提供一张 ≥300×300 可见图；摘要文案不可控。本轮即按此实现（§5）。

### 2.3 万网 / 西部数码对照 [生产实查]

脚本 `/home/ubuntu/r486/competitor.mjs`，iOS 微信 UA，375px：

| 站点 | 页面 | `<title>` | JS-SDK 脚本 | `<img>` 数 / ≥290 | `og:*` | `_blank` | `scrollWidth` | 截图 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 阿里云万网 | `domain.aliyun.com/check?keyword=chaxiangji&suffix=.cn` | 域名查询 | 无 | 3 / 0 | 无 | 0 | 375 | [competitor-wanwang-wxIos.png](screenshots/r486/competitor-wanwang-wxIos.png) |
| 西部数码 | `m.west.cn/m/domain/` | 域名注册_域名查询_域名购买_域名申请-西部数码 | 无 | 0 / 0 | 无 | 0 | 375 | [competitor-west-m-domain-wxIos.png](screenshots/r486/competitor-west-m-domain-wxIos.png) |
| 西部数码 | `m.west.cn/?mobile` | 西部数码-云服务器…24年老牌服务商！ | 无 | 0 / 0 | 无 | 0 | 375 | [competitor-west-m-wxIos.png](screenshots/r486/competitor-west-m-wxIos.png) |

- 两家在微信 UA 下均**未注入 JS-SDK、无 ≥290 图、无 og 标签、结果页 0 个 `_blank`**——它们没有为微信分享做优化，我们补上 `<title>` + 缩略图即可领先；结果页不开新窗口是国内工具的通行做法，但这不构成「`_blank` 在微信失效」的证据。
- 桌面版 `west.cn` 在微信 UA 下返回非 2xx 并跳转，故改测其移动站。

## 3. 复制体验

### 3.1 现有代码 [代码]

改前共 6 处直接调用 `navigator.clipboard.writeText`：`results-export.ts`（结果页/分享页/高级页「复制 N 个可注册」）、`results-page.tsx`（键盘 C、复制搜索链接）、`domain-row.tsx`（行内复制）、`home-page.tsx`（快速核验/变体复制 ×2）、`shortlist-page.tsx`（分享链接 ×2）。其中 4 处 `void` 掉 Promise，**写失败也显示「已复制」**。

### 3.2 API 兼容性 [官方文档 + 二手]

- MDN [`Clipboard.writeText()`](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)：仅安全上下文；Promise 可能因权限被拒；需用户激活（transient activation）。
- [caniuse · Async Clipboard](https://caniuse.com/async-clipboard)：现代浏览器均支持，但 WebView 内取决于宿主 App 的权限策略。
- 微信实测（[博客园 · 微信 H5 页面兼容性——复制到剪贴板](https://www.cnblogs.com/xinjie-just/p/17583045.html)）：Android 微信 `Clipboard.write` 报 `NotAllowedError: Write permission denied`；iOS 复制内容夹带 html 标签；作者最终回退 `document.execCommand('copy')` 才在双端可用。[CSDN 问答](https://ask.csdn.net/questions/8980141) 同样指出微信/QQ 等第三方容器 WKWebView 中 `writeText` 常 `NotAllowedError` 或静默失败，建议运行时检测 + `execCommand` 降级。
- 本轮**未在真机微信验证**（无真机）。基于「多份独立实测 + 现有代码假报成功」两点，加回退与失败提示是低风险、必要的兜底。

### 3.3 复制文本可读性 [代码]

改前复制内容仅 `domain\n` 列表，发到群里没有状态与价格，合伙人需再点链接。改为每行「域名 · 可注册 · 首年 ¥29」（en：`a.com · Available · 1st yr ≈$4`），复用 `priceShort()`（实时价优先，静态参考价回退），无价格的后缀省略价格段。

### 3.4 改后实测 [本地 wrangler dev 实查]

脚本 `/home/ubuntu/r486/verify-local.mjs`、`copystate.mjs`；MicroMessenger Android/iOS UA × dark/light × {原生 clipboard, 模拟微信 `writeText` 抛 `NotAllowedError`, 两者全失败}：

- 原生 & 回退两种模式，键盘 Enter 触发「复制 4 个可注册」后剪贴板内容均为：
  ```
  chaxiangji.cn · 可注册 · 首年 ¥29
  teabloom.com · 可注册 · 首年 $11.08 ≈¥80
  mingxiang.com.cn · 可注册
  chayun.cn · 可注册 · 首年 ¥29
  ```
- 按钮态：`Copied`→ 1.5s 还原；全失败时 `Copy failed — select manually` → 2.5s 还原（zh：复制失败，请长按选择）；焦点始终留在按钮上（`document.activeElement` 未变）。
- `document.images` = 1（`/wx-share.png` 300×300，`display:block`，`visibility:visible`），`scrollWidth=375` 无溢出，页面视觉无变化：[after-montage.png](screenshots/r486/after-montage.png)、[after-wxIos-light-share.png](screenshots/r486/after-wxIos-light-share.png)。
- `/s/:id` SSR（curl，iOS 微信 UA）：`<title>4 个可注册域名候选 | DomainHunter</title>`，description/og/twitter 同步；`?lang=en` 或 `Accept-Language: en` → `4 available domain candidates | DomainHunter`；不存在/已撤销的 id 回落首页标题。

## 4. 未验证 / 推断项（如实列出）

1. 真机微信卡片最终呈现（标题/缩略图）——依赖 §2.2 二手规则，未真机截图。
2. 真机微信 `navigator.clipboard` 行为——依赖 §3.2 二手实测，本轮只验证了「抛错即回退」路径正确。
3. 注册商 `_blank` 在真机微信的打开方式——未验证，未改。
4. 真机微信字体渲染（X5/WKWebView）——Chromium 模拟只能证明无 UA 分流。

## 5. 实现清单（PR）与证据对应

| 改动 | 文件 | 证据 |
| --- | --- | --- |
| body 首位 0×0 容器内 300×300 不透明 PNG | `apps/web/index.html`、`apps/web/public/wx-share.png` | §1.2 `imgCount=0` + §2.2 |
| `/s/:id` SSR 读 KV 写 `<title>`/description/og/twitter（zh/en） | `apps/web/src/worker.ts` | §1.3 |
| `copyText()`：clipboard → `execCommand` 回退，返回是否成功 | `apps/web/src/lib/clipboard.ts`（新） | §3.2 |
| 6 处复制统一走 `copyText`，失败不假报成功，新增 `results.copyFailed` 双语 | `results-export.ts`、`results-page.tsx`、`share-page.tsx`、`advanced-page.tsx`、`home-page.tsx`、`domain-row.tsx`、`shortlist-page.tsx`、`i18n.tsx` | §3.1 |
| 复制文本「域名 · 状态 · 首年价」一行一个 + 单测 | `results-export.ts`、`results-export.test.ts` | §3.3 |
| 不改：注册商 `_blank`、系统深色跟随、JS-SDK | — | §1.5、§1.4、§2.1 |

## 6. 需老板资源

> **单一事实源：[`docs/owner-actions.md`](../owner-actions.md)**（R490 起所有老板待办及其当前状态只在那里维护；本节保留为调研证据，不再更新）。

- **微信认证公众号**（服务号优先）：提供 appId/appSecret 给 worker secret，公众号后台配置 JS 接口安全域名 `hunt.zalize.com`。到位后可用 `updateAppMessageShareData` 把卡片摘要写成「chaxiangji.cn、teabloom.com… 共 N 个可注册」并用 `/api/og/:id` 动态图做缩略图（当前 og 图为 SVG，微信 imgUrl 需 PNG/JPG，届时要加 PNG 输出）。

## 7. 状态还原

- 生产测试分享 `WwQGe3k9eW`：`DELETE /api/share/WwQGe3k9eW` → 200 `{"ok":true}`；`GET` → 410。
- 生产 localStorage：探测全部在无痕 headless 上下文进行，未触碰会话 Chrome 的存储。
- 本地 wrangler KV 测试分享 `Seb6oHeHWk` 仅存在于本机 `.wrangler/state`，不入库。
