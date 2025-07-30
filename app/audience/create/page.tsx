"use client";

import { Cell } from "@/components/ui/Cell/Cell";
import { Screen } from "@/components/shared/Screen/Screen";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { AgeGroup, Entity, Gender } from "@/types/entities";
import MultiCheckbox from "@/components/ui/MultiCheckbox/MultiCheckbox";
import RadioCheckbox from "@/components/ui/RadioCheckbox/RadioCheckbox";
import {
  ageGroupOptions,
  genderOptions,
  interests,
} from "@/constants/audiences";
import { ChipInput } from "@/features/audience/components/ChipInput/ChipInput";
import { AudienceCreatedModal } from "@/features/audience/components/AudienceCreatedModal/AudienceCreatedModal";
import { useCreateAudience } from "@/features/audience/hooks/useCreateAudience";
import { useAudienceForm } from "@/features/audience/hooks/useAudienceForm";
import { useAudienceFilters } from "@/features/audience/hooks/useAudienceFilters";

export default function CreateAudiencePage() {
  const { formData, updateFormField, resetForm, isFormValid } =
    useAudienceForm();
  const { searchTerm, setSearchTerm, filteredAudienceOptions, filteredGenres } =
    useAudienceFilters();

  const {
    createAudienceFingerprint,
    isCreating,
    showModal,
    audienceFingerprint,
    error,
    closeModal,
  } = useCreateAudience();

  const handleSubmit = async () => {
    await createAudienceFingerprint({
      audienceName: formData.audienceName,
      audienceData: {
        entities: formData.selectedInterests,
        audiences: Object.values(formData.selectedAudienceOptions).flat(),
        ageGroup: formData.selectedAgeGroups,
        gender: formData.gender,
        genres: formData.selectedGenres,
      },
    });
  };

  const handleInterestAdd = (newEntity: Entity) => {
    updateFormField("selectedInterests", [
      ...formData.selectedInterests,
      newEntity,
    ]);
  };

  const handleInterestRemove = (removedEntity: Entity) => {
    updateFormField(
      "selectedInterests",
      formData.selectedInterests.filter(
        (entity) => entity.id !== removedEntity.id
      )
    );
  };

  return (
    <Screen heading="Saved Audiences">
      <div className="flex flex-col gap-4">
        <div className="">
          <Cell>
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-color-text text-2xl">
                Create new audience
              </h2>
              <div className="flex flex-col gap-2">
                <TextInput
                  label="Audience name"
                  value={formData.audienceName}
                  onChange={(e) =>
                    updateFormField("audienceName", e.target.value)
                  }
                  placeholder="Enter audience name..."
                />
              </div>
              <div className="gap-6 grid grid-cols-2">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-sm">Interests</p>
                  <div className="flex flex-col gap-4">
                    {interests.map((interest) => (
                      <ChipInput
                        key={interest.label}
                        type={interest.type}
                        label={interest.label}
                        placeholder={interest.placeholder}
                        setChipIds={handleInterestAdd}
                        onRemoveChip={handleInterestRemove}
                        icon={interest.icon}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="mt-2">
                    <p className="mb-2 text-gray-500 text-sm">Age group</p>
                    <MultiCheckbox
                      options={ageGroupOptions}
                      selectedOptions={formData.selectedAgeGroups}
                      onChange={(selected) =>
                        updateFormField(
                          "selectedAgeGroups",
                          selected as AgeGroup[]
                        )
                      }
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-gray-500 text-sm">Gender</p>
                    <RadioCheckbox
                      options={genderOptions}
                      selectedOption={formData.gender}
                      onChange={(selected) =>
                        updateFormField("gender", selected as Gender)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="">
                      <p className="mb-2 text-gray-500 text-sm">
                        Search audience options
                      </p>
                      <div className="relative">
                        <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="py-2 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-gray-500 text-sm capitalize">
                        Genres
                      </p>
                      <MultiCheckbox
                        options={filteredGenres}
                        selectedOptions={formData.selectedGenres.map(
                          (genre) => genre.value
                        )}
                        onChange={(selected) =>
                          updateFormField(
                            "selectedGenres",
                            selected.map((genre) => ({
                              value: genre,
                              label:
                                filteredGenres.find((g) => g.value === genre)
                                  ?.label || "Unknown",
                            }))
                          )
                        }
                      />
                    </div>
                    {Object.entries(filteredAudienceOptions).map(
                      ([category, options]) => (
                        <div key={category}>
                          <p className="mb-2 text-gray-500 text-sm capitalize">
                            {category.replace(/_/g, " ").toLowerCase()}
                          </p>
                          <MultiCheckbox
                            options={options}
                            selectedOptions={
                              formData.selectedAudienceOptions[category]?.map(
                                (option) => option.value
                              ) || []
                            }
                            onChange={(newSelection: string[]) => {
                              updateFormField("selectedAudienceOptions", {
                                ...formData.selectedAudienceOptions,
                                [category]: newSelection.map(
                                  (selectedValue) => {
                                    const selectedOption = options.find(
                                      (option) => option.value === selectedValue
                                    );
                                    return (
                                      selectedOption || {
                                        value: selectedValue,
                                        label: "unknown",
                                      }
                                    );
                                  }
                                ),
                              });
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isCreating || !isFormValid}
                >
                  {isCreating ? "Creating..." : "Create audience"}
                </Button>
              </div>
            </div>
          </Cell>
        </div>
      </div>
      <AudienceCreatedModal
        showAudienceModal={showModal}
        audienceFingerprint={audienceFingerprint}
        onClose={closeModal}
      />
      {error && (
        <div className="top-4 right-4 fixed bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700">
          {error}
        </div>
      )}
    </Screen>
  );
}
