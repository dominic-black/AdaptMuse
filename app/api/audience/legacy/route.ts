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
  validateAndEnrichEntities,
  fetchTrendingEntities,
  performDemographicAnalysis,
  generateTasteProfile,
  generateAndUploadAvatar,
  createQlooHeaders,
  QLOO_API_BASE_URL,
  ERRORS,
} from './utils';
import OpenAI from 'openai';


// ===============================
// TYPE DEFINITIONS
// ===============================

interface TrendingAnalysisData {
  byCategory: Record<string, {
    entities: unknown[];
    count: number;
    avgPopularity: number;
  }>;
  mostTrendingCategory: string;
  totalTrendingEntities: number;
}

interface CulturalAnalysis {
  correlations: unknown[];
  culturalClusters: unknown[];
  affinityMatrix: Record<string, unknown>;
  analysisConfidence: number;
}

interface CrossCulturalInsights {
  globalRelevance: number;
  culturalBridges: unknown[];
  regionalVariations: Record<string, number>;
  universalThemes: unknown[];
}

interface TasteProfileInput {
  affinityScore: number;
  diversityIndex: number;
  culturalSegments: string[];
  tasteVector: Record<string, number>;
}



interface EntityData {
  id: string;
  name: string;
  type: string;
  popularity?: number;
}

interface DemographicsMap {
  [entityId: string]: {
    age?: Record<string, number>;
    gender?: Record<string, number>;
  };
}

