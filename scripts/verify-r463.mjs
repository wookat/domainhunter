// R463 zh 拼音系路线配额硬保障自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/verify-r463.mjs
// 覆盖：needsPinyinSupplement / mergePinyinSupplement / buildPinyinSupplementDirective，
// 以及 mock fetch 端到端验证 generateAiCandidates 的 zh 补发触发/不触发/失败不阻塞逻辑。
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r463-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const {
  needsPinyinSupplement,
  mergePinyinSupplement,
  buildPinyinSupplementDirective,
  generateAiCandidates,
  newGuardStats,
  ZH_PINYIN_QUOTA_MIN_CANDIDATES,
  ZH_PINYIN_SUPPLEMENT_COUNT,
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

const cand = (label, theme, meaning) => ({
  label,
  meaning: meaning ?? `${label} 取意茶香满园，寓意品牌自然生长，读来顺口好记`,
  theme,
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});
const pyCand = (label, word) =>
  cand(label, "pinyin", `「${word}」双字全拼，声调顺口叠音好记，读一遍就能拼出来`);

// ---------- 配额判定 ----------
const noPinyin = ["teagrove", "teaflora", "teavine", "teascent", "leafara", "brewora", "sipora", "teanest"].map(
  (l, i) => cand(l, i % 2 === 0 ? "coined" : "word"),
);
check("needsPinyinSupplement: pinyin+blend=0 且达阈值 → true", needsPinyinSupplement(noPinyin), true);
check(
  "needsPinyinSupplement: 含 pinyin 候选 → false",
  needsPinyinSupplement([...noPinyin.slice(0, 7), pyCand("chayun", "茶韵")]),
  false,
);
check(
  "needsPinyinSupplement: 含 blend 候选 → false",
  needsPinyinSupplement([...noPinyin.slice(0, 7), cand("chahub", "blend", "「茶」拼音 cha 加 hub，短而好记")]),
  false,
);
check(
  `needsPinyinSupplement: 候选数 < 阈值(${ZH_PINYIN_QUOTA_MIN_CANDIDATES}) → false`,
  needsPinyinSupplement(noPinyin.slice(0, ZH_PINYIN_QUOTA_MIN_CANDIDATES - 1)),
  false,
);

// ---------- 补发合并 ----------
const extra = [pyCand("chayun", "茶韵"), cand("teagrove", "pinyin"), cand("loomly", "coined")];
const merged = mergePinyinSupplement(noPinyin, extra);
check("merge 只收 pinyin/blend 且未重复的候选", merged.length, noPinyin.length + 1);
check("merge 追加的是 chayun", merged[merged.length - 1].label, "chayun");
check("merge 补发全空时原样返回", mergePinyinSupplement(noPinyin, []).length, noPinyin.length);

// ---------- 补发硬指令 ----------
const directive = buildPinyinSupplementDirective(6, ["teagrove", "teaflora"]);
check("directive 含硬指令关键词", /路线配额补发（硬指令）/.test(directive) && /"pinyin"/.test(directive), true);
check("directive 含去重名单", directive.includes("teagrove, teaflora"), true);

// ---------- 端到端触发逻辑（mock fetch，0 生产 AI 调用） ----------
const llmResponse = (candidates) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(candidates) } }] }),
});
const realFetch = globalThis.fetch;
try {
  // 场景 1：zh 整轮 pinyin+blend=0 → 触发补发（恰好 2 次调用），补发候选并入
  let calls = [];
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    calls.push(body.messages[1].content);
    return llmResponse(calls.length === 1 ? noPinyin : [pyCand("chayun", "茶韵")]);
  };
  let guard = newGuardStats();
  let out = await generateAiCandidates("茶叶电商", "test-key", { lang: "zh", guard });
  check("触发补发：共 2 次调用", calls.length, 2);
  check("补发请求带硬指令", /路线配额补发（硬指令）/.test(calls[1]), true);
  check(`补发请求 count=${ZH_PINYIN_SUPPLEMENT_COUNT}`, calls[1].includes(`${ZH_PINYIN_SUPPLEMENT_COUNT} 个候选`), true);
  check("补发候选并入结果", out.some((c) => c.label === "chayun"), true);
  check("guard.pinyinSupplement=true", guard.pinyinSupplement, true);

  // 场景 2：zh 已含拼音候选 → 不补发（仅 1 次调用）
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    return llmResponse([...noPinyin.slice(0, 7), pyCand("chayun", "茶韵")]);
  };
  guard = newGuardStats();
  out = await generateAiCandidates("茶叶电商", "test-key", { lang: "zh", guard });
  check("配额达标不补发：仅 1 次调用", calls.length, 1);
  check("不触发时 guard.pinyinSupplement 不为 true", guard.pinyinSupplement === true, false);

  // 场景 3：en 场景即使 pinyin=0 也不做拼音补发（word 配额达标时仅 1 次调用）
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    return llmResponse(noPinyin.map((c) => ({ ...c, meaning: `${c.label} evokes a real word meaning for tea; reads instantly` })));
  };
  out = await generateAiCandidates("tea shop", "test-key", { lang: "en" });
  check("en 场景不做拼音补发：仅 1 次调用", calls.length, 1);

  // 场景 4：补发请求失败 → 不阻塞，主结果原样返回（补发仅 1 次尝试 → 共 2 次调用）
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    if (calls.length === 1) return llmResponse(noPinyin);
    return { ok: false, status: 500 };
  };
  out = await generateAiCandidates("茶叶电商", "test-key", { lang: "zh" });
  check("补发失败不阻塞：主结果原样返回", out.length, noPinyin.length);
  check("补发失败仅尝试 1 次（共 2 次调用）", calls.length, 2);

  // 场景 5：补发轮丢弃计入 supplementDropped，不污染主轮 dropped
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    if (calls.length === 1) return llmResponse(noPinyin);
    return llmResponse([pyCand("chayun", "茶韵"), cand("", "pinyin")]); // 空 label → invalidLabel
  };
  guard = newGuardStats();
  out = await generateAiCandidates("茶叶电商", "test-key", { lang: "zh", guard });
  check("补发轮丢弃计入 supplementDropped", guard.supplementDropped.invalidLabel, 1);
  check("主轮 dropped 不受补发轮污染", guard.dropped.invalidLabel, 0);
} finally {
  globalThis.fetch = realFetch;
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
