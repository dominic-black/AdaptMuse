"use client";

import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export interface DropdownOption {
  value: string;
  label: string;
  image?: string;
}

interface DropdownInputProps {
  placeholder: string;
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
}

export const DropdownInput = ({
  placeholder,
  options,
  value,
  onChange,
  searchable = true,
  disabled = false,
  error,
}: DropdownInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter options based on search text
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Get display value for the input
  const selectedOption = options.find((option) => option.value === value);
  const displayValue =
    searchable && isOpen ? searchText : selectedOption?.label || "";

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchText("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (
          isOpen &&
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchText("");
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }
        break;
      case "Tab":
        setIsOpen(false);
        setSearchText("");
        setHighlightedIndex(-1);
        break;
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  const handleInputClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (searchable && !isOpen) {
      setSearchText("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!searchable || disabled) return;
    setSearchText(e.target.value);
    setHighlightedIndex(-1);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleSelect = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchText("");
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    if (disabled) return;
    if (searchable) {
      setSearchText("");
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative">
        <div
          className={`relative flex items-center bg-white border rounded-md transition-all duration-200 ${
            error
              ? "border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
              : "border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-1"
          } ${disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={displayValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            readOnly={!searchable}
            disabled={disabled}
            className={`bg-transparent px-4 py-2.5 focus:outline-none w-full text-gray-900 text-base placeholder-gray-400 ${
              disabled
                ? "cursor-not-allowed"
                : searchable
                ? "cursor-text"
                : "cursor-pointer"
            }`}
          />

          <div className="right-0 absolute flex items-center px-4 pointer-events-none">
            {isOpen ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Dropdown List */}
        {isOpen && !disabled && (
          <div className="z-50 absolute bg-white shadow-lg mt-1 border border-gray-300 rounded-md w-full max-h-60 overflow-auto">
            <div ref={listRef}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`px-4 py-2.5 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      index === highlightedIndex
                        ? "bg-primary/10 text-primary"
                        : "text-gray-900 hover:bg-gray-50"
                    } ${index === 0 ? "rounded-t-md" : ""} ${
                      index === filteredOptions.length - 1 ? "rounded-b-md" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option.image && (
                        <div className="flex justify-center items-center rounded-sm w-6 h-6 overflow-hidden">
                          <Image
                            src={option.image}
                            alt={option.label}
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="text-base">{option.label}</span>
                    </div>
                    {option.value === value && (
                      <CheckIcon className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2.5 text-gray-500 text-base">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );
};
