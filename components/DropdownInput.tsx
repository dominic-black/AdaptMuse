import React, { useState, useRef, useEffect, useId } from "react";

type DropdownInputVariant = "default" | "error" | "success";
type DropdownInputSize = "sm" | "md" | "lg";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange"
  > {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  variant?: DropdownInputVariant;
  size?: DropdownInputSize;
  leftIcon?: React.ReactNode;
  isRequired?: boolean;
  isFullWidth?: boolean;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string, option: DropdownOption) => void;
  onSearch?: (searchTerm: string) => void;
  searchable?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  maxHeight?: string;
}

const DropdownInput = React.forwardRef<HTMLInputElement, DropdownInputProps>(
  (
    {
      className = "",
      label,
      helperText,
      errorMessage,
      variant = "default",
      size = "md",
      leftIcon,
      isRequired = false,
      isFullWidth = false,
      options = [],
      value = "",
      onChange,
      onSearch,
      searchable = true,
      placeholder = "Select an option...",
      emptyMessage = "No options found",
      maxHeight = "200px",
      id,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [displayValue, setDisplayValue] = useState("");

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const generatedId = useId();
    const inputId = id || `dropdown-${generatedId}`;
    const hasError = variant === "error" || !!errorMessage;
    const hasSuccess = variant === "success";

    // Filter options based on search term
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update display value when value prop changes
    useEffect(() => {
      const selectedOption = options.find((option) => option.value === value);
      setDisplayValue(selectedOption ? selectedOption.label : "");
      setSearchTerm("");
    }, [value, options]);

    // Handle clicking outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
          setFocusedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Base input classes (same as TextInput)
    const baseInputClasses =
      "w-full border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 placeholder-gray-400";

    // Size classes (same as TextInput)
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-4 py-3 text-lg",
    };

    // Variant classes (same as TextInput)
    const variantClasses = {
      default:
        "border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-primary/20",
      error:
        "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/20",
      success:
        "border-green-500 bg-green-50 text-green-900 focus:border-green-500 focus:ring-green-500/20",
    };

    // Disabled classes (same as TextInput)
    const disabledClasses = "opacity-50 cursor-not-allowed bg-gray-100";

    // Icon padding adjustments
    const iconPaddingClasses = {
      left: leftIcon ? "pl-10" : "",
      right: "pr-10", // Always add right padding for dropdown arrow
    };

    const inputClasses = `
      ${baseInputClasses}
      ${sizeClasses[size]}
      ${variantClasses[hasError ? "error" : hasSuccess ? "success" : "default"]}
      ${disabled ? disabledClasses : "cursor-pointer"}
      ${iconPaddingClasses.left}
      ${iconPaddingClasses.right}
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    const containerClasses = `${isFullWidth ? "w-full" : "w-auto"} relative`;

    const handleInputClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (searchable && !isOpen) {
          setSearchTerm(displayValue);
        }
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (searchable) {
        setSearchTerm(e.target.value);
        setIsOpen(true);
        onSearch?.(e.target.value);
      }
    };

    const handleOptionClick = (option: DropdownOption) => {
      if (!option.disabled) {
        onChange?.(option.value, option);
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
          }
          break;
        case "Enter":
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            handleOptionClick(filteredOptions[focusedIndex]);
          } else if (!isOpen) {
            setIsOpen(true);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setFocusedIndex(-1);
          break;
      }
    };

    return (
      <div className={containerClasses} ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1 font-medium text-gray-700 text-sm"
          >
            {label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 pointer-events-none transform">
              {leftIcon}
            </div>
          )}

          <input
            ref={(node) => {
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              if (inputRef) {
                inputRef.current = node;
              }
            }}
            id={inputId}
            type="text"
            className={inputClasses}
            value={searchable && isOpen ? searchTerm : displayValue}
            placeholder={placeholder}
            onClick={handleInputClick}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            readOnly={!searchable}
            aria-haspopup="listbox"
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {/* Dropdown Arrow */}
          <div className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2 pointer-events-none transform">
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Dropdown List */}
          {isOpen && (
            <ul
              ref={listRef}
              className="z-10 absolute bg-white shadow-lg mt-1 border border-gray-300 rounded-md w-full overflow-auto"
              style={{ maxHeight }}
              role="listbox"
              aria-labelledby={inputId}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    className={`
                      px-4 py-2 cursor-pointer select-none
                      ${
                        index === focusedIndex
                          ? "bg-primary text-white"
                          : "text-gray-900 hover:bg-gray-100"
                      }
                      ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                      ${
                        option.value === value
                          ? "bg-primary/10 font-medium"
                          : ""
                      }
                    `}
                    onClick={() => handleOptionClick(option)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 text-center">
                  {emptyMessage}
                </li>
              )}
            </ul>
          )}
        </div>

        {hasError && errorMessage && (
          <p
            id={`${inputId}-error`}
            className="flex items-center mt-1 text-red-600 text-sm"
          >
            <svg
              className="mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errorMessage}
          </p>
        )}

        {!hasError && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-gray-500 text-sm">
            {helperText}
          </p>
        )}

        {hasSuccess && !errorMessage && (
          <p className="flex items-center mt-1 text-green-600 text-sm">
            <svg
              className="mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Valid selection
          </p>
        )}
      </div>
    );
  }
);

DropdownInput.displayName = "DropdownInput";

export { DropdownInput };
