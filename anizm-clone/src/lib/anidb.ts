import xml2js from "xml2js";

export async function getHotAnime() {
  const url = `https://api.anidb.net:9001/httpapi?request=hotanime&client=${process.env.ANIDB_CLIENT}&clientver=${process.env.ANIDB_CLIENTVER}&protover=${process.env.ANIDB_PROTO}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`AniDB returned ${res.status}`);

    const xml = await res.text();
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    const parsed = await parser.parseStringPromise(xml);

    const animeList = parsed?.animelist?.anime || [];

    const items = Array.isArray(animeList)
      ? animeList.map((a) => ({
          aid: a.id || a.aid || Math.random().toString(36).slice(2),
          title:
            typeof a.title === "string"
              ? a.title
              : Array.isArray(a.title)
              ? a.title[0]
              : a.title?._ || "Unknown Anime",
        }))
      : [];

    return { items };
  } catch (err: any) {
    console.error("Failed to fetch AniDB hotanime:", err);
    return { items: [] };
  }
}
