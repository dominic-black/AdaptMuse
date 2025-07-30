"use client";

import { useEffect, useState } from "react";
import { useAudiences } from "@/hooks/useAudiences";
import { Audience } from "@/types/audience";
import { Job } from "@/types/job";
import { AudienceSelector } from "@/features/generate-content/AudienceSelector/AudienceSelector";
import { GenerationPanel } from "@/features/generate-content/GenerationPanel/GenerationPanel";
import { GeneratingModal } from "@/features/generate-content/GeneratingModal/GeneratingModal";

interface JobResponse {
  id: string;
  title: string;
  audience: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
  contentType: string;
  originalContent?: string;
  generatedContent: string;
  context?: string;
  createdAt: unknown;
}

export const ContentGenerator = ({
  loading = false,
  job = null,
}: {
  loading?: boolean;
  job?: Job | null;
}) => {
  const { audiences } = useAudiences();
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(
    null
  );
  const [action, setAction] = useState<"generate" | "alter">("generate");
  const [contentType, setContentType] = useState("");
  const [existingContent, setExistingContent] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generationJobTitle, setGenerationJobTitle] = useState("");

  useEffect(() => {
    if (job) {
      setSelectedAudience(job.audience as Audience);
      setAction("alter");
      setContentType(job.contentType || "");
      setExistingContent(job.generatedContent || "");
      setAdditionalContext(job.context || "");
      setGenerationJobTitle(`New - ${job.title}`);
    }
  }, [job]);

  const [showGeneratingModal, setShowGeneratingModal] = useState(false);
  const [generatedJob, setGeneratedJob] = useState<JobResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setShowGeneratingModal(false);
    setGeneratedJob(null);
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
    if (!generationJobTitle) {
      alert("Please provide a generation job title.");
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
    setGeneratedJob(null);
    setShowGeneratingModal(true);

    const body = {
      audienceId: selectedAudience!.id,
      generationJobTitle,
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
        setGeneratedJob(data);
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
          generationJobTitle={generationJobTitle}
          setGenerationJobTitle={setGenerationJobTitle}
        />
      </div>
      <GeneratingModal
        showModal={showGeneratingModal}
        job={generatedJob}
        onClose={handleCloseModal}
        onMakeChanges={handleMakeChanges}
      />
    </>
  );
};
