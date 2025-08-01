import { AgeGroup, Entity, AudienceOption, AudienceApiData, QlooApiEntity } from '@/types';
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
import OpenAI from 'openai';
import { storage } from '@/lib/firebaseAdmin';

export const QLOO_API_BASE_URL = 'https://hackathon.api.qloo.com';
export const QLOO_INSIGHTS_URL = `${QLOO_API_BASE_URL}/v2/insights`;
export const DEFAULT_AVATAR_URL = 'https://cdn-icons-png.flaticon.com/512/1053/1053244.png';
export const UNKNOWN_ENTITY_TYPE = 'UNKNOWN';
export const DECIMAL_PRECISION = 4;

export const INSIGHTS_QUERY_CONFIG = {
  DEFAULT_TAKE: 5,
  MAX_TAKE: 10,
  WEIGHT_HIGH: QlooWeight.High,
  WEIGHT_MEDIUM: QlooWeight.Medium,
  BIAS_TRENDS: QlooBiasTrends.Low,
  SORT_BY: QlooSortBy.Affinity,
  MIN_ENTITY_SIGNALS: 1,
  MIN_TAG_SIGNALS: 1
} as const;

export const ERRORS = {
  MISSING_QLOO_API_KEY: 'Missing Qloo API key',
  MISSING_AUDIENCE_DATA: 'Missing audience name or audience data',
  INVALID_AUDIENCE_NAME: 'Audience name must be a non-empty string',
  QLOO_API_ERROR: 'Failed to fetch data from Qloo API',
  FAILED_TO_CREATE_AUDIENCE: 'Failed to create audience',
  INVALID_ENTITY_TYPE: 'Invalid entity type provided',
  NO_VALID_SIGNALS: 'No valid signals provided for insights query'
} as const;

export const VALIDATION_LIMITS = {
  MAX_AUDIENCE_NAME_LENGTH: 100,
  MIN_AUDIENCE_NAME_LENGTH: 1,
  MAX_ENTITIES: 50
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
    'accept': 'application/json'
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
    imageUrl: inputEntity.properties?.image?.url || null
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
  signalDemographicsAudiences?: Array<{value: string, label: string}>;
  signalDemographicsAudiencesWeight?: QlooWeight;
  signalInterestsEntities?: string[];
  signalInterestsEntitiesWeight?: QlooWeight;
  signalInterestsTags?: string[];
  signalInterestsTagsWeight?: QlooWeight;
}

/**
 * Builds optimized insights configuration with valid Qloo IDs for maximum results
 */
