"use client";

import { useState, useMemo } from "react";
import MovieCard from "../MovieCards";
import { Movie, MovieApiResponse } from "@/lib/types";

function MovieGrid({ movies }: { movies: Movie[] }) {
  // MEMOIZATION: Caches the JSX generation. 
  // If the parent component re-renders (e.g., because a 'loading' state changes), 
  // React won't needlessly re-map the entire array of movies.
  const movieElements = useMemo(() => {
    return movies.map((movie, index) => {
      const uniqueKey = movie.tmdb_id ? `${movie.tmdb_id}-${index}` : `fallback-${index}`;
      return <MovieCard key={uniqueKey} movie={movie} />;
    });
  }, [movies]);

  return (
    <div className="grid grid-cols-2 justify-items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movieElements}
    </div>
  );
}

export default function Grid({ movies }: { movies: Movie[] }) {
  // CLEANUP: Removed unused useRef, useEffect, and motion imports.
  // Set initial page to 1 (since the server passed you page 1).
  const [currentPage, setCurrentPage] = useState(1);
  const [movieList, setMovieList] = useState<Movie[]>(movies);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreMovies = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    const nextPage = currentPage + 1;

    try {
      const res = await fetch(`/api/available?page=${nextPage}`);
      const data: MovieApiResponse = await res.json();

      if (data?.results) {
        setMovieList((prevMovies) => [...prevMovies, ...data.results]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to fetch more movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-4 md:px-12 py-12 md:py-20 bg-neutral-950">
      <div className="mb-8 md:mb-12 border-b border-white/10 pb-6">
        <h2 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
          All Movies
        </h2>
      </div>

      <MovieGrid movies={movieList} />

      <div className="mt-16 md:mt-20 flex justify-center">
        <button
          className="bg-transparent cursor-pointer border border-white/20 text-white font-label font-bold uppercase px-8 md:px-12 py-3 md:py-4 text-[10px] tracking-[0.3em] hover:bg-white hover:text-black md:transition-all md:duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={loadMoreMovies}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More Titles"}
        </button>
      </div>
    </section>
  );
}