import { getCollection } from "../../../lib/mongodb";

type Params = Promise<{ id: string }>;

async function fetchTMDBInfo(tmdbId: string): Promise<any> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_key}`,
  );
  if (!res.ok) throw new Error("Failed to fetch from TMDB");
  return await res.json();
}

async function fetchOMDBInfo(imdbID: string): Promise<any> {
  const res = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.key}&i=${imdbID}`,
  );
  if (!res.ok) throw new Error("Failed to fetch from OMDB");
  return await res.json();
}

import MovieClient from "./MovieClient";

export default async function MoviePage(props: { params: Params }) {
  const { id } = await props.params;

  // Get reviews from MongoDB
  const collection = await getCollection();
  const dbDoc = await collection.findOne({ movieId: id });
  const reviews = dbDoc?.revs || [];

  // Fetch TMDB data
  const tmdbData = await fetchTMDBInfo(id);
  const imdbID = tmdbData.imdb_id;

  let movie: any = {};

  if (imdbID) {
    const omdbData = await fetchOMDBInfo(imdbID);

    // Use OMDb as primary data source (to match MovieClient format)
    movie = {
      ...omdbData,
      // Fall back to TMDB values if OMDb fields are missing
      Poster: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
      Poster2: `public/images/poster.jpg`,
      Title: omdbData.Title || tmdbData.title,
      Year: omdbData.Year || tmdbData.release_date?.split("-")[0],
      Released: omdbData.Released || tmdbData.release_date,
      Genres: tmdbData.genres ?? [],
      Runtime: omdbData.Runtime || `${tmdbData.runtime} min`,
      Rated: omdbData.Rated || "N/A",
      Plot: omdbData.Plot || tmdbData.overview,
      imdbID: imdbID,
    };
  } else {
    // If no IMDb ID, fallback entirely to TMDB structure
    movie = {
      Title: tmdbData.title,
      Year: tmdbData.release_date?.split("-")[0],
      Released: tmdbData.release_date,
      Genres: tmdbData.genres ?? [],
      Runtime: `${tmdbData.runtime} min`,
      Poster: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
      Poster2: `public/images/poster.jpg`,
      Rated: "N/A",
      Plot: tmdbData.overview,
      Director: "N/A",
      Actors: "N/A",
      Ratings: [],
      imdbID: "",
    };
  }

  return <MovieClient id={id} movie={movie} reviews={reviews} />;
}
