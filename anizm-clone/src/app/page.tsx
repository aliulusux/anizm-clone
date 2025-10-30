import { Suspense } from "react";
import Header from "@/components/Header";
import AnimeCard from "@/components/AnimeCard";
import AuthGate from "@/components/AuthGate";

// 🔥 Fetch top anime (En Popüler)
async function fetchHot(query?: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = query
      ? `${base}/api/anidb/search?q=${encodeURIComponent(query)}`
      : `${base}/api/anidb/cmd`;

    const res = await fetch(url, { next: { revalidate: 300 } } as any);
    if (!res.ok) throw new Error("Failed to fetch anime list");

    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("fetchHot error:", err);
    return [];
  }
}

// 🍂 Fetch current season anime (Bu Sezon Popüler)
async function fetchSeasonal() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/anidb/season`, {
      next: { revalidate: 21600 }, // refresh every 6 hours
    } as any);
    if (!res.ok) throw new Error("Failed to fetch seasonal anime list");
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("fetchSeasonal error:", err);
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q || "";
  const hot = await fetchHot(query);
  const seasonal = !query ? await fetchSeasonal() : [];

  // 🧩 Remove duplicates between seasonal and hot lists
  const seasonalUnique = seasonal.filter(
    (s: any) => !hot.some((h: any) => h.aid === s.aid)
  );

  return (
    <div>
      <Suspense fallback={<div style={{ padding: 20 }}>Yükleniyor...</div>}>
        <Header />
      </Suspense>

      <main className="container mx-auto px-4 py-6 space-y-10">
        <section className="glass p-4 rounded-2xl">
          <AuthGate />
        </section>

        {/* 🔍 Search Results */}
        {query ? (
          <section className="glass p-4 rounded-2xl">
            <h2 className="text-xl font-semibold mb-3">
              "{query}" için arama sonuçları
            </h2>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7
                         gap-4 place-items-center w-full max-w-7xl mx-auto px-2"
            >
              {hot.length > 0 ? (
                hot.map((a: any) => (
                  <AnimeCard
                    key={a.aid}
                    id={a.aid}
                    title={a.title}
                    cover={
                      a.images?.jpg?.large_image_url ||
                      a.images?.jpg?.image_url ||
                      a.image
                    }
                    href={`/anime/${a.aid}`}
                    score={a.score}
                    episodes={a.episodes}
                    year={a.year || a.aired?.prop?.from?.year}
                  />
                ))
              ) : (
                <p className="text-white/70">Hiç anime bulunamadı 😔</p>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* 🍂 Bu Sezon Popüler */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Bu Sezon Popüler</h2>

              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7
                            gap-4 place-items-center w-full max-w-7xl mx-auto px-4"
              >
                {seasonalUnique.length > 0 ? (
                  seasonalUnique.map((a: any) => (
                    <AnimeCard
                      key={a.aid}
                      id={a.aid}
                      title={a.title}
                      cover={
                        a.images?.jpg?.large_image_url ||
                        a.images?.jpg?.image_url ||
                        a.image ||
                        `/api/cover?title=${encodeURIComponent(
                          a.title
                        )}&seed=${a.aid}`
                      }
                      href={`/anime/${a.aid}`}
                      score={a.score}
                      episodes={a.episodes}
                      year={a.year || a.aired?.prop?.from?.year}
                    />
                  ))
                ) : (
                  <p className="text-white/70">
                    Bu sezon için anime bulunamadı 😔
                  </p>
                )}
              </div>
            </section>

            {/* 🔥 En Popüler */}
            <section className="space-y-4 mt-10">
              <h2 className="text-xl font-semibold">En Popüler</h2>

              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7
                            gap-4 place-items-center w-full max-w-7xl mx-auto px-4"
              >
                {hot.length > 0 ? (
                  hot.map((a: any) => (
                    <AnimeCard
                      key={a.aid}
                      id={a.aid}
                      title={a.title}
                      cover={
                        a.images?.jpg?.large_image_url ||
                        a.images?.jpg?.image_url ||
                        a.image
                      }
                      href={`/anime/${a.aid}`}
                      score={a.score}
                      episodes={a.episodes}
                      year={a.year || a.aired?.prop?.from?.year}
                    />
                  ))
                ) : (
                  <p className="text-white/70">Hiç anime bulunamadı 😔</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
