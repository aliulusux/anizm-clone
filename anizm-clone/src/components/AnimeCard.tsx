// src/components/AnimeCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  id: number;
  title: string;
  cover: string;
  href?: string;
};

export default function AnimeCard({ id, title, cover, href }: Props) {
  const [imgSrc, setImgSrc] = useState(cover);
  const card = (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-white/20 transition">
      <div className="relative w-full aspect-[2/3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={title}
          onError={() => setImgSrc(`/api/cover?title=${encodeURIComponent(title)}&seed=${id}`)}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-70 transition" />
      </div>
      <div className="p-2 text-center">
        <h3 className="line-clamp-2 text-sx font-medium">{title}</h3>
      </div>
      <div className="absolute inset-0 ring-1 ring-white/10 group-hover:ring-white/30 rounded-2xl pointer-events-none" />
    </div>
  );

  return href ? (
    <Link href={href} prefetch={false} className="block">{card}</Link>
  ) : card;
}
