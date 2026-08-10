import { useEffect, useRef, useState } from "react";
import { ArrowRight, Brain, Check, ChevronDown, Copy, ExternalLink, History, Loader2, Plus, RotateCw, Ruler, SearchCheck, ShieldCheck, Sparkles, Star, Wand2, X, Zap } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExpiryNote, WatchCta } from "@/components/domain-row";
import { addRecentSearch, clearRecentSearches, loadRecentSearches, type RecentSearch } from "@/lib/history";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { hasSavedSearch, isAiQuotaDown } from "@/lib/persist";
import { toUsd, usePrices } from "@/lib/prices";
import { REGISTRARS } from "@/lib/registrars";
import { cn } from "@/lib/utils";
import { VARIANT_PREFIXES, VARIANT_SUFFIXES } from "@/lib/variants";
import { TEMPLATE_LABELS } from "@/content/home-template-labels";
import { TLD_LIST } from "@/content/tld-list";
import { tldPrice, type Row } from "@/types";

const EXAMPLES = ["独立开发者的 AI 周报工具", "宠物营养订阅电商", "极简冥想 App", "跨境 SaaS 数据看板"];
const EXAMPLES_EN = ["AI weekly-report tool for indie devs", "Pet nutrition subscription store", "Minimal meditation app", "Cross-border SaaS dashboard"];
const PRESET_TLDS = ["com", "cn", "io", "ai", "app", "dev"];
const MAX_LEN = 500;
const ONBOARD_KEY = "dh:onboardDismissed:v1";
// 引导关闭后记忆 30 天，过期后再次展示
const ONBOARD_DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// 关闭记忆是否仍然有效：值为关闭时间戳；旧格式（非时间戳）视为刚关闭并升级写入
function onboardDismissActive(): boolean {
  let raw: string | null;
  try {
    raw = localStorage.getItem(ONBOARD_KEY);
  } catch {
    return true;
  }
  if (!raw) return false;
  const ts = Number(raw);
  // 非毫秒时间戳（含旧格式 "1"）视为刚关闭并升级写入
  if (!Number.isFinite(ts) || ts < 1e12) {
    try {
      localStorage.setItem(ONBOARD_KEY, String(Date.now()));
    } catch {
      /* 存储满/隐私模式，忽略 */
    }
    return true;
  }
  if (Date.now() - ts < ONBOARD_DISMISS_TTL_MS) return true;
  try {
    localStorage.removeItem(ONBOARD_KEY);
  } catch {
    /* 忽略 */
  }
  return false;
}
const LABEL_RE = /^[a-z0-9][a-z0-9-]{0,62}$/i;
const EXACT_DOMAIN_RE = /^([a-z0-9][a-z0-9-]{0,62})\.([a-z0-9-]{2,24})$/i;
const MULTI_DOMAIN_RE = /^([a-z0-9][a-z0-9-]{0,62})\.([a-z0-9-]{2,24}(?:\.[a-z0-9-]{2,24})+)$/i;
// 站内核验通道已支持的两级后缀（需同时在 QUICK_MORE_TLDS 与 whois.ts 有对应通道）
const KNOWN_MULTI_TLDS = ["com.cn"];
// 常见可注册 TLD：避免把拼写错误（如 baidu.iox）当作精确域名去核验
const KNOWN_TLDS = new Set([
  "com", "net", "org", "cn", "io", "ai", "app", "dev", "co", "cc", "tv", "xyz", "me", "info", "biz", "top", "vip", "pro", "site",
  "online", "store", "shop", "tech", "cloud", "space", "fun", "art", "design", "studio", "agency", "digital", "live", "life", "world", "today", "media", "center", "works",
  "news", "blog", "wiki", "link", "club", "team", "work", "zone", "run", "games", "game", "gg", "so", "sh", "im", "fm", "am", "to", "ly", "is",
  "us", "uk", "de", "jp", "hk", "tw", "sg", "eu", "in", "ca", "one", "page", "email", "group", "network", "software", "systems", "tools", "chat", "bot", "codes", "company", "finance", "global", "host", "social", "video", "fund", "land", "click", "icu", "bio", "ink", "moe", "lol", "cool", "red", "best", "wtf", "pizza", "bar", "cafe", "money", "gold", "band", "cash", "city", "estate", "expert", "farm", "blue", "pink", "black", "ninja", "rocks", "pet", "academy", "school", "coach", "care", "doctor", "restaurant", "boutique", "clinic", "dental", "fitness", "photos", "gallery", "salon", "yoga", "coffee", "wine", "kitchen", "garden", "photography", "events", "solutions", "services", "consulting", "marketing", "ventures", "capital", "guru", "tips", "directory", "exchange", "institute", "international", "partners", "support", "plus", "house", "market", "watch", "style", "show", "website", "technology", "community", "education", "training", "love", "beauty", "fashion", "work", "sale", "help", "wedding", "law", "tax", "menu", "bike", "toys", "shoes", "travel", "tours", "vacations", "holiday", "flights", "taxi", "properties", "rentals", "apartments", "builders", "construction", "repair", "energy", "solar", "green", "eco", "earth", "engineering", "family", "baby", "mom", "dad", "dog", "gifts", "photo", "health", "fit", "dance", "guide", "reviews", "golf", "tennis", "soccer", "football", "hockey", "surf", "ltd", "llc", "fyi", "promo", "express", "press", "stream", "movie", "pictures", "productions", "audio", "credit", "loans", "investments", "holdings", "mortgage", "computer", "vet", "lawyer", "legal", "delivery", "recipes", "rent", "church", "jewelry", "cleaning", "plumbing", "catering", "florist", "courses", "degree", "mba", "study", "forum", "review", "hair", "skin", "makeup", "homes", "boats", "autos", "careers", "management", "contractors", "equipment", "supply", "parts", "business", "limited", "associates", "cheap", "bargains", "supplies", "camp", "camera", "diamonds", "theater", "accountants", "engineer", "villas", "cruises", "voyage", "limo", "tickets", "flowers", "beer", "pub", "spa", "food", "attorney", "dentist", "clothing", "cooking", "gift", "party", "fishing", "horse", "singles", "dating", "luxury", "organic", "tattoo", "casa", "vodka", "casino", "bet", "poker", "futbol", "moda", "basketball", "rugby", "cricket", "fish", "fan", "win", "wang", "day", "meme", "quest", "kids", "foundation", "bond", "sbs", "cyou", "monster", "pics", "mobi", "asia", "buzz", "fans", "place", "report", "town", "shopping", "graphics", "glass", "vision", "tires", "surgery", "domains", "college", "actor", "immo", "vin", "university",
]);

