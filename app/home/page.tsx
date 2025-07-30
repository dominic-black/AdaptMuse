"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { useAudiences } from "@/features/audience/hooks/useAudiences";
import { useJobs } from "@/providers/JobsProvider";
import { useAuth } from "@/hooks/useAuth";
import VerifyEmailBanner from "@/features/auth/banners/VerifyEmail/VerifyEmailBanner";
import { StatCards } from "@/features/dashboard/StatCards/StatCards";
import { RecentActivity } from "@/features/dashboard/RecentActivity/RecentActivity";
import { SavedAudiences } from "@/features/dashboard/SavedAudiences/SavedAudiences";
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
      <div className="space-y-8">
        {user && !user.emailVerified && <VerifyEmailBanner />}

        {/* Always show StatCards component - it handles its own loading state */}
        <StatCards
          jobs={jobs}
          jobsLoading={!isDataReady}
          audiences={audiences}
          audiencesLoading={!isDataReady}
        />

        <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Always show RecentActivity component - it handles its own loading state */}
          <RecentActivity jobs={jobs} jobsLoading={!isDataReady} />

          {/* Always show SavedAudiences component - it handles its own loading state */}
          <SavedAudiences
            audiences={audiences}
            audiencesLoading={!isDataReady}
          />
        </div>
      </div>
    </Screen>
  );
}
