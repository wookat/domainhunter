/**
 * TLD 指南页 FAQ（/tld/:tld）：由 TLD_GUIDES 现有文案程序化生成，
 * SPA 页面与 worker SSR（FAQPage JSON-LD）共用，保证两端问答一致。
 */
import type { TldGuideLocale } from "./tlds";

export interface TldFaqItem {
  q: string;
  a: string;
}

export function buildTldFaq(tld: string, loc: TldGuideLocale, lang: "zh" | "en"): TldFaqItem[] {
  if (lang === "en") {
    return [
      { q: `Who is a .${tld} domain for?`, a: `${loc.intro} Typical fits: ${loc.bestFor.join("; ")}.` },
      {
        q: `How do I register a .${tld} domain?`,
        a: `Describe your idea on DomainHunter — the AI brainstorms names and verifies .${tld} availability live via RDAP/DNS/WHOIS. Available names link straight to a registrar with first-year and renewal prices shown, so you can spot renewal traps before buying.`,
      },
      { q: `How do I pick a good .${tld} name?`, a: loc.namingTips.join(" ") },
    ];
  }
  return [
    { q: `.${tld} 域名适合谁？`, a: `${loc.intro} 典型场景：${loc.bestFor.join("；")}。` },
    {
      q: `如何注册 .${tld} 域名？`,
      a: `在 DomainHunter 描述你的想法，AI 批量构思并通过 RDAP/DNS/WHOIS 实时核验 .${tld} 可注册状态；可注册的名字直接跳转注册商，页面同时展示首年价与续费价，避免「首年便宜续费贵」的坑。`,
    },
    { q: `.${tld} 域名怎么起名？`, a: loc.namingTips.join(" ") },
  ];
}
