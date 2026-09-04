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
    title: "中文创业者的域名猎手：用中文说寓意，猎到真正可注册的 .cn / .com",
    intro:
      "英文通用场景里，Instant Domain Search、Namelix 这类工具已经很好用——我们不在那里争。DomainHunter 专注一件事：中文创业者、独立开发者与出海团队用中文描述寓意，AI 沿拼音、英文、拼音英文混搭多路构思，每个候选实时核验 .cn / .com.cn / .com 等后缀的注册状态，附到期日与价格，只给你能立刻注册的。",
    painTitle: "为什么中文创业者找域名格外难",
    pains: [
      "英文域名工具按关键词与英文词表拼接，不会把中文寓意翻成拼音或英文去想名字",
      "AI 起名工具会起名却不核验，短拼音名大多已被占，选中的往往注册不了",
      "查 .cn / .com.cn 要去注册商逐个搜，被占的不知道何时到期、能不能等",
      "一批候选想同时看 .cn 和 .com 的状态与价格，只能开一堆标签页手动对",
    ],
    approachTitle: "DomainHunter 的做法：中文寓意 → 拼音 / 英文 / 混搭 → 只给可注册的",
    steps: [
      { title: "用中文说寓意，四路线构思", desc: "一句中文描述想法、风格与场景，AI 沿拼音、现成英文词、英文造词、拼音英文混搭四条命名路线并行构思，拼音候选还会经确定性拼读校验，剔除读不顺口的。" },
      { title: "逐个实时核验，被占的排除", desc: "每一批候选都实时核验（RDAP + DNS + WHOIS 三级）：.cn / .com.cn 直查 CNNIC WHOIS，.com 等直查注册局 RDAP；被注册的自动排除并跨轮去重，反馈给下一轮换思路再猎。" },
      { title: "直到凑够真正可注册的", desc: "循环持续到凑够一批可立刻注册的好名字，逐个四维评分（长度/读感/寓意/品牌感），附注册商实时价或人民币参考价，收藏、对比、一键去注册。" },
    ],
    capsTitle: "不止猎名：从核验到捡漏的一整条工具链",
    capsIntro: "以下能力均可在生产环境实测（/api/check 返回注册局状态与到期日；/advanced 批量核验；/monitors 到期监控）：",
    caps: [
      { title: "可注册状态与注册局一致", desc: ".cn / .com.cn 查 CNNIC WHOIS，.com 等查注册局 RDAP，再用 DNS 交叉核验；不靠词表猜、不看过期缓存，可注册结果 1 小时内重新核验。" },
      { title: "到期日与价格一并给出", desc: "被占域名显示注册局返回的到期日；可注册的显示注册商实时注册/续费价，.cn 等无实时价的给出人民币参考价，直达注册商。" },
      { title: "批量核验与到期监控", desc: "整批粘贴一次核验最多 200 个、导出 CSV，不消耗 AI 次数；心仪但被占的一键加监控，每 6 小时自动复查，在 /monitors 统一查看掉落动态。" },
      { title: `${N_TLD} 个 TLD 实时核验 + 比价`, desc: "即输即查默认覆盖 com/cn/io/ai/app/dev 等，点「查更多后缀」扩展到全部 TLD，注册/续费价格逐一比价。" },
      { title: `${N_GUIDE} 篇行业指南 + ${N_COMPARE} 篇 TLD 对比`, desc: "各行业怎么起名、.cn 和 .com 怎么选，指南与对比页直接给结论。" },
      { title: "MCP server（3 个工具）", desc: "把域名核验、TLD 比价、变体建议接进你自己的 AI Agent；网页端支持 PWA 安装。" },
    ],
    tableTitle: "和其他找名字的方式比：我们强在哪、弱在哪",
    tableNote: "对比对象为常见工具类型的典型能力，具体产品各有差异；英文通用起名不是我们的主场，如实标出。",
    cols: ["英文域名搜索工具", "AI 起名工具", "直接问 ChatGPT", "DomainHunter"],
    rows: [
      { feature: "理解中文寓意，沿拼音 / 混搭构思", cells: ["no", "partial", "partial", "yes"] },
      { feature: "英文通用起名（词表 / 品牌感）", cells: ["yes", "yes", "yes", "partial"] },
      { feature: "实时核验可注册状态", cells: ["yes", "no", "no", "yes"] },
      { feature: ".cn / .com.cn 直查 CNNIC", cells: ["partial", "no", "no", "yes"] },
      { feature: "被占域名显示到期日", cells: ["partial", "no", "no", "yes"] },
      { feature: "被占后多轮反思再猎", cells: ["no", "no", "partial", "yes"] },
      { feature: "批量核验 / CSV 导出 / 到期监控", cells: ["partial", "no", "no", "yes"] },
      { feature: "免费 + 开源", cells: ["partial", "no", "partial", "yes"] },
    ],
    cta: "用中文描述你的想法，开始猎取",
    ctaDesc: "免费、开源、无需登录；AI 搜索每小时限次，即输即查与批量核验不限量。",
  },
  en: {
    kicker: "Why DomainHunter",
    title: "A domain hunter for Chinese founders: name it in Chinese, register it in .cn / .com",
    intro:
      "For generic English naming, tools like Instant Domain Search and Namelix are already excellent — we don't compete there. DomainHunter does one thing: Chinese founders, indie developers and teams going global describe the meaning in Chinese (or English), AI brainstorms pinyin, English and pinyin-English blends, and every candidate is verified live across .cn / .com.cn / .com and more, with expiry dates and prices — only names you can register right now.",
    painTitle: "Why finding a domain is extra hard for Chinese founders",
    pains: [
      "English domain tools combine keywords and English word lists — they don't turn Chinese meaning into pinyin or English names",
      "AI name generators invent names without verifying them; short pinyin names are mostly taken already",
      ".cn / .com.cn checks mean searching registrars one by one, with no idea when a taken name expires",
      "Comparing .cn and .com status and prices for a batch of candidates means a pile of browser tabs",
    ],
    approachTitle: "Our approach: Chinese meaning → pinyin / English / blends → only registrable names",
    steps: [
      { title: "Describe the meaning, four naming routes", desc: "One sentence in Chinese or English about your idea, style and scene. The AI brainstorms along four parallel routes — pinyin, real English words, coined words and pinyin-English blends — and pinyin candidates pass a deterministic readability check." },
      { title: "Verify each one live, drop what's taken", desc: "Every batch is verified live (RDAP + DNS + WHOIS): .cn / .com.cn against CNNIC WHOIS, .com and others against registry RDAP. Taken names are excluded and deduplicated across rounds, then fed back so the agent hunts again with a new angle." },
      { title: "Until there are enough you can register", desc: "The loop keeps going until there's a batch you can register right now — each scored on length, readability, relevance and brandability, with live registrar prices or RMB reference prices, ready to shortlist, compare and register." },
    ],
    capsTitle: "More than hunting: from verification to drop-catching",
    capsIntro: "Everything below can be exercised on production (/api/check returns registry status and expiry; /advanced for bulk checks; /monitors for expiry watches):",
    caps: [
      { title: "Availability matches the registry", desc: ".cn / .com.cn against CNNIC WHOIS, .com and others against registry RDAP, cross-checked with DNS. No word-list guessing, no stale cache — available results are re-verified within the hour." },
      { title: "Expiry dates and prices, together", desc: "Taken names show the registry's expiry date; available names show live registrar registration/renewal prices, with RMB reference prices for TLDs like .cn, plus direct registrar links." },
      { title: "Bulk checks and drop monitoring", desc: "Paste up to 200 names for one bulk check and export CSV without using AI quota; watch a taken name you love — rechecked every 6 hours, with drops logged at /monitors." },
      { title: `${N_TLD} TLDs verified live + price comparison`, desc: "Instant check covers com/cn/io/ai/app/dev and more by default, expands to every TLD via “more TLDs”, with registration/renewal prices compared per TLD." },
      { title: `${N_GUIDE} industry guides + ${N_COMPARE} TLD comparisons`, desc: "How each industry names things and how to choose between .cn and .com — guides and comparison pages with direct answers." },
      { title: "MCP server (3 tools)", desc: "Plug domain checks, TLD prices and variant suggestions into your own AI agent; the web app installs as a PWA." },
    ],
    tableTitle: "Compared with other ways to find a name — where we're stronger and weaker",
    tableNote: "Comparison reflects typical capabilities of each tool category; individual products vary. Generic English naming is not our home turf, and we say so.",
    cols: ["English domain search", "AI name generators", "Asking ChatGPT", "DomainHunter"],
    rows: [
      { feature: "Understands Chinese meaning; pinyin / blend routes", cells: ["no", "partial", "partial", "yes"] },
      { feature: "Generic English naming (word lists / brand feel)", cells: ["yes", "yes", "yes", "partial"] },
      { feature: "Live availability verification", cells: ["yes", "no", "no", "yes"] },
      { feature: ".cn / .com.cn checked against CNNIC", cells: ["partial", "no", "no", "yes"] },
      { feature: "Expiry date shown for taken names", cells: ["partial", "no", "no", "yes"] },
      { feature: "Multi-round reflection when names are taken", cells: ["no", "no", "partial", "yes"] },
      { feature: "Bulk checks / CSV export / expiry monitoring", cells: ["partial", "no", "no", "yes"] },
      { feature: "Free + open source", cells: ["partial", "no", "partial", "yes"] },
    ],
    cta: "Describe your idea in Chinese or English and start hunting",
    ctaDesc: "Free, open source, no login. AI search is rate-limited hourly; instant and bulk checks are unlimited.",
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
