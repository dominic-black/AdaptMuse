import { HelpCircle } from "lucide-react";

export const ScreenHeader = ({ heading }: { heading: string }) => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="font-bold text-color-text text-4xl">{heading}</h1>
      <div className="flex items-center gap-3">
        <HelpCircle />
      </div>
    </header>
  );
};
