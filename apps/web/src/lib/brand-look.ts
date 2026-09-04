/**
 * 品牌卡外观派生（R468，纯函数、零 React 依赖，供 verify 脚本直接打包）：按名字 FNV-1a 哈希确定性
 * 派生配色 / 版式 / 字形 / 图形，同一名字永远同一外观。所有配色 fg / accent 对 bg 均 ≥ 4.5:1（accent 在 duotone/stacked 中作正文色）
 * （大字号），与页面主题无关。
 *
 * R473 `variant`（0/1/2）：只让配色在同一名字内确定性轮换（步长 5 与 16 互质，三个变体两两不同色），
 * 版式 / 字形 / 图形 / 大小写不变——供布局层做相邻撞色重排，「同名同外观」由布局层全页复用同一 variant 保证。
 */

export interface Palette {
  bg: string;
  bg2?: string;
  fg: string;
  accent: string;
}

// 配色取自 Namelix 结果页实测色相（黄 / 纸白 / 深紫 / 玫红 / 珊瑚 / 石灰 / 藏青 / 墨黑）并补足现代 SaaS 常见调
export const PALETTES: readonly Palette[] = [
  { bg: "#FFD200", fg: "#1E3A8A", accent: "#7C2D12" },
  { bg: "#FFFFFF", fg: "#111827", accent: "#DC2626" },
  { bg: "#251D33", fg: "#F3F0FF", accent: "#C4B5FD" },
  { bg: "#BE123C", fg: "#FFFFFF", accent: "#FFE4E6" },
  { bg: "#9A3412", fg: "#FFF7ED", accent: "#FED7AA" },
  { bg: "#E7E5E4", fg: "#1C1917", accent: "#57534E" },
  { bg: "#062A44", fg: "#FFFFFF", accent: "#7DD3FC" },
  { bg: "#0A0A0A", fg: "#FFFFFF", accent: "#A3A3A3" },
  { bg: "#D1FAE5", fg: "#064E3B", accent: "#047857" },
  { bg: "#4338CA", fg: "#FFFFFF", accent: "#C7D2FE" },
  { bg: "#F7EFD9", fg: "#3F2A14", accent: "#92400E" },
  { bg: "#DBEAFE", fg: "#1E3A8A", accent: "#1D4ED8" },
  { bg: "#1E1B4B", bg2: "#312E81", fg: "#FFFFFF", accent: "#FDE68A" },
  { bg: "#7C2D12", bg2: "#B91C1C", fg: "#FFF7ED", accent: "#FED7AA" },
  { bg: "#052E16", bg2: "#14532D", fg: "#ECFDF5", accent: "#86EFAC" },
  { bg: "#0C4A6E", bg2: "#1E3A8A", fg: "#FFFFFF", accent: "#67E8F9" },
];

export type BrandLayout = "wordmark" | "monogram" | "duotone" | "stacked";
export type BrandType = "sans" | "serif" | "mono" | "wide";
export type BrandShape = "circle" | "square" | "squircle";
export type BrandCase = "lower" | "title" | "upper";
export type BrandVariant = 0 | 1 | 2;

export const BRAND_VARIANTS: readonly BrandVariant[] = [0, 1, 2];

export interface BrandLook {
  palette: Palette;
  /** 配色在 PALETTES 中的下标（布局层撞色比较用） */
  paletteIndex: number;
  layout: BrandLayout;
  type: BrandType;
  shape: BrandShape;
  textCase: BrandCase;
  /** 双色 / 双行版式的切分位（字符下标） */
  split: number;
}

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

const VOWELS = "aeiouy";

/** 找最接近中点的音节边界，模拟复合词切分：优先「元音 辅音|辅音」（cast|loom、pen|fold），
 *  其次「元音|辅音」（lu|mora），都没有则取中点 */
function splitPoint(label: string): number {
  const n = label.length;
  const mid = n / 2;
  let best = Math.floor(mid);
  let bestCost = Number.POSITIVE_INFINITY;
  for (let k = 2; k <= n - 2; k++) {
    const before = label[k - 2];
    const prev = label[k - 1];
    const cur = label[k];
    const isV = (c: string) => VOWELS.includes(c);
    let penalty: number;
    if (!isV(prev) && !isV(cur) && isV(before)) penalty = 0;
    else if (isV(prev) && !isV(cur)) penalty = 1;
    else continue;
    const cost = Math.abs(k - mid) + penalty;
    if (cost < bestCost) {
      bestCost = cost;
      best = k;
    }
  }
  return best;
}

const LAYOUTS: readonly BrandLayout[] = ["wordmark", "monogram", "duotone", "stacked"];
const TYPES: readonly BrandType[] = ["sans", "serif", "mono", "wide"];
const SHAPES: readonly BrandShape[] = ["circle", "square", "squircle"];
const CASES: readonly BrandCase[] = ["lower", "title", "upper"];

const VARIANT_STRIDE = 5;

/** 名字 + 变体 → 配色下标；variant 0 与 R468 完全一致 */
export function paletteIndexOf(label: string, variant: BrandVariant = 0): number {
  return (fnv1a(label.toLowerCase()) + variant * VARIANT_STRIDE) & 15;
}

export function brandLook(label: string, variant: BrandVariant = 0): BrandLook {
  const name = label.toLowerCase();
  const h = fnv1a(name);
  let layout = LAYOUTS[(h >>> 4) & 3];
  // 短名（<5 字符）切不出两段，退回单色 wordmark / monogram
  if (name.length < 5 && (layout === "duotone" || layout === "stacked")) layout = (h >>> 6) & 1 ? "wordmark" : "monogram";
  const paletteIndex = (h + variant * VARIANT_STRIDE) & 15;
  return {
    palette: PALETTES[paletteIndex],
    paletteIndex,
    layout,
    type: TYPES[(h >>> 8) & 3],
    shape: SHAPES[((h >>> 10) & 0xff) % 3],
    textCase: CASES[((h >>> 18) & 0xff) % 3],
    split: splitPoint(name),
  };
}

export function brandBackground(p: Palette): string {
  return p.bg2 ? `linear-gradient(135deg, ${p.bg}, ${p.bg2})` : p.bg;
}
