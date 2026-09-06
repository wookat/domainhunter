import { useCallback, useEffect, useState } from "react";

import { parseMonitorDomain, type MonitorAddEntry, type MonitorAddReject, type MonitorAddResponse } from "./monitor-add";

const KEY = "domainhunter:monitor";
const WEBHOOK_KEY = "domainhunter:monitor-webhook";
/** 与 worker `sanitizeWebhook` 同值 */
export const WEBHOOK_MAX_LENGTH = 500;

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
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function isValidWebhook(url: string): boolean {
  if (url.length > WEBHOOK_MAX_LENGTH) return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export type WebhookInvalidReason = "scheme" | "length" | "syntax";

/** 给出不合法原因（文案按原因分流）；合法返回 null */
export function webhookInvalidReason(url: string): WebhookInvalidReason | null {
  if (url.length > WEBHOOK_MAX_LENGTH) return "length";
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "syntax";
  }
  return parsed.protocol === "https:" ? null : "scheme";
}

/**
 * 已配置 webhook 的脱敏展示：飞书/钉钉/Slack 的 webhook 路径本身就是凭证，页面只露出 host 与末 4 位，
 * 例：`https://open.feishu.cn/open-apis/bot/v2/hook/abcd-…-9f3e` → `https://open.feishu.cn/…9f3e`。
 * 路径短于 8 字符时没有可隐藏的部分，原样返回；无法解析的字符串按纯文本掐头去尾。
 */
export function maskWebhook(url: string): string {
  const TAIL = 4;
  try {
    const u = new URL(url);
    const rest = url.slice(u.origin.length);
    if (rest.length <= TAIL * 2) return url;
    return `${u.origin}/…${rest.slice(-TAIL)}`;
  } catch {
    return url.length <= TAIL * 2 ? url : `${url.slice(0, TAIL)}…${url.slice(-TAIL)}`;
  }
}

export type WebhookTestResult =
  | { kind: "delivered"; status: number }
  | { kind: "rejected"; status: number }
  | { kind: "unreachable" }
  | { kind: "invalid" }
  | { kind: "rateLimited"; retryAfter: number }
  | { kind: "failed" };

/** 「发送测试」：让 worker 向该地址 POST 一条 event=test 的通知（与真实掉落通知同字段），回传对方 HTTP 状态 */
export async function sendWebhookTest(url: string, fetchImpl: typeof fetch = fetch): Promise<WebhookTestResult> {
  const trimmed = url.trim();
  if (!isValidWebhook(trimmed)) return { kind: "invalid" };
  const res = await fetchImpl("/api/monitor/webhook-test", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ webhook: trimmed }),
  }).catch(() => null);
  if (!res) return { kind: "failed" };
  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; delivered?: boolean; status?: number; retryAfter?: number } | null;
  if (res.status === 429) {
    const header = Number(res.headers.get("Retry-After") ?? "0");
    const retryAfter = Number.isFinite(header) && header > 0 ? header : typeof data?.retryAfter === "number" ? data.retryAfter : 60;
    return { kind: "rateLimited", retryAfter };
  }
  if (res.status === 400) return { kind: "invalid" };
  if (res.status === 502 && data?.error === "unreachable") return { kind: "unreachable" };
  if (!res.ok || !data?.ok || typeof data.status !== "number") return { kind: "failed" };
  return data.delivered ? { kind: "delivered", status: data.status } : { kind: "rejected", status: data.status };
}

/** 本地记录哪些域名开了监控；开关时同步到服务端监控集合 */
export function useMonitor() {
  const [monitored, setMonitored] = useState<Set<string>>(() => new Set(load()));
  const [webhook, setWebhookState] = useState<string>(() => loadWebhook());

  useEffect(() => {
    const sync = () => {
      setMonitored(new Set(load()));
      setWebhookState(loadWebhook());
    };
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

  /** 保存 webhook（空串 = 清除）并同步到已监控域名的服务端条目 */
  const setWebhook = useCallback(async (url: string): Promise<boolean> => {
    const trimmed = url.trim();
    if (trimmed !== "" && !isValidWebhook(trimmed)) return false;
    saveWebhook(trimmed);
    setWebhookState(trimmed);
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

  return { monitored, isMonitored, toggle, add, webhook, setWebhook };
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
