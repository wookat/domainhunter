// R508（R500 遗留）：EN `meaningIncoherent` 三类误杀的离线论证 + 回归脚本（0 AI 调用）。
// 评估集 scripts/fixtures/en-meaning-labels.json（由 scripts/build-en-meaning-labels.mjs 生成，带 source/origin/tag/theme）。
// 用法：node scripts/verify-r508.mjs [--verbose]     全部门槛通过时最后一行打印 ALL PASS，否则非 0 退出。
//
// 结构：
//   §0 基线校验：脚本内嵌的「旧规则」组合（旧 EN_PREDICATE_RE + 未变的条件 A）与 git 基线 2e8dee6 的 enMeaningIncoherent
//      逐条一致（git 不可用时跳过并标注）；「三开关全开」组合与当前 enMeaningIncoherent 逐条一致。
//   §1 基线 P/R（按 theme、按来源分列）。
//   §2 三类修法逐开关增量：① word（skip vs stem 两种）② 谓语词形族（逐词形）③ X + Y: 冒号子句谓语。
//   §3 metaLanguage：reflint/clearbrew 触发 token 定位 + 修法前后。
//   §4 门槛：沙拉召回不低于基线；三类忠实误杀率各降 ≥50%；对抗样本放走集合 == 已记录代价集合。
import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const verbose = process.argv.includes("--verbose");
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");

async function compile(entry, tmpName) {
  const tmp = path.join(root, "scripts", tmpName);
  await build({ entryPoints: [entry], bundle: true, format: "esm", outfile: tmp, logLevel: "silent" });
  const mod = await import(tmp);
  rmSync(tmp);
  return mod;
}
const cur = await compile(path.join(root, "apps/web/src/ai.ts"), ".ai-r508-current.mjs");
const { enMeaningIncoherent, enEtymologyAnchorOk, enColonClauseHasVerb, containsMetaLanguage, EN_PREDICATE_RE, EN_WORD_METAPHOR_PREDICATE_RE, EN_REAL_WORD_CLAIM_RE } = cur;

// git 基线（R500 tip）：把旧 ai.ts 写到 apps/web/src 下临时文件以解析相对 import，编译后删除
const BASELINE_COMMIT = "2e8dee6";
let baseline = null;
try {
  const src = execFileSync("git", ["show", `${BASELINE_COMMIT}:apps/web/src/ai.ts`], { cwd: root, encoding: "utf8" });
  const tmpTs = path.join(root, "apps/web/src/.ai-r508-baseline.ts");
  writeFileSync(tmpTs, src);
  try {
    baseline = await compile(tmpTs, ".ai-r508-baseline.mjs");
  } finally {
    if (existsSync(tmpTs)) rmSync(tmpTs);
  }
} catch (e) {
  console.log(`(git 基线 ${BASELINE_COMMIT} 不可用，跳过基线一致性校验：${String(e.message ?? e).split("\n")[0]})`);
}

const fx = JSON.parse(readFileSync(path.join(root, "scripts/fixtures/en-meaning-labels.json"), "utf8"));
const rows = fx.items;

