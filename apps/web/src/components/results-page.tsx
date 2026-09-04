import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownWideNarrow,
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  ChevronRight,
  Download,
  Link2,
  LayoutGrid,
  Lock,
  RotateCw,
  Rows2,
  Rows3,
  Rows4,
  Trophy,
} from "lucide-react";

import { GridCard, TopPickCard } from "@/components/brand-wall";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DomainRow } from "@/components/domain-row";
import { openRegistrar } from "@/components/registrar-link";
import { useAffiliateConfig } from "@/lib/affiliate";
import { assignBrandVariants, groupByLabel, pickTopGroups, variantOf } from "@/lib/brand-wall";
import { useDensity, type Density } from "@/lib/density";
import { exportRows } from "@/lib/export";
import { exportResultsCsv, useCopyAvailable } from "@/lib/results-export";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { usePrices } from "@/lib/prices";
import { primaryRegistrar } from "@/lib/registrars";
import { tldPrice, totalScore, type Row, type Theme } from "@/types";
import { cn } from "@/lib/utils";

type StatusFilter = "available" | "all" | "taken";
type SortKey = "score" | "length" | "price";
type View = "rows" | "grid";

function sortRows(rows: Row[], sort: SortKey, priceOf?: (tld: string) => number): Row[] {
  return [...rows].sort((a, b) => {
    if (sort === "length") return a.label.length - b.label.length;
    if (sort === "price" && priceOf) return priceOf(a.tld) - priceOf(b.tld);
    const sa = a.scores ? totalScore(a.scores) : -1;
    const sb = b.scores ? totalScore(b.scores) : -1;
    return sb - sa;
  });
}

/** 把当前搜索编成可分享的 /?q=…&tld=…&style=…&len=… 链接 */
function searchLink(description: string, tlds: string[], style: string, lengthPref: string): string {
  const params = new URLSearchParams();
  params.set("q", description);
  if (tlds.length > 0) params.set("tld", tlds.join(","));
  if (style) params.set("style", style);
  if (lengthPref) params.set("len", lengthPref);
  return `${window.location.origin}/?${params.toString()}`;
}

