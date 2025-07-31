"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { useAudiences } from "@/features/audience/hooks/useAudiences";
import { useJobs } from "@/providers/JobsProvider";
import { useAuth } from "@/hooks/useAuth";
import VerifyEmailBanner from "@/features/auth/banners/VerifyEmail/VerifyEmailBanner";
import { SavedAudiences } from "@/features/dashboard/components/SavedAudiences/SavedAudiences";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity/RecentActivity";
import { useMemo } from "react";
import { Sparkles, Target } from "lucide-react";
import { Cell } from "@/components/ui/Cell/Cell";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/providers/UserProvider";
import { StatsOverview } from "@/features/dashboard/components/StatsOverview/StatsOverview";

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
        {user && !user.emailVerified && <VerifyEmailBanner />}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 border border-blue-100 rounded-2xl">
          <div className="flex lg:flex-row flex-col justify-between items-between items-center space-y-4 lg:space-y-0 w-full">
            <div className="space-y-3 mr-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-2xl">
                    Welcome back, {userProfile?.firstName}!
                  </h1>
                  <p className="text-gray-600">
                    Ready to create your next audience and generate amazing
                    content?
                  </p>
                </div>
              </div>
            </div>
            <div className="flex lg:flex-row flex-col gap-4 w-full lg:w-auto">
              <Button
                href="/audience/create"
                className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 w-full lg:w-auto"
              >
                <Target className="mr-2 w-full lg:w-4 h-full lg:h-4" />
                Create Audience
              </Button>
              <Button
                href="/generate-content"
                variant="outline"
                className="w-full lg:w-auto"
              >
                <Sparkles className="mr-2 w-full lg:w-4 h-full lg:h-4" />
                Generate Content
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview metrics={metrics} />

        {/* Main Content Grid */}
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Recent Activity - Spans 2 columns */}
          <div className="lg:col-span-2">
            <RecentActivity jobs={jobs} jobsLoading={!isDataReady} />
          </div>

          {/* Saved Audiences - Single column */}
          <div className="lg:col-span-1">
            <SavedAudiences
              audiences={audiences}
              audiencesLoading={!isDataReady}
            />
          </div>
        </div>

        {/* Platform Tips */}
        <Cell>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  Pro Tips
                </h3>
                <p className="text-gray-600 text-sm">
                  Maximize your platform usage
                </p>
              </div>
            </div>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 mt-1 p-2 rounded-lg">
                    <div className="bg-blue-600 rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Diversify Your Audiences
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Create multiple audience profiles to test different
                      demographics and interests.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 mt-1 p-2 rounded-lg">
                    <div className="bg-emerald-600 rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Use Cultural Correlates
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Leverage AI recommendations to discover new cultural
                      connections and trends.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 mt-1 p-2 rounded-lg">
                    <div className="bg-purple-600 rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Iterate and Refine
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Continuously update your audiences based on performance
                      data and insights.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 mt-1 p-2 rounded-lg">
                    <div className="bg-amber-600 rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Track Performance
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Monitor your content performance to understand what
                      resonates with your audiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Cell>
      </div>
    </Screen>
  );
}
