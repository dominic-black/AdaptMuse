import { Audience } from "@/types/audience";
import { AgeGroup, Entity, Gender } from "@/types/entities";
import { AudienceOption } from "@/constants/audiences";

/**
 * Formats age group labels for consistent display across the application.
 * Transforms database keys into user-friendly labels.
 * 
 * @param ageKey - Raw age group key from database (e.g., "18_24", "25_34", "35_and_older")
 * @returns Formatted age label (e.g., "18-24", "25-34", "35+")
 */
export const formatAgeGroupLabel = (ageKey: string): string => {
  if (!ageKey || typeof ageKey !== 'string') {
    return 'Unknown';
  }

  return ageKey
    // Replace underscores with hyphens for age ranges
    .replace(/_/g, '-')
    // Convert "and older" or "and_older" to "+"
    .replace(/(-and)?(-older|older)/gi, '+')
    // Convert standalone "and" to "+"
    .replace(/\band\b/gi, '+')
    // Remove any remaining special characters except hyphens and plus signs
    .replace(/[^a-zA-Z0-9\s\-+]/g, '')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    // Trim whitespace
    .trim();
};

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