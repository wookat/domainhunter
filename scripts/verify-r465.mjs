// R465 en 场景拼音路线丢弃自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/verify-r465.mjs
// 覆盖：en 场景 theme=pinyin 候选被丢弃并计入 guard.dropped.enPinyinRoute；
// zh 场景不受影响；补发轮（word supplement）中的拼音丢弃计入 supplementDropped。
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r465-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { generateAiCandidates, newGuardStats } = await import(tmp);
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

const EN_MEANINGS = {
  castloom: "cast + loom: ideas woven into shape, fits the brief; stress on the first syllable, reads instantly",
  verbloom: "verb + bloom: words that blossom, fits a writing tool; two recognizable words joined, stress on the first syllable",
  anvil: "A real English word: the blacksmith's anvil, metaphor for a solid build tool; one heavy stressed syllable, reads instantly",
  lumora: 'Latin "lumen" meaning light + soft -ora ending, evokes clarity; two open syllables, reads instantly',
  brewora: 'English "brew" meaning crafting + soft -ora ending, evokes crafted ideas brewing; two open syllables, reads instantly',
  sipora: 'English "sip" meaning small tastes + soft -ora ending, evokes small satisfying moments; two open syllables, reads instantly',
  leafara: 'English "leaf" meaning growth + airy -ara ending, evokes organic growth; open syllables, reads instantly',
  novexa: 'Latin "nova" meaning new + crisp -exa ending, evokes fresh starts; stress on the first syllable, reads instantly',
  voxlyn: 'Latin "vox" meaning voice + light -lyn ending, evokes expression; two short syllables, reads instantly',
};
const enCand = (label, theme) => ({
  label,
  meaning: EN_MEANINGS[label],
  theme,
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});
const pinyinEnCand = (label) => ({
  label,
  meaning: `${label} from Chinese pinyin, means growth and momentum; reads smoothly`,
  theme: "pinyin",
  scores: { length: 90, readability: 90, relevance: 90, brandability: 90 },
});

const respWith = (candidates) => ({
  ok: true,
  status: 200,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(candidates) } }] }),
  text: async () => "",
});

// ---------- en：拼音路线候选被丢弃并计数 ----------
{
  const main = [
    enCand("castloom", "blend"),
    enCand("verbloom", "blend"),
    enCand("anvil", "word"),
    enCand("lumora", "coined"),
    pinyinEnCand("chengji"),
    pinyinEnCand("zhixing"),
  ];
  globalThis.fetch = async () => respWith(main);
  const guard = newGuardStats();
  const out = await generateAiCandidates("a note-taking app for developers", "k", { lang: "en", guard });
  check("en: 拼音候选被丢弃（不入结果）", out.map((c) => c.label).filter((l) => l === "chengji" || l === "zhixing"), []);
  check("en: enPinyinRoute 计数 = 2", guard.dropped.enPinyinRoute, 2);
  check("en: 非拼音候选保留", out.length >= 4, true);
}

// ---------- zh：拼音路线不受影响 ----------
{
  const zhMain = [
    { label: "chayun", meaning: "「茶韵」双字全拼，声调顺口叠音好记，读一遍就能拼出来", theme: "pinyin", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } },
    { label: "muzhou", meaning: "「木舟」双字全拼，声调顺口好读好记，读一遍就能拼出来", theme: "pinyin", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } },
  ];
  globalThis.fetch = async () => respWith(zhMain);
  const guard = newGuardStats();
  const out = await generateAiCandidates("茶叶电商，想要有东方韵味的名字", "k", { lang: "zh", guard });
  check("zh: 拼音候选正常保留", out.map((c) => c.label), ["chayun", "muzhou"]);
  check("zh: enPinyinRoute = 0", guard.dropped.enPinyinRoute, 0);
}

// ---------- en 补发轮：拼音丢弃计入 supplementDropped ----------
{
  let call = 0;
  globalThis.fetch = async () => {
    call++;
    if (call === 1) {
      // 主轮 8 个候选、word=0 → 触发 word 补发
      return respWith([
        enCand("castloom", "blend"), enCand("verbloom", "blend"), enCand("lumora", "coined"), enCand("brewora", "coined"),
        enCand("sipora", "coined"), enCand("leafara", "coined"), enCand("novexa", "coined"), enCand("voxlyn", "coined"),
      ]);
    }
    // 补发轮混入拼音候选
    return respWith([
      { label: "anvil", meaning: "A real English word: the blacksmith's anvil, metaphor for a solid build tool; one heavy stressed syllable, reads instantly", theme: "word", scores: { length: 90, readability: 90, relevance: 90, brandability: 90 } },
      pinyinEnCand("biubiu"),
    ]);
  };
  const guard = newGuardStats();
  const out = await generateAiCandidates("a build tool for indie hackers", "k", { lang: "en", guard });
  check("en 补发轮: word 候选合入", out.some((c) => c.label === "anvil"), true);
  check("en 补发轮: 拼音候选被丢弃", out.some((c) => c.label === "biubiu"), false);
  check("en 补发轮: supplementDropped.enPinyinRoute = 1", guard.supplementDropped.enPinyinRoute, 1);
  check("en 补发轮: 主轮 enPinyinRoute 不被污染", guard.dropped.enPinyinRoute, 0);
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
