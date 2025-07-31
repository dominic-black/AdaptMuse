import { DESCRIPTIONS } from "@/constants/info";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

export const ExplainationToolTip = ({ label }: { label: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const description = DESCRIPTIONS[label as keyof typeof DESCRIPTIONS];

  if (!description) {
    return null;
  }

  return (
    <div className="inline-block relative">
      <div
        className="cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
      </div>

      {isVisible && (
        <div className="bottom-full left-1/2 z-50 absolute mb-2 w-80 max-w-sm -translate-x-1/2 transform">
          <div className="bg-gray-900 shadow-lg px-4 py-3 border border-gray-700 rounded-lg text-white text-sm">
            <div className="mb-1 font-medium text-gray-100">{label}</div>
            <div className="text-gray-300 leading-relaxed">{description}</div>
            {/* Tooltip arrow */}
            <div className="top-full left-1/2 absolute border-4 border-t-gray-900 border-transparent -translate-x-1/2 transform"></div>
          </div>
        </div>
      )}
    </div>
  );
};
