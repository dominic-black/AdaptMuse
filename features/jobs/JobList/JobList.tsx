"use client";

import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns";

export const JobList = ({ jobs }: { jobs: Job[] }) => {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
        >
          <div>
            <p className="font-semibold text-gray-800">{job.contentType}</p>
            <p className="text-gray-500 text-sm">
              Targeting: {job.audienceName}
            </p>
          </div>
          <p className="text-gray-400 text-sm">
            {formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true })}
          </p>
        </div>
      ))}
    </div>
  );
};
