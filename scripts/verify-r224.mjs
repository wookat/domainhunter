// R224 word 路线配额硬保障自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/verify-r224.mjs
// 覆盖：配额统计（countThemes/needsWordSupplement）、补发合并（mergeWordSupplement）、
// 补发硬指令文案（buildWordSupplementDirective），以及用 mock fetch 端到端验证
// generateAiCandidates 的补发触发/不触发/失败不阻塞逻辑。
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r224-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const {
  countThemes,
  needsWordSupplement,
  mergeWordSupplement,
  buildWordSupplementDirective,
  generateAiCandidates,
  EN_WORD_SUPPLEMENT_MIN_CANDIDATES,
  EN_WORD_SUPPLEMENT_COUNT,
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

const cand = (label, theme) => ({
  label,
  meaning: `${label} evokes a real word meaning for the product; reads instantly`,
  theme,
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});

// ---------- 配额统计 ----------
const noWord = ["alpha", "bravo", "cider", "delta", "eagle", "maple", "gale", "haven"].map((l, i) =>
  cand(l, i % 2 === 0 ? "coined" : "blend"),
);
check("countThemes word=0", countThemes(noWord).word, 0);
check("countThemes coined=4", countThemes(noWord).coined, 4);
check("needsWordSupplement: word=0 且候选数达阈值 → true", needsWordSupplement(noWord), true);
// R498：门槛由「≥8 且 word=0」改为「≥3 且 word < max(2,⌈n×15%⌉)」，下面两条断言随新语义更新（见 verify-r498.mjs）
check(
  "needsWordSupplement: word 达标（8 条含 2 word）→ false",
  needsWordSupplement([...noWord.slice(0, 6), cand("anvil", "word"), cand("beacon", "word")]),
  false,
);
check(
  `needsWordSupplement: 候选数 < 阈值(${EN_WORD_SUPPLEMENT_MIN_CANDIDATES}) → false`,
  needsWordSupplement(noWord.slice(0, EN_WORD_SUPPLEMENT_MIN_CANDIDATES - 1)),
  false,
);
check("needsWordSupplement: 空数组 → false", needsWordSupplement([]), false);

// ---------- 补发合并 ----------
const extra = [cand("anvil", "word"), cand("alpha", "word"), cand("loomly", "coined")];
const merged = mergeWordSupplement(noWord, extra);
check("merge 只收 theme=word 且未重复的候选", merged.length, noWord.length + 1);
check("merge 追加的是 anvil", merged[merged.length - 1].label, "anvil");
check("merge 补发全空时原样返回", mergeWordSupplement(noWord, []).length, noWord.length);

// ---------- 补发硬指令 ----------
const directive = buildWordSupplementDirective(4, ["alpha", "bravo"]);
check("directive 含硬指令关键词", /真实存在的完整英文单词/.test(directive) && /"word"/.test(directive), true);
check("directive 含去重名单", directive.includes("alpha, bravo"), true);

// ---------- 端到端触发逻辑（mock fetch，0 生产 AI 调用） ----------
const llmResponse = (candidates) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(candidates) } }] }),
});
const realFetch = globalThis.fetch;
try {
  // 场景 1：en 整轮 word=0 → 触发补发（恰好 2 次调用），补发候选并入
  let calls = [];
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    calls.push(body.messages[1].content);
    return llmResponse(calls.length === 1 ? noWord : [cand("anvil", "word")]);
  };
  let out = await generateAiCandidates("desc", "test-key", { lang: "en" });
  check("触发补发：共 2 次调用", calls.length, 2);
  check("补发请求带硬指令", /路线配额补发（硬指令）/.test(calls[1]), true);
  check(`补发请求 count=${EN_WORD_SUPPLEMENT_COUNT}`, calls[1].includes(`请给出 ${EN_WORD_SUPPLEMENT_COUNT} 个候选`), true);
  check("补发候选并入结果", out.some((c) => c.label === "anvil"), true);

  // 场景 2：en 且 word 达标（8 条含 2 word，R498 门槛）→ 不补发（仅 1 次调用）
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    return llmResponse([...noWord.slice(0, 6), cand("anvil", "word"), cand("beacon", "word")]);
  };
  out = await generateAiCandidates("desc", "test-key", { lang: "en" });
  check("配额达标不补发：仅 1 次调用", calls.length, 1);

  // 场景 3：zh 场景即使 word=0 也不补发
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    return llmResponse(noWord);
  };
  out = await generateAiCandidates("desc", "test-key", { lang: "zh" });
  check("zh 场景不补发：仅 1 次调用", calls.length, 1);

  // 场景 4：补发请求失败 → 不阻塞，主结果原样返回（R243：失败后再重试 1 次，补发上限 2 次 → 共 3 次调用）
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    if (calls.length === 1) return llmResponse(noWord);
    return { ok: false, status: 500 };
  };
  out = await generateAiCandidates("desc", "test-key", { lang: "en" });
  check("补发失败不阻塞：主结果原样返回", out.length, noWord.length);
  check("补发失败：重试至上限 2 次（共 3 次调用，R243）", calls.length, 3);

  // 场景 5：补发轮 LLM 漏标 theme → 兜底归入 word 并入结果
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    if (calls.length === 1) return llmResponse(noWord);
    return llmResponse([cand("beacon", undefined)]);
  };
  out = await generateAiCandidates("desc", "test-key", { lang: "en" });
  check("补发轮漏标 theme 兜底归入 word", out.find((c) => c.label === "beacon")?.theme, "word");
} finally {
  globalThis.fetch = realFetch;
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
