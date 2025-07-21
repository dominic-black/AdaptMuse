"use client";

export const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
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
        className="bg-white px-4 py-2.5 border border-gray-300 focus:border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 w-full text-gray-900 text-base transition-all duration-200 placeholder-gray-400"
      />
    </div>
  );
};
