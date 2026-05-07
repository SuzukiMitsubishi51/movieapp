import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS backlog (
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
      message: "Backlog table ready",
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to create backlog table" },
      { status: 500 }
    );
  }
}