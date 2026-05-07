import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { pool } from "@/lib/db";

// GET backlog
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const result = await pool.query(
  "SELECT * FROM backlog WHERE user_id = $1 ORDER BY id DESC",
  [session.user.email]
);

  return Response.json({
    success: true,
    backlog: result.rows,
  });
}

// TOGGLE backlog
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { movie_id, title, poster } = body;

  if (!movie_id) {
    return Response.json({ success: false, error: "Missing movie_id" }, { status: 400 });
  }

  const existing = await pool.query(
    "SELECT * FROM backlog WHERE user_id = $1 AND movie_id = $2",
    [session.user.email, movie_id]
  );

  if (existing.rows.length > 0) {
    await pool.query(
      "DELETE FROM backlog WHERE user_id = $1 AND movie_id = $2",
      [session.user.email, movie_id]
    );

    return Response.json({ success: true, backlog: false });
  }

  await pool.query(
    "INSERT INTO backlog (user_id, movie_id, title, poster) VALUES ($1, $2, $3, $4)",
    [session.user.email, movie_id, title, poster]
  );

  return Response.json({ success: true, backlog: true });
}