"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/nav";
import Link from "next/link";

type Review = {
  usr: string;
  rating: number;
  review: string;
};

type MovieClientProps = {
  id: string;
  movie: any;
  reviews: Review[];
  src?: string;
};

function calculateStats(reviews: Review[]) {
  const total = reviews.length;
  const stars = [0, 0, 0, 0, 0];
  let sum = 0;

  reviews.forEach(({ rating }) => {
    if (rating >= 1 && rating <= 5) {
      stars[rating - 1] += 1;
      sum += rating;
    }
  });

  const avg = total ? sum / total : 0;
  return { avg, total, stars, reviews };
}

export default function MovieClient({ id, movie, reviews }: MovieClientProps) {
  const [localReviews, setLocalReviews] = useState(reviews);
  const { avg, total, stars } = calculateStats(localReviews);

  const [showForm, setShowForm] = useState(false);
  const [posterSrc, setPosterSrc] = useState<string>(movie.Poster || movie.Poster2);
  const [generatedUser, setGeneratedUser] = useState("");
  const [rec, setRec] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const genres = movie.Genres || [];

  useEffect(() => {
    const shortId = Date.now().toString(36);
    setGeneratedUser(`user ${shortId}`);
  }, []);

  useEffect(() => {
    const requestBody = {
      title: movie.Title,
      genres: movie.Genres?.map((g: any) => g.name).join(", "),
      plot: movie.Plot,
      cast: movie.Actors,
      director: movie.Director,
    };

    setLoading(true);
    fetch("https://l0w1-movie-reco.hf.space/2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((r) => r.json())
      .then((json) => setRec(json.recommended.slice(0, 5)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, movie]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <main className="w-[90%] mx-auto mt-5 p-6 flex flex-col bg-cyan-50 text-black rounded-lg shadow-xl">

        {/* Title + Year */}
        <header className="text-center mb-6">
          <h1 className="text-5xl font-extrabold">{movie.Title}</h1>
          <p className="text-2xl text-gray-700">{movie.Year}</p>
        </header>

        {/* Embedded Movie */}
        <section className="mb-10">
          <iframe
            className="aspect-video w-[90%] mx-auto rounded-lg shadow-md"
            src={movie.src}
          />
        </section>

        {/* Overview Section */}
        <section className="w-[85%] mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-3">Overview</h2>
          <hr className="mb-6" />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <img
                src={posterSrc}
                alt="Poster"
                onError={() => setPosterSrc("/images/poster.jpg")}
                className="max-w-[250px] object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Movie Info */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{movie.Title} ({movie.Year})</h1>

              <div className="flex flex-wrap gap-2">
                <p className="font-extrabold text-orange-500">{movie.Rated}</p>
                {genres.map((genre: any) => (
                  <Link
                    href={`/search/genre-${genre.id}/1`}
                    key={genre.id}
                    className="badge badge-primary hover:underline"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              <p><strong>Director:</strong> {movie.Director}</p>
              <p><strong>Cast:</strong> {movie.Actors}</p>
              <p><strong>Released:</strong> {movie.Released}</p>
              <p><strong>Runtime:</strong> {movie.Runtime}</p>
              <p className="p-3 bg-white border rounded-lg shadow-sm">{movie.Plot}</p>

              <div className="flex flex-wrap gap-3">
                {movie.Ratings?.map((rating: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    <strong>{rating.Source === "Internet Movie Database" ? "IMDB" : rating.Source}:</strong> {rating.Value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="w-[85%] mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-3">Reviews</h2>
          <hr className="mb-6" />

          {/* Stats */}
          <div className="flex flex-col lg:flex-row justify-around items-center gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="rating rating-xl rating-half mb-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const value = (i + 1) / 2;
                  return (
                    <input
                      key={value}
                      type="radio"
                      name="avg-rating"
                      className={`mask mask-star-2 ${i % 2 === 0 ? "mask-half-1" : "mask-half-2"} bg-amber-400`}
                      checked={Math.abs(avg - value) < 0.26}
                      readOnly
                    />
                  );
                })}
              </div>
              <p className="text-gray-700 text-sm">
                <strong>{total}</strong> reviews | Avg: <strong>{avg.toFixed(1)}</strong>/5
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="w-6 text-right text-sm font-semibold">{rating}</span>
                  <progress
                    className="progress progress-info w-56"
                    value={total ? (100 * stars[rating - 1]) / total : 0}
                    max="100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mb-6">
            <button className="btn btn-accent" onClick={() => setShowForm(true)}>
              Add Review
            </button>
            {showForm && (
              <button className="btn" onClick={() => setShowForm(false)}>Close</button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <form
              className="form-control flex flex-col bg-orange-100 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                formData.append("usr", generatedUser);

                const newReview = {
                  usr: generatedUser,
                  rating: Number(formData.get("rating")),
                  review: formData.get("review") as string,
                };

                setShowForm(false);
                form.reset();

                try {
                  const res = await fetch(`/api/insert/${id}`, {
                    method: "POST",
                    body: formData,
                  });

                  if (res.ok) {
                    setLocalReviews((prev) => [newReview, ...prev]);
                  } else {
                    const text = await res.text();
                    alert(`Failed to submit: ${text}`);
                  }
                } catch {
                  alert("Something went wrong while submitting the review.");
                }
              }}
            >
              <input
                className="input input-bordered bg-gray-100 text-sm cursor-not-allowed"
                value={generatedUser}
                readOnly
              />
              <div className="rating rating-lg m-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <input
                    key={value}
                    type="radio"
                    name="rating"
                    value={value}
                    className="mask mask-star-2 bg-amber-600 mx-2"
                    required
                  />
                ))}
              </div>
              <textarea
                name="review"
                className="textarea textarea-lg h-24 mb-4 bg-white"
                placeholder="Tell us about your experience..."
                required
              />
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          )}

          {/* Review List */}
          <div className="mt-8 space-y-4">
            {localReviews.length === 0 ? (
              <p className="text-center">No reviews yet</p>
            ) : (
              localReviews.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-orange-100 shadow rounded-lg">
                  <div className="w-[20%] text-center flex flex-col items-center gap-2 border-r">
                    <img
                      className="rounded-full w-16 h-16 object-cover"
                      src="/images/Screenshot 2025-01-19 004453.png"
                      alt="profile pic"
                    />
                    <p className="font-bold text-sm">{item.usr}</p>
                  </div>
                  <div className="w-[80%]">
                    <div className="rating rating-sm mb-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <input
                          key={val}
                          type="radio"
                          name={`rating-${i}`}
                          className="mask mask-star-2 bg-orange-400"
                          checked={val === Number(item.rating)}
                          readOnly
                        />
                      ))}
                    </div>
                    <p>{item.review}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recommendations */}
        <section className="w-[85%] mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-3">Recommendations</h2>
          <hr className="mb-6" />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-40 w-full rounded-lg"></div>
              ))}
            </div>
          ) : rec.length === 0 ? (
            <p className="text-center">No recommendations yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {rec.map((m) => (
                <Link href={`/movies/${m.id}`} key={m.id}>
                  <div className="card bg-[#38435b] shadow-lg w-40 hover:scale-105 transition">
                    <img
                      src={m.poster}
                      alt={m.title}
                      className="h-56 w-full object-cover rounded-t"
                    />
                    <div className="p-2">
                      <h3 className="font-bold text-center text-sm text-white">
                        {m.title} {m.year}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
