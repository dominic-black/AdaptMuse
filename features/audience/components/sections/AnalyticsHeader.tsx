import React from "react";
import { Brain, Eye } from "lucide-react";
import {
  AnalyticsTab,
  QlooAnalysisMetrics,
} from "../../types/audience-analytics.types";

interface AnalyticsHeaderProps {
  analysisMetrics?: QlooAnalysisMetrics;
  activeTab: AnalyticsTab;
  onTabChange: (tab: AnalyticsTab) => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  analysisMetrics,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border border-blue-200 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="font-bold text-gray-900 text-xl">
              Advanced Audience Analytics
            </h2>
            <p className="text-gray-700">
              Comprehensive insights powered by{" "}
              {analysisMetrics?.qlooFeaturesUsed?.length || 0} advanced
              analytics features
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="bg-green-100 px-3 py-1 rounded-full font-medium text-green-700 text-sm">
            {analysisMetrics?.processingTimeMs}ms
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white p-1 border rounded-lg">
        <button
          onClick={() => onTabChange("overview")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "overview"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Eye className="inline mr-1 w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => onTabChange("analytics")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "analytics"
              ? "bg-purple-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Brain className="inline mr-1 w-4 h-4" />
          Advanced Analytics
        </button>
      </div>
    </div>
  );
};