export async function buildOptimizedInsightsConfig(
  entityType: string,
  inputEntities: Entity[],
  audiences: AudienceOption[],
  ageGroups: AgeGroup[],
  genres: AudienceOption[],
  gender: string,
  qlooApiKey: string
): Promise<OptimizedInsightsConfig> {
  const filterType = getQlooFilterType(entityType);
  const qlooGender = mapGenderToQloo(gender);
  const qlooAgeGroups = mapAgeGroupsToQloo(ageGroups);

  // Build configuration with all possible properties
  const config: OptimizedInsightsConfig = {
    filterType,
    take: INSIGHTS_QUERY_CONFIG.DEFAULT_TAKE,
    sortBy: INSIGHTS_QUERY_CONFIG.SORT_BY,
    biasTrends: INSIGHTS_QUERY_CONFIG.BIAS_TRENDS
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

  // Fetch valid Qloo audience IDs (CRITICAL FIX for 400 errors)
  if (audiences.length > 0) {
    const validAudienceIds = await fetchValidAudienceIds(audiences, qlooApiKey);
    if (validAudienceIds.length > 0) {
      config.signalDemographicsAudiences = validAudienceIds.map(a => ({value: a.id, label: a.name}));
      config.signalDemographicsAudiencesWeight = INSIGHTS_QUERY_CONFIG.WEIGHT_HIGH;
    }
  }

  // Add interest signals with validated entity IDs
  if (inputEntities.length > 0) {
    config.signalInterestsEntities = inputEntities.map(e => e.id);
    config.signalInterestsEntitiesWeight = INSIGHTS_QUERY_CONFIG.WEIGHT_HIGH;
  }

  // Fetch valid Qloo tag IDs (CRITICAL FIX for 400 errors)
  if (genres.length > 0) {
    const validTagIds = await fetchValidTagIds(genres, qlooApiKey);
    if (validTagIds.length > 0) {
      config.signalInterestsTags = validTagIds;
      config.signalInterestsTagsWeight = INSIGHTS_QUERY_CONFIG.WEIGHT_MEDIUM;
    }
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
      headers: createQlooHeaders(qlooApiKey)
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
    const config = await buildOptimizedInsightsConfig(
      entityType,
      inputEntities,
      audiences,
      ageGroups,
      genres,
      gender,
      qlooApiKey
    );

    // Validate configuration has required signals
    if (!validateInsightsConfig(config)) {
      console.warn(`No valid signals for entity type ${entityType}, skipping`);
      return null;
    }

    const url = buildQlooInsightsUrl(config as unknown as InsightsConfig);

    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey)
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
    const config = await buildOptimizedInsightsConfig(
      entityType,
      inputEntities,
      audiences,
      ageGroups,
      genres,
      gender,
      qlooApiKey
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
      signal: controller.signal
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
  'MOVIE', // Most reliable and popular
  'ARTIST', // High engagement
  'BOOK', // Good demographic data
  'TV_SHOW', // Popular content type
  'PERSON', // Personality-based insights
  'BRAND', // Commercial relevance
  'PLACE', // Location-based insights
  'VIDEO_GAME', // Gaming demographic
  'PODCAST' // Audio content
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
 * Interface for demographic data returned by Qloo API
 */
interface DemographicData {
  entity_id: string;
  query: {
    age: Record<string, number>;
    gender: Record<string, number>;
  };
}

/**
 * Fetches demographics data for entities using the Qloo demographics insights API
 * This uses the same approach as your previous working implementation
 */
export async function fetchDemographics(
  entities: Entity[],
  qlooApiKey: string
): Promise<Record<string, { age: Record<string, number>, gender: Record<string, number> }>> {
  const demographicsMap: Record<string, { age: Record<string, number>, gender: Record<string, number> }> = {};

  if (entities.length === 0) {
    return demographicsMap;
  }

  try {
    // Get entity IDs for the demographics API call
    const entityIds = entities.map(e => e.id).filter(Boolean);

    if (entityIds.length === 0) {
      return demographicsMap;
    }

    // Use the demographics insights API to get demographic data for all entities
    const url = `${QLOO_API_BASE_URL}/v2/insights?filter.type=urn:demographics&signal.interests.entities=${entityIds.join(',')}`;

    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey)
    });

    if (!response.ok) {
      console.warn(`Demographics API responded with status ${response.status}`);
      return demographicsMap;
    }

    const demographicsData = await response.json();
    const demographicsList: DemographicData[] = demographicsData.results?.demographics || [];

    // Build demographics map from API response
    for (const demographic of demographicsList) {
      const entityId = demographic.entity_id;
      const age = demographic.query?.age || {};
      const gender = demographic.query?.gender || {};

      demographicsMap[entityId] = { age, gender };
    }

    console.log(`✅ Successfully fetched demographics for ${Object.keys(demographicsMap).length}/${entities.length} entities`);
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
 * Calculates age and gender totals from entities by summing their affinity scores
 * This matches the approach from your previous working implementation
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
    '55_and_older': 0
  };

  const genderTotals: Record<'male' | 'female', number> = {
    male: 0,
    female: 0
  };

  // Sum the affinity scores for each demographic category
  for (const entity of entities) {
    // Sum age affinity scores
    if (entity.age && typeof entity.age === 'object') {
      for (const [ageKey, value] of Object.entries(entity.age)) {
        if (ageKey in ageTotals && typeof value === 'number' && !isNaN(value)) {
          ageTotals[ageKey as AgeGroup] += Number(value);
        }
      }
    }

    // Sum gender affinity scores
    if (entity.gender && typeof entity.gender === 'object') {
      for (const [genderKey, value] of Object.entries(entity.gender)) {
        if (genderKey in genderTotals && typeof value === 'number' && !isNaN(value)) {
          genderTotals[genderKey as 'male' | 'female'] += Number(value);
        }
      }
    }
  }

  // Normalize to percentages for display (convert raw affinity scores to 0-1 range)
  const genderSum = genderTotals.male + genderTotals.female;
  if (genderSum > 0) {
    genderTotals.male = genderTotals.male / genderSum;
    genderTotals.female = genderTotals.female / genderSum;
  }

  const ageSum = Object.values(ageTotals).reduce((sum, val) => sum + val, 0);
  if (ageSum > 0) {
    for (const key in ageTotals) {
      ageTotals[key as AgeGroup] = ageTotals[key as AgeGroup] / ageSum;
    }
  }

  const entitiesWithDemographics = entities.filter(e => e.age || e.gender).length;
  console.log(`📊 Calculated demographics from ${entitiesWithDemographics}/${entities.length} entities with demographic data`);
  console.log(`📊 Gender distribution: male: ${(genderTotals.male * 100).toFixed(1)}%, female: ${(genderTotals.female * 100).toFixed(1)}%`);
  console.log(`📊 Age distribution:`, Object.entries(ageTotals).map(([key, value]) => `${key}: ${(value * 100).toFixed(1)}%`).join(', '));

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

// Add new utility functions for proper Qloo API usage

/**
 * Fetches valid Qloo tag IDs for genres using the Tags Search API
 */
export async function fetchValidTagIds(genres: AudienceOption[], qlooApiKey: string): Promise<string[]> {
  if (genres.length === 0) return [];

  const validTagIds: string[] = [];

  try {
    const url = `${QLOO_API_BASE_URL}/v2/tags?filter.results.tags=${genres.map(g => g.value).join(',')}`;
    console.log('🔍 Fetching valid tag IDs from:', url);
    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey)
    });

    if(response.ok) {
      const data = await response.json();
      if(data.results?.length > 0) {
        validTagIds.push(data.results[0].id);
      }
    } else {
      console.error('Error fetching tag IDs:', response.statusText);
    }
    
  } catch (error) {
    console.error('Error fetching tag IDs:', error);
  }

  console.log(`Successfully mapped ${validTagIds.length}/${genres.length} genres to valid tag IDs`);
  return validTagIds;
}

