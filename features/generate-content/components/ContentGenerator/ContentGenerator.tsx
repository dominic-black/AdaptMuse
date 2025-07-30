"use client";

import { useEffect, useState, useCallback } from "react";
import { useAudiences } from "@/features/audience/hooks/useAudiences";
import { Audience } from "@/types/audience";
import { Job } from "@/types/job";
import { AudienceSelector } from "@/features/generate-content/components/AudienceSelector/AudienceSelector";
import { GenerationPanel } from "@/features/generate-content/components/GenerationPanel/GenerationPanel";
import { GeneratingModal } from "@/features/generate-content/components/GeneratingModal/GeneratingModal";

// Types
export interface ContentGeneratorProps {
  loading?: boolean;
  job?: Job | null;
}

type Action = "generate" | "alter";

interface FormData {
  selectedAudience: Audience | null;
  action: Action;
  contentType: string;
  existingContent: string;
  additionalContext: string;
  generationJobTitle: string;
}

interface GenerationState {
  isLoading: boolean;
  showModal: boolean;
  generatedJob: Job | null;
  error: string | null;
}

// API request body interface
interface GenerateContentRequest {
  audienceId: string;
  generationJobTitle: string;
  contentType: string;
  content: string;
  context: string;
}

// Form validation error messages
const VALIDATION_ERRORS = {
  NO_AUDIENCE: "Please select an audience.",
  NO_TITLE: "Please provide a generation job title.",
  NO_CONTENT_TYPE: "Please specify the type of content to generate.",
  NO_EXISTING_CONTENT: "Please provide the existing content to alter.",
} as const;

/**
 * Validates the form data before submission
 */
function validateFormData(formData: FormData): string | null {
  const {
    selectedAudience,
    generationJobTitle,
    contentType,
    action,
    existingContent,
  } = formData;

  if (!selectedAudience) {
    return VALIDATION_ERRORS.NO_AUDIENCE;
  }

  if (!generationJobTitle.trim()) {
    return VALIDATION_ERRORS.NO_TITLE;
  }

  if (!contentType.trim()) {
    return VALIDATION_ERRORS.NO_CONTENT_TYPE;
  }

  if (action === "alter" && !existingContent.trim()) {
    return VALIDATION_ERRORS.NO_EXISTING_CONTENT;
  }

  return null;
}

/**
 * Creates the API request body from form data
 */
function createRequestBody(formData: FormData): GenerateContentRequest {
  return {
    audienceId: formData.selectedAudience!.id,
    generationJobTitle: formData.generationJobTitle.trim(),
    contentType: formData.contentType.trim(),
    content: formData.existingContent.trim(),
    context: formData.additionalContext.trim(),
  };
}

/**
 * Main ContentGenerator component for AI content generation
 */
export const ContentGenerator = ({
  loading = false,
  job = null,
}: ContentGeneratorProps) => {
  const { audiences } = useAudiences();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    selectedAudience: null,
    action: "generate",
    contentType: "",
    existingContent: "",
    additionalContext: "",
    generationJobTitle: "",
  });

  // Generation state
  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    showModal: false,
    generatedJob: null,
    error: null,
  });

  /**
   * Updates form data state with proper typing
   */
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Updates generation state
   */
  const updateGenerationState = useCallback(
    (updates: Partial<GenerationState>) => {
      setGenerationState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  /**
   * Populates form when editing an existing job
   */
  useEffect(() => {
    if (job) {
      updateFormData({
        selectedAudience: job.audience as Audience,
        action: "alter",
        contentType: job.contentType || "",
        existingContent: job.generatedContent || "",
        additionalContext: job.context || "",
        generationJobTitle: `New - ${job.title}`,
      });
    }
  }, [job, updateFormData]);

  /**
   * Calls the generate content API
   */
  const generateContent = useCallback(
    async (requestBody: GenerateContentRequest): Promise<Job> => {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content");
      }

      return data;
    },
    []
  );

  /**
   * Handles form submission for content generation
   */
  const handleSubmit = useCallback(async () => {
    // Clear any previous errors
    updateGenerationState({ error: null });

    // Validate form data
    const validationError = validateFormData(formData);
    if (validationError) {
      updateGenerationState({ error: validationError });
      return;
    }

    // Start generation process
    updateGenerationState({
      isLoading: true,
      showModal: true,
      generatedJob: null,
    });

    try {
      const requestBody = createRequestBody(formData);
      const generatedJob = await generateContent(requestBody);

      updateGenerationState({
        generatedJob,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while generating content.";

      updateGenerationState({
        isLoading: false,
        showModal: false,
        error: errorMessage,
      });
    }
  }, [formData, updateGenerationState, generateContent]);

  /**
   * Closes the generation modal and resets state
   */
  const handleCloseModal = useCallback(() => {
    updateGenerationState({
      showModal: false,
      generatedJob: null,
      error: null,
    });
  }, [updateGenerationState]);

  /**
   * Handles making changes to generated content
   */
  const handleMakeChanges = useCallback(
    (content: string) => {
      updateFormData({
        action: "alter",
        existingContent: content,
      });
      handleCloseModal();
    },
    [updateFormData, handleCloseModal]
  );

  /**
   * Show error alert if there's an error
   */
  useEffect(() => {
    if (generationState.error) {
      alert(`Error: ${generationState.error}`);
    }
  }, [generationState.error]);

  /**
   * Typed callback handlers for form updates
   */
  const handleSetAction = useCallback(
    (action: Action) => updateFormData({ action }),
    [updateFormData]
  );

  const handleSetContentType = useCallback(
    (contentType: string) => updateFormData({ contentType }),
    [updateFormData]
  );

  const handleSetExistingContent = useCallback(
    (existingContent: string) => updateFormData({ existingContent }),
    [updateFormData]
  );

  const handleSetAdditionalContext = useCallback(
    (additionalContext: string) => updateFormData({ additionalContext }),
    [updateFormData]
  );

  const handleSetGenerationJobTitle = useCallback(
    (generationJobTitle: string) => updateFormData({ generationJobTitle }),
    [updateFormData]
  );

  const handleSetSelectedAudience = useCallback(
    (selectedAudience: Audience | null) => updateFormData({ selectedAudience }),
    [updateFormData]
  );

  return (
    <>
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3 h-full">
        <AudienceSelector
          audiences={audiences}
          selectedAudience={formData.selectedAudience}
          setSelectedAudience={handleSetSelectedAudience}
          loading={loading}
        />
        <GenerationPanel
          selectedAudience={formData.selectedAudience}
          isLoading={generationState.isLoading}
          onSubmit={handleSubmit}
          action={formData.action}
          setAction={handleSetAction}
          contentType={formData.contentType}
          setContentType={handleSetContentType}
          existingContent={formData.existingContent}
          setExistingContent={handleSetExistingContent}
          additionalContext={formData.additionalContext}
          setAdditionalContext={handleSetAdditionalContext}
          generationJobTitle={formData.generationJobTitle}
          setGenerationJobTitle={handleSetGenerationJobTitle}
        />
      </div>

      <GeneratingModal
        showModal={generationState.showModal}
        job={generationState.generatedJob}
        onClose={handleCloseModal}
        onMakeChanges={handleMakeChanges}
      />
    </>
  );
};
