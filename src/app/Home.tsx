"use client";

import { useState } from "react";
import Navbar from "./components/nav";
import Head from 'next/head';


/* 1. Make sure you import Link
import Link from 'next/link';

// 2. Add the slugify function (or import it)
const slugify = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

// 3. Inside your component's render/return:
/ ...
{movies.map((movie) => {
  // 4. Create the slug from the movie title
  const slug = slugify(movie.title);

  // 5. Render the Link component with the NEW href
  return (
    <Link
      key={movie.id} // Add the key to the Link component
      href={`/movies/${movie.id}/${slug}`} // <-- THIS IS THE CHANGE
      className="carousel-item flex flex-col text-center justify-between pb-5 w-50 h-85 bg-[#38435b] rounded overflow-hidden shadow-md "
    >
      <img
        src={src}
        alt={movie.title}
        className="w-full max-h-65 object-fill"
        onError={() => setSrc("/images/poster.jpg")}
      />
      <p className="text-md mx-1">{movie.title}</p>
      <p>{movie.year}</p>
    </Link>
  );
})}
*/

const genreMap: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  sciencefiction: 878,
  scifi: 878, // Alias for convenience
  tvmovie: 10770,
  thriller: 53,
  war: 10752,
  western: 37,
  popular: 0, // Not a real genre, use search fallback
};

type Movie = {
  backdrop_path?: string;
  id?: number;
  year?: number;
  poster_path?: string;
  title?: string;
};

type Props = {
  movies: {
    vintage: Movie[];
    trending: Movie[];
    popular: Movie[];
    horror: Movie[];
    comedy: Movie[];
    action: Movie[];
  };
};

function MovieCard({ movie }: { movie: Movie }) {
  const [src, setSrc] = useState(
    `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  );
  return (
    <a
      href={`/movies/${movie.id}`}
      className="carousel-item flex flex-col text-center justify-between pb-5 w-50 h-85 bg-[#38435b] rounded overflow-hidden shadow-md "
    >
      <img
        src={src}
        alt={movie.title}
        title={`Poster for ${movie.title}`}
        className="w-full max-h-65 object-fill"
        onError={() => setSrc("/images/poster.jpg")}
      />
      <p className="text-md mx-1">{movie.title}</p>
      <p>{movie.year}</p>
    </a>
  );
}

function CarouselSection({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  // Generate slug for link
  const queryParam = title.toLowerCase().replace(/\s+/g, "");
  const genreKey = title.toLowerCase().replace(/\s+/g, "");
  const genreId = genreMap[genreKey];

  const exploreHref =
    genreId !== undefined && genreId !== 0
      ? `/search/genre-${genreId}/1`
      : `/search/${genreKey}/1`;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">{title}</h2>
      <div className="carousel w-full carousel-center space-x-4 rounded-box">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

        {/* More Card */}
        <a
          href={exploreHref}
          className="carousel-item min-w-[150px] bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center rounded shadow-lg hover:opacity-90 transition"
        >
          <div className="p-4 text-center w-45">
            <p className="text-lg font-semibold">More</p>
            <p className="text-sm">Explore more {title}</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default function Home({ movies }: Props) {
  return (
    <div className="bg-base-200 min-h-screen text-white">

      <Navbar />

      <h1 className="hidden">Film Atlas, explore movie and tv shows</h1>

      {/* Trending Carousel */}
      <div className="px-0 lg:px-32 relative">
        <div className="carousel w-full h-fit">
          {movies.trending.map((movie, index) => {
            return (
              <div
                key={movie.id}
                id={`slide${index + 1}`}
                className="carousel-item relative w-full h-[30rem] xl:h-130 overflow-hidden rounded"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute w-1/2 inset-0 flex items-center px-8">
                  <a href={`/movies/${movie.id}`}>
                    <h2 className="text-white text-3xl ml-6 md:text-5xl font-bold drop-shadow-xl">
                      {movie.title} {movie.year}
                    </h2>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrows for Trending */}
        <button
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
          onClick={() => {
            const container = document.querySelector(
              ".carousel",
            ) as HTMLElement;
            container.scrollBy({
              left: -window.innerWidth,
              behavior: "smooth",
            });
          }}
        >
          ❮
        </button>
        <button
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
          onClick={() => {
            const container = document.querySelector(
              ".carousel",
            ) as HTMLElement;
            container.scrollBy({ left: window.innerWidth, behavior: "smooth" });
          }}
        >
          ❯
        </button>
      </div>


      {/* Other Sections */}
      <CarouselSection title="Vintage" movies={movies.vintage} />
      <CarouselSection title="Popular" movies={movies.popular} />
      <CarouselSection title="Comedy" movies={movies.comedy} />
      <CarouselSection title="Action" movies={movies.action} />
      <CarouselSection title="Horror" movies={movies.horror} />

      {/* Footer */}
      <footer className="footer sm:footer-horizontal bg-black text-base-content p-10">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">DCMA Notice</a>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
        <form>
          <h6 className="footer-title">Newsletter</h6>
          <fieldset className="w-80">
            <label>Enter your email address</label>
            <div className="join">
              <input
                type="text"
                placeholder="username@site.com"
                className="input input-bordered join-item" />
              <button className="btn btn-primary join-item">Subscribe</button>
            </div>
          </fieldset>
        </form>
      </footer>
    </div>
  );
}