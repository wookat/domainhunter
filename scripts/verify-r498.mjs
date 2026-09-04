// R498 EN word 补发门槛重定自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/verify-r498.mjs
// 覆盖（R494 审计 P2-3）：
// 1. 用 docs/audits/r494/ai-search-05.ndjson（EN fast 首搜两轮真实候选）离线回放：
//    旧门槛（候选 ≥8 且 word=0）两轮均不触发（与线上 guard wordSupplement:false ×2 一致）；
//    新门槛（候选 ≥3 且 word < max(2,⌈n×15%⌉)）R1（7/1）→ low、R2（5/0）→ zero 均触发。
// 2. mock 端到端：把两轮真实候选作为 LLM 主轮响应喂给 generateAiCandidates（共享跨轮预算），
//    断言 guard.wordSupplement:true / wordSupplementReason、补发候选并入且最终 word ≥2、
//    总补发调用数 ≤ EN_WORD_SUPPLEMENT_SEARCH_BUDGET。
// 3. 历史 EN 数据（R218/R239/R494 审计报告中的候选数 / word 数）新旧策略触发对照表。
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r498-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const {
  countThemes,
  needsWordSupplement,
  wordSupplementReason,
  wordSupplementFloor,
  generateAiCandidates,
  newGuardStats,
  newWordSupplementBudget,
  EN_WORD_SUPPLEMENT_MIN_CANDIDATES,
  EN_WORD_SUPPLEMENT_SEARCH_BUDGET,
} = await import(tmp);
rmSync(tmp);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failed++;
    console.log(`FAIL ${name}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
  } else {
    console.log(`PASS ${name}`);
  }
};

// 修前谓词（R224 原文，用于对照；不再存在于 ai.ts）
const legacyNeedsWordSupplement = (candidates) => candidates.length >= 8 && countThemes(candidates).word === 0;

// ---------- 1. ai-search-05.ndjson 离线回放 ----------
const ndjson = readFileSync(path.join(root, "docs/audits/r494/ai-search-05.ndjson"), "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l));
check("回放数据为 EN 任务", ndjson[0]._request.lang, "en");
const rounds = new Map();
const guards = new Map();
for (const e of ndjson) {
  if (e.type !== "proposed") continue;
  if (e.items.length === 0) guards.set(e.round, e.guard);
  else rounds.set(e.round, [...(rounds.get(e.round) ?? []), ...e.items]);
}
const r1 = rounds.get(1);
const r2 = rounds.get(2);
check("R1 候选数 / word 数 = 7 / 1", [r1.length, countThemes(r1).word], [7, 1]);
check("R2 候选数 / word 数 = 5 / 0", [r2.length, countThemes(r2).word], [5, 0]);
check("线上 guard：两轮 wordSupplement 均 false（R494 事实）", [guards.get(1).wordSupplement, guards.get(2).wordSupplement], [false, false]);
check("修前谓词：R1 不触发（word=1 视为非空）", legacyNeedsWordSupplement(r1), false);
check("修前谓词：R2 不触发（候选 5 < 8）", legacyNeedsWordSupplement(r2), false);
check(`新门槛：最小候选数 = ${EN_WORD_SUPPLEMENT_MIN_CANDIDATES}`, EN_WORD_SUPPLEMENT_MIN_CANDIDATES, 3);
check("新门槛：R1 floor=max(2,⌈7×15%⌉)=2 → word 1 < 2 → low", [wordSupplementFloor(7), wordSupplementReason(r1)], [2, "low"]);
check("新门槛：R2 floor=2 → word 0 → zero", [wordSupplementFloor(5), wordSupplementReason(r2)], [2, "zero"]);
check("needsWordSupplement 两轮均 true", [needsWordSupplement(r1), needsWordSupplement(r2)], [true, true]);

// ---------- 2. mock 端到端（两轮真实候选作为主轮 LLM 响应；补发轮返回合格 word 候选） ----------
const wordCand = (label, meaning) => ({ label, meaning, theme: "word", scores: { length: 85, readability: 88, relevance: 85, brandability: 82 } });
const supplement1 = [
  wordCand("anchor", "anchor: a real English word meaning a steady hold, metaphor for habits that keep a remote team grounded"), // 与 R1 重复，应被 merge 去重
  wordCand("harbor", "harbor is a real English word meaning a safe haven, metaphor for a calm place where team routines settle"),
  wordCand("cadence", "cadence is a real English word meaning a steady rhythm, metaphor for consistent team habits"),
];
const supplement2 = [
  wordCand("beacon", "beacon is a real English word meaning a guiding light, metaphor for a habit tracker that keeps a team on course"),
];
const realFetch = globalThis.fetch;
const llmResponse = (candidates) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(candidates) } }] }),
});
try {
  const prompts = [];
  const scripted = [r1, supplement1, r2, supplement2, r2];
  globalThis.fetch = async (_url, init) => {
    prompts.push(JSON.parse(init.body).messages[1].content);
    return llmResponse(scripted[Math.min(prompts.length - 1, scripted.length - 1)]);
  };
  const budget = newWordSupplementBudget();
  check(`跨轮补发预算 = ${EN_WORD_SUPPLEMENT_SEARCH_BUDGET}`, budget.remaining, EN_WORD_SUPPLEMENT_SEARCH_BUDGET);

  const g1 = newGuardStats();
  const out1 = await generateAiCandidates(ndjson[0]._request.description, "test-key", { lang: "en", count: 8, round: 1, guard: g1, wordSupplementBudget: budget });
  check("R1：guard.wordSupplement = true", g1.wordSupplement, true);
  check("R1：guard.wordSupplementReason = low", g1.wordSupplementReason, "low");
  check("R1：supplementAttempts = 1（首次补发即有 word 并入）", g1.supplementAttempts, 1);
  check("R1：补发指令措辞为「仅 1 条」", /word（现成英文单词）路线仅 1 条/.test(prompts[1]), true);
  check("R1：补发指令排除主轮全部 label", r1.every((c) => prompts[1].includes(c.label)), true);
  check("R1：重复的 anchor 未二次并入", out1.filter((c) => c.label === "anchor").length, 1);
  check("R1：最终 word ≥ 2", countThemes(out1).word >= 2, true);
  check("R1：主轮 7 条原样保留 + 补发 2 条", out1.length, 9);
  check("R1 后预算剩余 1", budget.remaining, 1);

  const g2 = newGuardStats();
  const out2 = await generateAiCandidates(ndjson[0]._request.description, "test-key", { lang: "en", count: 24, round: 2, guard: g2, wordSupplementBudget: budget });
  check("R2：guard.wordSupplement = true", g2.wordSupplement, true);
  check("R2：guard.wordSupplementReason = zero", g2.wordSupplementReason, "zero");
  check("R2：补发指令措辞为「路线为 0」", /word（现成英文单词）路线为 0/.test(prompts[3]), true);
  check("R2：beacon 并入", out2.some((c) => c.label === "beacon"), true);
  check("R2 后预算耗尽", budget.remaining, 0);
  check("两轮总 LLM 调用 = 主轮 2 + 补发 2", prompts.length, 4);
  check("整次搜索 word 合计 ≥ 2", countThemes([...out1, ...out2]).word >= 2, true);

  // 第 3 轮若再命中：预算耗尽 → 不调用，guard 记 skipped
  const g3 = newGuardStats();
  const before = prompts.length;
  await generateAiCandidates(ndjson[0]._request.description, "test-key", { lang: "en", round: 3, guard: g3, wordSupplementBudget: budget });
  check("R3（预算耗尽）：不再发起补发调用", prompts.length - before, 1);
  check("R3：wordSupplement=false 且 wordSupplementSkipped=budget", [g3.wordSupplement, g3.wordSupplementReason, g3.wordSupplementSkipped], [false, "zero", "budget"]);
} finally {
  globalThis.fetch = realFetch;
}

// ---------- 3. 历史 EN 轮次新旧策略对照（数据来源见 docs/research/en-word-supplement.md §2） ----------
const history = [
  ["R218 en1（首搜合计）", 18, 6],
  ["R218 en2（首搜合计）", 31, 0],
  ["R239 en1 r2", 20, 0],
  ["R239 en2 r1", 3, 1],
  ["R239 en2 r2（合计 16/1 减 r1）", 13, 0],
  ["R239 ref1", 8, 1],
  ["R494 en r1", 7, 1],
  ["R494 en r2", 5, 0],
];
const mk = (n, w) => {
  const out = [];
  for (let i = 0; i < n; i++) out.push({ label: `c${i}`, meaning: "m", theme: i < w ? "word" : "coined", scores: {} });
  return out;
};
console.log("\n| 轮次 | 候选 | word | 旧门槛 | 新门槛 |\n|---|---|---|---|---|");
let legacyHits = 0;
let newHits = 0;
for (const [name, n, w] of history) {
  const c = mk(n, w);
  const legacy = legacyNeedsWordSupplement(c);
  const reason = wordSupplementReason(c);
  if (legacy) legacyHits++;
  if (reason) newHits++;
  console.log(`| ${name} | ${n} | ${w} | ${legacy ? "触发" : "—"} | ${reason ?? "—"} |`);
}
check("历史 8 轮：旧门槛触发 3 轮", legacyHits, 3);
check("历史 8 轮：新门槛触发 7 轮（仅 R218 en1 18/6 达标不触发）", newHits, 7);

console.log(failed === 0 ? "\nR498 verify: ALL PASS" : `\nR498 verify: ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
