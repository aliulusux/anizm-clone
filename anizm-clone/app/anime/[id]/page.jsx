import Header from "@/components/Header";
import AnimeGrid from "@/components/AnimeGrid";
import { getAnimeFull } from "@/lib/jikan";

export default async function AnimeDetailPage({ params }) {
  const { id } = params;
  const { anime, recommendations } = await getAnimeFull(id);

  return (
    <main className="container py-8 space-y-8">
      <Header />

      <section className="glass p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={anime.images?.jpg?.image_url}
            alt={anime.title}
            className="w-56 md:w-64 rounded-xl shadow-md object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">{anime.title}</h1>
            {anime.title_english && (
              <div className="text-sm opacity-70 mb-1">{anime.title_english}</div>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres?.map((g) => (
                <span key={g.mal_id} className="badge">{g.name}</span>
              ))}
            </div>
            <p className="opacity-80 leading-relaxed">{anime.synopsis || "Açıklama bulunamadı."}</p>
            <div className="mt-4 text-sm opacity-70">
              Yayın: {anime.aired?.string ?? "—"} • Bölüm: {anime.episodes ?? "?"} • Puan: {anime.score ?? "—"}
            </div>
          </div>
        </div>
      </section>

      {recommendations?.length > 0 && (
        <section className="space-y-4">
          <h2 className="grid-title">Benzer / Önerilenler</h2>
          <AnimeGrid animeList={recommendations} />
        </section>
      )}
    </main>
  );
}
