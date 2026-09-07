import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Bell, BellOff, BellPlus, CheckCircle, ExternalLink, Loader2, Pencil, RotateCw, Search, Send, Trash2, Webhook, X } from "lucide-react";

import { ConfirmLabel } from "@/components/confirm-label";
import { ExpiryNote } from "@/components/domain-row";
import { RegistrarAnchor } from "@/components/registrar-link";
import { Input } from "@/components/ui/input";
import { TLD_LIST } from "@/content/tld-list";
import {
  fetchMonitorList,
  maskWebhook,
  recheckMonitors,
  RecheckRateLimitError,
  sendWebhookTest,
  useMonitor,
  WEBHOOK_MAX_LENGTH,
  webhookInvalidReason,
  type MonitorAddResult,
  type MonitorListEntry,
  type WebhookInvalidReason,
  type WebhookTestResult,
} from "@/lib/monitor";
import { primaryRegistrar } from "@/lib/registrars";
import { useI18n } from "@/lib/i18n";
import { cn, formatExpiry } from "@/lib/utils";

const CONFIRM_TIMEOUT_MS = 6000;
const ADDED_HIGHLIGHT_MS = 4000;

function statusBadgeClass(status: string): string {
  if (status === "available") return "bg-brand-dim text-brand";
  if (status === "taken") return "bg-taken-dim text-taken";
  return "bg-bg3 text-txt1";
}

const BTN_SECONDARY =
  "flex h-11 items-center justify-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 disabled:pointer-events-none disabled:opacity-50 sm:h-9";

type WebhookTestState = { kind: "idle" } | { kind: "sending" } | { kind: "done"; result: WebhookTestResult };

/**
 * 通知方式卡片：/monitors 首屏。未配置→输入框；已配置→脱敏 URL + 发送测试/修改/清除。
 * 保存时同步到已监控域名的服务端条目（useMonitor.setWebhook）；空字符串保存 = 清除。
 */
