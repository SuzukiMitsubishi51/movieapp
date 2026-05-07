import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Missing email or password" },
        { status: 400 }
      );
    }

    // check if user exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return Response.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    // insert user
    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, password]
    );

    return Response.json({
      success: true,
      message: "User created",
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Signup failed" },
      { status: 500 }
    );
  }
}