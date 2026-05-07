export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const apiKey = process.env.OMDB_API_KEY;

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`
    );

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}