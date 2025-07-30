"use client";

import { Cell } from "@/components/ui/Cell/Cell";
import { Screen } from "@/components/shared/Screen/Screen";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { Search, Brain, TrendingUp, Target, BarChart3 } from "lucide-react";
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
import { useState, useEffect } from "react";
import { GeneratingAudienceAnimation } from "@/components/animations/audience/GeneratingAudienceAnimation";

interface InsightPreview {
  predictedAffinity: number;
  estimatedDiversity: number;
  culturalRelevance: string;
  targetingScore: number;
}

export default function CreateAudiencePage() {
  const { formData, updateFormField, resetForm, isFormValid } =
    useAudienceForm();
  const { searchTerm, setSearchTerm, filteredAudienceOptions, filteredGenres } =
    useAudienceFilters();
  const [insightPreview, setInsightPreview] = useState<InsightPreview | null>(
    null
  );

  const {
    createAudienceFingerprint,
    isCreating,
    showModal,
    audienceFingerprint,
    error,
    closeModal,
  } = useCreateAudience();

  // Real-time audience insights preview
  useEffect(() => {
    if (
      formData.selectedInterests.length > 0 ||
      formData.selectedGenres.length > 0 ||
      Object.values(formData.selectedAudienceOptions).flat().length > 0
    ) {
      // Calculate preview metrics
      const entityCount = formData.selectedInterests.length;
      const genreCount = formData.selectedGenres.length;
      const audienceCount = Object.values(
        formData.selectedAudienceOptions
      ).flat().length;
      const ageGroupCount = formData.selectedAgeGroups.length;

      // Estimate audience quality metrics
      const predictedAffinity = Math.min(
        entityCount * 0.2 + genreCount * 0.15 + audienceCount * 0.1,
        1
      );
      const estimatedDiversity = Math.min(
        genreCount * 0.25 + audienceCount * 0.15 + ageGroupCount * 0.1,
        1
      );
      const targetingScore = Math.min(
        (entityCount + genreCount + audienceCount + ageGroupCount) * 0.05,
        1
      );

      // Cultural relevance assessment
      let culturalRelevance = "Building...";
      if (targetingScore > 0.7) culturalRelevance = "Highly Targeted";
      else if (targetingScore > 0.5) culturalRelevance = "Well-Defined";
      else if (targetingScore > 0.3) culturalRelevance = "Emerging Profile";
      else culturalRelevance = "Basic Profile";

      setInsightPreview({
        predictedAffinity,
        estimatedDiversity,
        culturalRelevance,
        targetingScore,
      });
    } else {
      setInsightPreview(null);
    }
  }, [formData]);

  const handleSubmit = async () => {
    await createAudienceFingerprint({
      audienceName: formData.audienceName,
      audienceData: {
        entities: formData.selectedInterests,
        audienceOptions: formData.selectedAudienceOptions,
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
    <Screen heading="Create Audience">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <h1 className="font-bold text-gray-900 text-2xl">
              AI-Powered Audience Analysis
            </h1>
          </div>
          <p className="text-gray-700">
            Create detailed audience profiles using advanced cultural
            intelligence. Generate insights for targeted marketing and content
            strategy.
          </p>
        </div>

        {/* Main Content */}
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Cell>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-color-text text-xl">
                    Audience Configuration
                  </h2>
                </div>

                {/* Basic Configuration */}
                <div className="space-y-4">
                  <TextInput
                    label="Audience Name"
                    value={formData.audienceName}
                    onChange={(e) =>
                      updateFormField("audienceName", e.target.value)
                    }
                    placeholder="Enter descriptive audience name..."
                  />
                </div>

                {/* Main Form Grid */}
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  {/* Interests Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-800">
                        Cultural Interests
                      </h3>
                    </div>
                    <div className="space-y-3">
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

                  {/* Demographics & Preferences */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-800">
                        Demographics & Preferences
                      </h3>
                    </div>

                    {/* Age Groups */}
                    <div>
                      <p className="mb-2 font-medium text-gray-700 text-sm">
                        Age Groups
                      </p>
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

                    {/* Gender */}
                    <div>
                      <p className="mb-2 font-medium text-gray-700 text-sm">
                        Gender
                      </p>
                      <RadioCheckbox
                        options={genderOptions}
                        selectedOption={formData.gender}
                        onChange={(selected) =>
                          updateFormField("gender", selected as Gender)
                        }
                      />
                    </div>

                    {/* Search */}
                    <div>
                      <p className="mb-2 font-medium text-gray-700 text-sm">
                        Search Audience Attributes
                      </p>
                      <div className="relative">
                        <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                        <input
                          type="text"
                          placeholder="Search genres, interests, demographics..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="py-2 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full"
                        />
                      </div>
                    </div>

                    {/* Genres */}
                    <div>
                      <p className="mb-2 font-medium text-gray-700 text-sm">
                        Content Genres
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

                    {/* Audience Options */}
                    {Object.entries(filteredAudienceOptions).map(
                      ([category, options]) => (
                        <div key={category}>
                          <p className="mb-2 font-medium text-gray-700 text-sm capitalize">
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

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={resetForm}>
                    Reset Configuration
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isCreating || !isFormValid}
                    className="min-w-[200px]"
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-2">
                        <GeneratingAudienceAnimation width={20} height={20} />
                        <span>Generating Analysis...</span>
                      </div>
                    ) : (
                      <>
                        <Brain className="mr-2 w-4 h-4" />
                        Generate Audience Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Cell>
          </div>

          {/* Real-time Preview Panel */}
          <div className="space-y-4">
            {/* Insights Preview */}
            {insightPreview && (
              <Cell>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">
                      Real-time Preview
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Metrics */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">
                          Cultural Affinity
                        </span>
                        <span className="font-semibold text-sm">
                          {(insightPreview.predictedAffinity * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full w-full h-2">
                        <div
                          className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                          style={{
                            width: `${insightPreview.predictedAffinity * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">
                          Diversity Index
                        </span>
                        <span className="font-semibold text-sm">
                          {(insightPreview.estimatedDiversity * 100).toFixed(0)}
                          %
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full w-full h-2">
                        <div
                          className="bg-green-500 rounded-full h-2 transition-all duration-300"
                          style={{
                            width: `${
                              insightPreview.estimatedDiversity * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">
                          Targeting Score
                        </span>
                        <span className="font-semibold text-sm">
                          {(insightPreview.targetingScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full w-full h-2">
                        <div
                          className="bg-purple-500 rounded-full h-2 transition-all duration-300"
                          style={{
                            width: `${insightPreview.targetingScore * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                      <p className="font-semibold text-gray-800 text-sm text-center">
                        {insightPreview.culturalRelevance}
                      </p>
                    </div>
                  </div>
                </div>
              </Cell>
            )}

            {/* Features Information */}
            <Cell>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">
                  Analysis Features
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-2 h-2"></div>
                    <span className="text-gray-600">
                      Cultural Intelligence Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-2 h-2"></div>
                    <span className="text-gray-600">Demographic Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-2 h-2"></div>
                    <span className="text-gray-600">Trend Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-2 h-2"></div>
                    <span className="text-gray-600">AI Recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-2 h-2"></div>
                    <span className="text-gray-600">Quality Metrics</span>
                  </div>
                </div>
              </div>
            </Cell>

            {/* Benefits */}
            <Cell>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Benefits</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Precise audience targeting</li>
                  <li>• Cultural trend alignment</li>
                  <li>• Data-driven insights</li>
                  <li>• Performance optimization</li>
                  <li>• Strategic content planning</li>
                </ul>
              </div>
            </Cell>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AudienceCreatedModal
        showAudienceModal={showModal}
        audienceFingerprint={audienceFingerprint}
        onClose={closeModal}
      />

      {/* Error Display */}
      {error && (
        <div className="top-4 right-4 fixed bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 rounded-full w-2 h-2"></div>
            {error}
          </div>
        </div>
      )}
    </Screen>
  );
}
