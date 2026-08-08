export type Status = "available" | "taken" | "unknown" | "checking";

export interface Scores {
  length: number;
  readability: number;
  relevance: number;
  brandability: number;
}

export type Theme = "pinyin" | "word" | "coined" | "blend";

export interface Row {
  domain: string;
  label: string;
  tld: string;
  status: Status;
  meaning?: string;
  theme?: Theme;
  scores?: Scores;
  round: number;
}

export interface RoundInfo {
  round: number;
  /** i18n key（存 key 而非成品字符串，切语言时可重译） */
  noteKey: "agent.note.first" | "agent.note.more";
  proposed: number;
  checked: number;
  available: number;
}

export interface StreamEvent {
  type?: "round" | "proposed" | "done" | "error" | "understanding";
  round?: number;
  note?: string;
  items?: { label: string; meaning: string; theme?: Theme; scores?: Scores }[];
  tlds?: string[];
  availableCount?: number;
  target?: number;
  reachedTarget?: boolean;
  detail?: string;
  domain?: string;
  status?: Status;
  meaning?: string;
  theme?: Theme;
  cached?: boolean;
  core?: string;
  style?: string;
  scene?: string;
}

export interface Understanding {
  core: string;
  style: string;
  scene: string;
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

/** 主流 TLD 首年/续费参考价（人民币，参考阿里云 / Porkbun 公开价，仅作参考展示） */
export interface TldPrice {
  first: number;
  renew: number;
}

const TLD_PRICES: Record<string, TldPrice> = {
  com: { first: 69, renew: 85 },
  net: { first: 79, renew: 99 },
  org: { first: 79, renew: 99 },
  info: { first: 28, renew: 130 },
  io: { first: 259, renew: 419 },
  ai: { first: 499, renew: 620 },
  cn: { first: 29, renew: 39 },
  cc: { first: 38, renew: 58 },
  tv: { first: 199, renew: 268 },
  app: { first: 99, renew: 118 },
  dev: { first: 88, renew: 108 },
  xyz: { first: 8, renew: 79 },
  co: { first: 65, renew: 199 },
  me: { first: 120, renew: 150 },
  tech: { first: 45, renew: 360 },
  online: { first: 15, renew: 260 },
  store: { first: 15, renew: 380 },
  site: { first: 10, renew: 220 },
  top: { first: 12, renew: 28 },
  shop: { first: 12, renew: 260 },
  cloud: { first: 60, renew: 160 },
  pro: { first: 25, renew: 130 },
  vip: { first: 40, renew: 60 },
  club: { first: 40, renew: 120 },
  link: { first: 70, renew: 80 },
  live: { first: 20, renew: 180 },
  space: { first: 12, renew: 170 },
  fun: { first: 10, renew: 150 },
  art: { first: 90, renew: 110 },
  design: { first: 280, renew: 380 },
  studio: { first: 80, renew: 220 },
  sh: { first: 320, renew: 380 },
  gg: { first: 480, renew: 520 },
  so: { first: 480, renew: 520 },
  us: { first: 45, renew: 80 },
  in: { first: 60, renew: 75 },
  world: { first: 25, renew: 220 },
  life: { first: 20, renew: 220 },
  agency: { first: 18, renew: 170 },
  games: { first: 130, renew: 170 },
  email: { first: 30, renew: 180 },
  network: { first: 20, renew: 160 },
  digital: { first: 25, renew: 260 },
  media: { first: 90, renew: 280 },
  group: { first: 45, renew: 130 },
  center: { first: 20, renew: 160 },
  works: { first: 25, renew: 240 },
  zone: { first: 25, renew: 240 },
  news: { first: 70, renew: 190 },
  tools: { first: 70, renew: 210 },
  run: { first: 30, renew: 160 },
  codes: { first: 35, renew: 410 },
  company: { first: 20, renew: 125 },
  wiki: { first: 15, renew: 190 },
};

export function tldPrice(tld: string): TldPrice | undefined {
  return TLD_PRICES[tld];
}

