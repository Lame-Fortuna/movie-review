"use client";

import React from "react";
import Navbar from "@/app/components/nav";
import Footer from "@/app/components/footer";
import Link from "next/link";

type Genre = { id: string; name: string };

type Table = {
  title?: string;
  desc?: string;
  movies: Movie[];
};

type Catalogue = {
  title: string;
  desc?: string;
  [key: string]: any;
};


type Rating = { Source: string; Value: string };

export type Movie = {
  id: string;
  Title: string;
  Year: string;
  Runtime: string;
  Rated: string;
  Poster: string;
  Plot: string;
  Genres: Genre[];
  Ratings: Rating[];
};


type Props = {
  catalogue: Catalogue;
};

function GenreBadge({ genre }: { genre: Genre }) {
  return (
    <Link
      href={`/search/genre-${genre.id}/1`}
      onClick={(e) => e.stopPropagation()}
      className="badge badge-sm badge-primary hover:underline"
    >
      {genre.name}
    </Link>
  );
}

export default function CatalogueClient({ catalogue }: Props) {
  // Extract only table entries (table1, table2, etc.)
  const tables = Object.entries(catalogue).filter(([key]) =>
  key.startsWith("table")
);


  const hasMovies = tables.some(
    ([, table]) => Array.isArray(table.movies) && table.movies.length > 0
  );


  if (!hasMovies) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <main className="w-[97%] max-w-7xl mx-auto mt-5 p-6 text-center">
          <p className="text-xl text-gray-600">No movies in this catalogue.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <main className="w-[97%] max-w-7xl mx-auto mt-5 p-6">
        <h1 className="text-3xl font-extrabold capitalize mb-8">
          {catalogue.title}
        </h1>
        <p>{catalogue.desc}</p>

        {tables.map(([tableKey, table]) => (
          <section key={tableKey}>
            <h2 className="text-2xl my-4">{table.title}</h2>
            <p className="p-2 md-2">{table.desc}</p>

            <ul className="space-y-6 lg: px-4">
              {table.movies.map((movie: Movie, index: number) => {
                const posterSrc = movie.Poster || "/images/poster.jpg";

                const imdbRating = movie.Ratings?.find(
                  (r) => r.Source === "Internet Movie Database"
                )?.Value;

                return (
                  <li key={movie.id}>
                    <div className="p-2 bg-amber-50 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                      {/* HEADER */}
                      <div className="flex items-start gap-2 mx-2 px-2 min-w-0">
                        <span className="text-lg font-semibold text-gray-500 flex-shrink-0">
                          {index + 1}.
                        </span>

                        <div className="min-w-0">
                          <Link href={`/movies/${movie.id}`} className="group">
                            <h3 className="text-lg font-bold text-blue-950 group-hover:underline break-words">
                              {movie.Title}
                            </h3>
                          </Link>

                          <span className="text-sm text-gray-700">
                            {movie.Year}
                          </span>
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="flex gap-4 p-4">
                        <div className="flex-shrink-0">
                          <img
                            src={posterSrc}
                            alt={movie.Title}
                            className="w-20 h-28 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/images/poster.jpg";
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* metadata */}
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                            <span>{movie.Runtime}</span>
                            <span>•</span>
                            <span className="font-extrabold text-orange-500">
                              {movie.Rated}
                            </span>

                            {imdbRating && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4 text-yellow-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                  {imdbRating}
                                </span>
                              </>
                            )}
                          </div>

                          {/* genres */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {movie.Genres?.slice(0, 4).map((genre) => (
                              <GenreBadge key={genre.id} genre={genre} />
                            ))}
                            {movie.Genres?.length > 4 && (
                              <span className="text-xs text-gray-500">...</span>
                            )}
                          </div>

                          <p className="text-sm text-gray-700">
                            {movie.Plot}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

      </main>

      <Footer />
    </div>
  );
}
