/**
 * 内容页 FAQ 的公共形态：/tld /vs /guide 三类页面的 React 组件、SSR HTML（ssr-html.ts）与 FAQPage JSON-LD（worker.ts）
 * 都从同一个 build*Faq() 取答案，可见文本与 JSON-LD 逐字一致。
 *
 * 答案 `a` 是纯文本；`link` 可选，指定 `a` 里的某个片段（必须是 `a` 的子串）在可见渲染时变成页内锚点链接 `#hash`，
 * JSON-LD 仍用纯文本 `a`（FAQPage Answer.text 不带 HTML，避免各搜索引擎对富文本答案的解析差异）。
 * `hash` 必须真实存在于页面 DOM（React 与 SSR 同时给对应 <h2>/<section> 加 id），由 faq.test.ts 断言。
 */
export interface FaqItem {
  q: string;
  a: string;
  link?: { hash: string; label: string };
}

/** 把答案按 link.label（取最后一次出现，指路句总在句末）切成 [前, 链接文字, 后]；无 link 或 label 不在答案里时返回 null（整段当纯文本渲染） */
export function splitFaqAnswer(item: FaqItem): [string, string, string] | null {
  if (!item.link) return null;
  const at = item.a.lastIndexOf(item.link.label);
  if (at < 0) return null;
  return [item.a.slice(0, at), item.link.label, item.a.slice(at + item.link.label.length)];
}

/** FAQPage JSON-LD（schema.org）；`<` 转义为 \u003c 以便直接内嵌 <script> */
export function faqJsonld(items: FaqItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }).replace(/</g, "\\u003c");
}

/** 去掉列表项末尾的句号（列表项绝大多数无句末标点，个别带「。/.」；拼进句子前统一去掉再由模板补标点） */
export const stripPeriod = (s: string): string => s.replace(/[.。]+$/, "");

/**
 * 取一段文案的第一句（zh 按「。」，en 按「. 大写字母」切），保留句末标点。
 * 内容数据的 metaDescription 第一句就是该页「适合谁 / 结论」的一句话摘要，第二句是 CTA，不取。
 */
export function firstSentence(text: string, lang: "zh" | "en"): string {
  const parts = lang === "zh" ? text.split(/(?<=。)/) : text.split(/(?<=\.)\s+(?=[A-Z"“])/);
  return (parts[0] ?? text).trim();
}
