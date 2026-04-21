import { useState, useEffect, useRef } from "react";
import MovieCard from "@/components/MovieCards";

function RecommendationSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-32 md:w-48 aspect-2/3 rounded-sm bg-white/50 animate-pulse flex flex-col justify-end p-5 md:p-6">
          <div className="h-5 w-2/3 rounded-md bg-gray-800 mb-3" />
          <div className="h-2 w-1/4 rounded-sm bg-gray-900 ml-4" />
        </div>
      ))}
    </div>
  );
}

export default function Recommendations({ movie }: { movie: any }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. The Lazy Loader (Intersection Observer)
  useEffect(() => {
    if (shouldLoad || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true); // Trigger the fetch
          observer.disconnect(); // Stop watching once triggered
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  // 2. The Fetcher
  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;
    let idleId: number | null = null;

    const loadRecommendations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: movie.title,
            genres: movie.genres?.join(", ") || "",
            plot: movie.plot_summary || "",
            cast: movie.actors || "",
            director: movie.director || "",
          }),
        });

        if (!response.ok) throw new Error("Unable to load recommendations");
        const data = await response.json();

        if (!cancelled) setRecommendations(data);
      } catch {
        if (!cancelled) setRecommendations([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // Use requestIdleCallback so it doesn't freeze the main UI thread
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(loadRecommendations, { timeout: 1500 });
    } else {
      timeoutId = globalThis.setTimeout(loadRecommendations, 250);
    }

    return () => {
      cancelled = true;
      if (idleId !== null && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) globalThis.clearTimeout(timeoutId);
    };
  }, [movie, shouldLoad]);

  return (
    <section ref={sectionRef} className="space-y-8">
      <h3 className="font-label text-sm uppercase tracking-[0.3em] text-neutral-500">
        More Like This
      </h3>
      
      {isLoading && <RecommendationSkeleton />}
      
      {!isLoading && recommendations.length === 0 && (
        <p className="text-sm text-neutral-500 italic font-body">
          Recommendations will show up here shortly.
        </p>
      )}

      {!isLoading && recommendations.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {recommendations.map((item) => (
            <MovieCard 
              key={item.tmdb_id} 
              movie={{ 
                tmdb_id: item.tmdb_id, 
                title: item.title, 
                year: item.year, 
                poster: item.poster ?? undefined 
              }} 
            />
          ))}
        </div>
      )}
    </section>
  );
}