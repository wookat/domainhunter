import { AlertTriangle, HelpCircle, Lightbulb, Quote, Sparkles } from "lucide-react";

import { COMPARE_SLUGS, compareLabel } from "@/content/compare-slugs";
import { buildGuideFaq } from "@/content/guide-faq";
import { GUIDE_LIST, INDUSTRY_GUIDES } from "@/content/guides";
import { useI18n } from "@/lib/i18n";
import { priceShort, usePrices } from "@/lib/prices";
import { usePageTitle } from "@/lib/use-page-title";
import { cn } from "@/lib/utils";

export function GuidePage({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const guide = INDUSTRY_GUIDES[slug];
  usePageTitle(guide?.[lang].title);

  if (!guide) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center md:px-6">
        <p className="text-sm text-txt1">{t("guide.notFound")}</p>
        <a href="/" className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink">
          {t("share.goHome")}
        </a>
      </main>
    );
  }

  const loc = guide[lang];
  const faq = buildGuideFaq(guide, lang);
  const relatedCompares = [...new Set(guide.tlds.flatMap((rec) => COMPARE_SLUGS.filter((s) => s.split("-vs-").includes(rec.tld))))].slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <p className="font-mono text-sm text-brand">
        <a href={`/guide?lang=${lang}`} className="text-txt2 hover:text-brand hover:underline">
          {t("hub.allGuide")}
        </a>
        <span className="mx-1.5 text-txt2">/</span>
        {loc.label}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{loc.title}</h1>

      <p className="mt-6 text-[15px] leading-relaxed text-txt1">{loc.intro}</p>

      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <Lightbulb className="h-4 w-4 text-gold" />
        {t("guide.ideas")}
      </h2>
      <ul className="mt-3 space-y-2">
        {loc.namingIdeas.map((idea) => (
          <li key={idea} className="flex gap-2 text-sm leading-relaxed text-txt1">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
            {idea}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <Quote className="h-4 w-4 text-brand" />
        {t("guide.cases")}
      </h2>
      <div className="mt-3 space-y-2.5">
        {loc.cases.map((c) => (
          <div key={c.name} className="rounded-lg border border-line bg-bg1 px-3.5 py-2.5">
            <p className="font-mono text-sm font-semibold text-txt0">{c.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-txt1">{c.takeaway}</p>
          </div>
        ))}
      </div>

      {/* 推荐 TLD：链接到对应 /tld/ 指南页 */}
      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <Sparkles className="h-4 w-4 text-brand" />
        {t("guide.tlds")}
      </h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {guide.tlds.map((rec) => (
          <a
            key={rec.tld}
            href={`/tld/${rec.tld}?lang=${lang}`}
            className="flex min-h-[44px] flex-col justify-center rounded-lg border border-line bg-bg1 px-3.5 py-2.5 transition-colors hover:border-brand-line"
          >
            <span className="font-mono text-sm font-semibold text-brand">
              .{rec.tld}
              {priceShort(rec.tld, lang, prices) && <span className="tnum ml-1.5 text-[10px] font-normal text-txt2">{priceShort(rec.tld, lang, prices)}</span>}
            </span>
            <span className="mt-0.5 text-xs leading-relaxed text-txt1">{rec[lang]}</span>
          </a>
        ))}
      </div>

      {/* 相关后缀对比互链 */}
      {relatedCompares.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-txt1">{t("vs.relatedCompares")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedCompares.map((cmpSlug) => (
              <a
                key={cmpSlug}
                href={`/vs/${cmpSlug}?lang=${lang}`}
                className="flex min-h-[44px] items-center rounded-lg border border-line px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand"
              >
                {compareLabel(cmpSlug)}
              </a>
            ))}
          </div>
        </div>
      )}

      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        {t("guide.pitfalls")}
      </h2>
      <ul className="mt-3 space-y-2">
        {loc.pitfalls.map((p) => (
          <li key={p} className="flex gap-2 text-sm leading-relaxed text-txt1">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-destructive" />
            {p}
          </li>
        ))}
      </ul>

      {/* FAQ：与 worker SSR 的 FAQPage JSON-LD 同源（buildGuideFaq） */}
      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <HelpCircle className="h-4 w-4 text-brand" />
        {t("tld.faq")}
      </h2>
      <div className="mt-3 space-y-2">
        {faq.map((item) => (
          <details key={item.q} className="group rounded-xl border border-line bg-bg1 px-4 py-3">
            <summary className="flex min-h-[28px] cursor-pointer list-none items-center text-sm font-semibold text-txt0 [&::-webkit-details-marker]:hidden">
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-txt1">{item.a}</p>
          </details>
        ))}
      </div>

      {/* CTA：预填该行业模板的猎名入口 */}
      <div className="mt-10 rounded-2xl border border-brand-line bg-brand-dim p-6 text-center">
        <h2 className="text-lg font-bold">{t("guide.ctaTitle")}</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-txt1">{t("guide.ctaDesc")}</p>
        <a
          href={`/?tpl=${slug}`}
          className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          {t("guide.ctaButton")}
        </a>
      </div>

      {/* 其他行业指南互链 */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold text-txt1">{t("guide.others")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {GUIDE_LIST.map((other) => (
            <a
              key={other}
              href={`/guide/${other}?lang=${lang}`}
              className={cn(
                "flex min-h-[44px] items-center rounded-lg border px-3 text-xs transition-colors",
                other === slug ? "border-brand-line bg-brand-dim font-semibold text-brand" : "border-line text-txt1 hover:border-brand-line hover:text-brand",
              )}
            >
              {INDUSTRY_GUIDES[other][lang].label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
