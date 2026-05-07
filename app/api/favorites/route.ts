import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { movie_id, title, poster } = body;

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [session.user.email]
    );

    const user = userResult.rows[0];

    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        movie_id TEXT,
        title TEXT,
        poster TEXT
      )
    `);

    const existing = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1 AND movie_id = $2",
      [user.id, movie_id]
    );

    if (existing.rows.length > 0) {
      return Response.json({
        success: true,
        message: "Already in favorites",
      });
    }

    await pool.query(
      "INSERT INTO favorites (user_id, movie_id, title, poster) VALUES ($1, $2, $3, $4)",
      [user.id, movie_id, title, poster]
    );

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * 🔥 ADD THIS — FIXES YOUR ERROR
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [session.user.email]
    );

    const user = userResult.rows[0];

    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const favorites = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [user.id]
    );

    return Response.json({
      success: true,
      favorites: favorites.rows,
    });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}