export type Entity = {
    id: string;
    name: string;
    subText: string;
    popularity: number;
    type: string;
    imageUrl: string;
}

export type AgeGroup = "24_and_younger" | "25_to_29" | "30_to_34" | "35_to_44" | "45_to_54" | "55_and_older";

export type Gender = "M" | "F";

export type AudienceData = {
  audienceName: string;
  entities: string[];
  audience: string[];
  gender: Gender;
  ageGroup: AgeGroup;
};