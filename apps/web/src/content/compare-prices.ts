/**
 * /vs 对比页「价格与 5 年持有成本」数据表模型（R521）。
 * 纯函数、无 React：worker SSR（ssr-html.ts）与客户端（compare-page.tsx）共用，
 * 两端从同一份 ComparePriceSnapshot 生成逐字一致的单元格文本，水合零跳变。
 *
 * 口径与 /prices 页一致（lib/prices.ts / prices-page.tsx）：
 * - 实时价（Porkbun，美元）优先，人民币按 USD_TO_CNY 估算；
 * - 无实时报价回退 types.ts 静态参考价（人民币），美元按同汇率换算并加 ≈；
 * - 5 年持有成本 = 首年 + 4 × 续费；差额 = A − B（正数表示 A 更贵）。
 */
import { toCny, toUsd } from "../lib/currency";
import { USD_TO_CNY } from "./tld-list";
import { tldPrice } from "../types";

type Lang = "zh" | "en";

export interface SnapshotPrice {
  registration: number;
  renewal: number;
}

/** SSR 注入客户端的价格快照：只含对比两侧的实时价 + /api/prices 的 fetchedAt/stale */
export interface ComparePriceSnapshot {
  live: Record<string, SnapshotPrice>;
  fetchedAt: number | null;
  stale: boolean;
}

export interface PriceCell {
  /** 美元（实时价保留两位小数；静态参考价为整数换算值） */
  usd: number;
  /** 人民币（实时价按汇率估算取整；静态参考价为原始标价） */
  cny: number;
  /** 含静态参考价成分（展示加 ≈） */
  approx: boolean;
  usdText: string;
  cnyText: string;
}

export interface PriceRow {
  tld: string;
  live: boolean;
  first: PriceCell;
  renew: PriceCell;
  fiveYear: PriceCell;
}

export interface PriceDiffRow {
  label: string;
  first: PriceCell;
  renew: PriceCell;
  fiveYear: PriceCell;
}

export interface ComparePriceTable {
  heading: string;
  caption: string;
  headers: [string, string, string, string];
  /** 静态参考价行的行内标注（如「参考价」） */
  refBadge: string;
  rows: PriceRow[];
  /** 两侧都有价格时才有差额行 */
  diff: PriceDiffRow | null;
  notes: string[];
}

export type ComparePriceView = { kind: "table"; table: ComparePriceTable } | { kind: "empty"; heading: string; note: string };

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** 5 年总持有成本 = 首年 + 4 × 续费（同币种） */
export function fiveYearCost(first: number, renew: number): number {
  return round2(first + 4 * renew);
}

/** 按 /api/prices 负载 JSON 抽出两侧快照；负载缺失（KV 无数据）→ fetchedAt=null、stale=true（与 /api/prices 空兜底一致） */
export function snapshotFromPayload(payload: string | null, tlds: readonly string[]): ComparePriceSnapshot {
  const empty: ComparePriceSnapshot = { live: {}, fetchedAt: null, stale: true };
  if (!payload) return empty;
  let parsed: { prices?: Record<string, Partial<SnapshotPrice>>; fetchedAt?: unknown; stale?: unknown };
  try {
    parsed = JSON.parse(payload) as typeof parsed;
  } catch {
    return empty;
  }
  const live: Record<string, SnapshotPrice> = {};
  for (const tld of tlds) {
    const p = parsed.prices?.[tld];
    if (p && typeof p.registration === "number" && typeof p.renewal === "number") live[tld] = { registration: p.registration, renewal: p.renewal };
  }
  return { live, fetchedAt: typeof parsed.fetchedAt === "number" ? parsed.fetchedAt : null, stale: parsed.stale === true };
}

/** 美元文本：与 /prices 一致，直接输出数值（实时价 11.08 / 11.5，静态换算值为整数），静态加 ≈ */
function usdText(usd: number, approx: boolean, signed: boolean): string {
  const abs = Math.abs(usd);
  const sign = !signed || usd === 0 ? "" : usd > 0 ? "+" : "−";
  return `${approx ? "≈" : ""}${sign}$${abs}`;
}

function cnyText(cny: number, signed: boolean): string {
  const abs = Math.abs(cny);
  const sign = !signed || cny === 0 ? "" : cny > 0 ? "+" : "−";
  return `${sign}¥${abs}`;
}

function cell(usd: number, cny: number, approx: boolean, signed = false): PriceCell {
  return { usd, cny, approx, usdText: usdText(usd, approx, signed), cnyText: cnyText(cny, signed) };
}

/** 单侧行：实时价（美元为准，人民币估算）→ 静态参考价（人民币为准，美元换算加 ≈）→ 两者皆无返回 null */
export function priceRow(tld: string, snap: ComparePriceSnapshot): PriceRow | null {
  const p = snap.live[tld];
  if (p) {
    const first = round2(p.registration);
    const renew = round2(p.renewal);
    const five = fiveYearCost(first, renew);
    return { tld, live: true, first: cell(first, toCny(first), false), renew: cell(renew, toCny(renew), false), fiveYear: cell(five, toCny(five), false) };
  }
  const s = tldPrice(tld);
  if (!s) return null;
  const five = fiveYearCost(s.first, s.renew);
  return { tld, live: false, first: cell(toUsd(s.first), s.first, true), renew: cell(toUsd(s.renew), s.renew, true), fiveYear: cell(toUsd(five), five, true) };
}

