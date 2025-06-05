import { getCollection } from '@/lib/mongodb'

async function fetchOMDBInfo(id: string): Promise<any> {
  const res = await fetch(`http://www.omdbapi.com/?apikey=${process.env.key}&i=${id}`)
  return await res.json()
}

/*
async function fetchTMDBInfo(id: string): Promise<any> {
  const res = await fetch(`http://www.omdbapi.com/?apikey=${process.env.key}&i=${id}`)
  return await res.json()
}
*/

import MovieClient from './MovieClient'

type PageProps = {
  params: { id: string }
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params
  const collection = await getCollection()
  const dbDoc = await collection.findOne({ movieId: id });
  const reviews = dbDoc?.revs || []
  const omdbInfo = await fetchOMDBInfo(id)

  return <MovieClient id={id} movie={omdbInfo} reviews={reviews} />
}