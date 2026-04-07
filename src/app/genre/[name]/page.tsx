import MovieList from "@/components/MovieList";
import { createMetadata } from "@/lib/metadata";
import { movieApi } from "@/lib/movieSearch";

type Params = Promise<{ name: string }>;
type SearchParams = Promise<{ [key: string]: string | undefined }>;

function formatGenreName(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const genreName = decodeURIComponent(params.name);
  const formattedGenre = formatGenreName(genreName);

  return createMetadata({
    title: `${formattedGenre} Movies`,
    description: `Browse ${formattedGenre.toLowerCase()} movies on Film Atlas.`,
    path: `/genre/${encodeURIComponent(genreName)}`,
  });
}

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
