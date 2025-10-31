import "@/styles/globals.scss";
import "@/styles/theme.scss";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Anime Stream – Jikan + Next.js",
  description: "Tranimeci-style anime streaming catalog with Jikan API."
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
