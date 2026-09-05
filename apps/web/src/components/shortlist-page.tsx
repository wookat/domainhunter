import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Bell, Bookmark, Check, ChevronDown, Copy, Download, ExternalLink, Link2, Loader2, MonitorSmartphone, RotateCw, Sparkles, StickyNote, Trash2 } from "lucide-react";

import { ConfirmLabel } from "@/components/confirm-label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { fetchMonitorChanges, loadWebhook, useMonitor, type MonitorChange } from "@/lib/monitor";
import { CopyButton, ExpiryNote, RegisterMenu } from "@/components/domain-row";
import { openRegistrar } from "@/components/registrar-link";
import { useAffiliateConfig } from "@/lib/affiliate";
import { ScoreBars } from "@/components/score-bars";
import { downloadText } from "@/lib/export";
import { useI18n, type TFunc } from "@/lib/i18n";
import { priceFull, priceShort, toUsd, usePrices, type PriceMap } from "@/lib/prices";
import { primaryRegistrar } from "@/lib/registrars";
import { copyText } from "@/lib/clipboard";
import { exportResultsCsv } from "@/lib/results-export";
import { addMyShare, loadMyShares, removeMyShare, type MyShare } from "@/lib/my-shares";
import { NOTE_MAX_LENGTH, type RecheckResult, type ShortlistItem } from "@/lib/shortlist";
import { scoreBadgeClass, tldPrice, totalScore, type Status } from "@/types";
import { cn, formatExpiry } from "@/lib/utils";

// 两步确认窗口：与 R213 口径统一为 5s（清空清单、删除分享记录共用）
const CONFIRM_WINDOW_MS = 5000;

function exportShortlist(items: ShortlistItem[], format: "csv" | "txt", lang: "zh" | "en", prices: PriceMap | null) {
  if (format === "csv") {
    exportResultsCsv(
      items.map((it) => ({
        domain: it.domain,
        tld: it.tld,
        meaning: it.meaning,
        scores: it.scores,
        status: it.status,
        expiresAt: it.expiresAt ? formatExpiry(it.expiresAt) ?? undefined : undefined,
        note: it.note,
      })),
      lang,
      prices,
      "domainhunter-shortlist",
      { expiresAt: true, note: true },
    );
    return;
  }
  downloadText(items.map((it) => it.domain).join("\n"), "domainhunter-shortlist.txt", "text/plain;charset=utf-8");
}

const BAR_KEYS = ["length", "readability", "relevance", "brandability"] as const;

type SortKey = "added" | "domain" | "price" | "expiry";

/** 首年价（美元）用于排序：实时价优先，回退静态参考价，无价排末尾 */
function sortPriceUsd(tld: string, prices: PriceMap | null): number {
  const p = prices?.[tld];
  if (p) return p.registration;
  const s = tldPrice(tld);
  return s ? toUsd(s.first) : Number.MAX_SAFE_INTEGER;
}

const SYNC_CODE_KEY = "domainhunter:sync:code";
const SYNC_CODE_RE = /^[A-Z0-9]{8}$/;

