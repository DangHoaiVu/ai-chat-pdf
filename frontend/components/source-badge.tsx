"use client";

import { Bookmark } from "lucide-react";

interface SourceBadgeProps {
  source: string;
}

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full cursor-default hover:bg-cyan-400 hover:text-zinc-950 hover:border-cyan-400 transition-all duration-200 shadow-sm">
      <Bookmark size={10} />
      {source}
    </span>
  );
}
