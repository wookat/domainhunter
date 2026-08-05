export type Status = "available" | "taken" | "unknown" | "checking";

export interface Scores {
  length: number;
  readability: number;
  relevance: number;
  brandability: number;
}

export interface Row {
  domain: string;
  label: string;
  tld: string;
  status: Status;
  meaning?: string;
  scores?: Scores;
  round: number;
}

export interface RoundInfo {
  round: number;
  note: string;
  proposed: number;
  checked: number;
  available: number;
}

export interface StreamEvent {
  type?: "round" | "proposed" | "done" | "error";
  round?: number;
  note?: string;
  items?: { label: string; meaning: string; scores?: Scores }[];
  tlds?: string[];
  availableCount?: number;
  target?: number;
  reachedTarget?: boolean;
  detail?: string;
  domain?: string;
  status?: Status;
  meaning?: string;
}

export const STATUS_LABEL: Record<Status, string> = {
  available: "可注册",
  taken: "已注册",
  unknown: "未知",
  checking: "检测中",
};

export function totalScore(s: Scores): number {
  return Math.round((s.length + s.readability + s.relevance + s.brandability) / 4);
}

export function scoreColor(score: number): { text: string; stroke: string } {
  if (score >= 85) return { text: "text-emerald-700", stroke: "#059669" };
  if (score >= 70) return { text: "text-lime-700", stroke: "#65a30d" };
  if (score >= 55) return { text: "text-amber-600", stroke: "#d97706" };
  return { text: "text-zinc-400", stroke: "#a1a1aa" };
}
