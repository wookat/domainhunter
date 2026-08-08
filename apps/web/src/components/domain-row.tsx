import { useState } from "react";
import { Bell, BellRing, Bookmark, BookmarkCheck, Check, Copy, ExternalLink, Loader2, Lock, ThumbsDown } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScoreBars } from "@/components/score-bars";
import { useI18n } from "@/lib/i18n";
import { priceFull, priceShort, usePrices } from "@/lib/prices";
import { REGISTRARS } from "@/lib/registrars";
import { scoreBadgeClass, totalScore, type Row } from "@/types";
import { useMonitor } from "@/lib/monitor";
import { cn, formatExpiry, isExpiringSoon } from "@/lib/utils";

export function DomainName({ row, className }: { row: Row; className?: string }) {
  return (
    <span className={cn("truncate font-mono text-[15px] font-semibold", className)}>
      {row.label}
      <span className="text-txt2">.{row.tld}</span>
    </span>
  );
}

/** 寓意里用「」括起的中文原词（拼音系候选）高亮为品牌色 */
export function MeaningText({ text }: { text: string }) {
  const parts = text.split(/(「[^」]+」)/);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) => (p.startsWith("「") ? <span key={i} className="font-medium text-brand">{p}</span> : p))}
    </>
  );
}

/** taken 域名的到期时间（低调次要文本；90 天内到期琥珀色提示） */
export function ExpiryNote({ iso, className }: { iso: string; className?: string }) {
  const { t } = useI18n();
  const date = formatExpiry(iso);
  if (!date) return null;
  const soon = isExpiringSoon(iso);
  return (
    <span
      title={soon ? t("expiry.soonTitle") : undefined}
      className={cn("tnum shrink-0 whitespace-nowrap font-mono text-[10px]", soon ? "text-amber2" : "text-txt2", className)}
    >
      {t("expiry.on", { date })}
    </span>
  );
}

/** 临期 taken 域名的就地一键监控 CTA：点击 = 加入 shortlist + 开监控；监控中再点跳 /monitors 管理 */
export function WatchCta({
  domain,
  expiresAt,
  onAddShortlist,
  variant = "row",
}: {
  domain: string;
  expiresAt: string;
  onAddShortlist: () => void;
  variant?: "row" | "chip";
}) {
  const { t } = useI18n();
  const { isMonitored, toggle } = useMonitor();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<"full" | "failed" | null>(null);
  if (!isExpiringSoon(expiresAt)) return null;
  const watched = isMonitored(domain);

  async function start() {
    if (pending) return;
    setError(null);
    setPending(true);
    try {
      onAddShortlist();
      const r = await toggle(domain, "taken");
      if (!r.ok) {
        setError(r.full ? "full" : "failed");
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setPending(false);
    }
  }

  const chip = variant === "chip";
  if (watched) {
    return (
      <a
        href="/monitors"
        title={t("watch.watchingTitle")}
        aria-label={t("watch.watchingTitle")}
        className={cn(
          "inline-flex shrink-0 items-center gap-1 font-sans text-[11px] font-medium text-brand transition-opacity hover:opacity-80",
          chip ? "border-l border-line/70 px-3 sm:px-2" : "h-11 rounded-md px-2 hover:bg-bg3 sm:h-8",
        )}
      >
        <BellRing className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("watch.watching")}</span>
      </a>
    );
  }
  return (
    <button
      onClick={() => void start()}
      disabled={pending}
      title={error ? t(error === "full" ? "monitor.full" : "monitor.failed") : t("watch.ctaTitle")}
      aria-label={t("watch.ctaTitle")}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 font-sans text-[11px] font-medium transition-colors",
        error ? "text-destructive" : "text-amber2 hover:text-txt0",
        chip ? "border-l border-line/70 px-3 sm:px-2" : "h-11 rounded-md px-2 hover:bg-bg3 sm:h-8",
      )}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{error ? t(error === "full" ? "watch.full" : "watch.failed") : t("watch.cta")}</span>
    </button>
  );
}

