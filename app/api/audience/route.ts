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
  ERRORS,
  DEFAULT_AVATAR_URL,
  INSIGHTS_QUERY_CONFIG
} from './utils';

/**
 * Enhanced POST handler for creating audiences with optimized insights queries
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth(request);
    const uid = user.uid;

    // Parse and validate request data
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { audienceName, audienceData }: { audienceName: string; audienceData: AudienceApiData } = requestBody;
    
    const qlooApiKey = process.env.QLOO_API_KEY;
    if (!qlooApiKey) {
      console.error('Qloo API key is missing from environment variables');
      return NextResponse.json({ error: ERRORS.MISSING_QLOO_API_KEY }, { status: 500 });
    }

    // Enhanced validation
    const validationError = validateRequestData(audienceName, audienceData);
    if (validationError) {
      console.warn('Validation failed:', validationError);
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { entities, audienceOptions, gender, ageGroup, genres } = audienceData;

    // Log the input parameters for debugging
    console.log('Creating audience with params:', {
      audienceName,
      entityCount: entities.length,
      audienceOptionsCount: Object.values(audienceOptions).flat().length,
      ageGroupCount: ageGroup.length,
      genreCount: genres?.length || 0,
      gender
    });

    // Flatten audience options for backward compatibility with existing functions
    const allAudienceOptions = Object.values(audienceOptions).flat();

    // Step 1: Fetch and validate input entities
    console.log('Fetching input entities...');
    const inputEntities = await fetchInputEntities(entities, qlooApiKey);
    console.log(`Successfully fetched ${inputEntities.length} input entities`);

    // Step 2: Fetch recommended entities with optimized queries
    console.log('Fetching recommended entities with optimized queries...');
    const startTime = Date.now();
    
    const recommendedEntities = await fetchRecommendedEntities(
      inputEntities,
      allAudienceOptions,
      ageGroup,
      genres || [],
      gender,
      qlooApiKey
    );
    
    const fetchTime = Date.now() - startTime;
    console.log(`Fetched ${recommendedEntities.length} recommended entities in ${fetchTime}ms`);

    // Step 3: Validate we have enough entities for a good audience
    const totalEntities = inputEntities.length + recommendedEntities.length;
    if (totalEntities === 0) {
      console.warn('No entities found for audience creation');
      return NextResponse.json(
        { error: 'Unable to find any entities matching your criteria. Please try different selections.' },
        { status: 400 }
      );
    }

    // Warn if we have very few recommended entities
    if (recommendedEntities.length < 3) {
      console.warn(`Only found ${recommendedEntities.length} recommended entities. Results may be limited.`);
    }

    // Step 4: Combine all entities for demographics lookup
    const allEntities = [...inputEntities, ...recommendedEntities];
    console.log(`Processing demographics for ${allEntities.length} total entities`);

    // Step 5: Fetch demographics data with enhanced error handling
    const demographicsStartTime = Date.now();
    const demographicsMap = await fetchDemographics(allEntities, qlooApiKey);
    const demographicsTime = Date.now() - demographicsStartTime;
    
    const entitiesWithDemographics = Object.keys(demographicsMap).length;
    console.log(`Fetched demographics for ${entitiesWithDemographics}/${allEntities.length} entities in ${demographicsTime}ms`);

    // Step 6: Add demographics to entities
    const entitiesWithDemo = addDemographicsToEntities(inputEntities, demographicsMap);
    const recommendedEntitiesWithDemo = addDemographicsToEntities(recommendedEntities, demographicsMap);

    // Step 7: Calculate demographic totals with improved accuracy
    const { ageTotals, genderTotals } = calculateDemographicTotals([
      ...entitiesWithDemo,
      ...recommendedEntitiesWithDemo,
    ]);

    // Step 8: Create comprehensive categorized selections structure
    const categorizedSelections = {
      genres: genres || [],
      audienceOptions: audienceOptions || {},
      // Add metadata for debugging and analytics
      metadata: {
        totalInputEntities: inputEntities.length,
        totalRecommendedEntities: recommendedEntities.length,
        entitiesWithDemographics,
        processingTimeMs: Date.now() - startTime,
        queryConfiguration: {
          defaultTake: INSIGHTS_QUERY_CONFIG.DEFAULT_TAKE,
          biasTrends: INSIGHTS_QUERY_CONFIG.BIAS_TRENDS,
          sortBy: INSIGHTS_QUERY_CONFIG.SORT_BY
        }
      }
    };

    // Step 9: Create the final audience object
    const newAudience = {
      name: audienceName,
      entities: entitiesWithDemo,
      recommendedEntities: recommendedEntitiesWithDemo,
      demographics: allAudienceOptions, // Keep for backward compatibility
      categorizedSelections,
      ageTotals: roundNumericObject(ageTotals),
      genderTotals: roundNumericObject(genderTotals),
      imageUrl: DEFAULT_AVATAR_URL,
      createdAt: new Date().toISOString(),
      version: '2.0', // Version to track enhanced audience format
    };

    console.log('Created audience object:', {
      name: newAudience.name,
      entitiesCount: newAudience.entities.length,
      recommendedEntitiesCount: newAudience.recommendedEntities.length,
      ageTotalsSum: Object.values(newAudience.ageTotals).reduce((sum, val) => sum + val, 0),
      genderTotalsSum: Object.values(newAudience.genderTotals).reduce((sum, val) => sum + val, 0),
    });

    // Step 10: Save to database with enhanced error handling
    try {
      const docRef = db.collection('users').doc(uid).collection('audiences').doc();
      const sanitizedAudience = sanitizeForFirestore(newAudience);
      
      await docRef.set(sanitizedAudience);
      
      console.log(`Successfully created audience ${audienceName} with ID ${docRef.id}`);
      
      return NextResponse.json({ 
        ...newAudience, 
        id: docRef.id,
        success: true,
        processingTimeMs: Date.now() - startTime
      });
      
    } catch (firestoreError) {
      console.error('Firestore save failed:', firestoreError);
      return NextResponse.json(
        { error: 'Failed to save audience to database' },
        { status: 500 }
      );
    }

  } catch (error) {
    // Handle authentication errors (NextResponse objects)
    if (error instanceof NextResponse) {
      return error;
    }

    // Log detailed error information
    console.error('Unexpected error in audience creation:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Return appropriate error response
    if (error instanceof Error && error.message.includes('Qloo API')) {
      return NextResponse.json(
        { error: 'External service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: ERRORS.FAILED_TO_CREATE_AUDIENCE },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint to verify API connectivity
 */
export async function GET() {
  try {
    const qlooApiKey = process.env.QLOO_API_KEY;
    if (!qlooApiKey) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Qloo API key not configured' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0'
    });
  } catch {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Service unhealthy' 
    }, { status: 500 });
  }
}