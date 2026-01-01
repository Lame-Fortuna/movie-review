"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/app/components/nav";
import Footer from "@/app/components/footer";

type Movie = {
  imdbID: string;
  Title: string;
  Year: number;
  Poster: string;
};

type Props = {
  movies: Movie[];
  query: string;
  page: number;
  sortBy: string;
  showSort: boolean;
};

function MovieCard({ movie }: { movie: Movie }) {
  const [src, setSrc] = useState(movie.Poster);

  return (
    <Link
      href={`/movies/${movie.imdbID}`}
      className="card w-60 sm:w-30 m-3 bg-[#38435b] shadow-xl text-center overflow-hidden"
    >
      <figure>
        <img
          src={src}
          alt={movie.Title}
          title={`Poster for ${movie.Title}`}
          className="w-full h-80 sm:h-40 object-cover"
          onError={() => setSrc("/images/poster.webp")}
        />
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-sm">
          {movie.Title} ({movie.Year})
        </h2>
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
        <Head>
          <title><h1>{pageTitle}</h1></title>
        </Head>

        {/* Sort Filter */}
        {showSort && (
          <div className="max-w-6xl mx-auto my-4 flex items-center justify-end px-4">
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
              <MovieCard key={movie.imdbID} movie={movie} />
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
