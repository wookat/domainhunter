import { useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScoreRing } from "@/components/score-ring";
import { StatusBadge } from "@/components/status-badge";
import { scoreColor, totalScore, type Row } from "@/types";
import { cn } from "@/lib/utils";

const REGISTRARS = [
  { name: "阿里云", url: (d: string) => `https://wanwang.aliyun.com/domain/searchresult/#/?keyword=${encodeURIComponent(d)}` },
  { name: "腾讯云", url: (d: string) => `https://buy.cloud.tencent.com/domain?domain=${encodeURIComponent(d)}` },
  { name: "Namecheap", url: (d: string) => `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(d)}` },
  { name: "Cloudflare", url: (d: string) => `https://domains.cloudflare.com/?domain=${encodeURIComponent(d)}` },
];

const DIMENSIONS: { key: keyof NonNullable<Row["scores"]>; label: string }[] = [
  { key: "length", label: "长度" },
  { key: "readability", label: "读感" },
  { key: "relevance", label: "寓意" },
  { key: "brandability", label: "品牌感" },
];

function DomainName({ row, className }: { row: Row; className?: string }) {
  return (
    <p className={cn("truncate font-mono text-lg font-semibold tracking-tight", className)}>
      {row.label}
      <span className="text-zinc-400">.{row.tld}</span>
    </p>
  );
}

export function DomainCard({
  row,
  favorite,
  onToggleFavorite,
}: {
  row: Row;
  favorite: boolean;
  onToggleFavorite: (domain: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const score = row.scores ? totalScore(row.scores) : undefined;
  const isAvailable = row.status === "available";
  const isTaken = row.status === "taken";

  const copy = async () => {
    await navigator.clipboard.writeText(row.domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Card
      className={cn(
        "p-4 transition-shadow hover:shadow-md",
        isAvailable && "border-emerald-200 ring-1 ring-emerald-100",
        isTaken && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        {score !== undefined && <ScoreRing score={score} muted={isTaken} />}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <DomainName row={row} className={isTaken ? "line-through decoration-zinc-300" : undefined} />
            <StatusBadge status={row.status} />
          </div>
          {row.meaning && <p className="mt-1 text-sm leading-relaxed text-zinc-500">{row.meaning}</p>}
        </div>
      </div>

      {row.scores && !isTaken && (
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {DIMENSIONS.map((d) => {
            const v = row.scores![d.key];
            return (
              <div key={d.key} className="rounded-lg bg-zinc-50 py-1.5">
                <p className="text-[11px] text-zinc-400">{d.label}</p>
                <p className={cn("text-xs font-semibold", scoreColor(v).text)}>{v}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        {isAvailable ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-9 flex-1 font-semibold">
                去注册
                <ChevronDown className="h-4 w-4 opacity-80" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
              {REGISTRARS.map((r) => (
                <DropdownMenuItem key={r.name} asChild>
                  <a href={r.url(row.domain)} target="_blank" rel="noreferrer" className="flex w-full items-center justify-between">
                    {r.name}
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" className="h-9 flex-1 text-zinc-500" asChild>
            <a href={`https://who.is/whois/${encodeURIComponent(row.domain)}`} target="_blank" rel="noreferrer">
              查 WHOIS
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        <Button variant="outline" size="icon" title="复制" onClick={copy}>
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
        </Button>
        {!isTaken && (
          <Button
            variant="outline"
            size="icon"
            title={favorite ? "已收藏" : "收藏"}
            onClick={() => onToggleFavorite(row.domain)}
            className={cn(favorite && "border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-50 hover:text-amber-500")}
          >
            <Star className={cn("h-4 w-4", favorite && "fill-current")} />
          </Button>
        )}
      </div>
    </Card>
  );
}

export function ProgressCard({ row }: { row: Row }) {
  const isTaken = row.status === "taken";
  return (
    <Card
      className={cn(
        "p-4",
        row.status === "available" && "border-emerald-200 ring-1 ring-emerald-100",
        isTaken && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <DomainName row={row} className={isTaken ? "line-through decoration-zinc-300" : undefined} />
        <StatusBadge status={row.status} />
      </div>
      {row.meaning ? (
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{row.meaning}</p>
      ) : (
        <div className="mt-2.5 space-y-1.5">
          <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-100" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-zinc-100" />
        </div>
      )}
    </Card>
  );
}