// ===============================
// MAIN API HANDLER
// ===============================

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authentication
    const user = await requireAuth(request);
    const uid = user.uid;

    // Input validation and parsing
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { audienceName, audienceData }: { audienceName: string; audienceData: AudienceApiData } = requestBody;
    
    // Environment validation
    const qlooApiKey = process.env.QLOO_API_KEY;
    if (!qlooApiKey) {
      console.error('Qloo API key is missing from environment variables');
      return NextResponse.json({ error: ERRORS.MISSING_QLOO_API_KEY }, { status: 500 });
    }

    // Data validation
    const validationError = validateRequestData(audienceName, audienceData);
    if (validationError) {
      console.warn('Validation failed:', validationError);
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { entities, audienceOptions, gender, ageGroup, genres } = audienceData;

    console.log('🎯 Starting advanced audience analysis for:', audienceName);
    console.log('📊 Input Parameters:', {
      entityCount: entities.length,
      audienceOptionsCount: Object.values(audienceOptions).flat().length,
      ageGroupCount: ageGroup.length,
      genreCount: genres?.length || 0,
      gender
    });

    const allAudienceOptions = Object.values(audienceOptions).flat();

    // Phase 1: Entity validation and enrichment
    console.log('🔍 Phase 1: Entity validation...');
    const entityValidationStart = Date.now();
    
    const validatedEntities = await validateAndEnrichEntities(entities, qlooApiKey);
    const inputEntities = await fetchInputEntities(validatedEntities, qlooApiKey);
    
    const entityValidationTime = Date.now() - entityValidationStart;
    console.log(`✅ Entity validation completed in ${entityValidationTime}ms: ${inputEntities.length} validated entities`);

    // Phase 2: Advanced insights generation
    console.log('🧠 Phase 2: Insights generation...');
    const insightsStart = Date.now();
    
    const recommendedEntities = await fetchRecommendedEntities(
      inputEntities,
      allAudienceOptions,
      ageGroup,
      genres || [],
      gender,
      qlooApiKey
    );
    
    const insightsTime = Date.now() - insightsStart;
    console.log(`✅ Generated ${recommendedEntities.length} recommendations in ${insightsTime}ms`);

    // Phase 3: Trending analysis
    console.log('📈 Phase 3: Trending analysis...');
    const trendingStart = Date.now();
    
    const trendingAnalysis = await performComprehensiveTrendingAnalysis(qlooApiKey);
    
    const trendingTime = Date.now() - trendingStart;
    console.log(`✅ Trending analysis completed in ${trendingTime}ms`);

    // Phase 4: Cultural intelligence and taste profiling
    console.log('🎨 Phase 4: Cultural intelligence...');
    const culturalStart = Date.now();
    
    const [tasteProfile, culturalAnalysis] = await Promise.all([
      generateTasteProfile(inputEntities, allAudienceOptions, qlooApiKey),
      performAdvancedCulturalAnalysis(inputEntities, recommendedEntities, qlooApiKey)
    ]);
    
    const culturalTime = Date.now() - culturalStart;
    console.log(`✅ Cultural intelligence completed in ${culturalTime}ms`);

    // Phase 5: Demographic intelligence
    console.log('🔬 Phase 5: Demographics analysis...');
    const demographicsStart = Date.now();
    
    const allEntities = [...inputEntities, ...recommendedEntities];
    const [demographicsMap, detailedDemographics] = await Promise.all([
      fetchDemographics(allEntities, qlooApiKey),
      performDemographicAnalysis(allEntities, qlooApiKey)
    ]);
    
    const demographicsTime = Date.now() - demographicsStart;
    console.log(`✅ Demographics analysis completed in ${demographicsTime}ms`);

    // Phase 6: Data synthesis
    console.log('📊 Phase 6: Data synthesis...');
    
    const entitiesWithDemo = addDemographicsToEntities(inputEntities, demographicsMap);
    const recommendedEntitiesWithDemo = addDemographicsToEntities(recommendedEntities, demographicsMap);
    const { ageTotals, genderTotals } = calculateDemographicTotals([...entitiesWithDemo, ...recommendedEntitiesWithDemo]);

    // Phase 6.5: Generate avatar image
    console.log('🎨 Phase 6.5: Avatar generation...');
    const avatarStart = Date.now();
    
    const imageUrl = await generateAndUploadAvatar(
      audienceName,
      ageGroup,
      gender,
      inputEntities,
      allAudienceOptions,
      openai
    );
    
    const avatarTime = Date.now() - avatarStart;
    console.log(`✅ Avatar generation completed in ${avatarTime}ms: ${imageUrl}`);

    // Phase 7: Generate comprehensive intelligence report
    const totalProcessingTime = Date.now() - startTime;
    
    const culturalIntelligenceReport = {
      // Core audience data
      entities: entitiesWithDemo,
      recommendedEntities: recommendedEntitiesWithDemo,
      ageTotals: roundNumericObject(ageTotals),
      genderTotals: roundNumericObject(genderTotals),
      
      // Advanced analytics (when available)
      qlooIntelligence: {
        // Multi-dimensional taste analysis
        tasteProfile: {
          affinityScore: tasteProfile.affinityScore,
          diversityIndex: tasteProfile.diversityIndex,
          culturalSegments: tasteProfile.culturalSegments,
          tasteVector: tasteProfile.tasteVector,
          interpretation: interpretTasteProfile(tasteProfile)
        },
        
        // Real-time trending insights
        trendingAnalysis: {
          ...trendingAnalysis,
          userAlignmentScore: calculateTrendingAlignment(inputEntities, trendingAnalysis),
          trendingRecommendations: generateTrendingRecommendations(trendingAnalysis)
        },
        
        // Enhanced demographic intelligence
        demographicIntelligence: {
          standardDemographics: { ageTotals, genderTotals },
          enhancedDemographics: detailedDemographics,
          demographicConfidence: calculateDemographicConfidence(demographicsMap),
          culturalCorrelations: culturalAnalysis.correlations
        },
        
        // Advanced cultural analysis
        culturalProfile: {
          ...culturalAnalysis,
          culturalDiversityScore: calculateCulturalDiversity(allEntities),
          crossCulturalInsights: await generateCrossCulturalInsights(inputEntities, qlooApiKey)
        },
        
        // Performance and quality metrics
        analysisMetrics: {
          totalEntities: allEntities.length,
          entitiesWithDemographics: Object.keys(demographicsMap).length,
          dataQualityScore: calculateDataQualityScore(allEntities, demographicsMap),
          culturalCoverageScore: calculateCulturalCoverage(recommendedEntities),
          processingTimeMs: totalProcessingTime,
          apiCallsOptimized: true,
          qlooFeaturesUsed: [
            'Entity Search', 'Tags API', 'Audiences API', 'Insights API',
            'Demographics API', 'Trending API', 'Analysis API'
          ]
        }
      },
      
      // Traditional categorized selections (maintained for compatibility)
      categorizedSelections: {
        genres: genres || [],
        audienceOptions: audienceOptions || {}
      },
      
      // Audience metadata
      name: audienceName,
      imageUrl: imageUrl,
      createdAt: new Date().toISOString()
    };

    console.log('🎯 Cultural intelligence report generated successfully');
    console.log('📈 Performance Summary:', {
      totalTime: totalProcessingTime + 'ms',
      avatarTime: avatarTime + 'ms',
      entitiesAnalyzed: allEntities.length,
      featuresUsed: culturalIntelligenceReport.qlooIntelligence.analysisMetrics.qlooFeaturesUsed.length,
      dataQuality: culturalIntelligenceReport.qlooIntelligence.analysisMetrics.dataQualityScore,
      culturalCoverage: culturalIntelligenceReport.qlooIntelligence.analysisMetrics.culturalCoverageScore,
      hasCustomAvatar: imageUrl !== 'https://cdn-icons-png.flaticon.com/512/1053/1053244.png'
    });

    // Save to database with proper error handling
    try {
      const docRef = db.collection('users').doc(uid).collection('audiences').doc();
      const sanitizedAudience = sanitizeForFirestore(culturalIntelligenceReport);
      
      await docRef.set(sanitizedAudience);
      
      console.log(`🎯 Successfully saved audience: ${audienceName} (${docRef.id})`);
      
      return NextResponse.json({ 
        ...culturalIntelligenceReport, 
        id: docRef.id,
        success: true
      });
      
    } catch (firestoreError) {
      console.error('Firestore save failed:', firestoreError);
      return NextResponse.json(
        { error: 'Failed to save audience to database' },
        { status: 500 }
      );
    }

  } catch (error) {
    // Handle authentication errors
    if (error instanceof NextResponse) {
      return error;
    }

    console.error('🚨 Error in audience creation:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { error: 'Failed to generate audience analysis' },
      { status: 500 }
    );
  }
}

