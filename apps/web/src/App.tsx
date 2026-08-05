import { useEffect, useRef, useState } from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

import { Header } from "@/components/header";
import { HomePage, type HomeValues } from "@/components/home-page";
import { AgentPage } from "@/components/agent-page";
import { ResultsPage, ExportMenu } from "@/components/results-page";
import { AdvancedPage } from "@/components/advanced-page";
import { Button } from "@/components/ui/button";
import { isMockEnabled, runMockStream } from "@/mock";
import type { Row, RoundInfo, StreamEvent, Status } from "@/types";

type Mode = "home" | "agent" | "results" | "advanced";
const TARGET = 10;
const FAV_KEY = "domainhunter:favorites";

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export default function App() {
  const [mode, setMode] = useState<Mode>("home");
  const [values, setValues] = useState<HomeValues>({ description: "", tlds: ["com", "cn"], style: "", lengthPref: "" });
  const [rows, setRows] = useState<Row[]>([]);
  const [rounds, setRounds] = useState<RoundInfo[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const triedLabelsRef = useRef<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (domain: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });

  const availableCount = rows.filter((r) => r.status === "available").length;

  function handleEvent(ev: StreamEvent) {
    if (ev.type === "round") {
      setCurrentRound(ev.round!);
      setRounds((prev) =>
        prev.some((r) => r.round === ev.round)
          ? prev
          : [...prev, { round: ev.round!, note: ev.note ?? "", proposed: 0, checked: 0, available: 0 }],
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
            round: ev.round!,
          }),
        ),
      );
      triedLabelsRef.current.push(...ev.items!.map((i) => i.label));
      setRows((prev) => [...prev, ...newRows]);
      setRounds((prev) => prev.map((r) => (r.round === ev.round ? { ...r, proposed: r.proposed + newRows.length } : r)));
    } else if (ev.type === "done") {
      // no-op：running 状态在流结束时统一收尾
    } else if (ev.type === "error") {
      setError("AI 服务出错，已停止本轮");
    } else if (ev.domain) {
      const status = ev.status as Status;
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

  async function run(v: HomeValues, more = false) {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    if (!more) {
      setRows([]);
      setRounds([]);
      setCurrentRound(0);
      triedLabelsRef.current = [];
    }
    setError("");
    setRunning(true);
    setMode("agent");
    try {
      if (isMockEnabled()) {
        await runMockStream(handleEvent, ac.signal);
        return;
      }
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          description: v.description,
          tlds: v.tlds,
          style: v.style,
          lengthPref: v.lengthPref,
          target: TARGET,
          excludeLabels: more ? triedLabelsRef.current : [],
        }),
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(`请求失败（${res.status}）`);
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
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setRunning(false);
      if (!ac.signal.aborted) setMode((m) => (m === "agent" ? "results" : m));
    }
  }

  const understanding = [
    `为「${values.description}」寻找可注册域名`,
    values.style && `风格：${values.style}`,
    values.lengthPref && `长度：${values.lengthPref}`,
    `TLD：${values.tlds.map((t) => `.${t}`).join(" / ")}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const backButton = (
    <Button variant="ghost" size="sm" className="text-zinc-500" onClick={() => setMode("home")}>
      <ArrowLeft className="h-4 w-4" /> 返回
    </Button>
  );

  const headerRight =
    mode === "home" ? (
      <Button variant="ghost" size="sm" className="text-zinc-500" onClick={() => setMode("advanced")}>
        <SlidersHorizontal className="h-4 w-4" /> 高级模式
      </Button>
    ) : mode === "results" ? (
      <div className="flex items-center gap-2">
        <ExportMenu rows={rows} />
        {backButton}
      </div>
    ) : (
      backButton
    );

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <Header right={headerRight} onLogoClick={() => setMode("home")} />

      {error && (
        <div className="mx-auto mt-4 w-full max-w-5xl px-4 md:px-6">
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">{error}</p>
        </div>
      )}

      {mode === "home" && <HomePage initial={values} onSubmit={(v) => { setValues(v); void run(v); }} />}
      {mode === "agent" && (
        <AgentPage
          understanding={understanding}
          rows={rows}
          rounds={rounds}
          currentRound={currentRound}
          availableCount={availableCount}
          target={TARGET}
          running={running}
          onEdit={() => {
            abortRef.current?.abort();
            setRunning(false);
            setMode("home");
          }}
          onViewResults={() => setMode("results")}
        />
      )}
      {mode === "results" && (
        <ResultsPage
          rows={rows}
          description={values.description}
          roundCount={rounds.length}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onMore={() => void run(values, true)}
          running={running}
        />
      )}
      {mode === "advanced" && <AdvancedPage />}

      {mode === "home" && (
        <footer className="pb-8 text-center text-xs text-zinc-400">
          open-core · MIT ·{" "}
          <a className="underline hover:text-zinc-600" href="https://github.com/wookat/domainhunter">
            GitHub
          </a>
        </footer>
      )}
    </div>
  );
}
