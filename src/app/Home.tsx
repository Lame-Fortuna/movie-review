"use client";

import { useState } from "react";
import Navbar from "./components/nav";
import Head from 'next/head';
import Link from "next/link";
import Image from "next/image";
import Footer from "./components/footer";


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
  const [src, setSrc] = useState(`https://image.tmdb.org/t/p/w500${movie.poster_path}`,);

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="carousel-item flex flex-col text-center justify-between pb-5 w-50 h-85 bg-[#38435b] rounded overflow-hidden shadow-md "
    >
      <img
        src={src}
        alt={movie.title || "Poster"}
        title={`Poster for ${movie.title}`}
        className="w-full max-h-65 object-fill"
        onError={() => setSrc("/images/poster.webp")}
      />
      <p className="text-md mx-1">{movie.title}</p>
      <p>{movie.year}</p>
    </Link>
  );
}

function CarouselSection({title, movies, exploreMore}: {title: string; movies: Movie[]; exploreMore: string}) {
  // expoloreMore is link to more movies in this genre/ catelogue
  const morelink = Map[title.toLowerCase()] || "/";

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">{title}</h2>
      <div className="carousel w-full carousel-center space-x-4 rounded-box">

        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

        {/* More Card */}
        <Link
          href={morelink}
          className="carousel-item min-w-[150px] bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center rounded shadow-lg hover:opacity-90 transition"
        >
          <div className="p-4 text-center w-45">
            <p className="text-lg font-semibold">More</p>
            <p className="text-sm">Explore more {title}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function CatalogueItem({name, bg, link}:{name:string, bg:string, link:string}) {
  return (
    <Link href={link}
      className="h-80 flex items-center justify-center bg-cover bg-top text-white text-2xl font-bold rounded-lg shadow-lg"
      style={{ backgroundImage: bg }}>
      <div className="backdrop-blur-sm bg-black/40 px-4 py-2 rounded-md">
        <span className="text-white text-xl font-semibold">{name}</span>
      </div>
    </Link>
  );
}

export default function Home({ movies }: Props) {
  return (
    <div className="bg-base-200 min-h-screen text-white">

      <Navbar />

      <h1 className="hidden">Film Atlas, explore movie and tv shows</h1>

      {/* Trending Carousel */}
      <div className="px-0 lg:px-8 relative">
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
                  <Link href={`/movies/${movie.id}`}>
                    <h2 className="text-white text-3xl ml-6 md:text-5xl font-bold drop-shadow-xl">
                      {movie.title} {movie.year}
                    </h2>
                  </Link>
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
      <CarouselSection title="Vintage" movies={movies.vintage} exploreMore="vintage"/>
      <CarouselSection title="Popular" movies={movies.popular}  exploreMore="popular"/>

      {/* Featured Collections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
        <CatalogueItem name="Noir" link='/catalogue/noir' bg="url('https://orion-uploads.openroadmedia.com/xl_30dde0058f85-filmnoirmovies_thirdman_feature.jpg')"></CatalogueItem>
        <CatalogueItem name="Golden Bollywood" link='/catalogue/oldbollywood' bg="url('https://im.indiatimes.in/content/2020/Jun/Sahib-Bibi-Aur-Ghulam_5efb3bbde329a.jpg?cc=1&h=900&q=75&w=1200&webp=1')"></CatalogueItem>
        <CatalogueItem name="Chaplin Classics" link='/catalogue/chaplin' bg="url('https://onset.shotonwhat.com/p/pix/m/m1059/2014112500001179.jpg')"></CatalogueItem>
        <CatalogueItem name="Vintage Japanese Cinema" link='/catalogue/oldjapanese' bg="url('https://ichef.bbci.co.uk/images/ic/480xn/p06pvdgg.jpg.webp')"></CatalogueItem>
      </div>


      <CarouselSection title="Comedy" movies={movies.comedy}  exploreMore="comedy"/>
      <CarouselSection title="Action" movies={movies.action}  exploreMore="action"/>
      <CarouselSection title="Horror" movies={movies.horror}  exploreMore="horror"/>

      {/* Footer */}
      <Footer />
    </div>
  );
}