import Header from "@/components/Header";
import AnimeGrid from "@/components/AnimeGrid";
import SearchBar from "@/components/SearchBar";
import { getTopAnime } from "@/lib/jikan";

export default async function HomePage() {
  const items = await getTopAnime(24);

  return (
    <main className="container py-8 space-y-8">
      <Header />

      <div className="flex flex-col lg:flex-row gap-8">
        <section className="flex-1 space-y-4">
          <h2 className="grid-title">Son Güncellenenler</h2>
          <AnimeGrid animeList={items} />
        </section>

        <aside className="lg:w-[360px]">
          <div className="glass p-4">
            <h3 className="text-lg font-semibold mb-3">Anime Ara</h3>
            <SearchBar />
          </div>

          <div className="glass p-4 mt-6">
            <h3 className="text-lg font-semibold mb-4">Popüler Seriler</h3>
            <ul className="space-y-3">
              {items.slice(0, 6).map((a) => (
                <li key={a.mal_id} className="flex items-center gap-3">
                  <img
                    src={a.images?.jpg?.image_url}
                    alt={a.title}
                    className="w-12 h-16 object-cover rounded-md"
                  />
                  <span className="text-sm font-medium line-clamp-2">{a.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
