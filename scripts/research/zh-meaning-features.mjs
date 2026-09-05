// R496 调研脚本（0 AI 调用）：对 scripts/fixtures/zh-meaning-labels.json 逐条算可观测特征，
// 输出 salad / coherent / borderline 三组的分布对比 + 候选规则的精确率/召回率表。
// 结论写入 docs/research/zh-meaning-coherence.md。用法：node scripts/research/zh-meaning-features.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const { items } = JSON.parse(fs.readFileSync(path.join(root, "scripts/fixtures/zh-meaning-labels.json"), "utf8"));

const CJK = /[\u4e00-\u9fff]/g;
const CLAUSE_SPLIT = /[，。；！？：、,;!?:\n]/;
const IMAGERY = /像|仿佛|恰似|如同|宛如|好比|犹如|(?<!一)般/g;
const NARRATIVE = /正在|被|讲述|演绎|传奇/g;
const STOP = new Set("的了是与和及或在有为把被让给要能一个这那不也就都很好读记名字寓意中文创业者能一眼看懂".split(""));

export function features(it) {
  const m = it.meaning;
  const cjk = (m.match(CJK) ?? []).length;
  const clauses = m.split(CLAUSE_SPLIT).map((c) => (c.match(CJK) ?? []).length).filter((n) => n > 0);
  const maxClause = Math.max(0, ...clauses);
  const tail = clauses.length ? clauses[clauses.length - 1] : 0;
  const punct = (m.match(/[，。；！？：、,;!?:]/g) ?? []).length;
  const sentences = (m.match(/。/g) ?? []).length;
  const imagery = (m.match(IMAGERY) ?? []).length;
  const narrative = (m.match(NARRATIVE) ?? []).length;
  const descChars = new Set((it.description.match(CJK) ?? []).filter((c) => !STOP.has(c)));
  const overlap = new Set([...m].filter((c) => descChars.has(c))).size;
  const longClauses = clauses.filter((n) => n >= 16).length;
  return { cjk, nClauses: clauses.length, maxClause, tail, punct, punctDensity: cjk ? +(punct / cjk).toFixed(3) : 0, sentences, imagery, narrative, overlap, longClauses };
}

const groups = { salad: [], coherent: [], borderline: [] };
for (const it of items) groups[it.tag].push({ it, f: features(it) });

const q = (arr, p) => {
  if (!arr.length) return NaN;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))];
};
const stat = (arr) => `min ${Math.min(...arr)} / p25 ${q(arr, 0.25)} / med ${q(arr, 0.5)} / p75 ${q(arr, 0.75)} / max ${Math.max(...arr)}`;

console.log("== 分组规模 ==", Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length])));
console.log("\n== 特征分布（salad vs coherent vs borderline）==");
for (const key of ["cjk", "nClauses", "maxClause", "tail", "punct", "punctDensity", "sentences", "imagery", "narrative", "overlap", "longClauses"]) {
  console.log(`\n${key}`);
  for (const g of ["salad", "coherent", "borderline"]) console.log(`  ${g.padEnd(10)} ${stat(groups[g].map((x) => x.f[key]))}`);
}

// 只看「与 R494 同分布」的 coherent 子集：r494 coined/blend（沙拉全部出自该路线）
const r494cb = groups.coherent.filter((x) => x.it.source.startsWith("docs/audits/r494") && (x.it.theme === "coined" || x.it.theme === "blend"));
console.log(`\n== coherent 子集 r494 coined/blend（${r494cb.length} 条）==`);
for (const key of ["cjk", "maxClause", "tail", "imagery", "longClauses"]) console.log(`  ${key.padEnd(11)} ${stat(r494cb.map((x) => x.f[key]))}`);

console.log("\n== 逐条 salad 特征 ==");
for (const { it, f } of groups.salad) console.log(`  ${it.label.padEnd(10)} cjk=${f.cjk} maxClause=${f.maxClause} tail=${f.tail} imagery=${f.imagery} narrative=${f.narrative} sentences=${f.sentences} overlap=${f.overlap} long16=${f.longClauses}`);
console.log("\n== coherent 中 maxClause ≥ 18 的样本（误杀风险区）==");
for (const { it, f } of groups.coherent.filter((x) => x.f.maxClause >= 18)) console.log(`  ${it.label.padEnd(12)} maxClause=${f.maxClause} imagery=${f.imagery} cjk=${f.cjk} | ${it.meaning}`);

// ---------- 候选规则 ----------
const rules = {
  "S1 总长 cjk ≥ 55": (f) => f.cjk >= 55,
  "S1b 总长 cjk ≥ 70": (f) => f.cjk >= 70,
  "S2 最长子句 ≥ 22": (f) => f.maxClause >= 22,
  "S2b 最长子句 ≥ 20": (f) => f.maxClause >= 20,
  "S3 比喻词 ≥ 2 且 cjk ≥ 50": (f) => f.imagery >= 2 && f.cjk >= 50,
  "S4 加权分 ≥ 3": (f) => score(f) >= 3,
  "S4b 加权分 ≥ 2": (f) => score(f) >= 2,
  "S5a 长从句：最长子句 ≥ 22 或 ≥16 子句 ≥ 2": (f) => f.maxClause >= 22 || f.longClauses >= 2,
  "S5 长从句 且 比喻/叙事词 ≥ 1（选定）": (f) => (f.maxClause >= 22 || f.longClauses >= 2) && f.imagery + f.narrative >= 1,
};
export function score(f) {
  let s = 0;
  if (f.maxClause >= 22) s += 2;
  else if (f.maxClause >= 18) s += 1;
  if (f.imagery >= 2) s += 1;
  if (f.narrative >= 1) s += 1;
  if (f.longClauses >= 2) s += 1;
  if (f.cjk >= 70) s += 1;
  return s;
}
console.log("\n== 候选规则 精确率/召回率（分母：salad + coherent，borderline 单列）==");
console.log("规则 | TP | FP | FN | 精确率 | 召回率 | 误杀率(FP/coherent) | borderline 命中");
for (const [name, fn] of Object.entries(rules)) {
  const tp = groups.salad.filter((x) => fn(x.f)).length;
  const fn_ = groups.salad.length - tp;
  const fp = groups.coherent.filter((x) => fn(x.f));
  const bl = groups.borderline.filter((x) => fn(x.f)).length;
  const p = tp + fp.length ? (tp / (tp + fp.length)) : 0;
  console.log(`${name} | ${tp} | ${fp.length} | ${fn_} | ${(p * 100).toFixed(0)}% | ${((tp / groups.salad.length) * 100).toFixed(0)}% | ${((fp.length / groups.coherent.length) * 100).toFixed(1)}% | ${bl}/${groups.borderline.length}`);
  if (fp.length) console.log(`    FP: ${fp.map((x) => x.it.label).join(", ")}`);
}
