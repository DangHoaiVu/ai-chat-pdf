"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LoadingMessage() {
  return (
    <div className="flex gap-4.5 max-w-[85%] self-start animate-pulse">
      {/* Bot Icon */}
      <div className="size-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 shrink-0">
        <Sparkles size={14} className="animate-spin" />
      </div>
      
      {/* Message Bubble Skeleton */}
      <div className="flex flex-col gap-2.5 bg-zinc-900/60 border border-white/5 rounded-[1.5rem] rounded-tl-none p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="size-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="size-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="size-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <div className="w-[220px] sm:w-[320px] h-3 bg-white/5 rounded-full" />
        <div className="w-[180px] sm:w-[260px] h-3 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}
