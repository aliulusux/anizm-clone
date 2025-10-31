"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimeGrid from "./AnimeGrid";
import SkeletonGrid from "./SkeletonGrid";

export default function GenreTabs() {
  const [genre, setGenre] = useState("action");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const genres = [
    { key: "action", label: "Aksiyon" },
    { key: "romance", label: "Romantik" },
    { key: "comedy", label: "Komedi" },
    { key: "fantasy", label: "Fantastik" },
  ];

  useEffect(() => {
    async function load() {
        setLoading(true);

        // Map genre key → numeric Jikan ID
        const genreMap = {
        action: 1,
        romance: 22,
        comedy: 4,
        fantasy: 10,
        };

        const genreId = genreMap[genre] || 1; // fallback to action
        const res = await fetch(
        `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=20`
        );
        const d = await res.json();
        setData(d.data || []);
        setLoading(false);
    }
    load();
    }, [genre]);

  return (
    <section className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {genres.map((g) => (
          <button
            key={g.key}
            onClick={() => setGenre(g.key)}
            className={`px-4 py-2 rounded-xl border backdrop-blur-md transition ${
              genre === g.key
                ? "bg-orange-500 text-white"
                : "bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/20"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SkeletonGrid />
          </motion.div>
        ) : (
          <motion.div key={genre} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnimeGrid animeList={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
