import { ArrowRight, Users } from "lucide-react";
import { AudienceList } from "@/features/audience/AudienceList/AudienceList";
import { Audience } from "@/types/audience";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const AudienceListSkeleton = () => (
  <ul className="space-y-4 animate-pulse">
    {/* Match exact AudienceList structure: ul with space-y-4, li with p-4 border-2 items */}
    {[1, 2, 3, 4, 5].map((index) => (
      <li key={index}>
        <div className="flex justify-between items-center p-4 border-2 border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 rounded-full w-10 h-10" />
            <div>
              <div className="bg-gray-300 mb-2 rounded w-24 h-4" />
              <div className="bg-gray-200 rounded w-16 h-3" />
            </div>
          </div>
          <div className="bg-gray-200 rounded w-5 h-5" />
        </div>
      </li>
    ))}
  </ul>
);

export const SavedAudiences = ({
  audiencesLoading,
  audiences,
}: {
  audiencesLoading: boolean;
  audiences: Audience[];
}) => {
  return (
    <div className="row-start-1 bg-white shadow-sm p-6 rounded-lg lg:row-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800 text-xl">Audiences</h2>
        <Link
          href="/audience"
          className="flex items-center gap-1 font-medium text-primary text-sm hover:underline"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {audiencesLoading ? (
        <AudienceListSkeleton />
      ) : audiences.length > 0 ? (
        <AudienceList audiences={audiences.slice(0, 5)} />
      ) : (
        <div className="py-10 border-2 border-gray-200 border-dashed rounded-lg text-center">
          <div className="flex justify-center items-center bg-gray-100 mx-auto rounded-full w-12 h-12 text-gray-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="mt-4 font-medium text-gray-900 text-sm">
            No audiences found
          </h3>
          <p className="mt-1 text-gray-500 text-xs">
            Create one to get started.
          </p>
          <div className="mt-4">
            <Button href="/audience/create" variant="outline" size="sm">
              Create Audience
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
