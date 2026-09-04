/**
 * 全站统一的 USD↔CNY 展示换算（四舍五入取整，与 /prices 表口径一致）。
 * 不依赖 React，SPA（lib/prices.ts）与 worker SSR（content/ssr-html.ts）共用。
 */
import { USD_TO_CNY } from "../content/tld-list";

export function toCny(usd: number): number {
  return Math.round(usd * USD_TO_CNY);
}

export function toUsd(cny: number): number {
  return Math.round(cny / USD_TO_CNY);
}
