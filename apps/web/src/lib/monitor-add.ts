// 相对路径：本模块同时被 worker（wrangler 打包，不配 @ 别名）与 SPA 引用
import { TLD_LIST } from "../content/tld-list";

/** 单个标签：字母数字开头，不以连字符结尾，1–63 字符 */
const LABEL_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

const TLD_SET: ReadonlySet<string> = new Set(TLD_LIST);

export type MonitorAddReject = "empty" | "syntax" | "tld" | "duplicate";

export type MonitorAddParse =
  | { ok: true; domain: string; label: string; tld: string }
  | { ok: false; reason: MonitorAddReject; domain: string; tld?: string };

/**
 * 直接添加监控的输入归一：去空白、小写、剥掉粘贴进来的 scheme / `www.` / 路径 / 末尾点。
 * 只做无损归一，不猜测用户意图（如不给纯 label 自动补 .com）。
 */
export function normalizeMonitorInput(raw: string): string {
  let s = raw.trim().toLowerCase();
  s = s.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  s = s.replace(/[/?#].*$/, "");
  s = s.replace(/^www\./, "");
  s = s.replace(/\.+$/, "");
  return s;
}

/**
 * 校验「直接添加监控」输入：只接受合法的 `label.tld`，TLD 须在站内 TLD_LIST 内，且不与已监控清单重复。
 * 多级后缀（如 `foo.com.cn`）当前 TLD_LIST 未收录 → 按 `tld` 拒绝并回传后缀供文案展示。
 */
export function parseMonitorDomain(raw: string, monitored: Iterable<string> = []): MonitorAddParse {
  const domain = normalizeMonitorInput(raw);
  if (domain === "") return { ok: false, reason: "empty", domain };
  const dot = domain.indexOf(".");
  if (dot <= 0 || dot === domain.length - 1) return { ok: false, reason: "syntax", domain };
  const label = domain.slice(0, dot);
  const tld = domain.slice(dot + 1);
  if (!LABEL_RE.test(label) || domain.length > 253) return { ok: false, reason: "syntax", domain };
  if (!tld.split(".").every((part) => LABEL_RE.test(part))) return { ok: false, reason: "syntax", domain };
  if (!TLD_SET.has(tld)) return { ok: false, reason: "tld", domain, tld };
  for (const d of monitored) if (d === domain) return { ok: false, reason: "duplicate", domain };
  return { ok: true, domain, label, tld };
}

export type MonitorAddStatus = "available" | "taken" | "unknown";

export interface MonitorAddEntry {
  domain: string;
  status: MonitorAddStatus;
  lastChecked: number;
  expiresAt?: string;
}

/** POST /api/monitor/add 的响应：`added=false` 只在域名当前可注册时出现（不进监控，提示直接去注册） */
export type MonitorAddResponse =
  | { ok: true; added: true; entry: MonitorAddEntry; monitored: number; limit: number }
  | { ok: true; added: false; entry: MonitorAddEntry; monitored: number; limit: number }
  | { ok: false; error: "invalid_domain" | "unsupported_tld" | "monitor_full" | "monitor_unavailable" | "check_failed"; tld?: string; monitored?: number; limit?: number };
