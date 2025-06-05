'use client';

import React, { useState } from 'react';

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
};

export default function MovieList({ movies, query, page }: Props) {
  return (
    <div className="container mx-auto">
      {/* Search + Nav */}
      <nav className="navbar bg-base-100 shadow mb-2 px-4">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/">Home</a>
        </div>
        <div className="flex-none">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const val = (e.target as any).search.value.trim();
              if (val.length >= 2) {
                window.location.href = `/search/${encodeURIComponent(val)}/1`;
              }
            }}
          >
            <input
              name="search"
              type="text"
              placeholder="Search"
              className="input input-bordered"
            />
          </form>
        </div>
        <div className="ml-4">
          <button className="btn btn-outline">Admin</button>
        </div>
      </nav>

      {/* Filter Dropdown */}
      <div className="mb-4 w-full flex items-center justify-end">
        <label className="text-lg pr-3">Filter</label>
        <select className="select select-bordere w-30">
          <option>Sort By</option>
          <option>Release Year</option>
          <option>Alphabetical</option>
          <option>Popularity</option>
        </select>
      </div>

      {/* Movie Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
        {movies.length === 0 ? (
          <p>No results found</p>
        ) : (
          movies.map((movie) => {
            const [src, setSrc] = useState(`${movie.Poster}`);

            return (
              <a key={movie.imdbID} className="card w-full bg-[#38435b] shadow-xl" href={`/movies/${movie.imdbID}`}>
                <figure>
                  <img
                    src={src}
                    alt={movie.Title}
                    className="w-full h-auto object-cover"
                    onError={() => setSrc('/images/poster.jpg')}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{movie.Title} {movie.Year}</h2>
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
            <a href={`/search/${query}/${page - 1}`} className="join-item btn">
              « Prev
            </a>
          )}
          <button className="join-item btn">Page {page}</button>
          <a href={`/search/${query}/${page + 1}`} className="join-item btn">
            Next »
          </a>
        </div>
      </footer>
    </div>
  );
}
