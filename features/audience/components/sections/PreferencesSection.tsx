import React from "react";
import { Star } from "lucide-react";
import { Cell as UICell } from "@/components/ui/Cell/Cell";
import { formatCategoryLabel } from "@/utils/audience";
import { Audience } from "@/types/audience";

interface PreferencesSectionProps {
  categorizedSelections: Audience["categorizedSelections"];
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  categorizedSelections,
}) => {
  if (!categorizedSelections) return null;

  return (
    <UICell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Audience Preferences
              </h3>
              <p className="text-gray-600 text-sm">
                Selected interests and demographics
              </p>
            </div>
          </div>
        </div>

        <div className="pr-2 max-h-96 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {/* Genres Section */}
            {categorizedSelections.genres &&
              categorizedSelections.genres.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-gray-100 border-b">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <div className="bg-purple-500 rounded w-3 h-3"></div>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-base">
                      Content Genres
                    </h4>
                    <span className="bg-purple-100 px-2 py-1 rounded-full font-medium text-purple-700 text-xs">
                      {categorizedSelections.genres.length}
                    </span>
                  </div>
                  <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {categorizedSelections.genres.map((genre) => (
                      <div
                        key={genre.value}
                        className="group bg-purple-50 hover:bg-purple-100 p-3 border border-purple-200 rounded-lg transition-all duration-200"
                      >
                        <span className="font-medium text-purple-800 group-hover:text-purple-900 text-sm">
                          {genre.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Audience Options by Category */}
            {categorizedSelections.audienceOptions &&
              Object.keys(categorizedSelections.audienceOptions).length > 0 && (
                <div className="space-y-6">
                  {Object.entries(categorizedSelections.audienceOptions).map(
                    ([category, options]) => (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-gray-100 border-b">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <div className="bg-blue-500 rounded w-3 h-3"></div>
                          </div>
                          <h4 className="font-semibold text-gray-800 text-base">
                            {formatCategoryLabel(category)}
                          </h4>
                          <span className="bg-blue-100 px-2 py-1 rounded-full font-medium text-blue-700 text-xs">
                            {options.length}
                          </span>
                        </div>
                        <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                          {options.map((option) => (
                            <div
                              key={option.value}
                              className="group bg-blue-50 hover:bg-blue-100 p-3 border border-blue-200 rounded-lg transition-all duration-200"
                            >
                              <span className="font-medium text-blue-800 group-hover:text-blue-900 text-sm">
                                {option.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </UICell>
  );
};
