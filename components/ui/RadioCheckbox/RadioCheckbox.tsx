import React from 'react';
import Checkbox from '../Checkbox/Checkbox';

interface RadioCheckboxProps {
  options: { value: string; label: string }[];
  selectedOption: string;
  onChange: (selected: string) => void;
}

const RadioCheckbox: React.FC<RadioCheckboxProps> = ({ options, selectedOption, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={selectedOption === option.value}
          onChange={() => onChange(option.value)}
        />
      ))}
    </div>
  );
};

export default RadioCheckbox;