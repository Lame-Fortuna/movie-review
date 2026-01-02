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
    <Link
      href={`/movies/${movie.id}`}
      className="group block w-40 md:w-48 lg:w-52 m-3 cursor-pointer"
    >
      <div className="relative w-full h-[270px] bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <img
          src={src}
          alt={`Poster of ${movie.title}`}
          title={`Poster for ${movie.title}`}
          className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
          onError={() => setSrc("/images/poster.webp")}
        />
      </div>

      <div className="mt-2 text-center">
        <h2 className="text-sm font-semibold text-white truncate">
          {movie.title}
        </h2>
        <p className="text-xs text-gray-300">
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
        <Head>
          <title><h1>{pageTitle}</h1></title>
        </Head>

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
