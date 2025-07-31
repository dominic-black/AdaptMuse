export interface AudienceMetrics {
  totalEntities: number;
  totalRecommendations: number;
  diversityScore: number;
  primaryAgeGroup: string;
  genderDistribution: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: string;
  fill?: string;
  isPositive?: boolean;
}

export interface TasteVectorData {
  category: string;
  score: number;
} 