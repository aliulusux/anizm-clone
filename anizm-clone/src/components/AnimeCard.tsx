import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

/** Main details */
async function fetchAnime(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    if (!res.ok) throw new Error("Failed to fetch anime details");
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchAnime error:", err);
    return null;
  }
}

/** Episodes (Jikan is paginated). We’ll pull up to ~100 episodes server-side. */
async function fetchEpisodes(id: string) {
  const episodes: any[] = [];
  let page = 1;
  try {
    // hard cap to avoid very long builds; increase if you want more
    while (page <= 4) {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`
      );
      if (!res.ok) break;
      const data = await res.json();
      episodes.push(...(data.data || []));
      if (!data.pagination?.has_next_page) break;
      page++;
    }
  } catch (err) {
    console.error("fetchEpisodes error:", err);
  }
  return episodes;
}

/** Related anime + covers: relations API doesn’t include images, so fetch details for each MAL id. */
async function fetchRelatedWithCovers(id: string) {
  try {
    const relRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
    if (!relRes.ok) throw new Error("Failed to fetch related anime");
    const relJson = await relRes.json();
    const ids: number[] =
      relJson.data
        ?.flatMap((r: any) => r.entry)
        ?.filter((e: any) => e.type === "anime")
        ?.map((e: any) => e.mal_id) || [];

    // de-dup & cap to a reasonable number
    const unique = Array.from(new Set(ids)).slice(0, 16);

    const detailed = await Promise.all(
      unique.map(async (malId) => {
        try {
          const d = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
          if (!d.ok) return null;
          const dj = await d.json();
          return dj.data;
        } catch {
          return null;
        }
      })
    );

    return detailed.filter(Boolean);
  } catch (err) {
    console.error("fetchRelatedWithCovers error:", err);
    return [];
  }
}

export default async function AnimePage({ params }: { params: { aid: string } }) {
  const [anime, related, episodes] = await Promise.all([
    fetchAnime(params.aid),
    fetchRelatedWithCovers(params.aid),
    fetchEpisodes(params.aid),
  ]);

  if (!anime) {
    return (
      <div className="glass" style={{ margin: "40px auto", padding: 24, width: "90%", textAlign: "center" }}>
        <h2>Anime bulunamadı 😔</h2>
        <Link href="/" className="button">Ana Sayfa</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: 40, marginBottom: 60 }}>
      {/* ====== DETAILS ====== */}
      <section
        className="glass"
        style={{
          display: "flex",
          gap: 24,
          padding: 24,
          borderRadius: 16,
          marginBottom: 40,
          alignItems: "flex-start",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <Image
            src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
            alt={anime.title}
            width={250}
            height={360}
            style={{ objectFit: "cover", borderRadius: 12 }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>{anime.title}</h1>
          <p style={{ opacity: 0.8, marginBottom: 16 }}>{anime.title_japanese || anime.title_english || ""}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <span className="badge">Tip: {anime.type || "Bilinmiyor"}</span>
            <span className="badge">Bölümler: {anime.episodes ?? "?"}</span>
            <span className="badge">Puan: {anime.score ?? "?"}</span>
            <span className="badge">Yıl: {anime.year ?? "?"}</span>
          </div>

          <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
            {anime.synopsis || "Bu anime hakkında açıklama bulunamadı."}
          </p>

          {anime.trailer?.embed_url && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 8 }}>Fragman</h3>
              <iframe
                src={anime.trailer.embed_url}
                title="Anime Trailer"
                allowFullScreen
                style={{
                  border: "none",
                  borderRadius: 12,
                  width: "100%",
                  maxWidth: 560,
                  height: 315,
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* ====== EPISODES ====== */}
      {episodes.length > 0 && (
        <section className="glass" style={{ padding: 20, borderRadius: 16, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Bölümler</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {episodes.map((ep: any) => (
              <div
                key={ep.mal_id}
                className="glass"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  Bölüm {ep.mal_id || ep.episode || ep.number || ""} {ep.title ? `— ${ep.title}` : ""}
                </div>
                {ep.title_japanese && (
                  <div style={{ opacity: 0.75, fontSize: 13, marginBottom: 4 }}>{ep.title_japanese}</div>
                )}
                <div style={{ opacity: 0.65, fontSize: 12 }}>
                  Yayın: {ep.aired ? new Date(ep.aired).toLocaleDateString() : "—"}
                </div>
              </div>
            ))}
          </div>

          {/* Hint to keep builds fast */}
          {anime.episodes && episodes.length < anime.episodes && (
            <p style={{ marginTop: 10, opacity: 0.7, fontSize: 13 }}>
              Not: İlk {episodes.length} bölüm gösteriliyor. İstersen “Daha Fazla Yükle” düğmesi ekleyelim.
            </p>
          )}
        </section>
      )}

      {/* ====== RELATED WITH COVERS ====== */}
      {related.length > 0 && (
        <section className="glass" style={{ padding: 20, borderRadius: 16, overflow: "hidden" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>İlgili Animeler</h2>

          <div
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              scrollBehavior: "smooth",
              paddingBottom: 10,
            }}
          >
            {related.map((rel: any) => (
              <Link
                key={rel.mal_id}
                href={`/anime/${rel.mal_id}`}
                style={{ flex: "0 0 auto", width: 150, textAlign: "center", color: "white" }}
              >
                <div
                  style={{
                    width: 150,
                    height: 220,
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 8,
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  {rel.images?.jpg?.image_url ? (
                    <Image
                      src={rel.images.jpg.image_url}
                      alt={rel.title}
                      width={150}
                      height={220}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        opacity: 0.6,
                      }}
                    >
                      Görsel Yok
                    </div>
                  )}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={rel.title}
                >
                  {rel.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
