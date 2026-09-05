import { AlertTriangle, ExternalLink, FileText, HelpCircle, Landmark, Lightbulb, Quote, SearchCheck, Sparkles } from "lucide-react";

import { COMPARE_SLUGS, compareLabel } from "@/content/compare-slugs";
import { GUIDE_LABELS } from "@/content/guide-labels";
import { relatedGuideSlugs } from "@/content/guide-groups";
import { buildGuideFaq } from "@/content/guide-faq";
import { readInjectedContent } from "@/content/injected";
import { Breadcrumb } from "@/components/breadcrumb";
import { NotFoundPage } from "@/components/not-found-page";
import { SiteLinks } from "@/components/site-links";
import { useI18n } from "@/lib/i18n";
import { priceShort, usePrices } from "@/lib/prices";
import { usePageTitle } from "@/lib/use-page-title";
import { cn } from "@/lib/utils";

export function GuidePage({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const content = readInjectedContent("guide", slug);
  const guide = content?.guide;
  usePageTitle(guide?.[lang].title);

  if (!content || !guide) return <NotFoundPage />;

  const loc = guide[lang];
  const compliance = guide.kind === "compliance";
  const faq = buildGuideFaq(guide, lang);
  const relatedCompares = [...new Set(guide.tlds.flatMap((rec) => COMPARE_SLUGS.filter((s) => s.split("-vs-").includes(rec.tld))))].slice(0, 4);
  const relatedIndustry = relatedGuideSlugs(slug).map((s) => GUIDE_LABELS.find((g) => g.slug === s)).filter((g): g is (typeof GUIDE_LABELS)[number] => g !== undefined);
  const cta = loc.cta ?? { title: t("guide.ctaTitle"), desc: t("guide.ctaDesc"), button: t("guide.ctaButton") };
  const ctaHref = compliance ? `/?mode=exact&lang=${lang}` : `/?tpl=${slug}`;
  const CtaIcon = compliance ? SearchCheck : Sparkles;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <Breadcrumb hub="guide" current={loc.label} />
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{loc.title}</h1>

      <p className="mt-6 text-[15px] leading-relaxed text-txt1">{loc.intro}</p>

      {compliance ? (
        /* 合规/流程指南：分节正文（小标题 + 段落 + 要点） */
        (loc.sections ?? []).map((sec) => (
          <section key={sec.heading}>
            <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
              <FileText className="h-4 w-4 shrink-0 text-brand" />
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p) => (
              <p key={p} className="mt-3 text-sm leading-relaxed text-txt1">
                {p}
              </p>
            ))}
            {sec.bullets && (
              <ul className="mt-3 space-y-2">
                {sec.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm leading-relaxed text-txt1">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))
      ) : (
        <>
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
        </>
      )}

      {/* 推荐/相关 TLD：链接到对应 /tld/ 指南页 */}
      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <Sparkles className="h-4 w-4 text-brand" />
        {t(compliance ? "guide.relatedTlds" : "guide.tlds")}
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
        {t(compliance ? "guide.notes" : "guide.pitfalls")}
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

      {/* 官方依据：合规指南的一手文档外链 */}
      {loc.sources && loc.sources.length > 0 && (
        <>
          <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
            <Landmark className="h-4 w-4 text-brand" />
            {t("guide.sources")}
          </h2>
          <ul className="mt-3 space-y-2">
            {loc.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-sm leading-relaxed text-txt1 underline decoration-line underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-txt2" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* CTA：行业指南预填模板猎名；合规指南直达精确核验（零 AI） */}
      <div className="mt-10 rounded-2xl border border-brand-line bg-brand-dim p-6 text-center">
        <h2 className="text-lg font-bold">{cta.title}</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-txt1">{cta.desc}</p>
        <a
          href={ctaHref}
          className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
        >
          <CtaIcon className="h-4 w-4" />
          {cta.button}
        </a>
      </div>

      {/* 其他行业指南互链 */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold text-txt1">{t("guide.others")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {content.guideLinks.map((other) => (
            <a
              key={other.slug}
              href={`/guide/${other.slug}?lang=${lang}`}
              className={cn(
                "flex min-h-[44px] items-center rounded-lg border px-3 text-xs transition-colors",
                other.slug === slug ? "border-brand-line bg-brand-dim font-semibold text-brand" : "border-line text-txt1 hover:border-brand-line hover:text-brand",
              )}
            >
              {other[lang]}
            </a>
          ))}
        </div>
      </div>

      {/* 同组相关指南互链 */}
      {relatedIndustry.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-txt1">{t(compliance ? "guide.relatedCompliance" : "guide.related")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedIndustry.map((g) => (
              <a
                key={g.slug}
                href={`/guide/${g.slug}?lang=${lang}`}
                className="flex min-h-[44px] items-center rounded-lg border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand"
              >
                {g[lang]}
              </a>
            ))}
          </div>
        </div>
      )}
      <SiteLinks />
    </main>
  );
}
