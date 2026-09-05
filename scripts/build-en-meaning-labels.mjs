// R508 EN 标注集构建脚本（0 AI 调用）：把 docs/audits 下全部 en 请求 NDJSON 的候选（存活 + R500 debugDropped 样本）、
// 三代 EN 沙拉防线的标注夹具（scripts/verify-r196/r223/r246.mjs）、R500 离线论证的构造样本
// （scripts/replay-r500-en-incoherent.mjs）以及 R508 针对各修法新构造的对抗样本抽出来，套上人工标注，
// 写成 scripts/fixtures/en-meaning-labels.json。标注只在本文件维护（人工逐条读过），重跑即可复现 fixture。
// 用法：node scripts/build-en-meaning-labels.mjs
//
// tag 取值：
//   coherent   忠实解释（成句、词源/释义与 label 自洽；允许平淡）——enMeaningIncoherent 应放行
//   salad      词语沙拉 / 不成句（R195/R218/R239 生产穿透形态及其构造变体）——应拦
// origin 取值：
//   production   生产 NDJSON 原文（存活候选 = guard 已放行；dropped = R500 debugDropped 通道采到的被拦样本，meaning ≤160 码点截断）
//                upstreamDrop=true 标记被 enMeaningIncoherent 上游防线按设计拦下的样本（portmanteau/coined 元词、幻影字母、品牌撞名），
//                它们在生产不会到达 meaningIncoherent，不计入该防线的 P/R 分母（verify-r508 单列）
//   fixture      历史回归脚本标注夹具原文
//   constructed  人工构造（R500 replay 脚本 + R508 对抗样本），单列统计不与生产样本混算
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = [];
const push = (o) => out.push(o);

