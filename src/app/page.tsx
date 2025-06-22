'use client';

import Home from './Home';

type Movie = {
  id: number;
  year?: number; // made optional
  title: string;
  poster_path: string;
  backdrop_path: string;
};

const API_KEY = process.env.TMDB_key;
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchMoviesFromEndpoint(endpoint: string): Promise<Movie[]> {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Failed to fetch movies');
  const data = await res.json();
  return data.results;
}

// fallback dummy movie
const fallbackMovie: Movie = {
  id: 0,
  title: 'Unavailable',
  poster_path: '/poster.jpg', // This should be in your public/ folder
  backdrop_path: '/poster.jpg',
};

export default async function SearchResults() {
  const endpoints = {
    trending: `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`,
    popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
    horror: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&sort_by=vote_average.desc&vote_count.gte=100`,
    comedy: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&sort_by=vote_average.desc&vote_count.gte=100`,
    action: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&sort_by=vote_average.desc&vote_count.gte=100`,
  };

  try {
    const [trending, popular, horror, comedy, action] = await Promise.all([
      fetchMoviesFromEndpoint(endpoints.trending),
      fetchMoviesFromEndpoint(endpoints.popular),
      fetchMoviesFromEndpoint(endpoints.horror),
      fetchMoviesFromEndpoint(endpoints.comedy),
      fetchMoviesFromEndpoint(endpoints.action),
    ]);

    const movies = { trending, popular, horror, comedy, action };
    return <Home movies={movies} />;
  } catch (error) {
    console.error('API fetch failed:', error);

    // fallback data
    const movies = {
      trending: [fallbackMovie],
      popular: [fallbackMovie],
      horror: [fallbackMovie],
      comedy: [fallbackMovie],
      action: [fallbackMovie],
    };

    return <Home movies={movies} />;
  }
}