function NotifyCard({ webhook, onSave }: { webhook: string; onSave: (url: string) => Promise<boolean> }) {
  const { t } = useI18n();
  const configured = webhook !== "";
  const [editing, setEditing] = useState(!configured);
  const [input, setInput] = useState(webhook);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState<"saved" | "cleared" | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clearLeft, setClearLeft] = useState(0);
  const [test, setTest] = useState<WebhookTestState>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const flashTimer = useRef<number | undefined>(undefined);
  const clearTimer = useRef<number | undefined>(undefined);
  const clearTick = useRef<number | undefined>(undefined);

  // 外部（同页其他入口/存储事件）改了 webhook 时同步展示态
  useEffect(() => {
    setInput(webhook);
    setEditing(webhook === "");
    setTouched(false);
  }, [webhook]);

  useEffect(
    () => () => {
      window.clearTimeout(flashTimer.current);
      window.clearTimeout(clearTimer.current);
      window.clearInterval(clearTick.current);
    },
    [],
  );

  // 限频倒数：到 0 后自动回到 idle，按钮恢复
  useEffect(() => {
    if (test.kind !== "done" || test.result.kind !== "rateLimited") return;
    const left = test.result.retryAfter;
    if (left <= 0) {
      setTest({ kind: "idle" });
      return;
    }
    const id = window.setTimeout(() => setTest({ kind: "done", result: { kind: "rateLimited", retryAfter: left - 1 } }), 1000);
    return () => window.clearTimeout(id);
  }, [test]);

  const trimmed = input.trim();
  const reason: WebhookInvalidReason | null = trimmed === "" ? null : webhookInvalidReason(trimmed);
  const showError = touched && reason !== null;

  function flash(kind: "saved" | "cleared") {
    setSavedFlash(kind);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setSavedFlash(null), 3000);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setTouched(true);
    if (reason !== null) {
      inputRef.current?.focus();
      return;
    }
    setSaving(true);
    try {
      const ok = await onSave(trimmed);
      if (!ok) return;
      setTest({ kind: "idle" });
      flash(trimmed === "" ? "cleared" : "saved");
      if (trimmed !== "") setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setInput(webhook);
    setTouched(false);
    setEditing(false);
  }

  // Esc：已配置时退出编辑；未配置时清空输入；输入已空且无可退出时不拦截
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Escape") return;
    if (configured) {
      e.preventDefault();
      cancelEdit();
    } else if (input !== "") {
      e.preventDefault();
      setInput("");
      setTouched(false);
    }
  }

  function stopClearConfirm() {
    window.clearTimeout(clearTimer.current);
    window.clearInterval(clearTick.current);
    setClearConfirm(false);
    setClearLeft(0);
  }

  async function clear() {
    if (saving) return;
    if (!clearConfirm) {
      setClearConfirm(true);
      setClearLeft(Math.ceil(CONFIRM_TIMEOUT_MS / 1000));
      clearTimer.current = window.setTimeout(stopClearConfirm, CONFIRM_TIMEOUT_MS);
      clearTick.current = window.setInterval(() => setClearLeft((s) => Math.max(0, s - 1)), 1000);
      return;
    }
    stopClearConfirm();
    setSaving(true);
    try {
      if (await onSave("")) {
        setTest({ kind: "idle" });
        flash("cleared");
      }
    } finally {
      setSaving(false);
    }
  }

  // 发送测试：编辑态用输入框内容（可先测再存），展示态用已保存地址
  const testTarget = editing ? trimmed : webhook;
  const canTest = testTarget !== "" && webhookInvalidReason(testTarget) === null && test.kind !== "sending" && !(test.kind === "done" && test.result.kind === "rateLimited");
  async function runTest() {
    if (!canTest) return;
    setTest({ kind: "sending" });
    const result = await sendWebhookTest(testTarget);
    setTest({ kind: "done", result });
  }

  function testFeedback(r: WebhookTestResult): { tone: "ok" | "error" | "info"; text: string } {
    switch (r.kind) {
      case "delivered":
        return { tone: "ok", text: t("monitors.notify.test.delivered", { status: r.status }) };
      case "rejected":
        return { tone: "error", text: t("monitors.notify.test.rejected", { status: r.status }) };
      case "unreachable":
        return { tone: "error", text: t("monitors.notify.test.unreachable") };
      case "invalid":
        return { tone: "error", text: t("monitors.notify.err.scheme") };
      case "rateLimited":
        return { tone: "info", text: t("monitors.notify.test.rateLimited", { s: r.retryAfter }) };
      case "failed":
        return { tone: "error", text: t("monitors.notify.test.failed") };
    }
  }

  const feedback = test.kind === "done" ? testFeedback(test.result) : null;
  const errorText = showError && reason ? t(reason === "length" ? "monitors.notify.err.length" : reason === "syntax" ? "monitors.notify.err.syntax" : "monitors.notify.err.scheme", { max: WEBHOOK_MAX_LENGTH }) : null;

  return (
    <section aria-labelledby="monitor-notify-heading" className="mb-4 rounded-xl border border-line bg-bg1 p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 id="monitor-notify-heading" className="flex items-center gap-1.5 text-sm font-semibold">
          <Webhook className="h-4 w-4 text-brand" />
          {t("monitors.notify.title")}
        </h2>
        <span
          className={cn("shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold", configured ? "bg-brand-dim text-brand" : "bg-bg3 text-txt1")}
          data-testid="notify-state"
        >
          {t(configured ? "monitors.notify.stateOn" : "monitors.notify.stateOff")}
        </span>
      </div>
      <p id="monitor-notify-desc" className="mt-1 text-xs text-txt2">{t("monitors.notify.desc")}</p>

      {editing ? (
        <form className="mt-3" onSubmit={(e) => void submit(e)} noValidate>
          <label htmlFor="monitor-webhook-input" className="sr-only">
            {t("monitors.notify.inputLabel")}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="monitor-webhook-input"
              ref={inputRef}
              type="url"
              name="webhook"
              className={cn("h-11 min-h-11 w-full min-w-0 font-mono text-xs sm:h-10 sm:min-h-0 sm:flex-1", showError && "border-destructive focus-visible:ring-destructive")}
              value={input}
              placeholder={t("monitor.webhookPlaceholder")}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="url"
              enterKeyHint="done"
              maxLength={WEBHOOK_MAX_LENGTH + 20}
              readOnly={saving}
              aria-describedby={errorText ? "monitor-notify-desc monitor-notify-error" : "monitor-notify-desc monitor-notify-rules"}
              aria-invalid={showError || undefined}
              onChange={(e) => {
                setInput(e.target.value);
                if (test.kind === "done" && test.result.kind !== "rateLimited") setTest({ kind: "idle" });
              }}
              onBlur={() => setTouched(true)}
              onKeyDown={onKeyDown}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 sm:h-10"
                disabled={saving || trimmed === webhook}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                {configured && trimmed === "" ? t("monitors.notify.clear") : t("monitors.notify.save")}
              </button>
              <button type="button" className={cn(BTN_SECONDARY, "sm:h-10")} disabled={!canTest} onClick={() => void runTest()}>
                {test.kind === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {test.kind === "sending" ? t("monitors.notify.testing") : t("monitors.notify.test")}
              </button>
              {configured && (
                <button type="button" className={cn(BTN_SECONDARY, "sm:h-10")} onClick={cancelEdit} disabled={saving}>
                  {t("monitors.notify.cancelEdit")}
                </button>
              )}
            </div>
          </div>
          {errorText ? (
            <p id="monitor-notify-error" role="alert" className="mt-2 text-xs text-destructive">
              {errorText}
            </p>
          ) : (
            <p id="monitor-notify-rules" className="mt-2 text-xs text-txt2">
              {t(configured ? "monitors.notify.rulesEdit" : "monitors.notify.rules", { max: WEBHOOK_MAX_LENGTH })}
            </p>
          )}
        </form>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code
            className="tnum min-w-0 flex-1 truncate rounded-lg bg-bg2 px-3 py-2 font-mono text-xs text-txt0"
            title={t("monitors.notify.maskedTitle")}
            data-testid="notify-masked"
          >
            {maskWebhook(webhook)}
          </code>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={BTN_SECONDARY} disabled={!canTest} onClick={() => void runTest()}>
              {test.kind === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {test.kind === "sending" ? t("monitors.notify.testing") : t("monitors.notify.test")}
            </button>
            <button
              type="button"
              className={BTN_SECONDARY}
              disabled={saving}
              onClick={() => {
                stopClearConfirm();
                setEditing(true);
                window.setTimeout(() => inputRef.current?.focus(), 0);
              }}
            >
              <Pencil className="h-4 w-4" />
              {t("monitors.notify.edit")}
            </button>
            <button
              type="button"
              className={cn(
                "relative flex h-11 items-center gap-1.5 overflow-hidden rounded-lg border px-3 text-sm sm:h-9",
                clearConfirm ? "border-destructive bg-destructive/10 text-destructive" : "border-line text-txt1 hover:bg-bg2 hover:text-destructive",
              )}
              disabled={saving}
              title={clearConfirm ? t("monitors.confirmCountdown", { s: clearLeft }) : undefined}
              onClick={() => void clear()}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              <ConfirmLabel
                confirmed={clearConfirm}
                label={t("monitors.notify.clear")}
                confirmLabel={
                  <>
                    {t("monitors.cancelConfirm")}
                    <span className="tnum w-[1ch] font-mono text-[11px] opacity-70">{clearLeft}</span>
                  </>
                }
              />
              {clearConfirm && <span aria-hidden className="confirm-countdown absolute inset-x-0 bottom-0 h-0.5 bg-destructive" />}
            </button>
          </div>
        </div>
      )}

      {(feedback || savedFlash) && (
        <p
          role={feedback?.tone === "error" ? "alert" : "status"}
          className={cn(
            "mt-3 rounded-lg border px-3 py-2 text-sm break-words",
            feedback?.tone === "error" && "border-destructive/30 bg-destructive/10 text-destructive",
            feedback?.tone === "info" && "border-line bg-bg2 text-txt0",
            (feedback?.tone === "ok" || (!feedback && savedFlash)) && "border-brand/30 bg-brand-dim/40 text-txt0",
          )}
          data-testid="notify-feedback"
        >
          {feedback ? feedback.text : t(savedFlash === "cleared" ? "monitors.notify.cleared" : "monitors.notify.saved")}
        </p>
      )}
    </section>
  );
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
  const [addInput, setAddInput] = useState("");
  const [adding, setAdding] = useState(false);
  // 存结果而非文案：渲染时翻译，切语言后提示同步
  const [addResult, setAddResult] = useState<MonitorAddResult | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  const addedTimer = useRef<number | undefined>(undefined);
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
      window.clearTimeout(addedTimer.current);
    },
    [],
  );

  async function submitAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (adding) return;
    setAdding(true);
    setAddResult(null);
    try {
      const r = await monitor.add(addInput);
      setAddResult(r);
      if (r.kind === "added") {
        setEntries((prev) => ({ ...prev, [r.entry.domain]: r.entry }));
        setQuota({ monitored: r.monitored, limit: r.limit });
        setAddInput("");
        setJustAdded(r.entry.domain);
        window.clearTimeout(addedTimer.current);
        addedTimer.current = window.setTimeout(() => setJustAdded(null), ADDED_HIGHLIGHT_MS);
      } else if (r.kind === "available" || r.kind === "full") {
        if (typeof r.monitored === "number" && typeof r.limit === "number") setQuota({ monitored: r.monitored, limit: r.limit });
      }
    } finally {
      setAdding(false);
      addInputRef.current?.focus();
    }
  }

  function clearAdd() {
    setAddInput("");
    setAddResult(null);
    addInputRef.current?.focus();
  }

  // Esc 清空输入与提示；输入框已空时不拦截，交给页面默认行为
  function onAddKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape" && (addInput !== "" || addResult !== null)) {
      e.preventDefault();
      clearAdd();
    }
  }

  function addFeedback(r: MonitorAddResult): { tone: "ok" | "info" | "error"; text: string; registerFor?: string } {
    switch (r.kind) {
      case "added": {
        const date = r.entry.status === "taken" && r.entry.expiresAt ? formatExpiry(r.entry.expiresAt) : null;
        if (r.entry.status === "unknown") return { tone: "ok", text: t("monitors.add.addedUnknown", { domain: r.entry.domain }) };
        return { tone: "ok", text: date ? t("monitors.add.addedExpiry", { domain: r.entry.domain, date }) : t("monitors.add.added", { domain: r.entry.domain }) };
      }
      case "available":
        return { tone: "info", text: t("monitors.add.available", { domain: r.entry.domain }), registerFor: r.entry.domain };
      case "rejected":
        if (r.reason === "tld") return { tone: "error", text: t("monitors.add.err.tld", { tld: r.tld ?? "", count: TLD_LIST.length }) };
        if (r.reason === "duplicate") return { tone: "error", text: t("monitors.add.err.duplicate", { domain: r.domain }) };
        return { tone: "error", text: t(r.reason === "empty" ? "monitors.add.err.empty" : "monitors.add.err.syntax") };
      case "full":
        return { tone: "error", text: t("monitors.add.err.full", { limit: r.limit ?? quota?.limit ?? "" }) };
      case "failed":
        return { tone: "error", text: t(r.error === "check" ? "monitors.add.err.check" : "monitors.add.err.network") };
    }
  }

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
  const feedback = addResult ? addFeedback(addResult) : null;

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
      <p className="mb-3 text-xs text-txt2">{t("monitors.hint")}</p>

      <NotifyCard webhook={monitor.webhook} onSave={monitor.setWebhook} />

      <form className="mb-4 rounded-xl border border-line bg-bg1 p-4" onSubmit={(e) => void submitAdd(e)} noValidate>
        <label htmlFor="monitor-add-input" className="flex items-center gap-1.5 text-sm font-semibold">
          <BellPlus className="h-4 w-4 text-brand" />
          {t("monitors.add.label")}
        </label>
        <p id="monitor-add-hint" className="mt-1 text-xs text-txt2">{t("monitors.add.hint")}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Input
              id="monitor-add-input"
              ref={addInputRef}
              name="domain"
              className={cn("h-11 pr-10 font-mono sm:h-10", feedback?.tone === "error" && "border-destructive focus-visible:ring-destructive")}
              value={addInput}
              placeholder={t("monitors.add.placeholder")}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="url"
              enterKeyHint="go"
              maxLength={253}
              readOnly={adding}
              aria-describedby={feedback ? "monitor-add-hint monitor-add-feedback" : "monitor-add-hint"}
              aria-invalid={feedback?.tone === "error" || undefined}
              onChange={(e) => {
                setAddInput(e.target.value);
                if (addResult) setAddResult(null);
              }}
              onKeyDown={onAddKeyDown}
            />
            {addInput !== "" && !adding && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-txt2 hover:text-txt0"
                aria-label={t("monitors.add.clear")}
                onClick={clearAdd}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 sm:h-10"
            disabled={adding || quotaFull}
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellPlus className="h-4 w-4" />}
            {adding ? t("monitors.add.submitting") : t("monitors.add.submit")}
          </button>
        </div>
        {feedback && (
          <div
            id="monitor-add-feedback"
            role={feedback.tone === "error" ? "alert" : "status"}
            className={cn(
              "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border px-3 py-2 text-sm break-words",
              feedback.tone === "error" && "border-destructive/30 bg-destructive/10 text-destructive",
              feedback.tone === "ok" && "border-brand/30 bg-brand-dim/40 text-txt0",
              feedback.tone === "info" && "border-line bg-bg2 text-txt0",
            )}
          >
            <span className="min-w-0 break-words">{feedback.text}</span>
            {feedback.registerFor && (
              <RegistrarAnchor
                registrar={primaryRegistrar(feedback.registerFor)}
                domain={feedback.registerFor}
                className="flex h-11 items-center gap-1 text-sm font-semibold text-brand underline-offset-2 hover:underline sm:h-auto sm:py-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t("common.register")} · {primaryRegistrar(feedback.registerFor).name}
              </RegistrarAnchor>
            )}
          </div>
        )}
      </form>

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
              <li
                key={domain}
                className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3.5 transition-colors", justAdded === domain && "bg-brand-dim/40 shadow-[inset_2px_0_0_var(--brand)]")}
              >
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
                    <RegistrarAnchor
                      registrar={primaryRegistrar(domain)}
                      domain={domain}
                      className="flex h-11 items-center gap-1 text-xs text-brand underline-offset-2 hover:underline sm:h-auto sm:py-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t("common.register")} · {primaryRegistrar(domain).name}
                    </RegistrarAnchor>
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
