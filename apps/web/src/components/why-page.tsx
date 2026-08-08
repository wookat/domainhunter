import { Check, Crosshair, Minus, Sparkles, X } from "lucide-react";

import { COMPARE_SLUGS } from "@/content/compare-slugs";
import { GUIDE_LABELS } from "@/content/guide-labels";
import { TLD_LIST } from "@/content/tld-list";
import { useI18n } from "@/lib/i18n";

const N_TLD = TLD_LIST.length;
const N_GUIDE = GUIDE_LABELS.length;
const N_COMPARE = COMPARE_SLUGS.length;

interface WhyCopy {
  kicker: string;
  title: string;
  intro: string;
  painTitle: string;
  pains: string[];
  approachTitle: string;
  steps: { title: string; desc: string }[];
  capsTitle: string;
  capsIntro: string;
  caps: { title: string; desc: string }[];
  tableTitle: string;
  tableNote: string;
  cols: string[];
  rows: { feature: string; cells: ("yes" | "no" | "partial")[] }[];
  cta: string;
  ctaDesc: string;
}

const COPY: Record<"zh" | "en", WhyCopy> = {
  zh: {
    kicker: "为什么选 DomainHunter",
    title: "好域名都被占了？换个找法。",
    intro:
      "想一个好名字要很久，好不容易想出来一查——已被注册。传统域名查询只会告诉你「被占了」，再甩给你一堆机械拼接的相似名；AI 起名工具会起名却不核验，给你一堆注册不了的空欢喜。DomainHunter 把两件事在一个 Agent 闭环里做完。",
    painTitle: "为什么自己想域名这么难",
    pains: [
      "想很久才憋出一个名字，一查已被注册，循环往复",
      "查询工具只显示相似名（加数字、换后缀），没有品牌感",
      "AI 起名工具批量起名但不核验，选中的名字十有八九注册不了",
      "ChatGPT 能起名，但它不知道哪些名字真的可注册",
    ],
    approachTitle: "DomainHunter 的做法：理解寓意 → 多轮反思 → 只给可注册的",
    steps: [
      { title: "说出寓意，四路线构思", desc: "用一句自然语言描述你的想法、风格与场景，AI 沿拼音、现成英文词、英文造词、拼音英文混合四条命名路线并行构思，拼音候选还会经确定性拼读校验，剔除读不顺口的。" },
      { title: "Agent 多轮反思", desc: "每一批候选都实时核验（RDAP + DNS + WHOIS 三级），被注册的自动排除并跨轮去重，反馈给下一轮换思路再猎；不喜欢的名字点踩，AI 会避开同类。" },
      { title: "直到凑够真正可注册的", desc: "循环持续到凑够一批可立刻注册的好名字，逐个四维评分（长度/读感/寓意/品牌感），收藏、对比、一键去注册。" },
    ],
    capsTitle: "不止猎名：一整条域名工具链",
    capsIntro: "上线后持续迭代，现在的 DomainHunter 是猎名 + 核验 + 决策 + 跟进的完整工具链：",
    caps: [
      { title: `${N_TLD} 个 TLD 实时核验 + 比价`, desc: "RDAP + DNS + WHOIS 三级核验，注册/续费价格逐一比价，直达注册商。" },
      { title: "快速核验与批量核验", desc: "现成名字即输即查，或整批粘贴一次核验，不消耗 AI 次数、不限量。" },
      { title: "域名到期监控", desc: "心仪但被占的域名一键加监控，在 /monitors 统一管理，释放即知。" },
      { title: "收藏 / 分享 / 导出", desc: "候选收藏成清单，生成可撤销的分享链接，或导出 CSV 继续加工。" },
      { title: `${N_GUIDE} 篇行业指南 + ${N_COMPARE} 篇 TLD 对比`, desc: "各行业怎么起名、后缀怎么选，指南与对比页直接给结论。" },
      { title: "MCP server（3 个工具）", desc: "把域名核验、TLD 比价、变体建议接进你自己的 AI Agent；网页端支持 PWA 安装。" },
    ],
    tableTitle: "和其他找名字的方式比",
    tableNote: "对比对象为常见工具类型的典型能力，具体产品各有差异。",
    cols: ["传统域名查询", "AI 起名工具", "直接问 ChatGPT", "DomainHunter"],
    rows: [
      { feature: "理解自然语言寓意", cells: ["no", "partial", "yes", "yes"] },
      { feature: "实时核验可注册状态", cells: ["yes", "no", "no", "yes"] },
      { feature: "被占后多轮反思再猎", cells: ["no", "no", "partial", "yes"] },
      { feature: "只呈现真正可注册的名字", cells: ["partial", "no", "no", "yes"] },
      { feature: "中文语境与拼音语感", cells: ["no", "partial", "partial", "yes"] },
      { feature: "评分 / 收藏 / 分享 / CSV 导出", cells: ["partial", "no", "no", "yes"] },
      { feature: "监控与工具链（到期监控 / 比价 / MCP）", cells: ["partial", "no", "no", "yes"] },
      { feature: "免费 + 开源", cells: ["partial", "no", "partial", "yes"] },
    ],
    cta: "描述你的想法，开始猎取",
    ctaDesc: "免费、开源、无需登录；AI 搜索每小时限次，即输即查不限量。",
  },
  en: {
    kicker: "Why DomainHunter",
    title: "All the good names are taken? Hunt differently.",
    intro:
      "You spend ages coming up with a name, check it — taken. Traditional domain search just says \"taken\" and dumps mechanical look-alikes on you; AI name generators invent names but never verify them, so most are unregistrable. DomainHunter closes both gaps in one agent loop.",
    painTitle: "Why finding a name yourself is so hard",
    pains: [
      "Every name you think of turns out to be registered — over and over",
      "Search tools only show look-alikes (digits appended, TLD swapped) with zero brand feel",
      "AI generators produce names in bulk but never check availability",
      "ChatGPT can brainstorm, but it has no idea which names are actually registrable",
    ],
    approachTitle: "Our approach: understand the meaning → reflect over rounds → only registrable names",
    steps: [
      { title: "Describe the meaning, four naming routes", desc: "One natural-language sentence about your idea, style and scene. The AI brainstorms along four parallel routes — pinyin, real English words, coined words and pinyin-English blends — and pinyin candidates pass a deterministic readability check." },
      { title: "An agent that reflects", desc: "Every batch is verified live (RDAP + DNS + WHOIS). Taken names are excluded and deduplicated across rounds, then fed back; the agent reflects and hunts again with a new angle. Downvote a name and the AI avoids that style." },
      { title: "Until there are enough you can register", desc: "The loop keeps going until there's a batch you can register right now — each scored on length, readability, relevance and brandability, ready to shortlist, compare and register." },
    ],
    capsTitle: "More than hunting: a full domain toolchain",
    capsIntro: "Iterated continuously since launch, DomainHunter is now a complete toolchain — hunt, verify, decide and follow up:",
    caps: [
      { title: `${N_TLD} TLDs verified live + price comparison`, desc: "Three-tier RDAP + DNS + WHOIS verification, registration/renewal prices compared per TLD, direct registrar links." },
      { title: "Instant & bulk checks", desc: "Check a ready-made name as you type, or paste a whole batch — unlimited and no AI quota used." },
      { title: "Domain expiry monitoring", desc: "One click to watch a taken name you love; manage all watches at /monitors and know the moment it drops." },
      { title: "Shortlist / share / export", desc: "Save candidates to a shortlist, create revocable share links, or export to CSV." },
      { title: `${N_GUIDE} industry guides + ${N_COMPARE} TLD comparisons`, desc: "How each industry names things and which TLD to pick — guides and comparison pages with direct answers." },
      { title: "MCP server (3 tools)", desc: "Plug domain checks, TLD prices and variant suggestions into your own AI agent; the web app installs as a PWA." },
    ],
    tableTitle: "Compared with other ways to find a name",
    tableNote: "Comparison reflects typical capabilities of each tool category; individual products vary.",
    cols: ["Classic domain search", "AI name generators", "Asking ChatGPT", "DomainHunter"],
    rows: [
      { feature: "Understands natural-language meaning", cells: ["no", "partial", "yes", "yes"] },
      { feature: "Live availability verification", cells: ["yes", "no", "no", "yes"] },
      { feature: "Multi-round reflection when names are taken", cells: ["no", "no", "partial", "yes"] },
      { feature: "Only shows truly registrable names", cells: ["partial", "no", "no", "yes"] },
      { feature: "Chinese semantics & pinyin flavor", cells: ["no", "partial", "partial", "yes"] },
      { feature: "Scoring / shortlist / share / CSV export", cells: ["partial", "no", "no", "yes"] },
      { feature: "Monitoring & toolchain (expiry watch / prices / MCP)", cells: ["partial", "no", "no", "yes"] },
      { feature: "Free + open source", cells: ["partial", "no", "partial", "yes"] },
    ],
    cta: "Describe your idea and start hunting",
    ctaDesc: "Free, open source, no login. AI search is rate-limited hourly; instant checks are unlimited.",
  },
};

