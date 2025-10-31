"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AnimeCard({ anime }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="relative flex flex-col bg-white/10 dark:bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={anime.images?.jpg?.image_url || "/no-image.jpg"}
          alt={anime.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="p-3 text-center">
        <h3 className="text-sm font-semibold line-clamp-2 text-white/90 dark:text-white">
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
