"use client";

import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export const JobList = ({ jobs }: { jobs: Job[] }) => {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Link href={`/jobs/${job.id}`} key={job.id}>
          <div className="flex justify-between items-center hover:bg-gray-50 p-4 border border-gray-200 rounded-lg transition-colors">
            <div>
              <p className="font-semibold text-gray-800">{job.title}</p>
              <p className="text-gray-800">{job.contentType}</p>
              <p className="text-gray-500 text-sm">
                Targeting: {job.audience.name}
              </p>
            </div>
            <p className="text-gray-400 text-sm">
              {formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
