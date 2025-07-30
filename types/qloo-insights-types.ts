/**
 * Comprehensive Types for Qloo Insights API
 * 
 * This file defines the correct filters, audience options, and parameters
 * to use for different types of insights queries to ensure complete entity coverage.
 */

// ===============================
// CORE ENTITY TYPES & FILTERS
// ===============================

/**
 * Qloo API Filter Types - These are the actual values expected by the API
 */
export const QlooFilterType = {
  Artist: "urn:entity:artist",
  Book: "urn:entity:book", 
  Brand: "urn:entity:brand",
  Destination: "urn:entity:destination",
  Movie: "urn:entity:movie",
  Person: "urn:entity:person",
  Place: "urn:entity:place",
  Podcast: "urn:entity:podcast",
  TvShow: "urn:entity:tv_show",
  Videogame: "urn:entity:videogame",
  Heatmap: "urn:heatmap",
} as const;

export type QlooFilterType = typeof QlooFilterType[keyof typeof QlooFilterType];

/**
 * Mapping from your EntityTypes to Qloo Filter Types
 * Use this to convert your entity types to the correct Qloo API filter
 */
export const EntityTypeToQlooFilter: Record<string, QlooFilterType> = {
  ARTIST: QlooFilterType.Artist,
  BOOK: QlooFilterType.Book,
  BRAND: QlooFilterType.Brand,
  DESTINATION: QlooFilterType.Destination,
  MOVIE: QlooFilterType.Movie,
  PERSON: QlooFilterType.Person,
  PLACE: QlooFilterType.Place,
  PODCAST: QlooFilterType.Podcast,
  TV_SHOW: QlooFilterType.TvShow,
  VIDEO_GAME: QlooFilterType.Videogame, // Fixed: was VIDEOGAME, should be VIDEO_GAME
  // Add any other mappings your code uses
};

// ===============================
// AGE GROUP MAPPINGS
// ===============================

/**
 * CRITICAL: Age group mismatch found!
 * Your code uses 6 age groups, but Qloo API only supports 3.
 * You need to map your detailed age groups to Qloo's broader categories.
 */

/**
 * Your current age groups (needs mapping)
 */
export type YourAgeGroup = 
  | '24_and_younger'
  | '25_to_29' 
  | '30_to_34'
  | '35_to_44'
  | '45_to_54'
  | '55_and_older';

/**
 * Qloo API age groups (what the API actually accepts)
 */
export const QlooAgeGroup = {
  ThirtyFiveAndYounger: "35_and_younger",
  ThirtySixTo55: "36_to_55", 
  FiftyFiveAndOlder: "55_and_older",
} as const;

export type QlooAgeGroup = typeof QlooAgeGroup[keyof typeof QlooAgeGroup];

/**
 * Map your age groups to Qloo's age groups
 * IMPORTANT: Use this mapping to avoid missing entities due to incorrect age targeting
 */
export const AgeGroupMapping: Record<YourAgeGroup, QlooAgeGroup> = {
  '24_and_younger': QlooAgeGroup.ThirtyFiveAndYounger,
  '25_to_29': QlooAgeGroup.ThirtyFiveAndYounger,
  '30_to_34': QlooAgeGroup.ThirtyFiveAndYounger,
  '35_to_44': QlooAgeGroup.ThirtySixTo55,
  '45_to_54': QlooAgeGroup.ThirtySixTo55,
  '55_and_older': QlooAgeGroup.FiftyFiveAndOlder,
};

// ===============================
// DEMOGRAPHICS & SIGNALS
// ===============================

/**
 * Gender options for Qloo API
 */
export const QlooGender = {
  Male: "male",
  Female: "female",
} as const;

export type QlooGender = typeof QlooGender[keyof typeof QlooGender];

/**
 * Weight levels for signals and demographics
 */
export const QlooWeight = {
  VeryLow: "very_low",
  Low: "low", 
  Mid: "mid",
  Medium: "medium",
  High: "high",
  VeryHigh: "very_high",
} as const;

