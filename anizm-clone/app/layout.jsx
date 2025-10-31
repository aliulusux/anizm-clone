export const dynamic = "force-dynamic";

import "@/styles/globals.scss";
import "@/styles/theme.scss";
import { Inter } from "next/font/google";
import TopLoader from "@/components/TopLoader";
import PageTransition from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Anime Stream – Jikan + Next.js",
  description: "Tranimeci-style anime streaming platform built with Next.js and Jikan API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* 🔥 Global progress bar */}
        <TopLoader />

        {/* 🌈 Global animated page transition */}
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
