import type { ReactNode } from "react";
import { Check } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * 品牌卡（R468，对标 Namelix 结果卡）：纯前端、零外部请求，按名字 FNV-1a 哈希确定性派生
 * 配色 / 版式 / 字形 / 图形，同一名字永远同一外观。字体只用已自托管的 Inter / JetBrains Mono
 * 与系统衬线栈。所有配色 fg 对 bg ≥ 4.5:1、accent 对 bg ≥ 3:1（大字号），与页面主题无关。
 */

interface Palette {
  bg: string;
  bg2?: string;
  fg: string;
  accent: string;
}

// 配色取自 Namelix 结果页实测色相（黄 / 纸白 / 深紫 / 玫红 / 珊瑚 / 石灰 / 藏青 / 墨黑）并补足现代 SaaS 常见调
const PALETTES: readonly Palette[] = [
  { bg: "#FFD200", fg: "#1E3A8A", accent: "#7C2D12" },
  { bg: "#FFFFFF", fg: "#111827", accent: "#DC2626" },
  { bg: "#251D33", fg: "#F3F0FF", accent: "#C4B5FD" },
  { bg: "#E11D48", fg: "#FFFFFF", accent: "#FFE4E6" },
  { bg: "#C2410C", fg: "#FFF7ED", accent: "#FED7AA" },
  { bg: "#E7E5E4", fg: "#1C1917", accent: "#57534E" },
  { bg: "#062A44", fg: "#FFFFFF", accent: "#7DD3FC" },
  { bg: "#0A0A0A", fg: "#FFFFFF", accent: "#A3A3A3" },
  { bg: "#D1FAE5", fg: "#064E3B", accent: "#047857" },
  { bg: "#4338CA", fg: "#FFFFFF", accent: "#C7D2FE" },
  { bg: "#F7EFD9", fg: "#3F2A14", accent: "#B45309" },
  { bg: "#DBEAFE", fg: "#1E3A8A", accent: "#2563EB" },
  { bg: "#1E1B4B", bg2: "#312E81", fg: "#FFFFFF", accent: "#FDE68A" },
  { bg: "#7C2D12", bg2: "#B91C1C", fg: "#FFF7ED", accent: "#FDBA74" },
  { bg: "#052E16", bg2: "#14532D", fg: "#ECFDF5", accent: "#86EFAC" },
  { bg: "#0C4A6E", bg2: "#1E3A8A", fg: "#FFFFFF", accent: "#67E8F9" },
];

export type BrandLayout = "wordmark" | "monogram" | "duotone" | "stacked";
export type BrandType = "sans" | "serif" | "mono" | "wide";
export type BrandShape = "circle" | "square" | "squircle";
export type BrandCase = "lower" | "title" | "upper";

