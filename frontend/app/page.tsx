"use client";

import { useRouter } from "next/navigation";
import { ArrowDown, MessageSquareCode, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { UploadArea } from "@/components/upload-area";

const benefits = [
  { 
    icon: Sparkles, 
    title: "Trí tuệ nhân tạo RAG", 
    text: "AI chỉ trả lời chính xác dựa trên ngữ cảnh thực tế của tài liệu, loại bỏ tối đa hiện tượng ảo tưởng thông tin." 
  },
  { 
    icon: MessageSquareCode, 
    title: "Trò chuyện trực tiếp", 
    text: "Hỏi và đáp bằng tiếng Việt cực kỳ tự nhiên, trích xuất thông tin nhanh chóng chỉ trong vài giây." 
  },
  { 
    icon: ShieldCheck, 
    title: "Chính xác và minh bạch", 
    text: "Mỗi câu trả lời của AI đều đi kèm trích dẫn chính xác trang tham chiếu từ tệp PDF gốc để đối chiếu." 
  },
];

export default function Home() {
  const router = useRouter();

  const handleUploadSuccess = () => {
    router.push("/chat");
  };

  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_15%_10%,#dff4e8_0,transparent_28%),radial-gradient(circle_at_90%_35%,#f7d8cf_0,transparent_24%)]">
      <Header />
      
      {/* Hero Section */}
      <section className="flex-1 mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:pt-16 animate-fade-in-up">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-green animate-float">
            RAG AI Assistant <ArrowDown size={13} />
          </span>
          <h1 className="mt-6 max-w-2xl font-serif text-5xl font-semibold leading-[1.15] tracking-tight sm:text-7xl">
            Trò chuyện với <br/>mọi tài liệu PDF của <span className="italic text-green">bạn.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ink/65 sm:text-lg">
            Tải tệp tin PDF lên để bắt đầu hỏi đáp, tóm tắt ý chính và trích xuất nội dung nhanh chóng từ tài liệu của bạn bằng AI.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-ink/60">
            <span>✓ Phân tích bằng Gemini 2.5</span>
            <span>✓ Trích dẫn nguồn theo trang</span>
            <span>✓ Hoàn toàn miễn phí</span>
          </div>
        </div>
        <div className="w-full">
          <UploadArea onUploadSuccess={handleUploadSuccess} />
        </div>
      </section>

      {/* Benefits / Features Section */}
      <section className="border-t border-ink/10 bg-white/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:px-8 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="rounded-3xl p-6 glass-card interactive-card shadow-sm">
              <span className="mb-6 flex items-center justify-between">
                <span className="p-3.5 bg-mint rounded-2xl text-green inline-block shadow-inner"><Icon size={22} /></span>
                <small className="font-serif text-xl text-ink/25 font-bold">0{index + 1}</small>
              </span>
              <h2 className="font-serif text-2xl font-semibold">{title}</h2>
              <p className="mt-2.5 text-sm leading-6 text-ink/55">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
