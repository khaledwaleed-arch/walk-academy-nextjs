import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT * FROM registrations ORDER BY created_at DESC LIMIT 500"
  );
  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  const pool = getPool();
  await pool.query("UPDATE registrations SET status=$1 WHERE id=$2", [status, id]);
  return NextResponse.json({ ok: true });
}
