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

/**
 * 正文价格占位（R549）：compares.ts 的 verdict / pickA / pickB 不再手写「.io 首年 259 元」这类会漂移的数字，
 * 而是写占位符，SSR 与客户端用与价格表同一份 ComparePriceSnapshot 插值，保证同页正文与表格同源、水合逐字一致。
 *
 *   {{price:io:first:cny}}        .io 首年价（zh「202 元」/ en「¥202」）；:usd → 「$28」（整数美元，正文口径）
 *   {{price:io:renew:usd}}        .io 续费价
 *   {{diff:io:com:renew:cny}}     |.io − .com| 续费差额（绝对值；方向由正文措辞表达）
 *   {{ratio:io:com:renew}}        .io ÷ .com 续费倍数（zh「4.7 倍」/ en「4.7×」）
 *   {{jump:xyz}}                  .xyz 续费 ÷ 首年（「续费是首年的 N 倍」）
 *   {{sum:io:com:renew:usd}}      .io + .com 续费合计（「两个都续约 $N/年」）
 *   {{pair:net:org:renew:usd}}    两侧同一项的区间（「两者续费都在 $25–30 档」；取整后相等只显示一个值）
 *   {{cost10:ai:cny}}             .ai 十年持有成本 = 首年 + 9 × 续费（costN 通用）
 *   {{costdiff10:ai:com:cny}}     |.ai − .com| 十年持有成本差额（costdiffN 通用）
 *
 * 取值顺序与价格表一致（priceRow）：实时价 → 静态参考价（加 ≈，与表格「参考价」标注同义）→ 两者皆无输出「—」。
 */
export const PRICE_PLACEHOLDER_RE = /\{\{(price|diff|ratio|jump|sum|pair|cost\d+|costdiff\d+):([a-z0-9.:-]+)\}\}/g;

type PriceField = "first" | "renew";
type Currency = "cny" | "usd";

export type PricePlaceholder =
  | { kind: "price"; tld: string; field: PriceField; currency: Currency }
  | { kind: "diff"; a: string; b: string; field: PriceField; currency: Currency }
  | { kind: "ratio"; a: string; b: string; field: PriceField }
  | { kind: "jump"; tld: string }
  | { kind: "sum"; a: string; b: string; field: PriceField; currency: Currency }
  | { kind: "pair"; a: string; b: string; field: PriceField; currency: Currency }
  | { kind: "cost"; tld: string; years: number; currency: Currency }
  | { kind: "costdiff"; a: string; b: string; years: number; currency: Currency };

const isField = (x: string | undefined): x is PriceField => x === "first" || x === "renew";
const isCurrency = (x: string | undefined): x is Currency => x === "cny" || x === "usd";
const isTld = (x: string | undefined): x is string => typeof x === "string" && /^[a-z][a-z0-9.-]*$/.test(x);

/** 解析单个占位符；形态不合法返回 null */
export function parsePricePlaceholder(token: string): PricePlaceholder | null {
  const m = new RegExp(`^${PRICE_PLACEHOLDER_RE.source}$`).exec(token);
  if (!m) return null;
  const rawKind = m[1];
  const args = m[2].split(":");
  if (rawKind === "price" && args.length === 3 && isTld(args[0]) && isField(args[1]) && isCurrency(args[2])) {
    return { kind: "price", tld: args[0], field: args[1], currency: args[2] };
  }
  if (rawKind === "diff" && args.length === 4 && isTld(args[0]) && isTld(args[1]) && isField(args[2]) && isCurrency(args[3])) {
    return { kind: "diff", a: args[0], b: args[1], field: args[2], currency: args[3] };
  }
  if (rawKind === "ratio" && args.length === 3 && isTld(args[0]) && isTld(args[1]) && isField(args[2])) {
    return { kind: "ratio", a: args[0], b: args[1], field: args[2] };
  }
  if (rawKind === "jump" && args.length === 1 && isTld(args[0])) {
    return { kind: "jump", tld: args[0] };
  }
  if ((rawKind === "sum" || rawKind === "pair") && args.length === 4 && isTld(args[0]) && isTld(args[1]) && isField(args[2]) && isCurrency(args[3])) {
    return { kind: rawKind, a: args[0], b: args[1], field: args[2], currency: args[3] };
  }
  const cost = /^cost(\d+)$/.exec(rawKind);
  if (cost && args.length === 2 && isTld(args[0]) && isCurrency(args[1])) {
    const years = Number(cost[1]);
    if (years >= 1) return { kind: "cost", tld: args[0], years, currency: args[1] };
  }
  const costdiff = /^costdiff(\d+)$/.exec(rawKind);
  if (costdiff && args.length === 3 && isTld(args[0]) && isTld(args[1]) && isCurrency(args[2])) {
    const years = Number(costdiff[1]);
    if (years >= 1) return { kind: "costdiff", a: args[0], b: args[1], years, currency: args[2] };
  }
  return null;
}

