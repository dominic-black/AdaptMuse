"use client";

import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";
import { useAudiences } from "@/providers/AudienceProvider";
import { Audience } from "@/types/audience";
import { useState } from "react";
import Image from "next/image";
import { CheckIcon, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";

export default function BotPage() {
  const { audiences } = useAudiences();
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(
    null
  );
  const [action, setAction] = useState<"generate" | "alter">("generate");
  const [contentType, setContentType] = useState("");
  const [existingContent, setExistingContent] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  const ActionButton = ({
    selected,
    onClick,
    icon,
    text,
  }: {
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );

  return (
    <Screen heading="Create content">
      <div className="gap-4 grid grid-cols-[1fr_2fr]">
        <Cell>
          <div>
            <p className="mb-4 font-medium text-gray-700">
              1. Select a target audience
            </p>
            <div className="space-y-2">
              {audiences.map((audience) => (
                <div
                  key={audience.id}
                  onClick={() => setSelectedAudience(audience)}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAudience?.id === audience.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-gray-100 rounded-lg w-10 h-10 overflow-hidden">
                      <Image
                        src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                        alt={audience.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {audience.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {audience.entities.length} entities
                      </p>
                    </div>
                  </div>

                  {selectedAudience?.id === audience.id && (
                    <div className="flex justify-center items-center bg-primary rounded-full w-6 h-6">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {audiences.length === 0 && (
                <div className="py-8 text-gray-500 text-center">
                  <p>No audiences created yet</p>
                  <p className="mt-1 text-sm">
                    Create an audience to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </Cell>
        <Cell>
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-4 font-medium text-gray-700">
                2. Choose what you want to do
              </p>
              <div className="flex gap-4">
                <ActionButton
                  selected={action === "generate"}
                  onClick={() => setAction("generate")}
                  icon={<Sparkles className="w-5 h-5 text-primary" />}
                  text="Generate new content"
                />
                <ActionButton
                  selected={action === "alter"}
                  onClick={() => setAction("alter")}
                  icon={<Pencil className="w-5 h-5 text-gray-600" />}
                  text="Alter existing content"
                />
              </div>
            </div>

            <div>
              <p className="mb-4 font-medium text-gray-700">
                3. Provide content details
              </p>
              <div className="space-y-4">
                <TextInput
                  label="Content Type"
                  placeholder="e.g. Ad copy, public speech, marketing email..."
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                />

                {action === "alter" && (
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Content to alter
                    </label>
                    <textarea
                      value={existingContent}
                      onChange={(e) => setExistingContent(e.target.value)}
                      placeholder="Paste your existing content here..."
                      className="bg-white p-2 border border-gray-300 focus:border-primary rounded-md focus:ring-primary w-full h-40 resize-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Additional Context
                  </label>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Provide any additional context, like brand voice, key message, etc."
                    className="bg-white p-2 border border-gray-300 focus:border-primary rounded-md focus:ring-primary w-full h-40 resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button disabled={!selectedAudience}>
                {action === "generate" ? "Generate Content" : "Alter Content"}
              </Button>
            </div>
          </div>
        </Cell>
      </div>
    </Screen>
  );
}
