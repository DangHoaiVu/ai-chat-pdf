"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative text-center max-w-3xl mx-auto px-4 pt-12 pb-6 z-10 flex flex-col items-center">
      {/* Background glow behind hero */}
      <div className="bg-glow glow-indigo -top-20 left-1/4" />
      <div className="bg-glow glow-purple top-10 right-1/4" />

      {/* Floating badge */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 shadow-xl backdrop-blur-md mb-6"
      >
        <Sparkles size={13} className="text-cyan-400 animate-pulse" />
        <span>RAG-Powered AI Document Assistant</span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
      >
        Trò chuyện với tài liệu{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
          PDF của bạn
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-8"
      >
        Tải tệp PDF lên để hỏi đáp, tóm tắt ý chính và trích xuất thông tin nhanh chóng. AI phản hồi chính xác dựa trên ngữ cảnh thực tế của tài liệu.
      </motion.p>
    </div>
  );
}
