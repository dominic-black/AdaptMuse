import {
  Clapperboard,
  PersonStanding,
  Mic2,
  BookOpen,
  ShoppingBag,
  House,
  Tv,
  Gamepad2,
  Podcast,
} from "lucide-react";

export interface AudienceOption {
  value: string;
  label: string;
}

export const AUDIENCE_OPTIONS: Record<string, AudienceOption[]> = {
  SPENDING_HABITS: [
    {
      value: "urn:audience:spending_habits:vintage_apparel",
      label: "Vintage Apparel",
    },
    {
      value: "urn:audience:spending_habits:technology_enthusiast",
      label: "Technology Enthusiast",
    },
    {
      value: "urn:audience:spending_habits:watch_collecting",
      label: "Watch Collecting",
    },
    {
      value: "urn:audience:spending_habits:boutique_hotels",
      label: "Boutique Hotels",
    },
    {
      value: "urn:audience:spending_habits:discount_shoppers",
      label: "Discount Shoppers",
    },
    {
      value: "urn:audience:spending_habits:gourmand_fine_dining",
      label: "Gourmand Fine Dining",
    },
  ],
  POLITICAL_PREFERENCES: [
    {
      value: "urn:audience:political_preferences:politically_progressive",
      label: "Politically Progressive",
    },
    {
      value: "urn:audience:political_preferences:politically_center",
      label: "Politically Center",
    },
    {
      value: "urn:audience:political_preferences:politically_conservative",
      label: "Politically Conservative",
    },
  ],
  LIFESTYLE_PREFERENCES_BELIEFS: [
    {
      value: "urn:audience:lifestyle_preferences_beliefs:astrology",
      label: "Astrology",
    },
    {
      value: "urn:audience:lifestyle_preferences_beliefs:organic_ingredients",
      label: "Organic Ingredients",
    },
    {
      value: "urn:audience:lifestyle_preferences_beliefs:christianity",
      label: "Christianity",
    },
    {
      value: "urn:audience:lifestyle_preferences_beliefs:healthy_eating",
      label: "Healthy Eating",
    },
    {
      value: "urn:audience:lifestyle_preferences_beliefs:judaism",
      label: "Judaism",
    },
    {
      value: "urn:audience:lifestyle_preferences_beliefs:veganism",
      label: "Veganism",
    },
    {
      value: "urn:audience:lifestyle_preferences_beliefs:spirituality",
      label: "Spirituality",
    },
    {
      value: "urn:audience:lifestyle_preferences_beliefs:islam",
      label: "Islam",
    },
  ],
  LIFE_STAGES: [
    {
      value: "urn:audience:life_stage:parents_with_young_children",
      label: "Parents With Young Children",
    },
    {
      value: "urn:audience:life_stage:engaged",
      label: "Engaged",
    },
    {
      value: "urn:audience:life_stage:single",
      label: "Single",
    },
    {
      value: "urn:audience:life_stage:retirement",
      label: "Retirement",
    },
  ],
  LEISURE_INTERESTS: [
    {
      value: "urn:audience:leisure:political_junkie",
      label: "Political Junkie",
    },
    {
      value: "urn:audience:leisure:arts_culture",
      label: "Arts Culture",
    },
    {
      value: "urn:audience:leisure:foodie",
      label: "Foodie",
    },
    {
      value: "urn:audience:leisure:cooking",
      label: "Cooking",
    },
    {
      value: "urn:audience:leisure:museums",
      label: "Museums",
    },
    {
      value: "urn:audience:leisure:cinephile",
      label: "Cinephile",
    },
    {
      value: "urn:audience:leisure:music_festivals",
      label: "Music Festivals",
    },
    {
      value: "urn:audience:leisure:avid_reader",
      label: "Avid Reader",
    },
    {
      value: "urn:audience:leisure:exercising",
      label: "Exercising",
    },
    {
      value: "urn:audience:leisure:coffee",
      label: "Coffee",
    },
    {
      value: "urn:audience:leisure:news_junkie",
      label: "News Junkie",
    },
  ],
  INVESTING_INTERESTS: [
    {
      value: "urn:audience:investing_interests:stocks_bonds",
      label: "Stocks Bonds",
    },
    {
      value: "urn:audience:investing_interests:angel_start_up_investing",
      label: "Angel Start Up Investing",
    },
    {
      value: "urn:audience:investing_interests:real_estate",
      label: "Real Estate",
    },
    {
      value: "urn:audience:investing_interests:nft_collectors",
      label: "NFT Collectors",
    },
    {
      value: "urn:audience:investing_interests:cryptocurrency_enthusiasts",
      label: "Cryptocurrency Enthusiasts",
    },
    {
      value: "urn:audience:investing_interests:art_collectibles",
      label: "Art Collectibles",
    },
  ],
  HOBBIES_AND_INTERESTS: [
    {
      value: "urn:audience:hobbies_and_interests:health_and_beauty",
      label: "Health And Beauty",
    },
    {
      value: "urn:audience:hobbies_and_interests:adventuring",
      label: "Adventuring",
    },
    {
      value: "urn:audience:hobbies_and_interests:photography",
      label: "Photography",
    },
    {
      value: "urn:audience:hobbies_and_interests:tattoos",
      label: "Tattoos",
    },
    {
      value: "urn:audience:hobbies_and_interests:meditation",
      label: "Meditation",
    },
    {
      value: "urn:audience:hobbies_and_interests:hockey",
      label: "Hockey",
    },
    {
      value: "urn:audience:hobbies_and_interests:american_football",
      label: "American Football",
    },
    {
      value: "urn:audience:hobbies_and_interests:martial_arts",
      label: "Martial Arts",
    },
    {
      value: "urn:audience:hobbies_and_interests:running",
      label: "Running",
    },
    {
      value: "urn:audience:hobbies_and_interests:secret_unravelers",
      label: "Secret Unravelers",
    },
    {
      value: "urn:audience:hobbies_and_interests:motorcycles",
      label: "Motorcycles",
    },
    {
      value: "urn:audience:hobbies_and_interests:jewellery",
      label: "Jewellery",
    },
    {
      value: "urn:audience:hobbies_and_interests:hiking",
      label: "Hiking",
    },
    {
      value: "urn:audience:hobbies_and_interests:watches",
      label: "Watches",
    },
    {
      value: "urn:audience:hobbies_and_interests:spy_enthusiast",
      label: "Spy Enthusiast",
    },
    {
      value: "urn:audience:hobbies_and_interests:arts_crafts",
      label: "Arts Crafts",
    },
    {
      value: "urn:audience:hobbies_and_interests:wrestling",
      label: "Wrestling",
    },
    {
      value: "urn:audience:hobbies_and_interests:home_organization",
      label: "Home Organization",
    },
    {
      value: "urn:audience:hobbies_and_interests:sneakerheads",
      label: "Sneakerheads",
    },
    {
      value: "urn:audience:hobbies_and_interests:travel",
      label: "Travel",
    },
    {
      value: "urn:audience:hobbies_and_interests:golf",
      label: "Golf",
    },
    {
      value: "urn:audience:hobbies_and_interests:high_fashion",
      label: "High Fashion",
    },
    {
      value: "urn:audience:hobbies_and_interests:home_decor",
      label: "Home Decor",
    },
    {
      value: "urn:audience:hobbies_and_interests:street_fashion",
      label: "Street Fashion",
    },
    {
      value: "urn:audience:hobbies_and_interests:video_gamer",
      label: "Video Gamer",
    },
    {
      value: "urn:audience:hobbies_and_interests:tennis",
      label: "Tennis",
    },
    {
      value: "urn:audience:hobbies_and_interests:swimming",
      label: "Swimming",
    },
    {
      value: "urn:audience:hobbies_and_interests:automotive",
      label: "Automotive",
    },
    {
      value: "urn:audience:hobbies_and_interests:musician",
      label: "Musician",
    },
    {
      value: "urn:audience:hobbies_and_interests:perfume",
      label: "Perfume",
    },
    {
      value: "urn:audience:hobbies_and_interests:casual_escapists",
      label: "Casual Escapists",
    },
    {
      value: "urn:audience:hobbies_and_interests:racing",
      label: "Racing",
    },
    {
      value: "urn:audience:hobbies_and_interests:adrenaline_rushers",
      label: "Adrenaline Rushers",
    },
    {
      value: "urn:audience:hobbies_and_interests:soccer",
      label: "Soccer",
    },
    {
      value: "urn:audience:hobbies_and_interests:yoga",
      label: "Yoga",
    },
    {
      value: "urn:audience:hobbies_and_interests:baseball",
      label: "Baseball",
    },
    {
      value: "urn:audience:hobbies_and_interests:architecture",
      label: "Architecture",
    },
    {
      value: "urn:audience:hobbies_and_interests:wine_enthusiast",
      label: "Wine Enthusiast",
    },
    {
      value: "urn:audience:hobbies_and_interests:basketball",
      label: "Basketball",
    },
    {
      value: "urn:audience:hobbies_and_interests:outdoors",
      label: "Outdoors",
    },
    {
      value: "urn:audience:hobbies_and_interests:fishing",
      label: "Fishing",
    },
    {
      value: "urn:audience:hobbies_and_interests:dance",
      label: "Dance",
    },
  ],
  COMMUNITIES: [
    {
      value: "urn:audience:communities:aapi",
      label: "AAPI",
    },
    {
      value: "urn:audience:communities:latino",
      label: "Latino",
    },
    {
      value: "urn:audience:communities:lgbtq",
      label: "LGBTQ",
    },
    {
      value: "urn:audience:communities:black",
      label: "Black",
    },
  ],
  GLOBAL_ISSUES: [
    {
      value: "urn:audience:global_issues:climate_activism",
      label: "Climate Activism",
    },
    {
      value: "urn:audience:global_issues:gender_equality",
      label: "Gender Equality",
    },
    {
      value: "urn:audience:global_issues:racial_justice",
      label: "Racial Justice",
    },
    {
      value: "urn:audience:global_issues:education_issues",
      label: "Education Issues",
    },
    {
      value: "urn:audience:global_issues:ocean_health",
      label: "Ocean Health",
    },
    {
      value: "urn:audience:global_issues:foreign_affairs",
      label: "Foreign Affairs",
    },
    {
      value: "urn:audience:global_issues:wealth_inequality",
      label: "Wealth Inequality",
    },
    {
      value: "urn:audience:global_issues:animal_issues",
      label: "Animal Issues",
    },
    {
      value: "urn:audience:global_issues:mental_health",
      label: "Mental Health",
    },
    {
      value: "urn:audience:global_issues:sustainability",
      label: "Sustainability",
    },
    {
      value: "urn:audience:global_issues:fair_wages",
      label: "Fair Wages",
    },
  ],
  PROFESSIONAL_AREAS: [
    {
      value: "urn:audience:professional_area:business_professional",
      label: "Business Professional",
    },
    {
      value: "urn:audience:professional_area:hospitality_professional",
      label: "Hospitality Professional",
    },
    {
      value: "urn:audience:professional_area:medical_professional",
      label: "Medical Professional",
    },
    {
      value: "urn:audience:professional_area:advertising_design",
      label: "Advertising Design",
    },
    {
      value: "urn:audience:professional_area:technology_professional",
      label: "Technology Professional",
    },
    {
      value: "urn:audience:professional_area:marketing_professional",
      label: "Marketing Professional",
    },
    {
      value: "urn:audience:professional_area:retail_professional",
      label: "Retail Professional",
    },
    {
      value: "urn:audience:professional_area:finance_professional",
      label: "Finance Professional",
    },
  ],
};

