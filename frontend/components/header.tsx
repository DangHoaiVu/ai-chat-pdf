"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function Header({ onReset }: { onReset?: () => void }) {
  const handleLogoClick = (e: React.MouseEvent) => {
    if (onReset) {
      e.preventDefault();
      onReset();
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 w-full z-50"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
          <div className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
            <BookOpen size={20} />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 blur-sm opacity-50 -z-10 group-hover:opacity-80 transition-opacity" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-200 transition-all duration-300">
            AI Chat PDF
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold text-indigo-400 border border-indigo-500/20">
            <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Bởi Hoài Vũ
          </span>
        </div>
      </div>
    </motion.header>
  );
}
