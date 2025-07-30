import { Audience } from "@/types/audience";
import { AgeGroup, Entity, Gender } from "@/types/entities";
import { AudienceOption } from "@/constants/audiences";

export interface CreateAudienceRequest {
  audienceName: string;
  audienceData: {
    entities: Entity[];
    audiences: AudienceOption[];
    ageGroup: AgeGroup[];
    gender: Gender;
    genres: AudienceOption[];
  };
}

export interface CreateAudienceResponse {
  success: boolean;
  audience?: Audience;
  error?: string;
}

export const createAudience = async (
  requestData: CreateAudienceRequest
): Promise<CreateAudienceResponse> => {
  try {
    const response = await fetch("/api/audience", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create audience: ${response.status} ${errorData}`);
    }

    const audience = await response.json();
    
    return {
      success: true,
      audience,
    };
  } catch (error) {
    console.error("Error creating audience:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}; 