// ===============================
// ANALYSIS FUNCTIONS
// ===============================

/**
 * Comprehensive trending analysis across entity types
 */
async function performComprehensiveTrendingAnalysis(qlooApiKey: string): Promise<TrendingAnalysisData> {
  const entityTypes = ['MOVIE', 'ARTIST', 'BOOK', 'TV_SHOW', 'VIDEO_GAME', 'BRAND', 'PODCAST'];
  const trendingData: Record<string, {
    entities: unknown[];
    count: number;
    avgPopularity: number;
  }> = {};
  
  // Fetch trending data for multiple entity types
  const trendingPromises = entityTypes.map(async (entityType) => {
    const trending = await fetchTrendingEntities(entityType, qlooApiKey);
    return { entityType, trending };
  });
  
  const results = await Promise.all(trendingPromises);
  
  for (const { entityType, trending } of results) {
    trendingData[entityType] = {
      entities: trending.slice(0, 3),
      count: trending.length,
      avgPopularity: trending.reduce((sum, e) => sum + (e.popularity || 0), 0) / trending.length || 0
    };
  }
  
  return {
    byCategory: trendingData,
    mostTrendingCategory: Object.entries(trendingData)
      .sort(([,a], [,b]) => b.avgPopularity - a.avgPopularity)[0]?.[0] || 'Unknown',
    totalTrendingEntities: Object.values(trendingData).reduce((sum, cat) => sum + cat.count, 0)
  };
}

/**
 * Advanced cultural analysis using multiple APIs
 */
async function performAdvancedCulturalAnalysis(
  inputEntities: EntityData[], 
  recommendedEntities: EntityData[], 
  qlooApiKey: string
): Promise<CulturalAnalysis> {
  try {
    // Use Analysis API for cultural correlations
    const entityIds = [...inputEntities, ...recommendedEntities].map(e => e.id).slice(0, 10);
    const url = `${QLOO_API_BASE_URL}/v2/analysis?entity_ids=${entityIds.join(',')}&include_correlations=true`;
    
    const response = await fetch(url, {
      headers: createQlooHeaders(qlooApiKey),
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        correlations: data.correlations || [],
        culturalClusters: data.clusters || [],
        affinityMatrix: data.affinity_matrix || {},
        analysisConfidence: data.confidence || 0
      };
    }
  } catch (error) {
    console.error('Advanced cultural analysis error:', error);
  }
  
  return {
    correlations: [],
    culturalClusters: [],
    affinityMatrix: {},
    analysisConfidence: 0
  };
}

/**
 * Cross-cultural insights generation
 */
