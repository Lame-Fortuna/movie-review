// components/Navbar.tsx
import React, { useState } from "react";
import Link from "next/link";
import Overlay from "./Overlay";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      window.location.href = `/search/${encodeURIComponent(query.trim())}/1`;
    }
  };

  return (
    <>
      <nav className="bg-gray-700 shadow px-4 py-4 text-white sticky top-0 z-40 flex items-center justify-between">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-2 flex-1">
          {/* Hamburger */}
          <button
            onClick={() => setOverlayOpen(true)}
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link className="btn btn-ghost text-xl normal-case" href="/">
            Film-Atlas
          </Link>
        </div>

        {/* Right: Search + Login */}
        <div className="flex items-center gap-2">
          <form className="flex items-center gap-2" onSubmit={handleSearch}>
            <input
              name="search"
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input input-bordered text-white placeholder-gray-300"
            />
            <button type="submit" className="btn btn-ghost hidden md:block">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
            </button>
          </form>
        </div>
      </nav>

      {/* Overlay */}
      <Overlay isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
}
