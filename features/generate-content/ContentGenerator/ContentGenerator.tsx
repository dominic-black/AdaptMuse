"use client";

import { useState } from "react";
import { useAudiences } from "@/hooks/useAudiences";
import { Audience } from "@/types/audience";
import { AudienceSelector } from "@/features/generate-content/AudienceSelector/AudienceSelector";
import { GenerationPanel } from "@/features/generate-content/GenerationPanel/GenerationPanel";
import { GeneratingModal } from "@/features/generate-content/GeneratingModal/GeneratingModal";

export const ContentGenerator = ({
  loading = false,
}: {
  loading?: boolean;
}) => {
  const { audiences } = useAudiences();
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(
    null
  );
  const [action, setAction] = useState<"generate" | "alter">("generate");
  const [contentType, setContentType] = useState("");
  const [existingContent, setExistingContent] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  const [showGeneratingModal, setShowGeneratingModal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setShowGeneratingModal(false);
    setGeneratedContent(null);
  };

  const handleMakeChanges = (content: string) => {
    setAction("alter");
    setExistingContent(content);
    handleCloseModal();
  };

  const validateForm = () => {
    if (!selectedAudience) {
      alert("Please select an audience.");
      return false;
    }
    if (!contentType) {
      alert("Please specify the type of content to generate.");
      return false;
    }
    if (action === "alter" && !existingContent) {
      alert("Please provide the existing content to alter.");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setGeneratedContent(null);
    setShowGeneratingModal(true);

    const body = {
      audienceId: selectedAudience!.id,
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
        setShowGeneratingModal(false); // Close modal to show alert
        alert(`Error: ${errorMessage}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unknown network error occurred.";
      setShowGeneratingModal(false); // Close modal on error
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3 h-full">
        <AudienceSelector
          audiences={audiences}
          selectedAudience={selectedAudience}
          setSelectedAudience={setSelectedAudience}
          loading={loading}
        />
        <GenerationPanel
          selectedAudience={selectedAudience}
          isLoading={isLoading}
          onSubmit={onSubmit}
          action={action}
          setAction={setAction}
          contentType={contentType}
          setContentType={setContentType}
          existingContent={existingContent}
          setExistingContent={setExistingContent}
          additionalContext={additionalContext}
          setAdditionalContext={setAdditionalContext}
        />
      </div>
      <GeneratingModal
        showModal={showGeneratingModal}
        generatedContent={generatedContent}
        onClose={handleCloseModal}
        onMakeChanges={handleMakeChanges}
      />
    </>
  );
};
