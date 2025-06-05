import { getCollection } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    const { id: movieId } = await params;
    const form = await req.formData();

    const rating = parseInt(form.get('rating'), 10);
    const doc = {
      usr: form.get('usr'),
      rating,
      review: form.get('review'),
    };

    const collection = await getCollection();

    const existing = await collection.findOne({ movieId });

    if (existing) {
      const stars = [...existing.stars];
      stars[rating - 1] += 1;

      const newTotal = existing.total + 1;
      const newSum = (existing.avg ?? 0) * existing.total + rating;
      const avg = newSum / newTotal;

      await collection.updateOne(
        { movieId },
        {
          $push: { revs: doc },
          $inc: { total: 1 },
          $set: { avg, stars },
        }
      );
    } else {
      const stars = [0, 0, 0, 0, 0];
      stars[rating - 1] = 1;
      const avg = rating;

      await collection.insertOne({
        _id: crypto.randomUUID(),
        movieId,
        revs: [doc],
        total: 1,
        avg,
        stars,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error inserting review:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
