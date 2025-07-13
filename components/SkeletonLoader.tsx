export default function SkeletonLoader({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-label="Loading users">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          aria-hidden="true"
        >
          <div className="flex animate-pulse items-center space-x-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-5 rounded-md bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
              <div className="h-4 rounded-md bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 w-3/4" />
              <div className="h-4 rounded-md bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 w-1/2" />
              <div className="flex flex-wrap gap-3">
                <div className="h-4 w-28 rounded-md bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
                <div className="h-4 w-20 rounded-md bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
