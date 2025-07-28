"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { useAudiences } from "@/providers/AudienceProvider";
import { Audience } from "@/types/audience";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AudienceSelector } from "@/features/generate-content/AudienceSelector/AudienceSelector";
import { GenerationForm } from "@/features/generate-content/GenerationForm/GenerationForm";
import { GeneratingModal } from "@/features/generate-content/GeneratingModal/GeneratingModal";

export default function BotPage() {
  const { audiences } = useAudiences();
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(
    null
  );
  const [action, setAction] = useState<"generate" | "alter">("generate");
  const [contentType, setContentType] = useState<string>("");
  const [existingContent, setExistingContent] = useState<string>("");
  const [additionalContext, setAdditionalContext] = useState<string>("");

  const [showGeneratingModal, setShowGeneratingModal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCloseModal = () => {
    setShowGeneratingModal(false);
    setGeneratedContent(null);
    setError(null);
  };

  const handleMakeChanges = (content: string) => {
    setAction("alter");
    setExistingContent(content);
    handleCloseModal();
  };

  const onSubmit = async () => {
    if (!selectedAudience) {
      alert("Please select an audience.");
      return;
    }
    if (!contentType) {
      alert("Please specify the type of content to generate.");
      return;
    }
    if (action === "alter" && !existingContent) {
      alert("Please provide the existing content to alter.");
      return;
    }

    setIsLoading(true);
    setGeneratedContent(null);
    setError(null);
    setShowGeneratingModal(true);

    const body = {
      audienceId: selectedAudience.id,
      contentType,
      content: existingContent,
      context: additionalContext,
    };

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedContent(data.content);
      } else {
        const errorMessage = data.error || "An unknown error occurred.";
        setError(errorMessage);
        setShowGeneratingModal(false); // Close modal to show alert
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown network error occurred.";
      setError(errorMessage);
      setShowGeneratingModal(false); // Close modal on error
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen heading="AI Content Generator">
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3 h-full">
        <AudienceSelector
          audiences={audiences}
          selectedAudience={selectedAudience}
          setSelectedAudience={setSelectedAudience}
        />
        <div className="flex flex-col lg:col-span-2 bg-white shadow-sm p-6 rounded-lg h-full">
          <GenerationForm
            action={action}
            setAction={setAction}
            contentType={contentType}
            setContentType={setContentType}
            existingContent={existingContent}
            setExistingContent={setExistingContent}
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
          />
          <div className="flex justify-end pt-6 border-gray-200 border-t">
            <Button
              disabled={!selectedAudience || isLoading}
              onClick={onSubmit}
            >
              {isLoading
                ? "Generating..."
                : action === "generate"
                ? "Generate Content"
                : "Alter Content"}
            </Button>
          </div>
        </div>
      </div>
      <GeneratingModal
        showModal={showGeneratingModal}
        generatedContent={generatedContent}
        onClose={handleCloseModal}
        onMakeChanges={handleMakeChanges}
      />
    </Screen>
  );
}