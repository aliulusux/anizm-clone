"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  const particles = Array.from({ length: 30 });

  return (
    <main className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
      {/* 🌈 Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-pink-400/20 to-purple-600/30 dark:from-indigo-500/20 dark:via-purple-800/20 dark:to-fuchsia-800/20 blur-3xl"></div>

      {/* ✨ Floating particles */}
      {particles.map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 rounded-full bg-orange-400/40 dark:bg-purple-400/40"
          initial={{
            x: Math.random() * 800 - 400,
            y: Math.random() * 400 - 200,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: Math.random() * 800 - 400,
            y: Math.random() * 400 - 200,
            opacity: [0.3, 1, 0.3],
            scale: [0.2, 1.2, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 💥 Main 404 text */}
      <motion.h1
        className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-pink-500 drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      >
        404
      </motion.h1>

      {/* 🔤 Subtext */}
      <motion.p
        className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Aradığın sayfa çok uzak bir galakside kaybolmuş gibi görünüyor... 🌌
      </motion.p>

      {/* 🧭 Button */}
      <Link href="/">
        <motion.button
          className="glass px-6 py-3 text-lg font-semibold rounded-2xl shadow-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 dark:from-indigo-500 dark:via-fuchsia-500 dark:to-pink-500 text-white hover:scale-110 hover:shadow-2xl transition"
          whileTap={{ scale: 0.95, rotate: -3 }}
          whileHover={{
            y: -4,
            boxShadow: "0 0 20px rgba(255,255,255,0.3)",
          }}
        >
          🚀 Anasayfaya Dön
        </motion.button>
      </Link>

      {/* 💫 Floating "404" ghost text behind */}
      <motion.div
        className="absolute text-[16rem] font-black text-gray-200 dark:text-gray-700 opacity-10 select-none pointer-events-none"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: -80, opacity: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
      >
        404
      </motion.div>
    </main>
  );
}
