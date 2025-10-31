"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnimeCard({ anime }) {
  const img = anime.images?.jpg?.image_url || anime.image_url || "";
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <motion.article
        whileHover={{ y: -6, scale: 1.02 }}
        className="glass overflow-hidden"
      >
        <div className="relative aspect-[3/4] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={anime.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2">{anime.title}</h3>
          {anime.score ? (
            <div className="text-xs opacity-70 mt-1">Puan: {anime.score}</div>
          ) : null}
        </div>
      </motion.article>
    </Link>
  );
}
