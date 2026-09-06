/**
 * 行业命名指南页 FAQ（/guide/:slug）：由 INDUSTRY_GUIDES 现有文案程序化生成，
 * SPA 页面与 worker SSR（FAQPage JSON-LD）共用，保证两端问答一致。
 *
 * 答案不复制正文（intro 段、namingIdeas / pitfalls 列表在页面上已原样可见）：
 * - 第 1 答 = 第 1 条命名思路作单句 + 指向「命名思路」锚点（#ideas）；
 * - 第 2 答 = 推荐后缀及理由（后缀卡片是 <a> 链接块，正文里没有可读的重复段落，保持不变）；
 * - 第 3 答 = 第 1 个误区作单句 + 指向「常见误区」锚点（#pitfalls）。
 * 显式 faq（合规指南）原样返回。
 */
import type { FaqItem } from "./faq";
import { stripPeriod } from "./faq";
import type { IndustryGuide } from "./guides";

export type GuideFaqItem = FaqItem;

/** 命名思路 / 常见误区 <h2> 的 id（guide-page.tsx 与 ssr-html.ts 同用） */
export const GUIDE_IDEAS_ANCHOR = "ideas";
export const GUIDE_PITFALLS_ANCHOR = "pitfalls";

export function buildGuideFaq(guide: IndustryGuide, lang: "zh" | "en"): GuideFaqItem[] {
  const loc = guide[lang];
  if (loc.faq) return loc.faq;
  const tlds = guide.tlds.map((t) => `.${t.tld}`).join(lang === "en" ? ", " : "、");
  const firstIdea = stripPeriod(loc.namingIdeas[0] ?? "");
  const firstPitfall = stripPeriod(loc.pitfalls[0] ?? "");
  if (lang === "en") {
    const ideasLabel = "Naming strategies";
    const pitfallsLabel = "Common mistakes";
    return [
      {
        q: `How do I choose a brand name for ${loc.label}?`,
        a: `Start with the first strategy for naming ${loc.label} — ${firstIdea}. The other ${loc.namingIdeas.length - 1} strategies are under “${ideasLabel}” on this page.`,
        link: { hash: GUIDE_IDEAS_ANCHOR, label: ideasLabel },
      },
      { q: `Which domain extension is best for ${loc.label}?`, a: `Recommended TLDs: ${tlds}. ${guide.tlds.map((t) => `.${t.tld} — ${t.en}`).join(" ")}` },
      {
        q: `What naming mistakes should I avoid for ${loc.label}?`,
        a: `The most common mistake when naming ${loc.label} — ${firstPitfall}. The other ${loc.pitfalls.length - 1} are under “${pitfallsLabel}” on this page.`,
        link: { hash: GUIDE_PITFALLS_ANCHOR, label: pitfallsLabel },
      },
    ];
  }
  const ideasLabel = "命名思路";
  const pitfallsLabel = "常见误区";
  return [
    {
      q: `${loc.label}品牌怎么起名？`,
      a: `${loc.label}起名的第一条思路——${firstIdea}。其余 ${loc.namingIdeas.length - 1} 条见本页「${ideasLabel}」一节。`,
      link: { hash: GUIDE_IDEAS_ANCHOR, label: ideasLabel },
    },
    { q: `${loc.label}适合用什么域名后缀？`, a: `推荐后缀：${tlds}。${guide.tlds.map((t) => `.${t.tld}——${t.zh}`).join("；")}。` },
    {
      q: `${loc.label}起名有哪些常见误区？`,
      a: `${loc.label}起名最常见的误区——${firstPitfall}。其余 ${loc.pitfalls.length - 1} 个见本页「${pitfallsLabel}」一节。`,
      link: { hash: GUIDE_PITFALLS_ANCHOR, label: pitfallsLabel },
    },
  ];
}
