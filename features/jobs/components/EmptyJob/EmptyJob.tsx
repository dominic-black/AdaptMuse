import { Screen } from "@/components/shared/Screen/Screen";
import { Button } from "@/components/ui/Button";
import { FileText, ArrowLeft } from "lucide-react";

export const EmptyJob = () => {
  return (
    <Screen heading="Job Not Found">
      <div className="flex flex-col justify-center items-center py-16">
        <div className="bg-gray-100 mb-4 p-4 rounded-full w-16 h-16">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="mb-2 font-semibold text-gray-900 text-lg">
          Job Not Found
        </h3>
        <p className="mb-6 max-w-md text-gray-600 text-center">
          The job you&apos;re looking for doesn&apos;t exist or you don&apos;t
          have permission to view it.
        </p>
        <Button href="/jobs" variant="outline">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Jobs
        </Button>
      </div>
    </Screen>
  );
};
