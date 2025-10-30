// src/components/LoadingGrid.tsx
export default function LoadingGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-pulse h-72 rounded-2xl bg-white/5 border border-white/10"
        />
      ))}
    </div>
  );
}
