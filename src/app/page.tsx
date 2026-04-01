import Home from "../components/home/Home";
import movieLists from "@/lib/MovieLists.json";
import { getCollection } from "@/lib/mongodb";

type HomepageData = {
  homeCollection: any | null;
};

// Fetch homepage data from MongoDB
async function fetchHomepageData(): Promise<HomepageData | null> {
  try {
    const collection = await getCollection("homepage");

    const homeCollection = await collection.findOne({ id: "all" });

    if (!homeCollection) return null;

    return { homeCollection };
  } catch (error) {
    console.error("[Homepage] MongoDB unavailable", error);
    return null;
  }
}

export default async function SearchResults() {
  const data = await fetchHomepageData();

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

    best: data?.homeCollection.Best || movieLists.IMDB35.slice(15, 20),
    macabre: data?.homeCollection.Macabre || movieLists.Macabre,
    crime: data?.homeCollection.Crime || movieLists.Crime,
    fantasy: data?.homeCollection.Fantasy || movieLists.Fantasy,
    comedy: data?.homeCollection.Comedy || movieLists.Comedy,
    melodrama: data?.homeCollection.Melodramas || movieLists.Melodramas,
    unothodox: data?.homeCollection.Unorthodox || movieLists.Unorthodox,
    imdb35: data?.homeCollection.IMDB35.slice(15, 30) || movieLists.IMDB35.slice(15, 30),
  };

  return <Home movies={movies} />;
}
