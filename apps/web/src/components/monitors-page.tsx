import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, BellOff, ExternalLink, Loader2, RotateCw, Search } from "lucide-react";

import { ConfirmLabel } from "@/components/confirm-label";
import { ExpiryNote } from "@/components/domain-row";
import { fetchMonitorList, recheckMonitors, RecheckRateLimitError, useMonitor, type MonitorListEntry } from "@/lib/monitor";
import { REGISTRARS } from "@/lib/registrars";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CONFIRM_TIMEOUT_MS = 6000;

function statusBadgeClass(status: string): string {
  if (status === "available") return "bg-brand-dim text-brand";
  if (status === "taken") return "bg-taken-dim text-taken";
  return "bg-bg3 text-txt1";
}

export function MonitorsPage({ onStart }: { onStart: () => void }) {
  const { t, lang } = useI18n();
  const monitor = useMonitor();
  const [entries, setEntries] = useState<Record<string, MonitorListEntry>>({});
  const [quota, setQuota] = useState<{ monitored: number; limit: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState("");
  // 存 retryAfter 而非文案：渲染时翻译，切换语言后提示语言同步
  const [rateLimitedFor, setRateLimitedFor] = useState<number | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [confirmLeft, setConfirmLeft] = useState(0);
  const confirmTimer = useRef<number | undefined>(undefined);
  const confirmTick = useRef<number | undefined>(undefined);
  const refreshingRef = useRef(false);

  // 初次加载：只拉服务端现有条目；手动刷新：触发服务端实时核验
  const refresh = useCallback(async (recheck: boolean) => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    setError("");
    setRateLimitedFor(null);
    try {
      const domains = [...monitor.monitored];
      const list = recheck ? await recheckMonitors(domains) : await fetchMonitorList(domains);
      setEntries(Object.fromEntries(list.entries.map((e) => [e.domain, e])));
      setQuota({ monitored: list.monitored, limit: list.limit });
      setLastRefreshedAt(Date.now());
    } catch (err) {
      if (err instanceof RecheckRateLimitError) setRateLimitedFor(err.retryAfter);
      else setError(t("monitors.refreshFailed"));
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
      setLoading(false);
    }
    // t 随语言变化但刷新逻辑不变
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitor.monitored]);

  useEffect(() => {
    void refresh(false);
    // 仅首次加载拉服务端条目；取消监控后本地即时更新，不重复拉取
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 「最后刷新 xx 前」相对时间每 30s 走一格
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // 限频倒数每秒递减，归零后清除提示并恢复刷新按钮
  useEffect(() => {
    if (rateLimitedFor === null) return;
    if (rateLimitedFor <= 0) {
      setRateLimitedFor(null);
      return;
    }
    const id = window.setTimeout(() => setRateLimitedFor((s) => (s !== null && s > 1 ? s - 1 : null)), 1000);
    return () => window.clearTimeout(id);
  }, [rateLimitedFor]);

  useEffect(
    () => () => {
      window.clearTimeout(confirmTimer.current);
      window.clearInterval(confirmTick.current);
    },
    [],
  );

  function clearConfirm() {
    window.clearTimeout(confirmTimer.current);
    window.clearInterval(confirmTick.current);
    setConfirming(null);
    setConfirmLeft(0);
  }

  async function cancel(domain: string) {
    if (pending) return;
    if (confirming !== domain) {
      window.clearTimeout(confirmTimer.current);
      window.clearInterval(confirmTick.current);
      setConfirming(domain);
      setConfirmLeft(Math.ceil(CONFIRM_TIMEOUT_MS / 1000));
      confirmTimer.current = window.setTimeout(clearConfirm, CONFIRM_TIMEOUT_MS);
      confirmTick.current = window.setInterval(() => setConfirmLeft((s) => Math.max(0, s - 1)), 1000);
      return;
    }
    clearConfirm();
    setError("");
    setPending(domain);
    try {
      const r = await monitor.toggle(domain);
      if (!r.ok) {
        setError(t("monitor.failed"));
        return;
      }
      setQuota((q) => (q ? { ...q, monitored: Math.max(0, q.monitored - 1) } : q));
    } finally {
      setPending(null);
    }
  }

  const domains = [...monitor.monitored].sort();
  const fmtTime = (ts: number) => new Date(ts).toLocaleString(lang === "zh" ? "zh-CN" : "en-US");
  const relTime = (ts: number): string => {
    const mins = Math.floor(Math.max(0, now - ts) / 60_000);
    if (mins < 1) return t("monitors.justNow");
    if (mins < 60) return t("monitors.minutesAgo", { n: mins });
    return t("monitors.hoursAgo", { n: Math.floor(mins / 60) });
  };
  const quotaFull = quota !== null && quota.limit > 0 && quota.monitored >= quota.limit;
  const porkbun = REGISTRARS[0];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 md:px-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">{t("monitors.title")}</h1>
        {quota && (
          <span className="tnum rounded-lg bg-bg2 px-3 py-1.5 font-mono text-xs text-txt1" title={t("monitors.quota")}>
            {t("monitors.quota")} {quota.monitored}/{quota.limit}
          </span>
        )}
      </div>
      <p className="mb-2 text-xs text-txt2">{t("monitors.hint")}</p>

      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          className="flex h-11 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 disabled:pointer-events-none disabled:opacity-50 sm:h-9"
          onClick={() => void refresh(true)}
          disabled={refreshing || loading || rateLimitedFor !== null}
        >
          <RotateCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          {refreshing ? t("monitors.refreshing") : t("monitors.refresh")}
        </button>
        {lastRefreshedAt !== null && (
          <span className="tnum text-xs text-txt2">{t("monitors.lastRefreshed", { time: relTime(lastRefreshedAt) })}</span>
        )}
        {domains.length > 0 && <span className="tnum text-xs text-txt2">{t("monitors.mine", { n: domains.length })}</span>}
      </div>

      {quotaFull && (
        <p className="mb-3 rounded-lg border border-line bg-bg2 px-4 py-2.5 text-sm text-txt1">
          {t("monitors.quotaFull", { limit: quota.limit })}
        </p>
      )}

      {error && <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</p>}

      {rateLimitedFor !== null && (
        <p className="mb-3 rounded-lg border border-line bg-bg2 px-4 py-2.5 text-sm text-txt1">{t("monitors.rateLimited", { s: rateLimitedFor })}</p>
      )}

      {domains.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <Bell className="mx-auto h-6 w-6 text-txt2" />
          <p className="mt-3 text-sm text-txt1">{t("monitors.empty")}</p>
          <button
            className="mt-5 inline-flex h-11 items-center gap-1.5 rounded-lg bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
            onClick={onStart}
          >
            {t("monitors.goShortlist")}
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg1">
          {domains.map((domain) => {
            const entry = entries[domain];
            const confirmed = confirming === domain;
            return (
              <li key={domain} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3.5">
                <span className="min-w-0 break-all font-mono text-[15px] font-semibold">{domain}</span>
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-txt2" />
                ) : (
                  entry && (
                    <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold", statusBadgeClass(entry.status))}>
                      {t(entry.status === "available" ? "status.available" : entry.status === "taken" ? "status.taken" : "status.unknown")}
                    </span>
                  )
                )}
                {!loading && entry?.status === "taken" && entry.expiresAt && <ExpiryNote iso={entry.expiresAt} />}
                <span className="ml-auto flex items-center gap-2">
                  {!loading && entry && (
                    <span className="tnum hidden font-mono text-[11px] text-txt2 sm:inline" title={t("monitors.lastChecked")}>
                      {entry.lastChecked > 0 ? `${t("monitors.lastChecked")} ${fmtTime(entry.lastChecked)}` : t("monitors.never")}
                    </span>
                  )}
                  <button
                    className={cn(
                      "relative flex h-11 items-center gap-1.5 overflow-hidden rounded-lg border px-3 text-sm sm:h-9",
                      confirmed
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-line text-txt1 hover:bg-bg2 hover:text-destructive",
                    )}
                    disabled={pending !== null}
                    title={confirmed ? t("monitors.confirmCountdown", { s: confirmLeft }) : undefined}
                    onClick={() => void cancel(domain)}
                  >
                    {pending === domain ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellOff className="h-4 w-4" />}
                    <ConfirmLabel
                      confirmed={confirmed}
                      label={t("monitors.cancel")}
                      confirmLabel={
                        <>
                          {t("monitors.cancelConfirm")}
                          <span className="tnum w-[1ch] font-mono text-[11px] opacity-70">{confirmLeft}</span>
                        </>
                      }
                    />
                    {confirmed && <span aria-hidden className="confirm-countdown absolute inset-x-0 bottom-0 h-0.5 bg-destructive" />}
                  </button>
                </span>
                <span className="flex w-full items-center gap-x-4 gap-y-1">
                  <a
                    className="flex h-11 items-center gap-1 text-xs text-txt1 underline-offset-2 hover:text-txt0 hover:underline sm:h-auto sm:py-1"
                    href={`/?q=${encodeURIComponent(domain)}`}
                  >
                    <Search className="h-3.5 w-3.5" />
                    {t("monitors.checkAvailability")}
                  </a>
                  {!loading && entry?.status === "available" && (
                    <a
                      className="flex h-11 items-center gap-1 text-xs text-brand underline-offset-2 hover:underline sm:h-auto sm:py-1"
                      href={porkbun.url(domain)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t("common.register")} · {porkbun.name}
                    </a>
                  )}
                  {!loading && entry && (
                    <span className="tnum ml-auto font-mono text-[11px] text-txt2 sm:hidden">
                      {entry.lastChecked > 0 ? `${t("monitors.lastChecked")} ${fmtTime(entry.lastChecked)}` : t("monitors.never")}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
