// R245 自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/verify-r245.mjs
// 覆盖：R239 审计 P2-2——zh meaning 带声调拼音被 charsetViolation 误杀的修复：
// ① zh 白名单纳入拼音声调字符（Latin Extended-A / \u01cd-\u01dc / ü）后好例通过；
// ② 韩文/假名/西里尔/IPA 等异文字坏例仍拦；
// ③ charsetViolation 时 guard.charsetSample 保留首个违规字符码点（P3-1 观测补强）。
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r245-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { meaningCharsetOk, firstCharsetViolation, newGuardStats, generateAiCandidates } = await import(tmp);
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

// ---------- ① 带声调拼音好例：zh 白名单放行 ----------
const goodZh = [
  ["Latin Extended-A（ā/shān 型）", "「山禾」shānhé，双字全拼，声调平仄相间，读一遍就记住"],
  ["Latin Extended-A（ē/ī/ō/ū）", "「泊图」bótú，ō 与 ū 类长音开阔，寓意停泊与蓝图"],
  ["三声 \u01cd-\u01dc（ǎ/ǐ/ǒ/ǔ）", "「稳步」wěnbù，ě 与 ù 声调沉稳，寓意步步扎实"],
  ["ü 与 ǚ（\u00fc/\u01d8 类）", "「绿屿」lǜyǔ，ǜ 音清亮，寓意一座绿色小岛"],
  ["纯 ASCII + 汉字（原有行为）", "「好名」haoming，双字全拼，好读好记"],
];
for (const [name, meaning] of goodZh) {
  check(`zh 好例放行：${name}`, meaningCharsetOk(meaning, "zh"), true);
  check(`zh 好例无违规样本：${name}`, firstCharsetViolation(meaning, "zh"), undefined);
}

// ---------- ② 异文字坏例：仍拦 ----------
const badZh = [
  ["韩文（코）", "코더 스타일的名字，很有极客感", "U+CF54"],
  ["日文假名（の）", "日式の风格，轻盈可爱", "U+306E"],
  ["西里尔（д）", "домен 风格的名字，很有异域感", "U+0434"],
  ["IPA 音标（ɪ）", "读作 gɪt，短促有力", "U+026A"],
];
for (const [name, meaning, cp] of badZh) {
  check(`zh 坏例仍拦：${name}`, meaningCharsetOk(meaning, "zh"), false);
  check(`zh 坏例码点样本：${name}`, firstCharsetViolation(meaning, "zh"), cp);
}
// en 场景行为不变：IPA 仍拦、Latin Extended-A 仍放行
check("en：IPA 仍拦", meaningCharsetOk("sounds like gɪt", "en"), false);
check("en：带变音拉丁放行", meaningCharsetOk("from Latin lūmen meaning light", "en"), true);

// ---------- ③ 端到端：charsetViolation 时 guard.charsetSample 记录首个违规码点 ----------
const cand = (label, meaning) => ({
  label,
  meaning,
  theme: "pinyin",
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});
const llmResponse = (candidates) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(candidates) } }] }),
});
const realFetch = globalThis.fetch;
try {
  // 场景 1：带声调拼音候选整轮存活（P2-2 修复主证），charsetSample 不设置
  globalThis.fetch = async () =>
    llmResponse([
      cand("shanhe", "「山禾」shānhé，双字全拼，声调平仄相间，寓意山间禾苗"),
      cand("lvyu", "「绿屿」lǜyǔ，ǜ 音清亮，寓意一座绿色小岛，好读好记"),
    ]);
  let guard = newGuardStats();
  let out = await generateAiCandidates("desc", "test-key", { lang: "zh", guard });
  check("端到端：带声调拼音候选存活", out.map((c) => c.label), ["shanhe", "lvyu"]);
  check("端到端：charsetViolation 计数为 0", guard.dropped.charsetViolation, 0);
  check("端到端：无违规时 charsetSample 未设置", guard.charsetSample, undefined);

  // 场景 2：韩文/西里尔坏例仍拦，charsetSample 只留首个违规候选的首个违规码点
  globalThis.fetch = async () =>
    llmResponse([
      cand("haoming", "「好名」haoming，双字全拼，好读好记，寓意好名字"),
      cand("hanguk", "코더 스타일的名字，很有极客感"),
      cand("domen", "домен 风格的名字，很有异域感"),
    ]);
  guard = newGuardStats();
  out = await generateAiCandidates("desc", "test-key", { lang: "zh", guard });
  check("端到端：异文字坏例仍拦（计 2）", guard.dropped.charsetViolation, 2);
  check("端到端：正常候选保留", out.map((c) => c.label), ["haoming"]);
  check("端到端：charsetSample 为首个违规码点", guard.charsetSample, "U+CF54");
} finally {
  globalThis.fetch = realFetch;
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
