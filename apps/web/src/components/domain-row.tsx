import { useState } from "react";
import { Bookmark, BookmarkCheck, Check, Copy, ExternalLink, Lock } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { REGISTRARS } from "@/lib/registrars";
import { scoreBadgeClass, tldPrice, totalScore, type Row } from "@/types";
import { cn } from "@/lib/utils";

export function DomainName({ row, className }: { row: Row; className?: string }) {
  return (
    <span className={cn("truncate font-mono text-[15px] font-semibold", className)}>
      {row.label}
      <span className="text-txt2">.{row.tld}</span>
    </span>
  );
}

export function RegisterMenu({ domain, children }: { domain: string; children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {REGISTRARS.map((r) => (
          <DropdownMenuItem key={r.name} asChild>
            <a href={r.url(domain)} target="_blank" rel="noreferrer" className="flex w-full items-center justify-between gap-4">
              {r.name}
              <ExternalLink className="h-3.5 w-3.5 text-txt2" />
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CopyButton({ domain, className }: { domain: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      title="复制"
      className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md text-txt2 transition-colors hover:bg-bg3 hover:text-txt0", className)}
      onClick={async () => {
        await navigator.clipboard.writeText(domain);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function DomainRow({
  row,
  selected = false,
  animate = false,
  locked,
  onToggleLock,
  favorite,
  onToggleFavorite,
}: {
  row: Row;
  selected?: boolean;
  animate?: boolean;
  locked?: boolean;
  onToggleLock?: (domain: string) => void;
  favorite?: boolean;
  onToggleFavorite?: (row: Row) => void;
}) {
  const score = row.scores ? totalScore(row.scores) : undefined;

  if (row.status === "taken") {
    return (
      <div className="flex h-12 items-center gap-3 px-4 opacity-50">
        <span className="tnum w-8 shrink-0 rounded-md bg-taken-dim py-0.5 text-center font-mono text-xs text-taken">—</span>
        <span className="truncate font-mono text-[15px] text-taken line-through">{row.domain}</span>
        <span className="shrink-0 rounded bg-taken-dim px-1.5 py-0.5 text-[11px] text-taken">已注册</span>
      </div>
    );
  }

  if (row.status === "checking") {
    return (
      <div className="flex h-12 items-center gap-3 px-4">
        <span className="tnum w-8 shrink-0 rounded-md bg-amber2-dim py-0.5 text-center font-mono text-xs text-amber2">…</span>
        <DomainName row={row} />
        <span className="dot-breathe h-1.5 w-1.5 shrink-0 rounded-full bg-amber2" />
        <span className="hidden flex-1 truncate text-xs text-amber2 sm:block">RDAP 核验中…</span>
      </div>
    );
  }

  const isUnknown = row.status === "unknown";

  return (
    <div
      data-domain={row.domain}
      className={cn("flex h-12 items-center gap-2 px-4 sm:gap-3", animate && "fade-up", selected && "bg-bg2 shadow-[inset_2px_0_0_var(--brand)]")}
    >
      <span className={cn("tnum w-8 shrink-0 rounded-md py-0.5 text-center font-mono text-xs font-semibold", score !== undefined ? scoreBadgeClass(score) : "bg-bg3 text-txt1")}>
        {score ?? "—"}
      </span>
      <DomainName row={row} />
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", isUnknown ? "bg-amber2" : "bg-brand")} />
      {isUnknown && <span className="shrink-0 rounded bg-amber2-dim px-1.5 py-0.5 text-[11px] text-amber2">未知</span>}
      <span className="hidden flex-1 truncate text-xs text-txt1 sm:block">{row.meaning}</span>
      <span className="ml-auto sm:ml-0" />
      {tldPrice(row.tld) && <span className="tnum hidden shrink-0 font-mono text-xs text-txt2 md:block">{tldPrice(row.tld)}</span>}
      {onToggleLock && (
        <button
          title="锁定：再来一轮时围绕它找"
          aria-pressed={locked}
          className={cn("hidden h-8 w-8 shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3 sm:grid", locked ? "text-brand" : "text-txt2 hover:text-txt0")}
          onClick={() => onToggleLock(row.domain)}
        >
          <Lock className="h-3.5 w-3.5" />
        </button>
      )}
      <CopyButton domain={row.domain} className="hidden sm:grid" />
      {onToggleFavorite && (
        <button
          title={favorite ? "移出候选清单" : "收藏到候选清单"}
          aria-pressed={favorite}
          className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md transition-colors hover:bg-bg3", favorite ? "text-brand" : "text-txt2 hover:text-txt0")}
          onClick={() => onToggleFavorite(row)}
        >
          {favorite ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        </button>
      )}
      <RegisterMenu domain={row.domain}>
        <button className="h-8 shrink-0 rounded-md bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-80">
          去注册
        </button>
      </RegisterMenu>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex h-12 items-center gap-3 px-4">
      <span className="h-4 w-8 animate-pulse rounded-md bg-bg3" />
      <span className="h-4 w-32 animate-pulse rounded-md bg-bg3" />
      <span className="hidden h-3 w-48 animate-pulse rounded-md bg-bg2 sm:block" />
    </div>
  );
}
