"use client";

import Link from "next/link";

import Navbar from "./components/nav";
import Footer from "./components/footer";
import CatalogueItem from "./components/home/CatalogueSection";
import TrendingCarousel from "./components/home/TrendingCaraousal";
import CarouselSection from "./components/home/CarousalSection";

/* ------------------ Types ------------------ */

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

export default function HomeClient({ movies }: Props) {

  return (
    <div className="bg-base-200 min-h-screen text-white">
      <Navbar />
      <h1 className="hidden">Film Atlas, explore movie and TV shows</h1>
      <h2 className="hidden">Browse vintage, popular, action, comedy, horror movies and trending TV shows</h2>

      {/* Trending */}
      <TrendingCarousel movies={movies.trending} />

      {/* Other Sections */}
      <CarouselSection title="Vintage" movies={movies.vintage} />
      <CarouselSection title="Popular" movies={movies.popular} />

      {/* Catalogues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
        <CatalogueItem name="Noir" link="/catalogue/noir" bg="/images/noir-bg.webp" />
        <CatalogueItem name="Golden Bollywood" link="/catalogue/oldbollywood" bg="/images/bollywood-bg.webp"/>
        <CatalogueItem name="Chaplin Classics" link="/catalogue/chaplin" bg="/images/chaplin-bg.webp"/>
        <CatalogueItem name="Vintage Japanese Cinema" link="/catalogue/oldjapanese" bg="/images/japanese-bg.webp"/>
      </div>

      <CarouselSection title="Comedy" movies={movies.comedy} />
      <CarouselSection title="Action" movies={movies.action} />
      <CarouselSection title="Horror" movies={movies.horror} />

      <Footer />
    </div>
  );
}
