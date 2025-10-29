import React from "react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

// -------- Fetch Anime Details --------
async function fetchAnime(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    if (!res.ok) throw new Error("Anime fetch failed");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("fetchAnime error:", err);
    return null;
  }
}

// -------- Fetch Episodes --------
async function fetchEpisodes(id: string) {
  const episodes: any[] = [];
  let page = 1;
  try {
    while (page <= 3) {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`
      );
      if (!res.ok) break;
      const json = await res.json();
      episodes.push(...(json.data || []));
      if (!json.pagination?.has_next_page) break;
      page++;
    }
  } catch (err) {
    console.error("fetchEpisodes error:", err);
  }
  return episodes;
}

// -------- Fetch Related Anime --------
async function fetchRelated(id: string) {
  try {
    const relRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
    if (!relRes.ok) throw new Error("Relations fetch failed");
    const relJson = await relRes.json();

    const ids: number[] = [];
    if (Array.isArray(relJson.data)) {
      for (const rel of relJson.data) {
        if (Array.isArray(rel.entry)) {
          for (const e of rel.entry) {
            if (e.type === "anime" && e.mal_id) ids.push(e.mal_id);
          }
        }
      }
    }

    const unique = Array.from(new Set(ids)).slice(0, 12);
    const detailed = await Promise.all(
      unique.map(async (malId) => {
        try {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
          if (!res.ok) return null;
          const json = await res.json();
          return json.data;
        } catch {
          return null;
        }
      })
    );
    return detailed.filter(Boolean);
  } catch (err) {
    console.error("fetchRelated error:", err);
    return [];
  }
}

// -------- Actual Page Component --------
export default async function AnimePage({
  params,
}: {
  params: { aid: string };
}): Promise<JSX.Element> {
  const anime = await fetchAnime(params.aid);
  const episodes = await fetchEpisodes(params.aid);
  const related = await fetchRelated(params.aid);

  if (!anime) {
    return (
      <div
        className="glass"
        style={{ margin: "60px auto", padding: 24, width: "80%", textAlign: "center" }}
      >
        <h2>Anime bulunamadı 😔</h2>
        <Link href="/" className="button">
          Ana Sayfa
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: 40, marginBottom: 60 }}>
      {/* -------- Details -------- */}
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
            src={
              anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
            }
            alt={anime.title}
            width={260}
            height={360}
            style={{ objectFit: "cover", borderRadius: 12 }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>{anime.title}</h1>
          <p style={{ opacity: 0.7, marginBottom: 10 }}>
            {anime.title_japanese || anime.title_english}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 15,
            }}
          >
            <span className="badge">Tip: {anime.type}</span>
            <span className="badge">Bölümler: {anime.episodes ?? "?"}</span>
            <span className="badge">Puan: {anime.score ?? "?"}</span>
            <span className="badge">Yıl: {anime.year ?? "?"}</span>
          </div>

          <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
            {anime.synopsis || "Bu anime hakkında bilgi bulunamadı."}
          </p>
        </div>
      </section>

      {/* -------- Episodes -------- */}
      {episodes.length > 0 && (
        <section
          className="glass"
          style={{
            padding: 20,
            borderRadius: 16,
            marginBottom: 40,
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 14 }}>Bölümler</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {episodes.map((ep: any) => (
              <div
                key={ep.mal_id || ep.episode_id}
                className="glass"
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <strong>
                  Bölüm {ep.mal_id || ep.mal || ep.number}: {ep.title}
                </strong>
                <p style={{ fontSize: 13, opacity: 0.7 }}>
                  {ep.aired ? new Date(ep.aired).toLocaleDateString() : "—"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* -------- Related Anime -------- */}
      {related.length > 0 && (
        <section className="glass" style={{ padding: 20, borderRadius: 16 }}>
          <h2 style={{ fontSize: 20, marginBottom: 14 }}>İlgili Animeler</h2>
          <div
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
            }}
          >
            {related.map((rel: any) => (
              <Link
                key={rel.mal_id}
                href={`/anime/${rel.mal_id}`}
                style={{
                  flex: "0 0 auto",
                  width: 150,
                  textAlign: "center",
                  color: "white",
                }}
              >
                <div
                  style={{
                    width: 150,
                    height: 220,
                    borderRadius: 10,
                    overflow: "hidden",
                    marginBottom: 8,
                    background: "rgba(255,255,255,0.05)",
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
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
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
