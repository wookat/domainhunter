# R472 UI 证据脚本（0 次真实 AI 调用）

前置：`apps/web` 下 `pnpm build && npx wrangler dev --port 8787`；本目录需要 Playwright（不在仓库依赖里）：

```sh
cd docs/qa/r472 && npm i playwright@1 && npx playwright install chromium
node measure.js after 8787   # 375×667 / 1440×900 zh+en 首屏几何 + 截图 → shots/after-geometry.json
node errors.js 8787          # quota / rate-limit 倒计时 / 取消 / 自动重试一次 / 摘要行 a11y，70 项断言 → shots/errors-results.json
```

- `fixture.js`：合成 `dh:lastSearch:v1`（`values.style`/`lengthPref` 为空字符串，11 行含已注册行）。
- 两个脚本都用 `context.route("**/api/ai-search")` 拦截：`measure.js` 直接 abort；`errors.js` 返回构造的 NDJSON `{type:"round"}` + `{type:"error", errorKind}`，并用 `page.clock` 虚拟时钟推进 30s 验证自动重试。
- 结果快照见 `docs/research/screenshots/r472-*`，论证与验收对照见 `docs/research/r472-error-ux-fold.md`。
- `live.js`：在可见 Chrome（CDP 29229）里挂 `/api/ai-search` 拦截，供录屏手测错误态：`node live.js zh 375 dark rate-limit,rate-limit`（保持进程存活期间路由有效）。
