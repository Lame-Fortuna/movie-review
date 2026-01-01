"use client";

import React, { useState } from "react";
import Navbar from "../../../components/nav";
import Head from "next/head";

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

export default function MovieList({
  movies,
  query,
  page,
  sortBy,
  showSort,
}: Props) {
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    setCurrentSortBy(newSortBy);
    // Navigate immediately to the new sort URL
    window.location.href = `/search/${query}/${page}/${newSortBy}`;
  };

  return (
    <div className="w-full">
      <Head>
        {showSort? <title>{query} Movies</title>: <title>Result for {query}</title>}
        <title>{}</title>
      </Head>

      <Navbar />

      {/* Sort Filter */}
      {showSort && (
        <div className="w-[95%] m-4 flex items-center justify-end">
          <label className="text-lg pr-3">Sort By</label>
          <select
            className="select select-bordered w-30"
            value={currentSortBy}
            onChange={handleSortChange}
          >
            <option value="popularity.desc">Popularity</option>
            <option value="release_date.desc">Release Date</option>
            <option value="vote_average.desc">Vote Average</option>
          </select>
        </div>
      )}

      {/* Movie Cards */}
      <div className="w-[90%] m-auto flex flex-wrap justify-center p-4">
        {movies.length === 0 ? (
          <p>No results found</p>
        ) : (
          movies.map((movie) => {
            const [src, setSrc] = useState(`${movie.Poster}`);

            return (
              <a
                key={movie.imdbID}
                className="card w-60 h-100 m-3 bg-[#38435b] shadow-xl text-center overflow-hidden"
                href={`/movies/${movie.imdbID}`}
              >
                <figure>
                  <img
                    src={src}
                    alt={movie.Title}
                    title={`Poster for ${movie.Title}`}
                    className="w-full h-80 object-top"
                    onError={() => setSrc("/images/poster.webp")}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {movie.Title} {movie.Year}
                  </h2>
                </div>
              </a>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <footer className="mt-6 mb-6 flex justify-center">
        <div className="join m-auto">
          {page > 1 && (
            <a
              href={`/search/${query}/${page - 1}/${currentSortBy}`}
              className="join-item btn"
            >
              « Prev
            </a>
          )}
          <button className="join-item btn">Page {page}</button>
          <a
            href={`/search/${query}/${page + 1}/${currentSortBy}`}
            className="join-item btn"
          >
            Next »
          </a>
        </div>
      </footer>
    </div>
  );
}