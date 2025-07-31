import React from "react";
import { Brain } from "lucide-react";
import { Cell as UICell } from "@/components/ui/Cell/Cell";
import { TasteProfileRadarChart } from "../charts";
import { QlooTasteProfile } from "../../types/audience-analytics.types";

interface TasteProfileAnalysisProps {
  tasteProfile: QlooTasteProfile;
}

export const TasteProfileAnalysis: React.FC<TasteProfileAnalysisProps> = ({
  tasteProfile,
}) => {
  return (
    <UICell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-xl">
            Taste Profile Analysis
          </h3>
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="mb-2 font-semibold text-purple-900">
                Cultural Affinity Score
              </h4>
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-full w-full h-3">
                  <div
                    className="bg-purple-500 rounded-full h-3 transition-all duration-300"
                    style={{
                      width: `${tasteProfile.affinityScore * 100}%`,
                    }}
                  />
                </div>
                <span className="font-bold text-purple-900">
                  {(tasteProfile.affinityScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="mb-2 font-semibold text-green-900">
                Diversity Index
              </h4>
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-full w-full h-3">
                  <div
                    className="bg-green-500 rounded-full h-3 transition-all duration-300"
                    style={{
                      width: `${tasteProfile.diversityIndex * 100}%`,
                    }}
                  />
                </div>
                <span className="font-bold text-green-900">
                  {(tasteProfile.diversityIndex * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="mb-2 font-semibold text-blue-900">
                Profile Interpretation
              </h4>
              <p className="text-blue-800">{tasteProfile.interpretation}</p>
            </div>

            {tasteProfile.culturalSegments?.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="mb-2 font-semibold text-yellow-900">
                  Cultural Segments
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tasteProfile.culturalSegments
                    .slice(0, 5)
                    .map((segment, index) => (
                      <span
                        key={index}
                        className="bg-yellow-200 px-2 py-1 rounded-full text-yellow-800 text-sm"
                      >
                        {segment}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Taste Vector Visualization */}
        {tasteProfile.tasteVector && (
          <TasteProfileRadarChart tasteVector={tasteProfile.tasteVector} />
        )}
      </div>
    </UICell>
  );
};
