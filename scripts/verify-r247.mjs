// R247 自检脚本（R239 审计 P3-4 修复，无测试框架，0 AI 调用）
// 用法：node scripts/verify-r247.mjs
// 1. isLowYield：多轮低产出检测——连续 2 轮可注册增量 ≤1 且已选 TLD ≤2 时触发（提示只发一次由 worker 保证）
// 2. detectPinyinFocus：偏拼音需求检测——描述强调拼音/中文名时命中，触发 prompt 侧变体拓宽指令
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r247-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { isLowYield, detectPinyinFocus, ZH_PINYIN_BROADEN_HINT, LOW_YIELD_CONSECUTIVE_ROUNDS, LOW_YIELD_MAX_GAIN, LOW_YIELD_MAX_TLDS } = await import(tmp);
rmSync(tmp);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
};

// ---------- isLowYield：触发用例（R239 zh2/zh3 生产形态） ----------
// zh2 实测：5 轮打满仅 1 个可注册（增量 1,0,0,0,0），默认 com+cn 双 TLD
check("trigger: zh2 shape round2 (gains [1,0], 2 tlds)", isLowYield([1, 0], 2), true);
check("trigger: gains [0,0], 2 tlds", isLowYield([0, 0], 2), true);
check("trigger: gains [1,1], 1 tld", isLowYield([1, 1], 1), true);
check("trigger: later rounds (gains [5,1,0], 2 tlds)", isLowYield([5, 1, 0], 2), true);
check("trigger: boundary gain == LOW_YIELD_MAX_GAIN", isLowYield([LOW_YIELD_MAX_GAIN, LOW_YIELD_MAX_GAIN], LOW_YIELD_MAX_TLDS), true);

// ---------- isLowYield：不触发用例 ----------
check("no-trigger: only 1 round so far", isLowYield([0], 2), false);
check("no-trigger: empty gains", isLowYield([], 2), false);
check("no-trigger: last round productive (gains [0,5], 2 tlds)", isLowYield([0, 5], 2), false);
check("no-trigger: previous round productive (gains [5,0], 2 tlds)", isLowYield([5, 0], 2), false);
check("no-trigger: many tlds selected (gains [0,0], 3 tlds)", isLowYield([0, 0], 3), false);
check("no-trigger: many tlds selected (gains [0,0], 5 tlds)", isLowYield([0, 0], 5), false);
check("no-trigger: healthy search (gains [6,7], 2 tlds)", isLowYield([6, 7], 2), false);
check("consecutive-rounds constant sane", LOW_YIELD_CONSECUTIVE_ROUNDS, 2);

// ---------- detectPinyinFocus：命中用例（R239 zh2 生产描述形态） ----------
check("pinyin focus: 双字全拼需求", detectPinyinFocus("想要一个双字全拼的域名，知乎豆瓣气质的山水诗词社区"), true);
check("pinyin focus: 强调拼音", detectPinyinFocus("品牌名用拼音，好读好记"), true);
check("pinyin focus: 全拼", detectPinyinFocus("要全拼域名，寓意山水"), true);
check("pinyin focus: 中文名", detectPinyinFocus("希望域名直接用中文名的读音"), true);
check("pinyin focus: 声母缩写", detectPinyinFocus("可以用声母缩写"), true);

// ---------- detectPinyinFocus：不命中用例（普通商业描述不触发拓宽） ----------
check("no pinyin focus: 烘焙工作室", detectPinyinFocus("手工烘焙工作室，法式甜点与下午茶"), false);
check("no pinyin focus: 岩茶订阅", detectPinyinFocus("岩茶白茶订阅电商，山场气息"), false);
check("no pinyin focus: english desc", detectPinyinFocus("privacy-first finance tracker for indie hackers"), false);

// ---------- 拓宽 hint 内容自检：覆盖三条更宽路线且不动 TLD ----------
check("broaden hint mentions 三字全拼", ZH_PINYIN_BROADEN_HINT.includes("三字全拼"), true);
check("broaden hint mentions 缩合", ZH_PINYIN_BROADEN_HINT.includes("缩合"), true);
check("broaden hint mentions 拼音+英文混搭", ZH_PINYIN_BROADEN_HINT.includes("拼音+英文混搭"), true);
check("broaden hint does not touch TLD choice", ZH_PINYIN_BROADEN_HINT.includes("TLD") || ZH_PINYIN_BROADEN_HINT.includes("后缀"), false);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
