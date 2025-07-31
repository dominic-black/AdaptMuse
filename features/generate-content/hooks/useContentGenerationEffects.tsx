import { useEffect } from "react";
import { Job } from "@/types/job";
import { GenerationState } from "./useContentGeneration";

interface UseContentGenerationEffectsProps {
  job?: Job | null;
  generationState: GenerationState;
  populateFromJob: (job: Job) => void;
}

export const useContentGenerationEffects = ({
  job,
  generationState,
  populateFromJob,
}: UseContentGenerationEffectsProps) => {
  // Populate form when editing an existing job
  useEffect(() => {
    if (job) {
      populateFromJob(job);
    }
  }, [job, populateFromJob]);

  // Show error alert if there's an error
  useEffect(() => {
    if (generationState.error) {
      alert(`Error: ${generationState.error}`);
    }
  }, [generationState.error]);
};
