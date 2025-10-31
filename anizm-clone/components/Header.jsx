import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 rounded-2xl glass mt-6">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
        <h1 className="text-lg font-semibold">Tranimeci-style</h1>
      </div>

      <nav className="flex items-center gap-6">
        <a href="/" className="hover:text-orange-400 transition">Anasayfa</a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
