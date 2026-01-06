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

export async function generateMetadata() {
  const title = "Film-Atlas | Discover Movies, Classics & Hidden Gems";
  const description =
    "Explore trending movies, vintage classics, and curated collections on Film-Atlas. Discover, browse, and enjoy cinema from around the world.";

  const url = "https://filmatlas.online";
  const image = "https://filmatlas.online/og-home.jpg"; // create later if needed

  return {
    title,
    description,
    keywords: [
      "movies",
      "film database",
      "classic movies",
      "vintage cinema",
      "movie discovery",
      "film atlas",
      "watch movies",
      "movie recommendations",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Film-Atlas",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Film-Atlas – Discover Movies",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    icons: {
      icon: "/filmAtlas.ico",
    },
  };
}

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
