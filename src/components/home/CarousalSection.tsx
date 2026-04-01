"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "../MovieCards"; 
import { Movie } from "@/lib/types";

function useCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    ref.current?.scrollBy({ left: -600, behavior: "smooth" });
  };

  const scrollRight = () => {
    ref.current?.scrollBy({ left: 600, behavior: "smooth" });
  };

  return { ref, scrollLeft, scrollRight };
}

const Map: Record<string, string> = {
  action: `/genre/action`,
  comedy: `/genre/comedy`,
  horror: `/genre/horror`,
  popular: `/genre/popular`,
  vintage: `/catalogue/vintage`,
  imdb35: `/catalogue/imdb35`,
  all: `/search/`,
  meloncholy: `/catalogue/meloncholy`,
};

type Props = {
  title: string;
  movies: Movie[];
};

export default function CarouselSection({ title, movies }: Props) {
  const { ref, scrollLeft, scrollRight } = useCarousel();
  
  const moreLink = Map[title.toLowerCase()] || "/";

  return (
    <section className="px-6 md:px-12 py-3">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <h2 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
          {title}
        </h2>

        <div className="flex items-center gap-6 self-end">
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              aria-label={`Scroll ${title} left`}
              className="p-2 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label={`Scroll ${title} right`}
              className="p-2 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={ref}
          role="region"
          aria-label={`${title} carousel`}
          tabIndex={0}
          // Added 'items-center' right after flex to perfectly align the row
          className="flex items-center overflow-x-auto gap-6 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth focus:outline-none"
        >
          {movies.map((movie, index) => {
            // Keeping our unique key fallback from the previous step!
            const uniqueKey = movie.tmdb_id ? `${movie.tmdb_id}-${index}` : `fallback-${index}`;
            return <MovieCard key={uniqueKey} movie={movie} />
          })}

          <Link
            href={moreLink}
            // Fixed the w/h classes to standard Tailwind values, gradient class, and duration-1000
            className="flex-none w-24 h-48 md:w-32 md:h-72 rounded-xs bg-gradient-to-br from-purple-500 to-violet-700 grayscale hover:grayscale-0 border-white/10 text-white flex items-center justify-center shadow-lg transition-all duration-700"
          >
            <div className="p-4 text-center">
              <p className="font-headline font-semibold text-lg uppercase tracking-widest">More</p>
              <p className="font-label text-[10px] uppercase tracking-widest text-white/70 mt-2">Explore</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}