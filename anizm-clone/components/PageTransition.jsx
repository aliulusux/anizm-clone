"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Adds cinematic slide + fade transitions between pages.
 * Automatically triggers on route change (via pathname).
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();

  const variants = {
    initial: { opacity: 0, x: 60, y: 10, scale: 0.98 },
    enter: { opacity: 1, x: 0, y: 0, scale: 1 },
    exit: { opacity: 0, x: -60, y: -10, scale: 0.98 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="motion-page min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
