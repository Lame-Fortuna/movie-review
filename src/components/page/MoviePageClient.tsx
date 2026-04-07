"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from 'motion/react';
import { Star, X } from 'lucide-react';
import MovieCard from "@/components/MovieCards";
import { Movie, Review, CreditsData } from "@/lib/types"
import Image from "next/image";

import MovieEmbed from "./MovieEmbed";

function calculateStats(reviews: Review[]) {
  const stars = [0, 0, 0, 0, 0];
  let sum = 0;

  for (const { rating } of reviews) {
    if (rating >= 1 && rating <= 5) {
      stars[rating - 1] += 1;
      sum += rating;
    }
  }

  const total = reviews.length;
  const avg = total ? sum / total : 0;

  return { avg, total, stars };
}

function ReviewSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-3 bg-white p-6 rounded-lg">
          <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}

function RecommendationSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="aspect-2/3 animate-pulse rounded-lg bg-surface-container-high" />
      ))}
    </div>
  );
}


export default function MoviePageClient({ movie }: { movie: Movie & { credits?: CreditsData } }) {
  const [posterSrc, setPosterSrc] = useState(movie.poster ?? movie.poster2 ?? "/images/poster.webp");
  const reviewsSectionRef = useRef<HTMLElement | null>(null);
  const recommendationsSectionRef = useRef<HTMLElement | null>(null);
  
  // Data State
  const [generatedUser, setGeneratedUser] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [shouldLoadReviews, setShouldLoadReviews] = useState(false);
  const [shouldLoadRecommendations, setShouldLoadRecommendations] = useState(false);
  
  // UI & Form State
  // const [showForm, setShowForm] = useState(false);
  // const [formRating, setFormRating] = useState(0);
  // const [formReviewText, setFormReviewText] = useState("");

  
  // const onRatingChange: (rating: number) => void = (rating) => {
  //   setFormRating(rating);
  // };

  // const onReviewTextChange: (value: string) => void = (value) => {
  //   setFormReviewText(value);
  // };

  // const onSubmit: (event: React.FormEvent) => void = (event) => {
  //   event.preventDefault();
  //   // Handle form submission logic here
  // };

  const stats = useMemo(() => calculateStats(reviews), [reviews]);

  const displayDirector = movie.credits?.directors?.[0]?.name || movie.director;

  useEffect(() => {
    if (shouldLoadReviews && shouldLoadRecommendations) {
      return;
    }

    const observers: IntersectionObserver[] = [];

    if (!shouldLoadReviews && reviewsSectionRef.current) {
      const reviewsObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setShouldLoadReviews(true);
            reviewsObserver.disconnect();
          }
        },
        { rootMargin: "240px 0px" },
      );

      reviewsObserver.observe(reviewsSectionRef.current);
      observers.push(reviewsObserver);
    }

    if (!shouldLoadRecommendations && recommendationsSectionRef.current) {
      const recommendationsObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setShouldLoadRecommendations(true);
            recommendationsObserver.disconnect();
          }
        },
        { rootMargin: "240px 0px" },
      );

      recommendationsObserver.observe(recommendationsSectionRef.current);
      observers.push(recommendationsObserver);
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [shouldLoadRecommendations, shouldLoadReviews]);

  // useEffect(() => {
  //   setGeneratedUser(`user ${Date.now().toString(36)}`);
  // }, []);

  // Fetch Reviews
  useEffect(() => {
    if (!shouldLoadReviews) {
      return;
    }

    let cancelled = false;
    async function loadReviews() {
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const response = await fetch(`/api/reviews/get/${movie.tmdb_id}`);
        if (!response.ok) throw new Error("Unable to load reviews");
        
        const data = await response.json();
        if (!cancelled) {
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        }
      } catch {
        if (!cancelled) setReviewsError("Reviews are temporarily unavailable.");
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    }

    loadReviews();
    return () => { cancelled = true; };
  }, [movie.tmdb_id, shouldLoadReviews]);
  
  // Fetch Recommendations
  useEffect(() => {
    if (!shouldLoadRecommendations) {
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;
    let idleId: number | null = null;

    const loadRecommendations = async () => {
      try {
        setRecommendationsLoading(true);
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: movie.title,
            genres: movie.genres?.join(", ") || "",     // Safely handles undefined
            plot: movie.plot_summary || "",             // Safely handles undefined
            cast: movie.actors || "",                   // Safely handles undefined
            director: movie.director || "",             // Safely handles undefined
          }),
        });

        if (!response.ok) throw new Error("Unable to load recommendations");

        const data = await response.json();

        if (!cancelled) setRecommendations(data);
      } catch {
        if (!cancelled) setRecommendations([]);
      } finally {
        if (!cancelled) setRecommendationsLoading(false);
      }
    };

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
  }, [movie, shouldLoadRecommendations]);

  // Turnstile 
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"

  //   script.async = true;
  //   document.head.appendChild(script);
    
  //   return () => {
  //     const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
  //     if (existingScript)
  //     document.head.removeChild(script);
  //   };
  // }, []);

  // Submit Review
  // const handleReviewSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (formRating === 0 || !formReviewText.trim()) return;

  //   const formData = new FormData();
  //   formData.append("usr", generatedUser);
  //   formData.append("rating", formRating.toString());
  //   formData.append("review", formReviewText);

  //   const newReview = {
  //     usr: generatedUser,
  //     rating: formRating,
  //     review: formReviewText,
  //   };

  //   try {
  //     const response = await fetch(`/api/reviews/insert/${movie.tmdb_id}`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       alert("We couldn't save that review right now.");
  //       return;
  //     }

  //     setReviews((current) => [newReview, ...current]);
  //     setShowForm(false);
  //     setFormRating(0);
  //     setFormReviewText("");
  //   } catch {
  //     alert("Error submitting review.");
  //   }
  // };

  return (
    <main className="text-on-surface w-full pt-16 md:pt-20 min-h-screen flex flex-col md:flex-row">

      {/* Left Column: Content */}
      <div className="order-2 md:order-1 w-full md:w-1/3 pb-10 px-6 overflow-y-auto space-y-20 md:border-r border-white/20 no-scrollbar">

        {/* Hero Metadata */}
        <section className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            {/* Title and Genres */}
            <div className="space-y-4 pt-2">
              <h1 className="text-3xl md:text-4xl font-headline font-bold leading-none tracking-tighter">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-label text-sm uppercase tracking-[0.2em] text-neutral-500">
                <span>{movie.year}</span>
                <span>{movie.runtime} min</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 font-label text-sm uppercase tracking-[0.2em] text-neutral-500">
                {movie.genres?.map((g) => (
                  <Link 
                    key={g} 
                    href={`/genre/${g}`} 
                    className="hover:text-white transition-colors uppercase shrink-0"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            </div>

            {/* 2/5 and 3/5 Split Layout */}
            <div className="flex gap-6">
              {/* 2/5 Poster */}
              <div className="w-2/5 shrink-0 relative group overflow-hidden rounded-xs h-max">
                <Image
                  className="w-full aspect-2/3 object-cover border border-white/10" 
                  src={posterSrc} 
                  width={200}
                  height={300}
                  alt={movie.title}
                  loading="lazy"
                  decoding="async"
                  onError={() => setPosterSrc("/images/poster.webp")}
                />
              </div>

              {/* 3/5 Details */}
              <div className="w-3/5 space-y-6">
                <p className="text-base leading-relaxed text-on-surface font-body italic">
                  {movie.plot_summary}
                </p>
                <p className="font-label text-sm uppercase tracking-widest text-neutral-500">
                  Directed by <span className="text-white">{displayDirector}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Critical Consensus*/}
        {movie.ratings && Object.keys(movie.ratings).length > 0 && (
          <section className="space-y-6">
            <h3 className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">Critical Consensus</h3>
            <div className="flex flex-row flex-wrap gap-x-10 gap-y-6 items-center">
              
              {movie.ratings.imdb_rating && (
                <div className="space-y-1">
                  <div className="text-lg font-headline font-semibold">{movie.ratings.imdb_rating}</div>
                  <div className="font-label text-[9px] uppercase tracking-widest text-neutral-500">IMDb</div>
                </div>
              )}

              {movie.ratings.rotten_tomatoes && (
                <div className="space-y-1">
                  <div className="text-lg font-headline font-semibold">{movie.ratings.rotten_tomatoes}</div>
                  <div className="font-label text-[9px] uppercase tracking-widest text-neutral-500">Rotten Tomatoes</div>
                </div>
              )}

              {movie.ratings.metascore && (
                <div className="space-y-1">
                  <div className="text-lg font-headline font-semibold">{movie.ratings.metascore}</div>
                  <div className="font-label text-[9px] uppercase tracking-widest text-neutral-500">Metacritic</div>
                </div>
              )}

              {movie.ratings.tmdb_rating && (
                <div className="space-y-1">
                  <div className="text-lg font-headline font-semibold">{movie.ratings.tmdb_rating}</div>
                  <div className="font-label text-[9px] uppercase tracking-widest text-neutral-500">TMDB</div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* The Cast */}
        {movie.credits?.actors && movie.credits.actors.length > 0 && (
        <section className="space-y-8">
          <h3 className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">The Cast</h3>
          <div className="flex overflow-x-auto gap-6 no-scrollbar pb-4">
            {movie.credits.actors.map((actor) => {
              // Helper to get initials (First and Last name)
              const getInitials = (name: string) => {
                if (!name) return "";
                const parts = name.trim().split(" ");
                if (parts.length === 1) return parts[0][0].toUpperCase();
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
              };

              return (
                <div key={actor.id} className="min-w-25 max-w-25 space-y-4">
                  {/* Added flex, items-center, and justify-center to center the initials */}
                  <div className="w-full aspect-square bg-surface-container-high overflow-hidden rounded-md flex items-center justify-center border border-white/5">
                    {actor.profile_image ? (
                      <Image
                        className="w-full h-full object-cover" 
                        width={50}
                        height={50}
                        src={actor.profile_image} 
                        alt={actor.name}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="font-headline text-2xl text-neutral-400 font-bold tracking-widest">
                        {getInitials(actor.name)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-headline text-xs leading-tight font-semibold">{actor.name}</p>
                    <p className="font-label text-[9px] text-neutral-500 tracking-wider truncate" title={actor.character}>
                      {actor.character}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

        {/* Audience Consensus & Reviews Module */}
        <section ref={reviewsSectionRef} className="space-y-12">
          <div className="flex justify-between items-end border-b border-white/10 pb-4">
            <h3 className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">Audience Consensus</h3>
          </div>

          {/* Aggregated Stats Block */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8 w-full">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="rating rating-xl rating-half mb-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const value = (i + 1) / 2;
                  return (
                    <input
                      key={value}
                      type="radio"
                      name="avg-rating"
                      className={`mask mask-star-2 ${i % 2 === 0 ? "mask-half-1" : "mask-half-2"} bg-amber-400`}
                      aria-label={`${value} stars`}
                      checked={Math.abs(stats.avg - value) < 0.26}
                      readOnly
                    />
                  );
                })}
              </div>
              <div className="text-sm font-label uppercase tracking-widest text-neutral-400">
                <p className="mb-1">
                  <strong className="text-white">{stats.total}</strong> reviews
                </p>
                <p>
                  Avg: <strong className="text-white">{stats.avg.toFixed(1)}</strong> / 5
                </p>
              </div>
            </div>

            {/* Sleek, un-rounded progress bars */}
            <div className="bars flex flex-col gap-2 w-full max-w-50">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-4 text-right text-[10px] font-label text-neutral-400">
                    {rating}
                  </span>
                  <progress
                    className="progress progress-info w-full h-1.5 rounded-none [&::-webkit-progress-bar]:rounded-none [&::-webkit-progress-value]:rounded-none [&::-moz-progress-bar]:rounded-none bg-surface-container-high"
                    value={stats.total ? (100 * stats.stars[rating - 1]) / stats.total : 0}
                    max="100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/*}

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
              <label className="block font-label text-[10px] uppercase tracking-widest text-neutral-500">Rating</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onRatingChange(star)}
                    className={`${formRating >= star ? 'text-amber-400' : 'text-neutral-600'} hover:text-amber-300 transition-colors`}
                  >
                    <Star className="w-8 h-8" fill={formRating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block font-label text-[10px] uppercase tracking-widest text-neutral-500">Your Review</label>
              <textarea
                value={formReviewText}
                onChange={(e) => onReviewTextChange(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 p-4 font-body text-sm min-h-35 outline-none resize-none rounded-sm text-white"
                placeholder="What stood out to you?"
              />
            </div>

            <div
              className="cf-turnstile"
              data-sitekey="0x4AAAAAACwhBeeQ7_JCF-gy"
              data-size="flexible"
            ></div>

            <button
              type="submit"
              disabled={formRating === 0 || !formReviewText.trim()}
              className="w-full py-4 bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
            >
              Submit Review
            </button>
          </form>

          {/* Individual Reviews - Black Text on White BG 
          <div className="space-y-6">
            {reviewsLoading && <ReviewSkeleton />}
            {!reviewsLoading && reviewsError && (
                <p className="text-sm text-red-400 italic font-body">{reviewsError}</p>
            )}
            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <p className="text-sm text-neutral-500 italic font-body">No reviews yet. Be the first to add one.</p>
            )}

            {!reviewsLoading && reviews.map((review, index) => (
              <div key={`${review.usr}-${index}`} className="space-y-4 bg-white text-black p-6 rounded-lg shadow-md">
                <div className="flex justify-between font-label text-[10px] uppercase tracking-widest text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-black">{review.usr}</span>
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < review.rating ? 'text-amber-500' : 'text-neutral-300'}`} 
                            fill={i < review.rating ? 'currentColor' : 'none'}
                          />
                      ))}
                    </span>
                  </div>
                </div>
                <p className="font-body italic leading-relaxed text-sm">"{review.review}"</p>
              </div>
            ))}
          </div>
          */}
        </section>

        {/* Recommendations */}
        <section ref={recommendationsSectionRef} className="space-y-8">
          <h3 className="font-label text-sm uppercase tracking-[0.3em] text-neutral-500">More Like This</h3>
          
          {recommendationsLoading && <RecommendationSkeleton />}
          
          {!recommendationsLoading && recommendations.length === 0 && (
              <p className="text-sm text-neutral-500 italic font-body">Recommendations will show up here shortly.</p>
          )}

          {!recommendationsLoading && recommendations.length > 0 && (
            <div className="flex flex-wrap justify-center">
              {recommendations.map((item) => (
                <MovieCard key={item.tmdb_id} movie={{ tmdb_id: item.tmdb_id, title: item.title, year: item.year, poster: item.poster ?? undefined }} />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Right Column: Video Integration */}
      <div className="order-1 md:order-2 w-full h-auto md:w-2/3 md:h-[calc(100vh-6rem)] md:sticky md:top-20 md:overflow-hidden mb-6 md:mb-0">
        <div className="w-full h-full bg-surface-container-lowest flex items-start md:items-center justify-center relative overflow-hidden">
          <MovieEmbed 
            source={movie.sources ? movie.sources[0] : undefined}
            title={movie.title} 
            backdrop={movie.backdrop}
            trailerKey={movie.trailerKey}
            //onOpenReview={() => setShowForm(true)} 
          />
        </div>
      </div>

    </main>
  );
}