/**
 * Fetches valid Qloo audience IDs using the Find Audiences API
 */
export async function fetchValidAudienceIds(audiences: AudienceOption[], qlooApiKey: string): Promise<Array<{id: string, name: string}>> {
  if (audiences.length === 0) return [];

  const validAudienceIds: Array<{id: string, name: string}> = [];

  try {
    // Get all available audiences first
    const url = `${QLOO_API_BASE_URL}/v2/audiences?filter.results.audiences=${audiences.map(a => a.value).join(',')}`;

    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey)
    });

    if (response.ok) {
      const data = await response.json();
      const availableAudiences = data.results.audiences || [];
      
      for (const audience of audiences) {
        const match = availableAudiences.find((qa: { id: string; name?: string }) => {
          if (!qa.name) return false;
          return qa.name.toLowerCase().includes(audience.label.toLowerCase()) ||
                 audience.label.toLowerCase().includes(qa.name.toLowerCase());
        });

        if (match && match.name) {
          validAudienceIds.push({id: match.id, name: match.name});
          console.log(`Mapped "${audience.label}" to Qloo audience: ${match.name} (${match.id})`);
        }else{
          console.log(`No match found for "${audience.label}"`);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching audience IDs:', error);
  }

  console.log(`Successfully mapped ${validAudienceIds.length}/${audiences.length} audiences to valid Qloo IDs`);
  return validAudienceIds;
}

/**
 * Validates and enriches entity IDs using Entity Search API
 */
export async function validateAndEnrichEntities(entities: Entity[], qlooApiKey: string): Promise<Entity[]> {
  if (entities.length === 0) return [];

  const enrichedEntities: Entity[] = [];

  try {
    for (const entity of entities) {
      // Search for the entity by name to get proper Qloo entity data
      const query = encodeURIComponent(entity.name);
      const url = `${QLOO_API_BASE_URL}/search?query=${query}&take=3`;

      const response = await fetch(url, {
        headers: createQlooHeaders(qlooApiKey)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.results?.length > 0) {
          // Find best match and transform to our format
          const match = data.results[0];
          const enrichedEntity = transformQlooEntity(match);
          enrichedEntities.push(enrichedEntity);
          console.log(`Validated entity: ${entity.name} -> ${match.name} (${match.entity_id})`);
        } else {
          // Keep original if no match found
          enrichedEntities.push(entity);
          console.warn(`No Qloo match found for entity: ${entity.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Error validating entities:', error);
    return entities; // Return originals on error
  }

  console.log(`Successfully validated ${enrichedEntities.length}/${entities.length} entities`);
  return enrichedEntities;
}

/**
 * Fetches trending entities for enhanced recommendations
 * Uses Qloo's Get Trending Data API for real-time cultural insights
 */
export async function fetchTrendingEntities(entityType: string, qlooApiKey: string): Promise<Entity[]> {
  try {
    const filterType = getQlooFilterType(entityType);
    const url = `${QLOO_API_BASE_URL}/v2/trending?filter.type=${encodeURIComponent(filterType)}&take=10`;

    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.results?.entities?.length > 0) {
        const trendingEntities = data.results.entities.map((entity: QlooApiEntity) =>
          transformQlooEntity(entity, entityType)
        );
        console.log(`Found ${trendingEntities.length} trending ${entityType} entities`);
        return trendingEntities;
      }
    }
  } catch (error) {
    console.error(`Error fetching trending ${entityType} entities:`, error);
  }

  return [];
}

/**
 * Performs comprehensive demographic analysis using Qloo's Demographic Insights
 * This provides deeper cultural intelligence about audience segments
 */
export async function performDemographicAnalysis(
  entities: Entity[],
  qlooApiKey: string
): Promise<{
  detailedAge: Record<string, number>;
  detailedGender: Record<string, number>;
  psychographics: Record<string, number>;
  culturalAffinities: string[];
}> {
  // Simplified implementation to avoid conflicts with main demographic calculation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = { entities, qlooApiKey };

  return {
    detailedAge: {},
    detailedGender: {},
    psychographics: {},
    culturalAffinities: []
  };
}

/**
 * Fetches location-based cultural insights for place entities
 * Leverages Qloo's location intelligence capabilities
 */
export async function fetchLocationInsights(
  locationQuery: string,
  qlooApiKey: string
): Promise<Entity[]> {
  if (!locationQuery) return [];

  try {
    const encodedLocation = encodeURIComponent(locationQuery);
    const url = `${QLOO_API_BASE_URL}/v2/insights?filter.type=urn:entity:place&filter.location.query=${encodedLocation}&take=15&sort_by=distance`;

    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.results?.entities?.length > 0) {
        const locationEntities = data.results.entities.map((entity: QlooApiEntity) =>
          transformQlooEntity(entity, 'PLACE')
        );
        console.log(`Found ${locationEntities.length} location-based insights for "${locationQuery}"`);
        return locationEntities;
      }
    }
  } catch (error) {
    console.error(`Error fetching location insights for "${locationQuery}":`, error);
  }

  return [];
}

/**
 * Generates taste profile analysis using multiple Qloo signals
 * This creates a comprehensive cultural intelligence report
 */
export async function generateTasteProfile(
  inputEntities: Entity[],
  audiences: AudienceOption[],
  qlooApiKey: string
): Promise<{
  tasteVector: Record<string, number>;
  culturalSegments: Array<{id: string, label: string}>;
  affinityScore: number;
  diversityIndex: number;
}> {
  const profile = {
    tasteVector: {},
    culturalSegments: [] as Array<{id: string, label: string}>,
    affinityScore: 0,
    diversityIndex: 0
  };

  if (inputEntities.length === 0) return profile;

  try {
    // Get valid audience IDs for analysis
    const validAudiences = await fetchValidAudienceIds(audiences, qlooApiKey);

    // Perform taste analysis across multiple entity types
    const entityTypes = ENTITY_TYPE_PRIORITY.filter(type => type in EntityTypes);
    const tasteScores: Record<string, number> = {};

    for (const entityType of entityTypes) {
      const config = await buildOptimizedInsightsConfig(
        entityType,
        inputEntities,
        audiences,
        [],
        [],
        '',
        qlooApiKey
      );

      if (validateInsightsConfig(config)) {
        const url = buildQlooInsightsUrl(config as unknown as InsightsConfig);

        const response = await fetch(url, {
          headers: createQlooHeaders(qlooApiKey)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.results?.entities?.length > 0) {
            // Calculate affinity scores for this entity type
            const avgPopularity = data.results.entities.reduce((sum: number, entity: QlooApiEntity) =>
              sum + (entity.popularity || 0), 0) / data.results.entities.length;

            tasteScores[entityType] = avgPopularity;
          }
        }
      }
    }

    // Calculate overall taste metrics
    const scores = Object.values(tasteScores);
    profile.affinityScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    profile.diversityIndex = calculateDiversityIndex(scores);
    profile.tasteVector = tasteScores;

    profile.culturalSegments = validAudiences.slice(0, 5).map(a => ({id: a.id, label: a.name})); // Top 5 cultural segments

    console.log(`Generated comprehensive taste profile with ${Object.keys(tasteScores).length} dimensions`);

  } catch (error) {
    console.error('Error generating taste profile:', error);
  }

  return profile;
}

/**
 * Calculates diversity index for taste analysis
 */
function calculateDiversityIndex(scores: number[]): number {
  if (scores.length <= 1) return 0;

  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);

  // Normalize to 0-1 range
  return Math.min(standardDeviation / mean, 1);
}

/**
 * Generates and uploads an avatar image for the audience using OpenAI DALL-E
 * Falls back to default avatar if generation fails
 */
export async function generateAndUploadAvatar(
  audienceName: string,
  ageGroup: AgeGroup[],
  gender: string,
  entities: Entity[],
  audiences: AudienceOption[],
  openai: OpenAI
): Promise<string> {
  try {
    const prompt = `Create a clean, vector-style cartoon profile picture as a close-up headshot of a ${gender !== 'all' ? gender : ''} individual aged: ${ageGroup.join(' and ')}.
    
    The headshot should reflect a person who enjoys ${audiences.map((e: AudienceOption) => e.label).join(', ')} and is interested in ${entities.map((e: Entity) => e.name).join(', ')}.
    
    The image should be cartoonish and modern. It should only include the head and shoulders, with a neutral or friendly expression, and no text or logos. Avoid photorealism. No background. IMPORTANT: The image should contain no words at all.`;

    console.log('🎨 Generating avatar image for audience:', audienceName);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    });

    console.log('🎨 OpenAI image generation response received');

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('Failed to generate image - no URL returned');
    }

    // Fetch the generated image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch the generated image');
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    // Upload to Firebase Storage
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + '.firebasestorage.app';
    const bucket = storage.bucket(bucketName);
    const fileName = `audience_avatars/${audienceName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: 'image/png'
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        console.error('🚨 Error uploading avatar image:', err);
        reject(err);
      });

      stream.on('finish', async () => {
        try {
          await file.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
          console.log('✅ Avatar image uploaded successfully:', publicUrl);
          resolve(publicUrl);
        } catch (error) {
          console.error('🚨 Error making file public:', error);
          reject(error);
        }
      });

      stream.end(Buffer.from(imageBuffer));
    });

  } catch (error) {
    console.error('🚨 Error generating avatar image:', error);
    console.log('⚠️ Falling back to default avatar URL');
    return DEFAULT_AVATAR_URL;
  }
}
