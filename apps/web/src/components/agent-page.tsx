import { Brain, Check, History, ListChecks, Loader2, Pencil, SlidersHorizontal, Square } from "lucide-react";

import { DomainRow, SkeletonRow } from "@/components/domain-row";
import { useI18n } from "@/lib/i18n";
import type { Row, RoundInfo } from "@/types";
import { cn } from "@/lib/utils";

const MAX_ROUNDS = 5;

export interface LogEntry {
  domain: string;
  status: string;
  cached?: boolean;
}

function MicroLog({ logs, checkingDomain }: { logs: LogEntry[]; checkingDomain?: string }) {
  const { t } = useI18n();
  return (
    <div className="mt-2.5 space-y-1 rounded-md border border-line bg-bg0 px-2.5 py-2 font-mono text-[11px] text-txt2">
      {logs.slice(-2).map((l) => (
        <div key={l.domain} className="truncate">
          ✓ {l.domain} — {l.status === "available" ? <span className="text-brand">available</span> : l.status}
          {l.cached && <span className="ml-1 text-txt2/70">· {t("agent.cached")}</span>}
        </div>
      ))}
      {checkingDomain && <div className="dot-breathe truncate text-txt1">→ {t("agent.checkingNow", { domain: checkingDomain })}</div>}
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
  const { t } = useI18n();
  const active = isCurrent && running;
  if (!active) {
    return (
      <li className="relative flex gap-2.5 pb-3">
        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-dim">
          <Check className="h-3 w-3 text-brand" />
        </span>
        <div className="text-[13px]">
          <span className="text-txt1">{t("agent.round", { n: round.round })}</span> · {t("agent.roundDone", { proposed: round.proposed || "—" })}{" "}
          <span className="tnum font-mono text-xs text-brand">{t("agent.roundAvailable", { n: round.available })}</span>
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
          <span className="text-txt0">{t("agent.round", { n: round.round })}</span>
          <span className="text-txt1"> · {t(round.noteKey)}</span>
        </div>
        <ul className="mt-2 space-y-1.5 text-xs text-txt1">
          <li className="flex items-center gap-1.5">
            {proposing ? <Loader2 className="h-3 w-3 animate-spin text-brand" /> : <Check className="h-3 w-3 text-brand" />}
            {proposing ? t("agent.thinking") : t("agent.proposed", { n: round.proposed })}
          </li>
          <li className={cn("flex items-center gap-1.5", proposing && "text-txt2")}>
            {checking ? (
              <Loader2 className="h-3 w-3 animate-spin text-brand" />
            ) : proposing ? (
              <span className="h-3 w-3 rounded-full border border-line" />
            ) : (
              <Check className="h-3 w-3 text-brand" />
            )}
            {t("agent.checkStep")}{" "}
            {!proposing && (
              <span className="tnum font-mono">
                {round.checked}/{round.proposed}
              </span>
            )}
          </li>
          <li className={cn("flex items-center gap-1.5", checking || proposing ? "text-txt2" : "")}>
            {checking || proposing ? <span className="h-3 w-3 rounded-full border border-line" /> : <Check className="h-3 w-3 text-brand" />}
            {t("agent.scoreStep")}
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
  const { t } = useI18n();
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
            {t("agent.params")}
          </summary>
          <div className="space-y-4 p-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-txt1">
                  <Brain className="h-3.5 w-3.5 text-brand" />
                  {t("agent.understanding")}
                </span>
                <button className="flex items-center gap-1 text-xs text-txt2 hover:text-txt0" onClick={onEdit}>
                  <Pencil className="h-3 w-3" />
                  {t("agent.edit")}
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
                <span className="text-xs text-txt1">{t("agent.style")}</span>
                <span className="rounded-md border border-line px-2 py-1 text-xs">{style || t("common.unlimited")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-txt1">{t("agent.length")}</span>
                <span className="rounded-md border border-line px-2 py-1 text-xs">{lengthPref || t("common.unlimited")}</span>
              </div>
            </div>
            <button
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-line text-sm text-txt1 hover:bg-bg2 hover:text-txt0"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
              {t("agent.editRerun")}
            </button>
          </div>
        </details>

        <div className="rounded-xl border border-line bg-bg1 p-4">
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-txt1">
            <ListChecks className="h-3.5 w-3.5 text-brand" />
            {t("agent.process")}
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
                  {t("agent.nextRound", { n: currentRound + 1, target })}
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
            {t("agent.live")}
            <span className="hidden text-xs font-normal text-txt2 sm:inline">{t("agent.liveHint")}</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="tnum text-xs text-txt1">
              {t("agent.checked")} <b className="font-mono text-txt0">{checkedCount}</b> · {t("agent.available")} <b className="font-mono text-brand">{availableCount}</b>
            </span>
            {running && (
              <button
                className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs text-txt1 hover:bg-bg2 hover:text-txt0"
                onClick={onStop}
              >
                <Square className="h-3 w-3" />
                {t("agent.stop")}
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
            <p className="px-4 py-8 text-center text-sm text-txt2">{t("agent.noResults")}</p>
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
                  <History className="h-3.5 w-3.5" />{t("agent.prevRound", { n: r.round, count: r.available })}
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
