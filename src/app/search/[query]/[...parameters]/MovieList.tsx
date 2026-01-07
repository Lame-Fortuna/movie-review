"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import Navbar from "@/app/components/nav";
import Footer from "@/app/components/footer";

type Movie = {
  id: string;
  title: string;
  year: number;
  poster: string;
};

type Props = {
  movies: Movie[];
  query: string;
  page: number;
  sortBy: string;
  showSort: boolean;
};

function MovieCard({ movie }: { movie: Movie }) {
  const [src, setSrc] = useState(movie.poster);
  return (
    <Link href={`/movies/${movie.id}`}className="group block w-[90px] sm:w-[120px] md:w-[150px] m-3 cursor-pointer">
      {/* Poster */}
      <div className="w-full aspect-[2/3] overflow-hidden">
        <img
          src={
            movie.poster
              ? `https://image.tmdb.org/t/p/w300${movie.poster}`
              : "/images/poster.webp"
          }
          alt={movie.title || "Poster"}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/poster.webp";
          }}
        />
      </div>

      {/* Text */}
      <div className="text-slate-100 flex-1 flex flex-col justify-center px-2 py-2">
        <p className="text-sm sm:text-base font-medium leading-tight line-clamp-2">
          {movie.title}
        </p>
        <p className="text-xs sm:text-sm opacity-80 mt-1">
          {movie.year}
        </p>
      </div>
    </Link>
  );
}


export default function MovieList({movies, query, page, sortBy, showSort, }: Props) {
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);

  const pageTitle = showSort? `${query} Movies`: `Results for ${query}`;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    setCurrentSortBy(newSortBy);

    // Client-side navigation is better, but keeping your behavior
    window.location.href = `/search/${query}/${page}/${newSortBy}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">

        <h1 className="text-shadow-white text-3xl text-center">{pageTitle}</h1>
        
        {/* Sort Filter */}
        {showSort && (
          <div className="w-40 mx-auto my-4 flex items-center justify-end px-4">
            <label htmlFor="sort" className="text-lg pr-3">
              Sort By
            </label>
            <select
              id="sort"
              className="select select-bordered"
              value={currentSortBy}
              onChange={handleSortChange}
            >
              <option value="popularity.desc">Popularity</option>
              <option value="release_date.desc">Release Date</option>
              <option value="vote_average.desc">Vote Average</option>
            </select>
          </div>
        )}

        {/* Movie Grid */}
        <section className="max-w-6xl mx-auto flex flex-wrap justify-center p-4">
          {movies.length === 0 ? (
            <p className="text-lg opacity-70">No results found.</p>
          ) : (
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          )}
        </section>

        {/* Pagination Footer */}
        <footer className="my-6 flex justify-center">
          <nav aria-label="Pagination" className="join">
            {page > 1 && (
              <Link
                href={`/search/${query}/${page - 1}/${currentSortBy}`}
                className="join-item btn"
              >
                « Prev
              </Link>
            )}

            <span className="join-item btn cursor-default">
              Page {page}
            </span>

            <Link
              href={`/search/${query}/${page + 1}/${currentSortBy}`}
              className="join-item btn"
            >
              Next »
            </Link>
          </nav>
        </footer>
      </main>

      <Footer />
    </div>
  );
}
