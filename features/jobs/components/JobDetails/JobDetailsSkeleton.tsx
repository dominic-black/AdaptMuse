import { Cell } from "@/components/ui/Cell/Cell";

export const JobDetailsSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Content Sections Skeleton */}
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
        <Cell>
          <div className="space-y-4 p-6 animate-pulse">
            <div className="bg-gray-200 rounded w-32 h-6"></div>
            <div className="space-y-3">
              <div className="bg-gray-200 rounded w-full h-4"></div>
              <div className="bg-gray-200 rounded w-3/4 h-4"></div>
              <div className="bg-gray-200 rounded w-1/2 h-4"></div>
            </div>
          </div>
        </Cell>

        <Cell>
          <div className="space-y-4 p-6 animate-pulse">
            <div className="bg-gray-200 rounded w-40 h-6"></div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-full w-12 h-12"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 rounded w-24 h-4"></div>
                  <div className="bg-gray-200 rounded w-32 h-3"></div>
                </div>
              </div>
            </div>
          </div>
        </Cell>
      </div>

      {/* Context Skeleton */}
      <Cell>
        <div className="space-y-4 p-6 animate-pulse">
          <div className="bg-gray-200 rounded w-24 h-6"></div>
          <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
            <div className="space-y-3">
              <div className="bg-gray-200 rounded w-full h-4"></div>
              <div className="bg-gray-200 rounded w-3/4 h-4"></div>
              <div className="bg-gray-200 rounded w-1/2 h-4"></div>
            </div>
          </div>
        </div>
      </Cell>

      {/* Generated Content Skeleton */}
      <Cell>
        <div className="space-y-4 p-6 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="bg-gray-200 rounded w-48 h-6"></div>
            <div className="bg-gray-200 rounded w-20 h-8"></div>
          </div>
          <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
            <div className="space-y-3">
              <div className="bg-gray-200 rounded w-full h-4"></div>
              <div className="bg-gray-200 rounded w-full h-4"></div>
              <div className="bg-gray-200 rounded w-3/4 h-4"></div>
              <div className="bg-gray-200 rounded w-full h-4"></div>
              <div className="bg-gray-200 rounded w-1/2 h-4"></div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-gray-200 rounded w-32 h-10"></div>
          </div>
        </div>
      </Cell>
    </div>
  );
};
