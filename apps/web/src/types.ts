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
  /** 到期时间（ISO 字符串），仅 taken 且数据可得时存在 */
  expiresAt?: string;
}

export interface RoundInfo {
  round: number;
  /** i18n key（存 key 而非成品字符串，切语言时可重译） */
  noteKey: "agent.note.first" | "agent.note.more";
  proposed: number;
  checked: number;
  available: number;
  /** 本轮各防线丢弃的低质候选数合计（R238，旧快照无此字段） */
  filtered?: number;
}

/** AI 上游错误类别（R264）：quota 类重试无效，其余可重试 */
export type AiErrorKind = "quota" | "rate-limit" | "upstream" | "network" | "unknown";

/** 防线统计元数据（R238）：各防线丢弃计数 + 补发/重试触发，只计数不含候选内容 */
export interface GuardMeta {
  dropped: Record<string, number>;
  wordSupplement: boolean;
  /** 补发轮发起次数（R243，旧快照无此字段） */
  supplementAttempts?: number;
  /** 补发轮各防线丢弃计数（R243，与主轮 dropped 分开，旧快照无此字段） */
  supplementDropped?: Record<string, number>;
  retries: number;
}

export interface StreamEvent {
  type?: "round" | "proposed" | "done" | "error" | "understanding" | "hint";
  /** hint 事件的类型（R247，目前仅 lowYield：连续低产出建议拓宽后缀/命名路线） */
  kind?: "lowYield";
  round?: number;
  note?: string;
  items?: { label: string; meaning: string; theme?: Theme; scores?: Scores }[];
  tlds?: string[];
  availableCount?: number;
  target?: number;
  reachedTarget?: boolean;
  detail?: string;
  /** error 事件的上游错误类别（R264，旧事件无此字段） */
  errorKind?: AiErrorKind;
  domain?: string;
  status?: Status;
  meaning?: string;
  theme?: Theme;
  cached?: boolean;
  expiresAt?: string;
  core?: string;
  style?: string;
  scene?: string;
  guard?: GuardMeta;
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
  blog: { first: 20, renew: 155 },
  team: { first: 35, renew: 212 },
  chat: { first: 40, renew: 265 },
  finance: { first: 48, renew: 375 },
  global: { first: 225, renew: 560 },
  host: { first: 35, renew: 590 },
  social: { first: 48, renew: 240 },
  video: { first: 60, renew: 210 },
  fund: { first: 63, renew: 410 },
  land: { first: 63, renew: 240 },
  click: { first: 11, renew: 78 },
  icu: { first: 18, renew: 115 },
  page: { first: 78, renew: 78 },
  bio: { first: 41, renew: 419 },
  ink: { first: 15, renew: 189 },
  moe: { first: 94, renew: 94 },
  lol: { first: 11, renew: 189 },
  uk: { first: 41, renew: 41 },
  fm: { first: 632, renew: 632 },
  one: { first: 48, renew: 145 },
  cool: { first: 41, renew: 263 },
  red: { first: 59, renew: 137 },
  today: { first: 19, renew: 167 },
  best: { first: 12, renew: 135 },
  wtf: { first: 19, renew: 211 },
  pizza: { first: 78, renew: 374 },
  bar: { first: 19, renew: 374 },
  cafe: { first: 33, renew: 300 },
  money: { first: 78, renew: 204 },
  gold: { first: 41, renew: 598 },
  band: { first: 115, renew: 182 },
  cash: { first: 70, renew: 226 },
  city: { first: 33, renew: 167 },
  estate: { first: 59, renew: 226 },
  expert: { first: 48, renew: 360 },
  farm: { first: 56, renew: 226 },
  blue: { first: 94, renew: 145 },
  pink: { first: 59, renew: 152 },
  black: { first: 115, renew: 374 },
  ninja: { first: 41, renew: 182 },
  rocks: { first: 26, renew: 130 },
  pet: { first: 78, renew: 152 },
  academy: { first: 85, renew: 271 },
  school: { first: 41, renew: 211 },
  coach: { first: 78, renew: 449 },
  care: { first: 85, renew: 256 },
  doctor: { first: 59, renew: 671 },
  restaurant: { first: 94, renew: 374 },
  boutique: { first: 19, renew: 189 },
  clinic: { first: 78, renew: 374 },
  dental: { first: 449, renew: 449 },
  fitness: { first: 41, renew: 241 },
  photos: { first: 59, renew: 174 },
  gallery: { first: 167, renew: 167 },
  salon: { first: 78, renew: 330 },
  yoga: { first: 189, renew: 189 },
  coffee: { first: 78, renew: 248 },
  wine: { first: 41, renew: 346 },
  kitchen: { first: 59, renew: 374 },
  garden: { first: 11, renew: 189 },
  photography: { first: 41, renew: 211 },
  events: { first: 70, renew: 263 },
  solutions: { first: 26, renew: 182 },
  services: { first: 63, renew: 226 },
  consulting: { first: 152, renew: 315 },
  software: { first: 115, renew: 241 },
  marketing: { first: 41, renew: 241 },
  systems: { first: 85, renew: 204 },
  ventures: { first: 41, renew: 346 },
  capital: { first: 41, renew: 412 },
  guru: { first: 19, renew: 248 },
  tips: { first: 59, renew: 182 },
  directory: { first: 33, renew: 159 },
  exchange: { first: 44, renew: 226 },
  institute: { first: 56, renew: 159 },
  international: { first: 59, renew: 182 },
  partners: { first: 56, renew: 412 },
  support: { first: 48, renew: 159 },
  plus: { first: 70, renew: 315 },
  house: { first: 107, renew: 256 },
  market: { first: 256, renew: 256 },
  watch: { first: 22, renew: 256 },
  style: { first: 52, renew: 226 },
  show: { first: 59, renew: 256 },
  website: { first: 14, renew: 152 },
  technology: { first: 70, renew: 167 },
  community: { first: 59, renew: 263 },
  education: { first: 152, renew: 204 },
  training: { first: 85, renew: 241 },
  love: { first: 63, renew: 167 },
  beauty: { first: 11, renew: 94 },
  fashion: { first: 189, renew: 189 },
  work: { first: 15, renew: 78 },
  sale: { first: 26, renew: 226 },
  help: { first: 11, renew: 189 },
  wedding: { first: 189, renew: 189 },
  law: { first: 598, renew: 598 },
  tax: { first: 59, renew: 389 },
  menu: { first: 194, renew: 194 },
  bike: { first: 59, renew: 226 },
  toys: { first: 78, renew: 374 },
  shoes: { first: 152, renew: 374 },
  travel: { first: 115, renew: 857 },
  tours: { first: 41, renew: 360 },
  vacations: { first: 41, renew: 226 },
  holiday: { first: 41, renew: 374 },
  flights: { first: 226, renew: 337 },
  taxi: { first: 45, renew: 360 },
  properties: { first: 44, renew: 226 },
  rentals: { first: 48, renew: 256 },
  apartments: { first: 78, renew: 330 },
  builders: { first: 33, renew: 204 },
  construction: { first: 63, renew: 226 },
  repair: { first: 56, renew: 211 },
  energy: { first: 85, renew: 671 },
  solar: { first: 41, renew: 374 },
  green: { first: 48, renew: 463 },
  eco: { first: 430, renew: 430 },
  earth: { first: 115, renew: 115 },
  engineering: { first: 48, renew: 374 },
  family: { first: 41, renew: 226 },
  baby: { first: 11, renew: 374 },
  mom: { first: 11, renew: 189 },
  dad: { first: 78, renew: 78 },
  dog: { first: 26, renew: 374 },
  gifts: { first: 59, renew: 211 },
  photo: { first: 189, renew: 189 },
  health: { first: 78, renew: 449 },
  fit: { first: 15, renew: 189 },
  dance: { first: 70, renew: 159 },
  guide: { first: 44, renew: 241 },
  reviews: { first: 33, renew: 360 },
  golf: { first: 33, renew: 374 },
  tennis: { first: 374, renew: 374 },
  soccer: { first: 78, renew: 152 },
  football: { first: 78, renew: 152 },
  hockey: { first: 59, renew: 345 },
  surf: { first: 11, renew: 189 },
  ltd: { first: 41, renew: 182 },
  biz: { first: 48, renew: 137 },
  llc: { first: 78, renew: 248 },
  fyi: { first: 41, renew: 41 },
  promo: { first: 78, renew: 145 },
  express: { first: 67, renew: 226 },
  press: { first: 33, renew: 463 },
  stream: { first: 33, renew: 41 },
  movie: { first: 263, renew: 2006 },
  pictures: { first: 59, renew: 93 },
  productions: { first: 59, renew: 234 },
  audio: { first: 745, renew: 745 },
  credit: { first: 48, renew: 597 },
  loans: { first: 78, renew: 671 },
  investments: { first: 59, renew: 745 },
  holdings: { first: 374, renew: 374 },
  mortgage: { first: 59, renew: 360 },
  computer: { first: 130, renew: 226 },
  vet: { first: 241, renew: 241 },
  lawyer: { first: 360, renew: 360 },
  legal: { first: 41, renew: 412 },
  delivery: { first: 37, renew: 360 },
  recipes: { first: 48, renew: 449 },
  rent: { first: 74, renew: 374 },
  church: { first: 48, renew: 337 },
  jewelry: { first: 78, renew: 374 },
  cleaning: { first: 434, renew: 434 },
  plumbing: { first: 59, renew: 419 },
  catering: { first: 226, renew: 226 },
  florist: { first: 59, renew: 189 },
  courses: { first: 11, renew: 226 },
  degree: { first: 59, renew: 300 },
  mba: { first: 78, renew: 226 },
  study: { first: 11, renew: 226 },
  forum: { first: 11, renew: 226 },
  review: { first: 78, renew: 78 },
  hair: { first: 11, renew: 93 },
  skin: { first: 11, renew: 93 },
  makeup: { first: 11, renew: 93 },
  homes: { first: 11, renew: 93 },
  boats: { first: 11, renew: 93 },
  autos: { first: 11, renew: 93 },
  careers: { first: 115, renew: 412 },
  management: { first: 59, renew: 152 },
  contractors: { first: 41, renew: 204 },
  equipment: { first: 78, renew: 167 },
  supply: { first: 152, renew: 152 },
  parts: { first: 63, renew: 241 },
  auction: { first: 78, renew: 204 },
  deals: { first: 63, renew: 204 },
  coupons: { first: 78, renew: 366 },
  discount: { first: 63, renew: 204 },
  furniture: { first: 88, renew: 700 },
  lighting: { first: 41, renew: 143 },
  business: { first: 19, renew: 115 },
  limited: { first: 59, renew: 211 },
  associates: { first: 85, renew: 226 },
  cheap: { first: 41, renew: 211 },
  bargains: { first: 85, renew: 174 },
  supplies: { first: 145, renew: 145 },
};

export function tldPrice(tld: string): TldPrice | undefined {
  return TLD_PRICES[tld];
}

