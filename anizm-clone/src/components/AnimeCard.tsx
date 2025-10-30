"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  id: number;
  title: string;
  cover: string;
  href?: string;
  score?: number;
  episodes?: number;
  year?: number;
};

export default function AnimeCard({
  id,
  title,
  cover,
  href,
  score,
  episodes,
  year,
}: Props) {
  const [imgSrc, setImgSrc] = useState(cover);

  const card = (
    <div
      className="group relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm
                 border border-white/10 hover:border-white/20 transition-all cursor-pointer
                 w-full max-w-[120px] mx-auto shadow-sm hover:shadow-md hover:scale-[1.02]"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full">
        <img
          src={imgSrc}
          alt={title}
          onError={() =>
            setImgSrc(`/api/cover?title=${encodeURIComponent(title)}&seed=${id}`)
          }
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
          loading="lazy"
        />
      </div>

      {/* Hover Info */}
      <div
        className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 
                   bg-black/75 backdrop-blur text-white text-[10px] p-1.5 flex flex-col gap-[1px]
                   items-center transition-all duration-300 ease-out"
      >
        {score && (
          <p className="text-amber-400 font-medium flex items-center gap-1">
            ⭐ {score}
          </p>
        )}
        {episodes && (
          <p className="text-white/90 flex items-center gap-1">
            🎞️ {episodes} ep
          </p>
        )}
        {year && (
          <p className="text-white/80 flex items-center gap-1">
            📅 {year}
          </p>
        )}
      </div>

      {/* Title */}
      <div className="p-1 text-center text-[10px] text-white line-clamp-2 font-medium">
        {title}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} prefetch={false}>
      {card}
    </Link>
  ) : (
    card
  );
}
