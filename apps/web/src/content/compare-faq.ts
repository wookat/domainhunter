/**
 * TLD 对比页 FAQ（/vs/:slug）：由 TLD_COMPARES 现有文案程序化生成，
 * SPA 页面与 worker SSR（FAQPage JSON-LD）共用，保证两端问答一致。
 */
import type { TldCompare } from "./compares";

export interface CompareFaqItem {
  q: string;
  a: string;
}

export function buildCompareFaq(cmp: TldCompare, lang: "zh" | "en"): CompareFaqItem[] {
  const loc = cmp[lang];
  if (lang === "en") {
    return [
      { q: `.${cmp.a} vs .${cmp.b}: which should I choose?`, a: loc.verdict },
      { q: `When should I pick a .${cmp.a} domain?`, a: `.${cmp.a} is the better fit for: ${loc.pickA.join("; ")}.` },
      { q: `When should I pick a .${cmp.b} domain?`, a: `.${cmp.b} is the better fit for: ${loc.pickB.join("; ")}.` },
    ];
  }
  return [
    { q: `.${cmp.a} 和 .${cmp.b} 怎么选？`, a: loc.verdict },
    { q: `什么时候选 .${cmp.a}？`, a: `更适合选 .${cmp.a} 的场景：${loc.pickA.join("；")}。` },
    { q: `什么时候选 .${cmp.b}？`, a: `更适合选 .${cmp.b} 的场景：${loc.pickB.join("；")}。` },
  ];
}
