import { afterEach, describe, expect, it, vi } from "vitest";
import {
  EN_WORD_SUPPLEMENT_COUNT,
  EN_WORD_SUPPLEMENT_MAX_ATTEMPTS,
  EN_WORD_SUPPLEMENT_MIN_CANDIDATES,
  EN_WORD_SUPPLEMENT_SEARCH_BUDGET,
  buildWordSupplementDirective,
  countThemes,
  generateAiCandidates,
  needsWordSupplement,
  newGuardStats,
  newWordSupplementBudget,
  wordSupplementFloor,
  wordSupplementReason,
  type AiCandidate,
  type AiTheme,
} from "./ai";

// R498（R494 P2-3）：EN word 路线补发门槛由「候选 ≥8 且 word=0」改为「候选 ≥3 且 word < max(2,⌈n×15%⌉)」，
// 并按整次搜索共享补发预算。全部 mock fetch，0 生产 AI 调用。

const cand = (label: string, theme: AiTheme | undefined): AiCandidate => ({
  label,
  meaning: `${label} evokes a real word meaning for the product; reads instantly`,
  theme,
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});

const NON_WORD = ["calmroot", "trustloop", "serenell", "focusly", "harborly", "quietloop", "firmhabit", "stillvigil", "tranquilix", "serenusly", "complainter", "focusnest"];
const WORDS = ["anchor", "beacon", "harbor", "compass", "lantern"];

/** 构造 n 条候选，其中 w 条 theme=word */
function batch(n: number, w: number): AiCandidate[] {
  const out: AiCandidate[] = [];
  for (let i = 0; i < w; i++) out.push(cand(WORDS[i], "word"));
  for (let i = 0; i < n - w; i++) out.push(cand(NON_WORD[i], i % 2 === 0 ? "blend" : "coined"));
  return out;
}

type LlmMock = { calls: string[]; fetch: typeof fetch };
/** 每次调用按顺序返回 responses（超出取最后一个）；记录 user prompt 便于断言补发指令 */
function mockLlm(responses: (AiCandidate[] | "fail")[]): LlmMock {
  const calls: string[] = [];
  const f = (async (_url: unknown, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body)) as { messages: { content: string }[] };
    calls.push(body.messages[1].content);
    const r = responses[Math.min(calls.length - 1, responses.length - 1)];
    if (r === "fail") return new Response("upstream down", { status: 500 });
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(r) } }] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  return { calls, fetch: f };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("wordSupplementReason / needsWordSupplement（R498 门槛）", () => {
  it("floor = max(2, ⌈n×15%⌉)", () => {
    expect(wordSupplementFloor(3)).toBe(2);
    expect(wordSupplementFloor(7)).toBe(2);
    expect(wordSupplementFloor(12)).toBe(2);
    expect(wordSupplementFloor(13)).toBe(2);
    expect(wordSupplementFloor(14)).toBe(3);
    expect(wordSupplementFloor(24)).toBe(4);
  });

  it("候选 5 / word 0 → zero（旧门槛 <8 不触发，R494 R2 场景）", () => {
    expect(wordSupplementReason(batch(5, 0))).toBe("zero");
    expect(needsWordSupplement(batch(5, 0))).toBe(true);
  });

  it("候选 7 / word 1 → low（R494 R1 场景：word=1 也算薄弱）", () => {
    expect(wordSupplementReason(batch(7, 1))).toBe("low");
  });

  it("候选 12 / word 1 → low", () => {
    expect(wordSupplementReason(batch(12, 1))).toBe("low");
  });

  it("候选 12 / word 3 → 不触发", () => {
    expect(wordSupplementReason(batch(12, 3))).toBeNull();
    expect(needsWordSupplement(batch(12, 3))).toBe(false);
  });

  it("候选 12 / word 2 恰达 floor → 不触发", () => {
    expect(wordSupplementReason(batch(12, 2))).toBeNull();
  });

  it("候选 <3（解析/流截断级失败）→ 不触发", () => {
    expect(EN_WORD_SUPPLEMENT_MIN_CANDIDATES).toBe(3);
    expect(wordSupplementReason(batch(2, 0))).toBeNull();
    expect(wordSupplementReason([])).toBeNull();
    expect(wordSupplementReason(batch(3, 0))).toBe("zero");
  });

  it("theme 缺失的候选不计 word，但计入候选总数", () => {
    const c = [...batch(4, 0), cand("mystery", undefined)];
    expect(c.length).toBe(5);
    expect(countThemes(c).word).toBe(0);
    expect(wordSupplementReason(c)).toBe("zero");
  });
});

