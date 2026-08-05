import { useRef, useState } from "react";

type Status = "available" | "taken" | "unknown";
interface Result { domain: string; status: Status; method: string; meaning?: string }

const badge: Record<Status, string> = {
  available: "bg-emerald-100 text-emerald-700",
  taken: "bg-rose-100 text-rose-600",
  unknown: "bg-slate-100 text-slate-500",
};
const label: Record<Status, string> = { available: "可注册", taken: "已注册", unknown: "未知" };

const split = (s: string) => s.split(/[,，\s]+/).map((x) => x.trim()).filter(Boolean);

export default function App() {
  const [mode, setMode] = useState<"ai" | "advanced">("ai");
  const [description, setDescription] = useState("");
  const [roots, setRoots] = useState("");
  const [suffixes, setSuffixes] = useState("");
  const [tlds, setTlds] = useState("com,cn");
  const [results, setResults] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function run() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setResults([]);
    setError("");
    setRunning(true);
    setPhase(mode === "ai" ? "AI 正在构思名字…" : "生成候选…");
    try {
      const url = mode === "ai" ? "/api/ai-search" : "/api/search";
      const payload =
        mode === "ai"
          ? { description, tlds: split(tlds) }
          : { roots: split(roots), suffixes: split(suffixes), tlds: split(tlds) };
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: ac.signal,
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error === "ai-failed" ? "AI 服务暂时不可用，请稍后重试" : `请求失败（${res.status}）`);
      }
      setPhase("正在核验可注册状态…");
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
          .map((l) => JSON.parse(l) as Result & { type?: string })
          .filter((r) => !r.type);
        if (rs.length) setResults((prev) => [...prev, ...rs]);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setRunning(false);
      setPhase("");
    }
  }

  const available = results.filter((r) => r.status === "available");
  const sorted = results
    .slice()
    .sort((a, b) => (a.status === "available" ? -1 : 0) - (b.status === "available" ? -1 : 0));
  const canRun = mode === "ai" ? description.trim().length > 0 : split(roots).length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Domain<span className="text-emerald-600">Hunter</span>
        </h1>
        <p className="mt-1 text-slate-500">说出你想要的寓意，AI 帮你找到还能注册的好域名（开源）</p>

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
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <label className="block">
                <span className="text-xs font-medium text-slate-600">想要的 TLD</span>
                <input
                  className="mt-1 w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  value={tlds}
                  onChange={(e) => setTlds(e.target.value)}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Field label="词根（roots）" value={roots} onChange={setRoots} placeholder="tizhi,gwy" />
            <Field label="后缀（suffixes）" value={suffixes} onChange={setSuffixes} placeholder="job,jobs" />
            <Field label="TLD" value={tlds} onChange={setTlds} placeholder="com,cn" />
          </div>
        )}

        <button
          onClick={run}
          disabled={running || !canRun}
          className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
        >
          {running ? phase || "检索中…" : mode === "ai" ? "AI 帮我找" : "开始检索"}
        </button>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        {results.length > 0 && (
          <p className="mt-6 text-sm text-slate-500">
            已检查 {results.length} 个 · <span className="font-medium text-emerald-600">{available.length} 个可注册</span>
          </p>
        )}

        <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white empty:hidden">
          {sorted.map((r) => (
            <li key={r.domain} className="px-4 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono">{r.domain}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge[r.status]}`}>
                  {label[r.status]}
                </span>
              </div>
              {r.meaning && <p className="mt-0.5 text-xs text-slate-400">{r.meaning}</p>}
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