/** 输入看起来已经是现成名字/域名时，提供免 AI 额度的直接核验 */
function parseQuickCheck(input: string): { label: string; tld?: string } | { unsupportedTld: string } | null {
  const d = input.trim().toLowerCase();
  if (LABEL_RE.test(d)) return { label: d };
  const m = EXACT_DOMAIN_RE.exec(d);
  if (m) return KNOWN_TLDS.has(m[2]) ? { label: m[1], tld: m[2] } : null;
  const mm = MULTI_DOMAIN_RE.exec(d);
  if (mm) return KNOWN_MULTI_TLDS.includes(mm[2]) ? { label: mm[1], tld: mm[2] } : { unsupportedTld: mm[2] };
  return null;
}

// 行业模板：寓意 + 气质 + 场景 三段式描述，点击填入输入框，用户可再编辑；slug 对应 /guide/:slug 与 /?tpl= 预填入口。
// 标签清单（TEMPLATE_LABELS）进主 bundle；模板全文按需动态加载（home-template-texts.ts），空闲时预取保证点击零等待
let templateTextsPromise: Promise<Record<string, { zh: string; en: string }>> | null = null;
function loadTemplateTexts(): Promise<Record<string, { zh: string; en: string }>> {
  templateTextsPromise ??= import("@/content/home-template-texts").then((m) => m.TEMPLATE_TEXTS);
  return templateTextsPromise;
}

/** /?tpl=<slug> 预填行业模板（行业命名指南页 CTA 入口）；slug 对不上忽略 */
async function templateFromQuery(lang: string): Promise<string> {
  const q = new URLSearchParams(window.location.search).get("tpl")?.trim().toLowerCase();
  if (!q || !TEMPLATE_LABELS.some((x) => x.slug === q)) return "";
  const tpl = (await loadTemplateTexts())[q];
  return tpl ? (lang === "zh" ? tpl.zh : tpl.en) : "";
}

/** /?q=<描述> 预填搜索描述（分享搜索链接入口），优先于 tpl */
function descriptionFromQuery(): string {
  return new URLSearchParams(window.location.search).get("q")?.trim().slice(0, MAX_LEN) ?? "";
}

/** /?mode=exact 预选精确核验模式（AI 不可用时的降级入口） */
function modeFromQuery(): "ai" | "exact" {
  return new URLSearchParams(window.location.search).get("mode") === "exact" ? "exact" : "ai";
}

/** /?style= 与 /?len= 预填风格/长度偏好（分享搜索链接入口）；对不上选项忽略 */
function optionFromQuery(param: string, options: { value: string }[]): string {
  const q = new URLSearchParams(window.location.search).get(param)?.trim();
  return q && options.some((o) => o.value === q) ? q : "";
}

// value 保持中文（传给 AI 的提示词），label 按语言切换
export const STYLE_OPTIONS: { value: string; labelKey: I18nKey }[] = [
  { value: "none", labelKey: "home.style.none" },
  { value: "极客风", labelKey: "home.style.geek" },
  { value: "商务专业", labelKey: "home.style.business" },
  { value: "文艺诗意", labelKey: "home.style.poetic" },
  { value: "中文拼音", labelKey: "home.style.pinyin" },
];

export const LENGTH_OPTIONS: { value: string; labelKey: I18nKey }[] = [
  { value: "none", labelKey: "home.len.none" },
  { value: "短小精悍（≤8 字符）", labelKey: "home.len.short" },
  { value: "中等（9–12 字符）", labelKey: "home.len.mid" },
  { value: "长一点也可以（>12 字符）", labelKey: "home.len.long" },
];

export interface HomeValues {
  description: string;
  tlds: string[];
  style: string;
  lengthPref: string;
}

