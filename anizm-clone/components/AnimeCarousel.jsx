"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, memo } from "react";

function AnimeCarousel({ animeList = [] }) {
  if (!animeList?.length) return null;

  const repeated = [...animeList, ...animeList];
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const initialized = useRef(false);

  const DURATION = Math.max(30, animeList.length * 2);
  const WIDTH_PERCENT = 50;

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

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    startSliding(progress);
  }, []);

  const handlePause = () => {
    if (!containerRef.current) return;
    const style = window.getComputedStyle(containerRef.current);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const currentX = matrix.m41;
    const width = containerRef.current.scrollWidth / 2;
    const percent = (-currentX / width) * 50;
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

      <div className="relative">
        <motion.div
          ref={containerRef}
          className="flex gap-6 mask-gradient"
          animate={controls}
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

        {/* Gradient edges that adapt to theme */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-70" />
      </div>
    </div>
  );
}

// 🧊 Prevent re-renders when theme changes
export default memo(AnimeCarousel);
