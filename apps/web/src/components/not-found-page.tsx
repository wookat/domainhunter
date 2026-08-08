import { BookOpen, Globe, Scale, Tags } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { usePageTitle } from "@/lib/use-page-title";

/** 品牌 404 页：未知路径/未知 slug 的客户端兜底（HTTP 状态码与 noindex 由 worker 负责） */
export function NotFoundPage() {
  const { t, lang } = useI18n();
  usePageTitle(t("nf.title"));

  const links = [
    { href: `/tld?lang=${lang}`, label: t("hub.allTld"), icon: Globe },
    { href: `/guide?lang=${lang}`, label: t("hub.allGuide"), icon: BookOpen },
    { href: `/vs?lang=${lang}`, label: t("hub.allVs"), icon: Scale },
    { href: `/prices?lang=${lang}`, label: t("footer.prices"), icon: Tags },
  ];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center md:px-6">
      <p className="font-mono text-6xl font-bold tracking-tight text-brand">404</p>
      <h1 className="mt-4 text-xl font-semibold text-txt0">{t("nf.title")}</h1>
      <p className="mt-2 text-sm text-txt1">{t("nf.desc")}</p>
      <a
        href="/"
        className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-brand px-5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-strong"
      >
        {t("nf.home")}
      </a>
      <p className="mt-10 text-xs text-txt2">{t("nf.explore")}</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {links.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-bg1 px-4 text-sm text-txt1 transition-colors hover:border-brand-line hover:text-brand"
          >
            <Icon className="h-4 w-4" />
            {label}
          </a>
        ))}
      </div>
    </main>
  );
}
