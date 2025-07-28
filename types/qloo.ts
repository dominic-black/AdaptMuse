export interface QlooApiEntity {
  entity_id: string;
  name: string;
  popularity?: number;
  types: string[];
  properties?: {
    image?: {
      url?: string;
    };
  };
  image?: string;
}

export interface DemographicData {
  entity_id: string;
  query: {
    age: Record<string, number>;
    gender: Record<string, number>;
  };
}
