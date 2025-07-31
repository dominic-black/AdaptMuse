"use client";

import { AudiencePageSkeleton } from "@/components/shared/LoadingSkeleton/AudiencePageSkeleton";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Screen } from "@/components/shared/Screen/Screen";
import { db } from "@/firebase/firebase-config";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Cell as UICell } from "@/components/ui/Cell/Cell";
import { Audience } from "@/types/audience";
import { EntityCard } from "@/features/audience/components/EntityCard/EntityCard";
import { Entity } from "@/types/entities";
import { formatAgeGroupLabel, formatCategoryLabel } from "@/utils/audience";
import {
  Users,
  Target,
  TrendingUp,
  Sparkles,
  BarChart3,
  Eye,
  Star,
  Brain,
  Zap,
  Award,
  Activity,
  Map,
} from "lucide-react";

interface AudienceMetrics {
  totalEntities: number;
  totalRecommendations: number;
  diversityScore: number;
  primaryAgeGroup: string;
  genderDistribution: string;
}

interface EnhancedAudience extends Audience {
  qlooIntelligence?: {
    tasteProfile?: {
      affinityScore: number;
      diversityIndex: number;
      interpretation: string;
      culturalSegments: string[];
      tasteVector: Record<string, number>;
    };
    trendingAnalysis?: {
      byCategory: Record<
        string,
        {
          entities: unknown[];
          count: number;
          avgPopularity: number;
        }
      >;
      mostTrendingCategory: string;
      userAlignmentScore: number;
      trendingRecommendations: string[];
    };
    demographicIntelligence?: {
      demographicConfidence: number;
      culturalCorrelations: unknown[];
    };
    culturalProfile?: {
      culturalDiversityScore: number;
      crossCulturalInsights: {
        globalRelevance: number;
        culturalBridges: unknown[];
        regionalVariations: Record<string, number>;
        universalThemes: unknown[];
      };
    };
    analysisMetrics?: {
      dataQualityScore: number;
      culturalCoverageScore: number;
      processingTimeMs: number;
      qlooFeaturesUsed: string[];
    };
  };
}

