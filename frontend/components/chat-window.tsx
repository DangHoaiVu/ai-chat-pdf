"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, BookOpen, AlertTriangle } from "lucide-react";
import { askPdfQuestion, type ChatMessage } from "@/lib/api";

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuestion = input.trim();
    setInput("");
    setError(null);

    // 1. Add User message
    const userMsg: ChatMessage = { role: "user", content: userQuestion };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Fetch AI response
      const response = await askPdfQuestion(userQuestion);
      
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response.answer,
        sources: response.sources
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || "Không thể tải câu trả lời từ AI.");
      // Add error system message or keep it in alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/70 border border-ink/10 rounded-[2rem] shadow-xl overflow-hidden glass-card">
      {/* Chat header */}
      <div className="px-6 py-4 bg-ink text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-green animate-pulse" />
          <h3 className="font-serif font-bold text-lg">Phòng Trò Chuyện</h3>
        </div>
        <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">RAG Mode Active</p>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in-up">
            <span className="p-4 bg-mint rounded-full text-green mb-4">
              <BookOpen size={24} />
            </span>
            <h4 className="font-serif text-xl font-bold mb-2">Bắt đầu trò chuyện với tài liệu</h4>
            <p className="text-sm text-ink/50 max-w-sm">
              Nhập câu hỏi của bạn dưới thanh chat. AI sẽ phân tích ngữ cảnh và trả lời dựa trên nội dung tệp PDF của bạn.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col max-w-[80%] rounded-[1.5rem] p-4.5 text-sm leading-6 shadow-sm transition-all animate-fade-in-up ${
              msg.role === "user"
                ? "self-end bg-green text-white rounded-br-none"
                : "self-start bg-white text-ink border border-ink/10 rounded-bl-none"
            }`}
          >
            {/* Message Content */}
            <p className="whitespace-pre-line">{msg.content}</p>

            {/* Sources / References */}
            {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-ink/5 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] uppercase font-bold text-ink/40 tracking-wider">Tham khảo:</span>
                {msg.sources.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center text-[11px] font-bold text-green bg-mint px-2.5 py-1 rounded-full cursor-default hover:bg-green hover:text-white transition-colors duration-150"
                  >
                    {source}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="self-start flex items-center gap-3 bg-white text-ink border border-ink/10 rounded-[1.5rem] rounded-bl-none p-4 shadow-sm animate-pulse">
            <Loader2 size={16} className="animate-spin text-green" />
            <span className="text-sm font-semibold text-ink/60">Đang tìm kiếm tài liệu và trả lời...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 text-coral bg-coral/5 rounded-[1.5rem] p-4 text-sm font-semibold max-w-[80%] mx-auto">
            <AlertTriangle size={18} className="shrink-0" />
            <div>
              <p className="font-bold">Lỗi truy vấn AI</p>
              <p className="text-xs text-coral/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-ink/10 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Đặt câu hỏi về nội dung tài liệu..."
            className="w-full pl-6 pr-14 py-4.5 bg-cream/70 rounded-full border border-ink/10 focus:outline-none focus:border-green/40 focus:ring-1 focus:ring-green/20 text-sm font-semibold placeholder:text-ink/35 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-3 bg-green hover:bg-green/90 text-white rounded-full transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-green/10"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
