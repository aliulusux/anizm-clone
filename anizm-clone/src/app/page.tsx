import { Suspense } from "react";
import LoadingGrid from "@/components/LoadingGrid"; // we'll add this next

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
