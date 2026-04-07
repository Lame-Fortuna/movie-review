import CatalogueItem from "./CatalogueSection";
import TrendingCarousel from "./TrendingCaraousal";
import CarouselSection from "./CarousalSection";
import Grid from "./Grid";
import { Movie } from "@/lib/types";

type Props = {
  movies: {
    best: Movie[];
    imdb35?: Movie[];
    macabre: Movie[];
    comedy: Movie[];
    crime: Movie[];
    fantasy: Movie[];
    melodrama?: Movie[];
    all: Movie[];
    unorthodox?: Movie[];
  };
};

export default function HomeClient({ movies }: Props) {

  return (
    <main className="min-h-screen text-on-surface font-body pt-16 md:pt-20 space-y-10">
      {/* Hero Section */}
      <TrendingCarousel movies={movies.best} />

      {movies.imdb35 && <CarouselSection title="Top Rated" movies={movies.imdb35} />}
      
      {/* Catalogues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-12">
        <CatalogueItem name="Noir" link="/catalogue/noir" bg="/images/noir-bg.webp" />
        <CatalogueItem name="Golden Bollywood" link="/catalogue/oldbollywood" bg="/images/bollywood-bg.webp"/>
        <CatalogueItem name="Chaplin Classics" link="/catalogue/Chaplin" bg="/images/chaplin-bg.webp"/>
        <CatalogueItem name="Vintage Japanese Cinema" link="/catalogue/oldjapanese" bg="/images/japanese-bg.webp"/>
      </div>

      {/* Popular Section */}
      {movies.melodrama && <CarouselSection title="Melodrama" movies={movies.melodrama} />}
      <CarouselSection title="Comedy" movies={movies.comedy} />
      {movies.unorthodox && <CarouselSection title="Unorthodox" movies={movies.unorthodox} />}
      <CarouselSection title="Fantasy" movies={movies.fantasy} />
      <CarouselSection title="Horror" movies={movies.macabre} />

      {/* All movies Grid */}
      <Grid movies={movies.all} />
    </main>
    
  );
}

