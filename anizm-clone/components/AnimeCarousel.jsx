"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AnimeCarousel({ animeList = [] }) {
  if (!animeList?.length) return null;

  const repeated = [...animeList, ...animeList];
  const controls = useAnimation();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!paused) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          repeat: Infinity,
          duration: 45,
          ease: "linear",
        },
      });
    } else {
      controls.stop();
    }
  }, [paused, controls]);

  return (
    <div
      className="relative overflow-hidden py-6 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ✅ Single Title */}
      <h2 className="text-2xl font-bold mb-6 px-2 md:px-4">
        En Popüler Animeler
      </h2>

      {/* 🌀 Sliding Track */}
      <div className="relative">
        <motion.div
          className="flex gap-6 mask-gradient carousal-mask"
          animate={controls}
          initial={{ x: 0 }}
        >
          {repeated.map((anime, index) => (
            <Link
              key={`${anime.mal_id}-${index}`}
              href={`/anime/${anime.mal_id}`}
              className="flex-shrink-0 w-40 sm:w-48 md:w-56 cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300">
                {/* ✅ Fix cover disappearing (force layout & aspect ratio) */}
                <Image
                  src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                  alt={anime.title}
                  width={250}
                  height={350}
                  className="w-full h-72 object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/65 p-2 text-sm text-white">
                  <p className="truncate">{anime.title}</p>
                  <span className="opacity-75 text-xs">
                    ⭐ {anime.score ?? "?"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* ✨ Softer fade edges */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/10 via-transparent to-[#0a0a0a]/10" />

      </div>
    </div>
  );
}
