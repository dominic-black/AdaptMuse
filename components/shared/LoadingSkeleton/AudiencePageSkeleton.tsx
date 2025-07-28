export const AudiencePageSkeleton = () => {
  return (
    <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
      {/* Main Content Area */}
      <div className="lg:col-span-2 bg-white shadow-sm p-6 rounded-lg animate-pulse">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-gray-300 rounded w-32 h-6" />
          <div className="bg-gray-200 rounded w-24 h-9" />
        </div>

        {/* Audience List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border-2 border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-full w-10 h-10" />
                <div>
                  <div className="bg-gray-300 mb-2 rounded w-24 h-4" />
                  <div className="bg-gray-200 rounded w-16 h-3" />
                </div>
              </div>
              <div className="bg-gray-200 rounded w-5 h-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Info Cell Skeleton */}
      <div className="top-0 sticky">
        <div className="bg-white shadow-sm p-6 rounded-lg animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-200 rounded-full w-10 h-10" />
            <div className="bg-gray-300 rounded w-32 h-5" />
          </div>
          <div className="space-y-3">
            <div className="bg-gray-200 rounded w-full h-4" />
            <div className="bg-gray-200 rounded w-full h-4" />
            <div className="bg-gray-200 rounded w-3/4 h-4" />
            <div className="bg-gray-200 rounded w-full h-4" />
            <div className="bg-gray-200 rounded w-full h-4" />
            <div className="bg-gray-200 rounded w-5/6 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
