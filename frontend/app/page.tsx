"use client";
// Trigger Vercel Build
import React, { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { UploadZone } from "@/components/upload-zone";
import { ChatWindow } from "@/components/chat-window";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, ShieldCheck } from "lucide-react";

const benefits = [
  { 
    icon: Sparkles, 
    title: "Trí tuệ nhân tạo RAG", 
    text: "AI chỉ trả lời chính xác dựa trên ngữ cảnh thực tế của tài liệu, loại bỏ tối đa hiện tượng ảo tưởng thông tin." 
  },
  { 
    icon: MessageSquare, 
    title: "Trò chuyện trực tiếp", 
    text: "Hỏi và đáp bằng tiếng Việt cực kỳ tự nhiên, trích xuất thông tin nhanh chóng chỉ trong vài giây." 
  },
  { 
    icon: ShieldCheck, 
    title: "Trích dẫn nguồn minh bạch", 
    text: "Mỗi câu trả lời của AI đều đi kèm trích dẫn chính xác trang tham chiếu từ tệp PDF gốc để đối chiếu." 
  },
];

export default function Home() {
  const [activeFile, setActiveFile] = useState<{ name: string; size: number } | null>(null);

  const handleUploadSuccess = (name: string, size: number) => {
    setActiveFile({ name, size });
  };

  const handleReset = () => {
    setActiveFile(null);
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-[#09090b] text-zinc-100 selection:bg-indigo-500/20">
      {/* Decorative background glow elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 z-10 w-full">
        <AnimatePresence mode="wait">
          {!activeFile ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl flex flex-col items-center"
            >
              <HeroSection />
              <UploadZone onUploadSuccess={handleUploadSuccess} />

              {/* Benefits Section */}
              <div className="grid gap-6 sm:grid-cols-3 w-full max-w-4xl mt-16 px-4">
                {benefits.map(({ icon: Icon, title, text }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="rounded-3xl p-6 glass-panel interactive-card shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="mb-6 flex items-center justify-between">
                      <span className="p-3 bg-white/5 border border-white/10 rounded-2xl text-indigo-400 inline-block shadow-lg">
                        <Icon size={20} />
                      </span>
                      <small className="font-serif text-lg text-zinc-600 font-bold">0{index + 1}</small>
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="text-xs leading-5.5 text-zinc-400">{text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="w-full flex-1 flex flex-col"
            >
              <ChatWindow 
                fileName={activeFile.name} 
                fileSize={activeFile.size} 
                onReset={handleReset} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
