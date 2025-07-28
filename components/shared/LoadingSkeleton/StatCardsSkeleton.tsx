export const StatCardsSkeleton = () => {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white shadow-sm p-4 border border-gray-200 rounded-lg animate-pulse"
        >
          <div className="flex flex-shrink-0 justify-center items-center bg-gray-100 rounded-full w-10 h-10">
            <div className="bg-gray-300 rounded w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="bg-gray-200 mb-2 rounded w-24 h-4" />
            <div className="bg-gray-300 rounded w-12 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
};
