import { useState } from "react";
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

  const updateFormField = <K extends keyof AudienceFormData>(
    field: K,
    value: AudienceFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const isFormValid = formData.audienceName.trim().length > 0;

  return {
    formData,
    updateFormField,
    resetForm,
    isFormValid,
  };
};
