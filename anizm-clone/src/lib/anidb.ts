import LRU from "lru-cache";
import { parseStringPromise } from "xml2js";

const cache = new LRU<string, any>({ max: 500, ttl: 1000 * 60 * 10 });
let lastCall = 0;
async function throttle() {
  const waitFor = Math.max(0, 2000 - (Date.now() - lastCall));
  if (waitFor) await new Promise(r => setTimeout(r, waitFor));
  lastCall = Date.now();
}

export async function anidbFetch(params: Record<string,string|number>) {
  const base = "http://api.anidb.net:9001/httpapi";
  const q = new URLSearchParams({
    client: process.env.ANIDB_CLIENT!,
    clientver: process.env.ANIDB_CLIENTVER!,
    protover: process.env.ANIDB_PROTO || "1",
    ...Object.fromEntries(Object.entries(params).map(([k,v])=>[k,String(v)]))
  });
  const url = `${base}?${q.toString()}`;
  const cached = cache.get(url);
  if (cached) return cached;
  await throttle();
  const res = await fetch(url, { headers: { "Accept-Encoding":"gzip" }});
  if (!res.ok) throw new Error(`AniDB error ${res.status}`);
  const xml = await res.text();
  const json = await parseStringPromise(xml, { explicitArray:false, mergeAttrs:true });
  cache.set(url, json);
  return json;
}

export async function getHotAnime(){
  const data = await anidbFetch({ request:"hotanime" });
  const list = (data?.anime?.hot as any[]) || [];
  return list.map((x:any)=> ({ aid: Number(x.id), weight: Number(x.votes || x.weight || 0) }));
}

export async function getAnimeById(aid: number){
  const data = await anidbFetch({ request:"anime", aid });
  return data;
}
