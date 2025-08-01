import { Button } from "@/components/ui/Button";
import { JobList } from "@/features/jobs/components/JobList/JobList";
import { FileText, Sparkles } from "lucide-react";
import { Job } from "@/types/job";

const JobListSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {/* Match exact JobList structure: space-y-4 container with p-4 border items */}
    {[1, 2, 3, 4, 5].map((index) => (
      <div
        key={index}
        className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
      >
        <div>
          <div className="bg-gray-300 mb-2 rounded w-32 h-5" />
          <div className="bg-gray-200 rounded w-24 h-4" />
        </div>
        <div className="bg-gray-200 rounded w-16 h-4" />
      </div>
    ))}
  </div>
);

export const RecentActivity = ({
  jobs,
  jobsLoading,
}: {
  jobs: Job[];
  jobsLoading: boolean;
}) => {
  return (
    <div className="lg:col-span-2 bg-white shadow-sm p-4 lg:p-6 rounded-lg">
      <h2 className="mb-4 font-semibold text-gray-800 text-xl">
        Recent Activity
      </h2>
      {jobsLoading ? (
        <JobListSkeleton />
      ) : jobs.length > 0 ? (
        <JobList jobs={jobs.slice(0, 5)} />
      ) : (
        <div className="py-16 border-2 border-gray-200 border-dashed rounded-lg text-center">
          <div className="flex justify-center items-center bg-gray-100 mx-auto rounded-full w-12 h-12 text-gray-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="mt-4 font-medium text-gray-900 text-lg">
            No content generated yet
          </h3>
          <p className="mt-1 text-gray-500 text-sm">
            Your recent content generation jobs will appear here.
          </p>
          <div className="mt-6">
            <Button href="/generate-content">
              <Sparkles className="mr-2 w-4 h-4" />
              Generate Content
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
