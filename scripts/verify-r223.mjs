// R223 过滤器自检脚本（R218 审计 P2-2 修复，无测试框架，0 AI 调用）
// 用法：node scripts/verify-r223.mjs
// 覆盖 R218 生产穿透用例 besowith（refine 轮 ref1 实测）及同型造例：
// label 子串恰为英文停用词（with/that/from 等）+ 谓语词双双命中导致词语沙拉放行。
// 好例取自 R218 ref1 正常输出形态 + R196 既有好例，全部必须继续放行（误杀 0）。
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r223-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { enMeaningIncoherent } = await import(tmp);
rmSync(tmp);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
};

// ---------- 坏例（必须过滤 = true） ----------
// R218 ref1 生产实测穿透用例：子串 "with"（停用词）+ 谓语 "suggests" 双双命中
check(
  "en-incoherent bad: besowith (R218 ref1 production)",
  enMeaningIncoherent(
    "besowith",
    "be so with suggests being exactly where they need it already carried and that reading brought whole on first try; two strides like a firm led gesture",
  ),
  true,
);
// 同型造例：子串恰为停用词 that/from/over/一般功能词 + 沙拉句含谓语词
check(
  "en-incoherent bad: monthat (stopword frag 'that')",
  enMeaningIncoherent("monthat", "that low turning suggests a season pressed under glass, phrase move without trail"),
  true,
);
check(
  "en-incoherent bad: velfrom (stopword frag 'from')",
  enMeaningIncoherent("velfrom", "carried from a shaded ounce of evening, reads the floor n look for times privately"),
  true,
);
check(
  "en-incoherent bad: cloverly-ish salad (stopword frag 'over')",
  enMeaningIncoherent("stovery", "over the small press it means a future named as an ounce, same phrase shaded"),
  true,
);
// 前缀规则击穿造例：label 前 3 字母恰是停用词开头（theora ↔ 冠词 the）不算锤点
check(
  "en-incoherent bad: theora (prefix hits article 'the')",
  enMeaningIncoherent("theora", "the quiet suggests a vein memory, floor n look, for times shaded privately"),
  true,
);
// R196 既有坏例回归
check(
  "en-incoherent bad: allur (R195 regression)",
  enMeaningIncoherent("allur", "alapa vein memory, floor n look, for times shaded privately; same press on small, phrase move without trail"),
  true,
);
check(
  "en-incoherent bad: privar (R195 regression)",
  enMeaningIncoherent("privar", "private mirror flattened to a sharp final ar, a future named as an ounce"),
  true,
);

// ---------- 好例（必须放行 = false，误杀 0） ----------
// R196 既有好例回归（prompt few-shot 与常见正常输出）
const enGood = [
  ["anvil", "A real English word: the blacksmith's anvil, metaphor for a solid build tool where ideas get forged; one heavy stressed syllable, reads instantly"],
  ["verbloom", "verb + bloom: words that blossom, fits a writing app; two recognizable words joined, stress on the first syllable"],
  ["lumora", 'Latin "lumen" meaning light + soft -ora ending, evokes clarity for a journaling app; two open syllables, reads instantly'],
  ["trackit", "track + it: the simplest promise of a tracking tool, reads as a command; two crisp syllables"],
  ["suavesage", "suave + sage: smooth wisdom for an advisory brand, both words appear letter for letter; alliterative s sounds"],
  // R218 ref1 正常输出形态：blend 类词源拆解（非停用词片段命中）
  ["grainway", "grain + way: a path of small steady grains, evokes a calm habit trail; both words appear letter for letter"],
  ["pebblecore", "pebble + core: small solid center, suggests durable little habits; reads as two plain words"],
  ["waveform", "a real audio term: the waveform of a log stream made visible, suggests a searchable timeline; reads instantly"],
  // 含停用词子串但 meaning 完整引用 label 或含实词片段的合法候选（不得误杀）
  ["gowith", "go + with: the name reads as gowith, a companion tool that goes with you; two crisp syllables"],
  ["thermalog", "thermal + log: heat maps for your logs, thermal appears letter for letter; reads as a compound"],
];
for (const [label, meaning] of enGood) check(`en-incoherent good: ${label}`, enMeaningIncoherent(label, meaning), false);

if (failed > 0) {
  console.error(`\n${failed} case(s) FAILED`);
  process.exit(1);
}
console.log("\nall cases passed");