export type QlooWeight = typeof QlooWeight[keyof typeof QlooWeight];

/**
 * Bias trends levels
 */
export const QlooBiasTrends = {
  Off: "off",
  Low: "low",
  Medium: "medium", 
  High: "high",
} as const;

export type QlooBiasTrends = typeof QlooBiasTrends[keyof typeof QlooBiasTrends];

/**
 * Sort options
 */
export const QlooSortBy = {
  Affinity: "affinity",
  Distance: "distance", // Only when filter.location is supplied
} as const;

export type QlooSortBy = typeof QlooSortBy[keyof typeof QlooSortBy];

// ===============================
// INSIGHTS QUERY CONFIGURATION
// ===============================

/**
 * Base configuration for all insights queries
 */
export interface BaseInsightsConfig {
  /** Required: Type of entity to return */
  filterType: QlooFilterType;
  
  /** Number of results to return (default: 10) */
  take?: number;
  
  /** Page number for pagination */
  page?: number;
  
  /** Sorting method */
  sortBy?: QlooSortBy;
  
  /** Bias towards trending entities */
  biasTrends?: QlooBiasTrends;
}

/**
 * Demographic signals for targeting
 */
export interface DemographicSignals {
  /** Age ranges that influence results */
  signalDemographicsAge?: QlooAgeGroup;
  signalDemographicsAgeWeight?: QlooWeight | number;
  
  /** Gender targeting */
  signalDemographicsGender?: QlooGender;
  signalDemographicsGenderWeight?: QlooWeight | number;
  
  /** Audience targeting (requires audience IDs from /audiences endpoint) */
  signalDemographicsAudiences?: string[];
  signalDemographicsAudiencesWeight?: QlooWeight | number;
}

/**
 * Interest-based signals 
 */
export interface InterestSignals {
  /** Entity IDs that influence recommendations */
  signalInterestsEntities?: string[];
  signalInterestsEntitiesWeight?: QlooWeight | number;
  
  /** Tag IDs that influence recommendations */
  signalInterestsTags?: string[] | Array<{tag: string; weight: number}>;
  signalInterestsTagsWeight?: QlooWeight | number;
}

/**
 * Location-based signals and filters
 */
export interface LocationConfig {
  /** Location signal for geospatial relevance */
  signalLocation?: string; // WKT POINT, POLYGON, or Qloo locality ID
  signalLocationQuery?: string; // Natural language location
  signalLocationWeight?: QlooWeight | number;
  signalLocationRadius?: number;
  
  /** Location filters */
  filterLocation?: string;
  filterLocationQuery?: string | string[];
  filterLocationRadius?: number;
  filterLocationGeohash?: string;
  
  /** Exclude locations */
  filterExcludeLocation?: string;
  filterExcludeLocationQuery?: string | string[];
  filterExcludeLocationGeohash?: string;
}

// ===============================
// ENTITY-SPECIFIC CONFIGURATIONS
// ===============================

/**
 * Configuration for Place (restaurant, hotel, venue) queries
 */
export interface PlaceInsightsConfig extends BaseInsightsConfig, DemographicSignals, InterestSignals, LocationConfig {
  filterType: typeof QlooFilterType.Place;
  
  // Place-specific filters
  filterPriceLevelMin?: number; // 1-4 (like dollar signs)
  filterPriceLevelMax?: number;
  filterRatingMin?: number; // 0-5 Qloo rating
  filterRatingMax?: number;
  filterPopularityMin?: number; // 0-1 percentile
  filterPopularityMax?: number;
  filterHours?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  
  // Hotel-specific
  filterHotelClassMin?: number; // 1-5
  filterHotelClassMax?: number;
  
  // External ratings
  filterExternalResyRatingMin?: number;
  filterExternalResyRatingMax?: number;
  filterExternalTripadvisorRatingMin?: number;
  filterExternalTripadvisorRatingMax?: number;
  
