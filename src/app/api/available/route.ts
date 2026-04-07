import { NextResponse } from "next/server";
import { MovieApiResponse } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  try {
    const availableMovies: MovieApiResponse = await fetch(
      `https://my-app.classic-mdb.workers.dev/api/movies?page=${page}`,
      {
        headers: {
          "x-api-key": process.env.MOVIE_API_KEY || "",
        },
        next: { revalidate: 6 * 60 * 60 }, // Revalidate every 6 hours
      }
    ).then((res) => res.json());

    return NextResponse.json(availableMovies);
  } catch (error) {
    console.error("Failed to fetch available movies", error);
    return NextResponse.json({ error: "Failed to fetch available movies" }, { status: 500 });
  }
}