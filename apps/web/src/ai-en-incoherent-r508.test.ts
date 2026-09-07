// R508（R500 遗留）：EN meaningIncoherent 三类误杀修法 + metaLanguage blend 误杀的回归。
// 评估集 scripts/fixtures/en-meaning-labels.json 由 scripts/build-en-meaning-labels.mjs 生成，P/R 论证见 scripts/verify-r508.mjs。
// 全部 mock fetch，0 生产 AI 调用。
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  containsMetaLanguage,
  enBlendIsRouteWord,
  enColonClauseHasVerb,
  enMeaningIncoherent,
  EN_PREDICATE_RE,
  generateAiCandidates,
  newGuardStats,
  type AiCandidate,
} from "./ai";

type Row = {
  source: string;
  origin: "production" | "fixture" | "constructed";
  label: string;
  theme: string;
  meaning: string;
  supplement: boolean;
  droppedReason?: string;
  upstreamDrop?: boolean;
  tag: "coherent" | "salad";
};
const fixture = JSON.parse(readFileSync(path.join(__dirname, "../../../scripts/fixtures/en-meaning-labels.json"), "utf8")) as { items: Row[] };
const rows = fixture.items;
const inc = (r: Row) => enMeaningIncoherent(r.label, r.meaning, { wordMetaphor: r.supplement, theme: r.theme });
const prod = (label: string) => rows.find((r) => r.origin === "production" && r.label === label)!;

describe("评估集（生产 + 历史夹具）", () => {
  it("构成：生产 62（存活 49 + R500 debugDropped 13）、夹具沙拉 12 / 忠实 17、构造 31，均带 source/origin/tag", () => {
    const count = (f: (r: Row) => boolean) => rows.filter(f).length;
    expect(count((r) => r.origin === "production")).toBe(62);
    expect(count((r) => r.origin === "production" && !r.droppedReason)).toBe(49);
    expect(count((r) => r.origin === "fixture" && r.tag === "salad")).toBe(12);
    expect(count((r) => r.origin === "fixture" && r.tag === "coherent")).toBe(17);
    expect(count((r) => r.origin === "constructed")).toBe(31);
    expect(rows.every((r) => r.source && r.origin && (r.tag === "coherent" || r.tag === "salad"))).toBe(true);
  });

  it("沙拉召回：夹具 12 条（R195/R218/R239 生产穿透 + 构造变体）全部仍拦", () => {
    for (const r of rows.filter((r) => r.origin === "fixture" && r.tag === "salad")) expect(inc(r), r.label).toBe(true);
  });

  it("沙拉召回：R500 replay 对照组（忠实 X + Y: + 沙拉尾句、无系动词）5 条全部仍拦", () => {
    const ctrl = rows.filter((r) => r.source.endsWith("#constructedSaladWithPair"));
    expect(ctrl.length).toBe(5);
    for (const r of ctrl) expect(inc(r), r.label).toBe(true);
  });

  it("生产存活候选 49 条无新增拦截；夹具忠实 17 条全部放行", () => {
    for (const r of rows.filter((r) => (r.origin === "production" && !r.droppedReason) || (r.origin === "fixture" && r.tag === "coherent"))) expect(inc(r), r.label).toBe(false);
  });

  it("R500 7 条 meaningIncoherent 生产样本：6/7 放行；logsmith 仍拦（like a / forged 两词形均未采纳，见 verify-r508 §2②）", () => {
    const r500 = rows.filter((r) => r.droppedReason === "meaningIncoherent");
    expect(r500.map((r) => r.label).sort()).toEqual(["bushtit", "changelogist", "chronicle", "logsmith", "riffolio", "tessellate", "vireo"]);
    expect(r500.filter((r) => !inc(r)).map((r) => r.label).sort()).toEqual(["bushtit", "changelogist", "chronicle", "riffolio", "tessellate", "vireo"]);
    expect(inc(prod("logsmith"))).toBe(true);
  });

  it("对抗样本：放走的构造沙拉恰为已记录代价集合（③ 冒号系动词 3 条 + ① 自称真词含 from 1 条 + 基线即放走的 privar 自称形态），其余全部仍拦", () => {
    const leaked = rows
      .filter((r) => r.origin === "constructed" && r.tag === "salad" && !inc(r))
      .map((r) => `${r.source.split("#")[1]}:${r.label}`)
      .sort();
    expect(leaked).toEqual([
      "adversarialColonCopula:besowith",
      "adversarialColonCopula:privar",
      "adversarialColonCopula:stovery",
      "adversarialWordClaim:ancryst",
      "adversarialWordClaim:privar", // 基线亦放走：'priv' 锤点 + 旧表把自称里的 word 当谓语；生产中 privar 在更前的 brandCollision 被拦
    ]);
  });
});

