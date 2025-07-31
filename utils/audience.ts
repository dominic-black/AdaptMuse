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

/**
 * Formats category names for consistent display across the application.
 * Transforms database keys into user-friendly labels.
 * 
 * @param categoryKey - Raw category key (e.g., "SPENDING_HABITS", "lifestyle_preferences")
 * @returns Formatted category label (e.g., "Spending Habits", "Lifestyle Preferences")
 */
export const formatCategoryLabel = (categoryKey: string): string => {
  if (!categoryKey || typeof categoryKey !== 'string') {
    return 'Other';
  }

  return categoryKey
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Convert to title case
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    // Trim whitespace
    .trim();
};

export interface CreateAudienceRequest {
  audienceName: string;
  audienceData: {
    entities: Entity[];
    audienceOptions: Record<string, AudienceOption[]>; // Categorized audience options
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

/**
 * Transforms raw API error messages into user-friendly messages
 */
const getUserFriendlyError = (errorMessage: string): string => {
  // Remove the "Failed to create audience: 400" prefix and parse JSON if present
  const cleanError = errorMessage.replace(/^Failed to create audience: \d+\s*/, '');
  
  try {
    // Try to parse as JSON if it's a JSON error response
    const errorObj = JSON.parse(cleanError);
    const apiError = errorObj.error || errorObj.message || cleanError;
    
    // Transform specific API errors into user-friendly messages
    if (apiError.includes('Audience name must be a non-empty string')) {
      return 'Please enter a name for your audience.';
    }
    
    if (apiError.includes('name') && apiError.includes('required')) {
      return 'Audience name is required.';
    }
    
    if (apiError.includes('entities') && apiError.includes('required')) {
      return 'Please add at least one interest to your audience.';
    }
    
    if (apiError.includes('authentication') || apiError.includes('unauthorized')) {
      return 'Please sign in to create an audience.';
    }
    
    if (apiError.includes('quota') || apiError.includes('limit')) {
      return 'You have reached your audience creation limit. Please try again later.';
    }
    
    if (apiError.includes('validation') || apiError.includes('invalid')) {
      return 'Please check your audience configuration and try again.';
    }
    
    // Return the cleaned API error if no specific mapping found
    return apiError;
  } catch {
    // If not JSON, handle common patterns in plain text errors
    if (cleanError.includes('name') && (cleanError.includes('empty') || cleanError.includes('required'))) {
      return 'Please enter a name for your audience.';
    }
    
    if (cleanError.includes('unauthorized') || cleanError.includes('authentication')) {
      return 'Please sign in to create an audience.';
    }
    
    if (cleanError.includes('network') || cleanError.includes('connection')) {
      return 'Connection error. Please check your internet and try again.';
    }
    
    // Fallback to a generic message for unrecognized errors
    return 'Something went wrong while creating your audience. Please try again.';
  }
};

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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: getUserFriendlyError(errorMessage),
    };
  }
}; 