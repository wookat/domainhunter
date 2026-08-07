import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownWideNarrow,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  Copy,
  ChevronRight,
  Download,
  Link2,
  LayoutGrid,
  Lock,
  RotateCw,
  Rows3,
  Trophy,
} from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CopyButton, DomainRow, MeaningText, RegisterMenu } from "@/components/domain-row";
import { ScoreBars } from "@/components/score-bars";
import { downloadText, exportRows } from "@/lib/export";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { priceFull, priceShort, usePrices } from "@/lib/prices";
import { scoreBadgeClass, tldPrice, totalScore, type Row, type Theme } from "@/types";
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

// 品牌卡预览：按名字哈希确定性选配色与字形，纯 CSS 轻量模拟 logo 视觉（Namelix 式）
const BRAND_GRADIENTS = [
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#10b981,#0d9488)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
  "linear-gradient(135deg,#334155,#0f172a)",
  "linear-gradient(135deg,#14b8a6,#3b82f6)",
] as const;

function brandHash(label: string): number {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return h;
}

function BrandMark({ label }: { label: string }) {
  const h = brandHash(label);
  const bg = BRAND_GRADIENTS[h % BRAND_GRADIENTS.length];
  const variant = (h >> 3) % 3;
  const text = variant === 0 ? label.toUpperCase() : variant === 1 ? label.charAt(0).toUpperCase() + label.slice(1) : label;
  return (
    <div className="grid h-20 place-items-center rounded-lg" style={{ background: bg }} aria-hidden>
      <span
        className={cn(
          "max-w-full truncate px-3 text-white",
          variant === 0 && "text-sm font-extrabold tracking-[0.22em]",
          variant === 1 && "font-serif text-xl font-semibold tracking-tight",
          variant === 2 && "font-mono text-lg font-bold lowercase tracking-tight",
        )}
      >
        {text}
      </span>
    </div>
  );
}

