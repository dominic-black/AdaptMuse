import { useState, useCallback } from "react";
import { Job } from "@/types/job";
import { GenerateContentRequest } from "./useContentGenerationForm";

export interface GenerationState {
  isLoading: boolean;
  showModal: boolean;
  generatedJob: Job | null;
  error: string | null;
}

const initialGenerationState: GenerationState = {
  isLoading: false,
  showModal: false,
  generatedJob: null,
  error: null,
};

export const useContentGeneration = () => {
  const [generationState, setGenerationState] = useState<GenerationState>(
    initialGenerationState
  );

  const updateGenerationState = useCallback(
    (updates: Partial<GenerationState>) => {
      setGenerationState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

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

  const startGeneration = useCallback(
    async (requestBody: GenerateContentRequest) => {
      // Clear any previous errors
      updateGenerationState({ error: null });

      // Start generation process
      updateGenerationState({
        isLoading: true,
        showModal: true,
        generatedJob: null,
      });

      try {
        const generatedJob = await generateContent(requestBody);

        updateGenerationState({
          generatedJob,
          isLoading: false,
        });

        return generatedJob;
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

        throw error;
      }
    },
    [updateGenerationState, generateContent]
  );

  const closeModal = useCallback(() => {
    updateGenerationState({
      showModal: false,
      generatedJob: null,
      error: null,
    });
  }, [updateGenerationState]);

  const clearError = useCallback(() => {
    updateGenerationState({ error: null });
  }, [updateGenerationState]);

  const resetGenerationState = useCallback(() => {
    setGenerationState(initialGenerationState);
  }, []);

  return {
    generationState,
    updateGenerationState,
    startGeneration,
    closeModal,
    clearError,
    resetGenerationState,
  };
};
