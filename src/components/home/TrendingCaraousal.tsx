"use client";

import Link from "next/link";
import { useRef, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { movieHref } from "@/lib/href";
import Image from "next/image";

export default function TrendingCarousel({ movies }: { movies: any[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. MEMOIZATION: Cache the sliced array so it doesn't recalculate on scroll
  const featuredMovies = useMemo(() => {
    if (!movies) return [];
    return movies.slice(0, 6);
  }, [movies]);

  // 2. MEMOIZATION: Cache the heavy DOM elements. 
  // Now, only the white dots at the bottom will re-render when swiping!
  const firstMovie = featuredMovies[0];
  const restMovies = featuredMovies.slice(1);

  const slideElements = useMemo(() => {
    return restMovies.map((movie: any) => {
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
            <div className="relative h-full w-full md:w-auto md:min-w-[50vw] md:max-w-[80vw]">
              <Image
                src={bgImage}
                alt={movie.title}
                fill
                sizes="100vw"
                className="object-cover object-left md:opacity-60 group-hover/slide:grayscale-0 group-hover/slide:opacity-100 md:transition-all md:duration-700 md:ease-out md:grayscale md:opacity-60"
                loading="lazy"
                decoding="async"
              />
              {/* Desktop Fade */}
              <div className="hidden md:block absolute inset-y-0 right-0 w-[50%] lg:w-[45%] bg-linear-to-l from-neutral-950 via-neutral-950/70 to-transparent" />
            </div>
            {/* Mobile Fade */}
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/70 to-transparent md:hidden" />
          </div>

          {/* Text Container */}
          <div className="absolute inset-0 md:left-auto md:right-0 md:w-[60%] flex flex-col justify-end md:justify-center md:items-end md:text-right px-6 pb-16 md:pb-0 md:px-12 lg:px-20 z-10">
            <div className="inline-block w-fit">
              <span className="font-label text-[10px] tracking-[0.3em] text-white/70 uppercase mb-2 block">
                Featured
              </span>
              <h2 className="font-headline text-2xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none drop-shadow-2xl">
                {movie.title}
                <span className="text-xl lg:text-3xl text-white/75 font-normal block mt-2">
                  {movie.year}
                </span>
              </h2>
            </div>
          </div>
        </Link>
      );
    });
  }, [restMovies]); // Only rebuilds if the actual movies list changes

  if (featuredMovies.length === 0) return null;

  const slideCount = featuredMovies.length;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const scrollPosition = container.scrollLeft;
      const slideWidth = container.clientWidth;
      const newIndex = Math.round(scrollPosition / slideWidth);
      setActiveIndex((currentIndex) => (
        currentIndex === newIndex ? currentIndex : newIndex
      ));
    }, 80);
  };

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    }
  };

  // LOOPING LOGIC: Replaces strict subtraction/addition
  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? slideCount - 1 : activeIndex - 1;
    scrollToSlide(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex === slideCount - 1 ? 0 : activeIndex + 1;
    scrollToSlide(newIndex);
  };

  return (
    <div className="relative w-full group">

      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
      >
        {firstMovie && (
          <Link
            href={movieHref(firstMovie.tmdb_id, firstMovie.title)}
            key={firstMovie.tmdb_id}
            className="relative block w-full shrink-0 snap-center h-60 sm:h-75 lg:h-90 overflow-hidden bg-neutral-950 group/slide"
          >
            <div className="absolute inset-y-0 left-0 h-full w-full md:w-auto flex">
              <div className="relative h-full w-full md:w-auto md:min-w-[50vw] md:max-w-[80vw]">
                <Image
                  src={`${firstMovie.backdrop}` || ""}
                  alt={firstMovie.title}
                  fill
                  sizes="100vw"
                  priority
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="object-cover object-left group-hover/slide:opacity-100 md:transition-all md:duration-700 md:ease-out md:grayscale md:group-hover/slide:grayscale-0 md:opacity-60"
                />
                <div className="hidden md:block absolute inset-y-0 right-0 w-[50%] lg:w-[45%] bg-linear-to-l from-neutral-950 via-neutral-950/70 to-transparent" />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/70 to-transparent md:hidden" />
            </div>

            <div className="absolute inset-0 md:left-auto md:right-0 md:w-[60%] flex flex-col justify-end md:justify-center md:items-end md:text-right px-6 pb-16 md:pb-0 md:px-12 lg:px-20 z-10">
              <div className="inline-block w-fit">
                <span className="font-label text-[10px] tracking-[0.3em] text-white/70 uppercase mb-2 block">
                  Featured
                </span>
                <h2 className="font-headline text-2xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none drop-shadow-2xl">
                  {firstMovie.title}
                  <span className="text-xl lg:text-3xl text-white/75 font-normal block mt-2">
                    {firstMovie.year}
                  </span>
                </h2>
              </div>
            </div>
          </Link>
        )}
        {slideElements}
      </div>

      {/* Left button - Now always visible and triggers loop */}
      <button
        aria-label="Previous"
        className="flex absolute left-0 top-0 h-full w-[5%] min-w-[50px] z-20
          bg-linear-to-r from-black/10 to-transparent hover:from-black/60
          text-white/20 hover:text-white/80 items-center justify-start pl-2 lg:pl-6
          md:transition-all md:duration-300"
        onClick={handlePrev}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Right button - Now always visible and triggers loop */}
      <button
        aria-label="Next"
        className="flex absolute right-0 top-0 h-full w-[5%] min-w-[50px] z-20
          bg-linear-to-l from-black/10 to-transparent hover:from-black/60
          text-white/20 hover:text-white/80 items-center justify-end pr-2 lg:pr-6
          md:transition-all md:duration-300"
        onClick={handleNext}
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Clickable Nav Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-30">
        {featuredMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative p-3 group/dot cursor-pointer"
          >
            <div
              className={`h-1.5 rounded-full md:transition-all md:duration-300 ${
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
