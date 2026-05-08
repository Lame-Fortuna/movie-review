import { Movie, CreditsData } from "./types";

function pickNameList(items: any[]): string {
  if (!Array.isArray(items) || items.length === 0) return "N/A";
  return items
    .map((item) => item?.name)
    .filter(Boolean)
    .join(", ");
}

function pickOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function pickStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

function pickCriticReviews(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is { source: string; sentiment?: number; quote_summary: string; avatar?: string | null } =>
      Boolean(
        item &&
        typeof item === "object" &&
        typeof item.source === "string" &&
        item.source.trim() &&
        typeof item.quote_summary === "string" &&
        item.quote_summary.trim(),
      ),
  );
}

export function normalizeMoviePayload(payload: any): Movie {
  const additional = payload?.additional ?? {};

  return {
    tmdb_id: payload?.tmdb_id || 0,
    title: payload?.title || "Unknown Title",
    imdb_id: payload?.imdb_id,
    original_title: payload?.original_title,
    original_language: payload?.original_language,
    status: payload?.status,
    release_date: payload?.release_date,
    year: payload?.release_year || payload?.year,
    
    // Images are nested inside the "images" object
    poster: payload?.images?.poster,
    poster_original: payload?.images?.poster_original ?? payload?.images?.poster,
    poster2: payload?.images?.poster2,
    backdrop: payload?.images?.backdrop,
    
    // Standard primitive fields
    runtime: payload?.runtime,
    rated: payload?.age_certification,
    tagline: payload?.tagline,
    plot_summary: payload?.plot_summary,
    imdb_rating: payload?.ratings?.imdb_rating ?? payload?.imdb_rating ?? null,
    
    // Arrays that map directly
    genres: payload?.genres || [],
    keywords: payload?.keywords || [],
    alternative_titles: Array.isArray(payload?.alternative_titles)
      ? payload.alternative_titles.filter(Boolean)
      : [],

    budget: pickOptionalString(payload?.budget ?? additional?.budget),
    box_office: pickOptionalString(payload?.box_office ?? additional?.box_office),
    trivia: pickStringArray(payload?.trivia ?? additional?.trivia),
    critic_reviews: pickCriticReviews(payload?.critic_reviews ?? additional?.critic_reviews),
    critical_consensus: {
      summary: pickOptionalString(
        payload?.critical_consensus?.summary ?? additional?.critical_consensus?.summary,
      ),
    },
    
    // Extract the first trailer key from the nested videos object
    trailerKey: payload?.videos?.youtube_trailer_keys?.[0] || undefined,
    
    // Flatten the nested arrays for the Recommendation API
    director: pickNameList(payload?.credits?.directors),
    actors: pickNameList(payload?.credits?.actors),
    
    // Pass the raw credits and ratings objects straight through since they match the types
    credits: payload?.credits as CreditsData,
    ratings: payload?.ratings,
    
    // Format production countries from an array of objects into a single string
    production_countries: Array.isArray(payload?.production_countries)
      ? payload.production_countries.map((c: any) => c.iso_3166_1).join(", ")
      : undefined,
      
    sources: payload?.sources || payload?.source ||  null,
    collection: payload?.collection || undefined,
    restricted: payload?.restricted || false,
  };
}

const MOVIE_API_BASE = "https://my-app.classic-mdb.workers.dev/api/movies";

export async function fetchMovieById(id: string): Promise<Movie | null> {
  try {
    const response = await fetch(`${MOVIE_API_BASE}/${id}`, {
      headers: {
        "x-api-key": process.env.MOVIE_API_KEY || "", 
        "Content-Type": "application/json",
      },
      next: { revalidate: 6 * 60 * 60 },
    } as any);

    if (!response.ok) return null;
    
    const payload = await response.json();
    return normalizeMoviePayload(payload);
  } catch (error) {
    console.error(`Failed to fetch movie ${id}:`, error);
    return null;
  }
}
