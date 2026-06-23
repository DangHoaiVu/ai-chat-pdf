"use client";

import { MessageSquare, ArrowRight, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onQuestionClick: (question: string) => void;
}

const sampleQuestions = [
  "Tóm tắt nội dung chính của tài liệu này",
  "Các điểm mấu chốt được đề cập ở đây là gì?",
  "Giải thích phần quan trọng nhất trong tài liệu này"
];

export function EmptyState({ onQuestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-xl mx-auto h-full min-h-[350px]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl mb-6 shadow-xl relative"
      >
        <MessageSquare size={24} />
        <div className="absolute inset-0 bg-indigo-500/10 blur-lg rounded-full -z-10" />
      </motion.div>
      
      <motion.h3 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-serif text-2xl font-bold text-white mb-2"
      >
        Đặt câu hỏi về tài liệu của bạn
      </motion.h3>
      
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-sm text-zinc-400 leading-relaxed mb-8"
      >
        Nhập câu hỏi ở thanh chat bên dưới. AI sẽ tự động phân tích các trang liên quan của tài liệu để đưa ra câu trả lời đi kèm nguồn đối chiếu chính xác.
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full space-y-3"
      >
        <div className="flex items-center gap-2 justify-center text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
          <Lightbulb size={13} />
          <span>Gợi ý câu hỏi</span>
        </div>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onQuestionClick(q)}
            className="w-full flex items-center justify-between p-4.5 text-left text-sm text-zinc-300 hover:text-white bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-200 group active:scale-[0.99]"
          >
            <span>{q}</span>
            <ArrowRight size={14} className="text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </motion.div>
    </div>
  );
}
