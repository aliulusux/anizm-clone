export default function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass overflow-hidden flex flex-col"
        >
          <div className="bg-gray-300 dark:bg-gray-700 w-full aspect-[3/4]" />
          <div className="p-3 space-y-2">
            <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
