import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DomainCard } from "@/components/domain-card";
import { totalScore, type Row, type Status } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | Status;

function exportRows(rows: Row[], format: "csv" | "txt") {
  let content: string;
  if (format === "csv") {
    const header = "domain,status,score,length,readability,relevance,brandability,meaning";
    const lines = rows.map((r) => {
      const s = r.scores;
      const meaning = `"${(r.meaning ?? "").replace(/"/g, '""')}"`;
      return [r.domain, r.status, s ? totalScore(s) : "", s?.length ?? "", s?.readability ?? "", s?.relevance ?? "", s?.brandability ?? "", meaning].join(",");
    });
    content = [header, ...lines].join("\n");
  } else {
    content = rows.map((r) => r.domain).join("\n");
  }
  const blob = new Blob(["\ufeff" + content], { type: format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `domainhunter-results.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}

function sortRows(rows: Row[]): Row[] {
  const rank: Record<Status, number> = { available: 0, checking: 1, unknown: 2, taken: 3 };
  return [...rows].sort((a, b) => {
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    const sa = a.scores ? totalScore(a.scores) : -1;
    const sb = b.scores ? totalScore(b.scores) : -1;
    return sb - sa;
  });
}

export function ResultsPage({
  rows,
  description,
  roundCount,
  favorites,
  onToggleFavorite,
  onMore,
  running,
}: {
  rows: Row[];
  description: string;
  roundCount: number;
  favorites: Set<string>;
  onToggleFavorite: (domain: string) => void;
  onMore: () => void;
  running: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: rows.length, available: 0, taken: 0, unknown: 0, checking: 0 };
    for (const r of rows) c[r.status]++;
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    let list = rows;
    if (onlyAvailable) list = list.filter((r) => r.status === "available");
    else if (filter !== "all") list = list.filter((r) => r.status === filter);
    return sortRows(list);
  }, [rows, filter, onlyAvailable]);

  const filters: { key: Filter; label: string; dot?: string }[] = [
    { key: "all", label: "全部" },
    { key: "available", label: "可注册", dot: "bg-emerald-500" },
    { key: "taken", label: "已注册", dot: "bg-rose-400" },
    { key: "unknown", label: "未知", dot: "bg-zinc-400" },
  ];

  return (
    <>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 md:pb-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">
              找到 <span className="text-emerald-600">{counts.available}</span> 个可注册域名
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              「{description.length > 24 ? description.slice(0, 24) + "…" : description}」 · {roundCount} 轮 · 共核验 {rows.length} 个
            </p>
          </div>
        </div>

        <div className="no-scrollbar -mx-4 mt-4 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {filters.map((f) => {
            const active = !onlyAvailable && filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setOnlyAvailable(false);
                }}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-colors",
                  active
                    ? f.key === "all"
                      ? "bg-zinc-900 text-white"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300",
                )}
              >
                {f.dot && <span className={cn("h-1.5 w-1.5 rounded-full", f.dot)} />}
                {f.label} {counts[f.key]}
              </button>
            );
          })}
          <span className="mx-1 hidden h-5 w-px bg-zinc-200 md:block" />
          <label className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 text-xs font-medium text-zinc-600">
            <Switch checked={onlyAvailable} onCheckedChange={setOnlyAvailable} />
            只看可注册
          </label>
          <span className="ml-auto hidden h-8 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 md:inline-flex">
            <ArrowDownWideNarrow className="h-3.5 w-3.5" />
            按评分排序
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((r) => (
            <DomainCard key={r.domain} row={r} favorite={favorites.has(r.domain)} onToggleFavorite={onToggleFavorite} />
          ))}
        </div>
        {visible.length === 0 && (
          <p className="mt-10 text-center text-sm text-zinc-400">没有符合筛选条件的域名</p>
        )}

        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="h-10 px-5 hover:border-emerald-300 hover:text-emerald-700"
            onClick={onMore}
            disabled={running}
          >
            <RefreshCw className={cn("h-4 w-4", running && "animate-spin")} />
            不满意？再来一批
          </Button>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-zinc-200 bg-white/95 backdrop-blur md:hidden">
        <div className="flex h-16 items-center gap-2 px-4">
          <Button className="h-11 flex-1 font-semibold" onClick={onMore} disabled={running}>
            <RefreshCw className={cn("h-4 w-4", running && "animate-spin")} />
            再来一批
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 px-4">
                <Download className="h-4 w-4" />
                导出
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => exportRows(visible, "csv")}>导出 CSV</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => exportRows(visible, "txt")}>导出 TXT</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}

export function ExportMenu({ rows }: { rows: Row[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="hidden md:inline-flex">
          <Download className="h-4 w-4" />
          导出
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => exportRows(rows, "csv")}>导出 CSV</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportRows(rows, "txt")}>导出 TXT</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
