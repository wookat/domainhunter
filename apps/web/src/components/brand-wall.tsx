import { useState } from "react";
import { Bookmark, BookmarkCheck, Check, ChevronDown, Lock } from "lucide-react";

import { BrandCard, type BrandVariant } from "@/components/brand-card";
import { CopyButton, MeaningText, RegisterMenu } from "@/components/domain-row";
import { ScoreBars } from "@/components/score-bars";
import type { LabelGroup } from "@/lib/brand-wall";
import { useI18n, type Lang } from "@/lib/i18n";
import { priceFull, priceShort, toUsd, usePrices, type PriceMap } from "@/lib/prices";
import { scoreBadgeClass, tldPrice, totalScore, type Row } from "@/types";
import { cn } from "@/lib/utils";

/**
 * 品牌卡墙（R473）：Top Picks / Grid 按 label 分组，一名一卡，同名多 TLD 以胶囊列在卡下。
 * 胶囊按钮视觉 32px、命中区 44px（外层 h-11，内层 span 承担视觉）。
 */

/** 胶囊里的短价：实时价 $X，静态参考价 ¥X（en：≈$X），无价不显示 */
function pricePill(tld: string, lang: Lang, prices: PriceMap | null): string | undefined {
  const p = prices?.[tld];
  if (p) return `$${p.registration}`;
  const s = tldPrice(tld);
  if (!s) return undefined;
  return lang === "en" ? `≈$${toUsd(s.first)}` : `¥${s.first}`;
}

const PILL_OUTER = "group/pill grid h-11 shrink-0 place-items-center px-0.5 focus-visible:outline-none";
const PILL_INNER =
  "tnum inline-flex h-8 items-center gap-1 rounded-full border px-2.5 font-mono text-[11px] font-semibold transition-colors group-focus-visible/pill:ring-2 group-focus-visible/pill:ring-ring";

function PillLabel({ row, price, selected }: { row: Row; price?: string; selected?: boolean }) {
  const { t } = useI18n();
  const available = row.status === "available";
  return (
    <span
      className={cn(
        PILL_INNER,
        selected ? "border-brand-line bg-brand-dim text-brand" : "border-line bg-bg1 text-txt1 group-hover/pill:border-brand-line group-hover/pill:text-brand",
      )}
    >
      .{row.tld}
      {available ? (
        <Check className="h-3 w-3 text-brand" strokeWidth={3} aria-label={t("status.available")} />
      ) : (
        <span className="text-amber2" title={t("status.unknown")}>
          ?
        </span>
      )}
      {price && <span className={cn("font-normal", selected ? "text-txt1" : "text-txt2")}>{price}</span>}
    </span>
  );
}

/** Top Picks 用：每个胶囊 = 该域名的注册商菜单（沿用 RegisterMenu） */
function RegisterPills({ rows }: { rows: Row[] }) {
  const { t } = useI18n();
  return (
    <div role="group" aria-label={t("brand.tlds")} className="-my-1.5 flex flex-wrap items-center gap-x-1 gap-y-0" data-tld-pills="register">
      {rows.map((r) => (
        <RegisterMenu key={r.domain} domain={r.domain}>
          <button type="button" title={t("brand.tldRegister", { d: r.domain })} aria-label={t("brand.tldRegister", { d: r.domain })} className={PILL_OUTER}>
            <PillLabel row={r} />
          </button>
        </RegisterMenu>
      ))}
    </div>
  );
}

/** Grid 用：胶囊切换「当前操作对象」域名，带首年价 */
function SelectPills({ rows, selected, onSelect }: { rows: Row[]; selected: string; onSelect: (domain: string) => void }) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  return (
    <div role="group" aria-label={t("brand.tlds")} className="-my-1.5 flex flex-wrap items-center gap-x-1 gap-y-0" data-tld-pills="select">
      {rows.map((r) => (
        <button
          key={r.domain}
          type="button"
          aria-pressed={r.domain === selected}
          title={r.domain === selected ? t("brand.tldSelected", { d: r.domain }) : `${t("brand.tldSelect", { d: r.domain })}${priceFull(r.tld, lang, prices) ? ` · ${priceFull(r.tld, lang, prices)}` : ""}`}
          onClick={() => onSelect(r.domain)}
          className={PILL_OUTER}
        >
          <PillLabel row={r} price={pricePill(r.tld, lang, prices)} selected={r.domain === selected} />
        </button>
      ))}
    </div>
  );
}

function DomainTitle({ row, className }: { row: Row; className?: string }) {
  return (
    <span className={cn("truncate font-mono", className)}>
      {row.label}
      <span className="text-txt2">.{row.tld}</span>
    </span>
  );
}

