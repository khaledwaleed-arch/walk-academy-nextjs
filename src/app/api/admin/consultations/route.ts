import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import { VALID_STATUSES } from "@/lib/validators";

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

  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  if (!VALID_STATUSES.consultations.includes(status)) {
    return NextResponse.json({ error: `Invalid status. Allowed: ${VALID_STATUSES.consultations.join(', ')}` }, { status: 400 });
  }

  const pool = getPool();
  const { rows } = await pool.query("UPDATE consultations SET status=$1 WHERE id=$2 RETURNING *", [status, id]);
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, consultation: rows[0] });
}
