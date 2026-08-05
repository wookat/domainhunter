import { Bookmark, Download, ExternalLink, Sparkles, Trash2 } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CopyButton, RegisterMenu } from "@/components/domain-row";
import { ScoreBars } from "@/components/score-bars";
import { downloadText } from "@/lib/export";
import { REGISTRARS } from "@/lib/registrars";
import type { ShortlistItem } from "@/lib/shortlist";
import { scoreBadgeClass, tldPrice, totalScore } from "@/types";
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

const BARS: { key: "length" | "readability" | "relevance" | "brandability"; label: string }[] = [
  { key: "length", label: "长度" },
  { key: "readability", label: "读感" },
  { key: "relevance", label: "寓意" },
  { key: "brandability", label: "品牌感" },
];

export function ShortlistPage({
  items,
  onRemove,
  onClear,
  onStart,
}: {
  items: ShortlistItem[];
  onRemove: (domain: string) => void;
  onClear: () => void;
  onStart: () => void;
}) {
  const batchRegister = () => {
    for (const it of items.slice(0, 8)) window.open(REGISTRARS[3].url(it.domain), "_blank");
  };

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 md:px-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">候选清单</h1>
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0">
                  <Download className="h-4 w-4" />
                  导出 CSV / TXT
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => exportShortlist(items, "csv")}>导出 CSV</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => exportShortlist(items, "txt")}>导出 TXT</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-destructive" onClick={onClear}>
              <Trash2 className="h-4 w-4" />
              清空
            </button>
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
              onClick={batchRegister}
            >
              <ExternalLink className="h-4 w-4" />
              批量去注册（{items.length}）
            </button>
          </div>
        )}
      </div>
      <p className="mb-5 text-xs text-txt2">本地保存（localStorage，跨会话保留）· 注册前建议重新核验可用性</p>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <Bookmark className="mx-auto h-6 w-6 text-txt2" />
          <p className="mt-3 text-sm text-txt1">还没有候选。搜索结果里点收藏，就会汇总到这里，随时对比与导出。</p>
          <button
            className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
            onClick={onStart}
          >
            <Sparkles className="h-4 w-4" />
            开始猎取
          </button>
        </div>
      ) : (
        <>
          {/* 对比表（桌面） */}
          <div className="hidden overflow-x-auto rounded-xl border border-line bg-bg1 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-txt2">
                  <th className="px-4 py-3 font-medium">域名</th>
                  <th className="px-3 py-3 text-center font-medium">综合</th>
                  {BARS.map((b) => (
                    <th key={b.key} className="px-3 py-3 font-medium">
                      {b.label}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-right font-medium">参考价</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((it) => {
                  const score = it.scores ? totalScore(it.scores) : undefined;
                  return (
                    <tr key={it.domain}>
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-[15px] font-semibold">
                          {it.label}
                          <span className="text-txt2">.{it.tld}</span>
                        </div>
                        {it.meaning && <div className="mt-0.5 max-w-xs truncate text-xs text-txt1">{it.meaning}</div>}
                      </td>
                      <td className="px-3 text-center">
                        <span className={cn("tnum rounded-md px-2 py-0.5 font-mono text-xs font-bold", score !== undefined ? scoreBadgeClass(score) : "bg-bg3 text-txt1")}>
                          {score ?? "—"}
                        </span>
                      </td>
                      {BARS.map((b) => (
                        <td key={b.key} className="px-3">
                          {it.scores ? (
                            <>
                              <div className="bar min-w-[56px]">
                                <i style={{ width: `${it.scores[b.key]}%` }} />
                              </div>
                              <span className="tnum font-mono text-[11px] text-txt2">{it.scores[b.key]}</span>
                            </>
                          ) : (
                            <span className="text-xs text-txt2">—</span>
                          )}
                        </td>
                      ))}
                      <td className="tnum px-3 text-right font-mono text-xs text-txt1">{tldPrice(it.tld) ?? "—"}</td>
                      <td className="whitespace-nowrap px-4 text-right">
                        <span className="inline-flex items-center gap-1">
                          <CopyButton domain={it.domain} />
                          <button
                            title="移除"
                            className="grid h-8 w-8 place-items-center rounded-md text-txt2 hover:bg-bg3 hover:text-destructive"
                            onClick={() => onRemove(it.domain)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <RegisterMenu domain={it.domain}>
                            <button className="h-8 rounded-md bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-80">去注册</button>
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
              return (
                <div key={it.domain} className="rounded-xl border border-line bg-bg1 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[15px] font-semibold">
                      {it.label}
                      <span className="text-txt2">.{it.tld}</span>
                    </span>
                    {score !== undefined && (
                      <span className={cn("tnum shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold", scoreBadgeClass(score))}>{score}</span>
                    )}
                  </div>
                  {it.meaning && <p className="mt-1 text-xs text-txt1">{it.meaning}</p>}
                  {it.scores && <ScoreBars scores={it.scores} columns={4} className="mt-3" />}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="tnum flex-1 font-mono text-xs text-txt1">{tldPrice(it.tld) ?? ""}</span>
                    <button
                      title="移除"
                      className="grid h-11 w-11 place-items-center rounded-md border border-line text-txt2 hover:text-destructive"
                      onClick={() => onRemove(it.domain)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <RegisterMenu domain={it.domain}>
                      <button className="h-11 rounded-md bg-brand px-4 text-xs font-semibold text-brand-ink">去注册</button>
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
