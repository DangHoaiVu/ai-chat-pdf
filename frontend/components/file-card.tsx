"use client";

import { FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FileCardProps {
  fileName: string;
  fileSize: number;
}

export function FileCard({ fileName, fileSize }: FileCardProps) {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="glass-panel rounded-2xl p-4 flex items-center gap-3.5 shadow-xl max-w-sm"
    >
      <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
        <FileText size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-white truncate">{fileName}</h4>
        <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
          {(fileSize / (1024 * 1024)).toFixed(2)} MB • PDF Document
        </p>
      </div>
      <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0">
        <CheckCircle size={10} />
        <span>Sẵn sàng</span>
      </div>
    </motion.div>
  );
}
