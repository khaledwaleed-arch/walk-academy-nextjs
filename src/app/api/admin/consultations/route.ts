import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const pool = getPool();
  const rows = await pool.query(
    `SELECT * FROM consultations
     WHERE name ILIKE $1 OR email ILIKE $1 OR service ILIKE $1 OR company ILIKE $1
     ORDER BY created_at DESC LIMIT 100`,
    [`%${search}%`]
  );
  return NextResponse.json(rows.rows);
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  const pool = getPool();
  await pool.query("UPDATE consultations SET status=$1 WHERE id=$2", [status, id]);
  return NextResponse.json({ ok: true });
}
