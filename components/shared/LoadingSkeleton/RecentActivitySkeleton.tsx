export const RecentActivitySkeleton = () => {
  return (
    <div className="lg:col-span-2 bg-white shadow-sm p-4 lg:p-6 rounded-lg animate-pulse">
      {/* Header */}
      <div className="mb-4">
        <div className="bg-gray-300 rounded w-32 h-6" />
      </div>

      {/* Job List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="flex justify-between items-center py-3 border-gray-100 border-b last:border-b-0"
          >
            <div className="flex flex-1 items-center gap-3">
              <div className="bg-gray-200 rounded-full w-8 h-8" />
              <div className="flex-1">
                <div className="bg-gray-300 mb-2 rounded w-3/4 h-4" />
                <div className="bg-gray-200 rounded w-1/2 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 px-3 py-1 rounded-full w-16 h-6" />
              <div className="bg-gray-200 rounded w-6 h-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
