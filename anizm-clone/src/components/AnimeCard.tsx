"use client";
import Link from "next/link";
import Image from "next/image";

interface AnimeCardProps {
  aid: number | string;
  title: string;
  image?: string;
}

export default function AnimeCard({ aid, title, image }: AnimeCardProps) {
  return (
    <Link href={`/anime/${aid}`} className="anime-card">
      <div
        className="glass"
        style={{
          width: "180px",
          height: "300px",
          borderRadius: "16px",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "rgba(255,255,255,0.04)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "240px",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <Image
            src={image || "/placeholder.jpg"}
            alt={title}
            fill
            sizes="180px"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div style={{ padding: "8px 10px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={title}
          >
            {title}
          </h3>
          <p style={{ opacity: 0.6, fontSize: "12px" }}>AID {aid}</p>
        </div>
      </div>
    </Link>
  );
}
