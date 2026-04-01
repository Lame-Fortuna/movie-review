import { notFound, permanentRedirect } from "next/navigation";
import MoviePageClient from "@/components/page/MoviePageClient";
import { fetchMovieById } from "@/lib/movie-utils";
import { slugifyMovieTitle } from "@/lib/href";

type PageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

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