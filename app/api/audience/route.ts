import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { requireAuth } from '@/lib/authMiddleware';
import { AudienceApiData } from '@/types';
import { 
  validateRequestData,
  fetchInputEntities,
  fetchRecommendedEntities,
  fetchDemographics,
  addDemographicsToEntities,
  calculateDemographicTotals,
  roundNumericObject,
  sanitizeForFirestore,
  generateSimpleTasteProfile,
  calculateAnalysisMetrics,
  ERRORS,
  DEFAULT_AVATAR_URL
} from './utils';


export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const user = await requireAuth(request);
    const uid = user.uid;

    const { audienceName, audienceData }: { audienceName: string; audienceData: AudienceApiData } = await request.json();
    
    const qlooApiKey = process.env.QLOO_API_KEY;
    if (!qlooApiKey) {
      return NextResponse.json({ error: ERRORS.MISSING_QLOO_API_KEY }, { status: 500 });
    }

    const validationError = validateRequestData(audienceName, audienceData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { entities, audienceOptions, gender, ageGroup, genres } = audienceData;

    const allAudienceOptions = Object.values(audienceOptions).flat();

    const inputEntities = await fetchInputEntities(entities, qlooApiKey);

    const recommendedEntities = await fetchRecommendedEntities(
      inputEntities,
      allAudienceOptions,
      ageGroup,
      genres,
      gender,
      qlooApiKey
    );

    const allEntities = [...inputEntities, ...recommendedEntities];

    const demographicsMap = await fetchDemographics(allEntities, qlooApiKey);

    const entitiesWithDemo = addDemographicsToEntities(inputEntities, demographicsMap);
    const recommendedEntitiesWithDemo = addDemographicsToEntities(recommendedEntities, demographicsMap);

    const { ageTotals, genderTotals } = calculateDemographicTotals([
      ...entitiesWithDemo,
      ...recommendedEntitiesWithDemo,
    ]);

    const categorizedSelections = {
      genres: genres || [],
      audienceOptions: audienceOptions || {}
    };

    const tasteProfile = generateSimpleTasteProfile(entitiesWithDemo, allAudienceOptions);
    
    const processingTimeMs = Date.now() - startTime;
    const analysisMetrics = calculateAnalysisMetrics(
      entitiesWithDemo,
      recommendedEntitiesWithDemo,
      demographicsMap,
      processingTimeMs
    );

    const docRef = db.collection('users').doc(uid).collection('audiences').doc();
    const newAudience = {
        id: docRef.id,
        name: audienceName,
        entities: entitiesWithDemo,
        recommendedEntities: recommendedEntitiesWithDemo,
        demographics: allAudienceOptions,
        categorizedSelections,
        ageTotals: roundNumericObject(ageTotals),
        genderTotals: roundNumericObject(genderTotals),
        imageUrl: DEFAULT_AVATAR_URL,
        qlooIntelligence: {
          tasteProfile,
          analysisMetrics
        },
      };
    const sanitizedAudience = sanitizeForFirestore(newAudience);
    await docRef.set(sanitizedAudience);

    console.log("sanitizedAudience", sanitizedAudience);

    return NextResponse.json(sanitizedAudience);
  } catch (error) {
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