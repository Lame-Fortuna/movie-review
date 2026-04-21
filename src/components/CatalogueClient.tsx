"use client";

import React from "react";
import Link from "next/link";
import { Movie, Catalogue, Table } from "@/lib/types";
import { movieHref } from "@/lib/href";
import Image from "next/image";

type Props = {
  catalogue: Catalogue;
};

function GenreBadge({ genre }: { genre: string }) {
  return (
    <Link
      href={`/genre/${genre}`}
      className="relative z-20 border border-white/10 bg-white/[0.02] px-2 py-1 text-[9px] font-label uppercase tracking-widest text-neutral-400 transition-colors hover:border-white/30 hover:bg-white/[0.05] hover:text-white"
    >
      {genre}
    </Link>
  );
}

/**
 CATALOGUE SCHEMA
  interface Catalogue {
  _id: string;
  id: string;
  title: string;
  desc: string;
  movies: Movie[];
  }
 
  interface Movie {
  tmdb_id: number;
  title: string;
  year: number;
  runtime: number;
  rated?: string;          // e.g., "NR", "Passed"
  poster: string;          // Image URL
  plot_summary: string;
  genres: string[];
  ratings: {
  imdb_rating: string;   // e.g., "8.1/10"
  };
  }
*/

export default function CatalogueClient({ catalogue }: Props) {
  const tables = Object.entries(catalogue).filter(([key]) =>
    key.startsWith("table")
  ) as [string, Table][];

  const hasMovies = tables.some(
    ([, table]) => Array.isArray(table.movies) && table.movies.length > 0
  );

  if (!hasMovies) {
    return (
      <main className="min-h-screen pt-24 w-full px-6 md:px-12 bg-neutral-950">
        <h1 className="text-xl font-label uppercase tracking-widest text-neutral-500 text-center mt-20">
          No movies found in this catalogue.
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full pt-24 pb-20 px-6 md:px-12 bg-neutral-950 text-white">
      <div className="mx-auto space-y-16">
        
        {/* Catalogue Header */}
        <header className="border-b border-white/10 pb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-headline font-black uppercase tracking-[0.2em] text-white leading-tight mb-4">
            {catalogue.title}
          </h1>
          {catalogue.desc && (
            <p className="text-neutral-400 font-body text-base md:text-lg max-w-3xl leading-relaxed italic">
              {catalogue.desc}
            </p>
          )}
        </header>

        {/* Tables Iteration */}
        <div className="space-y-20">
          {tables.map(([tableKey, table]) => (
            <section key={tableKey} className="space-y-8">
              
              {/* Table Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-bold uppercase tracking-widest text-amber-500/90">
                  {table.title}
                </h2>
                {table.desc && (
                  <p className="text-sm font-body text-neutral-500 max-w-2xl">
                    {table.desc}
                  </p>
                )}
              </div>

              {/* Movie List */}
              <div className="space-y-4">
                {table.movies.map((movie: Movie, index: number) => {
                  const posterSrc = movie.poster || "/images/poster.jpg";
                  const imdbRating = movie.ratings?.imdb_rating;
                  const link = movieHref(movie.tmdb_id, movie.title);

                  return (
                    <div 
                      key={movie.tmdb_id}
                      className="group relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-black border border-white/20 rounded-sm overflow-hidden transition-all duration-500 hover:border-white/30 hover:bg-white/[0.02]"
                    >
                      {/* Watermark Index Number Background */}
                      <span className="absolute -right-4 -top-8 text-[140px] font-headline font-black text-white/[0.02] pointer-events-none transition-colors duration-500 group-hover:text-white/20">
                        {index + 1}
                      </span>

                      {/* Poster */}
                      <Link href={link} className="relative z-10 shrink-0 mx-auto sm:mx-0 block overflow-hidden border border-white/10 w-28 h-40 sm:w-32 sm:h-48 group-hover:border-white/30 transition-colors duration-500">
                        <Image
                          src={posterSrc}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          width={128}
                          height={192}
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex flex-col justify-center relative z-10 flex-1 min-w-0">
                        
                        {/* Title & Year */}
                        <div className="mb-2 text-center sm:text-left">
                          <Link href={link} className="inline-block outline-none">
                            <h3 className="text-xl sm:text-2xl font-headline font-bold text-white transition-colors duration-300 hover:text-amber-400 focus:text-amber-400">
                              {movie.title} <span className="text-neutral-500 font-normal ml-1">({movie.year})</span>
                            </h3>
                          </Link>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[10px] font-label uppercase tracking-widest text-neutral-500 mb-4">
                          <span>{movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20"></span>
                          <span className="text-amber-100">{movie.rated || "NR"}</span>

                          {imdbRating && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-white/20"></span>
                              <span className="flex items-center gap-1 text-white">
                                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                {imdbRating}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                          {movie.genres?.slice(0, 4).map((genre) => (
                            <GenreBadge key={genre} genre={genre} />
                          ))}
                          {movie.genres && movie.genres.length > 4 && (
                            <span className="text-[9px] font-label tracking-widest text-neutral-600 self-center">
                              +{movie.genres.length - 4} MORE
                            </span>
                          )}
                        </div>

                        {/* Plot Summary */}
                        <p className="text-sm font-body text-neutral-400 leading-relaxed italic line-clamp-3 text-center sm:text-left">
                          {movie.plot_summary || "No plot summary available for this film."}
                        </p>
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

      </div>
    </main>
  );
}