export interface TrendingAnalysisData {
    byCategory: Record<string, {
      entities: unknown[];
      count: number;
      avgPopularity: number;
    }>;
    mostTrendingCategory: string;
    totalTrendingEntities: number;
  }

export interface CulturalAnalysis {
    correlations: unknown[];
    culturalClusters: unknown[];
    affinityMatrix: Record<string, unknown>;
    analysisConfidence: number;
  }

export interface CrossCulturalInsights {
    globalRelevance: number;
    culturalBridges: unknown[];
    regionalVariations: Record<string, number>;
    universalThemes: unknown[];
  }

export interface TasteProfileInput {
    affinityScore: number;
    diversityIndex: number;
    culturalSegments: string[];
    tasteVector: Record<string, number>;
  }

export interface EntityData {
    id: string;
    name: string;
    type: string;
    popularity?: number;
  }

export interface DemographicsMap {
    [entityId: string]: {
      age?: Record<string, number>;
      gender?: Record<string, number>;
    };
  }
