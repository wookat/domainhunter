// R243 word 配额补发重试自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/verify-r243.mjs
// 覆盖（R239 审计 P1-1 / P3-1）：
// - 补发轮 meaning 谓语锤点放宽（word 隐喻短句式不再被 enMeaningIncoherent 误杀，红线条件 A 不变）
// - 补发全灭 → 二次重试（prompt 加硬）→ 成功
// - 两次补发仍 0 → 不阻塞主结果
// - guard 补发轮独立计数（supplementAttempts / supplementDropped）
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r243-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const {
  enMeaningIncoherent,
  buildWordSupplementDirective,
  generateAiCandidates,
  newGuardStats,
  countThemes,
  EN_WORD_SUPPLEMENT_MAX_ATTEMPTS,
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

// ---------- 补发轮 meaning 谓语锤点放宽（红线条件 A：词源锤点 仍然生效） ----------
// word 隐喻短句式：主轮（默认）被 B 锤拦、补发轮（wordMetaphor）放行
const metaphorShort = ["anvil", "anvil: a solid metaphor for a build tool where ideas get forged"];
check("word 隐喻短句：主轮仍拦截", enMeaningIncoherent(...metaphorShort), true);
check("word 隐喻短句：补发轮放行", enMeaningIncoherent(...metaphorShort, { wordMetaphor: true }), false);
// 含常规谓语的正常文案：两种模式都放行
const normal = ["anvil", "A real English word: the anvil evokes a solid build tool; reads instantly"];
check("常规谓语文案：主轮放行", enMeaningIncoherent(...normal), false);
check("常规谓语文案：补发轮放行", enMeaningIncoherent(...normal, { wordMetaphor: true }), false);
// 红线不放弃：无词源锤点的词语沙拉在补发轮也必须拦（R196 坏例，label 与 meaning 无片段关联）
const salad = ["allur", "alapa vein memory, floor n look, metaphor times shaded privately"];
check("词语沙拉（无词源锤点）：补发轮仍拦截", enMeaningIncoherent(...salad, { wordMetaphor: true }), true);
// 无隐喻信号也无谓语的碎片短语：补发轮仍拦
check(
  "碎片短语（无谓语无隐喻信号）：补发轮仍拦截",
  enMeaningIncoherent("anvil", "anvil, iron, heavy tools everywhere", { wordMetaphor: true }),
  true,
);

// ---------- 二次补发硬指令 ----------
const d1 = buildWordSupplementDirective(4, ["alpha"], 1);
const d2 = buildWordSupplementDirective(4, ["alpha"], 2);
check("attempt=1 不含二次加硬指令", /二次补发加硬/.test(d1), false);
check("attempt=2 含二次加硬指令（完整句式要求）", /二次补发加硬/.test(d2) && /主谓完整/.test(d2), true);

// ---------- mock 端到端：补发全灭 → 二次重试 → 成功 ----------
const mainBatch = ["cronly", "uptimo", "pingory", "watchbeam", "monitrix", "alertine", "cronvex", "pulsora"].map(
  (label) => ({
    label,
    meaning: `${label} from Latin roots, evokes uptime monitoring; reads instantly`,
    theme: "coined",
    scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
  }),
);
// 第 1 次补发：全部词语沙拉（无词源锤点+无谓语）→ 全灭；第 2 次补发：合格 word 候选
const supp1 = [
  { label: "canary", meaning: "coal mine, songs, feathers everywhere yellow", theme: "word", scores: {} },
  { label: "sentry", meaning: "night post, standing, torch flicker cold", theme: "word", scores: {} },
];
const supp2 = [
  { label: "beacon", meaning: 'A real English word: a beacon signals status from afar, metaphor for uptime alerts', theme: "word", scores: {} },
  { label: "pulse", meaning: '"pulse" is a real English word meaning heartbeat, metaphor for periodic health checks', theme: "word", scores: {} },
];
const mockFetch = (responses) => {
  let call = 0;
  globalThis.fetch = async () => {
    const body = responses[Math.min(call, responses.length - 1)];
    call++;
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(body) } }] }),
    };
  };
  return () => call;
};

{
  const calls = mockFetch([mainBatch, supp1, supp2]);
  const guard = newGuardStats();
  const out = await generateAiCandidates("uptime monitor", "test-key", { lang: "en", guard });
  check("场景1：总调用数 = 主轮1 + 补发2", calls(), 3);
  check("场景1：supplementAttempts = 2", guard.supplementAttempts, 2);
  check(`场景1：补发上限常量 = 2`, EN_WORD_SUPPLEMENT_MAX_ATTEMPTS, 2);
  check("场景1：二次重试后 word > 0", countThemes(out).word > 0, true);
  check("场景1：首次补发全灭计入 supplementDropped.meaningIncoherent", guard.supplementDropped.meaningIncoherent, 2);
  check("场景1：主轮 dropped 不受补发轮污染", guard.dropped.meaningIncoherent, 0);
  check("场景1：wordSupplement 标记", guard.wordSupplement, true);
  check(
    "场景1：合入的是二次补发候选",
    out.slice(mainBatch.length).map((c) => c.label),
    ["beacon", "pulse"],
  );
}

// ---------- mock 端到端：两次仍 0 → 不阻塞主结果 ----------
{
  const calls = mockFetch([mainBatch, supp1, supp1]);
  const guard = newGuardStats();
  const out = await generateAiCandidates("uptime monitor", "test-key", { lang: "en", guard });
  check("场景2：总调用数 = 主轮1 + 补发2（上限后停止）", calls(), 3);
  check("场景2：supplementAttempts = 2", guard.supplementAttempts, 2);
  check("场景2：word 仍为 0 但主结果完整返回", out.length, mainBatch.length);
  check("场景2：两轮补发丢弃累计 = 4", guard.supplementDropped.meaningIncoherent, 4);
}

// ---------- mock 端到端：首次补发即成功 → 不发起第二次 ----------
{
  const calls = mockFetch([mainBatch, supp2]);
  const guard = newGuardStats();
  const out = await generateAiCandidates("uptime monitor", "test-key", { lang: "en", guard });
  check("场景3：首次补发成功即停，总调用数 2", calls(), 2);
  check("场景3：supplementAttempts = 1", guard.supplementAttempts, 1);
  check("场景3：word > 0", countThemes(out).word > 0, true);
}

// ---------- mock 端到端：主轮 word 达标 → 不补发 ----------
{
  const withWord = [...mainBatch.slice(0, 7), { label: "anvil", meaning: "A real English word: the anvil evokes a solid build tool; reads instantly", theme: "word", scores: {} }];
  const calls = mockFetch([withWord]);
  const guard = newGuardStats();
  await generateAiCandidates("uptime monitor", "test-key", { lang: "en", guard });
  check("场景4：word 达标不补发，总调用数 1", calls(), 1);
  check("场景4：supplementAttempts = 0", guard.supplementAttempts, 0);
  check("场景4：wordSupplement = false", guard.wordSupplement, false);
}

console.log(failed === 0 ? "\nR243 verify: ALL PASS" : `\nR243 verify: ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
