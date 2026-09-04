import type { AnchorHTMLAttributes, ReactNode } from "react";

import { trackOutbound, useAffiliateConfig } from "@/lib/affiliate";
import { useI18n } from "@/lib/i18n";
import { registrarLink, tldOf, type AffiliateConfig, type Registrar } from "@/lib/registrars";

/**
 * 所有"去注册"外链的唯一出口：href/rel 由 registrarLink() 决定（有返佣 → sponsored），
 * target=_blank、双语 title、点击时发 outbound 计数（不阻塞跳转）。
 */
export function RegistrarAnchor({
  registrar,
  domain,
  children,
  title,
  onClick,
  ...rest
}: { registrar: Registrar; domain: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel">) {
  const { t } = useI18n();
  const cfg = useAffiliateConfig();
  const link = registrarLink(registrar, domain, cfg);
  return (
    <a
      {...rest}
      href={link.href}
      target="_blank"
      rel={link.rel}
      title={title ?? t("registrar.openTitle", { registrar: registrar.name, domain })}
      onClick={(e) => {
        trackOutbound(registrar.id, tldOf(domain));
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}

/** 非 <a> 场景（键盘 Enter、批量注册）：先计数再新窗口打开 */
export function openRegistrar(registrar: Registrar, domain: string, cfg: AffiliateConfig | undefined): void {
  trackOutbound(registrar.id, tldOf(domain));
  window.open(registrarLink(registrar, domain, cfg).href, "_blank", "noopener,noreferrer");
}
