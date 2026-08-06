import { useEffect, useRef, useState } from "react";
import { ArrowRight, Brain, Check, ChevronDown, Copy, ExternalLink, History, Loader2, Plus, Ruler, SearchCheck, ShieldCheck, Sparkles, Star, Wand2, X, Zap } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { addRecentSearch, clearRecentSearches, loadRecentSearches, type RecentSearch } from "@/lib/history";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { toUsd, usePrices } from "@/lib/prices";
import { REGISTRARS } from "@/lib/registrars";
import { cn } from "@/lib/utils";
import { tldPrice, type Row } from "@/types";

const EXAMPLES = ["独立开发者的 AI 周报工具", "宠物营养订阅电商", "极简冥想 App", "跨境 SaaS 数据看板"];
const EXAMPLES_EN = ["AI weekly-report tool for indie devs", "Pet nutrition subscription store", "Minimal meditation app", "Cross-border SaaS dashboard"];
const PRESET_TLDS = ["com", "cn", "io", "ai", "app", "dev"];
const MAX_LEN = 500;
const LABEL_RE = /^[a-z0-9][a-z0-9-]{0,62}$/i;
const EXACT_DOMAIN_RE = /^([a-z0-9][a-z0-9-]{0,62})\.([a-z0-9-]{2,24})$/i;
// 常见可注册 TLD：避免把拼写错误（如 baidu.iox）当作精确域名去核验
const KNOWN_TLDS = new Set([
  "com", "net", "org", "cn", "io", "ai", "app", "dev", "co", "cc", "tv", "xyz", "me", "info", "biz", "top", "vip", "pro", "site",
  "online", "store", "shop", "tech", "cloud", "space", "fun", "art", "design", "studio", "agency", "digital", "live", "life", "world", "today",
  "news", "blog", "wiki", "link", "club", "team", "work", "zone", "run", "games", "game", "gg", "so", "sh", "im", "fm", "am", "to", "ly", "is",
  "us", "uk", "de", "jp", "hk", "tw", "sg", "eu", "in", "ca", "one", "page", "email", "group", "network", "software", "systems", "tools", "chat", "bot",
]);

/** 输入看起来已经是现成名字/域名时，提供免 AI 额度的直接核验 */
function parseQuickCheck(input: string): { label: string; tld?: string } | null {
  const d = input.trim().toLowerCase();
  if (LABEL_RE.test(d)) return { label: d };
  const m = EXACT_DOMAIN_RE.exec(d);
  return m && KNOWN_TLDS.has(m[2]) ? { label: m[1], tld: m[2] } : null;
}

