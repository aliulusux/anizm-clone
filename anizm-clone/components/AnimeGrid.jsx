"use client";
import { motion } from "framer-motion";
import AnimeCard from "./AnimeCard";

export default function AnimeGrid({ animeList }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
    >
      {animeList.map((a) => (
        <AnimeCard key={a.mal_id} anime={a} />
      ))}
    </motion.div>
  );
}