  // Address filtering
  filterAddress?: string;
  filterGeocodeCountryCode?: string; // Two-letter country code
  filterGeocodeAdmin1Region?: string; // State
  filterGeocodeAdmin2Region?: string; // County/borough
  filterGeocodeName?: string; // City name
}

/**
 * Configuration for Movie queries
 */
export interface MovieInsightsConfig extends BaseInsightsConfig, DemographicSignals, InterestSignals {
  filterType: typeof QlooFilterType.Movie;
  
  // Movie-specific filters
  filterReleaseYearMin?: number;
  filterReleaseYearMax?: number;
  filterContentRating?: "G" | "PG" | "PG-13" | "R" | "NC-17";
  filterReleaseCountry?: string[];
  filterRatingMin?: number;
  filterRatingMax?: number;
}

/**
 * Configuration for Book queries  
 */
export interface BookInsightsConfig extends BaseInsightsConfig, DemographicSignals, InterestSignals {
  filterType: typeof QlooFilterType.Book;
  
  // Book-specific filters
  filterPublicationYearMin?: number;
  filterPublicationYearMax?: number;
  filterRatingMin?: number;
  filterRatingMax?: number;
}

/**
 * Configuration for Artist/Music queries
 */
export interface ArtistInsightsConfig extends BaseInsightsConfig, DemographicSignals, InterestSignals {
  filterType: typeof QlooFilterType.Artist;
  
  // Artist-specific filters typically use tags for genre filtering
  // No specific year/rating filters for artists
}

/**
 * Configuration for TV Show queries
 */
export interface TvShowInsightsConfig extends BaseInsightsConfig, DemographicSignals, InterestSignals {
  filterType: typeof QlooFilterType.TvShow;
  
  // TV-specific filters
  filterReleaseYearMin?: number;
  filterReleaseYearMax?: number;
  filterFinaleYearMin?: number;
  filterFinaleYearMax?: number;
  filterLatestKnownYearMin?: number;
  filterLatestKnownYearMax?: number;
  filterReleaseCountry?: string[];
}

/**
 * Configuration for Person queries
 */
export interface PersonInsightsConfig extends BaseInsightsConfig, DemographicSignals, InterestSignals {
  filterType: typeof QlooFilterType.Person;
  
  // Person-specific filters
  filterGender?: string;
  // Note: Use RFCDate for date filters in actual implementation
  filterDateOfBirthMin?: string; // RFC3339 date
  filterDateOfBirthMax?: string;
  filterDateOfDeathMin?: string; 
  filterDateOfDeathMax?: string;
}

/**
 * Configuration for Brand queries
 */
export interface BrandInsightsConfig extends BaseInsightsConfig, DemographicSignals, InterestSignals, LocationConfig {
  filterType: typeof QlooFilterType.Brand;
  
  // Brand-specific filters typically use tags and location
}

/**
 * Configuration for Podcast queries
 */
export interface PodcastInsightsConfig extends BaseInsightsConfig, DemographicSignals, InterestSignals {
  filterType: typeof QlooFilterType.Podcast;
  
  // Podcast-specific filters typically use tags for genre/topic filtering
}

/**
 * Configuration for Video Game queries
 */
export interface VideogameInsightsConfig extends BaseInsightsConfig, DemographicSignals, InterestSignals {
  filterType: typeof QlooFilterType.Videogame;
  
  // Game-specific filters
  filterReleaseYearMin?: number;
  filterReleaseYearMax?: number;
}

/**
 * Union type for all possible insights configurations
 */
export type InsightsConfig = 
  | PlaceInsightsConfig
  | MovieInsightsConfig  
  | BookInsightsConfig
  | ArtistInsightsConfig
  | TvShowInsightsConfig
  | PersonInsightsConfig
  | BrandInsightsConfig
  | PodcastInsightsConfig
  | VideogameInsightsConfig;

// ===============================
// QUERY BUILDERS & HELPERS
// ===============================

/**
 * Convert your age groups to Qloo age groups
 */
