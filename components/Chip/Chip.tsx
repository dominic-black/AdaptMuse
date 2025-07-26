"use client";

import Image from "next/image";
import { MapPin, X } from "lucide-react";
import { Entity } from "@/types/entity";
import { Spinner } from "@/components/Spinner";
import { useState } from "react";

type LoadingEntity = {
  name: string;
  id?: string;
};

export const Chip = ({
  chip,
  onRemove,
  idx,
}: {
  chip: Entity | LoadingEntity;
  onRemove: () => void;
  idx: number;
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isHovered, setIsHovered] = useState(false);

  const isEntity = (chip: Entity | LoadingEntity): chip is Entity => {
    return "type" in chip;
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  return (
    <div
      className="relative flex flex-row gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <button
          className="group -top-2 -right-2 z-10 absolute flex justify-center items-center bg-gray-100 hover:bg-red-50 shadow-sm hover:shadow-md border border-gray-200 hover:border-red-200 rounded-full w-6 h-6 transition-all duration-200 ease-in-out cursor-pointer"
          onClick={onRemove}
          aria-label="Remove item"
        >
          <X className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
        </button>
      )}
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
                      loadedImages.has(idx) ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad(idx)}
                  />
                )}
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="text-sm">{chip.name}</p>
                <p className="text-gray-500 text-xs">{chip.subText || ""}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
