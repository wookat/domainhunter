import { useEffect, useState } from "react";

import { tldPrice } from "@/types";
import { USD_TO_CNY } from "@/content/tld-list";

export interface LivePrice {
  registration: number;
  renewal: number;
}

export type PriceMap = Record<string, LivePrice>;

export interface PriceMeta {
  /** 后端回退了 stale 缓存（或完全无数据） */
  stale: boolean;
  /** 价格拉取时间（ms）；完全无数据时为 null */
  fetchedAt: number | null;
}

interface PricesResult {
  prices: PriceMap | null;
  meta: PriceMeta | null;
}

let cache: PricesResult | null = null;
let inflight: Promise<PricesResult> | null = null;

async function fetchPrices(): Promise<PricesResult> {
  try {
    const res = await fetch("/api/prices");
    if (!res.ok) return { prices: null, meta: null };
    const data = (await res.json()) as { prices?: PriceMap; stale?: boolean; fetchedAt?: number | null };
    const prices = data.prices && Object.keys(data.prices).length > 0 ? data.prices : null;
    return { prices, meta: { stale: data.stale === true, fetchedAt: data.fetchedAt ?? null } };
  } catch {
    return { prices: null, meta: null };
  }
}

function usePricesResult(): PricesResult | null {
  const [result, setResult] = useState<PricesResult | null>(cache);
  useEffect(() => {
    if (cache) return;
    inflight ??= fetchPrices().then((r) => {
      cache = r;
      return r;
    });
    let cancelled = false;
    void inflight.then((r) => {
      if (!cancelled) setResult(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return result;
}

/** Porkbun 实时价（模块级共享缓存）；拉取失败时返回 null，由调用方回退静态参考价 */
export function usePrices(): PriceMap | null {
  return usePricesResult()?.prices ?? null;
}

/** /api/prices 请求是否已结束（成功或失败）；false 表示仍在加载中，可渲染骨架占位 */
export function usePricesSettled(): boolean {
  return usePricesResult() !== null;
}

/** 价格元信息：stale 回退标记 + 拉取时间（仅 /prices 页轻提示用） */
export function usePriceMeta(): PriceMeta | null {
  return usePricesResult()?.meta ?? null;
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
