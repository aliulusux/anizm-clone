// components/AnimeGrid.jsx
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export default function AnimeGrid({ animeList = [], dense = false }) {
  if (!animeList?.length) {
    return (
      <div className="py-16 text-center text-gray-600 dark:text-gray-300">
        Bu türde anime bulunamadı. <span className="text-sm">🥲</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "grid gap-6",
        dense
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      )}
    >
      {animeList.map((a) => (
        <Link
          key={a.mal_id}
          href={`/anime/${a.mal_id}`}
          className="group block overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={
                a.images?.webp?.image_url ||
                a.images?.jpg?.large_image_url ||
                a.images?.jpg?.image_url ||
                "/placeholder.png"
              }
              alt={a.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              priority={false}
            />
          </div>

          <div className="p-3">
            <h3 className="line-clamp-2 text-[0.95rem] font-semibold text-indigo-600 dark:text-indigo-300 group-hover:text-indigo-500 transition-colors">
              {a.title}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-[0.85rem]">
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 dark:bg-yellow-300/15 px-2 py-1 text-yellow-700 dark:text-yellow-300 ring-1 ring-yellow-500/20">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="shrink-0"
                >
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                {(a.score ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/*<span>⭐</span>*/
