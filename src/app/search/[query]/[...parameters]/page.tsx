import MovieList from "./MovieList";

type Params = Promise<{
  query: string;
  parameters: string[];
}>;

type Movie = {
  imdbID: string;
  Title: string;
  Year: number;
  Poster: string;
};

// Fetch movies based on query, page, and sortBy
async function fetchMovies(
  query: string,
  page: number,
  sortBy: string,
): Promise<{ movies: Movie[]; isDiscovery: boolean }> {
  const apiKey = process.env.TMDB_key;

  const isGenre = query.startsWith("genre-");
  const isPopular = query === "popular";
  const isCast = query.startsWith("cast-");
  const isDirector = query.startsWith("director-");

  let url = "";
  let isDiscovery = isGenre || isCast || isDirector;

  if (isGenre) {
    const genreId = query.split("-")[1];
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=${sortBy}&page=${page}`;
  } else if (isPopular) {
    url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
    isDiscovery = false;
  } else if (isCast || isDirector) {
    const name = query.split("-")[1];
    const personRes = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(name)}`,
    );
    const personData = await personRes.json();

    if (!personRes.ok || !personData.results?.length) {
      return { movies: [], isDiscovery };
    }

    const personId = personData.results[0].id;
    const filter = isCast ? `with_cast=${personId}` : `with_crew=${personId}`; // director

    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${filter}&sort_by=${sortBy}&page=${page}`;
  } else {
    // keyword fallback
    const encodedQuery = encodeURIComponent(query);
    url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodedQuery}&page=${page}`;
    isDiscovery = false;
  }

  //console.log("TMDB URL:", url);

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || !data.results) return { movies: [], isDiscovery };

  const movies: Movie[] = data.results.map((m: any) => ({
    imdbID: m.id.toString(),
    Title: m.title,
    Year: m.release_date?.split("-")[0] || "N/A",
    Poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : "/images/poster.jpg",
  }));

  return { movies, isDiscovery };
}

export default async function SearchPage(props: { params: Params }) {
  const { query, parameters } = await props.params;
  const page = parameters[0] ? parseInt(parameters[0], 10) : 1;
  const sortBy = parameters[1] || "popularity.desc";

  //console.log("QUERY:", query);
  //console.log("PARAMETERS:", parameters);
  //console.log("PAGE:", page);

  const { movies, isDiscovery } = await fetchMovies(query, page, sortBy);
  return (
    <MovieList
      movies={movies}
      query={query}
      page={page}
      sortBy={sortBy}
      showSort={isDiscovery}
    />
  );
}