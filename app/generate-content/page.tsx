"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { useAudiences } from "@/providers/AudienceProvider";
import { Audience } from "@/types/audience";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AudienceSelector } from "@/features/generate-content/AudienceSelector/AudienceSelector";
import { GenerationForm } from "@/features/generate-content/GenerationForm/GenerationForm";

export default function BotPage() {
  const { audiences } = useAudiences();
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(
    null
  );
  const [action, setAction] = useState<"generate" | "alter">("generate");

  return (
    <Screen heading="AI Content Generator">
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3 h-full">
        <AudienceSelector
          audiences={audiences}
          selectedAudience={selectedAudience}
          setSelectedAudience={setSelectedAudience}
        />
        <div className="flex flex-col lg:col-span-2 bg-white shadow-sm p-6 rounded-lg h-full">
          <GenerationForm action={action} setAction={setAction} />
          <div className="flex justify-end pt-6 border-gray-200 border-t">
            <Button disabled={!selectedAudience}>
              {action === "generate" ? "Generate Content" : "Alter Content"}
            </Button>
          </div>
        </div>
      </div>
    </Screen>
  );
}
