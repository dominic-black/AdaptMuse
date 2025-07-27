import React from "react";
import { Check, Square } from "lucide-react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
        checked
          ? "bg-primary text-white border-primary shadow-md"
          : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5"
      }`}
    >
      <div className="relative">
        {checked ? (
          <div className="flex justify-center items-center bg-white border border-white rounded-sm w-4 h-4">
            <Check className="w-3 h-3 text-primary" />
          </div>
        ) : (
          <Square className="w-4 h-4 text-gray-400" />
        )}
      </div>
      {label}
    </button>
  );
};

export default Checkbox;
