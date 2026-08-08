// R196 过滤器自检脚本（无测试框架，独立 node 脚本，0 AI 调用）
// 用法：node scripts/verify-r196.mjs
// 覆盖 R195 审计报告中的好例（必须放行）与坏例（必须过滤），
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r196-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { enMeaningIncoherent, pinyinQuoteMismatch, citesPhantomWord } = await import(tmp);
rmSync(tmp);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
};

// ---------- P1-1：EN meaning 连贯性启发式 ----------
// 坏例（R195 报告词语沙拉，必须判为 incoherent = true）
const enBad = [
  ["allur", "alapa vein memory, floor n look, for times shaded privately; same press on small, phrase move without trail"],
  ["privar", "private mirror flattened to a sharp final ar, a future named as an ounce"],
];
for (const [label, meaning] of enBad) check(`en-incoherent bad: ${label}`, enMeaningIncoherent(label, meaning), true);
// 好例（正常词源文案，必须放行 = false），取自 prompt few-shot 与常见正常输出
const enGood = [
  ["anvil", "A real English word: the blacksmith's anvil, metaphor for a solid build tool where ideas get forged; one heavy stressed syllable, reads instantly"],
  ["verbloom", "verb + bloom: words that blossom, fits a writing app; two recognizable words joined, stress on the first syllable"],
  ["lumora", 'Latin "lumen" meaning light + soft -ora ending, evokes clarity for a journaling app; two open syllables, reads instantly'],
  ["trackit", "track + it: the simplest promise of a tracking tool, reads as a command; two crisp syllables"],
  ["suavesage", "suave + sage: smooth wisdom for an advisory brand, both words appear letter for letter; alliterative s sounds"],
];
for (const [label, meaning] of enGood) check(`en-incoherent good: ${label}`, enMeaningIncoherent(label, meaning), false);

// ---------- P2-1：中文「取自/源自/来自」幻影词源 ----------
// 坏例（必须过滤 = true）
check("zh-source bad: rio 取自 river（river 里没有 rio）", citesPhantomWord("scirio", "sci 如科学探索，rio 取自 river 的流动感，寓意求知"), true);
check("zh-source bad: 引用片段不在 label", citesPhantomWord("breza", "zo 取自 zone 的空间感，寓意清晨"), true);
// 好例（必须放行 = false）
// 注：R195 报告称 "curious 里没有 rio"，实际 cu-rio-us 连续包含 rio，属报告笔误；该句式合法放行
check("zh-source good: rio 取自 curious（cu-rio-us 连续包含）", citesPhantomWord("scirio", "sci 如科学探索，rio 取自 curious 的好奇尾音，寓意求知"), false);
check("zh-source good: mu 取自「木」", citesPhantomWord("muzhou", "mu 取自「木」的质朴，zhou 取自「舟」的远行，寓意稳载"), false);
check("zh-source good: lum 源自 latin lumen", citesPhantomWord("lumora", "lum 源自 latin lumen 的光，寓意清亮"), false);
check("zh-source good: 语言词收尾不判", citesPhantomWord("lumora", "lum 源自 latin"), false);
check("zh-source good: 旧句式 plan 与 grow 结合", citesPhantomWord("plangrow", "plan 与 grow 结合，寓意计划中成长"), false);

// ---------- P2-2：拼音引用词与 label 一致性 ----------
// 坏例（必须过滤 = true）
check("pinyin-quote bad: tangfang/「探方」", pinyinQuoteMismatch("tangfang", "「探方」双全拼，寓意探索方向"), true);
check("pinyin-quote bad: sanvei/「山味」", pinyinQuoteMismatch("sanvei", "「山味」全拼，山野风味"), true);
// 好例（必须放行 = false）
check("pinyin-quote good: muzhou/「木舟」", pinyinQuoteMismatch("muzhou", "「木舟」双字全拼，寓意稳载远行"), false);
check("pinyin-quote good: zhihu/「知乎」", pinyinQuoteMismatch("zhihu", "「知乎」全拼，求知问答"), false);
check("pinyin-quote good: lvcheng/「绿城」ü 写作 v", pinyinQuoteMismatch("lvcheng", "「绿城」全拼，绿色之城"), false);
check("pinyin-quote good: 表外字放行 yerang/「野莨」", pinyinQuoteMismatch("yerang", "「野莨」全拼，野趣"), false);
check("pinyin-quote good: 未声称全拼不判", pinyinQuoteMismatch("tangfang", "「探方」拼读顺口"), false);
check("pinyin-quote good: 多音字 lecheng/「乐城」", pinyinQuoteMismatch("lecheng", "「乐城」全拼，欢乐之城"), false);

// ---------- P1-1：问号丢弃（在 generateOnce 内联，规则等价断言） ----------
const hasQuestion = (m) => m.includes("?") || m.includes("？");
check("question bad: yonkle", hasQuestion("yonkle as a knoll taken to third power hand, your ridge from low months? dry as resin"), true);
check("question good: 正常句", hasQuestion("「木舟」双字全拼，寓意稳载远行"), false);

if (failed > 0) {
  console.error(`\n${failed} case(s) FAILED`);
  process.exit(1);
}
console.log("\nall cases passed");
