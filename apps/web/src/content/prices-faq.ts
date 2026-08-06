/**
 * 价格总览页 FAQ（/prices）：SPA 页面与 worker SSR（FAQPage JSON-LD）共用，
 * 保证两端问答一致。
 */
export interface PricesFaqItem {
  q: string;
  a: string;
}

export function buildPricesFaq(lang: "zh" | "en"): PricesFaqItem[] {
  if (lang === "en") {
    return [
      {
        q: "Why is the renewal price higher than the first-year price?",
        a: "Many registries and registrars discount the first year to win customers, then charge the regular price from year two. Some suffixes renew at several times the promo price — rows marked with the renews↑ badge renew at 3×+ their first-year price, so always compare the renewal column before buying.",
      },
      {
        q: "Which domain extension is the cheapest to keep long-term?",
        a: "Sort the table by Renew / yr instead of the first-year price: the long-term cost of a domain is its yearly renewal. Classic suffixes like .com and .net usually have stable, moderate renewals, while deeply discounted ones (e.g. .shop, .top, .fun) can renew far above their promo price.",
      },
      {
        q: "Where do these prices come from?",
        a: "Live prices come from the Porkbun API and refresh daily; suffixes without a live quote show a static reference price marked with ≈. Prices vary between registrars — always confirm on the registrar page before paying.",
      },
    ];
  }
  return [
    {
      q: "为什么续费价比首年价贵？",
      a: "很多注册局/注册商用首年低价拉新，从第二年起按原价收费，部分后缀续费是首年价的好几倍。表中带「续费↑」徽章的行代表续费达首年价 3 倍以上，下单前一定先看续费列。",
    },
    {
      q: "哪个后缀长期持有最便宜？",
      a: "按「续费/年」排序而不是首年价：域名的长期成本就是每年的续费。.com、.net 等经典后缀续费通常稳定适中，而折扣极大的后缀（如 .shop、.top、.fun）续费可能远高于首年促销价。",
    },
    {
      q: "这些价格从哪里来？",
      a: "实时价来自 Porkbun API，每日刷新；无实时报价的后缀显示带 ≈ 的静态参考价。不同注册商价格有差异，付款前以注册商页面为准。",
    },
  ];
}
