import { useEffect, useRef, useState } from "react";
import MovieCard from "../MovieCards";
import { Movie, MovieApiResponse } from "@/lib/types";

function MovieGrid({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid grid-cols-2 justify-items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.tmdb_id} movie={movie} />
      ))}
    </div>
  );
}

export default function Grid() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [shouldLoadInitial, setShouldLoadInitial] = useState(false);

  useEffect(() => {
    if (shouldLoadInitial) {
      return;
    }

    if (!sectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadInitial(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadInitial]);

  useEffect(() => {
    if (!shouldLoadInitial) {
      return;
    }

    fetch(`/api/available?page=1`)
      .then((response) => response.json())
      .then((data: MovieApiResponse) => {
        if (data?.results) {
          setMovieList(data.results);
        }
      })
      .catch((error) => console.error("Failed to fetch initial movies:", error));
  }, [shouldLoadInitial]);

  const loadMoreMovies = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    fetch(`/api/available?page=${nextPage}`)
      .then((response) => response.json())
      .then((data: MovieApiResponse) => {
        if (data?.results) {
          setMovieList((prevMovies) => [...prevMovies, ...data.results]);
        }
      })
      .catch((error) => console.error("Failed to fetch more movies:", error));
  };

  return (
    <section ref={sectionRef} className="px-12 py-20 bg-surface">
      <div className="mb-12 border-b border-surface-container-high pb-8">
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">
          All Movies
        </h2>
      </div>

      <MovieGrid movies={movieList} />

      <div className="mt-20 flex justify-center">
        <button
          className="bg-transparent cursor-pointer border border-surface-container-highest text-white font-label font-bold uppercase px-12 py-4 text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300"
          onClick={loadMoreMovies}
        >
          Load More Titles
        </button>
      </div>
    </section>
  );
}
