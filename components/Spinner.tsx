import React from "react";

interface SpinnerProps {
  size?: keyof typeof sizeClasses;
  className?: string;
  color?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
  color = "#E5E9F0",
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`border-2 rounded-full animate-spin ${sizeClasses[size]}`}
        style={{
          borderColor: color,
          borderTopColor: "transparent",
        }}
      />
    </div>
  );
};
