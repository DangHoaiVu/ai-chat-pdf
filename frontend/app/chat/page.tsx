"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { ChatWindow } from "@/components/chat-window";

export default function ChatPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_85%_5%,#dff4e8_0,transparent_25%)]">
      <Header />
      
      <div className="flex-1 mx-auto w-full max-w-4xl px-5 pb-12 pt-6 sm:px-8 flex flex-col">
        {/* Navigation & File Options */}
        <div className="mb-6 animate-fade-in-up">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2.5 text-sm font-bold text-ink/55 hover:text-green transition-colors"
          >
            <ArrowLeft size={16} /> 
            Tải lên tài liệu khác
          </Link>
        </div>

        {/* Chat Interface Container */}
        <div className="flex-1 min-h-[500px]">
          <ChatWindow />
        </div>
      </div>
    </main>
  );
}
