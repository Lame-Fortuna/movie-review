// app/page.tsx
import Home from "./Home";
import movieLists from '../lib/MovieLists.json';


type Movie = {
  backdrop_path?: string;
  id?: number;
  year?: number;
  poster_path?: string;
  title?: string;
};

const API_KEY = process.env.TMDB_key;
const BASE_URL = "https://api.themoviedb.org/3";

// Tab title and icon
export async function generateMetadata() {
  return {
    title: "Film Atlas",
    description: "Explore movies and TV Shows",
    icons: {
      icon: "/filmAtlas.ico",
    },
  };
}

// Fallback dummy movie
const fallbackMovie: Movie = {
  id: 0,
  title: "Unavailable",
  poster_path: "/image/poster.jpg", // This should be in your public/ folder
  backdrop_path: "/image/poster.jpg",
};

const vintage = movieLists["Vintage"];
const horror = movieLists["Horror"];
const comedy = movieLists["Comedy"];
const action = movieLists["Action"];
const popular = movieLists["Popular"];


export default async function SearchResults() {
  const endpoints = {
    trending: `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`,
  };

  // Fetching movies directly in server component
  const trending = await fetch(endpoints.trending)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch movies");
      return res.json();
    })
    .catch(() => {
      // Fallback in case of error
      return { results: [fallbackMovie] };
    });

  // Prepare movie data
  const movies = {
    trending: Array.isArray(trending.results)
      ? trending.results
      : [fallbackMovie],
    vintage: vintage || [],
    popular: popular || [],
    horror: horror || [],
    comedy: comedy || [],
    action: action || [],
  };

  return <Home movies={movies} />;
}