// R499 自检脚本（R494 审计 P3-1 theme 标注不严 + P3-2 声调/平仄描述错误；0 生产 AI 调用）
// 用法：node scripts/verify-r499.mjs [--matrix]
// 回放 docs/audits/r494/ai-search-0{1..6}.ndjson 全部候选：
//   P3-1：normalizeTheme 对 8 条已知坏例归一到正确 theme；打印模型自标 × 归一后 的混淆矩阵与全部变更清单（供逐条人工核对）
//   P3-2：stripToneClaims 处理 4 例已知声调错误；回放后所有 zh meaning 不再含声调/平仄描述、无悬空标点、「」引用词保留
//   端到端：mock fetch 走 generateAiCandidates，guard.themeNormalized / guard.toneClaimStripped 计数正确
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r499-compiled.mjs");
await build({ entryPoints: [path.join(root, "apps/web/src/ai.ts")], bundle: true, format: "esm", outfile: tmp });
const { normalizeTheme, stripToneClaims, TONE_CLAIM_RE, citedSplit, generateAiCandidates, newGuardStats } = await import(tmp);
rmSync(tmp);

const showMatrix = process.argv.includes("--matrix");
let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : `: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`}`);
};

// ---------- 回放 6 份 NDJSON ----------
const rows = [];
for (let i = 1; i <= 6; i++) {
  const lines = readFileSync(path.join(root, `docs/audits/r494/ai-search-0${i}.ndjson`), "utf8").split("\n").filter(Boolean);
  const lang = JSON.parse(lines[0])._request.lang;
  for (const l of lines.slice(1)) {
    const ev = JSON.parse(l);
    if (ev.type !== "proposed") continue;
    for (const it of ev.items) rows.push({ file: i, lang, round: ev.round, label: it.label, theme: it.theme, meaning: it.meaning });
  }
}
check("回放候选总数 137（6 份 NDJSON 全部 proposed items）", rows.length, 137);

const THEMES = ["pinyin", "word", "coined", "blend"];
const matrix = Object.fromEntries(THEMES.map((a) => [a, Object.fromEntries(THEMES.map((b) => [b, 0]))]));
const changes = [];
for (const r of rows) {
  const meaning = r.lang === "zh" ? stripToneClaims(r.meaning).meaning : r.meaning;
  r.normalized = normalizeTheme(r.label, meaning, r.theme, r.lang);
  matrix[r.theme][r.normalized]++;
  if (r.normalized !== r.theme) changes.push(r);
}
if (showMatrix) {
  console.log("\n模型自标 \\ 归一后 |", THEMES.join(" | "));
  for (const a of THEMES) console.log(`${a.padEnd(6)} | ${THEMES.map((b) => String(matrix[a][b]).padStart(6)).join(" | ")}`);
}
console.log(`\n--- theme 变更清单（${changes.length} 条，逐条人工核对）---`);
for (const r of changes) console.log(`#${r.file} ${r.lang} ${r.theme} → ${r.normalized}  ${r.label}  | ${r.meaning.slice(0, 60)}`);
console.log("");

// P3-1 8 条已知坏例（R494 §4.5）
const want = {
  zhangwubao: "pinyin",
  cuddlepup: "coined",
  fluffnest: "coined",
  barkbite: "coined",
  furbuddy: "coined",
  nibblenest: "coined",
  pawlab: "coined",
  harborly: "coined",
};
for (const [label, theme] of Object.entries(want)) {
  const r = rows.find((x) => x.label === label);
  check(`P3-1 ${label}: ${r?.theme} → ${theme}`, r?.normalized, theme);
}
// 变更清单封闭：除 8 条坏例外，其余变更须逐条列在此白名单（人工核对后登记，避免静默扩散）
const reviewedExtra = {
  tailwag: "coined", // zh 标 word；tail + wag 倒装组合，非词典词，与 cuddlepup 同型
  pettreat: "coined", // zh 标 word；pet + treat「两个词直接相拼」，非词典词
};
const unexpected = changes.filter((r) => !(r.label in want) && !(r.label in reviewedExtra));
check("变更清单无未核对项（0 误改）", unexpected.map((r) => `${r.label}:${r.theme}→${r.normalized}`), []);
for (const [label, theme] of Object.entries(reviewedExtra)) {
  check(`已核对变更 ${label} → ${theme}`, rows.find((x) => x.label === label)?.normalized, theme);
}
// 不该动的边界样本：模型标注保留
const keep = ["munchkin", "wagtail", "finmo", "caiwuhub", "zhangdanhub", "kuaijihub", "petbao", "maopals", "gougift", "tuanpaw", "jujubee", "miaoround", "waofun", "complainter", "stillvigil", "anchor", "focusly", "steadyfin", "snackpaw", "pawfect", "guzigroo", "zsp"];
for (const label of keep) {
  const r = rows.find((x) => x.label === label);
  check(`保留模型标注 ${label}（${r?.theme}）`, r?.normalized, r?.theme);
}
check("全部 pinyin 标注均未被改动", rows.filter((r) => r.theme === "pinyin" && r.normalized !== "pinyin").length, 0);

