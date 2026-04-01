"use client";

import { useState } from "react";
import { Bookmark, Heart, Film, MonitorPlay, PenLine, X, Clapperboard } from "lucide-react";

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

function ActionButton({ icon, label, active = false, disabled = false, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`group relative flex min-w-0 flex-1 items-center gap-3 overflow-hidden border px-3 py-3 text-left transition-all duration-500 ${
        disabled
          ? "cursor-not-allowed border-white/8 bg-white/[0.02] text-neutral-600"
          : active
            ? "border-white/30 bg-white/[0.08] text-white shadow-[0_0_30px_rgba(255,255,255,0.08)]"
            : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
      }`}
      aria-label={label}
    >
      <div className={`absolute inset-0 bg-linear-to-r from-transparent via-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 ${
        disabled ? "" : active ? "opacity-100" : "group-hover:opacity-100"
      }`} />
      <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
        disabled
          ? "border-white/8 bg-black/30 text-neutral-600"
          : active
            ? "border-amber-300/50 bg-amber-300/12 text-amber-200"
            : "border-white/10 bg-black/40 text-neutral-400 group-hover:border-amber-300/45 group-hover:bg-amber-300/10 group-hover:text-amber-200"
      }`}>
        {icon}
      </div>
      <div className="relative min-w-0">
        <span className={`block font-label text-[9px] uppercase tracking-[0.34em] transition-colors duration-500 ${
          disabled ? "text-neutral-600" : active ? "text-neutral-100" : "text-neutral-500 group-hover:text-neutral-200"
        }`}>
          {label}
        </span>
        <span className={`mt-1 block h-px w-8 transition-all duration-500 ${
          disabled ? "bg-white/8" : active ? "bg-amber-300/70" : "bg-white/10 group-hover:w-12 group-hover:bg-amber-300/60"
        }`} />
      </div>
    </button>
  );
}

export default function MovieEmbed({source, title, backdrop, trailerKey, onOpenReview}: { 
  source?: string | null;
  title: string;
  backdrop?: string | null;
  trailerKey?: string;
  onOpenReview?: () => void;
}) {
  const [showIframe, setShowIframe] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const mainSource = source || "";
  const trailerSource = trailerKey ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1` : "";
  const hasMainSource = Boolean(mainSource);

  const [currentSource, setCurrentSource] = useState(mainSource);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [showWhereToWatch, setShowWhereToWatch] = useState(false);
  const movieButtonDisabled = isPlayingTrailer && !hasMainSource;

  const handlePlayMain = () => {
    if (hasMainSource) {
      setCurrentSource(mainSource);
      setIsPlayingTrailer(false);
    } else if (trailerSource) {
      setCurrentSource(trailerSource);
      setIsPlayingTrailer(true);
    } else {
      alert("Video not available");
      return;
    }

    setShowIframe(true);
    setIsIframeLoading(true);
  };

  const handleToggleTrailer = () => {
    if (!trailerKey) return alert("Trailer not available");
    
    if (isPlayingTrailer) {
      if (!hasMainSource) return;
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
    <section className="w-full h-full overflow-y-auto no-scrollbar flex flex-col px-2 sm:px-4">
      <div className="w-full max-w-215 mx-auto my-auto flex flex-col gap-6">
        
        {/* The Video Player */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden border border-white/10 bg-black group">
          {!showIframe ? (
            <div 
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black"
              onClick={handlePlayMain}
            >
              {backdrop && (
                <img 
                  src={backdrop} 
                  alt={`${title} backdrop`}
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
                  <span className="loading loading-ring loading-xl"></span>
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

        {/* The Action Bar Underneath */}
        <div className="grid w-full shrink-0 grid-cols-2 gap-2 px-1 sm:grid-cols-5">
          <ActionButton icon={<Bookmark className="h-5 w-5" />} label="Watchlist" />
          <ActionButton icon={<Heart className="h-5 w-5" />} label="Favorite" />
          
          <ActionButton
            active={isPlayingTrailer && hasMainSource}
            disabled={movieButtonDisabled}
            icon={isPlayingTrailer ? <Clapperboard className="h-5 w-5" /> : <Film className="h-5 w-5" />}
            label={isPlayingTrailer ? "Movie" : "Trailer"}
            onClick={handleToggleTrailer}
          />
          
          <ActionButton
            icon={<MonitorPlay className="h-5 w-5" />}
            label="Screening"
            onClick={() => setShowWhereToWatch(true)}
          />
          <ActionButton
            icon={<PenLine className="h-5 w-5" />}
            label="Review"
            disabled={true}
            onClick={onOpenReview}
          />
        </div>

      </div>

      {/* Where To Watch Popup */}
      {showWhereToWatch && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-6">
          <div className="bg-neutral-950 w-full max-w-md p-10 space-y-6 relative border border-white/10 shadow-2xl">
            <button 
              onClick={() => setShowWhereToWatch(false)}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-headline font-bold tracking-tight text-white">Where to Watch</h2>
              <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500">Availability for {title}</p>
            </div>

            <div className="p-6 border border-white/5 bg-black/50 flex items-center justify-center">
              <p className="text-sm font-body text-neutral-400 italic">
                Streaming data will appear here.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
