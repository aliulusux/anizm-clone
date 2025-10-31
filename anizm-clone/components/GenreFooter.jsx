export default function Footer() {
  const genres = [
    "Aksiyon", "Askeri", "Bilim Kurgu", "Büyü", "Doğaüstü Güçler", "Dram", "Dövüş", "Ecchi",
    "Fantastik", "Gerilim", "Gizem", "Harem", "Josei", "Komedi", "Korku", "Macera", "Mecha",
    "Film", "Müzik", "OVA", "Okul", "Oyun", "Psikolojik", "Romantizm", "Seinen", "Shoujo",
    "Shoujo Ai", "Shounen", "Shounen Ai", "Yaşamdan Kesitler", "Spor", "Süper Güç", "Tarihi",
    "Uzay", "Vampir", "Yaoi", "Yuri", "Polisiye", "Samuray", "Parodi", "Şeytanlar", "Savaş Sanatları",
    "Çocuk", "Ona", "Arabalar", "Kişilik Bölünmesi"
  ];

  return (
    <footer
      className="
        mt-12
        mx-auto
        max-w-6xl
        rounded-2xl
        text-center
        py-10 px-6
        backdrop-blur-md
        transition-all duration-500
        border border-white/10 dark:border-white/5
        bg-gradient-to-b 
        from-white/70 via-white/50 to-white/30
        dark:from-gray-900/80 dark:via-gray-800/70 dark:to-gray-900/60
        text-gray-800 dark:text-gray-300
        shadow-inner
      "
    >
      <h2 className="text-xl font-semibold mb-6">Anime Türleri</h2>

      <div className="flex flex-wrap justify-center gap-3">
        {genres.map((genre) => (
          <a
            key={genre}
            href={`/genre/${genre.toLowerCase()}`}
            className="
              px-4 py-1.5 rounded-full
              border border-gray-400/30 dark:border-white/10
              text-gray-700 dark:text-gray-300
              font-medium
              transition-all duration-500
              hover:scale-105
              hover:text-white
              hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]
              hover:border-transparent
              relative
              overflow-hidden
              group
            "
          >
            {/* Ocean-blue animated hover background */}
            <span
              className="
                absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500
                transition-opacity duration-500 blur-[1px]
              "
            ></span>

            <span className="relative z-10">{genre}</span>
          </a>
        ))}
      </div>

      <p className="mt-8 opacity-70">
        © 2025 <span className="font-semibold">Tranimeci–style</span> — Tüm hakları saklıdır.
      </p>
    </footer>
  );
}
