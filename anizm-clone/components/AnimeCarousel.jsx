"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function AnimeCarousel({ animeList = [] }) {
  if (!animeList?.length) return null;

  const repeated = [...animeList, ...animeList];
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasInitialized = useRef(false);

  // Dynamic speed: more anime = slower loop
  const DURATION = Math.max(30, animeList.length * 2);
  const WIDTH_PERCENT = 50;

  // 🔁 Run animation ONCE only — ignore theme rerenders
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    startSliding(progress);
  }, []);

  const startSliding = async (offset = 0) => {
    await controls.start({
      x: [`-${offset}%`, `-${WIDTH_PERCENT + offset}%`],
      transition: {
        ease: "linear",
        duration: DURATION * (1 - offset / WIDTH_PERCENT),
        repeat: Infinity,
      },
    });
  };

  const handlePause = () => {
    if (!containerRef.current) return;
    const computedStyle = window.getComputedStyle(containerRef.current);
    const matrix = new DOMMatrixReadOnly(computedStyle.transform);
    const currentX = matrix.m41;
    const containerWidth = containerRef.current.scrollWidth / 2;
    const percent = (-currentX / containerWidth) * 50;
    setProgress(percent % WIDTH_PERCENT);
    controls.stop();
    setPaused(true);
  };

  const handleResume = () => {
    if (paused) {
      setPaused(false);
      startSliding(progress);
    }
  };

  return (
    <div
      className="relative overflow-hidden py-6 select-none"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      <h2 className="text-2xl font-bold mb-6 px-2 md:px-4">
        En Popüler Animeler
      </h2>

      <div className="relative">
        <motion.div
          className="flex gap-6 mask-gradient"
          animate={controls}
          ref={containerRef}
        >
          {repeated.map((anime, index) => (
            <Link
              key={`${anime.mal_id}-${index}`}
              href={`/anime/${anime.mal_id}`}
              className="flex-shrink-0 w-40 sm:w-48 md:w-56 cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300">
                <Image
                  src={
                    anime.images?.jpg?.large_image_url ||
                    anime.images?.jpg?.image_url
                  }
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

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-transparent to-white/0 sm:from-white/30 sm:to-white/30" />
      </div>
    </div>
  );
}
