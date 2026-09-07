import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, BellRing, Bookmark, BookmarkCheck, Check, Copy, ExternalLink, Loader2, Lock, RotateCw, ThumbsDown, X } from "lucide-react";

import { BrandCard, BrandDot, BrandSwatch, type BrandVariant } from "@/components/brand-card";
import { ConfirmLabel } from "@/components/confirm-label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RegistrarAnchor } from "@/components/registrar-link";
import { ScoreBars } from "@/components/score-bars";
import { isRetryableUnknown, unknownReason, unknownReasonKey } from "@/lib/check-client";
import { copyText } from "@/lib/clipboard";
import { useI18n } from "@/lib/i18n";
import { priceFull, priceShort, usePrices } from "@/lib/prices";
import { registrarsFor, tldOf } from "@/lib/registrars";
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

/** taken 域名缺到期日（DNS-only 结果，注册局 RDAP 未返回）时的「到期日待查」chip；首页 quick-check、Results、/advanced 同源 */
export function ExpiryUnknownChip({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <i title={t("expiry.unknownChipTip")} className={cn("not-italic font-sans text-[10px] text-txt2", className)} data-expiry="unknown">
      {t("expiry.unknownChip")}
    </i>
  );
}

const WATCH_CONFIRM_TIMEOUT_MS = 5000;

/**
 * taken 域名的就地一键监控 CTA：点击 = 加入 shortlist + 开监控；监控中点击两步确认就地取消，旁边小图标跳 /monitors 管理。
 * 默认只在 90 天内到期时出现（「监控释放」）；`always` 时任何 taken 行都显示（「开监控」，与清单页 R548 语义一致）
 */
export function WatchCta({
  domain,
  expiresAt,
  onAddShortlist,
  variant = "row",
  compact = false,
  always = false,
}: {
  domain: string;
  expiresAt?: string;
  onAddShortlist: () => void;
  variant?: "row" | "chip";
  /** 紧凑行密度（仅桌面）：按钮高度收到 24px */
  compact?: boolean;
  always?: boolean;
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

  const soon = Boolean(expiresAt && isExpiringSoon(expiresAt));
  if (!soon && !always) return null;
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
      title={error ? t(error === "full" ? "monitor.full" : "monitor.failed") : t(soon ? "watch.ctaTitle" : "shortlist.monitorCtaTitle")}
      aria-label={t(soon ? "watch.ctaTitle" : "shortlist.monitorCtaTitle")}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 font-sans text-[11px] font-medium transition-colors",
        error ? "text-destructive" : soon ? "text-amber2 hover:text-txt0" : "text-txt1 hover:text-txt0",
        chip ? "border-l border-line/70 px-3 sm:px-2" : cn("rounded-md px-2 hover:bg-bg3", compact ? "h-6" : "h-11 sm:h-8"),
      )}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{error ? t(error === "full" ? "watch.full" : "watch.failed") : t(soon ? "watch.cta" : "row.monitorCta")}</span>
    </button>
  );
}

/** 单行「重新核验」：44px 触点（桌面 32px），键盘可达；走 POST /api/check?refresh=1 穿透缓存 */
export function RecheckButton({
  domain,
  onRecheck,
  rechecking = false,
  compact = false,
  variant = "row",
  withLabel = true,
  className,
}: {
  domain: string;
  onRecheck: (domain: string) => void;
  rechecking?: boolean;
  compact?: boolean;
  variant?: "row" | "chip";
  withLabel?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const chip = variant === "chip";
  return (
    <button
      type="button"
      data-recheck={domain}
      onClick={() => onRecheck(domain)}
      disabled={rechecking}
      title={t("row.recheckTitle", { domain })}
      aria-label={t("row.recheckTitle", { domain })}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1 font-sans text-[11px] font-medium text-txt1 transition-colors hover:text-txt0 disabled:opacity-60",
        chip ? "min-w-[44px] border-l border-line/70 px-3 sm:min-w-0 sm:px-2" : cn("rounded-md px-2 hover:bg-bg3", compact ? "h-6" : "h-11 min-w-11 sm:h-8 sm:min-w-0"),
        className,
      )}
    >
      <RotateCw className={cn("h-3.5 w-3.5", rechecking && "animate-spin")} />
      {withLabel && <span className="hidden sm:inline">{rechecking ? t("row.rechecking") : t("row.recheck")}</span>}
    </button>
  );
}