function loadSyncCode(): string {
  try {
    return localStorage.getItem(SYNC_CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** 复查后的状态变化：taken 高亮红，重新可注册高亮绿 */
type StatusChange = "becameTaken" | "becameAvailable";

function StatusBadge({ change, t }: { change: StatusChange; t: TFunc }) {
  if (change === "becameTaken") {
    return <span className="shrink-0 rounded bg-taken-dim px-1.5 py-0.5 text-[11px] font-semibold text-taken">{t("shortlist.becameTaken")}</span>;
  }
  return <span className="shrink-0 rounded bg-brand-dim px-1.5 py-0.5 text-[11px] font-semibold text-brand">{t("shortlist.becameAvailable")}</span>;
}

export function ShortlistPage({
  items,
  onRemove,
  onClear,
  onStart,
  onMerge,
  onSetNote,
  lastCheckedAt,
  onApplyStatuses,
}: {
  items: ShortlistItem[];
  onRemove: (domain: string) => void;
  onClear: () => void;
  onStart: () => void;
  onMerge: (incoming: Omit<ShortlistItem, "addedAt">[]) => void;
  onSetNote: (domain: string, note: string) => void;
  lastCheckedAt: number | null;
  onApplyStatuses: (results: Record<string, RecheckResult>) => void;
}) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const affiliateCfg = useAffiliateConfig();
  const [sort, setSort] = useState<SortKey>("added");
  const [desc, setDesc] = useState(false);
  const [noteEditing, setNoteEditing] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const noteCancelRef = useRef(false);

  const sorted = useMemo(() => {
    const list = [...items];
    if (sort === "added") list.sort((a, b) => a.addedAt - b.addedAt);
    else if (sort === "domain") list.sort((a, b) => a.domain.localeCompare(b.domain));
    else if (sort === "price") list.sort((a, b) => sortPriceUsd(a.tld, prices) - sortPriceUsd(b.tld, prices));
    else list.sort((a, b) => (a.expiresAt ? Date.parse(a.expiresAt) : Number.MAX_SAFE_INTEGER) - (b.expiresAt ? Date.parse(b.expiresAt) : Number.MAX_SAFE_INTEGER));
    return desc ? list.reverse() : list;
  }, [items, sort, desc, prices]);

  // 对齐 /prices 的排序交互：再点同一列切换升/降序，切换列时重置为升序
  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => {
        if (sort === k) setDesc((d) => !d);
        else {
          setSort(k);
          setDesc(false);
        }
      }}
      className={cn("flex min-h-[32px] items-center gap-1 text-xs font-semibold", sort === k ? "text-brand" : "text-txt1 hover:text-txt0")}
    >
      {label}
      {sort === k ? (desc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
    </button>
  );

  const startNote = (it: ShortlistItem) => {
    setNoteEditing(it.domain);
    setNoteDraft(it.note ?? "");
  };

  const commitNote = (domain: string) => {
    onSetNote(domain, noteDraft);
    setNoteEditing(null);
  };

  // 行内备注：点击即编辑，Enter/失焦保存，Esc 放弃；仅存本地，不随分享外发。
  // 普通函数而非内联组件：避免每次渲染重建组件身份导致输入框失焦
  const noteLine = (it: ShortlistItem) =>
    noteEditing === it.domain ? (
      <input
        autoFocus
        maxLength={NOTE_MAX_LENGTH}
        value={noteDraft}
        onChange={(e) => setNoteDraft(e.target.value)}
        onBlur={() => {
          if (noteCancelRef.current) {
            noteCancelRef.current = false;
            setNoteEditing(null);
            return;
          }
          commitNote(it.domain);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitNote(it.domain);
          else if (e.key === "Escape") {
            noteCancelRef.current = true;
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder={t("shortlist.notePlaceholder")}
        className="mt-1 h-8 w-full max-w-xs rounded-md border border-brand-line bg-bg0 px-2 text-xs text-txt0 placeholder:text-txt2 focus:outline-none"
      />
    ) : it.note ? (
      <button
        title={t("shortlist.noteEdit")}
        onClick={() => startNote(it)}
        className="mt-1 flex min-h-[44px] min-w-0 max-w-xs items-center gap-1 text-left text-xs text-txt1 hover:text-txt0 md:min-h-0"
      >
        <StickyNote className="h-3 w-3 shrink-0 text-brand" />
        <span className="truncate">{it.note}</span>
      </button>
    ) : (
      <button onClick={() => startNote(it)} className="mt-1 flex min-h-[44px] items-center gap-1 text-xs text-txt2 hover:text-brand md:min-h-0">
        <StickyNote className="h-3 w-3" />
        {t("shortlist.addNote")}
      </button>
    );
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [shareError, setShareError] = useState("");
  const [rechecking, setRechecking] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const confirmTimer = useRef<number | undefined>(undefined);
  const [syncCode, setSyncCode] = useState(loadSyncCode);
  const [pushing, setPushing] = useState(false);
  const [pushDone, setPushDone] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [importCode, setImportCode] = useState("");
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [importError, setImportError] = useState("");
  const [recheckError, setRecheckError] = useState("");
  const [checkingDomains, setCheckingDomains] = useState<Set<string>>(new Set());
  const [changes, setChanges] = useState<Record<string, StatusChange>>({});
  const abortRef = useRef<AbortController | null>(null);
  const monitor = useMonitor();
  const [monitorError, setMonitorError] = useState("");
  const [monitorPending, setMonitorPending] = useState<string | null>(null);
  const [changesOpen, setChangesOpen] = useState(false);
  const [monitorChanges, setMonitorChanges] = useState<MonitorChange[] | null>(null);
  const [changesLoading, setChangesLoading] = useState(false);
  const [changesError, setChangesError] = useState("");
  const [webhookInput, setWebhookInput] = useState(() => loadWebhook());
  const [webhookState, setWebhookState] = useState<"idle" | "saving" | "saved" | "invalid">("idle");
  const [myShares, setMyShares] = useState<MyShare[]>(loadMyShares);
  const [shareCopiedId, setShareCopiedId] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState("");
  const deleteConfirmTimer = useRef<number | undefined>(undefined);
  const [deletingId, setDeletingId] = useState("");
  const [deleteError, setDeleteError] = useState("");

  async function copyShareUrl(record: MyShare) {
    // 剪贴板不可用时链接仍可手动选中
    if (!(await copyText(record.url))) return;
    setShareCopiedId(record.id);
    setTimeout(() => setShareCopiedId((cur) => (cur === record.id ? "" : cur)), 2000);
  }

  async function deleteShare(record: MyShare) {
    if (confirmDeleteId !== record.id) {
      setConfirmDeleteId(record.id);
      window.clearTimeout(deleteConfirmTimer.current);
      deleteConfirmTimer.current = window.setTimeout(() => setConfirmDeleteId(""), CONFIRM_WINDOW_MS);
      return;
    }
    window.clearTimeout(deleteConfirmTimer.current);
    setConfirmDeleteId("");
    setDeleteError("");
    if (!record.token) {
      // 旧记录无撤销凭证：仅移除本地记录
      setMyShares(removeMyShare(record.id));
      return;
    }
    setDeletingId(record.id);
    try {
      const res = await fetch(`/api/share/${encodeURIComponent(record.id)}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: record.token }),
      });
      // 404（已过期）也视为删除成功，同步移除本地记录
      if (!res.ok && res.status !== 404) throw new Error(String(res.status));
      setMyShares(removeMyShare(record.id));
    } catch {
      setDeleteError(t("myShares.deleteFailed"));
    } finally {
      setDeletingId("");
    }
  }

  async function saveWebhook() {
    setWebhookState("saving");
    const ok = await monitor.setWebhook(webhookInput);
    setWebhookState(ok ? "saved" : "invalid");
  }

  async function toggleMonitor(domain: string, status?: string) {
    if (monitorPending) return;
    setMonitorError("");
    setMonitorPending(domain);
    try {
      const r = await monitor.toggle(domain, status);
      if (!r.ok) setMonitorError(r.full ? t("monitor.full") : t("monitor.failed"));
    } finally {
      setMonitorPending(null);
    }
  }

  async function openChanges() {
    const next = !changesOpen;
    setChangesOpen(next);
    if (!next) return;
    setChangesLoading(true);
    setChangesError("");
    try {
      setMonitorChanges(await fetchMonitorChanges());
    } catch {
      setChangesError(t("monitor.changesFailed"));
    } finally {
      setChangesLoading(false);
    }
  }

  // 只展示与本人清单相关的变化（前端按本地清单过滤）
  const myDomains = new Set(items.map((i) => i.domain));
  const relevantChanges = (monitorChanges ?? []).filter((c) => myDomains.has(c.domain));

  // 批量注册：每个域名用自己的首选注册商（.cn → 阿里云，其余 → Porkbun），与注册菜单首项一致
  const batchRegister = () => {
    for (const it of items.slice(0, 8)) openRegistrar(primaryRegistrar(it.domain), it.domain, affiliateCfg);
  };

  async function share() {
    setSharing(true);
    setShareError("");
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: items.map(({ domain, meaning, scores, status }) => ({ domain, meaning, scores, status: status === "checking" ? undefined : status })) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { id, url, revokeToken } = (await res.json()) as { id: string; url: string; revokeToken?: string };
      setShareUrl(url);
      setMyShares(addMyShare({ id, url, createdAt: Date.now(), count: items.length, token: revokeToken }));
      // 剪贴板不可用时仍展示链接
      if (await copyText(url)) {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      setShareError(t("shortlist.shareFailed"));
    } finally {
      setSharing(false);
    }
  }

  /** 同步到其他设备：首次生成同步码，之后同码覆盖推送最新清单 */
  async function pushSync() {
    setPushing(true);
    setSyncError("");
    setPushDone(false);
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: syncCode || undefined, items: items.map(({ domain, meaning, scores }) => ({ domain, meaning, scores })) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { code } = (await res.json()) as { code: string };
      setSyncCode(code);
      try {
        localStorage.setItem(SYNC_CODE_KEY, code);
      } catch { /* 存不了也仍展示码 */ }
      setPushDone(true);
      setTimeout(() => setPushDone(false), 3000);
    } catch {
      setSyncError(t("sync.pushFailed"));
    } finally {
      setPushing(false);
    }
  }

  /** 输入同步码导入：合并（去重）到本地清单 */
  async function importSync() {
    const code = importCode.trim().toUpperCase();
    setImportError("");
    setImportedCount(null);
    if (!SYNC_CODE_RE.test(code)) {
      setImportError(t("sync.importInvalid"));
      return;
    }
    setImporting(true);
    try {
      const res = await fetch(`/api/sync/${code}`);
      if (res.status === 404) {
        setImportError(t("sync.importNotFound"));
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const { items: incoming } = (await res.json()) as { items: Omit<ShortlistItem, "addedAt">[] };
      const seen = new Set(items.map((i) => i.domain));
      const fresh = incoming.filter((i) => !seen.has(i.domain));
      onMerge(incoming);
      setImportedCount(fresh.length);
      setImportCode("");
    } catch {
      setImportError(t("sync.importFailed"));
    } finally {
      setImporting(false);
    }
  }

  async function recheck() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setRechecking(true);
    setRecheckError("");
    setChanges({});
    setCheckingDomains(new Set(items.map((i) => i.domain)));
    const prevStatus = new Map(items.map((i) => [i.domain, i.status]));
    const statuses: Record<string, RecheckResult> = {};
    const newChanges: Record<string, StatusChange> = {};
    try {
      const res = await fetch("/api/check?refresh=1", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domains: items.map((i) => i.domain), refresh: true }),
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
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
          const r = JSON.parse(line) as { domain: string; status: Status; expiresAt?: string };
          statuses[r.domain] = { status: r.status, ...(r.status === "taken" && r.expiresAt ? { expiresAt: r.expiresAt } : {}) };
          const prev = prevStatus.get(r.domain);
          if (r.status === "taken" && prev != null && prev !== "taken") newChanges[r.domain] = "becameTaken";
          else if (r.status === "available" && prev === "taken") newChanges[r.domain] = "becameAvailable";
          setCheckingDomains((prev2) => {
            const next = new Set(prev2);
            next.delete(r.domain);
            return next;
          });
          setChanges({ ...newChanges });
        }
      }
      onApplyStatuses(statuses);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setRecheckError(t("shortlist.recheckFailed"));
    } finally {
      setRechecking(false);
      setCheckingDomains(new Set());
    }
  }

  const barLabels: Record<(typeof BAR_KEYS)[number], string> = {
    length: t("score.length"),
    readability: t("score.readability"),
    relevance: t("score.relevance"),
    brandability: t("score.brandability"),
  };

  const lastCheckedStr = lastCheckedAt
    ? t("shortlist.lastChecked", { time: new Date(lastCheckedAt).toLocaleString(lang === "zh" ? "zh-CN" : "en-US") })
    : t("shortlist.neverChecked");

  const rowHighlight = (change?: StatusChange) =>
    change === "becameTaken"
      ? "bg-taken-dim/40 shadow-[inset_2px_0_0_var(--taken,#e5484d)]"
      : change === "becameAvailable"
        ? "bg-brand-dim/40 shadow-[inset_2px_0_0_var(--brand)]"
        : undefined;

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6 md:px-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">{t("shortlist.title")}</h1>
        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => void recheck()}
              disabled={rechecking}
            >
              <RotateCw className={cn("h-4 w-4", rechecking && "animate-spin")} />
              {rechecking ? t("shortlist.rechecking") : t("shortlist.recheck")}
            </button>
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => void share()}
              disabled={sharing}
            >
              {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              {sharing ? t("shortlist.sharing") : t("shortlist.share")}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0">
                  <Download className="h-4 w-4" />
                  {t("common.export")}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => exportShortlist(items, "csv", lang, prices)}>{t("common.exportCsv")}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => exportShortlist(items, "txt", lang, prices)}>{t("common.exportTxt")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm",
                confirmClear
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-line text-txt1 hover:bg-bg2 hover:text-destructive",
              )}
              onClick={() => {
                if (confirmClear) {
                  window.clearTimeout(confirmTimer.current);
                  setConfirmClear(false);
                  onClear();
                } else {
                  setConfirmClear(true);
                  window.clearTimeout(confirmTimer.current);
                  confirmTimer.current = window.setTimeout(() => setConfirmClear(false), CONFIRM_WINDOW_MS);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
              <ConfirmLabel confirmed={confirmClear} label={t("shortlist.clear")} confirmLabel={t("shortlist.clearConfirm")} />
            </button>
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
              onClick={batchRegister}
            >
              <ExternalLink className="h-4 w-4" />
              {t("shortlist.batchRegister", { n: items.length })}
            </button>
          </div>
        )}
      </div>
      <p className="mb-2 text-xs text-txt2">{t("shortlist.hint")}</p>
      {items.length > 0 && <p className="tnum mb-3 text-xs text-txt2">{lastCheckedStr}</p>}

      {shareUrl && (
        <p className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-brand-line bg-brand-dim/40 px-4 py-2.5 text-sm text-txt1">
          <Link2 className="h-4 w-4 shrink-0 text-brand" />
          {t("shortlist.shareReady")}
          <a href={shareUrl} target="_blank" rel="noreferrer" className="break-all font-mono text-xs text-brand underline">
            {shareUrl}
          </a>
          {shareCopied && (
            <span className="flex items-center gap-1 text-xs text-brand">
              <Check className="h-3.5 w-3.5" />
              {t("shortlist.shareCopied")}
            </span>
          )}
        </p>
      )}
      {(shareError || recheckError || monitorError) && (
        <p className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          <span>{shareError || recheckError || monitorError}</span>
          {shareError && (
            <button
              className="rounded-md border border-destructive/40 px-2.5 py-1 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-50"
              disabled={sharing}
              onClick={() => void share()}
            >
              {sharing ? t("shortlist.sharing") : t("shortlist.shareRetry")}
            </button>
          )}
        </p>
      )}

      {/* 监控动态：开了监控的域名的掉落/回补记录 */}
      {items.length > 0 && (
        <div className="mb-4 rounded-xl border border-line bg-bg1">
          <button className="flex w-full items-center gap-1.5 px-4 py-3.5 text-xs font-semibold text-txt1 hover:text-txt0" onClick={() => void openChanges()}>
            <Bell className="h-3.5 w-3.5 text-brand" />
            {t("monitor.changes")}
            {monitor.monitored.size > 0 && (
              <span className="tnum rounded bg-brand-dim px-1.5 py-0.5 font-mono text-[11px] text-brand">{monitor.monitored.size}</span>
            )}
            <ChevronDown className={cn("ml-auto h-3.5 w-3.5 transition-transform", changesOpen && "rotate-180")} />
          </button>
          {changesOpen && (
            <div className="border-t border-line px-4 py-3">
              <p className="text-[11px] text-txt2">
                {t("monitor.changesHint")}
                {" · "}
                <a href="/monitors" className="text-brand underline hover:opacity-80">
                  {t("monitors.manage")}
                </a>
              </p>
              {/* 通知 webhook：用户自备 https 地址，监控域名状态变化时推送 JSON */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <input
                  type="url"
                  value={webhookInput}
                  onChange={(e) => {
                    setWebhookInput(e.target.value);
                    setWebhookState("idle");
                  }}
                  placeholder={t("monitor.webhookPlaceholder")}
                  className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-bg2 px-3 font-mono text-xs text-txt0 placeholder:text-txt2 focus:border-brand-line focus:outline-none"
                />
                <button
                  onClick={() => void saveWebhook()}
                  disabled={webhookState === "saving"}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-txt1 transition-colors hover:border-brand-line hover:text-brand disabled:opacity-50"
                >
                  {webhookState === "saving" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : webhookState === "saved" ? <Check className="h-3.5 w-3.5 text-brand" /> : null}
                  {webhookState === "saved" ? t("monitor.webhookSaved") : t("monitor.webhookSave")}
                </button>
              </div>
              <p className={cn("mt-1.5 text-[11px]", webhookState === "invalid" ? "text-destructive" : "text-txt2")}>
                {webhookState === "invalid" ? t("monitor.webhookInvalid") : t("monitor.webhookHint")}
              </p>
              {changesLoading ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-txt1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
                </p>
              ) : changesError ? (
                <p className="mt-2 text-xs text-destructive">{changesError}</p>
              ) : relevantChanges.length === 0 ? (
                <p className="mt-2 text-xs text-txt2">{t("monitor.changesEmpty")}</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {relevantChanges.map((c) => {
                    const dropped = c.to === "available"; // 掉落：taken → available，绿色高亮
                    return (
                      <li key={`${c.domain}:${c.at}`} className={cn("flex flex-wrap items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs", dropped ? "bg-brand-dim/40" : "bg-bg2")}>
                        <span className="font-mono font-semibold">{c.domain}</span>
                        <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-semibold", dropped ? "bg-brand-dim text-brand" : "bg-taken-dim text-taken")}>
                          {dropped ? t("monitor.dropped") : t("monitor.regained")}
                        </span>
                        <span className="tnum ml-auto font-mono text-[11px] text-txt2">{new Date(c.at).toLocaleString(lang === "zh" ? "zh-CN" : "en-US")}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* 我的分享链接：本地记录的已生成分享，可复制/删除（删除需两步确认） */}
      {myShares.length > 0 && (
        <div className="mb-4 rounded-xl border border-line bg-bg1 px-4 py-3.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-txt1">
            <Link2 className="h-3.5 w-3.5 text-brand" />
            {t("myShares.title")}
          </p>
          <p className="mt-1 text-[11px] text-txt2">{t("myShares.hint")}</p>
          {deleteError && <p className="mt-2 text-xs text-destructive">{deleteError}</p>}
          <ul className="mt-2.5 space-y-2">
            {myShares.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-bg2 px-3 py-2">
                <span className="tnum font-mono text-[11px] text-txt2">{new Date(s.createdAt).toLocaleString(lang === "zh" ? "zh-CN" : "en-US")}</span>
                <span className="rounded bg-brand-dim px-1.5 py-0.5 text-[11px] font-semibold text-brand">{t("myShares.item", { n: s.count })}</span>
                <a href={s.url} target="_blank" rel="noreferrer" className="min-w-0 break-all font-mono text-xs text-brand underline">
                  {s.url}
                </a>
                {!s.token && <span className="text-[11px] text-txt2">{t("myShares.localOnly")}</span>}
                <span className="ml-auto flex items-center gap-1.5">
                  <button
                    className="flex h-11 items-center gap-1 rounded-lg border border-line px-3 text-xs text-txt1 hover:bg-bg3 hover:text-txt0 md:h-9"
                    onClick={() => void copyShareUrl(s)}
                  >
                    {shareCopiedId === s.id ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
                    {shareCopiedId === s.id ? t("myShares.copied") : t("myShares.copy")}
                  </button>
                  <button
                    className={cn(
                      "flex h-11 items-center gap-1 rounded-lg border px-3 text-xs md:h-9",
                      confirmDeleteId === s.id
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-line text-txt1 hover:bg-bg3 hover:text-destructive",
                    )}
                    onClick={() => void deleteShare(s)}
                    disabled={deletingId === s.id}
                  >
                    {deletingId === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    <ConfirmLabel confirmed={confirmDeleteId === s.id} label={t("myShares.delete")} confirmLabel={t("myShares.deleteConfirm")} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 跨设备同步（免登录）：推送同步码 + 输入同步码导入 */}
      <div className="mb-4 rounded-xl border border-line bg-bg1 px-4 py-3.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-txt1">
          <MonitorSmartphone className="h-3.5 w-3.5 text-brand" />
          {t("sync.title")}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {items.length > 0 && (
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => void pushSync()}
              disabled={pushing}
            >
              {pushing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MonitorSmartphone className="h-4 w-4" />}
              {pushing ? t("sync.pushing") : t("sync.push")}
            </button>
          )}
          <input
            className="h-9 w-44 rounded-lg border border-line bg-bg0 px-3 font-mono text-sm uppercase tracking-widest placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-txt2 focus:border-brand-line focus:outline-none"
            placeholder={t("sync.importPlaceholder")}
            value={importCode}
            maxLength={8}
            onChange={(e) => setImportCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") void importSync();
            }}
          />
          <button
            className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 disabled:pointer-events-none disabled:opacity-50"
            onClick={() => void importSync()}
            disabled={importing || importCode.length === 0}
          >
            {importing && <Loader2 className="h-4 w-4 animate-spin" />}
            {importing ? t("sync.importing") : t("sync.import")}
          </button>
        </div>
        {syncCode && (
          <p className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-txt1">
            {t("sync.codeLabel")}
            <b className="rounded bg-brand-dim px-2 py-0.5 font-mono text-sm tracking-widest text-brand">{syncCode}</b>
            {pushDone && (
              <span className="flex items-center gap-1 text-brand">
                <Check className="h-3.5 w-3.5" />
                {t("sync.pushDone")}
              </span>
            )}
          </p>
        )}
        {syncCode && <p className="mt-1 text-[11px] text-txt2">{t("sync.codeHint")}</p>}
        {importedCount !== null && <p className="mt-2 text-xs text-brand">{t("sync.importDone", { n: importedCount })}</p>}
        {(syncError || importError) && <p className="mt-2 text-xs text-destructive">{syncError || importError}</p>}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <Bookmark className="mx-auto h-6 w-6 text-txt2" />
          <p className="mt-3 text-sm text-txt1">{t("shortlist.empty")}</p>
          <button
            className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
            onClick={onStart}
          >
            <Sparkles className="h-4 w-4" />
            {t("shortlist.startHunt")}
          </button>
        </div>
      ) : (
        <>
          {/* 排序控制：样式对齐 /prices，桌面与移动端共用 */}
          <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-xs text-txt2">{t("shortlist.sortBy")}</span>
            <SortBtn k="added" label={t("shortlist.sortAdded")} />
            <SortBtn k="domain" label={t("shortlist.domain")} />
            <SortBtn k="price" label={t("shortlist.sortPrice")} />
            <SortBtn k="expiry" label={t("shortlist.sortExpiry")} />
          </div>
          {/* 对比表（桌面） */}
          <div className="hidden overflow-x-auto rounded-xl border border-line bg-bg1 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="whitespace-nowrap border-b border-line text-left text-[11px] uppercase tracking-wide text-txt2">
                  <th className="px-4 py-3 font-medium">{t("shortlist.domain")}</th>
                  <th className="px-2 py-3 text-center font-medium">{t("score.total")}</th>
                  {BAR_KEYS.map((k) => (
                    <th key={k} className="px-2 py-3 font-medium">
                      {barLabels[k]}
                    </th>
                  ))}
                  <th className="px-2 py-3 text-right font-medium">{t("shortlist.price")}</th>
                  <th title={t("monitor.toggleTitle")} className="px-2 py-3 text-center font-medium">{t("monitor.column")}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sorted.map((it) => {
                  const score = it.scores ? totalScore(it.scores) : undefined;
                  const change = changes[it.domain];
                  return (
                    <tr key={it.domain} className={rowHighlight(change)}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-mono text-[15px] font-semibold", change === "becameTaken" && "text-taken line-through")}>
                            {it.label}
                            <span className="text-txt2">.{it.tld}</span>
                          </span>
                          {checkingDomains.has(it.domain) && <Loader2 className="h-3.5 w-3.5 animate-spin text-amber2" />}
                          {change && <StatusBadge change={change} t={t} />}
                          {!change && it.status === "taken" && (
                            <span className="shrink-0 rounded bg-taken-dim px-1.5 py-0.5 text-[11px] font-semibold text-taken">{t("status.taken")}</span>
                          )}
                          {it.status === "taken" && it.expiresAt && <ExpiryNote iso={it.expiresAt} className="shrink truncate" />}
                        </div>
                        {it.meaning && <div className="mt-0.5 max-w-xs truncate text-xs text-txt1">{it.meaning}</div>}
                        {noteLine(it)}
                      </td>
                      <td className="px-2 text-center">
                        <span className={cn("tnum rounded-md px-2 py-0.5 font-mono text-xs font-bold", score !== undefined ? scoreBadgeClass(score) : "bg-bg3 text-txt1")}>
                          {score ?? "—"}
                        </span>
                      </td>
                      {BAR_KEYS.map((k) => (
                        <td key={k} className="px-2">
                          {it.scores ? (
                            <>
                              <div className="bar min-w-[40px]">
                                <i style={{ width: `${it.scores[k]}%` }} />
                              </div>
                              <span className="tnum font-mono text-[11px] text-txt2">{it.scores[k]}</span>
                            </>
                          ) : (
                            <span className="text-xs text-txt2">—</span>
                          )}
                        </td>
                      ))}
                      <td title={priceFull(it.tld, lang, prices)} className="tnum px-2 text-right font-mono text-xs text-txt1">{priceShort(it.tld, lang, prices) ?? "—"}</td>
                      <td className="px-2 text-center">
                        {monitorPending === it.domain ? (
                          <Loader2 className="inline h-4 w-4 animate-spin text-brand" />
                        ) : (
                          <Switch
                            title={t("monitor.toggleTitle")}
                            disabled={monitorPending !== null}
                            checked={monitor.isMonitored(it.domain)}
                            onCheckedChange={() => void toggleMonitor(it.domain, it.status)}
                          />
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 text-right">
                        <span className="inline-flex items-center gap-1">
                          <CopyButton domain={it.domain} />
                          <button
                            title={t("common.remove")}
                            className="grid h-8 w-8 place-items-center rounded-md text-txt2 hover:bg-bg3 hover:text-destructive"
                            onClick={() => onRemove(it.domain)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <RegisterMenu domain={it.domain}>
                            <button className="h-8 rounded-md bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-80">{t("common.register")}</button>
                          </RegisterMenu>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 移动端卡片版 */}
          <div className="space-y-3 md:hidden">
            {sorted.map((it) => {
              const score = it.scores ? totalScore(it.scores) : undefined;
              const change = changes[it.domain];
              return (
                <div key={it.domain} className={cn("rounded-xl border border-line bg-bg1 p-4", rowHighlight(change))}>
                  <div className="flex items-center justify-between gap-2">
                    <span title={it.domain} className={cn("min-w-0 truncate font-mono text-[15px] font-semibold", change === "becameTaken" && "text-taken line-through")}>
                      {it.label}
                      <span className="text-txt2">.{it.tld}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {checkingDomains.has(it.domain) && <Loader2 className="h-3.5 w-3.5 animate-spin text-amber2" />}
                      {change && <StatusBadge change={change} t={t} />}
                      {!change && it.status === "taken" && (
                        <span className="shrink-0 rounded bg-taken-dim px-1.5 py-0.5 text-[11px] font-semibold text-taken">{t("status.taken")}</span>
                      )}
                      {score !== undefined && (
                        <span className={cn("tnum shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold", scoreBadgeClass(score))}>{score}</span>
                      )}
                    </span>
                  </div>
                  {it.status === "taken" && it.expiresAt && (
                    <p className="mt-1 flex min-w-0">
                      <ExpiryNote iso={it.expiresAt} className="shrink truncate" />
                    </p>
                  )}
                  {it.meaning && <p className="mt-1 text-xs text-txt1">{it.meaning}</p>}
                  {noteLine(it)}
                  {it.scores && <ScoreBars scores={it.scores} columns={4} className="mt-3" />}
                  <div className="mt-3 flex items-center gap-2">
                    <span title={priceFull(it.tld, lang, prices)} className="tnum flex-1 font-mono text-xs text-txt1">{priceShort(it.tld, lang, prices) ?? ""}</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-txt2" title={t("monitor.toggleTitle")}>
                      {t("monitor.column")}
                      {monitorPending === it.domain ? (
                        <Loader2 className="h-4 w-4 animate-spin text-brand" />
                      ) : (
                        <Switch disabled={monitorPending !== null} checked={monitor.isMonitored(it.domain)} onCheckedChange={() => void toggleMonitor(it.domain, it.status)} />
                      )}
                    </span>
                    <button
                      title={t("common.remove")}
                      className="grid h-11 w-11 place-items-center rounded-md border border-line text-txt2 hover:text-destructive"
                      onClick={() => onRemove(it.domain)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <RegisterMenu domain={it.domain}>
                      <button className="h-11 rounded-md bg-brand px-4 text-xs font-semibold text-brand-ink">{t("common.register")}</button>
                    </RegisterMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
