/* -------------------------------- page -------------------------------- */

import Image from "next/image";
import Header from "@/components/Header";

type Params = { params: { aid: string } };

// ----------------------- Server-side data loaders -----------------------

async function fetchAnime(aid: string | number) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${aid}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function fetchEpisodes(aid: string | number) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${aid}/episodes`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { items: [] };
    const data = await res.json();
    return { items: data.data || [] };
  } catch {
    return { items: [] };
  }
}

async function getRelatedAnimeWithCovers(aid: number) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${aid}/relations`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const entries =
      data.data
        ?.flatMap((r: any) =>
          (r.entry || []).map((e: any) => ({
            aid: e.mal_id,
            title: e.name,
            image:
              e.images?.jpg?.large_image_url ||
              e.images?.jpg?.image_url ||
              e.images?.webp?.large_image_url ||
              e.images?.webp?.image_url,
          }))
        )
        .filter((x: any) => x.aid && x.title) || [];

    // helper: wait a bit between API calls
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // helper: fetch with retry and graceful fallback
    async function fetchCover(id: number, attempt = 0): Promise<string | null> {
      try {
        const r = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        if (!r.ok) throw new Error();
        const j = await r.json();
        return (
          j.data?.images?.jpg?.large_image_url ||
          j.data?.images?.jpg?.image_url ||
          j.data?.images?.webp?.large_image_url ||
          j.data?.images?.webp?.image_url ||
          null
        );
      } catch {
        if (attempt < 2) {
          await sleep(500); // retry a bit later
          return fetchCover(id, attempt + 1);
        }
        return null;
      }
    }
    

    const withImages: any[] = [];
    for (const item of entries) {
      if (item.image) {
        withImages.push(item);
        continue;
      }
      await sleep(350); // throttle to avoid rate-limit
      const image = await fetchCover(item.aid);
      withImages.push({
        ...item,
        image: image || "/placeholder.jpg", // fallback local image
      });
    }

    return withImages;
  } catch (err) {
    console.error("related fetch failed", err);
    return [];
  }
}

// -------------------------------- Page ---------------------------------

export default async function AnimePage({ params }: Params) {
  const aidNum = Number(params.aid);

  // Load everything in parallel
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
      <Header />
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

      {/* Related / Benzer Animeler — uses { aid, title, image } */}
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
            {related.map((r: { aid: number; title: string; image?: string }) => (
              <a key={r.aid} href={`/anime/${r.aid}`} style={{ textDecoration: "none" }}>
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

                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.9 }}>{r.title}</div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ opacity: 0.7, margin: 0 }}>Benzer anime bulunamadı.</p>
        )}
      </section>

      {/* slim scroll styling hook (kept subtle) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .episodes-scroll::-webkit-scrollbar { height: 8px; }
            .episodes-scroll::-webkit-scrollbar-track { background: transparent; }
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
