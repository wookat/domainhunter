import { useRef, useState } from "react";

type Status = "available" | "taken" | "unknown";
interface Result { domain: string; status: Status; method: string }

const badge: Record<Status, string> = {
  available: "bg-emerald-100 text-emerald-700",
  taken: "bg-rose-100 text-rose-600",
  unknown: "bg-slate-100 text-slate-500",
};
const label: Record<Status, string> = { available: "可注册", taken: "已注册", unknown: "未知" };

export default function App() {
  const [roots, setRoots] = useState("tizhi");
  const [suffixes, setSuffixes] = useState("job,jobs");
  const [tlds, setTlds] = useState("com,cn");
  const [results, setResults] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const split = (s: string) => s.split(/[,，\s]+/).map((x) => x.trim()).filter(Boolean);

  async function run() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setResults([]);
    setRunning(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roots: split(roots), suffixes: split(suffixes), tlds: split(tlds) }),
        signal: ac.signal,
      });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop()!;
        const rs = lines.filter(Boolean).map((l) => JSON.parse(l) as Result);
        if (rs.length) setResults((prev) => [...prev, ...rs]);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") console.error(e);
    } finally {
      setRunning(false);
    }
  }

  const available = results.filter((r) => r.status === "available");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Domain<span className="text-emerald-600">Hunter</span>
        </h1>
        <p className="mt-1 text-slate-500">批量域名猎手 — 词根组合生成 + RDAP/DNS 实时核验（开源）</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Field label="词根（roots）" value={roots} onChange={setRoots} placeholder="tizhi,gwy" />
          <Field label="后缀（suffixes）" value={suffixes} onChange={setSuffixes} placeholder="job,jobs" />
          <Field label="TLD" value={tlds} onChange={setTlds} placeholder="com,cn" />
        </div>

        <button
          onClick={run}
          disabled={running}
          className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
        >
          {running ? "检索中…" : "开始检索"}
        </button>

        {results.length > 0 && (
          <p className="mt-6 text-sm text-slate-500">
            已检查 {results.length} 个 · <span className="font-medium text-emerald-600">{available.length} 个可注册</span>
          </p>
        )}

        <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {results
            .slice()
            .sort((a, b) => (a.status === "available" ? -1 : 0) - (b.status === "available" ? -1 : 0))
            .map((r) => (
              <li key={r.domain} className="flex items-center justify-between px-4 py-2.5">
                <span className="font-mono">{r.domain}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge[r.status]}`}>
                  {label[r.status]}
                </span>
              </li>
            ))}
        </ul>

        <footer className="mt-10 text-center text-xs text-slate-400">
          open-core · MIT · <a className="underline" href="https://github.com/wookat/domainhunter">GitHub</a>
        </footer>
      </div>
    </div>
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
