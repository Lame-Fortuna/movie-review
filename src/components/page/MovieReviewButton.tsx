"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { PenLine, Star, X } from "lucide-react";

import type { Review } from "@/lib/types";
import MovieActionButton from "./MovieActionButton";

type MovieReviewButtonProps = {
  movieId: number;
  onReviewSubmitted?: (review: Review) => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "flexible" | "compact";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        },
      ) => string;
      remove: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TURNSTILE_SITEKEY = "0x4AAAAAACwhBeeQ7_JCF-gy";

export default function MovieReviewButton({
  movieId,
  onReviewSubmitted,
}: MovieReviewButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 0, review: "" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const resetForm = () => {
    setForm({ rating: 0, review: "" });
    setTurnstileToken("");
    setTurnstileError(null);
    setSubmitError(null);
  };

  useEffect(() => {
    if (!showForm || !turnstileContainerRef.current) return;

    const renderTurnstile = () => {
      if (!window.turnstile || turnstileWidgetIdRef.current) return;

      turnstileWidgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current!,
        {
          sitekey: TURNSTILE_SITEKEY,
          theme: "dark",
          size: "flexible",

          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError(null);
          },

          "error-callback": () => {
            setTurnstileToken("");
            setTurnstileError("Verification failed.");
          },

          "expired-callback": () => {
            setTurnstileToken("");
            setTurnstileError("Verification expired.");
          },
        },
      );
    };

    if (!window.turnstile) {
      const script = document.createElement("script");

      script.src = TURNSTILE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;

      document.head.appendChild(script);
    } else {
      renderTurnstile();
    }

    return () => {
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [showForm]);

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.rating || !form.review.trim()) return;

    if (!turnstileToken) {
      setTurnstileError("Please complete verification before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const reviewUser = `user ${Date.now().toString(36)}`;
      const trimmedReview = form.review.trim();

      const formData = new FormData();

      formData.append("usr", reviewUser);
      formData.append("rating", String(form.rating));
      formData.append("review", trimmedReview);
      formData.append("token",turnstileToken,);

      const response = await fetch(
        `/api/reviews/insert/${movieId}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(
          data.error || "Something went wrong.",
        );

        return;
      }

      onReviewSubmitted?.({
        usr: reviewUser,
        rating: form.rating,
        review: trimmedReview,
      });

      setShowForm(false);
      resetForm();
    } catch {
      setSubmitError("Error submitting review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled =
    isSubmitting ||
    !form.rating ||
    !form.review.trim() ||
    !turnstileToken;

  return (
    <>
      <MovieActionButton
        icon={<PenLine className="h-5 w-5" />}
        label="Review"
        onClick={() => {
          setSubmitError(null);
          setTurnstileError(null);
          setShowForm(true);
        }}
      />

      {showForm && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 p-4 sm:p-6">
          <div className="relative w-full max-w-2xl border border-white/10 bg-neutral-950 p-6 shadow-2xl sm:p-8">
            <button type="button" onClick={() => {
              if (isSubmitting) return;
              setShowForm(false);
              resetForm();
            }} className="absolute right-4 top-4 text-neutral-500 transition-colors hover:text-white" aria-label="Close review form">
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
                      onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                      className={`transition-colors hover:text-amber-300 ${
                        form.rating >= star
                          ? "text-amber-400"
                          : "text-neutral-600"
                      }`}
                      aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                    >
                      <Star
                        className="h-8 w-8"
                        fill={form.rating >= star ? "currentColor" : "none"}
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
                  value={form.review}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      review: event.target.value,
                    }))
                  }
                  required
                  className="min-h-35 w-full resize-none rounded-sm border border-white/10 bg-black/50 p-4 font-body text-sm text-white outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20"
                  placeholder="What stood out to you?"
                />
              </div>

              <div className="space-y-3">
                <div ref={turnstileContainerRef} className="min-h-[65px] w-full max-w-sm" />

                {turnstileError && (
                  <p className="font-body text-sm italic text-red-400">
                    {turnstileError}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="font-body text-sm italic text-red-400">
                  {submitError}
                </p>
              )}

              <button type="submit" disabled={isDisabled} className="w-full rounded-sm bg-primary py-4 font-label text-[10px] uppercase tracking-widest text-on-primary transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}