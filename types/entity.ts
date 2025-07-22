export type Entity = {
    id: string;
    name: string;
    subText: string;
    popularity: number;
    type: string;
    imageUrl: string;
}

export type AudienceData = {
  audienceName: string;
  entities: string[];
  audience: string[];
  gender: "M" | "F";
  ageGroup: "35_and_younger" | "36_to_55" | "55_and_older";
};