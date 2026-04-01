


// Movie Page Types

export type CreditActor = { id: number; name: string; character: string; profile_image: string | null; };
export type CreditDirector = { id: number; name: string; };
export type CreditWriter = { id: number; name: string; job: string; };
export type CreditCrew = { id: number; name: string; job: string; department: string; };

export type CreditsData = {
  directors: CreditDirector[];
  writers: CreditWriter[];
  actors: CreditActor[];
  crew: CreditCrew[];
};

export type WatchProvider = {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
};

export type WatchRegion = {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
};

export type WhereToWatch = Record<string, WatchRegion>;

export type Ratings = {
  tmdb_rating?: number;
  tmdb_votes?: number;
  imdb_rating?: string;
  imdb_votes?: string;
  metascore?: string;
  rotten_tomatoes?: string;
};

export type Movie = {
  tmdb_id: number;
  imdb_id?: string;
  title: string;
  original_title?: string;
  original_language?: string;
  status?: string;
  release_date?: string;
  year?: number;
  runtime?: number;
  rated?: string;
  tagline?: string;
  plot_summary?: string;
  imdb_rating?: string | number | null;
  
  // Arrays
  genres?: string[];
  keywords?: string[];
  // alternative_titles?: string[];
  // spoken_languages?: string[];
  
  // Financials
  // budget?: number;
  // revenue?: number;
  // box_office?: string | number;
  
  // Images & Media
  poster?: string | null;
  poster_original?: string;
  poster2?: string;
  backdrop?: string;
  // backdrop_original?: string;
  trailerKey?: string; 
  
  // Credits & Ratings
  director?: string;      
  actors?: string | string[];      
  credits?: CreditsData; 
  ratings?: Ratings;
  
  // Regions & Providers
  production_countries?: string;
  // where_to_watch?: WhereToWatch;
  
  // Meta
  sources?: string[] | null;
  collection?: string;
  restricted?: boolean;
};

export type Recommendation = {
  tmdb_id: number;
  title: string;
  year?: number;
  poster?: string | null;
  ratings?: Ratings;
  runtime?: number;
};

export type MovieApiResponse = {
  count: number;
  page: number;
  results: Movie[];
};

// Reviews
export interface Review {
  usr: string;
  rating: number;
  review: string;
}

// Cataloue Page
export type Table = {
  title?: string;
  desc?: string;
  movies: Movie[];
};

export type Catalogue = {
  title: string;
  desc?: string;
  [key: string]: any;
};



