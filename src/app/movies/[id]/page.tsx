import { notFound, permanentRedirect } from "next/navigation";
import { fetchMovieById } from "@/lib/moviePage";
import { movieHref } from "@/lib/href";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MovieIdRedirectPage({ params }: PageProps) {
  const { id } = await params;
  const movie = await fetchMovieById(id);

  if (!movie) {
    notFound();
  }

  const link = movieHref(movie.tmdb_id, movie.title)

  permanentRedirect(link);
}
