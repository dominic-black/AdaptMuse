import { AgeGroup, Entity, AudienceOption, AudienceApiData, QlooApiEntity, DemographicData } from '@/types';
import { EntityType } from '@/types/entities';
import { EntityTypes } from '@/constants/entity';
import { 
  QlooFilterType, 
  EntityTypeToQlooFilter, 
  convertAgeGroups, 
  buildQlooInsightsUrl,
  InsightsConfig,
  YourAgeGroup,
  QlooGender,
  QlooWeight,
  QlooBiasTrends,
  QlooSortBy
} from '@/types/qloo-insights-types';

// Constants
export const QLOO_API_BASE_URL = 'https://hackathon.api.qloo.com';
export const QLOO_INSIGHTS_URL = `${QLOO_API_BASE_URL}/v2/insights`;
export const DEFAULT_AVATAR_URL = 'https://cdn-icons-png.flaticon.com/512/1053/1053244.png';
export const UNKNOWN_ENTITY_TYPE = 'UNKNOWN';
export const DECIMAL_PRECISION = 4;

// Optimized query configuration
export const INSIGHTS_QUERY_CONFIG = {
  DEFAULT_TAKE: 5, // Reduced for faster responses and fewer timeouts
  MAX_TAKE: 10, // Maximum for complex queries
  WEIGHT_HIGH: QlooWeight.High,
  WEIGHT_MEDIUM: QlooWeight.Medium,
  BIAS_TRENDS: QlooBiasTrends.Low, // Reduced to avoid timeouts
  SORT_BY: QlooSortBy.Affinity,
  // Minimum signal requirements for valid API calls
  MIN_ENTITY_SIGNALS: 1,
  MIN_TAG_SIGNALS: 1,
} as const;

// Error messages
export const ERRORS = {
  MISSING_QLOO_API_KEY: 'Missing Qloo API key',
  MISSING_AUDIENCE_DATA: 'Missing audience name or audience data',
  INVALID_AUDIENCE_NAME: 'Audience name must be a non-empty string',
  QLOO_API_ERROR: 'Failed to fetch data from Qloo API',
  FAILED_TO_CREATE_AUDIENCE: 'Failed to create audience',
  INVALID_ENTITY_TYPE: 'Invalid entity type provided',
  NO_VALID_SIGNALS: 'No valid signals provided for insights query',
} as const;

// Input validation limits
export const VALIDATION_LIMITS = {
  MAX_AUDIENCE_NAME_LENGTH: 100,
  MIN_AUDIENCE_NAME_LENGTH: 1,
  MAX_ENTITIES: 50,
} as const;

/**
 * Validates the request payload with enhanced validation
 */
export function validateRequestData(audienceName: string, audienceData: AudienceApiData): string | null {
  if (!audienceName || typeof audienceName !== 'string') {
    return ERRORS.INVALID_AUDIENCE_NAME;
  }
  
  if (audienceName.length < VALIDATION_LIMITS.MIN_AUDIENCE_NAME_LENGTH || 
      audienceName.length > VALIDATION_LIMITS.MAX_AUDIENCE_NAME_LENGTH) {
    return `Audience name must be between ${VALIDATION_LIMITS.MIN_AUDIENCE_NAME_LENGTH} and ${VALIDATION_LIMITS.MAX_AUDIENCE_NAME_LENGTH} characters`;
  }

  if (!audienceData || typeof audienceData !== 'object') {
    return ERRORS.MISSING_AUDIENCE_DATA;
  }

  const { entities, audienceOptions, genres } = audienceData;

  if (!Array.isArray(entities) || typeof audienceOptions !== 'object' || !Array.isArray(genres)) {
    return 'Invalid audience data structure';
  }

  if (entities.length > VALIDATION_LIMITS.MAX_ENTITIES) {
    return `Too many entities. Maximum allowed: ${VALIDATION_LIMITS.MAX_ENTITIES}`;
  }

  return null;
}

/**
 * Creates standard headers for Qloo API requests
 */
export function createQlooHeaders(apiKey: string): Record<string, string> {
  return {
    'x-api-key': apiKey,
    'accept': 'application/json',
  };
}

/**
 * Transforms Qloo API entity to internal Entity format with enhanced error handling
 */
export function transformQlooEntity(inputEntity: QlooApiEntity, entityType?: string): Entity {
  const detectedType = entityType || inputEntity.types[0]?.split(':').pop()?.toUpperCase() || UNKNOWN_ENTITY_TYPE;
  
  return {
    id: inputEntity.entity_id,
    name: inputEntity.name,
    popularity: inputEntity.popularity ?? 0,
    type: detectedType as EntityType,
    imageUrl: inputEntity.properties?.image?.url || null,
  };
}

