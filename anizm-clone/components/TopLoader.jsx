"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TopLoader: animated top progress bar that adapts to current theme
 */
export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [gradient, setGradient] = useState("");

  // 🎨 Update gradient color when theme changes
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setGradient(
      isDark
        ? "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
        : "bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500"
    );

    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setGradient(
        dark
          ? "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
          : "bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500"
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ⚙️ Trigger animation on every route or query change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] overflow-hidden">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="progress"
            className={`h-full ${gradient} rounded-r-full shadow-md`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
