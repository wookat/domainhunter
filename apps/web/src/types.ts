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

/** 评分色阶（design-spec §2）：≥90 金 / 70–89 绿 / <70 灰 */
export function scoreBadgeClass(score: number): string {
  if (score >= 90) return "bg-gold-dim text-gold";
  if (score >= 70) return "bg-brand-dim text-brand";
  return "bg-bg3 text-txt1";
}

/** 参考首年价（按 TLD 的市场常见价，仅作参考展示） */
const TLD_PRICES: Record<string, string> = {
  com: "$9.9 首年",
  cn: "¥29 首年",
  net: "$12/年",
  org: "$11/年",
  io: "$32/年",
  ai: "$72/年",
  app: "$14/年",
  dev: "$12/年",
  co: "$25/年",
  me: "$19/年",
  xyz: "$2 首年",
};

export function tldPrice(tld: string): string | undefined {
  return TLD_PRICES[tld];
}
