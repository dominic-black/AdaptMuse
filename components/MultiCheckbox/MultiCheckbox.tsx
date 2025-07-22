import React from 'react';
import Checkbox from '../Checkbox/Checkbox';

interface MultiCheckboxProps {
  options: { value: string; label: string }[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const MultiCheckbox: React.FC<MultiCheckboxProps> = ({ options, selectedOptions, onChange }) => {
  const handleCheckboxChange = (value: string) => {
    const newSelection = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value];
    onChange(newSelection);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={selectedOptions.includes(option.value)}
          onChange={() => handleCheckboxChange(option.value)}
        />
      ))}
    </div>
  );
};

export default MultiCheckbox;