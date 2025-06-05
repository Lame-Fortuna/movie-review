import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = `mongodb+srv://${process.env.usr}:${process.env.password}@${process.env.url}/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  tls: true,
  tlsAllowInvalidCertificates: true,
});

export async function getCollection() {
  if (!client.isConnected) await client.connect();
  return client.db('movie-reviews').collection('reviews');
}
