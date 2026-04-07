import MovieList from "@/components/MovieList"; 
import { createMetadata } from "@/lib/metadata";
import { movieApi } from "@/lib/movieSearch";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export async function generateMetadata(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const q = searchParams.q?.trim();

  return createMetadata({
    title: q ? `Search Results for "${q}"` : "Search Movies",
    description: q
      ? `Browse Film Atlas search results for ${q}.`
      : "Search the Film Atlas archive by title, keyword, or collection.",
    path: "/search",
  });
}

export default async function SearchPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  
  // Extract parameters from the URL (e.g., ?q=matrix&page=2)
  const q = searchParams.q || "";
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const sortBy = searchParams.sortBy || "popularity";
  const order = searchParams.order || "DESC";

  // Fetch data
  const data = await movieApi.search(q, page, sortBy, order);

  return (
    <MovieList
      movies={data.results}
      totalCount={data.count}
      headerTitle={q ? `Search: "${q}"` : "Search Movies"}
    />
  );
}
