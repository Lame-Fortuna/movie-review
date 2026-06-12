import MovieList from "@/components/MovieList";
import { SITE_NAME, SITE_URL, createMetadata } from "@/lib/metadata";
import { tagFromSlug } from "@/lib/href";
import { movieApi } from "@/lib/movieSearch";

type Params = Promise<{ tag: string }>;
type SearchParams = Promise<{ [key: string]: string | undefined }>;

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const tag = tagFromSlug(params.tag);
  const displayTag = titleCase(tag);

  return createMetadata({
    title: `${displayTag} Movies`,
    description: `Browse ${displayTag} movies on ${SITE_NAME}. Discover classic films, public domain movies, cast, reviews, ratings, and related movie tags.`,
    path: `/tag/${params.tag}`,
  });
}

export default async function TagPage(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const tag = tagFromSlug(params.tag);
  const displayTag = titleCase(tag);
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const sortBy = searchParams.sortBy || "popularity";
  const order = searchParams.order || "DESC";
  const data = await movieApi.search(tag, page, sortBy, order);
  const url = `${SITE_URL}/tag/${params.tag}`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${displayTag} Movies`,
    description: `Classic movie tag archive for ${displayTag}.`,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <MovieList
        movies={data.results}
        totalCount={data.count}
        headerTitle={`Tag: ${displayTag}`}
      />
    </>
  );
}
