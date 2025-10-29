"use client";
import Link from "next/link";

export default function AnimeCard({ aid, title, image }: any) {
  return (
    <Link href={`/anime/${aid}`}>
      <div className="anime-card glass">
        <img
          src={image || "/placeholder.jpg"}
          alt={title}
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
        <div className="anime-info">
          <h3>{title}</h3>
          <p style={{ opacity: 0.7 }}>AID {aid}</p>
        </div>
      </div>
    </Link>
  );
}
