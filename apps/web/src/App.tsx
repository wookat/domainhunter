import { useRef, useState } from "react";

type Status = "available" | "taken" | "unknown" | "checking";
interface Row { domain: string; label: string; status: Status; meaning?: string; round: number }

const badge: Record<Status, string> = {
  available: "bg-emerald-100 text-emerald-700",
  taken: "bg-rose-100 text-rose-600",
  unknown: "bg-slate-100 text-slate-500",
  checking: "bg-amber-100 text-amber-600",
};
const statusLabel: Record<Status, string> = {
  available: "可注册",
  taken: "已注册",
  unknown: "未知",
  checking: "检测中",
};

const split = (s: string) => s.split(/[,，\s]+/).map((x) => x.trim()).filter(Boolean);

interface StreamEvent {
  type?: "round" | "proposed" | "done" | "error";
  round?: number;
  note?: string;
  items?: { label: string; meaning: string }[];
  tlds?: string[];
  availableCount?: number;
  target?: number;
  reachedTarget?: boolean;
  detail?: string;
  domain?: string;
  status?: Status;
  meaning?: string;
}

export default function App() {
  const [mode, setMode] = useState<"ai" | "advanced">("ai");
  const [description, setDescription] = useState("");
  const [roots, setRoots] = useState("");
  const [suffixes, setSuffixes] = useState("");
  const [tlds, setTlds] = useState("com,cn");
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("");
  const [round, setRound] = useState(0);
  const [doneMsg, setDoneMsg] = useState("");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const triedLabelsRef = useRef<string[]>([]);

  async function run(more = false) {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    if (!more) {
      setRows([]);
      triedLabelsRef.current = [];
    }
    setError("");
    setDoneMsg("");
    setRunning(true);
    setPhase("AI 正在构思名字…");
    try {
      if (mode === "advanced") {
        await runAdvanced(ac);
        return;
      }
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          description,
          tlds: split(tlds),
          target: 10,
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
          const ev = JSON.parse(line) as StreamEvent;
          if (ev.type === "round") {
            setRound(ev.round!);
            setPhase(ev.note ?? "");
          } else if (ev.type === "proposed") {
            const newRows: Row[] = ev.items!.flatMap((it) =>
              ev.tlds!.map((t) => ({
                domain: `${it.label}.${t}`,
                label: it.label,
                status: "checking" as Status,
                meaning: it.meaning,
                round: ev.round!,
              })),
            );
            triedLabelsRef.current.push(...ev.items!.map((i) => i.label));
            setRows((prev) => [...prev, ...newRows]);
            setPhase(`第 ${ev.round} 批寓意已出，正在核验…`);
          } else if (ev.type === "done") {
            setDoneMsg(
              ev.reachedTarget
                ? `完成：找到 ${ev.availableCount} 个可注册域名`
                : `已尽力检索（${ev.availableCount} 个可注册），可点「再来一批」继续`,
            );
          } else if (ev.type === "error") {
            setError("AI 服务出错，已停止本轮");
          } else if (ev.domain) {
            setRows((prev) =>
              prev.map((r) => (r.domain === ev.domain ? { ...r, status: ev.status!, meaning: r.meaning ?? ev.meaning } : r)),
            );
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setRunning(false);
      setPhase("");
    }
  }

  async function runAdvanced(ac: AbortController) {
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roots: split(roots), suffixes: split(suffixes), tlds: split(tlds) }),
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
        const rs = lines
          .filter(Boolean)
          .map((l) => JSON.parse(l) as { domain: string; status: Status; type?: string })
          .filter((r) => !r.type && r.domain)
          .map((r) => ({ domain: r.domain, label: r.domain, status: r.status, round: 1 }));
        if (rs.length) setRows((prev) => [...prev, ...rs]);
      }
    } finally {
      setRunning(false);
      setPhase("");
    }
  }

  const available = rows.filter((r) => r.status === "available");
  const rest = rows.filter((r) => r.status !== "available");
  const canRun = mode === "ai" ? description.trim().length > 0 : split(roots).length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Domain<span className="text-emerald-600">Hunter</span>
        </h1>
        <p className="mt-1 text-slate-500">说出你想要的寓意，AI Agent 反复构思＋核验，直到找出一批真正可注册的好域名</p>

        <div className="mt-6 flex gap-2 text-sm">
          <TabButton active={mode === "ai"} onClick={() => setMode("ai")}>AI 找域名</TabButton>
          <TabButton active={mode === "advanced"} onClick={() => setMode("advanced")}>高级模式</TabButton>
        </div>

        {mode === "ai" ? (
          <div className="mt-4">
            <textarea
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              rows={3}
              placeholder="用一句话描述你想要的域名，例如：帮体制内的人找新工作的平台，希望名字读起来专业可信、好记"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className="mt-2 block w-40">
              <span className="text-xs font-medium text-slate-600">想要的 TLD</span>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                value={tlds}
                onChange={(e) => setTlds(e.target.value)}
              />
            </label>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Field label="词根（roots）" value={roots} onChange={setRoots} placeholder="tizhi,gwy" />
            <Field label="后缀（suffixes）" value={suffixes} onChange={setSuffixes} placeholder="job,jobs" />
            <Field label="TLD" value={tlds} onChange={setTlds} placeholder="com,cn" />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => run(false)}
            disabled={running || !canRun}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
          >
            {running ? "检索中…" : mode === "ai" ? "AI 帮我找" : "开始检索"}
          </button>
          {mode === "ai" && !running && rows.length > 0 && (
            <button
              onClick={() => run(true)}
              className="w-full rounded-lg border border-emerald-600 px-4 py-2.5 font-medium text-emerald-700 hover:bg-emerald-50 sm:w-auto"
            >
              不满意，再来一批
            </button>
          )}
        </div>

        {running && (
          <p className="mt-4 text-sm text-amber-600">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500 align-middle" />
            第 {round || 1} 轮：{phase}
          </p>
        )}
        {doneMsg && <p className="mt-4 text-sm text-emerald-700">{doneMsg}</p>}
        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        {available.length > 0 && (
          <>
            <h2 className="mt-6 text-sm font-semibold text-emerald-700">可注册（{available.length}）</h2>
            <DomainList rows={available} />
          </>
        )}
        {rest.length > 0 && (
          <>
            <h2 className="mt-6 text-sm font-semibold text-slate-500">其余候选（{rest.length}）</h2>
            <DomainList rows={rest} />
          </>
        )}

        <footer className="mt-10 text-center text-xs text-slate-400">
          open-core · MIT · <a className="underline" href="https://github.com/wookat/domainhunter">GitHub</a>
        </footer>
      </div>
    </div>
  );
}

function DomainList({ rows }: { rows: Row[] }) {
  return (
    <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {rows.map((r) => (
        <li key={r.domain} className="px-4 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono">{r.domain}</span>
            <span className="flex items-center gap-2">
              <span className="text-[10px] text-slate-300">R{r.round}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge[r.status]}`}>
                {statusLabel[r.status]}
              </span>
            </span>
          </div>
          {r.meaning && <p className="mt-0.5 text-xs text-slate-400">{r.meaning}</p>}
        </li>
      ))}
    </ul>
  );
}

function TabButton(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={props.onClick}
      className={`rounded-full px-4 py-1.5 font-medium ${
        props.active ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-300"
      }`}
    >
      {props.children}
    </button>
  );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{props.label}</span>
      <input
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}
