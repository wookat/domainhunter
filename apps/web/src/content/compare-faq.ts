/**
 * TLD 对比页 FAQ（/vs/:slug）：由 TLD_COMPARES 现有文案程序化生成，
 * SPA 页面与 worker SSR（FAQPage JSON-LD）共用，保证两端问答一致。
 *
 * 答案不复制正文（verdict 段与 pickA/pickB 列表在页面上已原样可见）：
 * - 第 1 答 = metaDescription 第一句（对比结论的一句话摘要）+ 指向「怎么选」锚点（#verdict）；
 * - 第 2/3 答 = 该侧第 1 个适用场景作单句 + 指向该侧「适合选 .x 的情况」锚点（#pick-x）。
 *
 * metaDescription 里的价格是 {{price:…}} 占位符（R563），与正文/价格表同用一份 ComparePriceSnapshot 插值：
 * meta description、Article JSON-LD description、FAQ 第 1 答与 FAQPage JSON-LD 四处都经 compareMetaDescription 渲染，
 * 同页只有一套价格；调用方必须传入快照（SSR 用 KV 只读快照，客户端用注入的同一份）。
 */
import type { TldCompare } from "./compares";
import { renderPriceText, type ComparePriceSnapshot } from "./compare-prices";
import type { FaqItem } from "./faq";
import { firstSentence, stripPeriod } from "./faq";

/** 渲染后的 metaDescription（无 {{…}}；无实时价时用静态参考价加 ≈，两者皆无为「—」） */
export function compareMetaDescription(cmp: TldCompare, lang: "zh" | "en", prices: ComparePriceSnapshot): string {
  return renderPriceText(cmp[lang].metaDescription, lang, prices);
}

export type CompareFaqItem = FaqItem;

/** 对比结论卡的 id（compare-page.tsx 与 ssr-html.ts 同用） */
export const COMPARE_VERDICT_ANCHOR = "verdict";
/** 单侧 <section> 的 id */
export const comparePickAnchor = (tld: string) => `pick-${tld}`;

export function buildCompareFaq(cmp: TldCompare, lang: "zh" | "en", prices: ComparePriceSnapshot): CompareFaqItem[] {
  const loc = cmp[lang];
  const summary = firstSentence(compareMetaDescription(cmp, lang, prices), lang);
  if (lang === "en") {
    const verdictLabel = "Which to pick";
    const pick = (tld: string, items: string[]): CompareFaqItem => {
      const label = `Pick .${tld} when`;
      return {
        q: `When should I pick a .${tld} domain?`,
        a: `The top case for .${tld} — ${stripPeriod(items[0] ?? "")}. The other ${items.length - 1} .${tld} cases are listed under “${label}” on this page.`,
        link: { hash: comparePickAnchor(tld), label },
      };
    };
    return [
      {
        q: `.${cmp.a} vs .${cmp.b}: which should I choose?`,
        a: `${summary} See “${verdictLabel}” on this page for the full verdict.`,
        link: { hash: COMPARE_VERDICT_ANCHOR, label: verdictLabel },
      },
      pick(cmp.a, loc.pickA),
      pick(cmp.b, loc.pickB),
    ];
  }
  const verdictLabel = "怎么选";
  const pick = (tld: string, items: string[]): CompareFaqItem => {
    const label = `适合选 .${tld} 的情况`;
    return {
      q: `什么时候选 .${tld}？`,
      a: `.${tld} 的首选场景是「${stripPeriod(items[0] ?? "")}」；其余 ${items.length - 1} 种 .${tld} 场景见本页「${label}」。`,
      link: { hash: comparePickAnchor(tld), label },
    };
  };
  return [
    {
      q: `.${cmp.a} 和 .${cmp.b} 怎么选？`,
      a: `${summary}完整结论见本页「${verdictLabel}」一节。`,
      link: { hash: COMPARE_VERDICT_ANCHOR, label: verdictLabel },
    },
    pick(cmp.a, loc.pickA),
    pick(cmp.b, loc.pickB),
  ];
}
