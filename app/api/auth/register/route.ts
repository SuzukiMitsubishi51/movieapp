import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, password]
    );

    return Response.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error?.message || "Registration failed",
      },
      { status: 500 }
    );
  }
}