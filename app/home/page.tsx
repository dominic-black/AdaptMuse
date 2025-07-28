"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { useAudiences } from "@/hooks/useAudiences";
import { useJobs } from "@/providers/JobsProvider";
import { useAuth } from "@/hooks/useAuth";
import VerifyEmailBanner from "@/features/auth/banners/VerifyEmail/VerifyEmailBanner";
import { StatCards } from "@/features/dashboard/StatCards/StatCards";
import { RecentActivity } from "@/features/dashboard/RecentActivity/RecentActivity";
import { SavedAudiences } from "@/features/dashboard/SavedAudiences/SavedAudiences";
import { DashboardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useMemo } from "react";

export default function Home() {
  const { audiences, loading: audiencesLoading } = useAudiences();
  const { jobs, loading: jobsLoading } = useJobs();
  const { user, loading: authLoading } = useAuth();

  // Comprehensive data ready check
  const isDataReady = useMemo(() => {
    // Must have auth completed
    if (authLoading || user === undefined) return false;

    // If no user, we're ready (shows login state)
    if (!user) return true;

    // For authenticated users, wait for all data providers to complete
    if (audiencesLoading || jobsLoading) return false;

    // All loading states are false and we have defined arrays (even if empty)
    return Array.isArray(audiences) && Array.isArray(jobs);
  }, [authLoading, user, audiencesLoading, jobsLoading, audiences, jobs]);

  return (
    <Screen heading="Dashboard">
      {!isDataReady ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-8">
          {user && !user.emailVerified && <VerifyEmailBanner />}
          <StatCards
            jobs={jobs}
            jobsLoading={false}
            audiences={audiences}
            audiencesLoading={false}
          />
          <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
            <RecentActivity jobs={jobs} jobsLoading={false} />
            <SavedAudiences audiences={audiences} audiencesLoading={false} />
          </div>
        </div>
      )}
    </Screen>
  );
}
