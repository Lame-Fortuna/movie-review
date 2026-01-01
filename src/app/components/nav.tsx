// components/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Overlay from "./Overlay";

import { useRouter } from "next/navigation";


export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search/${encodeURIComponent(query.trim())}/1`);
    }
  };

  return (
    <>
      <nav className="bg-gray-700 shadow px-4 h-16 text-white sticky top-0 z-40 flex items-center justify-between">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-ghost btn-circle h-10 w-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link
            href="/"
            className="btn btn-ghost text-lg normal-case whitespace-nowrap"
          >
            Film-Atlas
          </Link>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-[40%] w-full md:w-auto"
        >
          <input
            name="search"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input input-bordered h-10 w-full md:w-64 text-white placeholder-gray-300"
          />

          <button type="submit" className="btn btn-ghost hidden md:block h-10">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </g>
            </svg>
          </button>
        </form>
      </nav>


      {/* Overlay */}
      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
