"use client";

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
} from "recharts";
import { Cell } from "@/components/ui/Cell/Cell";
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
} from "lucide-react";

interface AudienceMetrics {
  totalEntities: number;
  totalRecommendations: number;
  diversityScore: number;
  primaryAgeGroup: string;
  genderDistribution: string;
}

export default function AudiencePage() {
  const { audienceId } = useParams();
  const { user } = useAuth();
  const [audience, setAudience] = useState<Audience | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AudienceMetrics | null>(null);

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
            } as Audience;
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

            // Get gender distribution
            const { male = 0, female = 0 } = audienceData.genderTotals || {};
            const total = male + female;
            let genderDistribution = "Mixed";
            if (total > 0) {
              const malePercent = (male / total) * 100;
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
    return (
      <Screen heading="Loading...">
        <div className="space-y-8">
          {/* Metrics Overview Skeleton */}
          <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
            {/* Primary Metrics Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 border border-blue-200/50 rounded-xl animate-pulse">
              <div className="flex justify-between items-center mb-3">
                <div className="bg-blue-300 p-2 rounded-lg w-9 h-9"></div>
                <div className="bg-blue-200 rounded-full w-16 h-5"></div>
              </div>
              <div className="bg-blue-200 mb-1 rounded w-32 h-4"></div>
              <div className="bg-blue-300 mb-2 rounded w-20 h-8"></div>
              <div className="bg-blue-200 rounded w-28 h-4"></div>
            </div>

            {/* Diversity Score Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 border border-emerald-200/50 rounded-xl animate-pulse">
              <div className="flex justify-between items-center mb-3">
                <div className="bg-emerald-300 p-2 rounded-lg w-9 h-9"></div>
                <div className="bg-emerald-200 rounded-full w-16 h-5"></div>
              </div>
              <div className="bg-emerald-200 mb-1 rounded w-28 h-4"></div>
              <div className="bg-emerald-300 mb-2 rounded w-16 h-8"></div>
              <div className="bg-emerald-200 rounded w-32 h-4"></div>
            </div>

            {/* Total Insights Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 border border-purple-200/50 rounded-xl animate-pulse">
              <div className="flex justify-between items-center mb-3">
                <div className="bg-purple-300 p-2 rounded-lg w-9 h-9"></div>
                <div className="bg-purple-200 rounded-full w-20 h-5"></div>
              </div>
              <div className="bg-purple-200 mb-1 rounded w-24 h-4"></div>
              <div className="bg-purple-300 mb-2 rounded w-12 h-8"></div>
              <div className="bg-purple-200 rounded w-36 h-4"></div>
            </div>
          </div>

          {/* Charts Section Skeleton */}
          <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
            {/* Age Distribution Chart */}
            <Cell>
              <div className="space-y-6 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-200 p-2 rounded-lg w-9 h-9"></div>
                    <div>
                      <div className="bg-gray-200 mb-2 rounded w-32 h-5"></div>
                      <div className="bg-gray-200 rounded w-48 h-4"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg w-full h-80"></div>
              </div>
            </Cell>

            {/* Gender Distribution Chart */}
            <Cell>
              <div className="space-y-6 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-200 p-2 rounded-lg w-9 h-9"></div>
                    <div>
                      <div className="bg-gray-200 mb-2 rounded w-36 h-5"></div>
                      <div className="bg-gray-200 rounded w-44 h-4"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg w-full h-80"></div>
              </div>
            </Cell>
          </div>

          {/* Audience Selections Skeleton */}
          <Cell>
            <div className="space-y-6 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-200 p-2 rounded-lg w-9 h-9"></div>
                  <div>
                    <div className="bg-gray-200 mb-2 rounded w-36 h-5"></div>
                    <div className="bg-gray-200 rounded w-52 h-4"></div>
                  </div>
                </div>
              </div>
              <div className="pr-2 max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  {/* Category Section 1 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-gray-100 border-b">
                      <div className="bg-purple-200 p-2 rounded-lg w-7 h-7"></div>
                      <div className="bg-gray-200 rounded w-16 h-4"></div>
                      <div className="bg-purple-200 rounded-full w-6 h-5"></div>
                    </div>
                    <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-purple-100 p-3 border border-purple-200 rounded-lg"
                        >
                          <div className="bg-purple-200 rounded w-full h-4"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Category Section 2 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-gray-100 border-b">
                      <div className="bg-blue-200 p-2 rounded-lg w-7 h-7"></div>
                      <div className="bg-gray-200 rounded w-20 h-4"></div>
                      <div className="bg-blue-200 rounded-full w-6 h-5"></div>
                    </div>
                    <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-blue-100 p-3 border border-blue-200 rounded-lg"
                        >
                          <div className="bg-blue-200 rounded w-full h-4"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Cell>

          {/* Entities Sections Skeleton */}
          <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
            {/* Input Entities */}
            <Cell>
              <div className="space-y-6 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-200 p-2 rounded-lg w-9 h-9"></div>
                    <div>
                      <div className="bg-gray-200 mb-2 rounded w-28 h-5"></div>
                      <div className="bg-gray-200 rounded w-48 h-4"></div>
                    </div>
                  </div>
                  <div className="bg-green-200 px-3 py-1 rounded-full w-8 h-6"></div>
                </div>
                <div className="gap-4 grid grid-cols-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-gray-200 rounded w-32 h-5"></div>
                        <div className="bg-gray-200 rounded w-16 h-4"></div>
                      </div>
                      <div className="bg-gray-200 mb-3 rounded w-full h-4"></div>
                      <div className="flex gap-2">
                        <div className="bg-gray-200 rounded-full w-12 h-5"></div>
                        <div className="bg-gray-200 rounded-full w-16 h-5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Cell>

            {/* AI Recommendations */}
            <Cell>
              <div className="space-y-6 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-200 p-2 rounded-lg w-9 h-9"></div>
                    <div>
                      <div className="bg-gray-200 mb-2 rounded w-36 h-5"></div>
                      <div className="bg-gray-200 rounded w-44 h-4"></div>
                    </div>
                  </div>
                  <div className="bg-amber-200 px-3 py-1 rounded-full w-8 h-6"></div>
                </div>
                <div className="gap-4 grid grid-cols-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-gray-200 rounded w-28 h-5"></div>
                        <div className="bg-gray-200 rounded w-12 h-4"></div>
                      </div>
                      <div className="bg-gray-200 mb-3 rounded w-full h-4"></div>
                      <div className="flex gap-2">
                        <div className="bg-gray-200 rounded-full w-16 h-5"></div>
                        <div className="bg-gray-200 rounded-full w-20 h-5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Cell>
          </div>
        </div>
      </Screen>
    );
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

  return (
    <Screen heading={audience.name}>
      <div className="space-y-8">
        {/* Metrics Overview */}
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
                INSIGHTS
              </span>
            </div>
            <h3 className="mb-1 font-medium text-emerald-900 text-sm">
              Diversity Score
            </h3>
            <p className="font-bold text-emerald-900 text-2xl">
              {metrics?.diversityScore}%
            </p>
            <p className="text-emerald-700 text-sm">
              {metrics?.diversityScore && metrics.diversityScore > 75
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
                AI POWERED
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
              {metrics?.totalRecommendations} Cultural Correlates
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
          {/* Age Distribution */}
          <Cell>
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
                        "Count",
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
          </Cell>

          {/* Gender Distribution */}
          <Cell>
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
                  <BarChart
                    layout="vertical"
                    data={Object.entries(audience.genderTotals).map(
                      ([key, value]) => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1),
                        value,
                        percentage: (
                          (value /
                            Object.values(audience.genderTotals).reduce(
                              (a, b) => a + b,
                              0
                            )) *
                          100
                        ).toFixed(1),
                      })
                    )}
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
                        "Count",
                      ]}
                      labelStyle={{ color: "#374151", fontWeight: "600" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#pinkGradient)"
                      radius={[0, 6, 6, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="pinkGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#be185d" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Cell>
        </div>

        {/* Audience Selections - Fixed Height Container */}
        <Cell>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Audience Selections
                  </h3>
                  <p className="text-gray-600 text-sm">
                    User-defined preferences and interests
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
                          Genres
                        </h4>
                        <span className="bg-purple-100 px-2 py-1 rounded-full font-medium text-purple-700 text-xs">
                          {audience.categorizedSelections.genres.length}
                        </span>
                      </div>
                      <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                        {audience.categorizedSelections.genres.map((genre) => (
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
                {audience.categorizedSelections?.audienceOptions &&
                  Object.keys(audience.categorizedSelections.audienceOptions)
                    .length > 0 && (
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

                {/* Fallback for legacy data */}
                {(!audience.categorizedSelections ||
                  (!audience.categorizedSelections.genres?.length &&
                    !Object.keys(
                      audience.categorizedSelections.audienceOptions || {}
                    ).length)) &&
                  audience.demographics &&
                  audience.demographics.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-gray-100 border-b">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <div className="bg-gray-500 rounded w-3 h-3"></div>
                        </div>
                        <h4 className="font-semibold text-gray-800 text-base">
                          Legacy Selections
                        </h4>
                        <span className="bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-700 text-xs">
                          {audience.demographics.length}
                        </span>
                      </div>
                      <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                        {audience.demographics.map((demographic) => (
                          <div
                            key={demographic.value}
                            className="group bg-gray-50 hover:bg-gray-100 p-3 border border-gray-200 rounded-lg transition-all duration-200"
                          >
                            <span className="font-medium text-gray-700 group-hover:text-gray-800 text-sm">
                              {demographic.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Empty state */}
                {!audience.categorizedSelections &&
                  (!audience.demographics ||
                    audience.demographics.length === 0) && (
                    <div className="flex flex-col justify-center items-center py-12">
                      <div className="bg-gray-100 mb-4 p-4 rounded-full w-16 h-16">
                        <Target className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="mb-2 font-semibold text-gray-900 text-lg">
                        No Selections Found
                      </h4>
                      <p className="max-w-md text-gray-600 text-center">
                        This audience doesn&apos;t have any recorded preferences
                        or selections.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </Cell>

        {/* Entities Sections */}
        <div className="space-y-8">
          {/* Input Entities */}
          <Cell>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Input Entities
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
          </Cell>

          {/* Recommended Entities */}
          <Cell>
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
                      Algorithmically generated insights
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
          </Cell>
        </div>
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
