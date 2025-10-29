/* -------------------------------- page -------------------------------- */

import Image from "next/image";

type Params = { params: { aid: string } };

// ----------------------- Server-side data loaders -----------------------

async function fetchAnime(aid: string | number) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/jikan/anime/${aid}`, {
    // Cache a little; tune as you wish
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Anime fetch failed");
  return res.json();
}

async function fetchEpisodes(aid: string | number) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/jikan/episodes/${aid}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Episodes fetch failed");
  return res.json();
}

/**
 * Returns normalized related items shaped as:
 *   { aid: number; title: string; image?: string }
 *
 * Your existing API route already returns these fields; the only issue
 * was that the render code still referenced `mal_id`. We fix that below.
 */
async function getRelatedAnimeWithCovers(aid: number) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/jikan/related/${aid}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Related fetch failed");
  const data = await res.json();
  return (data?.items || []) as Array<{ aid: number; title: string; image?: string }>;
}

// -------------------------------- Page ---------------------------------

export default async function AnimePage({ params }: Params) {
  const aidNum = Number(params.aid);

  // load everything in parallel
  const [anime, episodes, related] = await Promise.all([
    fetchAnime(aidNum),
    fetchEpisodes(aidNum),
    getRelatedAnimeWithCovers(aidNum),
  ]);

  if (!anime) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "20vh",
          opacity: 0.8,
        }}
      >
        Bu anime yüklenemedi veya bulunamadı.
      </div>
    );
  }

  // cover selection (keep your existing priority order)
  const cover =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    anime.images?.webp?.large_image_url ||
    anime.images?.webp?.image_url ||
    "";

  // --------------- UI (unchanged – same structure/styles) ---------------

  return (
    <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      {/* header / hero */}
      <section
        className="glass"
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: 16,
          alignItems: "stretch",
          padding: 16,
          borderRadius: 16,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            width: 180,
            height: 240,
            overflow: "hidden",
            borderRadius: 12,
            position: "relative",
          }}
        >
          {cover ? (
            <Image
              src={cover}
              alt={anime.title}
              fill
              sizes="180px"
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(255,255,255,0.06)",
                display: "grid",
                placeItems: "center",
                color: "#bbb",
                fontSize: 12,
              }}
            >
              Görsel Yok
            </div>
          )}
        </div>

        <div>
          <h1 style={{ margin: 0, marginBottom: 8 }}>{anime.title}</h1>
          <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.9 }}>
            {anime.synopsis || ""}
          </p>
        </div>
      </section>

      {/* Episodes (horizontal scroller – styling kept) */}
      {Array.isArray(episodes?.items) && episodes.items.length > 0 && (
        <section className="glass" style={{ padding: 16, borderRadius: 16, marginBottom: 22 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Bölümler</h3>

          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 8,
              scrollbarWidth: "thin",
            }}
            className="episodes-scroll"
          >
            {episodes.items.map((ep: any) => (
              <div
                key={ep.mal_id || ep.episode_id || `${ep.aired}-${ep.title}`}
                className="glass"
                style={{
                  minWidth: 260,
                  padding: 10,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <strong>
                  Bölüm {ep.mal_id || ep.mal || ep.number}: {ep.title}
                </strong>
                <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                  {ep.aired ? new Date(ep.aired).toLocaleDateString() : "—"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related / Benzer Animeler — ONLY fix is mal_id -> aid */}
      <section className="glass" style={{ padding: 16, borderRadius: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Benzer Animeler</h3>

        {related && related.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 8,
              scrollbarWidth: "thin",
            }}
          >
            {related.map((r) => (
              <a
                key={r.aid}
                href={`/anime/${r.aid}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="glass"
                  style={{
                    width: 150,
                    padding: 10,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      overflow: "hidden",
                      borderRadius: 10,
                      position: "relative",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    {r.image ? (
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        sizes="150px"
                        style={{ objectFit: "cover" }}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "grid",
                          placeItems: "center",
                          color: "#bbb",
                          fontSize: 12,
                        }}
                      >
                        Görsel Yok
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.9 }}>
                    {r.title}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ opacity: 0.7, margin: 0 }}>Benzer anime bulunamadı.</p>
        )}
      </section>

      {/* Optional: slim scroll styling hook (kept subtle) */}
      <style
        // keep the existing class and only affect the scrollbar track/thumb
        dangerouslySetInnerHTML={{
          __html: `
            .episodes-scroll::-webkit-scrollbar { height: 8px; }
            .episodes-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .episodes-scroll::-webkit-scrollbar-thumb {
              background: rgba(255,255,255,0.12);
              border-radius: 9999px;
            }
            .episodes-scroll { scrollbar-color: rgba(255,255,255,0.12) transparent; }
          `,
        }}
      />
    </main>
  );
}
