import type { I18nKey } from "@/lib/i18n";

export type CheckStatus = "available" | "taken" | "unknown";

export interface CheckClientResult {
  domain: string;
  status: CheckStatus;
  expiresAt?: string;
  detail?: string;
}

/** unknown 的可读原因枚举，由后端 `detail` 短码归类而来（reserved 是注册局语义，不属于瞬态失败） */
export type UnknownReason =
  | "rate-limited"
  | "recheck-limited"
  | "timeout"
  | "registry-error"
  | "no-rdap"
  | "reserved"
  | "unparsed"
  | "network"
  | "generic";

const RECHECK_URL = "/api/check?refresh=1";
/** 本站 /api/check 自身每 IP 限频（与 AI 猎名共用 20 次/小时桶）命中时写入行 detail 的客户端短码 */
export const RECHECK_LIMITED_DETAIL = "recheck-429";

export class RecheckHttpError extends Error {
  constructor(readonly status: number) {
    super(`recheck-http-${status}`);
  }
}

/** 单行重新核验失败时应写回的 detail：仅本站限频有可读原因，其它失败保留原 detail */
export function recheckFailureDetail(err: unknown, prev?: string): string | undefined {
  return err instanceof RecheckHttpError && err.status === 429 ? RECHECK_LIMITED_DETAIL : prev;
}

export function unknownReason(detail?: string): UnknownReason {
  const d = (detail ?? "").trim();
  if (!d) return "generic";
  if (d === "reserved") return "reserved";
  if (d === "http-429") return "rate-limited";
  if (d === RECHECK_LIMITED_DETAIL) return "recheck-limited";
  if (/^http-\d{3}$/.test(d)) return "registry-error";
  if (d === "retry-exhausted" || /timeout|timed out|abort/i.test(d)) return "timeout";
  if (d === "no-rdap-server") return "no-rdap";
  if (d === "unparsed") return "unparsed";
  if (/fetch failed|network|econn|socket|dns/i.test(d)) return "network";
  return "generic";
}

export function unknownReasonKey(detail?: string): I18nKey {
  return `unknown.reason.${unknownReason(detail)}` as I18nKey;
}

/** 瞬态 unknown 才提供「重新核验」；注册局保留域重查也不会变 */
export function isRetryableUnknown(detail?: string): boolean {
  return unknownReason(detail) !== "reserved";
}

export function parseCheckLine(line: string): CheckClientResult | null {
  if (!line) return null;
  let r: { domain?: unknown; status?: unknown; expiresAt?: unknown; detail?: unknown; type?: unknown };
  try {
    r = JSON.parse(line) as typeof r;
  } catch {
    return null;
  }
  if (r.type || typeof r.domain !== "string") return null;
  if (r.status !== "available" && r.status !== "taken" && r.status !== "unknown") return null;
  return {
    domain: r.domain,
    status: r.status,
    ...(typeof r.expiresAt === "string" ? { expiresAt: r.expiresAt } : {}),
    ...(typeof r.detail === "string" ? { detail: r.detail } : {}),
  };
}

/**
 * 重新核验：单次 `POST /api/check?refresh=1`（穿透缓存），NDJSON 逐行回调。
 * 首页 quick-check、/advanced、结果页、清单页共用同一口径；不触碰 AI 端点。
 */
export async function recheckDomains(
  domains: string[],
  onResult: (r: CheckClientResult) => void,
  opts: { signal?: AbortSignal; fetchFn?: typeof fetch } = {},
): Promise<void> {
  const fetchFn = opts.fetchFn ?? fetch;
  const targets = [...new Set(domains.map((d) => d.trim().toLowerCase()).filter(Boolean))];
  if (targets.length === 0) return;
  const res = await fetchFn(RECHECK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ domains: targets, refresh: true }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) throw new RecheckHttpError(res.status);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop()!;
    for (const line of lines) {
      const r = parseCheckLine(line);
      if (r) onResult(r);
    }
  }
  const tail = parseCheckLine(buf);
  if (tail) onResult(tail);
}
