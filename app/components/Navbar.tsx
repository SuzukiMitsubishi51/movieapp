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
        background: "rgba(0,0,0,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <Link href="/" style={{ color: "white", fontWeight: "bold" }}>
          🎬 MovieApp
        </Link>

        <Link href="/" style={{ color: "white", opacity: 0.8 }}>
          Movies
        </Link>

        <Link href="/favorites" style={{ color: "white", opacity: 0.8 }}>
          Favorites
        </Link>

        <Link href="/watched" style={{ color: "white", opacity: 0.8 }}>
          Watched
        </Link>

        <Link href="/backlog" style={{ color: "white", opacity: 0.8 }}>
          Backlog
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {session?.user ? (
          <>
            <span style={{ color: "white", opacity: 0.8 }}>
              {session.user.email}
            </span>

            <button
              onClick={() => signOut()}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "#e11d48",
                color: "white",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" style={{ color: "white" }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}