function TopPickCard({
  row,
  rank,
  locked,
  onToggleLock,
  favorite,
  onToggleFavorite,
}: {
  row: Row;
  rank: number;
  locked: boolean;
  onToggleLock: (domain: string) => void;
  favorite: boolean;
  onToggleFavorite: (row: Row) => void;
}) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const score = row.scores ? totalScore(row.scores) : 0;
  return (
    <div className={cn("rounded-xl border bg-bg1 p-5", rank === 0 ? "border-brand-line" : "border-line")}>
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
        <BrandMark label={row.label} />
      </div>
      <div className="mt-3 truncate font-mono text-2xl font-bold tracking-tight">
        {row.label}
        <span className="text-txt2">.{row.tld}</span>
      </div>
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

function GridCard({
  row,
  locked,
  onToggleLock,
  favorite,
  onToggleFavorite,
}: {
  row: Row;
  locked: boolean;
  onToggleLock: (domain: string) => void;
  favorite: boolean;
  onToggleFavorite: (row: Row) => void;
}) {
  const { t, lang } = useI18n();
  const score = row.scores ? totalScore(row.scores) : undefined;
  return (
    <div className="rounded-xl border border-line bg-bg1 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-lg font-semibold">
          {row.label}
          <span className="text-txt2">.{row.tld}</span>
        </span>
        {score !== undefined && (
          <span className={cn("tnum shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold", scoreBadgeClass(score))}>{score}</span>
        )}
      </div>
      {row.meaning && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-txt1"><MeaningText text={row.meaning} /></p>}
      {row.scores && <ScoreBars scores={row.scores} columns={4} className="mt-3" />}
      <div className="mt-3 flex items-center gap-1">
        <button
          title={t("results.lockTitle")}
          aria-pressed={locked}
          onClick={() => onToggleLock(row.domain)}
          className={cn("grid h-8 w-8 place-items-center rounded-md border", locked ? "border-brand-line text-brand" : "border-line text-txt2 hover:text-txt0")}
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
        <div className="flex-1" />
        <RegisterMenu domain={row.domain}>
          <button className="h-8 rounded-md bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-80">{t("common.register")}</button>
        </RegisterMenu>
      </div>
    </div>
  );
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
  onMore,
  onMoreAroundLocked,
  running,
  moreDisabled,
  dislikedHas,
  onToggleDislike,
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
  onMore: () => void;
  onMoreAroundLocked: () => void;
  running: boolean;
  moreDisabled?: boolean;
  dislikedHas: (label: string) => boolean;
  onToggleDislike: (label: string) => void;
}) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("available");
  const [tldFilter, setTldFilter] = useState<string>("");
  const [themeFilter, setThemeFilter] = useState<Theme | "">("");
  const [sort, setSort] = useState<SortKey>("score");
  const [view, setView] = useState<View>("rows");
  const [linkCopied, setLinkCopied] = useState(false);
  const [availCopied, setAvailCopied] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
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

  const topPicks = useMemo(() => sortRows(availableRows, "score").slice(0, 3), [availableRows]);

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

  function exportFilteredCsv() {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const header = "domain,status,meaning,theme,score,length,readability,relevance,brandability,first_year_price";
    const lines = visible.map((r) => {
      const s = r.scores;
      return [
        r.domain,
        r.status,
        esc(r.meaning ?? ""),
        r.theme ?? "",
        s ? totalScore(s) : "",
        s?.length ?? "",
        s?.readability ?? "",
        s?.relevance ?? "",
        s?.brandability ?? "",
        esc(priceShort(r.tld, lang, prices) ?? ""),
      ].join(",");
    });
    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    downloadText([header, ...lines].join("\n"), `domainhunter-results-${ymd}.csv`, "text/csv;charset=utf-8");
  }

  // 键盘导航：↑↓ 选中 / C 复制 / S 收藏 / Enter 注册 / Space 再来一轮
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => {
          const next = e.key === "ArrowDown" ? Math.min(i + 1, visible.length - 1) : Math.max(i - 1, 0);
          const el = listRef.current?.querySelector(`[data-domain="${visible[next]?.domain}"]`);
          el?.scrollIntoView({ block: "nearest" });
          return next;
        });
      } else if (e.key === " " && !running && !moreDisabled) {
        e.preventDefault();
        if (locked.size > 0) onMoreAroundLocked();
        else onMore();
      } else if (selectedIdx >= 0 && selectedIdx < visible.length) {
        const row = visible[selectedIdx];
        if (e.key === "c" || e.key === "C") void navigator.clipboard.writeText(row.domain);
        else if (e.key === "s" || e.key === "S") onToggleFavorite(row);
        else if (e.key === "Enter") window.open(`https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(row.domain)}`, "_blank");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, selectedIdx, running, moreDisabled, locked, onMore, onMoreAroundLocked, onToggleFavorite]);

  const lockedList = [...locked];

  return (
    <>
      <main className="mx-auto max-w-6xl overflow-x-clip px-4 py-6 pb-24 md:px-6">
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
                  onClick={() => {
                    void navigator.clipboard.writeText(visibleAvailable.map((r) => r.domain).join("\n"));
                    setAvailCopied(true);
                    setTimeout(() => setAvailCopied(false), 1500);
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-bg1 px-2 py-0.5 font-mono text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {availCopied ? <Check className="h-3 w-3 text-brand" /> : <Copy className="h-3 w-3" />}
                  {availCopied ? t("results.copiedAvail") : t("results.copyAvailBtn", { n: visibleAvailable.length })}
                </button>
              )}
              {visible.length > 0 && (
                <button
                  onClick={exportFilteredCsv}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-bg1 px-2 py-0.5 font-mono text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Download className="h-3 w-3" />
                  {t("results.exportCsvBtn")}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
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
              onClick={onMore}
              disabled={running || moreDisabled}
            >
              <RotateCw className={cn("h-4 w-4", running && "animate-spin")} />
              {t("results.more")} <kbd className="hidden md:inline" style={{ background: "rgba(0,0,0,.2)", color: "inherit", borderColor: "rgba(0,0,0,.25)" }}>Space</kbd>
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
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {topPicks.map((r, i) => (
                <TopPickCard
                  key={r.domain}
                  row={r}
                  rank={i}
                  locked={locked.has(r.domain)}
                  onToggleLock={onToggleLock}
                  favorite={shortlistHas(r.domain)}
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
            <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg1 p-1 no-scrollbar">
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
            <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg1 p-1 no-scrollbar">
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
          <div className="flex items-center gap-1 rounded-lg border border-line bg-bg1 p-1">
            <button
              title={t("results.viewRows")}
              onClick={() => setView("rows")}
              className={cn("grid h-7 w-7 place-items-center rounded-md", view === "rows" ? "bg-bg3" : "text-txt2 hover:text-txt0")}
            >
              <Rows3 className="h-3.5 w-3.5" />
            </button>
            <button
              title={t("results.viewGrid")}
              onClick={() => setView("grid")}
              className={cn("grid h-7 w-7 place-items-center rounded-md", view === "grid" ? "bg-bg3" : "text-txt2 hover:text-txt0")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 列表 / 网格 */}
        {view === "rows" ? (
          <div ref={listRef} className="divide-y divide-line rounded-xl border border-line bg-bg1">
            {visible.map((r, i) => (
              <DomainRow
                key={r.domain}
                row={r}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible
              .filter((r) => r.status !== "taken")
              .map((r) => (
                <GridCard
                  key={r.domain}
                  row={r}
                  locked={locked.has(r.domain)}
                  onToggleLock={onToggleLock}
                  favorite={shortlistHas(r.domain)}
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
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-4 md:px-6">
          {locked.size > 0 ? (
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
            onClick={locked.size > 0 ? onMoreAroundLocked : onMore}
            disabled={running || moreDisabled}
          >
            <RotateCw className={cn("h-4 w-4", running && "animate-spin")} />
            {locked.size > 0 ? t("results.moreAroundLocked") : t("results.more")}
          </button>
        </div>
      </div>
    </>
  );
}
