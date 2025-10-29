import Header from "@/components/Header";
import AnimeCard from "@/components/AnimeCard";
import AuthGate from "@/components/AuthGate";

export const dynamic = "force-dynamic";

async function fetchHot() {
  try {
    const base =
      process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000";

    const res = await fetch(`${base}/api/anidb/hotanime`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error("Fetch failed:", res.status, await res.text());
      return [];
    }

    const data = await res.json();

    // Ensure we always return an array
    const items = Array.isArray(data.items)
      ? data.items
      : Array.isArray(data)
      ? data
      : [];

    return items.slice(0, 18).map((x: any) => ({
      aid: x.aid || Math.random(),
      title: x.title || `Anime #${x.aid || "Unknown"}`,
    }));
  } catch (err) {
    console.error("Error fetching AniDB hotanime:", err);
    return [];
  }
}

export default async function Home() {
  const hot = await fetchHot();

  return (
    <div>
      <Header />
      <main className="container">
        <section className="glass" style={{ padding: "18px", marginBottom: 18 }}>
          <AuthGate />
        </section>

        <section className="glass" style={{ padding: "18px" }}>
          <h2 style={{ margin: "6px 0 12px 0" }}>Bu Sezon Popüler</h2>

          {hot.length === 0 ? (
            <p style={{ opacity: 0.7 }}>Hiç anime bulunamadı 😢</p>
          ) : (
            <div className="grid">
              {hot.map((a: any) => (
                <AnimeCard key={a.aid} aid={a.aid} title={a.title} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
