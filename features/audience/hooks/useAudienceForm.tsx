import { useEffect, useState } from "react";
import { AgeGroup, Entity, Gender } from "@/types/entities";
import { AudienceOption } from "@/constants/audiences";

export interface AudienceFormData {
  audienceName: string;
  selectedInterests: Entity[];
  selectedAudienceOptions: Record<string, AudienceOption[]>;
  selectedGenres: AudienceOption[];
  selectedAgeGroups: AgeGroup[];
  gender: Gender;
}

export interface UseAudienceFormReturn {
  formData: AudienceFormData;
  updateFormField: <K extends keyof AudienceFormData>(
    field: K,
    value: AudienceFormData[K]
  ) => void;
  resetForm: () => void;
  isFormValid: boolean;
  validationErrors: string[];
  hasAttemptedSubmit: boolean;
  setHasAttemptedSubmit: (attempted: boolean) => void;
}

const initialFormData: AudienceFormData = {
  audienceName: "",
  selectedInterests: [],
  selectedAudienceOptions: {},
  selectedGenres: [],
  selectedAgeGroups: [],
  gender: "all",
};

export const useAudienceForm = (): UseAudienceFormReturn => {
  const [formData, setFormData] = useState<AudienceFormData>(initialFormData);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const updateFormField = <K extends keyof AudienceFormData>(
    field: K,
    value: AudienceFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  const resetForm = () => {
    setFormData(initialFormData);
    setHasAttemptedSubmit(false);
  };

  // Enhanced validation with specific error messages
  const validationErrors: string[] = [];

  if (!formData.audienceName.trim()) {
    validationErrors.push("Please enter a name for your audience");
  } else if (formData.audienceName.trim().length < 2) {
    validationErrors.push("Audience name must be at least 2 characters long");
  } else if (formData.audienceName.length > 100) {
    validationErrors.push("Audience name must be less than 100 characters");
  }

  // Check if user has added some interests or selections
  const hasValidEntities = formData.selectedInterests.some(
    (entity) =>
      entity.id && typeof entity.id === "string" && !("error" in entity)
  );
  const hasGenres = formData.selectedGenres.length > 0;
  const hasAudienceOptions = Object.values(
    formData.selectedAudienceOptions
  ).some((options) => options.length > 0);
  const hasAgeGroups = formData.selectedAgeGroups.length > 0;

  if (!hasValidEntities && !hasGenres && !hasAudienceOptions && !hasAgeGroups) {
    validationErrors.push(
      "Please add at least one interest, genre, or demographic selection"
    );
  }

  const isFormValid = validationErrors.length === 0;

  return {
    formData,
    updateFormField,
    resetForm,
    isFormValid,
    validationErrors,
    hasAttemptedSubmit,
    setHasAttemptedSubmit,
  };
};
