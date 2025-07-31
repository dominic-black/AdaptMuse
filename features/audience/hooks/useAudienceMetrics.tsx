import { useMemo } from "react";
import { formatAgeGroupLabel } from "@/utils/audience";
import { AudienceMetrics } from "../types/audience-metrics.types";
import { EnhancedAudience } from "../types/audience-analytics.types";

export const useAudienceMetrics = (
  audience: EnhancedAudience | null
): AudienceMetrics | null => {
  return useMemo(() => {
    if (!audience) return null;

    // Calculate total entities and recommendations
    const totalEntities = audience.entities.length;
    const totalRecommendations = audience.recommendedEntities.length;

    // Calculate diversity score
    const diversityScore = Math.min(
      100,
      Math.round((totalEntities + totalRecommendations) * 2.5)
    );

    // Get primary age group
    const primaryAge = Object.entries(audience.ageTotals || {}).sort(
      ([, a], [, b]) => b - a
    )[0];
    const primaryAgeGroup = primaryAge
      ? formatAgeGroupLabel(primaryAge[0])
      : "Mixed";

    // Get gender distribution (handling raw affinity scores)
    const { male = 0, female = 0 } = audience.genderTotals || {};
    const absoluteTotal = Math.abs(male) + Math.abs(female);
    let genderDistribution = "Mixed";

    if (absoluteTotal > 0) {
      const malePercent = (Math.abs(male) / absoluteTotal) * 100;
      if (malePercent > 65) {
        genderDistribution = "Male-leaning";
      } else if (malePercent < 35) {
        genderDistribution = "Female-leaning";
      }
    }

    return {
      totalEntities,
      totalRecommendations,
      diversityScore,
      primaryAgeGroup,
      genderDistribution,
    };
  }, [audience]);
};
