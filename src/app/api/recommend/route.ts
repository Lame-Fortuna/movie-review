import { NextResponse } from "next/server";
import movieLists from "@/lib/MovieLists.json";

function getRandomFallbacks(count = 5) {
  const shuffled = movieLists.IMDB35.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function POST(request: Request) {
  const randomClassics = getRandomFallbacks(4);
  return NextResponse.json(randomClassics)

  // try {
  //   const body = await request.json();

  //   const response = await fetch("https://l0w1-movie-reco.hf.space/2", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(body),
  //   });

  //   if (!response.ok) {
  //     throw new Error(`External API failed with status: ${response.status}`);
  //   }

  //   const data = await response.json();
  //   return NextResponse.json(data);

  // } catch (error) {
  //   console.warn("Recommendation API failed, serving 5 random fallback classics.", error);
    
  //   // Randomize everytime there is an error
  //   const randomClassics = getRandomFallbacks(4);

  //   return NextResponse.json({
  //     recommended: randomClassics,
  //     isFallback: true 
  //   });
  // }
}