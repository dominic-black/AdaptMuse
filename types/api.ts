import { Entity, AgeGroup, Gender } from './entities';
import { AudienceOption } from './common';

export interface AudienceApiData {
  entities: Entity[];
  audienceOptions: Record<string, AudienceOption[]>; // Categorized audience options
  genres: AudienceOption[];
  ageGroup: AgeGroup[];
  gender: Gender;
}
