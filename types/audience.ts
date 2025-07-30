import { Entity, AgeGroup, Gender, EntityType } from './entities';

// Re-export EntityType for convenience
export type { EntityType };

// Alias Entity as QlooEntity for backward compatibility
export type QlooEntity = Entity;

export interface AudienceCategory {
  label: string;
  value: string;
  category?: string;
}

export interface CategorizedSelections {
  genres: AudienceCategory[];
  audienceOptions: Record<string, AudienceCategory[]>;
}

export interface Audience {
  id: string;
  name: string;
  imageUrl?: string;
  recommendedEntities: Entity[];
  entities: Entity[];
  ageTotals: Record<AgeGroup, number>;
  genderTotals: Record<Gender, number>;
  demographics: { label: string; value: string }[]; // Legacy field - to be deprecated
  categorizedSelections?: CategorizedSelections; // New structured data
}

export type AudienceData = {
  audienceName: string;
  entities: string[];
  gender: Gender | 'all'; // 'all' is not in Gender, so keep it as a union
  ageGroup: AgeGroup;
};
