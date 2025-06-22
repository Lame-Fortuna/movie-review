'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/nav'

type Movie = {
  id: number;
  year?: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
};

type Props = {
  movies: {
    trending: Movie[];
    popular: Movie[];
    horror: Movie[];
    comedy: Movie[];
    action: Movie[];
  };
};


function MovieCard({ movie }: { movie: Movie }) {
  const [src, setSrc] = useState(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
  return (
    <a
      href={`/movies/${movie.id}`}
      className="carousel-item flex flex-col text-center justify-between pb-5 w-50 h-80 bg-[#38435b] rounded overflow-hidden shadow-md "
    >
      <img
        src={src}
        alt={movie.title}
        className="w-full max-h-65 object-fill"
        onError={() => setSrc('/images/poster.jpg')}
      />
      <p className='text-lg '>{movie.title}</p>
      <p>2025</p>
    </a>
  );
}

function CarouselSection({ title, movies }: { title: string; movies: Movie[] }) {
  // Generate slug for link
  const queryParam = title.toLowerCase().replace(/\s+/g, '');

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">{title}</h2>
      <div className="carousel w-full carousel-center space-x-4 rounded-box">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

        {/* More Card */}
        <a
          href={`./q=${queryParam}`}
          className="carousel-item min-w-[150px] bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center rounded shadow-lg hover:opacity-90 transition"
        >
          <div className="p-4 text-center w-45">
            <p className="text-lg font-semibold">More</p>
            <p className="text-sm">Explore all {title}</p>
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

      {/* Trending Carousel */}
      <div className="px-0 lg:px-32">
        <div className="carousel w-full h-fit">
          {movies.trending.map((movie, index) => (
            <div
              key={movie.id}
              id={`slide${index + 1}`}
              className="carousel-item relative w-full h-[30rem] xl:h-130 overflow-hidden rounded"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute w-1/2 inset-0 flex items-center px-8">
                <h2 className="text-white text-3xl ml-6 md:text-5xl font-bold drop-shadow-xl">
                  {movie.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Sections */}
      <CarouselSection title="Popular" movies={movies.popular} />
      <CarouselSection title="Horror" movies={movies.horror} />
      <CarouselSection title="Comedy" movies={movies.comedy} />
      <CarouselSection title="Action" movies={movies.action} />
    </div>
  );
}



