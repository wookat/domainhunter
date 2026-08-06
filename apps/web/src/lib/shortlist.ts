import { useCallback, useEffect, useState } from "react";

import type { Row, Status } from "@/types";

const KEY = "domainhunter:shortlist";
const LEGACY_KEY = "domainhunter:favorites";
const CHECKED_AT_KEY = "domainhunter:shortlist:checkedAt";

export interface ShortlistItem {
  domain: string;
  label: string;
  tld: string;
  meaning?: string;
  scores?: Row["scores"];
  addedAt: number;
  status?: Status;
}

function rowToItem(row: Row): ShortlistItem {
  return { domain: row.domain, label: row.label, tld: row.tld, meaning: row.meaning, scores: row.scores, status: row.status, addedAt: Date.now() };
}

function load(): ShortlistItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ShortlistItem[];
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const domains = JSON.parse(legacy) as string[];
      return domains.map((domain) => {
        const dot = domain.indexOf(".");
        return { domain, label: domain.slice(0, dot), tld: domain.slice(dot + 1), addedAt: Date.now() };
      });
    }
  } catch {
    // ignore
  }
  return [];
}

function loadCheckedAt(): number | null {
  try {
    const raw = localStorage.getItem(CHECKED_AT_KEY);
    if (raw) return Number(raw) || null;
  } catch {
    // ignore
  }
  return null;
}

export function useShortlist() {
  const [items, setItems] = useState<ShortlistItem[]>(load);
  const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(loadCheckedAt);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const has = useCallback((domain: string) => items.some((i) => i.domain === domain), [items]);

  const toggle = useCallback((row: Row) => {
    setItems((prev) =>
      prev.some((i) => i.domain === row.domain) ? prev.filter((i) => i.domain !== row.domain) : [...prev, rowToItem(row)],
    );
  }, []);

  const remove = useCallback((domain: string) => {
    setItems((prev) => prev.filter((i) => i.domain !== domain));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  /** 同步码导入：按域名去重合并 */
  const merge = useCallback((incoming: Omit<ShortlistItem, "addedAt">[]) => {
    setItems((prev) => {
      const seen = new Set(prev.map((i) => i.domain));
      const fresh = incoming.filter((i) => !seen.has(i.domain)).map((i) => ({ ...i, addedAt: Date.now() }));
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });
  }, []);

  /** 重新核验后回写状态与核验时间 */
  const applyStatuses = useCallback((statuses: Record<string, Status>) => {
    setItems((prev) => prev.map((i) => (statuses[i.domain] ? { ...i, status: statuses[i.domain] } : i)));
    const now = Date.now();
    setLastCheckedAt(now);
    try {
      localStorage.setItem(CHECKED_AT_KEY, String(now));
    } catch {
      // ignore
    }
  }, []);

  return { items, has, toggle, remove, clear, merge, lastCheckedAt, applyStatuses };
}
