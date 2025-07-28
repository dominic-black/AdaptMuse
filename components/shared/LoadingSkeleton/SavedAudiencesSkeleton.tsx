export const SavedAudiencesSkeleton = () => {
  return (
    <div className="row-start-1 bg-white shadow-sm p-6 rounded-lg animate-pulse lg:row-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-gray-300 rounded w-20 h-6" />
        <div className="bg-gray-200 rounded w-16 h-4" />
      </div>

      {/* Audience List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <div className="flex flex-1 items-center gap-3">
              <div className="bg-gray-200 rounded-full w-6 h-6" />
              <div className="flex-1">
                <div className="bg-gray-300 mb-1 rounded w-2/3 h-4" />
                <div className="bg-gray-200 rounded w-1/3 h-3" />
              </div>
            </div>
            <div className="bg-gray-200 rounded w-6 h-6" />
          </div>
        ))}
      </div>
    </div>
  );
};
