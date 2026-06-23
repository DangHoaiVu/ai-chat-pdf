"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { askPdfQuestion, type ChatMessage } from "@/lib/api";
import { ChatMessage as ChatMessageComponent } from "./chat-message";
import { LoadingMessage } from "./loading-message";
import { EmptyState } from "./empty-state";
import { FileCard } from "./file-card";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWindowProps {
  fileName: string;
  fileSize: number;
  onReset: () => void;
}

export function ChatWindow({ fileName, fileSize, onReset }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuestion = input.trim();
    setInput("");
    setError(null);

    const userMsg: ChatMessage = { role: "user", content: userQuestion };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await askPdfQuestion(userQuestion);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response.answer,
        sources: response.sources
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || "Không thể tải câu trả lời từ AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col min-h-0 z-10">
      {/* Active File Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 animate-fade-in-up">
        <FileCard fileName={fileName} fileSize={fileSize} />
        
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:border-white/10 transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0"
        >
          <RefreshCw size={12} />
          Tải tài liệu khác
        </button>
      </div>

      {/* Chat Messages Section */}
      <div className="flex-1 overflow-y-auto glass-panel border border-white/5 rounded-[2rem] p-6 space-y-6 shadow-2xl flex flex-col min-h-0 relative">
        <div className="bg-glow glow-indigo/5 top-1/3 left-1/4" />
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 flex flex-col">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <EmptyState key="empty" onQuestionClick={handleSuggestClick} />
            ) : (
              <div key="messages-list" className="flex flex-col space-y-6">
                {messages.map((msg, index) => (
                  <ChatMessageComponent key={index} message={msg} />
                ))}
                
                {loading && <LoadingMessage />}
              </div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Error Notice */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/5 border border-red-500/10 rounded-2xl px-4.5 py-3 text-xs font-semibold max-w-md mx-auto animate-fade-in-up">
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <div className="py-6 bg-transparent">
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-3xl mx-auto w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Đặt câu hỏi về nội dung tài liệu..."
            className="w-full pl-6 pr-16 py-4 bg-zinc-900/60 text-zinc-100 rounded-full border border-white/10 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 text-sm font-semibold placeholder:text-zinc-500 transition-all shadow-xl backdrop-blur-md"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-indigo-500/20"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </form>
        <p className="text-[10px] text-zinc-500 text-center mt-3 font-semibold">
          AI có thể phản hồi chậm hoặc không chính xác trong một số trường hợp. Trích dẫn nguồn chỉ mang tính chất tham khảo.
        </p>
      </div>
    </div>
  );
}
