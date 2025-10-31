"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimeGrid from "./AnimeGrid";
import SkeletonGrid from "./SkeletonGrid";
import genreMap from "@/lib/genreMap"; // ✅ import shared genre map

export default function GenreTabs() {
  const [genre, setGenre] = useState("aksiyon");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎭 Turkish display names for popular tabs
  const genres = [
    { key: "aksiyon", label: "Aksiyon" },
    { key: "romantik", label: "Romantik" },
    { key: "komedi", label: "Komedi" },
    { key: "fantastik", label: "Fantastik" },
  ];

  // ⚡ Fetch anime by genre (using Jikan API)
  useEffect(() => {
    async function load() {
      setLoading(true);

      const id = genreMap[genre] || 1; // fallback → action
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?genres=${id}&limit=20&order_by=score&sort=desc`
        );

        if (!res.ok) throw new Error("Failed to fetch anime");

        const d = await res.json();
        setData(d.data || []);
      } catch (e) {
        console.error("Genre fetch failed:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [genre]);

  return (
    <section className="space-y-4">
      {/* 🔘 Genre Buttons */}
      <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
        {genres.map((g) => (
          <button
            key={g.key}
            onClick={() => setGenre(g.key)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium backdrop-blur-md transition-all duration-200 ${
              genre === g.key
                ? "bg-orange-500 text-white shadow-lg scale-105"
                : "bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/20"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* 🌀 Animated Anime Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SkeletonGrid />
          </motion.div>
        ) : (
          <motion.div
            key={genre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <AnimeGrid animeList={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
