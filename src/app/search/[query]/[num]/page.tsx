import MovieList from './MovieList';

type PageProps = {
  params: {
    query: string;
    num: string;
  };
};

type Movie = {
  imdbID: string;
  Title: string;
  Year: number;
  Poster: string;
};

async function fetchMovies(query: string, page: number): Promise<Movie[]> {
  const res = await fetch(`http://www.omdbapi.com/?apikey=${process.env.key}&s=${query}&page=${page}`);
  const data = await res.json();
  return data.Search || [];
}

export default async function SearchResults({ params }: PageProps) {
  const { query, num } = await params;
  const page = parseInt(num, 10) || 1;
  const results = await fetchMovies(query, page);

  return <MovieList movies={results} query={query} page={page} />;
}