async function generateCrossCulturalInsights(entities: EntityData[], qlooApiKey: string): Promise<CrossCulturalInsights> {
  const insights: CrossCulturalInsights = {
    globalRelevance: 0,
    culturalBridges: [],
    regionalVariations: {},
    universalThemes: []
  };
  
  try {
    // Use multiple regions for comparison
    const regions = ['US', 'UK', 'CA', 'AU'];
    const entityIds = entities.map(e => e.id).slice(0, 5).join(',');
    
    for (const region of regions) {
      const url = `${QLOO_API_BASE_URL}/v2/insights?filter.type=urn:entity:movie&signal.interests.entities=${entityIds}&filter.release_country=${region}&take=5`;
      
      const response = await fetch(url, {
        headers: createQlooHeaders(qlooApiKey),
      });
      
      if (response.ok) {
        const data = await response.json();
        insights.regionalVariations[region] = data.results?.entities?.length || 0;
      }
    }
  } catch (error) {
    console.error('Cross-cultural analysis error:', error);
  }
  
  return insights;
}

// ===============================
// HELPER FUNCTIONS
// ===============================

function interpretTasteProfile(profile: TasteProfileInput): string {
  const { affinityScore, diversityIndex } = profile;
  
  if (affinityScore > 0.7 && diversityIndex > 0.6) {
    return "Sophisticated & Diverse - High cultural engagement across multiple domains";
  } else if (affinityScore > 0.7) {
    return "Focused Excellence - Deep expertise in specific cultural areas";
  } else if (diversityIndex > 0.6) {
    return "Cultural Explorer - Broad interests across diverse entertainment";
  } else {
    return "Emerging Taste - Developing cultural preferences";
  }
}

function calculateTrendingAlignment(entities: EntityData[], trendingData: TrendingAnalysisData): number {
  // Calculate how well user entities align with trending content
  const userEntityIds = new Set(entities.map(e => e.id));
  let alignmentScore = 0;
  let totalTrending = 0;
  
  Object.values(trendingData.byCategory).forEach((category) => {
    category.entities.forEach((entity) => {
      totalTrending++;
      if (entity && typeof entity === 'object' && 'id' in entity) {
        if (userEntityIds.has((entity as EntityData).id)) {
          alignmentScore++;
        }
      }
    });
  });
  
  return totalTrending > 0 ? alignmentScore / totalTrending : 0;
}

function generateTrendingRecommendations(trendingData: TrendingAnalysisData): string[] {
  const recommendations = [];
  
  if (trendingData.mostTrendingCategory) {
    recommendations.push(`Explore trending ${trendingData.mostTrendingCategory.toLowerCase()} content`);
  }
  
  recommendations.push("Consider diversifying with trending content from multiple categories");
  recommendations.push("Stay current with cultural movements for enhanced relevance");
  
  return recommendations;
}

function calculateDemographicConfidence(demographicsMap: DemographicsMap): number {
  const totalEntities = Object.keys(demographicsMap).length;
  if (totalEntities === 0) return 0;
  
  let entitiesWithCompleteData = 0;
  Object.values(demographicsMap).forEach((demo) => {
    if (demo.age && demo.gender && Object.keys(demo.age).length > 0 && Object.keys(demo.gender).length > 0) {
      entitiesWithCompleteData++;
    }
  });
  
  return entitiesWithCompleteData / totalEntities;
}

function calculateCulturalDiversity(entities: EntityData[]): number {
  const types = new Set(entities.map(e => e.type));
  const maxTypes = 9; // Number of supported entity types
  return types.size / maxTypes;
}

function calculateDataQualityScore(entities: EntityData[], demographicsMap: DemographicsMap): number {
  const hasNames = entities.filter(e => e.name).length;
  const hasPopularity = entities.filter(e => e.popularity).length;
  const hasDemographics = Object.keys(demographicsMap).length;
  
  const nameScore = hasNames / entities.length;
  const popularityScore = hasPopularity / entities.length;
  const demographicsScore = hasDemographics / entities.length;
  
  return (nameScore + popularityScore + demographicsScore) / 3;
}

function calculateCulturalCoverage(entities: EntityData[]): number {
  const categories = new Set(entities.map(e => e.type));
  const expectedCategories = 5; // Aim for 5+ different entity types
  return Math.min(categories.size / expectedCategories, 1);
}