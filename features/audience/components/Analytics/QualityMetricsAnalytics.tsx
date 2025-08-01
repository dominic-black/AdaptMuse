import React from "react";
import { Award, Activity, Map, Zap, Star } from "lucide-react";
import { Cell as UICell } from "@/components/ui/Cell/Cell";
import { QlooAnalysisMetrics } from "../../types/audience-analytics.types";
import { ExplainationToolTip } from "@/components/shared/ExplainationToolTip/ExplainationToolTip";

interface QualityMetricsProps {
  analysisMetrics: QlooAnalysisMetrics;
}

export const QualityMetricsAnalytics: React.FC<QualityMetricsProps> = ({
  analysisMetrics,
}) => {
  return (
    <UICell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-yellow-600" />
          <h3 className="font-bold text-gray-900 text-xl">
            Analysis Quality Metrics
          </h3>
        </div>

        <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
          <div className="relative bg-blue-50 p-4 rounded-lg text-center">
            <Activity className="mx-auto mb-2 w-8 h-8 text-blue-600" />
            <p className="font-bold text-blue-900 text-2xl">
              {(analysisMetrics.dataQualityScore * 100).toFixed(0)}%
            </p>
            <div className="flex justify-center items-center gap-1">
              <p className="text-blue-700 text-sm">Data Quality</p>
            </div>
            <div className="top-4 right-4 absolute">
              <ExplainationToolTip label="Data Quality Score" />
            </div>
          </div>

          <div className="relative bg-green-50 p-4 rounded-lg text-center">
            <Map className="mx-auto mb-2 w-8 h-8 text-green-600" />
            <p className="font-bold text-green-900 text-2xl">
              {(analysisMetrics.culturalCoverageScore * 100).toFixed(0)}%
            </p>
            <div className="flex justify-center items-center gap-1">
              <p className="text-green-700 text-sm">Cultural Coverage</p>
            </div>
            <div className="top-4 right-4 absolute">
              <ExplainationToolTip label="Cultural Coverage Score" />
            </div>
          </div>

          <div className="relative bg-purple-50 p-4 rounded-lg text-center">
            <Zap className="mx-auto mb-2 w-8 h-8 text-purple-600" />
            <p className="font-bold text-purple-900 text-2xl">
              {analysisMetrics.processingTimeMs}ms
            </p>
            <div className="flex justify-center items-center gap-1">
              <p className="text-purple-700 text-sm">Processing Time</p>
            </div>
            <div className="top-4 right-4 absolute">
              <ExplainationToolTip label="Processing Time" />
            </div>
          </div>

          <div className="relative bg-yellow-50 p-4 rounded-lg text-center">
            <Star className="mx-auto mb-2 w-8 h-8 text-yellow-600" />
            <p className="font-bold text-yellow-900 text-2xl">
              {analysisMetrics.qlooFeaturesUsed.length}
            </p>
            <div className="flex justify-center items-center gap-1">
              <p className="text-yellow-700 text-sm">Analytics Features</p>
            </div>
            <div className="top-4 right-4 absolute">
              <ExplainationToolTip label="Analytics Features" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="font-semibold text-gray-900">
              Analytics Features Utilized
            </h4>
            <ExplainationToolTip label="Qloo Features Used" />
          </div>
          <div className="flex flex-wrap gap-2">
            {analysisMetrics.qlooFeaturesUsed.map((feature, index) => (
              <span
                key={index}
                className="bg-blue-100 px-3 py-1 rounded-full font-medium text-blue-800 text-sm"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </UICell>
  );
};