// ---------- P3-2 声调描述 ----------
const toneCases = {
  lexin: "声调一升一平",
  zhangping: "先升后平",
  nuanpa: "第二声",
  huazhi: "一升一平",
};
for (const [label, phrase] of Object.entries(toneCases)) {
  const r = rows.find((x) => x.label === label);
  const t = stripToneClaims(r.meaning);
  check(`P3-2 ${label} 原文含「${phrase}」`, r.meaning.includes(phrase), true);
  check(`P3-2 ${label} 被处理且不再含声调描述`, t.stripped && !t.meaning.includes(phrase) && !TONE_CLAIM_RE.test(t.meaning), true);
  check(`P3-2 ${label} 保留「」引用词`, /「[\u4e00-\u9fff]+」/.test(t.meaning), true);
  console.log(`   ${label}: ${t.meaning}`);
}
const zhRows = rows.filter((r) => r.lang === "zh");
const stripped = zhRows.map((r) => ({ r, t: stripToneClaims(r.meaning) }));
const remaining = stripped.filter(({ t }) => TONE_CLAIM_RE.test(t.meaning));
check("回放后 zh meaning 无残留声调/平仄描述", remaining.map(({ r }) => r.label), []);
const dangling = stripped.filter(({ t }) => /[，,；;、]\s*[，,；;、。！？]|^[，,；;、。]|[，,；;、]$/.test(t.meaning));
check("回放后无悬空/连续标点", dangling.map(({ r }) => r.label), []);
const lostQuote = stripped.filter(({ r, t }) => /「/.test(r.meaning) && !/「/.test(t.meaning));
check("剥离未丢失「」引用词", lostQuote.map(({ r }) => r.label), []);
const strippedCount = stripped.filter(({ t }) => t.stripped).length;
console.log(`   zh 候选 ${zhRows.length} 条，含声调描述被剥离 ${strippedCount} 条`);
check("未含声调描述的 meaning 原样返回", stripped.filter(({ r, t }) => !t.stripped && t.meaning !== r.meaning).length, 0);
check("非声调「一声」（maopals「像一声友好的招呼」）不误删", stripToneClaims(rows.find((x) => x.label === "maopals").meaning).stripped, false);

// ---------- 单元：边界案例 ----------
check("含数字 label 不归一", normalizeTheme("pet2go", "pet 是宠物，go 是出发", "word", "zh"), "word");
check("pan 未引「」→ 保留 word", normalizeTheme("pan", "pan is a real English word for a cooking pan", "word", "en"), "word");
check("pan 引「盘」全拼 → pinyin", normalizeTheme("pan", "「盘」pan，取盘活资产之意", "word", "zh"), "pinyin");
check("拼音+英文混搭（yunkit「云」+kit）保留 blend", normalizeTheme("yunkit", "「云」yun 与 kit 工具箱组合", "blend", "zh"), "blend");
check("zh word 拆成拼音段+英文段 → blend", normalizeTheme("maopals", "「猫」mao 与 pals 朋友组合", "word", "zh"), "blend");
check("en 描述（enPinyinDrop）不做 Z1", normalizeTheme("zhangwubao", "「账务宝」zhangwubao，全拼加英文", "blend", "zh", false), "blend");
check("meaning 未拆解的合成词保留模型标注", normalizeTheme("sunflower", "a bright name for a garden app", "word", "en"), "word");
check("citedSplit 最少段数", citedSplit("cuddlepup", "cuddle 是拥抱，pup 是小狗", 2), ["cuddle", "pup"]);
check("citedSplit 拆不出 → null", citedSplit("harborly", "harbor as a noun, plus a -ly suffix", 3), null);
check("R250 内嵌 TLD 降级仍生效于归一后（canaryio word → coined 由 admit 负责，normalizeTheme 不动）", normalizeTheme("canaryio", "canary + io", "word", "en"), "word");

