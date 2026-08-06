import { useRef, useState } from "react";
import { Bookmark, Check, Download, ExternalLink, Link2, Loader2, RotateCw, Sparkles, Trash2 } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CopyButton, RegisterMenu } from "@/components/domain-row";
import { ScoreBars } from "@/components/score-bars";
import { downloadText } from "@/lib/export";
import { useI18n, type TFunc } from "@/lib/i18n";
import { REGISTRARS } from "@/lib/registrars";
import type { ShortlistItem } from "@/lib/shortlist";
import { scoreBadgeClass, tldPriceFull, tldPriceShort, totalScore, type Status } from "@/types";
import { cn } from "@/lib/utils";

function exportShortlist(items: ShortlistItem[], format: "csv" | "txt") {
  let content: string;
  if (format === "csv") {
    const header = "domain,score,length,readability,relevance,brandability,meaning";
    const lines = items.map((it) => {
      const s = it.scores;
      const meaning = `"${(it.meaning ?? "").replace(/"/g, '""')}"`;
      return [it.domain, s ? totalScore(s) : "", s?.length ?? "", s?.readability ?? "", s?.relevance ?? "", s?.brandability ?? "", meaning].join(",");
    });
    content = [header, ...lines].join("\n");
  } else {
    content = items.map((it) => it.domain).join("\n");
  }
  downloadText(content, `domainhunter-shortlist.${format}`, format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8");
}

const BAR_KEYS = ["length", "readability", "relevance", "brandability"] as const;

/** 复查后的状态变化：taken 高亮红，重新可注册高亮绿 */
type StatusChange = "becameTaken" | "becameAvailable";

function StatusBadge({ change, t }: { change: StatusChange; t: TFunc }) {
  if (change === "becameTaken") {
    return <span className="shrink-0 rounded bg-taken-dim px-1.5 py-0.5 text-[11px] font-semibold text-taken">{t("shortlist.becameTaken")}</span>;
  }
  return <span className="shrink-0 rounded bg-brand-dim px-1.5 py-0.5 text-[11px] font-semibold text-brand">{t("shortlist.becameAvailable")}</span>;
}

export function ShortlistPage({
  items,
  onRemove,
  onClear,
  onStart,
  lastCheckedAt,
  onApplyStatuses,
}: {
  items: ShortlistItem[];
  onRemove: (domain: string) => void;
  onClear: () => void;
  onStart: () => void;
  lastCheckedAt: number | null;
  onApplyStatuses: (statuses: Record<string, Status>) => void;
}) {
  const { t, lang } = useI18n();
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [shareError, setShareError] = useState("");
  const [rechecking, setRechecking] = useState(false);
  const [recheckError, setRecheckError] = useState("");
  const [checkingDomains, setCheckingDomains] = useState<Set<string>>(new Set());
  const [changes, setChanges] = useState<Record<string, StatusChange>>({});
  const abortRef = useRef<AbortController | null>(null);

  const batchRegister = () => {
    for (const it of items.slice(0, 8)) window.open(REGISTRARS[3].url(it.domain), "_blank");
  };

  async function share() {
    setSharing(true);
    setShareError("");
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: items.map(({ domain, meaning, scores }) => ({ domain, meaning, scores })) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { url } = (await res.json()) as { url: string };
      setShareUrl(url);
      try {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch { /* 剪贴板不可用时仍展示链接 */ }
    } catch {
      setShareError(t("shortlist.shareFailed"));
    } finally {
      setSharing(false);
    }
  }

  async function recheck() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setRechecking(true);
    setRecheckError("");
    setChanges({});
    setCheckingDomains(new Set(items.map((i) => i.domain)));
    const prevStatus = new Map(items.map((i) => [i.domain, i.status]));
    const statuses: Record<string, Status> = {};
    const newChanges: Record<string, StatusChange> = {};
    try {
      const res = await fetch("/api/check?refresh=1", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domains: items.map((i) => i.domain), refresh: true }),
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop()!;
        for (const line of lines) {
          if (!line) continue;
          const r = JSON.parse(line) as { domain: string; status: Status };
          statuses[r.domain] = r.status;
          const prev = prevStatus.get(r.domain);
          if (r.status === "taken" && prev != null && prev !== "taken") newChanges[r.domain] = "becameTaken";
          else if (r.status === "available" && prev === "taken") newChanges[r.domain] = "becameAvailable";
          setCheckingDomains((prev2) => {
            const next = new Set(prev2);
            next.delete(r.domain);
            return next;
          });
          setChanges({ ...newChanges });
        }
      }
      onApplyStatuses(statuses);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setRecheckError(t("shortlist.recheckFailed"));
    } finally {
      setRechecking(false);
      setCheckingDomains(new Set());
    }
  }

  const barLabels: Record<(typeof BAR_KEYS)[number], string> = {
    length: t("score.length"),
    readability: t("score.readability"),
    relevance: t("score.relevance"),
    brandability: t("score.brandability"),
  };

  const lastCheckedStr = lastCheckedAt
    ? t("shortlist.lastChecked", { time: new Date(lastCheckedAt).toLocaleString(lang === "zh" ? "zh-CN" : "en-US") })
    : t("shortlist.neverChecked");

  const rowHighlight = (change?: StatusChange) =>
    change === "becameTaken"
      ? "bg-taken-dim/40 shadow-[inset_2px_0_0_var(--taken,#e5484d)]"
      : change === "becameAvailable"
        ? "bg-brand-dim/40 shadow-[inset_2px_0_0_var(--brand)]"
        : undefined;

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 md:px-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">{t("shortlist.title")}</h1>
        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => void recheck()}
              disabled={rechecking}
            >
              <RotateCw className={cn("h-4 w-4", rechecking && "animate-spin")} />
              {rechecking ? t("shortlist.rechecking") : t("shortlist.recheck")}
            </button>
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => void share()}
              disabled={sharing}
            >
              {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              {sharing ? t("shortlist.sharing") : t("shortlist.share")}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0">
                  <Download className="h-4 w-4" />
                  {t("common.export")}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => exportShortlist(items, "csv")}>{t("common.exportCsv")}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => exportShortlist(items, "txt")}>{t("common.exportTxt")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-destructive" onClick={onClear}>
              <Trash2 className="h-4 w-4" />
              {t("shortlist.clear")}
            </button>
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
              onClick={batchRegister}
            >
              <ExternalLink className="h-4 w-4" />
              {t("shortlist.batchRegister", { n: items.length })}
            </button>
          </div>
        )}
      </div>
      <p className="mb-2 text-xs text-txt2">{t("shortlist.hint")}</p>
      {items.length > 0 && <p className="tnum mb-3 text-xs text-txt2">{lastCheckedStr}</p>}

      {shareUrl && (
        <p className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-brand-line bg-brand-dim/40 px-4 py-2.5 text-sm text-txt1">
          <Link2 className="h-4 w-4 shrink-0 text-brand" />
          {t("shortlist.shareReady")}
          <a href={shareUrl} target="_blank" rel="noreferrer" className="break-all font-mono text-xs text-brand underline">
            {shareUrl}
          </a>
          {shareCopied && (
            <span className="flex items-center gap-1 text-xs text-brand">
              <Check className="h-3.5 w-3.5" />
              {t("shortlist.shareCopied")}
            </span>
          )}
        </p>
      )}
      {(shareError || recheckError) && (
        <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{shareError || recheckError}</p>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <Bookmark className="mx-auto h-6 w-6 text-txt2" />
          <p className="mt-3 text-sm text-txt1">{t("shortlist.empty")}</p>
          <button
            className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
            onClick={onStart}
          >
            <Sparkles className="h-4 w-4" />
            {t("shortlist.startHunt")}
          </button>
        </div>
      ) : (
        <>
          {/* 对比表（桌面） */}
          <div className="hidden overflow-x-auto rounded-xl border border-line bg-bg1 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-txt2">
                  <th className="px-4 py-3 font-medium">{t("shortlist.domain")}</th>
                  <th className="px-3 py-3 text-center font-medium">{t("score.total")}</th>
                  {BAR_KEYS.map((k) => (
                    <th key={k} className="px-3 py-3 font-medium">
                      {barLabels[k]}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-right font-medium">{t("shortlist.price")}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((it) => {
                  const score = it.scores ? totalScore(it.scores) : undefined;
                  const change = changes[it.domain];
                  return (
                    <tr key={it.domain} className={rowHighlight(change)}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-mono text-[15px] font-semibold", change === "becameTaken" && "text-taken line-through")}>
                            {it.label}
                            <span className="text-txt2">.{it.tld}</span>
                          </span>
                          {checkingDomains.has(it.domain) && <Loader2 className="h-3.5 w-3.5 animate-spin text-amber2" />}
                          {change && <StatusBadge change={change} t={t} />}
                        </div>
                        {it.meaning && <div className="mt-0.5 max-w-xs truncate text-xs text-txt1">{it.meaning}</div>}
                      </td>
                      <td className="px-3 text-center">
                        <span className={cn("tnum rounded-md px-2 py-0.5 font-mono text-xs font-bold", score !== undefined ? scoreBadgeClass(score) : "bg-bg3 text-txt1")}>
                          {score ?? "—"}
                        </span>
                      </td>
                      {BAR_KEYS.map((k) => (
                        <td key={k} className="px-3">
                          {it.scores ? (
                            <>
                              <div className="bar min-w-[56px]">
                                <i style={{ width: `${it.scores[k]}%` }} />
                              </div>
                              <span className="tnum font-mono text-[11px] text-txt2">{it.scores[k]}</span>
                            </>
                          ) : (
                            <span className="text-xs text-txt2">—</span>
                          )}
                        </td>
                      ))}
                      <td title={tldPriceFull(it.tld, lang)} className="tnum px-3 text-right font-mono text-xs text-txt1">{tldPriceShort(it.tld, lang) ?? "—"}</td>
                      <td className="whitespace-nowrap px-4 text-right">
                        <span className="inline-flex items-center gap-1">
                          <CopyButton domain={it.domain} />
                          <button
                            title={t("common.remove")}
                            className="grid h-8 w-8 place-items-center rounded-md text-txt2 hover:bg-bg3 hover:text-destructive"
                            onClick={() => onRemove(it.domain)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <RegisterMenu domain={it.domain}>
                            <button className="h-8 rounded-md bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-80">{t("common.register")}</button>
                          </RegisterMenu>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 移动端卡片版 */}
          <div className="space-y-3 md:hidden">
            {items.map((it) => {
              const score = it.scores ? totalScore(it.scores) : undefined;
              const change = changes[it.domain];
              return (
                <div key={it.domain} className={cn("rounded-xl border border-line bg-bg1 p-4", rowHighlight(change))}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("truncate font-mono text-[15px] font-semibold", change === "becameTaken" && "text-taken line-through")}>
                      {it.label}
                      <span className="text-txt2">.{it.tld}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {checkingDomains.has(it.domain) && <Loader2 className="h-3.5 w-3.5 animate-spin text-amber2" />}
                      {change && <StatusBadge change={change} t={t} />}
                      {score !== undefined && (
                        <span className={cn("tnum shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold", scoreBadgeClass(score))}>{score}</span>
                      )}
                    </span>
                  </div>
                  {it.meaning && <p className="mt-1 text-xs text-txt1">{it.meaning}</p>}
                  {it.scores && <ScoreBars scores={it.scores} columns={4} className="mt-3" />}
                  <div className="mt-3 flex items-center gap-2">
                    <span title={tldPriceFull(it.tld, lang)} className="tnum flex-1 font-mono text-xs text-txt1">{tldPriceShort(it.tld, lang) ?? ""}</span>
                    <button
                      title={t("common.remove")}
                      className="grid h-11 w-11 place-items-center rounded-md border border-line text-txt2 hover:text-destructive"
                      onClick={() => onRemove(it.domain)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <RegisterMenu domain={it.domain}>
                      <button className="h-11 rounded-md bg-brand px-4 text-xs font-semibold text-brand-ink">{t("common.register")}</button>
                    </RegisterMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