/**
 * Maps your age groups to Qloo-compatible age groups
 */
export function mapAgeGroupsToQloo(ageGroups: AgeGroup[]): string[] {
  const yourAgeGroups = ageGroups as YourAgeGroup[];
  const qlooAgeGroups = convertAgeGroups(yourAgeGroups);
  return qlooAgeGroups;
}

/**
 * Maps gender to Qloo-compatible format
 */
export function mapGenderToQloo(gender: string): QlooGender | undefined {
  if (gender === 'male') return QlooGender.Male;
  if (gender === 'female') return QlooGender.Female;
  return undefined;
}

/**
 * Gets the correct Qloo filter type for an entity type
 */
export function getQlooFilterType(entityType: string): QlooFilterType {
  const filterType = EntityTypeToQlooFilter[entityType.toUpperCase()];
  if (!filterType) {
    console.warn(`Unknown entity type: ${entityType}, falling back to ARTIST`);
    return QlooFilterType.Artist;
  }
  return filterType;
}

/**
 * Configuration interface for building insights queries
 */
interface OptimizedInsightsConfig {
  filterType: QlooFilterType;
  take?: number;
  sortBy?: QlooSortBy;
  biasTrends?: QlooBiasTrends;
  signalDemographicsAge?: string;
  signalDemographicsAgeWeight?: QlooWeight;
  signalDemographicsGender?: QlooGender;
  signalDemographicsGenderWeight?: QlooWeight;
  signalDemographicsAudiences?: string[];
  signalDemographicsAudiencesWeight?: QlooWeight;
  signalInterestsEntities?: string[];
  signalInterestsEntitiesWeight?: QlooWeight;
  signalInterestsTags?: string[];
  signalInterestsTagsWeight?: QlooWeight;
}

/**
 * Builds optimized insights configuration for maximum results
 */
export function buildOptimizedInsightsConfig(
  entityType: string,
  inputEntities: Entity[],
  audiences: AudienceOption[],
  ageGroups: AgeGroup[],
  genres: AudienceOption[],
  gender: string
): OptimizedInsightsConfig {
  const filterType = getQlooFilterType(entityType);
  const qlooGender = mapGenderToQloo(gender);
  const qlooAgeGroups = mapAgeGroupsToQloo(ageGroups);
  
  // Build configuration with all possible properties
  const config: OptimizedInsightsConfig = {
    filterType,
    take: INSIGHTS_QUERY_CONFIG.DEFAULT_TAKE,
    sortBy: INSIGHTS_QUERY_CONFIG.SORT_BY,
    biasTrends: INSIGHTS_QUERY_CONFIG.BIAS_TRENDS,
  };

  // Add demographic signals with proper weights
  if (qlooAgeGroups.length > 0) {
    config.signalDemographicsAge = qlooAgeGroups[0]; // Use first mapped age group
    config.signalDemographicsAgeWeight = INSIGHTS_QUERY_CONFIG.WEIGHT_MEDIUM;
  }

  if (qlooGender) {
    config.signalDemographicsGender = qlooGender;
    config.signalDemographicsGenderWeight = INSIGHTS_QUERY_CONFIG.WEIGHT_MEDIUM;
  }

  // Add audience signals
  if (audiences.length > 0) {
    config.signalDemographicsAudiences = audiences.map(a => a.value);
    config.signalDemographicsAudiencesWeight = INSIGHTS_QUERY_CONFIG.WEIGHT_HIGH;
  }

  // Add interest signals
  if (inputEntities.length > 0) {
    config.signalInterestsEntities = inputEntities.map(e => e.id);
    config.signalInterestsEntitiesWeight = INSIGHTS_QUERY_CONFIG.WEIGHT_HIGH;
  }

  if (genres.length > 0) {
    config.signalInterestsTags = genres.map(g => g.value);
    config.signalInterestsTagsWeight = INSIGHTS_QUERY_CONFIG.WEIGHT_MEDIUM;
  }

  return config;
}

/**
 * Validates that the insights configuration has required signals for successful API calls
 */
