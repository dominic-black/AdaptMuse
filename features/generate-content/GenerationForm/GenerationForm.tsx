import { Sparkles, Pencil } from "lucide-react";
import { TextInput } from "@/components/ui/TextInput";
import { useState } from "react";
import { ActionButton } from "./ActionButton";

type Action = "generate" | "alter";

export const GenerationForm = ({
  action,
  setAction,
}: {
  action: string;
  setAction: (action: Action) => void;
}) => {
  const [contentType, setContentType] = useState("");
  const [existingContent, setExistingContent] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  return (
    <div className="flex-1 pr-2 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h2 className="mb-4 font-semibold text-gray-800 text-lg">
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
          <h2 className="mb-4 font-semibold text-gray-800 text-lg">
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
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Existing Content
                </label>
                <textarea
                  value={existingContent}
                  onChange={(e) => setExistingContent(e.target.value)}
                  placeholder="Paste your existing content here..."
                  className="bg-white p-2 border border-gray-300 focus:border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 w-full h-48 resize-none"
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
                className="bg-white p-2 border border-gray-300 focus:border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 w-full h-32 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
