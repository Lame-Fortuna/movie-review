import MovieList from "@/components/MovieList";
import { movieApi } from "@/lib/movieAPI";

type Params = Promise<{ name: string }>;
type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function GenrePage(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  // Decode the URL in case there are spaces (e.g., "science%20fiction")
  const genreName = decodeURIComponent(params.name); 
  
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const sortBy = searchParams.sortBy || "popularity";
  const order = searchParams.order || "DESC";

  // Fetch data using the specific genre endpoint
  const data = await movieApi.genre(genreName, page, sortBy, order);

  return (
    <MovieList
      movies={data.results}
      totalCount={data.count}
      headerTitle={`${genreName} Movies`}
    />
  );
}