import { ArrowRight, BrainCircuit, Check, Loader2, Pencil } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProgressCard } from "@/components/domain-card";
import type { Row, RoundInfo } from "@/types";

const MAX_ROUNDS = 5;

export function AgentPage({
  understanding,
  rows,
  rounds,
  currentRound,
  availableCount,
  target,
  running,
  onEdit,
  onViewResults,
}: {
  understanding: string;
  rows: Row[];
  rounds: RoundInfo[];
  currentRound: number;
  availableCount: number;
  target: number;
  running: boolean;
  onEdit: () => void;
  onViewResults: () => void;
}) {
  const current = rounds.find((r) => r.round === currentRound);
  const checkedInRound = current?.checked ?? 0;
  const proposedInRound = current?.proposed ?? 0;
  const roundPhase =
    proposedInRound === 0 ? "AI 正在构思名字" : `正在核验候选域名`;

  return (
    <>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6">
        <Alert className="flex items-start gap-3 border-emerald-200 bg-emerald-50/60">
          <BrainCircuit className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-emerald-900">AI 对需求的理解</p>
            <p className="mt-1 text-sm leading-relaxed text-emerald-800/90">{understanding}</p>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" /> 修改
          </Button>
        </Alert>

        <Card className="mt-6 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {running ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
              ) : (
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              )}
              <p className="text-sm font-semibold">
                {running ? `第 ${currentRound || 1} 轮 · ${roundPhase}` : "本轮检索结束"}
              </p>
            </div>
            <p className="text-sm text-zinc-500">
              已找到 <span className="font-semibold text-emerald-600">{availableCount}</span> / 目标 {target} 个可注册
            </p>
          </div>
          <Progress className="mt-3" value={Math.min((availableCount / target) * 100, 100)} />
          <ol className="mt-4 space-y-2.5">
            {rounds.map((r) => {
              const isCurrent = running && r.round === currentRound;
              return (
                <li key={r.round} className="flex items-center gap-2.5 text-sm">
                  {isCurrent ? (
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-white">
                      <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />
                    </span>
                  ) : (
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span className={isCurrent ? "font-medium text-zinc-900" : "text-zinc-500"}>
                    {isCurrent
                      ? r.proposed === 0
                        ? `第 ${r.round} 轮：${r.note || "AI 构思中…"}`
                        : `第 ${r.round} 轮：已构思 ${r.proposed} 个，核验中 ${checkedInRound} / ${r.proposed} …`
                      : `第 ${r.round} 轮：构思 ${r.proposed} 个 → ${r.available} 个可注册`}
                  </span>
                </li>
              );
            })}
            {running && currentRound < MAX_ROUNDS && (
              <li className="flex items-center gap-2.5 text-sm">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-zinc-200 bg-white" />
                <span className="text-zinc-400">第 {currentRound + 1} 轮（如仍不足 {target} 个自动进行）</span>
              </li>
            )}
          </ol>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <ProgressCard key={r.domain} row={r} />
          ))}
          {running && (
            <div className="flex min-h-[104px] items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white/60 p-4">
              <p className="flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI 正在构思更多名字…
              </p>
            </div>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 md:px-6">
          <p className="truncate text-sm text-zinc-500">
            第 {currentRound || 1} 轮{proposedInRound > 0 && ` · 核验 ${checkedInRound}/${proposedInRound}`} ·{" "}
            <span className="font-medium text-emerald-600">{availableCount} 个可注册</span>
          </p>
          <Button className="h-9 shrink-0 font-semibold" onClick={onViewResults}>
            查看结果 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
