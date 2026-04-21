"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PenLine, Star, X } from "lucide-react";

import type { Review } from "@/lib/types";

import MovieActionButton from "./MovieActionButton";

type MovieReviewButtonProps = {
  movieId: number;
  onReviewSubmitted?: (review: Review) => void;
};

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

export default function MovieReviewButton({
  movieId,
  onReviewSubmitted,
}: MovieReviewButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [generatedUser, setGeneratedUser] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formReviewText, setFormReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setGeneratedUser(`user ${Date.now().toString(36)}`);
  }, []);

  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const onOpenReview = () => {
    setSubmitError(null);
    setShowForm(true);
  };

  const onCloseReview = () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError(null);
    setShowForm(false);
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formRating === 0 || !formReviewText.trim()) {
      return;
    }

    const reviewUser = generatedUser || `user ${Date.now().toString(36)}`;

    if (!generatedUser) {
      setGeneratedUser(reviewUser);
    }

    const trimmedReview = formReviewText.trim();
    const formData = new FormData();
    formData.append("usr", reviewUser);
    formData.append("rating", formRating.toString());
    formData.append("review", trimmedReview);

    const newReview: Review = {
      usr: reviewUser,
      rating: formRating,
      review: trimmedReview,
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch(`/api/reviews/insert/${movieId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setSubmitError("We couldn't save that review right now.");
        return;
      }

      onReviewSubmitted?.(newReview);
      setShowForm(false);
      setFormRating(0);
      setFormReviewText("");
    } catch {
      setSubmitError("Error submitting review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MovieActionButton
        icon={<PenLine className="h-5 w-5" />}
        label="Review"
        onClick={onOpenReview}
      />

      {showForm && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 p-4 sm:p-6">
          <div className="relative w-full max-w-2xl border border-white/10 bg-neutral-950 p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={onCloseReview}
              className="absolute right-4 top-4 text-neutral-500 transition-colors hover:text-white"
              aria-label="Close review form"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 pr-10">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                Audience Review
              </p>
              <h2 className="font-headline text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Share what stood out
              </h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleReviewSubmit}>
              <div className="space-y-4">
                <label className="block font-label text-[10px] uppercase tracking-widest text-neutral-500">
                  Rating
                </label>
                <div className="flex gap-3 sm:gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className={`transition-colors hover:text-amber-300 ${
                        formRating >= star ? "text-amber-400" : "text-neutral-600"
                      }`}
                      aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                    >
                      <Star
                        className="h-8 w-8"
                        fill={formRating >= star ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block font-label text-[10px] uppercase tracking-widest text-neutral-500">
                  Your Review
                </label>
                <textarea
                  value={formReviewText}
                  onChange={(event) => setFormReviewText(event.target.value)}
                  required
                  className="min-h-35 w-full resize-none rounded-sm border border-white/10 bg-black/50 p-4 font-body text-sm text-white outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20"
                  placeholder="What stood out to you?"
                />
              </div>

              <div
                className="cf-turnstile"
                data-sitekey="0x4AAAAAACwhBeeQ7_JCF-gy"
                data-size="flexible"
              />

              {submitError && (
                <p className="font-body text-sm italic text-red-400">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || formRating === 0 || !formReviewText.trim()}
                className="w-full rounded-sm bg-primary py-4 font-label text-[10px] uppercase tracking-widest text-on-primary transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
