"use client";

import { useEffect, useState } from "react";
import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";
import { TextInput } from "@/components/TextInput";
import { ChipInput } from "@/components/ChipInput";
import { Button } from "@/components/Button";
import {
  Clapperboard,
  Check,
  PersonStanding,
  Square,
  Mic2,
  BookOpen,
  ShoppingBag,
  MapPin,
  Tv,
  Gamepad2,
  House,
  Podcast,
} from "lucide-react";
import { Entity } from "@/types/entity";

export default function AudiencePage() {
  const [audienceName, setAudienceName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Array<Entity>>([]);

  useEffect(() => {
    console.log(selectedInterests);
  }, [selectedInterests]);

  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [gender, setGender] = useState<"male" | "female">("male");

  const ageGroupOptions = [
    { value: "35_and_younger", label: "35 and younger" },
    { value: "36_to_55", label: "36 to 55" },
    { value: "55_and_older", label: "55 and older" },
  ];

  const toggleAgeGroup = (ageGroup: string) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(ageGroup)
        ? prev.filter((group) => group !== ageGroup)
        : [...prev, ageGroup]
    );
  };

  const genderOptions = [
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
      label: "Destinations",
      type: "urn:entity:destination",
      placeholder: "Add destinations...",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      label: "Podcasts",
      type: "urn:entity:podcast",
      placeholder: "Add podcasts...",
      icon: <Podcast className="w-4 h-4" />,
    },
  ];

  return (
    <Screen heading="Saved Audiences">
      <div className="flex flex-col gap-4">
        <div className="gap-4 grid grid-cols-[4fr_1fr]">
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
                        icon={interest.icon}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="mt-2">
                    <p className="mb-2 text-gray-500 text-sm">Age group</p>
                    <div className="flex flex-wrap gap-2">
                      {ageGroupOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => toggleAgeGroup(option.value)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
                            selectedAgeGroups.includes(option.value)
                              ? "bg-primary text-white border-primary shadow-md"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5"
                          }`}
                        >
                          <div className="relative">
                            {selectedAgeGroups.includes(option.value) ? (
                              <div className="flex justify-center items-center bg-white border border-white rounded-sm w-4 h-4">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </div>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-gray-500 text-sm">Gender</p>
                    <div className="flex flex-wrap gap-2">
                      {genderOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setGender(option.value as "male" | "female")
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
                            gender === option.value
                              ? "bg-primary text-white border-primary shadow-md"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5"
                          }`}
                        >
                          <div className="relative">
                            {gender === option.value ? (
                              <div className="flex justify-center items-center bg-white border border-white rounded-sm w-4 h-4">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </div>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-gray-500 text-sm">Audience type</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button variant="primary">Create audience</Button>
              </div>
            </div>
          </Cell>
          <Cell>
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-color-text text-2xl">
                Saved Audiences
              </h2>
            </div>
          </Cell>
        </div>
      </div>
    </Screen>
  );
}