function diffCell(a: PriceCell, b: PriceCell): PriceCell {
  return cell(round2(a.usd - b.usd), a.cny - b.cny, a.approx || b.approx, true);
}

/** fetchedAt 的确定性文本（UTC，分钟精度）：SSR 与客户端不依赖本地时区/当前时间，保证逐字一致 */
export function formatFetchedAt(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

const STR = {
  zh: {
    heading: "价格与 5 年持有成本",
    caption: (a: string, b: string) => `.${a} vs .${b} 首年价、续费价与 5 年总持有成本对比（美元为准，人民币按汇率 ${USD_TO_CNY} 估算）`,
    headers: ["后缀", "注册/首年", "续费/年", "5 年持有成本"] as [string, string, string, string],
    refBadge: "参考价",
    diffLabel: (a: string, b: string) => `差额（.${a} − .${b}）`,
    formula: "5 年持有成本 = 首年价 + 4 × 续费价；差额为正表示前者更贵。",
    sourceLive: (at: string) => `实时价来自 Porkbun（${at} 拉取），人民币按汇率 ${USD_TO_CNY} 估算；带 ≈ 为静态参考价，非实时报价。不同注册商价格有差异，以注册商页面为准。`,
    sourceStaleCached: (at: string) => `实时报价暂不可用，以上为 ${at} 的缓存价，人民币按汇率 ${USD_TO_CNY} 估算；带 ≈ 为静态参考价。不同注册商价格有差异，以注册商页面为准。`,
    sourceNoData: `实时报价暂不可用，当前显示静态参考价（≈），人民币按汇率 ${USD_TO_CNY} 估算。不同注册商价格有差异，以注册商页面为准。`,
    oneMissing: (tld: string) => `.${tld} 暂无实时报价与静态参考价，未计算差额。`,
    empty: (a: string, b: string) => `.${a} 与 .${b} 暂无实时报价与静态参考价，本页不显示价格对比表；其他后缀价格见价格总览。`,
  },
  en: {
    heading: "Pricing & 5-year cost of ownership",
    caption: (a: string, b: string) => `.${a} vs .${b}: first-year, renewal and 5-year total cost (USD; CNY estimated at ${USD_TO_CNY})`,
    headers: ["TLD", "Register / 1st yr", "Renew / yr", "5-yr total cost"] as [string, string, string, string],
    refBadge: "reference",
    diffLabel: (a: string, b: string) => `Difference (.${a} − .${b})`,
    formula: "5-yr total cost = first-year price + 4 × renewal; a positive difference means the former costs more.",
    sourceLive: (at: string) => `Live prices from Porkbun (fetched ${at}); CNY estimated at ${USD_TO_CNY}. ≈ marks static reference prices, not live quotes. Registrar prices vary — confirm on the registrar page.`,
    sourceStaleCached: (at: string) => `Live quotes are temporarily unavailable — showing cached prices from ${at}; CNY estimated at ${USD_TO_CNY}. ≈ marks static reference prices. Registrar prices vary — confirm on the registrar page.`,
    sourceNoData: `Live quotes are temporarily unavailable — showing static reference prices (≈); CNY estimated at ${USD_TO_CNY}. Registrar prices vary — confirm on the registrar page.`,
    oneMissing: (tld: string) => `.${tld} has neither a live quote nor a static reference price, so no difference is computed.`,
    empty: (a: string, b: string) => `Neither .${a} nor .${b} has a live quote or static reference price, so the price table is not shown; see the price overview for other TLDs.`,
  },
} as const;

/** 数据表视图：两侧都无价 → empty（整表不渲染 + 一句说明）；否则 table（缺一侧时无差额行 + 说明） */
export function buildComparePriceView(a: string, b: string, lang: Lang, snap: ComparePriceSnapshot): ComparePriceView {
  const s = STR[lang];
  const rowA = priceRow(a, snap);
  const rowB = priceRow(b, snap);
  if (!rowA && !rowB) return { kind: "empty", heading: s.heading, note: s.empty(a, b) };
  const rows = [rowA, rowB].filter((r): r is PriceRow => r !== null);
  const diff: PriceDiffRow | null =
    rowA && rowB ? { label: s.diffLabel(a, b), first: diffCell(rowA.first, rowB.first), renew: diffCell(rowA.renew, rowB.renew), fiveYear: diffCell(rowA.fiveYear, rowB.fiveYear) } : null;
  const notes: string[] = [s.formula];
  if (snap.fetchedAt === null) notes.push(s.sourceNoData);
  else if (snap.stale) notes.push(s.sourceStaleCached(formatFetchedAt(snap.fetchedAt)));
  else notes.push(s.sourceLive(formatFetchedAt(snap.fetchedAt)));
  if (!rowA) notes.push(s.oneMissing(a));
  if (!rowB) notes.push(s.oneMissing(b));
  return {
    kind: "table",
    table: { heading: s.heading, caption: s.caption(a, b), headers: s.headers, refBadge: s.refBadge, rows, diff, notes },
  };
}
