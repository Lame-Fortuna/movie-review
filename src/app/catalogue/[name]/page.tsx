import fs from "fs";
import path from "path";
import CatalogueClient from "./CatalogueClient";
import { getCollection } from "@/lib/mongodb";

type PageProps = {
  params: Promise<{
    name: string;
  }>;
};

async function getCatalogue(name:string): Promise<any> {
  try{
    const collection = await getCollection("catalogues");
    const catalogue = await collection.findOne({id: name});
    return catalogue;
  }
  catch(error){
    console.error("MongoDB error:", error);
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  
  const { name } = await params;

  // Fetch from MongoDB
  const catalogue = await getCatalogue(name);

  if (!catalogue) {
    return(
      <div>no such catalgue</div>
    )
    }

  return <CatalogueClient catalogue={catalogue} />;
}
