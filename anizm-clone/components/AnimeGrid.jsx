'use client';

import Image from 'next/image';
import Link from 'next/link';

function cardCover(anime) {
  return (
    anime?.images?.jpg?.large_image_url ||
    anime?.images?.jpg?.image_url ||
    anime?.image_url ||
    ''
  );
}

export default function AnimeGrid({ animeList = [] }) {
  if (!Array.isArray(animeList)) animeList = [];

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
      {animeList.map((a, i) => {
        const cover = cardCover(a);
        const score = Number(a?.score) || null;
        const href = `/anime/${a?.mal_id || a?.id}`;

        return (
          <Link
            key={`${a.mal_id || a.id}-${i}`}
            href={href}
            className="group block rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.45)]
            hover:border-blue-400/70 hover:bg-white/60 dark:hover:bg-white/20transition overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          >
            <div className="relative aspect-[2.6/4] w-full overflow-hidden rounded-t-2xl">
              {/* 
                unoptimized = true → if the optimizer fails or rate-limits, image still shows.
                We still keep remotePatterns so optimizer works when available.
              */}
              <Image
                src={cover || '/placeholder.svg'}
                alt={a?.title || 'Anime'}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw"
                priority={i < 6}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/0 group-hover:ring-white/20 transition" />
            </div>

            <div className="p-4">
              <h3 className="text-[15px] font-semibold leading-snug text-white/90 group-hover:text-white">
                {a?.title || 'Untitled'}
              </h3>

              {score ? (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[13px] text-amber-300">
                  <span>⭐</span>
                  <span className="font-semibold">{score.toFixed(2)}</span>
                </div>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
