import CatalogueClient from "@/components/CatalogueClient";
import { getCollection } from "@/lib/mongodb";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getCatalogue(slug: string): Promise<any> {
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

export default async function Page({ params }: PageProps) {

  const { slug } = await params;

  // Fetch from MongoDB
  const catalogue = await getCatalogue(slug);

  if (!catalogue) {
    return (
      <h1>No such catalgue</h1>
    )
  }
  console.log(catalogue)

  return <CatalogueClient catalogue={catalogue} />;
}
