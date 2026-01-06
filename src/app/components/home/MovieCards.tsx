import Link from "next/link";

type movie = {
  backdrop_path?: string;
  id?: number;
  year?: number;
  poster_path?: string;
  title?: string;
};

export default function MovieCard({ movie }: { movie: any }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="
        carousel-item
        flex flex-col
        text-center
        bg-slate-900
        rounded-lg
        overflow-hidden
        shadow-md

        w-[90px] sm:w-[120px] md:w-[150px]
      "
    >
      {/* Poster (top, fixed ratio) */}
      <div className="w-full aspect-[2/3] overflow-hidden">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : "/images/poster.webp"
          }
          alt={movie.title || "Poster"}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/poster.webp";
          }}
        />
      </div>

      {/* Text (fills remaining space & centers vertically) */}
      <div className="text-slate-100 flex-1 flex flex-col justify-center px-2 py-2">
        <p className="text-sm sm:text-base font-medium leading-tight line-clamp-2">
          {movie.title}
        </p>
        <p className="text-xs sm:text-sm opacity-80 mt-1">
          {movie.year}
        </p>
      </div>
    </Link>
  );
}