"use client";

import { Search } from "lucide-react";
import React from "react";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="left-0 absolute inset-y-0 flex items-center pl-3.5 pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" aria-hidden="true" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className="block bg-white shadow-sm py-2.5 pr-3 pl-10 border-0 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:ring-primary ring-inset focus:ring-inset w-full text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
