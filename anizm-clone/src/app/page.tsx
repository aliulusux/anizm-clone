import { Suspense } from "react";
import Header from "@/components/Header";
import AuthGate from "@/components/AuthGate";
import AnimeCard from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid"; // we'll add this next

async function fetchHot() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/anidb/hotanime`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("Failed to fetch hot anime:", err);
    return [];
  }
}

async function AnimeGrid() {
  const hot = await fetchHot();
  if (!hot || hot.length === 0)
    return <p style={{ opacity: 0.7 }}>Hiç anime bulunamadı 😢</p>;

  return (
    <div className="grid">
      {hot.map((a: any) => (
        <AnimeCard key={a.aid} aid={a.aid} title={a.title} />
      ))}
    </div>
  );
}

export default async function Home() {
  return (
    <div>
      <Header />
      <main className="container">
        <section className="glass" style={{ padding: "18px", marginBottom: 18 }}>
          <AuthGate />
        </section>

        <section className="glass" style={{ padding: "18px" }}>
          <h2 style={{ margin: "6px 0 12px 0" }}>Bu Sezon Popüler</h2>
          <Suspense fallback={<LoadingGrid />}>
            <AnimeGrid />
          </Suspense>
        </section>
      </main>
    </div>
  );
}