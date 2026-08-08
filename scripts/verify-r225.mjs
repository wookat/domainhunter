// R225 点踩形态规避自检脚本（无测试框架，独立 node 脚本，0 AI 调用）
// 用法：node scripts/verify-r225.mjs
// 用 R218 审计（docs/qa/ai-audit-r218.md）ref1/ref2 的真实产出做离线回放：
// 违规候选必须被拦截（moyu/moxu/gleanix），正常候选必须放行（误杀校验），
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r225-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { dislikedMorphologyConflict, filterDislikedMorphology, dislikeSuffixOf, dislikeRootOf, DISLIKE_FILTER_MIN_KEEP } = await import(tmp);
rmSync(tmp);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : ` — got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`}`);
};

// ---------- 特征提取 ----------
check("root: moji → mo（拼音音节）", dislikeRootOf("moji"), "mo");
check("root: moxiang → mo（拼音音节）", dislikeRootOf("moxiang"), "mo");
check("root: gleanix → gle（首 3 字符兜底）", dislikeRootOf("gleanix"), "gle");
check("suffix: forgex → x", dislikeSuffixOf("forgex"), "x");
check("suffix: gleanix → x", dislikeSuffixOf("gleanix"), "x");
check("suffix: traxen → 无", dislikeSuffixOf("traxen"), null);
check("suffix: loggify → ify（长模式优先）", dislikeSuffixOf("loggify"), "ify");
check("suffix: studio → io", dislikeSuffixOf("studio"), "io");

// ---------- R218 ref2 回放：ZH 点踩 moji/moxiang（墨 mo 词根） ----------
const ref2Disliked = [
  { label: "moji", theme: "pinyin" },
  { label: "moxiang", theme: "pinyin" },
];
// 违规（R218 实测漏网，必须拦截为 root）
check("ref2 违规: moyu（墨雨，同 mo 词根）", dislikedMorphologyConflict("moyu", ref2Disliked), "root");
check("ref2 违规: moxu（墨叙，同 mo 词根）", dislikedMorphologyConflict("moxu", ref2Disliked), "root");
// 正常产出（R218 ref2 真实候选，必须放行，误杀校验）
for (const ok of ["cencun", "cuandian", "zazhi", "shuyou", "hanmohub"]) {
  check(`ref2 放行: ${ok}`, dislikedMorphologyConflict(ok, ref2Disliked), null);
}
// mo 开头但词首音节不同的英文词不误杀（morrow 首音节 mo 会拦——设计内；moss 无 mo 音节切分歧义仍拦，
// 属设计权衡：点踩 mo 词根后 mo 开头一律回避）
check("ref2 拦截: mochi（mo 开头，设计内回避）", dislikedMorphologyConflict("mochi", ref2Disliked), "root");

// ---------- R218 ref1 回放：EN 点踩 traxen/forgex（-x 后缀 coined） ----------
const ref1Disliked = [
  { label: "traxen", theme: "coined" },
  { label: "forgex", theme: "coined" },
];
// 违规（R218 实测漏网，必须拦截为 suffix）
check("ref1 违规: gleanix（同 -x 后缀）", dislikedMorphologyConflict("gleanix", ref1Disliked), "suffix");
check("ref1 违规: sortex（同 -x 后缀）", dislikedMorphologyConflict("sortex", ref1Disliked), "suffix");
// 词根前缀 ≥3 冲突
check("ref1 违规: traceline（与 traxen 共享 tra 前缀）", dislikedMorphologyConflict("traceline", ref1Disliked), "root");
check("ref1 违规: forgeline（与 forgex 共享 for 前缀）", dislikedMorphologyConflict("forgeline", ref1Disliked), "root");
// 正常产出（R218 ref1 真实候选，必须放行，误杀校验）
for (const ok of ["besowith", "waveformy", "grainway", "pebblecore", "walksdown", "logyou", "practiceplus", "ordyr"]) {
  check(`ref1 放行: ${ok}`, dislikedMorphologyConflict(ok, ref1Disliked), null);
}

// ---------- 硬过滤 + 回填权衡 ----------
const cand = (label) => ({ label, meaning: "m", theme: "coined", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } });
// 常规：违规丢弃、正常保留、顺序不变
const filtered = filterDislikedMorphology(
  ["moyu", "cencun", "moxu", "cuandian", "zazhi", "shuyou", "hanmohub", "milu"].map(cand),
  ref2Disliked,
).map((c) => c.label);
check("filter: ref2 违规丢弃且顺序保持", filtered, ["cencun", "cuandian", "zazhi", "shuyou", "hanmohub", "milu"]);
// 回填：过滤后不足 MIN_KEEP 时按原顺序回填仅后缀冲突项（词根冲突不回填）
const backfill = filterDislikedMorphology(
  ["gleanix", "sortex", "vortix", "cortex", "traceline", "quietly", "calmside"].map(cand),
  ref1Disliked,
).map((c) => c.label);
check(
  `filter: 不足 ${DISLIKE_FILTER_MIN_KEEP} 回填仅后缀冲突项、词根冲突不回填`,
  backfill,
  ["quietly", "calmside", "gleanix", "sortex", "vortix", "cortex"],
);

if (failed > 0) {
  console.error(`\n${failed} case(s) FAILED`);
  process.exit(1);
}
console.log("\nall cases passed");
