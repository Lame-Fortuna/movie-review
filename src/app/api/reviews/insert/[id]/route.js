import { getCollection } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const secretKey = process.env.TURNSTILE_SERVER;

export async function POST(req, { params }) {
  try {
    const { id: movieId } = await params;
    const form = await req.formData();
    const forwardedFor = req.headers.get("x-forwarded-for");

    const ip = forwardedFor?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

    const rating = parseInt(form.get('rating'), 10);
    const doc = {
      usr: form.get('usr'),
      rating,
      review: form.get('review'),
    };
    const token = form.get('token');

    // Verify Turnstile token
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({
        secret: secretKey,
        response: token
      })
    });

    const verificationData = await verificationResponse.json();

    if (!verificationData.success) {
      return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 400 });
    }

    const collection = await getCollection("reviews");

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

    console.log(`Inserted review for movie ${movieId} from IP ${ip}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error inserting review:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