describe("① word 路线：theme=word 且 meaning 自称 real/dictionary word → 放开词源片段检查，谓语检查在剔除自称短语后仍须成立", () => {
  it("正例：R500 生产 chronicle / tessellate / vireo / bushtit（释义句不复述 label）放行", () => {
    for (const l of ["chronicle", "tessellate", "vireo", "bushtit"]) expect(inc(prod(l)), l).toBe(false);
  });

  it("反例：自称真词但剔除后无谓语的沙拉仍拦；'real English word' 的 word 不再充当谓语", () => {
    expect(enMeaningIncoherent("lintow", "A real English word: firm linen knot remains unbraided but readable rune", { theme: "word" })).toBe(true);
    expect(enMeaningIncoherent("allur", "A dictionary word, alapa vein memory, floor n look, for times shaded privately", { theme: "word" })).toBe(true);
  });

  it("反例：theme 非 word 时自称真词不放开片段检查（coined/blend 仍须词源锤点）", () => {
    const m = "A real English word meaning a factual written account of events in order of time";
    expect(enMeaningIncoherent("chronicle", m, { theme: "word" })).toBe(false);
    expect(enMeaningIncoherent("chronicle", m, { theme: "coined" })).toBe(true);
    expect(enMeaningIncoherent("chronicle", m)).toBe(true);
  });

  it("反例：无自称信号的 word 候选仍走原片段检查（label 不出现 → 拦）", () => {
    expect(enMeaningIncoherent("vireo", "a small agile bird whose name suggests quick, precise movement", { theme: "word" })).toBe(true);
  });
});

describe("② 谓语词形族：evoke*/echo*/hint at|of/nods to/likened/call(s) to mind/reminiscent/mean(t)/suggested/combine/blending", () => {
  it("正例：changelogist「evoking」、riffolio「hints at / echo」放行", () => {
    expect(inc(prod("changelogist"))).toBe(false);
    expect(inc(prod("riffolio"))).toBe(false);
  });

  it("词形族逐项命中；like a/an/the 与 forge* 未收录", () => {
    for (const s of ["evoke", "evoked", "evoking", "echoed", "echoing", "hints at", "hinting of", "nods to", "likened", "calls to mind", "reminiscent", "meant", "suggested", "combine", "blending"]) {
      expect(EN_PREDICATE_RE.test(s), s).toBe(true);
    }
    for (const s of ["like a blacksmith", "like the", "forged", "forge", "forging", "a hint", "hinted", "nod", "call"]) expect(EN_PREDICATE_RE.test(s), s).toBe(false);
  });

  it("反例：R218 生产沙拉体 'two strides like a firm led gesture' 即使配上忠实 X + Y: 前缀仍拦（like a 未采纳的依据）", () => {
    expect(enMeaningIncoherent("besowith", "beso + with: being exactly where they need it already carried and that whole on first try; two strides like a firm led gesture")).toBe(true);
  });

  it("反例：R243 主轮隐喻短句 'anvil: a solid metaphor … ideas get forged' 默认模式仍拦（forge* 未采纳的依据）", () => {
    expect(enMeaningIncoherent("anvil", "anvil: a solid metaphor for a build tool where ideas get forged")).toBe(true);
    expect(enMeaningIncoherent("anvil", "anvil: a solid metaphor for a build tool where ideas get forged", { wordMetaphor: true })).toBe(false);
  });
});

