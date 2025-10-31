"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AnimeCard({ anime }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -6,
      }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="relative flex flex-col rounded-2xl border border-transparent bg-white/40
      dark:bg-white/10 backdrop-blur-md overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.08)]"
    >
      {/* Cover image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-2xl">
        <Image
          src={anime.images?.jpg?.image_url || "/no-image.jpg"}
          alt={anime.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition-transform duration-700 hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="p-3 text-center">
        <h3 className="text-sm font-semibold line-clamp-2 text-black/80 dark:text-white/90">
          {anime.title}
        </h3>
        {anime.score && (
          <div className="mt-2 inline-flex items-center justify-center gap-1 text-yellow-400 bg-black/20 px-2 py-1 rounded-full text-xs font-medium">
            ⭐ {anime.score.toFixed(2)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
