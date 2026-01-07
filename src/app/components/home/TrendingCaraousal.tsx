"use client";

import Link from "next/link";

export default function TrendingCarousel({ movies }: any) {
  return (
    <div className="px-0 md:px-30 relative">
      <div className="carousel w-full h-fit hide-scrollbar">
        {movies.map((movie: any, index: number) => {
          return (
            <div
              key={movie.id}
              id={`slide${index + 1}`}
              className="carousel-item relative w-full h-40 lg:h-80 overflow-hidden rounded"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark overlay to guarantee text contrast */}
              <div className="absolute inset-0 bg-black/60" />

              <div className="absolute w-1/2 inset-0 flex items-center px-8">
                <Link href={`/movies/${movie.id}`}>
                  <h2 className="text-white text-md ml-2 md:text-5xl font-bold drop-shadow-2xl">
                    {movie.title} {movie.year}
                  </h2>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Left Arrow */}
      <button
        aria-label="Previous"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10
          bg-black/60 hover:bg-black/80 text-white
          rounded-full w-10 h-10 flex items-center justify-center
          transition-colors"
        onClick={() => {
          const container = document.querySelector(".carousel") as HTMLElement;
          container.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
        }}
      >
        ❮
      </button>

      {/* Right Arrow */}
      <button
        aria-label="Next"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10
          bg-black/60 hover:bg-black/80 text-white
          rounded-full w-10 h-10 flex items-center justify-center
          transition-colors"
        onClick={() => {
          const container = document.querySelector(".carousel") as HTMLElement;
          container.scrollBy({ left: window.innerWidth, behavior: "smooth" });
        }}
      >
        ❯
      </button>
    </div>
  );
}