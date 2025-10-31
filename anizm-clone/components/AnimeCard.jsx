"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AnimeCard({ anime }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -6,
        boxShadow: "0 8px 25px rgba(59,130,246,0.4)",
      }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/10
      backdrop-blur-md transition-all duration-500 hover:border-blue-400 hover:bg-white/20"
    >
      {/* Cover */}
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
        <h3 className="text-sm font-semibold line-clamp-2 text-white/90 dark:text-black/80">
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
