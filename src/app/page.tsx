import Home from "@/components/home/Home";
import movieLists from "@/lib/MovieLists.json";
import { createMetadata } from "@/lib/metadata";
import { getCollection } from "@/lib/mongodb";
import { unstable_cache } from "next/cache";

type HomepageData = {
  homeCollection: any | null;
};

export const metadata = createMetadata({
  path: "/",
});

// Fetch all movies from API
async function fetchAllMovies(): Promise<any> {
  const response = await fetch(`https://my-app.classic-mdb.workers.dev/api/movies?page=1`, {
    method: "GET",
    headers: {
      "x-api-key": process.env.MOVIE_API_KEY || "", 
      "Content-Type": "application/json",
    },
    next: { revalidate: 6 * 60 * 60 }, // Revalidate every 6 hours
  });
  return response.json();
}

// Fetch homepage data from MongoDB
const fetchHomepageData = unstable_cache(
  async (): Promise<HomepageData | null> => {
    try {
      const collection = await getCollection("homepage");
      const homeCollection = await collection.findOne({ id: "all" });

      if (!homeCollection) return null;

      return { homeCollection };
    } catch (error) {
      console.error("[Homepage] MongoDB unavailable", error);
      return null;
    }
  },
  ['homepage-data'], // The unique cache key array for this data
  {
    revalidate: 12 * 60 * 60, // Cache this database query for 12 hours
    tags: ['homepage'], // Optional: Allows you to manually bust this cache later using revalidateTag('homepage')
  }
);

export default async function SearchResults() {
  const [data, all] = await Promise.all([
    fetchHomepageData(),
    fetchAllMovies().catch(() => null)
  ]);

  const home = data?.homeCollection;
  const apiResults = all?.results;

  const movies = {
    
    // best: movieLists.Best,
    // macabre: movieLists.Macabre,
    // crime: movieLists.Crime,
    // fantasy: movieLists.Fantasy,
    // comedy: movieLists.Comedy,
    // melodrama: movieLists.Melodramas,
    // unothodox: movieLists.Unorthodox,
    // homeCollection: movieLists.IMDB35.slice(15, 30),
    // imdb35: movieLists.IMDB35.slice(4, 14),

    best: home?.Best || movieLists.IMDB35.slice(15, 30),
    macabre: home?.Macabre || movieLists.Macabre,
    crime: home?.Crime || movieLists.Crime,
    fantasy: home?.Fantasy || movieLists.Fantasy,
    comedy: home?.Comedy || movieLists.Comedy,
    melodrama: home?.Melodramas || movieLists.Melodramas,
    unorthodox: home?.Unorthodox || movieLists.Unorthodox,
    imdb35: home?.IMDB35 ? home.IMDB35.slice(15, 30) : movieLists.IMDB35.slice(15, 30),
    all: apiResults || movieLists.IMDB35.slice(15, 30),
  };

  return <Home movies={movies} />;
}
