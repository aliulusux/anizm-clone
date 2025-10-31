import AnimeGrid from "@/components/AnimeGrid";
import LoaderLayout from "@/components/LoaderLayout";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function fetchGenre(name) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/jikan/genre?q=${encodeURIComponent(name)}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Genre fetch failed");
  return res.json();
}

export default async function GenrePage({ params }) {
  const genreName = decodeURIComponent(params.name);
  let data = null;

  try {
    data = await fetchGenre(genreName);
  } catch (err) {
    console.error("fetchGenre error:", err);
  }

  const animeList = data?.items || [];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 🌈 Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-800/40 via-purple-700/20 to-background blur-3xl opacity-70" />

      <section className="container mx-auto px-6 py-20 relative">
        {/* 🧭 Glassy Back Button */}
        <Link
          href="/"
          className="absolute top-8 left-6 md:left-10 px-5 py-2.5 rounded-full border border-white/20 
          bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-md 
          transition-all duration-300 shadow-md hover:shadow-white/20 fade-up"
        >
          ← Geri Dön
        </Link>

        {/* 🎴 Glass Header */}
        <div className="glass mx-auto max-w-4xl p-8 rounded-3xl text-center backdrop-blur-md shadow-xl border border-white/10 fade-up">
          <h1 className="text-4xl font-bold text-white tracking-wide">
            {genreName} <span className="text-orange-400">Animeleri</span>
          </h1>
          <p className="mt-2 text-white/70 text-sm">
            {animeList.length
              ? `${animeList.length} anime bulundu`
              : "Bu türde anime bulunamadı 😢"}
          </p>
        </div>

        {/* 💫 Anime Grid */}
        <div className="mt-16">
          <Suspense fallback={<p className="text-center text-gray-400">Yükleniyor...</p>}>
            {animeList.length > 0 ? (
              <LoaderLayout count={animeList.length}>
                <AnimeGrid animeList={animeList} />
              </LoaderLayout>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                <p>Bu türde anime bulunamadı 😢</p>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </main>
  );
}
