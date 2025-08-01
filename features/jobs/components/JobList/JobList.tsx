"use client";

import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  FileText,
  Mail,
  Megaphone,
  MessageCircle,
  Music,
  Speech,
  Video,
} from "lucide-react";

export const jobIcons = {
  Email: <Mail className="w-5 h-5" />,
  Script: <FileText className="w-5 h-5" />,
  Advertising: <Megaphone className="w-5 h-5" />,
  Speech: <Speech className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Default: <MessageCircle className="w-5 h-5" />,
};

export const JobList = ({ jobs }: { jobs: Job[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <Link href={`/jobs/${job.id}`} key={job.id}>
          <div className="flex justify-between items-center hover:bg-gray-50 p-4 border border-gray-200 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-full text-green-600">
                {jobIcons[job.icon as keyof typeof jobIcons] ||
                  jobIcons.Default}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{job.title}</p>
                <p className="text-gray-800">{job.contentType}</p>
                <p className="text-gray-500 text-sm">
                  Targeting: {job.audience.name}
                </p>
              </div>
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
