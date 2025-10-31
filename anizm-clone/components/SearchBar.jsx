"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ defaultValue = "" }) {
  const [q, setQ] = useState(defaultValue);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/search?q=${encodeURIComponent(q)}&page=1`);
      }}
      className="flex gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Aramak istediğin anime’yi yaz"
        className="flex-1 rounded-xl px-4 py-2 bg-white/70 outline-none border border-white/50 focus:ring focus:ring-amber-200"
      />
      <button
        type="submit"
        className="rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700"
      >
        Ara
      </button>
    </form>
  );
}
