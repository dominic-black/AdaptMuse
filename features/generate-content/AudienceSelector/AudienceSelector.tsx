import { Button } from "@/components/ui/Button";
import { Audience } from "@/types/audience";
import Image from "next/image";
import { CheckIcon, Users } from "lucide-react";

export const AudienceSelector = ({
  audiences,
  selectedAudience,
  setSelectedAudience,
}: {
  audiences: Audience[];
  selectedAudience: Audience | null;
  setSelectedAudience: (audience: Audience) => void;
}) => {
  return (
    <div className="flex flex-col lg:col-span-1 bg-white shadow-sm p-6 rounded-lg h-full">
      <h2 className="mb-4 font-semibold text-gray-800 text-lg">
        1. Select Target Audience
      </h2>
      <div className="flex-1 space-y-2 pr-2 overflow-y-auto">
        {audiences.map((audience) => (
          <div
            key={audience.id}
            onClick={() => setSelectedAudience(audience)}
            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedAudience?.id === audience.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-gray-100 rounded-full w-10 h-10 overflow-hidden">
                <Image
                  src={
                    audience?.imageUrl ||
                    "https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                  }
                  alt={audience.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{audience.name}</h3>
                <p className="text-gray-500 text-sm">
                  {audience.entities.length} entities
                </p>
              </div>
            </div>

            {selectedAudience?.id === audience.id && (
              <div className="flex justify-center items-center bg-primary rounded-full w-6 h-6">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {audiences.length === 0 && (
          <div className="flex flex-col justify-center py-16 border-2 border-gray-200 border-dashed rounded-lg h-full text-center">
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
    </div>
  );
};
