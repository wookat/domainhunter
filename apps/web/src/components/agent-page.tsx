import { Brain, Check, History, ListChecks, Loader2, Pencil, SlidersHorizontal, Square } from "lucide-react";

import { DomainRow, SkeletonRow } from "@/components/domain-row";
import type { Row, RoundInfo } from "@/types";
import { cn } from "@/lib/utils";

const MAX_ROUNDS = 5;

export interface LogEntry {
  domain: string;
  status: string;
}

function MicroLog({ logs, checkingDomain }: { logs: LogEntry[]; checkingDomain?: string }) {
  return (
    <div className="mt-2.5 space-y-1 rounded-md border border-line bg-bg0 px-2.5 py-2 font-mono text-[11px] text-txt2">
      {logs.slice(-2).map((l) => (
        <div key={l.domain} className="truncate">
          ✓ {l.domain} — {l.status === "available" ? <span className="text-brand">available</span> : l.status}
        </div>
      ))}
      {checkingDomain && <div className="dot-breathe truncate text-txt1">→ 正在核验 {checkingDomain} …</div>}
    </div>
  );
}

function RoundSteps({
  round,
  isCurrent,
  running,
  logs,
  checkingDomain,
}: {
  round: RoundInfo;
  isCurrent: boolean;
  running: boolean;
  logs: LogEntry[];
  checkingDomain?: string;
}) {
  const active = isCurrent && running;
  if (!active) {
    return (
      <li className="relative flex gap-2.5 pb-3">
        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-dim">
          <Check className="h-3 w-3 text-brand" />
        </span>
        <div className="text-[13px]">
          <span className="text-txt1">第 {round.round} 轮</span> · 构思 {round.proposed || "—"} → 核验 → 评分{" "}
          <span className="tnum font-mono text-xs text-brand">{round.available} 个可注册</span>
        </div>
        <span className="absolute bottom-0 left-2 top-5 w-px bg-line" />
      </li>
    );
  }
  const proposing = round.proposed === 0;
  const checking = !proposing && round.checked < round.proposed;
  return (
    <li className="flex gap-2.5 pb-1">
      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-brand-line">
        <Loader2 className="h-3 w-3 animate-spin text-brand" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px]">
          <span className="text-txt0">第 {round.round} 轮</span>
          {round.note && <span className="text-txt1"> · {round.note}</span>}
        </div>
        <ul className="mt-2 space-y-1.5 text-xs text-txt1">
          <li className="flex items-center gap-1.5">
            {proposing ? <Loader2 className="h-3 w-3 animate-spin text-brand" /> : <Check className="h-3 w-3 text-brand" />}
            {proposing ? "AI 构思候选中…" : `构思 ${round.proposed} 个候选`}
          </li>
          <li className={cn("flex items-center gap-1.5", proposing && "text-txt2")}>
            {checking ? (
              <Loader2 className="h-3 w-3 animate-spin text-brand" />
            ) : proposing ? (
              <span className="h-3 w-3 rounded-full border border-line" />
            ) : (
              <Check className="h-3 w-3 text-brand" />
            )}
            RDAP + DNS 核验{" "}
            {!proposing && (
              <span className="tnum font-mono">
                {round.checked}/{round.proposed}
              </span>
            )}
          </li>
          <li className={cn("flex items-center gap-1.5", checking || proposing ? "text-txt2" : "")}>
            {checking || proposing ? <span className="h-3 w-3 rounded-full border border-line" /> : <Check className="h-3 w-3 text-brand" />}
            四维评分
          </li>
        </ul>
        {!proposing && <MicroLog logs={logs} checkingDomain={checkingDomain} />}
      </div>
    </li>
  );
}

