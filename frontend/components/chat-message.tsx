"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { type ChatMessage as ChatMessageType } from "@/lib/api";
import { SourceBadge } from "./source-badge";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`flex gap-4 max-w-[85%] ${isUser ? "self-end flex-row-reverse" : "self-start"}`}
    >
      {/* Icon Avatar */}
      <div 
        className={`size-9 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 ${
          isUser 
            ? "bg-zinc-800 border border-white/10" 
            : "bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-indigo-500/10"
        }`}
      >
        {isUser ? <User size={15} /> : <Sparkles size={14} />}
      </div>

      {/* Bubble Content */}
      <div
        className={`flex flex-col rounded-[1.5rem] p-5 leading-6 shadow-xl backdrop-blur-md ${
          isUser
            ? "bg-gradient-to-tr from-indigo-600 via-indigo-600 to-purple-600 text-white rounded-tr-none border border-indigo-500/30"
            : "bg-zinc-900/60 border border-white/5 text-zinc-100 rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-line text-sm">{message.content}</p>

        {/* References Badges */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Nguồn dẫn:
            </span>
            {message.sources.map((source) => (
              <SourceBadge key={source} source={source} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
