import MovieList from "@/components/MovieList";
import { createMetadata } from "@/lib/metadata";
import { movieApi } from "@/lib/movieSearch";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | undefined }>;

export async function generateMetadata(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const role = searchParams.role || "cast";

  return createMetadata({
    title: `Filmography (${role})`,
    description: `Browse Film Atlas filmography results for crew member ${params.id}.`,
    path: `/crew/${params.id}`,
  });
}

export default async function CrewPage(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const crewId = params.id;
  const role = searchParams.role || "cast";
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const sortBy = searchParams.sortBy || "popularity";
  const order = searchParams.order || "DESC";

  // Fetch data using the specific crew endpoint
  const data = await movieApi.crew(crewId, role, page, sortBy, order);

  return (
    <MovieList
      movies={data.results}
      totalCount={data.count}
      headerTitle={`Filmography (ID: ${crewId})`} 
    />
  );
}
