import { useEffect, useState } from "react";
import { Brain, ChevronDown, Plus, Ruler, ShieldCheck, Sparkles, Wand2, Zap } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const EXAMPLES = ["独立开发者的 AI 周报工具", "宠物营养订阅电商", "极简冥想 App", "跨境 SaaS 数据看板"];
const EXAMPLES_EN = ["AI weekly-report tool for indie devs", "Pet nutrition subscription store", "Minimal meditation app", "Cross-border SaaS dashboard"];
const PRESET_TLDS = ["com", "cn", "io", "ai", "app", "dev"];
const MAX_LEN = 500;

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

export function HomePage({ initial, onSubmit }: { initial: HomeValues; onSubmit: (v: HomeValues) => void }) {
  const { t, lang } = useI18n();
  const [description, setDescription] = useState(initial.description);
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
