"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnimeGrid({ animeList = [] }) {
  if (!animeList || animeList.length === 0)
    return <p className="text-center text-gray-400 mt-8">Hiç anime bulunamadı 😢</p>;

  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-3
        md:grid-cols-5
        lg:grid-cols-7
        xl:grid-cols-8
        2xl:grid-cols-10
        justify-items-center
      "
    >
      {animeList.map((anime, i) => (
        <motion.div
          key={anime.mal_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          <Link
            href={`/anime/${anime.mal_id}`}
            className="
              w-full
              max-w-[160px]
              glass
              rounded-2xl
              overflow-hidden
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-lg
              hover:shadow-orange-500/10
              group
            "
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={
                  anime.images?.jpg?.large_image_url ||
                  anime.images?.jpg?.image_url ||
                  "/placeholder.jpg"
                }
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="160px"
              />
            </div>
            <div className="p-2 bg-black/40 text-white/90 text-sm truncate">
              <p className="truncate font-medium">{anime.title}</p>
              <p className="text-xs text-gray-400">Puan: {anime.score ?? "?"}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
