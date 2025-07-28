export type EntityType = 'MOVIE' | 'PERSON' | 'ARTIST' | 'TV_SHOW' | 'BOOK' | 'GAME';

export type AgeGroup = '24_and_younger' | '25_to_29' | '30_to_34' | '35_to_44' | '45_to_54' | '55_and_older';

export type Gender = 'all' | 'male' | 'female';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  imageUrl?: string;
  subText?: string;
  popularity?: number;
  gender?: Record<Gender, number>;
  age?: Record<AgeGroup, number>;
}