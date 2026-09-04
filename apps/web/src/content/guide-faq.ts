/**
 * 行业命名指南页 FAQ（/guide/:slug）：由 INDUSTRY_GUIDES 现有文案程序化生成，
 * SPA 页面与 worker SSR（FAQPage JSON-LD）共用，保证两端问答一致。
 */
import type { IndustryGuide } from "./guides";

export interface GuideFaqItem {
  q: string;
  a: string;
}

export function buildGuideFaq(guide: IndustryGuide, lang: "zh" | "en"): GuideFaqItem[] {
  const loc = guide[lang];
  if (loc.faq) return loc.faq;
  const tlds = guide.tlds.map((t) => `.${t.tld}`).join(lang === "en" ? ", " : "、");
  if (lang === "en") {
    return [
      { q: `How do I choose a brand name for ${loc.label}?`, a: `${loc.intro} Practical approaches: ${loc.namingIdeas.join(" ")}` },
      { q: `Which domain extension is best for ${loc.label}?`, a: `Recommended TLDs: ${tlds}. ${guide.tlds.map((t) => `.${t.tld} — ${t.en}`).join(" ")}` },
      { q: `What naming mistakes should I avoid for ${loc.label}?`, a: loc.pitfalls.join(" ") },
    ];
  }
  return [
    { q: `${loc.label}品牌怎么起名？`, a: `${loc.intro} 可操作的思路：${loc.namingIdeas.join("")}` },
    { q: `${loc.label}适合用什么域名后缀？`, a: `推荐后缀：${tlds}。${guide.tlds.map((t) => `.${t.tld}——${t.zh}`).join("；")}。` },
    { q: `${loc.label}起名有哪些常见误区？`, a: loc.pitfalls.join("") },
  ];
}
