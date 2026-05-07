"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavs();
  }, []);

  async function fetchFavs() {
    const res = await fetch("/api/favorites");
    const data = await res.json();

    if (data.success) setFavorites(data.favorites);
    setLoading(false);
  }

  async function removeFromFavorites(id: number) {
    const res = await fetch(`/api/favorites/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      setFavorites((prev) =>
        prev.filter((m) => m.id !== id)
      );
    }
  }

  return (
    <main style={{ padding: 30, color: "#fff" }}>
      <h1>❤️ Favorites</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(170px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {favorites.map((movie) => (
          <div key={movie.id}>
            <Link
              href={`/movie/${movie.movie_id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#111",
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.25s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform =
                    "scale(1)")
                }
              >
                <img
                  src={movie.poster}
                  style={{
                    width: "100%",
                    height: 260,
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <div
                  style={{
                    background: "#0a0a0a",
                    padding: 10,
                    borderTop:
                      "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    {movie.title}
                  </p>
                </div>
              </div>
            </Link>

            {/* REMOVE BUTTON */}
            <button
              onClick={() => removeFromFavorites(movie.id)}
              style={{
                marginTop: 8,
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "none",
                background: "#ef4444",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}