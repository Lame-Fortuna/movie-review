'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/nav'
import Image from 'next/image';

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
    <div className="w-full">
      <Navbar />

      {/* Filter Dropdown */}
      <div className="w-[95%] m-4 flex items-center justify-end">
        <label className="text-lg pr-3">Filter</label>
        <select className="select select-bordere w-30">
          <option>Sort By</option>
          <option>Release Year</option>
          <option>Alphabetical</option>
          <option>Popularity</option>
        </select>
      </div>

      {/* Movie Cards */}
      <div className="w-[90%] m-auto flex flex-wrap justify-center p-4">
        {movies.length === 0 ? (
          <p>No results found</p>
        ) : (
          movies.map((movie) => {
            const [src, setSrc] = useState(`${movie.Poster}`);

            return (
              <a key={movie.imdbID} className="card w-60 h-100 m-3 bg-[#38435b] shadow-xl text-center overflow-hidden" href={`/movies/${movie.imdbID}`}>
                <figure>
                  <Image
                    src={src}
                    alt={movie.Title}
                    className="w-full h-80 object-top"
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
