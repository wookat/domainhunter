import type { HomeValues } from "@/components/home-page";
import type { FallbackReason, Row, RoundInfo, Understanding } from "@/types";

/** R471：本次结果为规则降级候选（AI 不可用）；随快照恢复，刷新后横幅不丢 */
export interface SavedFallback {
  reason: FallbackReason;
  count: number;
  /** 熔断预计解除时刻（ms 时间戳），仅配额类降级有；恢复快照时若已过期则不再提示 */
  retryAt?: number;
}

/** 结果页状态持久化（sessionStorage，按标签页隔离）：跳转 /tld、刷新或后退后可恢复，不用重新消耗一次搜索 */
export interface SavedSearch {
  values: HomeValues;
  rows: Row[];
  rounds: RoundInfo[];
  elapsedSec?: number;
  aiUnderstanding: Understanding | null;
  refinements: string[];
  triedLabels: string[];
  locked: string[];
  /** 旧快照无此字段 → 视为非降级结果 */
  fallback?: SavedFallback | null;
}

const KEY = "dh:lastSearch:v1";

export function saveSearch(s: SavedSearch): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...s, rows: s.rows.filter((r) => r.status !== "checking") }));
  } catch {
    /* 存储满/隐私模式，忽略 */
  }
}

/** 本标签页是否已有搜索结果（用于判定老用户，不解析完整数据） */
export function hasSavedSearch(): boolean {
  try {
    return sessionStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

export function loadSearch(): SavedSearch | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as SavedSearch;
    if (!Array.isArray(s.rows) || s.rows.length === 0 || !s.values?.description) return null;
    return s;
  } catch {
    return null;
  }
}

/** AI 上游配额耗尽标记（sessionStorage，按标签页隔离）：最近一次 AI 搜索撞上 quota 错误时置位，
 * 首页据此展示非阻断的「AI 暂不可用」横幅；下次 AI 成功产出候选时清除。 */
const AI_QUOTA_DOWN_KEY = "dh:aiQuotaDown:v1";

export function markAiQuotaDown(): void {
  try {
    sessionStorage.setItem(AI_QUOTA_DOWN_KEY, String(Date.now()));
  } catch {
    /* 存储满/隐私模式，忽略 */
  }
}

export function clearAiQuotaDown(): void {
  try {
    sessionStorage.removeItem(AI_QUOTA_DOWN_KEY);
  } catch {
    /* 忽略 */
  }
}

export function isAiQuotaDown(): boolean {
  try {
    return sessionStorage.getItem(AI_QUOTA_DOWN_KEY) !== null;
  } catch {
    return false;
  }
}
