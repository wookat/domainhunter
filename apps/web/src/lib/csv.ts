import { toCny, type PriceMap } from "@/lib/prices";
import { tldPrice, type Status } from "@/types";

/** 价格来源：Porkbun 实时报价 / 静态人民币参考价；不可注册或无价时为空 */
export type CsvPriceSource = "porkbun_live" | "static_reference";

/** 结果 CSV 的数值价格列（顺序即列序）；纯数字不加引号/货币符号，Excel/Numbers/WPS 才会识别为数值 */
export const CSV_PRICE_COLUMNS = ["price_first_year_cny", "price_renew_cny", "price_first_year_usd", "price_renew_usd", "price_source"] as const;

export type CsvPriceCells = [string, string, string, string, CsvPriceSource | ""];

const empty = (): CsvPriceCells => ["", "", "", "", ""];

/** 有限数字 → 十进制字符串；其余为空 */
export function csvNumber(n: number | undefined): string {
  return typeof n === "number" && Number.isFinite(n) ? String(n) : "";
}

/**
 * 实时价：USD 原值 + 汇率换算的整数 CNY；静态价只有人民币，USD 两列留空（不造换算数）。
 * 只对 available 行输出；taken/unknown 行注册价无意义，五列全空。
 */
export function priceCsvCells(tld: string, status: Status | undefined, prices: PriceMap | null): CsvPriceCells {
  if (status !== "available") return empty();
  const p = prices?.[tld];
  if (p) return [csvNumber(toCny(p.registration)), csvNumber(toCny(p.renewal)), csvNumber(p.registration), csvNumber(p.renewal), "porkbun_live"];
  const s = tldPrice(tld);
  if (s) return [csvNumber(s.first), csvNumber(s.renew), "", "", "static_reference"];
  return empty();
}