export function validateInsightsConfig(config: OptimizedInsightsConfig): boolean {
  const hasAudienceSignal = Boolean(config.signalDemographicsAudiences?.length);
  const hasEntitySignal = Boolean(config.signalInterestsEntities?.length && config.signalInterestsEntities.length >= INSIGHTS_QUERY_CONFIG.MIN_ENTITY_SIGNALS);
  const hasTagSignal = Boolean(config.signalInterestsTags?.length && config.signalInterestsTags.length >= INSIGHTS_QUERY_CONFIG.MIN_TAG_SIGNALS);
  const hasDemographicSignal = Boolean(config.signalDemographicsAge) || Boolean(config.signalDemographicsGender);
  
  // Enhanced validation: Require either entities OR (demographics + tags/audiences) for valid queries
  const hasStrongSignal = hasEntitySignal || hasAudienceSignal;
  const hasWeakSignalCombination = hasDemographicSignal && (hasTagSignal || hasAudienceSignal);
  
  const isValid = hasStrongSignal || hasWeakSignalCombination;
  
  if (!isValid) {
    console.warn('Insights config validation failed:', {
      hasEntitySignal,
      hasAudienceSignal, 
      hasTagSignal,
      hasDemographicSignal,
      entityCount: config.signalInterestsEntities?.length || 0,
      tagCount: config.signalInterestsTags?.length || 0,
      audienceCount: config.signalDemographicsAudiences?.length || 0
    });
  }
  
  return isValid;
}

/**
 * Fetches input entities from Qloo API with improved error handling
 */
export async function fetchInputEntities(entities: Entity[], qlooApiKey: string): Promise<Entity[]> {
  if (entities.length === 0) {
    return [];
  }

  const entityIds = entities.map(e => e.id).filter(Boolean);
  if (entityIds.length === 0) {
    return [];
  }

  const url = `${QLOO_API_BASE_URL}/entities?entity_ids=${entityIds.join(',')}`;
  
  try {
    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey),
    });

    if (!response.ok) {
      console.warn(`Entities API responded with status ${response.status}`);
      return entities; // Return original entities as fallback
    }

    const data = await response.json();
    
    if (!data?.results?.length) {
      return entities; // Return original entities as fallback
    }

    return data.results.map((entity: QlooApiEntity) => transformQlooEntity(entity));
  } catch (error) {
    console.error('Error fetching input entities:', error);
    return entities; // Return original entities as fallback
  }
}

/**
 * Fetches recommended entity for a specific type with optimized configuration
 */
export async function fetchRecommendedEntityForType(
  entityType: string,
  inputEntities: Entity[],
  audiences: AudienceOption[],
  ageGroups: AgeGroup[],
  genres: AudienceOption[],
  gender: string,
  qlooApiKey: string
): Promise<Entity | null> {
  try {
    const config = buildOptimizedInsightsConfig(
      entityType,
      inputEntities,
      audiences,
      ageGroups,
      genres,
      gender
    );

    // Validate configuration has required signals
         if (!validateInsightsConfig(config)) {
       console.warn(`No valid signals for entity type ${entityType}, skipping`);
       return null;
     }

     const url = buildQlooInsightsUrl(config as unknown as InsightsConfig);

    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey),
    });

    if (!response.ok) {
      console.warn(`Insights API responded with status ${response.status} for ${entityType}`);
      return null;
    }

    const data = await response.json();
    
    if (!data?.results?.entities?.length) {
      console.warn(`No entities returned for type ${entityType}`);
      return null;
    }

    const entity = data.results.entities[0];
    return transformQlooEntity(entity, entityType);
  } catch (error) {
    console.error(`Error fetching recommended entity for type ${entityType}:`, error);
    return null;
  }
}

/**
 * Fetches multiple recommended entities for a single type with optimized configuration
 */
