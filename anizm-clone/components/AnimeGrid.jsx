"use client";

import Image from "next/image";
import Link from "next/link";

export default function AnimeGrid({ animeList = [] }) {
  if (!animeList || animeList.length === 0)
    return (
      <div className="text-center text-gray-400 py-10">
        Bu türde anime bulunamadı 😢
      </div>
    );

  return (
    <div
      className="
        grid gap-5
        grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
        justify-center
      "
    >
      {animeList.map((anime) => (
        <Link
          key={anime.mal_id}
          href={`/anime/${anime.mal_id}`}
          className="
            group relative w-full rounded-2xl overflow-hidden
            bg-white/5 backdrop-blur-md
            border border-white/10
            hover:scale-[1.03] transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10
          "
        >
          {/* 🧩 Fix: give Image a guaranteed height */}
          <div className="relative w-full" style={{ height: "250px" }}>
            <Image
              src={
                anime.images?.jpg?.large_image_url ||
                anime.images?.jpg?.image_url ||
                "/fallback.jpg"
              }
              alt={anime.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={false}
            />
          </div>

          <div className="p-2 bg-black/40 text-white text-sm truncate">
            {anime.title}
            <div className="text-xs text-amber-400 mt-1 flex items-center gap-1">
              <span>⭐</span>
              {anime.score ? anime.score.toFixed(2) : "N/A"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
