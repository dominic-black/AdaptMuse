import { StatCardsSkeleton } from "./StatCardsSkeleton";
import { RecentActivitySkeleton } from "./RecentActivitySkeleton";
import { SavedAudiencesSkeleton } from "./SavedAudiencesSkeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      <StatCardsSkeleton />
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
        <RecentActivitySkeleton />
        <SavedAudiencesSkeleton />
      </div>
    </div>
  );
};