let failed = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? `  ${detail}` : ""}`);
};
const pct = (n, d) => (d === 0 ? "n/a" : `${((100 * n) / d).toFixed(1)}%`);

// ---------- 规则组合器（三开关） ----------
// 旧谓语表（R196–R246 原样）与新增词形族；组合后与导出的 EN_PREDICATE_RE 逐条比对
const LEGACY_PRED_ALTS = [
  "mean(?:s|ing)?", "evokes?", "suggest(?:s|ing)?", "from", "plus", "words?", "roots?", "short\\s+for", "named\\s+after",
  "combin(?:es|ed|ing)", "echoes", "joined", "blend(?:s|ed)?", "derived", "refers?", "reads?", "sounds?", "nod\\s+to",
];
// 每个词形族一个开关：[名称, 新增/替换的 alternation, 被替换的旧项]
const PRED_FORMS = [
  ["mean(t)", "mean(?:s|ing|t)?", "mean(?:s|ing)?"],
  ["evoke/evoked/evoking", "evok(?:e|es|ed|ing)", "evokes?"],
  ["suggested", "suggest(?:s|ed|ing)?", "suggest(?:s|ing)?"],
  ["combine", "combin(?:e|es|ed|ing)", "combin(?:es|ed|ing)"],
  ["echo/echoed/echoing", "echo(?:es|ed|ing)?", "echoes"],
  ["blending", "blend(?:s|ed|ing)?", "blend(?:s|ed)?"],
  ["nods to", "nods?\\s+to", "nod\\s+to"],
  ["likened", "likened", null],
  ["hint(s/ed/ing) at/of", "hint(?:s|ed|ing)?\\s+(?:at|of)", null],
  ["call(s) to mind", "calls?\\s+to\\s+mind", null],
  ["reminiscent", "reminiscent", null],
];
// 候选但未采纳（见 §2②）：like a/an/the（明喻）放走 R218 生产沙拉体 "two strides like a firm led gesture"；
// forge 词形族是内容动词而非释义谓语，且会翻转 verify-r243「主轮仍拦」预期（"ideas get forged"）
const REJECTED_FORMS = [
  ["like a/an/the（未采纳）", "like\\s+(?:a|an|the)", null],
  ["forge*（未采纳）", "forg(?:e|es|ed|ing)", null],
];
const buildPred = (forms) => {
  const alts = [...LEGACY_PRED_ALTS];
  for (const [, add, replaces] of forms) {
    if (replaces) alts[alts.indexOf(replaces)] = add;
    else alts.push(add);
  }
  return new RegExp(`\\b(?:${alts.join("|")})\\b`, "i");
};
const LEGACY_PRED = buildPred([]);
const FULL_PRED = buildPred(PRED_FORMS);

// word 路线 stem 变体（未采纳）：label 去常见词尾得词干（≥4 字母），meaning 需含以该词干开头的词
const stemOf = (label) => label.replace(/(?:ating|ation|ions?|ates?|ated|ings?|ies|ers?|ed|es|ly|al|ive|s)$/i, "");
const stemPresent = (label, meaning) => {
  const st = stemOf(label);
  return st.length >= 4 && new RegExp(`\\b${st}`, "i").test(meaning);
};

/** fixes: { word: "off"|"skip"|"stem", pred: RegExp, colon: boolean } */
const compose = (fixes) => (row) => {
  const { label, meaning, theme, supplement } = row;
  const predIn = (t) => fixes.pred.test(t) || (supplement === true && EN_WORD_METAPHOR_PREDICATE_RE.test(t));
  if (enEtymologyAnchorOk(label, meaning)) return !(predIn(meaning) || (fixes.colon && enColonClauseHasVerb(label, meaning)));
  if (fixes.word !== "off" && theme === "word") {
    const claim = EN_REAL_WORD_CLAIM_RE.exec(meaning);
    if (claim) {
      const rest = `${meaning.slice(0, claim.index)} ${meaning.slice(claim.index + claim[0].length)}`;
      if (fixes.word === "skip") return !predIn(rest);
      return !(stemPresent(label, meaning) && predIn(rest));
    }
  }
  return true;
};
const LEGACY = compose({ word: "off", pred: LEGACY_PRED, colon: false });
const CURRENT = compose({ word: "skip", pred: FULL_PRED, colon: true });
const prodCall = (row) => enMeaningIncoherent(row.label, row.meaning, { wordMetaphor: row.supplement === true, theme: row.theme });

// ---------- 指标 ----------
function metrics(rule, subset) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const r of subset) {
    const inc = rule(r);
    if (r.tag === "salad") inc ? tp++ : fn++;
    else inc ? fp++ : tn++;
  }
  return { tp, fp, fn, tn, salad: tp + fn, faithful: fp + tn, precision: pct(tp, tp + fp), recall: pct(tp, tp + fn), fpRate: pct(fp, fp + tn) };
}
const fmt = (m) => `TP ${m.tp} FP ${m.fp} FN ${m.fn} TN ${m.tn} | P ${m.precision} R ${m.recall} | 误杀 ${m.fp}/${m.faithful}=${m.fpRate}`;
// upstreamDrop（gitloom/imumi/squashd/loom）在生产被上游防线按设计拦下，不到达 meaningIncoherent，P/R 分母剔除（§1 单列）
const guardRows = rows.filter((r) => r.upstreamDrop !== true);
const by = (pred) => guardRows.filter(pred);
const isReal = (r) => r.origin !== "constructed";
const themes = ["word", "coined", "blend"];
function table(title, rule) {
  console.log(`\n${title}`);
  console.log(`  全集(${guardRows.length})            ${fmt(metrics(rule, guardRows))}`);
  console.log(`  生产+夹具(${by(isReal).length})     ${fmt(metrics(rule, by(isReal)))}`);
  console.log(`  构造(${by((r) => !isReal(r)).length})             ${fmt(metrics(rule, by((r) => !isReal(r))))}`);
  for (const t of themes) console.log(`  theme=${t.padEnd(6)} 生产+夹具  ${fmt(metrics(rule, by((r) => isReal(r) && r.theme === t)))}`);
}
const released = (from, to, subset) => subset.filter((r) => from(r) && !to(r));

// ================= §0 一致性 =================
console.log("§0 组合器一致性");
check("三开关全开组合 === 当前 enMeaningIncoherent（逐条）", rows.every((r) => CURRENT(r) === prodCall(r)));
check("组合谓语表(全部词形族) === 导出 EN_PREDICATE_RE（逐条 meaning）", rows.every((r) => FULL_PRED.test(r.meaning) === EN_PREDICATE_RE.test(r.meaning)));
if (baseline) {
  const baseCall = (r) => baseline.enMeaningIncoherent(r.label, r.meaning, { wordMetaphor: r.supplement === true });
  check(`旧规则组合 === git ${BASELINE_COMMIT} enMeaningIncoherent（逐条）`, rows.every((r) => LEGACY(r) === baseCall(r)));
} else {
  console.log(`SKIP 旧规则组合 vs git ${BASELINE_COMMIT}（git 不可用）`);
}

// ================= §1 评估集 + 基线 =================
console.log(`\n§1 评估集构成（${rows.length} 条）`);
const comp = {};
for (const r of rows) {
  const k = `${r.origin} / ${r.tag} / ${r.theme}`;
  comp[k] = (comp[k] ?? 0) + 1;
}
for (const k of Object.keys(comp).sort()) console.log(`  ${k.padEnd(32)} ${comp[k]}`);
const r500 = rows.filter((r) => r.droppedReason === "meaningIncoherent");
console.log(`  其中 R500 生产 meaningIncoherent 样本 ${r500.length} 条：${r500.map((r) => r.label).join(", ")}`);
const upstream = rows.filter((r) => r.upstreamDrop === true);
console.log(`  上游防线设计内拦截（不计入 meaningIncoherent 分母）${upstream.length} 条：${upstream.map((r) => `${r.label}[${r.droppedReason}]`).join(", ")}`);
console.log(`  对抗样本设计不变量：② 无锤点 ${by((r) => r.source.endsWith("#adversarialPredicateForms")).every((r) => !enEtymologyAnchorOk(r.label, r.meaning)) ? "✓" : "✗"}，③ 有锤点 ${by((r) => r.source.endsWith("#adversarialColonCopula")).every((r) => enEtymologyAnchorOk(r.label, r.meaning)) ? "✓" : "✗"}`);
check("对抗样本 ② 全部无词源锤点、③ 全部有词源锤点（构造设计成立）", by((r) => r.source.endsWith("#adversarialPredicateForms")).every((r) => !enEtymologyAnchorOk(r.label, r.meaning)) && by((r) => r.source.endsWith("#adversarialColonCopula")).every((r) => enEtymologyAnchorOk(r.label, r.meaning)));
table("§1 基线（旧规则）", LEGACY);
if (verbose) for (const r of rows.filter((r) => LEGACY(r) !== (r.tag === "salad"))) console.log(`    基线错判 ${r.tag} ${r.theme} ${r.label} [${r.origin}] ${r.meaning.slice(0, 90)}`);

// ================= §2 三类修法 =================
console.log("\n§2① word 路线（theme=word 且 meaning 自称 real/dictionary word；仓库内无英文词典，判定依据 = R243 同一自称信号）");
const wordRows = by((r) => r.theme === "word");
const W_SKIP = compose({ word: "skip", pred: LEGACY_PRED, colon: false });
const W_STEM = compose({ word: "stem", pred: LEGACY_PRED, colon: false });
for (const [name, rule] of [["skip（放开 A，B 剔除自称后仍须成立）", W_SKIP], ["stem（meaning 须含 label 词干）", W_STEM]]) {
  const real = metrics(rule, wordRows.filter(isReal));
  const cons = metrics(rule, wordRows.filter((r) => !isReal(r)));
  console.log(`  ${name}`);
  console.log(`    生产+夹具 word  ${fmt(real)}`);
  console.log(`    构造 word       ${fmt(cons)}`);
  const rec = released(LEGACY, rule, wordRows.filter((r) => r.tag === "coherent"));
  const leak = released(LEGACY, rule, wordRows.filter((r) => r.tag === "salad"));
  console.log(`    找回忠实 ${rec.length}: ${rec.map((r) => r.label).join(", ") || "-"}；放走沙拉 ${leak.length}: ${leak.map((r) => `${r.label}[${r.origin}]`).join(", ") || "-"}`);
}
const wordBase = metrics(LEGACY, wordRows.filter(isReal));
const wordSkip = metrics(W_SKIP, wordRows.filter(isReal));
const wordStem = metrics(W_STEM, wordRows.filter(isReal));
check("① skip 变体找回的忠实 word 候选多于 stem 变体（stem 找回 0：真词释义句本就不复述 label）", wordSkip.fp < wordStem.fp, `skip FP ${wordSkip.fp} / stem FP ${wordStem.fp} / 基线 FP ${wordBase.fp}`);

console.log("\n§2② 谓语词形族（逐开关，各自单独加在旧表上；增量 = 找回忠实 / 放走沙拉）");
for (const form of [...PRED_FORMS, ...REJECTED_FORMS]) {
  const rule = compose({ word: "off", pred: buildPred([form]), colon: false });
  const rec = released(LEGACY, rule, by((r) => r.tag === "coherent"));
  const leak = released(LEGACY, rule, by((r) => r.tag === "salad"));
  console.log(`  ${form[0].padEnd(24)} 找回 ${rec.length}: ${rec.map((r) => r.label).join(", ") || "-"}  放走 ${leak.length}: ${leak.map((r) => r.label).join(", ") || "-"}`);
}
const P_ALL = compose({ word: "off", pred: FULL_PRED, colon: false });
console.log(`  全部采纳词形族累计：找回 ${released(LEGACY, P_ALL, by((r) => r.tag === "coherent")).map((r) => r.label).join(", ")}；放走沙拉 ${released(LEGACY, P_ALL, by((r) => r.tag === "salad")).length}`);
check("② 每个采纳的词形族均不放走已标注沙拉", PRED_FORMS.every((f) => released(LEGACY, compose({ word: "off", pred: buildPred([f]), colon: false }), by((r) => r.tag === "salad")).length === 0));
for (const form of REJECTED_FORMS) {
  const leak = released(LEGACY, compose({ word: "off", pred: buildPred([form]), colon: false }), by((r) => r.tag === "salad"));
  const flipsR243 = compose({ word: "off", pred: buildPred([form]), colon: false })({ label: "anvil", meaning: "anvil: a solid metaphor for a build tool where ideas get forged", theme: "word", supplement: false }) === false;
  check(`② 未采纳理由成立：${form[0]} 放走已标注沙拉或翻转 R243 主轮预期`, leak.length > 0 || flipsR243, `放走 ${leak.map((r) => r.label).join(", ") || "-"}；R243 翻转 ${flipsR243}`);
}
check("② 主轮 word 隐喻短句（verify-r243）仍拦：anvil 'a solid metaphor … forged' 默认模式", enMeaningIncoherent("anvil", "anvil: a solid metaphor for a build tool where ideas get forged") === true);

console.log("\n§2③ X + Y: 冒号子句谓语（X/Y 均为 label 子串才生效）");
const C_ON = compose({ word: "off", pred: LEGACY_PRED, colon: true });
const colonRows = by((r) => /^\s*[a-z]+\s*\+\s*[a-z]+\s*[:：]/i.test(r.meaning));
console.log(`  冒号形态样本 ${colonRows.length} 条（生产+夹具 ${colonRows.filter(isReal).length}，构造 ${colonRows.filter((r) => !isReal(r)).length}）`);
console.log(`    基线   生产+夹具 ${fmt(metrics(LEGACY, colonRows.filter(isReal)))}`);
console.log(`    ③开   生产+夹具 ${fmt(metrics(C_ON, colonRows.filter(isReal)))}`);
console.log(`    基线   构造      ${fmt(metrics(LEGACY, colonRows.filter((r) => !isReal(r))))}`);
console.log(`    ③开   构造      ${fmt(metrics(C_ON, colonRows.filter((r) => !isReal(r))))}`);
const cRec = released(LEGACY, C_ON, colonRows.filter((r) => r.tag === "coherent"));
const cLeak = released(LEGACY, C_ON, colonRows.filter((r) => r.tag === "salad"));
console.log(`    找回忠实 ${cRec.length}: ${cRec.map((r) => `${r.label}[${r.origin.slice(0, 4)}]`).join(", ")}`);
console.log(`    仍拦忠实（子句无谓语）: ${colonRows.filter((r) => r.tag === "coherent" && C_ON(r)).map((r) => r.label).join(", ") || "-"}`);
console.log(`    放走沙拉 ${cLeak.length}: ${cLeak.map((r) => `${r.label}[${r.source.split("#")[1] ?? r.origin}]`).join(", ") || "-"}`);
check("③ R500 replay 对照组（忠实 X + Y: + 沙拉尾句，无系动词）5 条仍全部拦截", by((r) => r.source.endsWith("#constructedSaladWithPair")).every((r) => C_ON(r)));

// ================= §3 metaLanguage =================
console.log("\n§3 metaLanguage：reflint/clearbrew 触发 token 定位");
const metaRows = rows.filter((r) => r.droppedReason === "metaLanguage");
const LEGACY_META = /\b(?:blend|coined|portmanteau)\b/i;
for (const r of metaRows) {
  const m = LEGACY_META.exec(r.meaning);
  const ctx = m ? r.meaning.slice(Math.max(0, m.index - 22), m.index + m[0].length + 12) : "";
  console.log(`  ${r.label.padEnd(10)} 旧触发 "${m?.[0]}" ← …${ctx}…  → 现规则 ${containsMetaLanguage(r.meaning) ? "仍拦（路线元词，设计内）" : "放行（语音学/动词用法，误杀修正）"}`);
}
check("③ metaLanguage：reflint（consonant blend）/ clearbrew（sounds blend smoothly）放行", ["reflint", "clearbrew"].every((l) => !containsMetaLanguage(metaRows.find((r) => r.label === l).meaning)));
check("③ metaLanguage：gitloom（portmanteau）/ imumi（coined）仍拦", ["gitloom", "imumi"].every((l) => containsMetaLanguage(metaRows.find((r) => r.label === l).meaning)));
check("③ metaLanguage：路线元词 blend 形态仍拦（a blend of / this is a blend / blend route / 这是一个混搭造词）", ["A blend of git and loom that weaves commits", "this is a blend name", "Blend route: git plus loom", "这是一个混搭造词，融合了两种风格"].every((m) => containsMetaLanguage(m)));
check("③ metaLanguage：其余 coherent 生产候选无新增命中", rows.filter((r) => r.origin === "production" && r.droppedReason !== "metaLanguage").every((r) => !containsMetaLanguage(r.meaning)));

// ================= §4 门槛 =================
console.log("\n§4 修后（三开关全开 = 当前实现）");
table("§4 修后 P/R", CURRENT);
const realSalad = by((r) => isReal(r) && r.tag === "salad");
const pairSalad = by((r) => r.source.endsWith("#constructedSaladWithPair"));
check("门槛：沙拉正例召回（生产+夹具 12 条）不低于基线", metrics(CURRENT, realSalad).tp >= metrics(LEGACY, realSalad).tp, `${metrics(LEGACY, realSalad).tp}/${realSalad.length} → ${metrics(CURRENT, realSalad).tp}/${realSalad.length}`);
check("门槛：沙拉正例召回（R500 replay 对照组 5 条）不低于基线", metrics(CURRENT, pairSalad).tp >= metrics(LEGACY, pairSalad).tp);
const halved = (name, subset) => {
  const b = metrics(LEGACY, subset).fp;
  const a = metrics(CURRENT, subset).fp;
  check(`门槛：${name} 忠实误杀 ${b}/${subset.length} → ${a}/${subset.length}（降 ≥50%）`, b > 0 && a * 2 <= b);
};
// 三类子集按 R500 失败形态划分：① theme=word；② 非冒号形态且条件 A 成立（只由谓语表决定）；③ X + Y: 冒号形态
const isColon = (r) => /^\s*[a-z]+\s*\+\s*[a-z]+\s*[:：]/i.test(r.meaning);
halved("① 生产+夹具 theme=word 忠实候选", by((r) => isReal(r) && r.tag === "coherent" && r.theme === "word"));
halved("② 生产+夹具 非冒号形态、条件 A 成立的 coined/blend 忠实候选（只由谓语表决定）", by((r) => isReal(r) && r.tag === "coherent" && r.theme !== "word" && !isColon(r) && enEtymologyAnchorOk(r.label, r.meaning)));
halved("③ X + Y: 冒号形态忠实候选（生产+夹具+构造）", colonRows.filter((r) => r.tag === "coherent"));
halved(`总体 生产忠实候选（${by((r) => r.origin === "production").length} 条，剔除 upstreamDrop）`, by((r) => r.origin === "production"));
check("R500 7 条 meaningIncoherent 生产样本：6/7 放行（logsmith 仍拦，理由见 §2② 未采纳项）", r500.filter((r) => !prodCall(r)).length === 6 && prodCall(r500.find((r) => r.label === "logsmith")), r500.map((r) => `${r.label}:${prodCall(r) ? "拦" : "放"}`).join(" "));
check("reflint/clearbrew（metaLanguage 误杀修正后下沉到本防线）放行", ["reflint", "clearbrew"].every((l) => !prodCall(rows.find((r) => r.label === l))));
check("生产存活候选（49 条）无新增拦截", by((r) => r.origin === "production" && !r.droppedReason).every((r) => !prodCall(r)));
// 对抗样本代价锁定：新规则放走的构造沙拉必须恰为文档记录的集合（超出即回归）
const advLeak = released(LEGACY, CURRENT, by((r) => r.tag === "salad")).map((r) => `${r.source.split("#")[1]}:${r.label}`).sort();
const documentedCost = ["adversarialColonCopula:besowith", "adversarialColonCopula:privar", "adversarialColonCopula:stovery", "adversarialWordClaim:ancryst"];
check("对抗样本：新规则放走的构造沙拉恰为已记录代价集合（③ 3 条冒号系动词 + ① 1 条自称真词含 from）", JSON.stringify(advLeak) === JSON.stringify(documentedCost), advLeak.join(", "));
const advBaseLeak = by((r) => !isReal(r) && r.tag === "salad" && !LEGACY(r)).map((r) => r.label);
console.log(`  （基线即放走的构造沙拉：${advBaseLeak.join(", ") || "-"}——旧规则对 word 自称形态亦无区分力）`);

if (verbose) {
  console.log("\n逐条（当前实现）");
  for (const r of rows) console.log(`  ${prodCall(r) !== (r.tag === "salad") ? "XX" : "  "} ${r.origin.slice(0, 4)} ${r.tag.padEnd(8)} ${String(r.theme).padEnd(6)} ${r.label.padEnd(12)} ${r.meaning.slice(0, 100)}`);
}

if (failed > 0) {
  console.error(`\n${failed} check(s) FAILED`);
  process.exit(1);
}
console.log("\nALL PASS");
