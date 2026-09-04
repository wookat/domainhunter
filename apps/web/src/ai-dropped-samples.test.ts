import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DROPPED_SAMPLE_MEANING_MAX,
  DROPPED_SAMPLE_PER_REASON,
  DROPPED_SAMPLE_TOTAL,
  generateAiCandidates,
  newGuardStats,
  recordDroppedSample,
  type AiCandidate,
  type GuardDropCounts,
} from "./ai";
import { saveSearch } from "./lib/persist";
import type { GuardMeta, RoundInfo, StreamEvent } from "./types";

// R500：审计专用、默认关闭的被丢弃候选样本通道。全部 mock fetch，0 生产 AI 调用。

/** R500 之前（基线 0565741）newGuardStats() 的逐字节序列化结果，默认请求下的 guard 必须与之完全一致 */
const LEGACY_GUARD_JSON =
  '{"dropped":{"invalidLabel":0,"brandCollision":0,"emptyMeaning":0,"charsetViolation":0,"phantomEtymology":0,"metaLanguage":0,"questionMark":0,"meaningIncoherent":0,"zhMeaningIncoherent":0,"pinyinInvalid":0,"pinyinMismatch":0,"dislikedMorphology":0,"enPinyinRoute":0},"wordSupplement":false,"supplementAttempts":0,"supplementDropped":{"invalidLabel":0,"brandCollision":0,"emptyMeaning":0,"charsetViolation":0,"phantomEtymology":0,"metaLanguage":0,"questionMark":0,"meaningIncoherent":0,"zhMeaningIncoherent":0,"pinyinInvalid":0,"pinyinMismatch":0,"dislikedMorphology":0,"enPinyinRoute":0},"retries":0,"themeNormalized":0,"toneClaimStripped":0}';

const ok = (label: string, meaning: string, theme = "blend"): Partial<AiCandidate> => ({
  label,
  meaning,
  theme: theme as AiCandidate["theme"],
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});

/** 现规则下必被 meaningIncoherent 拦截的 en 沙拉（verify-r196/r223/r246 夹具坏例；privar 在更前的 brandCollision 防线就被拦，单列） */
const BRAND: [string, string] = ["privar", "private mirror flattened to a sharp final ar, a future named as an ounce"];
const SALAD: [string, string][] = [
  ["allur", "alapa vein memory, floor n look, for times shaded privately; same press on small, phrase move without trail"],
  ["monthat", "that low turning suggests a season pressed under glass, phrase move without trail"],
  ["velfrom", "carried from a shaded ounce of evening, reads the floor n look for times privately"],
  ["stovery", "over the small press it means a future named as an ounce, same phrase shaded"],
  ["theora", "the quiet suggests a vein memory, floor n look, for times shaded privately"],
  ["ancryst", "first layer from an upstroke inclining—stem anchors data sharp, darning current quickly"],
  ["lintow", "firm linen knot remains unbraided but reads readable rune"],
];
/** 现规则放行的 en 好例 */
const GOOD: [string, string][] = [
  ["verbloom", "verb + bloom: words that blossom, fits a writing app; two recognizable words joined, stress on the first syllable"],
  ["trackit", "track + it: the simplest promise of a tracking tool, reads as a command; two crisp syllables"],
  ["brewnest", "brew + nest: a cozy home for your coffee ritual; reads as two plain words"],
];

