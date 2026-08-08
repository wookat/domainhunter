import { useCallback, useState } from "react";

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

function save(domains: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(domains));
  } catch {
    // ignore
  }
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

  const isMonitored = useCallback((domain: string) => monitored.has(domain), [monitored]);

  const toggle = useCallback(async (domain: string, status?: string): Promise<{ ok: boolean; full?: boolean }> => {
    const enabled = !monitored.has(domain);
    const res = await fetch("/api/monitor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ domain, enabled, status, webhook: loadWebhook() }),
    }).catch(() => null);
    if (!res) return { ok: false };
    if (res.status === 429) return { ok: false, full: true };
    if (!res.ok) return { ok: false };
    setMonitored((prev) => {
      const next = new Set(prev);
      if (enabled) next.add(domain);
      else next.delete(domain);
      save([...next]);
      return next;
    });
    return { ok: true };
  }, [monitored]);

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

  return { monitored, isMonitored, toggle, setWebhook };
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
