"use client";
import Link from "next/link";
import Image from "next/image";

export default function AnimeCard({ aid, title, image }: any) {
  return (
    <Link href={`/anime/${aid}`} className="anime-card">
      <div
        className="glass"
        style={{
          width: "180px",
          height: "310px",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(10px)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "240px",
            overflow: "hidden",
          }}
        >
          <Image
            src={image || "/placeholder.jpg"}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            padding: "8px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
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
