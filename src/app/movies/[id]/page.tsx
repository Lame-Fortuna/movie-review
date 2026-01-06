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
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_key}`
  );
  if (!res.ok) throw new Error("Failed to fetch from TMDB");
  return await res.json();
}

async function fetchOMDBInfo(imdbID: string): Promise<any> {
  const res = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.key}&i=${imdbID}`
  );
  if (!res.ok) throw new Error("Failed to fetch from OMDB");
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

  let movie: any = {};

  if (imdbID) {
    const omdbData = await fetchOMDBInfo(imdbID);
    movie = {
      ...omdbData,
      Backdrop: `https://image.tmdb.org/t/p/w500${tmdbData.backdrop_path}`,
      Poster: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
      Poster2: `public/images/poster.jpg`,
      Title: omdbData.Title || tmdbData.title,
      OriginalTitle: tmdbData.original_title,
      OriginalLanguage: tmdbData.original_language,
      OriginalCountry: tmdbData.origin_country,
      Year: omdbData.Year || tmdbData.release_date?.split("-")[0],
      Released: omdbData.Released || tmdbData.release_date,
      Genres: tmdbData.genres ?? [],
      Runtime: omdbData.Runtime || `${tmdbData.runtime} min`,
      Rated: omdbData.Rated || "N/A",
      Plot: tmdbData.overview,
      imdbID,
    };
  } else {
    movie = {
      Title: tmdbData.title,
      OriginalTitle: tmdbData.original_title,
      OriginalLanguage: tmdbData.original_language,
      OriginalCountry: tmdbData.origin_country,
      Year: tmdbData.release_date?.split("-")[0],
      Released: tmdbData.release_date,
      Genres: tmdbData.genres ?? [],
      Runtime: `${tmdbData.runtime} min`,
      Backdrop: `https://image.tmdb.org/t/p/w500${tmdbData.backdrop_path}`,
      Poster: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
      Poster2: `public/images/poster.jpg`,
      Rated: "N/A",
      Plot: tmdbData.overview,
      Director: "N/A",
      Actors: "N/A",
      Ratings: [],
      imdbID: imdbID || "",
    };
  }

  const hasStream = Boolean(dbDoc?.src);
  const src = dbDoc?.src;

  return hasStream ? (
    <MovieStream id={id} movie={{ ...movie, src }} reviews={reviews} />
  ) : (
    <MovieClient id={id} movie={movie} reviews={reviews} />
  );
}