function MiniSelect({
  icon: Icon,
  value,
  options,
  onChange,
}: {
  icon: typeof Wand2;
  value: string;
  options: { value: string; labelKey: I18nKey }[];
  onChange: (v: string) => void;
}) {
  const { t } = useI18n();
  const current = options.find((o) => o.value === value) ?? options[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-11 items-center gap-1 rounded-lg border border-line bg-bg1 px-2.5 text-xs text-txt1 hover:text-txt0 sm:h-8">
          <Icon className="h-3.5 w-3.5" />
          {t(current.labelKey)}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((o) => (
          <DropdownMenuItem key={o.value} onSelect={() => onChange(o.value)} className={cn(o.value === value && "text-brand")}>
            {t(o.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** 可注册 chip 上的首年价（实时优先，静态参考价带 ≈）；续费≥3×首年时加「↑」提示续费陷阱，tooltip 显示续费价 */
function ChipPrice({ domain }: { domain: string }) {
  const { t } = useI18n();
  const prices = usePrices();
  const tld = domain.slice(domain.indexOf(".") + 1);
  const p = prices?.[tld];
  const s = tldPrice(tld);
  const text = p ? `$${p.registration}` : s ? `≈$${toUsd(s.first)}` : undefined;
  if (!text) return null;
  const renew = p ? p.renewal : s ? toUsd(s.renew) : undefined;
  const trap = p !== undefined && renew !== undefined && renew >= p.registration * 3;
  const tip = renew !== undefined ? t("quick.renewTip").replace("{price}", `${p ? "" : "≈"}$${renew}`) : undefined;
  return (
    <i title={tip} className="not-italic font-sans text-[10px] opacity-75">
      {text}
      {trap && <span className="text-amber-500">↑</span>}
    </i>
  );
}

/** 快速核验在所选 TLD 之外额外覆盖的主流后缀（显式 TLD 与所选优先，总数封顶 10） */
const QUICK_EXTRA_TLDS = ["com", "io", "ai", "app", "dev", "co", "net", "me"];

/** 「查更多后缀」按钮覆盖的第二批后缀：由 TLD_LIST 派生，新增 TLD 自动纳入（同样走 /api/search，0 AI 额度） */
const QUICK_MORE_TLDS = [...new Set(["cn", ...KNOWN_MULTI_TLDS, ...TLD_LIST])].filter((t) => !QUICK_EXTRA_TLDS.includes(t));

/** 快速核验的 chip（可注册/已注册）都可收藏到候选清单 */
function domainToRow(domain: string, status: Row["status"] = "available", expiresAt?: string): Row {
  const dot = domain.indexOf(".");
  return { domain, label: domain.slice(0, dot), tld: domain.slice(dot + 1), status, round: 0, expiresAt };
}

export function HomePage({
  initial,
  onSubmit,
  onBackToResults,
  onOpenAdvanced,
  shortlist,
  quotaExhausted,
}: {
  initial: HomeValues;
  onSubmit: (v: HomeValues) => void;
  onBackToResults?: () => void;
  onOpenAdvanced: () => void;
  shortlist: { has: (domain: string) => boolean; toggle: (row: Row) => void };
  quotaExhausted?: boolean;
}) {
  const { t, lang } = useI18n();
  const [description, setDescription] = useState(() => descriptionFromQuery() || initial.description);

  // /?tpl= 预填模板全文（模板文案按需加载，不进首屏主 bundle）；空闲时预取全文保证点击 chip 零等待
  useEffect(() => {
    if (!descriptionFromQuery() && !initial.description) {
      void templateFromQuery(lang).then((tpl) => {
        if (tpl) setDescription((cur) => cur || tpl);
      });
    }
    const idle = () => void loadTemplateTexts();
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(idle);
    else setTimeout(idle, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [totalChecked, setTotalChecked] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((r) => (r.ok ? (r.json() as Promise<{ totalChecked: number }>) : null))
      .then((d) => {
        if (!cancelled && d && d.totalChecked > 0) setTotalChecked(d.totalChecked);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  const [tlds, setTlds] = useState<string[]>(initial.tlds);
  const [style, setStyle] = useState(() => initial.style || optionFromQuery("style", STYLE_OPTIONS) || "none");
  const [lengthPref, setLengthPref] = useState(() => initial.lengthPref || optionFromQuery("len", LENGTH_OPTIONS) || "none");
  const [customTld, setCustomTld] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  // 搜索模式分段器：AI 猎名（默认）/ 精确核验（免 AI 额度直接核验现成名字）；批量核验直达高级模式
  const [searchMode, setSearchMode] = useState<"ai" | "exact">(modeFromQuery);
  // AI 不可用横幅：本标签页最近一次 AI 搜索撞上 quota 错误时展示（非阻断，不禁用入口）
  const [aiDown] = useState(isAiQuotaDown);

  const customTlds = tlds.filter((t) => !PRESET_TLDS.includes(t));
  const toggleTld = (t: string) => setTlds((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const addCustomTld = () => {
    const t = customTld.trim().toLowerCase().replace(/^\./, "");
    if (t && /^[a-z0-9-]{2,}$/.test(t) && !tlds.includes(t)) setTlds((prev) => [...prev, t]);
    setCustomTld("");
    setShowCustom(false);
  };

  const canRun = description.trim().length > 0 && tlds.length > 0;

  const quickParsed = parseQuickCheck(description);
  const quick = quickParsed && "label" in quickParsed ? quickParsed : null;
  const quickUnsupportedTld = quickParsed && "unsupportedTld" in quickParsed ? quickParsed.unsupportedTld : null;
  const [quickRows, setQuickRows] = useState<{ domain: string; status: "checking" | "available" | "taken" | "unknown"; expiresAt?: string; detail?: string }[]>([]);
  const [quickRunning, setQuickRunning] = useState(false);
  const [quickMoreDone, setQuickMoreDone] = useState(false);
  // quick-check 图例过滤（IDS 式）：按状态筛 chips
  const [quickFilter, setQuickFilter] = useState<"all" | "available" | "taken" | "unknown">("all");
  const [quickCopied, setQuickCopied] = useState(false);
  const [variantCopied, setVariantCopied] = useState(false);
  const quickAbortRef = useRef<AbortController | null>(null);

  // 变体建议：心仪名字被注册时，用前后缀组合免费核验一批变体（同样不消耗 AI 次数）
  const [variantRows, setVariantRows] = useState<{ domain: string; status: "available" | "taken" | "unknown"; expiresAt?: string }[]>([]);
  const [variantChecked, setVariantChecked] = useState(0);
  const [variantTotal, setVariantTotal] = useState(0);
  const [variantRunning, setVariantRunning] = useState(false);
  const variantAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // 输入变化后清空上次快速核验结果；停顿 800ms 后对现成名字自动核验（走缓存的 /api/search，不消耗 AI 次数）
    quickAbortRef.current?.abort();
    variantAbortRef.current?.abort();
    setQuickRows([]);
    setQuickRunning(false);
    setQuickMoreDone(false);
    setQuickFilter("all");
    setVariantRows([]);
    setVariantChecked(0);
    setVariantTotal(0);
    setVariantRunning(false);
    if (!quick || quick.label.length < 3) return;
    const id = setTimeout(() => void runQuickCheck(), 800);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  async function runQuickCheck(more = false) {
    if (!quick) return;
    const baseTlds = [...new Set([...(quick.tld ? [quick.tld] : []), ...tlds, ...QUICK_EXTRA_TLDS])].slice(0, 10);
    // 与「查更多后缀 +{n}」按钮计数同口径：排除已有 chip 的后缀
    const checkTlds = more ? QUICK_MORE_TLDS.filter((t) => !quickRows.some((r) => r.domain === `${quick.label}.${t}`)) : baseTlds;
    if (checkTlds.length === 0) return;
    quickAbortRef.current?.abort();
    const ac = new AbortController();
    quickAbortRef.current = ac;
    const checkDomains = new Set(checkTlds.map((t) => `${quick.label}.${t}`));
    const newRows = checkTlds.map((t) => ({ domain: `${quick.label}.${t}`, status: "checking" as const }));
    if (more) {
      setQuickMoreDone(true);
      setQuickRows((prev) => [...prev.filter((r) => !checkDomains.has(r.domain)), ...newRows]);
    } else {
      setQuickMoreDone(false);
      // 重复核验：已有结果的 chip 保持原结果等待刷新，不退回「检测中」
      setQuickRows((prev) => {
        const prevByDomain = new Map(prev.map((r) => [r.domain, r]));
        return newRows.map((row) => {
          const p = prevByDomain.get(row.domain);
          return p && p.status !== "checking" ? p : row;
        });
      });
    }
    setQuickRunning(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roots: [quick.label], tlds: checkTlds }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) return;
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
          if (!line) continue;
          let r: { domain?: string; status?: "available" | "taken" | "unknown"; expiresAt?: string; detail?: string; type?: string };
          try {
            r = JSON.parse(line) as typeof r;
          } catch {
            continue; // 单行损坏不影响其余结果
          }
          if (r.type || !r.domain || !r.status) continue;
          setQuickRows((prev) => prev.map((row) => (row.domain === r.domain ? { ...row, status: r.status!, expiresAt: r.expiresAt, detail: r.detail } : row)));
        }
      }
    } catch {
      /* 中断/网络错误：保留已有结果 */
    } finally {
      if (!ac.signal.aborted) {
        setQuickRunning(false);
        // 流失败/中断兜底：本轮仍为「检测中」的 chip 标记为未知，不永久卡住
        setQuickRows((prev) => prev.map((row) => (checkDomains.has(row.domain) && row.status === "checking" ? { ...row, status: "unknown" } : row)));
      }
    }
  }

  // 单域重试：只重查一个 unknown 域名，复用 /api/search 的显式域名清单通道，不影响其余 chips
  async function retryQuickDomain(domain: string) {
    setQuickRows((prev) => prev.map((row) => (row.domain === domain ? { ...row, status: "checking", detail: undefined } : row)));
    let next: { status: "available" | "taken" | "unknown"; expiresAt?: string; detail?: string } = { status: "unknown" };
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domains: [domain] }),
      });
      if (res.ok) {
        for (const line of (await res.text()).split("\n")) {
          if (!line) continue;
          try {
            const r = JSON.parse(line) as { domain?: string; status?: "available" | "taken" | "unknown"; expiresAt?: string; detail?: string; type?: string };
            if (!r.type && r.domain === domain && r.status) next = { status: r.status, expiresAt: r.expiresAt, detail: r.detail };
          } catch {
            /* 单行损坏忽略 */
          }
        }
      }
    } catch {
      /* 网络错误：回落未知 */
    }
    setQuickRows((prev) => prev.map((row) => (row.domain === domain ? { ...row, ...next } : row)));
  }

  async function runVariantCheck() {
    if (!quick) return;
    const tld = quick.tld ?? tlds[0] ?? "com";
    variantAbortRef.current?.abort();
    const ac = new AbortController();
    variantAbortRef.current = ac;
    const total = (VARIANT_PREFIXES.length + 1) * (VARIANT_SUFFIXES.length + 1) - 1; // 去掉裸 root（已在上方核验过）
    setVariantRows([]);
    setVariantChecked(0);
    setVariantTotal(total);
    setVariantRunning(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roots: [quick.label], prefixes: VARIANT_PREFIXES, suffixes: VARIANT_SUFFIXES, tlds: [tld] }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) return;
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
          if (!line) continue;
          const r = JSON.parse(line) as { domain?: string; status?: "available" | "taken" | "unknown"; expiresAt?: string; type?: string };
          if (r.type || !r.domain || !r.status) continue;
          if (r.domain === `${quick.label}.${tld}`) continue; // 裸 root 不重复计
          setVariantChecked((n) => n + 1);
          setVariantRows((prev) => [...prev, { domain: r.domain!, status: r.status!, expiresAt: r.expiresAt }]);
        }
      }
    } catch {
      /* 中断/网络错误：保留已有结果 */
    } finally {
      if (!ac.signal.aborted) setVariantRunning(false);
    }
  }

  const submit = (desc = description) => {
    if (!desc.trim() || tlds.length === 0) return;
    setRecent(addRecentSearch({ description: desc.trim(), tlds, style, lengthPref }));
    onSubmit({
      description: desc.trim(),
      tlds,
      style: style === "none" ? "" : style,
      lengthPref: lengthPref === "none" ? "" : lengthPref,
    });
  };

  // 最近搜索：本地保存，点击回填描述/TLD/风格/长度，不自动运行
  const [recent, setRecent] = useState<RecentSearch[]>(() => loadRecentSearches());

  // 首访轻量引导：老用户（有最近搜索或本标签页已有结果）或 30 天内关闭过的不再显示
  const [showOnboard, setShowOnboard] = useState<boolean>(() => {
    if (onboardDismissActive()) return false;
    return loadRecentSearches().length === 0 && !hasSavedSearch();
  });
  const dismissOnboard = () => {
    setShowOnboard(false);
    try {
      localStorage.setItem(ONBOARD_KEY, String(Date.now()));
    } catch {
      /* 存储满/隐私模式，忽略 */
    }
  };
  const applyRecent = (r: RecentSearch) => {
    setDescription(r.description);
    if (r.tlds.length > 0) setTlds(r.tlds);
    setStyle(r.style || "none");
    setLengthPref(r.lengthPref || "none");
  };

  return (
    <main className="relative min-w-0 flex-1">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" style={{ background: "var(--glow)" }} />
      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-16 md:pt-24">
        {onBackToResults && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={onBackToResults}
              className="inline-flex h-11 items-center gap-1 rounded-full border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:h-8"
            >
              {t("home.backToResults")}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-brand-dim px-3 py-1.5 text-xs text-brand">
            <span className="dot-breathe h-1.5 w-1.5 rounded-full bg-brand" />
            {t("home.badge")}
          </span>
        </div>

        <h1 className="text-center text-4xl font-extrabold leading-[1.12] tracking-[-0.03em] md:text-[52px]" style={{ textWrap: "balance" }}>
          {t("home.title1")}<br className="md:hidden" />
          <span className={lang === "zh" ? "whitespace-nowrap" : undefined}>{t("home.title2")}</span>
          <wbr />
          <span className="whitespace-nowrap">{t("home.title2b")}</span>
        </h1>
        <p className="mt-4 text-center text-base text-txt1 md:text-lg">
          {t("home.subtitle")}
        </p>

        {/* 首访轻量引导条：三步怎么用 + quick-check 与 AI 搜索关系一句话，可关闭并记忆 */}
        {showOnboard && (
          <div className="relative mt-6 rounded-2xl border border-brand-line/60 bg-brand-dim/20 px-4 py-3.5 pr-12">
            <button
              onClick={dismissOnboard}
              title={t("home.onboard.close")}
              aria-label={t("home.onboard.close")}
              className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full text-txt2 transition-colors hover:text-txt0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <ol className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              {(
                [
                  { icon: Wand2, key: "home.onboard.step1" },
                  { icon: SearchCheck, key: "home.onboard.step2" },
                  { icon: ShieldCheck, key: "home.onboard.step3" },
                ] as { icon: typeof Wand2; key: I18nKey }[]
              ).map((s, i) => (
                <li key={s.key} className="flex min-w-0 items-center gap-2 text-xs text-txt1">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-dim font-mono text-[10px] font-semibold text-brand">{i + 1}</span>
                  <s.icon className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="min-w-0">{t(s.key)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2.5 border-t border-brand-line/40 pt-2 text-[11px] leading-relaxed text-txt2">{t("home.onboard.note")}</p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-bg1 p-1" role="group" aria-label={t("home.mode.aria")}>
            {(
              [
                { key: "ai" as const, label: "home.mode.ai" as I18nKey },
                { key: "exact" as const, label: "home.mode.exact" as I18nKey },
              ]
            ).map((m) => (
              <button
                key={m.key}
                aria-pressed={searchMode === m.key}
                onClick={() => setSearchMode(m.key)}
                className={cn(
                  "h-11 rounded-full px-3.5 text-xs transition-colors sm:h-7",
                  searchMode === m.key ? "bg-brand-dim font-semibold text-brand" : "text-txt1 hover:text-txt0",
                )}
              >
                {t(m.label)}
              </button>
            ))}
            <button
              onClick={onOpenAdvanced}
              className="h-11 rounded-full px-3.5 text-xs text-txt1 transition-colors hover:text-txt0 sm:h-7"
            >
              {t("home.mode.bulk")}
            </button>
          </div>
        </div>

        {searchMode === "ai" && (quotaExhausted || aiDown) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-txt1">
            <span>{t("home.aiDownBanner")}</span>
            <button
              onClick={() => setSearchMode("exact")}
              className="inline-flex min-h-[44px] items-center rounded-md border border-line bg-bg1 px-2.5 font-medium text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0 sm:py-1"
            >
              {t("home.mode.exact")}
            </button>
            <button
              onClick={onOpenAdvanced}
              className="inline-flex min-h-[44px] items-center rounded-md border border-line bg-bg1 px-2.5 font-medium text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0 sm:py-1"
            >
              {t("home.mode.bulk")}
            </button>
          </div>
        )}

        <div className="mt-4 overflow-hidden rounded-2xl border border-line-strong bg-bg2 shadow-[0_24px_48px_-24px_rgba(0,0,0,.5)] focus-within:border-brand-line">
          <textarea
            rows={3}
            className="w-full resize-none bg-transparent px-5 pb-2 pt-4 text-[15px] leading-relaxed outline-none"
            placeholder={t(searchMode === "exact" ? "home.placeholderExact" : "home.placeholder")}
            value={description}
            maxLength={MAX_LEN}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (searchMode === "exact" || e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (searchMode === "exact") void runQuickCheck();
                else submit();
              }
            }}
          />
          <div className="flex flex-wrap items-center gap-2 px-3 pb-3">
            <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg1 p-1 no-scrollbar">
              {[...PRESET_TLDS, ...customTlds].map((t) => {
                const active = tlds.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTld(t)}
                    aria-pressed={active}
                    className={cn(
                      "flex min-h-[44px] shrink-0 items-center rounded-md px-2.5 font-mono text-xs sm:min-h-0 sm:px-2 sm:py-1",
                      active ? "bg-brand-dim font-semibold text-brand" : "text-txt1 hover:text-txt0",
                    )}
                  >
                    .{t}
                  </button>
                );
              })}
              {showCustom ? (
                <input
                  autoFocus
                  className="w-16 shrink-0 rounded-md bg-transparent px-1.5 py-1 font-mono text-xs outline-none"
                  placeholder="net"
                  value={customTld}
                  onChange={(e) => setCustomTld(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTld()}
                  onBlur={addCustomTld}
                />
              ) : (
                <button onClick={() => setShowCustom(true)} title={t("home.customTld")} className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md text-xs text-txt2 hover:text-txt0 sm:min-h-0 sm:min-w-0 sm:px-1.5 sm:py-1">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {searchMode === "ai" && (
              <>
                <MiniSelect icon={Wand2} value={style} options={STYLE_OPTIONS} onChange={setStyle} />
                <MiniSelect icon={Ruler} value={lengthPref} options={LENGTH_OPTIONS} onChange={setLengthPref} />
              </>
            )}
            <div className="flex-1" />
            <span className="tnum hidden text-[11px] text-txt2 md:inline">
              {description.length > 0 && `${description.length}/${MAX_LEN} · `}{searchMode === "exact" ? "Enter" : "⌘ Enter"}
            </span>
            {searchMode === "exact" ? (
              <button
                disabled={!quick || quick.label.length < 3 || quickRunning}
                onClick={() => void runQuickCheck()}
                className="flex h-11 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 sm:h-9"
              >
                {quickRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchCheck className="h-4 w-4" />}
                {t("home.exactCheck")}
              </button>
            ) : (
              <button
                disabled={!canRun}
                onClick={() => submit()}
                className="flex h-11 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 sm:h-9"
              >
                <Sparkles className="h-4 w-4" />
                {t("home.start")}
              </button>
            )}
          </div>
        </div>

        {/* 最近搜索：点击回填，不自动运行 */}
        {recent.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-txt2">
              <History className="h-3 w-3" />
              {t("home.recent")}
            </span>
            {recent.map((r) => (
              <button
                key={r.at}
                onClick={() => applyRecent(r)}
                title={r.description}
                className="flex min-h-[44px] max-w-[240px] items-center truncate rounded-full border border-line bg-bg1 px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-[32px]"
              >
                <span className="truncate">{r.description}</span>
              </button>
            ))}
            <button
              onClick={() => {
                clearRecentSearches();
                setRecent([]);
              }}
              title={t("home.recentClear")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-txt2 hover:text-txt0 sm:h-6 sm:w-6"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* 输入像现成名字/域名：提供免 AI 额度的直接核验 */}
        {quick && (
          <div className="mt-3 rounded-xl border border-line bg-bg1 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-txt1">{t("home.quickCheckHint")}</span>
              <button
                onClick={() => void runQuickCheck()}
                disabled={quickRunning}
                className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-brand-line bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-90 disabled:opacity-50 sm:h-8"
              >
                {quickRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SearchCheck className="h-3.5 w-3.5" />}
                {t("home.quickCheckBtn", { label: quick.label })}
              </button>
            </div>
            {/* 读屏状态播报：仅在整批核验结束后播报一次汇总，避免逐行流式轰炸 */}
            {!quickRunning && quickRows.length > 0 && (
              <p role="status" className="sr-only">
                {t("home.quickDoneStatus", { available: quickRows.filter((r) => r.status === "available").length, total: quickRows.length })}
              </p>
            )}
            {/* 图例过滤：chips 多时按状态筛选（可注册/已注册/未知） */}
            {quickRows.length >= 6 && !quickRunning && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { key: "all", dot: "bg-txt2", n: quickRows.length },
                    { key: "available", dot: "bg-brand", n: quickRows.filter((r) => r.status === "available").length },
                    { key: "taken", dot: "bg-taken", n: quickRows.filter((r) => r.status === "taken").length },
                    { key: "unknown", dot: "bg-txt2/50", n: quickRows.filter((r) => r.status === "unknown").length },
                  ] as { key: typeof quickFilter; dot: string; n: number }[]
                )
                  .filter((f) => f.key === "all" || f.n > 0)
                  .map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setQuickFilter(f.key)}
                      aria-pressed={quickFilter === f.key}
                      className={cn(
                        "tnum inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-2.5 text-[11px] sm:min-h-[32px]",
                        quickFilter === f.key ? "border-brand-line bg-brand-dim font-semibold text-brand" : "border-line text-txt1 hover:text-txt0",
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-sm", f.dot)} />
                      {t(`home.quickLegend.${f.key}` as I18nKey, { n: f.n })}
                    </button>
                  ))}
              </div>
            )}
            {quickRows.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {quickRows.filter((row) => quickFilter === "all" || row.status === quickFilter).map((row) =>
                  row.status === "available" ? (
                    <span key={row.domain} className="inline-flex max-w-full items-stretch overflow-hidden rounded-lg border border-brand-line bg-brand-dim font-mono text-xs text-brand">
                      <a
                        href={REGISTRARS[0].url(row.domain)}
                        target="_blank"
                        rel="noreferrer"
                        title={t("home.quickRegister", { domain: row.domain })}
                        className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 px-2.5 py-1.5 transition-opacity hover:opacity-85 sm:min-h-0"
                      >
                        <span className="min-w-0 truncate">{row.domain}</span>
                        <i className="not-italic font-sans text-[10px]">{t("status.available")}</i>
                        <ChipPrice domain={row.domain} />
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        onClick={() => shortlist.toggle(domainToRow(row.domain))}
                        title={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                        aria-pressed={shortlist.has(row.domain)}
                        className="border-l border-brand-line/50 px-3 transition-opacity hover:opacity-85 sm:px-2"
                      >
                        <Star className={cn("h-3.5 w-3.5", shortlist.has(row.domain) && "fill-current")} />
                      </button>
                    </span>
                  ) : row.status === "taken" ? (
                    <span key={row.domain} className="inline-flex max-w-full items-stretch overflow-hidden rounded-lg border border-line font-mono text-xs text-txt2">
                      <span className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 px-2.5 py-1.5 sm:min-h-0">
                        <span title={row.domain} className="min-w-0 truncate line-through">{row.domain}</span>
                        <i className="not-italic font-sans text-[10px] text-taken">{t("status.taken")}</i>
                        {row.expiresAt && <ExpiryNote iso={row.expiresAt} className="font-sans" />}
                      </span>
                      <button
                        onClick={() => shortlist.toggle(domainToRow(row.domain, "taken", row.expiresAt))}
                        title={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                        aria-label={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                        aria-pressed={shortlist.has(row.domain)}
                        className={cn("border-l border-line/70 px-3 transition-colors hover:text-txt0 sm:px-2", shortlist.has(row.domain) && "text-taken")}
                      >
                        <Star className={cn("h-3.5 w-3.5", shortlist.has(row.domain) && "fill-current")} />
                      </button>
                      {row.expiresAt && (
                        <WatchCta
                          domain={row.domain}
                          expiresAt={row.expiresAt}
                          variant="chip"
                          onAddShortlist={() => {
                            if (!shortlist.has(row.domain)) shortlist.toggle(domainToRow(row.domain, "taken", row.expiresAt));
                          }}
                        />
                      )}
                    </span>
                  ) : (
                    <span
                      key={row.domain}
                      title={row.status === "unknown" ? t(row.detail === "reserved" ? "home.quickReservedTip" : "home.quickUnknownTip") : undefined}
                      className={cn(
                        "inline-flex max-w-full items-stretch overflow-hidden rounded-lg border font-mono text-xs",
                        row.status === "unknown" && "border-line text-txt1",
                        row.status === "checking" && "border-line text-txt2",
                      )}
                    >
                      <span className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 px-2.5 py-1.5 sm:min-h-0">
                        <span title={row.status === "checking" ? row.domain : undefined} className="min-w-0 truncate">{row.domain}</span>
                        <i className="not-italic font-sans text-[10px]">{t(row.status === "unknown" && row.detail === "reserved" ? "status.reserved" : (`status.${row.status}` as I18nKey))}</i>
                        {row.status === "checking" && <Loader2 className="h-3 w-3 animate-spin" />}
                      </span>
                      {row.status === "unknown" && row.detail !== "reserved" && (
                        <button
                          onClick={() => void retryQuickDomain(row.domain)}
                          title={t("home.quickRetryTitle", { domain: row.domain })}
                          aria-label={t("home.quickRetryTitle", { domain: row.domain })}
                          className="flex min-w-[44px] items-center justify-center border-l border-line/70 transition-colors hover:text-txt0 sm:min-w-0 sm:px-2"
                        >
                          <RotateCw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </span>
                  ),
                )}
                {!quickRunning && !quickMoreDone && (
                  <button
                    onClick={() => void runQuickCheck(true)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-dashed border-line px-2.5 py-1.5 font-mono text-xs text-txt2 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0"
                  >
                    <Plus className="h-3 w-3" />
                    {t("home.quickMoreBtn", { n: QUICK_MORE_TLDS.filter((x) => !quickRows.some((r) => r.domain === `${quick.label}.${x}`)).length })}
                  </button>
                )}
                {!quickRunning && quickRows.filter((r) => r.status === "available").length >= 2 && (
                  <button
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        quickRows.filter((r) => r.status === "available").map((r) => r.domain).join("\n"),
                      );
                      setQuickCopied(true);
                      setTimeout(() => setQuickCopied(false), 1500);
                    }}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0"
                  >
                    {quickCopied ? <Check className="h-3 w-3 text-brand" /> : <Copy className="h-3 w-3" />}
                    {quickCopied
                      ? t("home.quickCopied")
                      : t("home.quickCopyBtn", { n: quickRows.filter((r) => r.status === "available").length })}
                  </button>
                )}
                {/* 心仪名字被注册：免费变体核验 + 一键转 AI 搜相似寓意的可注册名字（与 chips 同行，展开更多后缀后也可见） */}
                {!quickRunning && quickRows.some((r) => r.status === "taken") && variantTotal === 0 && (
                  <button
                    onClick={() => void runVariantCheck()}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-brand-line/60 bg-brand-dim/30 px-2.5 py-1.5 font-mono text-xs font-semibold text-brand transition-colors hover:border-brand-line hover:bg-brand-dim sm:min-h-0"
                  >
                    <SearchCheck className="h-3 w-3" />
                    {t("home.quickVariantsBtn", { n: (VARIANT_PREFIXES.length + 1) * (VARIANT_SUFFIXES.length + 1) - 1 })}
                  </button>
                )}
                {!quickRunning && quickRows.some((r) => r.status === "taken") && (
                  <button
                    onClick={() => submit(t("home.quickAiDesc", { label: quick.label }))}
                    disabled={quotaExhausted}
                    title={quotaExhausted ? t("results.moreQuota") : undefined}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand disabled:pointer-events-none disabled:opacity-50 sm:min-h-0"
                  >
                    <Sparkles className="h-3 w-3" />
                    {t("home.quickAiCta")}
                  </button>
                )}
              </div>
            )}
            {/* 变体核验进度与可注册变体 chips */}
            {variantTotal > 0 && (
              <div className="mt-2.5">
                <p className="flex items-center gap-1.5 text-[11px] text-txt2">
                  {variantRunning && <Loader2 className="h-3 w-3 animate-spin" />}
                  {t("home.quickVariantsProgress", { checked: variantChecked, total: variantTotal, n: variantRows.filter((r) => r.status === "available").length })}
                </p>
                {variantRows.some((r) => r.status === "available") && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {variantRows
                      .filter((r) => r.status === "available")
                      .map((row) => (
                        <span key={row.domain} className="inline-flex max-w-full items-stretch overflow-hidden rounded-lg border border-brand-line bg-brand-dim font-mono text-xs text-brand">
                          <a
                            href={REGISTRARS[0].url(row.domain)}
                            target="_blank"
                            rel="noreferrer"
                            title={t("home.quickRegister", { domain: row.domain })}
                            className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 px-2.5 py-1.5 transition-opacity hover:opacity-85 sm:min-h-0"
                          >
                            <span className="min-w-0 truncate">{row.domain}</span>
                            <i className="not-italic font-sans text-[10px]">{t("status.available")}</i>
                            <ChipPrice domain={row.domain} />
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <button
                            onClick={() => shortlist.toggle(domainToRow(row.domain))}
                            title={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                            aria-pressed={shortlist.has(row.domain)}
                            className="border-l border-brand-line/50 px-3 transition-opacity hover:opacity-85 sm:px-2"
                          >
                            <Star className={cn("h-3.5 w-3.5", shortlist.has(row.domain) && "fill-current")} />
                          </button>
                        </span>
                      ))}
                    {!variantRunning && variantRows.filter((r) => r.status === "available").length >= 2 && (
                      <button
                        onClick={() => {
                          void navigator.clipboard.writeText(
                            variantRows.filter((r) => r.status === "available").map((r) => r.domain).join("\n"),
                          );
                          setVariantCopied(true);
                          setTimeout(() => setVariantCopied(false), 1500);
                        }}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0"
                      >
                        {variantCopied ? <Check className="h-3 w-3 text-brand" /> : <Copy className="h-3 w-3" />}
                        {variantCopied
                          ? t("home.quickCopied")
                          : t("home.quickCopyBtn", { n: variantRows.filter((r) => r.status === "available").length })}
                      </button>
                    )}
                  </div>
                )}
                {/* 已注册变体也可收藏（进候选清单后可开监控） */}
                {variantRows.some((r) => r.status === "taken") && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {variantRows
                      .filter((r) => r.status === "taken")
                      .map((row) => (
                        <span key={row.domain} className="inline-flex max-w-full items-stretch overflow-hidden rounded-lg border border-line font-mono text-xs text-txt2">
                          <span className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 px-2.5 py-1.5 sm:min-h-0">
                            <span title={row.domain} className="min-w-0 truncate line-through">{row.domain}</span>
                            <i className="not-italic font-sans text-[10px] text-taken">{t("status.taken")}</i>
                          </span>
                          <button
                            onClick={() => shortlist.toggle(domainToRow(row.domain, "taken", row.expiresAt))}
                            title={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                            aria-label={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                            aria-pressed={shortlist.has(row.domain)}
                            className={cn("border-l border-line/70 px-3 transition-colors hover:text-txt0 sm:px-2", shortlist.has(row.domain) && "text-taken")}
                          >
                            <Star className={cn("h-3.5 w-3.5", shortlist.has(row.domain) && "fill-current")} />
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 输入多级后缀但站内核验通道不支持：给出友好提示而非静默无响应 */}
        {quickUnsupportedTld && (
          <div className="mt-3 rounded-xl border border-line bg-bg1 px-4 py-3">
            <p className="text-xs text-txt1">{t("home.quickUnsupportedTld", { tld: quickUnsupportedTld })}</p>
          </div>
        )}

        {/* 行业模板 chips：点击填入描述模板，用户可再编辑后搜索；默认收起只显示前 10 个 */}
        <div className="mt-4">
          <p className="text-center text-[11px] text-txt2">{t("home.templates")}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {(showAllTemplates ? TEMPLATE_LABELS : TEMPLATE_LABELS.slice(0, 10)).map((tpl) => (
              <button
                key={tpl.labelZh}
                onClick={() =>
                  void loadTemplateTexts().then((texts) => {
                    const text = texts[tpl.slug];
                    if (text) setDescription(lang === "zh" ? text.zh : text.en);
                  })
                }
                className="h-11 rounded-full border border-brand-line/60 bg-brand-dim/30 px-3 text-xs text-brand transition-colors hover:border-brand-line hover:bg-brand-dim sm:h-8"
              >
                {lang === "zh" ? tpl.labelZh : tpl.labelEn}
              </button>
            ))}
            {!showAllTemplates && (
              <button
                onClick={() => setShowAllTemplates(true)}
                className="h-11 rounded-full border border-dashed border-brand-line/60 px-3 text-xs text-txt2 transition-colors hover:border-brand-line hover:text-brand sm:h-8"
              >
                +{TEMPLATE_LABELS.length - 10}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {/* 首访微引导：提示示例可直接点击体验一次完整搜索 */}
          {showOnboard && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand">
              <Sparkles className="h-3 w-3" />
              {t("home.onboard.tryExample")}
            </span>
          )}
          {(lang === "zh" ? EXAMPLES : EXAMPLES_EN).map((ex, i) => (
            <button
              key={ex}
              onClick={() => {
                setDescription(ex);
                submit(ex);
              }}
              className={cn(
                "h-11 rounded-full border px-3 text-xs transition-colors hover:border-brand-line hover:text-brand sm:h-9",
                showOnboard && i === 0 ? "border-brand-line/70 bg-brand-dim/30 text-brand" : "border-line text-txt1",
              )}
            >
              {ex}
            </button>
          ))}
        </div>

        <p className="mt-10 flex flex-wrap items-center justify-center gap-4 text-center text-xs text-txt2">
          {totalChecked !== null && (
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              {t("home.trustChecked")} <b className="tnum font-mono text-txt1">{totalChecked.toLocaleString()}</b> {t("home.trustCheckedUnit")}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-brand" />
            {t("home.trustStream")}
          </span>
          <span className="flex items-center gap-1">{t("home.trustOss")}</span>
        </p>

        {/* 怎么用 / 为什么好用：三步说明 */}
        <div className="mt-16">
          <h2 className="text-center text-sm font-semibold text-txt1">{t("home.how.title")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {(
              [
                { icon: Brain, title: "home.how.step1.title", desc: "home.how.step1.desc" },
                { icon: ShieldCheck, title: "home.how.step2.title", desc: "home.how.step2.desc" },
                { icon: Sparkles, title: "home.how.step3.title", desc: "home.how.step3.desc" },
              ] as { icon: typeof Brain; title: I18nKey; desc: I18nKey }[]
            ).map((s, i) => (
              <div key={s.title} className="rounded-xl border border-line bg-bg1 p-5">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg border border-brand-line bg-brand-dim">
                    <s.icon className="h-3.5 w-3.5 text-brand" />
                  </span>
                  <span className="tnum font-mono text-[11px] text-txt2">0{i + 1}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{t(s.title)}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-txt1">{t(s.desc)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center">
            <a href={`/why?lang=${lang}`} className="inline-flex min-h-[44px] items-center px-2 text-xs text-txt2 hover:text-brand hover:underline">
              {t("home.whyLink")}
            </a>
          </p>
        </div>

        {/* 常见问题（与 SSR 注入的 FAQPage JSON-LD 内容一致） */}
        <div className="mt-16">
          <h2 className="text-center text-sm font-semibold text-txt1">{t("home.faq.title")}</h2>
          <div className="mt-5 space-y-2">
            {([1, 2, 3, 4, 5, 6] as const).map((i) => (
              <details key={i} className="group rounded-xl border border-line bg-bg1 px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-txt1 [&::-webkit-details-marker]:hidden">
                  {t(`home.faq.q${i}` as I18nKey)}
                  <ChevronDown className="h-4 w-4 shrink-0 text-txt2 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2.5 text-xs leading-relaxed text-txt1 [overflow-wrap:anywhere]">{t(`home.faq.a${i}` as I18nKey)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
