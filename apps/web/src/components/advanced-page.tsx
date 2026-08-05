import { useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressCard } from "@/components/domain-card";
import type { Row, Status } from "@/types";

const split = (s: string) => s.split(/[,，\s]+/).map((x) => x.trim()).filter(Boolean);

export function AdvancedPage() {
  const [roots, setRoots] = useState("");
  const [prefixes, setPrefixes] = useState("");
  const [suffixes, setSuffixes] = useState("");
  const [tlds, setTlds] = useState("com,cn");
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function run() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setRows([]);
    setError("");
    setRunning(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roots: split(roots), prefixes: split(prefixes), suffixes: split(suffixes), tlds: split(tlds) }),
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
          .map((r): Row => {
            const dot = r.domain.indexOf(".");
            return { domain: r.domain, label: r.domain.slice(0, dot), tld: r.domain.slice(dot + 1), status: r.status, round: 1 };
          });
        if (rs.length) setRows((prev) => [...prev, ...rs]);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }

  const available = rows.filter((r) => r.status === "available");
  const rest = rows.filter((r) => r.status !== "available");

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-8 md:px-6">
      <h1 className="text-xl font-bold tracking-tight md:text-2xl">高级模式</h1>
      <p className="mt-1 text-sm text-zinc-500">词根 × 前后缀 × TLD 批量组合生成，逐个核验可注册状态</p>

      <Card className="mt-5 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "词根（roots）", value: roots, set: setRoots, placeholder: "tizhi, gwy" },
            { label: "前缀（prefixes）", value: prefixes, set: setPrefixes, placeholder: "get, my" },
            { label: "后缀（suffixes）", value: suffixes, set: setSuffixes, placeholder: "job, jobs" },
            { label: "TLD", value: tlds, set: setTlds, placeholder: "com, cn" },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-sm font-medium text-zinc-900">{f.label}</label>
              <Input className="mt-2" value={f.value} placeholder={f.placeholder} onChange={(e) => f.set(e.target.value)} />
            </div>
          ))}
        </div>
        <Button className="mt-5 w-full sm:w-auto" size="lg" disabled={running || split(roots).length === 0} onClick={run}>
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {running ? "检索中…" : "开始检索"}
        </Button>
      </Card>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      {available.length > 0 && (
        <>
          <h2 className="mt-6 text-sm font-semibold text-emerald-700">可注册（{available.length}）</h2>
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            {available.map((r) => (
              <ProgressCard key={r.domain} row={r} />
            ))}
          </div>
        </>
      )}
      {rest.length > 0 && (
        <>
          <h2 className="mt-6 text-sm font-semibold text-zinc-500">其余候选（{rest.length}）</h2>
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            {rest.map((r) => (
              <ProgressCard key={r.domain} row={r} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
