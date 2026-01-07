import { getCollection } from "@/lib/mongodb";
import MovieStream from "./MovieStream";
import MovieClient from "./MovieClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_key}`
    );

    if (!res.ok) throw new Error("TMDB error");

    const data = await res.json();

    const title = data.title || data.original_title || "Movie";
    const year = data.release_date?.split("-")[0];
    const fullTitle = year
      ? `${title} (${year}) | Film-Atlas`
      : `${title} | Film-Atlas`;

    return {
      title: fullTitle,
      description: data.overview,
      openGraph: {
        title: fullTitle,
        images: data.backdrop_path
          ? [`https://image.tmdb.org/t/p/w780${data.backdrop_path}`]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Movie | Film-Atlas",
    };
  }
}

async function fetchTMDBInfo(tmdbId: string): Promise<any> {

  // For total `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_key}&append_to_response=credits,videos,watch/providers,images,keywords,recommendations,similar`

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_key}&append_to_response=credits,videos,watch/providers,keywords`
  );
  if (!res.ok) throw new Error("Failed to fetch from TMDB");
  return await res.json();
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;

  // Getting Reviews
  let reviews: any[] = [];
  let dbDoc: any = null;

  try {
    const collection = await getCollection("reviews");
    dbDoc = await collection.findOne({ movieId: id });
    reviews = dbDoc?.revs ?? [];
  } catch (error) {
    console.error("MongoDB error:", error);
    reviews = [];
    dbDoc = null;
  }

  const tmdbData = await fetchTMDBInfo(id);
  const imdbID = tmdbData.imdb_id;

  const directors =
    tmdbData.credits?.crew
      ?.filter((person: any) => person.job === "Director")
      .map((person: any) => person.name)
      .join(", ") || "N/A";

  const actors =
    tmdbData.credits?.cast
      ?.slice(0, 5) // top 3–5 actors
      .map((person: any) => person.name)
      .join(", ") || "N/A";

  const trailer =
    tmdbData.videos?.results?.find(
      (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
    ) || null;

  const movie = {
    Title: tmdbData.title,
    OriginalTitle: tmdbData.original_title,
    OriginalLanguage: tmdbData.original_language,
    OriginalCountry: tmdbData.origin_country,
    Year: tmdbData.release_date?.split("-")[0],
    Released: tmdbData.release_date,
    Genres: tmdbData.genres ?? [],
    Runtime: tmdbData.runtime ? `${tmdbData.runtime} min` : "N/A",
    Backdrop: tmdbData.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${tmdbData.backdrop_path}`
      : null,
    Poster: tmdbData.poster_path
      ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
      : null,
    Poster2: `public/images/poster.jpg`,
    Rated: "N/A",
    Plot: tmdbData.overview,
    Director: directors,
    Actors: actors,
    Ratings: [],
    imdbID: imdbID || "",
    Trailer: trailer,
    Keywords: tmdbData.keywords?.keywords || [],
  };


  const hasStream = Boolean(dbDoc?.src);
  const src = dbDoc?.src;

  return hasStream ? (
    <MovieStream id={id} movie={{ ...movie, src }} reviews={reviews} />
  ) : (
    <MovieClient id={id} movie={movie} reviews={reviews} />
  );
}