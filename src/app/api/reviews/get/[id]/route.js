import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

const getCachedReviews = (movieId) => 
  unstable_cache(
    async () => {
      const collection = await getCollection("reviews");
      const existing = await collection.findOne({ movieId });

      return {
        reviews: existing?.revs ?? [],
        total: existing?.total ?? 0,
        avg: existing?.avg ?? 0,
        stars: existing?.stars ?? [0, 0, 0, 0, 0],
      };
    },
    // Cache key 
    ['movie-reviews', movieId], 
    {
      revalidate: 5 * 60, // TTL in seconds (5 minutes)
      tags: ['reviews', `movie-${movieId}`] // Allows for on-demand revalidation later
    }
  )(); // Invoke the cache wrapper

export async function GET(req, { params }) {
  try {
    const { id: movieId } = await params;
    
    const reviewData = await getCachedReviews(movieId);

    return NextResponse.json(reviewData);
  } catch (err) {
    console.error('Error loading reviews:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}