"use client";

import { Screen } from "@/components/Screen/Screen";
import { useAudiences } from "@/providers/AudienceProvider";
import { Audience } from "@/types/audience";
import { useState } from "react";
import Image from "next/image";
import { CheckIcon, Sparkles, Pencil, Users } from "lucide-react";
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
    <Screen heading="AI Content Generator">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full">
        {/* Left Column: Audience Selection */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            1. Select Target Audience
          </h2>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2">
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
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg h-full flex flex-col justify-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">
                  No audiences found
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Create one to get started.
                </p>
                <div className="mt-4">
                  <Button href="/audience/create" variant="outline" size="sm">
                    Create Audience
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Content Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  2. Choose Action
                </h2>
                <div className="flex gap-4">
                  <ActionButton
                    selected={action === "generate"}
                    onClick={() => setAction("generate")}
                    icon={<Sparkles className="w-5 h-5 text-primary" />}
                    text="Generate New Content"
                  />
                  <ActionButton
                    selected={action === "alter"}
                    onClick={() => setAction("alter")}
                    icon={<Pencil className="w-5 h-5 text-gray-600" />}
                    text="Alter Existing Content"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  3. Provide Details
                </h2>
                <div className="space-y-4">
                  <TextInput
                    label="Content Type"
                    placeholder="e.g. Ad copy, song lyrics, marketing email..."
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                  />

                  {action === "alter" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Existing Content
                      </label>
                      <textarea
                        value={existingContent}
                        onChange={(e) => setExistingContent(e.target.value)}
                        placeholder="Paste your existing content here..."
                        className="w-full h-32 p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary resize-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Context
                    </label>
                    <textarea
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value)}
                      placeholder="Provide any additional context, like brand voice, key message, etc."
                      className="w-full h-32 p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button disabled={!selectedAudience}>
              {action === "generate" ? "Generate Content" : "Alter Content"}
            </Button>
          </div>
        </div>
      </div>
    </Screen>
  );
}
