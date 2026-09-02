import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, BellRing, Bookmark, BookmarkCheck, Check, Copy, ExternalLink, Loader2, Lock, ThumbsDown } from "lucide-react";

import { ConfirmLabel } from "@/components/confirm-label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScoreBars } from "@/components/score-bars";
import { useI18n } from "@/lib/i18n";
import { priceFull, priceShort, usePrices } from "@/lib/prices";
import { REGISTRARS } from "@/lib/registrars";
import { scoreBadgeClass, totalScore, type Row, type Scores } from "@/types";
import { useMonitor } from "@/lib/monitor";
import { cn, formatExpiry, isExpiringSoon, isPlausibleExpiry } from "@/lib/utils";

export function DomainName({ row, className, compact = false }: { row: Row; className?: string; compact?: boolean }) {
  return (
    <span title={row.domain} className={cn("min-w-0 truncate font-mono font-semibold", compact ? "text-[13px]" : "text-[15px]", className)}>
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
  if (!date || !isPlausibleExpiry(iso)) return null;
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

const WATCH_CONFIRM_TIMEOUT_MS = 5000;

/** 临期 taken 域名的就地一键监控 CTA：点击 = 加入 shortlist + 开监控；监控中点击两步确认就地取消，旁边小图标跳 /monitors 管理 */
export function WatchCta({
  domain,
  expiresAt,
  onAddShortlist,
  variant = "row",
  compact = false,
}: {
  domain: string;
  expiresAt: string;
  onAddShortlist: () => void;
  variant?: "row" | "chip";
  /** 紧凑行密度（仅桌面）：按钮高度收到 24px */
  compact?: boolean;
}) {
  const { t } = useI18n();
  const { isMonitored, toggle } = useMonitor();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<"full" | "failed" | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmLeft, setConfirmLeft] = useState(0);
  const confirmTimer = useRef<number | undefined>(undefined);
  const confirmTick = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(confirmTimer.current);
      window.clearInterval(confirmTick.current);
    },
    [],
  );

  if (!isExpiringSoon(expiresAt)) return null;
  const watched = isMonitored(domain);

  function clearConfirm() {
    window.clearTimeout(confirmTimer.current);
    window.clearInterval(confirmTick.current);
    setConfirming(false);
    setConfirmLeft(0);
  }

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

  async function stop() {
    if (pending) return;
    if (!confirming) {
      window.clearTimeout(confirmTimer.current);
      window.clearInterval(confirmTick.current);
      setConfirming(true);
      setConfirmLeft(Math.ceil(WATCH_CONFIRM_TIMEOUT_MS / 1000));
      confirmTimer.current = window.setTimeout(clearConfirm, WATCH_CONFIRM_TIMEOUT_MS);
      confirmTick.current = window.setInterval(() => setConfirmLeft((s) => Math.max(0, s - 1)), 1000);
      return;
    }
    clearConfirm();
    setError(null);
    setPending(true);
    try {
      const r = await toggle(domain, "taken");
      if (!r.ok) {
        setError("failed");
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setPending(false);
    }
  }

  const chip = variant === "chip";
  if (watched) {
    return (
      <span className={cn("inline-flex shrink-0 items-stretch", chip && "border-l border-line/70")}>
        <button
          onClick={() => void stop()}
          disabled={pending}
          title={confirming ? t("monitors.confirmCountdown", { s: confirmLeft }) : t("watch.watchingTitle")}
          aria-label={confirming ? t("monitors.cancelConfirm") : t("watch.watchingTitle")}
          className={cn(
            "inline-flex items-center gap-1 font-sans text-[11px] font-medium transition-colors",
            compact ? "h-6" : "h-11",
            confirming ? "text-destructive" : "text-brand hover:opacity-80",
            chip ? "px-3 sm:px-2" : cn("rounded-md px-2 hover:bg-bg3", !compact && "sm:h-8"),
          )}
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : confirming ? (
            <BellOff className="h-3.5 w-3.5" />
          ) : (
            <BellRing className="h-3.5 w-3.5" />
          )}
          <ConfirmLabel
            confirmed={confirming}
            label={<span className="hidden sm:inline">{t("watch.watching")}</span>}
            confirmLabel={
              <>
                <span className="hidden sm:inline">{t("monitors.cancelConfirm")}</span>
                <span className="tnum w-[1ch] font-mono text-[11px] opacity-70">{confirmLeft}</span>
              </>
            }
          />
        </button>
        <a
          href="/monitors"
          title={t("watch.manageTitle")}
          aria-label={t("watch.manageTitle")}
          className={cn(
            "inline-flex w-8 items-center justify-center text-txt2 transition-colors hover:text-txt0",
            compact ? "h-6" : "h-11",
            !chip && cn("rounded-md hover:bg-bg3", !compact && "sm:h-8"),
          )}
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      </span>
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
        chip ? "border-l border-line/70 px-3 sm:px-2" : cn("rounded-md px-2 hover:bg-bg3", compact ? "h-6" : "h-11 sm:h-8"),
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
  compact = false,
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
  /** 紧凑行密度（R467，仅桌面 ≥768px）：26px 行高，寓意一行截断点击展开，次要操作悬停/聚焦显示 */
  compact?: boolean;
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
  const rowH = compact ? "h-[26px]" : "h-12";
  const badgeCls = compact ? "w-7 text-[11px] leading-5" : "w-8 py-0.5 text-xs";
  // 紧凑模式下评分条不再展开即见，把四维分数放进悬停提示
  const scoreTitle = compact && row.scores ? `${t("score.expandTitle")} · ${scoreBreakdown(row.scores, t)}` : t("score.expandTitle");
  // 紧凑模式：次要操作（锁定/复制/点踩）悬停、聚焦或键盘选中时才显示，激活态常显
  const quietAction = (active: boolean) =>
    compact && !active && !selected && "opacity-0 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100";

  if (row.status === "taken") {
    return (
      <div data-domain={row.domain} className={cn("flex items-center gap-3 px-4 opacity-60", rowH, compact && "gap-2 px-3")}>
        <span className={cn("tnum shrink-0 rounded-md bg-taken-dim text-center font-mono text-taken", badgeCls)}>—</span>
        <span title={row.domain} className={cn("min-w-16 truncate font-mono text-taken line-through", compact ? "text-[13px]" : "text-[15px]")}>{row.domain}</span>
        <span className={cn("shrink-0 rounded bg-taken-dim text-taken", compact ? "px-1 text-[10px]" : "px-1.5 py-0.5 text-[11px]")}>{t("status.taken")}</span>
        {row.expiresAt && <ExpiryNote iso={row.expiresAt} className="shrink truncate" />}
        {row.expiresAt && onToggleFavorite && (
          <WatchCta
            domain={row.domain}
            expiresAt={row.expiresAt}
            compact={compact}
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
            className={cn(
              "ml-auto grid shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3",
              compact ? "h-6 w-6" : "h-11 w-11 sm:h-8 sm:w-8",
              favorite ? "text-taken" : "text-txt2 hover:text-txt0",
            )}
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
      <div data-domain={row.domain} className={cn("flex items-center gap-3 px-4", rowH, compact && "gap-2 px-3")}>
        <span className={cn("tnum shrink-0 rounded-md bg-amber2-dim text-center font-mono text-amber2", badgeCls)}>…</span>
        <DomainName row={row} compact={compact} />
        <span className="dot-breathe h-1.5 w-1.5 shrink-0 rounded-full bg-amber2" />
        <span className={cn("hidden flex-1 truncate text-amber2 sm:block", compact ? "text-[11px]" : "text-xs")}>{t("agent.checkingRdap")}</span>
      </div>
    );
  }

  const isUnknown = row.status === "unknown";
  const iconBtn = compact ? "h-6 w-6" : "h-8 w-8";

  return (
    <div data-domain={row.domain} className={cn("group", animate && "fade-up", selected && "bg-bg2 shadow-[inset_2px_0_0_var(--brand)]")}>
    <div className={cn("flex items-center px-4", rowH, compact ? "gap-2 px-3" : "gap-2 sm:gap-3")}>
      {row.scores && score !== undefined ? (
        <button
          title={scoreTitle}
          aria-expanded={expanded}
          className={cn("tnum shrink-0 rounded-md text-center font-mono font-semibold transition-shadow hover:ring-1 hover:ring-line", badgeCls, scoreBadgeClass(score))}
          onClick={() => setExpanded((v) => !v)}
        >
          {score}
        </button>
      ) : (
        <span className={cn("tnum shrink-0 rounded-md bg-bg3 text-center font-mono font-semibold text-txt1", badgeCls)}>—</span>
      )}
      <DomainName row={row} compact={compact} />
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", isUnknown ? "bg-amber2" : "bg-brand")} />
      {isUnknown && (
        <span className={cn("shrink-0 rounded bg-amber2-dim text-amber2", compact ? "px-1 text-[10px]" : "px-1.5 py-0.5 text-[11px]")}>{t("status.unknown")}</span>
      )}
      {compact ? (
        <button
          type="button"
          title={row.meaning}
          aria-label={expanded ? t("results.meaningCollapse") : t("results.meaningExpand")}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            "min-w-0 flex-1 truncate rounded text-left text-[11px] text-txt1 transition-colors hover:text-txt0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            !row.meaning && "pointer-events-none",
          )}
        >
          {row.meaning && <MeaningText text={row.meaning} />}
        </button>
      ) : (
        <span title={row.meaning} className="hidden flex-1 truncate text-xs text-txt1 sm:block">{row.meaning && <MeaningText text={row.meaning} />}</span>
      )}
      <span className="ml-auto sm:ml-0" />
      {priceShort(row.tld, lang, prices) && (
        <span title={priceFull(row.tld, lang, prices)} className={cn("tnum hidden shrink-0 font-mono text-txt2 md:block", compact ? "text-[11px]" : "text-xs")}>
          {priceShort(row.tld, lang, prices)}
        </span>
      )}
      {onToggleLock && (
        <button
          title={t("results.lockTitle")}
          aria-pressed={locked}
          className={cn(
            "hidden shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3 sm:grid",
            iconBtn,
            locked ? "text-brand" : "text-txt2 hover:text-txt0",
            quietAction(Boolean(locked)),
          )}
          onClick={() => onToggleLock(row.domain)}
        >
          <Lock className="h-3.5 w-3.5" />
        </button>
      )}
      <CopyButton domain={row.domain} className={cn("hidden sm:grid", iconBtn, quietAction(false))} />
      {onToggleDislike && (
        <button
          title={disliked ? t("results.dislikeActive") : t("results.dislike")}
          aria-pressed={disliked}
          className={cn(
            "hidden shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3 sm:grid",
            iconBtn,
            disliked ? "text-destructive" : "text-txt2 hover:text-txt0",
            quietAction(Boolean(disliked)),
          )}
          onClick={() => onToggleDislike(row.label)}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
        </button>
      )}
      {onToggleFavorite && (
        <button
          title={favorite ? t("results.favRemove") : t("results.favAdd")}
          aria-pressed={favorite}
          className={cn(
            "grid shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3",
            compact ? "h-6 w-6" : "h-11 w-11 sm:h-8 sm:w-8",
            favorite ? "text-brand" : "text-txt2 hover:text-txt0",
          )}
          onClick={() => onToggleFavorite(row)}
        >
          {favorite ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        </button>
      )}
      <RegisterMenu domain={row.domain}>
        <button
          className={cn(
            "shrink-0 rounded-md bg-brand-dim font-semibold text-brand transition-opacity hover:opacity-80",
            compact ? "h-5 px-2 text-[11px]" : "h-11 px-3 text-xs sm:h-8",
          )}
        >
          {t("common.register")}
        </button>
      </RegisterMenu>
    </div>
    {/* 移动端寓意行：桌面寓意在行内，窄屏否则完全不可见（紧凑模式仅桌面，无需此行） */}
    {!compact && row.meaning && <p className="-mt-1.5 mb-2 px-4 pl-14 text-[11px] leading-snug text-txt1 line-clamp-2 sm:hidden"><MeaningText text={row.meaning} /></p>}
    {expanded && row.scores && (
      <div className={cn("pb-3", compact ? "px-3 pl-12 pt-1" : "px-4 pl-14")}>
        {row.meaning && <p className="mb-2 max-w-xl text-xs leading-relaxed text-txt1"><MeaningText text={row.meaning} /></p>}
        <ScoreBars scores={row.scores} columns={4} className="max-w-md" />
        <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-txt2">{t("score.explain")}</p>
      </div>
    )}
    </div>
  );
}

/** 四维分数一行文本（紧凑模式评分徽章的悬停提示） */
function scoreBreakdown(s: Scores, t: (k: "score.length" | "score.readability" | "score.relevance" | "score.brandability") => string): string {
  return [
    [t("score.length"), s.length],
    [t("score.readability"), s.readability],
    [t("score.relevance"), s.relevance],
    [t("score.brandability"), s.brandability],
  ]
    .map(([label, v]) => `${label} ${v}`)
    .join(" · ");
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
