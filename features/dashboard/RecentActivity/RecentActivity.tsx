import { Button } from "@/components/ui/Button";
import { JobList } from "@/features/jobs/JobList/JobList";
import { FileText, Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { Job } from "@/types/job";

export const RecentActivity = ({
  jobs,
  jobsLoading,
}: {
  jobs: Job[];
  jobsLoading: boolean;
}) => {
  return (
    <div className="lg:col-span-2 bg-white shadow-sm p-6 rounded-lg">
      <h2 className="mb-4 font-semibold text-gray-800 text-xl">
        Recent Activity
      </h2>
      {jobsLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
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
