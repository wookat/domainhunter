import { useRef, useState } from "react";
import { Check, ClipboardList, Copy, Download, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DomainRow } from "@/components/domain-row";
import { useI18n } from "@/lib/i18n";
import { usePrices } from "@/lib/prices";
import { exportResultsCsv, useCopyAvailable } from "@/lib/results-export";
import { friendlyError, friendlyHttpError } from "@/lib/utils";
import type { Row, Status } from "@/types";

const split = (s: string) => s.split(/[,，\s]+/).map((x) => x.trim()).filter(Boolean);

const LABEL_RE = /^[a-z0-9]([a-z0-9-]{0,62})$/;
const FULL_RE = /^[a-z0-9]([a-z0-9-]{0,62})(\.[a-z0-9]([a-z0-9-]{0,62}))+$/;
const MAX_BULK = 200;

/** 把粘贴名单展开成完整域名：带点的直接用，裸名字 × TLD */
function expandBulk(input: string, tlds: string[]): string[] {
  const out = new Set<string>();
  for (const raw of split(input.toLowerCase())) {
    const entry = raw.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (FULL_RE.test(entry)) out.add(entry);
    else if (LABEL_RE.test(entry)) for (const t of tlds) out.add(`${entry}.${t}`);
    if (out.size >= MAX_BULK) break;
  }
  return [...out].slice(0, MAX_BULK);
}

export function AdvancedPage({ shortlist }: { shortlist: { has: (domain: string) => boolean; toggle: (row: Row) => void } }) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const { copied: availCopied, copy: copyAvailable } = useCopyAvailable();
  const [roots, setRoots] = useState("");
  const [prefixes, setPrefixes] = useState("");
  const [suffixes, setSuffixes] = useState("");
  const [tlds, setTlds] = useState("com,cn");
  const [bulk, setBulk] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function run(payload?: { domains: string[] }) {
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
        body: JSON.stringify(payload ?? { roots: split(roots), prefixes: split(prefixes), suffixes: split(suffixes), tlds: split(tlds) }),
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(friendlyHttpError(res.status, t));
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
          .map((l) => JSON.parse(l) as { domain: string; status: Status; expiresAt?: string; type?: string })
          .filter((r) => !r.type && r.domain)
          .map((r): Row => {
            const dot = r.domain.indexOf(".");
            return { domain: r.domain, label: r.domain.slice(0, dot), tld: r.domain.slice(dot + 1), status: r.status, round: 1, expiresAt: r.expiresAt };
          });
        if (rs.length) setRows((prev) => [...prev, ...rs]);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError(friendlyError(e as Error, t));
    } finally {
      setRunning(false);
    }
  }

  const available = rows.filter((r) => r.status === "available");
  const rest = rows.filter((r) => r.status !== "available");
  const bulkDomains = expandBulk(bulk, split(tlds).length > 0 ? split(tlds) : ["com"]);

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-8 md:px-6">
      <h1 className="text-xl font-bold tracking-tight md:text-2xl">{t("adv.title")}</h1>
      <p className="mt-1 text-sm text-txt1">{t("adv.subtitle")}</p>

      <Card className="mt-5 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("adv.roots"), value: roots, set: setRoots, placeholder: "tizhi, gwy" },
            { label: t("adv.prefixes"), value: prefixes, set: setPrefixes, placeholder: "get, my" },
            { label: t("adv.suffixes"), value: suffixes, set: setSuffixes, placeholder: "job, jobs" },
            { label: "TLD", value: tlds, set: setTlds, placeholder: "com, cn" },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-sm font-medium">{f.label}</label>
              <Input className="mt-2" value={f.value} placeholder={f.placeholder} onChange={(e) => f.set(e.target.value)} />
            </div>
          ))}
        </div>
        <Button className="mt-5 w-full sm:w-auto" size="lg" disabled={running || split(roots).length === 0} onClick={() => void run()}>
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {running ? t("adv.running") : t("adv.start")}
        </Button>
      </Card>

      {/* 批量粘贴核验：现成名单直接查，不消耗 AI 次数 */}
      <Card className="mt-4 p-4 md:p-6">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <ClipboardList className="h-4 w-4 text-brand" />
          {t("adv.bulkTitle")}
        </p>
        <p className="mt-1 text-xs text-txt1">{t("adv.bulkHint", { n: MAX_BULK })}</p>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          placeholder={t("adv.bulkPlaceholder")}
          rows={5}
          className="mt-3 w-full rounded-lg border border-line bg-bg2 px-3 py-2.5 font-mono text-sm text-txt0 placeholder:text-txt2 focus:border-brand-line focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button size="lg" disabled={running || bulkDomains.length === 0} onClick={() => void run({ domains: bulkDomains })}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardList className="h-4 w-4" />}
            {running ? t("adv.running") : t("adv.bulkStart", { n: bulkDomains.length })}
          </Button>
          <span className="text-xs text-txt2">{t("adv.bulkCount", { n: bulkDomains.length })}</span>
        </div>
      </Card>

      {error && <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</p>}

      {rows.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {available.length >= 2 && (
            <button
              onClick={() => copyAvailable(available.map((r) => r.domain))}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-line bg-bg1 px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-9"
            >
              {availCopied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
              {availCopied ? t("results.copiedAvail") : t("results.copyAvailBtn", { n: available.length })}
            </button>
          )}
          <button
            onClick={() => exportResultsCsv(rows, lang, prices, "domainhunter-bulk")}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-line bg-bg1 px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-9"
          >
            <Download className="h-3.5 w-3.5" />
            {t("results.exportCsvBtn")}
          </button>
        </div>
      )}

      {available.length > 0 && (
        <>
          <h2 className="mt-4 text-sm font-semibold text-brand">{t("adv.available", { n: available.length })}</h2>
          <div className="mt-2 divide-y divide-line rounded-xl border border-line bg-bg1">
            {available.map((r) => (
              <DomainRow key={r.domain} row={r} favorite={shortlist.has(r.domain)} onToggleFavorite={shortlist.toggle} />
            ))}
          </div>
        </>
      )}
      {rest.length > 0 && (
        <>
          <h2 className="mt-6 text-sm font-semibold text-txt1">{t("adv.rest", { n: rest.length })}</h2>
          <div className="mt-2 divide-y divide-line rounded-xl border border-line bg-bg1">
            {rest.map((r) => (
              <DomainRow key={r.domain} row={r} favorite={shortlist.has(r.domain)} onToggleFavorite={shortlist.toggle} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