// 行业模板：寓意 + 气质 + 场景 三段式描述，点击填入输入框，用户可再编辑；slug 对应 /guide/:slug 与 /?tpl= 预填入口
const TEMPLATES: { slug: string; labelZh: string; labelEn: string; zh: string; en: string }[] = [
  {
    slug: "saas",
    labelZh: "SaaS 工具",
    labelEn: "SaaS tool",
    zh: "一款面向中小团队的协作 SaaS 工具，寓意「把繁琐的工作流理顺、让团队更快交付」；气质要专业、可靠、有效率感；场景是公司官网、产品登录页和邮件签名里都好记好读。",
    en: "A collaboration SaaS tool for small teams. The name should evoke smoothing out messy workflows and helping teams ship faster; the vibe is professional, reliable, and efficient; it needs to read well on a company homepage, a login page, and in email signatures.",
  },
  {
    slug: "ecommerce",
    labelZh: "电商品牌",
    labelEn: "E-commerce brand",
    zh: "一个面向年轻人的生活方式电商品牌，寓意「把好物带进日常、让生活更有质感」；气质要温润、有品味、容易产生信任；场景是包装盒、购物袋和社交媒体主页上都上镜好记。",
    en: "A lifestyle e-commerce brand for young shoppers. The name should suggest bringing well-made things into everyday life; the vibe is warm, tasteful, and trustworthy; it has to look good on packaging, shopping bags, and a social media profile.",
  },
  {
    slug: "ai",
    labelZh: "AI 产品",
    labelEn: "AI product",
    zh: "一款 AI 驱动的智能助手产品，寓意「像多了一个聪明同事，把重复劳动交给机器」；气质要聪明、前沿、有未来感但不冰冷；场景是 Product Hunt 发布、技术博客和投资人 PPT 里都站得住。",
    en: "An AI-powered assistant product. The name should feel like having a brilliant teammate who takes over the repetitive work; the vibe is smart, cutting-edge, futuristic but not cold; it should hold up on a Product Hunt launch, in tech blogs, and on an investor deck.",
  },
  {
    slug: "blog",
    labelZh: "个人博客",
    labelEn: "Personal blog",
    zh: "一个记录思考与创作的个人博客，寓意「把想法沉淀下来、慢慢长成自己的小花园」；气质要安静、真诚、有书卷气；场景是读者在深夜读完一篇文章后，能凭名字记住并再次找到你。",
    en: "A personal blog for essays and creative work. The name should feel like a quiet garden where ideas settle and grow over time; the vibe is calm, sincere, and bookish; a reader who finishes a late-night post should remember the name and find their way back.",
  },
  {
    slug: "pets",
    labelZh: "宠物",
    labelEn: "Pets",
    zh: "一个宠物用品与服务品牌，寓意「把毛孩子当家人，认真对待它们的每一餐每一天」；气质要温暖、活泼、让人会心一笑；场景是实体店招牌、外卖包装和小红书笔记里都可爱好认。",
    en: "A pet supplies and services brand. The name should convey treating furry kids as family and caring about every meal and every day; the vibe is warm, playful, and smile-inducing; it should charm on a storefront sign, delivery packaging, and social posts.",
  },
  {
    slug: "fintech",
    labelZh: "金融科技",
    labelEn: "Fintech",
    zh: "一款面向年轻用户的理财记账工具，寓意「把钱管明白、让财富稳稳生长」；气质要可信、清爽、专业但不古板；场景是应用商店榜单和银行合作发布会上都拿得出手。",
    en: "A personal finance and budgeting app for younger users. The name should suggest understanding your money and letting wealth grow steadily; the vibe is trustworthy, clean, professional yet friendly; it must look credible on app store charts and at a bank partnership launch.",
  },
  {
    slug: "game",
    labelZh: "游戏",
    labelEn: "Games",
    zh: "一款轻量多人在线小游戏，寓意「一局开黑、即点即玩的快乐」；气质要好玩、有能量、喊起来顺口；场景是主播在直播间反复喊出名字、玩家在商店列表里一眼记住。",
    en: "A lightweight multiplayer web game. The name should evoke instant, jump-in-and-play fun with friends; the vibe is playful, energetic, and satisfying to shout; it must be memorable when streamers yell it on stream and players scroll past it in a store list.",
  },
  {
    slug: "edu",
    labelZh: "教育学习",
    labelEn: "Education",
    zh: "一款让学习不再痛苦的在线学习工具，寓意「每天进步一点点、把知识点亮」；气质要可靠又有趣、不说教；场景是家长在付费页觉得靠谱、学习者每天打开时觉得轻松。",
    en: "An online learning tool that makes studying painless. The name should suggest steady daily progress and knowledge lighting up; the vibe is reliable yet fun, never preachy; it must reassure parents on the checkout page and feel light when learners open it every day.",
  },
  {
    slug: "travel",
    labelZh: "旅行",
    labelEn: "Travel",
    zh: "一个帮人发现小众目的地的旅行品牌，寓意「出发去看没见过的世界」；气质要自由、开阔、有远方感；场景是朋友间口头推荐时一听就记住，机场广告牌上一眼有画面。",
    en: "A travel brand that helps people discover offbeat destinations. The name should evoke setting off to see an unseen world; the vibe is free, open, full of wanderlust; it must stick after one spoken referral and paint a picture on an airport billboard.",
  },
  {
    slug: "food",
    labelZh: "餐饮美食",
    labelEn: "Food & dining",
    zh: "一个主打现做轻食的餐饮品牌，寓意「新鲜、认真做好每一餐」；气质要温暖、干净、有食欲感；场景是门头招牌三米外看得清、外卖列表里一眼被点开、朋友说「今天吃它」顺口。",
    en: "A fresh-made casual food brand. The name should convey freshness and care in every meal; the vibe is warm, clean, appetizing; it must read from three meters on a storefront, get tapped in a delivery list, and roll off the tongue in \"let's eat there\".",
  },
  {
    slug: "fitness",
    labelZh: "健身健康",
    labelEn: "Fitness",
    zh: "一款帮人养成运动习惯的健身产品，寓意「每天坚持一点、成为更强的自己」；气质要有能量、正向、像一枚身份徽章；场景是印在运动服上不违和、喊在训练营里带感。",
    en: "A fitness product that builds workout habits. The name should suggest daily persistence and becoming a stronger self; the vibe is energetic, positive, badge-like; it should look right printed on apparel and sound great shouted in a boot camp.",
  },
  {
    slug: "devtools",
    labelZh: "开发者工具",
    labelEn: "Dev tools",
    zh: "一款让开发者提效的命令行工具，寓意「把重复的构建部署活儿一键搞定」；气质要极客、干脆、有点冷幽默；场景是全小写敲进终端手感顺滑、在 GitHub README 里酷而不装。",
    en: "A CLI tool that saves developers time. The name should evoke one-command builds and deploys; the vibe is hacker-ish, crisp, with a dry sense of humor; it must feel smooth typed lowercase in a terminal and look cool-but-not-trying in a GitHub README.",
  },
  {
    slug: "web3",
    labelZh: "Web3 项目",
    labelEn: "Web3 project",
    zh: "一个链上数据基础设施项目，寓意「像水电一样可靠的链上服务」；气质要专业、中立、有协议感、绝不土狗；场景是出现在审计报告和交易所公告里都站得住。",
    en: "An on-chain data infrastructure project. The name should feel like utility-grade reliability for the chain; the vibe is professional, neutral, protocol-like, never memecoin-ish; it must hold up in audit reports and exchange announcements.",
  },
  {
    slug: "agency",
    labelZh: "咨询工作室",
    labelEn: "Agency / studio",
    zh: "一家小而美的设计咨询工作室，寓意「用专业判断帮客户把事做对」；气质要克制、可信、有方法论感；场景是印在提案封面和合同抬头上显得体面有分量。",
    en: "A small, sharp design consultancy. The name should convey professional judgment that gets things right; the vibe is restrained, credible, methodology-driven; it must carry weight on a proposal cover and a contract header.",
  },
  {
    slug: "photography",
    labelZh: "摄影工作室",
    labelEn: "Photo studio",
    zh: "一家人像与婚礼摄影工作室，寓意「把最重要的瞬间拍得配得上回忆」；气质要温暖、有作者感、经得起印在水印和请柬上；场景是客户向闺蜜转介绍时一遍就能说清。",
    en: "A portrait and wedding photography studio. The name should say the most important moments deserve this craft; the vibe is warm, authorial, worthy of a watermark and a wedding invitation; it must land in one telling when a client refers a friend.",
  },
  {
    slug: "podcast",
    labelZh: "播客节目",
    labelEn: "Podcast",
    zh: "一档聊科技与生活的双人对谈播客，寓意「认真但不正经的深夜聊天」；气质要松弛、有态度、口播念起来顺；场景是听众通勤听到节目名，晚上还能凭记忆搜到。",
    en: "A two-host talk show on tech and life. The name should feel like earnest but playful late-night conversation; the vibe is relaxed, opinionated, smooth in a spoken intro; a commuter who hears it once must find it by memory that night.",
  },
  {
    slug: "realestate",
    labelZh: "房产家居",
    labelEn: "Real estate",
    zh: "一个帮年轻人找到理想住处的找房平台，寓意「安家这件事值得被认真对待」；气质要稳重、可信、带一点温度；场景是出现在中介门店招牌和 App 商店里都让人放心。",
    en: "A home-finding platform for young renters and buyers. The name should say settling down deserves real care; the vibe is steady, trustworthy, with a touch of warmth; it must reassure on a storefront sign and in an app store alike.",
  },
  {
    slug: "health",
    labelZh: "医疗健康",
    labelEn: "Health app",
    zh: "一款帮用户管理睡眠与压力的健康应用，寓意「被科学而温柔地照顾」；气质要安心、专业、绝不冰冷；场景是用户愿意推荐给爸妈用，说出名字时对方不会犹豫。",
    en: "A health app for sleep and stress. The name should feel like being cared for with science and gentleness; the vibe is reassuring, credible, never clinical-cold; users should feel comfortable recommending it to their parents by name.",
  },
  {
    slug: "legal",
    labelZh: "法律服务",
    labelEn: "Legal service",
    zh: "一个面向小微企业的在线法律服务平台，寓意「请律师不该让人紧张」；气质要专业、可靠、亲切不吓人；场景是印在合同模板页脚和官网首页都稳得住。",
    en: "An online legal service for small businesses. The name should say hiring a lawyer shouldn't be intimidating; the vibe is professional, dependable, approachable; it must hold steady in a contract footer and on a homepage.",
  },
  {
    slug: "newsletter",
    labelZh: "Newsletter",
    labelEn: "Newsletter",
    zh: "一份每周精选科技与商业洞察的 newsletter，寓意「每周一杯高浓度的认知咖啡」；气质要聪明、有节奏感、在收件箱里一眼想点开；场景是读者向同事转发时名字自带推荐语。",
    en: "A weekly newsletter of tech and business insight. The name should feel like a weekly shot of concentrated thinking; the vibe is smart, rhythmic, instantly clickable in an inbox; when a reader forwards it, the name itself is the endorsement.",
  },
];

