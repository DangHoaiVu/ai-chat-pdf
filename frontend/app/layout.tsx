import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["vietnamese", "latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Chat PDF | Trò chuyện với tài liệu",
  description: "Tải lên PDF và trò chuyện trực tiếp với tài liệu của bạn bằng công nghệ RAG AI tiên tiến.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${lora.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-bg-dark text-zinc-100" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