export function ResultsPage({
  rows,
  description,
  tlds,
  style,
  lengthPref,
  roundCount,
  elapsedSec,
  locked,
  onToggleLock,
  shortlistHas,
  onToggleFavorite,
  onAddFavorites,
  onMore,
  onMoreAroundLocked,
  running,
  moreDisabled,
  quotaExhausted,
  dislikedHas,
  onToggleDislike,
  restoredGuard,
}: {
  rows: Row[];
  description: string;
  tlds: string[];
  style: string;
  lengthPref: string;
  roundCount: number;
  elapsedSec?: number;
  locked: Set<string>;
  onToggleLock: (domain: string) => void;
  shortlistHas: (domain: string) => boolean;
  onToggleFavorite: (row: Row) => void;
  onAddFavorites: (rows: Row[]) => void;
  onMore: () => void;
  onMoreAroundLocked: () => void;
  running: boolean;
  moreDisabled?: boolean;
  quotaExhausted?: boolean;
  dislikedHas: (label: string) => boolean;
  onToggleDislike: (label: string) => void;
  /** 从上次会话恢复的结果页：「再来一轮」需两步确认，防恢复态盲点误触消耗 AI 配额（R465） */
  restoredGuard?: boolean;
}) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("available");
  const [tldFilter, setTldFilter] = useState<string>("");
  const [themeFilter, setThemeFilter] = useState<Theme | "">("");
  const [sort, setSort] = useState<SortKey>("score");
  const [view, setView] = useState<View>("rows");
  // R467 行密度：选择持久化 localStorage；compact 仅在 ≥768px 生效（窄屏守 44px 触点）
  const { density, setDensity, compact } = useDensity();
  const [linkCopied, setLinkCopied] = useState(false);
  const { copied: availCopied, copy: copyAvailable } = useCopyAvailable();
  const moreBlocked = running || moreDisabled || quotaExhausted;
  const [starredCount, setStarredCount] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  // Space 快捷键两步确认：首次 Space 只预热，3s 内再按才真正发起（避免焦点不在输入框时误触消耗 AI 配额）
  const [spaceArmed, setSpaceArmed] = useState(false);
  const spaceArmTimer = useRef<number | undefined>(undefined);
  // 恢复态「再来一轮」按钮两步确认：首次点击只预热，3s 内再点才真正发起
  const [moreArmed, setMoreArmed] = useState(false);
  const moreArmTimer = useRef<number | undefined>(undefined);
  useEffect(
    () => () => {
      window.clearTimeout(spaceArmTimer.current);
      window.clearTimeout(moreArmTimer.current);
    },
    [],
  );
  const triggerMore = (aroundLocked: boolean) => {
    if (restoredGuard && !moreArmed) {
      setMoreArmed(true);
      window.clearTimeout(moreArmTimer.current);
      moreArmTimer.current = window.setTimeout(() => setMoreArmed(false), 3000);
      return;
    }
    window.clearTimeout(moreArmTimer.current);
    setMoreArmed(false);
    if (aroundLocked) onMoreAroundLocked();
    else onMore();
  };
  const listRef = useRef<HTMLDivElement>(null);

  const availableRows = useMemo(() => rows.filter((r) => r.status === "available"), [rows]);
  const takenRows = useMemo(() => rows.filter((r) => r.status === "taken"), [rows]);

  const tldCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of availableRows) m.set(r.tld, (m.get(r.tld) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [availableRows]);

  // 命名思路聚类 chips（Namelix 式）：拼音/英文词/造词/混搭
  const themeCounts = useMemo(() => {
    const m = new Map<Theme, number>();
    for (const r of availableRows) if (r.theme) m.set(r.theme, (m.get(r.theme) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [availableRows]);

  // R473：Top Picks 3 席 = 3 个不同 label，同名多 TLD 合为一席
  const topPicks = useMemo(() => pickTopGroups(sortRows(availableRows, "score"), 3), [availableRows]);

  const priceOf = useMemo(() => {
    return (tld: string) => {
      const live = prices?.[tld];
      if (live) return live.registration;
      const s = tldPrice(tld);
      return s ? s.first / 7.2 : Number.POSITIVE_INFINITY;
    };
  }, [prices]);

  const visible = useMemo(() => {
    let list = statusFilter === "available" ? availableRows : statusFilter === "taken" ? takenRows : rows;
    if (tldFilter) list = list.filter((r) => r.tld === tldFilter);
    if (themeFilter) list = list.filter((r) => r.theme === themeFilter);
    return sortRows(list, sort, priceOf);
  }, [rows, availableRows, takenRows, statusFilter, tldFilter, themeFilter, sort, priceOf]);

  const visibleAvailable = useMemo(() => visible.filter((r) => r.status === "available"), [visible]);

  // R473：Grid 按 label 分组（含 unknown，不含 taken）；变体表按「Top Picks → Grid」顺序一次分配并全页复用
  const gridGroups = useMemo(() => groupByLabel(visible.filter((r) => r.status !== "taken")), [visible]);
  const variants = useMemo(
    () => assignBrandVariants([topPicks.map((g) => g.label), gridGroups.map((g) => g.label)]),
    [topPicks, gridGroups],
  );

  const unstarredAvailable = useMemo(() => visibleAvailable.filter((r) => !shortlistHas(r.domain)), [visibleAvailable, shortlistHas]);

  const starAllAvailable = () => {
    const toAdd = unstarredAvailable;
    if (toAdd.length === 0) return;
    onAddFavorites(toAdd);
    setStarredCount(toAdd.length);
    window.setTimeout(() => setStarredCount(0), 1500);
  };



  // 键盘导航：↑↓ 选中 / C 复制 / S 收藏 / Enter 注册（该域名的首选注册商，与菜单首项一致）/ Space 再来一轮
  const affiliateCfg = useAffiliateConfig();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || e.metaKey || e.ctrlKey || e.altKey) return;
      // 下拉菜单（注册商/导出等）打开时 ↑↓/Enter 归菜单自己的焦点管理，不再同时移动行选中
      if (target.closest?.("[role=menu]")) return;
      // 焦点在按钮/链接上时 Space/Enter 交给原生激活（否则密度切换等控件无法用键盘操作，且 Space 会误触再来一轮）
      const onControl = Boolean(target.closest?.("button, a, [role=button]"));
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => {
          const next = e.key === "ArrowDown" ? Math.min(i + 1, visible.length - 1) : Math.max(i - 1, 0);
          const el = listRef.current?.querySelector(`[data-domain="${visible[next]?.domain}"]`);
          el?.scrollIntoView({ block: "nearest" });
          return next;
        });
      } else if (e.key === " " && !moreBlocked && !onControl) {
        e.preventDefault();
        if (!spaceArmed) {
          setSpaceArmed(true);
          window.clearTimeout(spaceArmTimer.current);
          spaceArmTimer.current = window.setTimeout(() => setSpaceArmed(false), 3000);
        } else {
          window.clearTimeout(spaceArmTimer.current);
          setSpaceArmed(false);
          window.clearTimeout(moreArmTimer.current);
          setMoreArmed(false);
          if (locked.size > 0) onMoreAroundLocked();
          else onMore();
        }
      } else if (selectedIdx >= 0 && selectedIdx < visible.length) {
        const row = visible[selectedIdx];
        if (e.key === "c" || e.key === "C") void navigator.clipboard.writeText(row.domain);
        else if (e.key === "s" || e.key === "S") onToggleFavorite(row);
        else if (e.key === "Enter" && !onControl) openRegistrar(primaryRegistrar(row.domain), row.domain, affiliateCfg);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, selectedIdx, moreBlocked, locked, onMore, onMoreAroundLocked, onToggleFavorite, spaceArmed, affiliateCfg]);

  const lockedList = [...locked];

  return (
    <>
      <main className="mx-auto w-full min-w-0 max-w-6xl overflow-x-clip px-4 py-6 pb-24 md:px-6">
        {/* 摘要行 */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {t("results.title", { desc: description.length > 18 ? description.slice(0, 18) + "…" : description, n: availableRows.length })}
            </h1>
            {/* 统计条：可注册 / 已核验 / 轮次 / 耗时 一眼可读（Lean Domain Search 式） */}
            <div className="tnum mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="rounded-md border border-brand-line bg-brand-dim px-2 py-0.5 font-semibold text-brand">
                {t("results.stat.available", { n: availableRows.length })}
              </span>
              <span className="rounded-md border border-line bg-bg1 px-2 py-0.5 text-txt1">
                {t("results.stat.checked", { n: rows.length })}
              </span>
              <span className="rounded-md border border-line bg-bg1 px-2 py-0.5 text-txt1">
                {roundCount === 1 ? t("results.stat.round1") : t("results.stat.rounds", { n: roundCount })}
              </span>
              {elapsedSec !== undefined && (
                <span className="rounded-md border border-line bg-bg1 px-2 py-0.5 text-txt1">
                  {t("results.stat.elapsed", { s: elapsedSec })}
                </span>
              )}
              {visibleAvailable.length >= 2 && (
                <button
                  onClick={() => copyAvailable(visibleAvailable.map((r) => r.domain))}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-bg1 px-2 py-0.5 font-mono text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {availCopied ? <Check className="h-3 w-3 text-brand" /> : <Copy className="h-3 w-3" />}
                  {availCopied ? t("results.copiedAvail") : t("results.copyAvailBtn", { n: visibleAvailable.length })}
                </button>
              )}
              {visibleAvailable.length >= 2 && (
                <button
                  onClick={starAllAvailable}
                  disabled={starredCount === 0 && unstarredAvailable.length === 0}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-bg1 px-2 py-0.5 font-mono text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
                >
                  {starredCount > 0 || unstarredAvailable.length === 0 ? <BookmarkCheck className="h-3 w-3 text-brand" /> : <Bookmark className="h-3 w-3" />}
                  {starredCount > 0
                    ? t("results.starAllDone", { n: starredCount })
                    : unstarredAvailable.length === 0
                      ? t("results.starAllAll")
                      : t("results.starAllBtn")}
                </button>
              )}
              {/* <sm：顶部操作行（导出 / 再来一轮）与底部 sticky 栏重复，收起以让 Top Picks 进首屏；只保留不重复的「复制链接」 */}
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(searchLink(description, tlds, style, lengthPref));
                  setLinkCopied(true);
                  window.setTimeout(() => setLinkCopied(false), 2000);
                }}
                title={t("results.copyLinkTitle")}
                className="inline-flex items-center gap-1 rounded-md border border-line bg-bg1 px-2 py-0.5 font-mono text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:hidden"
              >
                {linkCopied ? <Check className="h-3 w-3 text-brand" /> : <Link2 className="h-3 w-3" />}
                {linkCopied ? t("results.linkCopied") : t("results.copyLink")}
              </button>
              {visible.length > 0 && (
                <button
                  onClick={() => exportResultsCsv(visible, lang, prices)}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-bg1 px-2 py-0.5 font-mono text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Download className="h-3 w-3" />
                  {t("results.exportCsvBtn")}
                </button>
              )}
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0"
              title={t("results.copyLinkTitle")}
              onClick={() => {
                void navigator.clipboard.writeText(searchLink(description, tlds, style, lengthPref));
                setLinkCopied(true);
                window.setTimeout(() => setLinkCopied(false), 2000);
              }}
            >
              {linkCopied ? <Check className="h-4 w-4 text-brand" /> : <Link2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{linkCopied ? t("results.linkCopied") : t("results.copyLink")}</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0">
                  <Download className="h-4 w-4" />
                  {t("common.export")}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => exportRows(visible, "csv")}>{t("common.exportCsv")}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => exportRows(visible, "txt")}>{t("common.exportTxt")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => triggerMore(false)}
              disabled={moreBlocked}
              title={quotaExhausted ? t("results.moreQuota") : undefined}
            >
              <RotateCw className={cn("h-4 w-4", running && "animate-spin")} />
              {moreArmed ? t("results.moreConfirm") : t("results.more")} <kbd className="hidden md:inline" style={{ background: "rgba(0,0,0,.2)", color: "inherit", borderColor: "rgba(0,0,0,.25)" }}>Space</kbd>
            </button>
          </div>
        </div>

        {/* Top Picks */}
        {topPicks.length > 0 && (
          <>
            <div className="mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-semibold">Top Picks</h2>
              <span className="text-xs text-txt2">{t("results.topPicks", { n: topPicks.length })}</span>
            </div>
            <div data-brand-wall="top" className="mb-8 grid gap-4 md:grid-cols-3">
              {topPicks.map((g, i) => (
                <TopPickCard
                  key={g.rows[0].domain}
                  group={g}
                  rank={i}
                  variant={variantOf(variants, g.label)}
                  locked={locked.has(g.rows[0].domain)}
                  onToggleLock={onToggleLock}
                  favorite={shortlistHas(g.rows[0].domain)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </>
        )}

        {/* 过滤工具条 */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-line bg-bg1 p-1">
            {(
              [
                { key: "available", label: t("results.filter.available", { n: availableRows.length }) },
                { key: "all", label: t("results.filter.all", { n: rows.length }) },
                { key: "taken", label: t("results.filter.taken", { n: takenRows.length }) },
              ] as { key: StatusFilter; label: string }[]
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={cn(
                  "tnum rounded-md px-2.5 py-1 text-xs",
                  statusFilter === f.key ? "bg-brand-dim font-semibold text-brand" : "text-txt1 hover:text-txt0",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          {tldCounts.length > 1 && (
            <div className="flex min-w-0 max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg1 p-1 no-scrollbar">
              <button
                onClick={() => setTldFilter("")}
                className={cn("shrink-0 rounded-md px-2 py-1 font-mono text-[11px]", !tldFilter ? "bg-bg3 font-semibold" : "text-txt1 hover:text-txt0")}
              >
                {t("results.filter.allTld")}
              </button>
              {tldCounts.map(([t, n]) => (
                <button
                  key={t}
                  onClick={() => setTldFilter(tldFilter === t ? "" : t)}
                  className={cn(
                    "tnum shrink-0 rounded-md px-2 py-1 font-mono text-[11px]",
                    tldFilter === t ? "bg-bg3 font-semibold" : "text-txt1 hover:text-txt0",
                  )}
                >
                  .{t} {n}
                </button>
              ))}
            </div>
          )}
          {themeCounts.length > 1 && (
            <div className="flex min-w-0 max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg1 p-1 no-scrollbar">
              {themeCounts.map(([th, n]) => (
                <button
                  key={th}
                  onClick={() => setThemeFilter(themeFilter === th ? "" : th)}
                  aria-pressed={themeFilter === th}
                  className={cn(
                    "tnum shrink-0 rounded-md px-2 py-1 text-[11px]",
                    themeFilter === th ? "bg-brand-dim font-semibold text-brand" : "text-txt1 hover:text-txt0",
                  )}
                >
                  {t(`results.theme.${th}` as I18nKey)} {n}
                </button>
              ))}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 items-center gap-1 rounded-lg border border-line px-2.5 text-xs text-txt1 hover:text-txt0">
                <ArrowDownWideNarrow className="h-3.5 w-3.5" />
                {sort === "score" ? t("results.sort.score") : sort === "length" ? t("results.sort.length") : t("results.sort.price")}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => setSort("score")}>{t("results.sort.byScore")}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSort("length")}>{t("results.sort.byLength")}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSort("price")}>{t("results.sort.byPrice")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1" />
          <span className="hidden items-center gap-2 text-[11px] text-txt2 lg:flex">
            <kbd>↑↓</kbd>{t("results.kbd")} <kbd>C</kbd>{t("results.kbdCopy")} <kbd>S</kbd>{t("results.kbdFav")} <kbd>⏎</kbd>{t("results.kbdReg")}
          </span>
          {view === "rows" && (
            <div role="group" aria-label={t("results.density")} className="hidden items-center gap-1 rounded-lg border border-line bg-bg1 p-1 md:flex">
              {(
                [
                  { key: "comfortable", Icon: Rows2, label: t("results.densityComfortable"), title: t("results.densityComfortableTitle") },
                  { key: "compact", Icon: Rows4, label: t("results.densityCompact"), title: t("results.densityCompactTitle") },
                ] as { key: Density; Icon: typeof Rows2; label: string; title: string }[]
              ).map((d) => (
                <button
                  key={d.key}
                  type="button"
                  title={d.title}
                  aria-pressed={density === d.key}
                  data-density-option={d.key}
                  onClick={() => setDensity(d.key)}
                  className={cn(
                    "flex h-7 items-center gap-1 rounded-md px-2 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    density === d.key ? "bg-bg3 font-semibold text-txt0" : "text-txt2 hover:text-txt0",
                  )}
                >
                  <d.Icon className="h-3.5 w-3.5" />
                  {d.label}
                </button>
              ))}
            </div>
          )}
          <div role="group" aria-label={t("results.view")} className="flex items-center gap-1 rounded-lg border border-line bg-bg1 p-1">
            <button
              title={t("results.viewRows")}
              aria-label={t("results.viewRows")}
              aria-pressed={view === "rows"}
              onClick={() => setView("rows")}
              className={cn("grid h-11 w-11 place-items-center rounded-md sm:h-7 sm:w-7", view === "rows" ? "bg-bg3" : "text-txt2 hover:text-txt0")}
            >
              <Rows3 className="h-3.5 w-3.5" />
            </button>
            <button
              title={t("results.viewGrid")}
              aria-label={t("results.viewGrid")}
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={cn("grid h-11 w-11 place-items-center rounded-md sm:h-7 sm:w-7", view === "grid" ? "bg-bg3" : "text-txt2 hover:text-txt0")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 列表 / 网格 */}
        {view === "rows" ? (
          <div
            ref={listRef}
            data-density={compact ? "compact" : "comfortable"}
            className={cn(
              "rounded-xl border border-line bg-bg1",
              // 紧凑模式去掉 1px 分隔线（26px 行距，1080p 去掉顶栏/底栏后一屏完整可见 ≥34 行），改用斑马底辅助横向扫读
              compact ? "py-1 [&>[data-domain]:nth-child(even)]:bg-bg2/50" : "divide-y divide-line",
            )}
          >
            {visible.map((r, i) => (
              <DomainRow
                key={r.domain}
                row={r}
                compact={compact}
                variant={variantOf(variants, r.label)}
                selected={i === selectedIdx}
                locked={locked.has(r.domain)}
                onToggleLock={r.status === "available" ? onToggleLock : undefined}
                favorite={shortlistHas(r.domain)}
                onToggleFavorite={r.status !== "taken" ? onToggleFavorite : undefined}
                disliked={dislikedHas(r.label)}
                onToggleDislike={r.status !== "taken" ? onToggleDislike : undefined}
              />
            ))}
            {visible.length === 0 && <p className="px-4 py-8 text-center text-sm text-txt2">{t("results.noMatch")}</p>}
          </div>
        ) : (
          <div data-brand-wall="grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridGroups.map((g) => (
              <GridCard
                key={g.rows[0].domain}
                group={g}
                variant={variantOf(variants, g.label)}
                locked={locked}
                onToggleLock={onToggleLock}
                shortlistHas={shortlistHas}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* 已占用折叠区 */}
        {statusFilter === "available" && takenRows.length > 0 && (
          <details className="group mt-4">
            <summary className="flex cursor-pointer items-center gap-1.5 text-xs text-txt2 hover:text-txt1">
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
              {t("results.takenFold", { n: takenRows.length })}
            </summary>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 rounded-xl border border-line bg-bg1 px-4 py-3">
              {takenRows.map((r) => (
                <span key={r.domain} className="font-mono text-xs text-taken line-through">
                  {r.domain}
                </span>
              ))}
            </div>
          </details>
        )}
      </main>

      {/* 底部 sticky：锁定 + 围绕锁定再来一轮 */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg1/90 backdrop-blur-[12px]">
        {spaceArmed && (
          <div className="pointer-events-none absolute inset-x-0 -top-9 flex justify-center" role="status">
            <span className="rounded-md border border-line bg-bg2 px-3 py-1.5 text-xs text-txt0 shadow-sm">{t("results.spaceConfirm")}</span>
          </div>
        )}
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-4 md:px-6">
          {quotaExhausted ? (
            <span className="min-w-0 truncate text-[11px] text-txt2 sm:text-xs">{t("results.moreQuota")}</span>
          ) : locked.size > 0 ? (
            <>
              <span className="hidden items-center gap-1.5 truncate text-xs text-txt1 md:flex">
                <Lock className="h-3.5 w-3.5 shrink-0 text-brand" />
                {t("results.lockedCount", { n: locked.size })}
                <span className="truncate font-mono">{lockedList.join("、")}</span>
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap text-[11px] text-txt1 md:hidden">
                <Lock className="h-3.5 w-3.5 shrink-0 text-brand" />
                {t("results.lockedShort", { n: locked.size })}
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-txt2 sm:gap-1.5 sm:text-xs">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{t("results.lockHint")}</span>
              <span className="whitespace-nowrap sm:hidden">{t("results.lockHintShort")}</span>
            </span>
          )}
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button title={t("common.export")} className="flex h-11 w-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-line text-sm text-txt1 hover:bg-bg2 hover:text-txt0 sm:w-auto sm:px-3 md:h-9">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t("common.export")}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => exportRows(visible, "csv")}>{t("common.exportCsv")}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => exportRows(visible, "txt")}>{t("common.exportTxt")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            className="flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-brand px-3.5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 sm:px-4 md:h-9"
            onClick={() => triggerMore(locked.size > 0)}
            disabled={moreBlocked}
            title={quotaExhausted ? t("results.moreQuota") : undefined}
          >
            <RotateCw className={cn("h-4 w-4", running && "animate-spin")} />
            {moreArmed ? t("results.moreConfirm") : locked.size > 0 ? t("results.moreAroundLocked") : t("results.more")}
          </button>
        </div>
      </div>
    </>
  );
}
