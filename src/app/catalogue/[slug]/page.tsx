import CatalogueClient from "@/components/CatalogueClient";
import { getCollection } from "@/lib/mongodb";
import { createMetadata } from "@/lib/metadata";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Database fetch
async function fetchCatalogueFromDB(slug: string): Promise<any> {
  try {
    const collection = await getCollection("catalogues");
    const catalogue = await collection.findOne({ id: slug });
    return catalogue;
  }
  catch (error) {
    console.error("MongoDB error:", error);
    return null;
  }
} 

// Cache wrapper
export const getCachedCatalogue = async (slug: string): Promise<any> => {
  const fetchCached = unstable_cache(
    async () => {
      return await fetchCatalogueFromDB(slug);
    },
    ['catalogue', slug], // Cache key based on slug
    {
      revalidate: 43200, // Cache for 12 hours (12 * 60 * 60)
      tags: [`catalogue-${slug}`], // Tag for manual cache invalidation
    }
  );

  return fetchCached();
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const catalogue = await getCachedCatalogue(slug);

  if (!catalogue) {
    return createMetadata({
      title: "Catalogue",
      description: "Browse curated film collections on Film Atlas.",
      path: `/catalogue/${slug}`,
    });
  }

  return createMetadata({
    title: catalogue.title || "Catalogue",
    description:
      catalogue.desc || "Explore this curated Film Atlas collection.",
    path: `/catalogue/${slug}`,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const catalogue = await getCachedCatalogue(slug);

  if (!catalogue) {
    notFound(); 
  }

  return <CatalogueClient catalogue={catalogue} />;
}
