import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import AnimeGrid from "@/components/AnimeGrid";
import GenreTabs from "@/components/GenreTabs";
import LoaderLayout from "@/components/LoaderLayout";
import { getTopAnime } from "@/lib/jikan";

export const revalidate = 300;

export default async function HomePage() {
  const items = await getTopAnime(24);

  return (
    <main className="container py-8 space-y-10">
      <Header />

      {/* 🔍 Search */}
      <section className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">Anime Ara</h2>
        <SearchBar />
      </section>

      {/* 🔥 Top Anime */}
      <section className="space-y-4">
        <h2 className="grid-title">En Popüler Animeler</h2>
        <LoaderLayout count={16}>
          <AnimeGrid animeList={items} />
        </LoaderLayout>
      </section>

      {/* 🎨 Genres */}
      <section className="space-y-4">
        <h2 className="grid-title">Türlere Göre Keşfet</h2>
        <GenreTabs />
      </section>
    </main>
  );
}
