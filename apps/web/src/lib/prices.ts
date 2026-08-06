import { useEffect, useState } from "react";

import { tldPrice } from "@/types";
import { USD_TO_CNY } from "@/content/tlds";

export interface LivePrice {
  registration: number;
  renewal: number;
}

export type PriceMap = Record<string, LivePrice>;

let cache: PriceMap | null = null;
let inflight: Promise<PriceMap | null> | null = null;

async function fetchPrices(): Promise<PriceMap | null> {
  try {
    const res = await fetch("/api/prices");
    if (!res.ok) return null;
    const data = (await res.json()) as { prices?: PriceMap };
    return data.prices ?? null;
  } catch {
    return null;
  }
}

/** Porkbun 实时价（模块级共享缓存）；拉取失败时返回 null，由调用方回退静态参考价 */
export function usePrices(): PriceMap | null {
  const [prices, setPrices] = useState<PriceMap | null>(cache);
  useEffect(() => {
    if (cache) return;
    inflight ??= fetchPrices().then((p) => {
      cache = p;
      return p;
    });
    let cancelled = false;
    void inflight.then((p) => {
      if (!cancelled && p) setPrices(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return prices;
}

export function toCny(usd: number): number {
  return Math.round(usd * USD_TO_CNY);
}

export function toUsd(cny: number): number {
  return Math.round(cny / USD_TO_CNY);
}

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