export function convertAgeGroups(yourAgeGroups: YourAgeGroup[]): QlooAgeGroup[] {
  const qlooAgeGroups = new Set<QlooAgeGroup>();
  
  yourAgeGroups.forEach(age => {
    qlooAgeGroups.add(AgeGroupMapping[age]);
  });
  
  return Array.from(qlooAgeGroups);
}

/**
 * Build URL for insights query - use this to replace your buildInsightsUrl function
 */
export function buildQlooInsightsUrl(config: InsightsConfig, baseUrl: string = 'https://hackathon.api.qloo.com/v2/insights'): string {
  const params = new URLSearchParams();
  
  // Required filter type
  params.set('filter.type', config.filterType);
  
  // Demographics
  if (config.signalDemographicsAge) {
    params.set('signal.demographics.age', config.signalDemographicsAge);
  }
  if (config.signalDemographicsAgeWeight) {
    params.set('signal.demographics.age.weight', config.signalDemographicsAgeWeight.toString());
  }
  if (config.signalDemographicsGender) {
    params.set('signal.demographics.gender', config.signalDemographicsGender);
  }
  if (config.signalDemographicsGenderWeight) {
    params.set('signal.demographics.gender.weight', config.signalDemographicsGenderWeight.toString());
  }
  if (config.signalDemographicsAudiences) {
    params.set('signal.demographics.audiences', config.signalDemographicsAudiences.join(','));
  }
  if (config.signalDemographicsAudiencesWeight) {
    params.set('signal.demographics.audiences.weight', config.signalDemographicsAudiencesWeight.toString());
  }
  
  // Interests
  if (config.signalInterestsEntities) {
    params.set('signal.interests.entities', config.signalInterestsEntities.join(','));
  }
  if (config.signalInterestsEntitiesWeight) {
    params.set('signal.interests.entities.weight', config.signalInterestsEntitiesWeight.toString());
  }
  if (config.signalInterestsTags) {
    if (Array.isArray(config.signalInterestsTags) && typeof config.signalInterestsTags[0] === 'string') {
      params.set('signal.interests.tags', (config.signalInterestsTags as string[]).join(','));
    }
    // For weighted tags, you'll need to use POST request with JSON body
  }
  if (config.signalInterestsTagsWeight) {
    params.set('signal.interests.tags.weight', config.signalInterestsTagsWeight.toString());
  }
  
  // Location (if supported by config)
  if ('signalLocation' in config && config.signalLocation) {
    params.set('signal.location', config.signalLocation);
  }
  if ('signalLocationQuery' in config && config.signalLocationQuery) {
    params.set('signal.location.query', config.signalLocationQuery);
  }
  if ('filterLocationQuery' in config && config.filterLocationQuery) {
    const locationQuery = Array.isArray(config.filterLocationQuery) 
      ? config.filterLocationQuery.join(',') 
      : config.filterLocationQuery;
    params.set('filter.location.query', locationQuery);
  }
  
  // Entity-specific filters
  addEntitySpecificFilters(params, config);
  
  // Common parameters
  if (config.take) params.set('take', config.take.toString());
  if (config.page) params.set('page', config.page.toString());
  if (config.sortBy) params.set('sort_by', config.sortBy);
  if (config.biasTrends) params.set('bias.trends', config.biasTrends);
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Add entity-specific filters to URL parameters
 */
function addEntitySpecificFilters(params: URLSearchParams, config: InsightsConfig): void {
  switch (config.filterType) {
    case QlooFilterType.Place:
      const placeConfig = config as PlaceInsightsConfig;
      if (placeConfig.filterPriceLevelMin) params.set('filter.price_level.min', placeConfig.filterPriceLevelMin.toString());
      if (placeConfig.filterPriceLevelMax) params.set('filter.price_level.max', placeConfig.filterPriceLevelMax.toString());
      if (placeConfig.filterRatingMin) params.set('filter.rating.min', placeConfig.filterRatingMin.toString());
      if (placeConfig.filterRatingMax) params.set('filter.rating.max', placeConfig.filterRatingMax.toString());
      if (placeConfig.filterHours) params.set('filter.hours', placeConfig.filterHours);
      break;
      
    case QlooFilterType.Movie:
      const movieConfig = config as MovieInsightsConfig;
      if (movieConfig.filterReleaseYearMin) params.set('filter.release_year.min', movieConfig.filterReleaseYearMin.toString());
      if (movieConfig.filterReleaseYearMax) params.set('filter.release_year.max', movieConfig.filterReleaseYearMax.toString());
      if (movieConfig.filterContentRating) params.set('filter.content_rating', movieConfig.filterContentRating);
      break;
      
    case QlooFilterType.Book:
      const bookConfig = config as BookInsightsConfig;
      if (bookConfig.filterPublicationYearMin) params.set('filter.publication_year.min', bookConfig.filterPublicationYearMin.toString());
      if (bookConfig.filterPublicationYearMax) params.set('filter.publication_year.max', bookConfig.filterPublicationYearMax.toString());
      break;
      
    // Add other entity types as needed
  }
}

// ===============================
// USAGE EXAMPLES & RECOMMENDATIONS
// ===============================

/**
 * Example configurations for common use cases
 * Use these as templates for your insights queries
 */
export const ExampleConfigs = {
  
  /**
   * Find restaurants based on user preferences
   */
  restaurantRecommendations: (userAgeGroups: YourAgeGroup[], userGender: string, location: string, genres: string[]): PlaceInsightsConfig => ({
    filterType: QlooFilterType.Place,
    signalDemographicsAge: convertAgeGroups(userAgeGroups)[0], // Use first converted age group
    signalDemographicsGender: userGender as QlooGender,
    signalInterestsTags: genres, // Should be Qloo tag IDs like 'urn:tag:genre:restaurant:Italian'
    filterLocationQuery: location,
    filterPriceLevelMin: 1,
    filterPriceLevelMax: 4,
    take: 10,
    sortBy: QlooSortBy.Affinity,
  }),
  
  /**
   * Find movies for a demographic
   */
  movieRecommendations: (ageGroups: YourAgeGroup[], gender: string, genres: string[]): MovieInsightsConfig => ({
    filterType: QlooFilterType.Movie,
    signalDemographicsAge: convertAgeGroups(ageGroups)[0],
    signalDemographicsGender: gender as QlooGender,
    signalInterestsTags: genres, // Movie genre tags
    filterReleaseYearMin: 2010,
    take: 10,
  }),
  
  /**
   * Find artists/music for taste profile
   */
  artistRecommendations: (ageGroups: YourAgeGroup[], genres: string[]): ArtistInsightsConfig => ({
    filterType: QlooFilterType.Artist,
    signalDemographicsAge: convertAgeGroups(ageGroups)[0],
    signalInterestsTags: genres, // Music genre tags
    take: 10,
  }),
  
};

/**
 * CRITICAL RECOMMENDATIONS:
 * 
 * 1. AGE GROUP MAPPING: Always use convertAgeGroups() to map your age groups to Qloo's format
 * 
 * 2. REQUIRED SIGNALS: Most insights queries require at least one signal:
 *    - signalInterestsEntities (entity IDs)
 *    - signalInterestsTags (tag IDs) 
 *    - signalDemographicsAudiences (audience IDs)
 *    - signalLocation or filterLocation (for place queries)
 * 
 * 3. TAG IDs: Use the Tags API to get proper tag IDs. Format: 'urn:tag:genre:restaurant:Italian'
 * 
 * 4. ENTITY IDs: Use Qloo entity IDs, not arbitrary UUIDs. Search by name first.
 * 
 * 5. LOCATION QUERIES: Use natural language ('New York City') or WKT format ('POINT(-73.99823 40.722668)')
 * 
 * 6. AUDIENCE IDs: Get from the Audiences API (/v2/audiences)
 */

export default {
  QlooFilterType,
  EntityTypeToQlooFilter,
  QlooAgeGroup,
  AgeGroupMapping,
  convertAgeGroups,
  buildQlooInsightsUrl,
  ExampleConfigs,
}; 