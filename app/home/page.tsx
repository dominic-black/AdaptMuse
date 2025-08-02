"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { useAudiences } from "@/features/audience/hooks/useAudiences";
import { useJobs } from "@/providers/JobsProvider";
import { useAuth } from "@/hooks/useAuth";
import VerifyEmailBanner from "@/features/auth/banners/VerifyEmail/VerifyEmailBanner";
import { SavedAudiences } from "@/features/dashboard/components/SavedAudiences/SavedAudiences";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity/RecentActivity";
import { useMemo } from "react";
import { WelcomeBanner } from "@/features/dashboard/components/WelcomeBanner/WelcomeBanner";
import { useUser } from "@/providers/UserProvider";
import { StatsOverview } from "@/features/dashboard/components/StatsOverview/StatsOverview";
import { PlatformTips } from "@/features/dashboard/components/PlatformTips/PlatformTips";

export default function Home() {
  const { audiences, loading: audiencesLoading } = useAudiences();
  const { jobs, loading: jobsLoading } = useJobs();
  const { user, loading: authLoading } = useAuth();
  const { userProfile } = useUser();

  // Comprehensive data ready check
  const isDataReady = useMemo(() => {
    if (authLoading || user === undefined) return false;
    if (!user) return true;
    if (audiencesLoading || jobsLoading) return false;
    return Array.isArray(audiences) && Array.isArray(jobs);
  }, [authLoading, user, audiencesLoading, jobsLoading, audiences, jobs]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!isDataReady || !audiences || !jobs) return null;

    const totalAudiences = audiences.length;
    const totalJobs = jobs.length;
    const recentJobs = jobs.filter((job) => {
      const jobDate = job.createdAt.toDate();
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return jobDate > weekAgo;
    }).length;

    const avgAudienceSize =
      audiences.length > 0
        ? Math.round(
            audiences.reduce(
              (sum, audience) => sum + (audience.entities?.length || 0),
              0
            ) / audiences.length
          )
        : 0;

    return {
      totalAudiences,
      totalJobs,
      recentJobs,
      avgAudienceSize,
    };
  }, [isDataReady, audiences, jobs]);

  return (
    <Screen heading="Dashboard">
      <div className="space-y-8">
        <WelcomeBanner name={userProfile?.firstName || ""} />
        <StatsOverview metrics={metrics} />
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          <RecentActivity jobs={jobs} jobsLoading={!isDataReady} />
          <div className="lg:col-span-1">
            <SavedAudiences
              audiences={audiences}
              audiencesLoading={!isDataReady}
            />
          </div>
        </div>
        <PlatformTips />
      </div>
    </Screen>
  );
}
