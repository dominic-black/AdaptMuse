import { Audience } from '@/types/audience';

export interface QlooTasteProfile {
  affinityScore: number;
  diversityIndex: number;
  interpretation: string;
  culturalSegments: string[];
  tasteVector: Record<string, number>;
}

export interface QlooTrendingAnalysis {
  byCategory: Record<string, {
    entities: unknown[];
    count: number;
    avgPopularity: number;
  }>;
  mostTrendingCategory: string;
  userAlignmentScore: number;
  trendingRecommendations: string[];
}

export interface QlooDemographicIntelligence {
  demographicConfidence: number;
  culturalCorrelations: unknown[];
}

export interface QlooCulturalProfile {
  culturalDiversityScore: number;
  crossCulturalInsights: {
    globalRelevance: number;
    culturalBridges: unknown[];
    regionalVariations: Record<string, number>;
    universalThemes: unknown[];
  };
}

export interface QlooAnalysisMetrics {
  dataQualityScore: number;
  culturalCoverageScore: number;
  processingTimeMs: number;
  qlooFeaturesUsed: string[];
}

export interface QlooIntelligence {
  tasteProfile?: QlooTasteProfile;
  trendingAnalysis?: QlooTrendingAnalysis;
  demographicIntelligence?: QlooDemographicIntelligence;
  culturalProfile?: QlooCulturalProfile;
  analysisMetrics?: QlooAnalysisMetrics;
}

export interface EnhancedAudience extends Audience {
  qlooIntelligence?: QlooIntelligence;
}

export type AnalyticsTab = 'overview' | 'analytics'; 