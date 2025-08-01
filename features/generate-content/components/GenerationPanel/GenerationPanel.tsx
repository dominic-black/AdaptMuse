import { Button } from "@/components/ui/Button";
import {
  GenerationForm,
  GenerationFormProps,
} from "@/features/generate-content/components/GenerationForm/GenerationForm";
import { Audience } from "@/types/audience";

export interface GenerationPanelProps extends GenerationFormProps {
  selectedAudience: Audience | null;
  isLoading: boolean;
  onSubmit: () => void;
}

export const GenerationPanel = ({
  selectedAudience,
  isLoading,
  onSubmit,
  ...formProps
}: GenerationPanelProps) => {
  return (
    <div className="flex flex-col lg:col-span-2 bg-white shadow-sm p-4 lg:p-6 rounded-lg h-full">
      <GenerationForm {...formProps} />
      <div className="flex justify-end pt-6 border-gray-200 border-t">
        <Button disabled={!selectedAudience || isLoading} onClick={onSubmit}>
          {isLoading
            ? "Generating..."
            : formProps.action === "generate"
            ? "Generate Content"
            : "Alter Content"}
        </Button>
      </div>
    </div>
  );
};
