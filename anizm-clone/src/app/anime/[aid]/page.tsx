import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";

async function getDetails(aid:string){
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/anidb/anime/${aid}`, { next:{ revalidate:600 }});
  return r.json();
}

export default async function AnimeDetail({ params }:{params:{aid:string}}){
  const { data } = await getDetails(params.aid);
  const a = data?.anime || {};
  const titles = a?.titles?.title;
  const primary = Array.isArray(titles) ? titles.find((t:any)=>t?.type==='main') || titles[0] : titles;
  const title = primary?._ ?? `Anime #${params.aid}`;
  const poster = a?.picture ? `https://cdn.anidb.net/images/main/${a.picture}` : undefined;

  const episodes = Array.isArray(a?.episodes?.episode) ? a.episodes.episode : (a?.episodes?.episode ? [a.episodes.episode] : []);
  return (
    <>
      <Header />
      <main className="container">
        <div className="glass" style={{display:"grid", gridTemplateColumns:"280px 1fr", gap:"24px", padding:"24px"}}>
          <img src={poster || "/logo.svg"} alt={title} style={{width:"100%", borderRadius:12, border:"1px solid rgba(255,255,255,0.12)"}} />
          <div>
            <h1 style={{marginTop:0}}>{title}</h1>
            <div className="row">
              <span className="badge">AID {params.aid}</span>
              {a?.type && <span className="badge">{a.type}</span>}
              {a?.startdate && <span className="badge">Start: {a.startdate}</span>}
              <FavoriteButton aid={Number(params.aid)} />
            </div>
            <div className="hr"></div>
            {a?.description && <p style={{whiteSpace:"pre-wrap", color:"var(--muted)"}}>{a.description}</p>}
            <div className="hr"></div>
            <h3>Bölümler</h3>
            <div className="grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
              {episodes.slice(0,24).map((e:any, i:number)=>(
                <div key={i} className="glass" style={{padding:10}}>
                  <div style={{fontWeight:600}}>Ep {e?.epno?._ || e?.epno || i+1}</div>
                  <div style={{color:"var(--muted)"}}>{e?.title?._ || e?.title || "-"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
