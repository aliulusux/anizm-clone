// components/NumberedPagination.jsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import clsx from "clsx";

function makeRange(current, total, delta = 1) {
  // returns like [1, 2, 3, "...", 67]
  const range = [];
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);

  // Always include first/last; compress middle with "..."
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }
  return range;
}

export default function NumberedPagination({
  basePath = "",
  currentPage = 1,
  totalPages = 1,
}) {
  const items = useMemo(
    () => makeRange(currentPage, totalPages, 1),
    [currentPage, totalPages]
  );

  const prev = Math.max(1, currentPage - 1);
  const next = Math.min(totalPages, currentPage + 1);

  if (totalPages <= 1) return null;

  const btnBase =
    "inline-flex items-center justify-center rounded-xl px-3 h-10 text-[0.95rem] font-medium transition ring-1";

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center gap-2 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl px-2 py-2 shadow-xl">
        {/* Prev */}
        <Link
          href={`${basePath}?page=${prev}`}
          className={clsx(
            btnBase,
            "w-10 bg-white/70 dark:bg-white/10 ring-black/5 dark:ring-white/10 hover:bg-white/90 dark:hover:bg-white/15"
          )}
          aria-label="Önceki sayfa"
        >
          ←
        </Link>

        {/* Numbers with ellipses */}
        {items.map((it, idx) =>
          it === "..." ? (
            <span
              key={`dots-${idx}`}
              className="px-2 text-sm text-gray-500 dark:text-gray-400"
            >
              …
            </span>
          ) : (
            <Link
              key={it}
              href={`${basePath}?page=${it}`}
              className={clsx(
                btnBase,
                "min-w-10 px-4",
                it === currentPage
                  ? "bg-indigo-600 text-white ring-indigo-500/20"
                  : "bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 ring-black/5 dark:ring-white/10 hover:bg-white/90 dark:hover:bg-white/15"
              )}
            >
              {it}
            </Link>
          )
        )}

        {/* Next */}
        <Link
          href={`${basePath}?page=${next}`}
          className={clsx(
            btnBase,
            "w-10 bg-white/70 dark:bg-white/10 ring-black/5 dark:ring-white/10 hover:bg-white/90 dark:hover:bg-white/15"
          )}
          aria-label="Sonraki sayfa"
        >
          →
        </Link>
      </div>
    </div>
  );
}
