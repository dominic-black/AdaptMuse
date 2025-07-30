import { Entity, AgeGroup, Gender } from './entities';
import { AudienceOption } from './common';

export interface AudienceApiData {
  entities: Entity[];
  audiences: AudienceOption[];
  genres: AudienceOption[];
  ageGroup: AgeGroup[];
  gender: Gender;
}
