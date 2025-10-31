"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// 🌈 Define aura colors for each genre
const genreAuras = {
  aksiyon: "from-sky-400/30 to-blue-500/20",
  fantastik: "from-purple-400/30 to-pink-500/20",
  romantizm: "from-pink-300/40 to-red-400/20",
  komedi: "from-yellow-300/40 to-orange-400/20",
  korku: "from-red-400/40 to-black/20",
  bilim: "from-cyan-300/40 to-blue-500/20",
  dram: "from-rose-400/30 to-purple-500/20",
  gerilim: "from-indigo-400/30 to-slate-700/30",
  doğaüstü: "from-violet-400/30 to-indigo-500/20",
  macera: "from-emerald-300/40 to-teal-500/20",
  gizem: "from-blue-400/30 to-gray-700/20",
  shounen: "from-orange-400/30 to-red-400/20",
  mecha: "from-slate-400/30 to-cyan-500/20",
  varsayılan: "from-gray-200/30 to-gray-400/20",
};

export default function GenrePage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  const genre = decodeURIComponent(params.slug).replace(/-/g, " ");
  const genreKey = genre.toLowerCase();
  const aura = genreAuras[genreKey] || genreAuras.varsayılan;

  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    async function loadGenre() {
      setLoading(true);
      try {
        const res = await fetch(`/api/jikan/genre?genre=${genre}&page=${page}`);
        const data = await res.json();
        setAnimeList(data.data || []);
        setPageCount(data.pagination?.last_visible_page || 1);
      } catch (err) {
        console.error("Genre load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGenre();
  }, [genre, page]);

  const goToPage = (num) => {
    if (num < 1 || num > pageCount) return;
    router.push(`/genre/${params.slug}?page=${num}`);
  };

  return (
    <main className="relative flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
     {/* 🌐 Header */}
        <Header />  
      {/* 🎨 Animated Aura Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={genre + "-bg"}
          initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`
            absolute inset-0 -z-10
            bg-gradient-to-b ${aura}
            dark:from-gray-900/80 dark:to-gray-950/95
            backdrop-blur-3xl
          `}
        />
      </AnimatePresence>

      <h1 className="text-3xl font-bold mb-6 text-center z-10">
        <span className="text-orange-500 capitalize">{genre}</span> Animeleri
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center z-10">
        Bu türdeki animeleri keşfet!
      </p>

      {/* 🧊 Glass Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="
            w-full max-w-7xl 
            rounded-3xl 
            p-6 sm:p-10 
            backdrop-blur-2xl 
            bg-white/60 dark:bg-gray-900/50
            border border-white/30 dark:border-white/10
            shadow-[0_8px_40px_rgba(0,0,0,0.15)]
            relative
            overflow-hidden
          "
        >

          {/* 🎬 Anime Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
          ) : animeList.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Bu türde anime bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {animeList.map((anime) => (
                <motion.div
                  key={anime.mal_id}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  onClick={() => router.push(`/anime/${anime.mal_id}`)}
                  className="
                    group cursor-pointer overflow-hidden rounded-2xl
                    bg-white/30 dark:bg-white/10 
                    backdrop-blur-md 
                    transition-all duration-300 
                    hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]
                  "
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={
                        anime.images?.jpg?.large_image_url ||
                        anime.images?.jpg?.image_url
                      }
                      alt={anime.title}
                      width={300}
                      height={400}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium truncate">
                      {anime.title}
                    </p>
                    <div className="flex items-center justify-center text-yellow-400 text-xs mt-1">
                      ⭐ {anime.score || "N/A"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* 🌟 Modern Pagination */}
            <div className="flex justify-center items-center gap-2 mt-10 select-none">
            <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className={`px-3 py-2 rounded-full text-sm backdrop-blur-md border 
                bg-white/40 dark:bg-white/10 border-white/30 text-gray-700 dark:text-gray-200 
                transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] 
                ${page <= 1 ? "opacity-30 cursor-not-allowed hover:scale-100 hover:shadow-none" : ""}`}
            >
                ←
            </button>

            {/* Page Numbers */}
            {Array.from({ length: pageCount }).map((_, i) => {
                const num = i + 1;
                if (
                num === 1 ||
                num === pageCount ||
                (num >= page - 2 && num <= page + 2)
                ) {
                return (
                    <button
                    key={num}
                    onClick={() => goToPage(num)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
                        ${
                        num === page
                            ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-white shadow-[0_0_20px_rgba(0,200,255,0.5)] scale-105"
                            : "bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-cyan-400/30 hover:text-white"
                        }
                    `}
                    >
                    {num}
                    </button>
                );
                } else if (
                (num === page - 3 && num > 1) ||
                (num === page + 3 && num < pageCount)
                ) {
                return (
                    <span
                    key={num}
                    className="px-2 text-gray-500 dark:text-gray-400 font-semibold"
                    >
                    ...
                    </span>
                );
                }
                return null;
            })}

            <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= pageCount}
                className={`px-3 py-2 rounded-full text-sm backdrop-blur-md border 
                bg-white/40 dark:bg-white/10 border-white/30 text-gray-700 dark:text-gray-200 
                transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] 
                ${page >= pageCount ? "opacity-30 cursor-not-allowed hover:scale-100 hover:shadow-none" : ""}`}
            >
                →
            </button>
            </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
