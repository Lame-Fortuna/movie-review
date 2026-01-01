// components/Overlay.tsx
import React from "react";
import Link from "next/link";
import { useState } from "react";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const genreList = [
  { displayName: "Sci-Fi", key: "scifi" },
  { displayName: "Thriller", key: "thriller" },
  { displayName: "Horror", key: "horror" },
  { displayName: "Comedy", key: "comedy" },
  { displayName: "Action", key: "action" },
  { displayName: "Drama", key: "drama" },
  { displayName: "Romance", key: "romance" },
  { displayName: "Documentary", key: "documentary" },
  { displayName: "Fantasy", key: "fantasy" },
  { displayName: "Mystery", key: "mystery" },
  { displayName: "Adventure", key: "adventure" },
  { displayName: "Crime", key: "crime" },
  { displayName: "Animation", key: "animation" },
  { displayName: "History", key: "history" },
  { displayName: "Music", key: "music" },
  { displayName: "War", key: "war" },
  { displayName: "Western", key: "western" },
  { displayName: "Family", key: "family" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Overlay({ isOpen, onClose }: SidebarProps) {
  const defaultSize = 5;
  const [size, setSize] = useState(defaultSize);

  const isExpanded = size > defaultSize;
  const toggleSize = () => {
    setSize(isExpanded ? defaultSize : genreList.length);
  };

  return (
    <div
      className={`fixed flex py-2 px-5 top-0 left-0 h-full w-[350px] md:w-[600px] bg-gray-600 text-white 
        z-50 transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Close Button */}
      <div className="w-[10%]">
        <button onClick={onClose} className="text-5xl hover:text-gray-400">
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="px-6 w-[90%]">

        {/* Genres Section */}
        <div tabIndex={0} className=" max-h-[80dvh] collapse collapse-arrow">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            <h2 className="text-lg">Genres</h2>
          </div>

          <div className="collapse-content grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[80dvh] rounded-md pr-1">
            {genreList.map((genre) => {
              const genreId = genreMap[genre.key];
              const href = `/search/genre-${genreId}/1`;

              return (
                <Link key={genre.key} href={href} onClick={onClose}
                  className="flex items-center justify-center h-9 px-3 bg-gray-800 text-sm text-center
                    rounded truncate whitespace-nowrap"
                  title={genre.displayName}
                >
                  {genre.displayName}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Catalogues */}
        <div tabIndex={0} className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            <h2 className="text-lg font-semibold">Catalogues</h2>
          </div>
          
          <div className="collapse-content text-md">
            <Link
              href="/catalogue/noir"
              onClick={onClose}
              className="mt-2 block"
            >
              Classic Noir
            </Link>
            <Link
              href="/catalogue/vintage"
              onClick={onClose}
              className="mt-2 block"
            >
              Vintage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
