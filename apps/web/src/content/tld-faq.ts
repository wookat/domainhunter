/**
 * TLD 指南页 FAQ（/tld/:tld）：由 TLD_GUIDES 现有文案程序化生成，
 * SPA 页面与 worker SSR（FAQPage JSON-LD）共用，保证两端问答一致。
 *
 * 答案不复制正文段落（intro / bestFor 列表 / namingTips 列表在页面上已原样可见）：
 * - 第 1 答 = metaDescription 第一句（该 TLD「适合谁」的一句话摘要）+ 一句 bestFor 场景合成（摘要里没提到的前 2 项）；
 * - 第 3 答 = 第 1 条命名建议作单句总结 + 指向页内「命名建议」锚点（#naming）。
 */
import type { FaqItem } from "./faq";
import { firstSentence, stripPeriod } from "./faq";
import type { TldGuideLocale } from "./tlds";

export type TldFaqItem = FaqItem;

/** 命名建议 <h2> 的 id（tld-page.tsx 与 ssr-html.ts 同用） */
export const TLD_NAMING_ANCHOR = "naming";

export function buildTldFaq(tld: string, loc: TldGuideLocale, lang: "zh" | "en"): TldFaqItem[] {
  const summary = firstSentence(loc.metaDescription, lang);
  const rest = loc.bestFor.filter((b) => !summary.includes(b)).slice(0, 2);
  const tips = loc.namingTips;
  const firstTip = stripPeriod(tips[0] ?? "");
  if (lang === "en") {
    const fits = rest.length === 0 ? "" : ` Typical fits: ${rest.join(", ")}.`;
    const label = "Naming tips";
    return [
      { q: `Who is a .${tld} domain for?`, a: `${summary}${fits}` },
      {
        q: `How do I register a .${tld} domain?`,
        a: `Describe your idea on DomainHunter — the AI brainstorms names and verifies .${tld} availability live via RDAP/DNS/WHOIS. Available names link straight to a registrar with first-year and renewal prices shown, so you can spot renewal traps before buying.`,
      },
      {
        q: `How do I pick a good .${tld} name?`,
        a: `First rule for .${tld} names — ${firstTip}. The other ${tips.length - 1} tips are under “${label}” on this page.`,
        link: { hash: TLD_NAMING_ANCHOR, label },
      },
    ];
  }
  const fits = rest.length === 0 ? "" : `典型场景：${rest.join("、")}等。`;
  const label = "命名建议";
  return [
    { q: `.${tld} 域名适合谁？`, a: `${summary}${fits}` },
    {
      q: `如何注册 .${tld} 域名？`,
      a: `在 DomainHunter 描述你的想法，AI 批量构思并通过 RDAP/DNS/WHOIS 实时核验 .${tld} 可注册状态；可注册的名字直接跳转注册商，页面同时展示首年价与续费价，避免「首年便宜续费贵」的坑。`,
    },
    {
      q: `.${tld} 域名怎么起名？`,
      a: `.${tld} 起名的第一条建议——${firstTip}。其余 ${tips.length - 1} 条见本页「${label}」一节。`,
      link: { hash: TLD_NAMING_ANCHOR, label },
    },
  ];
}
