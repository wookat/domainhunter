import { useCallback, useEffect, useState } from "react";

import type { Row } from "@/types";

const KEY = "domainhunter:shortlist";
const LEGACY_KEY = "domainhunter:favorites";

export interface ShortlistItem {
  domain: string;
  label: string;
  tld: string;
  meaning?: string;
  scores?: Row["scores"];
  addedAt: number;
}

function rowToItem(row: Row): ShortlistItem {
  return { domain: row.domain, label: row.label, tld: row.tld, meaning: row.meaning, scores: row.scores, addedAt: Date.now() };
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

export function useShortlist() {
  const [items, setItems] = useState<ShortlistItem[]>(load);

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

  return { items, has, toggle, remove, clear };
}
