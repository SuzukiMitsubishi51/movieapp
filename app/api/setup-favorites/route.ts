import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        movie_id TEXT NOT NULL,
        title TEXT,
        poster TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return Response.json({
      success: true,
      message: "Favorites table created",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to create favorites table",
      },
      { status: 500 }
    );
  }
}