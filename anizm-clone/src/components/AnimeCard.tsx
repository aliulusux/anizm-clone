import Link from "next/link";
import Image from "next/image";

export default function AnimeCard({
  aid,
  title,
  image,
}: {
  aid: string | number;
  title: string;
  image?: string;
}) {
  return (
    <Link
      href={`/anime/${aid}`}
      className="anime-card"
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
        background: "rgba(255,255,255,0.05)",
        textDecoration: "none",
        color: "inherit",
        width: "160px",
        minWidth: "160px",
      }}
    >
      <div
        className="glass"
        style={{
          width: "100%",
          aspectRatio: "3 / 4", // makes consistent proportions
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Image
          src={image}
          alt={title}
          width={300}
          height={400}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            borderRadius: "12px 12px 0 0",
          }}
        />
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
              fontSize: 13,
            }}
          >
            Görsel Yok
          </div>
      </div>
      <div style={{ padding: 10 }}>
        <p
          style={{
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </p>
        <p style={{ opacity: 0.6, fontSize: 12 }}>AID {aid}</p>
      </div>
    </Link>
  );
}