function Cell({ v }: { v: "yes" | "no" | "partial" }) {
  if (v === "yes") return <Check className="mx-auto h-4 w-4 text-brand" aria-label="yes" />;
  if (v === "no") return <X className="mx-auto h-4 w-4 text-txt2/70" aria-label="no" />;
  return <Minus className="mx-auto h-4 w-4 text-amber-500" aria-label="partial" />;
}

export function WhyPage() {
  const { lang } = useI18n();
  const c = COPY[lang];
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <p className="flex items-center gap-1.5 font-mono text-sm text-brand">
        <Crosshair className="h-4 w-4" />
        {c.kicker}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{c.title}</h1>
      <p className="mt-4 leading-relaxed text-txt1">{c.intro}</p>

      <h2 className="mt-10 text-xl font-bold">{c.painTitle}</h2>
      <ul className="mt-3 space-y-2">
        {c.pains.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm leading-relaxed text-txt1">
            <X className="mt-0.5 h-4 w-4 shrink-0 text-txt2/70" />
            {p}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-bold">{c.approachTitle}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {c.steps.map((s, i) => (
          <div key={s.title} className="rounded-xl border border-line bg-bg1 p-4">
            <p className="font-mono text-xs text-brand">0{i + 1}</p>
            <p className="mt-1 text-sm font-semibold">{s.title}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-txt1">{s.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold">{c.capsTitle}</h2>
      <p className="mt-2 text-sm leading-relaxed text-txt1">{c.capsIntro}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {c.caps.map((f) => (
          <div key={f.title} className="rounded-xl border border-line bg-bg1 p-4">
            <p className="flex items-start gap-2 text-sm font-semibold">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {f.title}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-txt1">{f.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold">{c.tableTitle}</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line bg-bg1 text-left">
              <th className="px-3 py-2.5 text-xs font-semibold text-txt1"></th>
              {c.cols.map((col, i) => (
                <th key={col} className={`whitespace-nowrap px-3 py-2.5 text-center text-xs font-semibold ${i === c.cols.length - 1 ? "text-brand" : "text-txt1"}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.feature} className="border-b border-line/60 last:border-0">
                <td className="px-3 py-2.5 text-[13px] text-txt1">{r.feature}</td>
                {r.cells.map((v, i) => (
                  <td key={i} className={`px-3 py-2.5 text-center ${i === r.cells.length - 1 ? "bg-brand-dim/20" : ""}`}>
                    <Cell v={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-txt2">{c.tableNote}</p>

      <div className="mt-12 rounded-xl border border-brand-line/60 bg-brand-dim/30 p-6 text-center">
        <a
          href={`/?lang=${lang}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          {c.cta}
        </a>
        <p className="mt-3 text-xs text-txt2">{c.ctaDesc}</p>
      </div>
    </main>
  );
}
