import { Entity, AgeGroup, Gender, EntityType } from './entities';

export type { EntityType };

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
  demographics: { label: string; value: string }[];
  categorizedSelections?: CategorizedSelections;
}

export type AudienceData = {
  audienceName: string;
  entities: string[];
  gender: Gender | 'all'; 
  ageGroup: AgeGroup;
};