export function TopPickCard({
  group,
  rank,
  variant,
  locked,
  onToggleLock,
  favorite,
  onToggleFavorite,
}: {
  group: LabelGroup<Row>;
  rank: number;
  variant: BrandVariant;
  locked: boolean;
  onToggleLock: (domain: string) => void;
  favorite: boolean;
  onToggleFavorite: (row: Row) => void;
}) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const row = group.rows[0];
  const score = row.scores ? totalScore(row.scores) : 0;
  return (
    <div data-brand-card={row.label} data-domain-primary={row.domain} className={cn("rounded-xl border bg-bg1 p-5", rank === 0 ? "border-brand-line" : "border-line")}>
      <div className="flex items-start justify-between">
        <span className={cn("tnum rounded-md px-2 py-0.5 font-mono text-sm font-bold", scoreBadgeClass(score))}>{score}</span>
        <div className="flex gap-1">
          <button
            title={t("results.lockTitle")}
            aria-pressed={locked}
            onClick={() => onToggleLock(row.domain)}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-md border",
              locked ? "border-brand-line text-brand" : "border-line text-txt2 hover:text-txt0",
            )}
          >
            <Lock className="h-3.5 w-3.5" />
          </button>
          <CopyButton domain={row.domain} className="rounded-md border border-line" />
          <button
            title={favorite ? t("results.favRemove") : t("results.favAdd")}
            aria-pressed={favorite}
            onClick={() => onToggleFavorite(row)}
            className={cn("grid h-8 w-8 place-items-center rounded-md border border-line", favorite ? "text-brand" : "text-txt2 hover:text-txt0")}
          >
            {favorite ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      <div className="mt-3">
        <BrandCard label={row.label} size="lg" variant={variant} available={row.status === "available"} />
      </div>
      <DomainTitle row={row} className="mt-3 block text-2xl font-bold tracking-tight" />
      {group.rows.length > 1 && (
        <div className="mt-2">
          <p className="mb-1 text-[11px] text-txt2">{t("brand.tldCount", { n: group.rows.length })}</p>
          <RegisterPills rows={group.rows} />
        </div>
      )}
      {row.meaning && <p className="mt-1.5 text-[13px] leading-relaxed text-txt1"><MeaningText text={row.meaning} /></p>}
      {row.scores && <ScoreBars scores={row.scores} className="mt-4" />}
      {priceFull(row.tld, lang, prices) && (
        <p title={priceFull(row.tld, lang, prices)} className="tnum mt-3 cursor-help text-[11px] text-txt2">{priceFull(row.tld, lang, prices)}</p>
      )}
      <RegisterMenu domain={row.domain}>
        <button className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-brand text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90">
          {t("common.register")}{priceShort(row.tld, lang, prices) ? ` · ${priceShort(row.tld, lang, prices)}` : ""}
          <ChevronDown className="h-4 w-4" />
        </button>
      </RegisterMenu>
    </div>
  );
}

export function GridCard({
  group,
  variant,
  locked,
  onToggleLock,
  shortlistHas,
  onToggleFavorite,
}: {
  group: LabelGroup<Row>;
  variant: BrandVariant;
  locked: Set<string>;
  onToggleLock: (domain: string) => void;
  shortlistHas: (domain: string) => boolean;
  onToggleFavorite: (row: Row) => void;
}) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const row = group.rows.find((r) => r.domain === selected) ?? group.rows[0];
  const score = row.scores ? totalScore(row.scores) : undefined;
  const favorite = shortlistHas(row.domain);
  const isLocked = locked.has(row.domain);
  return (
    <div data-brand-card={row.label} data-domain-primary={row.domain} className="rounded-xl border border-line bg-bg1 p-4">
      <BrandCard label={row.label} variant={variant} available={row.status === "available"} className="mb-3" />
      <div className="flex items-center justify-between gap-2">
        <DomainTitle row={row} className="text-lg font-semibold" />
        {score !== undefined && (
          <span className={cn("tnum shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold", scoreBadgeClass(score))}>{score}</span>
        )}
      </div>
      <div className="mt-2">
        <SelectPills rows={group.rows} selected={row.domain} onSelect={setSelected} />
      </div>
      {row.meaning && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-txt1"><MeaningText text={row.meaning} /></p>}
      {row.scores && <ScoreBars scores={row.scores} columns={4} className="mt-3" />}
      <div className="mt-3 flex items-center gap-1">
        <button
          title={`${t("results.lockTitle")} · ${row.domain}`}
          aria-pressed={isLocked}
          onClick={() => onToggleLock(row.domain)}
          className={cn("grid h-8 w-8 place-items-center rounded-md border", isLocked ? "border-brand-line text-brand" : "border-line text-txt2 hover:text-txt0")}
        >
          <Lock className="h-3.5 w-3.5" />
        </button>
        <CopyButton domain={row.domain} className="rounded-md border border-line" />
        <button
          title={`${favorite ? t("results.favRemove") : t("results.favAdd")} · ${row.domain}`}
          aria-pressed={favorite}
          onClick={() => onToggleFavorite(row)}
          className={cn("grid h-8 w-8 place-items-center rounded-md border border-line", favorite ? "text-brand" : "text-txt2 hover:text-txt0")}
        >
          {favorite ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        </button>
        <div className="flex-1" />
        <RegisterMenu domain={row.domain}>
          <button className="h-8 rounded-md bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-80">{t("common.register")}</button>
        </RegisterMenu>
      </div>
    </div>
  );
}
