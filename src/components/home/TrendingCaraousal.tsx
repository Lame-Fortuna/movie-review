"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { movieHref } from "@/lib/href";

export default function TrendingCarousel({ movies }: { movies: any[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!movies || movies.length === 0) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const slideWidth = container.clientWidth;
    const newIndex = Math.round(scrollPosition / slideWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full group">
      <div 
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {movies.slice(0, 6).map((movie: any, index: number) => {
          const bgImage = `${movie.backdrop}` || '';
          const link = movieHref(movie.tmdb_id, movie.title);

          return (
            <Link
              href={link}
              key={movie.tmdb_id}
              className="relative block w-full shrink-0 snap-center h-60 sm:h-75 lg:h-90 overflow-hidden bg-neutral-950 group/slide"
            >
              {/* Image Container */}
              <div className="absolute inset-y-0 left-0 h-full w-full md:w-auto flex">
                <div className="relative h-full w-full md:w-auto">
                  <img
                    src={bgImage}
                    alt={movie.title}
                    className="h-full w-full md:w-auto md:min-w-[50vw] md:max-w-[80vw] object-cover object-left transition-all duration-700 ease-out grayscale opacity-50 md:opacity-60 group-hover/slide:grayscale-0 group-hover/slide:opacity-100"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Desktop Fade */}
                  <div className="hidden md:block absolute inset-y-0 right-0 w-[50%] lg:w-[45%] bg-gradient-to-l from-neutral-950 via-neutral-950/70 to-transparent" />
                </div>
                {/* Mobile Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent md:hidden" />
              </div>

              {/* Text Container */}
              <div className="absolute inset-0 md:left-auto md:right-0 md:w-[60%] flex flex-col justify-end md:justify-center md:items-end md:text-right px-6 pb-16 md:pb-0 md:px-12 lg:px-20 z-10">
                <div className="inline-block w-fit">
                  <span className="font-label text-[10px] tracking-[0.3em] text-white/50 uppercase mb-2 block">
                    Featured
                  </span>
                  <h2 className="font-headline text-3xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none drop-shadow-2xl">
                    {movie.title}
                    <span className="text-xl lg:text-3xl text-neutral-500 font-normal block mt-2">
                      {movie.year}
                    </span>
                  </h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CHANGED: Full height, 5% width left edge arrow. Subtle gradient reveal. */}
      <button
        aria-label="Previous"
        className={`hidden md:flex absolute left-0 top-0 h-full w-[5%] min-w-[50px] z-20
          bg-gradient-to-r from-black/10 to-transparent hover:from-black/60
          text-white/20 hover:text-white/80 items-center justify-start pl-2 lg:pl-6
          transition-all duration-300 ${activeIndex === 0 ? 'pointer-events-none opacity-0' : ''}`}
        onClick={() => scrollToSlide(activeIndex - 1)}
        disabled={activeIndex === 0}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* CHANGED: Full height, 5% width right edge arrow. Subtle gradient reveal. */}
      <button
        aria-label="Next"
        className={`hidden md:flex absolute right-0 top-0 h-full w-[5%] min-w-[50px] z-20
          bg-gradient-to-l from-black/10 to-transparent hover:from-black/60
          text-white/20 hover:text-white/80 items-center justify-end pr-2 lg:pr-6
          transition-all duration-300 ${activeIndex === movies.length - 1 ? 'pointer-events-none opacity-0' : ''}`}
        onClick={() => scrollToSlide(activeIndex + 1)}
        disabled={activeIndex === movies.length - 1}
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Clickable Nav Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-30">
        {movies.slice(0, 6).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            // Added padding (p-3) to massively increase the invisible clickable area
            className="relative p-3 group/dot cursor-pointer"
          >
            {/* The actual visual dot remains small inside the larger button */}
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i 
                  ? "w-8 bg-white" 
                  : "w-4 bg-white/30 group-hover/dot:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
