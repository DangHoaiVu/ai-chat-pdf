import Link from "next/link";
import { BookOpenText } from "lucide-react";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
      <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-ink transition-transform hover:scale-[1.02]">
        <span className="grid size-10 place-items-center rounded-2xl bg-ink text-white shadow-md">
          <BookOpenText size={20} />
        </span>
        <span className="font-serif text-2xl font-bold">AI Chat PDF</span>
      </Link>
      <span className="rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 text-xs font-bold text-ink/65 shadow-sm">
        Bởi Hoài Vũ
      </span>
    </header>
  );
}
