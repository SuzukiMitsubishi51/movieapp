import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return Response.json({
      success: true,
      message: "Users table created (or already exists)",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to create users table",
      },
      { status: 500 }
    );
  }
}