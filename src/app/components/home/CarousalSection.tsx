"use client";

import { useRef } from "react";
import Link from "next/link";
import MovieCard from "./MovieCards";

function useCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    ref.current?.scrollBy({
      left: -600,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    ref.current?.scrollBy({
      left: 600,
      behavior: "smooth",
    });
  };

  return { ref, scrollLeft, scrollRight };
}

const Map: Record<string, string> = {
  action: `/search/genre-28/1`,
  comedy: `/search/genre-35/1`,
  horror: `/search/genre-27/1`,
  popular: `/search/popular/1`,
  vintage: `/catalogue/vintage`,
};

type Movie = {
  backdrop_path?: string;
  id?: number;
  year?: number;
  poster_path?: string;
  title?: string;
};

export default function CarouselSection({title, movies,}: {title: string; movies: Movie[];}) {
  const { ref, scrollLeft, scrollRight } = useCarousel();
  const morelink = Map[title.toLowerCase()] || "/";

  return (
    <section className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl">{title}</h2>

        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            aria-label={`Scroll ${title} left`}
            className="btn btn-sm btn-circle"
          >
            ❮
          </button>
          <button
            onClick={scrollRight}
            aria-label={`Scroll ${title} right`}
            className="btn btn-sm btn-circle"
          >
            ❯
          </button>
        </div>
      </div>

      <div
        ref={ref}
        role="region"
        aria-label={`${title} carousel`}
        tabIndex={0}
        className="
          carousel carousel-center
          w-full gap-4 rounded-box
          hide-scrollbar
          overflow-x-auto scroll-smooth
          focus:outline-none
        "
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

        <Link
          href={morelink}
          className="carousel-item min-w-35 bg-linear-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center rounded shadow-lg"
        >
          <div className="p-4 text-center">
            <p className="font-semibold">More</p>
            <p className="text-sm">Explore more</p>
          </div>
        </Link>
      </div>
    </section>
  );
}