export function RegisterMenu({ domain, children }: { domain: string; children: React.ReactNode }) {
  const { t } = useI18n();
  const prices = usePrices();
  const tld = tldOf(domain);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {registrarsFor(domain).map((r) => {
          const live = r.id === "porkbun" ? prices?.[tld] : undefined;
          return (
            <DropdownMenuItem key={r.id} asChild>
              <RegistrarAnchor registrar={r} domain={domain} className="flex w-full items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  {r.name}
                  {live && <span className="tnum font-mono text-[11px] text-brand">${live.registration}</span>}
                  {r.id === "dynadot" && <span className="text-[11px] text-txt2">{t("registrar.hint.dynadot")}</span>}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-txt2" />
              </RegistrarAnchor>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CopyButton({ domain, className }: { domain: string; className?: string }) {
  const { t, lang } = useI18n();
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <button
      title={state === "failed" ? t("results.copyFailed") : t("common.copy")}
      className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md text-txt2 transition-colors hover:bg-bg3 hover:text-txt0", className)}
      onClick={async () => {
        const ok = await copyText(domain);
        setState(ok ? "copied" : "failed");
        setTimeout(() => setState("idle"), ok ? 1200 : 2500);
      }}
    >
      {state === "copied" ? <Check className="h-3.5 w-3.5 text-brand" /> : state === "failed" ? <X className="h-3.5 w-3.5 text-destructive" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function DomainRow({
  row,
  selected = false,
  animate = false,
  compact = false,
  variant = 0,
  locked,
  onToggleLock,
  favorite,
  onToggleFavorite,
  disliked,
  onToggleDislike,
  onRecheck,
  rechecking = false,
}: {
  row: Row;
  selected?: boolean;
  animate?: boolean;
  /** 紧凑行密度（R467，仅桌面 ≥768px）：26px 行高，寓意一行截断点击展开，次要操作悬停/聚焦显示 */
  compact?: boolean;
  /** 品牌色变体（R473）：由卡墙布局层按 label 分配，使行视图色点/色块与 Top Picks/Grid 同外观 */
  variant?: BrandVariant;
  locked?: boolean;
  onToggleLock?: (domain: string) => void;
  favorite?: boolean;
  onToggleFavorite?: (row: Row) => void;
  disliked?: boolean;
  onToggleDislike?: (label: string) => void;
  /** unknown / taken 行的单行「重新核验」（POST /api/check?refresh=1）；不传则不渲染按钮 */
  onRecheck?: (domain: string) => void;
  rechecking?: boolean;
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
      <div
        data-domain={row.domain}
        className={cn(
          "flex items-center gap-3 px-4 opacity-60",
          compact ? cn(rowH, "gap-2 px-3") : "min-h-12 flex-wrap gap-y-0 py-1.5 sm:h-12 sm:flex-nowrap sm:py-0",
        )}
      >
        <span className={cn("tnum shrink-0 rounded-md bg-taken-dim text-center font-mono text-taken", badgeCls)}>—</span>
        <span title={row.domain} className={cn("min-w-16 truncate font-mono text-taken line-through", compact ? "text-[13px]" : "text-[15px]")}>{row.domain}</span>
        <span className={cn("shrink-0 rounded bg-taken-dim text-taken", compact ? "px-1 text-[10px]" : "px-1.5 py-0.5 text-[11px]")}>{t("status.taken")}</span>
        {/* <sm 且非紧凑：到期日/待查 chip + 开监控 + 重新核验 换到第二行（对齐域名），域名不再被挤成 `google…`；≥sm `contents` 让包装消失、行内顺序不变 */}
        <span data-taken-meta="" className={cn("flex min-w-0 items-center", compact ? "gap-2" : "order-last basis-full gap-3 pl-11 sm:contents")}>
          {row.expiresAt ? (
            <ExpiryNote iso={row.expiresAt} className={compact ? "shrink truncate" : "min-w-0 shrink truncate sm:shrink-0"} />
          ) : (
            <ExpiryUnknownChip className="min-w-0 shrink truncate whitespace-nowrap" />
          )}
          {onToggleFavorite && (
            <WatchCta
              domain={row.domain}
              expiresAt={row.expiresAt}
              compact={compact}
              always
              onAddShortlist={() => {
                if (!favorite) onToggleFavorite(row);
              }}
            />
          )}
          {onRecheck && <RecheckButton domain={row.domain} onRecheck={onRecheck} rechecking={rechecking} compact={compact} />}
        </span>
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
          className={cn("-mx-1.5 grid h-11 w-11 shrink-0 place-items-center sm:mx-0 sm:h-auto", compact ? "sm:w-7" : "sm:w-8")}
          onClick={() => setExpanded((v) => !v)}
        >
          <span className={cn("tnum block rounded-md text-center font-mono font-semibold transition-shadow hover:ring-1 hover:ring-line", badgeCls, scoreBadgeClass(score))}>{score}</span>
        </button>
      ) : (
        <span className={cn("tnum shrink-0 rounded-md bg-bg3 text-center font-mono font-semibold text-txt1", badgeCls)}>—</span>
      )}
      {!compact && (
        <button
          title={t("brand.previewTitle")}
          aria-label={`${t("brand.previewTitle")}: ${row.label}`}
          aria-expanded={expanded}
          className="-mx-1.5 hidden h-11 w-11 shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3 sm:grid"
          onClick={() => setExpanded((v) => !v)}
        >
          <BrandSwatch label={row.label} variant={variant} />
        </button>
      )}
      {compact && <BrandDot label={row.label} variant={variant} />}
      <DomainName row={row} compact={compact} />
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", isUnknown ? "bg-amber2" : "bg-brand")} />
      {isUnknown && (
        <span title={t("home.quickUnknownTip")} className={cn("shrink-0 rounded bg-amber2-dim text-amber2", compact ? "px-1 text-[10px]" : "px-1.5 py-0.5 text-[11px]")}>
          {t(row.detail === "reserved" ? "status.reserved" : "status.unknown")}
        </span>
      )}
      {isUnknown && (
        <span data-unknown-reason={unknownReason(row.detail)} className={cn("min-w-0 truncate text-txt2", compact ? "text-[11px]" : "text-xs")}>
          {t(unknownReasonKey(row.detail))}
        </span>
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
      {!isUnknown && priceShort(row.tld, lang, prices) && (
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
      {isUnknown && onRecheck && isRetryableUnknown(row.detail) && (
        <RecheckButton domain={row.domain} onRecheck={onRecheck} rechecking={rechecking} compact={compact} />
      )}
      {!isUnknown && (
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
      )}
    </div>
    {/* 移动端寓意行：桌面寓意在行内，窄屏否则完全不可见（紧凑模式仅桌面，无需此行） */}
    {!compact && row.meaning && <p className="-mt-1.5 mb-2 px-4 pl-14 text-[11px] leading-snug text-txt1 line-clamp-2 sm:hidden"><MeaningText text={row.meaning} /></p>}
    {expanded && (
      <div className={cn("pb-3", compact ? "px-3 pl-12 pt-1" : "px-4 sm:pl-[104px]")}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
          {!compact && (
            <div className="w-full shrink-0 sm:w-60">
              <BrandCard label={row.label} size="sm" variant={variant} available={row.status === "available"} />
              <p className="mt-1.5 text-[11px] leading-snug text-txt2">{t("brand.disclaimer")}</p>
            </div>
          )}
          <div className="min-w-0 flex-1">
            {row.meaning && <p className="mb-2 max-w-xl text-xs leading-relaxed text-txt1"><MeaningText text={row.meaning} /></p>}
            {row.scores && (
              <>
                <ScoreBars scores={row.scores} columns={4} className="max-w-md" />
                <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-txt2">{t("score.explain")}</p>
              </>
            )}
          </div>
        </div>
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
