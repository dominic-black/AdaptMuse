import { EntityType } from "@/types/audience";
import {
  Clapperboard,
  PersonStanding,
  Mic2,
  BookOpen,
  ShoppingBag,
  Tv,
  Gamepad2,
  House,
  Podcast,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface EntityConfig {
  icon: LucideIcon;
  colorClass: string;
}

const ENTITY_CONFIG: Record<EntityType, EntityConfig> = {
  MOVIE: {
    icon: Clapperboard,
    colorClass: "bg-blue-100 text-blue-800",
  },
  PERSON: {
    icon: PersonStanding,
    colorClass: "bg-green-100 text-green-800",
  },
  ARTIST: {
    icon: Mic2,
    colorClass: "bg-purple-100 text-purple-800",
  },
  BOOK: {
    icon: BookOpen,
    colorClass: "bg-yellow-100 text-yellow-800",
  },
  BRAND: {
    icon: ShoppingBag,
    colorClass: "bg-red-100 text-red-800",
  },
  PLACE: {
    icon: House,
    colorClass: "bg-orange-100 text-orange-800",
  },
  TV_SHOW: {
    icon: Tv,
    colorClass: "bg-pink-100 text-pink-800",
  },
  VIDEO_GAME: {
    icon: Gamepad2,
    colorClass: "bg-teal-100 text-teal-800",
  },
};

const DEFAULT_CONFIG: EntityConfig = {
  icon: Podcast,
  colorClass: "bg-gray-100 text-gray-800",
};

interface EntityTagProps {
  type: EntityType;
}

const formatDisplayText = (type: EntityType): string => {
  return type.split("_").join(" ");
};

export const EntityTag = ({ type }: EntityTagProps) => {
  const config = ENTITY_CONFIG[type] || DEFAULT_CONFIG;
  const IconComponent = config.icon;

  const className = `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.colorClass}`;

  return (
    <div className={className}>
      <IconComponent className="w-4 h-4" />
      <span>{formatDisplayText(type)}</span>
    </div>
  );
};
