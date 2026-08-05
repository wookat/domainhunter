import { Radar } from "lucide-react";
import type { ReactNode } from "react";

export function Header({ right, onLogoClick }: { right?: ReactNode; onLogoClick?: () => void }) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
        <button onClick={onLogoClick} className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Radar className="h-4 w-4" />
          </span>
          Domain<span className="text-emerald-600">Hunter</span>
        </button>
        <div className="flex items-center gap-1">{right}</div>
      </div>
    </header>
  );
}
