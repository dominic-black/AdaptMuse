import { Screen } from "@/components/shared/Screen/Screen";
import { Cell as UICell } from "@/components/ui/Cell/Cell";

export const AudiencePageSkeleton = () => {
  return (
    <Screen heading="Loading...">
      <div className="space-y-8 animate-pulse">
        {/* Enhanced Analytics Header Skeleton */}
        <div className="bg-gray-100 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
              <div>
                <div className="h-6 w-56 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-72 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-7 w-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex gap-1 bg-gray-200 p-1 rounded-lg w-fit">
            <div className="h-9 w-28 bg-gray-300 rounded-md"></div>
            <div className="h-9 w-40 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          <div className="bg-gray-100 p-6 rounded-xl">
            <div className="h-8 w-8 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl">
            <div className="h-8 w-8 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl">
            <div className="h-8 w-8 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Demographics Charts */}
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
          <UICell>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="w-full">
                  <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-80 w-full bg-gray-100 rounded-lg"></div>
            </div>
          </UICell>
          <UICell>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="w-full">
                  <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-80 w-full bg-gray-100 rounded-lg"></div>
            </div>
          </UICell>
        </div>

        {/* Audience Selections */}
        <UICell>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="w-full">
                <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
              <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                <div className="h-10 bg-gray-100 rounded-lg"></div>
                <div className="h-10 bg-gray-100 rounded-lg"></div>
                <div className="h-10 bg-gray-100 rounded-lg"></div>
                <div className="h-10 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
              <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                <div className="h-10 bg-gray-100 rounded-lg"></div>
                <div className="h-10 bg-gray-100 rounded-lg"></div>
                <div className="h-10 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </UICell>

        {/* Entities Sections */}
        <div className="space-y-8">
          <UICell>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                  <div className="w-full">
                    <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-8 w-12 bg-gray-200 rounded-full"></div>
              </div>
              <div className="gap-4 grid grid-cols-3">
                <div className="h-32 bg-gray-100 rounded-lg"></div>
                <div className="h-32 bg-gray-100 rounded-lg"></div>
                <div className="h-32 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </UICell>
          <UICell>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                  <div className="w-full">
                    <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-8 w-12 bg-gray-200 rounded-full"></div>
              </div>
              <div className="gap-4 grid grid-cols-3">
                <div className="h-32 bg-gray-100 rounded-lg"></div>
                <div className="h-32 bg-gray-100 rounded-lg"></div>
                <div className="h-32 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </UICell>
        </div>
      </div>
    </Screen>
  );
};