function mockLlm(responses: unknown[][]): { calls: number; fetch: typeof fetch } {
  const state = { calls: 0, fetch: undefined as unknown as typeof fetch };
  state.fetch = (async () => {
    const r = responses[Math.min(state.calls, responses.length - 1)];
    state.calls++;
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(r) } }] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  return state;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("默认关闭：请求不带 debugDropped 时 guard 无 droppedSamples 字段、字节不变", () => {
  it("newGuardStats() 序列化与 R500 之前逐字节一致；debugDropped 非 === true 一律不开", () => {
    expect(JSON.stringify(newGuardStats())).toBe(LEGACY_GUARD_JSON);
    expect(JSON.stringify(newGuardStats({}))).toBe(LEGACY_GUARD_JSON);
    expect(JSON.stringify(newGuardStats({ debugDropped: false }))).toBe(LEGACY_GUARD_JSON);
    expect(JSON.stringify(newGuardStats({ debugDropped: "true" as unknown as boolean }))).toBe(LEGACY_GUARD_JSON);
    expect("droppedSamples" in newGuardStats()).toBe(false);
  });

  it("默认 guard 走完带丢弃的生成后仍无 droppedSamples（recordDroppedSample 在未开启时为 no-op）", async () => {
    const llm = mockLlm([[...SALAD.map(([l, m]) => ok(l, m)), ok(...BRAND), ...GOOD.map(([l, m]) => ok(l, m))]]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats();
    await generateAiCandidates("release notes tool", "k", { lang: "en", guard, wordSupplementBudget: { remaining: 0 } });
    expect(guard.dropped.meaningIncoherent).toBe(SALAD.length);
    expect(guard.dropped.brandCollision).toBe(1);
    expect("droppedSamples" in guard).toBe(false);
    expect(JSON.stringify(guard)).not.toContain("droppedSamples");
    recordDroppedSample(guard, { reason: "meaningIncoherent", label: "x", meaning: "y", theme: "" });
    expect(JSON.stringify(guard)).not.toContain("droppedSamples");
  });

  it("前端默认请求体不含 debugDropped（App.tsx 从不发送，默认请求字节级不变）", () => {
    const src = readFileSync(path.join(__dirname, "App.tsx"), "utf8");
    expect(src).not.toContain("debugDropped");
    const persist = readFileSync(path.join(__dirname, "lib/persist.ts"), "utf8");
    expect(persist).not.toContain("guard");
  });
});

describe("开启 debugDropped：样本内容/上限/截断/不含存活候选", () => {
  it("样本含 reason/label/meaning/theme，且只含被丢弃候选，不含存活候选；每 reason 最多 5 条但计数仍为全量", async () => {
    const llm = mockLlm([[...SALAD.map(([l, m]) => ok(l, m, "coined")), ok(...BRAND, "coined"), ...GOOD.map(([l, m]) => ok(l, m))]]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats({ debugDropped: true });
    const out = await generateAiCandidates("release notes tool", "k", { lang: "en", guard, wordSupplementBudget: { remaining: 0 } });
    expect(out.map((c) => c.label).sort()).toEqual(GOOD.map(([l]) => l).sort());
    expect(guard.dropped.meaningIncoherent).toBe(SALAD.length);
    expect(guard.dropped.brandCollision).toBe(1);
    expect(SALAD.length).toBeGreaterThan(DROPPED_SAMPLE_PER_REASON);
    const samples = guard.droppedSamples!;
    // meaningIncoherent 被截到 5 条，brandCollision 1 条；计数仍是全量
    expect(samples.length).toBe(DROPPED_SAMPLE_PER_REASON + 1);
    const incoherent = samples.filter((s) => s.reason === "meaningIncoherent");
    expect(incoherent.length).toBe(DROPPED_SAMPLE_PER_REASON);
    expect(samples.filter((s) => s.reason === "brandCollision")).toEqual([{ reason: "brandCollision", label: BRAND[0], meaning: BRAND[1], theme: "coined" }]);
    for (const s of incoherent) {
      expect(s.theme).toBe("coined");
      expect(s.supplement).toBeUndefined();
      expect(SALAD.map(([l]) => l)).toContain(s.label);
      expect(GOOD.map(([l]) => l)).not.toContain(s.label);
      expect(SALAD.find(([l]) => l === s.label)![1]).toBe(s.meaning);
    }
    for (const [l] of GOOD) expect(samples.some((s) => s.label === l)).toBe(false);
    // 前 5 条按到达顺序采样
    expect(incoherent.map((s) => s.label)).toEqual(SALAD.slice(0, DROPPED_SAMPLE_PER_REASON).map(([l]) => l));
  });

  it("总量上限 20：多 reason 各 5 条也不超过 DROPPED_SAMPLE_TOTAL", () => {
    const guard = newGuardStats({ debugDropped: true });
    const reasons: (keyof GuardDropCounts)[] = ["meaningIncoherent", "phantomEtymology", "brandCollision", "questionMark", "metaLanguage", "emptyMeaning"];
    for (const reason of reasons) {
      for (let i = 0; i < 7; i++) recordDroppedSample(guard, { reason, label: `${reason}${i}`, meaning: "m", theme: "blend" });
    }
    expect(DROPPED_SAMPLE_TOTAL).toBe(20);
    expect(guard.droppedSamples!.length).toBe(DROPPED_SAMPLE_TOTAL);
    for (const reason of reasons) {
      expect(guard.droppedSamples!.filter((s) => s.reason === reason).length).toBeLessThanOrEqual(DROPPED_SAMPLE_PER_REASON);
    }
    expect(guard.droppedSamples!.filter((s) => s.reason === "meaningIncoherent").length).toBe(DROPPED_SAMPLE_PER_REASON);
    expect(guard.droppedSamples!.filter((s) => s.reason === "emptyMeaning").length).toBe(0);
  });

  it("meaning 超过 160 字按码点截断并以 … 收尾；≤160 原样保留", () => {
    const guard = newGuardStats({ debugDropped: true });
    const long = "词".repeat(DROPPED_SAMPLE_MEANING_MAX + 40);
    const exact = "a".repeat(DROPPED_SAMPLE_MEANING_MAX);
    recordDroppedSample(guard, { reason: "questionMark", label: "l1", meaning: long, theme: "" });
    recordDroppedSample(guard, { reason: "questionMark", label: "l2", meaning: exact, theme: "" });
    const [s1, s2] = guard.droppedSamples!;
    expect([...s1.meaning].length).toBe(DROPPED_SAMPLE_MEANING_MAX + 1);
    expect(s1.meaning.endsWith("…")).toBe(true);
    expect(s1.meaning.startsWith("词".repeat(DROPPED_SAMPLE_MEANING_MAX))).toBe(true);
    expect(s2.meaning).toBe(exact);
  });

  it("补发轮丢弃的样本标记 supplement:true，主轮样本无此字段", async () => {
    // 主轮：3 条好例（word=0 → 触发 word 补发）；补发轮：1 条沙拉 + 1 条 word 好例
    const llm = mockLlm([
      GOOD.map(([l, m]) => ok(l, m)),
      [ok("allur", SALAD[0][1], "word"), ok("anchor", "A real English word: the ship's anchor, a metaphor for steady progress; reads instantly", "word")],
    ]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats({ debugDropped: true });
    await generateAiCandidates("release notes tool", "k", { lang: "en", guard });
    expect(guard.wordSupplement).toBe(true);
    expect(guard.supplementDropped.meaningIncoherent).toBe(1);
    const supp = guard.droppedSamples!.filter((s) => s.supplement === true);
    expect(supp.length).toBe(1);
    expect(supp[0]).toMatchObject({ reason: "meaningIncoherent", label: "allur", theme: "word" });
    expect(guard.droppedSamples!.filter((s) => s.supplement === undefined).length).toBe(0);
  });
});

describe("dh:lastSearch 快照不含 droppedSamples", () => {
  it("按 App.tsx 处理 proposed 事件的方式只取 filtered 合计；saveSearch 写入的 JSON 不含 droppedSamples/guard", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      setItem: (k: string, v: string) => void store.set(k, v),
      getItem: (k: string) => store.get(k) ?? null,
      removeItem: (k: string) => void store.delete(k),
    });
    const guard: GuardMeta = {
      dropped: { meaningIncoherent: 6, phantomEtymology: 1 },
      wordSupplement: false,
      retries: 0,
      droppedSamples: [{ reason: "meaningIncoherent", label: "allur", meaning: "alapa vein memory", theme: "coined" }],
    };
    const ev: StreamEvent = { type: "proposed", round: 1, items: [], guard };
    // 与 App.tsx handleEvent 一致：guard 只被折叠成 filtered 数字
    const filtered = ev.guard ? Object.values(ev.guard.dropped).reduce((a, b) => a + b, 0) : 0;
    const round: RoundInfo = { round: 1, noteKey: "agent.note.first", proposed: 2, checked: 2, available: 1, filtered };
    saveSearch({
      values: { description: "x", tlds: ["com"], style: "", lengthPref: "" } as never,
      rows: [],
      rounds: [round],
      aiUnderstanding: null,
      refinements: [],
      triedLabels: [],
      locked: [],
    });
    const json = store.get("dh:lastSearch:v1")!;
    expect(json).toBeTruthy();
    expect(json).not.toContain("droppedSamples");
    expect(json).not.toContain("guard");
    expect(json).not.toContain("allur");
    expect(JSON.parse(json).rounds[0].filtered).toBe(7);
  });
});