export interface BrandLook {
  palette: Palette;
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

export function brandLook(label: string): BrandLook {
  const name = label.toLowerCase();
  const h = fnv1a(name);
  let layout = LAYOUTS[(h >>> 4) & 3];
  // 短名（<5 字符）切不出两段，退回单色 wordmark / monogram
  if (name.length < 5 && (layout === "duotone" || layout === "stacked")) layout = (h >>> 6) & 1 ? "wordmark" : "monogram";
  return {
    palette: PALETTES[h & 15],
    layout,
    type: TYPES[(h >>> 8) & 3],
    shape: SHAPES[((h >>> 10) & 0xff) % 3],
    textCase: CASES[((h >>> 18) & 0xff) % 3],
    split: splitPoint(name),
  };
}

function applyCase(s: string, c: BrandCase): string {
  if (c === "upper") return s.toUpperCase();
  if (c === "title") return s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

function background(p: Palette): string {
  return p.bg2 ? `linear-gradient(135deg, ${p.bg}, ${p.bg2})` : p.bg;
}

const TYPE_CLASS: Record<BrandType, string> = {
  sans: "font-sans font-extrabold tracking-tight",
  serif: "font-serif font-semibold tracking-tight",
  mono: "font-mono font-bold tracking-tight",
  wide: "font-sans font-semibold uppercase tracking-[0.22em]",
};

// 每字符大致宽度（em），用于按名字长度反推字号，保证在 ~300px 宽卡内不截断
const TYPE_EM: Record<BrandType, number> = { sans: 0.6, serif: 0.52, mono: 0.62, wide: 0.9 };

const SHAPE_CLASS: Record<BrandShape, string> = {
  circle: "rounded-full",
  square: "rounded-md",
  squircle: "rounded-[30%]",
};

export type BrandCardSize = "sm" | "md" | "lg";

const SIZE_PX: Record<BrandCardSize, { width: number; max: number; min: number }> = {
  sm: { width: 240, max: 26, min: 12 },
  md: { width: 300, max: 32, min: 13 },
  lg: { width: 320, max: 36, min: 14 },
};

function fitSize(text: string, type: BrandType, size: BrandCardSize): number {
  const { width, max, min } = SIZE_PX[size];
  const usable = width * 0.8;
  const px = usable / (Math.max(text.length, 1) * TYPE_EM[type]);
  return Math.round(Math.max(min, Math.min(max, px)));
}

export function BrandCard({
  label,
  size = "md",
  available = false,
  className,
}: {
  label: string;
  size?: BrandCardSize;
  /** 可注册 → 右上角绿勾（Namelix 式），非 available 状态不显示 */
  available?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const look = brandLook(label);
  const { palette: p, layout, type, textCase } = look;
  const name = label.toLowerCase();
  const head = name.slice(0, look.split);
  const tail = name.slice(look.split);
  const typeClass = TYPE_CLASS[type];

  let body: ReactNode;
  if (layout === "monogram") {
    const word = applyCase(name, type === "wide" ? "upper" : "lower");
    const shapePx = size === "lg" ? 64 : size === "md" ? 56 : 44;
    body = (
      <div className="flex flex-col items-center gap-2">
        <span
          className={cn("grid place-items-center font-sans font-black leading-none", SHAPE_CLASS[look.shape])}
          style={{ width: shapePx, height: shapePx, background: p.accent, color: p.bg, fontSize: shapePx * 0.56 }}
        >
          {name.charAt(0).toUpperCase()}
        </span>
        <span
          className={cn("max-w-full truncate leading-none", typeClass, type !== "wide" && "tracking-[0.08em]")}
          style={{ color: p.fg, fontSize: Math.min(fitSize(word, type, size), size === "sm" ? 13 : 15) }}
        >
          {word}
        </span>
      </div>
    );
  } else if (layout === "duotone") {
    const text = applyCase(name, textCase);
    const fs = fitSize(text, type, size);
    body = (
      <span className={cn("max-w-full truncate leading-none", typeClass)} style={{ fontSize: fs }}>
        <span style={{ color: p.fg }}>{text.slice(0, look.split)}</span>
        <span className={type === "wide" ? undefined : "font-normal"} style={{ color: p.accent }}>
          {text.slice(look.split)}
        </span>
      </span>
    );
  } else if (layout === "stacked") {
    const a = applyCase(head, textCase);
    const b = applyCase(tail, textCase === "title" ? "lower" : textCase);
    const fs = Math.min(fitSize(a.length >= b.length ? a : b, type, size) * 1.25, SIZE_PX[size].max * 1.15);
    body = (
      <span className={cn("flex max-w-full flex-col items-start leading-[0.95]", typeClass)} style={{ fontSize: fs }}>
        <span className="max-w-full truncate" style={{ color: p.fg }}>
          {a}
        </span>
        <span className="max-w-full truncate font-normal" style={{ color: p.accent }}>
          {b}
        </span>
      </span>
    );
  } else {
    const text = applyCase(name, textCase);
    body = (
      <span className={cn("max-w-full truncate leading-none", typeClass)} style={{ color: p.fg, fontSize: fitSize(text, type, size) }}>
        {text}
      </span>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${t("brand.preview")}: ${label}`}
      className={cn(
        "relative grid aspect-[2/1] w-full min-w-0 place-items-center overflow-hidden rounded-lg border border-line px-5 contain-inline-size sm:aspect-[4/3]",
        size === "sm" && "aspect-[2/1] sm:aspect-[2/1]",
        className,
      )}
      style={{ background: background(p) }}
    >
      {body}
      {available && (
        <span
          className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-[#10b981] text-white shadow-sm"
          title={t("status.available")}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
    </div>
  );
}

/** 行视图用的 28px 色块：同一哈希的配色 + 首字母，让紧凑行也能一眼扫出「气质」 */
export function BrandSwatch({ label, className }: { label: string; className?: string }) {
  const { palette: p, shape } = brandLook(label);
  return (
    <span
      aria-hidden
      className={cn("grid h-7 w-7 shrink-0 place-items-center font-sans text-xs font-black leading-none", SHAPE_CLASS[shape], className)}
      style={{ background: background(p), color: p.fg }}
    >
      {label.charAt(0).toUpperCase()}
    </span>
  );
}
