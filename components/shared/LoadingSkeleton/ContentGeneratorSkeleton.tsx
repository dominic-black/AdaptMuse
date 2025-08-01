export const ContentGeneratorSkeleton = () => {
  return (
    <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3 h-full">
      {/* Audience Selector Skeleton */}
      <div className="bg-white shadow-sm p-6 rounded-lg animate-pulse">
        <div className="mb-4">
          <div className="bg-gray-300 mb-2 rounded w-28 h-5" />
          <div className="bg-gray-200 rounded w-full h-3" />
        </div>

        {/* Audience Cards */}
        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="p-3 border-2 border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gray-200 rounded-full w-8 h-8" />
                <div className="bg-gray-300 rounded w-20 h-4" />
              </div>
              <div className="bg-gray-200 rounded w-16 h-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Generation Panel Skeleton */}
      <div className="lg:col-span-2 bg-white shadow-sm p-4 lg:p-6 rounded-lg animate-pulse">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-gray-300 mb-2 rounded w-40 h-6" />
          <div className="bg-gray-200 rounded w-full h-4" />
        </div>

        {/* Action Toggle */}
        <div className="mb-6">
          <div className="bg-gray-200 mb-3 rounded w-24 h-4" />
          <div className="flex gap-2">
            <div className="bg-gray-200 rounded w-20 h-8" />
            <div className="bg-gray-200 rounded w-16 h-8" />
          </div>
        </div>

        {/* Content Type Input */}
        <div className="mb-6">
          <div className="bg-gray-200 mb-3 rounded w-28 h-4" />
          <div className="bg-gray-100 border border-gray-200 rounded w-full h-10" />
        </div>

        {/* Additional Context */}
        <div className="mb-6">
          <div className="bg-gray-200 mb-3 rounded w-36 h-4" />
          <div className="bg-gray-100 border border-gray-200 rounded w-full h-24" />
        </div>

        {/* Submit Button */}
        <div className="bg-gray-300 rounded w-32 h-10" />
      </div>
    </div>
  );
};
