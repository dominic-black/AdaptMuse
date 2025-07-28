"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { useAudiences } from "@/hooks/useAudiences";
import { useJobs } from "@/providers/JobsProvider";
import { useAuth } from "@/hooks/useAuth";
import VerifyEmailBanner from "@/features/auth/banners/VerifyEmail/VerifyEmailBanner";
import { StatCards } from "@/features/dashboard/StatCards/StatCards";
import { RecentActivity } from "@/features/dashboard/RecentActivity/RecentActivity";
import { SavedAudiences } from "@/features/dashboard/SavedAudiences/SavedAudiences";

export default function Home() {
  const { audiences, loading: audiencesLoading } = useAudiences();
  const { jobs, loading: jobsLoading } = useJobs();
  const { user } = useAuth();

  return (
    <Screen heading="Dashboard">
      <div className="space-y-8">
        {user && !user.emailVerified && <VerifyEmailBanner />}
        <StatCards
          jobs={jobs}
          jobsLoading={jobsLoading}
          audiences={audiences}
          audiencesLoading={audiencesLoading}
        />
        <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
          <RecentActivity jobs={jobs} jobsLoading={jobsLoading} />
          <SavedAudiences
            audiences={audiences}
            audiencesLoading={audiencesLoading}
          />
        </div>
      </div>
    </Screen>
  );
}
