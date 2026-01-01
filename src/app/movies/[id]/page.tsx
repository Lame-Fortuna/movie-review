import { getCollection } from "@/lib/mongodb";
import MovieStream from "./MovieStream";
import MovieClient from "./MovieClient";

type Params = Promise<{ id: string }>;

export async function generateMetadata(props: { params: Params }) {
  const { id } = await props.params;

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_key}&append_to_response=alternative_titles`
  );

  if (!res.ok) {
    // fallback metadata if TMDB is down or ID invalid
    return {
      title: "Movie Page | Film-Atlas",
      description: "Movie details, reviews and streaming information on Film-Atlas.",
      icons: { icon: "/filmAtlas.ico" },
    };
  }

  const data = await res.json();

  const primaryTitle =
    data.title || data.original_title || "Movie";
  const year = data.release_date?.split("-")[0];
  const genresArr: string[] = (data.genres ?? []).map((g: any) => g.name);
  const genresString = genresArr.join(", ");

  // Collect alternate titles (plus original_title) and dedupe
  const altTitlesRaw: string[] =
    (data.alternative_titles?.titles ?? []).map(
      (t: any) => t.title
    ) || [];

  const altTitles = Array.from(
    new Set(
      [
        ...altTitlesRaw,
        data.original_title,
      ].filter(Boolean)
    )
  );

  const altTitlesSnippet = altTitles.slice(0, 5).join(" · ");

  const baseOverview =
    data.overview ||
    `Details, cast, ratings and reviews for ${primaryTitle}.`;

  const description = [
    baseOverview,
    altTitlesSnippet && `Also known as: ${altTitlesSnippet}.`,
    year &&
      `Released in ${year}${
        genresString ? ` • Genres: ${genresString}` : ""
      }.`,
  ]
    .filter(Boolean)
    .join(" ");

  const fullTitle = year
    ? `${primaryTitle} (${year}) | Watch Online, Cast, Reviews & More`
    : `${primaryTitle} | Watch Online, Cast, Reviews & More`;

  return {
    title: fullTitle,
    description,
    keywords: [
      primaryTitle,
      ...altTitles,
      ...genresArr,
      "full movie",
      "streaming",
      "movie reviews",
      "cast and crew",
      "Film-Atlas",
    ].filter(Boolean),
    openGraph: {
      title: `${primaryTitle}${year ? ` (${year})` : ""} – Film-Atlas`,
      description,
      type: "video.movie",
      images: data.backdrop_path
        ? [
            {
              url: `https://image.tmdb.org/t/p/w780${data.backdrop_path}`,
              alt: primaryTitle,
            },
          ]
        : undefined,
    },
    icons: {
      icon: "/filmAtlas.ico",
    },
  };
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

export default async function MoviePage(props: { params: Params }) {
  const { id } = await props.params;

  // Getting Reviews
  let reviews: any[] = [];
  let dbDoc: any = null;

  try {
    const collection = await getCollection('reviews');
    dbDoc = await collection.findOne({ movieId: id });
    reviews = dbDoc?.revs ?? [];
  } catch (error) {
    console.error("MongoDB error:", error);
    reviews = [];
    dbDoc = null;
  }

  

  // Fetch TMDB data
  const tmdbData = await fetchTMDBInfo(id);
  const imdbID = tmdbData.imdb_id;

  let movie: any = {};

  if (imdbID) {
    const omdbData = await fetchOMDBInfo(imdbID);

    // Use OMDb as primary data source (to match MovieClient format)
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
      imdbID: imdbID,
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

  // ⬇️ Check if the DB document has a `src` field to determine which component to render
  const hasStream = Boolean(dbDoc?.src);
  const src = dbDoc?.src;

  console.log("Movie Data:", movie);

  return hasStream
    ? <MovieStream id={id} movie={{ ...movie, src }} reviews={reviews} />
    : <MovieClient id={id} movie={movie} reviews={reviews} />;
}