describe("buildWordSupplementDirective（R498 low 措辞）", () => {
  it("word=0 沿用「路线为 0」；word>0 改为「仅 N 条」，二次加硬指令不受影响", () => {
    expect(buildWordSupplementDirective(4, ["a"], 1, 0)).toMatch(/word（现成英文单词）路线为 0/);
    const low = buildWordSupplementDirective(4, ["a"], 1, 1);
    expect(low).toMatch(/word（现成英文单词）路线仅 1 条/);
    expect(low).not.toMatch(/路线为 0/);
    expect(buildWordSupplementDirective(4, ["a"], 2, 1)).toMatch(/二次补发加硬/);
  });
});

describe("generateAiCandidates 补发触发（mock LLM，0 生产调用）", () => {
  it("候选 5 / word 0 → 补发 1 次，reason=zero，补发候选并入", async () => {
    const llm = mockLlm([batch(5, 0), [cand("anchor", "word"), cand("beacon", "word")]]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats();
    const out = await generateAiCandidates("habit tracker", "k", { lang: "en", guard });
    expect(llm.calls.length).toBe(2);
    expect(llm.calls[1]).toMatch(/路线配额补发（硬指令）/);
    expect(llm.calls[1]).toContain(`请给出 ${EN_WORD_SUPPLEMENT_COUNT} 个候选`);
    expect(guard).toMatchObject({ wordSupplement: true, supplementAttempts: 1, wordSupplementReason: "zero" });
    expect(guard.wordSupplementSkipped).toBeUndefined();
    expect(countThemes(out).word).toBe(2);
    expect(out.length).toBe(7);
  });

  it("候选 7 / word 1 → 补发 1 次，reason=low，指令含「仅 1 条」并排除已有 label", async () => {
    const main = batch(7, 1);
    const llm = mockLlm([main, [cand("beacon", "word"), cand("anchor", "word")]]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats();
    const out = await generateAiCandidates("habit tracker", "k", { lang: "en", guard });
    expect(llm.calls.length).toBe(2);
    expect(llm.calls[1]).toMatch(/路线仅 1 条/);
    expect(llm.calls[1]).toContain(main.map((c) => c.label).join(", "));
    expect(guard).toMatchObject({ wordSupplement: true, supplementAttempts: 1, wordSupplementReason: "low" });
    // 重复的 anchor 不并入，只追加 beacon
    expect(out.map((c) => c.label).filter((l) => l === "anchor").length).toBe(1);
    expect(countThemes(out).word).toBe(2);
  });

  it("候选 12 / word 1 → 补发（low）", async () => {
    const llm = mockLlm([batch(12, 1), [cand("beacon", "word")]]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats();
    await generateAiCandidates("habit tracker", "k", { lang: "en", guard });
    expect(llm.calls.length).toBe(2);
    expect(guard.wordSupplementReason).toBe("low");
  });

  it("候选 12 / word 3 → 不补发，guard 无 reason", async () => {
    const llm = mockLlm([batch(12, 3)]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats();
    await generateAiCandidates("habit tracker", "k", { lang: "en", guard });
    expect(llm.calls.length).toBe(1);
    expect(guard).toMatchObject({ wordSupplement: false, supplementAttempts: 0 });
    expect(guard.wordSupplementReason).toBeUndefined();
  });

  it("候选 <3 → 不补发", async () => {
    const llm = mockLlm([batch(2, 0)]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats();
    await generateAiCandidates("habit tracker", "k", { lang: "en", guard });
    expect(llm.calls.length).toBe(1);
    expect(guard.wordSupplementReason).toBeUndefined();
  });

  it("补发轮全灭 → R243 二次加硬重试；仍 0 不阻塞主结果（无预算对象时仅受单轮上限约束）", async () => {
    const llm = mockLlm([batch(5, 0), "fail", "fail"]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats();
    const out = await generateAiCandidates("habit tracker", "k", { lang: "en", guard });
    expect(llm.calls.length).toBe(1 + EN_WORD_SUPPLEMENT_MAX_ATTEMPTS);
    expect(llm.calls[2]).toMatch(/二次补发加硬/);
    expect(guard.supplementAttempts).toBe(EN_WORD_SUPPLEMENT_MAX_ATTEMPTS);
    expect(out.length).toBe(5);
  });

  it("补发轮候选不绕过防线：词语沙拉 meaning 在补发轮仍被拦并计入 supplementDropped", async () => {
    const salad: AiCandidate = { label: "allur", meaning: "alapa vein memory, floor n look, metaphor times shaded privately", theme: "word", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } };
    const brand: AiCandidate = cand("google", "word");
    const llm = mockLlm([batch(5, 0), [salad, brand], [cand("beacon", "word")]]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats();
    const out = await generateAiCandidates("habit tracker", "k", { lang: "en", guard });
    expect(out.some((c) => c.label === "allur" || c.label === "google")).toBe(false);
    expect(guard.supplementDropped.meaningIncoherent + guard.supplementDropped.brandCollision).toBe(2);
    expect(guard.dropped.meaningIncoherent + guard.dropped.brandCollision).toBe(0);
    expect(guard.supplementAttempts).toBe(2);
    expect(out.some((c) => c.label === "beacon")).toBe(true);
  });

  it("zh 路线不受影响：word=0 也不触发 word 补发", async () => {
    const llm = mockLlm([batch(5, 0)]);
    vi.stubGlobal("fetch", llm.fetch);
    const guard = newGuardStats();
    await generateAiCandidates("茶叶电商", "k", { lang: "zh", guard });
    expect(llm.calls.length).toBe(1);
    expect(guard.wordSupplement).toBe(false);
    expect(guard.wordSupplementReason).toBeUndefined();
  });
});

describe("跨轮补发预算（R498，每次搜索共享）", () => {
  it(`预算常量 = ${EN_WORD_SUPPLEMENT_SEARCH_BUDGET}`, () => {
    expect(newWordSupplementBudget()).toEqual({ remaining: EN_WORD_SUPPLEMENT_SEARCH_BUDGET });
  });

  it("已补发过一次（预算剩 1）：第 2 轮命中仍补发 1 次并耗尽；第 3 轮命中只记 reason + skipped=budget，不再调用", async () => {
    const budget = newWordSupplementBudget();
    // 第 1 轮：R494 R1（7/1）→ low → 补发成功 1 次
    let llm = mockLlm([batch(7, 1), [cand("beacon", "word")]]);
    vi.stubGlobal("fetch", llm.fetch);
    const g1 = newGuardStats();
    await generateAiCandidates("habit tracker", "k", { lang: "en", guard: g1, wordSupplementBudget: budget });
    expect(llm.calls.length).toBe(2);
    expect(g1).toMatchObject({ wordSupplement: true, supplementAttempts: 1, wordSupplementReason: "low" });
    expect(budget.remaining).toBe(EN_WORD_SUPPLEMENT_SEARCH_BUDGET - 1);

    // 第 2 轮：R494 R2（5/0）→ zero → 补发全灭也只能再发 1 次（预算封顶，不再二次加硬）
    llm = mockLlm([batch(5, 0), "fail"]);
    vi.stubGlobal("fetch", llm.fetch);
    const g2 = newGuardStats();
    const out2 = await generateAiCandidates("habit tracker", "k", { lang: "en", guard: g2, wordSupplementBudget: budget });
    expect(llm.calls.length).toBe(2);
    expect(g2).toMatchObject({ wordSupplement: true, supplementAttempts: 1, wordSupplementReason: "zero" });
    expect(out2.length).toBe(5);
    expect(budget.remaining).toBe(0);

    // 第 3 轮：命中但预算耗尽 → 不调用，guard 可观测
    llm = mockLlm([batch(6, 0)]);
    vi.stubGlobal("fetch", llm.fetch);
    const g3 = newGuardStats();
    await generateAiCandidates("habit tracker", "k", { lang: "en", guard: g3, wordSupplementBudget: budget });
    expect(llm.calls.length).toBe(1);
    expect(g3).toMatchObject({ wordSupplement: false, supplementAttempts: 0, wordSupplementReason: "zero", wordSupplementSkipped: "budget" });
  });

  it("单轮内二次重试同样消耗预算：首轮全灭+重试用满 2 → 后续轮跳过", async () => {
    const budget = newWordSupplementBudget();
    let llm = mockLlm([batch(8, 0), "fail", [cand("beacon", "word")]]);
    vi.stubGlobal("fetch", llm.fetch);
    const g1 = newGuardStats();
    const out1 = await generateAiCandidates("habit tracker", "k", { lang: "en", guard: g1, wordSupplementBudget: budget });
    expect(llm.calls.length).toBe(3);
    expect(g1.supplementAttempts).toBe(2);
    expect(countThemes(out1).word).toBe(1);
    expect(budget.remaining).toBe(0);

    llm = mockLlm([batch(5, 0)]);
    vi.stubGlobal("fetch", llm.fetch);
    const g2 = newGuardStats();
    await generateAiCandidates("habit tracker", "k", { lang: "en", guard: g2, wordSupplementBudget: budget });
    expect(llm.calls.length).toBe(1);
    expect(g2.wordSupplementSkipped).toBe("budget");
  });

  it("未命中的轮次不消耗预算", async () => {
    const budget = newWordSupplementBudget();
    const llm = mockLlm([batch(12, 3)]);
    vi.stubGlobal("fetch", llm.fetch);
    await generateAiCandidates("habit tracker", "k", { lang: "en", guard: newGuardStats(), wordSupplementBudget: budget });
    expect(llm.calls.length).toBe(1);
    expect(budget.remaining).toBe(EN_WORD_SUPPLEMENT_SEARCH_BUDGET);
  });
});
