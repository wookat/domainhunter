<!-- 感谢贡献！请阅读 CONTRIBUTING.md。base 分支请选当前生产集成分支（见 docs/handoff-context.md 顶部）。 -->
<!-- Thanks! Please read CONTRIBUTING.md and target the current production integration branch. -->

## 改动 / What & why

<!-- 一两句说清楚改了什么、为什么。关联 Issue 用 "Closes #123"。 -->

## 类型 / Type

- [ ] feat  - [ ] fix  - [ ] docs  - [ ] refactor  - [ ] test  - [ ] chore

## 本地验收 / Local acceptance（合并门槛，必须全绿）

- [ ] `pnpm -r typecheck`
- [ ] `pnpm --filter web test`
- [ ] `pnpm --filter web build`
- [ ] 改了内容页数据：`node scripts/check-content-counts.mjs`（不适用请勾选并注明 N/A）

## 硬指标 / Hard requirements（UI / 文案改动）

- [ ] 双语：新增文案 zh/en 都在 `apps/web/src/lib/i18n.tsx`（worker 侧 SSR 文案两份都改）
- [ ] 375px 无溢出、首屏按钮不破版（附截图）
- [ ] 浅色 + 深色对比度 ≥ 4.5:1（附截图）
- [ ] 键盘可达（Tab / Enter / Esc）
- [ ] 不涉及 UI（N/A）

## 零 AI / Zero-AI

- [ ] 本 PR 的开发与验证**没有触发** `/api/ai-search`（生产或本地）
- [ ] 若确实需要 AI 验证：已与维护者确认，并附测试前后 `GET /api/usage?days=1` 对照

## 安全 / Security

- [ ] 未提交任何 secret（key 只走 `wrangler secret put` / `.dev.vars`）
- [ ] 未新增或修改 `.github/workflows/`

## 截图 / Screenshots

<!-- 桌面 + 375px，浅色 + 深色 -->
