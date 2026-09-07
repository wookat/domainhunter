// R489：中文寓意输入 → 规则降级候选的离线横评（0 AI 调用，纯函数，不触发 /api/ai-search）
// 用法：node scripts/bench-zh-rule-fallback.mjs [--json out.json] [--md] [--labels] [--input 描述 ...]（--input 给出时只跑这些输入）
// 每个输入输出：根词、候选数、构成比例（拼音词 / 寓意短拼音 / 拼音+英文 / 英文 / 泛前后缀）、
// 坏例（超长 >12 / 含数字连字符 / 元词根「寓意」等 / 跨词碎片 / ≥4 音节纯拼音串）与防线丢弃数。
// 坏例口径固定，用于改前改后同口径对比；泛前后缀占比单列，不计入坏例。
import { rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, `scripts/.bench-zh-rule-${process.pid}.mjs`);
await build({
  stdin: {
    contents: 'export * from "./apps/web/src/rule-fallback"; export { newGuardStats, checkPinyinLabel } from "./apps/web/src/ai"; export { VARIANT_PREFIXES, VARIANT_SUFFIXES } from "./apps/web/src/lib/variants";',
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  outfile: tmp,
  logLevel: "silent",
});
const rule = await import(tmp);
rmSync(tmp);

/** 典型中文寓意输入：覆盖 2–4 字寓意词、行业词、抽象寓意；R493 追加 单字 / 口语冗词长句 / 数字英文混写 / 3 字行业词 */
export const INPUTS = [
  "茶叶电商，寓意清雅",
  "宠物用品，活泼",
  "独立开发者工具，极简",
  "面向中小商家的云端记账工具",
  "母婴用品品牌，寓意温暖安心",
  "跨境电商，寓意远航",
  "智能家居，科技感，寓意光明",
  "咖啡馆，文艺，慢生活",
  "少儿编程教育，寓意启蒙智慧",
  "健身工作室，活力向上",
  "云",
  "星辰大海",
  "宠物殡葬，温暖告别",
  "新能源充电桩运营，希望名字有快和稳的感觉",
  "做一个帮独立开发者卖课的网站，名字要有成长的意思",
  "想要一个AI客服SaaS的名字，2B，寓意高效",
];

/** 描述里的元词（说明寓意/风格，本身不是品牌语义），出现在根词里即坏例 */
const META_WORDS = new Set(["寓意", "风格", "科技感", "感觉", "气质"]);
/** 人工标注：10 个输入里 2 字滑窗切出的跨词碎片（不是词） */
const FRAGMENTS = new Set(["境电", "慢生", "叶电", "物用", "者工", "婴用", "居科", "儿编", "程教", "身工", "作室", "新能", "源充", "电桩"]);

const QUOTED = /「([\u4e00-\u9fff]{1,4})」/g;

function classify(c) {
  const m = c.meaning;
  const hasPy = /拼音/.test(m);
  const hasEn = /英文/.test(m);
  if (/前缀|后缀/.test(m)) return "affix";
  if (hasPy && hasEn) return "blend";
  if (hasPy) {
    const quoted = [...m.matchAll(QUOTED)].map((x) => x[1]);
    return quoted.some((q) => q.length === 1) ? "brand" : "pinyin";
  }
  return "ascii";
}

const KINDS = ["pinyin", "brand", "blend", "ascii", "affix"];

export function bench(input, lang = "zh") {
  const g = rule.newGuardStats();
  const roots = rule.extractRuleRoots(input);
  const cands = rule.generateRuleCandidates(input, lang, g);
  const kinds = Object.fromEntries(KINDS.map((k) => [k, 0]));
  const bad = [];
  for (const c of cands) {
    const k = classify(c);
    kinds[k]++;
    const reasons = [];
    const quoted = [...c.meaning.matchAll(QUOTED)].map((x) => x[1]);
    if (c.label.length > 12) reasons.push("len>12");
    if (/[0-9-]/.test(c.label)) reasons.push("digit/hyphen");
    if (quoted.some((q) => META_WORDS.has(q))) reasons.push("meta-root");
    if (quoted.some((q) => FRAGMENTS.has(q))) reasons.push("fragment");
    if ((k === "pinyin" || k === "brand") && quoted.filter((q) => q.length === 2).length >= 2) reasons.push("4-syllable-pinyin");
    if (reasons.length) bad.push({ label: c.label, reasons });
  }
  return {
    input,
    roots: roots.map((r) => (r.kind === "pinyin" ? `${r.text}(${r.hanzi})` : r.text)),
    count: cands.length,
    kinds,
    bad,
    badRate: cands.length ? bad.length / cands.length : 0,
    labels: cands.map((c) => c.label),
    dropped: Object.values(g.dropped).reduce((a, b) => a + b, 0),
  };
}

const args = process.argv.slice(2);
const jsonIdx = args.indexOf("--json");
const md = args.includes("--md");
const showLabels = args.includes("--labels");
const cliInputs = args.filter((a, i) => i > 0 && args[i - 1] === "--input");
const rows = (cliInputs.length ? cliInputs : INPUTS).map((i) => bench(i));
if (jsonIdx >= 0) writeFileSync(args[jsonIdx + 1], JSON.stringify(rows, null, 2));

const tot = rows.reduce(
  (a, r) => {
    a.count += r.count;
    a.bad += r.bad.length;
    a.dropped += r.dropped;
    for (const k of KINDS) a.kinds[k] += r.kinds[k];
    return a;
  },
  { count: 0, bad: 0, dropped: 0, kinds: Object.fromEntries(KINDS.map((k) => [k, 0])) },
);
const pct = (n, d) => (d ? `${((n / d) * 100).toFixed(0)}%` : "0%");
if (md) {
  console.log("| # | 输入 | 根词 | 候选 | 拼音词 | 寓意短拼音 | 拼音+英文 | 英文 | 泛前后缀 | 坏例 | 坏例率 | 防线丢弃 |");
  console.log("|---|---|---|---|---|---|---|---|---|---|---|---|");
  rows.forEach((r, i) =>
    console.log(
      `| ${i + 1} | ${r.input} | ${r.roots.join(" ") || "—"} | ${r.count} | ${r.kinds.pinyin} | ${r.kinds.brand} | ${r.kinds.blend} | ${r.kinds.ascii} | ${r.kinds.affix} | ${r.bad.length} | ${pct(r.bad.length, r.count)} | ${r.dropped} |`,
    ),
  );
  console.log(
    `| 合计 | | | ${tot.count} | ${tot.kinds.pinyin} | ${tot.kinds.brand} | ${tot.kinds.blend} | ${tot.kinds.ascii} | ${tot.kinds.affix} (${pct(tot.kinds.affix, tot.count)}) | ${tot.bad} | ${pct(tot.bad, tot.count)} | ${tot.dropped} |`,
  );
  if (showLabels) for (const r of rows) console.log(`\n- ${r.input}：${r.labels.join(" ")}`);
} else {
  for (const r of rows) {
    console.log(`\n== ${r.input}`);
    console.log(`roots: ${r.roots.join(", ") || "(none)"}  count=${r.count} dropped=${r.dropped}`);
    console.log(`kinds: ${JSON.stringify(r.kinds)}  bad=${r.bad.length} (${pct(r.bad.length, r.count)}) ${r.bad.map((b) => `${b.label}[${b.reasons}]`).join(" ")}`);
    console.log(`labels: ${r.labels.join(" ")}`);
  }
  console.log(`\nTOTAL count=${tot.count} kinds=${JSON.stringify(tot.kinds)} affix=${pct(tot.kinds.affix, tot.count)} bad=${tot.bad} (${pct(tot.bad, tot.count)}) dropped=${tot.dropped}`);
}
