import { getCollection } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id: movieId } = await params;
    const collection = await getCollection("reviews");
    const existing = await collection.findOne({ movieId });

    return NextResponse.json({
      reviews: existing?.revs ?? [],
      total: existing?.total ?? 0,
      avg: existing?.avg ?? 0,
      stars: existing?.stars ?? [0, 0, 0, 0, 0],
    });
  } catch (err) {
    console.error('Error loading reviews:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}