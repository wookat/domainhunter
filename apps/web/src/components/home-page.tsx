import { useEffect, useRef, useState } from "react";
import { ArrowRight, Brain, ChevronDown, ExternalLink, Loader2, Plus, Ruler, SearchCheck, ShieldCheck, Sparkles, Wand2, Zap } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { REGISTRARS } from "@/lib/registrars";
import { cn } from "@/lib/utils";

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
];

/** /?tpl=<slug> 预填行业模板（行业命名指南页 CTA 入口）；slug 对不上忽略 */
function templateFromQuery(lang: string): string {
  const q = new URLSearchParams(window.location.search).get("tpl")?.trim().toLowerCase();
  const tpl = q ? TEMPLATES.find((x) => x.slug === q) : undefined;
  return tpl ? (lang === "zh" ? tpl.zh : tpl.en) : "";
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

export function HomePage({ initial, onSubmit, onBackToResults }: { initial: HomeValues; onSubmit: (v: HomeValues) => void; onBackToResults?: () => void }) {
  const { t, lang } = useI18n();
  const [description, setDescription] = useState(() => initial.description || templateFromQuery(lang));
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
  const [style, setStyle] = useState(initial.style || "none");
  const [lengthPref, setLengthPref] = useState(initial.lengthPref || "none");
  const [customTld, setCustomTld] = useState("");
  const [showCustom, setShowCustom] = useState(false);

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
  const quickAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // 输入变化后清空上次快速核验结果
    quickAbortRef.current?.abort();
    setQuickRows([]);
    setQuickRunning(false);
  }, [description]);

  async function runQuickCheck() {
    if (!quick) return;
    const checkTlds = quick.tld ? [quick.tld, ...tlds.filter((t) => t !== quick.tld)] : tlds;
    if (checkTlds.length === 0) return;
    quickAbortRef.current?.abort();
    const ac = new AbortController();
    quickAbortRef.current = ac;
    setQuickRows(checkTlds.map((t) => ({ domain: `${quick.label}.${t}`, status: "checking" as const })));
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

  const submit = (desc = description) => {
    if (!desc.trim() || tlds.length === 0) return;
    onSubmit({
      description: desc.trim(),
      tlds,
      style: style === "none" ? "" : style,
      lengthPref: lengthPref === "none" ? "" : lengthPref,
    });
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
                    <a
                      key={row.domain}
                      href={REGISTRARS[0].url(row.domain)}
                      target="_blank"
                      rel="noreferrer"
                      title={t("home.quickRegister", { domain: row.domain })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-brand-line bg-brand-dim px-2.5 py-1.5 font-mono text-xs text-brand transition-opacity hover:opacity-85"
                    >
                      {row.domain}
                      <i className="not-italic font-sans text-[10px]">{t("status.available")}</i>
                      <ExternalLink className="h-3 w-3" />
                    </a>
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
              </div>
            )}
            {/* 心仪名字被注册：一键转 AI 搜相似寓意的可注册名字 */}
            {!quickRunning && quickRows.length > 0 && quickRows.some((r) => r.status === "taken") && (
              <button
                onClick={() => submit(t("home.quickAiDesc", { label: quick.label }))}
                className="mt-2.5 inline-flex h-11 items-center gap-1.5 rounded-lg border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:h-8"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t("home.quickAiCta")}
              </button>
            )}
          </div>
        )}

        {/* 行业模板 chips：点击填入描述模板，用户可再编辑后搜索 */}
        <div className="mt-4">
          <p className="text-center text-[11px] text-txt2">{t("home.templates")}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.labelZh}
                onClick={() => setDescription(lang === "zh" ? tpl.zh : tpl.en)}
                className="h-11 rounded-full border border-brand-line/60 bg-brand-dim/30 px-3 text-xs text-brand transition-colors hover:border-brand-line hover:bg-brand-dim sm:h-8"
              >
                {lang === "zh" ? tpl.labelZh : tpl.labelEn}
              </button>
            ))}
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
      </div>
    </main>
  );
}
