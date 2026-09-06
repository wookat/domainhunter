import { useCallback, useEffect, useState } from "react";

import { parseMonitorDomain, type MonitorAddEntry, type MonitorAddReject, type MonitorAddResponse } from "./monitor-add";

const KEY = "domainhunter:monitor";
const WEBHOOK_KEY = "domainhunter:monitor-webhook";

export interface MonitorChange {
  domain: string;
  from: string;
  to: string;
  at: number;
}

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    // ignore
  }
  return [];
}

const SYNC_EVENT = "domainhunter:monitor-sync";

/** 基于最新存储合并写入，并通知同页其他 useMonitor 实例 */
function mutate(domain: string, enabled: boolean): Set<string> {
  const next = new Set(load());
  if (enabled) next.add(domain);
  else next.delete(domain);
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(SYNC_EVENT));
  return next;
}

export function loadWebhook(): string {
  try {
    return localStorage.getItem(WEBHOOK_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveWebhook(url: string) {
  try {
    if (url) localStorage.setItem(WEBHOOK_KEY, url);
    else localStorage.removeItem(WEBHOOK_KEY);
  } catch {
    // ignore
  }
}

export function isValidWebhook(url: string): boolean {
  if (url.length > 500) return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

/** 本地记录哪些域名开了监控；开关时同步到服务端监控集合 */
export function useMonitor() {
  const [monitored, setMonitored] = useState<Set<string>>(() => new Set(load()));

  useEffect(() => {
    const sync = () => setMonitored(new Set(load()));
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isMonitored = useCallback((domain: string) => monitored.has(domain), [monitored]);

  const toggle = useCallback(async (domain: string, status?: string): Promise<{ ok: boolean; full?: boolean }> => {
    const enabled = !load().includes(domain);
    const res = await fetch("/api/monitor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ domain, enabled, status, webhook: loadWebhook() }),
    }).catch(() => null);
    if (!res) return { ok: false };
    if (res.status === 429) return { ok: false, full: true };
    if (!res.ok) return { ok: false };
    setMonitored(mutate(domain, enabled));
    return { ok: true };
  }, []);

  /** 直接添加监控：核验通过且已注册才写入本地清单 */
  const add = useCallback(async (raw: string): Promise<MonitorAddResult> => {
    const result = await requestMonitorAdd(raw, load(), loadWebhook());
    if (result.kind === "added") setMonitored(mutate(result.entry.domain, true));
    return result;
  }, []);

  /** 保存 webhook 并同步到已监控域名的服务端条目 */
  const setWebhook = useCallback(async (url: string): Promise<boolean> => {
    const trimmed = url.trim();
    if (trimmed !== "" && !isValidWebhook(trimmed)) return false;
    saveWebhook(trimmed);
    await Promise.allSettled(
      [...monitored].map((domain) =>
        fetch("/api/monitor", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ domain, enabled: true, webhook: trimmed }),
        }),
      ),
    );
    return true;
  }, [monitored]);

  return { monitored, isMonitored, toggle, add, setWebhook };
}

export type MonitorAddResult =
  | { kind: "added"; entry: MonitorAddEntry; monitored: number; limit: number }
  | { kind: "available"; entry: MonitorAddEntry; monitored: number; limit: number }
  | { kind: "rejected"; reason: MonitorAddReject; domain: string; tld?: string }
  | { kind: "full"; monitored?: number; limit?: number }
  | { kind: "failed"; error: "network" | "check" };

/**
 * 本地校验（语法 / TLD_LIST / 与本地清单重复）→ POST /api/monitor/add 实时核验一次。
 * taken/unknown → added（调用方负责写本地清单）；available → 不入清单，由 UI 提示去注册。
 */
export async function requestMonitorAdd(
  raw: string,
  monitored: Iterable<string>,
  webhook: string,
  fetchImpl: typeof fetch = fetch,
): Promise<MonitorAddResult> {
  const parsed = parseMonitorDomain(raw, monitored);
  if (!parsed.ok) return { kind: "rejected", reason: parsed.reason, domain: parsed.domain, tld: parsed.tld };
  const res = await fetchImpl("/api/monitor/add", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ domain: parsed.domain, webhook }),
  }).catch(() => null);
  if (!res) return { kind: "failed", error: "network" };
  const data = (await res.json().catch(() => null)) as MonitorAddResponse | null;
  if (!data || !data.ok) {
    if (res.status === 429) return { kind: "full", monitored: data?.monitored, limit: data?.limit };
    if (data?.error === "unsupported_tld") return { kind: "rejected", reason: "tld", domain: parsed.domain, tld: data.tld };
    if (data?.error === "invalid_domain") return { kind: "rejected", reason: "syntax", domain: parsed.domain };
    return { kind: "failed", error: data?.error === "check_failed" ? "check" : "network" };
  }
  if (!data.added) return { kind: "available", entry: data.entry, monitored: data.monitored, limit: data.limit };
  return { kind: "added", entry: data.entry, monitored: data.monitored, limit: data.limit };
}

export interface MonitorListEntry {
  domain: string;
  status: string;
  lastChecked: number;
  expiresAt?: string;
}

export interface MonitorList {
  entries: MonitorListEntry[];
  monitored: number;
  limit: number;
}

/** 按本地清单批量查服务端监控条目 + 全局名额占用 */
export async function fetchMonitorList(domains: string[]): Promise<MonitorList> {
  const res = await fetch("/api/monitor/list", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ domains }),
  });
  if (!res.ok) throw new Error(String(res.status));
  const data = (await res.json()) as MonitorList;
  return {
    entries: Array.isArray(data.entries) ? data.entries : [],
    monitored: typeof data.monitored === "number" ? data.monitored : 0,
    limit: typeof data.limit === "number" ? data.limit : 0,
  };
}

/** 手动刷新：对本地清单中的监控域立即执行一次真实核验；限频时抛 RecheckRateLimitError */
export class RecheckRateLimitError extends Error {
  retryAfter: number;
  constructor(retryAfter: number) {
    super("rate_limited");
    this.retryAfter = retryAfter;
  }
}

export async function recheckMonitors(domains: string[]): Promise<MonitorList> {
  const res = await fetch("/api/monitor/recheck", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ domains }),
  });
  if (res.status === 429) {
    let retryAfter = Number(res.headers.get("Retry-After") ?? "0");
    if (!Number.isFinite(retryAfter) || retryAfter <= 0) {
      const data = (await res.json().catch(() => null)) as { retryAfter?: number } | null;
      retryAfter = typeof data?.retryAfter === "number" ? data.retryAfter : 60;
    }
    throw new RecheckRateLimitError(retryAfter);
  }
  if (!res.ok) throw new Error(String(res.status));
  const data = (await res.json()) as MonitorList;
  return {
    entries: Array.isArray(data.entries) ? data.entries : [],
    monitored: typeof data.monitored === "number" ? data.monitored : 0,
    limit: typeof data.limit === "number" ? data.limit : 0,
  };
}

export async function fetchMonitorChanges(): Promise<MonitorChange[]> {
  const res = await fetch("/api/monitor/changes");
  if (!res.ok) throw new Error(String(res.status));
  const { changes } = (await res.json()) as { changes: MonitorChange[] };
  return Array.isArray(changes) ? changes : [];
}
