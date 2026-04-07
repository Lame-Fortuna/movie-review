import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://${process.env.usr}:${process.env.password}@${process.env.url}/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  tls: true,
  tlsAllowInvalidCertificates: true,
});

const dbName = "movie-reviews";

let clientPromise: Promise<MongoClient> | null = null;

async function getClient() {
  if (!clientPromise) {
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getCollection(collectionName: string) {
  const client = await getClient();
  return client.db(dbName).collection(collectionName);
}

// Get all available catalogues
export async function getAllCatalogues() {
  try {
    const collection = await getCollection("catalogues");
    
    const catalogues = await collection.find({}).toArray();
    
    return catalogues;
  } catch (error) {
    console.error("Failed to fetch all catalogues:", error);
    return [];
  }
}
