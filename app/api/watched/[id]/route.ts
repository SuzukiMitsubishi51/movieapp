import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ FIX
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json({ success: false, error: "Invalid ID" });
    }

    await pool.query("DELETE FROM watched WHERE id = $1", [parsedId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ success: false });
  }
}