export default function AudiencePage() {
  const { audienceId } = useParams();
  const { user } = useAuth();
  const [audience, setAudience] = useState<EnhancedAudience | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AudienceMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">(
    "overview"
  );
  useEffect(() => {
    console.log(audience);
  }, [audience]);

  useEffect(() => {
    if (user && audienceId) {
      const getAudience = async () => {
        try {
          const docRef = doc(
            db,
            "users",
            user.uid,
            "audiences",
            audienceId as string
          );
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const audienceData = {
              id: docSnap.id,
              ...docSnap.data(),
            } as EnhancedAudience;
            setAudience(audienceData);

            // Calculate metrics
            const totalEntities = audienceData.entities.length;
            const totalRecommendations =
              audienceData.recommendedEntities.length;
            const diversityScore = Math.min(
              100,
              Math.round((totalEntities + totalRecommendations) * 2.5)
            );

            // Get primary age group
            const primaryAge = Object.entries(
              audienceData.ageTotals || {}
            ).sort(([, a], [, b]) => b - a)[0];
            const primaryAgeGroup = primaryAge
              ? formatAgeGroupLabel(primaryAge[0])
              : "Mixed";

            // Get gender distribution (handling raw affinity scores)
            const { male = 0, female = 0 } = audienceData.genderTotals || {};
            const absoluteTotal = Math.abs(male) + Math.abs(female);
            let genderDistribution = "Mixed";
            if (absoluteTotal > 0) {
              const malePercent = (Math.abs(male) / absoluteTotal) * 100;
              if (malePercent > 65) genderDistribution = "Male-leaning";
              else if (malePercent < 35) genderDistribution = "Female-leaning";
            }

            setMetrics({
              totalEntities,
              totalRecommendations,
              diversityScore,
              primaryAgeGroup,
              genderDistribution,
            });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        } finally {
          setLoading(false);
        }
      };

      getAudience();
    }
  }, [user, audienceId]);

  if (loading) {
    return <AudiencePageSkeleton />;
  }

  if (!audience) {
    return (
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
  }

  const isEnhanced = Boolean(audience.qlooIntelligence);

  return (
    <Screen heading={audience.name}>
      <div className="space-y-8">
        {/* Enhanced Analytics Header */}
        {isEnhanced && (
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
                    {audience.qlooIntelligence?.analysisMetrics
                      ?.qlooFeaturesUsed?.length || 0}{" "}
                    advanced analytics features
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="bg-green-100 px-3 py-1 rounded-full font-medium text-green-700 text-sm">
                  {audience.qlooIntelligence?.analysisMetrics?.processingTimeMs}
                  ms
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-white p-1 border rounded-lg">
              <button
                onClick={() => setActiveTab("overview")}
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
                onClick={() => setActiveTab("analytics")}
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
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Key Metrics */}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
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
                        (audience.qlooIntelligence?.tasteProfile
                          ?.affinityScore || 0) * 100
                      ).toFixed(0)}%`
                    : `${metrics?.diversityScore}%`}
                </p>
                <p className="text-emerald-700 text-sm">
                  {isEnhanced
                    ? audience.qlooIntelligence?.tasteProfile?.interpretation ||
                      "Cultural profile"
                    : metrics?.diversityScore && metrics.diversityScore > 75
                    ? "High diversity"
                    : metrics?.diversityScore && metrics.diversityScore > 50
                    ? "Moderate diversity"
                    : "Focused audience"}
                </p>
              </div>

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
                  {(metrics?.totalEntities || 0) +
                    (metrics?.totalRecommendations || 0)}
                </p>
                <p className="text-purple-700 text-sm">
                  {isEnhanced
                    ? `Quality Score: ${(
                        (audience.qlooIntelligence?.analysisMetrics
                          ?.dataQualityScore || 0) * 100
                      ).toFixed(0)}%`
                    : `${metrics?.totalRecommendations} AI Recommendations`}
                </p>
              </div>
            </div>

            {/* Demographics Charts */}
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
              {/* Age Distribution */}
              <UICell>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Age Distribution
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Demographic breakdown by age groups
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={Object.entries(audience.ageTotals)
                          .sort(([a], [b]) => {
                            const getStartingAge = (ageRange: string) => {
                              const match = ageRange.match(/(\d+)/);
                              return match ? parseInt(match[1], 10) : 0;
                            };
                            return getStartingAge(a) - getStartingAge(b);
                          })
                          .map(([key, value]) => ({
                            name: formatAgeGroupLabel(key),
                            value,
                            percentage: (
                              (value /
                                Object.values(audience.ageTotals).reduce(
                                  (a, b) => a + b,
                                  0
                                )) *
                              100
                            ).toFixed(1),
                          }))}
                        margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis
                          type="number"
                          domain={[0, "dataMax"]}
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={{ stroke: "#e2e8f0" }}
                          tickLine={{ stroke: "#e2e8f0" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={80}
                          tick={{ fontSize: 12, fill: "#475569" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                            fontSize: "14px",
                          }}
                          formatter={(value, name, props) => [
                            `${value} (${props.payload.percentage}%)`,
                            "Affinity Score",
                          ]}
                          labelStyle={{ color: "#374151", fontWeight: "600" }}
                        />
                        <Bar
                          dataKey="value"
                          fill="url(#blueGradient)"
                          radius={[0, 6, 6, 0]}
                        />
                        <defs>
                          <linearGradient
                            id="blueGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </UICell>

              {/* Gender Distribution */}
              <UICell>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Gender Distribution
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Audience composition by gender
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {(() => {
                        // Create diverging bar chart data showing raw affinity scores
                        const rawScores = audience.genderTotals || {
                          male: 0,
                          female: 0,
                        };

                        // Prepare data for diverging bar chart
                        const chartData = Object.entries(rawScores).map(
                          ([key, value]: [string, number]) => {
                            const safeValue = value ?? 0;
                            return {
                              name: key.charAt(0).toUpperCase() + key.slice(1),
                              value: safeValue,
                              fill:
                                key === "male"
                                  ? "url(#maleGradient)"
                                  : "url(#femaleGradient)",
                              isPositive: safeValue > 0,
                            };
                          }
                        );

                        // Find the max absolute value for proper scaling
                        const maxAbsValue = Math.max(
                          ...chartData.map((d) => Math.abs(d.value)),
                          1 // minimum scale
                        );

                        return (
                          <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 80,
                              bottom: 20,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f1f5f9"
                              horizontal={true}
                              vertical={false}
                            />
                            <XAxis
                              type="number"
                              domain={[-maxAbsValue * 1.1, maxAbsValue * 1.1]}
                              tick={{ fontSize: 12, fill: "#64748b" }}
                              axisLine={{ stroke: "#e2e8f0" }}
                              tickLine={{ stroke: "#e2e8f0" }}
                              tickFormatter={(value) => value.toFixed(1)}
                            />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={70}
                              tick={{ fontSize: 12, fill: "#475569" }}
                              axisLine={false}
                              tickLine={false}
                            />

                            {/* Beautiful gradients matching page design */}
                            <defs>
                              <linearGradient
                                id="maleGradient"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                              >
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#1d4ed8" />
                              </linearGradient>
                              <linearGradient
                                id="femaleGradient"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                              >
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#be185d" />
                              </linearGradient>
                            </defs>

                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                boxShadow:
                                  "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                                fontSize: "14px",
                              }}
                              formatter={(value, name, props) => {
                                const affinity = props.payload.value;
                                const gender = props.payload.name;
                                const interpretation =
                                  affinity > 1
                                    ? "Strong Appeal"
                                    : affinity > 0
                                    ? "Moderate Appeal"
                                    : affinity > -1
                                    ? "Low Appeal"
                                    : "Very Low Appeal";
                                return [
                                  `${
                                    typeof value === "number"
                                      ? value.toFixed(3)
                                      : value
                                  }`,
                                  `${gender} ${interpretation}`,
                                ];
                              }}
                              labelStyle={{
                                color: "#374151",
                                fontWeight: "600",
                              }}
                            />

                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        );
                      })()}
                    </ResponsiveContainer>
                  </div>
                </div>
              </UICell>
            </div>

            {/* Audience Selections */}
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
                    {audience.categorizedSelections?.genres &&
                      audience.categorizedSelections.genres.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 pb-2 border-gray-100 border-b">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <div className="bg-purple-500 rounded w-3 h-3"></div>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-base">
                              Content Genres
                            </h4>
                            <span className="bg-purple-100 px-2 py-1 rounded-full font-medium text-purple-700 text-xs">
                              {audience.categorizedSelections.genres.length}
                            </span>
                          </div>
                          <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {audience.categorizedSelections.genres.map(
                              (genre) => (
                                <div
                                  key={genre.value}
                                  className="group bg-purple-50 hover:bg-purple-100 p-3 border border-purple-200 rounded-lg transition-all duration-200"
                                >
                                  <span className="font-medium text-purple-800 group-hover:text-purple-900 text-sm">
                                    {genre.label}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Audience Options by Category */}
                    {audience.categorizedSelections?.audienceOptions &&
                      Object.keys(
                        audience.categorizedSelections.audienceOptions
                      ).length > 0 && (
                        <div className="space-y-6">
                          {Object.entries(
                            audience.categorizedSelections.audienceOptions
                          ).map(([category, options]) => (
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
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </UICell>

            {/* Entities Sections */}
            <div className="space-y-8">
              {/* Input Entities */}
              <UICell>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Selected Interests
                        </h3>
                        <p className="text-gray-600 text-sm">
                          User-defined interests and preferences
                        </p>
                      </div>
                    </div>
                    <span className="bg-green-100 px-3 py-1 rounded-full font-medium text-green-700 text-sm">
                      {audience.entities.length}
                    </span>
                  </div>

                  <div className="gap-4 grid grid-cols-3">
                    {audience.entities.map((entity: Entity, index: number) => (
                      <EntityCard
                        key={`input-${entity.id}-${index}`}
                        entity={entity}
                      />
                    ))}
                  </div>
                </div>
              </UICell>

              {/* Recommended Entities */}
              <UICell>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          AI Recommendations
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {isEnhanced
                            ? "Intelligent recommendations based on cultural insights"
                            : "Algorithmically generated insights"}
                        </p>
                      </div>
                    </div>
                    <span className="bg-amber-100 px-3 py-1 rounded-full font-medium text-amber-700 text-sm">
                      {audience.recommendedEntities.length}
                    </span>
                  </div>

                  <div className="gap-4 grid grid-cols-3">
                    {audience.recommendedEntities.map(
                      (entity: Entity, index: number) => (
                        <EntityCard
                          key={`recommended-${entity.id}-${index}`}
                          entity={entity}
                        />
                      )
                    )}
                  </div>
                </div>
              </UICell>
            </div>
          </>
        )}

        {/* Advanced Analytics Tab */}
        {activeTab === "analytics" &&
          isEnhanced &&
          audience.qlooIntelligence && (
            <div className="space-y-8">
              {/* Taste Profile Analysis */}
              {audience.qlooIntelligence.tasteProfile && (
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
                                  width: `${
                                    audience.qlooIntelligence.tasteProfile
                                      .affinityScore * 100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="font-bold text-purple-900">
                              {(
                                audience.qlooIntelligence.tasteProfile
                                  .affinityScore * 100
                              ).toFixed(0)}
                              %
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
                                  width: `${
                                    audience.qlooIntelligence.tasteProfile
                                      .diversityIndex * 100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="font-bold text-green-900">
                              {(
                                audience.qlooIntelligence.tasteProfile
                                  .diversityIndex * 100
                              ).toFixed(0)}
                              %
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="mb-2 font-semibold text-blue-900">
                            Profile Interpretation
                          </h4>
                          <p className="text-blue-800">
                            {
                              audience.qlooIntelligence.tasteProfile
                                .interpretation
                            }
                          </p>
                        </div>

                        {audience.qlooIntelligence.tasteProfile.culturalSegments
                          ?.length > 0 && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="mb-2 font-semibold text-yellow-900">
                              Cultural Segments
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {audience.qlooIntelligence.tasteProfile.culturalSegments
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
                    {audience.qlooIntelligence.tasteProfile.tasteVector && (
                      <div className="w-full h-80">
                        <h4 className="mb-4 font-semibold text-gray-900">
                          Cultural Preference Analysis
                        </h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart
                            data={Object.entries(
                              audience.qlooIntelligence.tasteProfile.tasteVector
                            ).map(([key, value]) => ({
                              category: key.replace("_", " ").toUpperCase(),
                              score: value * 100,
                            }))}
                          >
                            <PolarGrid />
                            <PolarAngleAxis
                              dataKey="category"
                              tick={{ fontSize: 12 }}
                            />
                            <PolarRadiusAxis domain={[0, 100]} />
                            <Radar
                              name="Taste Profile"
                              dataKey="score"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.3}
                            />
                            <Tooltip
                              formatter={(value) => [
                                `${value}%`,
                                "Affinity Score",
                              ]}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </UICell>
              )}

              {/* Analytics Quality Metrics */}
              {audience.qlooIntelligence.analysisMetrics && (
                <UICell>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-yellow-600" />
                      <h3 className="font-bold text-gray-900 text-xl">
                        Analysis Quality Metrics
                      </h3>
                    </div>

                    <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <Activity className="mx-auto mb-2 w-8 h-8 text-blue-600" />
                        <p className="font-bold text-blue-900 text-2xl">
                          {(
                            audience.qlooIntelligence.analysisMetrics
                              .dataQualityScore * 100
                          ).toFixed(0)}
                          %
                        </p>
                        <p className="text-blue-700 text-sm">Data Quality</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <Map className="mx-auto mb-2 w-8 h-8 text-green-600" />
                        <p className="font-bold text-green-900 text-2xl">
                          {(
                            audience.qlooIntelligence.analysisMetrics
                              .culturalCoverageScore * 100
                          ).toFixed(0)}
                          %
                        </p>
                        <p className="text-green-700 text-sm">
                          Cultural Coverage
                        </p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <Zap className="mx-auto mb-2 w-8 h-8 text-purple-600" />
                        <p className="font-bold text-purple-900 text-2xl">
                          {
                            audience.qlooIntelligence.analysisMetrics
                              .processingTimeMs
                          }
                          ms
                        </p>
                        <p className="text-purple-700 text-sm">
                          Processing Time
                        </p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <Star className="mx-auto mb-2 w-8 h-8 text-yellow-600" />
                        <p className="font-bold text-yellow-900 text-2xl">
                          {
                            audience.qlooIntelligence.analysisMetrics
                              .qlooFeaturesUsed.length
                          }
                        </p>
                        <p className="text-yellow-700 text-sm">
                          Analytics Features
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="mb-3 font-semibold text-gray-900">
                        Analytics Features Utilized
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {audience.qlooIntelligence.analysisMetrics.qlooFeaturesUsed.map(
                          (feature, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 px-3 py-1 rounded-full font-medium text-blue-800 text-sm"
                            >
                              ✓ {feature}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </UICell>
              )}
            </div>
          )}
      </div>

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
}
