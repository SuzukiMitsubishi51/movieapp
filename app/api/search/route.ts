import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const apiKey = process.env.OMDB_API_KEY;

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
  );

  const data = await res.json();

  if (data.Response === "False") {
    return NextResponse.json({ results: [] });
  }

  return NextResponse.json({
    results: data.Search.map((movie: any) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    })),
  });
}