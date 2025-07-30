import { useState, useMemo } from "react";
import { AUDIENCE_OPTIONS } from "@/constants/audiences";
import { genres } from "@/constants/tags";

export interface UseAudienceFiltersReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredAudienceOptions: Record<
    string,
    (typeof AUDIENCE_OPTIONS)[keyof typeof AUDIENCE_OPTIONS]
  >;
  filteredGenres: typeof genres;
}

export const useAudienceFilters = (): UseAudienceFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredAudienceOptions = useMemo(() => {
    return Object.entries(AUDIENCE_OPTIONS).reduce(
      (acc, [category, options]) => {
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        if (filteredOptions.length > 0) {
          acc[category] = filteredOptions;
        }
        return acc;
      },
      {} as Record<
        string,
        (typeof AUDIENCE_OPTIONS)[keyof typeof AUDIENCE_OPTIONS]
      >
    );
  }, [searchTerm]);

  const filteredGenres = useMemo(() => {
    return genres.filter((genre) =>
      genre.label.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredAudienceOptions,
    filteredGenres,
  };
};
