// R246 过滤器自检脚本（R239 审计 P2-3 + P2-4 修复，无测试框架，0 AI 调用）
// 用法：node scripts/verify-r246.mjs
// P2-3：enMeaningIncoherent 前缀锤点收紧——公共前缀 ≥4 才算，恰为 3 时需词源引用语境
//   （引号包裹或紧跟语言名），拦截 R239 ref1 三个穿透坏例 ancryst/oparior/lintow。
// P2-4：新增 zhCitesPhantomAscii——zh meaning 引用 label 中不存在且非白名单的独立
//   ASCII 词（不带取自/源自句式）判臆造，拦截 R239 ref2 三个坏例 tibeirock/kinwalk/duanyou。
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r246-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { enMeaningIncoherent, zhCitesPhantomAscii } = await import(tmp);
rmSync(tmp);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
};

// ---------- P2-3 坏例（R239 ref1 生产穿透，必须过滤 = true） ----------
check(
  "P2-3 bad: ancryst (prefix hits 'anchors', common prefix 3)",
  enMeaningIncoherent("ancryst", "first layer from an upstroke inclining—stem anchors data sharp, darning current quickly"),
  true,
);
check(
  "P2-3 bad: oparior (hallucinated 'opairein' self-certifies)",
  enMeaningIncoherent("oparior", "From opairein, Greek for to open avenues—a hidden way to lift hands over the table"),
  true,
);
check(
  "P2-3 bad: lintow (prefix hits 'linen')",
  enMeaningIncoherent("lintow", "firm linen knot remains unbraided but reads readable rune"),
  true,
);

// ---------- P2-3 好例（必须放行 = false，误杀 0） ----------
// 公共前缀恰为 3 但处于词源引用语境（语言名 + 引号）——R196 既有好例
check("P2-3 good: lumora ↔ Latin \"lumen\" (quoted etymology, common prefix 3)", enMeaningIncoherent("lumora", 'Latin "lumen" meaning light + soft -ora ending, evokes clarity for a journaling app; two open syllables, reads instantly'), false);
// 自建合法 refine meaning 样本（≥4 公共前缀 / label 片段 / 整词命中，全部放行）
const enGood = [
  ["brewnest", "brew + nest: a cozy home for your coffee ritual; reads as two plain words"],
  ["fintrace", "fin from finance plus trace: every cent leaves a trail; two crisp syllables"],
  ["pulsekeep", "pulse + keep: your uptime heartbeat held steady, evokes constant watch; reads as a compound"],
  ["glowery", "From Old English glow, a soft shine over your journal; reads gently with a -ery ending"],
  ["opaline", "From opal, the gemstone; evokes soft iridescence for a design tool; three open syllables"],
  ["veridia", 'Latin "veritas" root meaning truth, truth-first data for auditors; evokes trust'],
  ["anvil", "A real English word: the blacksmith's anvil, metaphor for a solid build tool where ideas get forged; one heavy stressed syllable, reads instantly"],
  ["trackit", "track + it: the simplest promise of a tracking tool, reads as a command; two crisp syllables"],
];
for (const [label, meaning] of enGood) check(`P2-3 good: ${label}`, enMeaningIncoherent(label, meaning), false);

// ---------- P2-4 坏例（R239 ref2 生产穿透，必须过滤 = true） ----------
check("P2-4 bad: tibeirock cites phantom 'tedeck'", zhCitesPhantomAscii("tibeirock", "tedeck 落音笃定，岩茶山场的沉稳气息扑面而来"), true);
check("P2-4 bad: kinwalk cites phantom 'kino'", zhCitesPhantomAscii("kinwalk", "kino 指尖溜过石板，轻快的散步节奏感"), true);
check("P2-4 bad: duanyou cites phantom 'wrin'", zhCitesPhantomAscii("duanyou", "wrin 前缀强调直结声，山野悠然的茶席气息"), true);

// ---------- P2-4 好例（必须放行 = false，误杀 0） ----------
const zhGood = [
  // label 子串引用（最常见合法形态）
  ["muzhou", "mu 取自「木」的质朴，zhou 取自「舟」的远行，寓意稳载"],
  ["plangrow", "plan 与 grow 结合，寓意计划中成长"],
  ["chapu", "chapu 读来干脆，如茶席铺陈，寓意茶事有序"],
  ["shanquan", "shan 取「山」之意，quan 如泉水清冽，寓意山泉入茶"],
  // 词源句式来源词（由 citesPhantomWord 校验，本防线剥离不判）
  ["scirio", "sci 如科学探索，rio 取自 curious 的好奇尾音，寓意求知"],
  ["lumora", "lum 源自 latin lumen 的光，寓意清亮"],
  ["crousti", "源自法语 croustillant 的酥脆感，法式烘焙的招牌口感"],
  ["brioche", "法语 brioche 黄油面包，甜点店的经典符号"],
  // 通用英文白名单词（tech/cloud/saas/TLD 名等点题词）
  ["yunji", "云集之意，cloud 般的聚合感，适合 saas 平台"],
  ["kuaidao", "「快到」谐音，配 app 后缀读来利落，寓意即刻送达"],
  ["yanxi", "「岩溪」意象，山场 tea 韵与溪流感，适合 com 后缀"],
  // 纯中文 meaning（无 ASCII 词，不触发）
  ["yancha", "「岩茶」全拼，山场气息扑面，正岩韵味"],
];
for (const [label, meaning] of zhGood) check(`P2-4 good: ${label}`, zhCitesPhantomAscii(label, meaning), false);

if (failed > 0) {
  console.error(`\n${failed} case(s) FAILED`);
  process.exit(1);
}
console.log("\nall cases passed");
