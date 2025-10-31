import Image from "next/image";
import Link from "next/link"

export default function AnimeGrid({ animeList }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {animeList.map((anime) => {
        // pick the best image URL
        const rawUrl =
          anime.images?.jpg?.large_image_url ||
          anime.images?.jpg?.image_url ||
          "";

        // MAL sometimes returns malformed URLs with double encoding
        const imageUrl = decodeURIComponent(rawUrl);

        return (
          <a
            key={anime.mal_id}
            href={`/anime/${anime.mal_id}`}
            className="group glass rounded-2xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            {/* ⚡ Custom loader bypasses _next/image optimization */}
            <Image
              loader={() => imageUrl}
              src={imageUrl}
              alt={anime.title}
              width={300}
              height={420}
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="p-2 bg-black/40 text-white text-sm truncate">
              {anime.title}
            </div>
            <div className="flex items-center gap-1 text-yellow-400 text-xs p-2 pt-0">
              <span>★</span>
              <span>{anime.score || "?"}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
