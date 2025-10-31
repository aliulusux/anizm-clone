'use client';

import Link from 'next/link';
import { useMemo } from 'react';

function cx(...arr) {
  return arr.flat(Infinity).filter(Boolean).join(' ');
}

function buildHref(base, page) {
  // base is a URL like /genre/aksiyon or /genre/aksiyon?page=3
  const url = new URL(base, 'http://x'); // dummy base
  url.searchParams.set('page', String(page));
  // strip dummy origin
  return url.pathname + (url.search ? url.search : '');
}

export default function NumberedPagination({
  current = 1,
  totalPages = 1,
  basePath = '/',
  window = 1, // how many neighbors to show
}) {
  const pages = useMemo(() => {
    const list = [];
    const push = (n) => list.push(n);
    const addDots = () => list.push('…');

    const first = 1;
    const last = totalPages;

    const start = Math.max(first, current - window);
    const end = Math.min(last, current + window);

    // Always show first
    push(first);
    if (start > first + 1) addDots();

    for (let p = start; p <= end; p++) {
      if (p !== first && p !== last) push(p);
    }

    if (end < last - 1) addDots();
    if (last !== first) push(last);

    return list;
  }, [current, totalPages, window]);

  const prev = Math.max(1, current - 1);
  const next = Math.min(totalPages, current + 1);

  return (
    <div className="mx-auto mt-10 flex w-full max-w-xl items-center justify-center gap-2 rounded-2xl bg-white/6 p-3 backdrop-blur-md ring-1 ring-white/10">
      {/* Prev */}
      <Link
        href={buildHref(basePath, prev)}
        className={cx(
          'h-10 w-10 inline-flex items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 text-white/80 hover:bg-white/20 hover:text-white transition',
          current === 1 && 'pointer-events-none opacity-40'
        )}
        aria-label="Previous page"
      >
        ←
      </Link>

      {/* Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`d-${i}`} className="px-3 text-white/50 select-none">
              …
            </span>
          ) : (
            <Link
              key={`p-${p}`}
              href={buildHref(basePath, p)}
              className={cx(
                'h-10 min-w-[40px] px-3 inline-flex items-center justify-center rounded-xl ring-1 transition',
                p === current
                  ? 'bg-white text-black ring-white/80'
                  : 'bg-white/10 text-white/80 ring-white/10 hover:bg-white/20 hover:text-white'
              )}
            >
              {p}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      <Link
        href={buildHref(basePath, next)}
        className={cx(
          'h-10 w-10 inline-flex items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 text-white/80 hover:bg-white/20 hover:text-white transition',
          current === totalPages && 'pointer-events-none opacity-40'
        )}
        aria-label="Next page"
      >
        →
      </Link>
    </div>
  );
}
