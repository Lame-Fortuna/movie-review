import { Movie, CreditsData } from "./types";

function pickNameList(items: any[]): string {
  if (!Array.isArray(items) || items.length === 0) return "N/A";
  return items
    .map((item) => item?.name)
    .filter(Boolean)
    .join(", ");
}

export function normalizeMoviePayload(payload: any): Movie {
  return {
    tmdb_id: payload?.tmdb_id || 0,
    title: payload?.title || "Unknown Title",
    imdb_id: payload?.imdb_id,
    release_date: payload?.release_date,
    year: payload?.release_year || payload?.year,
    
    // Images are nested inside the "images" object
    poster: payload?.images?.poster,
    poster2: payload?.images?.poster2,
    backdrop: payload?.images?.backdrop,
    
    // Standard primitive fields
    runtime: payload?.runtime,
    rated: payload?.age_certification,
    tagline: payload?.tagline,
    plot_summary: payload?.plot_summary,
    
    // Arrays that map directly
    genres: payload?.genres || [],
    keywords: payload?.keywords || [],
    
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
      ? payload.production_countries.map((c: any) => c.name).join(", ")
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
      next: { revalidate: 3600 },
    } as any);

    if (!response.ok) return null;
    
    const payload = await response.json();
    return normalizeMoviePayload(payload);
  } catch (error) {
    console.error(`Failed to fetch movie ${id}:`, error);
    return null;
  }
}