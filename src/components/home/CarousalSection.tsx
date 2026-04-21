"use client";

import { useEffect, useRef, useState } from "react";
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
  vintage: `/catalogue/vintage`,
  toprated: `/catalogue/imdb35`,
  all: `/search/`,
  imdb35: `/catalogue/imdb35`,
  melodrama: `/catalogue/classic-melodramas`,
  unorthodox: `/catalogue/unorthodox-cinema`,
  fantasy : `/genre/fantasy`,
};

type Props = {
  title: string;
  movies: Movie[];
};

export default function CarouselSection({ title, movies }: Props) {
  const { ref, scrollLeft, scrollRight } = useCarousel();
  const [isMobile, setIsMobile] = useState(false);
  
  const moreLink = Map[title.toLowerCase().replace(/\s+/g, "")] || "/";

  useEffect(() => {
    const syncViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const displayMovies = movies.slice(0, isMobile ? 6 : 15);

  return (
    <section className="px-4 md:px-12 py-6 bg-black">
      <div className="flex flex-row items-center justify-between gap-4 mb-6 border-b border-white/15 pb-3">
        <h2 className="font-headline text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.25em] text-white/90 whitespace-nowrap">
          {title}
        </h2>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={scrollLeft}
            aria-label={`Scroll ${title} left`}
            className="p-1 sm:p-1.5 border border-white/20 text-white/60 hover:bg-white hover:text-black md:transition-colors focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={scrollRight}
            aria-label={`Scroll ${title} right`}
            className="p-1 sm:p-1.5 border border-white/20 text-white/60 hover:bg-white hover:text-black md:transition-colors focus:outline-none"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={ref}
          role="region"
          aria-label={`${title} carousel`}
          tabIndex={0}
          className="flex items-center overflow-x-auto gap-4 md:gap-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth focus:outline-none snap-x snap-mandatory will-change-scroll"
        >
          {displayMovies.map((movie, index) => {
            const uniqueKey = movie.tmdb_id ? `${movie.tmdb_id}-${index}` : `fallback-${index}`;
            return (
              <div key={uniqueKey} className="snap-center shrink-0">
                <MovieCard movie={movie} />
              </div>
            );
          })}

          <Link
            href={moreLink}
            className="flex-none w-24 h-48 md:w-32 md:h-72 rounded-xs bg-linear-to-br from-purple-500 to-violet-700 md:grayscale hover:grayscale-0 border-white/10 text-white flex items-center justify-center shadow-lg md:transition-all md:duration-700"
          >
            <div className="p-4 text-center">
              <p className="font-headline font-semibold text-base md:text-lg uppercase tracking-widest">Explore</p>
              <p className="font-label text-[10px] uppercase tracking-widest text-white/70 mt-2">More</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
