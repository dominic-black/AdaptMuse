import { ChevronDownIcon, MapPin, PlusIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Spinner } from "./Spinner";
import { getEntityContent } from "@/utils/Qloo";
import { Entity } from "@/types/entity";

type LoadingEntity = {
  name: string;
  id?: string;
};

export const ChipInput = ({
  label,
  placeholder,
  setChipIds,
  type,
  icon,
}: {
  label: string;
  placeholder: string;
  setChipIds: (newEntity: Entity) => void;
  type: string;
  icon?: React.ReactNode;
}) => {
  const [text, setText] = useState<string>("");
  const [chips, setChips] = useState<Array<Entity | LoadingEntity>>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onAddChip = () => {
    if (text.trim()) {
      setChips([...chips, { name: text } as LoadingEntity]);
      setText("");
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

      if (newEntity) {
        // Replace the loading chip with the actual entity
        setChips([...chips, newEntity]);
        // Set the chip ID for parent component
        setChipIds(newEntity);
      }
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const isEntity = (chip: Entity | LoadingEntity): chip is Entity => {
    return "type" in chip;
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
            <div className="flex flex-col flex-wrap gap-2 mt-2 w-full">
              {chips.map((chip, idx) => (
                <div key={idx} className="flex flex-row gap-2">
                  <div className="bg-cell-background px-4 py-2.5 border border-gray-300 rounded-md w-full">
                    {!isEntity(chip) ? (
                      <div>
                        <div className="flex flex-row gap-2">
                          <div className="flex justify-center items-center bg-gray-200 rounded-md w-[50px] h-[50px] overflow-hidden">
                            <Spinner size="sm" />
                          </div>
                          <div className="flex flex-col justify-center items-start">
                            <p>{chip.name}</p>
                            <p className="text-gray-500 text-sm">loading...</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-row gap-2">
                          <div className="relative bg-gray-200 rounded-md min-w-[50px] h-[50px] overflow-hidden">
                            {chip.imageUrl === "location-img" ? (
                              <div className="flex justify-center items-center w-full h-full">
                                <MapPin className="w-4 h-4 text-gray-500" />
                              </div>
                            ) : (
                              <Image
                                src={chip.imageUrl}
                                alt={chip.name}
                                fill
                                className={`object-cover transition-opacity duration-500 ease-in-out ${
                                  loadedImages.has(idx)
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                                onLoad={() => handleImageLoad(idx)}
                              />
                            )}
                          </div>
                          <div className="flex flex-col justify-center items-start">
                            <p className="text-sm">{chip.name}</p>
                            <p className="text-gray-500 text-xs">
                              {chip.subText || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
