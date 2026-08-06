const KEY = "domainhunter:recent-searches";
const MAX = 5;

export interface RecentSearch {
  description: string;
  tlds: string[];
  style: string;
  lengthPref: string;
  at: number;
}

export function loadRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as RecentSearch[];
    return Array.isArray(list) ? list.filter((x) => typeof x?.description === "string" && Array.isArray(x?.tlds)) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(entry: Omit<RecentSearch, "at">): RecentSearch[] {
  const next = [
    { ...entry, at: Date.now() },
    ...loadRecentSearches().filter((x) => x.description !== entry.description),
  ].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
