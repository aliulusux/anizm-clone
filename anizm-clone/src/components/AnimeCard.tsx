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
      className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur
                 border border-white/10 hover:border-white/20 transition-all cursor-pointer
                 w-full max-w-[140px] mx-auto shadow-sm hover:shadow-md hover:scale-[1.02]"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                   bg-black/70 backdrop-blur-sm text-white text-[10px] p-1.5 flex flex-col gap-[2px]
                   items-center transition-all duration-300 ease-out"
      >
        {score && (
          <p className="text-amber-400 font-medium flex items-center gap-1">
            ⭐ <span>{score}</span>
          </p>
        )}
        {episodes && (
          <p className="text-white/90 flex items-center gap-1">
            🎞️ <span>{episodes} ep</span>
          </p>
        )}
        {year && (
          <p className="text-white/80 flex items-center gap-1">
            📅 <span>{year}</span>
          </p>
        )}
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-1.5 text-center pointer-events-none">
        <h3 className="line-clamp-2 text-[11px] font-medium text-white drop-shadow-sm">
          {title}
        </h3>
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
