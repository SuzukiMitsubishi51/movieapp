import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW() as time");

    return Response.json({
      success: true,
      dbTime: result.rows[0].time,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Database connection failed",
      },
      { status: 500 }
    );
  }
}