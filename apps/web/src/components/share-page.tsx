import { useEffect, useState } from "react";
import { Check, Copy, Crosshair, Download, Loader2, Sparkles } from "lucide-react";

import { RegisterMenu } from "@/components/domain-row";
import { ScoreBars } from "@/components/score-bars";
import { useI18n } from "@/lib/i18n";
import { priceFull, priceShort, usePrices } from "@/lib/prices";
import { exportResultsCsv, useCopyAvailable } from "@/lib/results-export";
import type { ShortlistItem } from "@/lib/shortlist";
import { scoreBadgeClass, totalScore } from "@/types";
import { cn } from "@/lib/utils";

type SharedItem = Pick<ShortlistItem, "domain" | "label" | "tld" | "meaning" | "scores">;

interface ShareSnapshot {
  items: SharedItem[];
  createdAt: number;
}

type LoadState = { kind: "loading" } | { kind: "notFound" } | { kind: "revoked" } | { kind: "ready"; data: ShareSnapshot };

export function SharePage({ id }: { id: string }) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const { copied: availCopied, copy: copyAvailable } = useCopyAvailable();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/share/${encodeURIComponent(id)}`);
        if (res.status === 410) {
          if (!cancelled) setState({ kind: "revoked" });
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as ShareSnapshot;
        if (!cancelled) setState({ kind: "ready", data });
      } catch {
        if (!cancelled) setState({ kind: "notFound" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.kind === "loading") {
    return (
      <main className="grid flex-1 place-items-center py-24">
        <p className="flex items-center gap-2 text-sm text-txt1">
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
          {t("share.loading")}
        </p>
      </main>
    );
  }

  if (state.kind === "notFound" || state.kind === "revoked") {
    return (
      <main className="grid flex-1 place-items-center px-4 py-24">
        <div className="text-center">
          <Crosshair className="mx-auto h-8 w-8 text-txt2" />
          <p className="mt-4 text-sm text-txt1">{t(state.kind === "revoked" ? "share.revoked" : "share.notFound")}</p>
          <a
            href="/"
            className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            {t("share.goHome")}
          </a>
        </div>
      </main>
    );
  }

  const { items, createdAt } = state.data;
  const csvRows = items.map((it) => ({ ...it, status: "available" as const }));
  const timeStr = new Date(createdAt).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6">
      <h1 className="text-xl font-bold tracking-tight">{t("share.title")}</h1>
      <p className="mt-1 text-xs text-txt2">{t("share.subtitle", { time: timeStr })}</p>

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {items.length >= 2 && (
            <button
              onClick={() => copyAvailable(items.map((it) => it.domain))}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-line bg-bg1 px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-9"
            >
              {availCopied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
              {availCopied ? t("results.copiedAvail") : t("results.copyAvailBtn", { n: items.length })}
            </button>
          )}
          <button
            onClick={() => exportResultsCsv(csvRows, lang, prices)}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-line bg-bg1 px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-9"
          >
            <Download className="h-3.5 w-3.5" />
            {t("results.exportCsvBtn")}
          </button>
        </div>
      )}

      {/* 桌面表格 */}
      <div className="mt-5 hidden overflow-x-auto rounded-xl border border-line bg-bg1 md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-txt2">
              <th className="px-4 py-3 font-medium">{t("shortlist.domain")}</th>
              <th className="px-3 py-3 text-center font-medium">{t("score.total")}</th>
              <th className="px-3 py-3 text-right font-medium">{t("shortlist.price")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((it) => {
              const score = it.scores ? totalScore(it.scores) : undefined;
              return (
                <tr key={it.domain}>
                  <td className="px-4 py-3.5">
                    <div className="font-mono text-[15px] font-semibold">
                      {it.label}
                      <span className="text-txt2">.{it.tld}</span>
                    </div>
                    {it.meaning && <div className="mt-0.5 max-w-md truncate text-xs text-txt1">{it.meaning}</div>}
                  </td>
                  <td className="px-3 text-center">
                    <span className={cn("tnum rounded-md px-2 py-0.5 font-mono text-xs font-bold", score !== undefined ? scoreBadgeClass(score) : "bg-bg3 text-txt1")}>
                      {score ?? "—"}
                    </span>
                  </td>
                  <td title={priceFull(it.tld, lang, prices)} className="tnum px-3 text-right font-mono text-xs text-txt1">
                    {priceShort(it.tld, lang, prices) ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 text-right">
                    <RegisterMenu domain={it.domain}>
                      <button className="h-8 rounded-md bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-80">
                        {t("common.register")}
                      </button>
                    </RegisterMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 移动端卡片 */}
      <div className="mt-5 space-y-3 md:hidden">
        {items.map((it) => {
          const score = it.scores ? totalScore(it.scores) : undefined;
          return (
            <div key={it.domain} className="rounded-xl border border-line bg-bg1 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[15px] font-semibold">
                  {it.label}
                  <span className="text-txt2">.{it.tld}</span>
                </span>
                {score !== undefined && (
                  <span className={cn("tnum shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold", scoreBadgeClass(score))}>{score}</span>
                )}
              </div>
              {it.meaning && <p className="mt-1 text-xs text-txt1">{it.meaning}</p>}
              {it.scores && <ScoreBars scores={it.scores} columns={4} className="mt-3" />}
              <div className="mt-3 flex items-center gap-2">
                <span title={priceFull(it.tld, lang, prices)} className="tnum flex-1 font-mono text-xs text-txt1">
                  {priceShort(it.tld, lang, prices) ?? ""}
                </span>
                <RegisterMenu domain={it.domain}>
                  <button className="h-11 rounded-md bg-brand px-4 text-xs font-semibold text-brand-ink">{t("common.register")}</button>
                </RegisterMenu>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA：我也要猎名 */}
      <div className="mt-10 rounded-2xl border border-brand-line bg-brand-dim/40 px-6 py-8 text-center">
        <p className="text-sm text-txt1">{t("share.ctaDesc")}</p>
        <a
          href="/"
          className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand px-6 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          {t("share.cta")}
        </a>
      </div>
    </main>
  );
}
