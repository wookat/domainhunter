import type { StreamEvent } from "@/types";

// 本地演示 / 截图用：URL 带 ?mock=1 时用脚本化事件序列替代 /api/ai-search
const ITEMS = [
  { label: "zhituo", meaning: "「智拓」= 智慧 + 开拓，寓意为体制内人才智慧地拓展职业新边界，商务感强。", scores: { length: 95, readability: 90, relevance: 92, brandability: 86 }, status: "available", tld: "com" },
  { label: "newpath", meaning: "「新路径」，直白表达职业转型的新方向，可信直接。", scores: { length: 92, readability: 88, relevance: 85, brandability: 75 }, status: "taken", tld: "com" },
  { label: "wenjin", meaning: "「稳进」，稳中求进，精准贴合体制内人群求稳又想突破的心理诉求。", scores: { length: 90, readability: 82, relevance: 80, brandability: 64 }, status: "available", tld: "cn" },
  { label: "careerbridge", meaning: "职业之桥，连接体制内外两个世界，国际化表达。", scores: { length: 60, readability: 85, relevance: 88, brandability: 70 }, status: "taken", tld: "com" },
  { label: "tuoye", meaning: "「拓业」，开拓事业，动词感强，读音干脆，适合行动导向的品牌调性。", scores: { length: 92, readability: 78, relevance: 74, brandability: 62 }, status: "available", tld: "cn" },
  { label: "zhiyue", meaning: "「职跃」，职业跃迁，朗朗上口，传达向上突破的愿景。", scores: { length: 90, readability: 86, relevance: 84, brandability: 72 }, status: "available", tld: "com" },
] as const;

export function isMockEnabled(): boolean {
  return new URLSearchParams(window.location.search).has("mock");
}

export async function runMockStream(onEvent: (ev: StreamEvent) => void, signal: AbortSignal): Promise<void> {
  const sleep = (ms: number) =>
    new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, ms);
      signal.addEventListener("abort", () => {
        clearTimeout(t);
        reject(new DOMException("aborted", "AbortError"));
      });
    });

  onEvent({ type: "round", round: 1, availableCount: 0, target: 10, note: "AI 正在构思名字…" });
  await sleep(600);
  onEvent({
    type: "proposed",
    round: 1,
    items: ITEMS.map(({ label, meaning, scores }) => ({ label, meaning, scores })),
    tlds: ["com", "cn"],
  });
  let available = 0;
  for (const it of ITEMS) {
    await sleep(500);
    if (it.status === "available") available++;
    onEvent({ domain: `${it.label}.${it.tld}`, status: it.status, round: 1, meaning: it.meaning });
    await sleep(200);
    const otherTld = it.tld === "com" ? "cn" : "com";
    onEvent({ domain: `${it.label}.${otherTld}`, status: "taken", round: 1, meaning: it.meaning });
  }
  await sleep(400);
  onEvent({ type: "done", availableCount: available, target: 10, reachedTarget: false });
}
