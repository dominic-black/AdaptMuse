import { useState, useCallback } from "react";
import { Audience } from "@/types/audience";
import { Job } from "@/types/job";

export type Action = "generate" | "alter";

export interface FormData {
  selectedAudience: Audience | null;
  action: Action;
  contentType: string;
  existingContent: string;
  additionalContext: string;
  generationJobTitle: string;
}

export interface GenerateContentRequest {
  audienceId: string;
  generationJobTitle: string;
  contentType: string;
  content: string;
  context: string;
}

const VALIDATION_ERRORS = {
  NO_AUDIENCE: "Please select an audience.",
  NO_TITLE: "Please provide a generation job title.",
  NO_CONTENT_TYPE: "Please specify the type of content to generate.",
  NO_EXISTING_CONTENT: "Please provide the existing content to alter.",
} as const;

const initialFormData: FormData = {
  selectedAudience: null,
  action: "generate",
  contentType: "",
  existingContent: "",
  additionalContext: "",
  generationJobTitle: "",
};

export const useContentGenerationForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const validateFormData = useCallback((data: FormData): string | null => {
    const {
      selectedAudience,
      generationJobTitle,
      contentType,
      action,
      existingContent,
    } = data;

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
  }, []);

  const createRequestBody = useCallback(
    (data: FormData): GenerateContentRequest => {
      return {
        audienceId: data.selectedAudience!.id,
        generationJobTitle: data.generationJobTitle.trim(),
        contentType: data.contentType.trim(),
        content: data.existingContent.trim(),
        context: data.additionalContext.trim(),
      };
    },
    []
  );

  const populateFromJob = useCallback(
    (job: Job) => {
      updateFormData({
        selectedAudience: job.audience as Audience,
        action: "alter",
        contentType: job.contentType || "",
        existingContent: job.generatedContent || "",
        additionalContext: job.context || "",
        generationJobTitle: `New - ${job.title}`,
      });
    },
    [updateFormData]
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  // Individual field update handlers
  const setAction = useCallback(
    (action: Action) => updateFormData({ action }),
    [updateFormData]
  );

  const setContentType = useCallback(
    (contentType: string) => updateFormData({ contentType }),
    [updateFormData]
  );

  const setExistingContent = useCallback(
    (existingContent: string) => updateFormData({ existingContent }),
    [updateFormData]
  );

  const setAdditionalContext = useCallback(
    (additionalContext: string) => updateFormData({ additionalContext }),
    [updateFormData]
  );

  const setGenerationJobTitle = useCallback(
    (generationJobTitle: string) => updateFormData({ generationJobTitle }),
    [updateFormData]
  );

  const setSelectedAudience = useCallback(
    (selectedAudience: Audience | null) => updateFormData({ selectedAudience }),
    [updateFormData]
  );

  return {
    formData,
    updateFormData,
    validateFormData,
    createRequestBody,
    populateFromJob,
    resetForm,
    // Field setters
    setAction,
    setContentType,
    setExistingContent,
    setAdditionalContext,
    setGenerationJobTitle,
    setSelectedAudience,
  };
};
