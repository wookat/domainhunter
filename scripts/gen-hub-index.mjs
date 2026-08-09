/**
 * 生成 apps/web/src/content/hub-index-{tld,guide,vs}.ts —— hub 索引页（/tld /guide /vs）的轻量数据模块。
 *
 * 背景（R271）：hub 页面组件此前经 hubs.ts 间接引入 tlds.ts / guides.ts / compares.ts
 * 全文内容（合计约 800KB JS），移动端 React 挂载被拖到 7s+，/tld hub Lighthouse perf 掉到 73。
 * hub 页只需要每条一句话定位 / 标签 / 对比标题，这里从全文内容预提取成小模块，
 * hub chunk 不再拉全文 chunk。
 * R282：单文件 hub-index.ts 拆成三个按 hub 分立的模块——三个 hub 页组件共享同一
 * 前端 chunk 时每页都要下载全部三份索引（约 53KB gzip），拆分后每页只加载自己那份。
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

/**
 * hub 卡片短句：首句内按逗号取前若干分句，控制在 maxLen 内（至少保留第一分句）。
 * /guide 158 条首句普遍 120+ 字，全文进 SSR 骨架让 /guide HTML 比 /vs 大 10KB gzip、
 * 移动 FCP 慢 0.3s（R284 移动性能优化）；详情页 metaDescription 不受影响。
 */
const cardLine = (s, lang, maxLen) => {
  const sep = lang === "zh" ? "，" : ", ";
  const end = lang === "zh" ? "。" : ".";
  const sentence = firstSentence(s, lang);
  const clauses = sentence.slice(0, sentence.length - end.length).split(sep);
  let out = clauses[0];
  for (let i = 1; i < clauses.length && out.length + sep.length + clauses[i].length <= maxLen; i++) out += sep + clauses[i];
  return out + end;
};

const q = (s) => JSON.stringify(s);

const header = `/**
 * hub 索引页轻量数据 —— 由 scripts/gen-hub-index.mjs 从
 * tlds.ts / guides.ts / compares.ts 全文内容生成，请勿手改。
 * 内容源变更（新增/修改 TLD、行业指南、对比页）后运行 node scripts/gen-hub-index.mjs 重新生成；
 * CI/审计可用 --check 校验一致性。
 * 存在意义：hub 页组件只需一句话定位/标签/标题，引用本模块而非全文 chunk（R271 移动性能优化）；
 * 按 hub 分立三个文件，每个 hub 页只加载自己那份索引（R282 移动性能优化）。
 */`;

const tldLines = TLD_LIST.map((t) => `  ${q(t)}: { zh: ${q(firstSentence(TLD_GUIDES[t].zh.metaDescription, "zh"))}, en: ${q(firstSentence(TLD_GUIDES[t].en.metaDescription, "en"))} },`);

const guideLines = GUIDE_LIST.map((s) => {
  const g = INDUSTRY_GUIDES[s];
  return `  { slug: ${q(s)}, label: { zh: ${q(g.zh.label)}, en: ${q(g.en.label)} }, oneLiner: { zh: ${q(cardLine(g.zh.metaDescription, "zh", 42))}, en: ${q(cardLine(g.en.metaDescription, "en", 84))} } },`;
});

const compareLines = COMPARE_LIST.map((s) => {
  const c = TLD_COMPARES[s];
  return `  { slug: ${q(s)}, a: ${q(c.a)}, b: ${q(c.b)}, title: { zh: ${q(c.zh.title)}, en: ${q(c.en.title)} } },`;
});

const files = {
  "hub-index-tld.ts": `${header}
import type { Tld } from "./tld-list";

type Localized = { zh: string; en: string };

/** tld → 一句话定位（metaDescription 首句），键集与 TLD_LIST 编译期强一致 */
export const TLD_ONE_LINERS = {
${tldLines.join("\n")}
} satisfies Record<Tld, Localized>;
`,
  "hub-index-guide.ts": `${header}
type Localized = { zh: string; en: string };

/** 行业指南索引（顺序与 GUIDE_LIST 一致）：slug + 双语标签 + 一句话定位 */
export const GUIDE_INDEX: { slug: string; label: Localized; oneLiner: Localized }[] = [
${guideLines.join("\n")}
];
`,
  "hub-index-vs.ts": `${header}
type Localized = { zh: string; en: string };

/** 对比页索引（顺序与 COMPARE_LIST 一致）：slug + 左右 TLD + 双语标题 */
export const COMPARE_INDEX: { slug: string; a: string; b: string; title: Localized }[] = [
${compareLines.join("\n")}
];
`,
};

if (process.argv.includes("--check")) {
  let ok = true;
  for (const [name, out] of Object.entries(files)) {
    let existing = "";
    try {
      existing = readFileSync(join(contentDir, name), "utf8");
    } catch {
      /* 文件缺失视为不一致 */
    }
    if (existing !== out) {
      console.error(`${name} 与内容源不一致，请运行 node scripts/gen-hub-index.mjs 重新生成`);
      ok = false;
    }
  }
  if (!ok) process.exit(1);
  console.log(`hub-index-*.ts 与内容源一致（tld ${TLD_LIST.length} / guide ${GUIDE_LIST.length} / vs ${COMPARE_LIST.length}）`);
} else {
  for (const [name, out] of Object.entries(files)) writeFileSync(join(contentDir, name), out);
  console.log(`已生成 hub-index-{tld,guide,vs}.ts（tld ${TLD_LIST.length} / guide ${GUIDE_LIST.length} / vs ${COMPARE_LIST.length}）`);
}
