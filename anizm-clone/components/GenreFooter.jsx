"use client";

import Link from "next/link";

const genres = [
  "Aksiyon", "Askeri", "Bilim Kurgu", "Büyü", "Doğaüstü Güçler", "Dram", "Dövüş",
  "Ecchi", "Fantastik", "Gerilim", "Gizem", "Harem", "Josei", "Komedi", "Korku",
  "Macera", "Mecha", "Film", "Müzik", "OVA", "Okul", "Oyun", "Psikolojik", "Romantizm",
  "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Yaşamdan Kesitler", "Spor",
  "Süper Güç", "Tarihi", "Uzay", "Vampir", "Yaoi", "Yuri", "Polisiye", "Samuray",
  "Parodi", "Şeytanlar", "Savaş Sanatları", "Çocuk", "Ona", "Arabalar", "Kişilik Bölünmesi"
];

export default function GenreFooter() {
  return (
    <footer className="py-16 bg-gradient-to-b from-background/60 to-background/90 border-t border-white/10 backdrop-blur-md mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-white/90">Anime Türleri</h2>

        <div className="flex flex-wrap justify-center gap-3">
          {genres.map((genre, i) => (
            <Link
              key={i}
              href={`/genre/${encodeURIComponent(genre.toLowerCase())}`}
              className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-sm text-white/80 hover:text-white transition-all duration-300"
            >
              {genre}
            </Link>
          ))}
        </div>

        <p className="text-center text-xs mt-10 text-white/40">
          © 2025 Tranimeci-style — Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
