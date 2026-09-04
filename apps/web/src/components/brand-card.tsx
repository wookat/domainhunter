import type { ReactNode } from "react";
import { Check } from "lucide-react";

import { brandBackground as background, brandLook, type BrandCase, type BrandShape, type BrandType, type BrandVariant } from "@/lib/brand-look";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * 品牌卡（R468，对标 Namelix 结果卡）：纯前端、零外部请求，外观由 `@/lib/brand-look` 按名字 FNV-1a 哈希
 * 确定性派生，同一名字永远同一外观。字体只用已自托管的 Inter / JetBrains Mono 与系统衬线栈。
 * R473 `variant` 由布局层（brand-wall）统一分配，用于相邻撞色重排，同名在全页复用同一 variant。
 */

export { brandLook };
export type { BrandLayout, BrandLook, BrandType, BrandVariant } from "@/lib/brand-look";

function applyCase(s: string, c: BrandCase): string {
  if (c === "upper") return s.toUpperCase();
  if (c === "title") return s.charAt(0).toUpperCase() + s.slice(1);
  return s;
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
  variant = 0,
  className,
}: {
  label: string;
  size?: BrandCardSize;
  /** 可注册 → 右上角绿勾（Namelix 式），非 available 状态不显示 */
  available?: boolean;
  /** 配色变体（布局层撞色重排用），同名全页须传同一值 */
  variant?: BrandVariant;
  className?: string;
}) {
  const { t } = useI18n();
  const look = brandLook(label, variant);
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
      data-brand-look={`${look.paletteIndex}/${layout}/${type}/${look.shape}/${textCase}/${look.split}`}
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
export function BrandSwatch({ label, variant = 0, className }: { label: string; variant?: BrandVariant; className?: string }) {
  const { palette: p, shape } = brandLook(label, variant);
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

/** 紧凑行用的 12px 品牌色点（主背景色 / 渐变首色），不占行高，只给一眼可扫的品牌信号 */
export function BrandDot({ label, variant = 0, className }: { label: string; variant?: BrandVariant; className?: string }) {
  const { palette: p } = brandLook(label, variant);
  return <span aria-hidden data-brand-dot className={cn("h-3 w-3 shrink-0 rounded-full border border-line-strong", className)} style={{ background: p.bg }} />;
}
