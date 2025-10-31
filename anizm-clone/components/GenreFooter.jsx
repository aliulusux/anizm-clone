"use client";

import Link from "next/link";



/*const genres = [
  "Aksiyon", "Askeri", "Bilim Kurgu", "Büyü", "Doğaüstü Güçler", "Dram", "Dövüş",
  "Ecchi", "Fantastik", "Gerilim", "Gizem", "Harem", "Josei", "Komedi", "Korku",
  "Macera", "Mecha", "Film", "Müzik", "OVA", "Okul", "Oyun", "Psikolojik", "Romantizm",
  "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Yaşamdan Kesitler", "Spor",
  "Süper Güç", "Tarihi", "Uzay", "Vampir", "Yaoi", "Yuri", "Polisiye", "Samuray",
  "Parodi", "Şeytanlar", "Savaş Sanatları", "Çocuk", "Ona", "Arabalar", "Kişilik Bölünmesi"
];*/

export default function Footer() {
  return (
    <footer
      className="
        mt-10
        rounded-2xl
        mx-auto
        max-w-6xl
        py-10 px-6
        text-center text-sm
        backdrop-blur-md
        transition-all duration-500
        shadow-inner
        border border-white/10 dark:border-white/5
        bg-gradient-to-b 
        from-white/70 via-white/50 to-white/30
        dark:from-gray-900/80 dark:via-gray-800/70 dark:to-gray-900/60
        text-gray-800 dark:text-gray-300
      "
    >
      <h2 className="text-xl font-semibold mb-6">Anime Türleri</h2>

      <div className="flex flex-wrap justify-center gap-3">
        {[
          "Aksiyon",
          "Askeri",
          "Bilim Kurgu",
          "Büyü",
          "Doğaüstü Güçler",
          "Dram",
          "Dövüş",
          "Ecchi",
          "Fantastik",
          "Gerilim",
          "Gizem",
          "Harem",
          "Josei",
          "Komedi",
          "Korku",
          "Macera",
          "Mecha",
          "Film",
          "Müzik",
          "OVA",
          "Okul",
          "Oyun",
          "Psikolojik",
          "Romantizm",
          "Seinen",
          "Shoujo",
          "Shoujo Ai",
          "Shounen",
          "Shounen Ai",
          "Yaşamdan Kesitler",
          "Spor",
          "Süper Güç",
          "Tarihi",
          "Uzay",
          "Vampir",
          "Yaoi",
          "Yuri",
          "Polisiye",
          "Samuray",
          "Parodi",
          "Şeytanlar",
          "Savaş Sanatları",
          "Çocuk",
          "Ona",
          "Arabalar",
          "Kişilik Bölünmesi",
        ].map((genre) => (
          <a
            key={genre}
            href={`/genre/${genre.toLowerCase()}`}
            className="
              px-4 py-1.5 rounded-full
              border border-gray-400/30 dark:border-white/10
              hover:border-transparent
              hover:scale-105
              transition-all duration-300
              font-medium
              text-gray-700 dark:text-gray-300
              hover:text-white dark:hover:text-black
              hover:shadow-[0_0_15px_var(--glow-color)]
              relative
            "
            style={{
              "--glow-color": "rgba(255,165,0,0.4)",
            }}
          >
            {genre}
          </a>
        ))}
      </div>

      <p className="mt-8 opacity-70">
        © 2025 <span className="font-semibold">Tranimeci–style</span> — Tüm hakları saklıdır.
      </p>
    </footer>
  );
}
