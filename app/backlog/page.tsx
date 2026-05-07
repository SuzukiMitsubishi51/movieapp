"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BacklogPage() {
  const [backlog, setBacklog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBacklog();
  }, []);

  async function fetchBacklog() {
    const res = await fetch("/api/backlog");
    const data = await res.json();

    if (data.success) setBacklog(data.backlog);
    setLoading(false);
  }

  async function removeFromBacklog(id: number) {
    const res = await fetch(`/api/backlog/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      setBacklog((prev) =>
        prev.filter((movie) => movie.id !== id)
      );
    }
  }

  return (
    <main style={{ padding: 30, color: "#fff" }}>
      <h1>📚 Backlog</h1>

      {loading && <p>Loading...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(170px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {backlog.map((movie) => (
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
                {/* IMAGE */}
                <img
                  src={movie.poster}
                  style={{
                    width: "100%",
                    height: 260,
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* BOTTOM BAR (STANDARDIZED LAYOUT) */}
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
              onClick={() => removeFromBacklog(movie.id)}
              style={{
                marginTop: 8,
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "none",
                background: "#ef4444",
                color: "white",
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