export function AgentPage({
  understanding,
  tlds,
  style,
  lengthPref,
  rows,
  rounds,
  currentRound,
  availableCount,
  target,
  running,
  logs,
  onEdit,
  onStop,
  shortlistHas,
  onToggleFavorite,
}: {
  understanding: string;
  tlds: string[];
  style: string;
  lengthPref: string;
  rows: Row[];
  rounds: RoundInfo[];
  currentRound: number;
  availableCount: number;
  target: number;
  running: boolean;
  logs: LogEntry[];
  onEdit: () => void;
  onStop: () => void;
  shortlistHas: (domain: string) => boolean;
  onToggleFavorite: (row: Row) => void;
}) {
  const checkedCount = rows.filter((r) => r.status !== "checking").length;
  const checkingDomain = rows.find((r) => r.status === "checking")?.domain;
  const currentRows = rows.filter((r) => r.round === currentRound);
  const doneRows = currentRows.filter((r) => r.status === "available" || r.status === "unknown");
  const takenRows = currentRows.filter((r) => r.status === "taken");
  const checkingRows = currentRows.filter((r) => r.status === "checking");
  const prevRounds = rounds.filter((r) => r.round !== currentRound);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[320px_1fr]">
      {/* ◀ 左栏 */}
      <aside className="space-y-4 self-start lg:sticky lg:top-20">
        <details className="rounded-xl border border-line bg-bg1" open>
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-semibold lg:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            需求与参数
          </summary>
          <div className="space-y-4 p-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-txt1">
                  <Brain className="h-3.5 w-3.5 text-brand" />
                  AI 理解的需求
                </span>
                <button className="flex items-center gap-1 text-xs text-txt2 hover:text-txt0" onClick={onEdit}>
                  <Pencil className="h-3 w-3" />
                  修改
                </button>
              </div>
              <div className="rounded-lg border border-line bg-bg2 p-3 text-[13px] leading-relaxed text-txt1">{understanding}</div>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-txt1">TLD</span>
                <div className="flex flex-wrap justify-end gap-1">
                  {tlds.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-md bg-brand-dim px-2 py-0.5 font-mono text-[11px] font-semibold text-brand">
                      .{t}
                    </span>
                  ))}
                  {tlds.length > 3 && (
                    <span className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-txt2">+{tlds.length - 3}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-txt1">风格</span>
                <span className="rounded-md border border-line px-2 py-1 text-xs">{style || "不限"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-txt1">长度</span>
                <span className="rounded-md border border-line px-2 py-1 text-xs">{lengthPref || "不限"}</span>
              </div>
            </div>
            <button
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-line text-sm text-txt1 hover:bg-bg2 hover:text-txt0"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
              改参数并重跑
            </button>
          </div>
        </details>

        <div className="rounded-xl border border-line bg-bg1 p-4">
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-txt1">
            <ListChecks className="h-3.5 w-3.5 text-brand" />
            Agent 过程
          </div>
          <ol className="space-y-0">
            {rounds.map((r) => (
              <RoundSteps
                key={r.round}
                round={r}
                isCurrent={r.round === currentRound}
                running={running}
                logs={logs}
                checkingDomain={checkingDomain}
              />
            ))}
            {running && currentRound < MAX_ROUNDS && (
              <li className="flex gap-2.5 pt-2 text-txt2">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-line" />
                <div className="text-[13px]">
                  第 {currentRound + 1} 轮 · 视缺口补充（目标 {target} 个可注册）
                </div>
              </li>
            )}
          </ol>
        </div>
      </aside>

      {/* ▶ 右栏：流式结果 */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            实时结果
            <span className="hidden text-xs font-normal text-txt2 sm:inline">核验通过即插入，无需等整轮结束</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="tnum text-xs text-txt1">
              已核验 <b className="font-mono text-txt0">{checkedCount}</b> · 可注册 <b className="font-mono text-brand">{availableCount}</b>
            </span>
            {running && (
              <button
                className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs text-txt1 hover:bg-bg2 hover:text-txt0"
                onClick={onStop}
              >
                <Square className="h-3 w-3" />
                停止
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-line rounded-xl border border-line bg-bg1">
          {doneRows.map((r) => (
            <DomainRow key={r.domain} row={r} animate favorite={shortlistHas(r.domain)} onToggleFavorite={onToggleFavorite} />
          ))}
          {takenRows.map((r) => (
            <DomainRow key={r.domain} row={r} />
          ))}
          {checkingRows.slice(0, 3).map((r) => (
            <DomainRow key={r.domain} row={r} />
          ))}
          {running && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}
          {!running && currentRows.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-txt2">本轮没有产生结果</p>
          )}
        </div>

        {prevRounds
          .slice()
          .reverse()
          .map((r) => {
            const rr = rows.filter((x) => x.round === r.round && (x.status === "available" || x.status === "unknown"));
            if (rr.length === 0) return null;
            return (
              <div key={r.round} className="mt-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-txt2">
                  <History className="h-3.5 w-3.5" />第 {r.round} 轮 · {r.available} 个可注册（已并入结果，完成后可按轮回看）
                </div>
                <div className="divide-y divide-line rounded-xl border border-line bg-bg1 opacity-90">
                  {rr.map((x) => (
                    <DomainRow key={x.domain} row={x} favorite={shortlistHas(x.domain)} onToggleFavorite={onToggleFavorite} />
                  ))}
                </div>
              </div>
            );
          })}
      </section>
    </main>
  );
}
