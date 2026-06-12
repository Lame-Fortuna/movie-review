import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { movieHref } from "@/lib/href";
import { Movie } from "@/lib/types";

export default function MovieCard({ movie }: { movie: Movie}) {
  const rating = movie.ratings?.imdb_rating || movie.imdb_rating;
  const hasAvailability = typeof movie.available === "boolean";
  
  // Hover effects trigger if movie is explicitly available OR if availability data is missing
  const triggerHoverEffects = !hasAvailability || movie.available === true; 

  const imageUrl = movie.poster || `/images/poster.webp`;
  const link = movieHref(movie.tmdb_id, movie.title);

  return (
    <Link
      href={link}
      className={`block relative flex-none m-1 w-32 md:w-48 aspect-2/3 overflow-hidden bg-neutral-950 border border-white/5 shadow-md md:transition-all md:duration-300 cursor-pointer ${
        triggerHoverEffects ? "group md:hover:border-white" : ""
      }`}
    >
      <img
        src={imageUrl}
        alt={movie.title || "Poster"}
        sizes="(max-width: 768px) 128px, 192px"
        
        className={`absolute inset-0 h-full w-full object-cover md:transition-all md:duration-300 ${
          triggerHoverEffects 
            ? "md:grayscale-100 md:group-hover:grayscale-0" 
            : "md:grayscale-100"
        }`}
        
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
      />

      {/* Overlay Container: Only fades out if triggerHoverEffects applies the 'group' class */}
      <div className="absolute inset-0 flex flex-col justify-between md:group-hover:opacity-0 md:transition-opacity md:duration-100 z-10">
        
        <div className="absolute inset-0 bg-black/40 pointer-events-none -z-10" />

        {/* TOP SECTION: Dynamic layout based on hasAvailability */}
        <div className={`flex items-start p-2 w-full ${hasAvailability ? "justify-between" : "justify-between items-center"}`}>
          
          {/* LEFT SIDE: Runtime above Rating if badge exists, or Rating on left if badge is missing */}
          <div className="flex flex-col items-start gap-1">
            {hasAvailability && movie.runtime ? (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] text-neutral-300 bg-black/50 md:bg-black/40 md:backdrop-blur-md border border-white/10 uppercase tracking-widest w-fit">
                <Clock className="w-3 h-3" />
                {movie.runtime}{typeof movie.runtime === 'number' ? 'm' : ''}
              </div>
            ) : null}

            {rating && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] text-amber-300 font-extrabold bg-black/50 md:bg-black/40 md:backdrop-blur-md border border-white/10 uppercase tracking-widest w-fit">
                {rating}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Displays either the color-coded badge OR just the runtime */}
          {hasAvailability ? (
            <div className={`px-1.5 py-0.5 rounded border bg-black/50 text-[9px] font-extrabold uppercase tracking-widest md:bg-black/40 md:backdrop-blur-md ${
              movie.available
                ? "border-emerald-500/30 text-emerald-400" // Green for Available
                : "border-orange-500/30 text-orange-500"    // Orange for Unavailable
            }`}>
              {movie.available ? "Available" : "Unavailable"}
            </div>
          ) : (
            !hasAvailability && movie.runtime ? (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] text-neutral-300 bg-black/50 md:bg-black/40 md:backdrop-blur-md border border-white/10 uppercase tracking-widest w-fit">
                <Clock className="w-3 h-3" />
                {movie.runtime}{typeof movie.runtime === 'number' ? 'm' : ''}
              </div>
            ) : null
          )}
        </div>

        {/* BOTTOM SECTION */}
        <div className="absolute bottom-0 left-0 p-4 opacity-100 md:group-hover:opacity-0 md:transition-opacity md:duration-300 w-full">
            <p className="font-headline text-sm md:text-base font-semibold text-white drop-shadow-md truncate">{movie.title}</p>
            <p className="font-label text-xs md:text-sm text-white drop-shadow-md">{movie.year ?? "N/A"}</p>
        </div>
      </div>
    </Link>
  );
}