// R238 防线统计元数据自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/verify-r238.mjs
// 覆盖：newGuardStats/guardDroppedTotal 基础形状，以及用 mock fetch 端到端验证
// generateAiCandidates 各防线丢弃计数、word 配额补发标记、退避重试计数的正确性。
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r238-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { newGuardStats, guardDroppedTotal, generateAiCandidates } = await import(tmp);
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

const cand = (label, theme, meaning) => ({
  label,
  meaning: meaning ?? `${label} evokes a real word meaning for the product; reads instantly`,
  theme,
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});
const zhCand = (label, theme, meaning) => ({
  label,
  meaning: meaning ?? `寓意稳载远行，声调平缓，读一遍就能拼出来`,
  theme,
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});

// ---------- 基础形状 ----------
const g0 = newGuardStats();
check("newGuardStats 初始丢弃合计为 0", guardDroppedTotal(g0), 0);
check("newGuardStats wordSupplement 初始 false", g0.wordSupplement, false);
check("newGuardStats retries 初始 0", g0.retries, 0);
g0.dropped.brandCollision = 2;
g0.dropped.pinyinInvalid = 3;
check("guardDroppedTotal 跨防线求和", guardDroppedTotal(g0), 5);

// ---------- 端到端计数（mock fetch，0 生产 AI 调用） ----------
const llmResponse = (candidates) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(candidates) } }] }),
});
const realFetch = globalThis.fetch;
try {
  // 场景 1：zh 各防线逐条命中，计数逐项正确
  globalThis.fetch = async () =>
    llmResponse([
      zhCand("haoming", "pinyin"), // 正常保留
      zhCand("BAD NAME!", "pinyin"), // invalidLabel
      zhCand("google", "coined"), // brandCollision（完全同名知名品牌）
      zhCand("kongbai", "pinyin", "   "), // emptyMeaning
      zhCand("hanguk", "coined", "코더 스타일的名字，很有极客感"), // charsetViolation（韩文）
      zhCand("plangrow", "coined", "play 与 grow 结合，寓意边计划边成长"), // phantomEtymology（词源拼写不符）
      zhCand("hunhe", "coined", "这是一个混搭造词，融合了两种风格"), // metaLanguage
      zhCand("yiwen", "coined", "也许取自某个人名？寓意存疑"), // questionMark
      zhCand("xqzvk", "pinyin", "「星球」xqzvk，双字全拼，好读好记"), // pinyinInvalid（无法切分）
      zhCand("tangfang", "pinyin", "「探方」tangfang，双字全拼，声调顺口"), // pinyinMismatch（探方=tanfang）
    ]);
  let guard = newGuardStats();
  let out = await generateAiCandidates("desc", "test-key", { lang: "zh", guard });
  check("zh 场景：正常候选保留", out.map((c) => c.label), ["haoming"]);
  check("invalidLabel 计数", guard.dropped.invalidLabel, 1);
  check("brandCollision 计数", guard.dropped.brandCollision, 1);
  check("emptyMeaning 计数", guard.dropped.emptyMeaning, 1);
  check("charsetViolation 计数", guard.dropped.charsetViolation, 1);
  check("phantomEtymology 计数", guard.dropped.phantomEtymology, 1);
  check("metaLanguage 计数", guard.dropped.metaLanguage, 1);
  check("questionMark 计数", guard.dropped.questionMark, 1);
  check("pinyinInvalid 计数", guard.dropped.pinyinInvalid, 1);
  check("pinyinMismatch 计数", guard.dropped.pinyinMismatch, 1);
  check("zh 场景：丢弃合计 9", guardDroppedTotal(guard), 9);
  check("zh 场景：无补发无重试", [guard.wordSupplement, guard.retries], [false, 0]);

  // 场景 2：EN 词语沙拉 → meaningIncoherent 计数
  globalThis.fetch = async () =>
    llmResponse([
      cand("verbloom", "blend", "verb + bloom: words that blossom, fits a writing app"),
      cand("qwpxk", "coined", "alapa vein memory, floor n look, times shaded privately"), // meaningIncoherent
    ]);
  guard = newGuardStats();
  out = await generateAiCandidates("desc", "test-key", { lang: "en", guard });
  check("meaningIncoherent 计数", guard.dropped.meaningIncoherent, 1);

  // 场景 3：refine 轮点踩形态硬过滤 → dislikedMorphology 计数
  const many = ["haven", "delta", "cider", "eagle", "maple", "penta", "quill", "raven"].map((l) =>
    cand(l, "coined", `${l} evokes a real word meaning for the product; reads instantly`),
  );
  globalThis.fetch = async () =>
    llmResponse([
      ...many,
      cand("moyu", "coined", "moyu evokes a calm word meaning for the product; reads instantly"), // 与点踩 moji 同词根 mo
    ]);
  guard = newGuardStats();
  out = await generateAiCandidates("desc", "test-key", {
    lang: "zh",
    guard,
    feedback: { tried: ["moji"], taken: [], takenThemes: {}, disliked: [{ label: "moji" }] },
  });
  check("dislikedMorphology 计数", guard.dropped.dislikedMorphology, 1);
  check("refine 轮：moyu 被过滤", out.some((c) => c.label === "moyu"), false);

  // 场景 4：EN word 配额失守 → wordSupplement 标记为 true，补发轮丢弃计入 supplementDropped（R243）
  const noWord = ["alpha", "bravo", "cider", "delta", "eagle", "maple", "gale", "haven"].map((l, i) =>
    cand(l, i % 2 === 0 ? "coined" : "blend"),
  );
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return llmResponse(calls === 1 ? noWord : [cand("anvil", "word"), cand("google", "word")]);
  };
  guard = newGuardStats();
  out = await generateAiCandidates("desc", "test-key", { lang: "en", guard });
  check("补发触发：wordSupplement=true", guard.wordSupplement, true);
  check("补发轮防线丢弃计入 supplementDropped（R243）", guard.supplementDropped.brandCollision, 1);
  check("主轮 dropped 不含补发轮丢弃（R243）", guard.dropped.brandCollision, 0);
  check("补发候选并入结果", out.some((c) => c.label === "anvil"), true);

  // 场景 5：首次调用瞬时失败 → retries 计 1，重试成功后正常返回
  calls = 0;
  globalThis.fetch = async () => {
    calls++;
    if (calls === 1) return { ok: false, status: 500 };
    return llmResponse([cand("anvil", "word")]);
  };
  guard = newGuardStats();
  out = await generateAiCandidates("desc", "test-key", { lang: "zh", guard });
  check("瞬时失败重试：retries=1", guard.retries, 1);
  check("重试成功后正常返回", out.map((c) => c.label), ["anvil"]);

  // 场景 6：不传 guard（旧调用方式）不报错，行为不变
  globalThis.fetch = async () => llmResponse([cand("anvil", "word")]);
  out = await generateAiCandidates("desc", "test-key", { lang: "zh" });
  check("不传 guard 向后兼容", out.map((c) => c.label), ["anvil"]);
} finally {
  globalThis.fetch = realFetch;
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