// ---------- 端到端（mock fetch，0 生产 AI 调用）----------
const llmResponse = (candidates) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(candidates) } }] }),
});
const sc = { length: 80, readability: 80, relevance: 80, brandability: 80 };
const realFetch = globalThis.fetch;
try {
  const byLabel = (label) => rows.find((x) => x.label === label);
  const pick = (label) => ({ label, meaning: byLabel(label).meaning, theme: byLabel(label).theme, scores: sc });
  globalThis.fetch = async () => llmResponse([pick("zhangwubao"), pick("cuddlepup"), pick("lexin"), pick("nuanpa"), pick("qishu"), pick("steadyfin")]);
  const guard = newGuardStats();
  const out = await generateAiCandidates("desc", "test-key", { lang: "zh", guard });
  check("e2e zhangwubao → pinyin", out.find((c) => c.label === "zhangwubao")?.theme, "pinyin");
  check("e2e cuddlepup → coined", out.find((c) => c.label === "cuddlepup")?.theme, "coined");
  check("e2e steadyfin 保持 coined", out.find((c) => c.label === "steadyfin")?.theme, "coined");
  check("e2e guard.themeNormalized = 2", guard.themeNormalized, 2);
  check("e2e lexin meaning 不含声调描述", TONE_CLAIM_RE.test(out.find((c) => c.label === "lexin")?.meaning ?? "声调"), false);
  check("e2e lexin 候选未被删除且保留「乐薪」", out.find((c) => c.label === "lexin")?.meaning.includes("「乐薪」"), true);
  check("e2e guard.toneClaimStripped = 4（lexin/nuanpa/qishu/zhangwubao「声调起伏自然」）", guard.toneClaimStripped, 4);
  check("e2e 候选一条未丢", out.length, 6);

  globalThis.fetch = async () => llmResponse([pick("harborly"), pick("anchor"), pick("calmroot"), pick("complainter")]);
  const guardEn = newGuardStats();
  // R498 集成后 en 主轮 word 不足会触发补发调用（mock fetch 会原样再返回同一批候选而重复计数）；
  // 这里只验证 theme 归一，预算置 0 隔离补发路径（补发本身由 verify-r498 覆盖）
  const outEn = await generateAiCandidates("desc", "test-key", { lang: "en", guard: guardEn, wordSupplementBudget: { remaining: 0 } });
  check("e2e en harborly → coined", outEn.find((c) => c.label === "harborly")?.theme, "coined");
  check("e2e en anchor 保持 word", outEn.find((c) => c.label === "anchor")?.theme, "word");
  check("e2e en calmroot 保持 blend", outEn.find((c) => c.label === "calmroot")?.theme, "blend");
  check("e2e en guard.themeNormalized = 1", guardEn.themeNormalized, 1);
  check("e2e en 不做声调剥离", guardEn.toneClaimStripped, 0);

  // prompt：zh 红线含声调禁令，few-shot 不再示范声调
  let sys = "";
  globalThis.fetch = async (_url, init) => {
    sys = JSON.parse(init.body).messages[0].content;
    return llmResponse([pick("qishu")]);
  };
  await generateAiCandidates("desc", "test-key", { lang: "zh" });
  check("zh prompt 含「禁止描述声调/平仄」", sys.includes("禁止描述声调/平仄"), true);
  check("zh prompt few-shot 不再示范「声调平缓」「声调上扬」", /声调平缓|声调上扬，读一遍/.test(sys), false);
} finally {
  globalThis.fetch = realFetch;
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
