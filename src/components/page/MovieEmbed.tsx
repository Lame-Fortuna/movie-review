"use client";

import { useState } from "react";
import {
  AlertCircle,
  Bookmark,
  Clapperboard,
  Film,
  Heart,
  MonitorPlay,
  X,
} from "lucide-react";
import Image from "next/image";

import type { Review } from "@/lib/types";

import MovieActionButton from "./MovieActionButton";
import MovieReviewButton from "./MovieReviewButton";

type MovieEmbedProps = {
  source?: string | null;
  title: string;
  backdrop?: string | null;
  trailerKey?: string;
  movieId: number;
  onReviewSubmitted?: (review: Review) => void;
};

export default function MovieEmbed({
  source,
  title,
  backdrop,
  trailerKey,
  movieId,
  onReviewSubmitted,
}: MovieEmbedProps) {
  const [showIframe, setShowIframe] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [currentSource, setCurrentSource] = useState(source || "");
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [showWhereToWatch, setShowWhereToWatch] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const mainSource = source || "";
  const trailerSource = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1`
    : "";
  const hasMainSource = Boolean(mainSource);
  const movieButtonDisabled = isPlayingTrailer && !hasMainSource;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4500);
  };

  const handlePlayMain = () => {
    if (hasMainSource) {
      setCurrentSource(mainSource);
      setIsPlayingTrailer(false);
      setShowIframe(true);
      setIsIframeLoading(true);
      return;
    }

    if (trailerSource) {
      showToast("Movie unavailable. Loading trailer instead.");
      setCurrentSource(trailerSource);
      setIsPlayingTrailer(true);
      setShowIframe(true);
      setIsIframeLoading(true);
      return;
    }

    showToast("Movie and trailer are currently unavailable.");
  };

  const handleToggleTrailer = () => {
    if (!trailerKey) {
      showToast("Trailer is currently unavailable.");
      return;
    }

    if (isPlayingTrailer) {
      if (!hasMainSource) {
        return;
      }

      setCurrentSource(mainSource);
      setIsPlayingTrailer(false);
    } else {
      setCurrentSource(trailerSource);
      setIsPlayingTrailer(true);
    }

    setShowIframe(true);
    setIsIframeLoading(true);
  };

  return (
    <section className="flex h-full w-full flex-col px-0 sm:px-4 md:overflow-y-auto no-scrollbar">
      <div className="mx-auto my-0 flex w-full max-w-215 flex-col gap-4 md:my-auto md:gap-6">
        <div className="group relative aspect-video w-full shrink-0 overflow-hidden border-white/10 bg-black md:border">
          {toastMsg && (
            <div className="absolute left-4 top-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 rounded-sm border border-amber-500/30 bg-neutral-900/95 px-4 py-2 text-white shadow-2xl backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="font-label text-[10px] uppercase tracking-widest text-amber-50 sm:text-xs">
                  {toastMsg}
                </span>
              </div>
            </div>
          )}

          {!showIframe ? (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black"
              onClick={handlePlayMain}
            >
              {backdrop && (
                <Image
                  src={backdrop}
                  alt={`${title} backdrop`}
                  width={400}
                  height={300}
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                  loading="lazy"
                  decoding="async"
                />
              )}

              <div className="relative z-10 flex items-center justify-center text-white/90">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20">
                  <polygon points="6,4 20,12 6,20" />
                </svg>
              </div>
            </div>
          ) : (
            <>
              {isIframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <span className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                </div>
              )}

              <iframe
                className="absolute inset-0 h-full w-full bg-transparent"
                src={currentSource}
                title={`${title} player`}
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen"
                loading="lazy"
                onLoad={() => setIsIframeLoading(false)}
              />
            </>
          )}
        </div>

        <div className="grid w-full shrink-0 grid-cols-5 gap-1 px-1 sm:gap-2 sm:px-1">
          <MovieActionButton
            icon={<Bookmark className="h-5 w-5 sm:h-5 sm:w-5" />}
            label="Watchlist"
          />
          <MovieActionButton
            icon={<Heart className="h-5 w-5 sm:h-5 sm:w-5" />}
            label="Favorite"
          />

          <MovieActionButton
            active={isPlayingTrailer && hasMainSource}
            disabled={movieButtonDisabled}
            icon={
              isPlayingTrailer ? (
                <Clapperboard className="h-5 w-5" />
              ) : (
                <Film className="h-5 w-5" />
              )
            }
            label={isPlayingTrailer ? "Movie" : "Trailer"}
            onClick={handleToggleTrailer}
          />

          <MovieActionButton
            icon={<MonitorPlay className="h-5 w-5" />}
            label="Screening"
            onClick={() => setShowWhereToWatch(true)}
          />

          <MovieReviewButton
            movieId={movieId}
            onReviewSubmitted={onReviewSubmitted}
          />
        </div>
      </div>

      {showWhereToWatch && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-6">
          <div className="relative w-full max-w-md space-y-6 border border-white/10 bg-neutral-950 p-10 shadow-2xl">
            <button
              onClick={() => setShowWhereToWatch(false)}
              className="absolute right-6 top-6 text-neutral-500 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-2">
              <h2 className="font-headline text-2xl font-bold tracking-tight text-white">
                Where to Watch
              </h2>
              <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                Availability for {title}
              </p>
            </div>

            <div className="flex items-center justify-center border border-white/5 bg-black/50 p-6">
              <p className="font-body text-sm italic text-neutral-400">
                Streaming data will appear here.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
