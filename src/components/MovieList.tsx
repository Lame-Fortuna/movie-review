"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import MovieCard from "./MovieCards";
import { Movie } from "@/lib/types"

export type MovieListProps = {
  movies: Movie[];
  headerTitle: string; 
  totalCount: number;
};

export default function MovieList({ movies, headerTitle, totalCount }: MovieListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current sort and page from the URL
  const currentSortBy = searchParams.get("sortBy") || "popularity";
  const currentOrder = searchParams.get("order") || "DESC";
  const sortValue = `${currentSortBy}-${currentOrder}`;
  
  const currentPageString = searchParams.get("page");
  const currentPage = currentPageString ? parseInt(currentPageString, 10) : 1;

  // Calculate pagination (Assuming your API strictly returns 10 per page)
  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  // Helper to generate new pagination URLs without losing current sort/search params
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSort, newOrder] = e.target.value.split("-");
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("sortBy", newSort);
    params.set("order", newOrder);
    params.set("page", "1"); // Always reset to page 1 when sorting changes
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="min-h-screen text-gray-200 text-on-surface max-w-7xl mx-auto w-[95%] py-16 md:py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 py-6 mb-8 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight capitalize">
            {headerTitle}
          </h1>
          <p className="text-sm text-zinc-500 font-medium tracking-wide">
            {totalCount} results found
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">
            Sort
          </label>
          <select
            id="sort"
            value={sortValue}
            onChange={handleSortChange}
            className="bg-zinc-900 text-zinc-300 text-sm border border-zinc-700 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all cursor-pointer"
          >
            <option value="popularity-DESC">Popularity</option>
            <option value="rating-DESC">Rating</option>
            <option value="year-DESC">Release Year (Newest)</option>
            <option value="year-ASC">Release Year (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Grid Result */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 justify-items-center md:px-15 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.tmdb_id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center flex flex-col items-center justify-center border border-zinc-900 bg-zinc-950 rounded-lg">
          <p className="text-2xl font-bold text-zinc-600 mb-2">No Records Found</p>
          <p className="text-zinc-500">Try adjusting your search or filter parameters.</p>
        </div>
      )}

      {/* Pagination Footer */}
      <footer className="pt-20 flex justify-center">
        <nav aria-label="Pagination" className="join">
          
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="join-item btn"
            >
              « Prev
            </Link>
          ) : (
            <button disabled className="join-item btn">
              « Prev
            </button>
          )}

          {/* Page Indicator */}
          <span className="join-item btn cursor-default pointer-events-none">
            Page {currentPage}/{totalPages}
          </span>

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="join-item btn"
            >
              Next »
            </Link>
          ) : (
            <button disabled className="join-item btn">
              Next »
            </button>
          )}

        </nav>
      </footer>

    </main>
  );
}