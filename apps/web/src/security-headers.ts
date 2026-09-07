// 安全响应头（R533，R484 审计 P3-3）。纯函数，worker.ts 的 HTML 后处理中间件按响应类型调用：
// - text/html 文档：HSTS / nosniff / Referrer-Policy / X-Frame-Options / Permissions-Policy / CSP（Report-Only）+ 内联 <script> 加 per-request nonce
// - 其余响应（/api/*、/mcp JSON、静态资源、sitemap/robots/llms.txt、OG SVG）：只加 nosniff + Referrer-Policy，不碰其他头
// CSP 本轮只 Report-Only；违规上报到 POST /api/csp-report（本文件下半部分），/api/usage 透出计数供下轮决定是否 enforce。
// 取值依据（MDN / OWASP Secure Headers Project）见 docs/security-headers.md。

import type { ShardKv } from "./sharded-counter";

/** 1 年；不加 preload：preload 列表要求对 eTLD+1（zalize.com）整域生效且撤销需数月，超出本站（hunt.zalize.com 子域）职权 */
export const HSTS_VALUE = "max-age=31536000; includeSubDomains";
export const REFERRER_POLICY_VALUE = "strict-origin-when-cross-origin";
export const X_FRAME_OPTIONS_VALUE = "DENY";
/** 站内无相机/麦克风/定位/支付/传感器/USB 使用（grep 无 getUserMedia / geolocation / PaymentRequest / usb） */
export const PERMISSIONS_POLICY_VALUE = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()";

export const CSP_REPORT_PATH = "/api/csp-report";

/** 可选分析 beacon（ANALYTICS_PROVIDER=cloudflare）：脚本源 + 上报源（beacon 向 cloudflareinsights.com/cdn-cgi/rum 发 POST） */
export const CF_BEACON_SCRIPT_ORIGIN = "https://static.cloudflareinsights.com";
export const CF_BEACON_CONNECT_ORIGIN = "https://cloudflareinsights.com";

export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/**
 * CSP（Report-Only）指令，逐条依据见 docs/security-headers.md「CSP 白名单证据表」：
 * - script-src：'self'（Vite 产物 /assets/*.js）+ nonce（index.html 主题/重载脚本、worker 注入的 window.__DH_CONTENT__、可选 beacon 标签均由 addScriptNonce 统一打 nonce）
 * - style-src：'self' 'unsafe-inline' —— index.html 内联 @font-face、worker inlineStylesheet() 内联整份 CSS、React/Radix 运行时 style 属性；
 *   style 属性无法用 nonce 覆盖（只有 'unsafe-hashes'），本轮保留 'unsafe-inline'（不给 style-src 加 nonce，否则 CSP3 浏览器会忽略 'unsafe-inline'）
 * - img-src 'self' data:；font-src 'self'（R133 字体自托管）；connect-src 'self'（前端只 fetch /api/*；Porkbun/RDAP 均为 worker 侧请求）
 * - object-src 'none'；frame-ancestors 'none'（与 X-Frame-Options: DENY 同义；/s/:id 分享页无 iframe 嵌入需求）；base-uri 'self'；form-action 'self'（站内无 <form>）
 * - 上报只用 report-uri（页面即时 POST application/csp-report，Chrome/Firefox/Safari 均支持）；不加 report-to：
 *   Chrome 有 report-to 时会忽略 report-uri 并改走 Reporting API 延迟批量投递，本地实测 Chrome 137 等 130s 未见任何投递，计数会失真
 */
export function buildCspReportOnly(nonce: string, analytics: boolean): string {
  const script = ["'self'", `'nonce-${nonce}'`];
  const connect = ["'self'"];
  if (analytics) {
    script.push(CF_BEACON_SCRIPT_ORIGIN);
    connect.push(CF_BEACON_CONNECT_ORIGIN);
  }
  return [
    "default-src 'self'",
    `script-src ${script.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src ${connect.join(" ")}`,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `report-uri ${CSP_REPORT_PATH}`,
  ].join("; ");
}

