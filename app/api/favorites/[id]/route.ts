import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  await pool.query(
    "DELETE FROM favorites WHERE id = $1",
    [id]
  );

  return NextResponse.json({
    success: true,
  });
}