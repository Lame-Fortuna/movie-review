"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Star } from "lucide-react";

import Recommendations from "@/components/page/Recommendation";
import { personHref, tagHref } from "@/lib/href";
import type { CreditsData, CriticReview, Movie, Review } from "@/lib/types";

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

function getInitials(name: string) {
  if (!name) {
    return "";
  }

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "";
  }

  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function uniqueNames(items?: { name: string }[]) {
  if (!Array.isArray(items) || items.length === 0) {
    return "Unknown";
  }

  return Array.from(new Set(items.map((item) => item.name).filter(Boolean))).join(", ");
}

function uniquePeople<T extends { id: number; name: string }>(items?: T[]) {
  if (!Array.isArray(items)) {
    return [];
  }

  const people = new Map<number, T>();

  for (const item of items) {
    if (item.id && item.name) {
      people.set(item.id, item);
    }
  }

  return Array.from(people.values());
}

function CriticReviewCard({ review }: { review: CriticReview }) {
  const score = typeof review.sentiment === "number" ? `${review.sentiment}/10` : null;

  return (
    <article className="space-y-4 border-y border-black/15 bg-[linear-gradient(180deg,rgba(250,248,242,0.98),rgba(244,239,228,0.98))] p-3 text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-3">
        <div className="flex items-center gap-3">
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={review.source}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black text-xs font-black uppercase tracking-[0.2em] text-stone-100">
              {getInitials(review.source)}
            </div>
          )}

          <div className="space-y-0.5">
            <p className="font-headline text-[15px] lg:text-xs font-bold uppercase tracking-[0.08em] text-black">
              {review.source}
            </p>
          </div>
        </div>

        {score ? (
          <span className="font-label text-xs uppercase tracking-[0.22em] text-neutral-500">
            {score}
          </span>
        ) : null}
      </div>

      <p className="text-[15px] lg:text-xs italic leading-relaxed text-neutral-800">
        {review.quote_summary}
      </p>
    </article>
  );
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
  const directors = uniquePeople(movie.credits?.directors);
  const writers = uniquePeople(movie.credits?.writers);
  const displayDirector = movie.director || "Unknown";
  const displayWriters = uniqueNames(movie.credits?.writers);
  const criticReviews = movie.critic_reviews ?? [];
  const trivia = movie.trivia ?? [];
  const keywords = movie.keywords ?? [];
  const hasFinancialInfo = Boolean(movie.budget || movie.box_office);
  const hasConsensus = Boolean(movie.critical_consensus?.summary);
  const hasCriticReviews = criticReviews.length > 0;

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
      <div className="order-2 w-full space-y-10 overflow-y-auto border-white/20 px-6 pb-10 md:order-1 md:w-1/3 md:border-r no-scrollbar">
        {/* Movie Details */}
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
                <span>{movie.production_countries}</span>
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
                <img
                  className="aspect-2/3 w-full border border-white/50 object-cover"
                  src={posterSrc}
                  width={200}
                  height={300}
                  alt={movie.title}
                  loading="lazy"
                  decoding="async"
                  onError={() => setPosterSrc("/images/poster.webp")}
                />
              </div>

              <p className="font-body text-base italic leading-relaxed text-on-surface">
                {movie.plot_summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-5">
              {displayDirector && displayDirector !== "N/A" && (
                <div className="flex items-baseline gap-2">
                  <span className="font-label text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Directed by
                  </span>

                  {directors.length > 0 ? (
                    <span className="text-sm text-neutral-100">
                      {directors.map((director, index) => (
                        <Fragment key={director.id}>
                          {index > 0 ? ", " : null}
                          <Link
                            href={personHref(director.id, director.name)}
                            className="transition-colors hover:text-white"
                          >
                            {director.name}
                          </Link>
                        </Fragment>
                      ))}
                    </span>
                  ) : (
                    <span className="text-sm text-neutral-100">
                      {displayDirector}
                    </span>
                  )}
                </div>
              )}

              {displayWriters && displayWriters !== "N/A" && (
                <div className="flex items-baseline gap-2">
                  <span className="font-label text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Written by
                  </span>

                  {writers.length > 0 ? (
                    <span className="text-sm text-neutral-100">
                      {writers.map((writer, index) => (
                        <Fragment key={writer.id}>
                          {index > 0 ? ", " : null}
                          <Link
                            href={personHref(writer.id, writer.name)}
                            className="transition-colors hover:text-white"
                          >
                            {writer.name}
                          </Link>
                        </Fragment>
                      ))}
                    </span>
                  ) : (
                    <span className="text-sm text-neutral-100">
                      {displayWriters}
                    </span>
                  )}
                </div>
              )}

              {movie.budget && movie.budget !== "N/A" && (
                <div className="flex items-baseline gap-2">
                  <span className="font-label text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Budget
                  </span>

                  <span className="text-sm text-neutral-100">
                    {movie.budget}
                  </span>
                </div>
              )}

              {movie.box_office && movie.box_office !== "N/A" && (
                <div className="flex items-baseline gap-2">
                  <span className="font-label text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Box office
                  </span>

                  <span className="text-sm text-neutral-100">
                    {movie.box_office}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </section>
        
        {/* Consensus & Ratings */}
        {(movie.ratings && Object.keys(movie.ratings).length > 0) || hasConsensus ? (
          <section className="space-y-6">
            <h2 className="font-label text-xs  border-b border-white/50 pb-4 uppercase tracking-[0.3em] text-neutral-500">
              Critical Consensus
            </h2>
            <div className="flex flex-row flex-wrap items-center gap-x-10 gap-y-6">
              {movie.ratings?.imdb_rating && (
                <div className="space-y-1">
                  <div className="font-headline text-lg font-semibold">
                    {movie.ratings.imdb_rating}
                  </div>
                  <div className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                    IMDb
                  </div>
                </div>
              )}

              {movie.ratings?.metascore && (
                <div className="space-y-1">
                  <div className="font-headline text-lg font-semibold">
                    {movie.ratings.metascore}
                  </div>
                  <div className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                    Metacritic
                  </div>
                </div>
              )}

              {movie.ratings?.tmdb_rating && (
                <div className="space-y-1">
                  <div className="font-headline text-lg font-semibold">
                    {movie.ratings.tmdb_rating.toFixed(1)}
                  </div>
                  <div className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                    TMDB
                  </div>
                </div>
              )}
            </div>

            {hasConsensus ? (
              <p className="font-body text-sm italic leading-relaxed text-neutral-400">
                {movie.critical_consensus?.summary}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* Cast */}
        {movie.credits?.actors && movie.credits.actors.length > 0 && (
          <section className="space-y-8">
            <h2 className="font-label text-xs  border-b border-white/50  pb-4 uppercase tracking-[0.3em] text-neutral-500">
              The Cast
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {movie.credits.actors.map((actor) => (
                <Link
                  key={actor.id}
                  href={personHref(actor.id, actor.name)}
                  className="max-w-25 min-w-25 space-y-4 rounded-md transition-colors hover:text-white focus:outline-none focus:ring-1 focus:ring-white/60"
                >
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-white/5 bg-surface-container-high">
                    {actor.profile_image ? (
                      <img
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
                    <p className="font-headline text-sm font-semibold leading-tight">
                      {actor.name}
                    </p>
                    <p
                      className="truncate font-label text-[15px] tracking-wider text-neutral-500"
                      title={actor.character}
                    >
                      {actor.character}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trivia */}
        {trivia.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-label text-xs  border-b border-white/50  pb-4 uppercase tracking-[0.3em] text-neutral-500">
              Trivia
            </h2>
            <div className="space-y-4">
              {trivia.map((item, index) => (
                <p
                  key={`${item.slice(0, 20)}-${index}`}
                  className="font-body text-sm italic leading-relaxed text-neutral-400"
                >
                  {item}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="space-y-12">
          <div className="flex items-end justify-between border-b border-white/50 pb-4">
            <h2 className="font-label text-xs uppercase tracking-[0.3em] text-neutral-500">
              Reviews
            </h2>
          </div>

          {/* Stats */}
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
          
          {/* Critic Reviews */}
          {hasCriticReviews ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-label text-xs uppercase tracking-[0.3em] text-neutral-500">
                  Critics
                </h3>
              </div>

              <div className="space-y-4">
                {criticReviews.map((review, index) => (
                  <CriticReviewCard key={`${review.source}-${index}`} review={review} />
                ))}
              </div>
            </div>
          ) : null}

          {/* Audience Reviews */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-label text-xs uppercase tracking-[0.3em] text-neutral-500">
                Audience
              </h3>
            </div>

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
                            fill={starIndex < review.rating ? "currentColor" : "none"}
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

        {/* Recommendations */}
        <Recommendations movie={movie} />

        {/* Keywords */}
        {keywords.length > 0 && (
          <section className="space-y-3 pb-4">
            <h3 className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Tags
            </h3>

            <div className="flex flex-wrap gap-x-4 gap-y-2 font-label text-[11px] uppercase leading-6 tracking-[0.2em] text-neutral-600">
              {keywords.map((keyword) => (
                <Link
                  key={keyword}
                  href={tagHref(keyword)}
                  className="transition-colors hover:text-white"
                  title={`Browse ${keyword} movies`}
                >
                  #{keyword}
                </Link>
              ))}
            </div>
          </section>
        )}
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
