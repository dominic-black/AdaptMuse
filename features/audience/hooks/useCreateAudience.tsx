import { useState } from "react";
import { createAudience, CreateAudienceRequest } from "@/utils/audience";
import { Audience } from "@/types/audience";

export interface UseCreateAudienceReturn {
  createAudienceFingerprint: (data: CreateAudienceRequest) => Promise<void>;
  isCreating: boolean;
  showModal: boolean;
  audienceFingerprint: Audience | null;
  error: string | null;
  closeModal: () => void;
  resetState: () => void;
}

export const useCreateAudience = (): UseCreateAudienceReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [audienceFingerprint, setAudienceFingerprint] =
    useState<Audience | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createAudienceFingerprint = async (data: CreateAudienceRequest) => {
    try {
      setIsCreating(true);
      setError(null);
      setShowModal(true);

      const result = await createAudience(data);

      if (result.success && result.audience) {
        setAudienceFingerprint(result.audience);
      } else {
        setError(result.error || "Failed to create audience");
        setShowModal(false);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      setShowModal(false);
    } finally {
      setIsCreating(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setAudienceFingerprint(null);
    setError(null);
  };

  const resetState = () => {
    setShowModal(false);
    setAudienceFingerprint(null);
    setError(null);
    setIsCreating(false);
  };

  return {
    createAudienceFingerprint,
    isCreating,
    showModal,
    audienceFingerprint,
    error,
    closeModal,
    resetState,
  };
};