export const ageGroupOptions = [
  { value: "24_and_younger", label: "24 and younger" },
  { value: "25_to_29", label: "25 to 29" },
  { value: "30_to_34", label: "30 to 34" },
  { value: "35_to_44", label: "35 to 44" },
  { value: "45_to_54", label: "45 to 54" },
  { value: "55_and_older", label: "55 and older" },
];

export const genderOptions = [
  { value: "all", label: "All" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const interests = [
  {
    label: "Movies",
    type: "urn:entity:movie",
    placeholder: "Add movies...",
    icon: <Clapperboard className="w-4 h-4" />,
  },
  {
    label: "People",
    type: "urn:entity:person",
    placeholder: "Add people...",
    icon: <PersonStanding className="w-4 h-4" />,
  },
  {
    label: "Artists",
    type: "urn:entity:artist",
    placeholder: "Add artists...",
    icon: <Mic2 className="w-4 h-4" />,
  },
  {
    label: "Books",
    type: "urn:entity:book",
    placeholder: "Add books...",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    label: "Brands",
    type: "urn:entity:brand",
    placeholder: "Add brands...",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    label: "Places",
    type: "urn:entity:place",
    placeholder: "Add places...",
    icon: <House className="w-4 h-4" />,
  },
  {
    label: "TV Shows",
    type: "urn:entity:tv_show",
    placeholder: "Add TV shows...",
    icon: <Tv className="w-4 h-4" />,
  },
  {
    label: "Video Games",
    type: "urn:entity:videogame",
    placeholder: "Add video games...",
    icon: <Gamepad2 className="w-4 h-4" />,
  },
  {
    label: "Podcasts",
    type: "urn:entity:podcast",
    placeholder: "Add podcasts...",
    icon: <Podcast className="w-4 h-4" />,
  },
];
