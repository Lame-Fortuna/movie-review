import MovieList from "@/components/MovieList"; 
import { movieApi } from "@/lib/movieAPI";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

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