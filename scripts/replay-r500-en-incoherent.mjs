// R500 离线论证脚本（只出数字，不改规则；无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/replay-r500-en-incoherent.mjs [--verbose]
//
// 问题：R496–R499 生产 en 首搜 meaningIncoherent 丢弃 22/36（docs/audits/r496-r499/ai-search-03-en.ndjson），
// 存活 blend 全为「X + Y: …」句式且 EN_PREDICATE_RE 命中多靠尾句 sound/reads/words。父会话推断被丢弃者
// 是「缺尾句谓语的同句式候选」——本脚本不验证该推断（需生产 debugDropped 样本），只回答两个可离线回答的问题：
//   Q1 现规则对人工构造的「忠实 X + Y: …」缺谓语 meaning 判定如何？
//   Q2 若把「R497 已验证忠实的 X + Y: 对（EN_PAIR_COLON_RE 命中且两词均为 label 子串）」计为谓语，
//      对 scripts/ 下全部 EN 标注夹具（verify-r196/r223/r246；r498 无 enMeaningIncoherent 标注）+ 审计 NDJSON
//      存活候选 + 构造样本的精确率/召回率如何变化？
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载，读取真实实现。
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const verbose = process.argv.includes("--verbose");
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r500-compiled.mjs");
await build({ entryPoints: [path.join(root, "apps/web/src/ai.ts")], bundle: true, format: "esm", outfile: tmp });
const { enMeaningIncoherent, citesPhantomWord } = await import(tmp);
rmSync(tmp);

// ---------- 假设规则（仅本脚本内模拟，不写入 ai.ts） ----------
// 与 ai.ts 中 EN_PAIR_COLON_RE 同一正则；「忠实」= 两词均为 label 子串（R497 pairMismatch 的一级放行条件）
const EN_PAIR_COLON_RE = /\b([a-z]{3,})\s*[+×]\s*([a-z]{3,})\s*[:：]/gi;
function faithfulPairColon(label, meaning) {
  EN_PAIR_COLON_RE.lastIndex = 0;
  let m;
  while ((m = EN_PAIR_COLON_RE.exec(meaning)) !== null) {
    const x = m[1].toLowerCase();
    const y = m[2].toLowerCase();
    if (label.includes(x) && label.includes(y)) return true;
  }
  return false;
}
/** 假设规则：现规则判 incoherent 且不存在忠实 X + Y: 对 → 仍 incoherent；有忠实对 → 放行 */
function hypoIncoherent(label, meaning, opts) {
  const cur = enMeaningIncoherent(label, meaning, opts);
  if (!cur) return false;
  return !faithfulPairColon(label, meaning);
}

// ---------- 标注夹具（逐字复制自 scripts/verify-r196/r223/r246.mjs，bad=应拦 true，good=应放 false） ----------
const fixtures = [];
const add = (src, label, meaning, expect) => fixtures.push({ src, label, meaning, expect });
// verify-r196 enBad / enGood
add("r196", "allur", "alapa vein memory, floor n look, for times shaded privately; same press on small, phrase move without trail", true);
add("r196", "privar", "private mirror flattened to a sharp final ar, a future named as an ounce", true);
add("r196", "anvil", "A real English word: the blacksmith's anvil, metaphor for a solid build tool where ideas get forged; one heavy stressed syllable, reads instantly", false);
add("r196", "verbloom", "verb + bloom: words that blossom, fits a writing app; two recognizable words joined, stress on the first syllable", false);
add("r196", "lumora", 'Latin "lumen" meaning light + soft -ora ending, evokes clarity for a journaling app; two open syllables, reads instantly', false);
add("r196", "trackit", "track + it: the simplest promise of a tracking tool, reads as a command; two crisp syllables", false);
add("r196", "suavesage", "suave + sage: smooth wisdom for an advisory brand, both words appear letter for letter; alliterative s sounds", false);
// verify-r223 bad（R218 ref1 生产穿透 + 同型造例）/ good
add("r223", "besowith", "be so with suggests being exactly where they need it already carried and that reading brought whole on first try; two strides like a firm led gesture", true);
add("r223", "monthat", "that low turning suggests a season pressed under glass, phrase move without trail", true);
add("r223", "velfrom", "carried from a shaded ounce of evening, reads the floor n look for times privately", true);
add("r223", "stovery", "over the small press it means a future named as an ounce, same phrase shaded", true);
add("r223", "theora", "the quiet suggests a vein memory, floor n look, for times shaded privately", true);
add("r223", "grainway", "grain + way: a path of small steady grains, evokes a calm habit trail; both words appear letter for letter", false);
add("r223", "pebblecore", "pebble + core: small solid center, suggests durable little habits; reads as two plain words", false);
add("r223", "waveform", "a real audio term: the waveform of a log stream made visible, suggests a searchable timeline; reads instantly", false);
add("r223", "gowith", "go + with: the name reads as gowith, a companion tool that goes with you; two crisp syllables", false);
add("r223", "thermalog", "thermal + log: heat maps for your logs, thermal appears letter for letter; reads as a compound", false);
// verify-r246 P2-3 bad（R239 ref1 生产穿透）/ good
add("r246", "ancryst", "first layer from an upstroke inclining—stem anchors data sharp, darning current quickly", true);
add("r246", "oparior", "From opairein, Greek for to open avenues—a hidden way to lift hands over the table", true);
add("r246", "lintow", "firm linen knot remains unbraided but reads readable rune", true);
add("r246", "brewnest", "brew + nest: a cozy home for your coffee ritual; reads as two plain words", false);
add("r246", "fintrace", "fin from finance plus trace: every cent leaves a trail; two crisp syllables", false);
add("r246", "pulsekeep", "pulse + keep: your uptime heartbeat held steady, evokes constant watch; reads as a compound", false);
add("r246", "glowery", "From Old English glow, a soft shine over your journal; reads gently with a -ery ending", false);
add("r246", "opaline", "From opal, the gemstone; evokes soft iridescence for a design tool; three open syllables", false);
add("r246", "veridia", 'Latin "veritas" root meaning truth, truth-first data for auditors; evokes trust', false);