// ---------- 1. 生产 NDJSON（en 请求）：存活候选 + R500 debugDropped 样本 ----------
// 人工逐条读过（docs/audits/ai-quality-audit-r494.md §EN、docs/audits/r500/README.md）：存活候选 49 条全部成句、
// 被拦样本 13 条全部成句（其中 gitloom/imumi 含 portmanteau/coined 元语言，squashd 幻影 'd'，loom 品牌撞名——
// 均属其它防线的设计内命中（upstreamDrop），但就「是否词语沙拉」而言均为 coherent；reflint/clearbrew 的 metaLanguage
// 命中经 R508 定位为误杀（“consonant blend”/“sounds blend smoothly”），不标 upstreamDrop）。
const UPSTREAM_BY_DESIGN = new Set(["gitloom", "imumi", "squashd", "loom"]);
const ndjson = ["docs/audits/r494/ai-search-05.ndjson", "docs/audits/r496-r499/ai-search-03-en.ndjson", "docs/audits/r500/ai-search-01-en-debugDropped.ndjson"];
for (const rel of ndjson) {
  const lines = fs.readFileSync(path.join(root, rel), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const req = lines[0]._request;
  if (req?.lang !== "en") throw new Error(`${rel} 不是 en 请求`);
  const description = String(req.description ?? "").split("\n")[0];
  for (const o of lines.slice(1)) {
    if (o.type !== "proposed") continue;
    for (const it of o.items ?? []) {
      push({ source: rel, origin: "production", round: o.round, description, label: it.label, theme: it.theme, meaning: it.meaning, supplement: false, tag: "coherent" });
    }
    for (const s of o.guard?.droppedSamples ?? []) {
      push({
        source: rel,
        origin: "production",
        round: o.round,
        description,
        label: s.label,
        theme: s.theme,
        meaning: s.meaning,
        supplement: s.supplement === true,
        droppedReason: s.reason,
        ...(UPSTREAM_BY_DESIGN.has(s.label) ? { upstreamDrop: true } : {}),
        tag: "coherent",
      });
    }
  }
}

// ---------- 2. 历史回归脚本标注夹具（逐字复制，theme 按 meaning 自述归类） ----------
const fx = (source, rows, tag) => {
  for (const [label, meaning, theme] of rows) push({ source, origin: "fixture", round: null, description: "", label, theme, meaning, supplement: false, tag });
};
// verify-r196：R195 生产反思轮沙拉（bad）/ few-shot 好例（good）
fx("scripts/verify-r196.mjs", [
  ["allur", "alapa vein memory, floor n look, for times shaded privately; same press on small, phrase move without trail", "coined"],
  ["privar", "private mirror flattened to a sharp final ar, a future named as an ounce", "coined"],
], "salad");
fx("scripts/verify-r196.mjs", [
  ["anvil", "A real English word: the blacksmith's anvil, metaphor for a solid build tool where ideas get forged; one heavy stressed syllable, reads instantly", "word"],
  ["verbloom", "verb + bloom: words that blossom, fits a writing app; two recognizable words joined, stress on the first syllable", "blend"],
  ["lumora", 'Latin "lumen" meaning light + soft -ora ending, evokes clarity for a journaling app; two open syllables, reads instantly', "coined"],
  ["trackit", "track + it: the simplest promise of a tracking tool, reads as a command; two crisp syllables", "blend"],
  ["suavesage", "suave + sage: smooth wisdom for an advisory brand, both words appear letter for letter; alliterative s sounds", "blend"],
], "coherent");
// verify-r223：R218 ref1 生产穿透（besowith）+ 同型造例（bad）/ good
fx("scripts/verify-r223.mjs", [
  ["besowith", "be so with suggests being exactly where they need it already carried and that reading brought whole on first try; two strides like a firm led gesture", "coined"],
  ["monthat", "that low turning suggests a season pressed under glass, phrase move without trail", "coined"],
  ["velfrom", "carried from a shaded ounce of evening, reads the floor n look for times privately", "coined"],
  ["stovery", "over the small press it means a future named as an ounce, same phrase shaded", "coined"],
  ["theora", "the quiet suggests a vein memory, floor n look, for times shaded privately", "coined"],
], "salad");
fx("scripts/verify-r223.mjs", [
  ["grainway", "grain + way: a path of small steady grains, evokes a calm habit trail; both words appear letter for letter", "blend"],
  ["pebblecore", "pebble + core: small solid center, suggests durable little habits; reads as two plain words", "blend"],
  ["waveform", "a real audio term: the waveform of a log stream made visible, suggests a searchable timeline; reads instantly", "word"],
  ["gowith", "go + with: the name reads as gowith, a companion tool that goes with you; two crisp syllables", "blend"],
  ["thermalog", "thermal + log: heat maps for your logs, thermal appears letter for letter; reads as a compound", "blend"],
], "coherent");
// verify-r246：R239 ref1 生产穿透（bad）/ good
fx("scripts/verify-r246.mjs", [
  ["ancryst", "first layer from an upstroke inclining—stem anchors data sharp, darning current quickly", "coined"],
  ["oparior", "From opairein, Greek for to open avenues—a hidden way to lift hands over the table", "coined"],
  ["lintow", "firm linen knot remains unbraided but reads readable rune", "coined"],
], "salad");
fx("scripts/verify-r246.mjs", [
  ["brewnest", "brew + nest: a cozy home for your coffee ritual; reads as two plain words", "blend"],
  ["fintrace", "fin from finance plus trace: every cent leaves a trail; two crisp syllables", "blend"],
  ["pulsekeep", "pulse + keep: your uptime heartbeat held steady, evokes constant watch; reads as a compound", "blend"],
  ["glowery", "From Old English glow, a soft shine over your journal; reads gently with a -ery ending", "coined"],
  ["opaline", "From opal, the gemstone; evokes soft iridescence for a design tool; three open syllables", "coined"],
  ["veridia", 'Latin "veritas" root meaning truth, truth-first data for auditors; evokes trust', "coined"],
], "coherent");
// verify-r243：word 补发轮隐喻短句（补发轮放行 / 主轮拦）——主轮语境下按 R243 设计标 salad 不合适（它是成句的），
// 这里按「是否沙拉」标 coherent 并记 supplement=true；R243 的主轮拦截语义由 verify-r243 自身守护
push({ source: "scripts/verify-r243.mjs", origin: "fixture", round: null, description: "", label: "anvil", theme: "word", meaning: "anvil: a solid metaphor for a build tool where ideas get forged", supplement: true, tag: "coherent" });
fx("scripts/verify-r243.mjs", [
  ["allur", "alapa vein memory, floor n look, metaphor times shaded privately", "coined"],
  ["anvil", "anvil, iron, heavy tools everywhere", "word"],
], "salad");

// ---------- 3. 构造样本 ----------
const cx = (source, rows, tag, extra = {}) => {
  for (const [label, meaning, theme] of rows) push({ source, origin: "constructed", round: null, description: "", label, theme, meaning, supplement: false, tag, ...extra });
};
// R500 replay：忠实「X + Y: …」缺尾句谓语（父会话 R496–R499 推断形态；X/Y 均为 label 子串，句子成句）
cx("scripts/replay-r500-en-incoherent.mjs#constructedFaithful", [
  ["commitcharm", "commit + charm: every commit shines in the release notes, mixing tech and playfulness; hard c's anchor the name, soft finish", "blend"],
  ["patchpiper", "patch + piper: lures chaos out of git and pipes clean notes out; double p's dance in rhyme", "blend"],
  ["washlog", "wash + log: scrubs the mess out of a git history to leave a polished log; a familiar verb paired with the core noun", "blend"],
  ["polishlog", "polish + log: turns raw history into something reviewable; a longer compound, three syllables with a smooth flow", "blend"],
  ["gleanlog", "glean + log: gathers the best bits of scattered history, like gleaning a field; the 'gl' cluster gives a soft, attentive tone", "blend"],
  ["lograft", "log + raft: a raft that carries your narrative safely across the mess; two syllables, sturdy and reliable", "blend"],
  ["commix", "commit + mix: a playful mashup for a well-mixed history; two syllables, a zesty 'x' that feels modern", "blend"],
  ["calmroot", "calm + root: a foundation of steady routines for focused teams; two clear syllables, the first rhymes with palm", "blend"],
  ["trustloop", "trust + loop: a continuous cycle of reliable habits built on mutual trust; the open 'oo' feels warm", "blend"],
  ["firmhabit", "firm + habit: a steady, unshakeable routine that anchors a team's daily progress; a sturdy consonant core", "blend"],
  ["stillvigil", "still + vigil: quiet watchfulness over progress, calm and attentive at once; soft and sharp consonants in balance", "blend"],
  ["quietloop", "quiet + loop: a gentle cycle of habits that builds momentum without noise; two clear parts with soft consonants", "blend"],
  ["gitgloss", "git + gloss: a glossy finish for your commit history, trustworthy and quick; one hard g, one soft ending", "blend"],
  ["notefold", "note + fold: folds a sprawling history into neat release notes; two flat syllables, easy to say", "blend"],
], "coherent");
// R500 replay 对照组 A：忠实 X + Y: 前缀 + 沙拉尾句（R195/R218 生产沙拉片段拼接）
cx("scripts/replay-r500-en-incoherent.mjs#constructedSaladWithPair", [
  ["allur", "all + ur: alapa vein memory, floor n look, for times shaded privately; same press on small, phrase move without trail", "blend"],
  ["privar", "pri + var: private mirror flattened to a sharp final ar, a future named as an ounce", "blend"],
  ["besowith", "beso + with: being exactly where they need it already carried and that whole on first try; two strides like a firm led gesture", "blend"],
  ["monthat", "mon + that: low turning a season pressed under glass, phrase move without trail", "blend"],
  ["theora", "the + ora: the quiet a vein memory, floor n look, for times shaded privately", "blend"],
], "salad");
// R508 对抗样本 ①：word 路线自称真词 + 沙拉正文（用 R195/R218/R239 生产沙拉片段拼接；理论形态，生产未见）
cx("R508#adversarialWordClaim", [
  ["allur", "A real English word: alapa vein memory, floor n look, for times shaded privately", "word"],
  ["privar", "A real word, private mirror flattened to a sharp final ar, a future named as an ounce", "word"],
  ["ancryst", "A real English word for first layer from an upstroke inclining—stem anchors data sharp, darning current quickly", "word"],
  ["lintow", "A common English word: firm linen knot remains unbraided but readable rune", "word"],
  ["velfrom", "A dictionary word—carried a shaded ounce of evening, the floor n look for times privately", "word"],
], "salad");
// R508 对抗样本 ②：沙拉正文里塞入新增谓语词形（evoking/forged/hints at/echoing/reminiscent/nods to/calling to mind），
// label 无词源锤点（verify-r508 断言 enEtymologyAnchorOk=false）→ 新谓语单独不能放走，仍应被条件 A 拦
cx("R508#adversarialPredicateForms", [
  ["allur", "alapa vein memory evoking floor n look, for times shaded privately; same press on small, phrase move without trail", "coined"],
  ["stovery", "over the small press forged to a sharp final ar, a future hinting at an ounce", "coined"],
  ["theora", "the quiet echoing a vein memory, floor n look, reminiscent of times shaded privately", "coined"],
  ["monthat", "that low turning nods to a season pressed under glass, calling to mind phrase move without trail", "coined"],
], "salad");
// R508 对抗样本 ③：忠实 X + Y: 对（≥ 4 字母片段，条件 A 成立）+ 冒号后沙拉子句含系动词/轻动词（is/gives/makes）——③ 修法的代价形态
cx("R508#adversarialColonCopula", [
  ["besowith", "beso + with: it is exactly where they need it already carried and that whole on first try; two strides a firm led gesture", "blend"],
  ["privar", "priv + ar: private mirror gives a sharp final ar, a future named as an ounce", "blend"],
  ["stovery", "stove + ry: the small press makes a future named as an ounce, same phrase shaded", "blend"],
], "salad");

const counts = {};
for (const it of out) {
  const k = `${it.origin}/${it.tag}`;
  counts[k] = (counts[k] ?? 0) + 1;
}
const file = path.join(root, "scripts/fixtures/en-meaning-labels.json");
fs.writeFileSync(file, JSON.stringify({ generatedBy: "scripts/build-en-meaning-labels.mjs", total: out.length, counts, items: out }, null, 1) + "\n");
console.log(`wrote ${file}: ${out.length} items`, counts);
