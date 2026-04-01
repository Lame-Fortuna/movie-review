// components/Overlay.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight } from "lucide-react";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const topGenres = [
  { displayName: "Action", key: "action", id: 28 },
  { displayName: "Comedy", key: "comedy", id: 35 },
  { displayName: "Drama", key: "drama", id: 18 },
  { displayName: "Horror", key: "horror", id: 27 },
  { displayName: "Crime", key: "crime", id: 878 },
  { displayName: "Thriller", key: "thriller", id: 53 },
];

export default function Overlay({ isOpen, onClose }: OverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[85vw] max-w-100 bg-neutral-950 border-r border-white/10 text-white z-70 flex flex-col overflow-hidden shadow-2xl shadow-black"
          >
            <div className="flex items-center gap-6 px-6 md:px-12 py-5 shrink-0 border-b border-white/5">
              <button onClick={onClose} className="text-white cursor-pointer hover:text-neutral-400 transition-colors">
                <X className="w-6 h-6 md:w-5 md:h-5" />
              </button>
              <span className="font-headline text-2xl md:text-3xl font-bold tracking-tighter text-white whitespace-nowrap">
                Film Atlas
              </span>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-6 md:p-12 flex-1 overflow-y-auto no-scrollbar flex flex-col">
              <div className="space-y-12">
                
                {/* Static Genres Grid */}
                <div>
                  <h2 className="font-label text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">
                    Popular Genres
                  </h2>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {topGenres.map((genre) => (
                      <Link 
                        key={genre.key} 
                        href={`/genre/${genre.key}`} 
                        onClick={onClose}
                        className="font-label text-[10px] uppercase tracking-widest text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded transition-all border border-white/5 hover:border-white/20 text-center"
                      >
                        {genre.displayName}
                      </Link>
                    ))}
                  </div>
                  
                  <Link 
                    href="/genre" 
                    onClick={onClose}
                    className="group flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                  >
                    Explore All Genres <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Static Catalogues List */}
                <Link href="/cataloue" className="font-label text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-white mb-6">
                  Curated Catalogues
                </Link>
                {/*}
                <Link href="/" className="font-label text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">
                  Movies by Decade
                </Link>
                {*/}
              </div>

              {/* Footer Info */}
              <div className="mt-auto pt-12">
                <p className="font-label text-[9px] uppercase tracking-[0.3em] text-neutral-600">
                  Film Archive System
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}