import { AgeGroup, Gender, Entity, AudienceOption, AudienceApiData, QlooApiEntity, DemographicData } from '@/types';
import { EntityType } from '@/types/entities';
import { EntityTypes } from '@/constants/entity';
import { storage } from '@/lib/firebaseAdmin';
import OpenAI from 'openai';

// Constants
export const QLOO_API_BASE_URL = 'https://hackathon.api.qloo.com';
export const QLOO_INSIGHTS_URL = `${QLOO_API_BASE_URL}/v2/insights`;
export const DEFAULT_AVATAR_URL = 'https://cdn-icons-png.flaticon.com/512/1053/1053244.png';
export const UNKNOWN_ENTITY_TYPE = 'UNKNOWN';
export const DECIMAL_PRECISION = 4;

// Error messages
export const ERRORS = {
  MISSING_QLOO_API_KEY: 'Missing Qloo API key',
  MISSING_AUDIENCE_DATA: 'Missing audience name or audience data',
  INVALID_AUDIENCE_NAME: 'Audience name must be a non-empty string',
  QLOO_API_ERROR: 'Failed to fetch data from Qloo API',
  FAILED_TO_CREATE_AUDIENCE: 'Failed to create audience',
} as const;

// Input validation limits
export const VALIDATION_LIMITS = {
  MAX_AUDIENCE_NAME_LENGTH: 100,
  MIN_AUDIENCE_NAME_LENGTH: 1,
  MAX_ENTITIES: 50,
} as const;

/**
 * Validates the request payload
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

  const { entities, audiences, genres } = audienceData;

  if (!Array.isArray(entities) || !Array.isArray(audiences) || !Array.isArray(genres)) {
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
 * Transforms Qloo API entity to internal Entity format
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
 * Fetches input entities from Qloo API
 */
export async function fetchInputEntities(entities: Entity[], qlooApiKey: string): Promise<Entity[]> {
  if (entities.length === 0) {
    return [];
  }

  const entityIds = entities.map(e => e.id).join(',');
  const url = `${QLOO_API_BASE_URL}/entities?entity_ids=${entityIds}`;
  
  try {
    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey),
    });

    if (!response.ok) {
      throw new Error(`Qloo API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data?.results?.length) {
      return [];
    }

    return data.results.map((entity: QlooApiEntity) => transformQlooEntity(entity));
  } catch (error) {
    console.error('Error fetching input entities:', error);
    throw new Error(ERRORS.QLOO_API_ERROR);
  }
}

/**
 * Builds Qloo insights URL with parameters
 */
export function buildInsightsUrl(
  entityType: string,
  audienceIds: string,
  ageGroups: string,
  genres: string,
  entityIds?: string,
  gender?: string
): string {
  let url = `${QLOO_INSIGHTS_URL}?filter.type=${entityType}&signal.demographics.audiences=${audienceIds}&signal.demographics.age=${ageGroups}&filter.tags=${genres}`;
  
  if (entityIds) {
    url += `&signal.interests.entities=${entityIds}`;
  }
  
  if (gender === 'male' || gender === 'female') {
    url += `&signal.demographics.gender=${gender}`;
  }
  
  return url;
}

/**
 * Fetches recommended entities for a specific entity type
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
    const entityIds = inputEntities.map(e => e.id).join(',');
    const audienceIds = audiences.map(e => e.value).join(',');
    const genreIds = genres.map(e => e.value).join(',');
    const ageGroupIds = ageGroups.join(',');
    
    const url = buildInsightsUrl(
      EntityTypes[entityType as keyof typeof EntityTypes],
      audienceIds,
      ageGroupIds,
      genreIds,
      entityIds,
      gender
    );

    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data?.results?.entities?.length) {
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
 * Fetches all recommended entities across different types
 */
export async function fetchRecommendedEntities(
  inputEntities: Entity[],
  audiences: AudienceOption[],
  ageGroups: AgeGroup[],
  genres: AudienceOption[],
  gender: string,
  qlooApiKey: string
): Promise<Entity[]> {
  const entityPromises = Object.keys(EntityTypes).map(entityType =>
    fetchRecommendedEntityForType(
      entityType,
      inputEntities,
      audiences,
      ageGroups,
      genres,
      gender,
      qlooApiKey
    )
  );

  const results = await Promise.all(entityPromises);
  return results.filter((entity): entity is Entity => entity !== null);
}

/**
 * Fetches demographics data for entities
 */
export async function fetchDemographics(entities: Entity[], qlooApiKey: string): Promise<Record<string, { age: Record<string, number>, gender: Record<string, number> }>> {
  const entityIds = entities.map(e => e.id).filter(Boolean).join(',');
  
  if (!entityIds) {
    return {};
  }

  try {
    const url = `${QLOO_INSIGHTS_URL}?filter.type=urn:demographics&signal.interests.entities=${entityIds}`;
    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey),
    });

    if (!response.ok) {
      throw new Error(`Demographics API responded with status ${response.status}`);
    }

    const data = await response.json();
    const demographicsList: DemographicData[] = data.results?.demographics || [];

    const demographicsMap: Record<string, { age: Record<string, number>, gender: Record<string, number> }> = {};
    
    for (const demographic of demographicsList) {
      demographicsMap[demographic.entity_id] = {
        age: demographic.query.age,
        gender: demographic.query.gender,
      };
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
 * Calculates age and gender totals from entities
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

  for (const entity of entities) {
    if (entity.age) {
      for (const [ageKey, value] of Object.entries(entity.age)) {
        if (ageKey in ageTotals) {
          ageTotals[ageKey as AgeGroup] += Number(value);
        }
      }
    }

    if (entity.gender) {
      for (const [genderKey, value] of Object.entries(entity.gender)) {
        if (genderKey in genderTotals) {
          genderTotals[genderKey as 'male' | 'female'] += Number(value);
        }
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
    result[key] = Math.round((obj[key] + Number.EPSILON) * multiplier) / multiplier;
  }
  
  return result as T;
}

/**
 * Sanitizes an object for Firestore by converting undefined values to null
 * Firestore doesn't accept undefined values, so we need to clean the data
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

export async function generateAndUploadAvatar(openai: OpenAI, audienceName: string, ageGroup: AgeGroup[], gender: Gender, entities: Entity[], audiences: AudienceOption[]): Promise<string | null> {
    return null;
    const prompt = `Create a clean, vector-style cartoon profile picture as a close-up headshot of a ${gender !== "all" ? gender : ""} individual aged: ${ageGroup.join(" and ")}.
    
    The headshot should reflect a person who enjoys ${audiences.map((e: AudienceOption) => e.label).join(", ")} and is interested in ${entities.map((e: Entity) => e.name).join(", ")}.
    
    The image should be cartoonish and modern. It should only include the head and shoulders, with a neutral or friendly expression, and no text or logos. Avoid photorealism. No background. IMPORTANT: The image should contain no words at all.`;
    
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    console.log("open ai response", response);
  
    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('Failed to generate image.');
    }
  
    const imageResponse = await fetch(imageUrl as string);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch the generated image.');
    }
    const imageBuffer = await imageResponse.arrayBuffer();
  
    const bucketName = `${process.env.FIREBASE_STORAGE_BUCKET}`;
    const bucket = storage.bucket(bucketName);
    const fileName = `audience_avatars/${audienceName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    const file = bucket.file(fileName);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'image/png',
      },
    });
  
    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('finish', async () => {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        resolve(publicUrl);
      });
      stream.end(Buffer.from(imageBuffer));
    });
}