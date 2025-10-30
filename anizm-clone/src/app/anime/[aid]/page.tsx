// src/app/anime/[aid]/page.tsx
import { getAnime, getEpisodes, getRelatedWithCovers, getRecommendations, getTrailer, coverFallbackUrl } from "@/lib/jikan";
import AnimeCard from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";

type Params = { params: { aid: string } };

export const revalidate = 300;

export default async function AnimePage({ params }: Params) {
  const aid = params.aid;

  const [anime, related, recs, trailer] = await Promise.all([
    getAnime(aid),
    getRelatedWithCovers(aid),
    getRecommendations(aid),
    getTrailer(aid),
  ]);

  const cover =
    anime?.images?.jpg?.large_image_url ??
    anime?.images?.jpg?.image_url ??
    coverFallbackUrl(anime?.title || "Unknown", String(anime?.mal_id || aid));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-10">
      {/* Hero */}
      <div className="grid flex-wrap md:grid-cols-[240px,1fr] gap-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt={anime.title} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold">{anime.title}</h1>
          {anime.title_english && anime.title_english !== anime.title && (
            <p className="text-white/70">{anime.title_english}</p>
          )}
          <div className="flex flex-wrap gap-2 text-sm text-white/70">
            <span>Score: <b className="text-white">{anime.score ?? "—"}</b></span>
            <span>Rank: <b className="text-white">#{anime.rank ?? "—"}</b></span>
            <span>Popularity: <b className="text-white">#{anime.popularity ?? "—"}</b></span>
            <span>Episodes: <b className="text-white">{anime.episodes ?? "—"}</b></span>
            <span>Status: <b className="text-white">{anime.status ?? "—"}</b></span>
          </div>

          {trailer && (
            <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src={trailer}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Synopsis */}
      {anime.synopsis && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Synopsis</h2>
          <p className="text-white/80 leading-relaxed">{anime.synopsis}</p>
        </section>
      )}

      {/* Related */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Related</h2>
        {related.length ? (
        <div className="grid flex-wrap justify-center gap-3 w-full max-w-6xl mx-auto px-2">
          {related.map((r: any) => (
            <AnimeCard
              key={r.mal_id}
              id={r.mal_id}
              title={r.title}
              cover={
                r.images?.jpg?.large_image_url ||
                r.images?.jpg?.image_url ||
                `/api/cover?title=${encodeURIComponent(r.title)}&seed=${r.mal_id}`
              }
              href={`/anime/${r.mal_id}`}
              score={r.score}
              episodes={r.episodes}
              year={r.year || r.aired?.prop?.from?.year}
            />
          ))}
        </div>
      ) : null}
      </section>

      {/* Recommendations */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recommended</h2>
        {recs.length ? (
          <div className="grid flex-wrap justify-center gap-3 w-full max-w-6xl mx-auto px-2">
            {recs.map((r: any) => (
              <AnimeCard
                key={r.mal_id}
                id={r.mal_id}
                title={r.title}
                cover={
                  r.images?.jpg?.large_image_url ||
                  r.images?.jpg?.image_url ||
                  `/api/cover?title=${encodeURIComponent(r.title)}&seed=${r.mal_id}`
                }
                href={`/anime/${r.mal_id}`}
                score={r.score}
                episodes={r.episodes}
                year={r.year || r.aired?.prop?.from?.year}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* Comments placeholder (future) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Comments</h2>
        <div className="rounded-2xl border border-white/10 p-6 text-sm text-white/70">
          Coming soon — Supabase-powered comments.
        </div>
      </section>
    </div>
  );
}
