"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function NumberedPagination({
  current,
  totalPages,
  basePath,
  window = 2,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const start = Math.max(1, current - window);
  const end = Math.min(totalPages, current + window);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex justify-center mt-10">
      <div
        className={`flex items-center gap-2 rounded-2xl px-5 py-3 backdrop-blur-md border transition-all duration-300 ${
          isDark
            ? "bg-white/5 border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
            : "bg-white/40 border-black/10 shadow-[0_0_20px_rgba(0,0,0,0.1)]"
        }`}
      >
        {/* Numbered buttons */}
        {pages.map((p) => (
          <PageButton
            key={p}
            href={`${basePath}?page=${p}`}
            label={p}
            active={p === current}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}

function PageButton({ href, label, active, disabled, theme }) {
  const isDark = theme === "dark";

  if (disabled) {
    return (
      <span
        className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm cursor-not-allowed opacity-40 ${
          isDark ? "text-white/60" : "text-black/40"
        }`}
      >
        {label}
      </span>
    );
  }

  const baseStyle =
    "w-8 h-8 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm border";

  const activeStyle = isDark
    ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]"
    : "bg-blue-500/90 border-blue-300 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]";

  const hoverStyle = isDark
    ? "hover:bg-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]"
    : "hover:bg-blue-400/20 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]";

  const normalStyle = isDark
    ? "bg-white/10 border-white/10 text-white/80"
    : "bg-white/70 border-black/10 text-black/80";

  return (
    <Link
      href={href}
      className={`${baseStyle} ${active ? activeStyle : normalStyle} ${hoverStyle}`}
    >
      {active ? (
        <motion.span
          layoutId="pagination-active"
          className="relative z-10 font-semibold"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {label}
        </motion.span>
      ) : (
        label
      )}
    </Link>
  );
}
