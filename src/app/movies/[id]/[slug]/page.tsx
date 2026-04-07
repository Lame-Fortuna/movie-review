import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import MoviePageClient from "@/components/page/MoviePageClient";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  createMetadata,
} from "@/lib/metadata";
import { fetchMovieById } from "@/lib/moviePage";
import { slugifyMovieTitle } from "@/lib/href";

type PageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await fetchMovieById(id);

  if (!movie) {
    return createMetadata({
      title: "Movie Not Found",
      description: "Browse classic movie details on Film Atlas.",
      path: `/movies/${id}`,
    });
  }

  const movieSlug = slugifyMovieTitle(movie.title);
  const movieUrl = `${SITE_URL}/movies/${movie.tmdb_id}/${movieSlug}`;
  
  const titleWithYear = movie.year ? `${movie.title} (${movie.year})` : movie.title;
  
  // Clean, concatenated description truncated to SEO sweet-spot (~160 chars)
  const rawDesc = `${movie.plot_summary || movie.tagline || ""} Directed by ${movie.director || "Unknown"}. Starring ${movie.actors || "an ensemble cast"}.`;
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;

  // Flatten out keywords from data we already normalized
  const keywords = [
    movie.title,
    movie.original_title,
    movie.year?.toString(),
    ...(movie.genres || []),
    movie.director,
    movie.collection,
    "movie details",
    "film review",
    "cast",
    "ratings",
    SITE_NAME,
  ].filter(Boolean) as string[];

  // Grab the best available images safely
  const images = [movie.backdrop, movie.poster_original, movie.poster, movie.poster2, DEFAULT_OG_IMAGE]
    .filter(Boolean)
    .map((url) => ({ url: url as string, alt: `${movie.title} poster or backdrop` }));

  const robots = movie.restricted
    ? { index: false, follow: false, noarchive: true, nosnippet: true, noimageindex: true }
    : { index: true, follow: true, "max-image-preview": "large" as const };

  return {
    title: `${titleWithYear} | Cast, Reviews & Ratings`,
    description,
    keywords: keywords.slice(0, 20), // Keep it to the top 20 relevant keywords
    authors: movie.credits?.directors?.map((d) => ({ name: d.name })) || [],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: movie.genres?.[0] || "Movies",
    alternates: { canonical: movieUrl },
    robots,
    openGraph: {
      type: "video.movie",
      title: titleWithYear,
      description,
      url: movieUrl,
      siteName: SITE_NAME,
      images,
      countryName: movie.production_countries?.split(",")[0],
      releaseDate: movie.release_date,
      tags: keywords.slice(0, 10),
    },
    twitter: {
      card: images[0] ? "summary_large_image" : "summary",
      title: titleWithYear,
      description,
      images: images[0] ? [images[0].url] : undefined,
    },
    // Dump extra data cleanly into 'other' without mapping loops
    other: {
      "movie:status": movie.status || "",
      "movie:age_rating": movie.rated || "",
      "movie:imdb_id": movie.imdb_id || "",
      "movie:runtime": movie.runtime?.toString() || "",
      "movie:director": movie.director || "",
    },
  };
}

export default async function MovieSlugPage({ params }: PageProps) {
  const { id, slug } = await params;
  const movie = await fetchMovieById(id);

  if (!movie) {
    notFound();
  }

  const expectedSlug = slugifyMovieTitle(movie.title);

  if (slug !== expectedSlug) {
    permanentRedirect(`/movies/${movie.tmdb_id}/${expectedSlug}`);
  }

  return <MoviePageClient movie={movie} />;
}