/** 占位符涉及的 TLD（守门测试：必须是对比两侧且有静态参考价） */
export const placeholderTlds = (ph: PricePlaceholder): string[] =>
  ph.kind === "price" || ph.kind === "cost" || ph.kind === "jump" ? [ph.tld] : [ph.a, ph.b];

const NO_PRICE = "—";

function proseAmount(value: number, currency: Currency, lang: Lang, approx: boolean): string {
  const mark = approx ? "≈" : "";
  if (currency === "usd") return `${mark}$${Math.round(value)}`;
  return lang === "zh" ? `${mark}${Math.round(value)} 元` : `${mark}¥${Math.round(value)}`;
}

function ratioText(ratio: number, lang: Lang): string {
  const n = ratio >= 10 ? String(Math.round(ratio)) : (Math.round(ratio * 10) / 10).toString();
  return lang === "zh" ? `${n} 倍` : `${n}×`;
}

const cellOf = (row: PriceRow, field: PriceField): PriceCell => (field === "first" ? row.first : row.renew);
const amountOf = (cell: PriceCell, currency: Currency): number => (currency === "usd" ? cell.usd : cell.cny);
const costOf = (row: PriceRow, years: number, currency: Currency): number =>
  amountOf(row.first, currency) + (years - 1) * amountOf(row.renew, currency);

function ratioOrNone(num: number, den: number, lang: Lang, approx: boolean): string {
  if (den <= 0) return NO_PRICE;
  return `${approx ? "≈" : ""}${ratioText(num / den, lang)}`;
}

/** 渲染单个占位符（任一侧无实时价也无静态参考价 → 「—」） */
export function renderPricePlaceholder(ph: PricePlaceholder, lang: Lang, snap: ComparePriceSnapshot): string {
  const rows: PriceRow[] = [];
  for (const tld of placeholderTlds(ph)) {
    const row = priceRow(tld, snap);
    if (!row) return NO_PRICE;
    rows.push(row);
  }
  const approx = rows.some((r) => !r.live);
  switch (ph.kind) {
    case "price":
      return proseAmount(amountOf(cellOf(rows[0], ph.field), ph.currency), ph.currency, lang, approx);
    case "diff":
      return proseAmount(Math.abs(amountOf(cellOf(rows[0], ph.field), ph.currency) - amountOf(cellOf(rows[1], ph.field), ph.currency)), ph.currency, lang, approx);
    case "ratio":
      return ratioOrNone(cellOf(rows[0], ph.field).usd, cellOf(rows[1], ph.field).usd, lang, approx);
    case "jump":
      return ratioOrNone(rows[0].renew.usd, rows[0].first.usd, lang, approx);
    case "sum":
      return proseAmount(amountOf(cellOf(rows[0], ph.field), ph.currency) + amountOf(cellOf(rows[1], ph.field), ph.currency), ph.currency, lang, approx);
    case "pair": {
      const x = Math.round(amountOf(cellOf(rows[0], ph.field), ph.currency));
      const y = Math.round(amountOf(cellOf(rows[1], ph.field), ph.currency));
      if (x === y) return proseAmount(x, ph.currency, lang, approx);
      const lo = proseAmount(Math.min(x, y), ph.currency, lang, approx);
      const hi = Math.max(x, y);
      return ph.currency === "usd" || lang === "en" ? `${lo}–${hi}` : `${lo.replace(/ 元$/, "")}–${hi} 元`;
    }
    case "cost":
      return proseAmount(costOf(rows[0], ph.years, ph.currency), ph.currency, lang, approx);
    case "costdiff":
      return proseAmount(Math.abs(costOf(rows[0], ph.years, ph.currency) - costOf(rows[1], ph.years, ph.currency)), ph.currency, lang, approx);
  }
}

/** 把正文里的价格占位符全部替换为与价格表同源的文本；不合法的占位符原样保留（由测试守门） */
export function renderPriceText(text: string, lang: Lang, snap: ComparePriceSnapshot): string {
  return text.replace(PRICE_PLACEHOLDER_RE, (token) => {
    const ph = parsePricePlaceholder(token);
    return ph ? renderPricePlaceholder(ph, lang, snap) : token;
  });
}

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