/** /?tpl=<slug> 预填行业模板（行业命名指南页 CTA 入口）；slug 对不上忽略 */
function templateFromQuery(lang: string): string {
  const q = new URLSearchParams(window.location.search).get("tpl")?.trim().toLowerCase();
  const tpl = q ? TEMPLATES.find((x) => x.slug === q) : undefined;
  return tpl ? (lang === "zh" ? tpl.zh : tpl.en) : "";
}

/** /?q=<描述> 预填搜索描述（分享搜索链接入口），优先于 tpl */
function descriptionFromQuery(): string {
  return new URLSearchParams(window.location.search).get("q")?.trim().slice(0, MAX_LEN) ?? "";
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

/** 「查更多后缀」按钮覆盖的第二批后缀（同样走 /api/search，0 AI 额度） */
const QUICK_MORE_TLDS = ["org", "xyz", "info", "cc", "tv", "tech", "online", "store", "site", "top", "shop", "cloud", "pro", "vip", "club", "link"];

/** 快速核验的可注册 chip 也可收藏到候选清单 */
function domainToRow(domain: string): Row {
  const dot = domain.indexOf(".");
  return { domain, label: domain.slice(0, dot), tld: domain.slice(dot + 1), status: "available", round: 0 };
}

export function HomePage({
  initial,
  onSubmit,
  onBackToResults,
  shortlist,
}: {
  initial: HomeValues;
  onSubmit: (v: HomeValues) => void;
  onBackToResults?: () => void;
  shortlist: { has: (domain: string) => boolean; toggle: (row: Row) => void };
}) {
  const { t, lang } = useI18n();
  const [description, setDescription] = useState(() => initial.description || descriptionFromQuery() || templateFromQuery(lang));
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

  const customTlds = tlds.filter((t) => !PRESET_TLDS.includes(t));
  const toggleTld = (t: string) => setTlds((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const addCustomTld = () => {
    const t = customTld.trim().toLowerCase().replace(/^\./, "");
    if (t && /^[a-z0-9-]{2,}$/.test(t) && !tlds.includes(t)) setTlds((prev) => [...prev, t]);
    setCustomTld("");
    setShowCustom(false);
  };

  const canRun = description.trim().length > 0 && tlds.length > 0;

  const quick = parseQuickCheck(description);
  const [quickRows, setQuickRows] = useState<{ domain: string; status: "checking" | "available" | "taken" | "unknown" }[]>([]);
  const [quickRunning, setQuickRunning] = useState(false);
  const [quickMoreDone, setQuickMoreDone] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);
  const quickAbortRef = useRef<AbortController | null>(null);

  // 变体建议：心仪名字被注册时，用前后缀组合免费核验一批变体（同样不消耗 AI 次数）
  const VARIANT_PREFIXES = ["get", "my", "try", "use"];
  const VARIANT_SUFFIXES = ["app", "hq", "labs", "hub"];
  const [variantRows, setVariantRows] = useState<{ domain: string; status: "available" | "taken" | "unknown" }[]>([]);
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
    const checkTlds = more ? QUICK_MORE_TLDS.filter((t) => !baseTlds.includes(t)) : baseTlds;
    if (checkTlds.length === 0) return;
    quickAbortRef.current?.abort();
    const ac = new AbortController();
    quickAbortRef.current = ac;
    const newRows = checkTlds.map((t) => ({ domain: `${quick.label}.${t}`, status: "checking" as const }));
    if (more) {
      setQuickMoreDone(true);
      setQuickRows((prev) => [...prev, ...newRows]);
    } else {
      setQuickMoreDone(false);
      setQuickRows(newRows);
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
          const r = JSON.parse(line) as { domain?: string; status?: "available" | "taken" | "unknown"; type?: string };
          if (r.type || !r.domain || !r.status) continue;
          setQuickRows((prev) => prev.map((row) => (row.domain === r.domain ? { ...row, status: r.status! } : row)));
        }
      }
    } catch {
      /* 中断/网络错误：保留已有结果 */
    } finally {
      if (!ac.signal.aborted) setQuickRunning(false);
    }
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
          const r = JSON.parse(line) as { domain?: string; status?: "available" | "taken" | "unknown"; type?: string };
          if (r.type || !r.domain || !r.status) continue;
          if (r.domain === `${quick.label}.${tld}`) continue; // 裸 root 不重复计
          setVariantChecked((n) => n + 1);
          setVariantRows((prev) => [...prev, { domain: r.domain!, status: r.status! }]);
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
  const applyRecent = (r: RecentSearch) => {
    setDescription(r.description);
    if (r.tlds.length > 0) setTlds(r.tlds);
    setStyle(r.style || "none");
    setLengthPref(r.lengthPref || "none");
  };

  return (
    <main className="relative flex-1">
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
          {t("home.title2")}
        </h1>
        <p className="mt-4 text-center text-base text-txt1 md:text-lg">
          {t("home.subtitle")}
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-line-strong bg-bg2 shadow-[0_24px_48px_-24px_rgba(0,0,0,.5)] focus-within:border-brand-line">
          <textarea
            rows={3}
            className="w-full resize-none bg-transparent px-5 pb-2 pt-4 text-[15px] leading-relaxed outline-none"
            placeholder={t("home.placeholder")}
            value={description}
            maxLength={MAX_LEN}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
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
            <MiniSelect icon={Wand2} value={style} options={STYLE_OPTIONS} onChange={setStyle} />
            <MiniSelect icon={Ruler} value={lengthPref} options={LENGTH_OPTIONS} onChange={setLengthPref} />
            <div className="flex-1" />
            <span className="tnum hidden text-[11px] text-txt2 md:inline">
              {description.length > 0 && `${description.length}/${MAX_LEN} · `}⌘ Enter
            </span>
            <button
              disabled={!canRun}
              onClick={() => submit()}
              className="flex h-11 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 sm:h-9"
            >
              <Sparkles className="h-4 w-4" />
              {t("home.start")}
            </button>
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
                className="flex min-h-[32px] max-w-[240px] items-center truncate rounded-full border border-line bg-bg1 px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand"
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
              className="flex h-6 w-6 items-center justify-center rounded-full text-txt2 hover:text-txt0"
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
            {quickRows.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {quickRows.map((row) =>
                  row.status === "available" ? (
                    <span key={row.domain} className="inline-flex items-stretch overflow-hidden rounded-lg border border-brand-line bg-brand-dim font-mono text-xs text-brand">
                      <a
                        href={REGISTRARS[0].url(row.domain)}
                        target="_blank"
                        rel="noreferrer"
                        title={t("home.quickRegister", { domain: row.domain })}
                        className="inline-flex min-h-[44px] items-center gap-1.5 px-2.5 py-1.5 transition-opacity hover:opacity-85 sm:min-h-0"
                      >
                        {row.domain}
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
                  ) : (
                    <span
                      key={row.domain}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs",
                        row.status === "taken" && "border-line text-txt2 line-through",
                        row.status === "unknown" && "border-line text-txt1",
                        row.status === "checking" && "border-line text-txt2",
                      )}
                    >
                      {row.domain}
                      <i className="not-italic font-sans text-[10px]">{t(`status.${row.status}` as I18nKey)}</i>
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
              </div>
            )}
            {/* 心仪名字被注册：免费变体核验 + 一键转 AI 搜相似寓意的可注册名字 */}
            {!quickRunning && quickRows.length > 0 && quickRows.some((r) => r.status === "taken") && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {variantTotal === 0 && (
                  <button
                    onClick={() => void runVariantCheck()}
                    className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:h-8"
                  >
                    <SearchCheck className="h-3.5 w-3.5" />
                    {t("home.quickVariantsBtn", { n: (VARIANT_PREFIXES.length + 1) * (VARIANT_SUFFIXES.length + 1) - 1 })}
                  </button>
                )}
                <button
                  onClick={() => submit(t("home.quickAiDesc", { label: quick.label }))}
                  className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:h-8"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("home.quickAiCta")}
                </button>
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
                        <span key={row.domain} className="inline-flex items-stretch overflow-hidden rounded-lg border border-brand-line bg-brand-dim font-mono text-xs text-brand">
                          <a
                            href={REGISTRARS[0].url(row.domain)}
                            target="_blank"
                            rel="noreferrer"
                            title={t("home.quickRegister", { domain: row.domain })}
                            className="inline-flex min-h-[44px] items-center gap-1.5 px-2.5 py-1.5 transition-opacity hover:opacity-85 sm:min-h-0"
                          >
                            {row.domain}
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
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 行业模板 chips：点击填入描述模板，用户可再编辑后搜索；默认收起只显示前 10 个 */}
        <div className="mt-4">
          <p className="text-center text-[11px] text-txt2">{t("home.templates")}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {(showAllTemplates ? TEMPLATES : TEMPLATES.slice(0, 10)).map((tpl) => (
              <button
                key={tpl.labelZh}
                onClick={() => setDescription(lang === "zh" ? tpl.zh : tpl.en)}
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
                +{TEMPLATES.length - 10}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {(lang === "zh" ? EXAMPLES : EXAMPLES_EN).map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setDescription(ex);
                submit(ex);
              }}
              className="h-11 rounded-full border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:h-9"
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
                <p className="mt-2.5 text-xs leading-relaxed text-txt1">{t(`home.faq.a${i}` as I18nKey)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
