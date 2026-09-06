import { useEffect, useState } from "react";

import type { ComparePriceSnapshot } from "@/content/compare-prices";
import { priceFull, priceShort, type LivePrice, type PriceMap } from "@/content/price-text";
import { toCny, toUsd } from "@/lib/currency";

export { priceFull, priceShort, toCny, toUsd, type LivePrice, type PriceMap };

/** 内容页价格：优先 SSR 注入的 KV 快照（与首屏 HTML 逐字一致）；注入缺失或 KV 为空（fetchedAt null）才用 /api/prices 拉取结果 */
export function pickPrices(snapshot: ComparePriceSnapshot | undefined, fetched: PriceMap | null): PriceMap | null {
  return snapshot && snapshot.fetchedAt !== null ? snapshot.live : fetched;
}

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
