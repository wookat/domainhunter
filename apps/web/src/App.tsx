import { useRef, useState } from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

import { Header } from "@/components/header";
import { HomePage, type HomeValues } from "@/components/home-page";
import { AgentPage, type LogEntry } from "@/components/agent-page";
import { ResultsPage } from "@/components/results-page";
import { ShortlistPage } from "@/components/shortlist-page";
import { AdvancedPage } from "@/components/advanced-page";
import { isMockEnabled, runMockStream } from "@/mock";
import { useShortlist } from "@/lib/shortlist";
import { friendlyError, friendlyHttpError } from "@/lib/utils";
import type { Row, RoundInfo, StreamEvent, Status } from "@/types";

type Mode = "home" | "agent" | "results" | "shortlist" | "advanced";
const TARGET = 10;

export default function App() {
  const [mode, setMode] = useState<Mode>("home");
  const [values, setValues] = useState<HomeValues>({ description: "", tlds: ["com", "cn"], style: "", lengthPref: "" });
  const [rows, setRows] = useState<Row[]>([]);
  const [rounds, setRounds] = useState<RoundInfo[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [elapsedSec, setElapsedSec] = useState<number | undefined>(undefined);
  const [locked, setLocked] = useState<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);
  const triedLabelsRef = useRef<string[]>([]);
  const roundOffsetRef = useRef(0);
  const startedAtRef = useRef(0);
  const shortlist = useShortlist();
  const beforeShortlistRef = useRef<Mode>("home");

  const openShortlist = () => {
    if (mode !== "shortlist") beforeShortlistRef.current = mode;
    setMode("shortlist");
  };
  const closeShortlist = () => setMode(beforeShortlistRef.current);

  const toggleLock = (domain: string) =>
    setLocked((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });

  const availableCount = rows.filter((r) => r.status === "available").length;

  function handleEvent(ev: StreamEvent) {
    const round = (ev.round ?? 0) + roundOffsetRef.current;
    if (ev.type === "round") {
      setCurrentRound(round);
      setRounds((prev) =>
        prev.some((r) => r.round === round)
          ? prev
          : [...prev, { round, note: ev.note ?? "", proposed: 0, checked: 0, available: 0 }],
      );
    } else if (ev.type === "proposed") {
      const newRows: Row[] = ev.items!.flatMap((it) =>
        ev.tlds!.map(
          (t): Row => ({
            domain: `${it.label}.${t}`,
            label: it.label,
            tld: t,
            status: "checking",
            meaning: it.meaning,
            scores: it.scores,
            round,
          }),
        ),
      );
      triedLabelsRef.current.push(...ev.items!.map((i) => i.label));
      setRows((prev) => {
        const seen = new Set(prev.map((r) => r.domain));
        const fresh = newRows.filter((r) => !seen.has(r.domain));
        setRounds((rs) => rs.map((r) => (r.round === round ? { ...r, proposed: r.proposed + fresh.length } : r)));
        return [...prev, ...fresh];
      });
    } else if (ev.type === "done") {
      // no-op：running 状态在流结束时统一收尾
    } else if (ev.type === "error") {
      setError("AI 服务出错，已停止本轮");
    } else if (ev.domain) {
      const status = ev.status as Status;
      setLogs((prev) => [...prev.slice(-19), { domain: ev.domain!, status }]);
      setRows((prev) => {
        const row = prev.find((r) => r.domain === ev.domain);
        if (!row) return prev;
        setRounds((rs) =>
          rs.map((r) =>
            r.round === row.round
              ? { ...r, checked: r.checked + 1, available: r.available + (status === "available" ? 1 : 0) }
              : r,
          ),
        );
        return prev.map((r) => (r.domain === ev.domain ? { ...r, status, meaning: r.meaning ?? ev.meaning } : r));
      });
    }
  }

  async function run(v: HomeValues, opts: { more?: boolean; aroundLocked?: boolean } = {}) {
    const { more = false, aroundLocked = false } = opts;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    if (more) {
      roundOffsetRef.current = rounds.reduce((max, r) => Math.max(max, r.round), 0);
    } else {
      setRows([]);
      setRounds([]);
      setCurrentRound(0);
      setLocked(new Set());
      triedLabelsRef.current = [];
      roundOffsetRef.current = 0;
    }
    setLogs([]);
    setError("");
    setRunning(true);
    setMode("agent");
    startedAtRef.current = Date.now();
    try {
      if (isMockEnabled()) {
        await runMockStream(handleEvent, ac.signal);
        return;
      }
      let description = v.description;
      if (aroundLocked && locked.size > 0) {
        description += `\n\n我特别喜欢这些名字的风格：${[...locked].map((d) => d.split(".")[0]).join(", ")}。请围绕它们的词根、构词方式与气质再发散相似的新名字。`;
      }
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          description,
          tlds: v.tlds,
          style: v.style,
          lengthPref: v.lengthPref,
          target: TARGET,
          excludeLabels: more ? triedLabelsRef.current : [],
        }),
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(friendlyHttpError(res.status));
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
          handleEvent(JSON.parse(line) as StreamEvent);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError(friendlyError(e as Error));
    } finally {
      setRunning(false);
      setElapsedSec(Math.round((Date.now() - startedAtRef.current) / 1000));
      if (!ac.signal.aborted) setMode((m) => (m === "agent" ? "results" : m));
    }
  }

  function stop() {
    abortRef.current?.abort();
    setRunning(false);
    setElapsedSec(Math.round((Date.now() - startedAtRef.current) / 1000));
    setMode(rows.length > 0 ? "results" : "home");
  }

  const understanding = [
    `为「${values.description}」寻找可注册域名`,
    values.style && `风格：${values.style}`,
    values.lengthPref && `长度：${values.lengthPref}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const headerRight =
    mode === "home" ? (
      <button
        className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 sm:flex"
        onClick={() => setMode("advanced")}
      >
        <SlidersHorizontal className="h-4 w-4" />
        高级模式
      </button>
    ) : mode === "advanced" || mode === "shortlist" ? (
      <button
        className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0"
        onClick={() => (mode === "shortlist" ? closeShortlist() : setMode("home"))}
      >
        <ArrowLeft className="h-4 w-4" />
        返回
      </button>
    ) : undefined;

  const headerCenter =
    mode === "agent" && running ? (
      <span className="mr-2 hidden items-center gap-1.5 text-xs text-txt1 md:flex">
        <span className="dot-breathe h-1.5 w-1.5 rounded-full bg-brand" />第 {currentRound || 1} 轮进行中 · 已核验{" "}
        <b className="tnum font-mono text-txt0">{rows.filter((r) => r.status !== "checking").length}</b> 个 · 可注册{" "}
        <b className="tnum font-mono text-brand">{availableCount}</b> 个
      </span>
    ) : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        center={headerCenter}
        right={headerRight}
        onLogoClick={() => setMode("home")}
        shortlistCount={shortlist.items.length}
        shortlistActive={mode === "shortlist"}
        onShortlistClick={() => (mode === "shortlist" ? closeShortlist() : openShortlist())}
      />

      {error && (
        <div className="mx-auto mt-4 w-full max-w-6xl px-4 md:px-6">
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</p>
        </div>
      )}

      {mode === "home" && (
        <HomePage
          initial={values}
          onSubmit={(v) => {
            setValues(v);
            void run(v);
          }}
        />
      )}
      {mode === "agent" && (
        <AgentPage
          understanding={understanding}
          tlds={values.tlds}
          style={values.style}
          lengthPref={values.lengthPref}
          rows={rows}
          rounds={rounds}
          currentRound={currentRound}
          availableCount={availableCount}
          target={TARGET}
          running={running}
          logs={logs}
          onEdit={() => {
            abortRef.current?.abort();
            setRunning(false);
            setMode("home");
          }}
          onStop={stop}
          shortlistHas={shortlist.has}
          onToggleFavorite={shortlist.toggle}
        />
      )}
      {mode === "results" && (
        <ResultsPage
          rows={rows}
          description={values.description}
          roundCount={rounds.length}
          elapsedSec={elapsedSec}
          locked={locked}
          onToggleLock={toggleLock}
          shortlistHas={shortlist.has}
          onToggleFavorite={shortlist.toggle}
          onMore={() => void run(values, { more: true })}
          onMoreAroundLocked={() => void run(values, { more: true, aroundLocked: true })}
          running={running}
          moreDisabled={!values.description.trim()}
        />
      )}
      {mode === "shortlist" && (
        <ShortlistPage items={shortlist.items} onRemove={shortlist.remove} onClear={shortlist.clear} onStart={() => setMode("home")} />
      )}
      {mode === "advanced" && <AdvancedPage />}

      {mode === "home" && (
        <footer className="pb-8 text-center text-xs text-txt2">
          open-core · MIT ·{" "}
          <a className="underline hover:text-txt1" href="https://github.com/wookat/domainhunter">
            GitHub
          </a>
        </footer>
      )}
    </div>
  );
}
