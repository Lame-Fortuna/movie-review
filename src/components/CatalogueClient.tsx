"use client";

import React from "react";
import Link from "next/link";
import { Movie, Catalogue, Table } from "@/lib/types";
import { movieHref } from "@/lib/href";

type Props = {
  catalogue: Catalogue;
};

function GenreBadge({ genre }: { genre: string }) {
  return (
    <Link
      href={`/genre/${genre}`}
      onClick={(e) => e.stopPropagation()}
      className="badge badge-sm badge-primary hover:underline"
    >
      {genre}
    </Link>
  );
}

export default function CatalogueClient({ catalogue }: Props) {
  const tables = Object.entries(catalogue).filter(([key]) =>
    key.startsWith("table")
  ) as [string, Table][];

  const hasMovies = tables.some(
    ([, table]) => Array.isArray(table.movies) && table.movies.length > 0
  );

  if (!hasMovies) {
    return (
      <main className="min-h-screen pt-16 md:pt-20 w-[97%] max-w-7xl mx-auto">
        <h1 className="text-xl text-white">No movies in this catalogue.</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-[97%] max-w-7xl mx-auto p-16 md:p-20">
      <h1 className="text-3xl font-extrabold capitalize mb-8">
        {catalogue.title}
      </h1>
      {catalogue.desc && <p>{catalogue.desc}</p>}

      {tables.map(([tableKey, table]) => (
        <section key={tableKey}>
          <h2 className="text-2xl my-4">{table.title}</h2>
          {table.desc && <p className="p-2 mb-2">{table.desc}</p>}

          <ul className="space-y-6 lg:px-4">
            {table.movies.map((movie: Movie, index: number) => {
              const posterSrc = movie.poster || "/images/poster.jpg";

              const imdbRating = movie.ratings?.imdb_rating;
              const link = movieHref(movie.tmdb_id, movie.title);

              return (
                <li key={movie.tmdb_id}>
                  <div className="p-2 bg-amber-50 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                    {/* HEADER */}
                    <div className="flex items-start gap-2 mx-2 px-2 min-w-0">
                      <span className="text-lg font-semibold text-gray-500 shrink-0">
                        {index + 1}.
                      </span>

                      <div className="min-w-0">
                        <Link key={movie.tmdb_id} href={link} className="group">
                          <h3 className="text-lg font-bold text-blue-950 group-hover:underline break-words">
                            {movie.title}
                          </h3>
                        </Link>

                        <span className="text-sm text-gray-700">
                          {movie.year}
                        </span>
                      </div>
                    </div>

                    {/* BODY */}
                    <div className="flex gap-4 p-4">
                      <div className="shrink-0">
                        <img
                          src={posterSrc}
                          alt={movie.title}
                          className="w-20 h-28 object-cover rounded"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.src = "/images/poster.jpg";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* metadata */}
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                          <span>{movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
                          <span>•</span>
                          <span className="font-extrabold text-orange-500">
                            {movie.rated || "NR"}
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
                          {/* 5. FIXED: Use the string directly as the key and prop */}
                          {movie.genres?.slice(0, 4).map((genre) => (
                            <GenreBadge key={genre} genre={genre} />
                          ))}
                          {movie.genres && movie.genres.length > 4 && (
                            <span className="text-xs text-gray-500">...</span>
                          )}
                        </div>

                        <p className="text-sm text-gray-700">
                          {movie.plot_summary}
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
  );
}
