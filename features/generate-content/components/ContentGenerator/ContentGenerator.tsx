"use client";

import { useCallback } from "react";
import { useAudiences } from "@/features/audience/hooks/useAudiences";
import { Job } from "@/types/job";
import { AudienceSelector } from "@/features/generate-content/components/AudienceSelector/AudienceSelector";
import { GenerationPanel } from "@/features/generate-content/components/GenerationPanel/GenerationPanel";
import { GeneratingModal } from "@/features/generate-content/components/GeneratingModal/GeneratingModal";
import {
  useContentGenerationForm,
  useContentGeneration,
  useContentGenerationEffects,
} from "@/features/generate-content/hooks";

export interface ContentGeneratorProps {
  loading?: boolean;
  job?: Job | null;
}

/**
 * Main ContentGenerator component for AI content generation
 *
 * This component orchestrates the content generation process by:
 * - Managing form state through useContentGenerationForm
 * - Handling generation process through useContentGeneration
 * - Coordinating side effects through useContentGenerationEffects
 */
export const ContentGenerator = ({
  loading = false,
  job = null,
}: ContentGeneratorProps) => {
  const { audiences } = useAudiences();

  // Custom hooks for separation of concerns
  const {
    formData,
    validateFormData,
    createRequestBody,
    populateFromJob,
    setAction,
    setContentType,
    setExistingContent,
    setAdditionalContext,
    setGenerationJobTitle,
    setSelectedAudience,
  } = useContentGenerationForm();

  const { generationState, startGeneration, closeModal } =
    useContentGeneration();

  // Handle side effects
  useContentGenerationEffects({
    job,
    generationState,
    populateFromJob,
  });

  /**
   * Handles form submission for content generation
   */
  const handleSubmit = useCallback(async () => {
    const validationError = validateFormData(formData);
    if (validationError) {
      alert(`Validation Error: ${validationError}`);
      return;
    }

    try {
      const requestBody = createRequestBody(formData);
      await startGeneration(requestBody);
    } catch (error) {
      // Error handling is managed in the useContentGeneration hook
      console.error("Content generation failed:", error);
    }
  }, [formData, validateFormData, createRequestBody, startGeneration]);

  /**
   * Handles making changes to generated content
   */
  const handleMakeChanges = useCallback(
    (content: string) => {
      setAction("alter");
      setExistingContent(content);
      closeModal();
    },
    [setAction, setExistingContent, closeModal]
  );

  return (
    <>
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3 h-full">
        <AudienceSelector
          audiences={audiences}
          selectedAudience={formData.selectedAudience}
          setSelectedAudience={setSelectedAudience}
          loading={loading}
        />
        <GenerationPanel
          selectedAudience={formData.selectedAudience}
          isLoading={generationState.isLoading}
          onSubmit={handleSubmit}
          action={formData.action}
          setAction={setAction}
          contentType={formData.contentType}
          setContentType={setContentType}
          existingContent={formData.existingContent}
          setExistingContent={setExistingContent}
          additionalContext={formData.additionalContext}
          setAdditionalContext={setAdditionalContext}
          generationJobTitle={formData.generationJobTitle}
          setGenerationJobTitle={setGenerationJobTitle}
        />
      </div>

      <GeneratingModal
        showModal={generationState.showModal}
        job={generationState.generatedJob}
        onClose={closeModal}
        onMakeChanges={handleMakeChanges}
      />
    </>
  );
};
