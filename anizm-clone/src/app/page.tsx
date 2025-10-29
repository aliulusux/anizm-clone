import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import AnimeCard from "@/components/AnimeCard";
import AuthGate from "@/components/AuthGate";

export const dynamic = "force-dynamic";

async function fetchHot(query?: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = query
      ? `${base}/api/anidb/search?q=${encodeURIComponent(query)}`
      : `${base}/api/anidb/hotanime`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Failed to fetch anime list");

    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("fetchHot error:", err);
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q || "";
  const hot = await fetchHot(query);

  return (
    <div>
      <Suspense fallback={<div style={{ padding: 20 }}>Yükleniyor...</div>}>
        <Header />
      </Suspense>

      <main className="container">
        <section className="glass" style={{ padding: "18px", marginBottom: 18 }}>
          <AuthGate />
        </section>

        <section className="glass" style={{ padding: "18px" }}>
          <h2 style={{ margin: "6px 0 12px 0" }}>
            {query ? `"${query}" için arama sonuçları` : "Bu Sezon Popüler"}
          </h2>

          <div className="grid">
            {hot.length > 0 ? (
              hot.map((a: any) => <AnimeCard key={a.aid} aid={a.aid} title={a.title} />)
            ) : (
              <p style={{ opacity: 0.7 }}>Hiç anime bulunamadı 😔</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
