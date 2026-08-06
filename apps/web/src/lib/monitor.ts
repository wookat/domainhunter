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

export async function fetchMonitorChanges(): Promise<MonitorChange[]> {
  const res = await fetch("/api/monitor/changes");
  if (!res.ok) throw new Error(String(res.status));
  const { changes } = (await res.json()) as { changes: MonitorChange[] };
  return Array.isArray(changes) ? changes : [];
}
