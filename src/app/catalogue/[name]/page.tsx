"use client";
import Navbar from "../../components/nav";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type Genre = { id: string; name: string };
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

type Rating = { Source: string; Value: string };

type Movie = {
  id: string;
  Title: string;
  Year: string;
  Runtime: string;
  Rated: string;
  Poster: string;
  Poster2?: string;
  Plot: string;
  Genres: Genre[];
  Ratings: Rating[];
};

interface PageProps {
  params: { name: string };
}

export default async function CataloguePage({ params }: PageProps) {
  const { name } = await params;

  let tables: Record<string, Movie[]> = {};

  try {
    const data = await import(`@/lib/${name}.json`);
    const content = data.default;

    // Handle if JSON is a single array or has multiple tables
    if (Array.isArray(content)) {
      tables = { "": content };
    } else if (typeof content === "object") {
      tables = Object.entries(content).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: Array.isArray(value) ? value : [],
        }),
        {}
      );
    } else {
      tables = {};
    }
  } catch (error) {
    console.error(`Catalogue not found: ${name}.json`, error);
    notFound();
  }

  const hasMovies = Object.values(tables).some((arr) => arr.length > 0);

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
          {name.replace(/-/g, " ")}
        </h1>

        {Object.entries(tables).map(([tableName, movies]) => (
          <section key={tableName} className="mb-10">
            {tableName && (
              <h2 className="text-2xl font-bold mb-4 capitalize text-gray-800">
                {tableName.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </h2>
            )}

            <ul className="space-y-6">
              {movies.map((movie, index) => {
                const posterSrc = movie.Poster || movie.Poster2 || "/images/poster.jpg";
                const imdbRating = movie.Ratings?.find(
                  (r) => r.Source === "Internet Movie Database"
                )?.Value;

                return (
                  <li key={movie.id}>
                    <Link href={`/movies/${movie.id}`} className="block group">
                      <div className="p-2 bg-amber-50 rounded-lg shadow hover:shadow-lg transition-shadow">
                        {/* Title + Index */}
                        <div className="flex items-center gap-2 mx-2 px-2">
                          <span className="text-lg font-semibold text-gray-500">
                            {index + 1}.
                          </span>
                          <h3 className="text-lg font-bold text-blue-950 group-hover:underline truncate">
                            {movie.Title}
                          </h3>
                          <h3 className="text-md text-gray-700">{movie.Year}</h3>
                        </div>

                        <div className="flex gap-4 p-4">
                          {/* Poster */}
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

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Meta */}
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

                            {/* Genres */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {movie.Genres?.slice(0, 4).map((genre) => (
                                <GenreBadge key={genre.id} genre={genre} />
                              ))}
                              {movie.Genres?.length > 4 && (
                                <span className="text-xs text-gray-500">...</span>
                              )}
                            </div>

                            {/* Plot */}
                            <p className="text-sm text-gray-700">{movie.Plot}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
