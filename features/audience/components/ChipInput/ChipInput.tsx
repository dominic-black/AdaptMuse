import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { getEntityContent } from "@/utils/Qloo";
import { Entity } from "@/types/entities";
import { Chip } from "./Chip";

type LoadingEntity = {
  name: string;
  id?: string;
  error?: string;
};

export const ChipInput = ({
  label,
  placeholder,
  setChipIds,
  type,
  icon,
  onRemoveChip,
}: {
  label: string;
  placeholder: string;
  setChipIds: (newEntity: Entity) => void;
  type: string;
  icon?: React.ReactNode;
  onRemoveChip: (removedEntity: Entity) => void;
}) => {
  const [text, setText] = useState<string>("");
  const [chips, setChips] = useState<Array<Entity | LoadingEntity>>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onAddChip = () => {
    if (text.trim()) {
      setChips([...chips, { name: text } as LoadingEntity]);
      setText("");
    }
  };

  const handleRemoveChip = (removedChip: Entity | LoadingEntity) => {
    const updatedChips = chips.filter((chip) => chip !== removedChip);
    setChips(updatedChips);
    if ("id" in removedChip && removedChip.id) {
      onRemoveChip(removedChip as Entity);
    }
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const chipName = text.trim();
      if (!chipName) return;

      onAddChip();
      console.log("calling getEntityContent with", chipName);
      const newEntity = await getEntityContent(chipName, type);
      console.log("newEntity", newEntity);

      if (newEntity) {
        // Replace the loading chip with the actual entity
        setChips((prev) => {
          const updatedChips = [...prev];
          const lastLoadingChipIndex = updatedChips.findIndex((chip) => {
            if ("id" in chip) return false;
            return chip.name === chipName && !chip.error;
          });
          if (lastLoadingChipIndex !== -1) {
            updatedChips[lastLoadingChipIndex] = newEntity;
          } else {
            updatedChips.push(newEntity);
          }
          return updatedChips;
        });
        // Set the chip ID for parent component
        setChipIds(newEntity);
      } else {
        // show error message on the chip
        setChips((prev) => {
          const updatedChips = [...prev];
          const lastLoadingChipIndex = updatedChips.findIndex((chip) => {
            if ("id" in chip) return false;
            return chip.name === chipName && !chip.error;
          });
          if (lastLoadingChipIndex !== -1) {
            const loadingChip = updatedChips[lastLoadingChipIndex];
            updatedChips[lastLoadingChipIndex] = {
              ...loadingChip,
              error: "Entity not found",
            };
          }
          return updatedChips;
        });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 border-1 border-gray-300 rounded-md">
        <div
          className="flex flex-row justify-between items-center mb-1 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-row items-center gap-1">
            {icon}
            <label className="block font-medium text-gray-700 text-sm cursor-pointer">
              {label}
            </label>
            <div className="bg-primary px-1.5 py-0.5 rounded-full min-w-[20px] text-white text-xs text-center">
              {chips.length}
            </div>
          </div>
          <div>
            <ChevronDownIcon
              className={`w-4 h-4 transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[1000px]" : "max-h-0"
          }`}
        >
          <div className="pt-2">
            <div className="relative flex justify-center items-center">
              <input
                type="text"
                placeholder={placeholder}
                value={text}
                onChange={onTextChange}
                onKeyDown={onKeyDown}
                className="bg-cell-background mr-[45px] px-4 py-2.5 border border-gray-300 focus:border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 w-full text-gray-900 text-base transition-all duration-200 placeholder-gray-400"
              />
              <div className="top-0 right-0 absolute flex justify-center items-center w-[40px] h-full">
                <button
                  className="flex justify-center items-center bg-primary hover:bg-primary/80 hover:shadow-[0_0_10px_rgba(var(--primary),0.3)] rounded-md w-full h-full transition-all duration-200 cursor-pointer"
                  onClick={onAddChip}
                >
                  <PlusIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-wrap gap-2 mt-2 px-2 pt-2 pb-1 w-full">
              {chips
                .slice()
                .reverse()
                .map((chip, idx) => (
                  <div key={idx}>
                    <Chip
                      chip={chip}
                      onRemove={() => handleRemoveChip(chip)}
                      idx={idx}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
