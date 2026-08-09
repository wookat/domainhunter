/**
 * 生成 apps/web/src/content/hub-index.ts —— hub 索引页（/tld /guide /vs）的轻量数据模块。
 *
 * 背景（R271）：hub 页面组件此前经 hubs.ts 间接引入 tlds.ts / guides.ts / compares.ts
 * 全文内容（合计约 800KB JS），移动端 React 挂载被拖到 7s+，/tld hub Lighthouse perf 掉到 73。
 * hub 页只需要每条一句话定位 / 标签 / 对比标题，这里从全文内容预提取成小模块（约 40KB 源码），
 * hub chunk 不再拉全文 chunk。
 *
 * 用法：
 *   node scripts/gen-hub-index.mjs          # 重新生成（改动 tlds/guides/compares 内容后运行）
 *   node scripts/gen-hub-index.mjs --check  # 校验已提交文件与内容源一致（不一致退出码 1）
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(new URL("..", import.meta.url).pathname);
// esbuild 经 vite 传递依赖解析（仓库未直依赖 esbuild）
const require = createRequire(join(root, "apps/web/package.json"));
const { build } = require(require.resolve("esbuild", { paths: [require.resolve("vite", { paths: [join(root, "apps/web")] })] }));
const contentDir = join(root, "apps/web/src/content");
const outFile = join(contentDir, "hub-index.ts");

const tmp = mkdtempSync(join(tmpdir(), "hub-index-"));
const entry = join(tmp, "entry.ts");
writeFileSync(
  entry,
  `export { TLD_LIST } from "${contentDir}/tld-list";
export { TLD_GUIDES } from "${contentDir}/tlds";
export { GUIDE_LIST, INDUSTRY_GUIDES } from "${contentDir}/guides";
export { COMPARE_LIST, TLD_COMPARES } from "${contentDir}/compares";
`,
);
const bundle = join(tmp, "bundle.mjs");
await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", outfile: bundle, logLevel: "silent" });
const { TLD_LIST, TLD_GUIDES, GUIDE_LIST, INDUSTRY_GUIDES, COMPARE_LIST, TLD_COMPARES } = await import(pathToFileURL(bundle).href);
rmSync(tmp, { recursive: true, force: true });

/** 与 hubs.ts 原 firstSentence 完全一致：取 metaDescription 首句 */
const firstSentence = (s, lang) => (lang === "zh" ? s.split("。")[0] + "。" : s.split(". ")[0].replace(/\.?$/, "."));

const q = (s) => JSON.stringify(s);

const tldLines = TLD_LIST.map((t) => `  ${q(t)}: { zh: ${q(firstSentence(TLD_GUIDES[t].zh.metaDescription, "zh"))}, en: ${q(firstSentence(TLD_GUIDES[t].en.metaDescription, "en"))} },`);

const guideLines = GUIDE_LIST.map((s) => {
  const g = INDUSTRY_GUIDES[s];
  return `  { slug: ${q(s)}, label: { zh: ${q(g.zh.label)}, en: ${q(g.en.label)} }, oneLiner: { zh: ${q(firstSentence(g.zh.metaDescription, "zh"))}, en: ${q(firstSentence(g.en.metaDescription, "en"))} } },`;
});

const compareLines = COMPARE_LIST.map((s) => {
  const c = TLD_COMPARES[s];
  return `  { slug: ${q(s)}, a: ${q(c.a)}, b: ${q(c.b)}, title: { zh: ${q(c.zh.title)}, en: ${q(c.en.title)} } },`;
});

const out = `/**
 * hub 索引页（/tld /guide /vs）轻量数据 —— 由 scripts/gen-hub-index.mjs 从
 * tlds.ts / guides.ts / compares.ts 全文内容生成，请勿手改。
 * 内容源变更（新增/修改 TLD、行业指南、对比页）后运行 node scripts/gen-hub-index.mjs 重新生成；
 * CI/审计可用 --check 校验一致性。
 * 存在意义：hub 页组件只需一句话定位/标签/标题，引用本模块而非全文 chunk（R271 移动性能优化）。
 */
import type { Tld } from "./tld-list";

type Localized = { zh: string; en: string };

/** tld → 一句话定位（metaDescription 首句），键集与 TLD_LIST 编译期强一致 */
export const TLD_ONE_LINERS = {
${tldLines.join("\n")}
} satisfies Record<Tld, Localized>;

/** 行业指南索引（顺序与 GUIDE_LIST 一致）：slug + 双语标签 + 一句话定位 */
export const GUIDE_INDEX: { slug: string; label: Localized; oneLiner: Localized }[] = [
${guideLines.join("\n")}
];

/** 对比页索引（顺序与 COMPARE_LIST 一致）：slug + 左右 TLD + 双语标题 */
export const COMPARE_INDEX: { slug: string; a: string; b: string; title: Localized }[] = [
${compareLines.join("\n")}
];
`;

if (process.argv.includes("--check")) {
  const existing = readFileSync(outFile, "utf8");
  if (existing !== out) {
    console.error("hub-index.ts 与内容源不一致，请运行 node scripts/gen-hub-index.mjs 重新生成");
    process.exit(1);
  }
  console.log(`hub-index.ts 与内容源一致（tld ${TLD_LIST.length} / guide ${GUIDE_LIST.length} / vs ${COMPARE_LIST.length}）`);
} else {
  writeFileSync(outFile, out);
  console.log(`已生成 ${outFile}（tld ${TLD_LIST.length} / guide ${GUIDE_LIST.length} / vs ${COMPARE_LIST.length}）`);
}
