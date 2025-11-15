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
  const [size, setSize] = useState(5);
  return (
    <div
      className={`fixed top-0 left-0 h-full w-[350px] md:w-[600px] bg-gray-600 text-white z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-start p-2">
        <button onClick={onClose} className="text-5xl hover:text-gray-400">
          &times;
        </button>
      </div>
      {/* Content */}
      <div className="px-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-gray-700 p-3 rounded-md">
           
            {genreList.slice(0, size).map((genre) => {
              const genreId = genreMap[genre.key];
   
              const href = `/search/genre-${genreId}/1`;
              return (
                <Link
                  key={genre.key}
                  href={href}
                  onClick={onClose}
                  className="bg-gray-800 hover:bg-gray-700 text-md py-2 px-3 rounded text-center"
                >
                  {genre.displayName}
                </Link>
              );
            })}
            <button
              onClick={() => setSize(genreList.length)}
              className="bg-gray-800 hover:bg-gray-700 text-md py-2 px-3 rounded"
            >
              More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};