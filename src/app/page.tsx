import Home from "./Home";
import movieLists from "../lib/MovieLists.json";
import { getCollection } from "@/lib/mongodb";

type Movie = {
  backdrop_path?: string;
  id?: number;
  year?: number;
  poster_path?: string;
  title?: string;
};

type HomepageData = {
  live: any | null;
  static: any | null;
};

// Fetch homepage data from MongoDB
async function fetchHomepageData(): Promise<HomepageData | null> {
  try {
    const collection = await getCollection("homepage");

    const [live, staticData] = await Promise.all([
      collection.findOne({ id: "live" }),
      collection.findOne({ id: "static" }),
    ]);

    if (!live && !staticData) return null;

    return { live, static: staticData };
  } catch (error) {
    console.error("[Homepage] MongoDB unavailable", error);
    return null;
  }
}

export default async function SearchResults() {
  const data = await fetchHomepageData();

  const movies = {
    trending:
      data?.live?.Trending?.length
        ? data.live.Trending
        : movieLists.Trending,

    popular:
      data?.live?.Popular?.length
        ? data.live.Popular
        : movieLists.Popular,

    vintage:
      data?.static?.Vintage?.length
        ? data.static.Vintage
        : movieLists.Vintage,

    horror:
      data?.static?.Horror?.length
        ? data.static.Horror
        : movieLists.Horror,

    comedy:
      data?.static?.Comedy?.length
        ? data.static.Comedy
        : movieLists.Comedy,

    action:
      data?.static?.Action?.length
        ? data.static.Action
        : movieLists.Action,
  };

  return <Home movies={movies} />;
}
