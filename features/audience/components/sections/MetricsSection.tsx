import React from "react";
import { Target, Sparkles, Eye } from "lucide-react";
import { AudienceMetrics } from "../../types/audience-metrics.types";
import { QlooIntelligence } from "../../types/audience-analytics.types";

interface MetricsSectionProps {
  metrics: AudienceMetrics | null;
  isEnhanced: boolean;
  qlooIntelligence?: QlooIntelligence;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({
  metrics,
  isEnhanced,
  qlooIntelligence,
}) => {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
      {/* Target Demographics */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 border border-blue-200/50 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="bg-blue-100 px-2 py-1 rounded-full font-medium text-blue-700 text-xs">
            PRIMARY
          </span>
        </div>
        <h3 className="mb-1 font-medium text-blue-900 text-sm">
          Target Demographics
        </h3>
        <p className="font-bold text-blue-900 text-2xl">
          {metrics?.primaryAgeGroup}
        </p>
        <p className="text-blue-700 text-sm">
          {metrics?.genderDistribution} audience
        </p>
      </div>

      {/* Cultural Affinity / Diversity Score */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 border border-emerald-200/50 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="bg-emerald-100 px-2 py-1 rounded-full font-medium text-emerald-700 text-xs">
            {isEnhanced ? "AI INSIGHTS" : "INSIGHTS"}
          </span>
        </div>
        <h3 className="mb-1 font-medium text-emerald-900 text-sm">
          {isEnhanced ? "Cultural Affinity" : "Diversity Score"}
        </h3>
        <p className="font-bold text-emerald-900 text-2xl">
          {isEnhanced
            ? `${(
                (qlooIntelligence?.tasteProfile?.affinityScore || 0) * 100
              ).toFixed(0)}%`
            : `${metrics?.diversityScore}%`}
        </p>
        <p className="text-emerald-700 text-sm">
          {isEnhanced
            ? qlooIntelligence?.tasteProfile?.interpretation ||
              "Cultural profile"
            : metrics?.diversityScore && metrics.diversityScore > 75
            ? "High diversity"
            : metrics?.diversityScore && metrics.diversityScore > 50
            ? "Moderate diversity"
            : "Focused audience"}
        </p>
      </div>

      {/* Total Insights */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 border border-purple-200/50 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-purple-500 p-2 rounded-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="bg-purple-100 px-2 py-1 rounded-full font-medium text-purple-700 text-xs">
            INSIGHTS
          </span>
        </div>
        <h3 className="mb-1 font-medium text-purple-900 text-sm">
          Total Insights
        </h3>
        <p className="font-bold text-purple-900 text-2xl">
          {(metrics?.totalEntities || 0) + (metrics?.totalRecommendations || 0)}
        </p>
        <p className="text-purple-700 text-sm">
          {isEnhanced
            ? `Quality Score: ${(
                (qlooIntelligence?.analysisMetrics?.dataQualityScore || 0) * 100
              ).toFixed(0)}%`
            : `${metrics?.totalRecommendations} AI Recommendations`}
        </p>
      </div>
    </div>
  );
};
