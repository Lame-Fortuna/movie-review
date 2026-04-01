// components/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import Overlay from "./Overlay";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      {/* Changed: Replaced h-19 and py-5 with h-16 md:h-20. 
        This locks the height to exactly 64px on mobile and 80px on desktop. 
      */}
      <nav className="fixed top-0 h-16 md:h-20 w-full z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-6 md:px-12">
        
        {/* Left Side: Menu Toggle & Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white cursor-pointer hover:text-neutral-400 transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6 md:w-5 md:h-5" />
          </button>
          
          <Link href="/" className="font-headline text-2xl md:text-3xl font-bold tracking-tighter text-white no-underline">
            Film Atlas
          </Link>
        </div>
        
        {/* Right Side: Links, Search & Login */}
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-8">
            <Link className="font-label uppercase tracking-widest text-sm text-neutral-500 hover:text-white transition-colors duration-300" href="/genre">
              Genres
            </Link>
            <Link className="font-label uppercase tracking-widest text-sm text-neutral-500 hover:text-white transition-colors duration-300" href="/catalogue">
              Catalogues
            </Link>
          </div>
          
          <form onSubmit={handleSearch} className="relative group flex items-center">
            <Search className="w-4 h-4 md:w-3 md:h-3 text-neutral-500 mr-2" />
            <input 
              name="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-label text-xs tracking-widest uppercase text-white placeholder-neutral-500 w-24 sm:w-32 focus:w-48 transition-all duration-500 outline-none" 
              placeholder="SEARCH" 
            />
            <button type="submit" className="hidden">Submit</button>
            <div className="absolute -bottom-2 left-0 w-full h-px bg-neutral-800 transition-colors group-focus-within:bg-white/50"></div>
          </form>
          {/*}
          <button className="hidden sm:block font-label uppercase tracking-widest text-sm text-white hover:opacity-70 transition-opacity">
            Login
          </button>
          {*/}
        </div>
      </nav>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}