"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { useJobs } from "@/providers/JobsProvider";
import { useAuth } from "@/hooks/useAuth";
import { JobList } from "@/features/jobs/JobList/JobList";
import { InfoCell } from "@/features/jobs/InfoCell/InfoCell";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { FileText, Sparkles } from "lucide-react";

const JobListSkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    {[1, 2, 3, 4, 5].map((index) => (
      <div
        key={index}
        className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
      >
        <div>
          <div className="bg-gray-300 mb-2 rounded w-32 h-5" />
          <div className="bg-gray-200 mb-2 rounded w-48 h-5" />
          <div className="bg-gray-200 rounded w-40 h-4" />
        </div>
        <div className="bg-gray-200 rounded w-24 h-4" />
      </div>
    ))}
  </div>
);

export default function JobsPage() {
  const { jobs, loading: jobsLoading } = useJobs();
  const { user, loading: authLoading } = useAuth();

  const isDataReady = useMemo(() => {
    if (authLoading || user === undefined) return false;
    if (!user) return true;
    if (jobsLoading) return false;
    return Array.isArray(jobs);
  }, [authLoading, user, jobsLoading, jobs]);

  return (
    <Screen heading="Job History">
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white shadow-sm p-6 rounded-lg">
          {!isDataReady ? (
            <JobListSkeleton />
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12 text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-medium text-gray-900 text-lg">
                No jobs found
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                Your content generation jobs will appear here.
              </p>
              <div className="mt-6">
                <Button href="/generate-content">
                  <Sparkles className="mr-2 w-4 h-4" />
                  Generate Content
                </Button>
              </div>
            </div>
          ) : (
            <JobList jobs={jobs} />
          )}
        </div>
        <InfoCell />
      </div>
    </Screen>
  );
}