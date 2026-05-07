"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px",
        background:
          "radial-gradient(circle at top left, #222 0%, #111 40%, #000 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            color: "white",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          🎬 MovieApp
        </Link>

        <Link
          href="/"
          style={{
            color: "white",
            opacity: 0.9,
            textDecoration: "none",
          }}
        >
          Movies
        </Link>

        <Link
          href="/favorites"
          style={{
            color: "white",
            opacity: 0.9,
            textDecoration: "none",
          }}
        >
          Favorites
        </Link>

        <Link
          href="/watched"
          style={{
            color: "white",
            opacity: 0.9,
            textDecoration: "none",
          }}
        >
          Watched
        </Link>

        <Link
          href="/backlog"
          style={{
            color: "white",
            opacity: 0.9,
            textDecoration: "none",
          }}
        >
          Backlog
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        {session?.user ? (
          <>
            <span
              style={{
                color: "white",
                opacity: 0.9,
              }}
            >
              {session.user.email}
            </span>

            <button
              onClick={() => signOut()}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: "#e11d48",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: 10,
                background: "#222",
              }}
            >
              Login
            </Link>

            <Link
              href="/signup"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: 10,
                background: "#444",
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}