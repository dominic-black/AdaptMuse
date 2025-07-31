import { FileText, Users, BarChart2 } from "lucide-react";
import { StatCard } from "./StatCard";
import { Job } from "@/types/job";
import { Audience } from "@/types/audience";

export const StatCards = ({
  jobs,
  jobsLoading,
  audiences,
  audiencesLoading,
}: {
  jobs: Job[];
  jobsLoading: boolean;
  audiences: Audience[];
  audiencesLoading: boolean;
}) => {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
      <StatCard
        title="Content Generated"
        value={String(jobs.length)}
        icon={<FileText className="w-5 h-5" />}
        loading={jobsLoading}
      />
      <StatCard
        title="Audiences Created"
        value={String(audiences.length)}
        icon={<Users className="w-5 h-5" />}
        loading={audiencesLoading}
      />
      <StatCard
        title="Usage"
        value="Unlimited"
        icon={<BarChart2 className="w-5 h-5" />}
        loading={false}
      />
    </div>
  );
};