// ---------- 审计 NDJSON 中的 en 存活候选（生产 guard 已放行 → 标注 good；同时统计其谓语命中依赖） ----------
const EN_PREDICATE_RE = /\b(?:mean(?:s|ing)?|evokes?|suggest(?:s|ing)?|from|plus|words?|roots?|short\s+for|named\s+after|combin(?:es|ed|ing)|echoes|joined|blend(?:s|ed)?|derived|refers?|reads?|sounds?|nod\s+to)\b/i;
const ndjsonFiles = ["docs/audits/r494/ai-search-05.ndjson", "docs/audits/r496-r499/ai-search-03-en.ndjson"];
const survivors = [];
for (const f of ndjsonFiles) {
  const lines = readFileSync(path.join(root, f), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  if (lines[0]?._request?.lang !== "en") throw new Error(`${f} 不是 en 请求`);
  for (const l of lines) {
    if (l.type !== "proposed" || !l.items?.length) continue;
    for (const it of l.items) survivors.push({ src: f.replace("docs/audits/", ""), round: l.round, label: it.label, meaning: it.meaning, theme: it.theme });
  }
}

// ---------- 人工构造 ≥10 条「忠实 X + Y: …」缺尾句谓语 meaning（父会话推断的被丢弃形态） ----------
// 构造原则：X、Y 均为 label 子串（R497 忠实），冒号后是成句的产品说明 + 音节描述，但刻意不含
// EN_PREDICATE_RE 中任何谓语词（mean/evoke/suggest/from/plus/word/root/read/sound/blend/… 一概不出现）。
const constructedFaithful = [
  ["commitcharm", "commit + charm: every commit shines in the release notes, mixing tech and playfulness; hard c's anchor the name, soft finish"],
  ["patchpiper", "patch + piper: lures chaos out of git and pipes clean notes out; double p's dance in rhyme"],
  ["washlog", "wash + log: scrubs the mess out of a git history to leave a polished log; a familiar verb paired with the core noun"],
  ["polishlog", "polish + log: turns raw history into something reviewable; a longer compound, three syllables with a smooth flow"],
  ["gleanlog", "glean + log: gathers the best bits of scattered history, like gleaning a field; the 'gl' cluster gives a soft, attentive tone"],
  ["lograft", "log + raft: a raft that carries your narrative safely across the mess; two syllables, sturdy and reliable"],
  ["commix", "commit + mix: a playful mashup for a well-mixed history; two syllables, a zesty 'x' that feels modern"],
  ["calmroot", "calm + root: a foundation of steady routines for focused teams; two clear syllables, the first rhymes with palm"],
  ["trustloop", "trust + loop: a continuous cycle of reliable habits built on mutual trust; the open 'oo' feels warm"],
  ["firmhabit", "firm + habit: a steady, unshakeable routine that anchors a team's daily progress; a sturdy consonant core"],
  ["stillvigil", "still + vigil: quiet watchfulness over progress, calm and attentive at once; soft and sharp consonants in balance"],
  ["quietloop", "quiet + loop: a gentle cycle of habits that builds momentum without noise; two clear parts with soft consonants"],
  ["gitgloss", "git + gloss: a glossy finish for your commit history, trustworthy and quick; one hard g, one soft ending"],
  ["notefold", "note + fold: folds a sprawling history into neat release notes; two flat syllables, easy to say"],
];
// 对照组 A：忠实 X + Y: 对 + 沙拉尾句（假设规则会放行的坏例形态——用 R195/R218 生产沙拉片段拼接）
const constructedSaladWithPair = [
  ["allur", "all + ur: alapa vein memory, floor n look, for times shaded privately; same press on small, phrase move without trail"],
  ["privar", "pri + var: private mirror flattened to a sharp final ar, a future named as an ounce"],
  ["besowith", "beso + with: being exactly where they need it already carried and that whole on first try; two strides like a firm led gesture"],
  ["monthat", "mon + that: low turning a season pressed under glass, phrase move without trail"],
  ["theora", "the + ora: the quiet a vein memory, floor n look, for times shaded privately"],
];
// 对照组 B：不忠实 X + Y: 对（任一词非 label 子串）——先被 R497 citesPhantomWord 拦截，不会到达 enMeaningIncoherent
const constructedPhantomPair = [
  ["complainter", "commit + planner: turns intentions into enduring habits; a quiet 'co' start, a built-in '-er' role"],
  ["purlgit", "purge + pearl: cleaning and a polished gem at once; a soft 'r' and a hard 'g' ending"],
  ["logfixe", "log + fixed: a final version of your log, the French prix fixe; two syllables, a soft 'x'"],
];

// ---------- 回放 ----------
const rows = [];
const push = (group, src, label, meaning, expect, opts) => {
  const cur = enMeaningIncoherent(label, meaning, opts);
  const hypo = hypoIncoherent(label, meaning, opts);
  rows.push({ group, src, label, meaning, expect, cur, hypo, phantom: citesPhantomWord(label, meaning), predicate: EN_PREDICATE_RE.test(meaning), faithfulPair: faithfulPairColon(label, meaning) });
};
for (const f of fixtures) push("fixture", f.src, f.label, f.meaning, f.expect);
for (const s of survivors) push("survivor", `${s.src}#R${s.round}`, s.label, s.meaning, false, { wordMetaphor: s.theme === "word" });
for (const [label, meaning] of constructedFaithful) push("constructed-faithful", "manual", label, meaning, false);
for (const [label, meaning] of constructedSaladWithPair) push("constructed-salad+pair", "manual", label, meaning, true);
for (const [label, meaning] of constructedPhantomPair) push("constructed-phantom-pair", "manual", label, meaning, null);

const fmt = (b) => (b === true ? "T" : b === false ? "F" : "-");
const line = (r) => `| ${r.group} | ${r.src} | ${r.label} | ${fmt(r.expect)} | ${fmt(r.cur)} | ${fmt(r.hypo)} | ${fmt(r.predicate)} | ${fmt(r.faithfulPair)} | ${fmt(r.phantom)} |`;
console.log("| group | src | label | expect(incoherent) | current | hypothetical | EN_PREDICATE hit | faithful X+Y: | citesPhantomWord |");
console.log("|---|---|---|---|---|---|---|---|---|");
for (const r of rows) console.log(line(r));
if (verbose) for (const r of rows) console.log(`\n[${r.group}] ${r.label}: ${r.meaning}`);

// ---------- 精确率/召回率（正类 = incoherent 应拦，对有标注的行） ----------
function prf(rowsIn, key) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const r of rowsIn) {
    if (r.expect === null) continue;
    const pred = r[key];
    if (pred && r.expect) tp++;
    else if (pred && !r.expect) fp++;
    else if (!pred && r.expect) fn++;
    else tn++;
  }
  const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 1 : tp / (tp + fn);
  return { tp, fp, fn, tn, precision, recall };
}
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const sets = {
  "fixtures only (r196+r223+r246)": rows.filter((r) => r.group === "fixture"),
  "fixtures + NDJSON survivors": rows.filter((r) => r.group === "fixture" || r.group === "survivor"),
  "fixtures + survivors + constructed-faithful": rows.filter((r) => r.group !== "constructed-salad+pair" && r.group !== "constructed-phantom-pair"),
  "all labeled (incl. constructed-salad+pair)": rows.filter((r) => r.expect !== null),
};
console.log("\n| set | rule | TP | FP | FN | TN | precision | recall |");
console.log("|---|---|---|---|---|---|---|---|");
for (const [name, rs] of Object.entries(sets)) {
  for (const key of ["cur", "hypo"]) {
    const m = prf(rs, key);
    console.log(`| ${name} | ${key === "cur" ? "current" : "hypothetical"} | ${m.tp} | ${m.fp} | ${m.fn} | ${m.tn} | ${pct(m.precision)} | ${pct(m.recall)} |`);
  }
}

