import Link from "next/link";

export default function AnimeCard({ aid, title, poster }:{
  aid:number; title:string; poster?:string;
}) {
  return (
    <Link className="glass card" href={`/anime/${aid}`}>
      <img src={poster || "/logo.svg"} alt={title} />
      <div className="meta">
        <div style={{fontWeight:600, lineHeight:1.25}}>{title}</div>
        <div className="row" style={{marginTop:8}}><span className="badge">AID {aid}</span></div>
      </div>
    </Link>
  );
}
