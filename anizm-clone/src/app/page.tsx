import { Suspense } from "react";
import Header from "@/components/Header";
import AnimeCard from "@/components/AnimeCard";
import AuthGate from "@/components/AuthGate";

export const dynamic = "force-dynamic";

// 🔥 Fetch top anime (En Popüler)
async function fetchHot(query?: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = query
      ? `${base}/api/anidb/search?q=${encodeURIComponent(query)}`
      : `${base}/api/anidb/cmd`;

    const res = await fetch(url, { next: { revalidate: 300 } });
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
    });
    if (!res.ok) throw new Error("Failed to fetch seasonal anime list");
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("fetchSeasonal error:", err);
    return [];
  }
}

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

      <main className="container">
        <section className="glass" style={{ padding: "18px", marginBottom: 18 }}>
          <AuthGate />
        </section>

        {/* 🔍 Search Results */}
        {query ? (
          <section className="glass" style={{ padding: "18px" }}>
            <h2 style={{ margin: "6px 0 12px 0" }}>
              "{query}" için arama sonuçları
            </h2>
            <div className="grid">
              {hot.length > 0 ? (
                hot.map((a: any) => (
                  <AnimeCard params={{ aid: a.aid }} />
                ))
              ) : (
                <p style={{ opacity: 0.7 }}>Hiç anime bulunamadı 😔</p>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* 🍂 Bu Sezon Popüler */}
            <section
              className="glass"
              style={{
                padding: "18px",
                marginBottom: 18,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <h2 style={{ margin: "6px 12px 12px" }}>Bu Sezon Popüler</h2>

              <div
                className="carousel"
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "hidden",
                  scrollSnapType: "x mandatory",
                  padding: "6px 4px 10px 4px",
                  scrollBehavior: "smooth",
                }}
                id="season-carousel"
              >
                {seasonalUnique.length > 0 ? (
                  seasonalUnique.map((a: any) => (
                    <div
                      key={a.aid}
                      style={{
                        flex: "0 0 auto",
                        scrollSnapAlign: "start",
                      }}
                    >
                      <AnimeCard aid={a.aid} title={a.title} image={a.image} />
                    </div>
                  ))
                ) : (
                  <p style={{ opacity: 0.7 }}>Hiç anime bulunamadı 😔</p>
                )}
              </div>
            </section>

            <script
              dangerouslySetInnerHTML={{
                __html: `
                  const scroller = document.getElementById('season-carousel');
                  let scrollPos = 0;
                  setInterval(() => {
                    if (!scroller) return;
                    scrollPos += 200;
                    if (scrollPos >= scroller.scrollWidth - scroller.clientWidth) {
                      scrollPos = 0;
                    }
                    scroller.scrollTo({ left: scrollPos, behavior: 'smooth' });
                  }, 2500);
                `,
              }}
            />

            {/* 🔥 En Popüler */}
            <section
              className="glass"
              style={{
                padding: "24px 20px",
                marginBottom: "32px",
                overflow: "hidden",
                borderRadius: "16px",
              }}
            >
              <h2
                style={{
                  marginBottom: "16px",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                En Popüler
              </h2>

              <div
                className="grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "18px",
                  justifyItems: "center",
                }}
              >
                {hot.length > 0 ? (
                  hot.map((a: any) => (
                    <AnimeCard key={a.aid} aid={a.aid} title={a.title} image={a.image} />
                  ))
                ) : (
                  <p style={{ opacity: 0.7 }}>Hiç anime bulunamadı 😔</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
