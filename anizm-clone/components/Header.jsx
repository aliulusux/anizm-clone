import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="mb-6">
      <div className="glass p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400" />
          <span className="text-lg font-semibold">Tranimeci-style</span>
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="opacity-80 hover:opacity-100">Anasayfa</Link>
          <Link href="/search" className="opacity-80 hover:opacity-100">Ara</Link>
          <ThemeToggle />
          <a href="https://docs.api.jikan.moe" target="_blank" className="opacity-80 hover:opacity-100">Jikan API</a>
        </nav>
      </div>
    </header>
  );
}
