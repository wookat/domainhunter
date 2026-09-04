# QA 历史归档 / QA history

历次子会话产出的 `test-plan-*.md` / `test-report-*.md` / `ux-audit-*.md` 归档到本目录（`git mv`，保留历史），不要留在仓库根目录；`storage-*.json`（浏览器 storage 备份/还原快照）是一次性运行产物，已在根 `.gitignore` 忽略，不入库。

- R479 整理时（基线 `deploy/r192-r195` @ `8a03a35`）远端各分支根目录均无上述文件，历史审计报告已在 `docs/qa/`（`audit-r*.md`、`test-plan-r*.md`），因此本次没有实际 `git mv`；后续新增请直接放这里。
- 审计 SOP 与零 AI 约束见 `.agents/skills/testing-domainhunter/SKILL.md`。
