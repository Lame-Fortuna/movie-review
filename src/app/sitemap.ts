import { MetadataRoute } from "next";
import movieLists from "@/lib/MovieLists.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://filmatlas.online";
  const now = new Date();

  // STATIC CORE PAGES
  const staticPages = [
    "",
    "/catalogue/vintage",
    "/catalogue/noir",
    "/catalogue/chaplin",
    "/catalogue/oldbollywood",
    "/catalogue/oldjapanese",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // ALL TMDB GENRES
  const genres = [
    { id: 28, slug: "action" },
    { id: 12, slug: "adventure" },
    { id: 16, slug: "animation" },
    { id: 35, slug: "comedy" },
    { id: 80, slug: "crime" },
    { id: 99, slug: "documentary" },
    { id: 18, slug: "drama" },
    { id: 10751, slug: "family" },
    { id: 14, slug: "fantasy" },
    { id: 36, slug: "history" },
    { id: 27, slug: "horror" },
    { id: 10402, slug: "music" },
    { id: 9648, slug: "mystery" },
    { id: 10749, slug: "romance" },
    { id: 878, slug: "science-fiction" },
    { id: 10770, slug: "tv-movie" },
    { id: 53, slug: "thriller" },
    { id: 10752, slug: "war" },
    { id: 37, slug: "western" },
  ];

  const GENRE_PAGES = 10;

  const genrePages = genres.flatMap((genre) =>
    Array.from({ length: GENRE_PAGES }, (_, i) => ({
      url: `${baseUrl}/search/genre-${genre.id}/${i + 1}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: i === 0 ? 0.9 : 0.6,
    }))
  );

  // PAGINATED COLLECTIONS
  const collections = ["popular", "trending"];
  const COLLECTION_PAGES = 10;

  const collectionPages = collections.flatMap((type) =>
    Array.from({ length: COLLECTION_PAGES }, (_, i) => ({
      url: `${baseUrl}/search/${type}/${i + 1}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: i === 0 ? 0.9 : 0.6,
    }))
  );

  //ALL MOVIE DETAIL PAGES
  const movieArrays = Object.values(movieLists);

  const moviePages = movieArrays.flat().map((movie: any) => ({
    url: `${baseUrl}/movies/${movie.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // FINAL SITEMAP
  return [
    ...staticPages,
    ...genrePages,
    ...collectionPages,
    ...moviePages,
  ];
}
