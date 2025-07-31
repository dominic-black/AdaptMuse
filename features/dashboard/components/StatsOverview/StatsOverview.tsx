import { Activity, Users, Sparkles, FileText } from "lucide-react";
import { StatsOverviewCard } from "./StatsOverviewCard";

export const StatsOverview = ({
  metrics,
}: {
  metrics: {
    totalJobs: number;
    recentJobs: number;
    totalAudiences: number;
    avgAudienceSize: number;
  };
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-gray-900 text-xl">Overview</h2>
          <p className="text-gray-600 text-sm">Your platform activity</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Activity className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
        <StatsOverviewCard
          title="Content Generated"
          total={metrics?.totalJobs || 0}
          recentTotal={`${metrics?.recentJobs || 0} this week`}
          change={12}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          backgroundColor="blue-100"
        />
        <StatsOverviewCard
          title="Audiences Created"
          total={metrics?.totalAudiences || 0}
          recentTotal={`Avg. ${metrics?.avgAudienceSize || 0} entities`}
          change={12}
          icon={<Users className="w-6 h-6 text-emerald-600" />}
          backgroundColor="emerald-100"
        />
        <StatsOverviewCard
          title="Usage Limit"
          total={metrics?.totalAudiences || 0}
          recentTotal={`Unlimited`}
          change={12}
          icon={<Sparkles className="w-6 h-6 text-amber-600" />}
          backgroundColor="amber-100"
        />
      </div>
    </div>
  );
};