export function RegisterMenu({ domain, children }: { domain: string; children: React.ReactNode }) {
  const prices = usePrices();
  const tld = domain.slice(domain.indexOf(".") + 1);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {REGISTRARS.map((r) => {
          const live = r.key === "porkbun" ? prices?.[tld] : undefined;
          return (
            <DropdownMenuItem key={r.name} asChild>
              <a href={r.url(domain)} target="_blank" rel="noreferrer" className="flex w-full items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  {r.name}
                  {live && <span className="tnum font-mono text-[11px] text-brand">${live.registration}</span>}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-txt2" />
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CopyButton({ domain, className }: { domain: string; className?: string }) {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);
  return (
    <button
      title={t("common.copy")}
      className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md text-txt2 transition-colors hover:bg-bg3 hover:text-txt0", className)}
      onClick={async () => {
        await navigator.clipboard.writeText(domain);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function DomainRow({
  row,
  selected = false,
  animate = false,
  locked,
  onToggleLock,
  favorite,
  onToggleFavorite,
  disliked,
  onToggleDislike,
}: {
  row: Row;
  selected?: boolean;
  animate?: boolean;
  locked?: boolean;
  onToggleLock?: (domain: string) => void;
  favorite?: boolean;
  onToggleFavorite?: (row: Row) => void;
  disliked?: boolean;
  onToggleDislike?: (label: string) => void;
}) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const score = row.scores ? totalScore(row.scores) : undefined;
  const [expanded, setExpanded] = useState(false);

  if (row.status === "taken") {
    return (
      <div className="flex h-12 items-center gap-3 px-4 opacity-60">
        <span className="tnum w-8 shrink-0 rounded-md bg-taken-dim py-0.5 text-center font-mono text-xs text-taken">—</span>
        <span className="truncate font-mono text-[15px] text-taken line-through">{row.domain}</span>
        <span className="shrink-0 rounded bg-taken-dim px-1.5 py-0.5 text-[11px] text-taken">{t("status.taken")}</span>
        {row.expiresAt && <ExpiryNote iso={row.expiresAt} />}
        {row.expiresAt && onToggleFavorite && (
          <WatchCta
            domain={row.domain}
            expiresAt={row.expiresAt}
            onAddShortlist={() => {
              if (!favorite) onToggleFavorite(row);
            }}
          />
        )}
        {onToggleFavorite && (
          <button
            title={favorite ? t("results.favRemove") : t("results.favAdd")}
            aria-label={favorite ? t("results.favRemove") : t("results.favAdd")}
            aria-pressed={favorite}
            className={cn("ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3 sm:h-8 sm:w-8", favorite ? "text-taken" : "text-txt2 hover:text-txt0")}
            onClick={() => onToggleFavorite(row)}
          >
            {favorite ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    );
  }

  if (row.status === "checking") {
    return (
      <div className="flex h-12 items-center gap-3 px-4">
        <span className="tnum w-8 shrink-0 rounded-md bg-amber2-dim py-0.5 text-center font-mono text-xs text-amber2">…</span>
        <DomainName row={row} />
        <span className="dot-breathe h-1.5 w-1.5 shrink-0 rounded-full bg-amber2" />
        <span className="hidden flex-1 truncate text-xs text-amber2 sm:block">{t("agent.checkingRdap")}</span>
      </div>
    );
  }

  const isUnknown = row.status === "unknown";

  return (
    <div data-domain={row.domain} className={cn(animate && "fade-up", selected && "bg-bg2 shadow-[inset_2px_0_0_var(--brand)]")}>
    <div className="flex h-12 items-center gap-2 px-4 sm:gap-3">
      {row.scores && score !== undefined ? (
        <button
          title={t("score.expandTitle")}
          aria-expanded={expanded}
          className={cn("tnum w-8 shrink-0 rounded-md py-0.5 text-center font-mono text-xs font-semibold transition-shadow hover:ring-1 hover:ring-line", scoreBadgeClass(score))}
          onClick={() => setExpanded((v) => !v)}
        >
          {score}
        </button>
      ) : (
        <span className="tnum w-8 shrink-0 rounded-md bg-bg3 py-0.5 text-center font-mono text-xs font-semibold text-txt1">—</span>
      )}
      <DomainName row={row} />
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", isUnknown ? "bg-amber2" : "bg-brand")} />
      {isUnknown && <span className="shrink-0 rounded bg-amber2-dim px-1.5 py-0.5 text-[11px] text-amber2">{t("status.unknown")}</span>}
      <span title={row.meaning} className="hidden flex-1 truncate text-xs text-txt1 sm:block">{row.meaning && <MeaningText text={row.meaning} />}</span>
      <span className="ml-auto sm:ml-0" />
      {priceShort(row.tld, lang, prices) && (
        <span title={priceFull(row.tld, lang, prices)} className="tnum hidden shrink-0 font-mono text-xs text-txt2 md:block">
          {priceShort(row.tld, lang, prices)}
        </span>
      )}
      {onToggleLock && (
        <button
          title={t("results.lockTitle")}
          aria-pressed={locked}
          className={cn("hidden h-8 w-8 shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3 sm:grid", locked ? "text-brand" : "text-txt2 hover:text-txt0")}
          onClick={() => onToggleLock(row.domain)}
        >
          <Lock className="h-3.5 w-3.5" />
        </button>
      )}
      <CopyButton domain={row.domain} className="hidden sm:grid" />
      {onToggleDislike && (
        <button
          title={disliked ? t("results.dislikeActive") : t("results.dislike")}
          aria-pressed={disliked}
          className={cn("hidden h-8 w-8 shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3 sm:grid", disliked ? "text-destructive" : "text-txt2 hover:text-txt0")}
          onClick={() => onToggleDislike(row.label)}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
        </button>
      )}
      {onToggleFavorite && (
        <button
          title={favorite ? t("results.favRemove") : t("results.favAdd")}
          aria-pressed={favorite}
          className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3 sm:h-8 sm:w-8", favorite ? "text-brand" : "text-txt2 hover:text-txt0")}
          onClick={() => onToggleFavorite(row)}
        >
          {favorite ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        </button>
      )}
      <RegisterMenu domain={row.domain}>
        <button className="h-11 shrink-0 rounded-md bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-80 sm:h-8">
          {t("common.register")}
        </button>
      </RegisterMenu>
    </div>
    {/* 移动端寓意行：桌面寓意在行内，窄屏否则完全不可见 */}
    {row.meaning && <p className="-mt-1.5 mb-2 px-4 pl-14 text-[11px] leading-snug text-txt1 line-clamp-2 sm:hidden"><MeaningText text={row.meaning} /></p>}
    {expanded && row.scores && (
      <div className="px-4 pb-3 pl-14">
        {row.meaning && <p className="mb-2 max-w-xl text-xs leading-relaxed text-txt1"><MeaningText text={row.meaning} /></p>}
        <ScoreBars scores={row.scores} columns={4} className="max-w-md" />
        <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-txt2">{t("score.explain")}</p>
      </div>
    )}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex h-12 items-center gap-3 px-4">
      <span className="h-4 w-8 animate-pulse rounded-md bg-bg3" />
      <span className="h-4 w-32 animate-pulse rounded-md bg-bg3" />
      <span className="hidden h-3 w-48 animate-pulse rounded-md bg-bg2 sm:block" />
    </div>
  );
}
