"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import Image from "next/image";

import Recommendations from "@/components/page/Recommendation";
import type { CreditsData, Movie, Review } from "@/lib/types";

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

export default function MoviePageClient({
  movie,
}: {
  movie: Movie & { credits?: CreditsData };
}) {
  const [posterSrc, setPosterSrc] = useState(
    movie.poster ?? movie.poster2 ?? "/images/poster.webp",
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const stats = useMemo(() => calculateStats(reviews), [reviews]);
  const displayDirector = movie.credits?.directors?.[0]?.name || movie.director;

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        setReviewsLoading(true);
        setReviewsError(null);

        const response = await fetch(`/api/reviews/get/${movie.tmdb_id}`);

        if (!response.ok) {
          throw new Error("Unable to load reviews");
        }

        const data = await response.json();

        if (!cancelled) {
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        }
      } catch {
        if (!cancelled) {
          setReviewsError("Reviews are temporarily unavailable.");
        }
      } finally {
        if (!cancelled) {
          setReviewsLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [movie.tmdb_id]);

  const handleReviewSubmitted = (review: Review) => {
    setReviewsError(null);
    setReviews((current) => [review, ...current]);
  };

  return (
    <main className="flex min-h-screen w-full flex-col pt-16 text-on-surface md:flex-row md:pt-20">
      <div className="order-2 w-full space-y-20 overflow-y-auto border-white/20 px-6 pb-10 md:order-1 md:w-1/3 md:border-r no-scrollbar">
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            <div className="space-y-4 pt-2">
              <h1 className="font-headline text-3xl font-bold leading-none tracking-tighter md:text-4xl">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-x-6 gap-y-2 font-label text-sm uppercase tracking-[0.2em] text-neutral-500">
                <span>{movie.year}</span>
                <span>{movie.runtime} min</span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 font-label text-sm uppercase tracking-[0.2em] text-neutral-500">
                {movie.genres?.map((genre) => (
                  <Link
                    key={genre}
                    href={`/genre/${genre}`}
                    className="shrink-0 uppercase transition-colors hover:text-white"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex gap-6">
              <div className="relative h-max w-2/5 shrink-0 overflow-hidden rounded-xs">
                <Image
                  className="aspect-2/3 w-full border border-white/10 object-cover"
                  src={posterSrc}
                  width={200}
                  height={300}
                  alt={movie.title}
                  loading="lazy"
                  decoding="async"
                  onError={() => setPosterSrc("/images/poster.webp")}
                />
              </div>

              <div className="w-3/5 space-y-6">
                <p className="font-body text-base italic leading-relaxed text-on-surface">
                  {movie.plot_summary}
                </p>
                <p className="font-label text-sm uppercase tracking-widest text-neutral-500">
                  Directed by <span className="text-white">{displayDirector}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {movie.ratings && Object.keys(movie.ratings).length > 0 && (
          <section className="space-y-6">
            <h3 className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Critical Consensus
            </h3>
            <div className="flex flex-row flex-wrap items-center gap-x-10 gap-y-6">
              {movie.ratings.imdb_rating && (
                <div className="space-y-1">
                  <div className="font-headline text-lg font-semibold">
                    {movie.ratings.imdb_rating}
                  </div>
                  <div className="font-label text-[9px] uppercase tracking-widest text-neutral-500">
                    IMDb
                  </div>
                </div>
              )}

              {movie.ratings.rotten_tomatoes && (
                <div className="space-y-1">
                  <div className="font-headline text-lg font-semibold">
                    {movie.ratings.rotten_tomatoes}
                  </div>
                  <div className="font-label text-[9px] uppercase tracking-widest text-neutral-500">
                    Rotten Tomatoes
                  </div>
                </div>
              )}

              {movie.ratings.metascore && (
                <div className="space-y-1">
                  <div className="font-headline text-lg font-semibold">
                    {movie.ratings.metascore}
                  </div>
                  <div className="font-label text-[9px] uppercase tracking-widest text-neutral-500">
                    Metacritic
                  </div>
                </div>
              )}

              {movie.ratings.tmdb_rating && (
                <div className="space-y-1">
                  <div className="font-headline text-lg font-semibold">
                    {movie.ratings.tmdb_rating}
                  </div>
                  <div className="font-label text-[9px] uppercase tracking-widest text-neutral-500">
                    TMDB
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {movie.credits?.actors && movie.credits.actors.length > 0 && (
          <section className="space-y-8">
            <h3 className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              The Cast
            </h3>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {movie.credits.actors.map((actor) => {
                const getInitials = (name: string) => {
                  if (!name) {
                    return "";
                  }

                  const parts = name.trim().split(" ");

                  if (parts.length === 1) {
                    return parts[0][0].toUpperCase();
                  }

                  return (
                    parts[0][0] + parts[parts.length - 1][0]
                  ).toUpperCase();
                };

                return (
                  <div key={actor.id} className="max-w-25 min-w-25 space-y-4">
                    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-white/5 bg-surface-container-high">
                      {actor.profile_image ? (
                        <Image
                          className="h-full w-full object-cover"
                          width={50}
                          height={50}
                          src={actor.profile_image}
                          alt={actor.name}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="font-headline text-2xl font-bold tracking-widest text-neutral-400">
                          {getInitials(actor.name)}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-headline text-xs font-semibold leading-tight">
                        {actor.name}
                      </p>
                      <p
                        className="truncate font-label text-[9px] tracking-wider text-neutral-500"
                        title={actor.character}
                      >
                        {actor.character}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="space-y-12">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <h3 className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Audience Consensus
            </h3>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="rating rating-xl rating-half mb-2">
                {Array.from({ length: 10 }, (_, index) => {
                  const value = (index + 1) / 2;

                  return (
                    <input
                      key={value}
                      type="radio"
                      name="avg-rating"
                      className={`mask mask-star-2 ${
                        index % 2 === 0 ? "mask-half-1" : "mask-half-2"
                      } bg-amber-400`}
                      aria-label={`${value} stars`}
                      checked={Math.abs(stats.avg - value) < 0.26}
                      readOnly
                    />
                  );
                })}
              </div>
              <div className="font-label text-sm uppercase tracking-widest text-neutral-400">
                <p className="mb-1">
                  <strong className="text-white">{stats.total}</strong> reviews
                </p>
                <p>
                  Avg: <strong className="text-white">{stats.avg.toFixed(1)}</strong> / 5
                </p>
              </div>
            </div>

            <div className="bars flex w-full max-w-50 flex-col gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-4 text-right font-label text-[10px] text-neutral-400">
                    {rating}
                  </span>
                  <progress
                    className="progress progress-info h-1.5 w-full rounded-none bg-surface-container-high [&::-moz-progress-bar]:rounded-none [&::-webkit-progress-bar]:rounded-none [&::-webkit-progress-value]:rounded-none"
                    value={stats.total ? (100 * stats.stars[rating - 1]) / stats.total : 0}
                    max="100"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {reviewsLoading && (
              <p className="font-body text-sm italic text-neutral-500">
                Loading reviews...
              </p>
            )}

            {!reviewsLoading && reviewsError && (
              <p className="font-body text-sm italic text-red-400">{reviewsError}</p>
            )}

            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <p className="font-body text-sm italic text-neutral-500">
                No reviews yet. Be the first to add one.
              </p>
            )}

            {!reviewsLoading &&
              reviews.map((review, index) => (
                <div
                  key={`${review.usr}-${index}`}
                  className="space-y-4 rounded-lg bg-white p-6 text-black shadow-md"
                >
                  <div className="flex justify-between font-label text-[10px] uppercase tracking-widest text-neutral-500">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-black">{review.usr}</span>
                      <span className="flex">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={`h-3 w-3 ${
                              starIndex < review.rating
                                ? "text-amber-500"
                                : "text-neutral-300"
                            }`}
                            fill={
                              starIndex < review.rating ? "currentColor" : "none"
                            }
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                  <p className="font-body text-sm italic leading-relaxed">
                    &quot;{review.review}&quot;
                  </p>
                </div>
              ))}
          </div>
        </section>

        <Recommendations movie={movie} />
      </div>

      <div className="order-1 mb-6 h-auto w-full md:order-2 md:mb-0 md:h-[calc(100vh-6rem)] md:w-2/3 md:sticky md:top-20 md:overflow-hidden">
        <div className="relative flex h-full w-full items-start justify-center overflow-hidden bg-surface-container-lowest md:items-center">
          <MovieEmbed
            source={movie.sources ? movie.sources[0] : undefined}
            title={movie.title}
            backdrop={movie.backdrop}
            trailerKey={movie.trailerKey}
            movieId={movie.tmdb_id}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      </div>
    </main>
  );
}
