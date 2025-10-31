"use client";
import { Suspense } from "react";
import { motion } from "framer-motion";
import SkeletonGrid from "./SkeletonGrid";

/**
 * LoaderLayout wraps any content with Suspense + transition + SkeletonGrid.
 *
 * Usage:
 * <LoaderLayout count={20}>
 *   <AnimeGrid animeList={items} />
 * </LoaderLayout>
 */
export default function LoaderLayout({ children, count = 12 }) {
  return (
    <Suspense fallback={<SkeletonGrid count={count} />}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </Suspense>
  );
}
