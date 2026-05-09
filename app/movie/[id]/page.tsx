"use client";

import { useEffect, useState } from "react";
import { use } from "react";

export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [watched, setWatched] = useState(false);
  const [backlog, setBacklog] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(`/api/movie?id=${id}`);
      const data = await res.json();

      setMovie(data);
      setLoading(false);
    }

    fetchMovie();
  }, [id]);

  async function toggleFavorite() {
    if (!movie) return;

    // REMOVE FAVORITE
    if (favorite) {
      const favsRes = await fetch("/api/favorites");
      const favsData = await favsRes.json();

      const existingMovie = favsData.favorites.find(
        (m: any) =>
          m.movie_id === (movie.id || movie.imdbID)
      );

      if (existingMovie) {
        await fetch(`/api/favorites/${existingMovie.id}`, {
          method: "DELETE",
        });
      }

      setFavorite(false);
      return;
    }

    // ADD FAVORITE
    setFavorite(true);

    await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        movie_id: movie.id || movie.imdbID,
        title: movie.title || movie.Title,
        poster: movie.poster || movie.Poster,
      }),
    });
  }

  async function toggleWatched() {
    if (!movie) return;

    const res = await fetch("/api/watched", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        movie_id: movie.id || movie.imdbID,
        title: movie.title || movie.Title,
        poster: movie.poster || movie.Poster,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setWatched(data.watched);
    }
  }

  async function toggleBacklog() {
    if (!movie) return;

    const res = await fetch("/api/backlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        movie_id: movie.id || movie.imdbID,
        title: movie.title || movie.Title,
        poster: movie.poster || movie.Poster,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setBacklog(data.backlog);
    }
  }

  if (loading)
    return <p style={{ padding: 20, color: "white" }}>Loading...</p>;

  if (!movie)
    return <p style={{ padding: 20, color: "white" }}>Movie not found</p>;

  return (
    <main style={{ padding: 30, minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
        <img
          src={movie.poster || movie.Poster}
          alt={movie.title || movie.Title}
          style={{
            width: 300,
            borderRadius: 12,
            objectFit: "cover",
          }}
        />

        <div style={{ maxWidth: 650 }}>
          <h1>{movie.title || movie.Title}</h1>

          <p>
            <strong>Year:</strong> {movie.year || movie.Year}
          </p>

          <p>
            <strong>Genre:</strong> {movie.Genre}
          </p>

          <div style={{ marginTop: 10 }}>
            <strong>Ratings:</strong>

            {movie.Ratings && movie.Ratings.length > 0 ? (
              movie.Ratings.map((r: any, i: number) => {
                const source =
                  r.Source === "Internet Movie Database"
                    ? "IMDb"
                    : r.Source;

                return (
                  <p key={i} style={{ margin: 0 }}>
                    {source}: {r.Value}
                  </p>
                );
              })
            ) : (
              <p style={{ opacity: 0.6 }}>No ratings available</p>
            )}
          </div>

          <p style={{ marginTop: 15 }}>{movie.Plot}</p>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={toggleFavorite}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: favorite ? "#e11d48" : "#333",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {favorite ? "❤️ Favorited" : "❤️ Favorite"}
            </button>

            <button
              onClick={toggleWatched}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: watched ? "#22c55e" : "#333",
                color: "white",
              }}
            >
              {watched ? "✓ Watched" : "Mark Watched"}
            </button>

            <button
              onClick={toggleBacklog}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: backlog ? "#f59e0b" : "#333",
                color: "white",
              }}
            >
              {backlog ? "✓ Backlog" : "+ Backlog"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}