export async function fetchMultipleRecommendedEntitiesForType(
  entityType: string,
  inputEntities: Entity[],
  audiences: AudienceOption[],
  ageGroups: AgeGroup[],
  genres: AudienceOption[],
  gender: string,
  qlooApiKey: string,
  count: number = 1
): Promise<Entity[]> {
  try {
    const config = buildOptimizedInsightsConfig(
      entityType,
      inputEntities,
      audiences,
      ageGroups,
      genres,
      gender
    );

    // Use optimized take count to reduce timeout risk
    config.take = Math.min(count + 2, INSIGHTS_QUERY_CONFIG.MAX_TAKE); // Request a few extra for filtering

    if (!validateInsightsConfig(config)) {
      console.warn(`No valid signals for entity type ${entityType}, skipping`);
      return [];
    }

    const url = buildQlooInsightsUrl(config as unknown as InsightsConfig);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 400) {
        console.warn(`Invalid request for ${entityType}: likely missing required signals`);
      } else if (response.status >= 500) {
        console.warn(`Server error for ${entityType}: ${response.status}`);
      } else {
        console.warn(`API error for ${entityType}: ${response.status}`);
      }
      return [];
    }

    const data = await response.json();
    
    if (!data?.results?.entities?.length) {
      console.warn(`No entities returned for ${entityType}`);
      return [];
    }

    const entities = data.results.entities
      .slice(0, count)
      .map((entity: QlooApiEntity) => transformQlooEntity(entity, entityType))
      .filter((entity: Entity) => entity.id && entity.name); // Filter out invalid entities

    console.log(`Successfully fetched ${entities.length}/${count} entities for ${entityType}`);
    return entities;
    
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Request timeout for entity type ${entityType}`);
    } else {
      console.error(`Error fetching entities for type ${entityType}:`, error);
    }
    return [];
  }
}

/**
 * Priority order for entity types based on engagement and reliability
 */
const ENTITY_TYPE_PRIORITY = [
  'MOVIE',     // Most reliable and popular
  'ARTIST',    // High engagement
  'BOOK',      // Good demographic data
  'TV_SHOW',   // Popular content type
  'PERSON',    // Personality-based insights
  'BRAND',     // Commercial relevance
  'PLACE',     // Location-based insights
  'VIDEO_GAME', // Gaming demographic
  'PODCAST'    // Audio content
];

/**
 * Fetches recommended entities with optimized strategy for better performance and reliability
 */
export async function fetchRecommendedEntities(
  inputEntities: Entity[],
  audiences: AudienceOption[],
  ageGroups: AgeGroup[],
  genres: AudienceOption[],
  gender: string,
  qlooApiKey: string
): Promise<Entity[]> {
  // Use priority-ordered entity types for more reliable results
  const entityTypes = ENTITY_TYPE_PRIORITY.filter(type => type in EntityTypes);
  
  // Reduce concurrent requests to avoid timeouts
  const MAX_CONCURRENT = 3;
  const uniqueEntities: Entity[] = [];
  const inputEntityIds = new Set(inputEntities.map(e => e.id));
  const seenIds = new Set<string>();
  
  console.log(`Fetching entities for ${entityTypes.length} types with max ${MAX_CONCURRENT} concurrent requests`);
  
  // Process entity types in batches to avoid overwhelming the API
  for (let i = 0; i < entityTypes.length; i += MAX_CONCURRENT) {
    const batch = entityTypes.slice(i, i + MAX_CONCURRENT);
    
    const batchPromises = batch.map(async (entityType) => {
      try {
        // Fetch fewer entities per type but more reliably
        const entities = await fetchMultipleRecommendedEntitiesForType(
          entityType,
          inputEntities,
          audiences,
          ageGroups,
          genres,
          gender,
          qlooApiKey,
          1 // Reduced to 1 entity per type for reliability
        );
        
        // Add unique entities to the result
        for (const entity of entities) {
          if (!inputEntityIds.has(entity.id) && !seenIds.has(entity.id)) {
            seenIds.add(entity.id);
            uniqueEntities.push(entity);
          }
        }
        
        return entities.length;
      } catch (error) {
        console.error(`Error fetching entities for type ${entityType}:`, error);
        return 0;
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    const batchTotal = batchResults.reduce((sum, count) => sum + count, 0);
    
    console.log(`Batch ${Math.floor(i / MAX_CONCURRENT) + 1}: fetched ${batchTotal} entities from types [${batch.join(', ')}]`);
    
    // Stop if we have enough entities (15+ is good coverage)
    if (uniqueEntities.length >= 15) {
      console.log(`Reached target entity count (${uniqueEntities.length}), stopping early`);
      break;
    }
    
    // Small delay between batches to be respectful to the API
    if (i + MAX_CONCURRENT < entityTypes.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`Successfully fetched ${uniqueEntities.length} unique recommended entities`);
  return uniqueEntities;
}

/**
 * Fetches demographics data for entities with improved chunking and error handling
 */
export async function fetchDemographics(
  entities: Entity[], 
  qlooApiKey: string
): Promise<Record<string, { age: Record<string, number>, gender: Record<string, number> }>> {
  const CHUNK_SIZE = 50;
  const entityIds = entities.map(e => e.id).filter(Boolean);
  
  if (entityIds.length === 0) {
    return {};
  }

  const demographicsMap: Record<string, { age: Record<string, number>, gender: Record<string, number> }> = {};

  try {
    for (let i = 0; i < entityIds.length; i += CHUNK_SIZE) {
      const chunk = entityIds.slice(i, i + CHUNK_SIZE);
      
             // Use the new insights configuration for demographics
       const config: OptimizedInsightsConfig = {
         filterType: 'urn:demographics' as QlooFilterType,
         signalInterestsEntities: chunk,
         take: chunk.length,
       };

             const url = buildQlooInsightsUrl(config as unknown as InsightsConfig);
      
      const response = await fetch(url, {
        headers: createQlooHeaders(qlooApiKey),
      });

      if (!response.ok) {
        console.warn(`Demographics API responded with status ${response.status} for chunk ${i / CHUNK_SIZE + 1}`);
        continue;
      }

      const data = await response.json();
      const demographicsList: DemographicData[] = data.results?.demographics || [];

      for (const demographic of demographicsList) {
        demographicsMap[demographic.entity_id] = {
          age: demographic.query.age,
          gender: demographic.query.gender,
        };
      }
    }

    return demographicsMap;
  } catch (error) {
    console.error('Error fetching demographics:', error);
    return {};
  }
}

/**
 * Adds demographic data to entities
 */
export function addDemographicsToEntities(
  entities: Entity[],
  demographicsMap: Record<string, { age: Record<string, number>, gender: Record<string, number> }>
): Entity[] {
  return entities.map(entity => {
    const demographics = demographicsMap[entity.id];
    return demographics ? { ...entity, ...demographics } : entity;
  });
}

/**
 * Calculates age and gender totals from entities, handling Qloo's correlation scores properly
 */
export function calculateDemographicTotals(entities: Entity[]): {
  ageTotals: Record<AgeGroup, number>;
  genderTotals: Record<'male' | 'female', number>;
} {
  const ageTotals: Record<AgeGroup, number> = {
    '24_and_younger': 0,
    '25_to_29': 0,
    '30_to_34': 0,
    '35_to_44': 0,
    '45_to_54': 0,
    '55_and_older': 0,
  };

  const genderTotals: Record<'male' | 'female', number> = {
    male: 0,
    female: 0,
  };

  let totalEntitiesWithAge = 0;
  let totalEntitiesWithGender = 0;

  // First pass: collect all values
  for (const entity of entities) {
    if (entity.age && typeof entity.age === 'object') {
      totalEntitiesWithAge++;
      for (const [ageKey, value] of Object.entries(entity.age)) {
        if (ageKey in ageTotals && typeof value === 'number' && !isNaN(value)) {
          ageTotals[ageKey as AgeGroup] += Math.abs(value); // Use absolute values for correlation scores
        }
      }
    }

    if (entity.gender && typeof entity.gender === 'object') {
      totalEntitiesWithGender++;
      for (const [genderKey, value] of Object.entries(entity.gender)) {
        if (genderKey in genderTotals && typeof value === 'number' && !isNaN(value)) {
          genderTotals[genderKey as 'male' | 'female'] += Math.abs(value); // Use absolute values
        }
      }
    }
  }

  // Normalize to percentages (0-1 range)
  if (totalEntitiesWithAge > 0) {
    const ageSum = Object.values(ageTotals).reduce((sum, val) => sum + val, 0);
    if (ageSum > 0) {
      for (const key in ageTotals) {
        ageTotals[key as AgeGroup] = ageTotals[key as AgeGroup] / ageSum;
      }
    }
  }

  if (totalEntitiesWithGender > 0) {
    const genderSum = Object.values(genderTotals).reduce((sum, val) => sum + val, 0);
    if (genderSum > 0) {
      for (const key in genderTotals) {
        genderTotals[key as 'male' | 'female'] = genderTotals[key as 'male' | 'female'] / genderSum;
      }
    }
  }

  return { ageTotals, genderTotals };
}

/**
 * Rounds numeric values in an object to specified decimal places
 */
export function roundNumericObject<T extends Record<string, number>>(obj: T, decimals = DECIMAL_PRECISION): T {
  const result: Record<string, number> = {};
  const multiplier = 10 ** decimals;
  
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'number' && !isNaN(value)) {
      result[key] = Math.round((value + Number.EPSILON) * multiplier) / multiplier;
    } else {
      result[key] = 0;
    }
  }
  
  return result as T;
}

/**
 * Sanitizes an object for Firestore by converting undefined values to null
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        sanitized[key] = null;
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeForFirestore(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized as T;
  }
  
  return obj;
}

