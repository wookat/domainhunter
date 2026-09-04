/**
 * 内容计数防回滚护栏（R294）。
 *
 * 从内容源读取实际条目（tld-list.ts / guides.ts GUIDE_LIST / compare-slugs.ts），
 * 与单一事实源 scripts/content-counts.json（tld/guide/vs 三组 count + 全量 slug 清单）比对：
 *   - 条目丢失 → 退出码 1，列出丢失的 slug（防止合并悄悄删内容导致生产 404）；
 *   - 条目新增 → 退出码 1，提示需同步更新 content-counts.json（保持事实源与内容一致）。
 *
 * 用法：node scripts/check-content-counts.mjs
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(new URL("..", import.meta.url).pathname);
// esbuild 经 vite 传递依赖解析（仓库未直依赖 esbuild），与 gen-hub-index.mjs 同法
const require = createRequire(join(root, "apps/web/package.json"));
const { build } = require(require.resolve("esbuild", { paths: [require.resolve("vite", { paths: [join(root, "apps/web")] })] }));
const contentDir = join(root, "apps/web/src/content");

const tmp = mkdtempSync(join(tmpdir(), "content-counts-"));
const entry = join(tmp, "entry.ts");
writeFileSync(
  entry,
  `export { TLD_LIST } from "${contentDir}/tld-list";
export { GUIDE_LIST } from "${contentDir}/guides";
export { COMPARE_SLUGS } from "${contentDir}/compare-slugs";
`,
);
const bundle = join(tmp, "bundle.mjs");
await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", outfile: bundle, logLevel: "silent" });
const { TLD_LIST, GUIDE_LIST, COMPARE_SLUGS } = await import(pathToFileURL(bundle).href);
rmSync(tmp, { recursive: true, force: true });

const countsPath = join(root, "scripts/content-counts.json");
const expected = JSON.parse(readFileSync(countsPath, "utf8"));

const sections = [
  { key: "tld", label: "TLD（tld-list.ts TLD_LIST）", actual: [...TLD_LIST] },
  { key: "guide", label: "行业指南（guides.ts GUIDE_LIST）", actual: [...GUIDE_LIST] },
  { key: "vs", label: "对比页（compare-slugs.ts COMPARE_SLUGS）", actual: [...COMPARE_SLUGS] },
];

let failed = false;

for (const { key, label, actual } of sections) {
  const exp = expected[key];
  if (!exp || !Array.isArray(exp.slugs) || typeof exp.count !== "number") {
    console.error(`[content-counts] ✗ content-counts.json 缺少 "${key}" 段（需含 count 与 slugs）`);
    failed = true;
    continue;
  }
  if (exp.count !== exp.slugs.length) {
    console.error(`[content-counts] ✗ ${key}: counts 文件自身不一致（count=${exp.count}，slugs=${exp.slugs.length} 条）`);
    failed = true;
  }
  const actualSet = new Set(actual);
  const expectedSet = new Set(exp.slugs);
  const missing = exp.slugs.filter((s) => !actualSet.has(s));
  const added = actual.filter((s) => !expectedSet.has(s));

  if (missing.length > 0) {
    failed = true;
    console.error(`[content-counts] ✗ ${label}: 检测到内容回滚/丢失！记录 ${exp.count} 条，实际 ${actual.length} 条。`);
    console.error(`  丢失 ${missing.length} 条 slug：`);
    for (const s of missing) console.error(`    - ${s}`);
    console.error(`  若确属有意下线，请同步更新 scripts/content-counts.json 并在 PR 中说明。`);
  }
  if (added.length > 0) {
    failed = true;
    console.error(`[content-counts] ✗ ${label}: 检测到新增内容未登记。记录 ${exp.count} 条，实际 ${actual.length} 条。`);
    console.error(`  新增 ${added.length} 条 slug：`);
    for (const s of added) console.error(`    + ${s}`);
    console.error(`  请把新增 slug 追加到 scripts/content-counts.json（count 与 slugs 同步更新）。`);
  }
  if (missing.length === 0 && added.length === 0) {
    console.log(`[content-counts] ✓ ${label}: ${actual.length} 条，与事实源一致`);
  }
}

if (failed) process.exit(1);
console.log("[content-counts] 全部通过");
