"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setMovies([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);

      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();

      setMovies(data.results || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <main style={{ padding: 30, minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 28 }}>🎬 Movie Search</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        style={{
          padding: 12,
          width: 300,
          borderRadius: 10,
          border: "none",
          outline: "none",
          background: "#1a1a1a",
          color: "white",
          marginTop: 10,
        }}
      />

      {loading && <p style={{ marginTop: 10 }}>Loading...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(170px, 1fr))",
          gap: 22,
          marginTop: 25,
        }}
      >
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <div className="card">
              <div className="imgWrap">
                <img src={movie.poster} alt={movie.title} />
                <div className="overlay" />
              </div>

              <div className="info">
                <p className="title">{movie.title}</p>
                <p className="year">{movie.year}</p>
              </div>

              <style>{`
                .card {
                  cursor: pointer;
                  border-radius: 14px;
                  overflow: hidden;
                  background: #111;
                  transition: 0.25s ease;
                  position: relative;
                  color: white; /* FIX: prevents blue link inheritance */
                  text-decoration: none;
                }

                .card * {
                  color: white !important; /* HARD FIX */
                }

                .card:hover {
                  transform: scale(1.06) translateY(-6px);
                  box-shadow: 0 25px 60px rgba(0,0,0,0.7);
                  z-index: 10;
                }

                .imgWrap {
                  position: relative;
                  height: 260px;
                  overflow: hidden;
                }

                .imgWrap img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }

                .overlay {
                  position: absolute;
                  inset: 0;
                  background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
                  opacity: 0;
                  transition: 0.2s;
                }

                .card:hover .overlay {
                  opacity: 1;
                }

                .info {
                  padding: 10px;
                  background: linear-gradient(135deg,#0a0a0a,#1a1a1a,#000);
                }

                .title {
                  font-weight: 700;
                  font-size: 14px;
                  margin: 0;
                }

                .year {
                  font-size: 12px;
                  opacity: 0.7;
                  margin-top: 4px;
                }
              `}</style>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}