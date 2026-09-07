/**
 * TLD 价格文案（纯函数、无 React）：worker SSR（ssr-html.ts）与客户端（lib/prices.ts 再导出）共用同一实现，
 * 同一份价格映射两端产出逐字一致的文本。实时价（Porkbun 美元）优先，无实时报价回退 types.ts 静态参考价并保留「参考」标识。
 */
import { toCny, toUsd } from "../lib/currency";
import { tldPrice } from "../types";

export interface LivePrice {
  registration: number;
  renewal: number;
}

export type PriceMap = Record<string, LivePrice>;

/** 紧凑价：实时价优先（Porkbun 美元），失败回退静态参考价；按界面语言展示主币种 */
export function priceShort(tld: string, lang: "zh" | "en", prices: PriceMap | null): string | undefined {
  const p = prices?.[tld];
  if (p) return lang === "en" ? `1st yr $${p.registration}` : `首年 $${p.registration} ≈¥${toCny(p.registration)}`;
  const s = tldPrice(tld);
  if (!s) return undefined;
  return lang === "en" ? `1st yr ≈$${toUsd(s.first)}` : `首年 ¥${s.first}`;
}

/** 完整价（tooltip）：带来源标记——Porkbun 实时价 vs 静态参考价 */
export function priceFull(tld: string, lang: "zh" | "en", prices: PriceMap | null): string | undefined {
  const p = prices?.[tld];
  if (p) {
    return lang === "en"
      ? `Porkbun live: $${p.registration} 1st yr (≈¥${toCny(p.registration)}) · renews $${p.renewal}/yr (¥ est. at 7.2)`
      : `Porkbun 实时价：首年 $${p.registration}（≈¥${toCny(p.registration)}）· 续费 $${p.renewal}/年（汇率 7.2 估算）`;
  }
  const s = tldPrice(tld);
  if (!s) return undefined;
  return lang === "en"
    ? `Static reference: ≈$${toUsd(s.first)} (¥${s.first}) 1st yr · ¥${s.renew}/yr renewal · not a live quote`
    : `静态参考价：首年 ¥${s.first} · 续费 ¥${s.renew}/年 · 非实时报价`;
}
