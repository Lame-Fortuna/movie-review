import Link from "next/link";
import { Clock } from "lucide-react";
import { Movie, Recommendation } from "@/lib/types";
import { movieHref } from "@/lib/href"


export default function MovieCard({ movie }: { movie: Movie}) {
  const rating = movie.ratings?.imdb_rating || movie.imdb_rating;
  
  const imageUrl = movie.poster || `/images/poster.webp`;
  const link = movieHref(movie.tmdb_id, movie.title);

  return (
    <Link
      href={link}
      className="relative flex-none m-1 w-30 md:w-48 aspect-2/3 group cursor-pointer overflow-hidden bg-neutral-950 border border-white/5 hover:border-white shadow-md transition-all duration-500"
    >
      {/* Background Image: Grayscale by default, full color on hover */}
      <img
        src={imageUrl}
        alt={movie.title || "Poster"}
        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
      />

      {/* Overlay Container: Vanishes completely on hover */}
      <div className="absolute inset-0 flex flex-col justify-between group-hover:opacity-0 transition-opacity duration-500 z-10">
        
        <div className="absolute inset-0 bg-black/40 pointer-events-none -z-10" />

        {/* TOP SECTION: Ratings & Runtime */}
        <div className="flex justify-between items-start p-2">
          {/* Top Left: IMDb Rating */}
          {rating && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] text-amber-300 font-extrabold bg-black/40 backdrop-blur-md border border-white/10 uppercase tracking-widest w-fit">
              {rating}
            </div>
          )}

          {/* Top Right: Runtime */}
          {movie.runtime ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] text-neutral-300 bg-black/40 backdrop-blur-md border border-white/10 uppercase tracking-widest w-fit">
              <Clock className="w-3 h-3" />
              {movie.runtime}{typeof movie.runtime === 'number' ? 'm' : ''}
            </div>
          ) : <div />}
        </div>

        {/* BOTTOM SECTION: Centered Title & Year */}
        <div className="absolute bottom-0 left-0 p-4 opacity-100 group-hover:opacity-0 transition-opacity duration-500">
            <p className="font-headline text-base font-semibold text-white drop-shadow-md">{movie.title}</p>
            <p className="font-label text-base text-white drop-shadow-md">{movie.year ?? "N/A"}</p>
        </div>
      </div>
    </Link>
  );
}