/** 所有可执行 <script>（含外链 src）统一加 nonce；application/ld+json 等数据块不受 CSP script-src 约束，跳过；已带 nonce 的不重复 */
export function addScriptNonce(html: string, nonce: string): string {
  return html.replace(/<script\b([^>]*)>/gi, (tag, attrs: string) => {
    if (/\bnonce=/i.test(attrs)) return tag;
    if (/\btype=["']?application\/ld\+json/i.test(attrs)) return tag;
    return `<script nonce="${nonce}"${attrs}>`;
  });
}

/** 非 HTML 响应的基线头（对 /api/*、/mcp、静态资源一律安全；不设置 CORS 相关头，也不覆盖已有值以外的任何头） */
export function applyBaseSecurityHeaders(h: Headers): Headers {
  h.set("x-content-type-options", "nosniff");
  h.set("referrer-policy", REFERRER_POLICY_VALUE);
  return h;
}

export function applyHtmlSecurityHeaders(h: Headers, nonce: string, analytics: boolean): Headers {
  applyBaseSecurityHeaders(h);
  h.set("strict-transport-security", HSTS_VALUE);
  h.set("x-frame-options", X_FRAME_OPTIONS_VALUE);
  h.set("permissions-policy", PERMISSIONS_POLICY_VALUE);
  h.set("content-security-policy-report-only", buildCspReportOnly(nonce, analytics));
  return h;
}

// ---------- CSP 违规上报（POST /api/csp-report） ----------
// 浏览器两种格式：report-uri（application/csp-report，{"csp-report":{violated-directive, blocked-uri,…}}）
// 与 Reporting API（application/reports+json，[{type:"csp-violation", body:{effectiveDirective, blockedURL,…}}]）。
// 只留 directive + blockedUri（去 query/fragment、截断），不存 UA/IP/document-uri/script-sample。

export interface CspViolation {
  directive: string;
  blockedUri: string;
}

export interface CspSample extends CspViolation {
  count: number;
  firstAt: number;
  lastAt: number;
}

export const CSP_SAMPLES_KEY = "csp:samples:v1";
export const CSP_SAMPLES_MAX = 20;
export const CSP_REPORT_MAX_BYTES = 16 * 1024;

const MAX_FIELD = 200;

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function normalizeDirective(v: string): string {
  return v.trim().toLowerCase().slice(0, 64);
}

/** blocked-uri 可能是 URL、"inline" / "eval" / "data" 等关键字或空；URL 只留 origin+path */
function normalizeBlockedUri(v: string): string {
  const s = v.trim();
  if (!s) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      return `${u.origin}${u.pathname}`.slice(0, MAX_FIELD);
    } catch { /* 非法 URL 按普通字符串处理 */ }
  }
  return s.slice(0, MAX_FIELD);
}

function toViolation(directive: string, blocked: string): CspViolation | null {
  const d = normalizeDirective(directive);
  if (!d) return null;
  return { directive: d, blockedUri: normalizeBlockedUri(blocked) };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** 两种格式统一解析；返回空数组 = 无可用记录（非法 JSON / 缺字段） */
export function parseCspReports(payload: unknown): CspViolation[] {
  const out: CspViolation[] = [];
  if (Array.isArray(payload)) {
    for (const item of payload.slice(0, 50)) {
      if (!isObj(item) || item.type !== "csp-violation" || !isObj(item.body)) continue;
      const b = item.body;
      const v = toViolation(str(b.effectiveDirective) || str(b.violatedDirective), str(b.blockedURL));
      if (v) out.push(v);
    }
    return out;
  }
  if (isObj(payload) && isObj(payload["csp-report"])) {
    const r = payload["csp-report"];
    const v = toViolation(str(r["effective-directive"]) || str(r["violated-directive"]), str(r["blocked-uri"]));
    if (v) out.push(v);
  }
  return out;
}

/** 合并进样本表：同 directive+blockedUri 只加计数；新记录最多 CSP_SAMPLES_MAX 条，满了丢弃（只为下轮决策留证据，不追求完整） */
export function mergeCspSamples(existing: readonly CspSample[], incoming: readonly CspViolation[], now: number): { samples: CspSample[]; changed: boolean } {
  const samples = existing.map((s) => ({ ...s }));
  let changed = false;
  for (const v of incoming) {
    const hit = samples.find((s) => s.directive === v.directive && s.blockedUri === v.blockedUri);
    if (hit) {
      hit.count += 1;
      hit.lastAt = now;
      changed = true;
    } else if (samples.length < CSP_SAMPLES_MAX) {
      samples.push({ ...v, count: 1, firstAt: now, lastAt: now });
      changed = true;
    }
  }
  return { samples, changed };
}

export async function readCspSamples(kv: ShardKv): Promise<CspSample[]> {
  try {
    const raw = await kv.get<unknown>(CSP_SAMPLES_KEY, "json");
    if (!Array.isArray(raw)) return [];
    return raw.filter((s): s is CspSample => isObj(s) && typeof s.directive === "string" && typeof s.blockedUri === "string").slice(0, CSP_SAMPLES_MAX);
  } catch {
    return [];
  }
}

/** 非原子读改写：样本表只作证据、允许并发下偶发丢一条；计数走 usage 分片计数器（原子性由 sharded-counter 保证） */
export async function recordCspSamples(kv: ShardKv, incoming: readonly CspViolation[], now = Date.now()): Promise<void> {
  if (incoming.length === 0) return;
  const existing = await readCspSamples(kv);
  const { samples, changed } = mergeCspSamples(existing, incoming, now);
  if (changed) await kv.put(CSP_SAMPLES_KEY, JSON.stringify(samples));
}
