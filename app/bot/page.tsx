"use client";

import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";
import { DropdownInput } from "@/components/DropdownInput/DropdownInput";
import { useAudiences } from "@/providers/AudienceProvider";
import { Audience } from "@/types/audience";
import { useState } from "react";
import Image from "next/image";
import { CheckIcon } from "lucide-react";

export default function BotPage() {
  const { audiences } = useAudiences();
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(
    null
  );

  return (
    <Screen heading="Create content">
      <div className="gap-4 grid grid-cols-[1fr_3fr]">
        <Cell>
          <div>
            <p className="mb-4 font-medium text-gray-700">
              Select a target audience
            </p>
            <div className="space-y-2">
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
                    <div className="flex justify-center items-center bg-gray-100 rounded-lg w-10 h-10 overflow-hidden">
                      <Image
                        src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                        alt={audience.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {audience.name}
                      </h3>
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
                <div className="py-8 text-gray-500 text-center">
                  <p>No audiences created yet</p>
                  <p className="mt-1 text-sm">
                    Create an audience to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </Cell>
        <Cell>
          <div>
            <p>Content to alter</p>
            <textarea className="p-2 border border-gray-300 rounded-md w-full h-40" />
          </div>
          <div>
            <p>Additional context</p>
            <textarea className="p-2 border border-gray-300 rounded-md w-full h-40" />
          </div>
        </Cell>
      </div>
    </Screen>
  );
}