// ---------- 存活候选的谓语命中依赖：去掉「; …」尾句后是否仍命中 EN_PREDICATE_RE ----------
let tailOnly = 0;
for (const s of survivors) {
  const head = s.meaning.split(/;|—/)[0];
  if (EN_PREDICATE_RE.test(s.meaning) && !EN_PREDICATE_RE.test(head)) tailOnly++;
}
console.log(`\nsurvivors: ${survivors.length}; predicate hit only in tail clause (after ';'/'—'): ${tailOnly}`);
const cf = rows.filter((r) => r.group === "constructed-faithful");
console.log(`constructed-faithful: ${cf.length}; current rule judged incoherent: ${cf.filter((r) => r.cur).length}; hypothetical: ${cf.filter((r) => r.hypo).length}`);
const sp = rows.filter((r) => r.group === "constructed-salad+pair");
console.log(`constructed-salad+pair: ${sp.length}; current rule judged incoherent: ${sp.filter((r) => r.cur).length}; hypothetical: ${sp.filter((r) => r.hypo).length}`);
const pp = rows.filter((r) => r.group === "constructed-phantom-pair");
console.log(`constructed-phantom-pair: ${pp.length}; citesPhantomWord (earlier guard) catches: ${pp.filter((r) => r.phantom).length}`);