describe("③ X + Y: 冒号形态：X/Y 均为 label 子串且冒号后子句含系动词/轻动词/第三人称单数动词才算有谓语", () => {
  it("正例：子句含 is / gives / that carries / 句首动词-s", () => {
    expect(enColonClauseHasVerb("trustloop", "trust + loop: a cycle that keeps promises visible")).toBe(true);
    expect(enColonClauseHasVerb("lograft", "log + raft: a raft that carries your logs downstream")).toBe(true);
    expect(enColonClauseHasVerb("notefold", "note + fold: it is a folder for release notes")).toBe(true);
    expect(enColonClauseHasVerb("gleanlog", "glean + log: gives you the picked-over essentials")).toBe(true);
    expect(enMeaningIncoherent("trustloop", "trust + loop: a cycle that keeps promises visible")).toBe(false);
  });

  it("反例：纯名词短语子句无谓语 → 维持拦截；X/Y 不在 label 里不生效", () => {
    expect(enColonClauseHasVerb("gitgloss", "git + gloss: a polished sheen on raw commits")).toBe(false);
    expect(enMeaningIncoherent("gitgloss", "git + gloss: a polished sheen on raw commits")).toBe(true);
    expect(enColonClauseHasVerb("complainter", "commit + planner: it is a tool")).toBe(false);
  });

  it("反例：R500 replay 对照组沙拉（无系动词）不被冒号规则放走", () => {
    expect(enMeaningIncoherent("allur", "all + ur: alapa vein memory, floor n look, for times shaded privately; same press on small, phrase move without trail")).toBe(true);
  });
});

describe("metaLanguage：blend 仅在路线元词用法下命中；coined/portmanteau 不变", () => {
  it("正例：reflint「the consonant blend at the end」/ clearbrew「the r sounds blend smoothly」放行（R500 疑似误杀，已定位）", () => {
    expect(containsMetaLanguage(prod("reflint").meaning)).toBe(false);
    expect(containsMetaLanguage(prod("clearbrew").meaning)).toBe(false);
    expect(enBlendIsRouteWord("the consonant blend at the end makes it crisp")).toBe(false);
    expect(enBlendIsRouteWord("the r sounds blend smoothly for a satisfying finish")).toBe(false);
    expect(inc(prod("reflint"))).toBe(false);
    expect(inc(prod("clearbrew"))).toBe(false);
  });

  it("反例：路线元词形态仍拦——a blend of / this is a blend / Blend route / blend 单独成句 / gitloom portmanteau / imumi coined", () => {
    for (const m of ["A blend of git and loom that weaves commits", "this is a blend name", "Blend route: git plus loom", "blend", "Two words blend: git and loom"]) {
      expect(containsMetaLanguage(m), m).toBe(true);
    }
    expect(containsMetaLanguage(prod("gitloom").meaning)).toBe(true);
    expect(containsMetaLanguage(prod("imumi").meaning)).toBe(true);
  });

  it("其余生产候选无新增 metaLanguage 命中", () => {
    for (const r of rows.filter((r) => r.origin === "production" && r.droppedReason !== "metaLanguage")) expect(containsMetaLanguage(r.meaning), r.label).toBe(false);
  });
});

// ---------- 端到端：admitCandidate 把 theme 传给 enMeaningIncoherent ----------
const ok = (label: string, meaning: string, theme: string): Partial<AiCandidate> => ({
  label,
  meaning,
  theme: theme as AiCandidate["theme"],
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});
function mockLlm(items: Partial<AiCandidate>[]): typeof fetch {
  return (async () =>
    new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(items) } }] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })) as typeof fetch;
}
afterEach(() => vi.unstubAllGlobals());

describe("generateAiCandidates（mock fetch）：R500 误杀样本经完整防线放行，沙拉仍按原因计数", () => {
  it("chronicle(word) / changelogist(coined) / riffolio(blend) / reflint(coined) 存活；allur 沙拉计 meaningIncoherent；gitloom 计 metaLanguage", async () => {
    const r = (l: string) => ok(l, prod(l).meaning, prod(l).theme);
    vi.stubGlobal(
      "fetch",
      mockLlm([r("chronicle"), r("changelogist"), r("riffolio"), r("reflint"), r("gitloom"), ok("allur", "alapa vein memory, floor n look, for times shaded privately; same press on small, phrase move without trail", "coined")]),
    );
    const guard = newGuardStats();
    const out = await generateAiCandidates("release notes tool", "k", { lang: "en", guard, wordSupplementBudget: { remaining: 0 } });
    expect(out.map((c) => c.label).sort()).toEqual(["changelogist", "chronicle", "reflint", "riffolio"]);
    expect(out.find((c) => c.label === "chronicle")?.theme).toBe("word");
    expect(guard.dropped.meaningIncoherent).toBe(1);
    expect(guard.dropped.metaLanguage).toBe(1);
  });
});
