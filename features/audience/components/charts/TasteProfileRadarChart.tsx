import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TasteVectorData } from "../../types/audience-metrics.types";

interface TasteProfileRadarChartProps {
  tasteVector: Record<string, number>;
}

export const TasteProfileRadarChart: React.FC<TasteProfileRadarChartProps> = ({
  tasteVector,
}) => {
  const chartData: TasteVectorData[] = Object.entries(tasteVector).map(
    ([key, value]) => ({
      category: key.replace("_", " ").toUpperCase(),
      score: value * 100,
    })
  );

  return (
    <div className="pb-10 w-full h-80">
      <h4 className="mb-4 font-semibold text-gray-900">
        Cultural Preference Analysis
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} />
          <Radar
            name="Taste Profile"
            dataKey="score"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.3}
          />
          <Tooltip formatter={(value) => [`${value}%`, "Affinity Score"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
