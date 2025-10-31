"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function AnimeCarousel({ animeList = [] }) {
  const repeated = [...animeList, ...animeList]; // double for infinite loop
  const controls = useAnimation();
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef(null);

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
      controls.stop(); // pauses animation
    }
  }, [paused, controls]);

  return (
    <section
      className="relative overflow-hidden w-full py-6 select-none"
      ref={carouselRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="text-2xl font-bold mb-6 px-4">En Popüler Animeler</h2>

      <motion.div
        className="flex gap-6 carousel-mask"
        animate={controls}
        initial={{ x: 0 }}
      >
        {repeated.map((anime, index) => (
          <Link
            key={`${anime.mal_id}-${index}`}
            href={`/anime/${anime.mal_id}`}
            className="flex-shrink-0 w-44 sm:w-48 md:w-56 cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
              <Image
                src={anime.images?.jpg?.large_image_url}
                alt={anime.title}
                width={240}
                height={340}
                className="w-full h-72 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-1 text-sm">
                <p className="truncate">{anime.title}</p>
                <span className="text-xs opacity-80">
                  ⭐ {anime.score || "?"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
