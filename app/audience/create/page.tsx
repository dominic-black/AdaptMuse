"use client";

import { useEffect, useState } from "react";
import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";
import { TextInput } from "@/components/TextInput";
import { ChipInput } from "@/components/ChipInput";
import { Button } from "@/components/Button";
import {
  Clapperboard,
  PersonStanding,
  Mic2,
  BookOpen,
  ShoppingBag,
  Tv,
  Gamepad2,
  House,
  Podcast,
} from "lucide-react";
import { Entity } from "@/types/entity";
import MultiCheckbox from "@/components/MultiCheckbox/MultiCheckbox";
import RadioCheckbox from "@/components/RadioCheckbox/RadioCheckbox";
import { AUDIENCE_OPTIONS } from "@/constants/audiences";
import { AudienceCreatedModal } from "@/components/Modals/AudienceCreatedModal/AudienceCreatedModal";

export default function CreateAudiencePage() {
  const [audienceName, setAudienceName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Array<Entity>>([]);
  const [selectedAudienceOptions, setSelectedAudienceOptions] = useState<
    Record<string, { value: string[]; label: string }>
  >({});

  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [audienceFingerprint, setAudienceFingerprint] = useState<any | null>(
    null
  );

  useEffect(() => {
    console.log("Selected Interests:", selectedInterests);
    console.log("Selected Audience Options:", selectedAudienceOptions);
  }, [selectedInterests, selectedAudienceOptions]);

  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [gender, setGender] = useState<"male" | "female">("male");

  const ageGroupOptions = [
    { value: "24_and_younger", label: "24 and younger" },
    { value: "25_to_29", label: "25 to 29" },
    { value: "30_to_34", label: "30 to 34" },
    { value: "35_to_44", label: "35 to 44" },
    { value: "45_to_54", label: "45 to 54" },
    { value: "55_and_older", label: "55 and older" },
  ];

  const genderOptions = [
    { value: "both", label: "Both" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const interests = [
    {
      label: "Movies",
      type: "urn:entity:movie",
      placeholder: "Add movies...",
      icon: <Clapperboard className="w-4 h-4" />,
    },
    {
      label: "People",
      type: "urn:entity:person",
      placeholder: "Add people...",
      icon: <PersonStanding className="w-4 h-4" />,
    },
    {
      label: "Artists",
      type: "urn:entity:artist",
      placeholder: "Add artists...",
      icon: <Mic2 className="w-4 h-4" />,
    },
    {
      label: "Books",
      type: "urn:entity:book",
      placeholder: "Add books...",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      label: "Brands",
      type: "urn:entity:brand",
      placeholder: "Add brands...",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      label: "Places",
      type: "urn:entity:place",
      placeholder: "Add places...",
      icon: <House className="w-4 h-4" />,
    },
    {
      label: "TV Shows",
      type: "urn:entity:tv_show",
      placeholder: "Add TV shows...",
      icon: <Tv className="w-4 h-4" />,
    },
    {
      label: "Video Games",
      type: "urn:entity:videogame",
      placeholder: "Add video games...",
      icon: <Gamepad2 className="w-4 h-4" />,
    },
    {
      label: "Podcasts",
      type: "urn:entity:podcast",
      placeholder: "Add podcasts...",
      icon: <Podcast className="w-4 h-4" />,
    },
  ];

  const handleSubmit = async () => {
    try {
      setShowAudienceModal(true);
      const response = await fetch("/api/audience", {
        method: "POST",
        body: JSON.stringify({
          audienceName,
          audienceData: {
            entities: selectedInterests,
            audiences: Object.values(selectedAudienceOptions).flat(),
            ageGroup: selectedAgeGroups,
            gender,
          },
        }),
      });
      console.log("response = ", response);
      const data = await response.json();
      setAudienceFingerprint(data);
    } catch (error) {
      console.error("Error submitting audience:", error);
    }
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
                  value={audienceName}
                  onChange={(e) => setAudienceName(e.target.value)}
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
                        setChipIds={(newEntity) => {
                          setSelectedInterests((prev) => [...prev, newEntity]);
                        }}
                        onRemoveChip={(removedEntity) => {
                          setSelectedInterests((prev) =>
                            prev.filter(
                              (entity) => entity.id !== removedEntity.id
                            )
                          );
                        }}
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
                      selectedOptions={selectedAgeGroups}
                      onChange={setSelectedAgeGroups}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-gray-500 text-sm">Gender</p>
                    <RadioCheckbox
                      options={genderOptions}
                      selectedOption={gender}
                      onChange={(selected) =>
                        setGender(selected as "male" | "female")
                      }
                    />
                  </div>
                  {Object.entries(AUDIENCE_OPTIONS).map(
                    ([category, options]) => (
                      <div key={category}>
                        <p className="mb-2 text-gray-500 text-sm capitalize">
                          {category.replace(/_/g, " ").toLowerCase()}
                        </p>
                        <MultiCheckbox
                          options={options}
                          selectedOptions={
                            selectedAudienceOptions[category]?.value || []
                          }
                          onChange={(newSelection) => {
                            setSelectedAudienceOptions((prev) => ({
                              ...prev,
                              [category]: {
                                value: newSelection,
                                label:
                                  options.find(
                                    (option) => option.value === newSelection[0]
                                  )?.label || "unknown",
                              },
                            }));
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Create audience
                </Button>
              </div>
            </div>
          </Cell>
        </div>
      </div>
      <AudienceCreatedModal
        showAudienceModal={showAudienceModal}
        audienceFingerprint={audienceFingerprint}
      />
    </Screen>
  );
}
