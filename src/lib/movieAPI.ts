import { Movie } from "@/lib/types";

export type MovieApiResponse = {
  count: number;
  page: number;
  results: Movie[];
};

const BASE_URL = "https://my-app.classic-mdb.workers.dev/api";
const apiKey = process.env.MOVIE_API_KEY;

async function fetchFromWorker(
  endpoint: string, 
  params: Record<string, string | number>
): Promise<MovieApiResponse> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;

  if (!apiKey) {
    console.error("Missing MOVIE_API_KEY in environment variables.");
    return { count: 0, page: 1, results: [] };
  }

  const headers: HeadersInit = {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, { headers, cache: 'no-store' }); 
    
    // Improved error handling: reads the actual error message from the worker
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error ${res.status} (${res.statusText}): ${errorText}`);
    }
    
    return (await res.json()) as MovieApiResponse;
  } catch (error) {
    console.error("Fetch error:", error);
    return { count: 0, page: 1, results: [] }; 
  }
}

export const movieApi = {
  search: (q: string, page = 1, sortBy = "popularity", order = "DESC") => 
    fetchFromWorker("/movie/search", { q, page, sortBy, order }),
    
  crew: (id: string, role: string, page = 1, sortBy = "popularity", order = "DESC") => 
    fetchFromWorker("/movie/crew", { id, role, page, sortBy, order }),
    
  genre: (genreName: string, page = 1, sortBy = "popularity", order = "DESC") => 
    fetchFromWorker(`/genres/${genreName}`, { page, sortBy, order }) 
};