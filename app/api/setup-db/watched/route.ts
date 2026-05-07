import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS watched (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        movie_id TEXT NOT NULL,
        title TEXT,
        poster TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id)
      );
    `);

    return Response.json({
      success: true,
      message: "Watched table ready",
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to create watched table" },
      { status: 500 }
    );
  }
}