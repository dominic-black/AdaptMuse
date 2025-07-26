"use client";

export const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  type = "text",
  disabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
  disabled?: boolean;
}) => {
  return (
    <div className="w-full">
      <label className="text-gray-500 text-sm">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`px-4 py-2.5 border rounded-md focus:outline-none w-full text-base transition-all duration-200 ${
          disabled
            ? "bg-gray-50 border-gray-200 text-gray-400 placeholder-gray-300 cursor-not-allowed"
            : "bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 text-gray-900 placeholder-gray-400"
        }`}
      />
    </div>
  );
};
