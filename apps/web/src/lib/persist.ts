import type { HomeValues } from "@/components/home-page";
import type { Row, RoundInfo, Understanding } from "@/types";

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
}

const KEY = "dh:lastSearch:v1";

export function saveSearch(s: SavedSearch): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...s, rows: s.rows.filter((r) => r.status !== "checking") }));
  } catch {
    /* 存储满/隐私模式，忽略 */
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
