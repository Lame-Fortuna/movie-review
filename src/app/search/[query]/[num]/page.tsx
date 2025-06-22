import MovieList from './MovieList'

type PageProps = {
  params: {
    query: string
    num: string
  }
}

type Movie = {
  imdbID: string
  Title: string
  Year: number
  Poster: string
}

async function fetchTMDBMovies(query: string, page: number): Promise<Movie[]> {
  const apiKey = process.env.TMDB_key
  const encodedQuery = encodeURIComponent(query)
  const useDiscovery = ['popularity', 'release_date', 'vote_average'].includes(query)

  const url = useDiscovery
    ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${query}.desc&page=${page}`
    : `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodedQuery}&page=${page}`

  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok || !data.results) return []

  // Map TMDB format to the simplified Movie object
  return data.results.map((m: any) => ({
    imdbID: m.id.toString(),
    Title: m.title,
    Year: m.release_date?.split('-')[0] || 'N/A',
    Poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : '/images/poster.jpg',
  }))
}

export default async function SearchResults({ params }: PageProps) {
  const { query, num } = params
  const page = parseInt(num, 10) || 1

  const results = await fetchTMDBMovies(query, page)

  return <MovieList movies={results} query={query} page={page} />
}
