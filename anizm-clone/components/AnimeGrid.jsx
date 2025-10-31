import Image from "next/image";

export default function AnimeGrid({ animeList }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {animeList.map((anime) => {
        const rawUrl =
          anime.images?.jpg?.large_image_url ||
          anime.images?.jpg?.image_url ||
          "";

        const imageUrl = decodeURIComponent(rawUrl);
        const title = anime.title || "Bilinmeyen Anime";
        const score = anime.score ? anime.score.toFixed(2) : "N/A";

        return (
          <a
            key={anime.mal_id}
            href={`/anime/${anime.mal_id}`}
            className="group glass rounded-2xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                loader={() => imageUrl}
                src={imageUrl}
                alt={title}
                width={300}
                height={420}
                unoptimized
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="flex flex-col justify-between flex-grow bg-black/40 text-white p-2">
              <p className="text-sm font-medium truncate" title={title}>
                {title}
              </p>
              <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
                <span>⭐</span>
                <span className="text-gray-100">{score}</span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
