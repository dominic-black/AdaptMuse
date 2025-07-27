export interface QlooEntity {
  id: string;
  name: string;
  subText: string;
  type: 'MOVIE' | 'PERSON' | 'ARTIST';
  popularity: number;
  image: string | null;
  gender: {
    male: number;
    female: number;
  };
  age: {
    '24_and_younger': number;
    '25_to_29': number;
    '30_to_34': number;
    '35_to_44': number;
    '45_to_54': number;
    '55_and_older': number;
  };
}

export interface Audience {
  id: string;
  name: string;
  recommendedEntities: QlooEntity[];
  entities: QlooEntity[];
  ageTotals: Record<string, number>;
  genderTotals: Record<string, number>;
  demographics: {
    label: string;
    value: string;
  }[];
}
