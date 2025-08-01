"use client";

import React from "react";
import { Users } from "lucide-react";
import { Screen } from "@/components/shared/Screen/Screen";
import { AudiencePageSkeleton } from "@/components/shared/LoadingSkeleton/AudiencePageSkeleton";
import { useAudienceData, useAudienceMetrics } from "@/features/audience/hooks";
import {
  AnalyticsHeader,
  MetricsSection,
  DemographicsSection,
  PreferencesSection,
  EntitiesSection,
} from "@/features/audience/components/sections";
import { TasteProfileAnalytics } from "@/features/audience/components/Analytics/TasteProfileAnalytics";
import { QualityMetricsAnalytics } from "@/features/audience/components/Analytics/QualityMetricsAnalytics";
import { AudienceErrorBoundary } from "@/features/audience/components/ErrorBoundary";

const AudienceNotFound = () => (
  <Screen heading="Audience Not Found">
    <div className="flex flex-col justify-center items-center py-16">
      <div className="bg-gray-100 mb-4 p-4 rounded-full w-16 h-16">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="mb-2 font-semibold text-gray-900 text-lg">
        Audience Not Found
      </h3>
      <p className="max-w-md text-gray-600 text-center">
        The audience you&apos;re looking for doesn&apos;t exist or you
        don&apos;t have permission to view it.
      </p>
    </div>
  </Screen>
);

const OverviewTab: React.FC<{
  audience: NonNullable<ReturnType<typeof useAudienceData>["audience"]>;
  metrics: ReturnType<typeof useAudienceMetrics>;
  isEnhanced: boolean;
}> = ({ audience, metrics, isEnhanced }) => (
  <>
    {/* Key Metrics */}
    <MetricsSection
      metrics={metrics}
      isEnhanced={isEnhanced}
      qlooIntelligence={audience.qlooIntelligence}
    />

    {/* Demographics Charts */}
    <DemographicsSection
      ageTotals={audience.ageTotals}
      genderTotals={audience.genderTotals}
    />

    {/* Audience Preferences */}
    <PreferencesSection
      categorizedSelections={audience.categorizedSelections}
    />

    {/* Entities Sections */}
    <EntitiesSection
      entities={audience.entities}
      recommendedEntities={audience.recommendedEntities}
      isEnhanced={isEnhanced}
    />
  </>
);

const AdvancedAnalyticsTab: React.FC<{
  audience: NonNullable<ReturnType<typeof useAudienceData>["audience"]>;
}> = ({ audience }) => {
  const { qlooIntelligence } = audience;
  console.log("Qloo Intelligence = ", qlooIntelligence);
  if (!qlooIntelligence) return null;

  return (
    <div className="space-y-8">
      {/* Taste Profile Analysis */}
      {qlooIntelligence.tasteProfile && (
        <TasteProfileAnalytics tasteProfile={qlooIntelligence.tasteProfile} />
      )}

      {/* Analytics Quality Metrics */}
      {qlooIntelligence.analysisMetrics && (
        <QualityMetricsAnalytics
          analysisMetrics={qlooIntelligence.analysisMetrics}
        />
      )}
    </div>
  );
};

const AudiencePageContent = () => {
  const { audience, loading, error, activeTab, setActiveTab, isEnhanced } =
    useAudienceData();
  const metrics = useAudienceMetrics(audience);

  // Loading state
  if (loading) {
    return <AudiencePageSkeleton />;
  }

  // Error state
  if (error || !audience) {
    return <AudienceNotFound />;
  }

  return (
    <Screen heading={audience.name}>
      <div className="space-y-8">
        {/* Enhanced Analytics Header */}
        {isEnhanced && (
          <AnalyticsHeader
            analysisMetrics={audience.qlooIntelligence?.analysisMetrics}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab
            audience={audience}
            metrics={metrics}
            isEnhanced={isEnhanced}
          />
        )}

        {activeTab === "analytics" && isEnhanced && (
          <AdvancedAnalyticsTab audience={audience} />
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </Screen>
  );
};

export default function AudiencePage() {
  return (
    <AudienceErrorBoundary fallbackTitle="Audience Details">
      <AudiencePageContent />
    </AudienceErrorBoundary>
  );
}
