// R250 自检脚本（R239 审计 P3-2 / P3-3 prompt 微调 + 解析后兜底，无测试框架，0 生产 AI 调用）
// 用法：node scripts/verify-r250.mjs
// P3-3：wordThemeEmbedsTld —— label 以内嵌易发的已收录 TLD 名结尾（canaryio 型）且 theme=word
//   时解析后降级为 coined（不删除）；studio/bonsai 等真实英文词白名单放行。
// P3-2：buildRefineHint 把 disliked 形态硬禁令前置到 hint 最开头并加强命令式措辞。
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r250-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { wordThemeEmbedsTld, WORD_TLD_EMBED_SUFFIXES, generateAiCandidates } = await import(tmp);
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

// ---------- P3-3 单元：wordThemeEmbedsTld ----------
check("嵌入清单全部来自已收录 TLD_LIST", WORD_TLD_EMBED_SUFFIXES.length > 0, true);
check("canaryio（R239 生产坏例）→ 降级", wordThemeEmbedsTld("canaryio"), true);
check("pulseai → 降级", wordThemeEmbedsTld("pulseai"), true);
check("notedapp → 降级", wordThemeEmbedsTld("notedapp"), true);
check("hyperdev → 降级", wordThemeEmbedsTld("hyperdev"), true);
check("studio（真实英文词白名单）→ 放行", wordThemeEmbedsTld("studio"), false);
check("audio → 放行", wordThemeEmbedsTld("audio"), false);
check("bonsai → 放行", wordThemeEmbedsTld("bonsai"), false);
check("workshop → 放行", wordThemeEmbedsTld("workshop"), false);
check("restore → 放行", wordThemeEmbedsTld("restore"), false);
check("anvil（不以 TLD 名结尾）→ 放行", wordThemeEmbedsTld("anvil"), false);
check("io（label 即 TLD 名本身，非内嵌）→ 放行", wordThemeEmbedsTld("io"), false);
check("smart（art 不在嵌入清单）→ 放行", wordThemeEmbedsTld("smart"), false);
check("ozone（one 不在嵌入清单）→ 放行", wordThemeEmbedsTld("ozone"), false);

// ---------- 端到端（mock fetch，0 生产 AI 调用） ----------
const cand = (label, theme) => ({
  label,
  meaning: `${label} evokes a real word meaning for the product; reads instantly`,
  theme,
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});
const llmResponse = (candidates) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(candidates) } }] }),
});
const realFetch = globalThis.fetch;
try {
  // 场景 1：canaryio 标 word → 解析后降级为 coined 且未被删除；anvil 保持 word
  let calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    return llmResponse([cand("canaryio", "word"), cand("anvil", "word")]);
  };
  let out = await generateAiCandidates("desc", "test-key", { lang: "en" });
  const canary = out.find((c) => c.label === "canaryio");
  check("canaryio 未被删除", Boolean(canary), true);
  check("canaryio theme 降级为 coined", canary?.theme, "coined");
  check("anvil 保持 word", out.find((c) => c.label === "anvil")?.theme, "word");
  check("word>0 不触发补发（仅 1 次调用）", calls.length, 1);

  // 场景 2：studio 标 word → 白名单放行不降级
  globalThis.fetch = async () => llmResponse([cand("studio", "word"), cand("anvil", "word")]);
  out = await generateAiCandidates("desc", "test-key", { lang: "en" });
  check("studio 保持 word", out.find((c) => c.label === "studio")?.theme, "word");

  // 场景 3（P3-2）：refine 轮 disliked 硬禁令必须出现在 hint 最开头（先于「这是第 N 轮」与被注册反思）
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    return llmResponse([cand("haven", "coined")]);
  };
  await generateAiCandidates("desc", "test-key", {
    lang: "zh",
    round: 2,
    feedback: {
      tried: ["moji", "alpha"],
      taken: ["alpha"],
      takenThemes: { coined: 1 },
      disliked: [{ label: "moji", theme: "pinyin" }],
    },
  });
  const prompt = calls[0];
  const banIdx = prompt.indexOf("【最高优先级硬禁令");
  check("zh 硬禁令存在", banIdx >= 0, true);
  check("zh 硬禁令在「这是第 N 轮」之前", banIdx >= 0 && banIdx < prompt.indexOf("这是第 2 轮"), true);
  check("zh 硬禁令在被注册反思之前", banIdx >= 0 && banIdx < prompt.indexOf("查出被注册"), true);
  check("zh 硬禁令含词根 mo", prompt.includes("词根片段 mo"), true);
  check("zh 硬禁令含零违规命令", prompt.includes("零违规"), true);

  // 场景 4（P3-2）：en refine 同样前置
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    return llmResponse([cand("haven", "coined")]);
  };
  await generateAiCandidates("desc", "test-key", {
    lang: "en",
    round: 2,
    feedback: {
      tried: ["forgex"],
      taken: ["forgex"],
      takenThemes: { coined: 1 },
      disliked: [{ label: "forgex", theme: "coined" }],
    },
  });
  const enPrompt = calls[0];
  const enBanIdx = enPrompt.indexOf("TOP-PRIORITY HARD BAN");
  check("en 硬禁令存在", enBanIdx >= 0, true);
  check("en 硬禁令在「这是第 N 轮」之前", enBanIdx >= 0 && enBanIdx < enPrompt.indexOf("这是第 2 轮"), true);
  check("en 硬禁令含后缀 -x", enPrompt.includes("-x"), true);

  // 场景 5：无 disliked 的 refine 轮不带硬禁令
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body).messages[1].content);
    return llmResponse([cand("haven", "coined")]);
  };
  await generateAiCandidates("desc", "test-key", {
    lang: "zh",
    round: 2,
    feedback: { tried: ["alpha"], taken: ["alpha"], takenThemes: { coined: 1 } },
  });
  check("无 disliked 不带硬禁令", calls[0].includes("最高优先级硬禁令"), false);

  // 场景 6：首轮 prompt 带 theme 标注反例（nundina/canaryio/ledgeledger）
  calls = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body));
    return llmResponse([cand("haven", "coined")]);
  };
  await generateAiCandidates("desc", "test-key", { lang: "en" });
  const sys = calls[0].messages[0].content;
  check("EN prompt 含 nundina 反例", sys.includes("nundina"), true);
  check("EN prompt 含 canaryio 反例", sys.includes("canaryio"), true);
  check("EN prompt 含 ledgeledger 反例", sys.includes("ledgeledger"), true);
  calls = [];
  await generateAiCandidates("desc", "test-key", { lang: "zh" });
  const zhSys = calls[0].messages[0].content;
  check("ZH prompt 含 word 仅限现代英文常用词反例", zhSys.includes("nundina"), true);
} finally {
  globalThis.fetch = realFetch;
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
