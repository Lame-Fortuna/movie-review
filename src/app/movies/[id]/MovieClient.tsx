"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/nav";
import Link from "next/link";
import Head from "next/head";

type Review = {
  usr: string;
  rating: number;
  review: string;
};

type MovieClientProps = {
  id: string;
  movie: any;
  reviews: Review[];
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
  const [posterSrc, setPosterSrc] = useState<string>(
    movie.Poster || movie.Poster2,
  );
  const [generatedUser, setGeneratedUser] = useState("");

  const genres = movie.Genres || [];

  useEffect(() => {
    const shortId = Date.now().toString(36);
    setGeneratedUser(`user ${shortId}`);
  }, []);

  const [rec, setRec] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestBody = {
      title: movie.Title,
      genres: movie.Genres?.map((g: any) => g.name).join(", "),
      plot: movie.Plot,
      cast: movie.Actors,
      director: movie.Director,
    };
    console.log("Request Body:", requestBody);

    setLoading(true);
    fetch("https://l0w1-movie-reco.hf.space/2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((r) => r.json())
      .then((json) => {
        console.log("Recommendations:", json);
        setRec(json.recommended.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, movie]);

  return (
    <div className="min-h-screen bg-base-200">

      <Navbar />

      <main className="w-[97%] min-h-fit lg:h-[85vh] mx-auto p-6 flex flex-col lg:flex-row gap-6 bg-cyan-50 text-black rounded-lg shadow-lg overflow-hidden">
        {/* Left Section (Poster and Title) */}
        <section className="lg:w-1/3 flex-none">
          <h1 className="text-3xl font-bold mb-4">
            {movie.Title}
          </h1>
          <h1 className="text-2xl font-bold mb-4">{movie.Year}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <p className="font-extrabold text-orange-500">{movie.Rated}</p>
            {genres.map((genre: any) => (
              <Link
                href={`/search/genre-${genre.id}/1`}
                key={genre.id}
                className="badge badge-primary hover:underline cursor-pointer"
              >
                {genre.name}
              </Link>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <img
              src={posterSrc}
              alt="Poster"
              onError={() => setPosterSrc("/images/poster.jpg")}
              className="max-w-[200px] object-cover rounded-lg"
            />
          </div>
        </section>

        {/* Right Section (Movie Info, Reviews, Recommendations) */}
        <section className="lg:w-2/3 flex-1 space-y-4 overflow-y-auto">
          {/* Movie Info */}
          <div className="space-y-4">
            <p>
              <strong>Director:</strong> {movie.Director}
            </p>
            <p>
              <strong>Cast:</strong> {movie.Actors}
            </p>
            <p>
              <strong>Released On:</strong> {movie.Released}
            </p>
            <div className="p-2 text-black-content rounded-lg border">
              {movie.Plot}
            </div>
            <p>{movie.Runtime}</p>

            <div className="space-y-2 flex flex-wrap">
              {movie.Ratings?.map((rating: any, idx: number) => (
                <div key={idx} className="text-sm ml-3">
                  <strong>
                    {rating.Source === "Internet Movie Database"
                      ? "IMDB"
                      : rating.Source}
                  </strong>{" "}
                  {rating.Value}
                </div>
              ))}
            </div>
          </div>

          <hr />

          {/* Reviews */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <hr />

            {/* Statistics */}
            <div className="flex flex-col lg:flex-row justify-center items-center gap-4 w-full">
              <div className="flex flex-col items-center text-center">
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
                        checked={Math.abs(avg - value) < 0.26}
                        readOnly
                      />
                    );
                  })}
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    <strong>{total}</strong> reviews
                  </p>
                  <p>
                    Avg: <strong>{avg.toFixed(1)}</strong> / 5
                  </p>
                </div>
              </div>

              <div className="bars flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-6 text-right text-sm font-semibold">
                      {rating}
                    </span>
                    <progress
                      className="progress progress-info w-56"
                      value={total ? (100 * stars[rating - 1]) / total : 0}
                      max="100"
                    />
                  </div>
                ))}
              </div>
            </div>
            <hr />

            {/* Form Controls */}
            <div className="flex gap-2">
              <button
                className="btn btn-accent"
                onClick={() => setShowForm(true)}
              >
                Add Review
              </button>
              {showForm && (
                <button className="btn" onClick={() => setShowForm(false)}>
                  Close
                </button>
              )}
            </div>

            {/* Review Form */}
            {showForm && (
              <form
                className="form-control flex flex-col bg-orange-100 p-6 rounded-box shadow-xl w-full max-w-2xl"
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
                    } else if (!res.ok) {
                      const text = await res.text();
                      alert(`Failed to submit: ${text}`);
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Something went wrong while submitting the review.");
                  }
                }}
              >
                <input
                  className="input input-bordered input-sm bg-gray-100 text-sm text-black cursor-not-allowed"
                  value={generatedUser}
                  readOnly
                />
                <br />
                <div className="rating rating-lg m-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <input
                      key={value}
                      type="radio"
                      name="rating"
                      value={value}
                      className="mask mask-star-2 bg-amber-600 ml-2 mr-2"
                      aria-label={`${value} star`}
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
                <br />
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            )}
            <hr />

            {/* Display Reviews */}
            <div className="h-full space-y-4 pr-2">
              {reviews.length === 0 ? (
                <p>No reviews yet</p>
              ) : (
                localReviews.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-2 p-3 bg-orange-100 shadow rounded-lg"
                  >
                    <div className="w-[20%] text-center border-r pr-2 flex flex-col items-center gap-2">
                      <img
                        className="rounded-full w-16 h-16 object-cover"
                        src="/images/Screenshot 2025-01-19 004453.png"
                        alt="profile pic"
                      />
                      <p className="font-bold text-sm break-words">
                        {item.usr}
                      </p>
                    </div>
                    <div className="w-[80%]">
                      <div className="rating rating-sm">
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
          </div>

          {/* Recommendations Section*/}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Recommendations</h2>
            <hr />
            {loading ? (
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton h-40 w-full rounded-lg"
                  ></div>
                ))}
              </div>
            ) : rec.length === 0 ? (
              <p>No recommendations yet.</p>
            ) : (
              <div className="flex flex-wrap justify-center">
                {rec.map((m) => (
                  <Link href={`/movies/${m.id}`} key={m.id}>
                    <div className="card bg-[#38435b] shadow h-60 w-30 overflow-hidden m-2">
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="h-40 w-full object-cover rounded-t"
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
          </div>
        </section>
      </main>
    </div>
  );
}