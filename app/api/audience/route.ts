import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { requireAuth } from '@/lib/authMiddleware';
import OpenAI from 'openai';
import { AudienceApiData } from '@/types';
import { 
  generateAndUploadAvatar,
  validateRequestData,
  fetchInputEntities,
  fetchRecommendedEntities,
  fetchDemographics,
  addDemographicsToEntities,
  calculateDemographicTotals,
  roundNumericObject,
  sanitizeForFirestore,
  ERRORS,
  DEFAULT_AVATAR_URL
} from './utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Main POST handler for creating audiences
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth(request);
    const uid = user.uid;

    // Parse and validate request data
    const { audienceName, audienceData }: { audienceName: string; audienceData: AudienceApiData } = await request.json();
    
    const qlooApiKey = process.env.QLOO_API_KEY;
    if (!qlooApiKey) {
      return NextResponse.json({ error: ERRORS.MISSING_QLOO_API_KEY }, { status: 500 });
    }

    const validationError = validateRequestData(audienceName, audienceData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { entities, audiences, gender, ageGroup, genres } = audienceData;

    // Fetch input entities from Qloo API
    const inputEntities = await fetchInputEntities(entities, qlooApiKey);

    // Fetch recommended entities
    const recommendedEntities = await fetchRecommendedEntities(
      inputEntities,
      audiences,
      ageGroup,
      genres,
      gender,
      qlooApiKey
    );

    // Combine all entities for demographics lookup
    const allEntities = [...inputEntities, ...recommendedEntities];

    // Fetch demographics data
    const demographicsMap = await fetchDemographics(allEntities, qlooApiKey);

    // Add demographics to entities
    const entitiesWithDemo = addDemographicsToEntities(inputEntities, demographicsMap);
    const recommendedEntitiesWithDemo = addDemographicsToEntities(recommendedEntities, demographicsMap);

    // Calculate demographic totals
    const { ageTotals, genderTotals } = calculateDemographicTotals([
      ...entitiesWithDemo,
      ...recommendedEntitiesWithDemo,
    ]);

    // Generate avatar
    const imageUrl = await generateAndUploadAvatar(
      openai,
      audienceName,
      ageGroup,
      gender,
      entities,
      audiences
    );

    // Create audience object
    const newAudience = {
      name: audienceName,
      entities: entitiesWithDemo,
      recommendedEntities: recommendedEntitiesWithDemo,
      demographics: audiences,
      ageTotals: roundNumericObject(ageTotals),
      genderTotals: roundNumericObject(genderTotals),
      imageUrl: imageUrl || DEFAULT_AVATAR_URL,
    };

    console.log("newAudience", newAudience);

    // Save to database
    const docRef = db.collection('users').doc(uid).collection('audiences').doc();
    const sanitizedAudience = sanitizeForFirestore(newAudience);
    await docRef.set(sanitizedAudience);

    return NextResponse.json({ ...newAudience, id: docRef.id });
  } catch (error) {
    // Handle authentication errors
    if (error instanceof NextResponse) {
      return error;
    }

    console.error('Error creating audience:', error);
    return NextResponse.json(
      { error: ERRORS.FAILED_TO_CREATE_AUDIENCE },
      { status: 500 }
    );
  }
}